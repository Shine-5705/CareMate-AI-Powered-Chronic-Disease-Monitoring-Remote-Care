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
    // Call the Python backend API
    const response = await fetch('http://localhost:5000/api/health-chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: request.message,
        language: request.language,
        chatHistory: request.chatHistory,
      }),
    });

    if (!response.ok) {
      throw new Error(`Backend API error! status: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Unknown error');
    }
    
    return {
      response: data.response || 'मुझे खुशी है कि आपने पूछा। कृपया अपना प्रश्न दोबारा पूछें।',
      language: request.language,
      confidence: 0.9,
    };
  } catch (error) {
    console.error('Backend API error:', error);
    
    // Fallback response in Hindi
    return {
      response: 'क्षमा करें, मुझे अभी कनेक्ट करने में समस्या हो रही है। कृपया कुछ देर बाद पुनः प्रयास करें।',
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

// Language Detection API
export const detectLanguage = async (request: LanguageDetectionRequest): Promise<LanguageDetectionResponse> => {
  try {
    // Simple language detection based on script/characters
    const text = request.text;
    
    // Hindi/Devanagari
    if (/[\u0900-\u097F]/.test(text)) {
      return { language: 'hi', confidence: 0.9 };
    }
    
    // Bengali
    if (/[\u0980-\u09FF]/.test(text)) {
      return { language: 'bn', confidence: 0.9 };
    }
    
    // Telugu
    if (/[\u0C00-\u0C7F]/.test(text)) {
      return { language: 'te', confidence: 0.9 };
    }
    
    // Tamil
    if (/[\u0B80-\u0BFF]/.test(text)) {
      return { language: 'ta', confidence: 0.9 };
    }
    
    // Gujarati
    if (/[\u0A80-\u0AFF]/.test(text)) {
      return { language: 'gu', confidence: 0.9 };
    }
    
    // Kannada
    if (/[\u0C80-\u0CFF]/.test(text)) {
      return { language: 'kn', confidence: 0.9 };
    }
    
    // Malayalam
    if (/[\u0D00-\u0D7F]/.test(text)) {
      return { language: 'ml', confidence: 0.9 };
    }
    
    // Punjabi
    if (/[\u0A00-\u0A7F]/.test(text)) {
      return { language: 'pa', confidence: 0.9 };
    }
    
    // Odia
    if (/[\u0B00-\u0B7F]/.test(text)) {
      return { language: 'or', confidence: 0.9 };
    }
    
    // Assamese (similar to Bengali script)
    if (/[\u0980-\u09FF]/.test(text)) {
      return { language: 'as', confidence: 0.8 };
    }
    
    // Urdu/Arabic script
    if (/[\u0600-\u06FF]/.test(text)) {
      return { language: 'ur', confidence: 0.9 };
    }
    
    // Default to English
    return { language: 'en', confidence: 0.7 };
  } catch (error) {
    console.error('Language detection error:', error);
    return { language: 'en', confidence: 0.5 };
  }
};

// Voice transcription using AssemblyAI
export const transcribeAudio = async (audioBlob: Blob, language: string = 'hi'): Promise<string> => {
  try {
    const formData = new FormData();
    formData.append('audio', audioBlob, 'audio.wav');
    
    const response = await fetch('http://localhost:5000/api/transcribe', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Transcription failed! status: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Transcription failed');
    }

    return data.transcript || '';
  } catch (error) {
    console.error('Transcription error:', error);
    throw new Error('Failed to transcribe audio');
  }
};