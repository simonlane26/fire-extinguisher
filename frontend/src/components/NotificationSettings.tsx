import { useState, useEffect } from 'react';
import { Bell, BellOff, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { notificationService } from '../lib/notifications';

export default function NotificationSettings() {
  const [supported, setSupported] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);

  useEffect(() => {
    checkNotificationStatus();
  }, []);

  const checkNotificationStatus = async () => {
    const isSupported = notificationService.isSupported();
    setSupported(isSupported);

    if (isSupported) {
      const perm = notificationService.getPermissionStatus();
      setPermission(perm);

      const isSub = await notificationService.isSubscribed();
      setSubscribed(isSub);
    }
  };

  const handleEnableNotifications = async () => {
    setLoading(true);
    setMessage(null);

    try {
      const success = await notificationService.subscribe();

      if (success) {
        setSubscribed(true);
        setPermission('granted');
        setMessage({ type: 'success', text: 'Push notifications enabled successfully!' });
      } else {
        setMessage({ type: 'error', text: 'Failed to enable notifications. Please check your browser settings.' });
      }
    } catch (error) {
      console.error('Failed to enable notifications:', error);
      setMessage({ type: 'error', text: 'An error occurred while enabling notifications.' });
    } finally {
      setLoading(false);
    }
  };

  const handleDisableNotifications = async () => {
    setLoading(true);
    setMessage(null);

    try {
      const success = await notificationService.unsubscribe();

      if (success) {
        setSubscribed(false);
        setMessage({ type: 'info', text: 'Push notifications disabled.' });
      } else {
        setMessage({ type: 'error', text: 'Failed to disable notifications.' });
      }
    } catch (error) {
      console.error('Failed to disable notifications:', error);
      setMessage({ type: 'error', text: 'An error occurred while disabling notifications.' });
    } finally {
      setLoading(false);
    }
  };

  const handleTestNotification = async () => {
    setLoading(true);
    setMessage(null);

    try {
      const success = await notificationService.sendTestNotification();

      if (success) {
        setMessage({ type: 'success', text: 'Test notification sent! Check your notifications.' });
      } else {
        setMessage({ type: 'error', text: 'Failed to send test notification.' });
      }
    } catch (error) {
      console.error('Failed to send test notification:', error);
      setMessage({ type: 'error', text: 'An error occurred while sending test notification.' });
    } finally {
      setLoading(false);
    }
  };

  if (!supported) {
    return (
      <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
        <div className="flex items-start">
          <AlertCircle className="h-5 w-5 text-yellow-600 mr-3 mt-0.5" />
          <div>
            <h3 className="font-semibold text-yellow-800">Push Notifications Not Supported</h3>
            <p className="mt-1 text-sm text-yellow-700">
              Your browser does not support push notifications. Please use a modern browser like Chrome, Firefox, or Edge.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {subscribed ? (
            <Bell className="h-6 w-6 text-purple-600" />
          ) : (
            <BellOff className="h-6 w-6 text-gray-400" />
          )}
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Push Notifications</h3>
            <p className="text-sm text-gray-500">
              Get notified about inspections, maintenance, and alerts
            </p>
          </div>
        </div>

        {/* Status Badge */}
        <div>
          {subscribed ? (
            <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800">
              <CheckCircle className="h-4 w-4 mr-1" />
              Enabled
            </span>
          ) : (
            <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-800">
              <XCircle className="h-4 w-4 mr-1" />
              Disabled
            </span>
          )}
        </div>
      </div>

      {/* Message Alert */}
      {message && (
        <div
          className={`rounded-lg border p-4 ${
            message.type === 'success'
              ? 'border-green-200 bg-green-50 text-green-800'
              : message.type === 'error'
              ? 'border-red-200 bg-red-50 text-red-800'
              : 'border-blue-200 bg-blue-50 text-blue-800'
          }`}
        >
          <p className="text-sm font-medium">{message.text}</p>
        </div>
      )}

      {/* Permission Status */}
      <div className="rounded-lg border border-gray-200 bg-white p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-900">Browser Permission</p>
            <p className="text-sm text-gray-500">
              {permission === 'granted' && 'Granted - You can receive notifications'}
              {permission === 'denied' && 'Denied - Please enable in browser settings'}
              {permission === 'default' && 'Not requested yet'}
            </p>
          </div>
          <div>
            {permission === 'granted' ? (
              <CheckCircle className="h-6 w-6 text-green-600" />
            ) : permission === 'denied' ? (
              <XCircle className="h-6 w-6 text-red-600" />
            ) : (
              <AlertCircle className="h-6 w-6 text-yellow-600" />
            )}
          </div>
        </div>
      </div>

      {/* Notification Types */}
      <div className="rounded-lg border border-gray-200 bg-white p-4">
        <h4 className="text-sm font-semibold text-gray-900 mb-3">You will receive notifications for:</h4>
        <ul className="space-y-2 text-sm text-gray-600">
          <li className="flex items-center">
            <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
            Upcoming inspections (7 days before)
          </li>
          <li className="flex items-center">
            <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
            Overdue inspections
          </li>
          <li className="flex items-center">
            <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
            Maintenance due dates
          </li>
          <li className="flex items-center">
            <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
            Low inventory stock alerts
          </li>
          <li className="flex items-center">
            <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
            Subscription billing alerts
          </li>
        </ul>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        {!subscribed ? (
          <button
            onClick={handleEnableNotifications}
            disabled={loading || permission === 'denied'}
            className="flex-1 flex items-center justify-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Bell className="h-5 w-5 mr-2" />
            {loading ? 'Enabling...' : 'Enable Notifications'}
          </button>
        ) : (
          <>
            <button
              onClick={handleTestNotification}
              disabled={loading}
              className="flex-1 flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Bell className="h-5 w-5 mr-2" />
              {loading ? 'Sending...' : 'Send Test Notification'}
            </button>
            <button
              onClick={handleDisableNotifications}
              disabled={loading}
              className="flex-1 flex items-center justify-center px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <BellOff className="h-5 w-5 mr-2" />
              {loading ? 'Disabling...' : 'Disable Notifications'}
            </button>
          </>
        )}
      </div>

      {/* Help Text */}
      {permission === 'denied' && (
        <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
          <p className="text-sm text-yellow-800 font-medium mb-2">
            Notifications are blocked in your browser
          </p>
          <p className="text-sm text-yellow-700">
            To enable notifications, click the lock icon in your browser's address bar and change the notification permission to "Allow".
          </p>
        </div>
      )}
    </div>
  );
}
