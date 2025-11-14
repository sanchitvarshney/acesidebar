import React, { useState } from 'react';
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Tabs,
  Tab,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  Menu,
  MenuItem,
} from '@mui/material';
import {
  Close as CloseIcon,
  Email as EmailIcon,
  MoreVert as MoreVertIcon,
  Notifications as NotificationsIcon,
  ArrowDropDown as ArrowDropDownIcon,
  Check as CheckIcon
} from '@mui/icons-material';

interface NotificationPopupProps {
  open: boolean;
  onClose: () => void;
  anchorEl: HTMLElement | null;
}

const FILTER_OPTIONS = [
  { label: 'ALL', value: 'all' },
  { label: 'UNREAD', value: 'unread' },
  { label: 'FLAGGED', value: 'flagged' },
  { label: '@MENTIONS', value: 'mentions' },
];

const NotificationPopup: React.FC<NotificationPopupProps> = ({ open, onClose, anchorEl }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [filterAnchorEl, setFilterAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedFilter, setSelectedFilter] = useState(FILTER_OPTIONS[1]); // Default to UNREAD as in image

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleFilterClick = (event: React.MouseEvent<HTMLElement>) => {
    setFilterAnchorEl(event.currentTarget);
  };

  const handleFilterClose = () => {
    setFilterAnchorEl(null);
  };

  const handleFilterSelect = (option: typeof FILTER_OPTIONS[0]) => {
    setSelectedFilter(option);
    setFilterAnchorEl(null);
  };

  const notifications = [
    {
      id: 1,
      title: "New ticket assigned",
      details: "Ticket #TKT-2024-001 assigned to Abhishek Srivastava <abhishek.srivastava@oakter.com>",
      date: "Jul 23",
      severity: "MEDIUM",
      icon: <EmailIcon sx={{ color: '#2566b0' }} />,
      severityColor: '#fef7e0',
      severityTextColor: '#000',
      type: 'all',
      read: false,
      flagged: false,
      mention: false
    },
    {
      id: 2,
      title: "Ticket status updated",
      details: "Ticket #TKT-2024-002 status changed to 'In Progress' by Amit Vashisth <amit.vashisth@oakter.com>",
      date: "Jul 23",
      severity: "MEDIUM",
      icon: <EmailIcon sx={{ color: '#2566b0' }} />,
      severityColor: '#fef7e0',
      severityTextColor: '#000',
      type: 'all',
      read: true,
      flagged: true,
      mention: false
    },
    {
      id: 3,
      title: "High priority ticket created",
      details: "Critical ticket #TKT-2024-003 created for system outage",
      date: "Jun 09",
      severity: "HIGH",
      icon: <MoreVertIcon sx={{ color: '#d93025' }} />,
      severityColor: '#d93025',
      severityTextColor: '#fff',
      type: 'all',
      read: false,
      flagged: false,
      mention: true
    },
    {
      id: 4,
      title: "Ticket resolved",
      details: "Ticket #TKT-2024-004 marked as resolved by Deepak <deepak@gmail.com>",
      date: "May 29",
      severity: "MEDIUM",
      icon: <EmailIcon sx={{ color: '#34a853' }} />,
      severityColor: '#fef7e0',
      severityTextColor: '#000',
      type: 'all',
      read: true,
      flagged: false,
      mention: false
    },
    {
      id: 5,
      title: "Customer feedback received",
      details: "New feedback received for ticket #TKT-2024-005 from Rohit Jain <jainrohit0751@gmail.com>",
      date: "Apr 21",
      severity: "MEDIUM",
      icon: <EmailIcon sx={{ color: '#2566b0' }} />,
      severityColor: '#fef7e0',
      severityTextColor: '#000',
      type: 'all',
      read: false,
      flagged: false,
      mention: false
    }
  ];

  // Filtering logic for dropdown
  let filteredNotifications = notifications;
  if (activeTab === 0) {
    if (selectedFilter.value === 'unread') {
      filteredNotifications = notifications.filter(n => !n.read);
    } else if (selectedFilter.value === 'flagged') {
      filteredNotifications = notifications.filter(n => n.flagged);
    } else if (selectedFilter.value === 'mentions') {
      filteredNotifications = notifications.filter(n => n.mention);
    }
  } else {
    // For EMAIL FAILURE tab, you can add your own filter logic
    filteredNotifications = notifications.filter(n => n.type === 'email_failure');
  }

  const EmptyState = () => (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '60vh',
      textAlign: 'center',
      px: 3
    }}>
      <Box sx={{
        position: 'relative',
        mb: 3,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <Box sx={{
          position: 'absolute',
          width: 80,
          height: 80,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%)',
          opacity: 0.6,
          zIndex: 0
        }} />
        <Box sx={{
          position: 'absolute',
          width: 60,
          height: 60,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #fff3e0 0%, #fce4ec 100%)',
          opacity: 0.8,
          zIndex: 0,
          top: -10,
          right: -10
        }} />
        <NotificationsIcon sx={{
          fontSize: 60,
          color: '#2566b0',
          zIndex: 1,
          position: 'relative'
        }} />
      </Box>
      <Typography variant="h6" sx={{
        fontWeight: 600,
        color: '#000',
        mb: 1
      }}>
        No Notification
      </Typography>
      <Typography variant="body2" sx={{
        color: '#666',
        maxWidth: 200
      }}>
        you don't have any notification yet
      </Typography>
    </Box>
  );

  return (
    <Drawer
      anchor='right'
      open={open}
      onClose={(event, reason) => {
        if (reason === "escapeKeyDown") {
          onClose();
          return;
        }
        if (reason === "backdropClick") {
          return;
        }
      }}
      ModalProps={{
        disableEscapeKeyDown: false,
        keepMounted: true,
        BackdropProps: {
          style: {
            backgroundColor: "rgb(255 255 255 / 50%)",
            cursor: "default",
            pointerEvents: "none",
          },
        },
      }}
      // hideBackdrop
      sx={{
        zIndex: 9999,
        "& .MuiDrawer-paper": {
          width: "40%",
          position: "absolute",
          top: 0,
          backgroundColor: "#f9fafb",
          zIndex: 0,
          pointerEvents: "auto",
        },
      }}

    >
      {/* Header */}
      <Box sx={{
        p: 2,
        borderBottom: "1px solid #eee",
        backgroundColor: "#e0e0e0",
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Typography variant="h6" sx={{
          fontWeight: 600,
          color: '#000',
          fontSize: '1.25rem'
        }}>
          Notifications
        </Typography>
        <IconButton
          onClick={onClose}
          sx={{
            color: '#666',
            '&:hover': {
              backgroundColor: '#f5f5f5'
            }
          }}
        >
          <CloseIcon />
        </IconButton>
      </Box>

      {/* Tabs + Dropdown */}
      <Box sx={{ px: 3, pt: 2, display: 'flex', alignItems: 'center' }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          sx={{
            '& .MuiTab-root': {
              textTransform: 'none',
              fontWeight: 500,
              fontSize: '0.875rem',
              minWidth: 'auto',
              px: 3,
              py: 1.5,
              color: '#666',
              '&.Mui-selected': {
                color: '#000',
                fontWeight: 600
              }
            },
            '& .MuiTabs-indicator': {
              backgroundColor: '#2566b0',
              height: 2
            }
          }}
        >
          <Tab
            label={
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                {selectedFilter.label}
                {activeTab === 0 && (
                  <IconButton
                    size="small"
                    onClick={handleFilterClick}
                    sx={{ ml: 0.5, p: 0, color: '#666' }}
                    aria-label="Open filter menu"
                  >
                    <ArrowDropDownIcon />
                  </IconButton>
                )}
              </Box>
            }
          />
          <Tab label="EMAIL FAILURE" />
        </Tabs>
        {/* Dropdown menu for filter */}
        <Menu
          anchorEl={filterAnchorEl}
          open={Boolean(filterAnchorEl)}
          onClose={handleFilterClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
          transformOrigin={{ vertical: 'top', horizontal: 'left' }}
          MenuListProps={{ sx: { minWidth: 180 } }}
        >
          {FILTER_OPTIONS.map(option => (
            <MenuItem
              key={option.value}
              selected={selectedFilter.value === option.value}
              onClick={() => handleFilterSelect(option)}
              sx={{ fontWeight: selectedFilter.value === option.value ? 600 : 400 }}
            >
              {option.label}
              {selectedFilter.value === option.value && (
                <CheckIcon fontSize="small" sx={{ ml: 'auto', color: '#2566b0' }} />
              )}
            </MenuItem>
          ))}
        </Menu>
      </Box>

      <Divider sx={{ mt: 1 }} />

      {/* Content */}
      <Box sx={{ flex: 1, overflow: 'hidden' }}>
        {filteredNotifications.length > 0 ? (
          <List sx={{ p: 0 }}>
            {filteredNotifications.map((notification) => (
              <ListItem
                key={notification.id}
                sx={{
                  borderBottom: '1px solid #f0f0f0',
                  '&:last-child': { borderBottom: 'none' },
                  '&:hover': { backgroundColor: '#f8f9fa' },
                  cursor: 'pointer',
                  py: 2.5,
                  px: 3,
                }}
              >
                <ListItemIcon sx={{ minWidth: 40, mr: 2 }}>
                  {notification.icon}
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography variant="body2" sx={{
                      fontWeight: 600,
                      color: '#000',
                      mb: 0.5,
                      lineHeight: 1.4
                    }}>
                      {notification.title}
                    </Typography>
                  }
                  secondary={
                    <Typography variant="caption" sx={{
                      color: '#666',
                      display: 'block',
                      mb: 1,
                      lineHeight: 1.4
                    }}>
                      {notification.details}
                    </Typography>
                  }
                  sx={{ flex: 1 }}
                />
                <Box sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-end',
                  gap: 1
                }}>
                  <Typography variant="caption" sx={{
                    color: '#666',
                    fontSize: '0.75rem'
                  }}>
                    {notification.date}
                  </Typography>
                  <Chip
                    label={notification.severity}
                    size="small"
                    sx={{
                      backgroundColor: notification.severityColor,
                      color: notification.severityTextColor,
                      fontSize: '0.7rem',
                      fontWeight: 600,
                      height: 20,
                      '& .MuiChip-label': {
                        px: 1,
                      },
                    }}
                  />
                </Box>
              </ListItem>
            ))}
          </List>
        ) : (
          <EmptyState />
        )}
      </Box>
    </Drawer>
  );
};

export default NotificationPopup; 