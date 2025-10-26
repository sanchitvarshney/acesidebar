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
    Pagination
} from "@mui/material";
import {
    Search as SearchIcon,
    FilterList as FilterIcon,
    MoreVert as MoreVertIcon,
    Chat as ChatIcon,
    People as PeopleIcon,
    Schedule as ScheduleIcon,
    TrendingUp as TrendingUpIcon,
    CheckCircle as CheckCircleIcon,
    Refresh as RefreshIcon,
    Email as EmailIcon
} from "@mui/icons-material";

interface ChatStats {
    totalChats: number;
    activeChats: number;
    resolvedChats: number;
    avgResponseTime: string;
    satisfaction: number;
}

interface ChatSession {
    id: string;
    customer: string;
    agent: string;
    status: 'active' | 'waiting' | 'resolved';
    startTime: string;
    duration: string;
    priority: 'low' | 'medium' | 'high';
    tags: string[];
    lastMessage: string;
    unreadCount: number;
}

const ChatsOverview: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10,
        totalPages: 3
    });

    const stats: ChatStats = {
        totalChats: 1247,
        activeChats: 23,
        resolvedChats: 1189,
        avgResponseTime: "2.3 min",
        satisfaction: 4.7
    };

    const recentSessions: ChatSession[] = [
        {
            id: "1",
            customer: "John Doe",
            agent: "Sarah Wilson",
            status: "active",
            startTime: "2:30 PM",
            duration: "15 min",
            priority: "high",
            tags: ["Technical", "Urgent"],
            lastMessage: "I need help with my account",
            unreadCount: 3
        },
        {
            id: "2",
            customer: "Jane Smith",
            agent: "Mike Johnson",
            status: "waiting",
            startTime: "2:15 PM",
            duration: "8 min",
            priority: "medium",
            tags: ["Billing"],
            lastMessage: "When will my refund be processed?",
            unreadCount: 0
        },
        {
            id: "3",
            customer: "Bob Johnson",
            agent: "Lisa Brown",
            status: "resolved",
            startTime: "1:45 PM",
            duration: "25 min",
            priority: "low",
            tags: ["General"],
            lastMessage: "Thank you for your help!",
            unreadCount: 0
        },
        {
            id: "4",
            customer: "Alice Brown",
            agent: "Tom Wilson",
            status: "active",
            startTime: "2:00 PM",
            duration: "12 min",
            priority: "medium",
            tags: ["Support"],
            lastMessage: "Can you help me with this issue?",
            unreadCount: 1
        },
        {
            id: "5",
            customer: "Charlie Davis",
            agent: "Emma Taylor",
            status: "waiting",
            startTime: "1:30 PM",
            duration: "5 min",
            priority: "high",
            tags: ["Technical", "Critical"],
            lastMessage: "The system is not responding",
            unreadCount: 2
        }
    ];

    const filteredSessions = recentSessions.filter(session =>
        session.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        session.agent.toLowerCase().includes(searchQuery.toLowerCase()) ||
        session.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
        setPagination(prev => ({ ...prev, page: value }));
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active': return 'primary';
            case 'waiting': return 'warning';
            case 'resolved': return 'success';
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

    return (
        <Box sx={{ p: 3, height: '100%', overflow: 'hidden' }}>
            {/* Header */}
            <Box sx={{ mb: 3 }}>
                <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
                    Chats Overview
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Monitor and manage all chat sessions
                </Typography>
            </Box>

            {/* Stats Cards */}
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(5, 1fr)' }, gap: 2, mb: 3 }}>
                <Card sx={{ p: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box sx={{ p: 1, bgcolor: 'primary.main', borderRadius: 1, color: 'white' }}>
                            <ChatIcon />
                        </Box>
                        <Box>
                            <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                {stats.totalChats}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Total Chats
                            </Typography>
                        </Box>
                    </Box>
                </Card>

                <Card sx={{ p: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box sx={{ p: 1, bgcolor: 'success.main', borderRadius: 1, color: 'white' }}>
                            <PeopleIcon />
                        </Box>
                        <Box>
                            <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                {stats.activeChats}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Active Chats
                            </Typography>
                        </Box>
                    </Box>
                </Card>

                <Card sx={{ p: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box sx={{ p: 1, bgcolor: 'info.main', borderRadius: 1, color: 'white' }}>
                            <CheckCircleIcon />
                        </Box>
                        <Box>
                            <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                {stats.resolvedChats}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Resolved
                            </Typography>
                        </Box>
                    </Box>
                </Card>

                <Card sx={{ p: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box sx={{ p: 1, bgcolor: 'warning.main', borderRadius: 1, color: 'white' }}>
                            <ScheduleIcon />
                        </Box>
                        <Box>
                            <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                {stats.avgResponseTime}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Avg Response
                            </Typography>
                        </Box>
                    </Box>
                </Card>

                <Card sx={{ p: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box sx={{ p: 1, bgcolor: 'secondary.main', borderRadius: 1, color: 'white' }}>
                            <TrendingUpIcon />
                        </Box>
                        <Box>
                            <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                {stats.satisfaction}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Satisfaction
                            </Typography>
                        </Box>
                    </Box>
                </Card>
            </Box>

            {/* Search and Filters */}
            <Box sx={{ display: 'flex', gap: 2, mb: 3, alignItems: 'center' }}>
                <TextField
                    placeholder="Search chats..."
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

            {/* Chat Sessions List */}
            <Box sx={{ height: 'calc(100vh - 400px)', overflow: 'auto' }}>
                <Stack spacing={2}>
                    {filteredSessions.map((session) => (
                        <Card
                            key={session.id}
                            elevation={0}
                            sx={{
                                mr: 0.25,
                                minHeight: 80,
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
                                    bgcolor: getStatusColor(session.status) === 'primary' ? 'primary.main' : 
                                            getStatusColor(session.status) === 'warning' ? 'warning.main' : 'success.main',
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
                                    <Box
                                        sx={{
                                            width: 48,
                                            height: 48,
                                            borderRadius: 2,
                                            bgcolor: "primary.main",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            color: "white",
                                            flexShrink: 0,
                                            boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.2)",
                                        }}
                                    >
                                        <EmailIcon />
                                    </Box>

                                    <Box sx={{ flex: 1, minWidth: 0 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 2, mb: 1 }}>
                                            <Box sx={{ flex: 1, minWidth: 0 }}>
                                                <Stack direction="row" spacing={1} sx={{ mb: 0.5 }}>
                                                    {session.priority === 'high' && (
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
                                                    {session.customer} → {session.agent}
                                                </Typography>
                                            </Box>
                                            <Chip
                                                label={session.status}
                                                size="small"
                                                color={getStatusColor(session.status) as any}
                                                variant="outlined"
                                                sx={{ fontWeight: 700 }}
                                            />
                                        </Box>

                                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                            {session.lastMessage}
                                        </Typography>

                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                                            <Typography variant="caption" color="text.secondary">
                                                Started: {session.startTime} • Duration: {session.duration}
                                            </Typography>
                                            {session.unreadCount > 0 && (
                                                <Chip
                                                    label={`${session.unreadCount} unread`}
                                                    size="small"
                                                    color="primary"
                                                    variant="filled"
                                                    sx={{ height: 20, fontSize: '0.75rem' }}
                                                />
                                            )}
                                        </Box>

                                        <Box sx={{ display: 'flex', gap: 0.5, mt: 1, flexWrap: 'wrap' }}>
                                            {session.tags.map((tag, index) => (
                                                <Chip
                                                    key={index}
                                                    label={tag}
                                                    size="small"
                                                    variant="outlined"
                                                    sx={{ height: 20, fontSize: '0.7rem' }}
                                                />
                                            ))}
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

export default ChatsOverview;