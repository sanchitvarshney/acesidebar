import { useState, useEffect } from "react";

import {
  Box,
  Button,
  IconButton,
  Typography,
  TextField,
  Chip,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  LinearProgress,
  CircularProgress,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Divider,
  InputAdornment,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import RefreshIcon from "@mui/icons-material/Refresh";
import EmailIcon from "@mui/icons-material/Email";
import BlockIcon from "@mui/icons-material/Block";
import NotesIcon from "@mui/icons-material/Notes";
import { useLocation, useNavigate } from "react-router-dom";

const AddNewBanlist = () => {
  const navigate = useNavigate();
  const editData = useLocation().state;
  const [formData, setFormData] = useState<any>({
    banStatus: "active",
    emailAddress: "",
    internalNotes: "",
  });

  const [errors, setErrors] = useState<any>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

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

    // Validate email
    if (!formData.emailAddress.trim()) {
      newErrors.emailAddress = "Email address is required";
    } else if (!validateEmail(formData.emailAddress)) {
      newErrors.emailAddress = "Valid email address is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Clear errors if validation passes
    setErrors({});
    setIsSubmitting(true);

    try {
      // Simulate API call or actual submission logic
      console.log("Submitting banlist data:", formData);

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Show success message and reset form
      alert("Email address added to ban list successfully!");
      handleReset();
    } catch (error) {
      console.error("Error submitting banlist:", error);
      alert("Failed to add email to ban list. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData({
      banStatus: "active",
      emailAddress: "",
      internalNotes: "",
    });
    setErrors({});
    setIsSubmitting(false);

    console.log("Form has been reset");
  };

  const handleCancel = () => {
    // Navigate back to banlist page
    navigate("/settings/emails/banlist");
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
            mb: 1,
            borderBottom: "1px solid #e0e0e0",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, p: 2 }}>
            <IconButton onClick={() => navigate("/settings/emails/banlist")}>
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h5" sx={{ fontWeight: 600, color: "#1a1a1a" }}>
              Add New Email Address to Ban List
            </Typography>
          </Box>
        </Box>
        <div className=" w-full  h-[calc(100vh-294px)] overflow-auto">
          <Box sx={{ py: 1, px: 10 }}>
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
            <Box sx={{ mb: 4 }}>
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
                <EmailIcon sx={{ fontSize: 20, color: "#6b7280" }} />
                Email Address
                <Typography
                  component="span"
                  sx={{ color: "error.main", ml: 0.5 }}
                >
                  *
                </Typography>
              </Typography>
              <TextField
                fullWidth
                placeholder="Enter email address to ban"
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
                      borderColor: "#3b82f6",
                    },
                  },
                }}
              />
            </Box>

            {/* Internal Notes Section */}
            <Box sx={{ mb: 4 }}>
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
                <NotesIcon sx={{ fontSize: 20, color: "#6b7280" }} />
                Internal Notes
                <Typography variant="caption" sx={{ color: "#6b7280", ml: 1 }}>
                  (Admin Notes)
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
                      borderColor: "#3b82f6",
                    },
                  },
                }}
              />
            </Box>
          </Box>
        </div>
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
                Add New Banned Email Address
              </Typography>
              <Typography
                variant="body2"
                sx={{ lineHeight: 1.6, color: "#65676b", mb: 2 }}
              >
                Use this section to manually add a new email address to the
                banned list. Once added, the email will be blocked from
                registering or accessing your services.
              </Typography>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Box>
  );
};

export default AddNewBanlist;
