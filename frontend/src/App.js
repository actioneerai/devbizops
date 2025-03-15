import React from 'react';
import { Outlet } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';
import Notification from './components/Notification';
import './App.css';

function App() {
  return (
    <div className="App">
      <NotificationProvider>
        <AuthProvider>
          <Notification />
          <Outlet />
        </AuthProvider>
      </NotificationProvider>
    </div>
  );
}

export default App;