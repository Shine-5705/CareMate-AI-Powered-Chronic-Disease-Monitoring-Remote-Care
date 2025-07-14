import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Activity, Calendar, MessageSquare, ChevronRight, 
  Plus, TrendingUp, Heart
} from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import { useAuth } from '../../context/AuthContext';
import { vitalsData, appointmentsData, carePlansData, notificationsData } from '../../data/mockData';

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
  const [showVitalsForm, setShowVitalsForm] = useState(false);
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-neutral-900">Welcome back, {user?.name}</h1>
        <p className="text-neutral-600 mt-1">Here's an overview of your health today</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main content area */}
        <div className="lg:col-span-3 space-y-6">
          {/* Vitals Overview */}
          <Card 
            title="Health Vitals" 
            subtitle="Last 7 days"
            footer={
              <div className="flex justify-between items-center">
                <span className="text-sm text-neutral-600">Last updated: Today</span>
                <Link to="/vitals">
                  <Button 
                    variant="outline" 
                    size="sm"
                    rightIcon={<ChevronRight className="h-4 w-4" />}
                  >
                    View Details
                  </Button>
                </Link>
              </div>
            }
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <VitalsChart 
                data={bpData} 
                color="bg-primary-400" 
                label="Blood Pressure (systolic)" 
              />
              <VitalsChart 
                data={glucoseData} 
                color="bg-secondary-400" 
                label="Glucose Level" 
              />
              <VitalsChart 
                data={pulseData} 
                color="bg-accent-400" 
                label="Pulse Rate" 
              />
            </div>
            
            <div className="mt-6">
              <Button 
                variant="primary" 
                className="w-full md:w-auto"
                leftIcon={<Plus className="h-4 w-4" />}
                onClick={() => setShowVitalsForm(!showVitalsForm)}
              >
                Log Today's Vitals
              </Button>
              
              {showVitalsForm && (
                <div className="mt-4 bg-neutral-50 p-4 rounded-lg border border-neutral-200 animate-fade-in">
                  <h4 className="font-medium text-neutral-900 mb-3">Log Vitals</h4>
                  <form onSubmit={handleVitalsSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-1">
                          Blood Pressure (mmHg)
                        </label>
                        <div className="flex space-x-2">
                          <input
                            type="number"
                            name="systolicBP"
                            value={formData.systolicBP}
                            onChange={(e) => setFormData(prev => ({ ...prev, systolicBP: e.target.value }))}
                            placeholder="Systolic"
                            className="w-full px-3 py-2 border border-neutral-300 rounded-lg"
                            required
                          />
                          <span className="flex items-center text-neutral-500">/</span>
                          <input
                            type="number"
                            name="diastolicBP"
                            value={formData.diastolicBP}
                            onChange={(e) => setFormData(prev => ({ ...prev, diastolicBP: e.target.value }))}
                            placeholder="Diastolic"
                            className="w-full px-3 py-2 border border-neutral-300 rounded-lg"
                            required
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-1">
                          Glucose Level (mg/dL)
                        </label>
                        <input
                          type="number"
                          name="glucoseLevel"
                          value={formData.glucoseLevel}
                          onChange={(e) => setFormData(prev => ({ ...prev, glucoseLevel: e.target.value }))}
                          placeholder="e.g., 95"
                          className="w-full px-3 py-2 border border-neutral-300 rounded-lg"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-1">
                          Pulse Rate (bpm)
                        </label>
                        <input
                          type="number"
                          name="pulseRate"
                          value={formData.pulseRate}
                          onChange={(e) => setFormData(prev => ({ ...prev, pulseRate: e.target.value }))}
                          placeholder="e.g., 72"
                          className="w-full px-3 py-2 border border-neutral-300 rounded-lg"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-1">
                          Symptoms (if any)
                        </label>
                        <input
                          type="text"
                          name="symptoms"
                          value={formData.symptoms}
                          onChange={(e) => setFormData(prev => ({ ...prev, symptoms: e.target.value }))}
                          placeholder="e.g., Headache, Fatigue"
                          className="w-full px-3 py-2 border border-neutral-300 rounded-lg"
                        />
                      </div>
                    </div>
                    <div className="mt-4 flex justify-end space-x-3">
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
                      >
                        Save
                      </Button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </Card>
          
          {/* Appointments */}
          <Card 
            title="Upcoming Appointments" 
            subtitle="Your scheduled visits"
            footer={
              <Link to="/appointments">
                <Button 
                  variant="outline" 
                  size="sm" 
                  fullWidth
                >
                  View All Appointments
                </Button>
              </Link>
            }
          >
            {upcomingAppointments.length > 0 ? (
              <div className="space-y-4">
                {upcomingAppointments.map((appointment) => (
                  <div 
                    key={appointment.id} 
                    className="flex items-center p-3 bg-neutral-50 rounded-lg border border-neutral-200 hover:border-primary-200 transition-colors"
                  >
                    <div className="h-10 w-10 bg-primary-100 rounded-full flex items-center justify-center text-primary-600">
                      <Calendar className="h-5 w-5" />
                    </div>
                    <div className="ml-4 flex-1">
                      <p className="font-medium text-neutral-900">{appointment.doctorName}</p>
                      <p className="text-sm text-neutral-600">{appointment.date} at {appointment.time}</p>
                    </div>
                    <Badge variant="primary">{appointment.status}</Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-neutral-600">No upcoming appointments</p>
                <Link to="/appointments">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="mt-3"
                  >
                    Schedule Appointment
                  </Button>
                </Link>
              </div>
            )}
          </Card>
          
          {/* Care Plans */}
          <Card 
            title="My Care Plans" 
            subtitle="Active treatment and monitoring plans"
          >
            {activeCarePlans.length > 0 ? (
              <div className="space-y-6">
                {activeCarePlans.map((plan) => (
                  <div key={plan.id} className="border border-neutral-200 rounded-lg overflow-hidden">
                    <div className="bg-neutral-50 px-4 py-3 border-b border-neutral-200">
                      <div className="flex justify-between items-center">
                        <h4 className="font-medium text-neutral-900">{plan.title}</h4>
                        <Badge variant="primary">Active</Badge>
                      </div>
                      <p className="text-sm text-neutral-600 mt-1">{plan.description}</p>
                    </div>
                    <div className="px-4 py-3">
                      <h5 className="text-sm font-medium text-neutral-900 mb-2">Tasks & Activities</h5>
                      <div className="space-y-2">
                        {plan.tasks.map((task) => (
                          <div key={task.id} className="flex items-start">
                            <input
                              type="checkbox"
                              checked={task.completed}
                              className="mt-1 h-4 w-4 text-primary-500 border-neutral-300 rounded"
                              readOnly
                            />
                            <div className="ml-3">
                              <p className="text-sm text-neutral-800">{task.description}</p>
                              <p className="text-xs text-neutral-500">{task.frequency}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="bg-neutral-50 px-4 py-3 border-t border-neutral-200">
                      <Link to={`/care-plans/${plan.id}`}>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          fullWidth
                        >
                          View Full Care Plan
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-neutral-600">No active care plans</p>
              </div>
            )}
          </Card>
        </div>
        
        {/* Right sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card title="Quick Actions">
            <div className="grid grid-cols-2 gap-3">
              <Link to="/messages">
                <button className="w-full p-3 bg-neutral-50 rounded-lg border border-neutral-200 hover:border-primary-200 transition-colors flex flex-col items-center">
                  <MessageSquare className="h-6 w-6 text-primary-500" />
                  <span className="text-sm font-medium text-neutral-800 mt-2">Chat with Doctor</span>
                </button>
              </Link>
              
              <Link to="/vitals">
                <button className="w-full p-3 bg-neutral-50 rounded-lg border border-neutral-200 hover:border-primary-200 transition-colors flex flex-col items-center">
                  <Activity className="h-6 w-6 text-primary-500" />
                  <span className="text-sm font-medium text-neutral-800 mt-2">Log Vitals</span>
                </button>
              </Link>
              
              <Link to="/appointments">
                <button className="w-full p-3 bg-neutral-50 rounded-lg border border-neutral-200 hover:border-primary-200 transition-colors flex flex-col items-center">
                  <Calendar className="h-6 w-6 text-primary-500" />
                  <span className="text-sm font-medium text-neutral-800 mt-2">Schedule Visit</span>
                </button>
              </Link>
              
              <Link to="/vitals">
                <button className="w-full p-3 bg-neutral-50 rounded-lg border border-neutral-200 hover:border-primary-200 transition-colors flex flex-col items-center">
                  <TrendingUp className="h-6 w-6 text-primary-500" />
                  <span className="text-sm font-medium text-neutral-800 mt-2">View Progress</span>
                </button>
              </Link>
            </div>
          </Card>
          
          {/* Today's Stats */}
          <Card title="Today's Stats">
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="h-10 w-10 bg-primary-100 rounded-full flex items-center justify-center text-primary-600">
                  <Heart className="h-5 w-5" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-neutral-600">Blood Pressure</p>
                  <p className="font-semibold text-lg text-neutral-900">
                    {latestVitals.systolicBP}/{latestVitals.diastolicBP} <span className="text-sm font-normal text-neutral-500">mmHg</span>
                  </p>
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="h-10 w-10 bg-secondary-100 rounded-full flex items-center justify-center text-secondary-600">
                  <Activity className="h-5 w-5" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-neutral-600">Glucose</p>
                  <p className="font-semibold text-lg text-neutral-900">
                    {latestVitals.glucoseLevel} <span className="text-sm font-normal text-neutral-500">mg/dL</span>
                  </p>
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="h-10 w-10 bg-accent-100 rounded-full flex items-center justify-center text-accent-600">
                  <Activity className="h-5 w-5" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-neutral-600">Pulse Rate</p>
                  <p className="font-semibold text-lg text-neutral-900">
                    {latestVitals.pulseRate} <span className="text-sm font-normal text-neutral-500">bpm</span>
                  </p>
                </div>
              </div>
            </div>
          </Card>
          
          {/* Notifications */}
          <Card 
            title="Notifications" 
            footer={
              <Link to="/notifications">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  fullWidth
                >
                  View All
                </Button>
              </Link>
            }
          >
            {recentNotifications.length > 0 ? (
              <div className="space-y-3">
                {recentNotifications.map((notification) => (
                  <div 
                    key={notification.id} 
                    className={`p-3 rounded-lg border ${notification.read ? 'bg-white border-neutral-200' : 'bg-neutral-50 border-primary-200'}`}
                  >
                    <div className="flex justify-between items-start">
                      <p className="font-medium text-neutral-900">{notification.title}</p>
                      {!notification.read && (
                        <span className="h-2 w-2 bg-primary-500 rounded-full"></span>
                      )}
                    </div>
                    <p className="text-sm text-neutral-600 mt-1">{notification.message}</p>
                    <p className="text-xs text-neutral-500 mt-2">
                      {new Date(notification.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-neutral-600">No new notifications</p>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;