import React, { useState } from 'react';
import { motion } from 'framer-motion';

const DomainAdd = ({ onNext, onBack, isFirstStep, isLastStep }) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [domainInput, setDomainInput] = useState('');

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
  };

  const handleContinue = () => {
    if (selectedOption === 'existing' && domainInput.trim()) {
      onNext({ domain: { type: 'existing', value: domainInput.trim() } });
    } else if (selectedOption === 'new') {
      onNext({ domain: { type: 'new', value: 'new_domain' } });
    }
  };

  const handleExistingDomainSubmit = (e) => {
    e.preventDefault();
    if (domainInput.trim()) {
      onNext({ domain: { type: 'existing', value: domainInput.trim() } });
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header Section */}
      <div className="text-center mb-12">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          {/* Central Graphic - 3D Cube with surrounding icons */}
          <div className="relative w-32 h-32 mx-auto mb-6">
            {/* Main 3D Cube */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-20 h-20 bg-red-500 rounded-lg transform rotate-12 shadow-2xl flex items-center justify-center">
                <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            
            {/* Surrounding Icons */}
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
            </div>
            <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="absolute top-4 -left-4 w-5 h-5 bg-yellow-500 rounded-full"></div>
            <div className="absolute bottom-4 -right-4 w-5 h-5 bg-purple-500 rounded-full"></div>
          </div>
        </motion.div>

        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-4xl font-bold text-gray-800 mb-4"
        >
          Welcome to Ticket Management System!
        </motion.h1>
        
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-lg text-gray-600 max-w-2xl mx-auto"
        >
          Add your existing domain to configure it with your Ticket Management System.
        </motion.p>
      </div>

      {/* Domain Configuration Card */}
      <div className="max-w-2xl mx-auto mb-12">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl shadow-lg border-2 border-gray-200 p-8"
        >
          <div className="text-center">
            {/* Icon */}
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>

            {/* Title */}
            <div className="flex items-center justify-center mb-4">
              <h3 className="text-xl font-semibold text-gray-800">Add your domain</h3>
              <button className="ml-2 p-1 text-gray-400 hover:text-gray-600 transition-colors">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                </svg>
              </button>
            </div>

            {/* Description */}
            <p className="text-gray-600 mb-6">
              Add your existing domain to configure it with Ticket Management System
            </p>

            {/* Domain Input */}
            <div className="mb-6">
              <input
                type="text"
                placeholder="Enter your domain (e.g., example.com)"
                value={domainInput}
                onChange={(e) => setDomainInput(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Button */}
            <button
              onClick={handleExistingDomainSubmit}
              disabled={!domainInput.trim()}
              className={`w-full py-3 px-6 rounded-lg font-semibold transition-all ${
                domainInput.trim()
                  ? 'bg-green-600 hover:bg-green-700 text-white'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              Add Domain
            </button>
          </div>
        </motion.div>
      </div>

    </div>
  );
};

export default DomainAdd;
