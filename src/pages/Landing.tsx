import React from 'react';
import { Link } from 'react-router-dom';
import { Activity, CheckCircle, Calendar, MessageSquare, ChevronRight } from 'lucide-react';
import Button from '../components/common/Button';

const Landing: React.FC = () => {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-50 to-secondary-50 opacity-70"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-24 sm:pt-24 sm:pb-32">
          <div className="lg:grid lg:grid-cols-12 lg:gap-8">
            <div className="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left">
              <h1 className="text-4xl font-extrabold tracking-tight text-neutral-900 sm:text-5xl md:text-6xl lg:text-5xl xl:text-6xl">
                <span className="block">Simplifying</span>{' '}
                <span className="block text-primary-500">Chronic Care Management</span>
              </h1>
              <p className="mt-6 text-base text-neutral-600 sm:text-lg md:text-xl">
                CareMate helps patients and healthcare providers manage chronic conditions more effectively through 
                easy vitals tracking, secure communication, and personalized care plans.
              </p>
              <div className="mt-8 sm:max-w-lg sm:mx-auto sm:text-center lg:text-left lg:mx-0">
                <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
                  <Link to="/signup">
                    <Button 
                      variant="primary" 
                      size="lg" 
                      className="w-full sm:w-auto"
                      rightIcon={<ChevronRight className="h-4 w-4" />}
                    >
                      Get Started
                    </Button>
                  </Link>
                  <Link to="/features">
                    <Button 
                      variant="outline" 
                      size="lg" 
                      className="w-full sm:w-auto"
                    >
                      Learn More
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
            <div className="mt-12 relative sm:max-w-lg sm:mx-auto lg:mt-0 lg:max-w-none lg:mx-0 lg:col-span-6 lg:flex lg:items-center">
              <div className="relative mx-auto w-full rounded-lg shadow-lg lg:max-w-md">
                <div className="relative block w-full bg-white rounded-lg overflow-hidden">
                  <img
                    className="w-full"
                    src="https://images.pexels.com/photos/7089401/pexels-photo-7089401.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                    alt="Doctor with a patient using a tablet"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-white sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-base font-semibold text-primary-500 tracking-wide uppercase">Features</h2>
            <p className="mt-1 text-3xl font-extrabold text-neutral-900 sm:text-4xl sm:tracking-tight">
              Everything you need to manage chronic care
            </p>
            <p className="max-w-xl mt-5 mx-auto text-xl text-neutral-600">
              Our platform provides powerful tools for patients and healthcare providers to collaborate effectively.
            </p>
          </div>

          <div className="mt-16">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
              <div className="pt-6">
                <div className="flow-root rounded-lg px-6 pb-8">
                  <div className="-mt-6">
                    <div>
                      <span className="inline-flex items-center justify-center p-3 bg-primary-500 rounded-md shadow-lg">
                        <Activity className="h-6 w-6 text-white" />
                      </span>
                    </div>
                    <h3 className="mt-8 text-lg font-medium text-neutral-900 tracking-tight">Vitals Tracking</h3>
                    <p className="mt-5 text-base text-neutral-600">
                      Easily track and monitor vital signs like blood pressure, glucose levels, and pulse rate with interactive charts.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <div className="flow-root rounded-lg px-6 pb-8">
                  <div className="-mt-6">
                    <div>
                      <span className="inline-flex items-center justify-center p-3 bg-primary-500 rounded-md shadow-lg">
                        <CheckCircle className="h-6 w-6 text-white" />
                      </span>
                    </div>
                    <h3 className="mt-8 text-lg font-medium text-neutral-900 tracking-tight">Care Plans</h3>
                    <p className="mt-5 text-base text-neutral-600">
                      Personalized care plans created by your healthcare provider with tasks and goals for managing your condition.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <div className="flow-root rounded-lg px-6 pb-8">
                  <div className="-mt-6">
                    <div>
                      <span className="inline-flex items-center justify-center p-3 bg-primary-500 rounded-md shadow-lg">
                        <MessageSquare className="h-6 w-6 text-white" />
                      </span>
                    </div>
                    <h3 className="mt-8 text-lg font-medium text-neutral-900 tracking-tight">Secure Messaging</h3>
                    <p className="mt-5 text-base text-neutral-600">
                      Communicate directly with your healthcare provider through secure, HIPAA-compliant messaging.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <div className="flow-root rounded-lg px-6 pb-8">
                  <div className="-mt-6">
                    <div>
                      <span className="inline-flex items-center justify-center p-3 bg-primary-500 rounded-md shadow-lg">
                        <Calendar className="h-6 w-6 text-white" />
                      </span>
                    </div>
                    <h3 className="mt-8 text-lg font-medium text-neutral-900 tracking-tight">Appointments</h3>
                    <p className="mt-5 text-base text-neutral-600">
                      Schedule and manage appointments with your healthcare provider right from the app.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="bg-neutral-50 py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-base font-semibold text-primary-500 tracking-wide uppercase">Testimonials</h2>
            <p className="mt-1 text-3xl font-extrabold text-neutral-900 sm:text-4xl sm:tracking-tight">
              Trusted by patients and providers
            </p>
          </div>
          <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <div className="bg-white rounded-xl shadow-soft p-6">
              <div className="flex items-center">
                <img 
                  className="h-12 w-12 rounded-full" 
                  src="https://images.pexels.com/photos/3760263/pexels-photo-3760263.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                  alt="Patient testimonial" 
                />
                <div className="ml-4">
                  <h4 className="text-lg font-medium text-neutral-900">Margaret W.</h4>
                  <p className="text-sm text-neutral-500">Diabetes Patient</p>
                </div>
              </div>
              <p className="mt-4 text-base text-neutral-600">
                "CareMate has completely changed how I manage my diabetes. Being able to track my glucose levels and 
                communicate directly with my doctor gives me peace of mind."
              </p>
            </div>
            
            <div className="bg-white rounded-xl shadow-soft p-6">
              <div className="flex items-center">
                <img 
                  className="h-12 w-12 rounded-full" 
                  src="https://images.pexels.com/photos/5329321/pexels-photo-5329321.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                  alt="Doctor testimonial" 
                />
                <div className="ml-4">
                  <h4 className="text-lg font-medium text-neutral-900">Dr. James R.</h4>
                  <p className="text-sm text-neutral-500">Cardiologist</p>
                </div>
              </div>
              <p className="mt-4 text-base text-neutral-600">
                "As a doctor, CareMate allows me to monitor my patients more effectively between visits. The real-time 
                data helps me make better treatment decisions."
              </p>
            </div>
            
            <div className="bg-white rounded-xl shadow-soft p-6">
              <div className="flex items-center">
                <img 
                  className="h-12 w-12 rounded-full" 
                  src="https://images.pexels.com/photos/3831577/pexels-photo-3831577.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                  alt="Patient testimonial" 
                />
                <div className="ml-4">
                  <h4 className="text-lg font-medium text-neutral-900">Robert M.</h4>
                  <p className="text-sm text-neutral-500">Hypertension Patient</p>
                </div>
              </div>
              <p className="mt-4 text-base text-neutral-600">
                "I've tried many health apps, but CareMate is the only one that truly helps me stay on top of my 
                condition. The reminders and tracking features are invaluable."
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-primary-500">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            <span className="block">Ready to get started?</span>
            <span className="block text-primary-100">Join CareMate today.</span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            <div className="inline-flex rounded-md shadow">
              <Link to="/signup">
                <Button 
                  className="w-full bg-white text-primary-600 hover:bg-primary-50 border-white"
                  size="lg"
                >
                  Get Started
                </Button>
              </Link>
            </div>
            <div className="ml-3 inline-flex rounded-md shadow">
              <Link to="/contact">
                <Button 
                  variant="outline"
                  className="w-full border-white text-white hover:bg-primary-600"
                  size="lg"
                >
                  Contact Sales
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;