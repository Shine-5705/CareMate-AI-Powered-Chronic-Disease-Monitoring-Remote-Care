import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, AlertCircle, TrendingUp, Calendar } from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import { carePlansData } from '../data/mockData';

const CarePlans: React.FC = () => {
  const calculateProgress = (tasks: any[]) => {
    if (tasks.length === 0) return 0;
    const completed = tasks.filter(task => task.completed).length;
    return Math.round((completed / tasks.length) * 100);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-neutral-900">Care Plans</h1>
        <p className="text-neutral-600 mt-1">View and manage your personalized care plans</p>
      </div>

      {carePlansData.length > 0 ? (
        <div className="space-y-6">
          {carePlansData.map((plan) => (
            <Card key={plan.id}>
              <div className="border-b border-neutral-200 pb-4 mb-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-semibold text-neutral-900">{plan.title}</h3>
                    <p className="text-neutral-600 mt-1">{plan.description}</p>
                  </div>
                  <Badge variant={plan.active ? 'success' : 'warning'}>
                    {plan.active ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
                <div className="mt-4 text-sm text-neutral-500">
                  Start Date: {new Date(plan.startDate).toLocaleDateString()}
                  {plan.endDate && ` • End Date: ${new Date(plan.endDate).toLocaleDateString()}`}
                </div>
              </div>

              <div className="space-y-4">
                {plan.tasks.slice(0, 3).map((task) => (
                  <div
                    key={task.id}
                    className="flex items-start p-4 bg-neutral-50 rounded-lg"
                  >
                    <div className={`h-6 w-6 ${
                      task.completed ? 'text-success-500' : 'text-neutral-400'
                    }`}>
                      {task.completed ? (
                        <CheckCircle className="h-6 w-6" />
                      ) : (
                        <AlertCircle className="h-6 w-6" />
                      )}
                    </div>
                    <div className="ml-3 flex-1">
                      <p className="font-medium text-neutral-900">{task.description}</p>
                      <p className="text-sm text-neutral-600 mt-1">{task.frequency}</p>
                    </div>
                  </div>
                ))}
                {plan.tasks.length > 3 && (
                  <p className="text-sm text-neutral-600 text-center">
                    +{plan.tasks.length - 3} more tasks
                  </p>
                )}
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <Button variant="outline">
                  Download Plan
                </Button>
                <Link to={`/care-plans/${plan.id}`}>
                  <Button variant="primary">
                    View Full Care Plan
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <div className="text-center py-8">
            <AlertCircle className="h-12 w-12 text-neutral-400 mx-auto mb-3" />
            <p className="text-neutral-600">No care plans assigned yet</p>
          </div>
        </Card>
      )}
    </div>
  );
};

export default CarePlans;