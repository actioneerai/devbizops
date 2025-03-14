import React, { useState } from 'react';

const AgentPanel = () => {
  const [activeAgent, setActiveAgent] = useState('techTranslator');
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState(null);

  const agents = [
    { id: 'techTranslator', name: 'TechTranslator Agent', description: 'Converts business language to technical requirements' },
    { id: 'roadmap', name: 'RoadmapAgent', description: 'Creates dynamic roadmaps linking technical milestones with business goals' },
    { id: 'investor', name: 'InvestorDashboardAgent', description: 'Transforms engineering metrics into investor-ready dashboards' },
    { id: 'pmf', name: 'PMFAgent', description: 'Connects user behavior with code deployments for feature prioritization' },
  ];

  const handleAgentSelect = (agentId) => {
    setActiveAgent(agentId);
    setResult(null);
  };

  const handleRunAgent = () => {
    setIsProcessing(true);
    
    // Simulate API call to run the agent
    setTimeout(() => {
      const mockResults = {
        techTranslator: {
          title: 'Sales Call Translation',
          content: 'Customer requested "easier way to see all metrics at once" which translates to: Implement a consolidated view component with responsive design that dynamically adjusts metric visibility based on screen size and user preferences.',
          technicalRequirements: [
            'Create a new React component for consolidated metrics view',
            'Implement responsive grid layout with Tailwind CSS',
            'Add user preference settings for metric visibility',
            'Create local storage mechanism to persist user preferences'
          ]
        },
        roadmap: {
          title: 'Q2 Roadmap',
          content: 'Based on current velocity and business priorities, here is the updated roadmap:',
          milestones: [
            { week: 'Week 1-2', technical: 'Implement user auth system', business: 'Enable personalized dashboards for sales team' },
            { week: 'Week 3-4', technical: 'Build API integrations for GitHub', business: 'Connect code activity to customer impact' },
            { week: 'Week 5-6', technical: 'Create real-time notification system', business: 'Improve team responsiveness to customer issues' }
          ]
        },
        investor: {
          title: 'Investor Update',
          content: 'Here\'s your investor-ready dashboard for the monthly update:',
          metrics: [
            { name: 'Monthly Active Users', value: '1,245', change: '+18%' },
            { name: 'Revenue Growth', value: '$45K', change: '+22%' },
            { name: 'Customer Acquisition Cost', value: '$28', change: '-12%' },
            { name: 'Engineering Velocity', value: '24 story points/week', change: '+15%' }
          ]
        },
        pmf: {
          title: 'Product-Market Fit Analysis',
          content: 'Based on recent user behavior and code deployments:',
          insights: [
            'The new analytics dashboard feature has 78% user adoption - prioritize enhancements',
            'Export functionality is used by only 12% of users but requires 25% of maintenance time - consider deprecating',
            'Mobile usage has increased 34% since responsive redesign - allocate more resources to mobile experience'
          ]
        }
      };
      
      setResult(mockResults[activeAgent]);
      setIsProcessing(false);
    }, 1500);
  };

  const getActiveAgent = () => {
    return agents.find(agent => agent.id === activeAgent);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">AI Agents</h2>
      
      <div className="flex flex-wrap gap-2 mb-6">
        {agents.map(agent => (
          <button
            key={agent.id}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeAgent === agent.id 
                ? 'bg-indigo-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
            onClick={() => handleAgentSelect(agent.id)}
          >
            {agent.name}
          </button>
        ))}
      </div>
      
      <div className="bg-gray-50 rounded-md p-4 mb-6">
        <h3 className="font-medium text-gray-700 mb-2">{getActiveAgent().name}</h3>
        <p className="text-gray-600 text-sm">{getActiveAgent().description}</p>
        <button 
          className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 transition-colors flex items-center"
          onClick={handleRunAgent}
          disabled={isProcessing}
        >
          {isProcessing ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </>
          ) : 'Run Agent'}
        </button>
      </div>
      
      {result && (
        <div className="border border-gray-200 rounded-md p-4">
          <h3 className="font-bold text-lg text-gray-800 mb-2">{result.title}</h3>
          <p className="text-gray-600 mb-4">{result.content}</p>
          
          {activeAgent === 'techTranslator' && (
            <div>
              <h4 className="font-medium text-gray-700 mb-2">Technical Requirements:</h4>
              <ul className="list-disc pl-5 space-y-1">
                {result.technicalRequirements.map((req, index) => (
                  <li key={index} className="text-gray-600">{req}</li>
                ))}
              </ul>
            </div>
          )}
          
          {activeAgent === 'roadmap' && (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timeline</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Technical Goal</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Business Impact</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {result.milestones.map((milestone, index) => (
                    <tr key={index}>
                      <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">{milestone.week}</td>
                      <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-800">{milestone.technical}</td>
                      <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-800">{milestone.business}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          
          {activeAgent === 'investor' && (
            <div className="grid grid-cols-2 gap-4">
              {result.metrics.map((metric, index) => (
                <div key={index} className="bg-gray-50 p-3 rounded">
                  <p className="text-sm text-gray-500">{metric.name}</p>
                  <div className="flex items-end gap-2">
                    <span className="text-xl font-bold text-gray-800">{metric.value}</span>
                    <span className={`text-sm font-medium ${metric.change.includes('+') ? 'text-green-600' : 'text-red-600'}`}>
                      {metric.change}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {activeAgent === 'pmf' && (
            <div>
              <h4 className="font-medium text-gray-700 mb-2">Key Insights:</h4>
              <ul className="space-y-2">
                {result.insights.map((insight, index) => (
                  <li key={index} className="bg-yellow-50 p-3 rounded border-l-4 border-yellow-400 text-gray-700">
                    {insight}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AgentPanel;
