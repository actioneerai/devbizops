import React, { useState, useEffect } from 'react';
import { FaPlus, FaFilter, FaStar, FaChartLine, FaCode, FaDollarSign } from 'react-icons/fa';
import Widget from './Widget';
import Modal from './Modal';
import AddMetricForm from './AddMetricForm';
import { useMetrics } from '../contexts/MetricsContext';
import { useNotification } from '../contexts/NotificationContext';


const Dashboard = () => {
  // State for modal and filters
  const [isAddMetricModalOpen, setIsAddMetricModalOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  
  // Get metrics and notification functions
  const { metrics, error, fetchMetrics, addMetric, deleteMetric, toggleFavorite } = useMetrics();
  const { success, error: showError } = useNotification();
  
  // Load metrics and manage loading state
  useEffect(() => {
    const loadMetrics = async () => {
      if (metrics.length === 0) {
        setIsLoading(true);
        await fetchMetrics();
        setIsLoading(false);
      } else {
        // If we already have metrics, don't show loading
        setIsLoading(false);
      }
    };
    loadMetrics();
  }, [fetchMetrics, metrics.length]);
  
  // Handle adding a new metric
  const handleAddMetric = async (metricData) => {
    const { error } = await addMetric(metricData);
    
    if (error) {
      showError(`Failed to add metric: ${error.message}`);
      return false;
    }
    
    success(`${metricData.name} metric added successfully`);
    setIsAddMetricModalOpen(false);
    return true;
  };
  
  // Handle deleting a metric
  const handleDeleteMetric = async (id, title) => {
    if (window.confirm(`Are you sure you want to delete the "${title}" metric?`)) {
      const { error } = await deleteMetric(id);
      
      if (error) {
        showError(`Failed to delete metric: ${error.message}`);
        return;
      }
      
      success(`${title} metric deleted successfully`);
    }
  };
  
  // Handle toggling favorite status
  const handleToggleFavorite = async (id) => {
    const { error } = await toggleFavorite(id);
    
    if (error) {
      showError(`Failed to update favorite status: ${error.message}`);
    }
  };
  
  // Filter metrics based on active filter and search term
  const getFilteredMetrics = () => {
    let filtered = [...metrics];
    
    // Apply category filter
    if (activeFilter === 'technical') {
      filtered = filtered.filter(metric => metric.category === 'technical');
    } else if (activeFilter === 'business') {
      filtered = filtered.filter(metric => metric.category === 'business');
    } else if (activeFilter === 'favorites') {
      filtered = filtered.filter(metric => metric.isFavorite);
    }
    
    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(metric => 
        metric.name.toLowerCase().includes(term) || 
        metric.description?.toLowerCase().includes(term)
      );
    }
    
    // Sort by priority (higher first) and then by name
    return filtered.sort((a, b) => {
      if (a.priority !== b.priority) {
        return b.priority - a.priority;
      }
      return a.name.localeCompare(b.name);
    });
  };
  
  // Use metrics from context
  const displayMetrics = metrics.length > 0 ? getFilteredMetrics() : [
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
    },
  ];
  

  
  return (
    <div className="p-6 bg-gray-100 rounded-lg shadow-sm">
      {/* Dashboard Header */}
      <div className="mb-6 flex flex-col md:flex-row md:justify-between md:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Unified Dashboard</h1>
          <p className="text-gray-600">Connecting your technical efforts to business outcomes</p>
        </div>
        
        <div className="mt-4 md:mt-0 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
          <button
            onClick={() => setIsAddMetricModalOpen(true)}
            className="flex items-center justify-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
          >
            <FaPlus className="mr-2" />
            Add Metric
          </button>
        </div>
      </div>
      
      {/* Filters */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          {/* Category Filters */}
          <div className="flex space-x-2">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-3 py-2 rounded-md flex items-center ${activeFilter === 'all' ? 'bg-gray-200 text-gray-800' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
            >
              <FaChartLine className="mr-2" />
              All
            </button>
            <button
              onClick={() => setActiveFilter('technical')}
              className={`px-3 py-2 rounded-md flex items-center ${activeFilter === 'technical' ? 'bg-blue-100 text-blue-800' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
            >
              <FaCode className="mr-2" />
              Technical
            </button>
            <button
              onClick={() => setActiveFilter('business')}
              className={`px-3 py-2 rounded-md flex items-center ${activeFilter === 'business' ? 'bg-green-100 text-green-800' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
            >
              <FaDollarSign className="mr-2" />
              Business
            </button>
            <button
              onClick={() => setActiveFilter('favorites')}
              className={`px-3 py-2 rounded-md flex items-center ${activeFilter === 'favorites' ? 'bg-yellow-100 text-yellow-800' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
            >
              <FaStar className="mr-2" />
              Favorites
            </button>
          </div>
          
          {/* Search */}
          <div className="w-full sm:w-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Search metrics..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full sm:w-64 px-4 py-2 pr-10 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500">
                <FaFilter />
              </span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Loading State - Only show if no metrics are available */}
      {isLoading && metrics.length === 0 && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      )}
      
      {/* Empty State - Only show if not loading and no metrics */}
      {!isLoading && !error && metrics.length === 0 && displayMetrics.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm">
          <h3 className="text-lg font-medium text-gray-900 mb-2">No metrics added yet</h3>
          <p className="text-gray-500 mb-6">Add your first metric to start tracking your technical and business performance.</p>
          <button
            onClick={() => setIsAddMetricModalOpen(true)}
            className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
          >
            <FaPlus className="mr-2" />
            Add Your First Metric
          </button>
        </div>
      )}
      
      {/* Metrics Grid - Always show if there are metrics to display */}
      {displayMetrics.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayMetrics.map(metric => (
            <Widget 
              key={metric.id} 
              title={metric.name} 
              type={metric.category} 
              data={metric.data} 
              visualType={metric.visualType || 'number'}
              isFavorite={metric.isFavorite}
              onToggleFavorite={() => handleToggleFavorite(metric.id)}
              onDelete={() => handleDeleteMetric(metric.id, metric.name)}
            />
          ))}
        </div>
      )}
      
      {/* Add Metric Modal */}
      {isAddMetricModalOpen && (
        <Modal
          isOpen={true}
          onClose={() => setIsAddMetricModalOpen(false)}
          title="Add New Metric"
          size="lg"
        >
          <AddMetricForm 
            onSubmit={handleAddMetric}
            onCancel={() => setIsAddMetricModalOpen(false)}
          />
        </Modal>
      )}
    </div>
  );
};

export default Dashboard;
