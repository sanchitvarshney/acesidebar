import React, { useState } from "react";
import {
  Box,
  Card,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Grid,
  Divider,
  Chip,
  IconButton,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Tabs,
  Tab,
  Switch,
  InputAdornment,
  Backdrop,
} from "@mui/material";
import {
  Save as SaveIcon,
  Cancel as CancelIcon,
  Person as PersonIcon,
  Phone as PhoneIcon,
  Lock as LockIcon,
  Security as SecurityIcon,
  Settings as SettingsIcon,
  Business as BusinessIcon,
  ChevronRight as ChevronRightIcon,
  Close,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useSelector } from "react-redux";

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
  const [isOpen, setIsOpen] = useState<any>(false);
  const { isOpen: isAnyPopupOpen } = useSelector((state: any) => state.shotcut);
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
    const payload = {
      basicInfo: {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        mobile: formData.mobile,
        extension: formData.extension,
      },
      authentication: {
        username: formData.username,
        temporaryPassword: true,
      },
      status: {
        status: formData.status as "Active" | "Inactive" | "Suspended",
        locked: formData.locked,
        limitTicketAccess: formData.limitTicketAccess,
        vacationMode: formData.vacationMode,
      },
      internalNotes: formData.internalNotes || undefined,
      department: {
        primaryDepartment: formData.primaryDepartment,
        primaryRole: formData.primaryRole,
        extendedDepartments: formData.extendedDepartments,
        extendedRoles: formData.extendedRoles,
      },
      permissions: {
        canCreate: formData.canCreate,
        canDelete: formData.canDelete,
        canEdit: formData.canEdit,
        canManageAccount: formData.canManageAccount,
        canAccessUserDirectory: formData.canAccessUserDirectory,
      },
      teams: {
        assignedTeams: formData.assignedTeams,
      },
    };

    console.log("Agent API Payload:", payload);

    setActiveTab(1);
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
        height: "calc(100vh - 98px)",
      }}
    >
      {/* Header */}
      <Box sx={{}}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            p: 2,
            borderBottom: "1px solid #e0e0e0",
            backgroundColor: "#fafafa",
          }}
        >
          <IconButton
            onClick={() => navigate("/settings/agents-productivity/agents")}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h5" sx={{ fontWeight: 600, color: "#1a1a1a" }}>
            Add Agent
          </Typography>
        </Box>

        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          aria-label="agent tabs"
          sx={{mx:1}}
        >
          <Tab
            label="Agent Configuration"
            icon={
              <div>
                {" "}
                <Chip
                  variant="outlined"
                  size="small"
                  label="1"
                  color="primary"
                  disabled={activeTab !== 0}
                  sx={{ mr: 1 }}
                />{" "}
                <SettingsIcon />
              </div>
            }
            iconPosition="start"
            sx={{ textTransform: "none", fontWeight: 500 }}
          />
          <Tab
            label="Permissions & Access"
            icon={
              <div>
                {" "}
                <Chip
                  variant="outlined"
                  size="small"
                  label="2"
                  color="primary"
                  disabled={activeTab !== 1}
                  sx={{ mr: 1 }}
                />{" "}
                <SecurityIcon />
              </div>
            }
            iconPosition="start"
            sx={{ textTransform: "none", fontWeight: 500 }}
          />
        </Tabs>
      </Box>

      {/* Main Content */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          backgroundColor: "#fff",
          overflow: "auto",
          maxHeight: "calc(100vh - 250px)",
        }}
        className="custom-scrollbar"
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
          <Box
            sx={{
              maxWidth: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",

              mr: isOpen ? "320px" : "",
              transition: "margin-right 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          >
            {/* Department Access Card */}

            <Card
              sx={{
                width: "80%",
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
                    width: "100%",
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
                  <IconButton size="small" onClick={() => setIsOpen(!isOpen)}>
                    <ChevronRightIcon
                      sx={{
                        transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                        transition: "transform 0.3s ease-in-out",
                      }}
                    />
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
                  <IconButton size="small" onClick={() => setIsOpen(!isOpen)}>
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
                  <IconButton size="small" onClick={() => setIsOpen(!isOpen)}>
                    <ChevronRightIcon />
                  </IconButton>
                </Box>
              </Box>
            </Card>

            {/* Permissions Card */}
            <Card
              sx={{
                width: "80%",
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

            <Box
              sx={{
                width: { xs: "100%", sm: "40%", md: "30%" },
                borderLeft: "1px solid #e0e0e0",
                display: "flex",
                flexDirection: "column",
                backgroundColor: "#fff",
                transform: isOpen ? "translateX(0)" : "translateX(100%)",
                transition: "transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                position: "fixed",
                right: 0,
                top: 240,
                bottom: 0,
                height: "100vh",
                zIndex: 1300,
                // boxShadow: columnOrganizerOpen ? "-4px 0 12px rgba(0, 0, 0, 0.15)" : "none",
                visibility: isOpen ? "visible" : "hidden",
                minWidth: { xs: "280px", sm: "300px", md: "450px" },
                maxWidth: { xs: "100%", sm: "400px", md: "450px" },
              }}
            >
              {/* Header */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  p: 3,
                  pb: 2,
                  borderBottom: "1px solid #e0e0e0",
                }}
              >
                {/* <SplitscreenIcon sx={{ color: "#666" }} /> */}
                <Typography variant="h6" sx={{ fontWeight: 600, flex: 1 }}>
                  Collaps
                </Typography>
                <IconButton onClick={() => setIsOpen(false)} size="small">
                  <Close />
                </IconButton>
              </Box>

              {/* Footer */}
              <Box
                sx={{
                  p: 3,
                  borderTop: "1px solid #e0e0e0",
                  display: "flex",
                  gap: 2,
                  justifyContent: "flex-end",
                }}
              >
                <Button
                  variant="outlined"
                  onClick={() => setIsOpen(false)}
                  sx={{
                    textTransform: "none",
                    borderColor: "#e0e0e0",
                    color: "#666",
                  }}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  onClick={() => {
                    // Apply column changes and close
                    setIsOpen(false);
                  }}
                  sx={{
                    textTransform: "none",
                    backgroundColor: "#2566b0",
                  }}
                >
                  Save
                </Button>
              </Box>
            </Box>

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
      <Backdrop
        open={isOpen}
        sx={{
          top: 64,
          left: isAnyPopupOpen ? 78 : 0,
          zIndex: 1200,
          bgcolor: "rgba(0, 0, 0, 0.08)",
          pointerEvents: "auto",
          transition: "left 600ms ease-in-out",
        }}
      />
    </Box>
  );
};

export default AddAgentPage;
