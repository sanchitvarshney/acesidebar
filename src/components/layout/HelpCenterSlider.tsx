import React, { useState } from 'react';
import {
  Box,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  Collapse,
  Divider,
} from '@mui/material';
import {
  Close as CloseIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Star as StarIcon,
  Keyboard as KeyboardIcon,
  School as SchoolIcon,
  Email as EmailIcon,
  ExpandLess as ExpandLessIcon,
  ExpandMore as ExpandMoreIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

interface HelpCenterSliderProps {
  open: boolean;
  onClose: () => void;
}

const HelpCenterSlider: React.FC<HelpCenterSliderProps> = ({ open, onClose }) => {
  const [gettingStartedExpanded, setGettingStartedExpanded] = useState(true);

  const gettingStartedItems = [
    { 
      id: 1, 
      title: "Learn the basics", 
      completed: true, 
      icon: <CheckCircleIcon sx={{ color: '#4caf50', fontSize: 20 }} />
    },
    { 
      id: 2, 
      title: "Add agents", 
      completed: false, 
      icon: <CancelIcon sx={{ color: '#f44336', fontSize: 20 }} />
    },
    { 
      id: 3, 
      title: "Add departments", 
      completed: false, 
      icon: <CancelIcon sx={{ color: '#f44336', fontSize: 20 }} />
    },
    { 
      id: 4, 
      title: "Connect email accounts", 
      completed: false, 
      icon: <CancelIcon sx={{ color: '#f44336', fontSize: 20 }} />
    },
    { 
      id: 5, 
      title: "Connect social media", 
      completed: false, 
      active: true,
      icon: <StarIcon sx={{ color: '#2196f3', fontSize: 20 }} />
    },
    { 
      id: 6, 
      title: "Connect messaging apps", 
      completed: false, 
      icon: null
    },
    { 
      id: 7, 
      title: "Create contact widget", 
      completed: true, 
      icon: <CheckCircleIcon sx={{ color: '#4caf50', fontSize: 20 }} />
    },
    { 
      id: 8, 
      title: "Create call center", 
      completed: false, 
      icon: null
    },
    { 
      id: 9, 
      title: "Configure customer portal", 
      completed: false, 
      icon: null
    },
  ];

  const completedCount = gettingStartedItems.filter(item => item.completed).length;
  const totalCount = gettingStartedItems.length;

  const otherMenuItems = [
    { title: "Keyboard Shortcuts", icon: <KeyboardIcon sx={{ fontSize: 20 }} /> },
    { title: "Improve your LiveAgent skills", icon: <SchoolIcon sx={{ fontSize: 20 }} /> },
    { title: "Contact Us", icon: <EmailIcon sx={{ fontSize: 20 }} /> },
  ];

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.3)',
          zIndex: 999,
        }}
        onClick={onClose}
      />
      
      {/* Sliding Panel */}
      <motion.div
        initial={{ x: '-400px' }} // Start from left of sidebar position
        animate={{ x: 0 }}
        exit={{ x: '-400px' }}
        transition={{ 
          type: 'spring', 
          damping: 25, 
          stiffness: 200,
          duration: 0.4 
        }}
        style={{
          position: 'fixed',
          top: 0,
          left: '80px', // Start after sidebar (sidebar width is 80px)
          width: '400px',
          height: '100vh',
          backgroundColor: '#f5f5f5',
          zIndex: 1000,
          overflowY: 'auto',
          boxShadow: '4px 0 20px rgba(0, 0, 0, 0.15)',
        }}
      >
            <Box sx={{ p: 3, height: '100%' }}>
              {/* Header */}
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                mb: 3 
              }}>
                <Typography variant="h5" sx={{ fontWeight: 600, color: '#1a1a1a' }}>
                  Help center
                </Typography>
                <IconButton onClick={onClose} size="small">
                  <CloseIcon />
                </IconButton>
              </Box>

              {/* Getting Started Section */}
              <Box sx={{ mb: 3 }}>
                <Box
                  onClick={() => setGettingStartedExpanded(!gettingStartedExpanded)}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    p: 2,
                    backgroundColor: '#e0e0e0',
                    borderRadius: 1,
                    cursor: 'pointer',
                    mb: 1,
                    '&:hover': {
                      backgroundColor: '#d0d0d0',
                    }
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box sx={{ 
                      width: 24, 
                      height: 24, 
                      borderRadius: '50%', 
                      backgroundColor: '#4caf50',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <CheckCircleIcon sx={{ color: 'white', fontSize: 16 }} />
                    </Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                      Getting started
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Chip
                      label={`${completedCount}/${totalCount}`}
                      size="small"
                      sx={{ 
                        backgroundColor: '#4caf50', 
                        color: 'white',
                        fontWeight: 600,
                        '& .MuiChip-icon': {
                          color: 'white'
                        }
                      }}
                      icon={<CheckCircleIcon sx={{ fontSize: 16 }} />}
                    />
                    {gettingStartedExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                  </Box>
                </Box>

                <Collapse in={gettingStartedExpanded}>
                  <List sx={{ pl: 2 }}>
                    {gettingStartedItems.map((item, index) => (
                      <ListItem
                        key={item.id}
                        sx={{
                          py: 1,
                          px: 2,
                          borderRadius: 1,
                          backgroundColor: item.active ? '#e3f2fd' : 'transparent',
                          '&:hover': {
                            backgroundColor: item.active ? '#e3f2fd' : '#f0f0f0',
                          }
                        }}
                      >
                        <ListItemIcon sx={{ minWidth: 32 }}>
                          {item.icon}
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Typography
                              variant="body2"
                              sx={{
                                color: item.active ? '#2196f3' : item.completed ? '#4caf50' : '#666',
                                fontWeight: item.active ? 500 : 400
                              }}
                            >
                              {item.title}
                            </Typography>
                          }
                        />
                      </ListItem>
                    ))}
                  </List>
                </Collapse>
              </Box>

              <Divider sx={{ my: 2 }} />

              {/* Other Menu Items */}
              <List>
                {otherMenuItems.map((item, index) => (
                  <ListItem
                    key={index}
                    sx={{
                      py: 1.5,
                      px: 2,
                      borderRadius: 1,
                      cursor: 'pointer',
                      '&:hover': {
                        backgroundColor: '#f0f0f0',
                      }
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 40 }}>
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {item.title}
                        </Typography>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </Box>
      </motion.div>
    </>
  );
};

export default HelpCenterSlider;
