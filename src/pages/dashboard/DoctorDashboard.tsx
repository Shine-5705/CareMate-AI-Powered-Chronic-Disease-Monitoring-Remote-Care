import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, Calendar, MessageSquare, ChevronRight, 
  User, AlertCircle, Clock, CheckCircle
} from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import { useAuth } from '../../context/AuthContext';
import { patientListData, appointmentsData, alertsData } from '../../data/mockData';

const DoctorDashboard: React.FC = () => {
  const { user } = useAuth();
  
  // Today's consultations
  const todaysDate = new Date().toISOString().split('T')[0];
  const todaysConsultations = appointmentsData
    .filter(apt => apt.doctorId === user?.id && apt.date === todaysDate)
    .sort((a, b) => a.time.localeCompare(b.time));
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-neutral-900">Welcome, Dr. {user?.name.split(' ')[1]}</h1>
        <p className="text-neutral-600 mt-1">Here's your practice overview for today</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main content area */}
        <div className="lg:col-span-3 space-y-6">
          {/* Patient Alerts */}
          <Card 
            title="Critical Patient Alerts" 
            subtitle="Patients requiring immediate attention"
          >
            {alertsData.length > 0 ? (
              <div className="space-y-4">
                {alertsData.map((alert) => (
                  <div 
                    key={alert.id} 
                    className={`flex items-center p-4 rounded-lg ${
                      alert.status === 'Critical' 
                        ? 'bg-error-50 border border-error-200' 
                        : 'bg-warning-50 border border-warning-200'
                    }`}
                  >
                    <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                      alert.status === 'Critical' 
                        ? 'bg-error-100 text-error-600' 
                        : 'bg-warning-100 text-warning-600'
                    }`}>
                      <AlertCircle className="h-5 w-5" />
                    </div>
                    <div className="ml-4 flex-1">
                      <div className="flex items-center">
                        <p className="font-medium text-neutral-900">{alert.patientName}</p>
                        <Badge 
                          variant={alert.status === 'Critical' ? 'error' : 'warning'}
                          className="ml-2"
                        >
                          {alert.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-neutral-700 mt-1">
                        <span className="font-medium">{alert.type}:</span> {alert.value}
                      </p>
                      <p className="text-xs text-neutral-500 mt-1">
                        {new Date(alert.timestamp).toLocaleString()}
                      </p>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                    >
                      Review
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <CheckCircle className="h-12 w-12 text-success-500 mx-auto mb-3" />
                <p className="text-neutral-600">No critical alerts at this time</p>
              </div>
            )}
          </Card>
          
          {/* Today's Consultations */}
          <Card 
            title="Today's Consultations" 
            subtitle="Your scheduled appointments for today"
            footer={
              <Link to="/schedule">
                <Button 
                  variant="outline" 
                  size="sm" 
                  fullWidth
                >
                  View Full Schedule
                </Button>
              </Link>
            }
          >
            {todaysConsultations.length > 0 ? (
              <div className="space-y-4">
                {todaysConsultations.map((appointment) => (
                  <div 
                    key={appointment.id} 
                    className="flex items-center p-3 bg-neutral-50 rounded-lg border border-neutral-200 hover:border-primary-200 transition-colors"
                  >
                    <div className="h-10 w-10 bg-primary-100 rounded-full flex items-center justify-center text-primary-600">
                      <Clock className="h-5 w-5" />
                    </div>
                    <div className="ml-4 flex-1">
                      <p className="font-medium text-neutral-900">{appointment.patientName}</p>
                      <p className="text-sm text-neutral-600">{appointment.time} - {appointment.notes || 'General consultation'}</p>
                    </div>
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                      >
                        Reschedule
                      </Button>
                      <Button 
                        variant="primary" 
                        size="sm"
                      >
                        Start
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-neutral-600">No consultations scheduled for today</p>
              </div>
            )}
          </Card>
          
          {/* Patient List */}
          <Card 
            title="Your Patients" 
            subtitle="Complete list of patients under your care"
            footer={
              <Link to="/patients">
                <Button 
                  variant="outline" 
                  size="sm" 
                  fullWidth
                  rightIcon={<ChevronRight className="h-4 w-4" />}
                >
                  View All Patients
                </Button>
              </Link>
            }
          >
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-neutral-200">
                <thead>
                  <tr>
                    <th className="px-3 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                      Patient
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                      Condition
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                      Last Check-in
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-neutral-200">
                  {patientListData.map((patient) => (
                    <tr key={patient.id} className="hover:bg-neutral-50">
                      <td className="px-3 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-8 w-8 rounded-full overflow-hidden bg-neutral-200">
                            {patient.profileImage ? (
                              <img 
                                src={patient.profileImage} 
                                alt={patient.name} 
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <User className="h-full w-full p-1 text-neutral-500" />
                            )}
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-medium text-neutral-900">{patient.name}</div>
                            <div className="text-xs text-neutral-500">Age: {patient.age}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-4">
                        <div className="text-sm text-neutral-900">{patient.condition}</div>
                      </td>
                      <td className="px-3 py-4">
                        <div className="text-sm text-neutral-900">{patient.lastCheckIn}</div>
                      </td>
                      <td className="px-3 py-4">
                        <Badge 
                          variant={
                            patient.status === 'Stable' 
                              ? 'success' 
                              : patient.status === 'Needs Attention' 
                                ? 'warning' 
                                : 'error'
                          }
                        >
                          {patient.status}
                        </Badge>
                      </td>
                      <td className="px-3 py-4 text-sm font-medium">
                        <Link to={`/patients/${patient.id}`} className="text-primary-500 hover:text-primary-600">
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
        
        {/* Right sidebar */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <Card title="Practice Overview">
            <div className="space-y-4">
              <div className="p-3 bg-primary-50 rounded-lg border border-primary-100 flex items-center">
                <div className="h-10 w-10 bg-primary-100 rounded-full flex items-center justify-center text-primary-600">
                  <Users className="h-5 w-5" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-neutral-600">Total Patients</p>
                  <p className="font-semibold text-lg text-neutral-900">24</p>
                </div>
              </div>
              
              <div className="p-3 bg-secondary-50 rounded-lg border border-secondary-100 flex items-center">
                <div className="h-10 w-10 bg-secondary-100 rounded-full flex items-center justify-center text-secondary-600">
                  <Calendar className="h-5 w-5" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-neutral-600">Today's Appointments</p>
                  <p className="font-semibold text-lg text-neutral-900">{todaysConsultations.length}</p>
                </div>
              </div>
              
              <div className="p-3 bg-warning-50 rounded-lg border border-warning-100 flex items-center">
                <div className="h-10 w-10 bg-warning-100 rounded-full flex items-center justify-center text-warning-600">
                  <AlertCircle className="h-5 w-5" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-neutral-600">Pending Alerts</p>
                  <p className="font-semibold text-lg text-neutral-900">{alertsData.length}</p>
                </div>
              </div>
              
              <div className="p-3 bg-accent-50 rounded-lg border border-accent-100 flex items-center">
                <div className="h-10 w-10 bg-accent-100 rounded-full flex items-center justify-center text-accent-600">
                  <MessageSquare className="h-5 w-5" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-neutral-600">Unread Messages</p>
                  <p className="font-semibold text-lg text-neutral-900">8</p>
                </div>
              </div>
            </div>
          </Card>
          
          {/* Quick Actions */}
          <Card title="Quick Actions">
            <div className="grid grid-cols-2 gap-3">
              <Link to="/patients">
                <button className="w-full p-3 bg-neutral-50 rounded-lg border border-neutral-200 hover:border-primary-200 transition-colors flex flex-col items-center">
                  <Users className="h-6 w-6 text-primary-500" />
                  <span className="text-sm font-medium text-neutral-800 mt-2">View Patients</span>
                </button>
              </Link>
              
              <Link to="/messages">
                <button className="w-full p-3 bg-neutral-50 rounded-lg border border-neutral-200 hover:border-primary-200 transition-colors flex flex-col items-center">
                  <MessageSquare className="h-6 w-6 text-primary-500" />
                  <span className="text-sm font-medium text-neutral-800 mt-2">Messages</span>
                </button>
              </Link>
              
              <Link to="/schedule">
                <button className="w-full p-3 bg-neutral-50 rounded-lg border border-neutral-200 hover:border-primary-200 transition-colors flex flex-col items-center">
                  <Calendar className="h-6 w-6 text-primary-500" />
                  <span className="text-sm font-medium text-neutral-800 mt-2">Schedule</span>
                </button>
              </Link>
              
              <Link to="/alerts">
                <button className="w-full p-3 bg-neutral-50 rounded-lg border border-neutral-200 hover:border-primary-200 transition-colors flex flex-col items-center">
                  <AlertCircle className="h-6 w-6 text-primary-500" />
                  <span className="text-sm font-medium text-neutral-800 mt-2">Alerts</span>
                </button>
              </Link>
            </div>
          </Card>
          
          {/* Recent Messages */}
          <Card 
            title="Recent Messages" 
            footer={
              <Link to="/messages">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  fullWidth
                >
                  View All Messages
                </Button>
              </Link>
            }
          >
            <div className="space-y-3">
              <div className="p-3 bg-neutral-50 rounded-lg border border-primary-200">
                <div className="flex items-start">
                  <div className="h-8 w-8 rounded-full overflow-hidden">
                    <img 
                      src="https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                      alt="John Doe" 
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="ml-3 flex-1">
                    <div className="flex justify-between">
                      <p className="font-medium text-neutral-900">John Doe</p>
                      <span className="text-xs text-neutral-500">10:45 AM</span>
                    </div>
                    <p className="text-sm text-neutral-600 mt-1">Yes, every morning as prescribed.</p>
                  </div>
                </div>
                <div className="mt-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    fullWidth
                  >
                    Reply
                  </Button>
                </div>
              </div>
              
              <div className="p-3 bg-white rounded-lg border border-neutral-200">
                <div className="flex items-start">
                  <div className="h-8 w-8 rounded-full overflow-hidden">
                    <img 
                      src="https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                      alt="Jane Smith" 
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="ml-3 flex-1">
                    <div className="flex justify-between">
                      <p className="font-medium text-neutral-900">Jane Smith</p>
                      <span className="text-xs text-neutral-500">Yesterday</span>
                    </div>
                    <p className="text-sm text-neutral-600 mt-1">I've been feeling short of breath again...</p>
                  </div>
                </div>
                <div className="mt-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    fullWidth
                  >
                    Reply
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;