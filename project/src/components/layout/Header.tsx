import React, { useState } from 'react';
import { Menu, X, BellIcon, MessageSquare, User, Bot } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useAIHealthAssistant } from '../ai/AIHealthAssistantProvider';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { openAssistant } = useAIHealthAssistant();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
  const toggleNotifications = () => setIsNotificationsOpen(!isNotificationsOpen);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo and site name */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <div className="flex items-center justify-center h-9 w-9 rounded-lg bg-primary-500 text-white">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <span className="ml-2 text-xl font-bold text-primary-500">CareMate</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {isAuthenticated && (
              <>
                <Link to="/dashboard" className="font-medium text-neutral-700 hover:text-primary-500 transition-colors">
                  Dashboard
                </Link>
                {user?.role === 'patient' && (
                  <>
                    <Link to="/vitals" className="font-medium text-neutral-700 hover:text-primary-500 transition-colors">
                      My Vitals
                    </Link>
                    <Link to="/appointments" className="font-medium text-neutral-700 hover:text-primary-500 transition-colors">
                      Appointments
                    </Link>
                  </>
                )}
                {user?.role === 'doctor' && (
                  <>
                    <Link to="/patients" className="font-medium text-neutral-700 hover:text-primary-500 transition-colors">
                      Patients
                    </Link>
                    <Link to="/schedule" className="font-medium text-neutral-700 hover:text-primary-500 transition-colors">
                      Schedule
                    </Link>
                  </>
                )}
                <Link to="/messages" className="font-medium text-neutral-700 hover:text-primary-500 transition-colors">
                  Messages
                </Link>
              </>
            )}
            {!isAuthenticated && (
              <>
                <Link to="/" className="font-medium text-neutral-700 hover:text-primary-500 transition-colors">
                  Home
                </Link>
                <Link to="/features" className="font-medium text-neutral-700 hover:text-primary-500 transition-colors">
                  Features
                </Link>
                <Link to="/about" className="font-medium text-neutral-700 hover:text-primary-500 transition-colors">
                  About
                </Link>
              </>
            )}
          </nav>

          {/* Right side menu (authenticated) */}
          {isAuthenticated ? (
            <div className="hidden md:flex items-center space-x-4">
              {/* Notifications */}
              <div className="relative">
                <button 
                  className="p-1.5 text-neutral-700 hover:bg-neutral-100 rounded-full transition-colors relative"
                  onClick={toggleNotifications}
                >
                  <BellIcon className="h-5 w-5" />
                  <span className="absolute top-0 right-0 h-2 w-2 bg-error-500 rounded-full"></span>
                </button>
                
                {isNotificationsOpen && (
                  <div className="absolute right-0 w-80 bg-white rounded-lg shadow-lg py-2 mt-2 border border-neutral-200 z-50">
                    <div className="px-4 py-2 border-b border-neutral-100">
                      <h3 className="font-semibold text-neutral-900">Notifications</h3>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      <div className="px-4 py-3 hover:bg-neutral-50 border-b border-neutral-100">
                        <p className="text-sm font-medium text-neutral-900">Medication Reminder</p>
                        <p className="text-xs text-neutral-500 mt-1">Time to take your blood pressure medication</p>
                      </div>
                      <div className="px-4 py-3 hover:bg-neutral-50">
                        <p className="text-sm font-medium text-neutral-900">Appointment Tomorrow</p>
                        <p className="text-xs text-neutral-500 mt-1">You have an appointment with Dr. Sarah Smith at 9:00 AM</p>
                      </div>
                    </div>
                    <div className="px-4 py-2 border-t border-neutral-100 text-center">
                      <Link to="/notifications" className="text-sm text-primary-500 hover:text-primary-600 font-medium">
                        View all
                      </Link>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Messages */}
              <Link to="/messages" className="p-1.5 text-neutral-700 hover:bg-neutral-100 rounded-full transition-colors relative">
                <MessageSquare className="h-5 w-5" />
                <span className="absolute top-0 right-0 h-2 w-2 bg-error-500 rounded-full"></span>
              </Link>
              
              {/* AI Health Assistant */}
              <button 
                onClick={openAssistant}
                className="p-1.5 text-neutral-700 hover:bg-neutral-100 rounded-full transition-colors"
                title="AI Health Assistant"
              >
                <Bot className="h-5 w-5" />
              </button>
              
              {/* Profile dropdown */}
              <div className="relative">
                <button 
                  className="flex items-center space-x-2 focus:outline-none"
                  onClick={toggleDropdown}
                >
                  <div className="h-8 w-8 rounded-full overflow-hidden bg-neutral-200">
                    {user?.profileImage ? (
                      <img 
                        src={user.profileImage} 
                        alt={user.name} 
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <User className="h-full w-full p-1 text-neutral-500" />
                    )}
                  </div>
                </button>
                
                {isDropdownOpen && (
                  <div className="absolute right-0 w-48 bg-white rounded-lg shadow-lg py-2 mt-2 border border-neutral-200 z-50">
                    <div className="px-4 py-2 border-b border-neutral-100">
                      <p className="text-sm font-medium text-neutral-900">{user?.name}</p>
                      <p className="text-xs text-neutral-500">{user?.email}</p>
                    </div>
                    <Link to="/profile" className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50">
                      Profile
                    </Link>
                    <Link to="/settings" className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50">
                      Settings
                    </Link>
                    <button 
                      onClick={logout}
                      className="block w-full text-left px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50"
                    >
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="hidden md:flex items-center space-x-4">
              <Link 
                to="/login" 
                className="font-medium text-primary-500 hover:text-primary-600 transition-colors"
              >
                Log in
              </Link>
              <Link 
                to="/signup" 
                className="px-4 py-2 bg-primary-500 text-white font-medium rounded-lg hover:bg-primary-600 transition-colors"
              >
                Sign up
              </Link>
            </div>
          )}

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="p-2 rounded-md text-neutral-700 hover:bg-neutral-100 transition-colors"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-neutral-100 py-2">
          <div className="px-4 space-y-1">
            {isAuthenticated ? (
              <>
                <div className="flex items-center space-x-3 px-3 py-3 border-b border-neutral-100 mb-2">
                  <div className="h-10 w-10 rounded-full overflow-hidden bg-neutral-200">
                    {user?.profileImage ? (
                      <img 
                        src={user.profileImage} 
                        alt={user.name} 
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <User className="h-full w-full p-1.5 text-neutral-500" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-neutral-900">{user?.name}</p>
                    <p className="text-sm text-neutral-500">{user?.email}</p>
                  </div>
                </div>

                <Link 
                  to="/dashboard" 
                  className="block px-3 py-2 rounded-md font-medium text-neutral-700 hover:bg-neutral-100"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>
                
                {user?.role === 'patient' && (
                  <>
                    <Link 
                      to="/vitals" 
                      className="block px-3 py-2 rounded-md font-medium text-neutral-700 hover:bg-neutral-100"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      My Vitals
                    </Link>
                    <Link 
                      to="/appointments" 
                      className="block px-3 py-2 rounded-md font-medium text-neutral-700 hover:bg-neutral-100"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Appointments
                    </Link>
                  </>
                )}
                
                {user?.role === 'doctor' && (
                  <>
                    <Link 
                      to="/patients" 
                      className="block px-3 py-2 rounded-md font-medium text-neutral-700 hover:bg-neutral-100"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Patients
                    </Link>
                    <Link 
                      to="/schedule" 
                      className="block px-3 py-2 rounded-md font-medium text-neutral-700 hover:bg-neutral-100"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Schedule
                    </Link>
                  </>
                )}
                
                <Link 
                  to="/messages" 
                  className="block px-3 py-2 rounded-md font-medium text-neutral-700 hover:bg-neutral-100"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Messages
                </Link>
                
                <button 
                  onClick={() => {
                    openAssistant();
                    setIsMenuOpen(false);
                  }}
                  className="block w-full text-left px-3 py-2 rounded-md font-medium text-neutral-700 hover:bg-neutral-100"
                >
                  AI Health Assistant
                </button>
                
                <Link 
                  to="/notifications" 
                  className="block px-3 py-2 rounded-md font-medium text-neutral-700 hover:bg-neutral-100"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Notifications
                </Link>
                
                <Link 
                  to="/profile" 
                  className="block px-3 py-2 rounded-md font-medium text-neutral-700 hover:bg-neutral-100"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Profile
                </Link>
                
                <Link 
                  to="/settings" 
                  className="block px-3 py-2 rounded-md font-medium text-neutral-700 hover:bg-neutral-100"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Settings
                </Link>
                
                <button 
                  onClick={() => {
                    logout();
                    setIsMenuOpen(false);
                  }}
                  className="block w-full text-left px-3 py-2 rounded-md font-medium text-neutral-700 hover:bg-neutral-100"
                >
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/" 
                  className="block px-3 py-2 rounded-md font-medium text-neutral-700 hover:bg-neutral-100"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Home
                </Link>
                <Link 
                  to="/features" 
                  className="block px-3 py-2 rounded-md font-medium text-neutral-700 hover:bg-neutral-100"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Features
                </Link>
                <Link 
                  to="/about" 
                  className="block px-3 py-2 rounded-md font-medium text-neutral-700 hover:bg-neutral-100"
                  onClick={() => setIsMenuOpen(false)}
                >
                  About
                </Link>
                <div className="pt-4 pb-3 border-t border-neutral-100">
                  <Link 
                    to="/login" 
                    className="block w-full px-3 py-2 text-center font-medium text-primary-500 rounded-md border border-primary-500 hover:bg-primary-50"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Log in
                  </Link>
                  <Link 
                    to="/signup" 
                    className="block w-full mt-2 px-3 py-2 text-center font-medium text-white bg-primary-500 rounded-md hover:bg-primary-600"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign up
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;