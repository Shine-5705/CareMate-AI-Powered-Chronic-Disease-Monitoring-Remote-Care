import React, { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, X, AlertCircle, CheckCircle, Loader, Volume2, VolumeX, Globe, Download, Play, Square } from 'lucide-react';
import Button from '../common/Button';
import Card from '../common/Card';
import { analyzeCoughAudio, CoughAnalysisResult } from '../../api/cough-analysis';

interface CoughAnalysisProps {
  isOpen: boolean;
  onClose: () => void;
}

const CoughAnalysis: React.FC<CoughAnalysisProps> = ({ isOpen, onClose }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [analysisResult, setAnalysisResult] = useState<CoughAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState('hi');
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

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
      stopRecording();
      resetAnalysis();
    }
  }, [isOpen]);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: 44100,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: false, // Keep natural cough sounds
          autoGainControl: false,
        }
      });

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });

      mediaRecorderRef.current = mediaRecorder;
      streamRef.current = stream;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setAudioBlob(audioBlob);
        stream.getTracks().forEach(track => track.stop());
        setIsRecording(false);
        if (timerRef.current) {
          clearInterval(timerRef.current);
        }
      };

      setIsRecording(true);
      setRecordingTime(0);
      setError(null);
      mediaRecorder.start();

      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => {
          if (prev >= 29) {
            stopRecording();
            return 30;
          }
          return prev + 1;
        });
      }, 1000);

      // Auto-stop after 30 seconds
      setTimeout(() => {
        if (mediaRecorder.state === 'recording') {
          stopRecording();
        }
      }, 30000);

    } catch (err) {
      setError('Unable to access microphone. Please check permissions.');
      console.error('Recording error:', err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    setIsRecording(false);
  };

  const analyzeAudio = async () => {
    if (!audioBlob) return;

    setIsAnalyzing(true);
    setError(null);

    try {
      const result = await analyzeCoughAudio(audioBlob, selectedLanguage);
      setAnalysisResult(result);
    } catch (err) {
      setError('Failed to analyze audio. Please try again.');
      console.error('Analysis error:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const playRecordedAudio = () => {
    if (!audioBlob) return;

    if (isPlayingAudio) {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      setIsPlayingAudio(false);
      return;
    }

    const audioUrl = URL.createObjectURL(audioBlob);
    const audio = new Audio(audioUrl);
    audioRef.current = audio;

    audio.onplay = () => setIsPlayingAudio(true);
    audio.onended = () => {
      setIsPlayingAudio(false);
      URL.revokeObjectURL(audioUrl);
    };
    audio.onerror = () => {
      setIsPlayingAudio(false);
      URL.revokeObjectURL(audioUrl);
    };

    audio.play();
  };

  const speakAnalysis = (text: string) => {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      
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
      utterance.rate = 0.8;
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

  const resetAnalysis = () => {
    setAudioBlob(null);
    setAnalysisResult(null);
    setError(null);
    setIsAnalyzing(false);
    setRecordingTime(0);
    setIsPlayingAudio(false);
    setIsSpeaking(false);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
  };

  const downloadReport = () => {
    if (!analysisResult) return;

    const reportContent = `
COUGH & RESPIRATORY ANALYSIS REPORT
Generated on: ${new Date().toLocaleString()}

DETECTION RESULT: ${analysisResult.coughDetected ? 'COUGH DETECTED' : 'NO COUGH DETECTED'}
CONFIDENCE: ${(analysisResult.confidence * 100).toFixed(1)}%
SEVERITY: ${analysisResult.severity?.toUpperCase() || 'N/A'}

ANALYSIS:
${analysisResult.analysis}

RECOMMENDATIONS:
${analysisResult.recommendations.map(rec => `• ${rec}`).join('\n')}

HOME REMEDIES:
${analysisResult.homeRemedies.map(remedy => `• ${remedy}`).join('\n')}

WHEN TO SEE A DOCTOR:
${analysisResult.whenToSeeDoctor.map(reason => `• ${reason}`).join('\n')}

PREVENTION TIPS:
${analysisResult.preventionTips.map(tip => `• ${tip}`).join('\n')}

DISCLAIMER:
This analysis is for informational purposes only and should not replace professional medical advice. Please consult a healthcare provider for proper diagnosis and treatment.
    `;

    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cough-analysis-report-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (!isOpen) return null;

  const currentLanguage = languages.find(lang => lang.code === selectedLanguage) || languages[0];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-neutral-200 bg-gradient-to-r from-secondary-500 to-secondary-600 text-white rounded-t-2xl">
          <div>
            <h2 className="text-xl font-bold">🫁 Cough & Respiratory Analysis</h2>
            <p className="text-sm opacity-90 mt-1">
              Record 30 seconds of audio for AI-powered cough detection and respiratory health analysis
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <Globe className="h-4 w-4" />
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
            </div>
            
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="p-6">
          {!audioBlob && !analysisResult && (
            <div className="space-y-6">
              <Card title="Audio Recording Instructions">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-success-600 mb-3">✓ For Best Results</h4>
                    <ul className="text-sm text-neutral-600 space-y-2">
                      <li>• Find a quiet environment</li>
                      <li>• Speak naturally or cough if you have symptoms</li>
                      <li>• Hold the device 6-12 inches from your mouth</li>
                      <li>• Include any breathing sounds or symptoms</li>
                      <li>• Record for the full 30 seconds</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-warning-600 mb-3">⚠️ Important Notes</h4>
                    <ul className="text-sm text-neutral-600 space-y-2">
                      <li>• This is a screening tool, not a medical diagnosis</li>
                      <li>• Consult a doctor for persistent symptoms</li>
                      <li>• Recording will be processed locally</li>
                      <li>• No audio data is permanently stored</li>
                    </ul>
                  </div>
                </div>
              </Card>

              <Card title="Record Audio Sample">
                <div className="text-center py-8">
                  {!isRecording ? (
                    <div>
                      <div className="h-24 w-24 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Mic className="h-12 w-12 text-secondary-600" />
                      </div>
                      <h3 className="text-lg font-semibold text-neutral-900 mb-2">Ready to Record</h3>
                      <p className="text-neutral-600 mb-6">
                        Click the button below to start a 30-second recording session
                      </p>
                      <Button
                        onClick={startRecording}
                        variant="primary"
                        size="lg"
                        leftIcon={<Mic className="h-5 w-5" />}
                      >
                        Start 30-Second Recording
                      </Button>
                    </div>
                  ) : (
                    <div>
                      <div className="h-24 w-24 bg-error-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                        <MicOff className="h-12 w-12 text-error-600" />
                      </div>
                      <h3 className="text-lg font-semibold text-neutral-900 mb-2">Recording in Progress</h3>
                      <div className="text-3xl font-bold text-error-600 mb-4">
                        {30 - recordingTime}s
                      </div>
                      <div className="w-full bg-neutral-200 rounded-full h-2 mb-4">
                        <div 
                          className="bg-error-500 h-2 rounded-full transition-all duration-1000"
                          style={{ width: `${(recordingTime / 30) * 100}%` }}
                        ></div>
                      </div>
                      <p className="text-neutral-600 mb-6">
                        Speak naturally, cough if you have symptoms, or breathe normally
                      </p>
                      <Button
                        onClick={stopRecording}
                        variant="outline"
                        leftIcon={<Square className="h-4 w-4" />}
                      >
                        Stop Recording
                      </Button>
                    </div>
                  )}
                </div>
              </Card>
            </div>
          )}

          {audioBlob && !analysisResult && (
            <Card title="Recorded Audio">
              <div className="space-y-4">
                <div className="flex items-center justify-center p-6 bg-neutral-50 rounded-lg border border-neutral-200">
                  <div className="text-center">
                    <div className="h-16 w-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Volume2 className="h-8 w-8 text-secondary-600" />
                    </div>
                    <p className="font-medium text-neutral-900 mb-2">Audio Recorded Successfully</p>
                    <p className="text-sm text-neutral-600 mb-4">Duration: {recordingTime} seconds</p>
                    
                    <div className="flex justify-center space-x-3">
                      <Button
                        onClick={playRecordedAudio}
                        variant="outline"
                        leftIcon={isPlayingAudio ? <Square className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                      >
                        {isPlayingAudio ? 'Stop' : 'Play Recording'}
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-center space-x-3">
                  <Button
                    onClick={analyzeAudio}
                    variant="primary"
                    isLoading={isAnalyzing}
                    leftIcon={!isAnalyzing ? <CheckCircle className="h-4 w-4" /> : undefined}
                  >
                    {isAnalyzing ? 'Analyzing Audio...' : 'Analyze for Cough & Respiratory Issues'}
                  </Button>
                  <Button
                    onClick={resetAnalysis}
                    variant="outline"
                  >
                    Record Again
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {analysisResult && (
            <div className="space-y-6">
              <Card title="Cough & Respiratory Analysis Results">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className={`p-4 rounded-lg border-2 ${
                      analysisResult.coughDetected 
                        ? 'bg-warning-50 border-warning-200' 
                        : 'bg-success-50 border-success-200'
                    }`}>
                      <div className="flex items-center">
                        {analysisResult.coughDetected ? (
                          <AlertCircle className="h-6 w-6 text-warning-600 mr-3" />
                        ) : (
                          <CheckCircle className="h-6 w-6 text-success-600 mr-3" />
                        )}
                        <div>
                          <h3 className={`font-semibold text-lg ${
                            analysisResult.coughDetected ? 'text-warning-800' : 'text-success-800'
                          }`}>
                            {analysisResult.coughDetected ? '🚨 Cough Detected' : '✅ No Cough Detected'}
                          </h3>
                          <p className={`text-sm ${
                            analysisResult.coughDetected ? 'text-warning-700' : 'text-success-700'
                          }`}>
                            Confidence: {(analysisResult.confidence * 100).toFixed(1)}%
                          </p>
                        </div>
                      </div>
                    </div>

                    {analysisResult.severity && (
                      <div className="p-3 bg-neutral-50 rounded-lg">
                        <span className="text-sm text-neutral-600">Severity Assessment:</span>
                        <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                          analysisResult.severity === 'mild' ? 'bg-success-100 text-success-800' :
                          analysisResult.severity === 'moderate' ? 'bg-warning-100 text-warning-800' :
                          'bg-error-100 text-error-800'
                        }`}>
                          {analysisResult.severity.charAt(0).toUpperCase() + analysisResult.severity.slice(1)}
                        </span>
                      </div>
                    )}

                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <h4 className="font-medium text-blue-900 mb-2">🤖 AI Analysis</h4>
                      <p className="text-sm text-blue-800">{analysisResult.analysis}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-neutral-600">Analysis Language:</span>
                        <span className="font-medium text-neutral-900">{currentLanguage.name}</span>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          onClick={() => speakAnalysis(analysisResult.analysis)}
                          variant="outline"
                          size="sm"
                          leftIcon={isSpeaking ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                        >
                          {isSpeaking ? 'Stop' : 'Speak'}
                        </Button>
                        {isSpeaking && (
                          <Button
                            onClick={stopSpeaking}
                            variant="outline"
                            size="sm"
                            leftIcon={<Square className="h-4 w-4" />}
                          >
                            Stop
                          </Button>
                        )}
                      </div>
                    </div>

                    <div className="flex justify-center space-x-3">
                      <Button
                        onClick={playRecordedAudio}
                        variant="outline"
                        size="sm"
                        leftIcon={isPlayingAudio ? <Square className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                      >
                        {isPlayingAudio ? 'Stop Audio' : 'Play Recording'}
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card title="🏠 Home Remedies & Care">
                  <ul className="space-y-2">
                    {analysisResult.homeRemedies.map((remedy, index) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle className="h-4 w-4 text-success-500 mt-0.5 mr-2 flex-shrink-0" />
                        <span className="text-sm text-neutral-700">{remedy}</span>
                      </li>
                    ))}
                  </ul>
                </Card>

                <Card title="💊 Recommendations">
                  <ul className="space-y-2">
                    {analysisResult.recommendations.map((rec, index) => (
                      <li key={index} className="flex items-start">
                        <span className="inline-block w-2 h-2 bg-primary-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                        <span className="text-sm text-neutral-700">{rec}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card title="🚨 When to See a Doctor">
                  <ul className="space-y-2">
                    {analysisResult.whenToSeeDoctor.map((reason, index) => (
                      <li key={index} className="flex items-start">
                        <AlertCircle className="h-4 w-4 text-error-500 mt-0.5 mr-2 flex-shrink-0" />
                        <span className="text-sm text-neutral-700">{reason}</span>
                      </li>
                    ))}
                  </ul>
                </Card>

                <Card title="🛡️ Prevention Tips">
                  <ul className="space-y-2">
                    {analysisResult.preventionTips.map((tip, index) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle className="h-4 w-4 text-success-500 mt-0.5 mr-2 flex-shrink-0" />
                        <span className="text-sm text-neutral-700">{tip}</span>
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
                        This AI-powered cough analysis is for informational purposes only and should not replace professional medical advice. 
                        Please consult a qualified healthcare provider for proper diagnosis and treatment, especially if symptoms persist or worsen.
                      </p>
                    </div>
                  </div>
                </div>
              </Card>

              <div className="flex justify-center space-x-3">
                <Button
                  onClick={() => speakAnalysis(analysisResult.analysis)}
                  variant="outline"
                  leftIcon={<Volume2 className="h-4 w-4" />}
                >
                  Speak Full Analysis
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
                >
                  Analyze Another Recording
                </Button>
              </div>
            </div>
          )}

          {error && (
            <div className="bg-error-50 border border-error-200 rounded-lg p-4">
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 text-error-600 mr-2" />
                <p className="text-error-700">{error}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CoughAnalysis;