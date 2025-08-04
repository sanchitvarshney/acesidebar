import React, { useRef, useEffect } from 'react';
import { Popper, Paper, Box, Typography, IconButton, List, ListItem, ListItemIcon, ListItemText, Chip } from '@mui/material';
import { Close as CloseIcon, Email as EmailIcon, MoreVert as MoreVertIcon } from '@mui/icons-material';

interface NotificationPopupProps {
  open: boolean;
  onClose: () => void;
  anchorEl: HTMLElement | null;
}

const NotificationPopup: React.FC<NotificationPopupProps> = ({ open, onClose, anchorEl }) => {
  const popupRef = useRef<HTMLDivElement>(null);

  const notifications = [
    {
      id: 1,
      title: "New ticket assigned",
      details: "Ticket #TKT-2024-001 assigned to Abhishek Srivastava <abhishek.srivastava@oakter.com>",
      date: "Jul 23",
      severity: "MEDIUM",
      icon: <EmailIcon sx={{ color: '#1a73e8' }} />,
      severityColor: '#fef7e0',
      severityTextColor: '#000'
    },
    {
      id: 2,
      title: "Ticket status updated",
      details: "Ticket #TKT-2024-002 status changed to 'In Progress' by Amit Vashisth <amit.vashisth@oakter.com>",
      date: "Jul 23",
      severity: "MEDIUM",
      icon: <EmailIcon sx={{ color: '#1a73e8' }} />,
      severityColor: '#fef7e0',
      severityTextColor: '#000'
    },
    {
      id: 3,
      title: "High priority ticket created",
      details: "Critical ticket #TKT-2024-003 created for system outage",
      date: "Jun 09",
      severity: "HIGH",
      icon: <MoreVertIcon sx={{ color: '#d93025' }} />,
      severityColor: '#d93025',
      severityTextColor: '#fff'
    },
    {
      id: 4,
      title: "Ticket resolved",
      details: "Ticket #TKT-2024-004 marked as resolved by Deepak <deepak@gmail.com>",
      date: "May 29",
      severity: "MEDIUM",
      icon: <EmailIcon sx={{ color: '#34a853' }} />,
      severityColor: '#fef7e0',
      severityTextColor: '#000'
    },
    {
      id: 5,
      title: "Customer feedback received",
      details: "New feedback received for ticket #TKT-2024-005 from Rohit Jain <jainrohit0751@gmail.com>",
      date: "Apr 21",
      severity: "MEDIUM",
      icon: <EmailIcon sx={{ color: '#1a73e8' }} />,
      severityColor: '#fef7e0',
      severityTextColor: '#000'
    }
  ];

  // Handle click outside to close popup
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target as Node) &&
        anchorEl &&
        !anchorEl.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open, onClose, anchorEl]);

  return (
    <Popper
      open={open}
      anchorEl={anchorEl}
      placement="bottom-end"
      style={{ zIndex: 1300 }}
      modifiers={[
        { name: 'offset', options: { offset: [0, 16] } },
      ]}
    >
      <Paper
        ref={popupRef}
        elevation={8}
        sx={{
          width: 400,
          maxHeight: 500,
          borderRadius: 2,
          overflow: 'visible',
          backgroundColor: '#fff',
          border: '1px solid #e0e0e0',
          position: 'relative',
          // Arrow tip border (larger, behind)
          '&::before': {
            content: '""',
            position: 'absolute',
            top: -9,
            right: 24,
            width: 0,
            height: 0,
            borderLeft: '9px solid transparent',
            borderRight: '9px solid transparent',
            borderBottom: '9px solid #e0e0e0',
            zIndex: -1,
          },
          // Arrow tip (smaller, on top)
          '&::after': {
            content: '""',
            position: 'absolute',
            top: -8,
            right: 24,
            width: 0,
            height: 0,
            borderLeft: '8px solid transparent',
            borderRight: '8px solid transparent',
            borderBottom: '8px solid #fff',
            filter: 'drop-shadow(0 -1px 1px rgba(0,0,0,0.1))',
          },
        }}
      >
        {/* Header */}
        <Box sx={{ p: 2, borderBottom: '1px solid #e0e0e0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" sx={{ fontWeight: 600, color: '#000' }}>
            Alerts
          </Typography>
          <Typography 
            variant="body2" 
            sx={{ 
              color: '#1a73e8', 
              cursor: 'pointer', 
              fontWeight: 500,
              '&:hover': { textDecoration: 'underline' } 
            }}
          >
            View all
          </Typography>
        </Box>

        {/* Notifications List */}
        <Box sx={{ maxHeight: 400, overflowY: 'auto' }}>
          <List sx={{ p: 0 }}>
            {notifications.map((notification) => (
              <ListItem
                key={notification.id}
                sx={{
                  borderBottom: '1px solid #f0f0f0',
                  '&:last-child': { borderBottom: 'none' },
                  '&:hover': { backgroundColor: '#f8f9fa' },
                  cursor: 'pointer',
                  py: 2,
                  px: 2,
                }}
              >
                <ListItemIcon sx={{ minWidth: 40, mr: 2 }}>
                  {notification.icon}
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography variant="body2" sx={{ fontWeight: 600, color: '#000', mb: 0.5 }}>
                      {notification.title}
                    </Typography>
                  }
                  secondary={
                    <Typography variant="caption" sx={{ color: '#666', display: 'block', mb: 1 }}>
                      {notification.details}
                    </Typography>
                  }
                  sx={{ flex: 1 }}
                />
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 1 }}>
                  <Typography variant="caption" sx={{ color: '#666', fontSize: '0.75rem' }}>
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
        </Box>
      </Paper>
    </Popper>
  );
};

export default NotificationPopup; 