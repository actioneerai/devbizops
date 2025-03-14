import React from 'react';
import { useNotification } from '../contexts/NotificationContext';

/**
 * Demo component to showcase notification functionality
 */
const NotificationDemo = () => {
  const { success, error, info, warning } = useNotification();

  const showSuccessNotification = () => {
    success('Operation completed successfully!');
  };

  const showErrorNotification = () => {
    error('An error occurred while processing your request.');
  };

  const showInfoNotification = () => {
    info('This is an informational message.', 8000);
  };

  const showWarningNotification = () => {
    warning('Please be careful with this action.', 10000);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Notification System Demo</h2>
      <p className="mb-4 text-gray-600">
        Click the buttons below to test different types of notifications.
      </p>
      
      <div className="flex flex-wrap gap-3">
        <button
          onClick={showSuccessNotification}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
        >
          Success Notification
        </button>
        
        <button
          onClick={showErrorNotification}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
        >
          Error Notification
        </button>
        
        <button
          onClick={showInfoNotification}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Info Notification (8s)
        </button>
        
        <button
          onClick={showWarningNotification}
          className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition-colors"
        >
          Warning Notification (10s)
        </button>
      </div>
    </div>
  );
};

export default NotificationDemo;
