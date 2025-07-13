import React, { useState } from 'react';
import { User, Edit2, Download, FileText } from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import { useAuth } from '../context/AuthContext';
import { vitalsData } from '../data/mockData';

const Profile: React.FC = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '(555) 123-4567',
    dateOfBirth: '1965-06-15',
    address: '123 Main St, Anytown, USA',
    emergencyContact: 'Jane Doe',
    emergencyPhone: '(555) 987-6543',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle profile update
    setIsEditing(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-neutral-900">My Profile</h1>
        <p className="text-neutral-600 mt-1">Manage your personal information and health records</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Profile Information */}
        <div className="lg:col-span-2">
          <Card>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <div className="h-20 w-20 rounded-full overflow-hidden bg-neutral-200">
                  {user?.profileImage ? (
                    <img
                      src={user.profileImage}
                      alt={user.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <User className="h-full w-full p-4 text-neutral-500" />
                  )}
                </div>
                <div className="ml-4">
                  <h2 className="text-xl font-semibold text-neutral-900">{user?.name}</h2>
                  <p className="text-neutral-500">{user?.email}</p>
                  <p className="text-sm text-neutral-600 mt-1">Patient ID: {user?.id}</p>
                </div>
              </div>
              <Button
                variant="outline"
                leftIcon={<Edit2 className="h-4 w-4" />}
                onClick={() => setIsEditing(!isEditing)}
              >
                {isEditing ? 'Cancel' : 'Edit Profile'}
              </Button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Full Name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
                <Input
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
                <Input
                  label="Phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
                <Input
                  label="Date of Birth"
                  name="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
                <Input
                  label="Address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
                <Input
                  label="Emergency Contact"
                  name="emergencyContact"
                  value={formData.emergencyContact}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
                <Input
                  label="Emergency Contact Phone"
                  name="emergencyPhone"
                  value={formData.emergencyPhone}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </div>

              {isEditing && (
                <div className="mt-6 flex justify-end">
                  <Button type="submit" variant="primary">
                    Save Changes
                  </Button>
                </div>
              )}
            </form>
          </Card>

          {/* Medical History */}
          <Card className="mt-6" title="Medical History">
            <div className="space-y-4">
              <div className="p-4 bg-neutral-50 rounded-lg">
                <h4 className="font-medium text-neutral-900">Chronic Conditions</h4>
                <ul className="mt-2 space-y-1 text-neutral-600">
                  <li>• Hypertension (diagnosed 2020)</li>
                  <li>• Type 2 Diabetes (diagnosed 2019)</li>
                </ul>
              </div>

              <div className="p-4 bg-neutral-50 rounded-lg">
                <h4 className="font-medium text-neutral-900">Medications</h4>
                <ul className="mt-2 space-y-1 text-neutral-600">
                  <li>• Lisinopril 10mg (daily)</li>
                  <li>• Metformin 500mg (twice daily)</li>
                  <li>• Aspirin 81mg (daily)</li>
                </ul>
              </div>

              <div className="p-4 bg-neutral-50 rounded-lg">
                <h4 className="font-medium text-neutral-900">Allergies</h4>
                <ul className="mt-2 space-y-1 text-neutral-600">
                  <li>• Penicillin</li>
                  <li>• Sulfa drugs</li>
                </ul>
              </div>
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <Card title="Health Summary">
            <div className="space-y-4">
              {vitalsData.slice(-1).map((vital) => (
                <div key={vital.id}>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-primary-50 rounded-lg">
                      <p className="text-sm text-neutral-600">Blood Pressure</p>
                      <p className="font-semibold text-lg text-neutral-900">
                        {vital.systolicBP}/{vital.diastolicBP}
                      </p>
                    </div>
                    <div className="p-3 bg-secondary-50 rounded-lg">
                      <p className="text-sm text-neutral-600">Glucose</p>
                      <p className="font-semibold text-lg text-neutral-900">
                        {vital.glucoseLevel}
                      </p>
                    </div>
                  </div>
                  <p className="text-xs text-neutral-500 mt-2">
                    Last updated: {new Date(vital.date).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          </Card>

          {/* Documents */}
          <Card title="Medical Documents">
            <div className="space-y-3">
              <div className="p-3 border border-neutral-200 rounded-lg">
                <div className="flex items-center">
                  <FileText className="h-5 w-5 text-neutral-500" />
                  <span className="ml-2 text-sm text-neutral-900">Latest Lab Results</span>
                </div>
                <div className="mt-2 flex justify-end">
                  <Button
                    variant="outline"
                    size="sm"
                    leftIcon={<Download className="h-4 w-4" />}
                  >
                    Download
                  </Button>
                </div>
              </div>

              <div className="p-3 border border-neutral-200 rounded-lg">
                <div className="flex items-center">
                  <FileText className="h-5 w-5 text-neutral-500" />
                  <span className="ml-2 text-sm text-neutral-900">Vaccination Record</span>
                </div>
                <div className="mt-2 flex justify-end">
                  <Button
                    variant="outline"
                    size="sm"
                    leftIcon={<Download className="h-4 w-4" />}
                  >
                    Download
                  </Button>
                </div>
              </div>

              <div className="p-3 border border-neutral-200 rounded-lg">
                <div className="flex items-center">
                  <FileText className="h-5 w-5 text-neutral-500" />
                  <span className="ml-2 text-sm text-neutral-900">Medical History</span>
                </div>
                <div className="mt-2 flex justify-end">
                  <Button
                    variant="outline"
                    size="sm"
                    leftIcon={<Download className="h-4 w-4" />}
                  >
                    Download
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

export default Profile;