import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNotification } from '../contexts/NotificationContext';
import supabase from '../utils/supabaseClient';

/**
 * Component to test Supabase connectivity and functionality
 */
const SupabaseTest = () => {
  const { user } = useAuth();
  const { success, error: showError, info } = useNotification();
  const [loading, setLoading] = useState(false);
  const [testResults, setTestResults] = useState(null);

  // Test Supabase connection
  const testConnection = async () => {
    setLoading(true);
    setTestResults(null);
    
    try {
      info('Testing Supabase connection...');
      
      // Get Supabase URL from environment
      const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
      
      // Test if we can get the session
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        throw new Error(`Session error: ${sessionError.message}`);
      }
      
      // Test if we can query the profiles table
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .limit(1);
        
      if (profilesError) {
        throw new Error(`Profiles query error: ${profilesError.message}`);
      }
      
      // Set test results
      setTestResults({
        success: true,
        url: supabaseUrl || 'Not available',
        session: sessionData ? 'Available' : 'Not available',
        profiles: profilesData ? `Found ${profilesData.length} profiles` : 'No profiles found',
        user: user ? 'Logged in' : 'Not logged in'
      });
      
      success('Supabase connection test completed successfully!');
    } catch (err) {
      console.error('Supabase test error:', err);
      setTestResults({
        success: false,
        error: err.message
      });
      showError(`Supabase test failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Supabase Integration Test</h2>
      <p className="mb-4 text-gray-600">
        Test your local Supabase connection and functionality.
      </p>
      
      <button
        onClick={testConnection}
        disabled={loading}
        className={`px-4 py-2 rounded transition-colors ${
          loading 
            ? 'bg-gray-400 cursor-not-allowed' 
            : 'bg-indigo-500 text-white hover:bg-indigo-600'
        }`}
      >
        {loading ? 'Testing...' : 'Test Supabase Connection'}
      </button>
      
      {testResults && (
        <div className="mt-6">
          <h3 className="text-lg font-medium mb-2">Test Results</h3>
          <div className={`p-4 rounded ${testResults.success ? 'bg-green-50' : 'bg-red-50'}`}>
            {testResults.success ? (
              <div className="space-y-2">
                <p><strong>Status:</strong> Connected</p>
                <p><strong>Supabase URL:</strong> {testResults.url}</p>
                <p><strong>Session:</strong> {testResults.session}</p>
                <p><strong>Profiles:</strong> {testResults.profiles}</p>
                <p><strong>Current User:</strong> {testResults.user}</p>
              </div>
            ) : (
              <div>
                <p className="text-red-600"><strong>Error:</strong> {testResults.error}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SupabaseTest;
