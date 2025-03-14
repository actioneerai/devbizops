import supabase from '../utils/supabaseClient';

/**
 * Service for handling metrics data operations
 */
const metricsService = {
  /**
   * Get all metrics for a user
   * @param {string} userId - The user ID
   * @returns {Promise} - Promise with the metrics data
   */
  getAllMetrics: async (userId) => {
    try {
      const { data, error } = await supabase
        .from('metrics')
        .select('*')
        .eq('user_id', userId);
      
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  /**
   * Get metrics by category
   * @param {string} userId - The user ID
   * @param {string} category - The category of metrics (technical, business, etc.)
   * @returns {Promise} - Promise with the filtered metrics data
   */
  getMetricsByCategory: async (userId, category) => {
    try {
      const { data, error } = await supabase
        .from('metrics')
        .select('*')
        .eq('user_id', userId)
        .eq('category', category);
      
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  /**
   * Get a single metric by ID
   * @param {string} metricId - The metric ID
   * @returns {Promise} - Promise with the metric data
   */
  getMetricById: async (metricId) => {
    try {
      const { data, error } = await supabase
        .from('metrics')
        .select('*')
        .eq('id', metricId)
        .single();
      
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  /**
   * Create a new metric
   * @param {Object} metricData - The metric data
   * @returns {Promise} - Promise with the created metric
   */
  createMetric: async (metricData) => {
    try {
      const { data, error } = await supabase
        .from('metrics')
        .insert([metricData])
        .select();
      
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  /**
   * Update an existing metric
   * @param {string} metricId - The metric ID
   * @param {Object} metricData - The updated metric data
   * @returns {Promise} - Promise with the update result
   */
  updateMetric: async (metricId, metricData) => {
    try {
      const { data, error } = await supabase
        .from('metrics')
        .update(metricData)
        .eq('id', metricId)
        .select();
      
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  /**
   * Delete a metric
   * @param {string} metricId - The metric ID
   * @returns {Promise} - Promise with the delete result
   */
  deleteMetric: async (metricId) => {
    try {
      const { error } = await supabase
        .from('metrics')
        .delete()
        .eq('id', metricId);
      
      if (error) throw error;
      return { error: null };
    } catch (error) {
      return { error };
    }
  },

  /**
   * Get historical data for a metric
   * @param {string} metricId - The metric ID
   * @param {string} timeRange - The time range (day, week, month, year)
   * @returns {Promise} - Promise with the historical data
   */
  getMetricHistory: async (metricId, timeRange) => {
    try {
      // Calculate the start date based on the time range
      const now = new Date();
      let startDate = new Date();
      
      switch (timeRange) {
        case 'day':
          startDate.setDate(now.getDate() - 1);
          break;
        case 'week':
          startDate.setDate(now.getDate() - 7);
          break;
        case 'month':
          startDate.setMonth(now.getMonth() - 1);
          break;
        case 'year':
          startDate.setFullYear(now.getFullYear() - 1);
          break;
        default:
          startDate.setDate(now.getDate() - 30); // Default to 30 days
      }

      const { data, error } = await supabase
        .from('metric_history')
        .select('*')
        .eq('metric_id', metricId)
        .gte('timestamp', startDate.toISOString())
        .order('timestamp', { ascending: true });
      
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  /**
   * Get user's favorite metrics
   * @param {string} userId - The user ID
   * @returns {Promise} - Promise with the favorite metrics
   */
  getFavoriteMetrics: async (userId) => {
    try {
      const { data, error } = await supabase
        .from('user_favorites')
        .select(`
          id,
          metrics (*)
        `)
        .eq('user_id', userId);
      
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  /**
   * Add a metric to favorites
   * @param {string} userId - The user ID
   * @param {string} metricId - The metric ID
   * @returns {Promise} - Promise with the result
   */
  addToFavorites: async (userId, metricId) => {
    try {
      const { data, error } = await supabase
        .from('user_favorites')
        .insert([
          { user_id: userId, metric_id: metricId }
        ]);
      
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  /**
   * Remove a metric from favorites
   * @param {string} userId - The user ID
   * @param {string} metricId - The metric ID
   * @returns {Promise} - Promise with the result
   */
  removeFromFavorites: async (userId, metricId) => {
    try {
      const { error } = await supabase
        .from('user_favorites')
        .delete()
        .eq('user_id', userId)
        .eq('metric_id', metricId);
      
      if (error) throw error;
      return { error: null };
    } catch (error) {
      return { error };
    }
  }
};

export default metricsService;
