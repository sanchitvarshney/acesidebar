import React, { useState } from "react";
import { motion } from "framer-motion";
import { MenuItem, Select, TextField } from "@mui/material";

const SMTPConfig = ({ onNext, onBack, isFirstStep, isLastStep }: any) => {
  const [formData, setFormData] = useState({
    smtpHost: "",
    port: "",
    username: "",
    password: "",
    encryption: "SSL",
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

    if (!formData.smtpHost.trim()) {
      newErrors.smtpHost = "SMTP Host is required";
    }

    if (!formData.port.trim()) {
      newErrors.port = "Port is required";
    } else if (!/^\d+$/.test(formData.port)) {
      newErrors.port = "Port must be a number";
    }

    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
    }

    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    if (validateForm()) {
      onNext({ smtp: formData });
    }
  };

  const handleTestConnection = () => {
    // Placeholder for testing SMTP connection
    alert(
      "Testing SMTP connection... (This would be implemented with actual API call)"
    );
  };

  return (
    <div className="max-w-4xl h-[calc(100vh-185px)] flex flex-col items-center justify-center overflow-y-auto  ">
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
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          SMTP Configuration
        </h1>
        <p className="text-lg text-gray-600">
          Configure your SMTP settings to enable email notifications and ticket
          communications.
        </p>
      </motion.div>

      {/* Form */}
      <motion.form
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        onSubmit={handleSubmit}
        className="w-full max-w-lg"
      >
        <div className="grid grid-cols-2 gap-5">
          {/* SMTP Host */}
          <div>
            <TextField
              label="SMTP Host"
              fullWidth
              variant="standard"
              name="smtpHost"
              value={formData.smtpHost}
              onChange={handleInputChange}
              placeholder="smtp.gmail.com"
            />
            {errors.smtpHost && (
              <p className="mt-1 text-sm text-red-600">{errors.smtpHost}</p>
            )}
          </div>

          {/* Port */}
          <div>
            <TextField
              label="Port"
              type="number"
              variant="standard"
              fullWidth
              placeholder="587"
              name="port"
              value={formData.port}
              onChange={handleInputChange}
            />
            {errors.port && (
              <p className="mt-1 text-sm text-red-600">{errors.port}</p>
            )}
          </div>

          {/* Username */}
          <div>
            <TextField
              label="Username"
              variant="standard"
              fullWidth
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              placeholder="your-email@example.com"
            />
            {errors.username && (
              <p className="mt-1 text-sm text-red-600">{errors.username}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <TextField
              label="Password"
              fullWidth
              placeholder="Enter your SMTP password"
              name="password"
              variant="standard"
              value={formData.password}
              onChange={handleInputChange}
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">{errors.password}</p>
            )}
          </div>

          {/* Encryption */}
          <div>
            <Select
              fullWidth
              labelId="encryption-label"
              id="encryption"
              variant="standard"
              value={formData.encryption}
              onChange={handleInputChange}
            >
              <MenuItem value={"SSL"}>SSL</MenuItem>
              <MenuItem value="TLS">TLS</MenuItem>
              <MenuItem value="None">None</MenuItem>
            </Select>
          </div>
        </div>

    
      </motion.form>
    </div>
  );
};

export default SMTPConfig;
