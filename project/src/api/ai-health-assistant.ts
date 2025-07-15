// API integration for AI Health Assistant with Grok and AssemblyAI
import { API_KEYS, getApiKey } from '../config/apiKeys';

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface AIHealthAssistantRequest {
  message: string;
  language: string;
  chatHistory: ChatMessage[];
}

export interface AIHealthAssistantResponse {
  response: string;
  language: string;
  confidence?: number;
}

export interface TranslationRequest {
  text: string;
  targetLanguage: string;
  sourceLanguage?: string;
}

export interface TranslationResponse {
  translatedText: string;
  detectedLanguage?: string;
}

export interface LanguageDetectionRequest {
  text: string;
}

export interface LanguageDetectionResponse {
  language: string;
  confidence: number;
}

// AI Health Assistant API using Grok
export const sendMessageToAI = async (request: AIHealthAssistantRequest): Promise<AIHealthAssistantResponse> => {
  try {
    // Call Groq API directly from frontend
    const grokApiKey = import.meta.env.VITE_GROK_API_KEY || process.env.REACT_APP_GROK_API_KEY;
    
    if (!grokApiKey) {
      throw new Error('Groq API key not configured');
    }

    // Prepare system prompt based on language
    const languageNames = {
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
    };
    
    const langName = languageNames[request.language as keyof typeof languageNames] || 'English';
    
    const systemPrompt = {
      "role": "system",
      "content": `You are CareMate, a multilingual AI health assistant focused on helping Indian users understand their symptoms and health concerns.

CRITICAL INSTRUCTIONS:
- Respond ONLY in ${langName} language
- If the user writes in ${langName}, respond in ${langName}
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

Remember: You are not replacing medical diagnosis but helping users understand their symptoms and when to seek professional help.`
    };
    
    // Prepare messages for API
    const apiMessages = [systemPrompt];
    
    // Add recent chat history (last 5 messages to avoid token limits)
    const recentHistory = request.chatHistory.slice(-10);
    for (const msg of recentHistory) {
      if (msg.role === 'user' || msg.role === 'assistant') {
        apiMessages.push({
          "role": msg.role,
          "content": msg.content
        });
      }
    }
    
    // Add current user message
    apiMessages.push({"role": "user", "content": request.message});

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${grokApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama3-70b-8192',
        messages: apiMessages,
        temperature: 0.7,
        max_tokens: 512,
        top_p: 0.9
      }),
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Invalid Groq API key');
      } else if (response.status === 429) {
        throw new Error('Groq API rate limit exceeded');
      } else if (response.status >= 500) {
        throw new Error('Groq API server error');
      }
      throw new Error(`Groq API error! status: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.choices && data.choices.length > 0) {
      const aiResponse = data.choices[0].message.content.trim();
      return {
        response: aiResponse,
        language: request.language,
        confidence: 0.9,
      };
    } else if (data.error) {
      throw new Error(`Groq API error: ${data.error}`);
    } else {
      throw new Error('Invalid response format from Groq');
    }
  } catch (error) {
    console.error('Groq API error:', error);
    
    // Fallback response based on language
    const errorMessages = {
      'hi': 'क्षमा करें, मुझे अभी कनेक्ट करने में समस्या हो रही है। कृपया कुछ देर बाद पुनः प्रयास करें।',
      'en': 'Sorry, I\'m having trouble connecting right now. Please try again in a moment.',
      'bn': 'দুঃখিত, আমি এখন সংযোগ করতে সমস্যা হচ্ছে। অনুগ্রহ করে একটু পরে আবার চেষ্টা করুন।',
      'te': 'క్షమించండి, నేను ఇప్పుడు కనెక్ట్ చేయడంలో సమస్య ఎదుర్కొంటున్నాను. దయచేసి కొంత సమయం తర్వాత మళ్లీ ప్రయత్నించండి।'
    };
    
    const errorResponse = errorMessages[request.language as keyof typeof errorMessages] || errorMessages['hi'];
    
    return {
      response: errorResponse,
      language: request.language,
      confidence: 0.5,
    };
  }
};

// Translation API (you can use Google Translate or other services)
export const translateText = async (request: TranslationRequest): Promise<TranslationResponse> => {
  try {
    // This is a placeholder - you would integrate with Google Translate API or similar
    const response = await fetch('/api/translate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Translation API error:', error);
    throw new Error('Failed to translate text');
  }
};

// Voice transcription using AssemblyAI
export const transcribeAudio = async (audioBlob: Blob, language: string = 'hi'): Promise<string> => {
  try {
    const assemblyAiKey = import.meta.env.VITE_ASSEMBLY_AI_API_KEY || process.env.REACT_APP_ASSEMBLY_AI_API_KEY;
    
    if (!assemblyAiKey) {
      throw new Error('AssemblyAI API key not configured');
    }

    // First, upload the audio file
    const uploadResponse = await fetch('https://api.assemblyai.com/v2/upload', {
      method: 'POST',
      headers: {
        'authorization': assemblyAiKey,
      },
      body: audioBlob,
    });

    if (!uploadResponse.ok) {
      throw new Error(`Upload failed! status: ${uploadResponse.status}`);
    }

    const uploadData = await uploadResponse.json();
    const audioUrl = uploadData.upload_url;

    // Request transcription
    const transcriptResponse = await fetch('https://api.assemblyai.com/v2/transcript', {
      method: 'POST',
      headers: {
        'authorization': assemblyAiKey,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        audio_url: audioUrl,
        language_code: language === 'hi' ? 'hi' : 'en',
      }),
    });

    if (!transcriptResponse.ok) {
      throw new Error(`Transcription request failed! status: ${transcriptResponse.status}`);
    }

    const transcriptData = await transcriptResponse.json();
    const transcriptId = transcriptData.id;

    // Poll for completion
    let attempts = 0;
    const maxAttempts = 60;
    
    while (attempts < maxAttempts) {
      const pollResponse = await fetch(`https://api.assemblyai.com/v2/transcript/${transcriptId}`, {
        headers: {
          'authorization': assemblyAiKey,
        },
      });

      if (!pollResponse.ok) {
        throw new Error(`Polling failed! status: ${pollResponse.status}`);
      }

      const result = await pollResponse.json();
      
      if (result.status === 'completed') {
        return result.text || '';
      } else if (result.status === 'error') {
        throw new Error(`Transcription failed: ${result.error || 'Unknown error'}`);
      }
      
      // Wait 2 seconds before next poll
      await new Promise(resolve => setTimeout(resolve, 2000));
      attempts++;
    }
    
    throw new Error('Transcription timed out');
  } catch (error) {
    console.error('Transcription error:', error);
    throw new Error('Failed to transcribe audio');
  }
};

// Simple language detection for Indian languages
export const detectLanguageFromText = (text: string): string => {
  if (!text) return 'en';
  
  // Hindi/Devanagari
  if (/[\u0900-\u097F]/.test(text)) {
    return 'hi';
  }
  // Bengali
  else if (/[\u0980-\u09FF]/.test(text)) {
    return 'bn';
  }
  // Telugu
  else if (/[\u0C00-\u0C7F]/.test(text)) {
    return 'te';
  }
  // Tamil
  else if (/[\u0B80-\u0BFF]/.test(text)) {
    return 'ta';
  }
  // Gujarati
  else if (/[\u0A80-\u0AFF]/.test(text)) {
    return 'gu';
  }
  // Kannada
  else if (/[\u0C80-\u0CFF]/.test(text)) {
    return 'kn';
  }
  // Malayalam
  else if (/[\u0D00-\u0D7F]/.test(text)) {
    return 'ml';
  }
  // Punjabi
  else if (/[\u0A00-\u0A7F]/.test(text)) {
    return 'pa';
  }
  // Odia
  else if (/[\u0B00-\u0B7F]/.test(text)) {
    return 'or';
  }
  // Urdu/Arabic
  else if (/[\u0600-\u06FF]/.test(text)) {
    return 'ur';
  }
  else {
    return 'en';
  }
};

// Enhanced detect language API
export const detectLanguage = async (request: LanguageDetectionRequest): Promise<LanguageDetectionResponse> => {
  try {
    const language = detectLanguageFromText(request.text);
    return {
      language,
      confidence: 0.9,
    };
  } catch (error) {
    console.error('Language detection error:', error);
    return {
      language: 'en',
      confidence: 0.5,
    };
  }
};

// Text-to-speech for Indian languages
export const speakText = async (text: string, language: string = 'hi'): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (!('speechSynthesis' in window)) {
      reject(new Error('Speech synthesis not supported'));
      return;
    }

    // Cancel any ongoing speech
    speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Set language for speech synthesis
    const langMap: { [key: string]: string } = {
      'hi': 'hi-IN',
      'en': 'en-IN',
      'bn': 'bn-IN',
      'te': 'te-IN',
      'mr': 'mr-IN',
      'ta': 'ta-IN',
      'gu': 'gu-IN',
      'kn': 'kn-IN',
      'ml': 'ml-IN',
      'pa': 'pa-IN',
      'ur': 'ur-IN',
      'or': 'or-IN',
      'as': 'as-IN',
      'ne': 'ne-NP',
      'si': 'si-LK',
    };
    
    utterance.lang = langMap[language] || 'hi-IN';
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 1;

    utterance.onend = () => resolve();
    utterance.onerror = (event) => reject(new Error(`Speech synthesis error: ${event.error}`));

    speechSynthesis.speak(utterance);
  });
};

// Stop speech synthesis
export const stopSpeaking = (): void => {
  if ('speechSynthesis' in window) {
    speechSynthesis.cancel();
  }
};

// Check if speech synthesis is speaking
export const isSpeaking = (): boolean => {
  return 'speechSynthesis' in window ? speechSynthesis.speaking : false;
};

// Get available voices for Indian languages
export const getIndianVoices = (): SpeechSynthesisVoice[] => {
  if (!('speechSynthesis' in window)) {
    return [];
  }
  
  const voices = speechSynthesis.getVoices();
  return voices.filter(voice => 
    voice.lang.includes('IN') || 
    voice.lang.includes('hi') || 
    voice.lang.includes('bn') || 
    voice.lang.includes('te') || 
    voice.lang.includes('ta') || 
    voice.lang.includes('gu') || 
    voice.lang.includes('kn') || 
    voice.lang.includes('ml') || 
    voice.lang.includes('pa') || 
    voice.lang.includes('ur')
  );
};

// Enhanced voice input with better error handling
export const startVoiceInput = (
  language: string = 'hi',
  onResult: (transcript: string) => void,
  onError: (error: string) => void
): boolean => {
  if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
    onError('Speech recognition not supported in this browser');
    return false;
  }

  const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
  const recognition = new SpeechRecognition();
  
  // Set language for speech recognition
  const langMap: { [key: string]: string } = {
    'hi': 'hi-IN',
    'en': 'en-IN',
    'bn': 'bn-IN',
    'te': 'te-IN',
    'mr': 'mr-IN',
    'ta': 'ta-IN',
    'gu': 'gu-IN',
    'kn': 'kn-IN',
    'ml': 'ml-IN',
    'pa': 'pa-IN',
    'ur': 'ur-IN',
    'or': 'or-IN',
    'as': 'as-IN',
    'ne': 'ne-NP',
    'si': 'si-LK',
  };
  
  recognition.lang = langMap[language] || 'hi-IN';
  recognition.continuous = false;
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  recognition.onresult = (event: any) => {
    const transcript = event.results[0][0].transcript;
    onResult(transcript);
  };

  recognition.onerror = (event: any) => {
    onError(`Speech recognition error: ${event.error}`);
  };

  try {
    recognition.start();
    return true;
  } catch (error) {
    onError('Failed to start speech recognition');
    return false;
  }
};