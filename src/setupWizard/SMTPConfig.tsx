import React, { useState } from "react";
import { motion } from "framer-motion";
import { MenuItem, Select, TextField } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { setPayload } from "../reduxStore/Slices/setUpSlices";

const SMTPConfig = () => {
  const { payload } = useSelector((state: any) => state.setUp);
  const dispatch = useDispatch();

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;

    dispatch(
      setPayload({
        ...payload,
        smtpConfig: { ...payload.smtpConfig, [name]: value },
      })
    );
  };

  return (
    <div className=" flex flex-col items-center justify-center ">
      {/* Form */}
      <motion.form
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
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
              value={payload?.smtpConfig?.smtpHost}
              onChange={handleInputChange}
              placeholder="smtp.gmail.com"
            />
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
              value={payload?.smtpConfig?.port}
              onChange={handleInputChange}
            />
          </div>

          {/* Username */}
          <div>
            <TextField
              label="Username"
              variant="standard"
              fullWidth
              name="username"
              value={payload?.smtpConfig?.username}
              onChange={handleInputChange}
              placeholder="your-email@example.com"
            />
          </div>

          {/* Password */}
          <div>
            <TextField
              label="Password"
              fullWidth
              placeholder="Enter your SMTP password"
              name="password"
              variant="standard"
              value={payload?.smtpConfig?.password}
              onChange={handleInputChange}
            />
          </div>

          {/* Encryption */}
          <div>
            <Select
              fullWidth
              labelId="encryption-label"
              id="encryption"
              variant="standard"
              name="encryption"
              value={payload?.smtpConfig?.encryption ?? "None"}
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
