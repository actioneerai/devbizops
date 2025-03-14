import React, { useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { FaStar, FaRegStar, FaExpand, FaCompress, FaEllipsisH } from 'react-icons/fa';

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

/**
 * Widget component for displaying metrics in various formats
 * @param {Object} props - Component props
 * @param {string} props.title - Widget title
 * @param {string} props.type - Widget type (technical, business)
 * @param {Object} props.data - Widget data
 * @param {string} props.visualType - Visualization type (number, line, bar, doughnut)
 * @param {function} props.onToggleFavorite - Function to toggle favorite status
 * @param {boolean} props.isFavorite - Whether the widget is favorited
 * @param {function} props.onExpand - Function to expand widget to full screen
 */
const Widget = ({ 
  title, 
  type, 
  data, 
  visualType = 'number', 
  isFavorite = false, 
  onToggleFavorite,
  onExpand,
  onDelete
}) => {
  const [expanded, setExpanded] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  // Determine background color based on widget type
  const bgColor = type === 'technical' ? 'bg-blue-50' : 'bg-green-50';
  const borderColor = type === 'technical' ? 'border-blue-200' : 'border-green-200';
  const titleColor = type === 'technical' ? 'text-blue-800' : 'text-green-800';
  
  // Determine change indicator styling
  const isPositiveChange = data.change?.includes('+');
  const changeColor = isPositiveChange ? 'text-green-600' : 'text-red-600';

  // Handle expand/collapse
  const handleExpandToggle = () => {
    setExpanded(!expanded);
    if (onExpand) {
      onExpand(!expanded);
    }
  };

  // Handle favorite toggle
  const handleFavoriteToggle = (e) => {
    e.stopPropagation();
    if (onToggleFavorite) {
      onToggleFavorite();
    }
  };

  // Handle menu toggle
  const handleMenuToggle = (e) => {
    e.stopPropagation();
    setShowMenu(!showMenu);
  };

  // Handle delete
  const handleDelete = (e) => {
    e.stopPropagation();
    setShowMenu(false);
    if (onDelete) {
      onDelete();
    }
  };

  // Render sparkline visualization
  const renderSparkline = (history) => {
    const max = Math.max(...history);
    const min = Math.min(...history);
    const range = max - min;
    const points = history.map((value, index) => ({
      x: (index / (history.length - 1)) * 100,
      y: ((value - min) / range) * 40
    }));

    return (
      <div className="h-12 mt-2">
        <svg className="w-full h-full" viewBox="0 0 100 50">
          <polyline
            points={points.map(p => `${p.x},${50-p.y}`).join(' ')}
            fill="none"
            stroke={type === 'technical' ? '#3b82f6' : '#10b981'}
            strokeWidth="2"
          />
        </svg>
      </div>
    );
  };

  // Render gauge visualization
  const renderGauge = (value, max = 5) => {
    const percentage = (parseFloat(value) / max) * 100;
    return (
      <div className="relative h-16 mt-2">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-32 h-16 overflow-hidden">
            <div 
              className="w-32 h-32 border-8 rounded-full -mt-16"
              style={{
                borderColor: `${type === 'technical' ? '#3b82f6' : '#10b981'} transparent transparent transparent`,
                transform: `rotate(${45 + (percentage * 1.8)}deg)`
              }}
            />
          </div>
          <span className="absolute text-lg font-bold">{value}</span>
        </div>
      </div>
    );
  };

  // Render status visualization
  const renderStatus = (stats) => {
    const { success, failed } = stats;
    const total = success + failed;
    const successPercentage = (success / total) * 100;
    
    return (
      <div className="mt-2">
        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-green-500"
            style={{ width: `${successPercentage}%` }}
          />
        </div>
        <div className="flex justify-between mt-1 text-xs text-gray-600">
          <span>{`${success} passed`}</span>
          <span>{`${failed} failed`}</span>
        </div>
      </div>
    );
  };

  // Render bar chart for breakdown
  const renderBreakdown = (breakdown) => {
    return (
      <div className="mt-2 space-y-1">
        {breakdown.map(({ severity, count }) => (
          <div key={severity} className="flex items-center">
            <span className="text-xs text-gray-600 w-16">{severity}</span>
            <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className={`h-full ${severity === 'High' ? 'bg-red-500' : severity === 'Medium' ? 'bg-yellow-500' : 'bg-blue-500'}`}
                style={{ width: `${(count / breakdown.reduce((acc, curr) => acc + curr.count, 0)) * 100}%` }}
              />
            </div>
            <span className="text-xs text-gray-600 ml-2">{count}</span>
          </div>
        ))}      
      </div>
    );
  };

  // Render chart based on visualization type
  const renderVisualization = () => {
    switch (visualType) {
      case 'sparkline':
        return renderSparkline(data.history);
      case 'gauge':
        return renderGauge(data.value);
      case 'status':
        return renderStatus(data.stats);
      case 'bar':
        return renderBreakdown(data.breakdown);
      case 'pie':
        return (
          <div className="mt-2">
            {data.distribution.map(({ label, value }) => (
              <div key={label} className="flex items-center mt-1">
                <span className="text-xs text-gray-600 w-16">{label}</span>
                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${type === 'technical' ? 'bg-blue-500' : 'bg-green-500'}`}
                    style={{ width: `${value}%` }}
                  />
                </div>
                <span className="text-xs text-gray-600 ml-2">{value}%</span>
              </div>
            ))}      
          </div>
        );
      case 'line':
        return (
          <div className="mt-2">
            <div className="h-12">
              <Line 
                data={{
                  labels: Array.from({ length: data.history.length }, (_, i) => ''),
                  datasets: [
                    {
                      data: data.history,
                      borderColor: type === 'technical' ? '#3b82f6' : '#10b981',
                      backgroundColor: 'transparent',
                      tension: 0.4,
                      pointRadius: 0
                    }
                  ]
                }} 
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { display: false }
                  },
                  scales: {
                    x: { display: false },
                    y: { display: false }
                  }
                }}
              />
            </div>
          </div>
        );
      case 'number':
      default:
        return (
          <div className="flex flex-col">
            <span className="text-2xl font-bold text-gray-800">{data.value}</span>
            {data.change && (
              <div className="flex items-center mt-2">
                <span className={`text-sm font-medium ${changeColor}`}>{data.change}</span>
                {data.period && <span className="text-xs text-gray-500 ml-2">{data.period}</span>}
              </div>
            )}
          </div>
        );
    }
  };

  return (
    <div className={`p-4 rounded-lg shadow-md ${bgColor} border ${borderColor} ${expanded ? 'col-span-2 row-span-2' : ''} transition-all duration-300 ease-in-out`}>
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className={`font-bold ${titleColor}`}>{title}</h3>
          <span className="text-xs text-gray-500">{type === 'technical' ? 'Tech' : 'Business'}</span>
        </div>
        <div className="flex items-center space-x-2">
          <button 
            onClick={handleFavoriteToggle}
            className="text-yellow-500 hover:text-yellow-600 focus:outline-none"
            aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            {isFavorite ? <FaStar /> : <FaRegStar />}
          </button>
          <button 
            onClick={handleExpandToggle}
            className="text-gray-500 hover:text-gray-600 focus:outline-none"
            aria-label={expanded ? 'Collapse widget' : 'Expand widget'}
          >
            {expanded ? <FaCompress /> : <FaExpand />}
          </button>
          <div className="relative">
            <button 
              onClick={handleMenuToggle}
              className="text-gray-500 hover:text-gray-600 focus:outline-none"
              aria-label="Widget menu"
            >
              <FaEllipsisH />
            </button>
            {showMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 py-1">
                <button 
                  onClick={handleDelete}
                  className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                >
                  Delete Widget
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="mt-4">
        {data ? renderVisualization() : (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Widget;
