import React, { useState, useRef, useEffect } from 'react';
import { 
  MessageCircle, 
  X, 
  Send, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Globe,
  Bot,
  User,
  Minimize2,
  Maximize2,
  RefreshCw,
  Square,
  Play
} from 'lucide-react';
import Button from '../common/Button';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  language?: string;
}

interface AIHealthAssistantProps {
  isOpen: boolean;
  onToggle: () => void;
}

const AIHealthAssistant: React.FC<AIHealthAssistantProps> = ({ isOpen, onToggle }) => {
  const [selectedLanguage, setSelectedLanguage] = useState('hi');
  const [messages, setMessages] = useState<Message[]>([]);
  
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [voiceInputEnabled, setVoiceInputEnabled] = useState(true);
  const [autoSpeak, setAutoSpeak] = useState(true);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // All Indian languages supported
  const languages = [
    { code: 'hi', name: 'हिंदी', flag: '🇮🇳', greeting: 'नमस्ते! मैं CareMate हूं, आपका AI स्वास्थ्य सहायक। मैं आपके स्वास्थ्य संबंधी प्रश्नों का उत्तर दे सकता हूं। आज मैं आपकी कैसे सहायता कर सकूं?' },
    { code: 'en', name: 'English', flag: '🇮🇳', greeting: 'Hello! I am CareMate, your AI Health Assistant. I can help answer your health-related questions. How can I assist you today?' },
    { code: 'bn', name: 'বাংলা', flag: '🇮🇳', greeting: 'নমস্কার! আমি CareMate, আপনার AI স্বাস্থ্য সহায়ক। আমি আপনার স্বাস্থ্য সম্পর্কিত প্রশ্নের উত্তর দিতে পারি। আজ আমি আপনাকে কীভাবে সাহায্য করতে পারি?' },
    { code: 'te', name: 'తెలుగు', flag: '🇮🇳', greeting: 'నమస్కారం! నేను CareMate, మీ AI ఆరోగ్య సహాయకుడిని। నేను మీ ఆరోగ్య సంబంధిత ప్రశ్నలకు సమాధానం ఇవ్వగలను. ఈరోజు నేను మీకు ఎలా సహాయం చేయగలను?' },
    { code: 'mr', name: 'मराठी', flag: '🇮🇳', greeting: 'नमस्कार! मी CareMate आहे, तुमचा AI आरोग्य सहाय्यक. मी तुमच्या आरोग्य संबंधी प्रश्नांची उत्तरे देऊ शकतो. आज मी तुम्हाला कशी मदत करू शकतो?' },
    { code: 'ta', name: 'தமிழ்', flag: '🇮🇳', greeting: 'வணக்கம்! நான் CareMate, உங்கள் AI சுகாதார உதவியாளர். உங்கள் சுகாதார தொடர்பான கேள்விகளுக்கு என்னால் பதிலளிக்க முடியும். இன்று நான் உங்களுக்கு எப்படி உதவ முடியும்?' },
    { code: 'gu', name: 'ગુજરાતી', flag: '🇮🇳', greeting: 'નમસ્તે! હું CareMate છું, તમારો AI આરોગ્ય સહાયક. હું તમારા આરોગ્ય સંબંધિત પ્રશ્નોના જવાબ આપી શકું છું. આજે હું તમારી કેવી રીતે મદદ કરી શકું?' },
    { code: 'kn', name: 'ಕನ್ನಡ', flag: '🇮🇳', greeting: 'ನಮಸ್ಕಾರ! ನಾನು CareMate, ನಿಮ್ಮ AI ಆರೋಗ್ಯ ಸಹಾಯಕ. ನಿಮ್ಮ ಆರೋಗ್ಯ ಸಂಬಂಧಿತ ಪ್ರಶ್ನೆಗಳಿಗೆ ನಾನು ಉತ್ತರಿಸಬಲ್ಲೆ. ಇಂದು ನಾನು ನಿಮಗೆ ಹೇಗೆ ಸಹಾಯ ಮಾಡಬಹುದು?' },
    { code: 'ml', name: 'മലയാളം', flag: '🇮🇳', greeting: 'നമസ്കാരം! ഞാൻ CareMate ആണ്, നിങ്ങളുടെ AI ആരോഗ്യ സഹായി. നിങ്ങളുടെ ആരോഗ്യ സംബന്ധിയായ ചോദ്യങ്ങൾക്ക് എനിക്ക് ഉത്തരം നൽകാൻ കഴിയും. ഇന്ന് ഞാൻ നിങ്ങളെ എങ്ങനെ സഹായിക്കാം?' },
    { code: 'pa', name: 'ਪੰਜਾਬੀ', flag: '🇮🇳', greeting: 'ਸਤ ਸ੍ਰੀ ਅਕਾਲ! ਮੈਂ CareMate ਹਾਂ, ਤੁਹਾਡਾ AI ਸਿਹਤ ਸਹਾਇਕ। ਮੈਂ ਤੁਹਾਡੇ ਸਿਹਤ ਸੰਬੰਧੀ ਸਵਾਲਾਂ ਦੇ ਜਵਾਬ ਦੇ ਸਕਦਾ ਹਾਂ। ਅੱਜ ਮੈਂ ਤੁਹਾਡੀ ਕਿਵੇਂ ਮਦਦ ਕਰ ਸਕਦਾ ਹਾਂ?' },
    { code: 'or', name: 'ଓଡ଼ିଆ', flag: '🇮🇳', greeting: 'ନମସ୍କାର! ମୁଁ CareMate, ଆପଣଙ୍କର AI ସ୍ୱାସ୍ଥ୍ୟ ସହାୟକ। ମୁଁ ଆପଣଙ୍କର ସ୍ୱାସ୍ଥ୍ୟ ସମ୍ବନ୍ଧୀୟ ପ୍ରଶ୍ନର ଉତ୍ତର ଦେଇପାରିବି। ଆଜି ମୁଁ ଆପଣଙ୍କୁ କିପରି ସାହାଯ୍ୟ କରିପାରିବି?' },
    { code: 'as', name: 'অসমীয়া', flag: '🇮🇳', greeting: 'নমস্কাৰ! মই CareMate, আপোনাৰ AI স্বাস্থ্য সহায়ক। মই আপোনাৰ স্বাস্থ্য সম্পৰ্কীয় প্ৰশ্নৰ উত্তৰ দিব পাৰোঁ। আজি মই আপোনাক কেনেকৈ সহায় কৰিব পাৰোঁ?' },
    { code: 'ur', name: 'اردو', flag: '🇮🇳', greeting: 'السلام علیکم! میں CareMate ہوں، آپ کا AI صحت معاون۔ میں آپ کے صحت سے متعلق سوالات کا جواب دے سکتا ہوں۔ آج میں آپ کی کیسے مدد کر سکتا ہوں؟' },
    { code: 'sa', name: 'संस्कृत', flag: '🇮🇳', greeting: 'नमस्ते! अहं CareMate अस्मि, भवतः AI स्वास्थ्य सहायकः। अहं भवतः स्वास्थ्य सम्बन्धिनां प्रश्नानां उत्तराणि दातुं शक्नोमि। अद्य अहं भवन्तं कथं साहाय्यं कर्तुं शक्नोमि?' },
    { code: 'ne', name: 'नेपाली', flag: '🇳🇵', greeting: 'नमस्ते! म CareMate हुँ, तपाईंको AI स्वास्थ्य सहायक। म तपाईंका स्वास्थ्य सम्बन्धी प्रश्नहरूको जवाफ दिन सक्छु। आज म तपाईंलाई कसरी सहायता गर्न सक्छु?' },
    { code: 'si', name: 'සිංහල', flag: '🇱🇰', greeting: 'ආයුබෝවන්! මම CareMate, ඔබේ AI සෞඛ්‍ය සහායක. මට ඔබේ සෞඛ්‍ය සම්බන්ධ ප්‍රශ්නවලට පිළිතුරු දිය හැකිය. අද මම ඔබට කෙසේ උදව් කළ හැකිද?' },
  ];

  // Initialize messages with greeting in selected language
  useEffect(() => {
    const currentLang = languages.find(lang => lang.code === selectedLanguage);
    const greeting = currentLang?.greeting || languages[0].greeting;
    
    setMessages([{
      id: '1',
      role: 'assistant',
      content: greeting,
      timestamp: new Date(),
      language: selectedLanguage,
    }]);
  }, [selectedLanguage]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Initialize speech recognition if available
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      
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
      
      recognitionRef.current.lang = langMap[selectedLanguage] || 'hi-IN';

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputMessage(transcript);
        setIsListening(false);
      };

      recognitionRef.current.onerror = (error: any) => {
        console.error('Speech recognition error:', error);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, [selectedLanguage]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputMessage,
      timestamp: new Date(),
      language: selectedLanguage,
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Call your backend API with Grok integration
      const response = await fetch('http://localhost:5000/api/health-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: inputMessage,
          language: selectedLanguage,
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
        content: data.response || getErrorMessage(selectedLanguage),
        timestamp: new Date(),
        language: selectedLanguage,
      };

      setMessages(prev => [...prev, assistantMessage]);

      // Auto-speak response if enabled
      if (autoSpeak) {
        speakText(assistantMessage.content);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: getErrorMessage(selectedLanguage),
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const getErrorMessage = (language: string): string => {
    const errorMessages: { [key: string]: string } = {
      'hi': 'क्षमा करें, मुझे अभी कनेक्ट करने में समस्या हो रही है। कृपया कुछ देर बाद पुनः प्रयास करें।',
      'en': 'Sorry, I\'m having trouble connecting right now. Please try again in a moment.',
      'bn': 'দুঃখিত, আমি এখন সংযোগ করতে সমস্যা হচ্ছে। অনুগ্রহ করে একটু পরে আবার চেষ্টা করুন।',
      'te': 'క్షమించండి, నేను ఇప్పుడు కనెక్ట్ చేయడంలో సమస్య ఎదుర్కొంటున్నాను. దయచేసి కొంత సమయం తర్వాత మళ్లీ ప్రయత్నించండి।',
      'mr': 'माफ करा, मला आत्ता कनेक्ट करण्यात अडचण येत आहे. कृपया थोड्या वेळाने पुन्हा प्रयत्न करा.',
      'ta': 'மன்னிக்கவும், எனக்கு இப்போது இணைக்க சிக்கல் உள்ளது. தயவுசெய்து சிறிது நேரம் கழித்து மீண்டும் முயற்சிக்கவும்.',
      'gu': 'માફ કરશો, મને અત્યારે કનેક્ટ કરવામાં મુશ્કેલી આવી રહી છે. કૃપા કરીને થોડી વાર પછી ફરી પ્રયાસ કરો.',
      'kn': 'ಕ್ಷಮಿಸಿ, ನನಗೆ ಈಗ ಸಂಪರ್ಕಿಸಲು ತೊಂದರೆಯಾಗುತ್ತಿದೆ. ದಯವಿಟ್ಟು ಸ್ವಲ್ಪ ಸಮಯದ ನಂತರ ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.',
      'ml': 'ക്ഷമിക്കണം, എനിക്ക് ഇപ്പോൾ കണക്റ്റ് ചെയ്യാൻ പ്രശ്നമുണ്ട്. ദയവായി കുറച്ച് സമയത്തിന് ശേഷം വീണ്ടും ശ്രമിക്കുക.',
      'pa': 'ਮਾਫ਼ ਕਰੋ, ਮੈਨੂੰ ਹੁਣ ਕਨੈਕਟ ਕਰਨ ਵਿੱਚ ਸਮੱਸਿਆ ਹੋ ਰਹੀ ਹੈ। ਕਿਰਪਾ ਕਰਕੇ ਥੋੜ੍ਹੀ ਦੇਰ ਬਾਅਦ ਦੁਬਾਰਾ ਕੋਸ਼ਿਸ਼ ਕਰੋ।',
      'or': 'ଦୁଃଖିତ, ମୋର ବର୍ତ୍ତମାନ ସଂଯୋଗ କରିବାରେ ସମସ୍ୟା ହେଉଛି। ଦୟାକରି କିଛି ସମୟ ପରେ ପୁଣି ଚେଷ୍ଟା କରନ୍ତୁ।',
      'as': 'দুঃখিত, মোৰ এতিয়া সংযোগ কৰাত সমস্যা হৈছে। অনুগ্ৰহ কৰি কিছু সময়ৰ পিছত পুনৰ চেষ্টা কৰক।',
      'ur': 'معذرت، مجھے ابھی کنکٹ کرنے میں مسئلہ ہو رہا ہے۔ براہ کرم تھوڑی دیر بعد دوبارہ کوشش کریں۔',
      'sa': 'क्षम्यताम्, मम अधुना सम्बन्धे समस्या अस्ति। कृपया किञ्चित् कालात् पुनः प्रयत्नं कुर्वन्तु।',
      'ne': 'माफ गर्नुहोस्, मलाई अहिले जडान गर्न समस्या भइरहेको छ। कृपया केही समय पछि फेरि प्रयास गर्नुहोस्।',
      'si': 'සමාවන්න, මට දැන් සම්බන්ධ වීමට ගැටලුවක් තිබේ. කරුණාකර ටික වේලාවකින් නැවත උත්සාහ කරන්න.',
    };
    
    return errorMessages[language] || errorMessages['hi'];
  };

  // Enhanced voice input with proper toggle functionality
  const handleVoiceInput = async () => {
    if (!voiceInputEnabled) return;

    if (isListening) {
      // Stop listening when clicked again
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.stop();
      }
      setIsListening(false);
      return;
    }

    try {
      // Try browser speech recognition first
      if (recognitionRef.current) {
        setIsListening(true);
        recognitionRef.current.start();
      } else {
        // Fallback to MediaRecorder for better quality
        const stream = await navigator.mediaDevices.getUserMedia({ 
          audio: {
            sampleRate: 16000,
            channelCount: 1,
            echoCancellation: true,
            noiseSuppression: true,
          }
        });
        
        const mediaRecorder = new MediaRecorder(stream, {
          mimeType: 'audio/webm;codecs=opus'
        });
        mediaRecorderRef.current = mediaRecorder;
        audioChunksRef.current = [];

        mediaRecorder.ondataavailable = (event) => {
          audioChunksRef.current.push(event.data);
        };

        mediaRecorder.onstop = async () => {
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          try {
            const transcript = await transcribeAudio(audioBlob);
            setInputMessage(transcript);
          } catch (error) {
            console.error('Transcription error:', error);
          }
          stream.getTracks().forEach(track => track.stop());
          setIsListening(false);
        };

        setIsListening(true);
        mediaRecorder.start();

        // Auto-stop after 30 seconds
        setTimeout(() => {
          if (mediaRecorder.state === 'recording') {
            mediaRecorder.stop();
          }
        }, 30000);
      }
    } catch (error) {
      console.error('Voice input error:', error);
      setIsListening(false);
    }
  };

  const transcribeAudio = async (audioBlob: Blob): Promise<string> => {
    const formData = new FormData();
    formData.append('audio', audioBlob, 'audio.webm');
    
    const response = await fetch('http://localhost:5000/api/transcribe', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Transcription failed');
    }

    const data = await response.json();
    return data.transcript || '';
  };

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      // Stop any ongoing speech
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
      
      utterance.lang = langMap[selectedLanguage] || 'hi-IN';
      utterance.rate = 0.9;
      utterance.pitch = 1;
      
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      
      speechSynthesis.speak(utterance);
    }
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const clearChat = () => {
    const currentLang = languages.find(lang => lang.code === selectedLanguage);
    const greeting = currentLang?.greeting || languages[0].greeting;
    
    setMessages([{
      id: '1',
      role: 'assistant',
      content: greeting,
      timestamp: new Date(),
      language: selectedLanguage,
    }]);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const currentLanguage = languages.find(lang => lang.code === selectedLanguage) || languages[0];

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={onToggle}
          className="bg-primary-500 hover:bg-primary-600 text-white rounded-full p-4 shadow-lg transition-all duration-300 hover:scale-110 animate-pulse"
        >
          <Bot className="h-6 w-6" />
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className={`bg-white rounded-2xl shadow-2xl border border-neutral-200 transition-all duration-300 ${
        isMinimized ? 'w-80 h-16' : 'w-96 h-[600px]'
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-neutral-200 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-t-2xl">
          <div className="flex items-center space-x-3">
            <div className="h-8 w-8 bg-white/20 rounded-full flex items-center justify-center">
              <Bot className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-semibold text-sm">CareMate AI</h3>
              <p className="text-xs opacity-90">{currentLanguage.name} स्वास्थ्य सहायक</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {/* Language Selector */}
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="bg-white/20 text-white text-xs rounded px-2 py-1 border-0 focus:outline-none focus:ring-1 focus:ring-white/50"
            >
              {languages.map((lang) => (
                <option key={lang.code} value={lang.code} className="text-neutral-800">
                  {lang.flag} {lang.name}
                </option>
              ))}
            </select>
            
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="p-1 hover:bg-white/20 rounded transition-colors"
            >
              {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
            </button>
            
            <button
              onClick={onToggle}
              className="p-1 hover:bg-white/20 rounded transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {!isMinimized && (
          <>
            {/* Controls */}
            <div className="flex items-center justify-between p-3 bg-neutral-50 border-b border-neutral-200">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setVoiceInputEnabled(!voiceInputEnabled)}
                  className={`p-2 rounded-lg transition-colors ${
                    voiceInputEnabled 
                      ? 'bg-primary-100 text-primary-600' 
                      : 'bg-neutral-200 text-neutral-600 hover:bg-neutral-300'
                  }`}
                  title={voiceInputEnabled ? 'Voice input enabled' : 'Voice input disabled'}
                >
                  {voiceInputEnabled ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
                </button>
                
                <button
                  onClick={() => setAutoSpeak(!autoSpeak)}
                  className={`p-2 rounded-lg transition-colors ${
                    autoSpeak 
                      ? 'bg-secondary-100 text-secondary-600' 
                      : 'bg-neutral-200 text-neutral-600 hover:bg-neutral-300'
                  }`}
                  title={autoSpeak ? 'Auto-speak enabled' : 'Auto-speak disabled'}
                >
                  {autoSpeak ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                </button>

                {isSpeaking && (
                  <button
                    onClick={stopSpeaking}
                    className="p-2 rounded-lg bg-error-100 text-error-600 hover:bg-error-200 transition-colors"
                    title="Stop speaking"
                  >
                    <Square className="h-4 w-4" />
                  </button>
                )}
              </div>
              
              <button
                onClick={clearChat}
                className="p-2 rounded-lg bg-neutral-200 text-neutral-600 hover:bg-neutral-300 transition-colors"
                title="Clear chat"
              >
                <RefreshCw className="h-4 w-4" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 h-[400px]">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                      message.role === 'user'
                        ? 'bg-primary-500 text-white'
                        : 'bg-neutral-100 text-neutral-800'
                    }`}
                  >
                    <div className="flex items-start space-x-2">
                      {message.role === 'assistant' && (
                        <Bot className="h-4 w-4 mt-1 text-primary-500 flex-shrink-0" />
                      )}
                      {message.role === 'user' && (
                        <User className="h-4 w-4 mt-1 text-white flex-shrink-0" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm leading-relaxed break-words">{message.content}</p>
                        <p className={`text-xs mt-1 ${
                          message.role === 'user' ? 'text-primary-100' : 'text-neutral-500'
                        }`}>
                          {message.timestamp.toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </p>
                      </div>
                      {message.role === 'assistant' && (
                        <button
                          onClick={() => speakText(message.content)}
                          className="p-1 hover:bg-neutral-200 rounded transition-colors flex-shrink-0"
                          disabled={isSpeaking}
                        >
                          <Volume2 className="h-3 w-3 text-neutral-500" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-neutral-100 rounded-2xl px-4 py-2">
                    <div className="flex items-center space-x-2">
                      <Bot className="h-4 w-4 text-primary-500" />
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-neutral-200">
              <div className="flex space-x-2">
                {/* Voice Input Button */}
                {voiceInputEnabled && (
                  <button
                    onClick={handleVoiceInput}
                    disabled={isLoading}
                    className={`p-3 rounded-full transition-all duration-300 flex-shrink-0 ${
                      isListening
                        ? 'bg-error-500 text-white animate-pulse shadow-lg'
                        : 'bg-primary-500 text-white hover:bg-primary-600 shadow-md hover:shadow-lg'
                    }`}
                    title={isListening ? 'Click to stop listening' : 'Click to start voice input'}
                  >
                    {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                  </button>
                )}
                
                {/* Text Input */}
                <input
                  ref={inputRef}
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={`${currentLanguage.name} में अपना स्वास्थ्य प्रश्न लिखें...`}
                  className="flex-1 px-4 py-2 border border-neutral-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  disabled={isLoading || isListening}
                />
                
                {/* Send Button */}
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || isLoading || isListening}
                  className="rounded-full px-4 flex-shrink-0"
                  rightIcon={<Send className="h-4 w-4" />}
                >
                  Send
                </Button>
              </div>
              
              {/* Voice Input Status */}
              {isListening && (
                <div className="mt-2 flex items-center justify-center text-sm text-primary-600">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-error-500 rounded-full animate-pulse"></div>
                    <span>सुन रहा हूं... रोकने के लिए माइक बटन दबाएं</span>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AIHealthAssistant;