import React, { useState } from 'react';
import { motion } from 'framer-motion';

const Completion = ({ onNext, onBack, isFirstStep, isLastStep, data }) => {
  const [showInviteForm, setShowInviteForm] = useState(false);
  const [inviteData, setInviteData] = useState({
    email: '',
    name: '',
    role: 'Agent'
  });

  const handleGoToDashboard = () => {
    // Navigate to dashboard
    window.location.href = '/dashboard';
  };

  const handleStartOver = () => {
    // Reset wizard and start over
    window.location.reload();
  };

  const handleInviteAgent = (e) => {
    e.preventDefault();
    // Handle agent invitation
    console.log('Inviting agent:', inviteData);
    alert(`Invitation sent to ${inviteData.email}!`);
    setShowInviteForm(false);
    setInviteData({ email: '', name: '', role: 'Agent' });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInviteData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Success Animation */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ 
          type: "spring", 
          stiffness: 200, 
          damping: 10,
          delay: 0.2 
        }}
        className="text-center mb-12"
      >
        {/* Success Icon */}
        <div className="w-32 h-32 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8 relative">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5, duration: 0.3 }}
            className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center"
          >
            <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </motion.div>
          
          {/* Celebration particles */}
          <motion.div
            initial={{ scale: 0, rotate: 0 }}
            animate={{ scale: 1, rotate: 360 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="absolute -top-2 -right-2 w-4 h-4 bg-yellow-400 rounded-full"
          />
          <motion.div
            initial={{ scale: 0, rotate: 0 }}
            animate={{ scale: 1, rotate: -360 }}
            transition={{ delay: 1, duration: 0.6 }}
            className="absolute -bottom-2 -left-2 w-4 h-4 bg-blue-400 rounded-full"
          />
          <motion.div
            initial={{ scale: 0, rotate: 0 }}
            animate={{ scale: 1, rotate: 180 }}
            transition={{ delay: 1.2, duration: 0.6 }}
            className="absolute top-2 -left-4 w-3 h-3 bg-purple-400 rounded-full"
          />
        </div>

        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-4xl font-bold text-gray-800 mb-4"
        >
          🎉 Setup Complete!
        </motion.h1>
        
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-xl text-gray-600 mb-8"
        >
          Your Ticket Management System is ready to go!
        </motion.p>
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="bg-white rounded-xl shadow-lg p-8 mb-8"
      >
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
          Next Steps
        </h2>
        
        <div className="flex flex-col sm:flex-row gap-6 justify-center">
          {/* Invite Agent Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowInviteForm(true)}
            className="flex-1 max-w-xs px-8 py-6 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all text-lg shadow-lg hover:shadow-xl flex items-center justify-center space-x-3"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
            </svg>
            <span>Invite Agent</span>
          </motion.button>

          {/* Control Panel Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.location.href = '/admin/dashboard'}
            className="flex-1 max-w-xs px-8 py-6 bg-gray-800 text-white rounded-xl font-semibold hover:bg-gray-900 transition-all text-lg shadow-lg hover:shadow-xl flex items-center justify-center space-x-3"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>Control Panel</span>
          </motion.button>
        </div>
      </motion.div>


      {/* Action Buttons */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1.4 }}
        className="flex flex-col sm:flex-row gap-4 justify-center"
      >
        <button
          onClick={handleGoToDashboard}
          className="px-8 py-4 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-all text-lg shadow-lg hover:shadow-xl"
        >
          🎉 Welcome to Dashboard
        </button>
        
        <button
          onClick={handleStartOver}
          className="px-8 py-4 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-all text-lg"
        >
          Start Over
        </button>
      </motion.div>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}
        className="text-center mt-12 text-gray-500"
      >
        <p className="text-sm">
          Need help? Check out our{' '}
          <a href="/docs" className="text-blue-600 hover:text-blue-800 underline">
            documentation
          </a>{' '}
          or{' '}
          <a href="/support" className="text-blue-600 hover:text-blue-800 underline">
            contact support
          </a>
        </p>
      </motion.div>
    </div>
  );
};

export default Completion;
