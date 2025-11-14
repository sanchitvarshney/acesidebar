import { useState, useEffect } from "react";

import {
  Box,
  Button,
  IconButton,
  Typography,
  TextField,
  Card,
  CardContent,
  CircularProgress,
  Tab,
  Select,
  MenuItem,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useLocation, useNavigate } from "react-router-dom";
import { useAddBanEmailMutation } from "../../../services/settingServices";
import { useToast } from "../../../hooks/useToast";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { stat } from "fs";

const AddHelpTopic = () => {
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [value, setValue] = useState("1");

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };
  const editData = useLocation().state;
  const [formData, setFormData] = useState<any>({
    topic: "",
    status: "active",
    type: "pb",
    parentTopic: "",
    internalNotes: "",
  });

  const [errors, setErrors] = useState<any>({});
  const [addBanEmail, { isLoading: isSubmitting }] = useAddBanEmailMutation();

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleInputChange = (field: keyof any, value: string) => {
    setFormData((prev: any) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev: any) => ({
        ...prev,
        [field]: undefined,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: any = {};
    if (!formData.emailAddress.trim()) {
      newErrors.emailAddress = "Email address is required";
    } else if (!validateEmail(formData.emailAddress)) {
      newErrors.emailAddress = "Valid email address is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});

    try {
      const payload = {
        email: formData.emailAddress,
        notes: formData.internalNotes,
      };
      const res = await addBanEmail(payload).unwrap();
      if (res?.type === "error") {
        showToast(res?.message, "error");
        return;
      }
      if (res?.type === "success") {
        showToast(res?.message, "success");
        handleReset();
      }
    } catch (error: any) {
      return;
    }
  };

  const handleReset = () => {
    setFormData({
      topic: "",
      status: "",
      type: "",
      parentTopic: "",
      internalNotes: "",
    });
    setErrors({});
  };

  const handleCancel = () => {
    // Navigate back to banlist page
    navigate("/settings/help-support/help-topics");
  };

  useEffect(() => {
    if (!editData) return;
    setFormData({
      emailAddress: editData.email,
      internalNotes: editData.internalNotes,
    });
  }, [editData]);

  return (
    <Box
      sx={{
        height: "calc(100vh - 100px)",
        display: "grid",
        gridTemplateColumns: "3fr 1fr",
        overflow: "hidden",
      }}
    >
      {/* Left Content */}
      <Box sx={{ p: 0, display: "flex", flexDirection: "column", gap: 2 }}>
        {/* Header Section */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: "1px solid #e0e0e0",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, p: 2 }}>
            <IconButton
              onClick={() => navigate("/settings/help-support/help-topics")}
            >
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h5" sx={{ fontWeight: 600, color: "#1a1a1a" }}>
              Add New Help Topic
            </Typography>
          </Box>
        </Box>
        <TabContext value={value}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <TabList onChange={handleChange} aria-label="lab API tabs example">
              <Tab label="Help Topic Info" value="1" />
              <Tab label="New Ticket Option" value="2" />
              <Tab label="Forms" value="3" />
            </TabList>
          </Box>
          <div className=" w-full  h-[calc(100vh-358px)] overflow-auto custom-scrollbar">
            <TabPanel value="1" sx={{ p: 0 }}>
              {" "}
              <Box sx={{ px: 10 }}>
                {/* Error Message */}
                {errors.emailAddress && (
                  <Typography
                    variant="body2"
                    sx={{
                      color: "error.main",
                      fontStyle: "italic",
                      mb: 2,
                    }}
                  >
                    {errors.emailAddress}
                  </Typography>
                )}

                {/* Email Address Section */}
                <Box sx={{ mb: 2 }}>
                  <Typography
                    variant="subtitle2"
                    sx={{
                      fontWeight: 600,
                      color: "#374151",
                      mb: 1,
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    Topic
                    <Typography
                      component="span"
                      sx={{ color: "error.main", ml: 0.5 }}
                    >
                      *
                    </Typography>
                  </Typography>
                  <TextField
                    fullWidth
                    value={formData.emailAddress}
                    onChange={(e) =>
                      handleInputChange("emailAddress", e.target.value)
                    }
                    variant="outlined"
                    size="small"
                    required
                    error={!!errors.emailAddress}
                    helperText={errors.emailAddress}
                    sx={{
                      maxWidth: "50%",
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": {
                          borderColor: "#d1d5db",
                        },
                        "&:hover fieldset": {
                          borderColor: "#9ca3af",
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: "#2566b0",
                        },
                      },
                    }}
                  />
                </Box>
                <div className="grid grid-cols-3 gap-8 mb-4">
                  <Box sx={{}}>
                    <Typography
                      variant="subtitle2"
                      sx={{
                        fontWeight: 600,
                        color: "#374151",
                        mb: 1,
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                      }}
                    >
                      Status
                      <Typography
                        component="span"
                        sx={{ color: "error.main", ml: 0.5 }}
                      >
                        *
                      </Typography>
                    </Typography>
                    <Select
                      id="demo-simple-select"
                      value={formData.status}
                      onChange={() => {}}
                      size="small"
                      fullWidth
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          "& fieldset": {
                            borderColor: "#d1d5db",
                          },
                          "&:hover fieldset": {
                            borderColor: "#9ca3af",
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: "#2566b0",
                          },
                        },
                      }}
                    >
                      <MenuItem value={"active"}>Active</MenuItem>
                      <MenuItem value={"disabled"}>Disabled</MenuItem>
                      <MenuItem value={"archived"}>Archived</MenuItem>
                    </Select>
                  </Box>
                  <Box sx={{}}>
                    <Typography
                      variant="subtitle2"
                      sx={{
                        fontWeight: 600,
                        color: "#374151",
                        mb: 1,
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                      }}
                    >
                      Type
                      <Typography
                        component="span"
                        sx={{ color: "error.main", ml: 0.5 }}
                      >
                        *
                      </Typography>
                    </Typography>
                    <Select
                      id="type-simple-select"
                      value={formData.type}
                      onChange={() => {}}
                      size="small"
                      fullWidth
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          "& fieldset": {
                            borderColor: "#d1d5db",
                          },
                          "&:hover fieldset": {
                            borderColor: "#9ca3af",
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: "#2566b0",
                          },
                        },
                      }}
                    >
                      <MenuItem value={"pb"}>Public</MenuItem>
                      <MenuItem value={"pvt"}>Private</MenuItem>
                    </Select>
                  </Box>
                </div>

                <Box sx={{}}>
                  <Typography
                    variant="subtitle2"
                    sx={{
                      fontWeight: 600,
                      color: "#374151",
                      mb: 1,
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    Parent Topic
                    <Typography
                      component="span"
                      sx={{ color: "error.main", ml: 0.5 }}
                    >
                      *
                    </Typography>
                  </Typography>
                  <Select
                    id="parent-simple-select"
                    value={formData.parentTopic}
                    onChange={() => {}}
                    size="small"
                    sx={{
                      width: "50%",
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": {
                          borderColor: "#d1d5db",
                        },
                        "&:hover fieldset": {
                          borderColor: "#9ca3af",
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: "#2566b0",
                        },
                      },
                    }}
                  >
                    <MenuItem value={"1"}>one</MenuItem>
                    <MenuItem value={"2"}>two</MenuItem>
                    <MenuItem value={"3"}>three</MenuItem>
                  </Select>
                </Box>

                {/* Internal Notes Section */}
                <Box sx={{ mt: 2 }}>
                  <Typography
                    variant="subtitle2"
                    sx={{
                      fontWeight: 600,
                      color: "#374151",
                      mb: 1,
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    Internal Notes
                    <Typography
                      variant="caption"
                      sx={{ color: "#6b7280", ml: 1 }}
                    >
                      (Be liberal, they're internal)
                    </Typography>
                  </Typography>
                  <TextField
                    fullWidth
                    placeholder="Add internal notes about this ban..."
                    value={formData.internalNotes}
                    onChange={(e) =>
                      handleInputChange("internalNotes", e.target.value)
                    }
                    variant="outlined"
                    multiline
                    rows={8}
                    size="small"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": {
                          borderColor: "#d1d5db",
                        },
                        "&:hover fieldset": {
                          borderColor: "#9ca3af",
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: "#2566b0",
                        },
                      },
                    }}
                  />
                </Box>
              </Box>
            </TabPanel>
            <TabPanel value="2">Item Two</TabPanel>
            <TabPanel value="3">Item Three</TabPanel>
          </div>
        </TabContext>
        {/* Action Buttons */}
        <Box
          sx={{
            borderTop: "1px solid #e0e0e0",
            p: 3,
            backgroundColor: "#fafafa",
            flexShrink: 0,
          }}
        >
          <Box sx={{ display: "flex", gap: 2, justifyContent: "center" }}>
            <Button
              variant="text"
              onClick={handleCancel}
              disabled={isSubmitting}
              sx={{ fontWeight: 600, width: "100px" }}
            >
              Cancel
            </Button>

            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={isSubmitting}
              sx={{ width: "100px" }}
            >
              {isSubmitting ? (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <CircularProgress size={16} />
                  Adding...
                </Box>
              ) : (
                "Add"
              )}
            </Button>
          </Box>
        </Box>
      </Box>

      {/* Right Sidebar */}
      <Box
        sx={{
          maxHeight: "calc(100vh - 100px)",
          overflowY: "auto",
          p: 3,
          bgcolor: "#f8f9fa",
          borderLeft: "1px solid #e0e0e0",
        }}
      >
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <Card sx={{ boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
            <CardContent>
              <Typography
                variant="h6"
                sx={{ fontWeight: 600, mb: 2, color: "#1a1a1a" }}
              >
                Add New Help Topic
              </Typography>
              <Typography
                variant="body2"
                sx={{ lineHeight: 1.6, color: "#65676b", mb: 2 }}
              >
                Use this section to manually add a new help topic to the system.
                Each topic provides guidance, best practices, or explanations
                for users and administrators to understand specific features or
                processes.
              </Typography>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Box>
  );
};

export default AddHelpTopic;
