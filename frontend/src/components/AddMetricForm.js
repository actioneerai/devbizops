import React, { useState } from 'react';
import { useNotification } from '../contexts/NotificationContext';

/**
 * Form component for adding a new metric
 * @param {Object} props - Component props
 * @param {Function} props.onSubmit - Function to call when form is submitted
 * @param {Function} props.onCancel - Function to call when form is cancelled
 */
const AddMetricForm = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    value: '',
    category: 'technical',
    unit: '',
    description: '',
    priority: 0,
    visualType: 'number'
  });
  const [loading, setLoading] = useState(false);
  const { error } = useNotification();

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) : value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form data
    if (!formData.name.trim()) {
      error('Metric name is required');
      return;
    }
    
    if (formData.value === '' || isNaN(parseFloat(formData.value))) {
      error('Metric value must be a valid number');
      return;
    }
    
    setLoading(true);
    try {
      await onSubmit(formData);
      // Form will be closed by parent component on successful submission
    } catch (err) {
      error('Failed to add metric');
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Add New Metric</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Metric Name */}
          <div className="col-span-2">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Metric Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="e.g., Code Coverage, Monthly Active Users"
              required
            />
          </div>
          
          {/* Metric Value */}
          <div>
            <label htmlFor="value" className="block text-sm font-medium text-gray-700 mb-1">
              Current Value
            </label>
            <input
              type="number"
              id="value"
              name="value"
              value={formData.value}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="e.g., 85, 1250"
              required
            />
          </div>
          
          {/* Unit */}
          <div>
            <label htmlFor="unit" className="block text-sm font-medium text-gray-700 mb-1">
              Unit (Optional)
            </label>
            <input
              type="text"
              id="unit"
              name="unit"
              value={formData.unit}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="e.g., %, users, $"
            />
          </div>
          
          {/* Category */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="technical">Technical</option>
              <option value="business">Business</option>
            </select>
          </div>
          
          {/* Visualization Type */}
          <div>
            <label htmlFor="visualType" className="block text-sm font-medium text-gray-700 mb-1">
              Visualization Type
            </label>
            <select
              id="visualType"
              name="visualType"
              value={formData.visualType}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="number">Number</option>
              <option value="line">Line Chart</option>
              <option value="bar">Bar Chart</option>
              <option value="doughnut">Doughnut Chart</option>
            </select>
          </div>
          
          {/* Priority */}
          <div className="col-span-2">
            <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">
              Priority (0-10)
            </label>
            <input
              type="range"
              id="priority"
              name="priority"
              min="0"
              max="10"
              value={formData.priority}
              onChange={handleChange}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>Low</span>
              <span>Medium</span>
              <span>High</span>
            </div>
          </div>
          
          {/* Description */}
          <div className="col-span-2">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description (Optional)
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Describe what this metric represents and why it's important"
            ></textarea>
          </div>
        </div>
        
        {/* Form Actions */}
        <div className="mt-6 flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            disabled={loading}
          >
            {loading ? 'Adding...' : 'Add Metric'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddMetricForm;
