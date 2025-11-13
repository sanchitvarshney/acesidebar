import React, { useState } from "react";
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
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Paper,
  Tabs,
  Tab,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  RadioGroup,
  Radio,
  FormLabel,
  Slider,
  Checkbox,
  FormGroup,
} from "@mui/material";
import {
  ExpandMore,
  Add,
  Edit,
  Delete,
  Save,
  Cancel,
  Settings,
  Schedule,
  Notifications,
  Business,
  People,
  Timer,
  CalendarToday,
  AccessTime,
  LocationOn,
  Group,
  Assignment,
  Warning,
  CheckCircle,
  Info,
  Refresh,
} from "@mui/icons-material";
import { DatePicker, TimePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

interface BusinessDaySettingsProps {
  onSave?: (settings: any) => void;
  onCancel?: () => void;
}

const BusinessDaySettings: React.FC<BusinessDaySettingsProps> = ({
  onSave,
  onCancel,
}) => {
  const [activeTab, setActiveTab] = useState(0);
  const [activeStep, setActiveStep] = useState(0);
  const [settings, setSettings] = useState<any>({
    // General Settings
    defaultTimezone: "UTC+5:30",
    workingDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    defaultStartTime: "09:00",
    defaultEndTime: "17:00",
    maxTicketsPerDay: 50,
    autoAssignTickets: true,
    enableNotifications: true,

    // Business Hours
    businessHours: {
      monday: { start: "09:00", end: "17:00", enabled: true },
      tuesday: { start: "09:00", end: "17:00", enabled: true },
      wednesday: { start: "09:00", end: "17:00", enabled: true },
      thursday: { start: "09:00", end: "17:00", enabled: true },
      friday: { start: "09:00", end: "17:00", enabled: true },
      saturday: { start: "10:00", end: "15:00", enabled: false },
      sunday: { start: "10:00", end: "15:00", enabled: false },
    },

    // Holidays
    holidays: [
      { id: "1", name: "New Year", date: "2024-01-01", recurring: true },
      {
        id: "2",
        name: "Independence Day",
        date: "2024-08-15",
        recurring: true,
      },
      { id: "3", name: "Christmas", date: "2024-12-25", recurring: true },
    ],

    // Teams
    teams: [
      {
        id: "1",
        name: "Support Team",
        color: "#2566b0",
        maxTickets: 50,
        workingDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      },
      {
        id: "2",
        name: "Development Team",
        color: "#2e7d32",
        maxTickets: 30,
        workingDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      },
      {
        id: "3",
        name: "Sales Team",
        color: "#f57c00",
        maxTickets: 20,
        workingDays: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
        ],
      },
    ],

    // Notifications
    notifications: {
      emailNotifications: true,
      slackNotifications: false,
      smsNotifications: false,
      reminderBeforeDeadline: 24, // hours
      escalationAfterHours: 48, // hours
      dailyDigest: true,
      weeklyReport: true,
    },

    // Escalation Rules
    escalationRules: [
      { id: "1", priority: "high", escalateAfter: 4, escalateTo: "Manager" },
      { id: "2", priority: "urgent", escalateAfter: 2, escalateTo: "Director" },
      {
        id: "3",
        priority: "medium",
        escalateAfter: 8,
        escalateTo: "Team Lead",
      },
    ],
  });

  const [isHolidayDialogOpen, setIsHolidayDialogOpen] = useState(false);
  const [isTeamDialogOpen, setIsTeamDialogOpen] = useState(false);
  const [isEscalationDialogOpen, setIsEscalationDialogOpen] = useState(false);
  const [selectedHoliday, setSelectedHoliday] = useState<any>(null);
  const [selectedTeam, setSelectedTeam] = useState<any>(null);
  const [selectedEscalation, setSelectedEscalation] = useState<any>(null);

  const timezones = [
    "UTC+5:30 (IST)",
    "UTC+0:00 (GMT)",
    "UTC-5:00 (EST)",
    "UTC-8:00 (PST)",
    "UTC+1:00 (CET)",
    "UTC+9:00 (JST)",
  ];

  const daysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const priorityLevels = ["low", "medium", "high", "urgent"];

  const handleSettingChange = (path: string, value: any) => {
    setSettings((prev: any) => {
      const newSettings = { ...prev };
      const keys = path.split(".");
      let current: any = newSettings;

      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]];
      }

      current[keys[keys.length - 1]] = value;
      return newSettings;
    });
  };

  const handleHolidayAdd = (holiday: any) => {
    const newHoliday = {
      id: Date.now().toString(),
      ...holiday,
    };
    setSettings((prev: any) => ({
      ...prev,
      holidays: [...prev.holidays, newHoliday],
    }));
    setIsHolidayDialogOpen(false);
  };

  const handleHolidayEdit = (holiday: any) => {
    setSettings((prev: any) => ({
      ...prev,
      holidays: prev.holidays.map((h: any) =>
        h.id === holiday.id ? holiday : h
      ),
    }));
    setIsHolidayDialogOpen(false);
  };

  const handleHolidayDelete = (holidayId: string) => {
    setSettings((prev: any) => ({
      ...prev,
      holidays: prev.holidays.filter((h: any) => h.id !== holidayId),
    }));
  };

  const handleTeamAdd = (team: any) => {
    const newTeam = {
      id: Date.now().toString(),
      ...team,
    };
    setSettings((prev: any) => ({
      ...prev,
      teams: [...prev.teams, newTeam],
    }));
    setIsTeamDialogOpen(false);
  };

  const handleTeamEdit = (team: any) => {
    setSettings((prev: any) => ({
      ...prev,
      teams: prev.teams.map((t: any) => (t.id === team.id ? team : t)),
    }));
    setIsTeamDialogOpen(false);
  };

  const handleTeamDelete = (teamId: string) => {
    setSettings((prev: any) => ({
      ...prev,
      teams: prev.teams.filter((t: any) => t.id !== teamId),
    }));
  };

  const renderGeneralSettings = () => (
    <Box sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        General Settings
      </Typography>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <FormControl fullWidth>
            <InputLabel>Default Timezone</InputLabel>
            <Select
              value={settings.defaultTimezone}
              onChange={(e) =>
                handleSettingChange("defaultTimezone", e.target.value)
              }
            >
              {timezones.map((tz) => (
                <MenuItem key={tz} value={tz}>
                  {tz}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            fullWidth
            label="Max Tickets Per Day"
            type="number"
            value={settings.maxTicketsPerDay}
            onChange={(e) =>
              handleSettingChange("maxTicketsPerDay", parseInt(e.target.value))
            }
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <TimePicker
            label="Default Start Time"
            value={dayjs(`2000-01-01T${settings.defaultStartTime}`)}
            onChange={(newValue: any) => {
              if (newValue) {
                const timeString = newValue.toTimeString().slice(0, 5);
                handleSettingChange("defaultStartTime", timeString);
              }
            }}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <TimePicker
            label="Default End Time"
            value={dayjs(`2000-01-01T${settings.defaultEndTime}`)}
            onChange={(newValue: any) => {
              if (newValue) {
                const timeString = newValue.toTimeString().slice(0, 5);
                handleSettingChange("defaultEndTime", timeString);
              }
            }}
          />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <FormLabel component="legend">Default Working Days</FormLabel>
          <FormGroup row>
            {daysOfWeek.map((day) => (
              <FormControlLabel
                key={day}
                control={
                  <Checkbox
                    checked={settings.workingDays.includes(day)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        handleSettingChange("workingDays", [
                          ...settings.workingDays,
                          day,
                        ]);
                      } else {
                        handleSettingChange(
                          "workingDays",
                          settings.workingDays.filter((d: any) => d !== day)
                        );
                      }
                    }}
                  />
                }
                label={day}
              />
            ))}
          </FormGroup>
        </Grid>

        <Grid size={{ xs: 12 }}>
          <FormControlLabel
            control={
              <Switch
                checked={settings.autoAssignTickets}
                onChange={(e) =>
                  handleSettingChange("autoAssignTickets", e.target.checked)
                }
              />
            }
            label="Auto-assign tickets to available team members"
          />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <FormControlLabel
            control={
              <Switch
                checked={settings.enableNotifications}
                onChange={(e) =>
                  handleSettingChange("enableNotifications", e.target.checked)
                }
              />
            }
            label="Enable notifications"
          />
        </Grid>
      </Grid>
    </Box>
  );

  const renderBusinessHours = () => (
    <Box sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Business Hours Configuration
      </Typography>

      <Grid container spacing={3}>
        {daysOfWeek.map((day) => {
          const dayKey = day.toLowerCase();
          const daySettings = settings.businessHours[dayKey];

          return (
            <Grid size={{ xs: 12, md: 6 }} key={day}>
              <Card variant="outlined">
                <CardContent>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mb: 2,
                    }}
                  >
                    <Typography variant="subtitle1">{day}</Typography>
                    <Switch
                      checked={daySettings.enabled}
                      onChange={(e) =>
                        handleSettingChange(
                          `businessHours.${dayKey}.enabled`,
                          e.target.checked
                        )
                      }
                    />
                  </Box>

                  {daySettings.enabled && (
                    <Box sx={{ display: "flex", gap: 2 }}>
                      <TimePicker
                        label="Start Time"
                        value={dayjs(`2000-01-01T${daySettings.start}`)}
                        onChange={(newValue: any) => {
                          if (newValue) {
                            const timeString = newValue
                              .toTimeString()
                              .slice(0, 5);
                            handleSettingChange(
                              `businessHours.${dayKey}.start`,
                              timeString
                            );
                          }
                        }}
                      />
                      <TimePicker
                        label="End Time"
                        value={dayjs(`2000-01-01T${daySettings.end}`)}
                        onChange={(newValue: any) => {
                          if (newValue) {
                            const timeString = newValue
                              .toTimeString()
                              .slice(0, 5);
                            handleSettingChange(
                              `businessHours.${dayKey}.end`,
                              timeString
                            );
                          }
                        }}
                      />
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );

  const renderHolidays = () => (
    <Box sx={{ p: 3 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h6">Holidays</Typography>
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

      <List>
        {settings.holidays.map((holiday: any) => (
          <ListItem key={holiday.id} divider>
            <ListItemText
              primary={holiday.name}
              secondary={`${holiday.date} ${
                holiday.recurring ? "(Recurring)" : ""
              }`}
            />
            <ListItemSecondaryAction>
              <IconButton
                edge="end"
                onClick={() => {
                  setSelectedHoliday(holiday);
                  setIsHolidayDialogOpen(true);
                }}
              >
                <Edit />
              </IconButton>
              <IconButton
                edge="end"
                onClick={() => handleHolidayDelete(holiday.id)}
                color="error"
              >
                <Delete />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  const renderTeams = () => (
    <Box sx={{ p: 3 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h6">Teams</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => {
            setSelectedTeam(null);
            setIsTeamDialogOpen(true);
          }}
        >
          Add Team
        </Button>
      </Box>

      <Grid container spacing={3}>
        {settings.teams.map((team: any) => (
          <Grid size={{ xs: 12, md: 6, lg: 4 }} key={team.id}>
            <Card
              sx={{
                border: `2px solid ${team.color}`,
                "&:hover": { boxShadow: 3 },
              }}
            >
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 2,
                  }}
                >
                  <Typography variant="h6" sx={{ color: team.color }}>
                    {team.name}
                  </Typography>
                  <Box>
                    <IconButton
                      size="small"
                      onClick={() => {
                        setSelectedTeam(team);
                        setIsTeamDialogOpen(true);
                      }}
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleTeamDelete(team.id)}
                      color="error"
                    >
                      <Delete />
                    </IconButton>
                  </Box>
                </Box>

                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Max Tickets: {team.maxTickets}
                </Typography>

                <Box sx={{ mt: 1 }}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    gutterBottom
                  >
                    Working Days:
                  </Typography>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                    {team.workingDays.map((day: any) => (
                      <Chip key={day} label={day} size="small" />
                    ))}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );

  const renderNotifications = () => (
    <Box sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Notification Settings
      </Typography>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <FormControlLabel
            control={
              <Switch
                checked={settings.notifications.emailNotifications}
                onChange={(e) =>
                  handleSettingChange(
                    "notifications.emailNotifications",
                    e.target.checked
                  )
                }
              />
            }
            label="Email Notifications"
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <FormControlLabel
            control={
              <Switch
                checked={settings.notifications.slackNotifications}
                onChange={(e) =>
                  handleSettingChange(
                    "notifications.slackNotifications",
                    e.target.checked
                  )
                }
              />
            }
            label="Slack Notifications"
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <FormControlLabel
            control={
              <Switch
                checked={settings.notifications.smsNotifications}
                onChange={(e) =>
                  handleSettingChange(
                    "notifications.smsNotifications",
                    e.target.checked
                  )
                }
              />
            }
            label="SMS Notifications"
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <FormControlLabel
            control={
              <Switch
                checked={settings.notifications.dailyDigest}
                onChange={(e) =>
                  handleSettingChange(
                    "notifications.dailyDigest",
                    e.target.checked
                  )
                }
              />
            }
            label="Daily Digest"
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            fullWidth
            label="Reminder Before Deadline (hours)"
            type="number"
            value={settings.notifications.reminderBeforeDeadline}
            onChange={(e) =>
              handleSettingChange(
                "notifications.reminderBeforeDeadline",
                parseInt(e.target.value)
              )
            }
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            fullWidth
            label="Escalation After Hours"
            type="number"
            value={settings.notifications.escalationAfterHours}
            onChange={(e) =>
              handleSettingChange(
                "notifications.escalationAfterHours",
                parseInt(e.target.value)
              )
            }
          />
        </Grid>
      </Grid>
    </Box>
  );

  const renderEscalationRules = () => (
    <Box sx={{ p: 3 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h6">Escalation Rules</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => {
            setSelectedEscalation(null);
            setIsEscalationDialogOpen(true);
          }}
        >
          Add Rule
        </Button>
      </Box>

      <List>
        {settings.escalationRules.map((rule: any) => (
          <ListItem key={rule.id} divider>
            <ListItemText
              primary={`${rule.priority.toUpperCase()} Priority`}
              secondary={`Escalate to ${rule.escalateTo} after ${rule.escalateAfter} hours`}
            />
            <ListItemSecondaryAction>
              <IconButton
                edge="end"
                onClick={() => {
                  setSelectedEscalation(rule);
                  setIsEscalationDialogOpen(true);
                }}
              >
                <Edit />
              </IconButton>
              <IconButton
                edge="end"
                onClick={() => {
                  setSettings((prev: any) => ({
                    ...prev,
                    escalationRules: prev.escalationRules.filter(
                      (r: any) => r.id !== rule.id
                    ),
                  }));
                }}
                color="error"
              >
                <Delete />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ height: "100vh", display: "flex", flexDirection: "column" }}>
        {/* Header */}
        <Box
          sx={{
            borderBottom: 1,
            borderColor: "divider",
            bgcolor: "background.paper",
          }}
        >
          <Tabs
            value={activeTab}
            onChange={(_, newValue) => setActiveTab(newValue)}
            sx={{ px: 3 }}
          >
            <Tab label="General" icon={<Settings />} />
            <Tab label="Business Hours" icon={<AccessTime />} />
            <Tab label="Holidays" icon={<CalendarToday />} />
            <Tab label="Teams" icon={<Group />} />
            <Tab label="Notifications" icon={<Notifications />} />
            <Tab label="Escalation" icon={<Warning />} />
          </Tabs>
        </Box>

        {/* Content */}
        <Box sx={{ flexGrow: 1, overflow: "auto" }}>
          {activeTab === 0 && renderGeneralSettings()}
          {activeTab === 1 && renderBusinessHours()}
          {activeTab === 2 && renderHolidays()}
          {activeTab === 3 && renderTeams()}
          {activeTab === 4 && renderNotifications()}
          {activeTab === 5 && renderEscalationRules()}
        </Box>

        {/* Footer Actions */}
        <Box
          sx={{
            p: 3,
            borderTop: 1,
            borderColor: "divider",
            bgcolor: "background.paper",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Button
              variant="outlined"
              startIcon={<Refresh />}
              onClick={() => window.location.reload()}
            >
              Reset to Defaults
            </Button>

            <Box sx={{ display: "flex", gap: 2 }}>
              <Button variant="outlined" onClick={onCancel}>
                Cancel
              </Button>
              <Button
                variant="contained"
                startIcon={<Save />}
                onClick={() => onSave?.(settings)}
              >
                Save Settings
              </Button>
            </Box>
          </Box>
        </Box>

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
                  defaultValue={
                    selectedHoliday?.date
                      ? dayjs(selectedHoliday.date)
                      : dayjs()
                  }
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      defaultChecked={selectedHoliday?.recurring || false}
                    />
                  }
                  label="Recurring Holiday"
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setIsHolidayDialogOpen(false)}>
              Cancel
            </Button>
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

        {/* Team Dialog */}
        <Dialog
          open={isTeamDialogOpen}
          onClose={() => setIsTeamDialogOpen(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>{selectedTeam ? "Edit Team" : "Add Team"}</DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label="Team Name"
                  defaultValue={selectedTeam?.name || ""}
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label="Max Tickets"
                  type="number"
                  defaultValue={selectedTeam?.maxTickets || 50}
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label="Color"
                  type="color"
                  defaultValue={selectedTeam?.color || "#2566b0"}
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <FormLabel component="legend">Working Days</FormLabel>
                <FormGroup row>
                  {daysOfWeek.map((day) => (
                    <FormControlLabel
                      key={day}
                      control={
                        <Checkbox
                          defaultChecked={
                            selectedTeam?.workingDays?.includes(day) || false
                          }
                        />
                      }
                      label={day}
                    />
                  ))}
                </FormGroup>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setIsTeamDialogOpen(false)}>Cancel</Button>
            <Button
              variant="contained"
              onClick={() => {
                // Handle save logic here
                setIsTeamDialogOpen(false);
              }}
            >
              {selectedTeam ? "Update" : "Add"}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Escalation Dialog */}
        <Dialog
          open={isEscalationDialogOpen}
          onClose={() => setIsEscalationDialogOpen(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
            {selectedEscalation
              ? "Edit Escalation Rule"
              : "Add Escalation Rule"}
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid size={{ xs: 12 }}>
                <FormControl fullWidth>
                  <InputLabel>Priority Level</InputLabel>
                  <Select
                    defaultValue={selectedEscalation?.priority || "medium"}
                  >
                    {priorityLevels.map((priority) => (
                      <MenuItem key={priority} value={priority}>
                        {priority.toUpperCase()}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label="Escalate After (hours)"
                  type="number"
                  defaultValue={selectedEscalation?.escalateAfter || 4}
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label="Escalate To"
                  defaultValue={selectedEscalation?.escalateTo || ""}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setIsEscalationDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={() => {
                // Handle save logic here
                setIsEscalationDialogOpen(false);
              }}
            >
              {selectedEscalation ? "Update" : "Add"}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </LocalizationProvider>
  );
};

export default BusinessDaySettings;
