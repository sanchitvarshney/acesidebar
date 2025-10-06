import React, { useState } from "react";
import { motion } from "framer-motion";
import { TextField } from "@mui/material";

const WhatsappConfig = ({ onNext, onBack, isFirstStep, isLastStep }: any) => {
  const [formData, setFormData] = useState<any>({
    apiKey: "",
    phoneNumber: "",
    businessName: "",
  });

  const [errors, setErrors] = useState<any>({});

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev: any) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors: any = {};

    if (!formData.apiKey.trim()) {
      newErrors.apiKey = "WhatsApp Business API Key is required";
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = "Phone number is required";
    } else if (
      !/^\+?[1-9]\d{1,14}$/.test(formData.phoneNumber.replace(/\s/g, ""))
    ) {
      newErrors.phoneNumber = "Please enter a valid phone number";
    }

    if (!formData.businessName.trim()) {
      newErrors.businessName = "Business name is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    if (validateForm()) {
      onNext({ whatsapp: formData });
    }
  };

  const handleTestConnection = () => {
    // Placeholder for testing WhatsApp connection
    alert(
      "Testing WhatsApp Business API connection... (This would be implemented with actual API call)"
    );
  };

  return (
    <div className="w-full">
      {/* Header */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-4"
      >
        <div className="w-[60px] h-[60px] bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
          <svg
            className="w-10 h-10 text-green-600"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          WhatsApp Business Integration
        </h1>
        <p className="text-md text-gray-600">
          Configure WhatsApp Business API to enable customer support via
          WhatsApp messaging.
        </p>
      </motion.div>

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
        onSubmit={handleSubmit}
        className="w-full max-w-lg mx-auto"
      >
        <div className="space-y-6">
          {/* Business Name */}
          <div>
            <TextField
              label="Business Email"
              fullWidth
              variant="standard"
              name="businessName"
              value={formData.businessName}
              onChange={handleInputChange}
              placeholder="Enter your support email"
            />
            {errors.businessName && (
              <p className="mt-1 text-sm text-red-600">{errors.businessName}</p>
            )}
          </div>

          {/* API Key */}
          <div>
            <TextField
              label="Business Name"
              variant="standard"
              fullWidth
              name="businessName"
              value={formData.businessName}
              onChange={handleInputChange}
              placeholder="Enter your business name"
            />
            {errors.apiKey && (
              <p className="mt-1 text-sm text-red-600">{errors.apiKey}</p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              You can find this in your Meta for Developers dashboard
            </p>
          </div>

          {/* Phone Number */}
          <div>
  
            <TextField label="Phone Number" fullWidth variant="standard" name="phoneNumber" value={formData.phoneNumber} onChange={handleInputChange} placeholder="Enter your WhatsApp Business phone number" />
            {errors.phoneNumber && (
              <p className="mt-1 text-sm text-red-600">{errors.phoneNumber}</p>
            )}
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
