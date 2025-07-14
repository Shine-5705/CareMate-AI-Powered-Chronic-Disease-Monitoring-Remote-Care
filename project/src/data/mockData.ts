import { Vital, Appointment, Message, CarePlan, Notification } from '../types';

// Sample vital signs data
export const vitalsData: Vital[] = [
  {
    id: 'v1',
    patientId: 'p1',
    date: '2025-05-01',
    systolicBP: 120,
    diastolicBP: 80,
    glucoseLevel: 95,
    pulseRate: 72,
    symptoms: []
  },
  {
    id: 'v2',
    patientId: 'p1',
    date: '2025-05-02',
    systolicBP: 122,
    diastolicBP: 78,
    glucoseLevel: 98,
    pulseRate: 74,
    symptoms: ['Mild headache']
  },
  {
    id: 'v3',
    patientId: 'p1',
    date: '2025-05-03',
    systolicBP: 118,
    diastolicBP: 76,
    glucoseLevel: 92,
    pulseRate: 70,
    symptoms: []
  },
  {
    id: 'v4',
    patientId: 'p1',
    date: '2025-05-04',
    systolicBP: 125,
    diastolicBP: 82,
    glucoseLevel: 102,
    pulseRate: 78,
    symptoms: ['Fatigue']
  },
  {
    id: 'v5',
    patientId: 'p1',
    date: '2025-05-05',
    systolicBP: 124,
    diastolicBP: 80,
    glucoseLevel: 100,
    pulseRate: 75,
    symptoms: []
  },
  {
    id: 'v6',
    patientId: 'p1',
    date: '2025-05-06',
    systolicBP: 126,
    diastolicBP: 84,
    glucoseLevel: 105,
    pulseRate: 76,
    symptoms: ['Dizziness']
  },
  {
    id: 'v7',
    patientId: 'p1',
    date: '2025-05-07',
    systolicBP: 121,
    diastolicBP: 79,
    glucoseLevel: 97,
    pulseRate: 73,
    symptoms: []
  }
];

// Sample appointments
export const appointmentsData: Appointment[] = [
  {
    id: 'a1',
    patientId: 'p1',
    doctorId: 'd1',
    patientName: 'John Doe',
    doctorName: 'Dr. Sarah Smith',
    date: '2025-05-10',
    time: '09:00 AM',
    status: 'scheduled',
    notes: 'Regular checkup'
  },
  {
    id: 'a2',
    patientId: 'p1',
    doctorId: 'd1',
    patientName: 'John Doe',
    doctorName: 'Dr. Sarah Smith',
    date: '2025-05-17',
    time: '10:30 AM',
    status: 'scheduled',
    notes: 'Follow-up on medication'
  },
  {
    id: 'a3',
    patientId: 'p2',
    doctorId: 'd1',
    patientName: 'Jane Smith',
    doctorName: 'Dr. Sarah Smith',
    date: '2025-05-10',
    time: '11:15 AM',
    status: 'scheduled'
  },
  {
    id: 'a4',
    patientId: 'p3',
    doctorId: 'd1',
    patientName: 'Robert Johnson',
    doctorName: 'Dr. Sarah Smith',
    date: '2025-05-10',
    time: '02:00 PM',
    status: 'scheduled'
  }
];

// Sample messages
export const messagesData: Message[] = [
  {
    id: 'm1',
    senderId: 'd1',
    receiverId: 'p1',
    senderName: 'Dr. Sarah Smith',
    content: 'How are you feeling today, John?',
    timestamp: '2025-05-07T09:30:00Z',
    read: true
  },
  {
    id: 'm2',
    senderId: 'p1',
    receiverId: 'd1',
    senderName: 'John Doe',
    content: 'I\'m feeling better, but I still have some mild headaches in the morning.',
    timestamp: '2025-05-07T09:35:00Z',
    read: true
  },
  {
    id: 'm3',
    senderId: 'd1',
    receiverId: 'p1',
    senderName: 'Dr. Sarah Smith',
    content: 'Have you been taking your medication regularly?',
    timestamp: '2025-05-07T09:38:00Z',
    read: true
  },
  {
    id: 'm4',
    senderId: 'p1',
    receiverId: 'd1',
    senderName: 'John Doe',
    content: 'Yes, every morning as prescribed.',
    timestamp: '2025-05-07T09:40:00Z',
    read: true
  },
  {
    id: 'm5',
    senderId: 'd1',
    receiverId: 'p1',
    senderName: 'Dr. Sarah Smith',
    content: 'Great. Let\'s discuss this more during your appointment next week. Make sure to track your headaches until then.',
    timestamp: '2025-05-07T09:45:00Z',
    read: false
  }
];

// Sample care plans
export const carePlansData: CarePlan[] = [
  {
    id: 'cp1',
    patientId: 'p1',
    doctorId: 'd1',
    title: 'Hypertension Management',
    description: 'Plan to manage and reduce high blood pressure through medication, diet, and exercise.',
    startDate: '2025-04-15',
    active: true,
    tasks: [
      {
        id: 'cpt1',
        description: 'Take blood pressure medication daily',
        frequency: 'Daily, morning',
        completed: false
      },
      {
        id: 'cpt2',
        description: 'Record blood pressure readings',
        frequency: 'Twice daily (morning and evening)',
        completed: false
      },
      {
        id: 'cpt3',
        description: 'Maintain low-sodium diet',
        frequency: 'Daily',
        completed: false
      },
      {
        id: 'cpt4',
        description: 'Exercise for 30 minutes',
        frequency: '5 times per week',
        completed: false
      }
    ]
  },
  {
    id: 'cp2',
    patientId: 'p1',
    doctorId: 'd1',
    title: 'Diabetes Monitoring',
    description: 'Plan to monitor blood glucose levels and maintain them within target range.',
    startDate: '2025-04-15',
    active: true,
    tasks: [
      {
        id: 'cpt5',
        description: 'Check blood glucose level',
        frequency: 'Before meals and bedtime',
        completed: false
      },
      {
        id: 'cpt6',
        description: 'Take insulin as prescribed',
        frequency: 'As directed by doctor',
        completed: false
      },
      {
        id: 'cpt7',
        description: 'Follow diabetic diet plan',
        frequency: 'Every meal',
        completed: false
      },
      {
        id: 'cpt8',
        description: 'Check feet for sores or irritation',
        frequency: 'Daily',
        completed: false
      }
    ]
  }
];

// Sample notifications
export const notificationsData: Notification[] = [
  {
    id: 'n1',
    userId: 'p1',
    title: 'Medication Reminder',
    message: 'Time to take your blood pressure medication',
    type: 'medication',
    read: false,
    timestamp: '2025-05-08T08:00:00Z'
  },
  {
    id: 'n2',
    userId: 'p1',
    title: 'Appointment Reminder',
    message: 'You have an appointment with Dr. Sarah Smith tomorrow at 9:00 AM',
    type: 'appointment',
    read: false,
    timestamp: '2025-05-09T15:00:00Z'
  },
  {
    id: 'n3',
    userId: 'p1',
    title: 'New Message',
    message: 'You have a new message from Dr. Sarah Smith',
    type: 'message',
    read: true,
    timestamp: '2025-05-07T09:45:00Z'
  },
  {
    id: 'n4',
    userId: 'p1',
    title: 'Vital Check Reminder',
    message: 'Don\'t forget to log your blood pressure and glucose levels today',
    type: 'vital',
    read: false,
    timestamp: '2025-05-08T16:00:00Z'
  }
];

// For doctor dashboard
export const patientListData = [
  {
    id: 'p1',
    name: 'John Doe',
    age: 58,
    condition: 'Hypertension, Type 2 Diabetes',
    lastCheckIn: '2025-05-07',
    status: 'Stable',
    profileImage: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
  },
  {
    id: 'p2',
    name: 'Jane Smith',
    age: 62,
    condition: 'Heart Failure, COPD',
    lastCheckIn: '2025-05-06',
    status: 'Needs Attention',
    profileImage: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
  },
  {
    id: 'p3',
    name: 'Robert Johnson',
    age: 70,
    condition: 'Arthritis, Hypertension',
    lastCheckIn: '2025-05-08',
    status: 'Stable',
    profileImage: 'https://images.pexels.com/photos/834863/pexels-photo-834863.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
  },
  {
    id: 'p4',
    name: 'Maria Garcia',
    age: 54,
    condition: 'Type 1 Diabetes',
    lastCheckIn: '2025-05-05',
    status: 'Critical',
    profileImage: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
  }
];

export const alertsData = [
  {
    id: 'al1',
    patientId: 'p4',
    patientName: 'Maria Garcia',
    type: 'High Glucose',
    value: '210 mg/dL',
    timestamp: '2025-05-08T10:30:00Z',
    status: 'Critical',
    action: 'Review'
  },
  {
    id: 'al2',
    patientId: 'p2',
    patientName: 'Jane Smith',
    type: 'Low Oxygen',
    value: '92%',
    timestamp: '2025-05-08T08:15:00Z',
    status: 'Warning',
    action: 'Review'
  }
];