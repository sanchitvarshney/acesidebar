import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Tabs,
  Tab,
  IconButton,
  Tooltip,
  Chip,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Avatar,
  Divider,
  Paper,
  LinearProgress,
  Switch,
  FormControlLabel,
} from "@mui/material";
import {
  Business,
  Schedule,
  Settings,
  CalendarToday,
  People,
  Timer,
  AccessTime,
  Notifications,
  TrendingUp,
  Dashboard,
  Assignment,
  Group,
  Warning,
  CheckCircle,
  Info,
  Refresh,
  FilterList,
  ViewList,
  ViewModule,
  AutoAwesome,
  PlayArrow,
  Pause,
  Stop,
  Add,
  Edit,
  Delete,
  Save,
  Cancel,
} from "@mui/icons-material";

// Import the business day organization components
import BusinessDayIntegration from "./BusinessDayIntegration";

/**
 * Example component showing how to integrate Business Day Organization
 * with the existing ticket management system
 */
const BusinessDayExample: React.FC = () => {
  const [isBusinessDayOpen, setIsBusinessDayOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [businessDayStats, setBusinessDayStats] = useState({
    totalBusinessDays: 3,
    activeBusinessDays: 2,
    totalTickets: 45,
    scheduledTickets: 32,
    overdueTickets: 3,
    completedToday: 12,
  });

  // Sample ticket data
  const sampleTickets = [
    {
      id: "T-001",
      title: "Login issue resolution",
      priority: "high",
      status: "in-progress",
      assignee: "John Doe",
      dueDate: "2024-01-15",
      estimatedHours: 4,
      actualHours: 2,
      businessDay: "1",
      scheduledTime: "10:00",
    },
    {
      id: "T-002",
      title: "Database optimization",
      priority: "medium",
      status: "open",
      assignee: "Jane Smith",
      dueDate: "2024-01-16",
      estimatedHours: 8,
      actualHours: 0,
      businessDay: "2",
      scheduledTime: "14:00",
    },
  ];

  // Sample business day data
  const sampleBusinessDays = [
    {
      id: "1",
      name: "Support Team",
      startTime: "09:00",
      endTime: "17:00",
      isActive: true,
      workingDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      holidays: [],
      timezone: "UTC+5:30",
      maxTicketsPerDay: 50,
      currentTickets: 23,
      color: "#2566b0",
    },
    {
      id: "2",
      name: "Development Team",
      startTime: "10:00",
      endTime: "18:00",
      isActive: true,
      workingDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      holidays: [],
      timezone: "UTC+5:30",
      maxTicketsPerDay: 30,
      currentTickets: 15,
      color: "#2e7d32",
    },
  ];

  const handleTicketSelect = (ticket: any) => {
    setSelectedTicket(ticket);
    console.log("Selected ticket:", ticket);
  };

  const handleBusinessDayUpdate = (businessDay: any) => {
    console.log("Business day updated:", businessDay);
    // Update your business day data here
  };

  const handleSettingsUpdate = (settings: any) => {
    console.log("Settings updated:", settings);
    // Update your settings data here
  };

  return (
    <Box sx={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Main Ticket Management Interface */}
      <Box sx={{ flexGrow: 1, display: "flex" }}>
        {/* Left Sidebar - Existing Ticket List */}
        <Box sx={{ width: 400, borderRight: 1, borderColor: "divider", p: 2 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
            <Typography variant="h6">Tickets</Typography>
            <Button
              variant="contained"
              size="small"
              startIcon={<Business />}
              onClick={() => setIsBusinessDayOpen(true)}
            >
              Business Day
            </Button>
          </Box>

          {/* Business Day Stats */}
          <Card sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="subtitle2" gutterBottom>
                Business Day Overview
              </Typography>
              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                <Typography variant="body2">Active Days</Typography>
                <Typography variant="body2" fontWeight="bold">
                  {businessDayStats.activeBusinessDays}/{businessDayStats.totalBusinessDays}
                </Typography>
              </Box>
              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                <Typography variant="body2">Scheduled</Typography>
                <Typography variant="body2" fontWeight="bold">
                  {businessDayStats.scheduledTickets}/{businessDayStats.totalTickets}
                </Typography>
              </Box>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant="body2">Overdue</Typography>
                <Typography variant="body2" fontWeight="bold" color="error">
                  {businessDayStats.overdueTickets}
                </Typography>
              </Box>
            </CardContent>
          </Card>

          {/* Ticket List */}
          <List>
            {sampleTickets.map((ticket) => (
              <ListItem
                key={ticket.id}
                component="div"
                onClick={() => handleTicketSelect(ticket)}
                sx={{
                  border: "1px solid #e0e0e0",
                  borderRadius: 2,
                  mb: 1,
                  cursor: "pointer",
                  "&:hover": { backgroundColor: "#f5f5f5" },
                }}
              >
                <ListItemIcon>
                  <Avatar sx={{ bgcolor: ticket.priority === "high" ? "#f44336" : "#2196f3" }}>
                    {ticket.priority.charAt(0).toUpperCase()}
                  </Avatar>
                </ListItemIcon>
                <ListItemText
                  primary={ticket.title}
                  secondary={
                    <Box>
                      <Typography variant="caption" display="block">
                        {ticket.assignee} • {ticket.scheduledTime || "Not scheduled"}
                      </Typography>
                      <Box sx={{ display: "flex", gap: 0.5, mt: 0.5 }}>
                        <Chip
                          label={ticket.priority}
                          size="small"
                          sx={{
                            bgcolor: ticket.priority === "high" ? "#f44336" : "#2196f3",
                            color: "white",
                          }}
                        />
                        <Chip
                          label={ticket.status}
                          size="small"
                          variant="outlined"
                        />
                      </Box>
                    </Box>
                  }
                />
              </ListItem>
            ))}
          </List>
        </Box>

        {/* Right Side - Ticket Details */}
        <Box sx={{ flexGrow: 1, p: 3 }}>
          {selectedTicket ? (
            <Card>
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  {selectedTicket.title}
                </Typography>
                <Typography variant="body1" color="text.secondary" paragraph>
                  Ticket ID: {selectedTicket.id}
                </Typography>
                
                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 3 }}>
                  <Box>
                    <Typography variant="subtitle2" gutterBottom>
                      Priority
                    </Typography>
                    <Chip
                      label={selectedTicket.priority}
                      sx={{
                        bgcolor: selectedTicket.priority === "high" ? "#f44336" : "#2196f3",
                        color: "white",
                      }}
                    />
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" gutterBottom>
                      Status
                    </Typography>
                    <Chip
                      label={selectedTicket.status}
                      variant="outlined"
                    />
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" gutterBottom>
                      Assignee
                    </Typography>
                    <Typography variant="body1">{selectedTicket.assignee}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" gutterBottom>
                      Due Date
                    </Typography>
                    <Typography variant="body1">{selectedTicket.dueDate}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" gutterBottom>
                      Business Day
                    </Typography>
                    <Typography variant="body1">
                      {sampleBusinessDays.find(bd => bd.id === selectedTicket.businessDay)?.name || "Not assigned"}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" gutterBottom>
                      Scheduled Time
                    </Typography>
                    <Typography variant="body1">
                      {selectedTicket.scheduledTime || "Not scheduled"}
                    </Typography>
                  </Box>
                </Box>

                <Divider sx={{ my: 3 }} />

                <Box sx={{ display: "flex", gap: 2 }}>
                  <Button
                    variant="contained"
                    startIcon={<Schedule />}
                    onClick={() => setIsBusinessDayOpen(true)}
                  >
                    Schedule Ticket
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<Assignment />}
                    onClick={() => setIsBusinessDayOpen(true)}
                  >
                    Assign to Team
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<Business />}
                    onClick={() => setIsBusinessDayOpen(true)}
                  >
                    Manage Business Day
                  </Button>
                </Box>
              </CardContent>
            </Card>
          ) : (
            <Box sx={{ textAlign: "center", py: 8 }}>
              <Business sx={{ fontSize: 64, color: "text.secondary", mb: 2 }} />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Select a ticket to view details
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Or open the Business Day Organization to manage schedules and assignments
              </Typography>
              <Button
                variant="contained"
                startIcon={<Business />}
                onClick={() => setIsBusinessDayOpen(true)}
                sx={{ mt: 2 }}
              >
                Open Business Day Organization
              </Button>
            </Box>
          )}
        </Box>
      </Box>

      {/* Business Day Organization Dialog */}
      <Dialog
        open={isBusinessDayOpen}
        onClose={() => setIsBusinessDayOpen(false)}
        maxWidth="xl"
        fullWidth
        PaperProps={{
          sx: { height: "90vh" }
        }}
      >
        <DialogTitle>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Typography variant="h6">Business Day Organization</Typography>
            <IconButton onClick={() => setIsBusinessDayOpen(false)}>
              <Cancel />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ p: 0 }}>
          <BusinessDayIntegration
            onTicketSelect={handleTicketSelect}
            onBusinessDayUpdate={handleBusinessDayUpdate}
            onSettingsUpdate={handleSettingsUpdate}
          />
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default BusinessDayExample;
