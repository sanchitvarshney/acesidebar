import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Avatar,
  Badge,
  Tooltip,
  Paper,
  Tabs,
  Tab,
  Alert,
  LinearProgress,
} from "@mui/material";
import {
  CalendarToday,
  Schedule,
  Business,
  People,
  Settings,
  Add,
  Edit,
  Delete,
  CheckCircle,
  Warning,
  Error,
  Info,
  AccessTime,
  Event,
  Assignment,
  Group,
  Notifications,
  Refresh,
  FilterList,
  ViewList,
  ViewModule,
  Today,
  DateRange,
  Timer,
  PlayArrow,
  Pause,
  Stop,
} from "@mui/icons-material";
import { DatePicker, TimePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

interface BusinessDay {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
  isActive: boolean;
  workingDays: string[];
  holidays: string[];
  timezone: string;
  maxTicketsPerDay: number;
  currentTickets: number;
  color: string;
}

interface Ticket {
  id: string;
  title: string;
  priority: "low" | "medium" | "high" | "urgent";
  status: "open" | "in-progress" | "resolved" | "closed";
  assignee: string;
  dueDate: string;
  estimatedHours: number;
  actualHours: number;
  businessDay: string;
  scheduledTime?: string;
}

interface BusinessDayOrganizationProps {
  onTicketSelect?: (ticket: Ticket) => void;
  onBusinessDayUpdate?: (businessDay: BusinessDay) => void;
}

const BusinessDayOrganization: React.FC<BusinessDayOrganizationProps> = ({
  onTicketSelect,
  onBusinessDayUpdate,
}) => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [viewMode, setViewMode] = useState<"calendar" | "list">("calendar");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [businessDays, setBusinessDays] = useState<BusinessDay[]>([
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
      color: "#1976d2",
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
  ]);

  const [tickets, setTickets] = useState<Ticket[]>([
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
  ]);

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isTicketDialogOpen, setIsTicketDialogOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [isBusinessDayDialogOpen, setIsBusinessDayDialogOpen] = useState(false);
  const [selectedBusinessDay, setSelectedBusinessDay] = useState<BusinessDay | null>(null);

  const priorityColors = {
    low: "#4caf50",
    medium: "#ff9800",
    high: "#f44336",
    urgent: "#9c27b0",
  };

  const statusColors = {
    open: "#2196f3",
    "in-progress": "#ff9800",
    resolved: "#4caf50",
    closed: "#9e9e9e",
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "urgent":
        return <Error fontSize="small" />;
      case "high":
        return <Warning fontSize="small" />;
      case "medium":
        return <Info fontSize="small" />;
      case "low":
        return <CheckCircle fontSize="small" />;
      default:
        return <Info fontSize="small" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "open":
        return <PlayArrow fontSize="small" />;
      case "in-progress":
        return <Timer fontSize="small" />;
      case "resolved":
        return <CheckCircle fontSize="small" />;
      case "closed":
        return <Stop fontSize="small" />;
      default:
        return <Info fontSize="small" />;
    }
  };

  const handleTicketClick = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setIsTicketDialogOpen(true);
    onTicketSelect?.(ticket);
  };

  const handleBusinessDayClick = (businessDay: BusinessDay) => {
    setSelectedBusinessDay(businessDay);
    setIsBusinessDayDialogOpen(true);
  };

  const handleBusinessDayUpdate = (updatedBusinessDay: BusinessDay) => {
    setBusinessDays(prev =>
      prev.map(bd => bd.id === updatedBusinessDay.id ? updatedBusinessDay : bd)
    );
    onBusinessDayUpdate?.(updatedBusinessDay);
    setIsBusinessDayDialogOpen(false);
  };

  const renderCalendarView = () => (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={3}>
        {/* Calendar Header */}
        <Grid size={{ xs: 12}}>
          <Card>
            <CardContent>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                <Typography variant="h5" component="h2">
                  Business Day Calendar
                </Typography>
                <Box sx={{ display: "flex", gap: 1 }}>
                  <Button
                    variant="outlined"
                    startIcon={<Today />}
                    onClick={() => setSelectedDate(new Date())}
                  >
                    Today
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<DateRange />}
                  >
                    Date Range
                  </Button>
                </Box>
              </Box>
              
              {/* Date Navigation */}
              <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 2, mb: 3 }}>
                <IconButton onClick={() => setSelectedDate(new Date(selectedDate.getTime() - 24 * 60 * 60 * 1000))}>
                  ←
                </IconButton>
                <Typography variant="h6">
                  {selectedDate.toLocaleDateString("en-US", { 
                    weekday: "long", 
                    year: "numeric", 
                    month: "long", 
                    day: "numeric" 
                  })}
                </Typography>
                <IconButton onClick={() => setSelectedDate(new Date(selectedDate.getTime() + 24 * 60 * 60 * 1000))}>
                  →
                </IconButton>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Business Days Overview */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Business Days
              </Typography>
              <Grid container spacing={2}>
                {businessDays.map((businessDay) => (
                  <Grid size={{ xs: 12}} key={businessDay.id}>
                    <Card
                      sx={{
                        border: `2px solid ${businessDay.color}`,
                        cursor: "pointer",
                        "&:hover": { boxShadow: 3 },
                      }}
                      onClick={() => handleBusinessDayClick(businessDay)}
                    >
                      <CardContent>
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                          <Typography variant="h6" sx={{ color: businessDay.color }}>
                            {businessDay.name}
                          </Typography>
                          <Chip
                            label={businessDay.isActive ? "Active" : "Inactive"}
                            color={businessDay.isActive ? "success" : "default"}
                            size="small"
                          />
                        </Box>
                        
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                          <AccessTime fontSize="small" color="action" />
                          <Typography variant="body2">
                            {businessDay.startTime} - {businessDay.endTime}
                          </Typography>
                        </Box>
                        
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                          <Business fontSize="small" color="action" />
                          <Typography variant="body2">
                            {businessDay.workingDays.join(", ")}
                          </Typography>
                        </Box>
                        
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <Typography variant="body2" color="text.secondary">
                            Tickets: {businessDay.currentTickets}/{businessDay.maxTicketsPerDay}
                          </Typography>
                          <LinearProgress
                            variant="determinate"
                            value={(businessDay.currentTickets / businessDay.maxTicketsPerDay) * 100}
                            sx={{ width: 60, height: 6, borderRadius: 3 }}
                          />
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Quick Stats */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Today's Overview
              </Typography>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Total Tickets
                </Typography>
                <Typography variant="h4" color="primary">
                  {tickets.length}
                </Typography>
              </Box>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Active Business Days
                </Typography>
                <Typography variant="h4" color="success.main">
                  {businessDays.filter(bd => bd.isActive).length}
                </Typography>
              </Box>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Tickets in Progress
                </Typography>
                <Typography variant="h4" color="warning.main">
                  {tickets.filter(t => t.status === "in-progress").length}
                </Typography>
              </Box>
              
              <Divider sx={{ my: 2 }} />
              
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                <Button
                  variant="contained"
                  startIcon={<Add />}
                  onClick={() => setIsBusinessDayDialogOpen(true)}
                  fullWidth
                >
                  Add Business Day
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<Settings />}
                  onClick={() => setIsSettingsOpen(true)}
                  fullWidth
                >
                  Settings
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Tickets Timeline */}
        <Grid size={{ xs: 12}}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Scheduled Tickets
              </Typography>
              
              {tickets.length === 0 ? (
                <Box sx={{ textAlign: "center", py: 4 }}>
                  <Event sx={{ fontSize: 48, color: "text.secondary", mb: 2 }} />
                  <Typography variant="h6" color="text.secondary">
                    No tickets scheduled for today
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Create a new ticket or assign existing ones to business days
                  </Typography>
                </Box>
              ) : (
                <List>
                  {tickets.map((ticket) => (
                    <ListItem
                      key={ticket.id}
                      sx={{
                        border: "1px solid #e0e0e0",
                        borderRadius: 2,
                        mb: 1,
                        cursor: "pointer",
                        "&:hover": { backgroundColor: "#f5f5f5" },
                      }}
                      onClick={() => handleTicketClick(ticket)}
                    >
                      <ListItemIcon>
                        <Avatar sx={{ bgcolor: priorityColors[ticket.priority] }}>
                          {getPriorityIcon(ticket.priority)}
                        </Avatar>
                      </ListItemIcon>
                      
                      <ListItemText
                        primary={
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <Typography variant="subtitle1" fontWeight="medium">
                              {ticket.title}
                            </Typography>
                            <Chip
                              label={ticket.priority}
                              size="small"
                              sx={{ bgcolor: priorityColors[ticket.priority], color: "white" }}
                            />
                            <Chip
                              label={ticket.status}
                              size="small"
                              sx={{ bgcolor: statusColors[ticket.status], color: "white" }}
                            />
                          </Box>
                        }
                        secondary={
                          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mt: 1 }}>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                              <People fontSize="small" color="action" />
                              <Typography variant="body2">{ticket.assignee}</Typography>
                            </Box>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                              <Schedule fontSize="small" color="action" />
                              <Typography variant="body2">
                                {ticket.scheduledTime || "Not scheduled"}
                              </Typography>
                            </Box>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                              <Timer fontSize="small" color="action" />
                              <Typography variant="body2">
                                {ticket.actualHours}/{ticket.estimatedHours}h
                              </Typography>
                            </Box>
                          </Box>
                        }
                      />
                      
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Tooltip title="Business Day">
                          <Chip
                            label={businessDays.find(bd => bd.id === ticket.businessDay)?.name || "Unknown"}
                            size="small"
                            color="primary"
                            variant="outlined"
                          />
                        </Tooltip>
                        <IconButton size="small">
                          <Edit fontSize="small" />
                        </IconButton>
                      </Box>
                    </ListItem>
                  ))}
                </List>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );

  const renderListView = () => (
    <Box sx={{ p: 3 }}>
      <Card>
        <CardContent>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
            <Typography variant="h5">Business Day Management</Typography>
            <Box sx={{ display: "flex", gap: 1 }}>
              <Button
                variant="outlined"
                startIcon={<FilterList />}
              >
                Filter
              </Button>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => setIsBusinessDayDialogOpen(true)}
              >
                Add Business Day
              </Button>
            </Box>
          </Box>
          
          <Grid container spacing={3}>
            {businessDays.map((businessDay) => (
              <Grid size={{ xs: 12, md: 6 }} key={businessDay.id}>
                <Card
                  sx={{
                    height: "100%",
                    border: `2px solid ${businessDay.color}`,
                    cursor: "pointer",
                    "&:hover": { boxShadow: 3 },
                  }}
                  onClick={() => handleBusinessDayClick(businessDay)}
                >
                  <CardContent>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                      <Typography variant="h6" sx={{ color: businessDay.color }}>
                        {businessDay.name}
                      </Typography>
                      <Box sx={{ display: "flex", gap: 1 }}>
                        <Chip
                          label={businessDay.isActive ? "Active" : "Inactive"}
                          color={businessDay.isActive ? "success" : "default"}
                          size="small"
                        />
                        <IconButton size="small">
                          <Edit fontSize="small" />
                        </IconButton>
                      </Box>
                    </Box>
                    
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Working Hours
                      </Typography>
                      <Typography variant="body1">
                        {businessDay.startTime} - {businessDay.endTime}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Working Days
                      </Typography>
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                        {businessDay.workingDays.map((day) => (
                          <Chip key={day} label={day} size="small" variant="outlined" />
                        ))}
                      </Box>
                    </Box>
                    
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Ticket Capacity
                      </Typography>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <LinearProgress
                          variant="determinate"
                          value={(businessDay.currentTickets / businessDay.maxTicketsPerDay) * 100}
                          sx={{ flexGrow: 1, height: 8, borderRadius: 4 }}
                        />
                        <Typography variant="body2">
                          {businessDay.currentTickets}/{businessDay.maxTicketsPerDay}
                        </Typography>
                      </Box>
                    </Box>
                    
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <Typography variant="body2" color="text.secondary">
                        Timezone: {businessDay.timezone}
                      </Typography>
                      <IconButton size="small" color="error">
                        <Delete fontSize="small" />
                      </IconButton>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ maxHeight: "calc(100vh - 245px)", display: "flex", flexDirection: "column" }}>
        {/* Header */}
        <Box sx={{ borderBottom: 1, borderColor: "divider", bgcolor: "background.paper" }}>
          <Tabs
            value={selectedTab}
            onChange={(_, newValue) => setSelectedTab(newValue)}
            sx={{ px: 3 }}
          >
            <Tab label="Calendar View" icon={<CalendarToday />} />
            <Tab label="List View" icon={<ViewList />} />
            <Tab label="Settings" icon={<Settings />} />
          </Tabs>
        </Box>

        {/* View Mode Toggle */}
        <Box sx={{ px: 3, py: 2, borderBottom: 1, borderColor: "divider", bgcolor: "background.paper" }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Box sx={{ display: "flex", gap: 1 }}>
              <Button
                variant={viewMode === "calendar" ? "contained" : "outlined"}
                startIcon={<CalendarToday />}
                onClick={() => setViewMode("calendar")}
                size="small"
              >
                Calendar
              </Button>
              <Button
                variant={viewMode === "list" ? "contained" : "outlined"}
                startIcon={<ViewList />}
                onClick={() => setViewMode("list")}
                size="small"
              >
                List
              </Button>
            </Box>
            
            <Box sx={{ display: "flex", gap: 1 }}>
              <IconButton>
                <Refresh />
              </IconButton>
              <IconButton>
                <Notifications />
              </IconButton>
            </Box>
          </Box>
        </Box>

        {/* Main Content */}
        <Box sx={{ flexGrow: 1, overflow: "auto" }}>
          {selectedTab === 0 && renderCalendarView()}
          {selectedTab === 1 && renderListView()}
          {selectedTab === 2 && (
            <Box sx={{ p: 3 }}>
              <Card>
                <CardContent>
                  <Typography variant="h5" gutterBottom>
                    Business Day Settings
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Configure global settings for business day organization, including default working hours, 
                    timezone settings, and notification preferences.
                  </Typography>
                  <Box sx={{ mt: 3 }}>
                    <Button variant="contained" startIcon={<Settings />}>
                      Open Settings
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Box>
          )}
        </Box>

        {/* Ticket Details Dialog */}
        <Dialog
          open={isTicketDialogOpen}
          onClose={() => setIsTicketDialogOpen(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              {selectedTicket && getPriorityIcon(selectedTicket.priority)}
              <Typography variant="h6">
                {selectedTicket?.title}
              </Typography>
            </Box>
          </DialogTitle>
          <DialogContent>
            {selectedTicket && (
              <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Priority
                  </Typography>
                  <Chip
                    label={selectedTicket.priority}
                    sx={{ bgcolor: priorityColors[selectedTicket.priority], color: "white" }}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Status
                  </Typography>
                  <Chip
                    label={selectedTicket.status}
                    sx={{ bgcolor: statusColors[selectedTicket.status], color: "white" }}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Assignee
                  </Typography>
                  <Typography variant="body1">{selectedTicket.assignee}</Typography>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Due Date
                  </Typography>
                  <Typography variant="body1">{selectedTicket.dueDate}</Typography>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Estimated Hours
                  </Typography>
                  <Typography variant="body1">{selectedTicket.estimatedHours}h</Typography>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Actual Hours
                  </Typography>
                  <Typography variant="body1">{selectedTicket.actualHours}h</Typography>
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Business Day
                  </Typography>
                  <Typography variant="body1">
                    {businessDays.find(bd => bd.id === selectedTicket.businessDay)?.name || "Unknown"}
                  </Typography>
                </Grid>
              </Grid>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setIsTicketDialogOpen(false)}>Close</Button>
            <Button variant="contained">Edit Ticket</Button>
          </DialogActions>
        </Dialog>

        {/* Business Day Dialog */}
        <Dialog
          open={isBusinessDayDialogOpen}
          onClose={() => setIsBusinessDayDialogOpen(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
            {selectedBusinessDay ? "Edit Business Day" : "Add New Business Day"}
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label="Business Day Name"
                  defaultValue={selectedBusinessDay?.name || ""}
                />
              </Grid>
              <Grid size={{ xs: 6 }}>
                <TimePicker
                  label="Start Time"
                  defaultValue={selectedBusinessDay?.startTime ? dayjs(`2000-01-01T${selectedBusinessDay.startTime}`) : dayjs()}
                />
              </Grid>
              <Grid size={{ xs: 6 }}>
                <TimePicker
                  label="End Time"
                  defaultValue={selectedBusinessDay?.endTime ? dayjs(`2000-01-01T${selectedBusinessDay.endTime}`) : dayjs()}
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <FormControl fullWidth>
                  <InputLabel>Timezone</InputLabel>
                  <Select
                    defaultValue={selectedBusinessDay?.timezone || "UTC+5:30"}
                  >
                    <MenuItem value="UTC+5:30">UTC+5:30 (IST)</MenuItem>
                    <MenuItem value="UTC+0:00">UTC+0:00 (GMT)</MenuItem>
                    <MenuItem value="UTC-5:00">UTC-5:00 (EST)</MenuItem>
                    <MenuItem value="UTC-8:00">UTC-8:00 (PST)</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label="Max Tickets Per Day"
                  type="number"
                  defaultValue={selectedBusinessDay?.maxTicketsPerDay || 50}
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <FormControlLabel
                  control={<Switch defaultChecked={selectedBusinessDay?.isActive || true} />}
                  label="Active"
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setIsBusinessDayDialogOpen(false)}>Cancel</Button>
            <Button variant="contained">
              {selectedBusinessDay ? "Update" : "Create"}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </LocalizationProvider>
  );
};

export default BusinessDayOrganization;

