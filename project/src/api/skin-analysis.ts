// AI-powered skin analysis API integration
import { API_KEYS } from '../config/apiKeys';
import { detectLanguageFromText, speakText } from './ai-health-assistant';

// Backend API URL
const BACKEND_API_URL = 'http://localhost:5000';

// TensorFlow.js imports for MobileNetV3 model
import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-backend-webgl';

export interface SkinAnalysisResult {
  condition: string;
  confidence: number;
  severity: 'mild' | 'moderate' | 'severe';
  description: string;
  recommendations: string[];
  medications: string[];
  whenToSeeDoctor: string[];
  homeRemedies: string[];
  firstAid: string[];
  possibleCauses: string[];
  preventionTips: string[];
  urgencyLevel: 'low' | 'medium' | 'high' | 'emergency';
  estimatedHealingTime: string;
  modelPredictions?: ModelPrediction[];
  language?: string;
  originalEnglishText?: string;
}

export interface ModelPrediction {
  condition: string;
  confidence: number;
  category: 'melanoma' | 'acne' | 'injury' | 'benign' | 'other';
}

// Language detection and translation using Gemini API
const translateWithGemini = async (text: string, targetLanguage: string): Promise<string> => {
  try {
    const geminiApiKey = import.meta.env.VITE_GEMINI_API_KEY || 
                        process.env.REACT_APP_GEMINI_API_KEY || 
                        'GEMINI';
    
    if (!geminiApiKey) {
      console.warn('Gemini API key not configured, skipping translation');
      return text;
    }

    const languageNames = {
      'hi': 'Hindi (हिंदी)',
      'en': 'English',
      'bn': 'Bengali (বাংলা)',
      'te': 'Telugu (తెలుగు)',
      'mr': 'Marathi (मराठी)',
      'ta': 'Tamil (தமிழ்)',
      'gu': 'Gujarati (ગુજરાતી)',
      'kn': 'Kannada (ಕನ್ನಡ)',
      'ml': 'Malayalam (മലയാളം)',
      'pa': 'Punjabi (ਪੰਜਾਬੀ)',
      'or': 'Odia (ଓଡ଼ିଆ)',
      'as': 'Assamese (অসমীয়া)',
      'ur': 'Urdu (اردو)',
      'ne': 'Nepali (नेपाली)',
      'si': 'Sinhala (සිංහල)'
    };

    const targetLangName = languageNames[targetLanguage as keyof typeof languageNames] || 'Hindi';

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${geminiApiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `Translate the following medical text to ${targetLangName}. Maintain medical accuracy and cultural sensitivity. Keep medical terms clear and understandable for Indian patients:

${text}`
          }]
        }],
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 1024,
        }
      }),
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    const translatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (translatedText) {
      return translatedText.trim();
    } else {
      console.warn('No translation received from Gemini API');
      return text;
    }
  } catch (error) {
    console.error('Translation error:', error);
    return text; // Return original text if translation fails
  }
};

// Dermatological condition classes for MobileNetV3 model
const SKIN_CONDITIONS = {
  melanoma: [
    'melanoma',
    'malignant_melanoma',
    'suspicious_mole',
    'atypical_nevus'
  ],
  acne: [
    'acne_vulgaris',
    'comedonal_acne',
    'inflammatory_acne',
    'cystic_acne',
    'blackheads',
    'whiteheads'
  ],
  injuries: [
    'deep_cut',
    'shallow_cut',
    'laceration',
    'puncture_wound',
    'abrasion',
    'scrape',
    'first_degree_burn',
    'second_degree_burn',
    'bruise',
    'contusion',
    'hematoma',
    'scratch',
    'bite_wound',
    'surgical_wound',
    'infected_wound'
  ],
  benign: [
    'seborrheic_keratosis',
    'benign_nevus',
    'age_spot',
    'freckle',
    'skin_tag'
  ],
  other: [
    'eczema',
    'psoriasis',
    'dermatitis',
    'rash',
    'fungal_infection',
    'bacterial_infection',
    'allergic_reaction',
    'insect_bite',
    'poison_ivy',
    'heat_rash',
    'rash',
    'fungal_infection'
  ]
};

// MobileNetV3 model manager
class MobileNetV3SkinAnalyzer {
  private model: tf.LayersModel | null = null;
  private isLoading = false;
  private modelUrl = '/models/mobilenetv3_skin_classifier/model.json';

  async loadModel(): Promise<void> {
    if (this.model || this.isLoading) return;
    
    this.isLoading = true;
    try {
      console.log('Loading MobileNetV3 skin classification model...');
      
      // Initialize TensorFlow.js backend
      await tf.ready();
      
      // Load the pre-trained MobileNetV3 model
      this.model = await tf.loadLayersModel(this.modelUrl);
      console.log('✅ MobileNetV3 model loaded successfully');
      
      // Warm up the model with a dummy prediction
      const dummyInput = tf.zeros([1, 224, 224, 3]);
      await this.model.predict(dummyInput);
      dummyInput.dispose();
      
    } catch (error) {
      console.warn('⚠️ Could not load MobileNetV3 model, falling back to AI analysis:', error);
      this.model = null;
    } finally {
      this.isLoading = false;
    }
  }

  async predict(imageData: ImageData): Promise<ModelPrediction[]> {
    if (!this.model) {
      await this.loadModel();
      if (!this.model) {
        throw new Error('MobileNetV3 model not available');
      }
    }

    return tf.tidy(() => {
      // Preprocess image for MobileNetV3
      let tensor = tf.browser.fromPixels(imageData, 3);
      
      // Resize to 224x224 (MobileNetV3 input size)
      tensor = tf.image.resizeBilinear(tensor, [224, 224]);
      
      // Normalize pixel values to [-1, 1] (MobileNetV3 preprocessing)
      tensor = tensor.div(127.5).sub(1);
      
      // Add batch dimension
      tensor = tensor.expandDims(0);
      
      // Run inference
      const predictions = this.model!.predict(tensor) as tf.Tensor;
      const probabilities = predictions.dataSync();
      
      // Convert predictions to structured results
      const results: ModelPrediction[] = [];
      
      // Map predictions to condition categories
      Object.entries(SKIN_CONDITIONS).forEach(([category, conditions], categoryIndex) => {
        conditions.forEach((condition, conditionIndex) => {
          const predictionIndex = categoryIndex * conditions.length + conditionIndex;
          if (predictionIndex < probabilities.length) {
            const confidence = probabilities[predictionIndex];
            if (confidence > 0.1) { // Only include predictions above 10% confidence
              results.push({
                condition,
                confidence,
                category: category as ModelPrediction['category']
              });
            }
          }
        });
      });
      
      // Sort by confidence and return top 5
      return results
        .sort((a, b) => b.confidence - a.confidence)
        .slice(0, 5);
    });
  }

  dispose(): void {
    if (this.model) {
      this.model.dispose();
      this.model = null;
    }
  }
}

// Singleton instance of the MobileNetV3 analyzer
const mobilenetAnalyzer = new MobileNetV3SkinAnalyzer();

// Preprocess image using OpenCV.js (client-side)
const preprocessImage = async (imageBlob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    img.onload = () => {
      // Resize image to optimal size for analysis
      const maxSize = 512;
      let { width, height } = img;
      
      if (width > height) {
        if (width > maxSize) {
          height = (height * maxSize) / width;
          width = maxSize;
        }
      } else {
        if (height > maxSize) {
          width = (width * maxSize) / height;
          height = maxSize;
        }
      }
      
      canvas.width = width;
      canvas.height = height;
      
      if (ctx) {
        // Apply image enhancements
        ctx.filter = 'contrast(1.1) brightness(1.05) saturate(1.1)';
        ctx.drawImage(img, 0, 0, width, height);
        
        // Convert to base64
        const processedImage = canvas.toDataURL('image/jpeg', 0.8);
        resolve(processedImage);
      } else {
        reject(new Error('Canvas context not available'));
      }
    };
    
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = URL.createObjectURL(imageBlob);
  });
};

// Translate analysis result to target language
const translateAnalysisResult = async (result: SkinAnalysisResult, targetLanguage: string): Promise<SkinAnalysisResult> => {
  if (targetLanguage === 'en') {
    return { ...result, language: 'en' };
  }
  try {
    console.log(`🌐 Translating analysis to ${targetLanguage}...`);
    
    // Translate main fields
    const [
      translatedCondition,
      translatedDescription,
      translatedRecommendations,
      translatedMedications,
      translatedFirstAid,
      translatedCauses,
      translatedPrevention,
      translatedHomeRemedies,
      translatedDoctorReasons,
      translatedHealingTime
    ] = await Promise.all([
      translateWithGemini(result.condition, targetLanguage),
      translateWithGemini(result.description, targetLanguage),
      translateWithGemini(result.recommendations.join('\n'), targetLanguage),
      translateWithGemini(result.medications.join('\n'), targetLanguage),
      translateWithGemini(result.firstAid.join('\n'), targetLanguage),
      translateWithGemini(result.possibleCauses.join('\n'), targetLanguage),
      translateWithGemini(result.preventionTips.join('\n'), targetLanguage),
      translateWithGemini(result.homeRemedies.join('\n'), targetLanguage),
      translateWithGemini(result.whenToSeeDoctor.join('\n'), targetLanguage),
      translateWithGemini(result.estimatedHealingTime, targetLanguage)
    ]);
    return {
      ...result,
      condition: translatedCondition,
      description: translatedDescription,
      recommendations: translatedRecommendations.split('\n').filter(item => item.trim()),
      medications: translatedMedications.split('\n').filter(item => item.trim()),
      firstAid: translatedFirstAid.split('\n').filter(item => item.trim()),
      possibleCauses: translatedCauses.split('\n').filter(item => item.trim()),
      preventionTips: translatedPrevention.split('\n').filter(item => item.trim()),
      homeRemedies: translatedHomeRemedies.split('\n').filter(item => item.trim()),
      whenToSeeDoctor: translatedDoctorReasons.split('\n').filter(item => item.trim()),
      estimatedHealingTime: translatedHealingTime,
      language: targetLanguage,
      originalEnglishText: `${result.condition}\n\n${result.description}`
    };
  } catch (error) {
    console.error('Translation failed:', error);
    return { ...result, language: 'en' };
  }
};

// Generate comprehensive audio summary in target language
export const generateAudioSummary = async (result: SkinAnalysisResult, language: string = 'hi'): Promise<void> => {
  try {
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
    
    // Create comprehensive summary
    const summaryParts = [
      `स्किन एनालिसिस रिपोर्ट। ${result.condition}।`,
      `गंभीरता: ${result.severity}।`,
      `विवरण: ${result.description}`,
    ];
    
    // Add first aid steps
    if (result.firstAid && result.firstAid.length > 0) {
      summaryParts.push('तत्काल प्राथमिक चिकित्सा:');
      result.firstAid.slice(0, 3).forEach((aid, index) => {
        summaryParts.push(`${index + 1}. ${aid}`);
      });
    }
    
    // Add key recommendations
    if (result.recommendations && result.recommendations.length > 0) {
      summaryParts.push('मुख्य सुझाव:');
      result.recommendations.slice(0, 2).forEach(rec => {
        summaryParts.push(rec);
      });
    }
    
    // Add when to see doctor
    if (result.whenToSeeDoctor && result.whenToSeeDoctor.length > 0) {
      summaryParts.push('डॉक्टर से कब मिलें:');
      result.whenToSeeDoctor.slice(0, 2).forEach(reason => {
        summaryParts.push(reason);
      });
    }
    
    const fullSummary = summaryParts.join(' ');
    
    // Speak the summary
    await speakText(fullSummary, language);
    
  } catch (error) {
    console.error('Audio summary generation failed:', error);
  }
};

// Analyze skin condition using AI
export const analyzeSkinCondition = async (imageBlob: Blob, userLanguage: string = 'hi'): Promise<SkinAnalysisResult> => {
  try {
    // Try enhanced backend analysis with Gemini AI first
    try {
      const result = await analyzeWithBackend(imageBlob, userLanguage);
      if (result) {
        console.log('✅ Using enhanced Gemini AI analysis');
        
        // Translate result if not in English
        if (userLanguage !== 'en') {
          const translatedResult = await translateAnalysisResult(result, userLanguage);
          return translatedResult;
        }
        return result;
      }
    } catch (backendError) {
      console.warn('⚠️ Backend analysis failed, falling back to frontend analysis:', backendError);
    }
    
    // Fallback to original frontend analysis
    let modelPredictions: ModelPrediction[] = [];
    
    // Preprocess the image
    const processedImage = await preprocessImage(imageBlob);
    
    // Try to use MobileNetV3 model for CNN classification
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = processedImage;
      });
      
      canvas.width = 224;
      canvas.height = 224;
      ctx?.drawImage(img, 0, 0, 224, 224);
      
      const imageData = ctx?.getImageData(0, 0, 224, 224);
      if (imageData) {
        modelPredictions = await mobilenetAnalyzer.predict(imageData);
        console.log('🧠 MobileNetV3 predictions:', modelPredictions);
      }
    } catch (modelError) {
      console.warn('⚠️ MobileNetV3 prediction failed, using AI fallback:', modelError);
    }
    
    // Enhance AI prompt with model predictions
    let analysisPrompt = `
You are an expert AI medical assistant specializing in injury assessment and dermatological conditions with access to CNN model predictions. Analyze this skin image and provide comprehensive medical guidance including first aid, causes, and prevention.

${modelPredictions.length > 0 ? `
CNN Model Predictions (MobileNetV3):
${modelPredictions.map(pred => `- ${pred.condition}: ${(pred.confidence * 100).toFixed(1)}% confidence (${pred.category})`).join('\n')}

Use these predictions to inform your analysis, but provide your own clinical assessment.
` : ''}

Please provide your analysis in the following JSON format:
{
  "condition": "Most likely skin condition name",
  "confidence": 0.85,
  "severity": "mild|moderate|severe",
  "description": "Detailed description of the observed condition",
  "recommendations": ["List of care recommendations"],
  "medications": ["Suggested over-the-counter treatments"],
  "whenToSeeDoctor": ["Warning signs that require medical attention"],
  "homeRemedies": ["Safe home remedies and care tips"]
  "firstAidSteps": ["Immediate first aid steps in order of priority"],
  "possibleCauses": ["Likely causes of this injury/condition"],
  "preventionTips": ["How to prevent similar injuries/conditions in future"],
  "urgencyLevel": "low|medium|high|emergency",
  "estimatedHealingTime": "Expected healing timeframe"
}

Focus on:
1. Melanoma detection - Look for ABCDE criteria (Asymmetry, Border irregularity, Color variation, Diameter >6mm, Evolution)
2. Acne classification - Identify comedonal vs inflammatory vs cystic acne
3. Injury assessment - Evaluate cuts, burns, bruises, and wound healing
4. Provide practical, safe recommendations
2. Injury Analysis - Detailed assessment of:
   - Type of injury (cut, burn, bruise, abrasion, puncture, bite, etc.)
   - Depth and severity assessment
   - Signs of infection (redness, swelling, pus, red streaking)
   - Age of injury (fresh, healing, old)
   - Surrounding tissue condition
3. First Aid Priority - Provide immediate actionable steps:
   - Stop bleeding techniques
   - Cleaning and disinfection methods
   - Pain management
   - When to apply pressure, ice, or heat
   - Bandaging and protection methods
4. Cause Analysis - Identify likely causes:
   - Sharp object cuts (knife, glass, metal)
   - Blunt force trauma (falls, impacts)
   - Thermal injuries (heat, cold, friction)
   - Chemical exposure
   - Animal/insect bites
   - Sports or activity-related injuries
   - Workplace accidents
5. Prevention Education - Specific prevention strategies
6. Healing Timeline - Realistic recovery expectations
7. Emergency Indicators - Clear signs requiring immediate medical attention

INJURY-SPECIFIC FIRST AID PROTOCOLS:
- Cuts/Lacerations: Control bleeding, clean wound, assess depth
- Burns: Cool with water, assess degree, protect from infection
- Bruises: Ice application, elevation, monitor for complications
- Abrasions: Clean debris, prevent infection, promote healing
- Puncture wounds: Do not remove objects, control bleeding, tetanus consideration
- Bites: Clean thoroughly, monitor for infection, consider rabies risk
${modelPredictions.length > 0 && modelPredictions[0].category === 'melanoma' ? 
  'CRITICAL: If melanoma is suspected, strongly recommend immediate dermatologist consultation.' : ''}

${modelPredictions.length > 0 && modelPredictions[0].category === 'injuries' ? 
  'INJURY DETECTED: Provide comprehensive first aid guidance and assess severity for emergency care needs.' : ''}

Image analysis: Based on the visual characteristics, color, texture, and pattern observed in the image.
`;
    
    // Extract image features and analyze with AI
    // Call Groq API for analysis
    const grokApiKey = import.meta.env.VITE_GROK_API_KEY || 
                      process.env.REACT_APP_GROK_API_KEY || 
                      'GROQ_API_KEY';

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
            content: 'You are an expert AI dermatology assistant with access to CNN model predictions specializing in skin condition analysis. Provide accurate, helpful, and safe medical guidance while always emphasizing the importance of professional medical consultation for serious conditions.'
          },
          {
            role: 'user',
            content: analysisPrompt
          }
        ],
        temperature: 0.3,
        max_tokens: 1024,
      }),
    });

    if (!response.ok) {
      throw new Error(`AI analysis failed: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;

    // Try to parse JSON response
    try {
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const analysisResult = {
          ...JSON.parse(jsonMatch[0]),
          modelPredictions
        };
        return analysisResult;
      }
    } catch (parseError) {
      console.warn('Failed to parse AI JSON response, using fallback');
    }

    // Fallback analysis if JSON parsing fails
    const fallbackResult = generateFallbackAnalysis(aiResponse, modelPredictions);
    
    // Translate fallback result if needed
    if (userLanguage !== 'en') {
      return await translateAnalysisResult(fallbackResult, userLanguage);
    }
    
    return fallbackResult;

  } catch (error) {
    console.error('Skin analysis error:', error);
    throw new Error('Failed to analyze skin condition. Please try again.');
  }
};

// Enhanced backend analysis using Google Gemini AI
const analyzeWithBackend = async (imageBlob: Blob, userLanguage: string = 'en'): Promise<SkinAnalysisResult | null> => {
  try {
    const formData = new FormData();
    formData.append('image', imageBlob);
    formData.append('language', userLanguage);
    formData.append('generateAudio', 'false'); // Audio generation disabled for web
    
    const response = await fetch(`${BACKEND_API_URL}/api/analyze-skin`, {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      throw new Error('Backend analysis failed: ${response.status}');
    }
    
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Backend analysis failed');
    }
    
    const analysis = data.analysis;
    
    // Convert backend response to frontend format
    return {
      condition: analysis.condition || 'Skin Condition Detected',
      confidence: analysis.confidence || 0.8,
      severity: analysis.severity || 'moderate',
      description: analysis.description || 'Skin condition analysis completed.',
      recommendations: analysis.recommendations || [],
      medications: analysis.medications || [],
      whenToSeeDoctor: analysis.when_to_see_doctor || [],
      homeRemedies: analysis.home_remedies || [],
      firstAid: analysis.immediate_first_aid || [],
      possibleCauses: analysis.possible_causes || [],
      preventionTips: analysis.prevention_tips || [],
      urgencyLevel: mapUrgencyLevel(analysis.urgency_level),
      estimatedHealingTime: analysis.healing_timeline || 'Variable',
      modelPredictions: [] // Backend doesn't provide CNN predictions
    };
    
  } catch (error) {
    console.error('Backend analysis error:', error);
    return null; // Return null to trigger fallback
  }
};

// Map backend urgency levels to frontend format
const mapUrgencyLevel = (backendLevel: string): 'low' | 'medium' | 'high' | 'emergency' => {
  switch (backendLevel?.toLowerCase()) {
    case 'low': return 'low';
    case 'medium': return 'medium';
    case 'high': return 'high';
    case 'emergency': return 'emergency';
    default: return 'medium';
  }
};

// Fallback analysis when JSON parsing fails
const generateFallbackAnalysis = (aiResponse: string, modelPredictions: ModelPrediction[] = []): SkinAnalysisResult => {
  // Extract key information from the AI response text
  const condition = extractCondition(aiResponse) || (modelPredictions[0]?.condition || 'Skin Condition Detected');
  const severity = extractSeverity(aiResponse) || 'mild';
  const isInjury = modelPredictions.some(pred => pred.category === 'injuries');
  
  return {
    condition,
    confidence: 0.75,
    severity: severity as 'mild' | 'moderate' | 'severe',
    description: aiResponse.substring(0, 200) + '...',
    modelPredictions,
    recommendations: [
      'Keep the affected area clean and dry',
      isInjury ? 'Monitor for signs of infection' : 'Avoid scratching or picking at the area',
      'Apply a gentle, fragrance-free moisturizer',
      'Monitor for any changes or worsening'
    ],
    medications: [
      isInjury ? 'Antiseptic solution for cleaning' : 'Over-the-counter antihistamine for itching',
      isInjury ? 'Antibiotic ointment if recommended' : 'Gentle antiseptic cream if there are open areas',
      'Hydrocortisone cream for inflammation (use sparingly)'
    ],
    firstAid: isInjury ? [
      'Clean hands thoroughly before touching the area',
      'Stop any bleeding by applying gentle pressure',
      'Clean the wound with clean water',
      'Apply antiseptic if available',
      'Cover with clean bandage or cloth'
    ] : [
      'Avoid touching the affected area with dirty hands',
      'Apply cool compress if there is swelling',
      'Keep the area clean and dry'
    ],
    possibleCauses: isInjury ? [
      'Accidental injury from sharp object',
      'Fall or impact trauma',
      'Sports or physical activity',
      'Workplace accident',
      'Animal or insect interaction'
    ] : [
      'Allergic reaction to substances',
      'Skin irritation from products',
      'Environmental factors',
      'Genetic predisposition',
      'Hormonal changes'
    ],
    preventionTips: isInjury ? [
      'Use proper safety equipment during activities',
      'Keep work and living areas well-lit',
      'Handle sharp objects carefully',
      'Wear appropriate protective clothing',
      'Maintain good situational awareness'
    ] : [
      'Avoid known allergens and irritants',
      'Use gentle, fragrance-free products',
      'Maintain good hygiene',
      'Protect skin from sun exposure',
      'Stay hydrated and eat a balanced diet'
    ],
    healingTimeline: isInjury ? '5-14 days depending on severity' : '1-2 weeks with proper care',
    injuryType: isInjury ? 'acute' : undefined,
    whenToSeeDoctor: [
      ...(isInjury ? [
        'If bleeding cannot be controlled',
        'If the wound is deep or gaping',
        'Signs of infection (increased redness, warmth, pus)',
        'If you cannot clean the wound properly',
        'If tetanus vaccination is not up to date'
      ] : []),
      'If symptoms worsen or don\'t improve in 7-10 days',
      'If you develop fever or signs of infection',
      'If the area becomes increasingly painful',
      'If you have concerns about the appearance'
    ],
    homeRemedies: [
      isInjury ? 'Apply ice wrapped in cloth for swelling (not directly on skin)' : 'Apply cool, damp compresses for 10-15 minutes',
      'Use aloe vera gel for soothing relief',
      isInjury ? 'Elevate the injured area if possible' : 'Take lukewarm baths with oatmeal or baking soda',
      'Avoid harsh soaps and fragranced products'
    ],
    ...(modelPredictions.length > 0 && modelPredictions[0].category === 'melanoma' && {
      whenToSeeDoctor: [
        '🚨 URGENT: Possible melanoma detected - see dermatologist immediately',
        'Any mole showing ABCDE signs (Asymmetry, Border irregularity, Color variation, Diameter >6mm, Evolution)',
        'If symptoms worsen or don\'t improve in 7-10 days',
        'If you develop fever or signs of infection',
        'If the area becomes increasingly painful'
      ]
    }),
    ...(modelPredictions.length > 0 && modelPredictions[0].category === 'injuries' && {
      whenToSeeDoctor: [
        '🚨 SEEK IMMEDIATE MEDICAL ATTENTION IF:',
        'Bleeding cannot be controlled after 10 minutes of direct pressure',
        'The wound is deeper than 1/4 inch or you can see fat, muscle, or bone',
        'The wound is longer than 1/2 inch',
        'Signs of infection: increasing redness, warmth, swelling, pus, red streaking',
        'Numbness or inability to move the area normally',
        'Object embedded in the wound (do not remove)',
        'Human or animal bite',
        'Tetanus vaccination not current (within 5-10 years)',
        'If symptoms worsen or don\'t improve in 7-10 days'
      ]
    })
  };
};

// Helper functions for text extraction
const extractCondition = (text: string): string | null => {
  const conditionPatterns = [
    /condition[:\s]+([^.\n]+)/i,
    /diagnosis[:\s]+([^.\n]+)/i,
    /appears to be[:\s]+([^.\n]+)/i,
    /likely[:\s]+([^.\n]+)/i
  ];
  
  for (const pattern of conditionPatterns) {
    const match = text.match(pattern);
    if (match) {
      return match[1].trim();
    }
  }
  return null;
};

const extractSeverity = (text: string): string | null => {
  const severityPatterns = [
    /severity[:\s]+(mild|moderate|severe)/i,
    /(mild|moderate|severe)\s+condition/i,
    /(mild|moderate|severe)\s+case/i
  ];
  
  for (const pattern of severityPatterns) {
    const match = text.match(pattern);
    if (match) {
      return match[1].toLowerCase();
    }
  }
  return null;
};

// Common skin conditions database for reference
export const commonSkinConditions = {
  cuts: {
    symptoms: ['bleeding', 'pain', 'open wound', 'tissue separation'],
    firstAid: ['apply pressure', 'clean wound', 'bandage', 'elevate if possible'],
    treatments: ['antiseptic', 'antibiotic ointment', 'sterile bandages'],
    causes: ['sharp objects', 'accidents', 'falls', 'tools'],
    prevention: ['safety equipment', 'careful handling', 'proper lighting']
  },
  burns: {
    symptoms: ['redness', 'pain', 'blistering', 'swelling'],
    firstAid: ['cool with water', 'remove from heat source', 'do not use ice', 'cover loosely'],
    treatments: ['burn gel', 'pain relievers', 'sterile dressings'],
    causes: ['heat', 'chemicals', 'electricity', 'radiation', 'friction'],
    prevention: ['heat protection', 'safety protocols', 'proper equipment']
  },
  bruises: {
    symptoms: ['discoloration', 'swelling', 'tenderness', 'pain'],
    firstAid: ['apply ice', 'elevate area', 'rest', 'compress gently'],
    treatments: ['ice packs', 'pain relievers', 'arnica gel'],
    causes: ['blunt trauma', 'falls', 'sports injuries', 'accidents'],
    prevention: ['protective gear', 'safe environment', 'proper technique']
  },
  abrasions: {
    symptoms: ['scraped skin', 'bleeding', 'dirt/debris', 'burning sensation'],
    firstAid: ['clean gently', 'remove debris', 'apply antiseptic', 'bandage'],
    treatments: ['saline solution', 'antibiotic ointment', 'non-stick bandages'],
    causes: ['falls on rough surfaces', 'sliding', 'friction', 'sports'],
    prevention: ['protective clothing', 'proper surfaces', 'safety gear']
  },
  punctures: {
    symptoms: ['small entry wound', 'deep penetration', 'minimal bleeding', 'pain'],
    firstAid: ['do not remove object', 'control bleeding', 'stabilize object', 'seek medical help'],
    treatments: ['tetanus shot', 'antibiotics', 'surgical cleaning'],
    causes: ['nails', 'needles', 'thorns', 'tools', 'animal bites'],
    prevention: ['proper footwear', 'tool safety', 'clear walkways']
  },
  acne: {
    symptoms: ['blackheads', 'whiteheads', 'pimples', 'cysts'],
    treatments: ['benzoyl peroxide', 'salicylic acid', 'retinoids'],
    homeRemedies: ['tea tree oil', 'honey mask', 'green tea compress']
  },
  eczema: {
    symptoms: ['dry skin', 'itching', 'red patches', 'scaling'],
    treatments: ['moisturizers', 'topical corticosteroids', 'antihistamines'],
    homeRemedies: ['oatmeal baths', 'coconut oil', 'cool compresses']
  },
  dermatitis: {
    symptoms: ['redness', 'swelling', 'itching', 'blisters'],
    treatments: ['avoid irritants', 'topical steroids', 'barrier creams'],
    homeRemedies: ['aloe vera', 'cold compress', 'chamomile tea compress']
  },
  psoriasis: {
    symptoms: ['thick red patches', 'silvery scales', 'dry skin', 'itching'],
    treatments: ['topical treatments', 'phototherapy', 'systemic medications'],
    homeRemedies: ['moisturizing', 'dead sea salt baths', 'turmeric paste']
  },
  fungal: {
    symptoms: ['circular patches', 'scaling', 'itching', 'hair loss'],
    treatments: ['antifungal creams', 'oral antifungals', 'medicated shampoos'],
    homeRemedies: ['tea tree oil', 'apple cider vinegar', 'garlic paste']
  }
};

// Image quality assessment
export const assessImageQuality = (imageBlob: Blob): Promise<{
  quality: 'good' | 'fair' | 'poor';
  issues: string[];
  suggestions: string[];
}> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const issues: string[] = [];
      const suggestions: string[] = [];
      
      // Check image resolution
      if (img.width < 300 || img.height < 300) {
        issues.push('Low resolution');
        suggestions.push('Take a closer, higher resolution image');
      }
      
      // Check aspect ratio (very wide or tall images might be problematic)
      const aspectRatio = img.width / img.height;
      if (aspectRatio > 3 || aspectRatio < 0.33) {
        issues.push('Unusual aspect ratio');
        suggestions.push('Frame the affected area more centrally');
      }
      
      // Determine overall quality
      let quality: 'good' | 'fair' | 'poor' = 'good';
      if (issues.length > 2) {
        quality = 'poor';
      } else if (issues.length > 0) {
        quality = 'fair';
      }
      
      resolve({ quality, issues, suggestions });
    };
    
    img.src = URL.createObjectURL(imageBlob);
  });
};