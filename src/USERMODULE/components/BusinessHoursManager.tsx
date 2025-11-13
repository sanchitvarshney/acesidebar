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
  Switch,
  FormControlLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Chip,
  Alert,
  Divider,
  Paper,
  Tabs,
  Tab,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  FormGroup,
  FormLabel,
  RadioGroup,
  Radio,
  Slider,
  LinearProgress,
  Tooltip,
  Badge,
  Avatar,
} from "@mui/material";
import {
  ExpandMore,
  Add,
  Edit,
  Delete,
  Save,
  Cancel,
  Schedule,
  CalendarToday,
  AccessTime,
  Business,
  Warning,
  CheckCircle,
  Info,
  Refresh,
  Settings,
  Notifications,
  Event,
  Timer,
  People,
  Group,
  Assignment,
  TrendingUp,
  FilterList,
  ViewList,
  ViewModule,
  DateRange,
  Today,
  PlayArrow,
  Pause,
  Stop,
  AutoAwesome,
} from "@mui/icons-material";
import { DatePicker, TimePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

interface BusinessHours {
  id: string;
  name: string;
  timezone: string;
  workingDays: {
    monday: { start: string; end: string; enabled: boolean };
    tuesday: { start: string; end: string; enabled: boolean };
    wednesday: { start: string; end: string; enabled: boolean };
    thursday: { start: string; end: string; enabled: boolean };
    friday: { start: string; end: string; enabled: boolean };
    saturday: { start: string; end: string; enabled: boolean };
    sunday: { start: string; end: string; enabled: boolean };
  };
  breaks: {
    id: string;
    name: string;
    startTime: string;
    endTime: string;
    days: string[];
    isActive: boolean;
  }[];
  specialHours: {
    id: string;
    name: string;
    date: string;
    startTime: string;
    endTime: string;
    isWorkingDay: boolean;
    reason: string;
  }[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface Holiday {
  id: string;
  name: string;
  date: string;
  endDate?: string;
  isRecurring: boolean;
  type: "national" | "company" | "personal" | "religious";
  description: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface BusinessHoursManagerProps {
  onBusinessHoursUpdate?: (businessHours: BusinessHours) => void;
  onHolidayUpdate?: (holiday: Holiday) => void;
  onHolidayDelete?: (holidayId: string) => void;
}

const BusinessHoursManager: React.FC<BusinessHoursManagerProps> = ({
  onBusinessHoursUpdate,
  onHolidayUpdate,
  onHolidayDelete,
}) => {
  const [activeTab, setActiveTab] = useState(0);
  const [isBusinessHoursDialogOpen, setIsBusinessHoursDialogOpen] = useState(false);
  const [isHolidayDialogOpen, setIsHolidayDialogOpen] = useState(false);
  const [isBreakDialogOpen, setIsBreakDialogOpen] = useState(false);
  const [isSpecialHoursDialogOpen, setIsSpecialHoursDialogOpen] = useState(false);
  const [selectedBusinessHours, setSelectedBusinessHours] = useState<BusinessHours | any | null>(null);
  const [selectedHoliday, setSelectedHoliday] = useState<Holiday | null>(null);
  const [selectedBreak, setSelectedBreak] = useState<any>(null);
  const [selectedSpecialHours, setSelectedSpecialHours] = useState<any>(null);

  const [businessHours, setBusinessHours] = useState<BusinessHours[]>([
    {
      id: "1",
      name: "Standard Business Hours",
      timezone: "UTC+5:30",
      workingDays: {
        monday: { start: "09:00", end: "17:00", enabled: true },
        tuesday: { start: "09:00", end: "17:00", enabled: true },
        wednesday: { start: "09:00", end: "17:00", enabled: true },
        thursday: { start: "09:00", end: "17:00", enabled: true },
        friday: { start: "09:00", end: "17:00", enabled: true },
        saturday: { start: "10:00", end: "15:00", enabled: false },
        sunday: { start: "10:00", end: "15:00", enabled: false },
      },
      breaks: [
        {
          id: "1",
          name: "Lunch Break",
          startTime: "12:00",
          endTime: "13:00",
          days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
          isActive: true,
        },
        {
          id: "2",
          name: "Coffee Break",
          startTime: "15:00",
          endTime: "15:15",
          days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
          isActive: true,
        },
      ],
      specialHours: [
        {
          id: "1",
          name: "Holiday Eve",
          date: "2024-12-24",
          startTime: "09:00",
          endTime: "14:00",
          isWorkingDay: true,
          reason: "Early closure for holiday preparation",
        },
      ],
      isActive: true,
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: "2024-01-01T00:00:00Z",
    },
  ]);

  const [holidays, setHolidays] = useState<Holiday[]>([
    {
      id: "1",
      name: "New Year's Day",
      date: "2024-01-01",
      isRecurring: true,
      type: "national",
      description: "New Year's Day celebration",
      isActive: true,
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: "2024-01-01T00:00:00Z",
    },
    {
      id: "2",
      name: "Independence Day",
      date: "2024-08-15",
      isRecurring: true,
      type: "national",
      description: "Independence Day celebration",
      isActive: true,
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: "2024-01-01T00:00:00Z",
    },
    {
      id: "3",
      name: "Company Anniversary",
      date: "2024-06-15",
      isRecurring: true,
      type: "company",
      description: "Company founding anniversary",
      isActive: true,
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: "2024-01-01T00:00:00Z",
    },
  ]);

  const daysOfWeek = [
    "monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"
  ];

  const dayLabels:any = {
    monday: "Monday",
    tuesday: "Tuesday",
    wednesday: "Wednesday",
    thursday: "Thursday",
    friday: "Friday",
    saturday: "Saturday",
    sunday: "Sunday",
  };

  const holidayTypes = [
    { value: "national", label: "National Holiday", color: "#2566b0" },
    { value: "company", label: "Company Holiday", color: "#2e7d32" },
    { value: "personal", label: "Personal Holiday", color: "#f57c00" },
    { value: "religious", label: "Religious Holiday", color: "#9c27b0" },
  ];

  const timezones = [
    "UTC+5:30 (IST)",
    "UTC+0:00 (GMT)",
    "UTC-5:00 (EST)",
    "UTC-8:00 (PST)",
    "UTC+1:00 (CET)",
    "UTC+9:00 (JST)",
  ];

  const handleBusinessHoursChange = (field: string, value: any) => {
    if (selectedBusinessHours) {
      const updated = { ...selectedBusinessHours };
      const keys = field.split('.');
      let current:any = updated;
      
      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]];
      }
      
      current[keys[keys.length - 1]] = value;
      setSelectedBusinessHours(updated);
    }
  };

  const handleBusinessHoursSave = () => {
    if (selectedBusinessHours) {
      setBusinessHours(prev =>
        prev.map(bh => bh.id === selectedBusinessHours.id ? selectedBusinessHours : bh)
      );
      onBusinessHoursUpdate?.(selectedBusinessHours);
      setIsBusinessHoursDialogOpen(false);
    }
  };

  const handleHolidaySave = (holiday: Holiday) => {
    if (selectedHoliday) {
      setHolidays(prev =>
        prev.map(h => h.id === holiday.id ? holiday : h)
      );
      onHolidayUpdate?.(holiday);
    } else {
      const newHoliday = {
        ...holiday,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setHolidays(prev => [...prev, newHoliday]);
      onHolidayUpdate?.(newHoliday);
    }
    setIsHolidayDialogOpen(false);
  };

  const handleHolidayDelete = (holidayId: string) => {
    setHolidays(prev => prev.filter(h => h.id !== holidayId));
    onHolidayDelete?.(holidayId);
  };

  const renderBusinessHours = () => (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h5">Business Hours Management</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => {
            setSelectedBusinessHours(null);
            setIsBusinessHoursDialogOpen(true);
          }}
        >
          Add Business Hours
        </Button>
      </Box>

      <Grid container spacing={3}>
        {businessHours.map((bh:any) => (
          <Grid size={{ xs: 12, md: 6 }} key={bh.id}>
            <Card
              sx={{
                border: `2px solid ${bh.isActive ? "#4caf50" : "#9e9e9e"}`,
                "&:hover": { boxShadow: 3 },
              }}
            >
              <CardContent>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                  <Typography variant="h6">{bh.name}</Typography>
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <Chip
                      label={bh.isActive ? "Active" : "Inactive"}
                      color={bh.isActive ? "success" : "default"}
                      size="small"
                    />
                    <IconButton
                      size="small"
                      onClick={() => {
                        setSelectedBusinessHours(bh);
                        setIsBusinessHoursDialogOpen(true);
                      }}
                    >
                      <Edit />
                    </IconButton>
                  </Box>
                </Box>

                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Timezone: {bh.timezone}
                </Typography>

                <Divider sx={{ my: 2 }} />

                <Typography variant="subtitle2" gutterBottom>
                  Working Days
                </Typography>
                {daysOfWeek.map((day:any) => {
                  const dayConfig = bh.workingDays[day];
                  return (
                    <Box key={day} sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                      <Typography variant="body2">{dayLabels[day]}</Typography>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Switch
                          checked={dayConfig.enabled}
                          size="small"
                          disabled
                        />
                        {dayConfig.enabled && (
                          <Typography variant="body2" color="text.secondary">
                            {dayConfig.start} - {dayConfig.end}
                          </Typography>
                        )}
                      </Box>
                    </Box>
                  );
                })}

                <Divider sx={{ my: 2 }} />

                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Typography variant="body2" color="text.secondary">
                    Breaks: {bh.breaks.length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Special Hours: {bh.specialHours.length}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );

  const renderHolidays = () => (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h5">Holiday Management</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => {
            setSelectedHoliday(null);
            setIsHolidayDialogOpen(true);
          }}
        >
          Add Holiday
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Recurring</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {holidays.map((holiday) => (
              <TableRow key={holiday.id} hover>
                <TableCell>
                  <Box>
                    <Typography variant="subtitle2">{holiday.name}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {holiday.description}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {new Date(holiday.date).toLocaleDateString()}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    label={holidayTypes.find(t => t.value === holiday.type)?.label || holiday.type}
                    size="small"
                    sx={{
                      bgcolor: holidayTypes.find(t => t.value === holiday.type)?.color || "#9e9e9e",
                      color: "white",
                    }}
                  />
                </TableCell>
                <TableCell>
                  <Chip
                    label={holiday.isRecurring ? "Yes" : "No"}
                    size="small"
                    color={holiday.isRecurring ? "success" : "default"}
                  />
                </TableCell>
                <TableCell>
                  <Chip
                    label={holiday.isActive ? "Active" : "Inactive"}
                    size="small"
                    color={holiday.isActive ? "success" : "default"}
                  />
                </TableCell>
                <TableCell>
                  <Box sx={{ display: "flex", gap: 0.5 }}>
                    <IconButton
                      size="small"
                      onClick={() => {
                        setSelectedHoliday(holiday);
                        setIsHolidayDialogOpen(true);
                      }}
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleHolidayDelete(holiday.id)}
                      color="error"
                    >
                      <Delete />
                    </IconButton>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );

  const renderBreaks = () => (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Break Management
      </Typography>
      <Typography variant="body1" color="text.secondary">
        Configure break times and schedules for different business hours.
      </Typography>
    </Box>
  );

  const renderSpecialHours = () => (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Special Hours Management
      </Typography>
      <Typography variant="body1" color="text.secondary">
        Configure special working hours for specific dates or occasions.
      </Typography>
    </Box>
  );

  const renderAnalytics = () => (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Business Hours Analytics
      </Typography>
      <Typography variant="body1" color="text.secondary">
        Analytics and reporting for business hours utilization and holiday impact.
      </Typography>
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
            <Tab label="Business Hours" icon={<AccessTime />} />
            <Tab label="Holidays" icon={<CalendarToday />} />
            <Tab label="Breaks" icon={<Timer />} />
            <Tab label="Special Hours" icon={<Event />} />
            <Tab label="Analytics" icon={<TrendingUp />} />
          </Tabs>
        </Box>

        {/* Main Content */}
        <Box sx={{ flexGrow: 1, overflow: "auto" }}>
          {activeTab === 0 && renderBusinessHours()}
          {activeTab === 1 && renderHolidays()}
          {activeTab === 2 && renderBreaks()}
          {activeTab === 3 && renderSpecialHours()}
          {activeTab === 4 && renderAnalytics()}
        </Box>

        {/* Business Hours Dialog */}
        <Dialog
          open={isBusinessHoursDialogOpen}
          onClose={() => setIsBusinessHoursDialogOpen(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            {selectedBusinessHours ? "Edit Business Hours" : "Add Business Hours"}
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={3} sx={{ mt: 1 }}>
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label="Business Hours Name"
                  defaultValue={selectedBusinessHours?.name || ""}
                  onChange={(e) => handleBusinessHoursChange('name', e.target.value)}
                />
              </Grid>
              
              <Grid size={{ xs: 12 }}>
                <FormControl fullWidth>
                  <InputLabel>Timezone</InputLabel>
                  <Select
                    value={selectedBusinessHours?.timezone || "UTC+5:30"}
                    onChange={(e) => handleBusinessHoursChange('timezone', e.target.value)}
                  >
                    {timezones.map((tz) => (
                      <MenuItem key={tz} value={tz}>{tz}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid size={{ xs: 12 }}>
                <Typography variant="h6" gutterBottom>
                  Working Days Configuration
                </Typography>
                {daysOfWeek.map((day) => {
                  const dayConfig = selectedBusinessHours?.workingDays[day] || { start: "09:00", end: "17:00", enabled: false };
                  return (
                    <Card key={day} sx={{ mb: 2 }}>
                      <CardContent>
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                          <Typography variant="subtitle1">{dayLabels[day]}</Typography>
                          <Switch
                            checked={dayConfig.enabled}
                            onChange={(e) => handleBusinessHoursChange(`workingDays.${day}.enabled`, e.target.checked)}
                          />
                        </Box>
                        
                        {dayConfig.enabled && (
                          <Box sx={{ display: "flex", gap: 2 }}>
                            <TimePicker
                              label="Start Time"
                              value={dayjs(`2000-01-01T${dayConfig.start}`)}
                              onChange={(newValue:any) => {
                                if (newValue) {
                                  const timeString = newValue.toTimeString().slice(0, 5);
                                  handleBusinessHoursChange(`workingDays.${day}.start`, timeString);
                                }
                              }}
                            />
                            <TimePicker
                              label="End Time"
                              value={dayjs(`2000-01-01T${dayConfig.end}`)}
                              onChange={(newValue:any) => {
                                if (newValue) {
                                  const timeString = newValue.toTimeString().slice(0, 5);
                                  handleBusinessHoursChange(`workingDays.${day}.end`, timeString);
                                }
                              }}
                            />
                          </Box>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </Grid>

              <Grid size={{ xs: 12 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={selectedBusinessHours?.isActive || false}
                      onChange={(e) => handleBusinessHoursChange('isActive', e.target.checked)}
                    />
                  }
                  label="Active"
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setIsBusinessHoursDialogOpen(false)}>Cancel</Button>
            <Button variant="contained" onClick={handleBusinessHoursSave}>
              {selectedBusinessHours ? "Update" : "Create"}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Holiday Dialog */}
        <Dialog
          open={isHolidayDialogOpen}
          onClose={() => setIsHolidayDialogOpen(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
            {selectedHoliday ? "Edit Holiday" : "Add Holiday"}
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label="Holiday Name"
                  defaultValue={selectedHoliday?.name || ""}
                />
              </Grid>
              
              <Grid size={{ xs: 12 }}>
                <DatePicker
                  label="Date"
                  value={selectedHoliday?.date ? dayjs(selectedHoliday.date) : dayjs()}
                />
              </Grid>
              
              <Grid size={{ xs: 12 }}>
                <FormControl fullWidth>
                  <InputLabel>Type</InputLabel>
                  <Select
                    defaultValue={selectedHoliday?.type || "national"}
                  >
                    {holidayTypes.map((type) => (
                      <MenuItem key={type.value} value={type.value}>
                        {type.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label="Description"
                  multiline
                  rows={3}
                  defaultValue={selectedHoliday?.description || ""}
                />
              </Grid>
              
              <Grid size={{ xs: 12 }}>
                <FormControlLabel
                  control={<Checkbox defaultChecked={selectedHoliday?.isRecurring || false} />}
                  label="Recurring Holiday"
                />
              </Grid>
              
              <Grid size={{ xs: 12 }}>
                <FormControlLabel
                  control={<Checkbox defaultChecked={selectedHoliday?.isActive || true} />}
                  label="Active"
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setIsHolidayDialogOpen(false)}>Cancel</Button>
            <Button
              variant="contained"
              onClick={() => {
                // Handle save logic here
                setIsHolidayDialogOpen(false);
              }}
            >
              {selectedHoliday ? "Update" : "Add"}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </LocalizationProvider>
  );
};

export default BusinessHoursManager;

