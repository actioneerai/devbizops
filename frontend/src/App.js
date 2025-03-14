import React from 'react';
import { Outlet } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { MetricsProvider } from './contexts/MetricsContext';
import './App.css';

// Main App component that wraps everything with providers
function App() {
  return (
    <NotificationProvider>
      <AuthProvider>
        <MetricsProvider>
          <Outlet />
        </MetricsProvider>
      </AuthProvider>
    </NotificationProvider>
  );
}

export default App;
