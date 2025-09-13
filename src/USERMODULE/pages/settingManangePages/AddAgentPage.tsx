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
  Switch,
  OutlinedInput,
  InputAdornment,
} from "@mui/material";
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Lock as LockIcon,
  Security as SecurityIcon,
  Group as GroupIcon,
  Settings as SettingsIcon,
  Assignment as AssignmentIcon,
  AdminPanelSettings as AdminIcon,
  Business as BusinessIcon,
  Work as WorkIcon,
  ChevronRight as ChevronRightIcon,
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
      id={`agent-tabpanel-${index}`}
      aria-labelledby={`agent-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const AddAgentPage = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [activeTab, setActiveTab] = useState(0);
  const [formData, setFormData] = useState({
    // Basic Information
    name: "",
    email: "",
    phone: "",
    mobile: "",
    extension: "",

    // Authentication
    username: "",

    // Status & Settings
    status: "Active",
    locked: false,
    limitTicketAccess: false,
    vacationMode: false,

    // Internal Notes
    internalNotes: "",

    // Primary Department
    primaryDepartment: "",
    primaryRole: "",

    // Extended Access
    extendedDepartments: [] as string[],
    extendedRoles: [] as string[],

    // Permissions
    canCreate: false,
    canDelete: false,
    canEdit: false,
    canManageAccount: false,
    canAccessUserDirectory: false,

    // Assigned Teams
    assignedTeams: [] as string[],
  });

  const [showSuccess, setShowSuccess] = useState(false);
  const [departments] = useState([
    {
      id: "support",
      name: "Support",
      roles: ["Agent", "Senior Agent", "Manager"],
    },
    { id: "sales", name: "Sales", roles: ["Agent", "Senior Agent", "Manager"] },
    {
      id: "technical",
      name: "Technical",
      roles: ["Agent", "Senior Agent", "Manager"],
    },
    {
      id: "billing",
      name: "Billing",
      roles: ["Agent", "Senior Agent", "Manager"],
    },
  ]);

  const [teams] = useState([
    { id: "team1", name: "Customer Support Team" },
    { id: "team2", name: "Technical Support Team" },
    { id: "team3", name: "Sales Team" },
    { id: "team4", name: "Billing Team" },
  ]);

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleArrayChange = (field: string, value: string[]) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = () => {
    setActiveTab(1);
    console.log("Saving agent:", formData);
    setShowSuccess(true);
    // setTimeout(() => {
    //   navigate("/agents");
    // }, 2000);
  };

  const handleCancel = () => {
    navigate("/agents");
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
      description: "Agent name, contact details, and authentication",
    },
    {
      label: "Status & Settings",
      description: "Account status, security, and access settings",
    },
    {
      label: "Primary Department",
      description: "Select primary department and role",
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
          <IconButton onClick={() => navigate("/agents")}>
            <ArrowBackIcon />
          </IconButton>
          <Typography
            variant="h5"
            sx={{ p: 2, fontWeight: 600, color: "#1a1a1a" }}
          >
            Add Agent
            <Typography variant="body1" sx={{ color: "#65676b" }}>
              Create a new agent account with all necessary configurations
            </Typography>
          </Typography>
        </Box>

        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          aria-label="agent tabs"
        >
          <Tab
            label="Agent Configuration"
            icon={<SettingsIcon />}
            iconPosition="start"
            sx={{ textTransform: "none", fontWeight: 500 }}
          />
          <Tab
            label="Permissions & Access"
            icon={<SecurityIcon />}
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
        {/* Tab 1: Agent Configuration with Stepper */}
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
                          <Typography
                            variant="h6"
                            sx={{ fontWeight: 600, mb: 3, color: "#1a1a1a" }}
                          >
                            <PersonIcon
                              sx={{ mr: 1, verticalAlign: "middle" }}
                            />
                            Basic Information
                          </Typography>

                          <Grid container spacing={3}>
                            <Grid size={{ xs: 12, sm: 6 }}>
                              <TextField
                                fullWidth
                                label="Name"
                                value={formData.name}
                                onChange={(e) =>
                                  handleInputChange("name", e.target.value)
                                }
                                placeholder="Enter agent name"
                                required
                              />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6 }}>
                              <TextField
                                fullWidth
                                label="Email"
                                type="email"
                                value={formData.email}
                                onChange={(e) =>
                                  handleInputChange("email", e.target.value)
                                }
                                placeholder="Enter email address"
                                required
                              />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 4 }}>
                              <TextField
                                fullWidth
                                label="Phone"
                                value={formData.phone}
                                onChange={(e) =>
                                  handleInputChange("phone", e.target.value)
                                }
                                placeholder="Enter phone number"
                                InputProps={{
                                  startAdornment: (
                                    <InputAdornment position="start">
                                      <PhoneIcon />
                                    </InputAdornment>
                                  ),
                                }}
                              />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 4 }}>
                              <TextField
                                fullWidth
                                label="Mobile"
                                value={formData.mobile}
                                onChange={(e) =>
                                  handleInputChange("mobile", e.target.value)
                                }
                                placeholder="Enter mobile number"
                                InputProps={{
                                  startAdornment: (
                                    <InputAdornment position="start">
                                      <PhoneIcon />
                                    </InputAdornment>
                                  ),
                                }}
                              />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 4 }}>
                              <TextField
                                fullWidth
                                label="Extension"
                                value={formData.extension}
                                onChange={(e) =>
                                  handleInputChange("extension", e.target.value)
                                }
                                placeholder="Enter extension"
                              />
                            </Grid>
                          </Grid>

                          <Divider sx={{ my: 3 }} />

                          <Typography
                            variant="h6"
                            sx={{ fontWeight: 600, mb: 3, color: "#1a1a1a" }}
                          >
                            <LockIcon sx={{ mr: 1, verticalAlign: "middle" }} />
                            Authentication
                          </Typography>

                          <Box sx={{ mb: 3 }}>
                            <TextField
                              fullWidth
                              label="Username"
                              value={formData.username}
                              onChange={(e) =>
                                handleInputChange("username", e.target.value)
                              }
                              placeholder="Enter username"
                              required
                            />
                          </Box>
                        </Box>
                      )}

                      {index === 1 && (
                        <Box sx={{ maxWidth: 600 }}>
                          {/* Status & Settings */}
                          <Typography
                            variant="h6"
                            sx={{ fontWeight: 600, mb: 3, color: "#1a1a1a" }}
                          >
                            <SettingsIcon
                              sx={{ mr: 1, verticalAlign: "middle" }}
                            />
                            Status & Settings
                          </Typography>

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
                                <MenuItem value="Inactive">Inactive</MenuItem>
                                <MenuItem value="Suspended">Suspended</MenuItem>
                              </Select>
                            </FormControl>
                          </Box>

                          <Box sx={{ mb: 3 }}>
                            <FormControlLabel
                              control={
                                <Switch
                                  checked={formData.locked}
                                  onChange={(e) =>
                                    handleInputChange(
                                      "locked",
                                      e.target.checked
                                    )
                                  }
                                />
                              }
                              label="Locked"
                            />
                            <Typography
                              variant="caption"
                              sx={{ color: "#65676b", ml: 4, display: "block" }}
                            >
                              Lock the agent account to prevent login
                            </Typography>
                          </Box>

                          <Box sx={{ mb: 3 }}>
                            <FormControlLabel
                              control={
                                <Switch
                                  checked={formData.limitTicketAccess}
                                  onChange={(e) =>
                                    handleInputChange(
                                      "limitTicketAccess",
                                      e.target.checked
                                    )
                                  }
                                />
                              }
                              label="Limit Ticket Access to ONLY Assigned tickets"
                            />
                            <Typography
                              variant="caption"
                              sx={{ color: "#65676b", ml: 4, display: "block" }}
                            >
                              Restrict agent to only view tickets assigned to
                              them
                            </Typography>
                          </Box>

                          <Box sx={{ mb: 3 }}>
                            <FormControlLabel
                              control={
                                <Switch
                                  checked={formData.vacationMode}
                                  onChange={(e) =>
                                    handleInputChange(
                                      "vacationMode",
                                      e.target.checked
                                    )
                                  }
                                />
                              }
                              label="Vacation Mode"
                            />
                            <Typography
                              variant="caption"
                              sx={{ color: "#65676b", ml: 4, display: "block" }}
                            >
                              Enable vacation mode to temporarily disable ticket
                              assignments
                            </Typography>
                          </Box>

                          <Divider sx={{ my: 3 }} />

                          <Typography
                            variant="h6"
                            sx={{ fontWeight: 600, mb: 3, color: "#1a1a1a" }}
                          >
                            Internal Notes
                          </Typography>

                          <Box sx={{ mb: 3 }}>
                            <TextField
                              fullWidth
                              multiline
                              rows={4}
                              label="Internal Notes"
                              value={formData.internalNotes}
                              onChange={(e) =>
                                handleInputChange(
                                  "internalNotes",
                                  e.target.value
                                )
                              }
                              placeholder="Enter internal notes about this agent..."
                              helperText="These notes are internal and will not be visible to the agent"
                            />
                          </Box>
                        </Box>
                      )}

                      {index === 2 && (
                        <Box sx={{ maxWidth: 600 }}>
                          {/* Department & Roles */}
                          <Typography
                            variant="h6"
                            sx={{ fontWeight: 600, mb: 3, color: "#1a1a1a" }}
                          >
                            <BusinessIcon
                              sx={{ mr: 1, verticalAlign: "middle" }}
                            />
                            Primary Department
                          </Typography>

                          <Grid container spacing={3}>
                            <Grid size={{ xs: 12, sm: 6 }}>
                              <FormControl fullWidth required>
                                <InputLabel>Select Department</InputLabel>
                                <Select
                                  value={formData.primaryDepartment}
                                  onChange={(e) =>
                                    handleInputChange(
                                      "primaryDepartment",
                                      e.target.value
                                    )
                                  }
                                  label="Select Department"
                                >
                                  {departments.map((dept) => (
                                    <MenuItem key={dept.id} value={dept.id}>
                                      {dept.name}
                                    </MenuItem>
                                  ))}
                                </Select>
                              </FormControl>
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6 }}>
                              <FormControl fullWidth required>
                                <InputLabel>Select Role</InputLabel>
                                <Select
                                  value={formData.primaryRole}
                                  onChange={(e) =>
                                    handleInputChange(
                                      "primaryRole",
                                      e.target.value
                                    )
                                  }
                                  label="Select Role"
                                >
                                  {formData.primaryDepartment &&
                                    departments
                                      .find(
                                        (d) =>
                                          d.id === formData.primaryDepartment
                                      )
                                      ?.roles.map((role) => (
                                        <MenuItem key={role} value={role}>
                                          {role}
                                        </MenuItem>
                                      ))}
                                </Select>
                              </FormControl>
                            </Grid>
                          </Grid>
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
                              ? "Save Agent"
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

        {/* Tab 2: Permissions & Access - Google-style UI */}
        <TabPanel value={activeTab} index={1}>
          <Box sx={{ maxWidth: 800, mx: "auto" }}>
            {/* Department Access Card */}
            <Card
              sx={{
                mb: 3,
                borderRadius: 2,
                boxShadow: "0 1px 3px rgba(0,0,0,0.12)",
              }}
            >
              <Box sx={{ p: 3 }}>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 600, mb: 3, color: "#1a1a1a" }}
                >
                  Department Access
                </Typography>

                {/* Primary Department */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    py: 2,
                    borderBottom: "1px solid #e8eaed",
                  }}
                >
                  <Box sx={{ flex: 1 }}>
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: 500, mb: 0.5 }}
                    >
                      Primary Department
                    </Typography>
                    <Typography variant="body1">
                      {formData.primaryDepartment
                        ? `${
                            departments.find(
                              (d) => d.id === formData.primaryDepartment
                            )?.name
                          } (${formData.primaryRole})`
                        : "Select primary department"}
                    </Typography>
                  </Box>
                  <IconButton size="small">
                    <ChevronRightIcon />
                  </IconButton>
                </Box>

                {/* Extended Departments */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    py: 2,
                    borderBottom: "1px solid #e8eaed",
                  }}
                >
                  <Box sx={{ flex: 1 }}>
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: 500, mb: 0.5 }}
                    >
                      Extended Access
                    </Typography>
                    <Box
                      sx={{ display: "flex", gap: 1, flexWrap: "wrap", mt: 1 }}
                    >
                      {formData.extendedDepartments.length > 0 ? (
                        formData.extendedDepartments.map((deptId) => (
                          <Chip
                            key={deptId}
                            label={
                              departments.find((d) => d.id === deptId)?.name
                            }
                            size="small"
                            variant="outlined"
                          />
                        ))
                      ) : (
                        <Typography variant="body2" sx={{ color: "#5f6368" }}>
                          No extended departments selected
                        </Typography>
                      )}
                    </Box>
                  </Box>
                  <IconButton size="small">
                    <ChevronRightIcon />
                  </IconButton>
                </Box>

                {/* Assigned Teams */}
                <Box sx={{ display: "flex", alignItems: "center", py: 2 }}>
                  <Box sx={{ flex: 1 }}>
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: 500, mb: 0.5 }}
                    >
                      Assigned Teams
                    </Typography>
                    <Box
                      sx={{ display: "flex", gap: 1, flexWrap: "wrap", mt: 1 }}
                    >
                      {formData.assignedTeams.length > 0 ? (
                        formData.assignedTeams.map((teamId) => (
                          <Chip
                            key={teamId}
                            label={teams.find((t) => t.id === teamId)?.name}
                            size="small"
                            variant="outlined"
                          />
                        ))
                      ) : (
                        <Typography variant="body2" sx={{ color: "#5f6368" }}>
                          No teams assigned
                        </Typography>
                      )}
                    </Box>
                  </Box>
                  <IconButton size="small">
                    <ChevronRightIcon />
                  </IconButton>
                </Box>
              </Box>
            </Card>

            {/* Permissions Card */}
            <Card
              sx={{
                mb: 3,
                borderRadius: 2,
                boxShadow: "0 1px 3px rgba(0,0,0,0.12)",
              }}
            >
              <Box sx={{ p: 3 }}>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 600, mb: 3, color: "#1a1a1a" }}
                >
                  Permissions
                </Typography>

                {/* Create Permission */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    py: 2,
                    borderBottom: "1px solid #e8eaed",
                  }}
                >
                  <Box sx={{ flex: 1 }}>
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: 500, mb: 0.5 }}
                    >
                      Create
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#5f6368" }}>
                      Allow agent to create new tickets and records
                    </Typography>
                  </Box>
                  <Switch
                    checked={formData.canCreate}
                    onChange={(e) =>
                      handleInputChange("canCreate", e.target.checked)
                    }
                  />
                </Box>

                {/* Edit Permission */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    py: 2,
                    borderBottom: "1px solid #e8eaed",
                  }}
                >
                  <Box sx={{ flex: 1 }}>
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: 500, mb: 0.5 }}
                    >
                      Edit
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#5f6368" }}>
                      Allow agent to edit tickets and records
                    </Typography>
                  </Box>
                  <Switch
                    checked={formData.canEdit}
                    onChange={(e) =>
                      handleInputChange("canEdit", e.target.checked)
                    }
                  />
                </Box>

                {/* Delete Permission */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    py: 2,
                    borderBottom: "1px solid #e8eaed",
                  }}
                >
                  <Box sx={{ flex: 1 }}>
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: 500, mb: 0.5 }}
                    >
                      Delete
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#5f6368" }}>
                      Allow agent to delete tickets and records
                    </Typography>
                  </Box>
                  <Switch
                    checked={formData.canDelete}
                    onChange={(e) =>
                      handleInputChange("canDelete", e.target.checked)
                    }
                  />
                </Box>

                {/* Manage Account Permission */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    py: 2,
                    borderBottom: "1px solid #e8eaed",
                  }}
                >
                  <Box sx={{ flex: 1 }}>
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: 500, mb: 0.5 }}
                    >
                      Manage Account
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#5f6368" }}>
                      Allow agent to manage account settings
                    </Typography>
                  </Box>
                  <Switch
                    checked={formData.canManageAccount}
                    onChange={(e) =>
                      handleInputChange("canManageAccount", e.target.checked)
                    }
                  />
                </Box>

                {/* User Directory Permission */}
                <Box sx={{ display: "flex", alignItems: "center", py: 2 }}>
                  <Box sx={{ flex: 1 }}>
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: 500, mb: 0.5 }}
                    >
                      User Directory
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#5f6368" }}>
                      Allow agent to access user directory
                    </Typography>
                  </Box>
                  <Switch
                    checked={formData.canAccessUserDirectory}
                    onChange={(e) =>
                      handleInputChange(
                        "canAccessUserDirectory",
                        e.target.checked
                      )
                    }
                  />
                </Box>
              </Box>
            </Card>

            {/* Action Buttons */}
            <Box
              sx={{
                display: "flex",
                gap: 2,
                justifyContent: "flex-end",
                mt: 3,
              }}
            >
              <Button
                variant="outlined"
                onClick={handleCancel}
                startIcon={<CancelIcon />}
                sx={{ textTransform: "none" }}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                onClick={handleSave}
                startIcon={<SaveIcon />}
                sx={{ textTransform: "none" }}
              >
                Save Agent
              </Button>
            </Box>
          </Box>
        </TabPanel>
      </Box>

      {/* Success Snackbar */}
      <Snackbar
        open={showSuccess}
        autoHideDuration={6000}
        onClose={() => setShowSuccess(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={() => setShowSuccess(false)} severity="success">
          Agent created successfully!
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AddAgentPage;
