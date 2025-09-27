import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button, TextField } from "@mui/material";

const DomainAdd = ({ onNext, onBack, isFirstStep, isLastStep }: any) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [domainInput, setDomainInput] = useState("");

  const handleOptionSelect = (option: any) => {
    setSelectedOption(option);
  };

  const handleContinue = () => {
    if (selectedOption === "existing" && domainInput.trim()) {
      onNext({ domain: { type: "existing", value: domainInput.trim() } });
    } else if (selectedOption === "new") {
      onNext({ domain: { type: "new", value: "new_domain" } });
    }
  };

  const handleExistingDomainSubmit = (e: any) => {
    e.preventDefault();
    if (domainInput.trim()) {
      onNext({ domain: { type: "existing", value: domainInput.trim() } });
    }
  };

  return (
    <div className="max-w-4xl h-[calc(100vh-185px)] flex flex-col items-center justify-center overflow-y-auto ">
      {/* Header Section */}
      <div className="text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-4"
        >
          {/* Main 3D Cube */}
          <div className="flex items-center justify-center">
            <div className="w-[60px] h-[60px] bg-red-500 rounded-lg  shadow-2xl flex items-center justify-center">
              <svg
                className="w-10 h-10 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
        </motion.div>

        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-2xl font-bold text-gray-800 mb-2"
        >
          Welcome to Ticket Management System!
        </motion.h1>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-md text-gray-600 max-w-2xl mx-auto"
        >
          Add your existing domain to configure it with your Ticket Management
          System.
        </motion.p>
      </div>

      {/* Domain Configuration Card */}
      <div className="max-w-2xl mx-auto my-5">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-white  py-3 px-10"
        >
          <div className="text-center">
            {/* Icon */}
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-6 h-6 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
            </div>

            {/* Title */}
            <div className="flex items-center justify-center mb-4">
              <h3 className="text-xl font-semibold text-gray-800">
                Add your domain
              </h3>
              <button className="ml-2 p-1 text-gray-400 hover:text-gray-600 transition-colors">
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>

            {/* Description */}
            <p className="text-gray-600 mb-6">
              Add your existing domain to configure it with Ticket Management
              System
            </p>

            {/* Domain Input */}
            <div className="mb-6">
              <TextField
                variant="standard"
                label="Domain"
                color="primary"
                fullWidth
                placeholder="Enter your domain (e.g., example.com)"
                value={domainInput}
                onChange={(e) => setDomainInput(e.target.value)}
              />
         
            </div>

          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DomainAdd;
