import React, { useState } from 'react';
import { motion } from 'framer-motion';

const AgentAdd = ({ onNext, onBack, onSkip, isFirstStep, isLastStep }:any) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'Agent'
  });

  const [errors, setErrors] = useState<any>({});
  const [isSkipped, setIsSkipped] = useState(false);

  const handleInputChange = (e:any) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev:any) => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors:any = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e:any) => {
    e.preventDefault();
    if (validateForm()) {
      onNext({ agent: formData });
    }
  };

  const handleSkip = () => {
    setIsSkipped(true);
    onSkip();
  };

  const roles = [
    { value: 'Agent', label: 'Agent', description: 'Can handle tickets and respond to customers' },
    { value: 'Supervisor', label: 'Supervisor', description: 'Can manage agents and oversee operations' },
    { value: 'Admin', label: 'Administrator', description: 'Full system access and configuration rights' }
  ];

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8"
      >
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Add Your First Agent</h1>
        <p className="text-lg text-gray-600">
          Add an agent to start handling tickets. You can always add more agents later.
        </p>
      </motion.div>

      {/* Skip Notice */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8"
      >
        <div className="flex items-start">
          <svg className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <div>
            <h3 className="text-sm font-semibold text-blue-800">Optional Step</h3>
            <p className="text-sm text-blue-700 mt-1">
              You can skip this step and add agents later from the admin panel.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Form */}
      <motion.form
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow-lg p-8"
      >
        <div className="space-y-6">
          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
              Full Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="John Doe"
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
              Email Address *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="john.doe@example.com"
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email}</p>
            )}
          </div>

          {/* Role Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Role *
            </label>
            <div className="space-y-3">
              {roles.map((role) => (
                <label
                  key={role.value}
                  className={`flex items-start p-4 border rounded-lg cursor-pointer transition-all ${
                    formData.role === role.value
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="role"
                    value={role.value}
                    checked={formData.role === role.value}
                    onChange={handleInputChange}
                    className="mt-1 mr-3 text-green-600 focus:ring-green-500"
                  />
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{role.label}</div>
                    <div className="text-sm text-gray-600 mt-1">{role.description}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>

      </motion.form>
    </div>
  );
};

export default AgentAdd;
