import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";

const BrandSetup = ({ onNext, onBack, isFirstStep, isLastStep }: any) => {
  const [formData, setFormData] = useState({
    brandName: "",
    logo: null,
    supportEmail: "",
    supportPhone: "",
    timezone: "UTC",
    dateFormat: "MM/DD/YYYY",
    currency: "USD",
  });

  const [errors, setErrors] = useState<any>({});
  const [logoPreview, setLogoPreview] = useState(null);

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

  const handleLogoUpload = (e: any) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        logo: file,
      }));

      // Create preview
      const reader = new FileReader();
      reader.onload = (e: any) => {
        setLogoPreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const newErrors: any = {};

    if (!formData.brandName.trim()) {
      newErrors.brandName = "Brand name is required";
    }

    if (!formData.supportEmail.trim()) {
      newErrors.supportEmail = "Support email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.supportEmail)) {
      newErrors.supportEmail = "Please enter a valid email address";
    }

    if (!formData.supportPhone.trim()) {
      newErrors.supportPhone = "Support phone is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    if (validateForm()) {
      onNext({ brand: formData });
    }
  };

  const timezones = [
    "UTC",
    "America/New_York",
    "America/Chicago",
    "America/Denver",
    "America/Los_Angeles",
    "Europe/London",
    "Europe/Paris",
    "Europe/Berlin",
    "Asia/Tokyo",
    "Asia/Shanghai",
    "Asia/Kolkata",
    "Australia/Sydney",
    "Pacific/Auckland",
  ];

  const dateFormats = [
    { value: "MM/DD/YYYY", label: "MM/DD/YYYY (US)" },
    { value: "DD/MM/YYYY", label: "DD/MM/YYYY (EU)" },
    { value: "YYYY-MM-DD", label: "YYYY-MM-DD (ISO)" },
  ];

  const currencies = [
    "USD",
    "EUR",
    "GBP",
    "CAD",
    "AUD",
    "JPY",
    "INR",
    "CNY",
    "BRL",
    "MXN",
  ];

  return (
    <div className="max-w-4xl h-[calc(100vh-185px)] flex flex-col items-center justify-center overflow-y-auto  ">
      {/* Header */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-4"
      >
        <div className="w-[60px] h-[60px] bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-10 h-10 text-purple-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
            />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Brand Setup</h1>
        <p className="text-md text-gray-600">
          Configure your brand identity and system preferences for your ticket
          management system.
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
        <div className="grid md:grid-cols-2 gap-8">
          {/* Left Column - Brand Identity */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Brand Identity
            </h3>

            {/* Brand Name */}
            <div>
              <TextField
                label="Brand Name"
                fullWidth
                variant="standard"
                name="brandName"
                placeholder="Enter your brand name"
                value={formData.brandName}
                onChange={handleInputChange}
              />
            </div>

            {/* Logo Upload */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Logo
              </label>
              <div className="flex items-center space-x-4">
                <div className="w-20 h-20 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                  {logoPreview ? (
                    <img
                      src={logoPreview}
                      alt="Logo preview"
                      className="w-16 h-16 object-contain"
                    />
                  ) : (
                    <svg
                      className="w-8 h-8 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  )}
                </div>
                <div className="flex-1">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                    id="logo-upload"
                  />
                  <label
                    htmlFor="logo-upload"
                    className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                  >
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      />
                    </svg>
                    Upload Logo
                  </label>
                  <p className="text-xs text-gray-500 mt-1">
                    PNG, JPG up to 2MB
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Contact & Preferences */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Contact & Preferences
            </h3>

            {/* Support Email */}
            <div>
              <TextField
                label="Support Email"
                fullWidth
                variant="standard"
                name="supportEmail"
                value={formData.supportEmail}
                onChange={handleInputChange}
                placeholder="Enter your support email"
              />
              {errors.supportEmail && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.supportEmail}
                </p>
              )}
            </div>

            {/* Support Phone */}
            <div>
              <TextField
                label="Support Phone"
                fullWidth
                variant="standard"
                placeholder="+1 (555) 123-4567"
                value={formData.supportPhone}
                onChange={handleInputChange}
              />
              {errors.supportPhone && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.supportPhone}
                </p>
              )}
            </div>

            {/* Timezone */}
            <div>
              <Select
                fullWidth
                labelId="timezone-label"
                id="timezone"
                variant="standard"
                value={formData.timezone}
                onChange={handleInputChange}
              >
                {timezones.map((tz) => (
                  <MenuItem key={tz} value={tz}>
                    {tz}
                  </MenuItem>
                ))}
              </Select>
            </div>

            {/* Date Format */}
            <div>
              <Select
                fullWidth
                labelId="format-label"
                id="format"
                variant="standard"
                value={formData.dateFormat}
                onChange={handleInputChange}
              >
                {dateFormats.map((format) => (
                  <MenuItem key={format.value} value={format.value}>
                    {format.label}
                  </MenuItem>
                ))}
              </Select>
            </div>

            {/* Currency */}
            {/* <div>
              <label
                htmlFor="currency"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Currency
              </label>
              <select
                id="currency"
                name="currency"
                value={formData.currency}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              >
                {currencies.map((curr) => (
                  <option key={curr} value={curr}>
                    {curr}
                  </option>
                ))}
              </select>
            </div> */}
          </div>
        </div>
      </motion.form>
    </div>
  );
};

export default BrandSetup;
