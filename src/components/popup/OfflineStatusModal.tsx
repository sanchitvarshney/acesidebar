import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  Box,
  Typography,
  Button
} from '@mui/material';
import AlarmOffIcon from '@mui/icons-material/AlarmOff';
import { useStatus } from '../../contextApi/StatusContext';
import { useAuth } from '../../contextApi/AuthContext';
import { useNavigate } from 'react-router-dom';

interface OfflineStatusModalProps {
  open: boolean;
  onClose: () => void;
}

const OfflineStatusModal: React.FC<OfflineStatusModalProps> = ({
  open,
  onClose,
}) => {
  const [timeElapsed, setTimeElapsed] = useState(0);
  const { currentStatus, handleResume } = useStatus();
  const { signOut } = useAuth();
  const navigate = useNavigate();

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (open && currentStatus === 'offline') {
      interval = setInterval(() => {
        setTimeElapsed(prev => {
          const newTime = prev + 1;
          
          // Check if timer reaches 23:59:50 (86390 seconds)
          if (newTime >= 86390) {
            // Auto logout after 23:59:50
            handleAutoLogout();
            return prev; // Keep current time
          }
          
          return newTime;
        });
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [open, currentStatus]);

  // Reset timer when modal opens and update document title and favicon
  useEffect(() => {
    if (open) {
      setTimeElapsed(0);
      // Update document title to show offline status
      document.title = 'Offline - TMS';
      // Update favicon to stop icon
      updateFavicon('/favicon-offline.ico');
    } else {
      // Reset document title and favicon when modal closes
      document.title = 'TMS';
      resetFavicon();
    }
  }, [open]);

  // Update document title with timer when offline
  useEffect(() => {
    if (open && currentStatus === 'offline') {
      document.title = `${formatTime(timeElapsed)}`;
    }
  }, [timeElapsed, open, currentStatus]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const updateFavicon = (iconPath: string) => {
    // Remove existing favicon links
    const existingLinks = document.querySelectorAll("link[rel*='icon']");
    existingLinks.forEach(link => link.remove());

    // Create new favicon link
    const link = document.createElement('link');
    link.type = 'image/x-icon';
    link.rel = 'shortcut icon';
    link.href = iconPath;
    document.getElementsByTagName('head')[0].appendChild(link);

    // Also update apple-touch-icon for better compatibility
    const appleLink = document.createElement('link');
    appleLink.rel = 'apple-touch-icon';
    appleLink.href = iconPath;
    document.getElementsByTagName('head')[0].appendChild(appleLink);
  };

  const resetFavicon = () => {
    // Remove existing favicon links
    const existingLinks = document.querySelectorAll("link[rel*='icon']");
    existingLinks.forEach(link => link.remove());

    // Reset to default favicon
    const link = document.createElement('link');
    link.type = 'image/x-icon';
    link.rel = 'shortcut icon';
    link.href = '/favicon.ico';
    document.getElementsByTagName('head')[0].appendChild(link);
  };

  const handleResumeClick = () => {
    handleResume();
  };

  const handleAutoLogout = () => {
    // Clear all local storage
    localStorage.clear();
    sessionStorage.clear();

    // Clear all cookies
    document.cookie.split(";").forEach((c) => {
      document.cookie = c
        .replace(/^ +/, "")
        .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });

    // Reset document title and favicon
    document.title = 'TMS';
    resetFavicon();

    // Close the modal
    onClose();

    // Use the AuthContext signOut function
    signOut();

    // Navigate to login page
    navigate('/login');
  };

  return (
    <Dialog
      open={open}
      onClose={() => { }} // Prevent closing with ESC or backdrop click
      maxWidth="sm"
      fullWidth
      disableEscapeKeyDown
      PaperProps={{
        sx: {
          borderRadius: 3,
          boxShadow: 24,
          backgroundColor: '#fff',
          border: '1px solid #e0e0e0',
        },
      }}
      BackdropProps={{
        sx: {
          backdropFilter: 'blur(4px)',
          backgroundColor: 'rgba(0, 0, 0, 0.4)',
        },
      }}
    >
      <DialogContent
        sx={{
          p: 3,
          position: 'relative',
        }}
      >
        {/* Row: Icon + Text */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            mb: 3,
          }}
        >
          {/* Icon Left */}
          <AlarmOffIcon
            sx={{
              fontSize: 72,
              color: '#f44336',
              mr: 2,
            }}
          />

          {/* Right Side: Heading + Description */}
          <Box>
            <Typography
              variant="h5"
              sx={{
                color: '#000',
                fontWeight: 600,
                mb: 1,
              }}
            >
              Offline...
            </Typography>

            <Typography
              variant="body2"
              sx={{
                color: '#666',
                lineHeight: 1.4,
                mb: 1,
              }}
            >
              All calls will be disabled during this time, but tickets will still be allocated to you.
            </Typography>

            {/* Timer Display */}
            <Typography
              variant="body1"
              sx={{
                color: '#f44336',
                fontWeight: 600,
                fontFamily: 'monospace',
              }}
            >
              You are offline since : {formatTime(timeElapsed)}
            </Typography>
          </Box>
        </Box>

        {/* Resume Button */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
          }}
        >
          <Button
            variant="contained"
            onClick={handleResumeClick}
            sx={{
              backgroundColor: '#ff9800',
              color: '#fff',
              borderRadius: 2,
              px: 3,
              py: 1,
              textTransform: 'none',
              fontSize: '0.9rem',
              fontWeight: 500,
              '&:hover': {
                backgroundColor: '#f57c00',
              },
            }}
          >
            Resume
          </Button>
        </Box>
      </DialogContent>

    </Dialog>
  );
};

export default OfflineStatusModal;
