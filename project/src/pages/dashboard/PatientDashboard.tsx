import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Activity, Calendar, MessageSquare, ChevronRight, 
  Plus, TrendingUp, Heart, Camera, Mic, Bot, 
  Stethoscope, Pill, Bell, User, Settings,
  FileText, Shield, Zap, Target, Award,
  Map, Compass, Sparkles, Globe
} from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import { useAuth } from '../../context/AuthContext';
import { useAIHealthAssistant } from '../../components/ai/AIHealthAssistantProvider';
import { vitalsData, appointmentsData, carePlansData, notificationsData } from '../../data/mockData';
import SkinAnalysis from '../../components/ai/SkinAnalysis';
import CoughAnalysis from '../../components/ai/CoughAnalysis';
import HealthFitnessGame from '../../components/game/HealthFitnessGame';

// Simple chart component
const VitalsChart: React.FC<{ 
  data: { date: string; value: number }[]; 
  color: string;
  label: string;
}> = ({ data, color, label }) => {
  // Find min and max for scaling
  const values = data.map(item => item.value);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min;
  
  return (
    <div className="h-24">
      <div className="text-xs font-medium text-neutral-500 mb-1">{label}</div>
      <div className="flex items-end h-16 space-x-1">
        {data.map((item, index) => {
          // Scale height between 20% and 100%
          const heightPercentage = range === 0 
            ? 50 
            : 20 + ((item.value - min) / range) * 80;
            
          return (
            <div key={index} className="flex-1 flex flex-col items-center">
              <div 
                className={`w-full rounded-t-sm ${color}`} 
                style={{ height: `${heightPercentage}%` }}
              ></div>
              <div className="text-xs text-neutral-400 mt-1">
                {new Date(item.date).getDate()}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const PatientDashboard: React.FC = () => {
  const { user } = useAuth();
  const { openAssistant } = useAIHealthAssistant();
  const navigate = useNavigate();
  const [showVitalsForm, setShowVitalsForm] = useState(false);
  const [showSkinAnalysis, setShowSkinAnalysis] = useState(false);
  const [showCoughAnalysis, setShowCoughAnalysis] = useState(false);
  const [showHealthGame, setShowHealthGame] = useState(false);
  const [formData, setFormData] = useState({
    systolicBP: '',
    diastolicBP: '',
    glucoseLevel: '',
    pulseRate: '',
    symptoms: '',
  });
  
  // Prepare data for charts
  const lastSevenVitals = vitalsData.slice(-7);
  
  const bpData = lastSevenVitals.map(vital => ({
    date: vital.date,
    value: vital.systolicBP
  }));
  
  const glucoseData = lastSevenVitals.map(vital => ({
    date: vital.date,
    value: vital.glucoseLevel
  }));
  
  const pulseData = lastSevenVitals.map(vital => ({
    date: vital.date,
    value: vital.pulseRate
  }));
  
  // Get upcoming appointments
  const upcomingAppointments = appointmentsData
    .filter(apt => apt.patientId === user?.id && apt.status === 'scheduled')
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 3);
  
  // Get active care plans
  const activeCarePlans = carePlansData
    .filter(plan => plan.patientId === user?.id && plan.active);
  
  // Get recent notifications
  const recentNotifications = notificationsData
    .filter(note => note.userId === user?.id)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 3);

  const handleVitalsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create new vital record
    const newVital = {
      id: `v${Date.now()}`,
      patientId: user?.id || '',
      date: new Date().toISOString().split('T')[0],
      systolicBP: parseInt(formData.systolicBP),
      diastolicBP: parseInt(formData.diastolicBP),
      glucoseLevel: parseInt(formData.glucoseLevel),
      pulseRate: parseInt(formData.pulseRate),
      symptoms: formData.symptoms ? [formData.symptoms] : []
    };

    // Add the new vital to the data
    vitalsData.push(newVital);
    
    // Reset form and close
    setShowVitalsForm(false);
    setFormData({
      systolicBP: '',
      diastolicBP: '',
      glucoseLevel: '',
      pulseRate: '',
      symptoms: '',
    });
  };

  // Get latest vitals for today's stats
  const latestVitals = vitalsData[vitalsData.length - 1];

  // Feature cards data
  const mainFeatures = [
    {
      id: 'ai-assistant',
      title: 'AI Health Assistant',
      description: 'Chat with AI in 15+ Indian languages',
      icon: <Bot className="h-8 w-8" />,
      gradient: 'from-blue-500 to-purple-600',
      action: () => openAssistant(),
      badge: 'AI Powered',
      stats: '15+ Languages'
    },
    {
      id: 'skin-analysis',
      title: 'AI Skin Analysis',
      description: 'Instant skin condition analysis with treatment recommendations',
      icon: <Camera className="h-8 w-8" />,
      gradient: 'from-green-500 to-teal-600',
      action: () => setShowSkinAnalysis(true),
      badge: 'Computer Vision',
      stats: 'Real-time Analysis'
    },
    {
      id: 'cough-analysis',
      title: 'Respiratory Analysis',
      description: 'AI-powered cough detection and respiratory health assessment',
      icon: <Mic className="h-8 w-8" />,
      gradient: 'from-orange-500 to-red-600',
      action: () => setShowCoughAnalysis(true),
      badge: 'Audio AI',
      stats: '30-sec Recording'
    },
    {
      id: 'ecofit-game',
      title: 'EcoFit AR Adventure',
      description: 'Immersive fitness game where exercises rescue animals',
      icon: <span className="text-3xl">🌍</span>,
      gradient: 'from-emerald-500 to-green-600',
      action: () => setShowHealthGame(true),
      badge: 'AR Gaming',
      stats: 'Save Animals'
    }
  ];

  const quickActions = [
    {
      title: 'My Vitals',
      description: 'Track blood pressure, glucose & pulse',
      icon: <Activity className="h-6 w-6" />,
      color: 'bg-primary-500',
      hoverColor: 'hover:bg-primary-600',
      path: '/vitals'
    },
    {
      title: 'Appointments',
      description: 'Schedule & manage doctor visits',
      icon: <Calendar className="h-6 w-6" />,
      color: 'bg-secondary-500',
      hoverColor: 'hover:bg-secondary-600',
      path: '/appointments'
    },
    {
      title: 'Messages',
      description: 'Secure chat with healthcare providers',
      icon: <MessageSquare className="h-6 w-6" />,
      color: 'bg-accent-500',
      hoverColor: 'hover:bg-accent-600',
      path: '/messages'
    },
    {
      title: 'Care Plans',
      description: 'View personalized treatment plans',
      icon: <FileText className="h-6 w-6" />,
      color: 'bg-purple-500',
      hoverColor: 'hover:bg-purple-600',
      path: '/care-plans'
    },
    {
      title: 'Notifications',
      description: 'Health alerts & reminders',
      icon: <Bell className="h-6 w-6" />,
      color: 'bg-warning-500',
      hoverColor: 'hover:bg-warning-600',
      path: '/notifications'
    },
    {
      title: 'Profile',
      description: 'Manage personal information',
      icon: <User className="h-6 w-6" />,
      color: 'bg-neutral-500',
      hoverColor: 'hover:bg-neutral-600',
      path: '/profile'
    },
    {
      title: 'Settings',
      description: 'App preferences & security',
      icon: <Settings className="h-6 w-6" />,
      color: 'bg-slate-500',
      hoverColor: 'hover:bg-slate-600',
      path: '/settings'
    },
    {
      title: 'Health Reports',
      description: 'Download medical reports',
      icon: <TrendingUp className="h-6 w-6" />,
      color: 'bg-indigo-500',
      hoverColor: 'hover:bg-indigo-600',
      path: '/vitals'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-primary-500 to-secondary-500 rounded-2xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.name}! 👋</h1>
                <p className="text-primary-100 text-lg">Your health journey continues today</p>
              </div>
              <div className="hidden md:block">
                <div className="h-20 w-20 rounded-full overflow-hidden bg-white/20 border-2 border-white/30">
                  {user?.profileImage ? (
                    <img 
                      src={user.profileImage} 
                      alt={user.name} 
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <User className="h-full w-full p-4 text-white" />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main AI Features */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-neutral-900 mb-6 flex items-center">
            <Sparkles className="h-6 w-6 mr-2 text-primary-500" />
            AI-Powered Health Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {mainFeatures.map((feature) => (
              <div
                key={feature.id}
                onClick={feature.action}
                className="group cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
              >
                <div className={`bg-gradient-to-br ${feature.gradient} rounded-2xl p-6 text-white shadow-lg relative overflow-hidden`}>
                  <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10"></div>
                  <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/10 rounded-full -ml-8 -mb-8"></div>
                  
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                        {feature.icon}
                      </div>
                      <Badge className="bg-white/20 text-white border-white/30 text-xs">
                        {feature.badge}
                      </Badge>
                    </div>
                    
                    <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                    <p className="text-sm opacity-90 mb-3">{feature.description}</p>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium opacity-75">{feature.stats}</span>
                      <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content area */}
          <div className="lg:col-span-2 space-y-8">
            {/* Health Vitals Overview */}
            <Card 
              title="📊 Health Vitals Overview" 
              subtitle="Your health metrics from the last 7 days"
              className="shadow-lg border-0"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="p-4 bg-gradient-to-br from-primary-50 to-primary-100 rounded-xl border border-primary-200">
                  <VitalsChart 
                    data={bpData} 
                    color="bg-primary-500" 
                    label="Blood Pressure (systolic)" 
                  />
                </div>
                <div className="p-4 bg-gradient-to-br from-secondary-50 to-secondary-100 rounded-xl border border-secondary-200">
                  <VitalsChart 
                    data={glucoseData} 
                    color="bg-secondary-500" 
                    label="Glucose Level" 
                  />
                </div>
                <div className="p-4 bg-gradient-to-br from-accent-50 to-accent-100 rounded-xl border border-accent-200">
                  <VitalsChart 
                    data={pulseData} 
                    color="bg-accent-500" 
                    label="Pulse Rate" 
                  />
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <Button 
                  variant="primary" 
                  className="flex-1"
                  leftIcon={<Plus className="h-4 w-4" />}
                  onClick={() => setShowVitalsForm(!showVitalsForm)}
                >
                  Log Today's Vitals
                </Button>
                <Link to="/vitals" className="flex-1">
                  <Button 
                    variant="outline" 
                    className="w-full"
                    rightIcon={<ChevronRight className="h-4 w-4" />}
                  >
                    View Full History
                  </Button>
                </Link>
              </div>
              
              {showVitalsForm && (
                <div className="mt-6 bg-gradient-to-br from-neutral-50 to-blue-50 p-6 rounded-xl border border-neutral-200 animate-fade-in">
                  <h4 className="font-semibold text-neutral-900 mb-4 flex items-center">
                    <Stethoscope className="h-5 w-5 mr-2 text-primary-500" />
                    Log Today's Vitals
                  </h4>
                  <form onSubmit={handleVitalsSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                          Blood Pressure (mmHg)
                        </label>
                        <div className="flex space-x-2">
                          <input
                            type="number"
                            name="systolicBP"
                            value={formData.systolicBP}
                            onChange={(e) => setFormData(prev => ({ ...prev, systolicBP: e.target.value }))}
                            placeholder="Systolic"
                            className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                            required
                          />
                          <span className="flex items-center text-neutral-500 font-bold">/</span>
                          <input
                            type="number"
                            name="diastolicBP"
                            value={formData.diastolicBP}
                            onChange={(e) => setFormData(prev => ({ ...prev, diastolicBP: e.target.value }))}
                            placeholder="Diastolic"
                            className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                            required
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                          Glucose Level (mg/dL)
                        </label>
                        <input
                          type="number"
                          name="glucoseLevel"
                          value={formData.glucoseLevel}
                          onChange={(e) => setFormData(prev => ({ ...prev, glucoseLevel: e.target.value }))}
                          placeholder="e.g., 95"
                          className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                          Pulse Rate (bpm)
                        </label>
                        <input
                          type="number"
                          name="pulseRate"
                          value={formData.pulseRate}
                          onChange={(e) => setFormData(prev => ({ ...prev, pulseRate: e.target.value }))}
                          placeholder="e.g., 72"
                          className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                          Symptoms (if any)
                        </label>
                        <input
                          type="text"
                          name="symptoms"
                          value={formData.symptoms}
                          onChange={(e) => setFormData(prev => ({ ...prev, symptoms: e.target.value }))}
                          placeholder="e.g., Headache, Fatigue"
                          className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        />
                      </div>
                    </div>
                    <div className="mt-6 flex justify-end space-x-3">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => setShowVitalsForm(false)}
                        type="button"
                      >
                        Cancel
                      </Button>
                      <Button 
                        variant="primary" 
                        size="sm"
                        type="submit"
                        leftIcon={<Heart className="h-4 w-4" />}
                      >
                        Save Vitals
                      </Button>
                    </div>
                  </form>
                </div>
              )}
            </Card>
            
            {/* Quick Actions Grid */}
            <Card 
              title="🚀 Quick Actions" 
              subtitle="Access all your health management tools"
              className="shadow-lg border-0"
            >
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {quickActions.map((action) => (
                  <Link key={action.title} to={action.path}>
                    <div className="group cursor-pointer transform transition-all duration-300 hover:scale-105">
                      <div className="p-4 bg-gradient-to-br from-white to-neutral-50 rounded-xl border border-neutral-200 hover:border-primary-300 hover:shadow-lg transition-all">
                        <div className={`w-12 h-12 ${action.color} ${action.hoverColor} rounded-xl flex items-center justify-center text-white mb-3 mx-auto transition-colors group-hover:shadow-lg`}>
                          {action.icon}
                        </div>
                        <h4 className="font-semibold text-neutral-900 text-sm text-center mb-1">
                          {action.title}
                        </h4>
                        <p className="text-xs text-neutral-600 text-center leading-tight">
                          {action.description}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </Card>

            {/* Upcoming Appointments */}
            <Card 
              title="📅 Upcoming Appointments" 
              subtitle="Your scheduled healthcare visits"
              className="shadow-lg border-0"
            >
              {upcomingAppointments.length > 0 ? (
                <div className="space-y-4">
                  {upcomingAppointments.map((appointment) => (
                    <div 
                      key={appointment.id} 
                      className="flex items-center p-4 bg-gradient-to-r from-primary-50 to-secondary-50 rounded-xl border border-primary-200 hover:border-primary-300 transition-all group cursor-pointer"
                      onClick={() => navigate('/appointments')}
                    >
                      <div className="h-12 w-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center text-white shadow-lg">
                        <Calendar className="h-6 w-6" />
                      </div>
                      <div className="ml-4 flex-1">
                        <p className="font-semibold text-neutral-900">{appointment.doctorName}</p>
                        <p className="text-sm text-neutral-600">{appointment.date} at {appointment.time}</p>
                        <p className="text-xs text-neutral-500">{appointment.notes || 'General consultation'}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="primary">{appointment.status}</Badge>
                        <ChevronRight className="h-4 w-4 text-neutral-400 group-hover:text-primary-500 group-hover:translate-x-1 transition-all" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Calendar className="h-16 w-16 text-neutral-300 mx-auto mb-4" />
                  <p className="text-neutral-600 mb-4">No upcoming appointments</p>
                  <Link to="/appointments">
                    <Button 
                      variant="primary"
                      leftIcon={<Plus className="h-4 w-4" />}
                    >
                      Schedule Appointment
                    </Button>
                  </Link>
                </div>
              )}
              
              <div className="mt-6 pt-4 border-t border-neutral-200">
                <Link to="/appointments">
                  <Button 
                    variant="outline" 
                    fullWidth
                    rightIcon={<ChevronRight className="h-4 w-4" />}
                  >
                    View All Appointments
                  </Button>
                </Link>
              </div>
            </Card>
          </div>
          
          {/* Right sidebar */}
          <div className="space-y-6">
            {/* Today's Health Stats */}
            <Card 
              title="💖 Today's Health Stats" 
              className="shadow-lg border-0 bg-gradient-to-br from-white to-blue-50"
            >
              <div className="space-y-4">
                <div className="flex items-center p-3 bg-gradient-to-r from-primary-50 to-primary-100 rounded-xl border border-primary-200">
                  <div className="h-12 w-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center text-white shadow-lg">
                    <Heart className="h-6 w-6" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-neutral-600">Blood Pressure</p>
                    <p className="text-xl font-bold text-neutral-900">
                      {latestVitals.systolicBP}/{latestVitals.diastolicBP}
                    </p>
                    <p className="text-xs text-neutral-500">mmHg</p>
                  </div>
                </div>
                
                <div className="flex items-center p-3 bg-gradient-to-r from-secondary-50 to-secondary-100 rounded-xl border border-secondary-200">
                  <div className="h-12 w-12 bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-xl flex items-center justify-center text-white shadow-lg">
                    <Activity className="h-6 w-6" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-neutral-600">Glucose Level</p>
                    <p className="text-xl font-bold text-neutral-900">{latestVitals.glucoseLevel}</p>
                    <p className="text-xs text-neutral-500">mg/dL</p>
                  </div>
                </div>
                
                <div className="flex items-center p-3 bg-gradient-to-r from-accent-50 to-accent-100 rounded-xl border border-accent-200">
                  <div className="h-12 w-12 bg-gradient-to-br from-accent-500 to-accent-600 rounded-xl flex items-center justify-center text-white shadow-lg">
                    <Zap className="h-6 w-6" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-neutral-600">Pulse Rate</p>
                    <p className="text-xl font-bold text-neutral-900">{latestVitals.pulseRate}</p>
                    <p className="text-xs text-neutral-500">bpm</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-neutral-200">
                <Link to="/vitals">
                  <Button 
                    variant="outline" 
                    fullWidth
                    leftIcon={<TrendingUp className="h-4 w-4" />}
                  >
                    View Detailed Analytics
                  </Button>
                </Link>
              </div>
            </Card>

            {/* Active Care Plans */}
            {activeCarePlans.length > 0 && (
              <Card 
                title="📋 Active Care Plans" 
                className="shadow-lg border-0"
              >
                <div className="space-y-3">
                  {activeCarePlans.slice(0, 2).map((plan) => (
                    <Link key={plan.id} to={`/care-plans/${plan.id}`}>
                      <div className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl border border-purple-200 hover:border-purple-300 transition-all group cursor-pointer">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-neutral-900 group-hover:text-purple-700 transition-colors">
                            {plan.title}
                          </h4>
                          <Badge variant="success" size="sm">Active</Badge>
                        </div>
                        <p className="text-sm text-neutral-600 mb-3">{plan.description}</p>
                        
                        <div className="flex items-center justify-between">
                          <div className="text-xs text-neutral-500">
                            {plan.tasks.filter(t => t.completed).length}/{plan.tasks.length} tasks completed
                          </div>
                          <ChevronRight className="h-4 w-4 text-neutral-400 group-hover:text-purple-500 group-hover:translate-x-1 transition-all" />
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
                
                <div className="mt-4 pt-4 border-t border-neutral-200">
                  <Link to="/care-plans">
                    <Button 
                      variant="outline" 
                      fullWidth
                      rightIcon={<ChevronRight className="h-4 w-4" />}
                    >
                      View All Care Plans
                    </Button>
                  </Link>
                </div>
              </Card>
            )}
            
            {/* Recent Notifications */}
            <Card 
              title="🔔 Recent Notifications" 
              className="shadow-lg border-0"
            >
              {recentNotifications.length > 0 ? (
                <div className="space-y-3">
                  {recentNotifications.map((notification) => (
                    <Link key={notification.id} to="/notifications">
                      <div className={`p-3 rounded-xl border transition-all group cursor-pointer ${
                        notification.read 
                          ? 'bg-white border-neutral-200 hover:border-neutral-300' 
                          : 'bg-gradient-to-r from-primary-50 to-blue-50 border-primary-200 hover:border-primary-300'
                      }`}>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center">
                              <p className="font-medium text-neutral-900 text-sm">{notification.title}</p>
                              {!notification.read && (
                                <span className="h-2 w-2 bg-primary-500 rounded-full ml-2"></span>
                              )}
                            </div>
                            <p className="text-xs text-neutral-600 mt-1 line-clamp-2">{notification.message}</p>
                            <p className="text-xs text-neutral-500 mt-2">
                              {new Date(notification.timestamp).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>
                          </div>
                          <ChevronRight className="h-4 w-4 text-neutral-400 group-hover:text-primary-500 group-hover:translate-x-1 transition-all flex-shrink-0 ml-2" />
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <Bell className="h-12 w-12 text-neutral-300 mx-auto mb-3" />
                  <p className="text-neutral-600 text-sm">No new notifications</p>
                </div>
              )}
              
              <div className="mt-4 pt-4 border-t border-neutral-200">
                <Link to="/notifications">
                  <Button 
                    variant="outline" 
                    fullWidth
                    rightIcon={<ChevronRight className="h-4 w-4" />}
                  >
                    View All Notifications
                  </Button>
                </Link>
              </div>
            </Card>

            {/* Health Achievements */}
            <Card 
              title="🏆 Health Achievements" 
              className="shadow-lg border-0 bg-gradient-to-br from-yellow-50 to-orange-50"
            >
              <div className="space-y-3">
                <div className="flex items-center p-3 bg-gradient-to-r from-yellow-100 to-orange-100 rounded-xl border border-yellow-200">
                  <div className="h-10 w-10 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center text-white">
                    <Award className="h-5 w-5" />
                  </div>
                  <div className="ml-3">
                    <p className="font-medium text-yellow-800 text-sm">7-Day Streak</p>
                    <p className="text-xs text-yellow-700">Consistent vitals logging</p>
                  </div>
                </div>
                
                <div className="flex items-center p-3 bg-gradient-to-r from-green-100 to-emerald-100 rounded-xl border border-green-200">
                  <div className="h-10 w-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center text-white">
                    <Target className="h-5 w-5" />
                  </div>
                  <div className="ml-3">
                    <p className="font-medium text-green-800 text-sm">Health Goals</p>
                    <p className="text-xs text-green-700">3 of 5 goals achieved</p>
                  </div>
                </div>
                
                <div className="flex items-center p-3 bg-gradient-to-r from-blue-100 to-purple-100 rounded-xl border border-blue-200">
                  <div className="h-10 w-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white">
                    <Shield className="h-5 w-5" />
                  </div>
                  <div className="ml-3">
                    <p className="font-medium text-blue-800 text-sm">AI Assistant</p>
                    <p className="text-xs text-blue-700">50+ health questions answered</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Modals */}
        <SkinAnalysis 
          isOpen={showSkinAnalysis} 
          onClose={() => setShowSkinAnalysis(false)} 
        />

        <CoughAnalysis 
          isOpen={showCoughAnalysis} 
          onClose={() => setShowCoughAnalysis(false)} 
        />

        <HealthFitnessGame 
          isOpen={showHealthGame} 
          onClose={() => setShowHealthGame(false)} 
        />
      </div>
    </div>
  );
};

export default PatientDashboard;