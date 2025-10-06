import React, { useState } from "react";
import { motion } from "framer-motion";

const Completion = ({ onNext, onBack, isFirstStep, isLastStep, data }: any) => {
  const [showInviteForm, setShowInviteForm] = useState(false);
  const [inviteData, setInviteData] = useState({
    email: "",
    name: "",
    role: "Agent",
  });

  const handleGoToDashboard = () => {
    // Navigate to dashboard
    window.location.href = "/dashboard";
  };

  const handleStartOver = () => {
    // Reset wizard and start over
    window.location.reload();
  };

  const handleInviteAgent = (e: any) => {
    e.preventDefault();
    // Handle agent invitation
    console.log("Inviting agent:", inviteData);
    alert(`Invitation sent to ${inviteData.email}!`);
    setShowInviteForm(false);
    setInviteData({ email: "", name: "", role: "Agent" });
  };

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setInviteData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="w-full  flex flex-col items-center justify-center">
      {/* Success Animation */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{
          type: "spring",
          stiffness: 200,
          damping: 10,
          delay: 0.2,
        }}
        className="text-center mb-2"
      >
        {/* Success Icon */}
        <div className=" w-[70px] h-[70px]  bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 relative">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5, duration: 0.3 }}
            className="w-[45px] h-[45px] bg-green-500 rounded-full flex items-center justify-center"
          >
            <svg
              className="w-10 h-10 text-white"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </motion.div>
        </div>

        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-2xl font-bold text-gray-800 mb-2"
        >
          🎉 Setup Complete!
        </motion.h1>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-lg text-gray-600 mb-2"
        >
          Your Ticket Management System is ready to go!
        </motion.p>
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="w-full max-w-xl p-4"
      >
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
          Next Steps
        </h2>

        <div className="flex flex-col sm:flex-row gap-8 justify-center">
          {/* Invite Agent Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowInviteForm(true)}
            className="flex-1 max-w-xs px-6 py-4 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all text-lg shadow-lg hover:shadow-xl flex items-center justify-center space-x-3"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
              />
            </svg>
            <span>Invite Agent</span>
          </motion.button>

          {/* Control Panel Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => (window.location.href = "/admin/dashboard")}
            className="flex-1 max-w-xs px-6 py-4 bg-gray-800 text-white rounded-xl font-semibold hover:bg-gray-900 transition-all text-lg shadow-lg hover:shadow-xl flex items-center justify-center space-x-3"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <span>Control Panel</span>
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default Completion;
