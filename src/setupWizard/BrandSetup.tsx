import React, { useState } from "react";
import { motion } from "framer-motion";
import { MenuItem, Select, TextField } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { setPayload } from "../reduxStore/Slices/setUpSlices";

const BrandSetup = () => {

  const [logoPreview, setLogoPreview] = useState(null);
  const dispatch = useDispatch();
  const { payload } = useSelector((state: any) => state.setUp);

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    console.log("Name:", name, "Value:", value);
    dispatch(
      setPayload({
        ...payload,
        brand: {
          ...payload.brand,
          [name]: value,
        },
      })
    );
  };

  const handleLogoUpload = (e: any) => {
    const file = e.target.files[0];
    if (file) {
      dispatch(
        setPayload({
          ...payload,
          brand: {
            ...payload.brand,
            logo: file,
          },
        })
      );

      // Create preview
      const reader = new FileReader();
      reader.onload = (e: any) => {
        setLogoPreview(e.target.result);
      };
      reader.readAsDataURL(file);
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

  return (
    <div className=" flex flex-col  ">
      {/* Form */}
      <motion.form
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="bg-white  p-4"
      >
        <div className="flex flex-col ">
          {/* Left Column - Brand Identity */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-800 ">
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
                value={payload?.brand?.brandName ?? ""}
                onChange={handleInputChange}
              />
            </div>
          </div>
          {/* Logo Upload */}
          <div className="my-6">
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
                <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 2MB</p>
              </div>
            </div>
          </div>

          {/* Right Column - Contact & Preferences */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Contact & Preferences
            </h3>

            {/* Support Email */}
            <div>
              <TextField
                label="Support Email"
                fullWidth
                variant="standard"
                name="supportEmail"
                value={payload?.brand?.supportEmail}
                onChange={handleInputChange}
                placeholder="Enter your support email"
              />
          
            </div>

            {/* Support Phone */}
            <div>
              <TextField
                label="Support Phone"
                fullWidth
                name="supportPhone"
                variant="standard"
                placeholder="+1 (555) 123-4567"
                value={payload?.brand?.supportPhone}
                onChange={handleInputChange}
              />
          
            </div>

            {/* Timezone */}
            <div>
              <Select
                fullWidth
                labelId="timezone-label"
                id="timezone"
                variant="standard"
                name="timezone"
                value={payload?.brand?.timezone}
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
                name="dateFormat"
                value={payload?.brand?.dateFormat}
                onChange={handleInputChange}
              >
                {dateFormats.map((format) => (
                  <MenuItem key={format.value} value={format.value}>
                    {format.label}
                  </MenuItem>
                ))}
              </Select>
            </div>
          </div>
        </div>
      </motion.form>
    </div>
  );
};

export default BrandSetup;
