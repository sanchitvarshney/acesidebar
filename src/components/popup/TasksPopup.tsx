import React, { useState, useRef, useEffect } from 'react';
import { Popper, Paper, Box, Typography, IconButton, Tabs, Tab, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { 
  Close as CloseIcon, 
  CheckCircle as CheckCircleIcon,
  HourglassEmpty as HourglassEmptyIcon,
  Download as DownloadIcon,
  Upload as UploadIcon,
  Description as DescriptionIcon,
  InfoOutline as InfoOutlineIcon
} from '@mui/icons-material';

interface TasksPopupProps {
  open: boolean;
  onClose: () => void;
  anchorEl: HTMLElement | null;
}

interface Task {
  id: string;
  title: string;
  status: 'completed' | 'in-progress' | 'pending';
  type: 'import' | 'export';
  initiatedBy: string;
  timestamp: string;
  details?: string;
}

const TasksPopup: React.FC<TasksPopupProps> = ({ open, onClose, anchorEl }) => {
  const [activeTab, setActiveTab] = useState(1); // 0 for "YOUR TASKS", 1 for "OTHERS' TASKS"
  const popupRef = useRef<HTMLDivElement>(null);

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

  // Sample tasks data
  const yourTasks: Task[] = [
    {
      id: '1',
      title: 'Export ticket data to Excel',
      status: 'completed',
      type: 'export',
      initiatedBy: 'You',
      timestamp: '2 hours ago',
      details: 'Successfully exported 1,234 tickets to Excel format'
    },
    {
      id: '2',
      title: 'Import customer contacts',
      status: 'in-progress',
      type: 'import',
      initiatedBy: 'You',
      timestamp: '1 hour ago',
      details: 'Processing 500 customer records...'
    }
  ];

  const othersTasks: Task[] = [
    {
      id: '3',
      title: 'User info CSV file is ready to download',
      status: 'completed',
      type: 'export',
      initiatedBy: 'Mahendra Sharma',
      timestamp: '30 minutes ago',
      details: 'CSV file contains 2,500 user records'
    },
    {
      id: '4',
      title: 'Import ticket categories',
      status: 'completed',
      type: 'import',
      initiatedBy: 'Priya Patel',
      timestamp: '1 day ago',
      details: 'Successfully imported 50 ticket categories'
    },
    {
      id: '5',
      title: 'Export monthly report',
      status: 'in-progress',
      type: 'export',
      initiatedBy: 'Rahul Kumar',
      timestamp: '2 hours ago',
      details: 'Generating monthly performance report...'
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircleIcon sx={{ color: '#4caf50', fontSize: 20 }} />;
      case 'in-progress':
        return <HourglassEmptyIcon sx={{ color: '#ff9800', fontSize: 20 }} />;
      case 'pending':
        return <HourglassEmptyIcon sx={{ color: '#9e9e9e', fontSize: 20 }} />;
      default:
        return <HourglassEmptyIcon sx={{ color: '#9e9e9e', fontSize: 20 }} />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'export':
        return <DownloadIcon sx={{ color: '#2196f3', fontSize: 16 }} />;
      case 'import':
        return <UploadIcon sx={{ color: '#4caf50', fontSize: 16 }} />;
      default:
        return <DescriptionIcon sx={{ color: '#9e9e9e', fontSize: 16 }} />;
    }
  };

  const renderTasks = (tasks: Task[]) => {
    const completedTasks = tasks.filter(task => task.status === 'completed');
    const inProgressTasks = tasks.filter(task => task.status === 'in-progress');
    const pendingTasks = tasks.filter(task => task.status === 'pending');

    return (
      <Box>
        {completedTasks.length > 0 && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#000', mb: 1, px: 2, pt: 1 }}>
              Completed
            </Typography>
            <List sx={{ p: 0 }}>
              {completedTasks.map((task) => (
                <ListItem key={task.id} sx={{ px: 2, py: 1 }}>
                  <ListItemIcon sx={{ minWidth: 32 }}>
                    {getStatusIcon(task.status)}
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="body2" sx={{ color: '#000', flex: 1 }}>
                          {task.title}
                        </Typography>
                        {getTypeIcon(task.type)}
                      </Box>
                    }
                    secondary={
                      <Box>
                        <Typography variant="caption" sx={{ color: '#666', display: 'block' }}>
                          Started by {task.initiatedBy}
                        </Typography>
                        <Typography 
                          variant="caption" 
                          sx={{ 
                            color: '#1a73e8', 
                            cursor: 'pointer', 
                            textDecoration: 'underline',
                            '&:hover': { textDecoration: 'none' }
                          }}
                        >
                          See details
                        </Typography>
                      </Box>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </Box>
        )}

        {inProgressTasks.length > 0 && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#000', mb: 1, px: 2, pt: 1 }}>
              In Progress
            </Typography>
            <List sx={{ p: 0 }}>
              {inProgressTasks.map((task) => (
                <ListItem key={task.id} sx={{ px: 2, py: 1 }}>
                  <ListItemIcon sx={{ minWidth: 32 }}>
                    {getStatusIcon(task.status)}
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="body2" sx={{ color: '#000', flex: 1 }}>
                          {task.title}
                        </Typography>
                        {getTypeIcon(task.type)}
                      </Box>
                    }
                    secondary={
                      <Box>
                        <Typography variant="caption" sx={{ color: '#666', display: 'block' }}>
                          Started by {task.initiatedBy}
                        </Typography>
                        <Typography 
                          variant="caption" 
                          sx={{ 
                            color: '#1a73e8', 
                            cursor: 'pointer', 
                            textDecoration: 'underline',
                            '&:hover': { textDecoration: 'none' }
                          }}
                        >
                          See details
                        </Typography>
                      </Box>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </Box>
        )}

        {pendingTasks.length > 0 && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#000', mb: 1, px: 2, pt: 1 }}>
              Pending
            </Typography>
            <List sx={{ p: 0 }}>
              {pendingTasks.map((task) => (
                <ListItem key={task.id} sx={{ px: 2, py: 1 }}>
                  <ListItemIcon sx={{ minWidth: 32 }}>
                    {getStatusIcon(task.status)}
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="body2" sx={{ color: '#000', flex: 1 }}>
                          {task.title}
                        </Typography>
                        {getTypeIcon(task.type)}
                      </Box>
                    }
                    secondary={
                      <Box>
                        <Typography variant="caption" sx={{ color: '#666', display: 'block' }}>
                          Started by {task.initiatedBy}
                        </Typography>
                        <Typography 
                          variant="caption" 
                          sx={{ 
                            color: '#1a73e8', 
                            cursor: 'pointer', 
                            textDecoration: 'underline',
                            '&:hover': { textDecoration: 'none' }
                          }}
                        >
                          See details
                        </Typography>
                      </Box>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </Box>
        )}
      </Box>
    );
  };

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
          width: 380,
          maxHeight: 500,
          borderRadius: 2,
          overflow: 'visible',
          backgroundColor: '#fff',
          border: '1px solid #e0e0e0',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
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
        <Box sx={{ p: 2, borderBottom: '1px solid #e0e0e0' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#000' }}>
              Tasks
            </Typography>
            <IconButton size="small" onClick={onClose} sx={{ color: '#666' }}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>

        {/* Tabs */}
        <Box sx={{ borderBottom: '1px solid #e0e0e0' }}>
          <Tabs 
            value={activeTab} 
            onChange={(e, newValue) => setActiveTab(newValue)}
            sx={{
              '& .MuiTab-root': {
                textTransform: 'none',
                fontWeight: 500,
                minWidth: 'auto',
                flex: 1,
                color: '#666',
                '&.Mui-selected': {
                  color: '#1a73e8',
                },
                '&.Mui-disabled': {
                  color: '#ccc',
                  cursor: 'default',
                  opacity: 0.6,
                },
              },
              '& .MuiTabs-indicator': {
                backgroundColor: '#1a73e8',
                height: 2,
              },
            }}
          >
            <Tab label="YOUR TASKS" disabled />
            <Tab label="OTHERS' TASKS" />
          </Tabs>
        </Box>

        {/* Content */}
        <Box sx={{ 
          maxHeight: 400, 
          overflowY: 'auto',
          flex: 1,
          display: 'flex',
          flexDirection: 'column'
        }}>
          {activeTab === 0 ? renderTasks(yourTasks) : renderTasks(othersTasks)}
        </Box>

        {/* Footer */}
                  <Box sx={{
            p: 2,
            pt: 1,
            borderTop: '1px solid #e0e0e0',
            backgroundColor: '#fff',
            position: 'sticky',
            bottom: 0,
            borderRadius: '0 0 8px 8px'
          }}>
            <Typography variant="caption" sx={{ color: '#666', fontSize: '0.75rem' }}>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 0.5,
                border: "1px solid #ef7918",
                backgroundColor: '#fff4e5',
                borderRadius: '12px',
                px: 1.5,
                py: 0.5
              }}>
                <InfoOutlineIcon sx={{ fontSize: 16, color: '#ef7918' }} />
                Activities beyond 15 days get cleared from this list
              </Box>
            </Typography>
          </Box>
      </Paper>
    </Popper>
  );
};

export default TasksPopup; 