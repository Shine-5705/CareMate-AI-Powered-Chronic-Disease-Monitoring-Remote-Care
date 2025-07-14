import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, Download, Calendar, CheckCircle } from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import { carePlansData } from '../data/mockData';

const CarePlanDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [tasks, setTasks] = useState(carePlansData);
  
  const plan = tasks.find(p => p.id === id);
  if (!plan) return <div>Plan not found</div>;

  const calculateProgress = (tasks: any[]) => {
    if (tasks.length === 0) return 0;
    const completed = tasks.filter(task => task.completed).length;
    return Math.round((completed / tasks.length) * 100);
  };

  const progress = calculateProgress(plan.tasks);

  const handleTaskCompletion = (taskId: string) => {
    setTasks(prevTasks => 
      prevTasks.map(p => {
        if (p.id === id) {
          return {
            ...p,
            tasks: p.tasks.map(task => 
              task.id === taskId ? { ...task, completed: !task.completed } : task
            )
          };
        }
        return p;
      })
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <Link to="/care-plans">
          <Button
            variant="ghost"
            className="mb-4"
            leftIcon={<ChevronLeft className="h-4 w-4" />}
          >
            Back to Care Plans
          </Button>
        </Link>
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-neutral-900">{plan.title}</h1>
            <p className="text-neutral-600 mt-1">{plan.description}</p>
          </div>
          <Badge variant={plan.active ? 'success' : 'warning'}>
            {plan.active ? 'Active' : 'Inactive'}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-semibold">Progress</h3>
                <span className="text-sm text-neutral-600">{progress}% Complete</span>
              </div>
              <div className="bg-neutral-100 rounded-full h-4 w-full">
                <div 
                  className="bg-primary-500 h-4 rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>

            <div className="space-y-4">
              {plan.tasks.map((task) => (
                <div
                  key={task.id}
                  className={`p-4 rounded-lg border transition-all ${
                    task.completed 
                      ? 'bg-primary-50 border-primary-200' 
                      : 'bg-white border-neutral-200 hover:border-primary-200'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start flex-1">
                      <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => handleTaskCompletion(task.id)}
                        className="mt-1.5 h-4 w-4 text-primary-500 rounded border-neutral-300 focus:ring-primary-500"
                      />
                      <div className="ml-3">
                        <p className={`font-medium ${task.completed ? 'text-primary-900' : 'text-neutral-900'}`}>
                          {task.description}
                        </p>
                        <p className={`text-sm mt-1 ${task.completed ? 'text-primary-600' : 'text-neutral-600'}`}>
                          {task.frequency}
                        </p>
                      </div>
                    </div>
                    <Badge variant={task.completed ? 'success' : 'warning'}>
                      {task.completed ? 'Completed' : 'Pending'}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card title="Plan Details">
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-3 border-b border-neutral-200">
                <span className="text-neutral-600">Start Date</span>
                <span className="font-medium">{new Date(plan.startDate).toLocaleDateString()}</span>
              </div>
              {plan.endDate && (
                <div className="flex justify-between items-center pb-3 border-b border-neutral-200">
                  <span className="text-neutral-600">End Date</span>
                  <span className="font-medium">{new Date(plan.endDate).toLocaleDateString()}</span>
                </div>
              )}
              <div className="flex justify-between items-center pb-3 border-b border-neutral-200">
                <span className="text-neutral-600">Tasks</span>
                <span className="font-medium">{plan.tasks.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-neutral-600">Completed Tasks</span>
                <span className="font-medium">{plan.tasks.filter(t => t.completed).length}</span>
              </div>
            </div>
          </Card>

          <Card title="Actions">
            <div className="space-y-3">
              <Button
                variant="outline"
                fullWidth
                leftIcon={<Download className="h-4 w-4" />}
              >
                Download Plan
              </Button>
              <Button
                variant="outline"
                fullWidth
                leftIcon={<Calendar className="h-4 w-4" />}
              >
                Schedule Review
              </Button>
              <Button
                variant="outline"
                fullWidth
                className="text-error-600 border-error-600 hover:bg-error-50"
              >
                Mark as Inactive
              </Button>
            </div>
          </Card>

          <Card title="Activity Log">
            <div className="space-y-3">
              <div className="text-sm">
                <div className="flex justify-between items-center text-neutral-600 mb-2">
                  <span>Last updated</span>
                  <span>{new Date().toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between items-center text-neutral-600 mb-2">
                  <span>Created by</span>
                  <span>Dr. Sarah Smith</span>
                </div>
                <div className="flex justify-between items-center text-neutral-600">
                  <span>Last reviewed</span>
                  <span>{new Date().toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CarePlanDetail;