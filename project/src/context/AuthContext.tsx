import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string, role: 'patient' | 'doctor') => Promise<void>;
  signup: (name: string, email: string, password: string, role: 'patient' | 'doctor') => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user data for demonstration
const MOCK_USERS = {
  patient: {
    id: 'p1',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'patient' as const,
    profileImage: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
  },
  doctor: {
    id: 'd1',
    name: 'Dr. Sarah Smith',
    email: 'dr.smith@example.com',
    role: 'doctor' as const,
    profileImage: 'https://images.pexels.com/photos/5452293/pexels-photo-5452293.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
  }
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session in localStorage
    const storedUser = localStorage.getItem('caremate_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string, role: 'patient' | 'doctor') => {
    // Simulate authentication delay
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // In a real app, this would be an API call to verify credentials
    const mockUser = role === 'patient' ? MOCK_USERS.patient : MOCK_USERS.doctor;
    setUser(mockUser);
    localStorage.setItem('caremate_user', JSON.stringify(mockUser));
    
    setIsLoading(false);
  };

  const signup = async (name: string, email: string, password: string, role: 'patient' | 'doctor') => {
    // Simulate signup delay
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Create a new user (would be an API call in a real app)
    const newUser = {
      id: `${role[0]}${Date.now()}`,
      name,
      email,
      role,
      profileImage: role === 'patient' 
        ? 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
        : 'https://images.pexels.com/photos/5452293/pexels-photo-5452293.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
    };
    
    setUser(newUser);
    localStorage.setItem('caremate_user', JSON.stringify(newUser));
    
    setIsLoading(false);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('caremate_user');
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    signup,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}