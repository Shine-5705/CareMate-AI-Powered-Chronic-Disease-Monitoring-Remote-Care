import React, { useState } from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, Clock, MapPin, Plus, X } from 'lucide-react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Badge from '../components/common/Badge';
import { appointmentsData } from '../data/mockData';

const Appointments: React.FC = () => {
  const [showBooking, setShowBooking] = useState(false);
  const [showReschedule, setShowReschedule] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    doctor: '',
    date: '',
    time: '',
    reason: '',
  });

  const upcomingAppointments = appointmentsData
    .filter(apt => new Date(apt.date) >= new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create new appointment
    const newAppointment = {
      id: `a${Date.now()}`,
      patientId: 'p1', // In a real app, this would come from the authenticated user
      doctorId: formData.doctor,
      patientName: 'John Doe', // In a real app, this would come from the authenticated user
      doctorName: 'Dr. Sarah Smith', // In a real app, this would come from the selected doctor
      date: formData.date,
      time: formData.time,
      status: 'pending',
      notes: formData.reason
    };

    // In a real app, this would be an API call to save the data
    appointmentsData.push(newAppointment);

    // Reset form and close
    setShowBooking(false);
    setFormData({
      doctor: '',
      date: '',
      time: '',
      reason: '',
    });
  };

  const handleReschedule = (appointmentId: string, newDate: string, newTime: string) => {
    // In a real app, this would be an API call to update the appointment
    const appointment = appointmentsData.find(apt => apt.id === appointmentId);
    if (appointment) {
      appointment.date = newDate;
      appointment.time = newTime;
      appointment.status = 'pending';
    }
    setShowReschedule(null);
  };

  const calendarEvents = appointmentsData.map(apt => ({
    id: apt.id,
    title: `${apt.doctorName} - ${apt.notes || 'Consultation'}`,
    start: `${apt.date}T${apt.time}`,
    className: `bg-${apt.status === 'scheduled' ? 'primary' : apt.status === 'pending' ? 'warning' : 'neutral'}-500`,
  }));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Appointments</h1>
          <p className="text-neutral-600 mt-1">Schedule and manage your appointments</p>
        </div>
        <Button
          variant="primary"
          leftIcon={<Plus className="h-4 w-4" />}
          onClick={() => setShowBooking(true)}
        >
          Book Appointment
        </Button>
      </div>

      {showBooking && (
        <Card className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-neutral-900">Book New Appointment</h3>
            <button
              onClick={() => setShowBooking(false)}
              className="text-neutral-500 hover:text-neutral-700"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Select Doctor
                </label>
                <select
                  name="doctor"
                  value={formData.doctor}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-white border border-neutral-300 rounded-lg text-neutral-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                >
                  <option value="">Select a doctor</option>
                  <option value="dr-smith">Dr. Sarah Smith - Cardiologist</option>
                  <option value="dr-jones">Dr. Michael Jones - Endocrinologist</option>
                  <option value="dr-wilson">Dr. Emily Wilson - General Physician</option>
                </select>
              </div>

              <Input
                type="date"
                label="Preferred Date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                min={format(new Date(), 'yyyy-MM-dd')}
                required
              />

              <Input
                type="time"
                label="Preferred Time"
                name="time"
                value={formData.time}
                onChange={handleInputChange}
                required
              />

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Reason for Visit
                </label>
                <textarea
                  name="reason"
                  value={formData.reason}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 bg-white border border-neutral-300 rounded-lg text-neutral-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Please describe your symptoms or reason for visit"
                  required
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <Button
                variant="ghost"
                onClick={() => setShowBooking(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
              >
                Book Appointment
              </Button>
            </div>
          </form>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card title="Calendar">
            <div className="h-[600px]">
              <FullCalendar
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                events={calendarEvents}
                headerToolbar={{
                  left: 'prev,next today',
                  center: 'title',
                  right: 'dayGridMonth,timeGridWeek'
                }}
                editable={true}
                selectable={true}
                selectMirror={true}
                dayMaxEvents={true}
                eventClick={(info) => {
                  const appointment = appointmentsData.find(apt => apt.id === info.event.id);
                  if (appointment) {
                    setShowReschedule(appointment.id);
                  }
                }}
                select={(info) => {
                  setShowBooking(true);
                  setFormData(prev => ({
                    ...prev,
                    date: format(info.start, 'yyyy-MM-dd'),
                    time: format(info.start, 'HH:mm')
                  }));
                }}
              />
            </div>
          </Card>
        </div>

        <div>
          <Card title="Upcoming Appointments">
            <div className="space-y-4">
              {upcomingAppointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="p-4 bg-neutral-50 rounded-lg border border-neutral-200"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-start space-x-4">
                      <div className="h-12 w-12 rounded-full bg-primary-100 flex items-center justify-center">
                        <CalendarIcon className="h-6 w-6 text-primary-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-neutral-900">{appointment.doctorName}</h4>
                        <div className="mt-1 space-y-1">
                          <div className="flex items-center text-sm text-neutral-600">
                            <Clock className="h-4 w-4 mr-1" />
                            {format(new Date(`${appointment.date} ${appointment.time}`), 'MMM d, yyyy h:mm a')}
                          </div>
                          <div className="flex items-center text-sm text-neutral-600">
                            <MapPin className="h-4 w-4 mr-1" />
                            Virtual Consultation
                          </div>
                        </div>
                      </div>
                    </div>
                    <Badge
                      variant={
                        appointment.status === 'scheduled' ? 'primary' :
                        appointment.status === 'pending' ? 'warning' : 'error'
                      }
                    >
                      {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                    </Badge>
                  </div>
                  {appointment.notes && (
                    <p className="mt-3 text-sm text-neutral-600 border-t border-neutral-200 pt-3">
                      {appointment.notes}
                    </p>
                  )}
                  <div className="mt-4 flex justify-end space-x-3">
                    {showReschedule === appointment.id ? (
                      <div className="flex space-x-2">
                        <Input
                          type="date"
                          value={appointment.date}
                          onChange={(e) => handleReschedule(appointment.id, e.target.value, appointment.time)}
                          min={format(new Date(), 'yyyy-MM-dd')}
                        />
                        <Input
                          type="time"
                          value={appointment.time}
                          onChange={(e) => handleReschedule(appointment.id, appointment.date, e.target.value)}
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setShowReschedule(null)}
                        >
                          Cancel
                        </Button>
                      </div>
                    ) : (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setShowReschedule(appointment.id)}
                        >
                          Reschedule
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-error-600 border-error-600 hover:bg-error-50"
                        >
                          Cancel
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Appointments;