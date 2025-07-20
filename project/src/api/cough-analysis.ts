// Cough Detection and Respiratory Analysis API
import { API_KEYS } from '../config/apiKeys';

export interface CoughAnalysisResult {
  coughDetected: boolean;
  confidence: number;
  severity?: 'mild' | 'moderate' | 'severe';
  analysis: string;
  recommendations: string[];
  homeRemedies: string[];
  whenToSeeDoctor: string[];
  preventionTips: string[];
  audioFeatures?: {
    duration: number;
    frequency: number;
    intensity: number;
  };
  language?: string;
}

// Audio feature extraction using Web Audio API
const extractAudioFeatures = async (audioBlob: Blob): Promise<{
  duration: number;
  frequency: number;
  intensity: number;
  spectralFeatures: Float32Array;
}> => {
  return new Promise((resolve, reject) => {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const fileReader = new FileReader();
    
    fileReader.onload = async (e) => {
      try {
        const arrayBuffer = e.target?.result as ArrayBuffer;
        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
        
        const channelData = audioBuffer.getChannelData(0);
        const duration = audioBuffer.duration;
        
        // Calculate RMS (intensity)
        let sumSquares = 0;
        for (let i = 0; i < channelData.length; i++) {
          sumSquares += channelData[i] * channelData[i];
        }
        const intensity = Math.sqrt(sumSquares / channelData.length);
        
        // Simple frequency analysis using zero-crossing rate
        let zeroCrossings = 0;
        for (let i = 1; i < channelData.length; i++) {
          if ((channelData[i] >= 0) !== (channelData[i - 1] >= 0)) {
            zeroCrossings++;
          }
        }
        const frequency = (zeroCrossings / 2) / duration;
        
        // Extract spectral features using FFT
        const fftSize = 2048;
        const analyser = audioContext.createAnalyser();
        analyser.fftSize = fftSize;
        const spectralFeatures = new Float32Array(analyser.frequencyBinCount);
        
        // For demo purposes, create mock spectral features
        for (let i = 0; i < spectralFeatures.length; i++) {
          spectralFeatures[i] = Math.random() * intensity;
        }
        
        resolve({
          duration,
          frequency,
          intensity,
          spectralFeatures
        });
      } catch (error) {
        reject(error);
      }
    };
    
    fileReader.onerror = () => reject(new Error('Failed to read audio file'));
    fileReader.readAsArrayBuffer(audioBlob);
  });
};

// Simple cough detection algorithm
const detectCoughFromFeatures = (features: {
  duration: number;
  frequency: number;
  intensity: number;
  spectralFeatures: Float32Array;
}): { detected: boolean; confidence: number; severity?: 'mild' | 'moderate' | 'severe' } => {
  // Cough characteristics:
  // - Higher frequency content (200-2000 Hz range)
  // - Sharp onset and decay
  // - Higher intensity bursts
  // - Specific spectral patterns
  
  let coughScore = 0;
  
  // Intensity-based detection
  if (features.intensity > 0.1) coughScore += 0.3;
  if (features.intensity > 0.2) coughScore += 0.2;
  
  // Frequency-based detection (coughs typically have higher frequency content)
  if (features.frequency > 50) coughScore += 0.2;
  if (features.frequency > 100) coughScore += 0.1;
  
  // Duration-based detection (coughs are typically short bursts)
  if (features.duration < 30 && features.duration > 5) coughScore += 0.1;
  
  // Spectral analysis (simplified)
  const highFreqEnergy = features.spectralFeatures.slice(100, 400).reduce((a, b) => a + b, 0);
  const totalEnergy = features.spectralFeatures.reduce((a, b) => a + b, 0);
  const highFreqRatio = totalEnergy > 0 ? highFreqEnergy / totalEnergy : 0;
  
  if (highFreqRatio > 0.3) coughScore += 0.1;
  
  const confidence = Math.min(coughScore, 1.0);
  const detected = confidence > 0.5;
  
  let severity: 'mild' | 'moderate' | 'severe' | undefined;
  if (detected) {
    if (confidence > 0.8) severity = 'severe';
    else if (confidence > 0.65) severity = 'moderate';
    else severity = 'mild';
  }
  
  return { detected, confidence, severity };
};

// Enhanced AI analysis using Groq API
const getAIAnalysis = async (
  coughDetected: boolean, 
  confidence: number, 
  severity: string | undefined,
  language: string = 'hi'
): Promise<{
  analysis: string;
  recommendations: string[];
  homeRemedies: string[];
  whenToSeeDoctor: string[];
  preventionTips: string[];
}> => {
  try {
    const grokApiKey = import.meta.env.VITE_GROK_API_KEY || 
                      process.env.REACT_APP_GROK_API_KEY || 
                      'GROQ_API_KEY';

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

    const langName = languageNames[language as keyof typeof languageNames] || 'Hindi';

    const prompt = `You are an expert AI respiratory health assistant. Analyze this cough detection result and provide comprehensive guidance in ${langName} language.

DETECTION RESULT:
- Cough Detected: ${coughDetected ? 'YES' : 'NO'}
- Confidence: ${(confidence * 100).toFixed(1)}%
- Severity: ${severity || 'N/A'}

Please provide a JSON response with the following structure:
{
  "analysis": "Detailed analysis of the respiratory condition in ${langName}",
  "recommendations": ["List of medical recommendations in ${langName}"],
  "homeRemedies": ["Safe home remedies and care tips in ${langName}"],
  "whenToSeeDoctor": ["Warning signs requiring medical attention in ${langName}"],
  "preventionTips": ["Prevention strategies for respiratory health in ${langName}"]
}

Focus on:
1. **Respiratory Assessment**: Provide detailed analysis of the detected patterns
2. **Immediate Care**: Safe home remedies for cough and respiratory symptoms
3. **Medical Guidance**: Clear indicators for when to seek professional help
4. **Prevention**: Strategies to maintain respiratory health
5. **Cultural Sensitivity**: Consider Indian healthcare context and accessibility

${coughDetected ? `
COUGH DETECTED - Provide specific guidance for:
- Types of cough (dry, wet, persistent)
- Immediate relief measures
- When cough becomes concerning
- Home remedies safe for Indian households
` : `
NO COUGH DETECTED - Provide guidance for:
- Maintaining respiratory health
- Prevention strategies
- General wellness tips
- When to monitor for symptoms
`}

Respond ONLY in ${langName} language with practical, culturally appropriate advice.`;

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${grokApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama3-70b-8192',
        messages: [
          {
            role: 'system',
            content: `You are an expert AI respiratory health assistant specializing in cough detection and respiratory care. Provide accurate, helpful, and culturally sensitive medical guidance for Indian users.`
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 1024,
      }),
    });

    if (!response.ok) {
      throw new Error(`Groq API error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;

    // Try to parse JSON response
    try {
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (parseError) {
      console.warn('Failed to parse AI JSON response, using fallback');
    }

    // Fallback response
    return generateFallbackResponse(coughDetected, severity, language);

  } catch (error) {
    console.error('AI analysis error:', error);
    return generateFallbackResponse(coughDetected, severity, language);
  }
};

// Fallback response when AI analysis fails
const generateFallbackResponse = (
  coughDetected: boolean, 
  severity: string | undefined, 
  language: string
) => {
  const responses = {
    'hi': {
      analysis: coughDetected 
        ? `खांसी का पता चला है। ${severity === 'severe' ? 'यह गंभीर लग रहा है' : severity === 'moderate' ? 'यह मध्यम स्तर की है' : 'यह हल्की है'}। कृपया उचित देखभाल करें।`
        : 'कोई खांसी नहीं मिली। आपके श्वसन तंत्र की स्थिति सामान्य लग रही है।',
      recommendations: coughDetected ? [
        'पर्याप्त आराम करें',
        'गर्म पानी पिएं',
        'भाप लें',
        'धूम्रपान से बचें'
      ] : [
        'नियमित व्यायाम करें',
        'स्वस्थ आहार लें',
        'पर्याप्त पानी पिएं'
      ],
      homeRemedies: [
        'शहद और अदरक का सेवन करें',
        'हल्दी वाला दूध पिएं',
        'तुलसी की चाय लें',
        'गर्म पानी से गरारे करें'
      ],
      whenToSeeDoctor: [
        'अगर खांसी 2 सप्ताह से अधिक रहे',
        'बुखार के साथ खांसी हो',
        'सांस लेने में कठिनाई हो',
        'खून आए'
      ],
      preventionTips: [
        'हाथ धोते रहें',
        'मास्क पहनें',
        'भीड़ से बचें',
        'धूम्रपान न करें'
      ]
    },
    'en': {
      analysis: coughDetected 
        ? `Cough detected. ${severity === 'severe' ? 'This appears to be severe' : severity === 'moderate' ? 'This is moderate level' : 'This is mild'}. Please take appropriate care.`
        : 'No cough detected. Your respiratory condition appears normal.',
      recommendations: coughDetected ? [
        'Get adequate rest',
        'Drink warm water',
        'Take steam inhalation',
        'Avoid smoking'
      ] : [
        'Exercise regularly',
        'Eat healthy diet',
        'Drink plenty of water'
      ],
      homeRemedies: [
        'Take honey and ginger',
        'Drink turmeric milk',
        'Have tulsi tea',
        'Gargle with warm water'
      ],
      whenToSeeDoctor: [
        'If cough persists for more than 2 weeks',
        'Cough with fever',
        'Difficulty breathing',
        'Blood in cough'
      ],
      preventionTips: [
        'Wash hands regularly',
        'Wear mask',
        'Avoid crowds',
        'Don\'t smoke'
      ]
    }
  };

  const response = responses[language as keyof typeof responses] || responses['hi'];
  return response;
};

// Main cough analysis function
export const analyzeCoughAudio = async (
  audioBlob: Blob, 
  language: string = 'hi'
): Promise<CoughAnalysisResult> => {
  try {
    console.log('🎵 Starting cough analysis...');
    
    // Extract audio features
    const features = await extractAudioFeatures(audioBlob);
    console.log('📊 Audio features extracted:', features);
    
    // Detect cough using ML algorithm
    const detection = detectCoughFromFeatures(features);
    console.log('🔍 Cough detection result:', detection);
    
    // Get AI analysis and recommendations
    const aiAnalysis = await getAIAnalysis(
      detection.detected, 
      detection.confidence, 
      detection.severity,
      language
    );
    console.log('🤖 AI analysis completed');
    
    const result: CoughAnalysisResult = {
      coughDetected: detection.detected,
      confidence: detection.confidence,
      severity: detection.severity,
      analysis: aiAnalysis.analysis,
      recommendations: aiAnalysis.recommendations,
      homeRemedies: aiAnalysis.homeRemedies,
      whenToSeeDoctor: aiAnalysis.whenToSeeDoctor,
      preventionTips: aiAnalysis.preventionTips,
      audioFeatures: {
        duration: features.duration,
        frequency: features.frequency,
        intensity: features.intensity
      },
      language
    };
    
    console.log('✅ Cough analysis completed successfully');
    return result;
    
  } catch (error) {
    console.error('❌ Cough analysis error:', error);
    throw new Error('Failed to analyze audio for cough detection. Please try again.');
  }
};

// Audio quality assessment
export const assessAudioQuality = (audioBlob: Blob): Promise<{
  quality: 'good' | 'fair' | 'poor';
  issues: string[];
  suggestions: string[];
}> => {
  return new Promise((resolve) => {
    const issues: string[] = [];
    const suggestions: string[] = [];
    
    // Check file size (rough quality indicator)
    if (audioBlob.size < 50000) { // Less than 50KB for 30 seconds is quite low
      issues.push('Low audio quality detected');
      suggestions.push('Try recording in a quieter environment');
    }
    
    if (audioBlob.size > 5000000) { // More than 5MB might be too high
      issues.push('Very large file size');
      suggestions.push('Audio quality is very high, which is good for analysis');
    }
    
    // Determine overall quality
    let quality: 'good' | 'fair' | 'poor' = 'good';
    if (issues.length > 2) {
      quality = 'poor';
    } else if (issues.length > 0) {
      quality = 'fair';
    }
    
    resolve({ quality, issues, suggestions });
  });
};

// Generate audio summary for cough analysis
export const generateCoughAudioSummary = async (
  result: CoughAnalysisResult, 
  language: string = 'hi'
): Promise<void> => {
  try {
    const summaryParts = [
      `श्वसन विश्लेषण पूर्ण। ${result.coughDetected ? 'खांसी का पता चला।' : 'कोई खांसी नहीं मिली।'}`,
      `विश्वसनीयता: ${(result.confidence * 100).toFixed(0)} प्रतिशत।`
    ];
    
    if (result.severity) {
      summaryParts.push(`गंभीरता: ${result.severity}।`);
    }
    
    // Add key recommendations
    if (result.homeRemedies && result.homeRemedies.length > 0) {
      summaryParts.push('मुख्य घरेलू उपचार:');
      result.homeRemedies.slice(0, 2).forEach(remedy => {
        summaryParts.push(remedy);
      });
    }
    
    // Add doctor consultation advice
    if (result.whenToSeeDoctor && result.whenToSeeDoctor.length > 0) {
      summaryParts.push('डॉक्टर से मिलें यदि:');
      result.whenToSeeDoctor.slice(0, 2).forEach(reason => {
        summaryParts.push(reason);
      });
    }
    
    const fullSummary = summaryParts.join(' ');
    
    // Use speech synthesis
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(fullSummary);
      
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
      utterance.rate = 0.8;
      utterance.pitch = 1;
      
      speechSynthesis.speak(utterance);
    }
    
  } catch (error) {
    console.error('Audio summary generation failed:', error);
  }
};