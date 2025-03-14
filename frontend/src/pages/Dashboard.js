import React from 'react';
import DashboardComponent from '../components/Dashboard';
import NotificationDemo from '../components/NotificationDemo';
import SupabaseTest from '../components/SupabaseTest';

const Dashboard = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-8">
        <DashboardComponent />
        
        {/* Testing components */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-800">Development & Testing</h2>
          <SupabaseTest />
          <NotificationDemo />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
