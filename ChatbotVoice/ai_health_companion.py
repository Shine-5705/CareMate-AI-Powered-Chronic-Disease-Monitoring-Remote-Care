import os
import time
import pyttsx3
import datetime
import requests
import threading
import keyboard
import speech_recognition as sr
from dotenv import load_dotenv
from translate import translate_text, detect_language

# === Load API keys ===
load_dotenv()
ASSEMBLYAI_API_KEY = os.getenv("ASSEMBLYAI_API_KEY")
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
if not ASSEMBLYAI_API_KEY or not GROQ_API_KEY:
    raise ValueError("❌ Missing API keys in .env!")

# === Init engine ===
engine = pyttsx3.init()
speech_lock = threading.Lock()

AUDIO_FOLDER = "audio_inputs"
os.makedirs(AUDIO_FOLDER, exist_ok=True)

def speak(text):
    def _speak():
        with speech_lock:
            engine.say(text)
            engine.runAndWait()
    thread = threading.Thread(target=_speak)
    thread.start()
    return thread

def stop_speech():
    with speech_lock:
        engine.stop()

def transcribe_audio_file(filepath):
    headers = {'authorization': ASSEMBLYAI_API_KEY}
    with open(filepath, 'rb') as f:
        response = requests.post("https://api.assemblyai.com/v2/upload", headers=headers, data=f.read())
    response.raise_for_status()
    audio_url = response.json()['upload_url']

    res = requests.post(
        "https://api.assemblyai.com/v2/transcript",
        headers={'authorization': ASSEMBLYAI_API_KEY, 'content-type': 'application/json'},
        json={'audio_url': audio_url}
    )
    transcript_id = res.json()['id']

    for _ in range(30):
        poll_res = requests.get(f"https://api.assemblyai.com/v2/transcript/{transcript_id}",
                                headers={'authorization': ASSEMBLYAI_API_KEY})
        result = poll_res.json()
        if result['status'] == 'completed':
            return result['text']
        elif result['status'] == 'error':
            raise Exception(f"❌ Transcription failed: {result['error']}")
        time.sleep(2)

    raise Exception("❌ Transcription timed out.")

def record_and_transcribe():
    recognizer = sr.Recognizer()
    mic = sr.Microphone(sample_rate=16000)
    with mic as source:
        print("🎤 Adjusting for ambient noise...")
        recognizer.adjust_for_ambient_noise(source, duration=1)
        print("🎤 Listening... (start speaking within 30s, max phrase 60s)")
        try:
            audio = recognizer.listen(source, timeout=30, phrase_time_limit=60)
            print("✅ Voice input received.")
        except sr.WaitTimeoutError:
            raise Exception("⏰ Timeout: No speech detected within 30 seconds.")
    timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
    filename = os.path.join(AUDIO_FOLDER, f"audio_{timestamp}.wav")
    with open(filename, "wb") as f:
        f.write(audio.get_wav_data())
    if os.path.getsize(filename) == 0:
        raise Exception("❌ Error: Recorded audio is empty!")
    return transcribe_audio_file(filename)

def call_health_assistant(messages):
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

    response = requests.post(GROQ_ENDPOINT, headers=headers, json=payload)
    result = response.json()

    if "choices" in result and result["choices"]:
        return result["choices"][0]["message"]["content"].strip()
    elif "error" in result:
        print("Groq API error:", result["error"])
        return "Sorry, there was a problem with the AI model. Please try again later."
    else:
        return "Sorry, I couldn't process that. Please try again later."

# === Main Loop ===
print("CareMate AI Health Companion (Full Chat Analysis Mode)")
print("Say or type 'analyze' to get a solution summary.\n")

chat_history = []

while True:
    try:
        mode = input("Input mode [voice/text]: ").strip().lower()

        if mode == "voice":
            user_input = record_and_transcribe()
        elif mode == "text":
            user_input = input("You: ").strip()
        elif mode in ["exit", "quit"]:
            print("Goodbye! Stay healthy.")
            break
        else:
            print("❓ Invalid input. Use 'voice' or 'text'.")
            continue

        if user_input.lower() in ["exit", "quit"]:
            print("Goodbye! Stay healthy.")
            break

        user_lang = detect_language(user_input)
        translated_input = translate_text(user_input, target_lang='en')

        # Add to chat history
        chat_history.append({"role": "user", "content": translated_input})

        # Prepare messages
        system_prompt = {
            "role": "system",
            "content": (
                "You are CareMate, a multilingual AI health assistant focused on helping Indian users understand their symptoms.\n\n"
                "Ask follow-up questions, suggest safe home remedies (like hydration, steam inhalation), and clearly explain when they should consult a doctor.\n\n"
                "When the user says 'analyze' or after enough information is collected, summarize the case and provide:\n"
                "- A short summary of symptoms\n"
                "- Possible causes (but no diagnosis)\n"
                "- Safe home care suggestions\n"
                "- Warning signs for seeing a doctor\n\n"
                "Always end with: 'Would you like me to continue checking your symptoms or connect you to a doctor?'"
            )
        }

        messages = [system_prompt] + chat_history

        # Check if user asked for analysis
        if user_input.lower() == "analyze" or len(chat_history) >= 5:
            messages.append({
                "role": "system",
                "content": "Now summarize the conversation so far as a health assistant and provide advice as per instructions."
            })

        # Get AI response
        reply = call_health_assistant(messages)

        # Add AI reply to chat history
        chat_history.append({"role": "assistant", "content": reply})

        # Translate back to user's language
        localized_reply = translate_text(reply, target_lang=user_lang)

        print(f"\nCareMate: {localized_reply}\n")

        # Speak output
        stop_speech()
        thread = speak(localized_reply)
        print("Press 's' to stop voice output early...")

        while thread.is_alive():
            if keyboard.is_pressed("s"):
                stop_speech()
                print("Voice output stopped.")
                break
            time.sleep(0.1)

    except Exception as e:
        print(f"❌ Error: {e}")
