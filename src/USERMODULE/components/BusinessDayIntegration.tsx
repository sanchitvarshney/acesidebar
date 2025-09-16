import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Tabs,
  Tab,
  IconButton,
  Tooltip,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Avatar,
  Paper,
  Switch,
  FormControlLabel,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import {
  Business,
  Schedule,
  Settings,
  CalendarToday,
  People,
  AccessTime,
  Dashboard,
  Assignment,
  Warning,
  CheckCircle,
  Info,
  Refresh,
  AutoAwesome,
} from "@mui/icons-material";

// Import the business day organization components
import BusinessDayOrganization from "./BusinessDayOrganization";
import BusinessDaySettings from "./BusinessDaySettings";
import TicketScheduler from "./TicketScheduler";
import BusinessHoursManager from "./BusinessHoursManager";

interface BusinessDayIntegrationProps {
  onTicketSelect?: (ticket: any) => void;
  onBusinessDayUpdate?: (businessDay: any) => void;
  onSettingsUpdate?: (settings: any) => void;
}

const BusinessDayIntegration: React.FC<BusinessDayIntegrationProps> = ({
  onTicketSelect,
  onBusinessDayUpdate,
  onSettingsUpdate,
}) => {
  const [activeTab, setActiveTab] = useState(0);
  const [isQuickSettingsOpen, setIsQuickSettingsOpen] = useState(false);
  const [isHelpDialogOpen, setIsHelpDialogOpen] = useState(false);
  const [businessDayStats, setBusinessDayStats] = useState({
    totalBusinessDays: 3,
    activeBusinessDays: 2,
    totalTickets: 45,
    scheduledTickets: 32,
    overdueTickets: 3,
    completedToday: 12,
  });

  const [recentActivity, setRecentActivity] = useState([
    {
      id: "1",
      type: "ticket_assigned",
      message: "Ticket #T-001 assigned to John Doe",
      timestamp: "2 minutes ago",
      icon: <Assignment />,
      color: "#1976d2",
    },
    {
      id: "2",
      type: "business_day_updated",
      message: "Support Team business hours updated",
      timestamp: "15 minutes ago",
      icon: <Business />,
      color: "#2e7d32",
    },
    {
      id: "3",
      type: "ticket_scheduled",
      message: "Ticket #T-002 scheduled for tomorrow 10:00 AM",
      timestamp: "1 hour ago",
      icon: <Schedule />,
      color: "#ff9800",
    },
    {
      id: "4",
      type: "holiday_added",
      message: "New holiday 'Company Anniversary' added",
      timestamp: "2 hours ago",
      icon: <CalendarToday />,
      color: "#9c27b0",
    },
  ]);

  const tabs = [
    { label: "Dashboard", icon: <Dashboard />, component: "dashboard" },
    { label: "Calendar", icon: <CalendarToday />, component: "calendar" },
    { label: "Scheduler", icon: <Schedule />, component: "scheduler" },
    { label: "Settings", icon: <Settings />, component: "settings" },
    { label: "Hours", icon: <AccessTime />, component: "hours" },
  ];

  const renderDashboard = () => (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={3}>
        {/* Stats Cards */}
        <Grid size={{ xs: 12, md: 3 }}>
          <Card>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Business color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Business Days</Typography>
              </Box>
              <Typography variant="h4" color="primary">
                {businessDayStats.activeBusinessDays}/
                {businessDayStats.totalBusinessDays}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Active Business Days
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 3 }}>
          <Card>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Assignment color="success" sx={{ mr: 1 }} />
                <Typography variant="h6">Tickets</Typography>
              </Box>
              <Typography variant="h4" color="success.main">
                {businessDayStats.scheduledTickets}/
                {businessDayStats.totalTickets}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Scheduled Today
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 3 }}>
          <Card>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Warning color="warning" sx={{ mr: 1 }} />
                <Typography variant="h6">Overdue</Typography>
              </Box>
              <Typography variant="h4" color="warning.main">
                {businessDayStats.overdueTickets}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Overdue Tickets
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 3 }}>
          <Card>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <CheckCircle color="info" sx={{ mr: 1 }} />
                <Typography variant="h6">Completed</Typography>
              </Box>
              <Typography variant="h4" color="info.main">
                {businessDayStats.completedToday}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Completed Today
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Quick Actions */}
        <Grid size={{ xs: 12, md: 3 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Quick Actions
              </Typography>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12 }}>
                  <Button
                    variant="contained"
                    fullWidth
                    startIcon={<AutoAwesome />}
                    onClick={() => setActiveTab(2)}
                  >
                    Auto-Schedule
                  </Button>
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <Button
                    variant="outlined"
                    fullWidth
                    startIcon={<People />}
                    onClick={() => setActiveTab(2)}
                  >
                    Assign Tickets
                  </Button>
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <Button
                    variant="outlined"
                    fullWidth
                    startIcon={<CalendarToday />}
                    onClick={() => setActiveTab(1)}
                  >
                    View Calendar
                  </Button>
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <Button
                    variant="outlined"
                    fullWidth
                    startIcon={<Settings />}
                    onClick={() => setActiveTab(3)}
                  >
                    Settings
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Activity */}
        <Grid size={{ xs: 12, md: 3 }}>
          <Card>
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <Typography variant="h6">Recent Activity</Typography>
                <IconButton size="small">
                  <Refresh />
                </IconButton>
              </Box>
              <List>
                {recentActivity.map((activity) => (
                  <ListItem key={activity.id} divider>
                    <ListItemIcon>
                      <Avatar
                        sx={{ bgcolor: activity.color, width: 32, height: 32 }}
                      >
                        {activity.icon}
                      </Avatar>
                    </ListItemIcon>
                    <ListItemText
                      primary={activity.message}
                      secondary={activity.timestamp}
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Business Day Overview */}
        <Grid size={{ xs: 12 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Business Day Overview
              </Typography>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 4 }}>
                  <Paper sx={{ p: 2, textAlign: "center" }}>
                    <Typography variant="h4" color="primary">
                      {businessDayStats.activeBusinessDays}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Active Business Days
                    </Typography>
                  </Paper>
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <Paper sx={{ p: 2, textAlign: "center" }}>
                    <Typography variant="h4" color="success.main">
                      {Math.round(
                        (businessDayStats.scheduledTickets /
                          businessDayStats.totalTickets) *
                          100
                      )}
                      %
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Scheduling Rate
                    </Typography>
                  </Paper>
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <Paper sx={{ p: 2, textAlign: "center" }}>
                    <Typography variant="h4" color="warning.main">
                      {businessDayStats.overdueTickets}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Overdue Tickets
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );

  const renderTabContent = () => {
    switch (tabs[activeTab].component) {
      case "dashboard":
        return renderDashboard();
      case "calendar":
        return (
          <BusinessDayOrganization
            onTicketSelect={onTicketSelect}
            onBusinessDayUpdate={onBusinessDayUpdate}
          />
        );
      case "scheduler":
        return (
          <TicketScheduler
            onTicketUpdate={onTicketSelect}
            onScheduleUpdate={onBusinessDayUpdate}
          />
        );
      case "settings":
        return <BusinessDaySettings onSave={onSettingsUpdate} />;
      case "hours":
        return (
          <BusinessHoursManager
            onBusinessHoursUpdate={onBusinessDayUpdate}
            onHolidayUpdate={onBusinessDayUpdate}
          />
        );
      default:
        return renderDashboard();
    }
  };

  return (
    <Box
      sx={{
        height: "calc(100vh - 96px)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          borderBottom: 1,
          borderColor: "divider",
          bgcolor: "background.paper",
        }}
      >
        <Box
          sx={{
            px: 3,
            py: 2,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Business color="primary" />
            <Typography variant="h5">Business Day Organization</Typography>
            <Chip label="Beta" color="primary" size="small" />
          </Box>

          <Box sx={{ display: "flex", gap: 1 }}>
            <Tooltip title="Quick Settings">
              <IconButton onClick={() => setIsQuickSettingsOpen(true)}>
                <Settings />
              </IconButton>
            </Tooltip>
            <Tooltip title="Help">
              <IconButton onClick={() => setIsHelpDialogOpen(true)}>
                <Info />
              </IconButton>
            </Tooltip>
            <Tooltip title="Refresh">
              <IconButton>
                <Refresh />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        <Tabs
          value={activeTab}
          onChange={(_, newValue) => setActiveTab(newValue)}
          sx={{ px: 3 }}
        >
          {tabs.map((tab, index) => (
            <Tab
              key={index}
              label={tab.label}
              icon={tab.icon}
              iconPosition="start"
            />
          ))}
        </Tabs>
      </Box>

      {/* Main Content */}
      <Box sx={{ maxHeight: "calc(100vh - 198px)", overflow: "auto" }}>{renderTabContent()}</Box>

      {/* Quick Settings Dialog */}
      <Dialog
        open={isQuickSettingsOpen}
        onClose={() => setIsQuickSettingsOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Quick Settings</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <FormControlLabel
              control={<Switch defaultChecked />}
              label="Auto-schedule tickets"
            />
            <FormControlLabel
              control={<Switch defaultChecked />}
              label="Send notifications"
            />
            <FormControlLabel
              control={<Switch />}
              label="Enable holiday mode"
            />
            <FormControlLabel
              control={<Switch defaultChecked />}
              label="Show business day indicators"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsQuickSettingsOpen(false)}>Cancel</Button>
          <Button variant="contained">Save</Button>
        </DialogActions>
      </Dialog>

      {/* Help Dialog */}
      <Dialog
        open={isHelpDialogOpen}
        onClose={() => setIsHelpDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Business Day Organization Help</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Typography variant="h6" gutterBottom>
              Getting Started
            </Typography>
            <Typography variant="body1" paragraph>
              The Business Day Organization system helps you manage tickets
              across different business days, teams, and schedules. Here's how
              to use each section:
            </Typography>

            <Typography variant="h6" gutterBottom>
              Dashboard
            </Typography>
            <Typography variant="body1" paragraph>
              View overview statistics, recent activity, and quick actions for
              managing your business day operations.
            </Typography>

            <Typography variant="h6" gutterBottom>
              Calendar
            </Typography>
            <Typography variant="body1" paragraph>
              Visualize tickets and business days in a calendar format. Drag and
              drop tickets between business days.
            </Typography>

            <Typography variant="h6" gutterBottom>
              Scheduler
            </Typography>
            <Typography variant="body1" paragraph>
              Assign tickets to team members and schedule them for specific
              times within business days.
            </Typography>

            <Typography variant="h6" gutterBottom>
              Settings
            </Typography>
            <Typography variant="body1" paragraph>
              Configure business day settings, teams, notifications, and
              escalation rules.
            </Typography>

            <Typography variant="h6" gutterBottom>
              Hours
            </Typography>
            <Typography variant="body1" paragraph>
              Manage business hours, holidays, breaks, and special working
              hours.
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsHelpDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default BusinessDayIntegration;
