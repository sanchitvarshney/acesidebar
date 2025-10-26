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
    History as HistoryIcon,
    People as PeopleIcon,
    Schedule as ScheduleIcon,
    CheckCircle as CheckCircleIcon,
    Refresh as RefreshIcon,
    Email as EmailIcon,
    Star as StarIcon,
    StarBorder as StarBorderIcon
} from "@mui/icons-material";

interface ChatHistory {
    id: string;
    customer: string;
    agent: string;
    status: 'resolved' | 'closed' | 'abandoned';
    startTime: string;
    endTime: string;
    duration: string;
    priority: 'low' | 'medium' | 'high';
    tags: string[];
    lastMessage: string;
    rating: number;
    resolution: string;
}

const ChatsHistory: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10,
        totalPages: 5
    });

    const historyData: ChatHistory[] = [
        {
            id: "1",
            customer: "John Doe",
            agent: "Sarah Wilson",
            status: "resolved",
            startTime: "2:30 PM",
            endTime: "2:45 PM",
            duration: "15 min",
            priority: "high",
            tags: ["Technical", "Resolved"],
            lastMessage: "Thank you for your help!",
            rating: 5,
            resolution: "Account issue resolved successfully"
        },
        {
            id: "2",
            customer: "Jane Smith",
            agent: "Mike Johnson",
            status: "closed",
            startTime: "2:15 PM",
            endTime: "2:30 PM",
            duration: "15 min",
            priority: "medium",
            tags: ["Billing", "Refund"],
            lastMessage: "Refund processed successfully",
            rating: 4,
            resolution: "Refund request completed"
        },
        {
            id: "3",
            customer: "Bob Johnson",
            agent: "Lisa Brown",
            status: "resolved",
            startTime: "1:45 PM",
            endTime: "2:10 PM",
            duration: "25 min",
            priority: "low",
            tags: ["General", "Information"],
            lastMessage: "All questions answered",
            rating: 5,
            resolution: "Customer inquiry resolved"
        },
        {
            id: "4",
            customer: "Alice Brown",
            agent: "Tom Wilson",
            status: "abandoned",
            startTime: "2:00 PM",
            endTime: "2:05 PM",
            duration: "5 min",
            priority: "medium",
            tags: ["Support", "Abandoned"],
            lastMessage: "Customer left chat",
            rating: 0,
            resolution: "Customer disconnected"
        },
        {
            id: "5",
            customer: "Charlie Davis",
            agent: "Emma Taylor",
            status: "resolved",
            startTime: "1:30 PM",
            endTime: "1:55 PM",
            duration: "25 min",
            priority: "high",
            tags: ["Technical", "Critical", "Resolved"],
            lastMessage: "System issue fixed",
            rating: 5,
            resolution: "Critical system issue resolved"
        }
    ];

    const filteredHistory = historyData.filter(chat =>
        chat.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        chat.agent.toLowerCase().includes(searchQuery.toLowerCase()) ||
        chat.lastMessage.toLowerCase().includes(searchQuery.toLowerCase()) ||
        chat.resolution.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
        setPagination(prev => ({ ...prev, page: value }));
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'resolved': return 'success';
            case 'closed': return 'info';
            case 'abandoned': return 'error';
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

    const renderStars = (rating: number) => {
        return Array.from({ length: 5 }, (_, index) => (
            <IconButton key={index} size="small" sx={{ p: 0.25 }}>
                {index < rating ? <StarIcon fontSize="small" color="primary" /> : <StarBorderIcon fontSize="small" />}
            </IconButton>
        ));
    };

    return (
        <Box sx={{ p: 3, height: '100%', overflow: 'hidden' }}>
            {/* Header */}
            <Box sx={{ mb: 3 }}>
                <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
                    Chat History
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    View and analyze completed chat sessions
                </Typography>
            </Box>

            {/* Search and Filters */}
            <Box sx={{ display: 'flex', gap: 2, mb: 3, alignItems: 'center' }}>
                <TextField
                    placeholder="Search chat history..."
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

            {/* Chat History List */}
            <Box sx={{ height: 'calc(100vh - 200px)', overflow: 'auto' }}>
                <Stack spacing={2}>
                    {filteredHistory.map((chat) => (
                        <Card
                            key={chat.id}
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
                                    bgcolor: getStatusColor(chat.status) === 'success' ? 'success.main' : 
                                            getStatusColor(chat.status) === 'info' ? 'info.main' : 'error.main',
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
                                                    {chat.priority === 'high' && (
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
                                                    {chat.customer} → {chat.agent}
                                                </Typography>
                                            </Box>
                                            <Chip
                                                label={chat.status}
                                                size="small"
                                                color={getStatusColor(chat.status) as any}
                                                variant="outlined"
                                                sx={{ fontWeight: 700 }}
                                            />
                                        </Box>

                                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                            {chat.lastMessage}
                                        </Typography>

                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                                            <Typography variant="caption" color="text.secondary">
                                                {chat.startTime} - {chat.endTime} • Duration: {chat.duration}
                                            </Typography>
                                            {chat.rating > 0 && (
                                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                    {renderStars(chat.rating)}
                                                </Box>
                                            )}
                                        </Box>

                                        <Typography variant="body2" color="text.primary" sx={{ mb: 1, fontStyle: 'italic' }}>
                                            Resolution: {chat.resolution}
                                        </Typography>

                                        <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                                            {chat.tags.map((tag, index) => (
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

export default ChatsHistory;