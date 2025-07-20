import React from 'react';
import { Link } from 'react-router-dom';
import { Activity, CheckCircle, Calendar, MessageSquare, ChevronRight, Camera } from 'lucide-react';
import Button from '../components/common/Button';

const Landing: React.FC = () => {
  // Event listeners for feature interactions
  React.useEffect(() => {
    const handleOpenSkinAnalysis = () => {
      // Redirect to login if not authenticated, otherwise open skin analysis
      window.location.href = '/login';
    };

    const handleOpenCoughAnalysis = () => {
      window.location.href = '/login';
    };

    const handleOpenAIAssistant = () => {
      window.location.href = '/login';
    };

    const handleOpenHealthGame = () => {
      window.location.href = '/login';
    };

    window.addEventListener('openSkinAnalysis', handleOpenSkinAnalysis);
    window.addEventListener('openCoughAnalysis', handleOpenCoughAnalysis);
    window.addEventListener('openAIAssistant', handleOpenAIAssistant);
    window.addEventListener('openHealthGame', handleOpenHealthGame);

    return () => {
      window.removeEventListener('openSkinAnalysis', handleOpenSkinAnalysis);
      window.removeEventListener('openCoughAnalysis', handleOpenCoughAnalysis);
      window.removeEventListener('openAIAssistant', handleOpenAIAssistant);
      window.removeEventListener('openHealthGame', handleOpenHealthGame);
    };
  }, []);

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-50 to-secondary-50 opacity-70"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-24 sm:pt-24 sm:pb-32">
          <div className="lg:grid lg:grid-cols-12 lg:gap-8">
            <div className="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left">
              <h1 className="text-4xl font-extrabold tracking-tight text-neutral-900 sm:text-5xl md:text-6xl lg:text-5xl xl:text-6xl">
                <span className="block">Simplifying</span>{' '}
                <span className="block text-primary-500">Chronic Care Management</span>
              </h1>
              <p className="mt-6 text-base text-neutral-600 sm:text-lg md:text-xl">
                CareMate helps patients and healthcare providers manage chronic conditions more effectively through 
                easy vitals tracking, secure communication, personalized care plans, and immersive AR fitness adventures.
              </p>
              <div className="mt-8 sm:max-w-lg sm:mx-auto sm:text-center lg:text-left lg:mx-0">
                <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
                  <Link to="/signup">
                    <Button 
                      variant="primary" 
                      size="lg" 
                      className="w-full sm:w-auto"
                      rightIcon={<ChevronRight className="h-4 w-4" />}
                    >
                      Get Started
                    </Button>
                  </Link>
                  <Link to="/features">
                    <Button 
                      variant="outline" 
                      size="lg" 
                      className="w-full sm:w-auto"
                    >
                      Learn More
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
            <div className="mt-12 relative sm:max-w-lg sm:mx-auto lg:mt-0 lg:max-w-none lg:mx-0 lg:col-span-6 lg:flex lg:items-center">
              <div className="relative mx-auto w-full rounded-lg shadow-lg lg:max-w-md">
                <div className="relative block w-full bg-white rounded-lg overflow-hidden">
                  <img
                    className="w-full"
                    src="https://images.pexels.com/photos/7089401/pexels-photo-7089401.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                    alt="Doctor with a patient using a tablet"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-white sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-base font-semibold text-primary-500 tracking-wide uppercase">Features</h2>
            <p className="mt-1 text-3xl font-extrabold text-neutral-900 sm:text-4xl sm:tracking-tight">
              Everything you need to manage chronic care
            </p>
            <p className="max-w-xl mt-5 mx-auto text-xl text-neutral-600">
              Our platform provides powerful tools for patients and healthcare providers to collaborate effectively.
            </p>
          </div>

          <div className="mt-16">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {/* AI Health Assistant */}
              <div className="pt-6">
                <Link to="/login" className="block group">
                  <div className="flow-root rounded-lg px-6 pb-8 bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-200 hover:border-blue-300 transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1">
                    <div className="-mt-6">
                      <div>
                        <span className="inline-flex items-center justify-center p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-md shadow-lg">
                          <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                        </span>
                      </div>
                      <h3 className="mt-8 text-lg font-medium text-neutral-900 tracking-tight group-hover:text-blue-600 transition-colors">AI Health Assistant</h3>
                      <p className="mt-5 text-base text-neutral-600">
                        Chat with AI in 15+ Indian languages including Hindi, Bengali, Telugu, Tamil, and more. Get instant health guidance and symptom analysis.
                      </p>
                      <div className="mt-4 flex items-center text-sm text-blue-600 font-medium">
                        <span>15+ Languages • Voice Input • Real-time Chat</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>

              {/* AI Skin Analysis */}
              <div className="pt-6">
                <Link to="/login" className="block group">
                  <div className="flow-root rounded-lg px-6 pb-8 bg-gradient-to-br from-green-50 to-teal-50 border border-green-200 hover:border-green-300 transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1">
                    <div className="-mt-6">
                      <div>
                        <span className="inline-flex items-center justify-center p-3 bg-gradient-to-br from-green-500 to-teal-600 rounded-md shadow-lg">
                          <Camera className="h-6 w-6 text-white" />
                        </span>
                      </div>
                      <h3 className="mt-8 text-lg font-medium text-neutral-900 tracking-tight group-hover:text-green-600 transition-colors">AI Skin Analysis</h3>
                      <p className="mt-5 text-base text-neutral-600">
                        Capture images of skin conditions and get AI-powered analysis with treatment recommendations, first aid steps, and home remedies.
                      </p>
                      <div className="mt-4 flex items-center text-sm text-green-600 font-medium">
                        <span>Computer Vision • Treatment Plans • Emergency Detection</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>

              {/* Cough & Respiratory Analysis */}
              <div className="pt-6">
                <Link to="/login" className="block group">
                  <div className="flow-root rounded-lg px-6 pb-8 bg-gradient-to-br from-orange-50 to-red-50 border border-orange-200 hover:border-orange-300 transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1">
                    <div className="-mt-6">
                      <div>
                        <span className="inline-flex items-center justify-center p-3 bg-gradient-to-br from-orange-500 to-red-600 rounded-md shadow-lg">
                          <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a5 5 0 1110 0v6a3 3 0 01-3 3z" />
                          </svg>
                        </span>
                      </div>
                      <h3 className="mt-8 text-lg font-medium text-neutral-900 tracking-tight group-hover:text-orange-600 transition-colors">Cough & Respiratory Analysis</h3>
                      <p className="mt-5 text-base text-neutral-600">
                        30-second audio recording with AI-powered cough detection and respiratory health assessment in multiple Indian languages.
                      </p>
                      <div className="mt-4 flex items-center text-sm text-orange-600 font-medium">
                        <span>Audio AI • 30s Recording • Health Recommendations</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>

              {/* EcoFit AR Adventure */}
              <div className="pt-6">
                <Link to="/login" className="block group">
                  <div className="flow-root rounded-lg px-6 pb-8 bg-gradient-to-br from-emerald-50 to-green-50 border border-emerald-200 hover:border-emerald-300 transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1">
                    <div className="-mt-6">
                      <div>
                        <span className="inline-flex items-center justify-center p-3 bg-gradient-to-br from-emerald-500 to-green-600 rounded-md shadow-lg text-xl">
                          🌍
                        </span>
                      </div>
                      <h3 className="mt-8 text-lg font-medium text-neutral-900 tracking-tight group-hover:text-emerald-600 transition-colors">EcoFit AR Adventure</h3>
                      <p className="mt-5 text-base text-neutral-600">
                        Immersive AR fitness game where exercises become rescue powers to save animals and restore habitats through real-world movements.
                      </p>
                      <div className="mt-4 flex items-center text-sm text-emerald-600 font-medium">
                        <span>AR Gaming • Animal Rescue • Fitness Tracking</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>

              {/* Vitals Tracking */}
              <div className="pt-6">
                <Link to="/vitals" className="block group">
                  <div className="flow-root rounded-lg px-6 pb-8">
                    <div className="-mt-6">
                      <div>
                        <span className="inline-flex items-center justify-center p-3 bg-primary-500 rounded-md shadow-lg">
                          <Activity className="h-6 w-6 text-white" />
                        </span>
                      </div>
                      <h3 className="mt-8 text-lg font-medium text-neutral-900 tracking-tight group-hover:text-primary-600 transition-colors">Vitals Tracking</h3>
                      <p className="mt-5 text-base text-neutral-600">
                        Easily track and monitor vital signs like blood pressure, glucose levels, and pulse rate with interactive charts.
                      </p>
                      <div className="mt-4 flex items-center text-sm text-primary-600 font-medium">
                        <span>Interactive Charts • Daily Logging • Trend Analysis</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>

              {/* Care Plans */}
              <div className="pt-6">
                <Link to="/care-plans" className="block group">
                  <div className="flow-root rounded-lg px-6 pb-8">
                    <div className="-mt-6">
                      <div>
                        <span className="inline-flex items-center justify-center p-3 bg-primary-500 rounded-md shadow-lg">
                          <CheckCircle className="h-6 w-6 text-white" />
                        </span>
                      </div>
                      <h3 className="mt-8 text-lg font-medium text-neutral-900 tracking-tight group-hover:text-primary-600 transition-colors">Care Plans</h3>
                      <p className="mt-5 text-base text-neutral-600">
                        Personalized care plans created by your healthcare provider with tasks and goals for managing your condition.
                      </p>
                      <div className="mt-4 flex items-center text-sm text-primary-600 font-medium">
                        <span>Personalized Plans • Task Management • Progress Tracking</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>

              {/* Secure Messaging */}
              <div className="pt-6">
                <Link to="/messages" className="block group">
                  <div className="flow-root rounded-lg px-6 pb-8">
                    <div className="-mt-6">
                      <div>
                        <span className="inline-flex items-center justify-center p-3 bg-primary-500 rounded-md shadow-lg">
                          <MessageSquare className="h-6 w-6 text-white" />
                        </span>
                      </div>
                      <h3 className="mt-8 text-lg font-medium text-neutral-900 tracking-tight group-hover:text-primary-600 transition-colors">Secure Messaging</h3>
                      <p className="mt-5 text-base text-neutral-600">
                        Communicate directly with your healthcare provider through secure, HIPAA-compliant messaging with real-time notifications.
                      </p>
                      <div className="mt-4 flex items-center text-sm text-primary-600 font-medium">
                        <span>HIPAA Compliant • Real-time • File Sharing</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>

              {/* Appointments */}
              <div className="pt-6">
                <Link to="/appointments" className="block group">
                  <div className="flow-root rounded-lg px-6 pb-8">
                    <div className="-mt-6">
                      <div>
                        <span className="inline-flex items-center justify-center p-3 bg-primary-500 rounded-md shadow-lg">
                          <Calendar className="h-6 w-6 text-white" />
                        </span>
                      </div>
                      <h3 className="mt-8 text-lg font-medium text-neutral-900 tracking-tight group-hover:text-primary-600 transition-colors">Appointment Management</h3>
                      <p className="mt-5 text-base text-neutral-600">
                        Schedule and manage appointments with your healthcare provider with calendar integration and automated reminders.
                      </p>
                      <div className="mt-4 flex items-center text-sm text-primary-600 font-medium">
                        <span>Calendar Integration • Reminders • Rescheduling</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>

              {/* Profile Management */}
              <div className="pt-6">
                <Link to="/profile" className="block group">
                  <div className="flow-root rounded-lg px-6 pb-8">
                    <div className="-mt-6">
                      <div>
                        <span className="inline-flex items-center justify-center p-3 bg-primary-500 rounded-md shadow-lg">
                          <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </span>
                      </div>
                      <h3 className="mt-8 text-lg font-medium text-neutral-900 tracking-tight group-hover:text-primary-600 transition-colors">Profile Management</h3>
                      <p className="mt-5 text-base text-neutral-600">
                        Manage your personal information, medical history, emergency contacts, and download medical documents.
                      </p>
                      <div className="mt-4 flex items-center text-sm text-primary-600 font-medium">
                        <span>Medical History • Emergency Contacts • Document Downloads</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>

              {/* Notifications */}
              <div className="pt-6">
                <Link to="/notifications" className="block group">
                  <div className="flow-root rounded-lg px-6 pb-8">
                    <div className="-mt-6">
                      <div>
                        <span className="inline-flex items-center justify-center p-3 bg-primary-500 rounded-md shadow-lg">
                          <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM11 19H6a2 2 0 01-2-2V7a2 2 0 012-2h5m5 0v5" />
                          </svg>
                        </span>
                      </div>
                      <h3 className="mt-8 text-lg font-medium text-neutral-900 tracking-tight group-hover:text-primary-600 transition-colors">Smart Notifications</h3>
                      <p className="mt-5 text-base text-neutral-600">
                        Receive intelligent health alerts, medication reminders, appointment notifications, and emergency alerts.
                      </p>
                      <div className="mt-4 flex items-center text-sm text-primary-600 font-medium">
                        <span>Medication Reminders • Health Alerts • Custom Notifications</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>

              {/* Settings & Preferences */}
              <div className="pt-6">
                <Link to="/settings" className="block group">
                  <div className="flow-root rounded-lg px-6 pb-8">
                    <div className="-mt-6">
                      <div>
                        <span className="inline-flex items-center justify-center p-3 bg-primary-500 rounded-md shadow-lg">
                          <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        </span>
                      </div>
                      <h3 className="mt-8 text-lg font-medium text-neutral-900 tracking-tight group-hover:text-primary-600 transition-colors">Settings & Preferences</h3>
                      <p className="mt-5 text-base text-neutral-600">
                        Customize notification preferences, security settings, data export options, and account management features.
                      </p>
                      <div className="mt-4 flex items-center text-sm text-primary-600 font-medium">
                        <span>Privacy Controls • Data Export • Security Settings</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>

              {/* Multi-language Support */}
              <div className="pt-6">
                <div className="flow-root rounded-lg px-6 pb-8">
                  <div className="-mt-6">
                    <div>
                      <span className="inline-flex items-center justify-center p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-md shadow-lg">
                        <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                        </svg>
                      </span>
                    </div>
                    <h3 className="mt-8 text-lg font-medium text-neutral-900 tracking-tight">Multi-language Support</h3>
                    <p className="mt-5 text-base text-neutral-600">
                      Complete support for 15+ Indian languages including Hindi, Bengali, Telugu, Tamil, Gujarati, Kannada, Malayalam, and more.
                    </p>
                    <div className="mt-4 flex items-center text-sm text-indigo-600 font-medium">
                      <span>15+ Languages • Voice Input • Text-to-Speech</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Voice Input & Speech */}
              <div className="pt-6">
                <div className="flow-root rounded-lg px-6 pb-8">
                  <div className="-mt-6">
                    <div>
                      <span className="inline-flex items-center justify-center p-3 bg-gradient-to-br from-pink-500 to-rose-600 rounded-md shadow-lg">
                        <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a5 5 0 1110 0v6a3 3 0 01-3 3z" />
                        </svg>
                      </span>
                    </div>
                    <h3 className="mt-8 text-lg font-medium text-neutral-900 tracking-tight">Voice Input & Speech</h3>
                    <p className="mt-5 text-base text-neutral-600">
                      Advanced voice recognition for Indian languages with text-to-speech responses for accessibility and ease of use.
                    </p>
                    <div className="mt-4 flex items-center text-sm text-pink-600 font-medium">
                      <span>Voice Recognition • Text-to-Speech • Accessibility</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Emergency Features */}
              <div className="pt-6">
                <div className="flow-root rounded-lg px-6 pb-8">
                  <div className="-mt-6">
                    <div>
                      <span className="inline-flex items-center justify-center p-3 bg-gradient-to-br from-red-500 to-red-600 rounded-md shadow-lg">
                        <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                      </span>
                    </div>
                    <h3 className="mt-8 text-lg font-medium text-neutral-900 tracking-tight">Emergency Detection</h3>
                    <p className="mt-5 text-base text-neutral-600">
                      AI-powered emergency detection in health conversations with immediate guidance for urgent medical situations.
                    </p>
                    <div className="mt-4 flex items-center text-sm text-red-600 font-medium">
                      <span>Emergency Detection • Urgent Care Guidance • First Aid</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Data Analytics */}
              <div className="pt-6">
                <div className="flow-root rounded-lg px-6 pb-8">
                  <div className="-mt-6">
                    <div>
                      <span className="inline-flex items-center justify-center p-3 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-md shadow-lg">
                        <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                      </span>
                    </div>
                    <h3 className="mt-8 text-lg font-medium text-neutral-900 tracking-tight">Health Analytics</h3>
                    <p className="mt-5 text-base text-neutral-600">
                      Advanced data visualization with interactive charts, trend analysis, and comprehensive health reports for better insights.
                    </p>
                    <div className="mt-4 flex items-center text-sm text-cyan-600 font-medium">
                      <span>Interactive Charts • Trend Analysis • Health Reports</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="bg-neutral-50 py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-base font-semibold text-primary-500 tracking-wide uppercase">Testimonials</h2>
            <p className="mt-1 text-3xl font-extrabold text-neutral-900 sm:text-4xl sm:tracking-tight">
              Trusted by patients and providers
            </p>
          </div>
          <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <div className="bg-white rounded-xl shadow-soft p-6">
              <div className="flex items-center">
                <img 
                  className="h-12 w-12 rounded-full" 
                  src="https://images.pexels.com/photos/3760263/pexels-photo-3760263.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                  alt="Patient testimonial" 
                />
                <div className="ml-4">
                  <h4 className="text-lg font-medium text-neutral-900">Margaret W.</h4>
                  <p className="text-sm text-neutral-500">Diabetes Patient</p>
                </div>
              </div>
              <p className="mt-4 text-base text-neutral-600">
                "CareMate has completely changed how I manage my diabetes. Being able to track my glucose levels and 
                communicate directly with my doctor gives me peace of mind."
              </p>
            </div>
            
            <div className="bg-white rounded-xl shadow-soft p-6">
              <div className="flex items-center">
                <img 
                  className="h-12 w-12 rounded-full" 
                  src="https://images.pexels.com/photos/5329321/pexels-photo-5329321.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                  alt="Doctor testimonial" 
                />
                <div className="ml-4">
                  <h4 className="text-lg font-medium text-neutral-900">Dr. James R.</h4>
                  <p className="text-sm text-neutral-500">Cardiologist</p>
                </div>
              </div>
              <p className="mt-4 text-base text-neutral-600">
                "As a doctor, CareMate allows me to monitor my patients more effectively between visits. The real-time 
                data helps me make better treatment decisions."
              </p>
            </div>
            
            <div className="bg-white rounded-xl shadow-soft p-6">
              <div className="flex items-center">
                <img 
                  className="h-12 w-12 rounded-full" 
                  src="https://images.pexels.com/photos/3831577/pexels-photo-3831577.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                  alt="Patient testimonial" 
                />
                <div className="ml-4">
                  <h4 className="text-lg font-medium text-neutral-900">Robert M.</h4>
                  <p className="text-sm text-neutral-500">Hypertension Patient</p>
                </div>
              </div>
              <p className="mt-4 text-base text-neutral-600">
                "I've tried many health apps, but CareMate is the only one that truly helps me stay on top of my 
                condition. The reminders and tracking features are invaluable."
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-primary-500">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            <span className="block">Ready to get started?</span>
            <span className="block text-primary-100">Join CareMate today.</span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            <div className="inline-flex rounded-md shadow">
              <Link to="/signup">
                <Button 
                  className="w-full bg-white text-primary-600 hover:bg-primary-50 border-white"
                  size="lg"
                >
                  Get Started
                </Button>
              </Link>
            </div>
            <div className="ml-3 inline-flex rounded-md shadow">
              <Link to="/contact">
                <Button 
                  variant="outline"
                  className="w-full border-white text-white hover:bg-primary-600"
                  size="lg"
                >
                  Contact Sales
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;