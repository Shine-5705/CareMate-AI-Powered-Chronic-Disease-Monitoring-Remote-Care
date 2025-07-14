import React from 'react';
import { Bell, Check } from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import { notificationsData } from '../data/mockData';

const Notifications: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-neutral-900">Notifications</h1>
        <p className="text-neutral-600 mt-1">Stay updated with your health alerts and reminders</p>
      </div>

      <Card>
        <div className="space-y-4">
          {notificationsData.length > 0 ? (
            notificationsData
              .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
              .map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 rounded-lg border ${
                    notification.read
                      ? 'bg-white border-neutral-200'
                      : 'bg-neutral-50 border-primary-200'
                  }`}
                >
                  <div className="flex items-start">
                    <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                      notification.type === 'appointment' ? 'bg-primary-100 text-primary-600' :
                      notification.type === 'medication' ? 'bg-warning-100 text-warning-600' :
                      notification.type === 'message' ? 'bg-accent-100 text-accent-600' :
                      'bg-secondary-100 text-secondary-600'
                    }`}>
                      <Bell className="h-5 w-5" />
                    </div>
                    <div className="ml-4 flex-1">
                      <div className="flex justify-between">
                        <div>
                          <h4 className="font-medium text-neutral-900">{notification.title}</h4>
                          <p className="text-sm text-neutral-600 mt-1">{notification.message}</p>
                        </div>
                        <Badge
                          variant={
                            notification.type === 'appointment' ? 'primary' :
                            notification.type === 'medication' ? 'warning' :
                            notification.type === 'message' ? 'accent' :
                            'secondary'
                          }
                          size="sm"
                        >
                          {notification.type}
                        </Badge>
                      </div>
                      <div className="mt-2 flex justify-between items-center">
                        <p className="text-xs text-neutral-500">
                          {new Date(notification.timestamp).toLocaleString()}
                        </p>
                        {!notification.read && (
                          <Button
                            variant="ghost"
                            size="sm"
                            leftIcon={<Check className="h-4 w-4" />}
                          >
                            Mark as read
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
          ) : (
            <div className="text-center py-8">
              <Bell className="h-12 w-12 text-neutral-400 mx-auto mb-3" />
              <p className="text-neutral-600">No new notifications</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default Notifications;