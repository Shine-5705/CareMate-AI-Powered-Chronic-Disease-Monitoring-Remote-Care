from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import time
import requests
import threading
import speech_recognition as sr
from dotenv import load_dotenv
import tempfile
import datetime

# Import skin analysis module
try:
    from skin_analysis import analyze_skin_with_gemini, generate_audio_response
    SKIN_ANALYSIS_AVAILABLE = True
    print("✅ Skin analysis module loaded successfully")
except ImportError as e:
    print(f"⚠️ Skin analysis module not available: {e}")
    SKIN_ANALYSIS_AVAILABLE = False

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)

# API Keys
ASSEMBLYAI_API_KEY = os.getenv("ASSEMBLYAI_API_KEY")
GROQ_API_KEY = os.getenv("GROQ_API_KEY")

print(f"🔑 AssemblyAI API Key: {'✅ Set' if ASSEMBLYAI_API_KEY else '❌ Missing'}")
print(f"🔑 Groq API Key: {'✅ Set' if GROQ_API_KEY else '❌ Missing'}")

if not ASSEMBLYAI_API_KEY or not GROQ_API_KEY:
    print("❌ Missing API keys in .env file!")
    print("Please add your API keys to backend/.env file")

def transcribe_audio_file(audio_data):
    """Transcribe audio using AssemblyAI"""
    if not ASSEMBLYAI_API_KEY:
        raise Exception("AssemblyAI API key not configured")
        
    headers = {'authorization': ASSEMBLYAI_API_KEY}
    
    try:
        # Upload audio
        print("📤 Uploading audio to AssemblyAI...")
        response = requests.post(
            "https://api.assemblyai.com/v2/upload", 
            headers=headers, 
            data=audio_data,
            timeout=30
        )
        response.raise_for_status()
        audio_url = response.json()['upload_url']
        print(f"✅ Audio uploaded: {audio_url}")

        # Request transcription
        print("🎯 Requesting transcription...")
        res = requests.post(
            "https://api.assemblyai.com/v2/transcript",
            headers={
                'authorization': ASSEMBLYAI_API_KEY, 
                'content-type': 'application/json'
            },
            json={'audio_url': audio_url},
            timeout=30
        )
        res.raise_for_status()
        transcript_id = res.json()['id']
        print(f"📝 Transcription ID: {transcript_id}")

        # Poll for completion
        print("⏳ Waiting for transcription...")
        for attempt in range(60):  # Increased attempts
            poll_res = requests.get(
                f"https://api.assemblyai.com/v2/transcript/{transcript_id}",
                headers={'authorization': ASSEMBLYAI_API_KEY},
                timeout=30
            )
            poll_res.raise_for_status()
            result = poll_res.json()
            
            print(f"📊 Status: {result['status']} (attempt {attempt + 1})")
            
            if result['status'] == 'completed':
                print("✅ Transcription completed!")
                return result['text']
            elif result['status'] == 'error':
                raise Exception(f"❌ Transcription failed: {result.get('error', 'Unknown error')}")
            
            time.sleep(2)

        raise Exception("❌ Transcription timed out after 2 minutes")
        
    except requests.exceptions.RequestException as e:
        raise Exception(f"❌ Network error with AssemblyAI: {str(e)}")
    except Exception as e:
        raise Exception(f"❌ AssemblyAI error: {str(e)}")

def call_health_assistant(messages):
    """Call Groq API for health assistance"""
    if not GROQ_API_KEY:
        raise Exception("Groq API key not configured")
        
    GROQ_ENDPOINT = "https://api.groq.com/openai/v1/chat/completions"
    MODEL_NAME = "llama3-70b-8192"

    headers = {
        "Authorization": f"Bearer {GROQ_API_KEY}",
        "Content-Type": "application/json"
    }

    payload = {
        "model": MODEL_NAME,
        "messages": messages,
        "temperature": 0.7,
        "max_tokens": 512,
        "top_p": 0.9
    }

    try:
        print("🤖 Calling Groq API...")
        response = requests.post(GROQ_ENDPOINT, headers=headers, json=payload, timeout=30)
        
        if response.status_code == 401:
            raise Exception("Invalid Groq API key")
        elif response.status_code == 429:
            raise Exception("Groq API rate limit exceeded")
        elif response.status_code >= 500:
            raise Exception("Groq API server error")
            
        response.raise_for_status()
        result = response.json()

        if "choices" in result and result["choices"]:
            ai_response = result["choices"][0]["message"]["content"].strip()
            print("✅ Got response from Groq")
            return ai_response
        elif "error" in result:
            print(f"❌ Groq API error: {result['error']}")
            raise Exception(f"Groq API error: {result['error']}")
        else:
            raise Exception("Invalid response format from Groq")
            
    except requests.exceptions.RequestException as e:
        raise Exception(f"Network error with Groq: {str(e)}")
    except Exception as e:
        raise Exception(f"Groq error: {str(e)}")

def detect_language(text):
    """Simple language detection for Indian languages"""
    if not text:
        return 'en'
        
    # Hindi/Devanagari
    if any('\u0900' <= char <= '\u097F' for char in text):
        return 'hi'
    # Bengali
    elif any('\u0980' <= char <= '\u09FF' for char in text):
        return 'bn'
    # Telugu
    elif any('\u0C00' <= char <= '\u0C7F' for char in text):
        return 'te'
    # Tamil
    elif any('\u0B80' <= char <= '\u0BFF' for char in text):
        return 'ta'
    # Gujarati
    elif any('\u0A80' <= char <= '\u0AFF' for char in text):
        return 'gu'
    # Kannada
    elif any('\u0C80' <= char <= '\u0CFF' for char in text):
        return 'kn'
    # Malayalam
    elif any('\u0D00' <= char <= '\u0D7F' for char in text):
        return 'ml'
    # Punjabi
    elif any('\u0A00' <= char <= '\u0A7F' for char in text):
        return 'pa'
    # Odia
    elif any('\u0B00' <= char <= '\u0B7F' for char in text):
        return 'or'
    # Urdu/Arabic
    elif any('\u0600' <= char <= '\u06FF' for char in text):
        return 'ur'
    else:
        return 'en'

@app.route('/api/health-chat', methods=['POST'])
def health_chat():
    """Main health chat endpoint"""
    try:
        print("💬 Received chat request")
        data = request.json
        message = data.get('message', '').strip()
        language = data.get('language', 'en')
        chat_history = data.get('chatHistory', [])
        
        if not message:
            return jsonify({
                'error': 'Message is required',
                'success': False
            }), 400
        
        print(f"📝 Message: {message}")
        print(f"🌐 Language: {language}")
        
        # Detect language if not provided or auto
        if not language or language == 'auto':
            language = detect_language(message)
            print(f"🔍 Detected language: {language}")
        
        # Prepare system prompt based on language
        language_names = {
            'hi': 'Hindi',
            'en': 'English',
            'bn': 'Bengali',
            'te': 'Telugu',
            'mr': 'Marathi',
            'ta': 'Tamil',
            'gu': 'Gujarati',
            'kn': 'Kannada',
            'ml': 'Malayalam',
            'pa': 'Punjabi',
            'or': 'Odia',
            'as': 'Assamese',
            'ur': 'Urdu',
            'ne': 'Nepali',
            'si': 'Sinhala'
        }
        
        lang_name = language_names.get(language, 'English')
        
        system_prompt = {
            "role": "system",
            "content": f"""You are CareMate, a multilingual AI health assistant focused on helping Indian users understand their symptoms and health concerns.

CRITICAL INSTRUCTIONS:
- Respond ONLY in {lang_name} language
- If the user writes in {lang_name}, respond in {lang_name}
- Provide empathetic, culturally sensitive responses
- Ask follow-up questions to understand symptoms better
- Suggest safe home remedies when appropriate (like hydration, steam inhalation, rest)
- Clearly explain when they should consult a doctor immediately
- Consider Indian healthcare context and accessibility
- Be supportive and understanding of health anxieties

ALWAYS provide:
- Empathetic responses that acknowledge their concerns
- Safe home care suggestions when appropriate
- Clear guidance on when to see a doctor (red flags)
- Cultural sensitivity for Indian healthcare context
- Follow-up questions to better understand their condition

ALWAYS end with: "Would you like me to continue checking your symptoms or do you need help connecting to a doctor?"

Remember: You are not replacing medical diagnosis but helping users understand their symptoms and when to seek professional help."""
        }
        
        # Prepare messages for API
        api_messages = [system_prompt]
        
        # Add recent chat history (last 5 messages to avoid token limits)
        recent_history = chat_history[-10:] if len(chat_history) > 10 else chat_history
        for msg in recent_history:
            if msg.get('role') in ['user', 'assistant']:
                api_messages.append({
                    "role": msg['role'],
                    "content": msg['content']
                })
        
        # Add current user message
        api_messages.append({"role": "user", "content": message})
        
        print(f"📤 Sending {len(api_messages)} messages to Groq")
        
        # Get AI response
        reply = call_health_assistant(api_messages)
        
        print("✅ Successfully got AI response")
        
        return jsonify({
            'response': reply,
            'language': language,
            'success': True,
            'timestamp': datetime.datetime.now().isoformat()
        })
        
    except Exception as e:
        error_msg = str(e)
        print(f"❌ Error in health_chat: {error_msg}")
        
        # Return language-specific error messages
        error_messages = {
            'hi': 'क्षमा करें, मुझे अभी कनेक्ट करने में समस्या हो रही है। कृपया कुछ देर बाद पुनः प्रयास करें।',
            'en': 'Sorry, I\'m having trouble connecting right now. Please try again in a moment.',
            'bn': 'দুঃখিত, আমি এখন সংযোগ করতে সমস্যা হচ্ছে। অনুগ্রহ করে একটু পরে আবার চেষ্টা করুন।',
            'te': 'క్షమించండి, నేను ఇప్పుడు కనెక్ట్ చేయడంలో సమస్య ఎదుర్కొంటున్నాను। దయచేసి కొంత సమయం తర్వాత మళ్లీ ప్రయత్నించండి।'
        }
        
        language = data.get('language', 'en') if 'data' in locals() else 'en'
        error_response = error_messages.get(language, error_messages['en'])
        
        return jsonify({
            'error': error_response,
            'technical_error': error_msg,
            'success': False
        }), 500

@app.route('/api/transcribe', methods=['POST'])
def transcribe_audio():
    """Audio transcription endpoint"""
    try:
        print("🎤 Received transcription request")
        
        if 'audio' not in request.files:
            return jsonify({'error': 'No audio file provided', 'success': False}), 400
        
        audio_file = request.files['audio']
        if audio_file.filename == '':
            return jsonify({'error': 'No audio file selected', 'success': False}), 400
            
        print(f"📁 Audio file: {audio_file.filename}, Size: {len(audio_file.read())} bytes")
        audio_file.seek(0)  # Reset file pointer
        
        audio_data = audio_file.read()
        
        if len(audio_data) == 0:
            return jsonify({'error': 'Empty audio file', 'success': False}), 400
        
        # Transcribe audio
        transcript = transcribe_audio_file(audio_data)
        
        if not transcript or transcript.strip() == '':
            return jsonify({
                'transcript': '',
                'language': 'en',
                'success': True,
                'message': 'No speech detected'
            })
        
        # Detect language
        language = detect_language(transcript)
        
        print(f"✅ Transcription successful: {transcript[:50]}...")
        
        return jsonify({
            'transcript': transcript,
            'language': language,
            'success': True
        })
        
    except Exception as e:
        error_msg = str(e)
        print(f"❌ Transcription error: {error_msg}")
        return jsonify({
            'error': f'Transcription failed: {error_msg}',
            'success': False
        }), 500

@app.route('/api/analyze-skin', methods=['POST'])
def analyze_skin():
    """Enhanced skin analysis endpoint using Google Gemini AI"""
    try:
        print("🔍 Received skin analysis request")
        
        if not SKIN_ANALYSIS_AVAILABLE:
            return jsonify({
                'error': 'Skin analysis service not available',
                'success': False
            }), 503
        
        # Check if image is provided
        if 'image' not in request.files and 'imageData' not in request.json:
            return jsonify({
                'error': 'No image provided',
                'success': False
            }), 400
        
        # Get user language preference
        user_language = request.form.get('language', 'en')
        if request.json:
            user_language = request.json.get('language', 'en')
        
        print(f"🌐 User language: {user_language}")
        
        # Handle image data
        image_data = None
        if 'image' in request.files:
            # Handle file upload
            image_file = request.files['image']
            if image_file.filename == '':
                return jsonify({
                    'error': 'No image file selected',
                    'success': False
                }), 400
            
            image_data = image_file.read()
            print(f"📁 Image file uploaded: {len(image_data)} bytes")
            
        elif request.json and 'imageData' in request.json:
            # Handle base64 image data
            image_data = request.json['imageData']
            print("📷 Base64 image data received")
        
        if not image_data:
            return jsonify({
                'error': 'Invalid image data',
                'success': False
            }), 400
        
        # Analyze with Gemini AI
        print("🧠 Starting Gemini AI analysis...")
        analysis_result = analyze_skin_with_gemini(image_data, user_language)
        
        # Generate audio response if requested
        generate_audio = request.form.get('generateAudio', 'false').lower() == 'true'
        if request.json:
            generate_audio = request.json.get('generateAudio', False)
        
        audio_response = None
        if generate_audio:
            print("🔊 Generating audio response...")
            audio_response = generate_audio_response(analysis_result, user_language)
        
        print("✅ Skin analysis completed successfully")
        
        response_data = {
            'analysis': analysis_result,
            'language': user_language,
            'success': True,
            'timestamp': datetime.datetime.now().isoformat()
        }
        
        if audio_response:
            response_data['audio'] = audio_response
        
        return jsonify(response_data)
        
    except Exception as e:
        error_msg = str(e)
        print(f"❌ Skin analysis error: {error_msg}")
        
        return jsonify({
            'error': f'Skin analysis failed: {error_msg}',
            'success': False
        }), 500

@app.route('/api/detect-language', methods=['POST'])
def detect_lang():
    """Language detection endpoint"""
    try:
        data = request.json
        text = data.get('text', '')
        
        if not text:
            return jsonify({'error': 'Text is required', 'success': False}), 400
        
        language = detect_language(text)
        
        return jsonify({
            'language': language,
            'confidence': 0.9,
            'success': True
        })
        
    except Exception as e:
        return jsonify({
            'error': str(e),
            'success': False
        }), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.datetime.now().isoformat(),
        'apis': {
            'assemblyai': '✅ Configured' if ASSEMBLYAI_API_KEY else '❌ Missing',
            'groq': '✅ Configured' if GROQ_API_KEY else '❌ Missing'
        }
    })

if __name__ == '__main__':
    print("🚀 Starting CareMate Backend Server...")
    print("📍 Server will run on: http://localhost:5000")
    print("🔧 Make sure to set your API keys in backend/.env file")
    app.run(debug=True, port=5000, host='0.0.0.0')