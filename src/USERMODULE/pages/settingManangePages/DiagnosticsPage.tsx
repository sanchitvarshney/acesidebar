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
import SendIcon from "@mui/icons-material/Send";
import SubjectIcon from "@mui/icons-material/Subject";
import PersonIcon from "@mui/icons-material/Person";
import { useNavigate } from "react-router-dom";
import StackEditor from "../../../components/reusable/Editor";
import SingleValueAsynAutocomplete from "../../../components/reusable/SingleValueAsynAutocomplete";
import { useLazyGetAgentsBySeachQuery } from "../../../services/agentServices";

const DiagnosticsPage = () => {
  const navigate = useNavigate();
  const [triggerSeachAgent, { isLoading: seachAgentLoading }] =
    useLazyGetAgentsBySeachQuery();

  const [formData, setFormData] = useState<any>({
    fromEmail: "",
    toEmail: "",
    subject: "test email",
    message: "",
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

    // Validate from email
    if (!formData.fromEmail.trim()) {
      newErrors.fromEmail = "From email is required";
    } else if (!validateEmail(formData.fromEmail)) {
      newErrors.fromEmail = "Valid from email address is required";
    }

    // Validate to email
    if (!formData.toEmail.trim()) {
      newErrors.toEmail = "To email is required";
    } else if (!validateEmail(formData.toEmail)) {
      newErrors.toEmail = "Valid to email address is required";
    }

    // Validate subject
    if (!formData.subject.trim()) {
      newErrors.subject = "Subject is required";
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
      console.log("Sending test email:", formData);

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Show success message and reset form
      alert("Test email sent successfully!");
      handleReset();
    } catch (error) {
      console.error("Error sending test email:", error);
      alert("Failed to send test email. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData({
      fromEmail: "",
      toEmail: "",
      subject: "osTicket test email",
      message: "",
    });
    setErrors({});
    setIsSubmitting(false);

    console.log("Form has been reset");
  };

  const handleCancel = () => {
    // Navigate back to settings page
    navigate("/settings");
  };

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

            p: 2,
            borderBottom: "1px solid #e0e0e0",
            backgroundColor: "#fafafa",
            mb: 1,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, }}>
            <IconButton onClick={() => navigate("/settings/emails")}>
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h5" sx={{ fontWeight: 600, color: "#1a1a1a" }}>
              Test Outgoing Email
            </Typography>
          </Box>
        </Box>

        <div className=" w-full  h-[calc(100vh-294px)] overflow-y-auto custom-scrollbar">
          <Box
            sx={{
              px: 10,
              py: 2,
            }}
          >
            {/* Error Messages */}
            {(errors.fromEmail || errors.toEmail || errors.subject) && (
              <Box sx={{ mb: 2 }}>
                {errors.fromEmail && (
                  <Typography
                    variant="body2"
                    sx={{
                      color: "error.main",
                      fontStyle: "italic",
                      mb: 1,
                    }}
                  >
                    {errors.fromEmail}
                  </Typography>
                )}
                {errors.toEmail && (
                  <Typography
                    variant="body2"
                    sx={{
                      color: "error.main",
                      fontStyle: "italic",
                      mb: 1,
                    }}
                  >
                    {errors.toEmail}
                  </Typography>
                )}
                {errors.subject && (
                  <Typography
                    variant="body2"
                    sx={{
                      color: "error.main",
                      fontStyle: "italic",
                      mb: 1,
                    }}
                  >
                    {errors.subject}
                  </Typography>
                )}
              </Box>
            )}

            <form onSubmit={handleSubmit}>
              {/* From Email Section */}
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
                  <PersonIcon sx={{ fontSize: 20, color: "#6b7280" }} />
                  From
                  <Typography
                    component="span"
                    sx={{ color: "error.main", ml: 0.5 }}
                  >
                    *
                  </Typography>
                </Typography>
                <FormControl fullWidth variant="outlined" size="small">
                  <Select
                    value={formData.fromEmail}
                    onChange={(e) =>
                      handleInputChange("fromEmail", e.target.value)
                    }
                    required
                    displayEmpty
                    sx={{
                      width: "40%",
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
                  >
                    <MenuItem value="" disabled>
                      — Select FROM Email —
                    </MenuItem>
                    <MenuItem value="admin@example.com">
                      admin@example.com
                    </MenuItem>
                    <MenuItem value="support@example.com">
                      support@example.com
                    </MenuItem>
                    <MenuItem value="noreply@example.com">
                      noreply@example.com
                    </MenuItem>
                  </Select>
                </FormControl>
              </Box>

              {/* To Email Section */}
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
                  <EmailIcon sx={{ fontSize: 20, color: "#6b7280" }} />
                  To
                  <Typography
                    component="span"
                    sx={{ color: "error.main", ml: 0.5 }}
                  >
                    *
                  </Typography>
                </Typography>

                <SingleValueAsynAutocomplete
                  qtkMethod={triggerSeachAgent}
                  value={formData.toEmail}
                  onChange={(e: any) =>
                    handleInputChange("toEmail", e.target.value)
                  }
                  placeholder="Search Email"
                  renderOptionExtra={(user: any) => (
                    <Typography variant="body2" color="text.secondary">
                      {user.email}
                    </Typography>
                  )}
                  icon={
                    <EmailIcon
                      sx={{
                        color: "#9ca3af",
                        mr: 1,
                        fontSize: 20,
                      }}
                    />
                  }
                  isFallback={true}
                  loading={seachAgentLoading}
                  width={"60%"}
                />
              </Box>

              {/* Subject Section */}
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
                  <SubjectIcon sx={{ fontSize: 20, color: "#6b7280" }} />
                  Subject
                  <Typography
                    component="span"
                    sx={{ color: "error.main", ml: 0.5 }}
                  >
                    *
                  </Typography>
                </Typography>
                <TextField
                  fullWidth
                  placeholder="Enter email subject"
                  value={formData.subject}
                  onChange={(e) => handleInputChange("subject", e.target.value)}
                  variant="outlined"
                  size="small"
                  required
                  error={!!errors.subject}
                  helperText={errors.subject}
                  InputProps={{
                    startAdornment: (
                      <SubjectIcon
                        sx={{
                          color: "#9ca3af",
                          mr: 1,
                          fontSize: 20,
                        }}
                      />
                    ),
                  }}
                  sx={{
                    width: "80%",
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

              {/* Message Section */}
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
                  <SendIcon sx={{ fontSize: 20, color: "#6b7280" }} />
                  Message
                  <Typography
                    variant="caption"
                    sx={{ color: "#6b7280", ml: 1 }}
                  >
                    (email message to send)
                  </Typography>
                </Typography>
                <Box sx={{}}>
                  <StackEditor
                    onChange={(content: string) => {
                      handleInputChange("message", content);
                    }}
                    onFocus={undefined}
                    initialContent={formData.message}
                    isFull={false}
                    customHeight="200px"
                    removeIcon={true}
                  />
                </Box>
              </Box>
            </form>
          </Box>
        </div>

        {/* Fixed Bottom Section with Buttons */}
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
              sx={{ fontWeight: 600 }}
            >
              Cancel
            </Button>

            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={isSubmitting}
              sx={{ fontWeight: 600 }}
            >
              {isSubmitting ? "Sending..." : "Send Message"}
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
                Email Diagnostics
              </Typography>
              <Typography
                variant="body2"
                sx={{ lineHeight: 1.6, color: "#65676b", mb: 2 }}
              >
                Use this form to test your outgoing email configuration. This
                will help verify that your SMTP settings are working correctly
                and emails can be sent successfully.
              </Typography>

              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                  What this tests:
                </Typography>
                <Box component="ul" sx={{ pl: 2, m: 0 }}>
                  <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                    SMTP server connectivity
                  </Typography>
                  <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                    Authentication credentials
                  </Typography>
                  <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                    Email formatting and delivery
                  </Typography>
                  <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                    Rich text editor functionality
                  </Typography>
                </Box>
              </Box>

              <Typography
                variant="caption"
                sx={{ display: "block", mt: 2, color: "#888" }}
              >
                Note: Test emails will be sent to the specified recipient
                address.
              </Typography>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Box>
  );
};

export default DiagnosticsPage;
