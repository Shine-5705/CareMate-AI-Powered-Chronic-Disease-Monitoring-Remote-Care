import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Activity, UserCheck } from 'lucide-react';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { useAuth } from '../../context/AuthContext';

const Signup: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<'patient' | 'doctor'>('patient');
  const [errors, setErrors] = useState<{ 
    name?: string; 
    email?: string; 
    password?: string;
    confirmPassword?: string;
  }>({});
  
  const { signup, isLoading } = useAuth();
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors: { 
      name?: string; 
      email?: string; 
      password?: string;
      confirmPassword?: string;
    } = {};
    let isValid = true;

    if (!name) {
      newErrors.name = 'Name is required';
      isValid = false;
    }

    if (!email) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
      isValid = false;
    }

    if (!password) {
      newErrors.password = 'Password is required';
      isValid = false;
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
      isValid = false;
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      try {
        await signup(name, email, password, role);
        navigate('/dashboard');
      } catch (error) {
        console.error('Signup error:', error);
        // Handle signup error
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-neutral-50">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-primary-500 text-white">
            <Activity className="h-8 w-8" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-neutral-900">
          Create your account
        </h2>
        <p className="mt-2 text-center text-sm text-neutral-600">
          Or{' '}
          <Link to="/login" className="font-medium text-primary-500 hover:text-primary-600">
            sign in to your existing account
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <Input
                id="name"
                label="Full name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                error={errors.name}
                placeholder="John Doe"
                leftIcon={<UserCheck className="h-5 w-5 text-neutral-400" />}
                required
              />
            </div>

            <div>
              <Input
                id="email"
                label="Email address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={errors.email}
                placeholder="you@example.com"
                leftIcon={<Mail className="h-5 w-5 text-neutral-400" />}
                required
              />
            </div>

            <div>
              <Input
                id="password"
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={errors.password}
                placeholder="••••••••"
                leftIcon={<Lock className="h-5 w-5 text-neutral-400" />}
                required
              />
            </div>

            <div>
              <Input
                id="confirmPassword"
                label="Confirm Password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                error={errors.confirmPassword}
                placeholder="••••••••"
                leftIcon={<Lock className="h-5 w-5 text-neutral-400" />}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                I am a:
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  className={`flex items-center justify-center px-4 py-2 border ${
                    role === 'patient'
                      ? 'border-primary-500 bg-primary-50 text-primary-700'
                      : 'border-neutral-300 bg-white text-neutral-700 hover:bg-neutral-50'
                  } rounded-lg transition-colors duration-200`}
                  onClick={() => setRole('patient')}
                >
                  <User className="h-5 w-5 mr-2" />
                  Patient
                </button>
                <button
                  type="button"
                  className={`flex items-center justify-center px-4 py-2 border ${
                    role === 'doctor'
                      ? 'border-primary-500 bg-primary-50 text-primary-700'
                      : 'border-neutral-300 bg-white text-neutral-700 hover:bg-neutral-50'
                  } rounded-lg transition-colors duration-200`}
                  onClick={() => setRole('doctor')}
                >
                  <Activity className="h-5 w-5 mr-2" />
                  Doctor
                </button>
              </div>
            </div>

            <div className="flex items-center">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                className="h-4 w-4 text-primary-500 focus:ring-primary-500 border-neutral-300 rounded"
                required
              />
              <label htmlFor="terms" className="ml-2 block text-sm text-neutral-700">
                I agree to the{' '}
                <Link to="/terms" className="font-medium text-primary-500 hover:text-primary-600">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link to="/privacy" className="font-medium text-primary-500 hover:text-primary-600">
                  Privacy Policy
                </Link>
              </label>
            </div>

            <div>
              <Button
                type="submit"
                fullWidth
                isLoading={isLoading}
              >
                Create Account
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;