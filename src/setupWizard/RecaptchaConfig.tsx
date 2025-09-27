import React, { useState } from "react";
import { motion } from "framer-motion";
import { TextField } from "@mui/material";

const RecaptchaConfig = ({ onNext, onBack, isFirstStep, isLastStep }: any) => {
  const [formData, setFormData] = useState({
    siteKey: "",
    secretKey: "",
    version: "v2",
  });

  const [errors, setErrors] = useState<any>({});

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
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

    if (!formData.siteKey.trim()) {
      newErrors.siteKey = "Site Key is required";
    }

    if (!formData.secretKey.trim()) {
      newErrors.secretKey = "Secret Key is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    if (validateForm()) {
      onNext({ recaptcha: formData });
    }
  };

  const handleTestConnection = () => {
    // Placeholder for testing reCAPTCHA connection
    alert(
      "Testing reCAPTCHA configuration... (This would be implemented with actual API call)"
    );
  };

  const recaptchaVersions = [
    {
      value: "v2",
      label: "reCAPTCHA v2",
      description: 'Classic "I\'m not a robot" checkbox',
    },
    {
      value: "v3",
      label: "reCAPTCHA v3",
      description: "Invisible background verification",
    },
  ];

  return (
    <div className="w-full h-[calc(100vh-190px)]  overflow-y-auto p-4 ">
      {/* Header */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-4"
      >
        <div className="w-[60px] h-[60px] bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
          <svg
            className="w-10 h-10 text-blue-600"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Google reCAPTCHA Configuration
        </h1>
        <p className="text-md text-gray-600">
          Configure Google reCAPTCHA to protect your ticket system from spam and
          abuse.
        </p>
      </motion.div>

      {/* Info Card */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="bg-yellow-50 w-full max-w-xl mx-auto border border-yellow-200 rounded-lg p-4 mb-2"
      >
        <div className="flex items-start">
          <svg
            className="w-6 h-6 text-yellow-600 mt-0.5 mr-3 flex-shrink-0"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          <div>
            <h3 className="text-lg font-semibold text-yellow-800 mb-2">
              reCAPTCHA Setup Required
            </h3>
            <p className="text-yellow-700 mb-3">To get your reCAPTCHA keys:</p>
            <ol className="text-yellow-700 text-sm space-y-1 list-decimal list-inside">
              <li>
                Visit{" "}
                <a
                  href="https://www.google.com/recaptcha/admin"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline"
                >
                  Google reCAPTCHA Admin Console
                </a>
              </li>
              <li>Create a new site or select an existing one</li>
              <li>Copy the Site Key and Secret Key</li>
            </ol>
          </div>
        </div>
      </motion.div>

      {/* Form */}
      <motion.form
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        onSubmit={handleSubmit}
        className=" w-full max-w-xl mx-auto p-4"
      >
        <div className="space-y-6">
          {/* reCAPTCHA Version */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              reCAPTCHA Version *
            </label>
            <div className="space-y-3">
              {recaptchaVersions.map((version) => (
                <label
                  key={version.value}
                  className={`flex items-start p-2 border rounded-lg cursor-pointer transition-all ${
                    formData.version === version.value
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="version"
                    value={version.value}
                    checked={formData.version === version.value}
                    onChange={handleInputChange}
                    className="mt-1 mr-3 text-blue-600 focus:ring-blue-500"
                  />
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">
                      {version.label}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      {version.description}
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Site Key */}
          <div>
            <TextField
              label="Site Key"
              name="siteKey"
              value={formData.siteKey}
              onChange={handleInputChange}
              placeholder="6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"
              fullWidth
              variant="standard"
            />
            {errors.siteKey && (
              <p className="mt-1 text-sm text-red-600">{errors.siteKey}</p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              This key is safe to use in client-side code
            </p>
          </div>

          {/* Secret Key */}
          <div>
            <TextField
              fullWidth
              label="Secret Key"
              variant="standard"
              placeholder="6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe"
              name="secretKey"
              value={formData.secretKey}
              onChange={handleInputChange}
            />
            {errors.secretKey && (
              <p className="mt-1 text-sm text-red-600">{errors.secretKey}</p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              Keep this key secret and secure
            </p>
          </div>
        </div>

        {/* Test Connection Button */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={handleTestConnection}
            className="w-full py-3 px-6 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-all mb-4"
          >
            Test reCAPTCHA Configuration
          </button>
        </div>
      </motion.form>
    </div>
  );
};

export default RecaptchaConfig;
