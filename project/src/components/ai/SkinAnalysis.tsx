import React, { useState, useRef, useEffect } from 'react';
import { Camera, Upload, X, AlertCircle, CheckCircle, Loader, RotateCcw, Download, Volume2, VolumeX, Globe } from 'lucide-react';
import Button from '../common/Button';
import Card from '../common/Card';
import { analyzeSkinCondition, ModelPrediction, generateAudioSummary } from '../../api/skin-analysis';

interface SkinAnalysisProps {
  isOpen: boolean;
  onClose: () => void;
}

interface AnalysisResult {
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
  healingTimeline: string;
  injuryType?: 'acute' | 'chronic' | 'healing' | 'infected';
  modelPredictions?: ModelPrediction[];
}

const SkinAnalysis: React.FC<SkinAnalysisProps> = ({ isOpen, onClose }) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('hi');
  const [isGeneratingAudio, setIsGeneratingAudio] = useState(false);
  const [autoSpeak, setAutoSpeak] = useState(true);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Supported Indian languages
  const languages = [
    { code: 'hi', name: 'हिंदी', flag: '🇮🇳' },
    { code: 'en', name: 'English', flag: '🇮🇳' },
    { code: 'bn', name: 'বাংলা', flag: '🇮🇳' },
    { code: 'te', name: 'తెలుగు', flag: '🇮🇳' },
    { code: 'mr', name: 'मराठी', flag: '🇮🇳' },
    { code: 'ta', name: 'தமிழ்', flag: '🇮🇳' },
    { code: 'gu', name: 'ગુજરાતી', flag: '🇮🇳' },
    { code: 'kn', name: 'ಕನ್ನಡ', flag: '🇮🇳' },
    { code: 'ml', name: 'മലയാളം', flag: '🇮🇳' },
    { code: 'pa', name: 'ਪੰਜਾਬੀ', flag: '🇮🇳' },
    { code: 'or', name: 'ଓଡ଼ିଆ', flag: '🇮🇳' },
    { code: 'as', name: 'অসমীয়া', flag: '🇮🇳' },
    { code: 'ur', name: 'اردو', flag: '🇮🇳' },
    { code: 'ne', name: 'नेपाली', flag: '🇳🇵' },
    { code: 'si', name: 'සිංහල', flag: '🇱🇰' }
  ];

  useEffect(() => {
    if (!isOpen) {
      stopCamera();
      resetAnalysis();
    }
  }, [isOpen]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'environment' // Use back camera on mobile
        }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setCameraActive(true);
        setError(null);
      }
    } catch (err) {
      setError('Unable to access camera. Please check permissions or upload an image instead.');
      console.error('Camera access error:', err);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  };

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0);
        const imageDataUrl = canvas.toDataURL('image/jpeg', 0.8);
        setCapturedImage(imageDataUrl);
        stopCamera();
      }
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        setError('Image size should be less than 10MB');
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setCapturedImage(result);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeImage = async () => {
    if (!capturedImage) return;

    setIsAnalyzing(true);
    setError(null);

    try {
      // Convert base64 to blob
      const response = await fetch(capturedImage);
      const blob = await response.blob();
      
      const result = await analyzeSkinCondition(blob, selectedLanguage);
      setAnalysisResult(result);
      
      // Auto-speak the analysis if enabled
      if (autoSpeak && result) {
        setTimeout(() => {
          handleSpeakAnalysis(result);
        }, 1000); // Small delay to let UI update
      }
    } catch (err) {
      setError('Failed to analyze image. Please try again.');
      console.error('Analysis error:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSpeakAnalysis = async (result?: AnalysisResult) => {
    const analysisToSpeak = result || analysisResult;
    if (!analysisToSpeak) return;

    setIsGeneratingAudio(true);
    try {
      await generateAudioSummary(analysisToSpeak, selectedLanguage);
    } catch (error) {
      console.error('Failed to generate audio:', error);
    } finally {
      setIsGeneratingAudio(false);
    }
  };

  const resetAnalysis = () => {
    setCapturedImage(null);
    setAnalysisResult(null);
    setError(null);
    setIsAnalyzing(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const downloadReport = () => {
    if (!analysisResult || !capturedImage) return;

    const reportContent = `
SKIN ANALYSIS REPORT
Generated on: ${new Date().toLocaleString()}

CONDITION: ${analysisResult.condition}
CONFIDENCE: ${(analysisResult.confidence * 100).toFixed(1)}%
SEVERITY: ${analysisResult.severity.toUpperCase()}

DESCRIPTION:
${analysisResult.description}

RECOMMENDATIONS:
${analysisResult.recommendations.map(rec => `• ${rec}`).join('\n')}

SUGGESTED MEDICATIONS:
${analysisResult.medications.map(med => `• ${med}`).join('\n')}

HOME REMEDIES:
${analysisResult.homeRemedies.map(remedy => `• ${remedy}`).join('\n')}

WHEN TO SEE A DOCTOR:
${analysisResult.whenToSeeDoctor.map(reason => `• ${reason}`).join('\n')}

DISCLAIMER:
This analysis is for informational purposes only and should not replace professional medical advice. Please consult a dermatologist for proper diagnosis and treatment.
    `;

    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `skin-analysis-report-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-neutral-200">
          <div>
            <h2 className="text-xl font-bold text-neutral-900">AI Skin Analysis</h2>
            <p className="text-sm text-neutral-600 mt-1">
              Capture or upload an image for AI-powered skin condition analysis in your language
            </p>
          </div>
          <div className="flex items-center space-x-3">
            {/* Language Selector */}
            <div className="flex items-center space-x-2">
              <Globe className="h-4 w-4 text-neutral-500" />
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="text-sm border border-neutral-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                {languages.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.flag} {lang.name}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Auto-speak toggle */}
            <button
              onClick={() => setAutoSpeak(!autoSpeak)}
              className={`p-2 rounded-full transition-colors ${
                autoSpeak 
                  ? 'bg-primary-100 text-primary-600' 
                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
              }`}
              title={autoSpeak ? 'Auto-speak enabled' : 'Auto-speak disabled'}
            >
              {autoSpeak ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
            </button>
            
            <button
              onClick={onClose}
              className="p-2 hover:bg-neutral-100 rounded-full transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="p-6">
          {!capturedImage && !analysisResult && (
            <div className="space-y-6">
              {/* Camera Section */}
              <Card title="Capture Image">
                <div className="space-y-4">
                  {!cameraActive ? (
                    <div className="text-center py-8">
                      <Camera className="h-16 w-16 text-neutral-400 mx-auto mb-4" />
                      <p className="text-neutral-600 mb-4">
                        Use your camera to capture the skin area you want to analyze
                      </p>
                      <Button
                        onClick={startCamera}
                        variant="primary"
                        leftIcon={<Camera className="h-4 w-4" />}
                      >
                        Start Camera
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="relative bg-black rounded-lg overflow-hidden">
                        <video
                          ref={videoRef}
                          autoPlay
                          playsInline
                          className="w-full h-64 object-cover"
                        />
                        <div className="absolute inset-0 border-2 border-dashed border-white/50 m-4 rounded-lg flex items-center justify-center">
                          <div className="text-white text-center">
                            <p className="text-sm">Position the skin area within this frame</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-center space-x-3">
                        <Button
                          onClick={captureImage}
                          variant="primary"
                          leftIcon={<Camera className="h-4 w-4" />}
                        >
                          Capture Image
                        </Button>
                        <Button
                          onClick={stopCamera}
                          variant="outline"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </Card>

              {/* Upload Section */}
              <Card title="Upload Image">
                <div className="text-center py-8">
                  <Upload className="h-16 w-16 text-neutral-400 mx-auto mb-4" />
                  <p className="text-neutral-600 mb-4">
                    Or upload an existing image from your device
                  </p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    variant="outline"
                    leftIcon={<Upload className="h-4 w-4" />}
                  >
                    Choose Image
                  </Button>
                  <p className="text-xs text-neutral-500 mt-2">
                    Supported formats: JPG, PNG, WebP (Max 10MB)
                  </p>
                </div>
              </Card>

              {/* Guidelines */}
              <Card title="Photography Guidelines">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-success-600 mb-2">✓ Good Practices</h4>
                    <ul className="text-sm text-neutral-600 space-y-1">
                      <li>• Use good lighting (natural light preferred)</li>
                      <li>• Keep the camera steady</li>
                      <li>• Fill the frame with the affected area</li>
                      <li>• Take multiple angles if needed</li>
                      <li>• Clean the area before photographing</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-error-600 mb-2">✗ Avoid</h4>
                    <ul className="text-sm text-neutral-600 space-y-1">
                      <li>• Blurry or out-of-focus images</li>
                      <li>• Poor lighting or shadows</li>
                      <li>• Images that are too far away</li>
                      <li>• Reflections or glare</li>
                      <li>• Covering the area with clothing/jewelry</li>
                    </ul>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {/* Captured Image Preview */}
          {capturedImage && !analysisResult && (
            <Card title="Captured Image">
              <div className="space-y-4">
                <div className="relative">
                  <img
                    src={capturedImage}
                    alt="Captured skin area"
                    className="w-full max-h-96 object-contain rounded-lg border border-neutral-200"
                  />
                </div>
                <div className="flex justify-center space-x-3">
                  <Button
                    onClick={analyzeImage}
                    variant="primary"
                    isLoading={isAnalyzing}
                    leftIcon={!isAnalyzing ? <CheckCircle className="h-4 w-4" /> : undefined}
                  >
                    {isAnalyzing ? 'Analyzing...' : 'Analyze Image'}
                  </Button>
                  <Button
                    onClick={resetAnalysis}
                    variant="outline"
                    leftIcon={<RotateCcw className="h-4 w-4" />}
                  >
                    Retake
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {/* Analysis Results */}
          {analysisResult && (
            <div className="space-y-6">
              <Card title="Analysis Results">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <img
                      src={capturedImage!}
                      alt="Analyzed skin area"
                      className="w-full h-64 object-cover rounded-lg border border-neutral-200"
                    />
                  </div>
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-lg text-neutral-900">
                        {analysisResult.condition}
                      </h3>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-sm text-neutral-600">Confidence:</span>
                        <span className="font-medium">
                          {(analysisResult.confidence * 100).toFixed(1)}%
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          analysisResult.severity === 'mild' ? 'bg-success-100 text-success-800' :
                          analysisResult.severity === 'moderate' ? 'bg-warning-100 text-warning-800' :
                          'bg-error-100 text-error-800'
                        }`}>
                          {analysisResult.severity}
                        </span>
                      </div>
                    </div>
                    <p className="text-neutral-700">{analysisResult.description}</p>
                    
                    {/* Language and Audio Controls */}
                    <div className="flex items-center justify-between mt-4 p-3 bg-neutral-50 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-neutral-600">Analysis Language:</span>
                        <span className="font-medium text-neutral-900">
                          {languages.find(lang => lang.code === selectedLanguage)?.name || 'Hindi'}
                        </span>
                      </div>
                      <Button
                        onClick={() => handleSpeakAnalysis()}
                        variant="outline"
                        size="sm"
                        isLoading={isGeneratingAudio}
                        leftIcon={<Volume2 className="h-4 w-4" />}
                      >
                        {isGeneratingAudio ? 'Speaking...' : 'Speak Analysis'}
                      </Button>
                    </div>
                    
                    {/* CNN Model Predictions */}
                    {analysisResult.modelPredictions && Array.isArray(analysisResult.modelPredictions) && analysisResult.modelPredictions.length > 0 && (
                      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <h4 className="font-medium text-blue-900 mb-2">🧠 CNN Model Analysis (MobileNetV3)</h4>
                        <div className="space-y-1">
                          {analysisResult.modelPredictions.slice(0, 3).map((pred, index) => (
                            <div key={index} className="flex justify-between items-center text-sm">
                              <span className="text-blue-800 capitalize">{pred.condition.replace(/_/g, ' ')}</span>
                              <div className="flex items-center space-x-2">
                                <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                                  pred.category === 'melanoma' ? 'bg-error-100 text-error-800' :
                                  pred.category === 'acne' ? 'bg-warning-100 text-warning-800' :
                                  pred.category === 'injury' ? 'bg-orange-100 text-orange-800' :
                                  'bg-blue-100 text-blue-800'
                                }`}>
                                  {pred.category}
                                </span>
                                <span className="text-blue-700 font-medium">
                                  {(pred.confidence * 100).toFixed(1)}%
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </Card>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card title="🚨 Immediate First Aid">
                  <ul className="space-y-2">
                    {analysisResult.firstAid && Array.isArray(analysisResult.firstAid) && analysisResult.firstAid.map((aid, index) => (
                      <li key={index} className="flex items-start">
                        <span className="inline-block w-6 h-6 bg-error-500 text-white rounded-full text-xs flex items-center justify-center mt-0.5 mr-2 flex-shrink-0 font-bold">
                          {index + 1}
                        </span>
                        <span className="text-sm text-neutral-700 font-medium">{aid}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-4">
                    <Button
                      onClick={() => handleSpeakAnalysis()}
                      variant="outline"
                      size="sm"
                      leftIcon={<Volume2 className="h-4 w-4" />}
                    >
                      Speak First Aid Steps
                    </Button>
                  </div>
                  {analysisResult.injuryType && (
                    <div className="mt-4 p-3 bg-error-50 border border-error-200 rounded-lg">
                      <div className="flex items-center">
                        <AlertCircle className="h-4 w-4 text-error-600 mr-2" />
                        <span className="text-sm font-medium text-error-800">
                          Injury Type: {analysisResult.injuryType.charAt(0).toUpperCase() + analysisResult.injuryType.slice(1)}
                        </span>
                      </div>
                      <p className="text-xs text-error-700 mt-1">
                        Expected healing: {analysisResult.healingTimeline}
                      </p>
                    </div>
                  )}
                </Card>

                <Card title="Recommendations">
                  <ul className="space-y-2">
                    {analysisResult.recommendations && Array.isArray(analysisResult.recommendations) && analysisResult.recommendations.map((rec, index) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle className="h-4 w-4 text-success-500 mt-0.5 mr-2 flex-shrink-0" />
                        <span className="text-sm text-neutral-700">{rec}</span>
                      </li>
                    ))}
                  </ul>
                </Card>

                <Card title="Suggested Medications">
                  <ul className="space-y-2">
                    {analysisResult.medications && Array.isArray(analysisResult.medications) && analysisResult.medications.map((med, index) => (
                      <li key={index} className="flex items-start">
                        <span className="inline-block w-2 h-2 bg-primary-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                        <span className="text-sm text-neutral-700">{med}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card title="🔍 Possible Causes">
                  <ul className="space-y-2">
                    {analysisResult.possibleCauses && Array.isArray(analysisResult.possibleCauses) && analysisResult.possibleCauses.map((cause, index) => (
                      <li key={index} className="flex items-start">
                        <span className="inline-block w-2 h-2 bg-warning-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                        <span className="text-sm text-neutral-700">{cause}</span>
                      </li>
                    ))}
                  </ul>
                </Card>

                <Card title="🛡️ Prevention Tips">
                  <ul className="space-y-2">
                    {analysisResult.preventionTips && Array.isArray(analysisResult.preventionTips) && analysisResult.preventionTips.map((tip, index) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle className="h-4 w-4 text-success-500 mt-0.5 mr-2 flex-shrink-0" />
                        <span className="text-sm text-neutral-700">{tip}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card title="Home Remedies">
                  <ul className="space-y-2">
                    {analysisResult.homeRemedies && Array.isArray(analysisResult.homeRemedies) && analysisResult.homeRemedies.map((remedy, index) => (
                      <li key={index} className="flex items-start">
                        <span className="inline-block w-2 h-2 bg-secondary-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                        <span className="text-sm text-neutral-700">{remedy}</span>
                      </li>
                    ))}
                  </ul>
                </Card>

                <Card title="When to See a Doctor">
                  <ul className="space-y-2">
                    {analysisResult.whenToSeeDoctor && Array.isArray(analysisResult.whenToSeeDoctor) && analysisResult.whenToSeeDoctor.map((reason, index) => (
                      <li key={index} className="flex items-start">
                        <AlertCircle className="h-4 w-4 text-error-500 mt-0.5 mr-2 flex-shrink-0" />
                        <span className="text-sm text-neutral-700">{reason}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              </div>

              <Card>
                <div className="bg-warning-50 border border-warning-200 rounded-lg p-4">
                  <div className="flex items-start">
                    <AlertCircle className="h-5 w-5 text-warning-600 mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-warning-800">Medical Disclaimer</h4>
                      <p className="text-sm text-warning-700 mt-1">
                        This AI analysis is for informational purposes only and should not replace professional medical advice. 
                        Please consult a qualified dermatologist or healthcare provider for proper diagnosis and treatment.
                      </p>
                    </div>
                  </div>
                </div>
              </Card>

              <div className="flex justify-center space-x-3">
                <Button
                  onClick={() => handleSpeakAnalysis()}
                  variant="outline"
                  isLoading={isGeneratingAudio}
                  leftIcon={<Volume2 className="h-4 w-4" />}
                >
                  {isGeneratingAudio ? 'Speaking...' : 'Speak Full Analysis'}
                </Button>
                <Button
                  onClick={downloadReport}
                  variant="outline"
                  leftIcon={<Download className="h-4 w-4" />}
                >
                  Download Report
                </Button>
                <Button
                  onClick={resetAnalysis}
                  variant="primary"
                  leftIcon={<RotateCcw className="h-4 w-4" />}
                >
                  Analyze Another Image
                </Button>
              </div>
            </div>
          )}

          {/* Error Display */}
          {error && (
            <div className="bg-error-50 border border-error-200 rounded-lg p-4">
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 text-error-600 mr-2" />
                <p className="text-error-700">{error}</p>
              </div>
            </div>
          )}
        </div>

        <canvas ref={canvasRef} className="hidden" />
      </div>
    </div>
  );
};

export default SkinAnalysis;