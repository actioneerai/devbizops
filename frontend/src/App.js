import React from 'react';
import { Outlet } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { MetricsProvider } from './contexts/MetricsContext';
import './App.css';

function App() {
  return (
    <div className="App">
      <NotificationProvider>
        <AuthProvider>
          <MetricsProvider>
            <Outlet />
          </MetricsProvider>
        </AuthProvider>
      </NotificationProvider>
    </div>
  );
}

export default App;