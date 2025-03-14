import React, { createContext, useState, useContext } from 'react';

// Create notification context
const NotificationContext = createContext();

// Custom hook to use the notification context
export const useNotification = () => {
  return useContext(NotificationContext);
};

// Simple notification component - memoized to prevent unnecessary re-renders
const SimpleNotification = React.memo(({ type, message, onClose }) => {
  // Define styles based on notification type - memoized
  const typeStyles = React.useMemo(() => {
    switch (type) {
      case 'success':
        return 'bg-green-50 text-green-800 border-green-400';
      case 'error':
        return 'bg-red-50 text-red-800 border-red-400';
      case 'warning':
        return 'bg-yellow-50 text-yellow-800 border-yellow-400';
      case 'info':
      default:
        return 'bg-blue-50 text-blue-800 border-blue-400';
    }
  }, [type]);

  // Define icon based on notification type - memoized
  const icon = React.useMemo(() => {
    switch (type) {
      case 'success':
        return (
          <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        );
      case 'error':
        return (
          <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        );
      case 'warning':
        return (
          <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        );
      case 'info':
      default:
        return (
          <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
        );
    }
  }, [type]);

  // Memoize the click handler to prevent unnecessary re-renders
  const handleClose = React.useCallback(() => {
    if (onClose) onClose();
  }, [onClose]);

  return (
    <div className="max-w-md shadow-lg">
      <div 
        className={`flex items-center p-4 border-l-4 rounded-lg ${typeStyles}`} 
        role="alert"
      >
        <div className="flex-shrink-0 mr-3">
          {icon}
        </div>
        <div className="flex-1 text-sm font-medium">
          {message}
        </div>
        <button 
          type="button" 
          className="ml-auto -mx-1.5 -my-1.5 rounded-lg focus:ring-2 p-1.5 inline-flex h-8 w-8 hover:bg-gray-200 focus:outline-none transition-colors duration-200"
          onClick={handleClose}
          aria-label="Close"
        >
          <span className="sr-only">Close</span>
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  );
});

// Provider component that wraps the app and makes notification functions available
export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  // Remove a notification by ID - defined first to avoid circular dependency
  const removeNotification = React.useCallback((id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  }, []);

  // Add a notification - memoized to prevent unnecessary re-renders
  const showNotification = React.useCallback(({ type, message, duration = 5000 }) => {
    // Generate a truly unique ID with timestamp + random string
    const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    // Use functional update to avoid stale closures
    setNotifications(prev => {
      // Check if this notification already exists to prevent duplicates
      if (prev.some(n => n.message === message && n.type === type)) {
        return prev;
      }
      return [...prev, { id, type, message, duration }];
    });
    
    // Auto-remove notification after duration
    if (duration !== 0) {
      setTimeout(() => {
        removeNotification(id);
      }, duration);
    }
    
    return id;
  }, [removeNotification]);

  // Convenience methods for different notification types - memoized to prevent unnecessary re-renders
  const success = React.useCallback((message, duration) => 
    showNotification({ type: 'success', message, duration }), [showNotification]);
    
  const error = React.useCallback((message, duration) => 
    showNotification({ type: 'error', message, duration }), [showNotification]);
    
  const warning = React.useCallback((message, duration) => 
    showNotification({ type: 'warning', message, duration }), [showNotification]);
    
  const info = React.useCallback((message, duration) => 
    showNotification({ type: 'info', message, duration }), [showNotification]);

  // Value object that will be passed to any consuming components - memoized to prevent unnecessary context updates
  const value = React.useMemo(() => ({
    notifications,
    showNotification,
    removeNotification,
    success,
    error,
    warning,
    info
  }), [notifications, showNotification, removeNotification, success, error, warning, info]);

  return (
    <NotificationContext.Provider value={value}>
      {children}
      {/* Render all active notifications */}
      <div className="fixed top-4 right-4 z-50 space-y-2 max-w-md">
        {notifications.map(notification => (
          <SimpleNotification
            key={notification.id}
            type={notification.type}
            message={notification.message}
            onClose={() => removeNotification(notification.id)}
          />
        ))}
      </div>
    </NotificationContext.Provider>
  );
};

export default NotificationContext;
