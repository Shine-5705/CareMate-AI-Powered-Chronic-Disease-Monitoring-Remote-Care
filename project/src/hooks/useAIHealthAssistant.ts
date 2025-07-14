import { useState, useCallback } from 'react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  language?: string;
}

interface UseAIHealthAssistantReturn {
  messages: Message[];
  isLoading: boolean;
  sendMessage: (message: string, language?: string) => Promise<void>;
  clearMessages: () => void;
  translateMessage: (message: string, targetLanguage: string) => Promise<string>;
  detectLanguage: (text: string) => Promise<string>;
}

export const useAIHealthAssistant = (): UseAIHealthAssistantReturn => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! I\'m CareMate, your AI Health Assistant. I can help you understand your symptoms and provide health guidance in multiple languages. How can I assist you today?',
      timestamp: new Date(),
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = useCallback(async (message: string, language = 'en') => {
    if (!message.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: message,
      timestamp: new Date(),
      language,
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Simulate API call to your backend
      const response = await fetch('/api/ai-health-assistant', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          language,
          chatHistory: messages,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response || 'I apologize, but I encountered an issue. Please try again.',
        timestamp: new Date(),
        language,
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'I\'m sorry, I\'m having trouble connecting right now. Please try again in a moment.',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [messages]);

  const clearMessages = useCallback(() => {
    setMessages([
      {
        id: '1',
        role: 'assistant',
        content: 'Hello! I\'m CareMate, your AI Health Assistant. I can help you understand your symptoms and provide health guidance in multiple languages. How can I assist you today?',
        timestamp: new Date(),
      }
    ]);
  }, []);

  const translateMessage = useCallback(async (message: string, targetLanguage: string): Promise<string> => {
    try {
      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: message,
          targetLanguage,
        }),
      });

      if (!response.ok) {
        throw new Error('Translation failed');
      }

      const data = await response.json();
      return data.translatedText || message;
    } catch (error) {
      console.error('Translation error:', error);
      return message;
    }
  }, []);

  const detectLanguage = useCallback(async (text: string): Promise<string> => {
    try {
      const response = await fetch('/api/detect-language', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        throw new Error('Language detection failed');
      }

      const data = await response.json();
      return data.language || 'en';
    } catch (error) {
      console.error('Language detection error:', error);
      return 'en';
    }
  }, []);

  return {
    messages,
    isLoading,
    sendMessage,
    clearMessages,
    translateMessage,
    detectLanguage,
  };
};