import React, { createContext, useContext, useState } from 'react';

const MetricsContext = createContext();

export const useMetrics = () => {
  const context = useContext(MetricsContext);
  if (!context) {
    throw new Error('useMetrics must be used within a MetricsProvider');
  }
  return context;
};

export const MetricsProvider = ({ children }) => {
  const [metrics, setMetrics] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Sample metrics data for demonstration
  const sampleMetrics = [
    {
      id: 'sample-1',
      name: 'Code Deployments',
      category: 'technical',
      data: {
        value: 12,
        change: '+3',
        period: 'today',
        history: [8, 10, 7, 12, 9, 11, 12]
      },
      visualType: 'sparkline',
      isFavorite: false
    },
    {
      id: 'sample-2',
      name: 'User Acquisition',
      category: 'business',
      data: {
        value: 156,
        change: '+23%',
        period: 'this week',
        distribution: [
          { label: 'Organic', value: 45 },
          { label: 'Referral', value: 30 },
          { label: 'Social', value: 25 }
        ]
      },
      visualType: 'pie',
      isFavorite: true
    },
    {
      id: 'sample-3',
      name: 'Revenue Impact',
      category: 'business',
      data: {
        value: '$12,450',
        change: '+18%',
        period: 'this month',
        history: [8400, 9200, 8900, 10500, 11200, 11800, 12450]
      },
      visualType: 'line',
      isFavorite: false
    },
    {
      id: 'sample-4',
      name: 'Technical Debt',
      category: 'technical',
      data: {
        value: '14 issues',
        change: '-3',
        period: 'this sprint',
        breakdown: [
          { severity: 'High', count: 3 },
          { severity: 'Medium', count: 6 },
          { severity: 'Low', count: 5 }
        ]
      },
      visualType: 'bar',
      isFavorite: false
    },
    {
      id: 'sample-5',
      name: 'Customer Satisfaction',
      category: 'business',
      data: {
        value: '4.8/5',
        change: '+0.2',
        period: 'this quarter',
        ratings: [4.3, 4.5, 4.6, 4.7, 4.8]
      },
      visualType: 'gauge',
      isFavorite: true
    },
    {
      id: 'sample-6',
      name: 'CI/CD Pipeline Status',
      category: 'technical',
      data: {
        value: 'Healthy',
        change: 'Stable',
        period: 'now',
        stats: {
          success: 92,
          failed: 8
        }
      },
      visualType: 'status',
      isFavorite: false
    }
  ];

  // Fetch metrics (simulated)
  const fetchMetrics = React.useCallback(async () => {
    if (metrics.length > 0) return; // Don't fetch if we already have metrics
    setLoading(true);
    setError(null);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setMetrics(sampleMetrics);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [metrics.length]);

  // Add new metric
  const addMetric = async (metricData) => {
    setLoading(true);
    try {
      const newMetric = {
        id: `metric-${Date.now()}`,
        ...metricData,
        isFavorite: false
      };
      setMetrics(prev => [...prev, newMetric]);
      return { error: null };
    } catch (err) {
      return { error: err };
    } finally {
      setLoading(false);
    }
  };

  // Update metric
  const updateMetric = async (id, updates) => {
    setLoading(true);
    try {
      setMetrics(prev => prev.map(metric => 
        metric.id === id ? { ...metric, ...updates } : metric
      ));
      return { error: null };
    } catch (err) {
      return { error: err };
    } finally {
      setLoading(false);
    }
  };

  // Delete metric
  const deleteMetric = async (id) => {
    setLoading(true);
    try {
      setMetrics(prev => prev.filter(metric => metric.id !== id));
      return { error: null };
    } catch (err) {
      return { error: err };
    } finally {
      setLoading(false);
    }
  };

  // Toggle favorite status
  const toggleFavorite = async (id) => {
    try {
      setMetrics(prev => prev.map(metric => 
        metric.id === id ? { ...metric, isFavorite: !metric.isFavorite } : metric
      ));
      return { error: null };
    } catch (err) {
      return { error: err };
    }
  };

  const value = React.useMemo(() => ({
    metrics,
    loading,
    error,
    fetchMetrics,
    addMetric,
    updateMetric,
    deleteMetric,
    toggleFavorite
  }), [metrics, loading, error, fetchMetrics, addMetric, updateMetric, deleteMetric, toggleFavorite]);

  return (
    <MetricsContext.Provider value={value}>
      {children}
    </MetricsContext.Provider>
  );
};
