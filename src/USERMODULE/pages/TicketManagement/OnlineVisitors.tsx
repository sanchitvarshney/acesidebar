import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Avatar,
  Chip,
  IconButton,
  Tooltip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Badge,
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
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [lastRefresh, setLastRefresh] = useState(new Date());

  const onlineVisitors: OnlineVisitor[] = [
    {
      id: "V-001",
      name: "John Doe",
      email: "john@example.com",
      location: "New York, NY",
      country: "United States",
      language: "English",
      currentPage: "/products/software",
      timeOnSite: "12 min",
      visitCount: 3,
      lastActivity: "2 min ago",
      status: "engaged",
      priority: "high",
      source: "Google Search",
      device: "Desktop",
      browser: "Chrome",
      ipAddress: "192.168.1.100",
      canContact: true
    },
    {
      id: "V-002",
      name: "Jane Smith",
      email: "jane@company.com",
      location: "London, UK",
      country: "United Kingdom",
      language: "English",
      currentPage: "/support/contact",
      timeOnSite: "8 min",
      visitCount: 1,
      lastActivity: "30 sec ago",
      status: "browsing",
      priority: "medium",
      source: "Direct",
      device: "Mobile",
      browser: "Safari",
      ipAddress: "10.0.0.50",
      canContact: true
    },
    {
      id: "V-003",
      name: "Anonymous",
      email: undefined,
      location: "Berlin, Germany",
      country: "Germany",
      language: "German",
      currentPage: "/pricing",
      timeOnSite: "25 min",
      visitCount: 5,
      lastActivity: "5 min ago",
      status: "idle",
      priority: "low",
      source: "Social Media",
      device: "Tablet",
      browser: "Firefox",
      ipAddress: "172.16.0.25",
      canContact: false
    },
    {
      id: "V-004",
      name: "Bob Wilson",
      email: "bob@startup.io",
      location: "San Francisco, CA",
      country: "United States",
      language: "English",
      currentPage: "/features/integration",
      timeOnSite: "18 min",
      visitCount: 2,
      lastActivity: "1 min ago",
      status: "engaged",
      priority: "high",
      source: "Referral",
      device: "Desktop",
      browser: "Edge",
      ipAddress: "203.0.113.10",
      canContact: true
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'engaged': return 'success';
      case 'browsing': return 'info';
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

  const filteredVisitors = onlineVisitors.filter(visitor => {
    const matchesSearch = visitor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         visitor.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         visitor.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         visitor.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === "all" || visitor.status === filterStatus;
    const matchesPriority = filterPriority === "all" || visitor.priority === filterPriority;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const handleRefresh = () => {
    setLastRefresh(new Date());
    // In a real app, this would fetch fresh data
  };

  const handleStartChat = (visitorId: string) => {
    console.log(`Starting chat with visitor ${visitorId}`);
    // In a real app, this would initiate a chat session
  };

  const handleSendMessage = (visitorId: string) => {
    console.log(`Sending message to visitor ${visitorId}`);
    // In a real app, this would send a proactive message
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#20364d' }}>
          Online Visitors
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <FormControlLabel
            control={
              <Switch
                checked={notificationsEnabled}
                onChange={(e) => setNotificationsEnabled(e.target.checked)}
                color="primary"
              />
            }
            label="Notifications"
          />
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={handleRefresh}
          >
            Refresh
          </Button>
        </Box>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, md: 3 }}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <PeopleIcon sx={{ color: '#1976d2', mr: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  Total Online
                </Typography>
              </Box>
              <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                {onlineVisitors.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 3 }}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <ChatIcon sx={{ color: '#4caf50', mr: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  Engaged
                </Typography>
              </Box>
              <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#4caf50' }}>
                {onlineVisitors.filter(v => v.status === 'engaged').length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 3 }}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <VisibilityIcon sx={{ color: '#ff9800', mr: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  Browsing
                </Typography>
              </Box>
              <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#ff9800' }}>
                {onlineVisitors.filter(v => v.status === 'browsing').length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 3 }}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <AccessTimeIcon sx={{ color: '#e91e63', mr: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  Avg Time
                </Typography>
              </Box>
              <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#e91e63' }}>
                16 min
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Search and Filters */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3, alignItems: 'center', flexWrap: 'wrap' }}>
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
          sx={{ flexGrow: 1, maxWidth: 300 }}
        />
        
        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={filterStatus}
            label="Status"
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <MenuItem value="all">All Status</MenuItem>
            <MenuItem value="engaged">Engaged</MenuItem>
            <MenuItem value="browsing">Browsing</MenuItem>
            <MenuItem value="idle">Idle</MenuItem>
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel>Priority</InputLabel>
          <Select
            value={filterPriority}
            label="Priority"
            onChange={(e) => setFilterPriority(e.target.value)}
          >
            <MenuItem value="all">All Priority</MenuItem>
            <MenuItem value="high">High</MenuItem>
            <MenuItem value="medium">Medium</MenuItem>
            <MenuItem value="low">Low</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Online Visitors Table */}
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              Online Visitors ({filteredVisitors.length} visitors)
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Last updated: {lastRefresh.toLocaleTimeString()}
            </Typography>
          </Box>
          <TableContainer component={Paper} sx={{ boxShadow: 'none' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Visitor</TableCell>
                  <TableCell>Location</TableCell>
                  <TableCell>Current Page</TableCell>
                  <TableCell>Time on Site</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Priority</TableCell>
                  <TableCell>Source</TableCell>
                  <TableCell>Device</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredVisitors.map((visitor) => (
                  <TableRow key={visitor.id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Badge
                          color="success"
                          variant="dot"
                          sx={{ mr: 1 }}
                        >
                          <Avatar sx={{ width: 32, height: 32, bgcolor: '#1976d2' }}>
                            {visitor.name.charAt(0)}
                          </Avatar>
                        </Badge>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                            {visitor.name}
                          </Typography>
                          {visitor.email && (
                            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                              {visitor.email}
                            </Typography>
                          )}
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                          <LocationIcon sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
                          <Typography variant="body2">
                            {visitor.location}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <LanguageIcon sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
                          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                            {visitor.language}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {visitor.currentPage}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="body2">
                          {visitor.timeOnSite}
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                          {visitor.visitCount} visits
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={visitor.status}
                        color={getStatusColor(visitor.status) as any}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={visitor.priority}
                        color={getPriorityColor(visitor.priority) as any}
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {visitor.source}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="body2">
                          {visitor.device}
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                          {visitor.browser}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        {visitor.canContact && (
                          <Tooltip title="Start Chat">
                            <IconButton 
                              size="small"
                              onClick={() => handleStartChat(visitor.id)}
                              sx={{ color: '#4caf50' }}
                            >
                              <ChatIcon />
                            </IconButton>
                          </Tooltip>
                        )}
                        {visitor.canContact && (
                          <Tooltip title="Send Message">
                            <IconButton 
                              size="small"
                              onClick={() => handleSendMessage(visitor.id)}
                              sx={{ color: '#1976d2' }}
                            >
                              <SendIcon />
                            </IconButton>
                          </Tooltip>
                        )}
                        <Tooltip title="More options">
                          <IconButton size="small">
                            <MoreVertIcon />
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
};

export default OnlineVisitors;
