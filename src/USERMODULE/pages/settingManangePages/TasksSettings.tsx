import React, { useState } from "react";
import {
    Box,
    Card,
    CardContent,
    Typography,
    Tabs,
    Tab,
    Button,
    Switch,
    FormControlLabel,
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Grid,
    Divider,
    Chip,
    IconButton,
    Tooltip,
    RadioGroup,
    Radio,
} from "@mui/material";
import {
    Settings as SettingsIcon,
    Notifications as NotificationsIcon,
    Save as SaveIcon,
    Info as InfoIcon,
    ArrowBack as ArrowBackIcon,
    Edit as EditIcon,
} from "@mui/icons-material";
import AttachmentSettingsDrawer from "../../components/reusable/AttachmentSettingsDrawer";

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
            id={`tasks-tabpanel-${index}`}
            aria-labelledby={`tasks-tab-${index}`}
            {...other}
        >
            {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
        </div>
    );
}

const TasksSettings: React.FC = () => {
    const [activeTab, setActiveTab] = useState(0);

    // Alert status states
    const [newTaskAlertStatus, setNewTaskAlertStatus] = useState("disable");
    const [newActivityAlertStatus, setNewActivityAlertStatus] = useState("disable");
    const [taskAssignmentAlertStatus, setTaskAssignmentAlertStatus] = useState("disable");
    const [taskTransferAlertStatus, setTaskTransferAlertStatus] = useState("disable");
    const [overdueTaskAlertStatus, setOverdueTaskAlertStatus] = useState("disable");

    // Recipient states
    const [newTaskRecipients, setNewTaskRecipients] = useState({
        adminEmail: false,
        departmentManager: false,
        departmentMembers: false
    });

    const [newActivityRecipients, setNewActivityRecipients] = useState({
        lastRespondent: true,
        assignedAgent: false,
        departmentManager: false
    });

    const [taskAssignmentRecipients, setTaskAssignmentRecipients] = useState({
        assignedAgent: false,
        teamLead: false,
        teamMembers: false
    });

    const [taskTransferRecipients, setTaskTransferRecipients] = useState({
        assignedAgent: false,
        departmentManager: false,
        departmentMembers: false
    });

    const [overdueTaskRecipients, setOverdueTaskRecipients] = useState({
        assignedAgent: false,
        departmentManager: false,
        departmentMembers: false
    });

    // Attachment drawer state
    const [attachmentDrawerOpen, setAttachmentDrawerOpen] = useState(false);
    
    // Task number format state
    const [taskNumberFormat, setTaskNumberFormat] = useState("");

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setActiveTab(newValue);
    };

    // Generate preview for task number format
    const generateTaskNumberPreview = (format: string) => {
        if (!format) return "";
        
        // Replace ## with random 2-digit number
        let preview = format.replace(/##/g, () => {
            return Math.floor(Math.random() * 90 + 10).toString(); // Random 2-digit number (10-99)
        });
        
        // Replace # with random single digit
        preview = preview.replace(/#/g, () => {
            return Math.floor(Math.random() * 10).toString(); // Random single digit (0-9)
        });
        
        return preview;
    };

    const handleAttachmentSettingsSave = (settings: any) => {
        // Handle saving attachment settings
        console.log("Attachment settings saved:", settings);
    };

    return (
        <Box sx={{
            height: "calc(100vh - 100px)",
            overflow: "hidden",
            "&::-webkit-scrollbar": {
                width: "8px",
            },
            "&::-webkit-scrollbar-track": {
                backgroundColor: "#f1f1f1",
                borderRadius: "4px",
            },
            "&::-webkit-scrollbar-thumb": {
                backgroundColor: "#c1c1c1",
                borderRadius: "4px",
                "&:hover": {
                    backgroundColor: "#a8a8a8",
                },
            },
        }}>
            {/* Header */}
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    p: 2,
                    borderBottom: "1px solid #e0e0e0",
                    backgroundColor: "#fafafa",
                }}
            >
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Typography variant="h5" sx={{ fontWeight: 600, color: "#1a1a1a" }}>
                        Tasks Settings
                    </Typography>
                </Box>
                <Box sx={{ display: "flex", gap: 2 }}>
                    <Button
                        variant="outlined"
                        startIcon={<ArrowBackIcon />}
                        size="small"
                        sx={{ fontWeight: 600 }}
                    >
                        Go Back
                    </Button>
                    <Button
                        variant="contained"
                        startIcon={<SaveIcon />}
                        size="small"
                        sx={{ fontWeight: 600 }}
                    >
                        Save Changes
                    </Button>
                </Box>
            </Box>

            {/* Tabs */}
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                <Tabs
                    value={activeTab}
                    onChange={handleTabChange}
                    aria-label="tasks settings tabs"
                    sx={{ px: 2 }}
                >
                    <Tab
                        icon={<SettingsIcon />}
                        label="Settings"
                        iconPosition="start"
                        sx={{ textTransform: "none", fontWeight: 600 }}
                    />
                    <Tab
                        icon={<NotificationsIcon />}
                        label="Alerts & Notices"
                        iconPosition="start"
                        sx={{ textTransform: "none", fontWeight: 600 }}
                    />
                </Tabs>
            </Box>

            {/* Tab Content */}
            <Box sx={{
                flex: 1,
                overflow: "auto",
                overflowY: "scroll",
                maxHeight: "calc(100vh - 200px)",
                "&::-webkit-scrollbar": {
                    width: "8px",
                },
                "&::-webkit-scrollbar-track": {
                    backgroundColor: "#f1f1f1",
                    borderRadius: "4px",
                },
                "&::-webkit-scrollbar-thumb": {
                    backgroundColor: "#c1c1c1",
                    borderRadius: "4px",
                    "&:hover": {
                        backgroundColor: "#a8a8a8",
                    },
                },
            }}>
                {/* Settings Tab */}
                <TabPanel value={activeTab} index={0}>
                    <Grid container spacing={3}>

                        {/* Global Default Task Settings */}
                        <Grid size={{ xs: 12 }}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, fontStyle: "italic" }}>
                                        Global default task settings and options.
                                    </Typography>

                                    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                                        {/* Default Task Number Format */}
                                        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                                            <Typography variant="body1" sx={{ minWidth: 200 }}>
                                                Default Task Number Format:
                                            </Typography>
                                            <TextField
                                                size="small"
                                                placeholder="Enter task number format"
                                                value={taskNumberFormat}
                                                onChange={(e) => setTaskNumberFormat(e.target.value)}
                                                inputProps={{ maxLength: 15 }}
                                                sx={{ width: 200 }}
                                            />
                                            <Typography variant="body2" color="text.secondary">
                                                e.g. {taskNumberFormat ? generateTaskNumberPreview(taskNumberFormat) : "401910"}
                                            </Typography>
                                            <Tooltip title="Help with task number format">
                                                <IconButton size="small">
                                                    <InfoIcon sx={{ color: "#ffc107" }} />
                                                </IconButton>
                                            </Tooltip>
                                        </Box>

                                        {/* Default Priority */}
                                        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                                            <Typography variant="body1" sx={{ minWidth: 200, fontWeight: 600 }}>
                                                Default Priority:
                                            </Typography>
                                            <FormControl size="small" sx={{ width: 200 }}>
                                                <Select defaultValue="low">
                                                    <MenuItem value="low">Low</MenuItem>
                                                    <MenuItem value="medium">Medium</MenuItem>
                                                    <MenuItem value="high">High</MenuItem>
                                                    <MenuItem value="urgent">Urgent</MenuItem>
                                                </Select>
                                            </FormControl>
                                            <Tooltip title="Help with default priority">
                                                <IconButton size="small">
                                                    <InfoIcon sx={{ color: "#9e9e9e" }} />
                                                </IconButton>
                                            </Tooltip>
                                        </Box>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>

                        {/* Attachments */}
                        <Grid size={{ xs: 12 }}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                                        Attachments:
                                    </Typography>
                                    
                                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                                        <Typography variant="body1">
                                            Task Attachment Settings:
                                        </Typography>
                                        <Button
                                            variant="outlined"
                                            startIcon={<EditIcon />}
                                            onClick={() => setAttachmentDrawerOpen(true)}
                                            size="small"
                                            sx={{
                                                backgroundColor: "#f5f5f5",
                                                borderColor: "#d0d0d0",
                                                color: "#333",
                                                "&:hover": {
                                                    backgroundColor: "#e0e0e0",
                                                    borderColor: "#b0b0b0",
                                                }
                                            }}
                                        >
                                            Config
                                        </Button>
                                        <Tooltip title="Configure attachment settings">
                                            <IconButton size="small" sx={{ color: "#999" }}>
                                                <InfoIcon />
                                            </IconButton>
                                        </Tooltip>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </TabPanel>

                {/* Alerts & Notices Tab */}
                <TabPanel value={activeTab} index={1}>
                    <Grid container spacing={3}>
                        {/* New Task Alert */}
                        <Grid size={{ xs: 12 }}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                                        New Task Alert
                                    </Typography>

                                    <Box sx={{ mb: 2 }}>
                                        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                                            Status:
                                        </Typography>
                                        <RadioGroup
                                            row
                                            value={newTaskAlertStatus}
                                            onChange={(e) => {
                                                setNewTaskAlertStatus(e.target.value);
                                                if (e.target.value === "disable") {
                                                    setNewTaskRecipients({
                                                        adminEmail: false,
                                                        departmentManager: false,
                                                        departmentMembers: false
                                                    });
                                                }
                                            }}
                                        >
                                            <FormControlLabel value="enable" control={<Radio />} label="Enable" />
                                            <FormControlLabel value="disable" control={<Radio />} label="Disable" />
                                        </RadioGroup>
                                    </Box>

                                    <Box>
                                        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                                            Recipients:
                                        </Typography>
                                        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                                            <FormControlLabel
                                                control={
                                                    <Switch
                                                        checked={newTaskRecipients.adminEmail}
                                                        disabled={newTaskAlertStatus === "disable"}
                                                        onChange={(e) => setNewTaskRecipients(prev => ({ ...prev, adminEmail: e.target.checked }))}
                                                    />
                                                }
                                                label="Admin Email (shiv.kumar@mscorpres.in)"
                                                sx={{ alignItems: "flex-start" }}
                                            />
                                            <FormControlLabel
                                                control={
                                                    <Switch
                                                        checked={newTaskRecipients.departmentManager}
                                                        disabled={newTaskAlertStatus === "disable"}
                                                        onChange={(e) => setNewTaskRecipients(prev => ({ ...prev, departmentManager: e.target.checked }))}
                                                    />
                                                }
                                                label="Department Manager"
                                                sx={{ alignItems: "flex-start" }}
                                            />
                                            <FormControlLabel
                                                control={
                                                    <Switch
                                                        checked={newTaskRecipients.departmentMembers}
                                                        disabled={newTaskAlertStatus === "disable"}
                                                        onChange={(e) => setNewTaskRecipients(prev => ({ ...prev, departmentMembers: e.target.checked }))}
                                                    />
                                                }
                                                label="Department Members"
                                                sx={{ alignItems: "flex-start" }}
                                            />
                                        </Box>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>

                        {/* New Activity Alert */}
                        <Grid size={{ xs: 12 }}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                                        New Activity Alert
                                    </Typography>

                                    <Box sx={{ mb: 2 }}>
                                        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                                            Status:
                                        </Typography>
                                        <RadioGroup
                                            row
                                            value={newActivityAlertStatus}
                                            onChange={(e) => {
                                                setNewActivityAlertStatus(e.target.value);
                                                if (e.target.value === "disable") {
                                                    setNewActivityRecipients({
                                                        lastRespondent: false,
                                                        assignedAgent: false,
                                                        departmentManager: false
                                                    });
                                                }
                                            }}
                                        >
                                            <FormControlLabel value="enable" control={<Radio />} label="Enable" />
                                            <FormControlLabel value="disable" control={<Radio />} label="Disable" />
                                        </RadioGroup>
                                    </Box>

                                    <Box>
                                        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                                            Recipients:
                                        </Typography>
                                        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                                            <FormControlLabel
                                                control={
                                                    <Switch
                                                        checked={newActivityRecipients.lastRespondent}
                                                        disabled={newActivityAlertStatus === "disable"}
                                                        onChange={(e) => setNewActivityRecipients(prev => ({ ...prev, lastRespondent: e.target.checked }))}
                                                    />
                                                }
                                                label="Last Respondent"
                                                sx={{ alignItems: "flex-start" }}
                                            />
                                            <FormControlLabel
                                                control={
                                                    <Switch
                                                        checked={newActivityRecipients.assignedAgent}
                                                        disabled={newActivityAlertStatus === "disable"}
                                                        onChange={(e) => setNewActivityRecipients(prev => ({ ...prev, assignedAgent: e.target.checked }))}
                                                    />
                                                }
                                                label="Assigned Agent / Team"
                                                sx={{ alignItems: "flex-start" }}
                                            />
                                            <FormControlLabel
                                                control={
                                                    <Switch
                                                        checked={newActivityRecipients.departmentManager}
                                                        disabled={newActivityAlertStatus === "disable"}
                                                        onChange={(e) => setNewActivityRecipients(prev => ({ ...prev, departmentManager: e.target.checked }))}
                                                    />
                                                }
                                                label="Department Manager"
                                                sx={{ alignItems: "flex-start" }}
                                            />
                                        </Box>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>

                        {/* Task Assignment Alert */}
                        <Grid size={{ xs: 12 }}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                                        Task Assignment Alert
                                    </Typography>

                                    <Box sx={{ mb: 2 }}>
                                        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                                            Status:
                                        </Typography>
                                        <RadioGroup
                                            row
                                            value={taskAssignmentAlertStatus}
                                            onChange={(e) => {
                                                setTaskAssignmentAlertStatus(e.target.value);
                                                if (e.target.value === "disable") {
                                                    setTaskAssignmentRecipients({
                                                        assignedAgent: false,
                                                        teamLead: false,
                                                        teamMembers: false
                                                    });
                                                }
                                            }}
                                        >
                                            <FormControlLabel value="enable" control={<Radio />} label="Enable" />
                                            <FormControlLabel value="disable" control={<Radio />} label="Disable" />
                                        </RadioGroup>
                                    </Box>

                                    <Box>
                                        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                                            Recipients:
                                        </Typography>
                                        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                                            <FormControlLabel
                                                control={
                                                    <Switch
                                                        checked={taskAssignmentRecipients.assignedAgent}
                                                        disabled={taskAssignmentAlertStatus === "disable"}
                                                        onChange={(e) => setTaskAssignmentRecipients(prev => ({ ...prev, assignedAgent: e.target.checked }))}
                                                    />
                                                }
                                                label="Assigned Agent / Team"
                                                sx={{ alignItems: "flex-start" }}
                                            />
                                            <FormControlLabel
                                                control={
                                                    <Switch
                                                        checked={taskAssignmentRecipients.teamLead}
                                                        disabled={taskAssignmentAlertStatus === "disable"}
                                                        onChange={(e) => setTaskAssignmentRecipients(prev => ({ ...prev, teamLead: e.target.checked }))}
                                                    />
                                                }
                                                label="Team Lead"
                                                sx={{ alignItems: "flex-start" }}
                                            />
                                            <FormControlLabel
                                                control={
                                                    <Switch
                                                        checked={taskAssignmentRecipients.teamMembers}
                                                        disabled={taskAssignmentAlertStatus === "disable"}
                                                        onChange={(e) => setTaskAssignmentRecipients(prev => ({ ...prev, teamMembers: e.target.checked }))}
                                                    />
                                                }
                                                label="Team Members"
                                                sx={{ alignItems: "flex-start" }}
                                            />
                                        </Box>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>

                        {/* Task Transfer Alert */}
                        <Grid size={{ xs: 12 }}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                                        Task Transfer Alert
                                    </Typography>

                                    <Box sx={{ mb: 2 }}>
                                        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                                            Status:
                                        </Typography>
                                        <RadioGroup
                                            row
                                            value={taskTransferAlertStatus}
                                            onChange={(e) => {
                                                setTaskTransferAlertStatus(e.target.value);
                                                if (e.target.value === "disable") {
                                                    setTaskTransferRecipients({
                                                        assignedAgent: false,
                                                        departmentManager: false,
                                                        departmentMembers: false
                                                    });
                                                }
                                            }}
                                        >
                                            <FormControlLabel value="enable" control={<Radio />} label="Enable" />
                                            <FormControlLabel value="disable" control={<Radio />} label="Disable" />
                                        </RadioGroup>
                                    </Box>

                                    <Box>
                                        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                                            Recipients:
                                        </Typography>
                                        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                                            <FormControlLabel
                                                control={
                                                    <Switch
                                                        checked={taskTransferRecipients.assignedAgent}
                                                        disabled={taskTransferAlertStatus === "disable"}
                                                        onChange={(e) => setTaskTransferRecipients(prev => ({ ...prev, assignedAgent: e.target.checked }))}
                                                    />
                                                }
                                                label="Assigned Agent / Team"
                                                sx={{ alignItems: "flex-start" }}
                                            />
                                            <FormControlLabel
                                                control={
                                                    <Switch
                                                        checked={taskTransferRecipients.departmentManager}
                                                        disabled={taskTransferAlertStatus === "disable"}
                                                        onChange={(e) => setTaskTransferRecipients(prev => ({ ...prev, departmentManager: e.target.checked }))}
                                                    />
                                                }
                                                label="Department Manager"
                                                sx={{ alignItems: "flex-start" }}
                                            />
                                            <FormControlLabel
                                                control={
                                                    <Switch
                                                        checked={taskTransferRecipients.departmentMembers}
                                                        disabled={taskTransferAlertStatus === "disable"}
                                                        onChange={(e) => setTaskTransferRecipients(prev => ({ ...prev, departmentMembers: e.target.checked }))}
                                                    />
                                                }
                                                label="Department Members"
                                                sx={{ alignItems: "flex-start" }}
                                            />
                                        </Box>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>

                        {/* Overdue Task Alert */}
                        <Grid size={{ xs: 12 }}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                                        Overdue Task Alert
                                    </Typography>

                                    <Box sx={{ mb: 2 }}>
                                        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                                            Status:
                                        </Typography>
                                        <RadioGroup
                                            row
                                            value={overdueTaskAlertStatus}
                                            onChange={(e) => {
                                                setOverdueTaskAlertStatus(e.target.value);
                                                if (e.target.value === "disable") {
                                                    setOverdueTaskRecipients({
                                                        assignedAgent: false,
                                                        departmentManager: false,
                                                        departmentMembers: false
                                                    });
                                                }
                                            }}
                                        >
                                            <FormControlLabel value="enable" control={<Radio />} label="Enable" />
                                            <FormControlLabel value="disable" control={<Radio />} label="Disable" />
                                        </RadioGroup>
                                    </Box>

                                    <Box>
                                        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                                            Recipients:
                                        </Typography>
                                        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                                            <FormControlLabel
                                                control={
                                                    <Switch
                                                        checked={overdueTaskRecipients.assignedAgent}
                                                        disabled={overdueTaskAlertStatus === "disable"}
                                                        onChange={(e) => setOverdueTaskRecipients(prev => ({ ...prev, assignedAgent: e.target.checked }))}
                                                    />
                                                }
                                                label="Assigned Agent / Team"
                                                sx={{ alignItems: "flex-start" }}
                                            />
                                            <FormControlLabel
                                                control={
                                                    <Switch
                                                        checked={overdueTaskRecipients.departmentManager}
                                                        disabled={overdueTaskAlertStatus === "disable"}
                                                        onChange={(e) => setOverdueTaskRecipients(prev => ({ ...prev, departmentManager: e.target.checked }))}
                                                    />
                                                }
                                                label="Department Manager"
                                                sx={{ alignItems: "flex-start" }}
                                            />
                                            <FormControlLabel
                                                control={
                                                    <Switch
                                                        checked={overdueTaskRecipients.departmentMembers}
                                                        disabled={overdueTaskAlertStatus === "disable"}
                                                        onChange={(e) => setOverdueTaskRecipients(prev => ({ ...prev, departmentMembers: e.target.checked }))}
                                                    />
                                                }
                                                label="Department Members"
                                                sx={{ alignItems: "flex-start" }}
                                            />
                                        </Box>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </TabPanel>
            </Box>

            {/* Attachment Settings Drawer */}
            <AttachmentSettingsDrawer
                open={attachmentDrawerOpen}
                onClose={() => setAttachmentDrawerOpen(false)}
                onSave={handleAttachmentSettingsSave}
            />
        </Box>
    );
};

export default TasksSettings;
