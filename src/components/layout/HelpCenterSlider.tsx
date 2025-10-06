import React, { useEffect, useMemo, useState } from 'react';
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
  Button,
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
  PlayArrow as PlayArrowIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

interface HelpCenterSliderProps {
  open: boolean;
  onClose: () => void;
}


 export const baseSteps = [
    { 
      id: 1, 
      title: "Learn the basics", 
      completed: false, 
      icon: <CheckCircleIcon sx={{ color: '#4caf50', fontSize: 20 }} />,
      path:"learn-basics"
    },
    { 
      id: 2, 
      title: "Brand Info", 
      completed: false, 
      icon: <CancelIcon sx={{ color: '#f44336', fontSize: 20 }} />, 
      path:"brand-info"
    },
    { 
      id: 3, 
      title: "SMTP Config", 
      completed: false, 
      icon: <CancelIcon sx={{ color: '#f44336', fontSize: 20 }} />,
      path:"smtp-config"
    },
    { 
      id: 4, 
      title: "WhatsApp Config", 
      completed: false, 
      isOptional: true,
      icon: <StarIcon sx={{ color: '#ff9800', fontSize: 20 }} />,
      path:"whatsapp-config"
    },
    { 
      id: 5, 
      title: "Google reCAPTCHA", 
      completed: false, 
      isOptional: true,
      icon: <StarIcon sx={{ color: '#ff9800', fontSize: 20 }} />,
      path:"recaptcha"
    },
    { 
      id: 6, 
      title: "Completion", 
      completed: false, 
      icon: <CancelIcon sx={{ color: '#f44336', fontSize: 20 }} />,
      path:"completion"
    },
  ];

const HelpCenterSlider: React.FC<HelpCenterSliderProps> = ({ open, onClose }) => {
 const { isOpen } = useSelector((state: any) => state.shotcut);
  const [gettingStartedExpanded, setGettingStartedExpanded] = useState(true);
  const navigate = useNavigate();

  // Read completion from localStorage to show accurate progress
  const storageKey = 'setupWizardCompletedPaths';
  const [completedPaths, setCompletedPaths] = useState<Set<string>>(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      const arr = raw ? JSON.parse(raw) : [];
      return Array.isArray(arr) ? new Set<string>(arr) : new Set<string>();
    } catch {
      return new Set<string>();
    }
  });

  useEffect(() => {
    const handler = () => {
      try {
        const raw = localStorage.getItem(storageKey);
        const arr = raw ? JSON.parse(raw) : [];
        setCompletedPaths(Array.isArray(arr) ? new Set<string>(arr) : new Set<string>());
      } catch {}
    };
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, []);

  const setupWizardSteps = useMemo(() => {
    return baseSteps.map(step => {
      const isCompleted = completedPaths.has(step.path) || step.completed;
      const dynamicIcon = isCompleted
        ? <CheckCircleIcon sx={{ color: '#4caf50', fontSize: 20 }} />
        : step.isOptional
          ? <StarIcon sx={{ color: '#ff9800', fontSize: 20 }} />
          : <CancelIcon sx={{ color: '#f44336', fontSize: 20 }} />;
      return {
        ...step,
        completed: isCompleted,
        icon: dynamicIcon,
      };
    });
  }, [completedPaths]);

  useEffect(() => {
  const handler = () => {
    const raw = localStorage.getItem(storageKey);
    const arr = raw ? JSON.parse(raw) : [];
    setCompletedPaths(Array.isArray(arr) ? new Set<string>(arr) : new Set<string>());
  };
  window.addEventListener('storage', handler);
  window.addEventListener('setupWizardProgress', handler as EventListener);
  return () => {
    window.removeEventListener('storage', handler);
    window.removeEventListener('setupWizardProgress', handler as EventListener);
  };
}, []);

  const completedCount = setupWizardSteps.filter(item => item.completed).length;
  const totalCount = setupWizardSteps.length;

  const otherMenuItems = [
    { title: "Keyboard Shortcuts", icon: <KeyboardIcon sx={{ fontSize: 20 }} /> },
    { title: "Improve your Ajaxter skills", icon: <SchoolIcon sx={{ fontSize: 20 }} /> },
    { title: "Contact Us", icon: <EmailIcon sx={{ fontSize: 20 }} /> },
  ];

  if (!open) return null;

  return (
    <>
      {/* Sliding Panel */}
      <motion.div
        initial={{ x: '0px' }} // Start from left of sidebar position
        animate={{ x: 0 }}
        exit={{ x: '0px' }}
        transition={{ 
          type: 'spring', 
          damping: 25, 
          stiffness: 200,
          duration: 0.4 
        }}
        style={{
          position: 'fixed',
          top: 0,
          left: isOpen ? "78px" : '0px', // Start after sidebar (sidebar width is 80px)
          width: '300px',
          height: 'calc(100vh - 5px)',
          backgroundColor: '#f5f5f5',
          zIndex: 1000,
          overflow: 'hidden',
          boxShadow: '4px 0 20px rgba(0, 0, 0, 0.15)',
        }}
      >
            <Box sx={{ p: 2, height: '100%' }}>
              {/* Header */}
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                mb: 3 
              }}>
                <Typography variant="h5" sx={{ fontWeight: 600, color: '#1a1a1a' }}>
                  Setup Wizard
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
                      Setup Steps
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
                    {setupWizardSteps.map((item, index) => (
                      <ListItem
                        key={item.id}
                        onClick={() => {
                         navigate(`/getting-started/${item.path}`, {
                           state: {
                             id: item.id,
                             title: item.title,
                             completed: item.completed,
                             path: item.path,
                             isOptional: item.isOptional
                           }
                         });
                        }}
                        sx={{
                          py: 1,
                          px: 2,
                          borderRadius: 1,
                          cursor: item.title === "Learn the basics" ? 'pointer' : 'default',
                          '&:hover': {
                            backgroundColor: item.title === "Learn the basics" ? '#e3f2fd' : '#f0f0f0',
                          }
                        }}
                      >
                        <ListItemIcon sx={{ minWidth: 32 }}>
                          {item.icon}
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Typography
                                variant="body2"
                                sx={{
                                  color: item.completed ? '#4caf50' : '#666',
                                  fontWeight: item.completed ? 500 : 400
                                }}
                              >
                                {item.title}
                              </Typography>
                              {item.isOptional && (
                                <Typography
                                  variant="caption"
                                  sx={{
                                    color: '#ff9800',
                                    fontWeight: 500,
                                    fontSize: '0.7rem'
                                  }}
                                >
                                  (Optional)
                                </Typography>
                              )}
                            </Box>
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
