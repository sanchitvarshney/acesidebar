import React, { useState } from "react";
import {
  Box,
  Button,
  IconButton,
  Typography,
  TextField,
  MenuItem,
  Card,
  CardContent,
  Stack,
  Divider,
  Chip,
  Avatar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  FormControlLabel,
  Tabs,
  Tab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  Settings as SettingsIcon,
  Group as GroupIcon,
  Add as AddIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

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
      id={`team-tabpanel-${index}`}
      aria-labelledby={`team-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const CreateTeamPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    department: "",
    status: "Active",
    teamLead: "",
    ticketAssignment: "Round Robin",
    autoAssignment: false,
    maxMembers: 10,
    workingHours: "9:00 AM - 6:00 PM",
    timezone: "UTC",
    emailNotifications: true,
    slackNotifications: false,
    notificationEmail: "",
  });

  const [teamMembers, setTeamMembers] = useState([
    {
      id: 1,
      name: "John Doe",
      email: "john.doe@company.com",
      role: "Team Lead",
      status: "Active",
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane.smith@company.com",
      role: "Senior Agent",
      status: "Active",
    },
  ]);

  const [availableAgents, setAvailableAgents] = useState([
    {
      id: 3,
      name: "Mike Johnson",
      email: "mike.johnson@company.com",
      role: "Agent",
      status: "Active",
    },
    {
      id: 4,
      name: "Sarah Wilson",
      email: "sarah.wilson@company.com",
      role: "Agent",
      status: "Active",
    },
    {
      id: 5,
      name: "David Brown",
      email: "david.brown@company.com",
      role: "Agent",
      status: "Active",
    },
  ]);

  const [showAddMemberDialog, setShowAddMemberDialog] = useState(false);
  const [selectedAgents, setSelectedAgents] = useState<number[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);

  const departments = [
    "Customer Service",
    "IT Support",
    "Sales",
    "Marketing",
    "HR",
    "Finance",
  ];

  const timezones = [
    "UTC",
    "EST (UTC-5)",
    "PST (UTC-8)",
    "CST (UTC-6)",
    "MST (UTC-7)",
    "IST (UTC+5:30)",
  ];

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

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
        description: formData.description,
        department: formData.department,
        status: formData.status,
      },
      leadership: {
        teamLead: formData.teamLead,
        workingHours: formData.workingHours,
        timezone: formData.timezone,
        ticketAssignment: formData.ticketAssignment,
        autoAssignment: formData.autoAssignment,
        maxMembers: formData.maxMembers,
      },
      notifications: {
        emailNotifications: formData.emailNotifications,
        slackNotifications: formData.slackNotifications,
        notificationEmail: formData.notificationEmail,
      },
      members: {
        memberIds: teamMembers.map((member) => member.id.toString()),
        roles: teamMembers.reduce((acc, member) => {
          acc[member.id.toString()] = member.role;
          return acc;
        }, {} as { [memberId: string]: string }),
      },
    };

    console.log("Team API Payload:", payload);

    setShowSuccess(true);
    setTimeout(() => {
      navigate("/teams");
    }, 2000);
  };

  const handleCancel = () => {
    navigate("/teams");
  };

  const handleAddMembers = () => {
    const newMembers = availableAgents.filter((agent) =>
      selectedAgents.includes(agent.id)
    );
    setTeamMembers([...teamMembers, ...newMembers]);
    setAvailableAgents(
      availableAgents.filter((agent) => !selectedAgents.includes(agent.id))
    );
    setSelectedAgents([]);
    setShowAddMemberDialog(false);
  };

  const handleRemoveMember = (memberId: number) => {
    const member = teamMembers.find((m) => m.id === memberId);
    if (member) {
      setTeamMembers(teamMembers.filter((m) => m.id !== memberId));
      setAvailableAgents([...availableAgents, member]);
    }
  };

  const handleAgentSelection = (agentId: number) => {
    setSelectedAgents((prev) =>
      prev.includes(agentId)
        ? prev.filter((id) => id !== agentId)
        : [...prev, agentId]
    );
  };

  return (
    <Box
      sx={{
        height: "calc(100vh - 98px)",
        bgcolor: "#f5f5f5",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header */}
      <Box sx={{ borderBottom: "1px solid #e0e0e0", bgcolor: "#fff" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <IconButton
            onClick={() => navigate("/settings/agents-productivity/teams")}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography
            variant="h5"
            sx={{ p: 2, fontWeight: 600, color: "#1a1a1a" }}
          >
            Create Team
            <Typography variant="body1" sx={{ color: "#65676b" }}>
              Set up a new team with members and configurations
            </Typography>
          </Typography>
        </Box>

        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          aria-label="team tabs"
        >
          <Tab
            label="Team Configuration"
            icon={<SettingsIcon />}
            iconPosition="start"
            sx={{ textTransform: "none", fontWeight: 500 }}
          />
          <Tab
            label="Team Members"
            icon={<GroupIcon />}
            iconPosition="start"
            sx={{ textTransform: "none", fontWeight: 500 }}
          />
        </Tabs>
      </Box>

      {/* Main Content */}
      <Box
        sx={{
          p: 2,
          display: "flex",
          gap: 3,
          flex: 1,
          overflow: "hidden",
        }}
      >
        {/* Left Panel - Form */}
        <Box sx={{ flex: 2, overflowY: "auto", minHeight: 0 }}    className="custom-scrollbar">
          <TabPanel value={activeTab} index={0}>
            <Stack spacing={2}>
              {/* Basic Information */}
              <Card>
                <CardContent
                  sx={{ display: "flex", flexDirection: "column", gap: 2 }}
                >
                  <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                    Team Information
                  </Typography>
                  <Stack spacing={2}>
                    <TextField
                      fullWidth
                      label="Team Name"
                      value={formData.name}
                      onChange={(e) =>
                        handleInputChange("name", e.target.value)
                      }
                      placeholder="Enter team name"
                    />
                    <TextField
                      fullWidth
                      multiline
                      rows={3}
                      label="Description"
                      value={formData.description}
                      onChange={(e) =>
                        handleInputChange("description", e.target.value)
                      }
                      placeholder="Enter team description"
                    />
                    <Box sx={{ display: "flex", gap: 2 }}>
                      <TextField
                        select
                        fullWidth
                        label="Department"
                        value={formData.department}
                        onChange={(e) =>
                          handleInputChange("department", e.target.value)
                        }
                      >
                        {departments.map((dept) => (
                          <MenuItem key={dept} value={dept}>
                            {dept}
                          </MenuItem>
                        ))}
                      </TextField>
                      <TextField
                        select
                        fullWidth
                        label="Status"
                        value={formData.status}
                        onChange={(e) =>
                          handleInputChange("status", e.target.value)
                        }
                      >
                        <MenuItem value="Active">Active</MenuItem>
                        <MenuItem value="Inactive">Inactive</MenuItem>
                      </TextField>
                    </Box>
                  </Stack>
                  <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                    Team Settings
                  </Typography>
                  <Stack spacing={2}>
                    <TextField
                      select
                      fullWidth
                      label="Team Lead"
                      value={formData.teamLead}
                      onChange={(e) =>
                        handleInputChange("teamLead", e.target.value)
                      }
                    >
                      {teamMembers.map((member) => (
                        <MenuItem key={member.id} value={member.name}>
                          {member.name}
                        </MenuItem>
                      ))}
                    </TextField>
                    <Box sx={{ display: "flex", gap: 2 }}>
                      <TextField
                        select
                        fullWidth
                        label="Ticket Assignment"
                        value={formData.ticketAssignment}
                        onChange={(e) =>
                          handleInputChange("ticketAssignment", e.target.value)
                        }
                      >
                        <MenuItem value="Round Robin">Round Robin</MenuItem>
                        <MenuItem value="Least Busy">Least Busy</MenuItem>
                        <MenuItem value="Manual">Manual</MenuItem>
                      </TextField>
                    </Box>
                  </Stack>
                  <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                   Team Notifications
                  </Typography>
                  <Stack spacing={2}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={formData.emailNotifications}
                          onChange={(e) =>
                            handleInputChange(
                              "emailNotifications",
                              e.target.checked
                            )
                          }
                        />
                      }
                      label="Email Notifications"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={formData.slackNotifications}
                          onChange={(e) =>
                            handleInputChange(
                              "slackNotifications",
                              e.target.checked
                            )
                          }
                        />
                      }
                      label="Slack Notifications"
                    />
                    <TextField
                      fullWidth
                      label="Notification Email"
                      value={formData.notificationEmail}
                      onChange={(e) =>
                        handleInputChange("notificationEmail", e.target.value)
                      }
                      placeholder="team-notifications@company.com"
                    />
                  </Stack>
                </CardContent>
              </Card>
            </Stack>
          </TabPanel>

          <TabPanel value={activeTab} index={1}>
            <Stack spacing={3}>
              {/* Team Members */}
              <Card>
                <CardContent>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      mb: 1,
                    }}
                  >
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      Team Members ({teamMembers.length})
                    </Typography>
                    <Button
                      variant="contained"
                      startIcon={<AddIcon />}
                      onClick={() => setShowAddMemberDialog(true)}
                    >
                      Add Members
                    </Button>
                  </Box>

                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Member</TableCell>
                          <TableCell>Role</TableCell>
                          <TableCell>Status</TableCell>
                          <TableCell align="center">Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {teamMembers.map((member) => (
                          <TableRow key={member.id}>
                            <TableCell>
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 2,
                                }}
                              >
                                <Avatar sx={{ width: 32, height: 32 }}>
                                  {member.name.charAt(0)}
                                </Avatar>
                                <Box>
                                  <Typography
                                    variant="body2"
                                    sx={{ fontWeight: 500 }}
                                  >
                                    {member.name}
                                  </Typography>
                                  <Typography
                                    variant="caption"
                                    color="text.secondary"
                                  >
                                    {member.email}
                                  </Typography>
                                </Box>
                              </Box>
                            </TableCell>
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
                                  member.status === "Active"
                                    ? "success"
                                    : "default"
                                }
                                variant="filled"
                              />
                            </TableCell>
                            <TableCell align="center">
                              <Button
                                size="small"
                                color="error"
                                onClick={() => handleRemoveMember(member.id)}
                              >
                                Remove
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </CardContent>
              </Card>
            </Stack>
          </TabPanel>
        </Box>

        {/* Right Panel - Actions */}
        <Box sx={{ flex: 1 }}>
          <Card sx={{ position: "sticky", top: 20 }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Actions
              </Typography>

              <Stack spacing={2}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSave}
                  fullWidth
                  size="large"
                >
                  Create Team
                </Button>
                <Button
                  variant="outlined"
                  onClick={handleCancel}
                  fullWidth
                  size="large"
                >
                  Cancel
                </Button>
              </Stack>

              <Divider sx={{ my: 2 }} />

              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Team Summary
              </Typography>

              <Stack spacing={1}>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography variant="body2" color="text.secondary">
                    Team Name:
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {formData.name || "Not set"}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography variant="body2" color="text.secondary">
                    Department:
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {formData.department || "Not set"}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography variant="body2" color="text.secondary">
                    Members:
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {teamMembers.length}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography variant="body2" color="text.secondary">
                    Status:
                  </Typography>
                  <Chip
                    label={formData.status}
                    size="small"
                    color={formData.status === "Active" ? "success" : "default"}
                    variant="filled"
                  />
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Box>
      </Box>

      {/* Add Members Dialog */}
      <Dialog
        open={showAddMemberDialog}
        onClose={() => setShowAddMemberDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Add Team Members
            </Typography>
            <IconButton onClick={() => setShowAddMemberDialog(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <List>
            {availableAgents.map((agent) => (
              <ListItem key={agent.id}>
                <Checkbox
                  checked={selectedAgents.includes(agent.id)}
                  onChange={() => handleAgentSelection(agent.id)}
                />
                <ListItemAvatar>
                  <Avatar>{agent.name.charAt(0)}</Avatar>
                </ListItemAvatar>
                <ListItemText primary={agent.name} secondary={agent.email} />
                <Chip
                  label={agent.role}
                  size="small"
                  color="primary"
                  variant="outlined"
                />
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowAddMemberDialog(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleAddMembers}
            disabled={selectedAgents.length === 0}
          >
            Add Selected ({selectedAgents.length})
          </Button>
        </DialogActions>
      </Dialog>

      {/* Success Dialog */}
      <Dialog open={showSuccess} onClose={() => {}}>
        <DialogContent sx={{ textAlign: "center", p: 4 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Team Created Successfully!
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Your team has been created and is ready to use.
          </Typography>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default CreateTeamPage;
