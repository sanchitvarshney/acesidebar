import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
  RadioGroup,
  Radio,
  FormLabel,
  Grid,
  Divider,
  Chip,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  Stack,
  Alert,
  Snackbar,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Tabs,
  Tab,
} from "@mui/material";
import {
  Add as AddIcon,
  Download as DownloadIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Schedule as ScheduleIcon,
  Settings as SettingsIcon,
  Group as GroupIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`department-tabpanel-${index}`}
      aria-labelledby={`department-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const CreateDepartmentPage = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [activeTab, setActiveTab] = useState(0);
  const [formData, setFormData] = useState({
    // Basic Information
    name: "",
    status: "Active",
    type: "Public",
    sal: "",
    schedule: "",
    manager: "",
    ticketAssignment: "Manager",
    reopenAutoAssignment: false,

    // Outgoing Email Settings
    outgoingEmail: "",

    // Autoresponder Settings
    disableNewTicket: false,
    disableNewMessage: false,
    autoResponseEmail: "",

    // Recipient
    recipient: "",

    // Department Signature
    signature: "",
  });

  const [departmentMembers, setDepartmentMembers] = useState([
    {
      id: 1,
      name: "John Doe",
      email: "john.doe@company.com",
      role: "Agent",
      status: "Active",
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane.smith@company.com",
      role: "Senior Agent",
      status: "Active",
    },
    {
      id: 3,
      name: "Mike Johnson",
      email: "mike.johnson@company.com",
      role: "Agent",
      status: "Inactive",
    },
  ]);

  const [showSuccess, setShowSuccess] = useState(false);

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = () => {
    // Create API payload
    const payload = {
      basicInfo: {
        name: formData.name,
        status: formData.status,
        type: formData.type,
      },
      sla: {
        level: formData.sal,
        responseTime:
          formData.sal === "basic"
            ? 24
            : formData.sal === "standard"
            ? 8
            : formData.sal === "premium"
            ? 4
            : 1,
        resolutionTime:
          formData.sal === "basic"
            ? 72
            : formData.sal === "standard"
            ? 24
            : formData.sal === "premium"
            ? 8
            : 4,
      },
      schedule: {
        workingHours:
          formData.schedule === "24x7"
            ? "24/7"
            : formData.schedule === "business"
            ? "9:00 AM - 6:00 PM"
            : formData.schedule === "extended"
            ? "8:00 AM - 8:00 PM"
            : "Custom",
      },
      management: {
        manager: formData.manager,
        ticketAssignment: formData.ticketAssignment,
        reopenAutoAssignment: formData.reopenAutoAssignment,
      },
      email: {
        outgoingEmail: formData.outgoingEmail,
        autoResponse: {
          disableNewTicket: formData.disableNewTicket,
          disableNewMessage: formData.disableNewMessage,
          autoResponseEmail: formData.autoResponseEmail,
        },
        recipient: formData.recipient,
      },
      settings: {
        signature: formData.signature,
        enableSlaMonitoring: true,
        escalationTime: 24,
        priorityLevel: "medium",
      },
      members: {
        memberIds: departmentMembers.map((member) => member.id.toString()),
        roles: departmentMembers.reduce((acc, member) => {
          acc[member.id.toString()] = member.role;
          return acc;
        }, {} as { [memberId: string]: string }),
      },
    };

    console.log("Department API Payload:", payload);

    setShowSuccess(true);
    setTimeout(() => {
      navigate("/departments");
    }, 2000);
  };


  const handleDownloadMembers = () => {
    // Implement download functionality
    console.log("Downloading department members...");
  };

  const handleRemoveMember = (memberId: number) => {
    setDepartmentMembers((prev) =>
      prev.filter((member) => member.id !== memberId)
    );
  };

  const handleAddMember = () => {
    // Implement add member functionality
    console.log("Adding new member...");
  };

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleStepClick = (step: number) => {
    setActiveStep(step);
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const steps = [
    {
      label: "Basic Information",
      description: "Department name, status, type, and basic settings",
    },
    {
      label: "Email Settings",
      description: "Outgoing email and autoresponder configuration",
    },
    {
      label: "Advanced Settings",
      description: "Additional settings and department signature",
    },
  ];

  return (
    <Box
      sx={{
        height: "calc(100vh - 200px)",
        bgcolor: "#f5f5f5",
      }}
    >
      {/* Header */}
      <Box sx={{ borderBottom: "1px solid #e0e0e0", bgcolor: "#fff" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <IconButton onClick={() => navigate("/departments")}>
            <ArrowBackIcon />
          </IconButton>
          <Typography
            variant="h5"
            sx={{ p: 2, fontWeight: 600, color: "#1a1a1a" }}
          >
            Create Department
            <Typography variant="body1" sx={{ color: "#65676b" }}>
              Set up a new department with all necessary configurations
            </Typography>
          </Typography>
        </Box>

        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          aria-label="department tabs"
        >
          <Tab
            label="Department Configuration"
            icon={<SettingsIcon />}
            iconPosition="start"
            sx={{ textTransform: "none", fontWeight: 500 }}
          />
          <Tab
            label="Department Members"
            icon={<GroupIcon />}
            iconPosition="start"
            sx={{ textTransform: "none", fontWeight: 500 }}
          />
        </Tabs>
      </Box>

      {/* Main Content */}
      <Box
        sx={{
          p: 3,
          display: "flex",
          flexDirection: "column",
          gap: 2,
          backgroundColor: "#fff",
          overflow: "auto",
          maxHeight: "calc(100vh - 250px)",
        }}
      >
        {/* Tab 1: Department Configuration with Stepper */}
        <TabPanel value={activeTab} index={0}>
          <Box sx={{ margin: "0 auto" }}>
            <Stepper activeStep={activeStep} orientation="vertical">
              {steps.map((step, index) => (
                <Step key={step.label}>
                  <StepLabel
                    onClick={() => handleStepClick(index)}
                    sx={{
                      cursor: "pointer",
                      "& .MuiStepLabel-label": {
                        fontWeight: activeStep === index ? 600 : 400,
                      },
                    }}
                  >
                    <Box>
                      <Typography
                        variant="h6"
                        sx={{ fontWeight: activeStep === index ? 600 : 400 }}
                      >
                        {step.label}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ color: "#65676b", mt: 0.5 }}
                      >
                        {step.description}
                      </Typography>
                    </Box>
                  </StepLabel>
                  <StepContent>
                    <Box sx={{ mt: 2 }}>
                      {index === 0 && (
                        <Box sx={{ maxWidth: 600 }}>
                          {/* Basic Information Fields */}
                          <Box sx={{ mb: 3 }}>
                            <TextField
                              fullWidth
                              label="Department Name"
                              value={formData.name}
                              onChange={(e) =>
                                handleInputChange("name", e.target.value)
                              }
                              placeholder="Enter department name"
                              required
                            />
                          </Box>

                          <Box sx={{ mb: 3 }}>
                            <FormControl fullWidth required>
                              <InputLabel>Status</InputLabel>
                              <Select
                                value={formData.status}
                                onChange={(e) =>
                                  handleInputChange("status", e.target.value)
                                }
                                label="Status"
                              >
                                <MenuItem value="Active">Active</MenuItem>
                                <MenuItem value="Disabled">Disabled</MenuItem>
                              </Select>
                            </FormControl>
                          </Box>

                          <Box sx={{ mb: 3 }}>
                            <FormControl component="fieldset">
                              <FormLabel component="legend">Type</FormLabel>
                              <RadioGroup
                                value={formData.type}
                                onChange={(e) =>
                                  handleInputChange("type", e.target.value)
                                }
                                row
                              >
                                <FormControlLabel
                                  value="Public"
                                  control={<Radio />}
                                  label="Public"
                                />
                                <FormControlLabel
                                  value="Private"
                                  control={<Radio />}
                                  label="Private (Internal)"
                                />
                              </RadioGroup>
                            </FormControl>
                          </Box>

                          <Box sx={{ mb: 3 }}>
                            <FormControl fullWidth>
                              <InputLabel>
                                SAL (Service Level Agreement)
                              </InputLabel>
                              <Select
                                value={formData.sal}
                                onChange={(e) =>
                                  handleInputChange("sal", e.target.value)
                                }
                                label="SAL (Service Level Agreement)"
                              >
                                <MenuItem value="basic">
                                  Basic (24 hours)
                                </MenuItem>
                                <MenuItem value="standard">
                                  Standard (8 hours)
                                </MenuItem>
                                <MenuItem value="premium">
                                  Premium (4 hours)
                                </MenuItem>
                                <MenuItem value="critical">
                                  Critical (1 hour)
                                </MenuItem>
                              </Select>
                            </FormControl>
                          </Box>

                          <Box sx={{ mb: 3 }}>
                            <FormControl fullWidth>
                              <InputLabel>Schedule</InputLabel>
                              <Select
                                value={formData.schedule}
                                onChange={(e) =>
                                  handleInputChange("schedule", e.target.value)
                                }
                                label="Schedule"
                              >
                                <MenuItem value="24x7">24/7 Support</MenuItem>
                                <MenuItem value="business">
                                  Business Hours (9 AM - 6 PM)
                                </MenuItem>
                                <MenuItem value="extended">
                                  Extended Hours (8 AM - 8 PM)
                                </MenuItem>
                                <MenuItem value="custom">
                                  Custom Schedule
                                </MenuItem>
                              </Select>
                            </FormControl>
                          </Box>

                          <Box sx={{ mb: 3 }}>
                            <FormControl fullWidth>
                              <InputLabel>Manager</InputLabel>
                              <Select
                                value={formData.manager}
                                onChange={(e) =>
                                  handleInputChange("manager", e.target.value)
                                }
                                label="Manager"
                              >
                                <MenuItem value="john-doe">John Doe</MenuItem>
                                <MenuItem value="jane-smith">
                                  Jane Smith
                                </MenuItem>
                                <MenuItem value="mike-johnson">
                                  Mike Johnson
                                </MenuItem>
                              </Select>
                            </FormControl>
                          </Box>

                          <Box sx={{ mb: 3 }}>
                            <FormControl fullWidth>
                              <InputLabel>Ticket Assignment</InputLabel>
                              <Select
                                value={formData.ticketAssignment}
                                onChange={(e) =>
                                  handleInputChange(
                                    "ticketAssignment",
                                    e.target.value
                                  )
                                }
                                label="Ticket Assignment"
                              >
                                <MenuItem value="Manager">Manager</MenuItem>
                                <MenuItem value="Department Member">
                                  Department Member
                                </MenuItem>
                                <MenuItem value="Round Robin">
                                  Round Robin
                                </MenuItem>
                                <MenuItem value="Load Balanced">
                                  Load Balanced
                                </MenuItem>
                              </Select>
                            </FormControl>
                          </Box>

                          <Box sx={{ mb: 3 }}>
                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={formData.reopenAutoAssignment}
                                  onChange={(e) =>
                                    handleInputChange(
                                      "reopenAutoAssignment",
                                      e.target.checked
                                    )
                                  }
                                />
                              }
                              label="ReOpen Auto Assignment - auto assign on reopen"
                            />
                          </Box>
                        </Box>
                      )}

                      {index === 1 && (
                        <Box sx={{ maxWidth: 600 }}>
                          {/* Email Settings */}
                          <Typography
                            variant="h6"
                            sx={{ fontWeight: 600, mb: 3, color: "#1a1a1a" }}
                          >
                            <EmailIcon
                              sx={{ mr: 1, verticalAlign: "middle" }}
                            />
                            Outgoing Email Settings
                          </Typography>

                          <Box sx={{ mb: 3 }}>
                            <FormControl fullWidth>
                              <InputLabel>Outgoing Email</InputLabel>
                              <Select
                                value={formData.outgoingEmail}
                                onChange={(e) =>
                                  handleInputChange(
                                    "outgoingEmail",
                                    e.target.value
                                  )
                                }
                                label="Outgoing Email"
                              >
                                <MenuItem value="support@company.com">
                                  support@company.com
                                </MenuItem>
                                <MenuItem value="sales@company.com">
                                  sales@company.com
                                </MenuItem>
                                <MenuItem value="technical@company.com">
                                  technical@company.com
                                </MenuItem>
                                <MenuItem value="custom">Custom Email</MenuItem>
                              </Select>
                            </FormControl>
                          </Box>

                          <Divider sx={{ my: 3 }} />
                          <Typography
                            variant="h6"
                            sx={{ fontWeight: 600, mb: 3, color: "#1a1a1a" }}
                          >
                            <EmailIcon
                              sx={{ mr: 1, verticalAlign: "middle" }}
                            />
                            Autoresponder Settings
                          </Typography>

                          <Box sx={{ mb: 3 }}>
                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={formData.disableNewTicket}
                                  onChange={(e) =>
                                    handleInputChange(
                                      "disableNewTicket",
                                      e.target.checked
                                    )
                                  }
                                />
                              }
                              label="New Ticket - Disable for this department"
                            />
                          </Box>

                          <Box sx={{ mb: 3 }}>
                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={formData.disableNewMessage}
                                  onChange={(e) =>
                                    handleInputChange(
                                      "disableNewMessage",
                                      e.target.checked
                                    )
                                  }
                                />
                              }
                              label="New Message - Disable for this department"
                            />
                          </Box>

                          <Box sx={{ mb: 3 }}>
                            <FormControl fullWidth>
                              <InputLabel>Auto-Response Email</InputLabel>
                              <Select
                                value={formData.autoResponseEmail}
                                onChange={(e) =>
                                  handleInputChange(
                                    "autoResponseEmail",
                                    e.target.value
                                  )
                                }
                                label="Auto-Response Email"
                              >
                                <MenuItem value="auto-support@company.com">
                                  auto-support@company.com
                                </MenuItem>
                                <MenuItem value="auto-sales@company.com">
                                  auto-sales@company.com
                                </MenuItem>
                                <MenuItem value="noreply@company.com">
                                  noreply@company.com
                                </MenuItem>
                              </Select>
                            </FormControl>
                          </Box>

                          <Divider sx={{ my: 3 }} />
                          <Typography
                            variant="h6"
                            sx={{ fontWeight: 600, mb: 3, color: "#1a1a1a" }}
                          >
                            Recipient
                          </Typography>

                          <Box sx={{ mb: 3 }}>
                            <FormControl fullWidth>
                              <InputLabel>Recipient</InputLabel>
                              <Select
                                value={formData.recipient}
                                onChange={(e) =>
                                  handleInputChange("recipient", e.target.value)
                                }
                                label="Recipient"
                              >
                                <MenuItem value="manager">
                                  Department Manager
                                </MenuItem>
                                <MenuItem value="all-members">
                                  All Department Members
                                </MenuItem>
                                <MenuItem value="senior-agents">
                                  Senior Agents Only
                                </MenuItem>
                                <MenuItem value="custom">
                                  Custom Recipients
                                </MenuItem>
                              </Select>
                            </FormControl>
                          </Box>
                        </Box>
                      )}

                      {index === 2 && (
                        <Box sx={{ maxWidth: 600 }}>
                          {/* Advanced Settings */}
                          <Typography
                            variant="h6"
                            sx={{ fontWeight: 600, mb: 3, color: "#1a1a1a" }}
                          >
                            Department Signature
                          </Typography>

                          <Box sx={{ mb: 3 }}>
                            <TextField
                              fullWidth
                              multiline
                              rows={4}
                              label="Department Signature"
                              value={formData.signature}
                              onChange={(e) =>
                                handleInputChange("signature", e.target.value)
                              }
                              placeholder="Enter department signature that will be added to outgoing emails..."
                              helperText="This signature will be automatically added to all outgoing emails from this department"
                            />
                          </Box>

                          <Divider sx={{ my: 3 }} />
                          <Typography
                            variant="h6"
                            sx={{ fontWeight: 600, mb: 3, color: "#1a1a1a" }}
                          >
                            Additional Settings
                          </Typography>

                          <Box sx={{ mb: 3 }}>
                            <TextField
                              fullWidth
                              label="Department Code"
                              placeholder="e.g., SUPPORT, SALES, TECH"
                              helperText="Short code for internal reference"
                            />
                          </Box>

                          <Box sx={{ mb: 3 }}>
                            <TextField
                              fullWidth
                              label="Priority Level"
                              select
                              defaultValue="medium"
                              helperText="Default priority for tickets in this department"
                            >
                              <MenuItem value="low">Low</MenuItem>
                              <MenuItem value="medium">Medium</MenuItem>
                              <MenuItem value="high">High</MenuItem>
                              <MenuItem value="critical">Critical</MenuItem>
                            </TextField>
                          </Box>

                          <Box sx={{ mb: 3 }}>
                            <TextField
                              fullWidth
                              label="Escalation Time (hours)"
                              type="number"
                              defaultValue={24}
                              helperText="Time before tickets are escalated"
                            />
                          </Box>

                          <Box sx={{ mb: 3 }}>
                            <FormControlLabel
                              control={<Checkbox defaultChecked />}
                              label="Enable SLA Monitoring"
                            />
                            <Typography
                              variant="caption"
                              sx={{ color: "#65676b", ml: 4, display: "block" }}
                            >
                              Monitor SLA compliance for this department
                            </Typography>
                          </Box>
                        </Box>
                      )}

                      <Box sx={{ mb: 2, mt: 3 }}>
                        <div>
                          <Button
                            variant="contained"
                            onClick={
                              index === steps.length - 1
                                ? handleSave
                                : handleNext
                            }
                            sx={{ mt: 1, mr: 1 }}
                          >
                            {index === steps.length - 1
                              ? "Save Department"
                              : "Continue"}
                          </Button>
                          <Button
                            disabled={index === 0}
                            onClick={handleBack}
                            sx={{ mt: 1, mr: 1 }}
                          >
                            Back
                          </Button>
                        </div>
                      </Box>
                    </Box>
                  </StepContent>
                </Step>
              ))}
            </Stepper>
          </Box>
        </TabPanel>

        {/* Tab 2: Department Members */}
        <TabPanel value={activeTab} index={1}>
          <Box sx={{ mb: 3 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 3,
              }}
            >
              <Typography
                variant="h6"
                sx={{ fontWeight: 600, color: "#1a1a1a" }}
              >
                Department Members
              </Typography>
              <Box>
                <Button
                  variant="outlined"
                  startIcon={<DownloadIcon />}
                  onClick={handleDownloadMembers}
                  sx={{ mr: 2 }}
                >
                  Download
                </Button>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={handleAddMember}
                >
                  Add Member
                </Button>
              </Box>
            </Box>

            <TableContainer
              component={Paper}
              sx={{ boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}
            >
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: "#f8f9fa" }}>
                    <TableCell sx={{ fontWeight: 600 }}>Member</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Email</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Role</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {departmentMembers.map((member) => (
                    <TableRow key={member.id} hover>
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <Avatar
                            sx={{
                              width: 32,
                              height: 32,
                              mr: 2,
                              bgcolor: "#1976d2",
                            }}
                          >
                            {member.name.charAt(0)}
                          </Avatar>
                          {member.name}
                        </Box>
                      </TableCell>
                      <TableCell>{member.email}</TableCell>
                      <TableCell>
                        <Chip
                          label={member.role}
                          size="small"
                          color="primary"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={member.status}
                          size="small"
                          color={
                            member.status === "Active" ? "success" : "default"
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleRemoveMember(member.id)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </TabPanel>
      </Box>
    </Box>
  );
};

export default CreateDepartmentPage;
