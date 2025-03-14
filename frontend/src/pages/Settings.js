import React, { useState, useEffect } from 'react';
import { FaSave, FaPlus, FaTrash, FaToggleOn, FaToggleOff, FaUser, FaCog, FaPlug, FaLock } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import { useNotification } from '../contexts/NotificationContext';
import useIntegrations from '../hooks/useIntegrations';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';

const Settings = () => {
  // Get auth, notification, and integrations hooks
  const { user, updateProfile, updatePassword } = useAuth();
  const { success, error } = useNotification();
  const { integrations, loading: integrationsLoading, addIntegration, updateIntegration, deleteIntegration, toggleIntegrationStatus } = useIntegrations();
  
  // State for settings
  const [settings, setSettings] = useState({
    dashboardLayout: 'grid',
    theme: 'light',
    notifications: true,
    priorityMetrics: ['revenue', 'userAcquisition', 'deployments'],
    availableMetrics: [
      { id: 'revenue', name: 'Revenue Impact', category: 'business' },
      { id: 'userAcquisition', name: 'User Acquisition', category: 'business' },
      { id: 'customerSatisfaction', name: 'Customer Satisfaction', category: 'business' },
      { id: 'deployments', name: 'Code Deployments', category: 'technical' },
      { id: 'technicalDebt', name: 'Technical Debt', category: 'technical' },
      { id: 'cicdStatus', name: 'CI/CD Pipeline Status', category: 'technical' },
      { id: 'bugRate', name: 'Bug Rate', category: 'technical' },
      { id: 'featureUsage', name: 'Feature Usage', category: 'business' },
    ]
  });
  
  // State for profile settings
  const [profile, setProfile] = useState({
    name: user?.user_metadata?.name || '',
    email: user?.email || '',
    company: user?.user_metadata?.company || '',
    role: user?.user_metadata?.role || ''
  });
  
  // State for password change
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  // State for active tab
  const [activeTab, setActiveTab] = useState('general');
  
  // State for modals
  const [isAddIntegrationModalOpen, setIsAddIntegrationModalOpen] = useState(false);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [selectedIntegration, setSelectedIntegration] = useState(null);
  
  // New integration form state
  const [newIntegration, setNewIntegration] = useState({
    name: '',
    type: 'github',
    apiKey: '',
    baseUrl: '',
    description: ''
  });
  
  // Update profile state when user changes
  useEffect(() => {
    if (user) {
      setProfile({
        name: user.user_metadata?.name || '',
        email: user.email || '',
        company: user.user_metadata?.company || '',
        role: user.user_metadata?.role || ''
      });
    }
  }, [user]);

  // General settings handlers
  const handleLayoutChange = (e) => {
    setSettings({ ...settings, dashboardLayout: e.target.value });
  };

  const handleThemeChange = (e) => {
    setSettings({ ...settings, theme: e.target.value });
  };

  const handleNotificationChange = (e) => {
    setSettings({ ...settings, notifications: e.target.checked });
  };

  const handleMetricToggle = (metricId) => {
    const updatedPriorityMetrics = settings.priorityMetrics.includes(metricId)
      ? settings.priorityMetrics.filter(id => id !== metricId)
      : [...settings.priorityMetrics, metricId];
    
    setSettings({ ...settings, priorityMetrics: updatedPriorityMetrics });
  };

  const handleSaveSettings = () => {
    // In a real application, this would save to backend
    success('Settings saved successfully!');
  };
  
  // Profile settings handlers
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };
  
  const handleSaveProfile = async () => {
    try {
      await updateProfile({
        name: profile.name,
        company: profile.company,
        role: profile.role
      });
      success('Profile updated successfully!');
    } catch (err) {
      error('Failed to update profile: ' + err.message);
    }
  };
  
  // Password change handlers
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({ ...passwordData, [name]: value });
  };
  
  const handleChangePassword = async () => {
    // Validate passwords
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      error('New passwords do not match');
      return;
    }
    
    if (passwordData.newPassword.length < 8) {
      error('New password must be at least 8 characters long');
      return;
    }
    
    try {
      await updatePassword(passwordData.currentPassword, passwordData.newPassword);
      success('Password changed successfully!');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (err) {
      error('Failed to change password: ' + err.message);
    }
  };
  
  // Integration handlers
  const handleIntegrationChange = (e) => {
    const { name, value } = e.target;
    setNewIntegration({ ...newIntegration, [name]: value });
  };
  
  const handleAddIntegration = async () => {
    // Validate integration data
    if (!newIntegration.name.trim()) {
      error('Integration name is required');
      return;
    }
    
    if (!newIntegration.apiKey.trim()) {
      error('API key is required');
      return;
    }
    
    try {
      await addIntegration(newIntegration);
      setIsAddIntegrationModalOpen(false);
      setNewIntegration({
        name: '',
        type: 'github',
        apiKey: '',
        baseUrl: '',
        description: ''
      });
      success(`${newIntegration.name} integration added successfully!`);
    } catch (err) {
      error('Failed to add integration: ' + err.message);
    }
  };
  
  const handleToggleIntegration = async (id) => {
    try {
      await toggleIntegrationStatus(id);
    } catch (err) {
      error('Failed to toggle integration status: ' + err.message);
    }
  };
  
  const confirmDeleteIntegration = (integration) => {
    setSelectedIntegration(integration);
    setIsConfirmDeleteOpen(true);
  };
  
  const handleDeleteIntegration = async () => {
    if (!selectedIntegration) return;
    
    try {
      await deleteIntegration(selectedIntegration.id);
      setIsConfirmDeleteOpen(false);
      setSelectedIntegration(null);
      success(`${selectedIntegration.name} integration deleted successfully!`);
    } catch (err) {
      error('Failed to delete integration: ' + err.message);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md p-6 max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Settings</h1>
        
        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-6">
            <button
              onClick={() => setActiveTab('general')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'general' 
                ? 'border-indigo-500 text-indigo-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
              <FaCog className="inline-block mr-2" />
              General
            </button>
            <button
              onClick={() => setActiveTab('profile')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'profile' 
                ? 'border-indigo-500 text-indigo-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
              <FaUser className="inline-block mr-2" />
              Profile
            </button>
            <button
              onClick={() => setActiveTab('security')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'security' 
                ? 'border-indigo-500 text-indigo-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
              <FaLock className="inline-block mr-2" />
              Security
            </button>
            <button
              onClick={() => setActiveTab('integrations')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'integrations' 
                ? 'border-indigo-500 text-indigo-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
              <FaPlug className="inline-block mr-2" />
              Integrations
            </button>
          </nav>
        </div>
        
        {/* General Settings Tab */}
        {activeTab === 'general' && (
          <div className="space-y-8">
            {/* General Settings */}
            <section>
              <h2 className="text-xl font-semibold text-gray-700 mb-4">Dashboard Settings</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Dashboard Layout</label>
                  <select 
                    value={settings.dashboardLayout}
                    onChange={handleLayoutChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="grid">Grid</option>
                    <option value="list">List</option>
                    <option value="compact">Compact</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Theme</label>
                  <select 
                    value={settings.theme}
                    onChange={handleThemeChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                    <option value="system">System Default</option>
                  </select>
                </div>
              </div>
              
              <div className="mt-4">
                <label className="flex items-center">
                  <input 
                    type="checkbox" 
                    checked={settings.notifications}
                    onChange={handleNotificationChange}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">Enable real-time notifications</span>
                </label>
              </div>
            </section>
            
            {/* Priority Metrics */}
            <section>
              <h2 className="text-xl font-semibold text-gray-700 mb-4">Priority Metrics</h2>
              <p className="text-sm text-gray-600 mb-4">
                Select the metrics you want to prioritize on your dashboard. These will be shown prominently.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {settings.availableMetrics.map(metric => (
                  <div 
                    key={metric.id}
                    className={`p-3 border rounded-md cursor-pointer transition-colors ${
                      settings.priorityMetrics.includes(metric.id)
                        ? 'bg-indigo-50 border-indigo-300'
                        : 'bg-white border-gray-200 hover:bg-gray-50'
                    }`}
                    onClick={() => handleMetricToggle(metric.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-gray-800">{metric.name}</h3>
                        <span className="text-xs text-gray-500 capitalize">{metric.category}</span>
                      </div>
                      <div className="h-5 w-5 flex items-center justify-center">
                        {settings.priorityMetrics.includes(metric.id) && (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
            
            {/* Save Button */}
            <div className="flex justify-end">
              <button
                onClick={handleSaveSettings}
                className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <FaSave className="mr-2" />
                Save Settings
              </button>
            </div>
          </div>
        )}
        
        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Profile Information</h2>
            <p className="text-sm text-gray-600 mb-4">
              Update your profile information and how we can contact you.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={profile.name}
                  onChange={handleProfileChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={profile.email}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-500"
                />
                <p className="mt-1 text-xs text-gray-500">Email cannot be changed</p>
              </div>
              
              <div>
                <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
                  Company
                </label>
                <input
                  type="text"
                  id="company"
                  name="company"
                  value={profile.company}
                  onChange={handleProfileChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              
              <div>
                <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                  Role
                </label>
                <input
                  type="text"
                  id="role"
                  name="role"
                  value={profile.role}
                  onChange={handleProfileChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>
            
            <div className="flex justify-end mt-6">
              <button
                onClick={handleSaveProfile}
                className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <FaSave className="mr-2" />
                Save Profile
              </button>
            </div>
          </div>
        )}
        
        {/* Security Tab */}
        {activeTab === 'security' && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Change Password</h2>
            <p className="text-sm text-gray-600 mb-4">
              Update your password to keep your account secure.
            </p>
            
            <div className="space-y-4 max-w-md">
              <div>
                <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  Current Password
                </label>
                <input
                  type="password"
                  id="currentPassword"
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              
              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  id="newPassword"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
                <p className="mt-1 text-xs text-gray-500">Password must be at least 8 characters long</p>
              </div>
              
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>
            
            <div className="flex justify-end mt-6">
              <button
                onClick={handleChangePassword}
                className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <FaLock className="mr-2" />
                Change Password
              </button>
            </div>
          </div>
        )}
        
        {/* Integrations Tab */}
        {activeTab === 'integrations' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-semibold text-gray-700">Integrations</h2>
                <p className="text-sm text-gray-600">
                  Connect external services to enhance your dashboard with additional data sources.
                </p>
              </div>
              <button
                onClick={() => setIsAddIntegrationModalOpen(true)}
                className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <FaPlus className="mr-2" />
                Add Integration
              </button>
            </div>
            
            {/* Loading State */}
            {integrationsLoading && (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
              </div>
            )}
            
            {/* Empty State */}
            {!integrationsLoading && integrations.length === 0 && (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <h3 className="text-lg font-medium text-gray-900 mb-2">No integrations yet</h3>
                <p className="text-gray-500 mb-6">Add your first integration to connect external services.</p>
                <button
                  onClick={() => setIsAddIntegrationModalOpen(true)}
                  className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                >
                  <FaPlus className="mr-2" />
                  Add Your First Integration
                </button>
              </div>
            )}
            
            {/* Integrations List */}
            {!integrationsLoading && integrations.length > 0 && (
              <div className="mt-6 space-y-4">
                {integrations.map(integration => (
                  <div key={integration.id} className="bg-white border rounded-lg p-4 flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-gray-800">{integration.name}</h3>
                      <p className="text-sm text-gray-500">{integration.description || `${integration.type} integration`}</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => handleToggleIntegration(integration.id)}
                        className={`text-lg ${integration.is_active ? 'text-green-500' : 'text-gray-400'}`}
                        aria-label={integration.is_active ? 'Deactivate integration' : 'Activate integration'}
                      >
                        {integration.is_active ? <FaToggleOn /> : <FaToggleOff />}
                      </button>
                      <button
                        onClick={() => confirmDeleteIntegration(integration)}
                        className="text-red-500 hover:text-red-600"
                        aria-label="Delete integration"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Add Integration Modal */}
      <Modal
        isOpen={isAddIntegrationModalOpen}
        onClose={() => setIsAddIntegrationModalOpen(false)}
        title="Add New Integration"
        size="md"
      >
        <div className="p-2">
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Integration Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={newIntegration.name}
                onChange={handleIntegrationChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="e.g., GitHub Repository, Jira Project"
              />
            </div>
            
            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                Integration Type
              </label>
              <select
                id="type"
                name="type"
                value={newIntegration.type}
                onChange={handleIntegrationChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="github">GitHub</option>
                <option value="jira">Jira</option>
                <option value="gitlab">GitLab</option>
                <option value="slack">Slack</option>
                <option value="google_analytics">Google Analytics</option>
                <option value="stripe">Stripe</option>
                <option value="custom">Custom API</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700 mb-1">
                API Key / Token
              </label>
              <input
                type="password"
                id="apiKey"
                name="apiKey"
                value={newIntegration.apiKey}
                onChange={handleIntegrationChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            
            <div>
              <label htmlFor="baseUrl" className="block text-sm font-medium text-gray-700 mb-1">
                Base URL (Optional)
              </label>
              <input
                type="text"
                id="baseUrl"
                name="baseUrl"
                value={newIntegration.baseUrl}
                onChange={handleIntegrationChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="e.g., https://api.github.com"
              />
            </div>
            
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description (Optional)
              </label>
              <textarea
                id="description"
                name="description"
                value={newIntegration.description}
                onChange={handleIntegrationChange}
                rows="2"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Brief description of this integration"
              ></textarea>
            </div>
          </div>
          
          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => setIsAddIntegrationModalOpen(false)}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleAddIntegration}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Add Integration
            </button>
          </div>
        </div>
      </Modal>
      
      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={isConfirmDeleteOpen}
        onClose={() => setIsConfirmDeleteOpen(false)}
        onConfirm={handleDeleteIntegration}
        title="Delete Integration"
        message={`Are you sure you want to delete the "${selectedIntegration?.name}" integration? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
      />
    </div>
  );
};

export default Settings;
