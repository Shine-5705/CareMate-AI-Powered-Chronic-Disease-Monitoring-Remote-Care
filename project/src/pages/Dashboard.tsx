import React from 'react';
import { useAuth } from '../context/AuthContext';
import PatientDashboard from './dashboard/PatientDashboard';
import DoctorDashboard from './dashboard/DoctorDashboard';

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  return (
    <div>
      {user?.role === 'patient' ? (
        <PatientDashboard />
      ) : (
        <DoctorDashboard />
      )}
    </div>
  );
};

export default Dashboard;