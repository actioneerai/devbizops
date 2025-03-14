import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNotification } from '../contexts/NotificationContext';
import supabase from '../utils/supabaseClient';

/**
 * Custom hook for managing integrations with external services
 * @returns {Object} Integrations data and functions
 */
const useIntegrations = () => {
  const [integrations, setIntegrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const { error: showError, success: showSuccess } = useNotification();

  // Fetch all integrations for the current user
  const fetchIntegrations = useCallback(async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('integrations')
        .select('*')
        .eq('user_id', user.id)
        .order('name');
      
      if (error) {
        setError(error.message);
        showError(`Failed to load integrations: ${error.message}`);
      } else {
        setIntegrations(data || []);
        setError(null);
      }
    } catch (err) {
      setError('An unexpected error occurred while fetching integrations');
      showError('An unexpected error occurred while fetching integrations');
    } finally {
      setLoading(false);
    }
  }, [user, showError]);

  // Fetch integrations on component mount and when user changes
  useEffect(() => {
    fetchIntegrations();
  }, [fetchIntegrations]);

  // Add a new integration
  const addIntegration = async (integrationData) => {
    if (!user) return { error: 'User not authenticated' };
    
    try {
      const newIntegration = {
        ...integrationData,
        user_id: user.id,
        is_active: true,
        created_at: new Date()
      };
      
      const { data, error } = await supabase
        .from('integrations')
        .insert([newIntegration])
        .select()
        .single();
      
      if (error) {
        showError(`Failed to add integration: ${error.message}`);
        return { error };
      }
      
      // Update local state with the new integration
      setIntegrations(prevIntegrations => [...prevIntegrations, data]);
      showSuccess(`${data.name} integration added successfully`);
      return { data };
    } catch (err) {
      showError('An unexpected error occurred while adding an integration');
      return { error: err };
    }
  };

  // Update an existing integration
  const updateIntegration = async (id, integrationData) => {
    try {
      const { data, error } = await supabase
        .from('integrations')
        .update(integrationData)
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();
      
      if (error) {
        showError(`Failed to update integration: ${error.message}`);
        return { error };
      }
      
      // Update local state with the updated integration
      setIntegrations(prevIntegrations => 
        prevIntegrations.map(integration => integration.id === id ? data : integration)
      );
      showSuccess(`${data.name} integration updated successfully`);
      return { data };
    } catch (err) {
      showError('An unexpected error occurred while updating an integration');
      return { error: err };
    }
  };

  // Delete an integration
  const deleteIntegration = async (id) => {
    try {
      // Get the integration name before deleting
      const integration = integrations.find(i => i.id === id);
      
      const { error } = await supabase
        .from('integrations')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);
      
      if (error) {
        showError(`Failed to delete integration: ${error.message}`);
        return { error };
      }
      
      // Remove the deleted integration from local state
      setIntegrations(prevIntegrations => prevIntegrations.filter(integration => integration.id !== id));
      showSuccess(`${integration?.name || 'Integration'} deleted successfully`);
      return { success: true };
    } catch (err) {
      showError('An unexpected error occurred while deleting an integration');
      return { error: err };
    }
  };

  // Toggle active status for an integration
  const toggleIntegrationStatus = async (id) => {
    try {
      // Find the current integration and get its status
      const integration = integrations.find(i => i.id === id);
      if (!integration) {
        return { error: 'Integration not found' };
      }
      
      const newStatus = !integration.is_active;
      
      const { data, error } = await supabase
        .from('integrations')
        .update({ is_active: newStatus })
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();
      
      if (error) {
        showError(`Failed to update integration status: ${error.message}`);
        return { error };
      }
      
      // Update local state with the updated status
      setIntegrations(prevIntegrations => 
        prevIntegrations.map(integration => integration.id === id ? data : integration)
      );
      
      showSuccess(`${data.name} ${newStatus ? 'activated' : 'deactivated'} successfully`);
      return { data };
    } catch (err) {
      showError('An unexpected error occurred while updating integration status');
      return { error: err };
    }
  };

  // Get integrations by type
  const getIntegrationsByType = (type) => {
    return integrations.filter(integration => integration.type === type);
  };

  // Get active integrations
  const getActiveIntegrations = () => {
    return integrations.filter(integration => integration.is_active);
  };

  return {
    integrations,
    loading,
    error,
    fetchIntegrations,
    addIntegration,
    updateIntegration,
    deleteIntegration,
    toggleIntegrationStatus,
    getIntegrationsByType,
    getActiveIntegrations
  };
};

export default useIntegrations;
