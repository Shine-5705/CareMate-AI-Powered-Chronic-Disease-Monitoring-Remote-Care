// Speech utilities for the AI Health Assistant

// Enhanced speech manager with better Indian language support
export class SpeechManager {
  private recognition: any = null;
  private synthesis: SpeechSynthesis;
  private isListening: boolean = false;
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];

  constructor() {
    this.synthesis = window.speechSynthesis;
    this.initializeSpeechRecognition();
  }

  private initializeSpeechRecognition() {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = false;
      this.recognition.interimResults = false;
      this.recognition.maxAlternatives = 1;
    }
  }

  // Enhanced voice input with better quality recording
  public async startAdvancedListening(
    language: string = 'hi-IN',
    onResult: (transcript: string) => void,
    onError: (error: string) => void
  ): Promise<boolean> {
    try {
      // Try to use MediaRecorder for better quality
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          sampleRate: 16000,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
        }
      });
      
      this.mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });
      
      this.audioChunks = [];
      
      this.mediaRecorder.ondataavailable = (event) => {
        this.audioChunks.push(event.data);
      };
      
      this.mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });
        try {
          // Send to backend for transcription
          const transcript = await this.transcribeWithBackend(audioBlob, language);
          onResult(transcript);
        } catch (error) {
          onError(`Transcription failed: ${error}`);
        }
        
        // Clean up
        stream.getTracks().forEach(track => track.stop());
        this.isListening = false;
      };
      
      this.mediaRecorder.start();
      this.isListening = true;
      
      // Auto-stop after 30 seconds
      setTimeout(() => {
        if (this.mediaRecorder && this.mediaRecorder.state === 'recording') {
          this.mediaRecorder.stop();
        }
      }, 30000);
      
      return true;
    } catch (error) {
      // Fallback to browser speech recognition
      return this.startListening(language, onResult, onError);
    }
  }
  
  private async transcribeWithBackend(audioBlob: Blob, language: string): Promise<string> {
    const formData = new FormData();
    formData.append('audio', audioBlob, 'audio.webm');
    formData.append('language', language);
    
    const response = await fetch('http://localhost:5000/api/transcribe', {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    const data = await response.json();
    if (!data.success) {
      throw new Error(data.error || 'Transcription failed');
    }
    
    return data.transcript || '';
  }
  public startListening(
    language: string = 'en-US',
    onResult: (transcript: string) => void,
    onError: (error: string) => void
  ): boolean {
    if (!this.recognition) {
      onError('Speech recognition not supported');
      return false;
    }

    if (this.isListening) {
      this.stopListening();
    }

    this.recognition.lang = this.getLanguageCode(language);
    
    this.recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      onResult(transcript);
      this.isListening = false;
    };

    this.recognition.onerror = (event: any) => {
      onError(`Speech recognition error: ${event.error}`);
      this.isListening = false;
    };

    this.recognition.onend = () => {
      this.isListening = false;
    };

    try {
      this.recognition.start();
      this.isListening = true;
      return true;
    } catch (error) {
      onError('Failed to start speech recognition');
      return false;
    }
  }

  public stopListening(): void {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      this.isListening = false;
    }
    
    if (this.mediaRecorder && this.mediaRecorder.state === 'recording') {
      this.mediaRecorder.stop();
    }
  }

  public speak(
    text: string,
    language: string = 'en-US',
    options: {
      rate?: number;
      pitch?: number;
      volume?: number;
    } = {}
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.synthesis) {
        reject(new Error('Speech synthesis not supported'));
        return;
      }

      // Cancel any ongoing speech
      this.synthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = this.getLanguageCode(language);
      utterance.rate = options.rate || 0.9;
      utterance.pitch = options.pitch || 1;
      utterance.volume = options.volume || 1;

      utterance.onend = () => resolve();
      utterance.onerror = (event) => reject(new Error(`Speech synthesis error: ${event.error}`));

      this.synthesis.speak(utterance);
    });
  }

  public stopSpeaking(): void {
    if (this.synthesis) {
      this.synthesis.cancel();
    }
  }

  public isSpeaking(): boolean {
    return this.synthesis ? this.synthesis.speaking : false;
  }

  public isListeningActive(): boolean {
    return this.isListening;
  }

  private getLanguageCode(language: string): string {
    const languageMap: { [key: string]: string } = {
      'en': 'en-US',
      'hi': 'hi-IN',
      'bn': 'bn-IN',
      'te': 'te-IN',
      'mr': 'mr-IN',
      'ta': 'ta-IN',
      'gu': 'gu-IN',
      'kn': 'kn-IN',
      'ml': 'ml-IN',
      'pa': 'pa-IN',
      'or': 'or-IN',
      'as': 'as-IN',
      'ur': 'ur-IN',
      'ne': 'ne-NP',
      'si': 'si-LK',
    };

    return languageMap[language] || language;
  }

  public getAvailableVoices(): SpeechSynthesisVoice[] {
    return this.synthesis ? this.synthesis.getVoices() : [];
  }

  public getVoiceForLanguage(language: string): SpeechSynthesisVoice | null {
    const voices = this.getAvailableVoices();
    const langCode = this.getLanguageCode(language);
    
    return voices.find(voice => voice.lang === langCode) || 
           voices.find(voice => voice.lang.startsWith(language)) || 
           null;
  }
}

// Singleton instance
export const speechManager = new SpeechManager();

// Utility functions
export const playNotificationSound = () => {
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  oscillator.frequency.value = 800;
  oscillator.type = 'sine';

  gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + 0.5);
};

export const formatSpeechText = (text: string): string => {
  // Clean up text for better speech synthesis
  return text
    .replace(/[*_~`]/g, '') // Remove markdown formatting
    .replace(/\n+/g, '. ') // Replace line breaks with pauses
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim();
};

// Get appropriate voice for Indian languages
export const getIndianVoice = (language: string): SpeechSynthesisVoice | null => {
  const voices = speechSynthesis.getVoices();
  const langCode = language.includes('-') ? language : `${language}-IN`;
  
  // Try to find Indian voice first
  let voice = voices.find(v => v.lang === langCode && v.name.includes('India'));
  
  // Fallback to any voice with the language code
  if (!voice) {
    voice = voices.find(v => v.lang === langCode);
  }
  
  // Final fallback to any voice starting with the language
  if (!voice) {
    voice = voices.find(v => v.lang.startsWith(language.split('-')[0]));
  }
  
  return voice || null;
};