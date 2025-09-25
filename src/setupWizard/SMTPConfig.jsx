import React, { useState } from 'react';
import { motion } from 'framer-motion';

const SMTPConfig = ({ onNext, onBack, isFirstStep, isLastStep }) => {
  const [formData, setFormData] = useState({
    smtpHost: '',
    port: '',
    username: '',
    password: '',
    encryption: 'SSL'
  });

  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.smtpHost.trim()) {
      newErrors.smtpHost = 'SMTP Host is required';
    }
    
    if (!formData.port.trim()) {
      newErrors.port = 'Port is required';
    } else if (!/^\d+$/.test(formData.port)) {
      newErrors.port = 'Port must be a number';
    }
    
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    }
    
    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onNext({ smtp: formData });
    }
  };

  const handleTestConnection = () => {
    // Placeholder for testing SMTP connection
    alert('Testing SMTP connection... (This would be implemented with actual API call)');
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8"
      >
        <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-gray-800 mb-4">SMTP Configuration</h1>
        <p className="text-lg text-gray-600">
          Configure your SMTP settings to enable email notifications and ticket communications.
        </p>
      </motion.div>

      {/* Form */}
      <motion.form
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow-lg p-8"
      >
        <div className="space-y-6">
          {/* SMTP Host */}
          <div>
            <label htmlFor="smtpHost" className="block text-sm font-semibold text-gray-700 mb-2">
              SMTP Host *
            </label>
            <input
              type="text"
              id="smtpHost"
              name="smtpHost"
              value={formData.smtpHost}
              onChange={handleInputChange}
              placeholder="smtp.gmail.com"
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                errors.smtpHost ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.smtpHost && (
              <p className="mt-1 text-sm text-red-600">{errors.smtpHost}</p>
            )}
          </div>

          {/* Port */}
          <div>
            <label htmlFor="port" className="block text-sm font-semibold text-gray-700 mb-2">
              Port *
            </label>
            <input
              type="text"
              id="port"
              name="port"
              value={formData.port}
              onChange={handleInputChange}
              placeholder="587"
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                errors.port ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.port && (
              <p className="mt-1 text-sm text-red-600">{errors.port}</p>
            )}
          </div>

          {/* Username */}
          <div>
            <label htmlFor="username" className="block text-sm font-semibold text-gray-700 mb-2">
              Username *
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              placeholder="your-email@example.com"
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                errors.username ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.username && (
              <p className="mt-1 text-sm text-red-600">{errors.username}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
              Password *
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Enter your SMTP password"
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                errors.password ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">{errors.password}</p>
            )}
          </div>

          {/* Encryption */}
          <div>
            <label htmlFor="encryption" className="block text-sm font-semibold text-gray-700 mb-2">
              Encryption *
            </label>
            <select
              id="encryption"
              name="encryption"
              value={formData.encryption}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            >
              <option value="SSL">SSL</option>
              <option value="TLS">TLS</option>
              <option value="None">None</option>
            </select>
          </div>
        </div>

        {/* Test Connection Button */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={handleTestConnection}
            className="w-full py-3 px-6 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-all mb-4"
          >
            Test Connection
          </button>
        </div>

      </motion.form>
    </div>
  );
};

export default SMTPConfig;
