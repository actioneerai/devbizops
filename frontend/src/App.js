import React from 'react';
import { Outlet } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { MetricsProvider } from './contexts/MetricsContext';
import Notification from './components/Notification';
import './App.css';

function App() {
  return (
    <div className="App">
      <NotificationProvider>
        <AuthProvider>
          <MetricsProvider>
            <Notification />
            <Outlet />
          </MetricsProvider>
        </AuthProvider>
      </NotificationProvider>
    </div>
  );
}

export default App;