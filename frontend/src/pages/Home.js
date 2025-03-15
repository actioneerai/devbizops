import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Home = () => {
  const { enableDemoMode } = useAuth();
  
  const handleDemoClick = (e) => {
    e.preventDefault();
    enableDemoMode();
    window.location.href = '/demo/dashboard';
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      {/* Hero Section */}
      <div className="container mx-auto px-4 pt-20 pb-32">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-teal-400">
            DevBizOps Revolution
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            Where technical excellence and business growth move in perfect harmony
          </p>
          <button
            onClick={handleDemoClick}
            className="inline-block px-8 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition-colors"
          >
            View Demo Dashboard
          </button>
        </div>
      </div>

      {/* Core Principles */}
      <div className="bg-gray-800 py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-16">Core Principles</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {principles.map((principle, index) => (
              <div
                key={index}
                className="bg-gray-700 rounded-lg p-6 hover:bg-gray-600 transition-colors"
              >
                <h3 className="text-xl font-semibold mb-4">{principle.title}</h3>
                <p className="text-gray-300">{principle.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-16">Why DevBizOps?</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
                    {benefit.icon}
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">{benefit.title}</h3>
                  <p className="text-gray-300">{benefit.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gray-800 py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Transform Your Startup?</h2>
          <p className="text-xl text-gray-300 mb-8">
            Join us in creating a world where startups move faster with greater confidence
          </p>
          <div className="flex justify-center space-x-4">
            <button
              onClick={handleDemoClick}
              className="px-8 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition-colors"
            >
              Try the Dashboard Demo
            </button>
            <Link
              to="/demo/ai-agents"
              className="px-8 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-semibold transition-colors"
              onClick={() => enableDemoMode()}
            >
              Explore AI Agents Demo
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

const principles = [
  {
    title: "Unified Truth, Not Siloed Data",
    description: "A single, unified knowledge graph where every technical action is directly mapped to its business impact."
  },
  {
    title: "AI-Powered Translation",
    description: "AI agents automatically translate across domains in real-time, eliminating communication gaps."
  },
  {
    title: "Real-Time Feedback",
    description: "Instantaneous and bidirectional feedback between technical implementation and business outcomes."
  },
  {
    title: "Empowered by AI",
    description: "AI amplifies human creativity and decision-making by removing friction and handling tedious work."
  },
  {
    title: "Unified Access",
    description: "Contextual, role-based access that provides everyone the information they need in a format they understand."
  },
  {
    title: "Sustainable Growth",
    description: "Balance technical debt against business momentum with perfect visibility."
  }
];

const benefits = [
  {
    icon: "⚡",
    title: "Accelerated Decision-Making",
    description: "No waiting for reports or translators. Get instant insights to move faster."
  },
  {
    icon: "🎯",
    title: "Aligned Incentives",
    description: "Engineers and business teams working toward the same visible goals."
  },
  {
    icon: "📊",
    title: "Reduced Waste",
    description: "Immediately see which features drive value and which don't."
  },
  {
    icon: "🚀",
    title: "Investor Readiness",
    description: "Automatically generate compelling, data-driven narratives."
  }
];

export default Home;
