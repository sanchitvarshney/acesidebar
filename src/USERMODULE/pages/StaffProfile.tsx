import {
  Avatar,
  Box,
  Button,
  Paper,
  Typography,
  Divider,
  TextField,
  FormControl,
  Select,
  MenuItem,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import {
  Edit as EditIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  CheckCircle as CheckCircleIcon,
  Google as GoogleIcon,
  Shield as ShieldIcon,
} from "@mui/icons-material";
import { timeZoneData, primarylanguageData } from "../../data/setting";

const StaffProfile = () => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: "Shiv Kumar",
    lastName: "Singh",
    displayName: "Ajaxter.",
    email: "postmanreply@gmail.com",
    gender: "Male",
    country: "India",
    state: "Uttar Pradesh",
    language: "English",
    timezone: "(UTC+05:30) India Standard Time",
    avatar: "",
  });

  const [emails, setEmails] = useState([
    {
      id: 1,
      email: "postmanreply@gmail.com",
      addedDate: "4 months ago",
      isPrimary: true,
      provider: "google",
    }
  ]);

  const [mobileNumbers, setMobileNumbers] = useState([
    {
      id: 1,
      number: "+91 96616 97474",
      addedDate: "4 months ago",
      isPrimary: true,
      verified: true,
    },
  ]);

  useEffect(() => {
    // Fetch staff profile data here
    const data: any = localStorage.getItem("userData");
    if (data) {
      const parseData = JSON.parse(data);
      const fullName = parseData?.name || "Shiv Kumar Singh";
      const nameParts = fullName.split(" ");
      const firstName = nameParts.slice(0, -1).join(" ") || "Shiv Kumar";
      const lastName = nameParts[nameParts.length - 1] || "Singh";
      
      setProfileData({
        firstName: firstName,
        lastName: lastName,
        displayName: parseData?.username || profileData.displayName,
        email: parseData?.email || profileData.email,
        gender: parseData?.gender || profileData.gender,
        country: parseData?.country || profileData.country,
        state: parseData?.state || profileData.state,
        language: parseData?.language || profileData.language,
        timezone: parseData?.timezone || profileData.timezone,
        avatar: parseData?.avatar || "",
      });
    }
  }, []);

  const handleEdit = () => {
    setIsEditMode(true);
  };

  const handleCancel = () => {
    setIsEditMode(false);
    // Reset to original values if needed
  };

  const handleSave = () => {
    // Save logic here
    console.log("Saving profile data:", profileData);
    setIsEditMode(false);
    // Add API call to save data
  };

  const handleInputChange = (field: string, value: string) => {
    setProfileData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const getFullName = () => {
    return `${profileData.firstName} ${profileData.lastName}`;
  };

  const getEmailIconColor = (index: number) => {
    const colors = ["#ec4899", "#f97316"]; // pink, orange
    return colors[index % colors.length];
  };

  const getPhoneIconColor = () => {
    return "#f97316"; // orange
  };

  const getCountryFlag = (country: string) => {
    // Simple flag emoji mapping - you can enhance this
    const flags: { [key: string]: string } = {
      India: "🇮🇳",
      "United States": "🇺🇸",
      "United Kingdom": "🇬🇧",
    };
    return flags[country] || "🏳️";
  };

  return (
    <Box
      sx={{
        width: "75%",
        minHeight: "calc(100vh - 96px)",
        padding: 3,
        overflow: "auto",
        margin: "0 auto",
      }}
    >
      {/* User Profile Details Section */}
      <Paper
        elevation={0}
        sx={{
          backgroundColor: "#fff",
          border: "1px solid #e5e7eb",
          borderRadius: 2,
          padding: 3,
          marginBottom: 3,
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
        }}
      >
        {/* Header with Avatar, Name, Email, and Edit Button */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            marginBottom: 3,
          }}
        >
          <Avatar
            sx={{
              width: 64,
              height: 64,
              backgroundColor: "#e5e7eb",
              color: "#6b7280",
            }}
            src={profileData.avatar}
          >
            {profileData.firstName?.[0]?.toUpperCase() || "U"}
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 600,
                color: "#111827",
                marginBottom: 0.5,
              }}
            >
              {getFullName()}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: "#6b7280",
              }}
            >
              {profileData.email}
            </Typography>
          </Box>
          {!isEditMode && (
            <Button
              variant="contained"
              startIcon={<EditIcon />}
              onClick={handleEdit}
              sx={{
                backgroundColor: "#14b8a6",
                color: "#fff",
                "&:hover": {
                  backgroundColor: "#0d9488",
                },
                textTransform: "none",
                paddingX: 2,
                paddingY: 1,
              }}
            >
              Edit
            </Button>
          )}
        </Box>

        <Divider sx={{ marginY: 3 }} />

        {/* Profile Information Grid */}
        {isEditMode ? (
          <>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                gap: 3,
              }}
            >
              {/* Left Column */}
              <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                <Box>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#9ca3af",
                      marginBottom: 0.5,
                      fontSize: "0.75rem",
                    }}
                  >
                    First Name <span style={{ color: "#ef4444" }}>*</span>
                  </Typography>
                  <TextField
                    fullWidth
                    size="small"
                    value={profileData.firstName}
                    onChange={(e) =>
                      handleInputChange("firstName", e.target.value)
                    }
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        "&.Mui-focused fieldset": {
                          borderColor: "#22c55e",
                        },
                      },
                    }}
                  />
                </Box>

                <Box>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#9ca3af",
                      marginBottom: 0.5,
                      fontSize: "0.75rem",
                    }}
                  >
                    Display Name
                  </Typography>
                  <TextField
                    fullWidth
                    size="small"
                    value={profileData.displayName}
                    onChange={(e) =>
                      handleInputChange("displayName", e.target.value)
                    }
                  />
                </Box>

                <Box>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#9ca3af",
                      marginBottom: 0.5,
                      fontSize: "0.75rem",
                    }}
                  >
                    Country/Region
                  </Typography>
                  <FormControl fullWidth size="small">
                    <Select
                      value={profileData.country}
                      onChange={(e) =>
                        handleInputChange("country", e.target.value)
                      }
                      renderValue={(value) => {
                        return (
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <span style={{ fontSize: "1.25rem" }}>
                              {getCountryFlag(value)}
                            </span>
                            <span>{value}</span>
                          </Box>
                        );
                      }}
                      sx={{
                        "& .MuiSelect-select": {
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                        },
                      }}
                    >
                      <MenuItem value="India">
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <span style={{ fontSize: "1.25rem" }}>🇮🇳</span>
                          <span>India</span>
                        </Box>
                      </MenuItem>
                      <MenuItem value="United States">
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <span style={{ fontSize: "1.25rem" }}>🇺🇸</span>
                          <span>United States</span>
                        </Box>
                      </MenuItem>
                      <MenuItem value="United Kingdom">
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <span style={{ fontSize: "1.25rem" }}>🇬🇧</span>
                          <span>United Kingdom</span>
                        </Box>
                      </MenuItem>
                    </Select>
                  </FormControl>
                </Box>

                <Box>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#9ca3af",
                      marginBottom: 0.5,
                      fontSize: "0.75rem",
                    }}
                  >
                    Language
                  </Typography>
                  <FormControl fullWidth size="small">
                    <Select
                      value={profileData.language}
                      onChange={(e) =>
                        handleInputChange("language", e.target.value)
                      }
                    >
                      {primarylanguageData.map((lang) => (
                        <MenuItem key={lang.value} value={lang.label}>
                          {lang.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
              </Box>

              {/* Right Column */}
              <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                <Box>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#9ca3af",
                      marginBottom: 0.5,
                      fontSize: "0.75rem",
                    }}
                  >
                    Last Name
                  </Typography>
                  <TextField
                    fullWidth
                    size="small"
                    value={profileData.lastName}
                    onChange={(e) =>
                      handleInputChange("lastName", e.target.value)
                    }
                  />
                </Box>

                <Box>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#9ca3af",
                      marginBottom: 0.5,
                      fontSize: "0.75rem",
                    }}
                  >
                    Gender
                  </Typography>
                  <FormControl fullWidth size="small">
                    <Select
                      value={profileData.gender}
                      onChange={(e) =>
                        handleInputChange("gender", e.target.value)
                      }
                    >
                      <MenuItem value="Male">Male</MenuItem>
                      <MenuItem value="Female">Female</MenuItem>
                      <MenuItem value="Other">Other</MenuItem>
                    </Select>
                  </FormControl>
                </Box>

                <Box>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#9ca3af",
                      marginBottom: 0.5,
                      fontSize: "0.75rem",
                    }}
                  >
                    State
                  </Typography>
                  <FormControl fullWidth size="small">
                    <Select
                      value={profileData.state}
                      onChange={(e) =>
                        handleInputChange("state", e.target.value)
                      }
                    >
                      <MenuItem value="Uttar Pradesh">Uttar Pradesh</MenuItem>
                      <MenuItem value="Maharashtra">Maharashtra</MenuItem>
                      <MenuItem value="Delhi">Delhi</MenuItem>
                      <MenuItem value="Karnataka">Karnataka</MenuItem>
                      <MenuItem value="Tamil Nadu">Tamil Nadu</MenuItem>
                    </Select>
                  </FormControl>
                </Box>

                <Box>
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#9ca3af",
                      marginBottom: 0.5,
                      fontSize: "0.75rem",
                    }}
                  >
                    Time zone
                  </Typography>
                  <FormControl fullWidth size="small">
                    <Select
                      value={profileData.timezone}
                      onChange={(e) =>
                        handleInputChange("timezone", e.target.value)
                      }
                    >
                      {timeZoneData.map((tz) => (
                        <MenuItem key={tz.value} value={tz.label}>
                          {tz.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
              </Box>
            </Box>

            {/* Action Buttons */}
            <Box sx={{ display: "flex", gap: 2, marginTop: 4 }}>
              <Button
                variant="contained"
                onClick={handleSave}
                sx={{
                  backgroundColor: "#86efac",
                  color: "#000",
                  textTransform: "none",
                  "&:hover": {
                    backgroundColor: "#6ee7b7",
                  },
                  paddingX: 3,
                  paddingY: 1,
                }}
              >
                Save
              </Button>
              <Button
                variant="outlined"
                onClick={handleCancel}
                sx={{
                  backgroundColor: "#f3f4f6",
                  color: "#111827",
                  borderColor: "#e5e7eb",
                  textTransform: "none",
                  "&:hover": {
                    backgroundColor: "#e5e7eb",
                    borderColor: "#d1d5db",
                  },
                  paddingX: 3,
                  paddingY: 1,
                }}
              >
                Cancel
              </Button>
            </Box>
          </>
        ) : (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              gap: 3,
            }}
          >
            {/* Left Column */}
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              <Box>
                <Typography
                  variant="body2"
                  sx={{
                    color: "#9ca3af",
                    marginBottom: 0.5,
                    fontSize: "0.75rem",
                  }}
                >
                  Full Name
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    color: "#111827",
                    fontWeight: 400,
                  }}
                >
                  {getFullName()}
                </Typography>
              </Box>

              <Box>
                <Typography
                  variant="body2"
                  sx={{
                    color: "#9ca3af",
                    marginBottom: 0.5,
                    fontSize: "0.75rem",
                  }}
                >
                  Gender
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    color: "#111827",
                    fontWeight: 400,
                  }}
                >
                  {profileData.gender}
                </Typography>
              </Box>

              <Box>
                <Typography
                  variant="body2"
                  sx={{
                    color: "#9ca3af",
                    marginBottom: 0.5,
                    fontSize: "0.75rem",
                  }}
                >
                  State
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    color: "#111827",
                    fontWeight: 400,
                  }}
                >
                  {profileData.state}
                </Typography>
              </Box>

              <Box>
                <Typography
                  variant="body2"
                  sx={{
                    color: "#9ca3af",
                    marginBottom: 0.5,
                    fontSize: "0.75rem",
                  }}
                >
                  Time zone
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    color: "#111827",
                    fontWeight: 400,
                  }}
                >
                  {profileData.timezone}
                </Typography>
              </Box>
            </Box>

            {/* Right Column */}
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              <Box>
                <Typography
                  variant="body2"
                  sx={{
                    color: "#9ca3af",
                    marginBottom: 0.5,
                    fontSize: "0.75rem",
                  }}
                >
                  Display Name
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    color: "#111827",
                    fontWeight: 400,
                  }}
                >
                  {profileData.displayName}
                </Typography>
              </Box>

              <Box>
                <Typography
                  variant="body2"
                  sx={{
                    color: "#9ca3af",
                    marginBottom: 0.5,
                    fontSize: "0.75rem",
                  }}
                >
                  Country/Region
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Typography
                    sx={{
                      fontSize: "1.25rem",
                    }}
                  >
                    {getCountryFlag(profileData.country)}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      color: "#111827",
                      fontWeight: 400,
                    }}
                  >
                    {profileData.country}
                  </Typography>
                </Box>
              </Box>

              <Box>
                <Typography
                  variant="body2"
                  sx={{
                    color: "#9ca3af",
                    marginBottom: 0.5,
                    fontSize: "0.75rem",
                  }}
                >
                  Language
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    color: "#111827",
                    fontWeight: 400,
                  }}
                >
                  {profileData.language}
                </Typography>
              </Box>
            </Box>
          </Box>
        )}
      </Paper>

      {/* My Email Addresses Section */}
      <Paper
        elevation={0}
        sx={{
          backgroundColor: "#fff",
          border: "1px solid #e5e7eb",
          borderRadius: 2,
          padding: 3,
          marginBottom: 3,
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            color: "#111827",
            marginBottom: 1,
          }}
        >
          My Email Addresses
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: "#6b7280",
            marginBottom: 3,
          }}
        >
          View and manage the email addresses associated with your account. They
          can be used to sign in and to reset password if you ever forget it.
        </Typography>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {emails.map((emailItem, index) => (
            <Box
              key={emailItem.id}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                padding: 2,
                borderRadius: 1,
                "&:hover": {
                  backgroundColor: "#f9fafb",
                },
              }}
            >
              <Avatar
                sx={{
                  width: 40,
                  height: 40,
                  backgroundColor: getEmailIconColor(index),
                  color: "#fff",
                }}
              >
                <EmailIcon fontSize="small" />
              </Avatar>
              <Box sx={{ flex: 1 }}>
                <Typography
                  variant="body1"
                  sx={{
                    color: "#111827",
                    fontWeight: 400,
                  }}
                >
                  {emailItem.email}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    color: "#9ca3af",
                  }}
                >
                  {emailItem.addedDate}
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                {emailItem.isPrimary && (
                  <Avatar
                    sx={{
                      width: 24,
                      height: 24,
                      backgroundColor: "#86efac",
                      color: "#fff",
                    }}
                  >
                    <CheckCircleIcon
                      sx={{ fontSize: 14 }}
                      fontSize="small"
                    />
                  </Avatar>
                )}
                {emailItem.provider === "google" && (
                  <Avatar
                    sx={{
                      width: 24,
                      height: 24,
                      backgroundColor: "#fff",
                      border: "1px solid #e5e7eb",
                      color: "#4285f4",
                    }}
                  >
                    <GoogleIcon sx={{ fontSize: 14 }} />
                  </Avatar>
                )}
              </Box>
            </Box>
          ))}
        </Box>
      </Paper>

      {/* My Mobile Numbers Section */}
      <Paper
        elevation={0}
        sx={{
          backgroundColor: "#fff",
          border: "1px solid #e5e7eb",
          borderRadius: 2,
          padding: 3,
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            color: "#111827",
            marginBottom: 1,
          }}
        >
          My Mobile Numbers
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: "#6b7280",
            marginBottom: 3,
          }}
        >
          View and manage all of the mobile numbers associated with your
          account.
        </Typography>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {mobileNumbers.map((mobileItem) => (
            <Box
              key={mobileItem.id}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                padding: 2,
                borderRadius: 1,
                "&:hover": {
                  backgroundColor: "#f9fafb",
                },
              }}
            >
              <Avatar
                sx={{
                  width: 40,
                  height: 40,
                  backgroundColor: getPhoneIconColor(),
                  color: "#fff",
                }}
              >
                <PhoneIcon fontSize="small" />
              </Avatar>
              <Box sx={{ flex: 1 }}>
                <Typography
                  variant="body1"
                  sx={{
                    color: "#111827",
                    fontWeight: 400,
                  }}
                >
                  {mobileItem.number}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    color: "#9ca3af",
                  }}
                >
                  {mobileItem.addedDate}
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                {mobileItem.isPrimary && (
                  <Avatar
                    sx={{
                      width: 24,
                      height: 24,
                      backgroundColor: "#86efac",
                      color: "#fff",
                    }}
                  >
                    <CheckCircleIcon
                      sx={{ fontSize: 14 }}
                      fontSize="small"
                    />
                  </Avatar>
                )}
                {mobileItem.verified && (
                  <Avatar
                    sx={{
                      width: 24,
                      height: 24,
                      backgroundColor: "#fff",
                      border: "1px solid #f97316",
                      color: "#f97316",
                    }}
                  >
                    <ShieldIcon sx={{ fontSize: 14 }} />
                  </Avatar>
                )}
              </Box>
            </Box>
          ))}
        </Box>
      </Paper>
    </Box>
  );
};

export default StaffProfile;
