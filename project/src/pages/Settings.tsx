import React, { useState } from 'react';
import { Bell, Lock, Download, Moon, Sun } from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';

const Settings: React.FC = () => {
  const [notifications, setNotifications] = useState({
    appointments: true,
    messages: true,
    vitals: true,
    medications: true,
  });

  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  const handleNotificationToggle = (key: keyof typeof notifications) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-neutral-900">Settings</h1>
        <p className="text-neutral-600 mt-1">Manage your account preferences and settings</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Notification Settings */}
          <Card title="Notification Preferences">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg">
                <div className="flex items-center">
                  <Bell className="h-5 w-5 text-neutral-500" />
                  <div className="ml-3">
                    <p className="font-medium text-neutral-900">Appointment Reminders</p>
                    <p className="text-sm text-neutral-600">Get notified about upcoming appointments</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={notifications.appointments}
                    onChange={() => handleNotificationToggle('appointments')}
                  />
                  <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg">
                <div className="flex items-center">
                  <Bell className="h-5 w-5 text-neutral-500" />
                  <div className="ml-3">
                    <p className="font-medium text-neutral-900">Message Notifications</p>
                    <p className="text-sm text-neutral-600">Get notified about new messages</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={notifications.messages}
                    onChange={() => handleNotificationToggle('messages')}
                  />
                  <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg">
                <div className="flex items-center">
                  <Bell className="h-5 w-5 text-neutral-500" />
                  <div className="ml-3">
                    <p className="font-medium text-neutral-900">Vitals Reminders</p>
                    <p className="text-sm text-neutral-600">Get reminded to log your vitals</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={notifications.vitals}
                    onChange={() => handleNotificationToggle('vitals')}
                  />
                  <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg">
                <div className="flex items-center">
                  <Bell className="h-5 w-5 text-neutral-500" />
                  <div className="ml-3">
                    <p className="font-medium text-neutral-900">Medication Reminders</p>
                    <p className="text-sm text-neutral-600">Get reminded to take your medications</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={notifications.medications}
                    onChange={() => handleNotificationToggle('medications')}
                  />
                  <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
                </label>
              </div>
            </div>
          </Card>

          {/* Security Settings */}
          <Card title="Security Settings">
            <div className="space-y-6">
              <div>
                <h4 className="font-medium text-neutral-900 mb-4">Change Password</h4>
                <div className="space-y-4">
                  <Input
                    type="password"
                    label="Current Password"
                    placeholder="Enter your current password"
                  />
                  <Input
                    type="password"
                    label="New Password"
                    placeholder="Enter your new password"
                  />
                  <Input
                    type="password"
                    label="Confirm New Password"
                    placeholder="Confirm your new password"
                  />
                  <Button variant="primary">Update Password</Button>
                </div>
              </div>

              <div className="pt-6 border-t border-neutral-200">
                <h4 className="font-medium text-neutral-900 mb-4">Two-Factor Authentication</h4>
                <p className="text-neutral-600 mb-4">
                  Add an extra layer of security to your account by enabling two-factor authentication.
                </p>
                <Button variant="outline" leftIcon={<Lock className="h-4 w-4" />}>
                  Enable 2FA
                </Button>
              </div>
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          {/* Theme Settings */}
          <Card title="Appearance">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg">
                <div className="flex items-center">
                  {theme === 'light' ? (
                    <Sun className="h-5 w-5 text-neutral-500" />
                  ) : (
                    <Moon className="h-5 w-5 text-neutral-500" />
                  )}
                  <div className="ml-3">
                    <p className="font-medium text-neutral-900">Theme</p>
                    <p className="text-sm text-neutral-600">Choose your preferred theme</p>
                  </div>
                </div>
                <select
                  value={theme}
                  onChange={(e) => setTheme(e.target.value as 'light' | 'dark')}
                  className="rounded-lg border-neutral-300 text-neutral-700 text-sm"
                >
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                </select>
              </div>
            </div>
          </Card>

          {/* Data Export */}
          <Card title="Data Export">
            <div className="space-y-4">
              <div className="p-4 bg-neutral-50 rounded-lg">
                <h4 className="font-medium text-neutral-900">Export Health Records</h4>
                <p className="text-sm text-neutral-600 mt-1">
                  Download all your health records and data in various formats
                </p>
                <div className="mt-4 space-y-2">
                  <Button
                    variant="outline"
                    fullWidth
                    leftIcon={<Download className="h-4 w-4" />}
                  >
                    Export as PDF
                  </Button>
                  <Button
                    variant="outline"
                    fullWidth
                    leftIcon={<Download className="h-4 w-4" />}
                  >
                    Export as CSV
                  </Button>
                </div>
              </div>
            </div>
          </Card>

          {/* Delete Account */}
          <Card>
            <div className="p-4">
              <h4 className="font-medium text-error-600">Delete Account</h4>
              <p className="text-sm text-neutral-600 mt-1">
                Once you delete your account, there is no going back. Please be certain.
              </p>
              <Button
                variant="outline"
                className="mt-4 text-error-600 border-error-600 hover:bg-error-50"
              >
                Delete Account
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Settings;