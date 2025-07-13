import React, { useState } from 'react';
import { format } from 'date-fns';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Activity, AlertCircle, Plus } from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Badge from '../components/common/Badge';
import { vitalsData } from '../data/mockData';

const Vitals: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    systolicBP: '',
    diastolicBP: '',
    glucoseLevel: '',
    pulseRate: '',
    symptoms: '',
  });

  // Get today's date
  const today = format(new Date(), 'yyyy-MM-dd');
  const hasSubmittedToday = vitalsData.some(vital => vital.date === today);

  // Prepare data for charts
  const last7Days = vitalsData.slice(-7);
  const chartData = last7Days.map(vital => ({
    date: format(new Date(vital.date), 'MMM d'),
    bp: vital.systolicBP,
    glucose: vital.glucoseLevel,
    pulse: vital.pulseRate,
  }));

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create new vital record
    const newVital = {
      id: `v${Date.now()}`,
      patientId: 'p1', // In a real app, this would come from the authenticated user
      date: today,
      systolicBP: parseInt(formData.systolicBP),
      diastolicBP: parseInt(formData.diastolicBP),
      glucoseLevel: parseInt(formData.glucoseLevel),
      pulseRate: parseInt(formData.pulseRate),
      symptoms: formData.symptoms ? [formData.symptoms] : []
    };

    // In a real app, this would be an API call to save the data
    vitalsData.push(newVital);

    // Reset form and close
    setShowForm(false);
    setFormData({
      systolicBP: '',
      diastolicBP: '',
      glucoseLevel: '',
      pulseRate: '',
      symptoms: '',
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">My Vitals</h1>
          <p className="text-neutral-600 mt-1">Track and monitor your health vitals</p>
        </div>
        <Button
          variant="primary"
          leftIcon={<Plus className="h-4 w-4" />}
          onClick={() => setShowForm(true)}
          disabled={hasSubmittedToday}
        >
          Log Today's Vitals
        </Button>
      </div>

      {!hasSubmittedToday && !showForm && (
        <div className="mb-6 p-4 bg-warning-50 border border-warning-200 rounded-lg flex items-center">
          <AlertCircle className="h-5 w-5 text-warning-500 mr-2" />
          <p className="text-warning-700">Please submit your vitals for today!</p>
        </div>
      )}

      {showForm && (
        <Card className="mb-6">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex space-x-2">
                <Input
                  label="Systolic BP"
                  name="systolicBP"
                  type="number"
                  value={formData.systolicBP}
                  onChange={handleInputChange}
                  placeholder="120"
                  required
                />
                <Input
                  label="Diastolic BP"
                  name="diastolicBP"
                  type="number"
                  value={formData.diastolicBP}
                  onChange={handleInputChange}
                  placeholder="80"
                  required
                />
              </div>
              <Input
                label="Glucose Level (mg/dL)"
                name="glucoseLevel"
                type="number"
                value={formData.glucoseLevel}
                onChange={handleInputChange}
                placeholder="95"
                required
              />
              <Input
                label="Pulse Rate (bpm)"
                name="pulseRate"
                type="number"
                value={formData.pulseRate}
                onChange={handleInputChange}
                placeholder="72"
                required
              />
              <Input
                label="Symptoms (if any)"
                name="symptoms"
                value={formData.symptoms}
                onChange={handleInputChange}
                placeholder="e.g., Headache, Fatigue"
              />
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <Button
                variant="ghost"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
              >
                Save Vitals
              </Button>
            </div>
          </form>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Charts */}
        <div className="lg:col-span-2 space-y-6">
          <Card title="Blood Pressure Trend">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="bp"
                    stroke="#4A90E2"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card title="Glucose Level">
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="glucose"
                      stroke="#4CAF50"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>

            <Card title="Pulse Rate">
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="pulse"
                      stroke="#FF8C00"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>
        </div>

        {/* History */}
        <div>
          <Card title="Vitals History">
            <div className="space-y-4">
              {vitalsData.slice().reverse().map((vital) => {
                const isHighBP = vital.systolicBP > 140 || vital.diastolicBP > 90;
                const isHighGlucose = vital.glucoseLevel > 140;
                
                return (
                  <div
                    key={vital.id}
                    className="p-4 bg-neutral-50 rounded-lg border border-neutral-200"
                  >
                    <div className="flex justify-between items-start">
                      <p className="font-medium text-neutral-900">
                        {format(new Date(vital.date), 'MMM d, yyyy')}
                      </p>
                      {(isHighBP || isHighGlucose) && (
                        <Badge variant="error" size="sm">Alert</Badge>
                      )}
                    </div>
                    <div className="mt-2 space-y-1">
                      <p className={`text-sm ${isHighBP ? 'text-error-600' : 'text-neutral-600'}`}>
                        BP: {vital.systolicBP}/{vital.diastolicBP} mmHg
                      </p>
                      <p className={`text-sm ${isHighGlucose ? 'text-error-600' : 'text-neutral-600'}`}>
                        Glucose: {vital.glucoseLevel} mg/dL
                      </p>
                      <p className="text-sm text-neutral-600">
                        Pulse: {vital.pulseRate} bpm
                      </p>
                      {vital.symptoms && vital.symptoms.length > 0 && (
                        <p className="text-sm text-neutral-600">
                          Symptoms: {vital.symptoms.join(', ')}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Vitals;