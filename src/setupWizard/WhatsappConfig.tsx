import React, { useState } from "react";
import { motion } from "framer-motion";
import { TextField } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { setPayload } from "../reduxStore/Slices/setUpSlices";

const WhatsappConfig = () => {
  const { payload } = useSelector((state: any) => state.setUp);
  const dispatch = useDispatch();

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    dispatch(
      setPayload({
        ...payload,
        whatsapp: { ...payload.whatsapp, [name]: value },
      })
    );
  };

  return (
    <div className="w-full">
      {/* Info Card */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="bg-blue-50 w-full max-w-lg mx-auto border border-blue-200 rounded-lg p-4 mb-4"
      >
        <div className="flex items-start">
          <svg
            className="w-6 h-6 text-blue-600 mt-0.5 mr-3 flex-shrink-0"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clipRule="evenodd"
            />
          </svg>
          <div>
            <h3 className="text-lg font-semibold text-blue-800 mb-2">
              WhatsApp Business API Setup
            </h3>
            <p className="text-blue-700 mb-3">
              To use WhatsApp Business API, you need to:
            </p>
            <ul className="text-blue-700 text-sm space-y-1">
              <li>• Have a WhatsApp Business Account</li>
              <li>• Get your API credentials from Meta for Developers</li>
              <li>• Verify your business phone number</li>
            </ul>
          </div>
        </div>
      </motion.div>

      {/* Form */}
      <motion.form
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="w-full max-w-lg mx-auto"
      >
        <div className="space-y-6">
          {/* Business Name */}
          <div>
            <TextField
              label="Business Email"
              fullWidth
              variant="standard"
              name="businessEmail"
              value={payload?.whatsapp?.businessEmail}
              onChange={handleInputChange}
              placeholder="Enter your support email"
            />
          </div>

          {/* API Key */}
          <div>
            <TextField
              label="Business Name"
              variant="standard"
              fullWidth
              name="businessName"
              value={payload?.whatsapp?.businessName}
              onChange={handleInputChange}
              placeholder="Enter your business name"
            />
            <p className="mt-1 text-xs text-gray-500">
              You can find this in your Meta for Developers dashboard
            </p>
          </div>

          {/* Phone Number */}
          <div>
            <TextField
              label="Phone Number"
              fullWidth
              variant="standard"
              name="phoneNumber"
              value={payload?.whatsapp?.phoneNumber}
              onChange={handleInputChange}
              placeholder="Enter your WhatsApp Business phone number"
            />

            <p className="mt-1 text-xs text-gray-500">
              Include country code (e.g., +1 for US, +44 for UK)
            </p>
          </div>
        </div>
      </motion.form>
    </div>
  );
};

export default WhatsappConfig;
