export interface User {
  id: string;
  name: string;
  email: string;
  role: 'patient' | 'doctor';
  profileImage?: string;
}

export interface Vital {
  id: string;
  patientId: string;
  date: string;
  systolicBP: number;
  diastolicBP: number;
  glucoseLevel: number;
  pulseRate: number;
  symptoms?: string[];
}

export interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  patientName: string;
  doctorName: string;
  date: string;
  time: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  notes?: string;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  senderName: string;
  content: string;
  timestamp: string;
  read: boolean;
  attachmentUrl?: string;
}

export interface CarePlan {
  id: string;
  patientId: string;
  doctorId: string;
  title: string;
  description: string;
  startDate: string;
  endDate?: string;
  active: boolean;
  tasks: CarePlanTask[];
}

export interface CarePlanTask {
  id: string;
  description: string;
  frequency: string;
  completed: boolean;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'appointment' | 'medication' | 'message' | 'vital';
  read: boolean;
  timestamp: string;
}