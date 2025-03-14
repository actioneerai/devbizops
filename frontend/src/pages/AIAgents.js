import React from 'react';
import AgentPanel from '../components/AgentPanel';

const AIAgents = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">AI Agents</h1>
        <AgentPanel />
      </div>
    </div>
  );
};

export default AIAgents;
