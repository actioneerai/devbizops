import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNotification } from '../contexts/NotificationContext';
import metricsService from '../services/metricsService';

/**
 * Custom hook for managing metrics data
 * @returns {Object} Metrics data and functions
 */
const useMetrics = () => {
  const [metrics, setMetrics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const { error: showError } = useNotification();

  // Fetch all metrics for the current user
  const fetchMetrics = useCallback(async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await metricsService.getMetrics();
      
      if (error) {
        setError(error.message);
        showError(`Failed to load metrics: ${error.message}`);
      } else {
        setMetrics(data || []);
        setError(null);
      }
    } catch (err) {
      setError('An unexpected error occurred while fetching metrics');
      showError('An unexpected error occurred while fetching metrics');
    } finally {
      setLoading(false);
    }
  }, [user, showError]);

  // Fetch metrics on component mount and when user changes
  useEffect(() => {
    fetchMetrics();
  }, [fetchMetrics]);

  // Add a new metric
  const addMetric = async (metricData) => {
    try {
      const { data, error } = await metricsService.createMetric(metricData);
      
      if (error) {
        showError(`Failed to add metric: ${error.message}`);
        return { error };
      }
      
      // Update local state with the new metric
      setMetrics(prevMetrics => [...prevMetrics, data]);
      return { data };
    } catch (err) {
      showError('An unexpected error occurred while adding a metric');
      return { error: err };
    }
  };

  // Update an existing metric
  const updateMetric = async (id, metricData) => {
    try {
      const { data, error } = await metricsService.updateMetric(id, metricData);
      
      if (error) {
        showError(`Failed to update metric: ${error.message}`);
        return { error };
      }
      
      // Update local state with the updated metric
      setMetrics(prevMetrics => 
        prevMetrics.map(metric => metric.id === id ? data : metric)
      );
      return { data };
    } catch (err) {
      showError('An unexpected error occurred while updating a metric');
      return { error: err };
    }
  };

  // Delete a metric
  const deleteMetric = async (id) => {
    try {
      const { error } = await metricsService.deleteMetric(id);
      
      if (error) {
        showError(`Failed to delete metric: ${error.message}`);
        return { error };
      }
      
      // Remove the deleted metric from local state
      setMetrics(prevMetrics => prevMetrics.filter(metric => metric.id !== id));
      return { success: true };
    } catch (err) {
      showError('An unexpected error occurred while deleting a metric');
      return { error: err };
    }
  };

  // Get metric history
  const getMetricHistory = async (id) => {
    try {
      const { data, error } = await metricsService.getMetricHistory(id);
      
      if (error) {
        showError(`Failed to fetch metric history: ${error.message}`);
        return { error };
      }
      
      return { data };
    } catch (err) {
      showError('An unexpected error occurred while fetching metric history');
      return { error: err };
    }
  };

  // Toggle favorite status for a metric
  const toggleFavorite = async (id) => {
    try {
      const { data, error } = await metricsService.toggleFavorite(id);
      
      if (error) {
        showError(`Failed to update favorite status: ${error.message}`);
        return { error };
      }
      
      // Update local state with the updated favorite status
      setMetrics(prevMetrics => 
        prevMetrics.map(metric => metric.id === id ? { ...metric, isFavorite: data.isFavorite } : metric)
      );
      return { data };
    } catch (err) {
      showError('An unexpected error occurred while updating favorite status');
      return { error: err };
    }
  };

  // Filter metrics by category
  const filterByCategory = (category) => {
    return metrics.filter(metric => metric.category === category);
  };

  // Get technical metrics
  const getTechnicalMetrics = () => {
    return filterByCategory('technical');
  };

  // Get business metrics
  const getBusinessMetrics = () => {
    return filterByCategory('business');
  };

  // Get favorite metrics
  const getFavoriteMetrics = () => {
    return metrics.filter(metric => metric.isFavorite);
  };

  return {
    metrics,
    loading,
    error,
    fetchMetrics,
    addMetric,
    updateMetric,
    deleteMetric,
    getMetricHistory,
    toggleFavorite,
    getTechnicalMetrics,
    getBusinessMetrics,
    getFavoriteMetrics
  };
};

export default useMetrics;
