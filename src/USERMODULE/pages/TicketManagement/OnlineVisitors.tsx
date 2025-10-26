import React, { useState } from "react";
import {
    Box,
    Card,
    CardContent,
    Typography,
    Avatar,
    Chip,
    IconButton,
    Tooltip,
    Button,
    TextField,
    InputAdornment,
    Stack,
    Pagination,
    Switch,
    FormControlLabel
} from "@mui/material";
import {
    Search as SearchIcon,
    FilterList as FilterIcon,
    MoreVert as MoreVertIcon,
    People as PeopleIcon,
    Visibility as VisibilityIcon,
    Chat as ChatIcon,
    LocationOn as LocationIcon,
    Language as LanguageIcon,
    AccessTime as AccessTimeIcon,
    Public as PublicIcon,
    Phone as PhoneIcon,
    Email as EmailIcon,
    Notifications as NotificationsIcon,
    NotificationsOff as NotificationsOffIcon,
    Refresh as RefreshIcon,
    Send as SendIcon
} from "@mui/icons-material";

interface OnlineVisitor {
    id: string;
    name: string;
    email?: string;
    location: string;
    country: string;
    language: string;
    currentPage: string;
    timeOnSite: string;
    visitCount: number;
    lastActivity: string;
    status: 'browsing' | 'engaged' | 'idle';
    priority: 'low' | 'medium' | 'high';
    source: string;
    device: string;
    browser: string;
    ipAddress: string;
    canContact: boolean;
}

const OnlineVisitors: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10,
        totalPages: 3
    });

    const visitors: OnlineVisitor[] = [
        {
            id: "1",
            name: "John Doe",
            email: "john@example.com",
            location: "New York, NY",
            country: "United States",
            language: "English",
            currentPage: "/products",
            timeOnSite: "5 min",
            visitCount: 3,
            lastActivity: "2 min ago",
            status: "engaged",
            priority: "high",
            source: "Google Search",
            device: "Desktop",
            browser: "Chrome",
            ipAddress: "192.168.1.1",
            canContact: true
        },
        {
            id: "2",
            name: "Jane Smith",
            email: "jane@example.com",
            location: "London, UK",
            country: "United Kingdom",
            language: "English",
            currentPage: "/support",
            timeOnSite: "12 min",
            visitCount: 1,
            lastActivity: "1 min ago",
            status: "browsing",
            priority: "medium",
            source: "Direct",
            device: "Mobile",
            browser: "Safari",
            ipAddress: "192.168.1.2",
            canContact: true
        },
        {
            id: "3",
            name: "Bob Johnson",
            email: "bob@example.com",
            location: "Toronto, CA",
            country: "Canada",
            language: "English",
            currentPage: "/pricing",
            timeOnSite: "3 min",
            visitCount: 5,
            lastActivity: "30 sec ago",
            status: "idle",
            priority: "low",
            source: "Social Media",
            device: "Tablet",
            browser: "Firefox",
            ipAddress: "192.168.1.3",
            canContact: false
        }
    ];

    const filteredVisitors = visitors.filter(visitor =>
        visitor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        visitor.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        visitor.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        visitor.currentPage.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
        setPagination(prev => ({ ...prev, page: value }));
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'engaged': return 'success';
            case 'browsing': return 'primary';
            case 'idle': return 'warning';
            default: return 'default';
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'high': return 'error';
            case 'medium': return 'warning';
            case 'low': return 'success';
            default: return 'default';
        }
    };

    const handleProactiveChat = (visitor: OnlineVisitor) => {
        console.log('Starting proactive chat with:', visitor.name);
    };

    return (
        <Box sx={{ p: 3, height: '100%', overflow: 'hidden' }}>
            {/* Header */}
            <Box sx={{ mb: 3 }}>
                <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
                    Online Visitors
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Monitor and engage with visitors in real-time
                </Typography>
            </Box>

            {/* Stats Cards */}
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }, gap: 2, mb: 3 }}>
                <Card sx={{ p: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box sx={{ p: 1, bgcolor: 'primary.main', borderRadius: 1, color: 'white' }}>
                            <PeopleIcon />
                        </Box>
                        <Box>
                            <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                {visitors.length}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Online Now
                            </Typography>
                        </Box>
                    </Box>
                </Card>

                <Card sx={{ p: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box sx={{ p: 1, bgcolor: 'success.main', borderRadius: 1, color: 'white' }}>
                            <ChatIcon />
                        </Box>
                        <Box>
                            <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                {visitors.filter(v => v.status === 'engaged').length}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Engaged
                            </Typography>
                        </Box>
                    </Box>
                </Card>

                <Card sx={{ p: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box sx={{ p: 1, bgcolor: 'info.main', borderRadius: 1, color: 'white' }}>
                            <VisibilityIcon />
                        </Box>
                        <Box>
                            <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                {visitors.filter(v => v.status === 'browsing').length}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Browsing
                            </Typography>
                        </Box>
                    </Box>
                </Card>

                <Card sx={{ p: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box sx={{ p: 1, bgcolor: 'warning.main', borderRadius: 1, color: 'white' }}>
                            <AccessTimeIcon />
                        </Box>
                        <Box>
                            <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                {Math.round(visitors.reduce((acc, v) => acc + parseInt(v.timeOnSite), 0) / visitors.length)} min
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Avg. Time
                            </Typography>
                        </Box>
                    </Box>
                </Card>
            </Box>

            {/* Search and Filters */}
            <Box sx={{ display: 'flex', gap: 2, mb: 3, alignItems: 'center' }}>
                <TextField
                    placeholder="Search visitors..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                        ),
                    }}
                    sx={{ flexGrow: 1, maxWidth: 400 }}
                    size="small"
                />
                <Button
                    variant="outlined"
                    startIcon={<FilterIcon />}
                    size="small"
                >
                    Filters
                </Button>
                <Button
                    variant="outlined"
                    startIcon={<RefreshIcon />}
                    size="small"
                >
                    Refresh
                </Button>
            </Box>

            {/* Visitors List */}
            <Box sx={{ height: 'calc(100vh - 400px)', overflow: 'auto' }}>
                <Stack spacing={2}>
                    {filteredVisitors.map((visitor) => (
                        <Card
                            key={visitor.id}
                            elevation={0}
                            sx={{
                                mr: 0.25,
                                minHeight: 100,
                                flexGrow: 0,
                                flexShrink: 0,
                                position: "relative",
                                overflow: "hidden",
                                borderRadius: 2,
                                border: "1px solid",
                                borderColor: "divider",
                                bgcolor: "background.paper",
                                transition: "all 0.2s ease",
                                cursor: "pointer",
                                "&:before": {
                                    content: '""',
                                    position: "absolute",
                                    left: 0,
                                    top: 0,
                                    bottom: 0,
                                    width: 3,
                                    bgcolor: getStatusColor(visitor.status) === 'success' ? 'success.main' : 
                                            getStatusColor(visitor.status) === 'primary' ? 'primary.main' : 'warning.main',
                                },
                                "&:hover": {
                                    borderColor: "primary.main",
                                    boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
                                    transform: "translateY(-1px)",
                                },
                            }}
                        >
                            <CardContent sx={{ p: 2 }}>
                                <Stack direction="row" spacing={2} alignItems="flex-start">
                                    <Avatar sx={{ width: 48, height: 48, bgcolor: 'primary.main' }}>
                                        {visitor.name.charAt(0)}
                                    </Avatar>

                                    <Box sx={{ flex: 1, minWidth: 0 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 2, mb: 1 }}>
                                            <Box sx={{ flex: 1, minWidth: 0 }}>
                                                <Stack direction="row" spacing={1} sx={{ mb: 0.5 }}>
                                                    {visitor.priority === 'high' && (
                                                        <Chip
                                                            label="High Priority"
                                                            color="error"
                                                            size="small"
                                                            variant="filled"
                                                            sx={{ height: 22, fontWeight: 600 }}
                                                        />
                                                    )}
                                                </Stack>

                                                <Typography variant="subtitle1" sx={{ fontWeight: 600, cursor: "pointer", mb: 0.5, lineHeight: 1.2 }}>
                                                    {visitor.name}
                                                </Typography>
                                            </Box>
                                            <Chip
                                                label={visitor.status}
                                                size="small"
                                                color={getStatusColor(visitor.status) as any}
                                                variant="outlined"
                                                sx={{ fontWeight: 700 }}
                                            />
                                        </Box>

                                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                            {visitor.email} • {visitor.location}
                                        </Typography>

                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                                            <Typography variant="caption" color="text.secondary">
                                                On: {visitor.currentPage} • Time: {visitor.timeOnSite} • Visits: {visitor.visitCount}
                                            </Typography>
                                        </Box>

                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                            <Chip
                                                label={visitor.device}
                                                size="small"
                                                variant="outlined"
                                                sx={{ height: 20, fontSize: '0.7rem' }}
                                            />
                                            <Chip
                                                label={visitor.browser}
                                                size="small"
                                                variant="outlined"
                                                sx={{ height: 20, fontSize: '0.7rem' }}
                                            />
                                            <Chip
                                                label={visitor.source}
                                                size="small"
                                                variant="outlined"
                                                sx={{ height: 20, fontSize: '0.7rem' }}
                                            />
                                        </Box>

                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                            <Button
                                                variant="contained"
                                                size="small"
                                                startIcon={<SendIcon />}
                                                onClick={() => handleProactiveChat(visitor)}
                                                disabled={!visitor.canContact}
                                                sx={{ minWidth: 120 }}
                                            >
                                                Start Chat
                                            </Button>
                                            <FormControlLabel
                                                control={
                                                    <Switch
                                                        checked={visitor.canContact}
                                                        size="small"
                                                    />
                                                }
                                                label="Can Contact"
                                                sx={{ ml: 0 }}
                                            />
                                        </Box>
                                    </Box>
                                </Stack>
                            </CardContent>
                        </Card>
                    ))}
                </Stack>
            </Box>

            {/* Pagination */}
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
                <Pagination
                    count={pagination.totalPages}
                    page={pagination.page}
                    onChange={handlePageChange}
                    color="primary"
                    size="small"
                />
            </Box>
        </Box>
    );
};

export default OnlineVisitors;