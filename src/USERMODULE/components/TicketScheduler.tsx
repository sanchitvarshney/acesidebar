import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Avatar,
  Badge,
  Tooltip,
  Paper,
  Tabs,
  Tab,
  Stepper,
  Step,
  StepLabel,
  Divider,
  Alert,
  LinearProgress,
  Checkbox,
  FormControlLabel,
  RadioGroup,
  Radio,
  FormLabel,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Switch,
} from "@mui/material";
import {
  ExpandMore,
  Add,
  Edit,
  Delete,
  Save,
  Cancel,
  Schedule,
  Assignment,
  People,
  Timer,
  CalendarToday,
  AccessTime,
  Business,
  Warning,
  CheckCircle,
  Info,
  PlayArrow,
  Pause,
  Stop,
  Refresh,
  FilterList,
  ViewList,
  ViewModule,
  DragIndicator,
  AutoAwesome,
  TrendingUp,
  Notifications,
  Settings,
  DateRange,
} from "@mui/icons-material";
import { DatePicker, TimePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
// import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

interface Ticket {
  id: string;
  title: string;
  description: string;
  priority: "low" | "medium" | "high" | "urgent";
  status: "open" | "in-progress" | "resolved" | "closed";
  assignee: string;
  assigneeId: string;
  dueDate: string;
  estimatedHours: number;
  actualHours: number;
  businessDay: string;
  scheduledTime?: string;
  tags: string[];
  category: string;
  subcategory: string;
  createdAt: string;
  updatedAt: string;
}

interface BusinessDay {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
  isActive: boolean;
  workingDays: string[];
  timezone: string;
  maxTicketsPerDay: number;
  currentTickets: number;
  color: string;
  teamMembers: string[];
}

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  currentTickets: number;
  maxTickets: number;
  workingHours: {
    start: string;
    end: string;
  };
  skills: string[];
  availability: "available" | "busy" | "offline";
}

interface TicketSchedulerProps {
  tickets?: Ticket[];
  businessDays?: BusinessDay[];
  teamMembers?: TeamMember[];
  onTicketUpdate?: (ticket: Ticket) => void;
  onScheduleUpdate?: (schedules: any[]) => void;
}

const TicketScheduler: React.FC<TicketSchedulerProps> = ({
  tickets = [],
  businessDays = [],
  teamMembers = [],
  onTicketUpdate,
  onScheduleUpdate,
}) => {
  const [activeTab, setActiveTab] = useState(0);
  const [viewMode, setViewMode] = useState<"calendar" | "list" | "kanban">("calendar");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isAssignmentDialogOpen, setIsAssignmentDialogOpen] = useState(false);
  const [isSchedulingDialogOpen, setIsSchedulingDialogOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [selectedBusinessDay, setSelectedBusinessDay] = useState<BusinessDay | null>(null);
  const [selectedTeamMember, setSelectedTeamMember] = useState<TeamMember | null>(null);
  const [schedules, setSchedules] = useState<any[]>([]);
  const [filters, setFilters] = useState({
    priority: "",
    status: "",
    assignee: "",
    businessDay: "",
    dateRange: "",
  });

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

  const availabilityColors = {
    available: "#4caf50",
    busy: "#ff9800",
    offline: "#9e9e9e",
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "urgent":
        return <Warning fontSize="small" />;
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

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const { source, destination, draggableId } = result;
    
    if (source.droppableId === destination.droppableId) {
      // Reordering within the same list
      const newSchedules = Array.from(schedules);
      const [reorderedItem] = newSchedules.splice(source.index, 1);
      newSchedules.splice(destination.index, 0, reorderedItem);
      setSchedules(newSchedules);
    } else {
      // Moving between different lists
      const newSchedules = Array.from(schedules);
      const [movedItem] = newSchedules.splice(source.index, 1);
      movedItem.businessDay = destination.droppableId;
      newSchedules.splice(destination.index, 0, movedItem);
      setSchedules(newSchedules);
      onScheduleUpdate?.(newSchedules);
    }
  };

  const handleTicketAssignment = (ticket: Ticket, teamMember: TeamMember) => {
    const updatedTicket = {
      ...ticket,
      assignee: teamMember.name,
      assigneeId: teamMember.id,
    };
    onTicketUpdate?.(updatedTicket);
    setIsAssignmentDialogOpen(false);
  };

  const handleTicketScheduling = (ticket: Ticket, businessDay: BusinessDay, scheduledTime: string) => {
    const updatedTicket = {
      ...ticket,
      businessDay: businessDay.id,
      scheduledTime,
    };
    onTicketUpdate?.(updatedTicket);
    setIsSchedulingDialogOpen(false);
  };

  const renderCalendarView = () => (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {/* Calendar Header */}
        <Box>
          <Card>
            <CardContent>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                <Typography variant="h5" component="h2">
                  Ticket Scheduler
                </Typography>
                <Box sx={{ display: "flex", gap: 1 }}>
                  <Button
                    variant="outlined"
                    startIcon={<CalendarToday />}
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
        </Box>

        {/* Business Days Timeline */}
        <Box>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Business Day Timeline
              </Typography>
              
              {/* <DragDropContext onDragEnd={handleDragEnd}> */}
                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 2 }}>
                  {businessDays.map((businessDay) => (
                    <Box key={businessDay.id}>
                      {/* <Droppable droppableId={businessDay.id}>
                        {(provided, snapshot) => ( */}
                          <Paper
                            sx={{
                              p: 2,
                              minHeight: 400,
                              border: `2px solid ${businessDay.color}`,
                              backgroundColor: "white",
                            }}
                          >
                            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                              <Typography variant="h6" sx={{ color: businessDay.color }}>
                                {businessDay.name}
                              </Typography>
                              <Chip
                                label={`${businessDay.currentTickets}/${businessDay.maxTicketsPerDay}`}
                                size="small"
                                color="primary"
                              />
                            </Box>
                            
                            <Box sx={{ mb: 2 }}>
                              <Typography variant="body2" color="text.secondary">
                                {businessDay.startTime} - {businessDay.endTime}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {businessDay.workingDays.join(", ")}
                              </Typography>
                            </Box>
                            
                            <Divider sx={{ my: 2 }} />
                            
                            <Typography variant="subtitle2" gutterBottom>
                              Scheduled Tickets
                            </Typography>
                            
                            {schedules
                              .filter(schedule => schedule.businessDay === businessDay.id)
                              .map((schedule, index) => (
                                // <Draggable
                                //   key={schedule.id}
                                //   draggableId={schedule.id}
                                //   index={index}
                                // >
                                //   {(provided, snapshot) => (
                                    <Card
                                      key={schedule.id}
                                      sx={{
                                        mb: 1,
                                        cursor: "grab",
                                        "&:hover": { boxShadow: 2 },
                                      }}
                                    >
                                      <CardContent sx={{ p: 2 }}>
                                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                          <Typography variant="subtitle2" noWrap>
                                            {schedule.title}
                                          </Typography>
                                          <Box sx={{ display: "flex", gap: 0.5 }}>
                        <Chip
                          label={schedule.priority}
                          size="small"
                          sx={{ bgcolor: priorityColors[schedule.priority as keyof typeof priorityColors], color: "white" }}
                        />
                        <Chip
                          label={schedule.status}
                          size="small"
                          sx={{ bgcolor: statusColors[schedule.status as keyof typeof statusColors], color: "white" }}
                        />
                                          </Box>
                                        </Box>
                                        
                                        <Typography variant="body2" color="text.secondary" noWrap>
                                          {schedule.assignee}
                                        </Typography>
                                        
                                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 1 }}>
                                          <Typography variant="caption" color="text.secondary">
                                            {schedule.scheduledTime || "Not scheduled"}
                                          </Typography>
                                          <Typography variant="caption" color="text.secondary">
                                            {schedule.estimatedHours}h
                                          </Typography>
                                        </Box>
                                      </CardContent>
                                    </Card>
                                //   )}
                                // </Draggable>
                              ))}
                            
                            {/* {provided.placeholder} */}
                          </Paper>
                        {/* )}
                      </Droppable> */}
                    </Box>
                  ))}
                </Box>
              {/* </DragDropContext> */}
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Box>
  );

  const renderListView = () => (
    <Box sx={{ p: 3 }}>
      <Card>
        <CardContent>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
            <Typography variant="h5">Ticket Assignment & Scheduling</Typography>
            <Box sx={{ display: "flex", gap: 1 }}>
              <Button
                variant="outlined"
                startIcon={<FilterList />}
              >
                Filter
              </Button>
              <Button
                variant="contained"
                startIcon={<AutoAwesome />}
              >
                Auto-Schedule
              </Button>
            </Box>
          </Box>
          
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Ticket</TableCell>
                  <TableCell>Priority</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Assignee</TableCell>
                  <TableCell>Business Day</TableCell>
                  <TableCell>Scheduled Time</TableCell>
                  <TableCell>Estimated Hours</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tickets.map((ticket) => (
                  <TableRow key={ticket.id} hover>
                    <TableCell>
                      <Box>
                        <Typography variant="subtitle2">{ticket.title}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {ticket.description}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={ticket.priority}
                        size="small"
                        sx={{ bgcolor: priorityColors[ticket.priority], color: "white" }}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={ticket.status}
                        size="small"
                        sx={{ bgcolor: statusColors[ticket.status], color: "white" }}
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Avatar sx={{ width: 24, height: 24 }}>
                          {ticket.assignee.charAt(0)}
                        </Avatar>
                        <Typography variant="body2">{ticket.assignee}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {businessDays.find(bd => bd.id === ticket.businessDay)?.name || "Not assigned"}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {ticket.scheduledTime || "Not scheduled"}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{ticket.estimatedHours}h</Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", gap: 0.5 }}>
                        <Tooltip title="Assign">
                          <IconButton
                            size="small"
                            onClick={() => {
                              setSelectedTicket(ticket);
                              setIsAssignmentDialogOpen(true);
                            }}
                          >
                            <Assignment fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Schedule">
                          <IconButton
                            size="small"
                            onClick={() => {
                              setSelectedTicket(ticket);
                              setIsSchedulingDialogOpen(true);
                            }}
                          >
                            <Schedule fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  );

  const renderKanbanView = () => (
    <Box sx={{ p: 3 }}>
      <Card>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Ticket Kanban Board
          </Typography>
          
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 3 }}>
            {["open", "in-progress", "resolved", "closed"].map((status) => (
              <Box key={status}>
                <Paper
                  sx={{
                    p: 2,
                    minHeight: 500,
                    backgroundColor: "#f5f5f5",
                  }}
                >
                  <Typography variant="h6" gutterBottom sx={{ textTransform: "capitalize" }}>
                    {status.replace("-", " ")}
                  </Typography>
                  
                  {tickets
                    .filter(ticket => ticket.status === status)
                    .map((ticket) => (
                      <Card
                        key={ticket.id}
                        sx={{
                          mb: 2,
                          cursor: "pointer",
                          "&:hover": { boxShadow: 2 },
                        }}
                        onClick={() => {
                          setSelectedTicket(ticket);
                          setIsAssignmentDialogOpen(true);
                        }}
                      >
                        <CardContent sx={{ p: 2 }}>
                          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                            <Typography variant="subtitle2" noWrap>
                              {ticket.title}
                            </Typography>
                            <Chip
                              label={ticket.priority}
                              size="small"
                              sx={{ bgcolor: priorityColors[ticket.priority], color: "white" }}
                            />
                          </Box>
                          
                          <Typography variant="body2" color="text.secondary" noWrap>
                            {ticket.description}
                          </Typography>
                          
                          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 1 }}>
                            <Typography variant="caption" color="text.secondary">
                              {ticket.assignee}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {ticket.estimatedHours}h
                            </Typography>
                          </Box>
                        </CardContent>
                      </Card>
                    ))}
                </Paper>
              </Box>
            ))}
          </Box>
        </CardContent>
      </Card>
    </Box>
  );

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ height: "100vh", display: "flex", flexDirection: "column" }}>
        {/* Header */}
        <Box sx={{ borderBottom: 1, borderColor: "divider", bgcolor: "background.paper" }}>
          <Tabs
            value={activeTab}
            onChange={(_, newValue) => setActiveTab(newValue)}
            sx={{ px: 3 }}
          >
            <Tab label="Calendar" icon={<CalendarToday />} />
            <Tab label="List" icon={<ViewList />} />
            <Tab label="Kanban" icon={<ViewModule />} />
            <Tab label="Analytics" icon={<TrendingUp />} />
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
              <Button
                variant={viewMode === "kanban" ? "contained" : "outlined"}
                startIcon={<ViewModule />}
                onClick={() => setViewMode("kanban")}
                size="small"
              >
                Kanban
              </Button>
            </Box>
            
            <Box sx={{ display: "flex", gap: 1 }}>
              <IconButton>
                <Refresh />
              </IconButton>
              <IconButton>
                <Settings />
              </IconButton>
            </Box>
          </Box>
        </Box>

        {/* Main Content */}
        <Box sx={{ flexGrow: 1, overflow: "auto" }}>
          {activeTab === 0 && renderCalendarView()}
          {activeTab === 1 && renderListView()}
          {activeTab === 2 && renderKanbanView()}
          {activeTab === 3 && (
            <Box sx={{ p: 3 }}>
              <Card>
                <CardContent>
                  <Typography variant="h5" gutterBottom>
                    Scheduling Analytics
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Analytics and reporting features for ticket scheduling and assignment.
                  </Typography>
                </CardContent>
              </Card>
            </Box>
          )}
        </Box>

        {/* Assignment Dialog */}
        <Dialog
          open={isAssignmentDialogOpen}
          onClose={() => setIsAssignmentDialogOpen(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Assignment />
              <Typography variant="h6">
                Assign Ticket: {selectedTicket?.title}
              </Typography>
            </Box>
          </DialogTitle>
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 1 }}>
              <Box>
                <Typography variant="subtitle1" gutterBottom>
                  Available Team Members
                </Typography>
                <List>
                  {teamMembers.map((member) => (
                    <ListItem
                      key={member.id}
                      component="div"
                      onClick={() => handleTicketAssignment(selectedTicket!, member)}
                      sx={{
                        border: "1px solid #e0e0e0",
                        borderRadius: 2,
                        mb: 1,
                        cursor: "pointer",
                        "&:hover": { backgroundColor: "#f5f5f5" },
                      }}
                    >
                      <Avatar sx={{ mr: 2 }}>
                        {member.name.charAt(0)}
                      </Avatar>
                      <ListItemText
                        primary={member.name}
                        secondary={
                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              {member.role} • {member.currentTickets}/{member.maxTickets} tickets
                            </Typography>
                            <Box sx={{ display: "flex", gap: 0.5, mt: 0.5 }}>
                              <Chip
                                label={member.availability}
                                size="small"
                                sx={{ bgcolor: availabilityColors[member.availability], color: "white" }}
                              />
                              {member.skills.slice(0, 2).map((skill) => (
                                <Chip key={skill} label={skill} size="small" variant="outlined" />
                              ))}
                            </Box>
                          </Box>
                        }
                      />
                      <ListItemSecondaryAction>
                        <IconButton>
                          <Assignment />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                  ))}
                </List>
              </Box>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setIsAssignmentDialogOpen(false)}>Cancel</Button>
          </DialogActions>
        </Dialog>

        {/* Scheduling Dialog */}
        <Dialog
          open={isSchedulingDialogOpen}
          onClose={() => setIsSchedulingDialogOpen(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Schedule />
              <Typography variant="h6">
                Schedule Ticket: {selectedTicket?.title}
              </Typography>
            </Box>
          </DialogTitle>
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 1 }}>
              <Box>
                <FormControl fullWidth>
                  <InputLabel>Business Day</InputLabel>
                  <Select
                    value={selectedBusinessDay?.id || ""}
                    onChange={(e) => {
                      const businessDay = businessDays.find(bd => bd.id === e.target.value);
                      setSelectedBusinessDay(businessDay || null);
                    }}
                  >
                    {businessDays.map((businessDay) => (
                      <MenuItem key={businessDay.id} value={businessDay.id}>
                        {businessDay.name} ({businessDay.startTime} - {businessDay.endTime})
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
              
              {selectedBusinessDay && (
                <Box>
                  <TimePicker
                    label="Scheduled Time"
                    value={dayjs(`2000-01-01T${selectedBusinessDay.startTime}`)}
                    onChange={(newValue) => {
                      if (newValue) {
                        const timeString = newValue instanceof Date ? newValue.toTimeString().slice(0, 5) : newValue.format('HH:mm');
                        handleTicketScheduling(selectedTicket!, selectedBusinessDay, timeString);
                      }
                    }}
                  />
                </Box>
              )}
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setIsSchedulingDialogOpen(false)}>Cancel</Button>
            <Button
              variant="contained"
              onClick={() => {
                if (selectedTicket && selectedBusinessDay) {
                  handleTicketScheduling(selectedTicket, selectedBusinessDay, selectedBusinessDay.startTime);
                }
              }}
            >
              Schedule
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </LocalizationProvider>
  );
};

export default TicketScheduler;
