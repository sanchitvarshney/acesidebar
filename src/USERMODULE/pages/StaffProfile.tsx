import {
  Alert,
  Avatar,
  Box,
  Button,
  IconButton,
  InputAdornment,
  LinearProgress,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { Visibility, VisibilityOff, Lock } from "@mui/icons-material";

const StaffProfile = () => {
  const [active, setActive] = React.useState(0);
  const [formValues, setFormValues] = useState({
    name: "",
    email: "",
    altEmail: "",
    mobile: "",
    altMobile: "",
    avatar: "",
    userName: "",
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [passwordError, setPasswordError] = useState("");
  const [passwordStrength, setPasswordStrength] = useState(0);

  const evaluatePasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    setPasswordStrength(strength * 25); // out of 100
  };

  const handleClickShowPassword = (field:any) => {
    setShowPassword((prev:any) => ({ ...prev, [field]: !prev[field] }));
  };
  const handlePasswordChange = (e: any) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));

    if (name === "newPassword") {
      evaluatePasswordStrength(value);
    }
  };

  const handlePasswordSubmit = () => {
    if (
      !passwordData.currentPassword ||
      !passwordData.newPassword ||
      !passwordData.confirmPassword
    ) {
      setPasswordError("All fields are required.");
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError("New passwords do not match.");
      return;
    }

    if (passwordStrength < 50) {
      setPasswordError("Password is too weak.");
      return;
    }

    setPasswordError("");
    console.log(passwordData);
    alert("Password changed successfully!");

    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setPasswordStrength(0);
  };

  useEffect(() => {
    const data: any = localStorage.getItem("userData");

    if (data) {
      const parseData = JSON.parse(data);
      const userdata: any = {
        name: parseData?.name,
        email: parseData?.email,
        altEmail: parseData?.altEmail ?? "--",
        mobile: parseData?.phone,
        altMobile: parseData?.altMobile ?? "--",
        avatar: parseData?.avatar ?? "",
        userName: parseData?.username,
      };
      setFormValues(userdata);
    }
  }, []);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdate = () => {
    console.log("payload ", formValues);
  };

  return (
    <div className="w-full h-[calc(100vh-96px)] p-4 overflow-auto">
      <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
        Profile Setting
      </Typography>
      <div className="w-full my-4 ">
        <div className="flex items-center gap-4">
          <Button
            disableElevation={active === 0}
            disableRipple={active === 0}
            variant={active === 0 ? "contained" : "outlined"}
            onClick={() => {setActive(0)
              // reset 
            }}
          >
            Profile Information
          </Button>
          <Button
            variant={active === 1 ? "contained" : "outlined"}
            onClick={() => setActive(1)}
            disableElevation={active === 1}
            disableRipple={active === 1}
          >
            Change Password
          </Button>
        </div>
        <div className="my-6 mx-8">
          {active === 0 ? (
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-5  ">
                <Avatar
                  alt={`${formValues.name}`}
                  src={formValues.avatar || ""}
                  sx={{ width: 100, height: 100 }}
                >
                  {formValues.name?.[0] || "U"}
                </Avatar>
                <Typography></Typography>
                <Button variant="contained">Change Image</Button>
                <Button variant="outlined" color="error">
                  Remove Image
                </Button>
              </div>
              <div className="grid grid-cols-3 gap-4 ">
                <div className="flex flex-col item-center">
                  <span className="text-xs text-gray-600">User Name</span>

                  <TextField
                    size="small"
                    sx={{ mt: 1, textAlign: "end" }}
                    fullWidth
                    variant="outlined"
                    name="userName"
                    value={formValues.userName}
                    onChange={handleChange}
                  />
                </div>

                <div className="flex flex-col item-center">
                  <span className="text-xs text-gray-600">Name</span>

                  <TextField
                    size="small"
                    sx={{ mt: 1, textAlign: "end" }}
                    fullWidth
                    variant="outlined"
                    name="name"
                    value={formValues.name}
                    onChange={handleChange}
                  />
                </div>
                <div className="flex flex-col item-center">
                  <span className="text-xs text-gray-600">Email</span>

                  <TextField
                    size="small"
                    sx={{ mt: 1, textAlign: "end" }}
                    fullWidth
                    name="email"
                    variant="outlined"
                    value={formValues.email}
                    onChange={handleChange}
                  />
                </div>
                <div className="flex flex-col item-center">
                  <span className="text-xs text-gray-600">Alternate Email</span>

                  <TextField
                    size="small"
                    sx={{ mt: 1, textAlign: "end" }}
                    fullWidth
                    name="altEmail"
                    variant="outlined"
                    value={formValues.altEmail}
                    onChange={handleChange}
                  />
                </div>
                <div className="flex flex-col item-center">
                  <span className="text-xs text-gray-600">Mobile Number</span>

                  <TextField
                    size="small"
                    sx={{ mt: 1, textAlign: "end" }}
                    fullWidth
                    name="mobile"
                    variant="outlined"
                    value={formValues.mobile}
                    onChange={handleChange}
                  />
                </div>
                <div className="flex flex-col item-center">
                  <span className="text-xs text-gray-600">
                    Alternate Mobile Number
                  </span>

                  <TextField
                    size="small"
                    sx={{ mt: 1, textAlign: "end" }}
                    fullWidth
                    name="altMobile"
                    variant="outlined"
                    value={formValues.altMobile}
                    onChange={handleChange}
                  />
                </div>

                <Button variant="contained" sx={{ maxWidth: 140, my: 3 }}>
                  Update Profile
                </Button>
              </div>
            </div>
          ) : (
            <Box className="flex flex-col gap-4 max-w-md mx-auto p-4">
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Change Password
              </Typography>

              {passwordError && <Alert severity="error">{passwordError}</Alert>}

              <TextField
                label="Current Password"
                type={showPassword.current ? "text" : "password"}
                name="currentPassword"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                fullWidth
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => handleClickShowPassword("current")}
                        edge="end"
                      >
                        {showPassword.current ? (
                          <VisibilityOff />
                        ) : (
                          <Visibility />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                label="New Password"
                type={showPassword.new ? "text" : "password"}
                name="newPassword"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                fullWidth
                variant="outlined"
                helperText="Use at least 8 characters, including uppercase, number & symbol"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => handleClickShowPassword("new")}
                        edge="end"
                      >
                        {showPassword.new ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              {/* Password Strength Meter */}
              {passwordData.newPassword && (
                <Box sx={{ width: "100%" }}>
                  <LinearProgress
                    variant="determinate"
                    value={passwordStrength}
                    sx={{
                      height: 8,
                      borderRadius: 2,
                      backgroundColor: "#e0e0e0",
                      "& .MuiLinearProgress-bar": {
                        backgroundColor:
                          passwordStrength < 50
                            ? "#f44336"
                            : passwordStrength < 75
                            ? "#ff9800"
                            : "#4caf50",
                      },
                    }}
                  />
                  <Typography variant="caption" color="text.secondary">
                    Password Strength:{" "}
                    {passwordStrength < 50
                      ? "Weak"
                      : passwordStrength < 75
                      ? "Medium"
                      : "Strong"}
                  </Typography>
                </Box>
              )}

              <TextField
                label="Confirm New Password"
                type={showPassword.confirm ? "text" : "password"}
                name="confirmPassword"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                fullWidth
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => handleClickShowPassword("confirm")}
                        edge="end"
                      >
                        {showPassword.confirm ? (
                          <VisibilityOff />
                        ) : (
                          <Visibility />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <Button
                variant="contained"
                onClick={handlePasswordSubmit}
                sx={{ mt: 2 }}
              >
                Update Password
              </Button>
            </Box>
          )}
        </div>
      </div>
    </div>
  );
};

export default StaffProfile;
