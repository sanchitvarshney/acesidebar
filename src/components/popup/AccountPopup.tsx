import React, { useRef, useEffect } from 'react';
import { Popper, Paper, Box, Typography, IconButton, Avatar, Button, Divider, List, ListItem, ListItemAvatar, ListItemText } from '@mui/material';
import { Close as CloseIcon, CameraAlt as CameraIcon, KeyboardArrowDown as KeyboardArrowDownIcon } from '@mui/icons-material';

interface AccountPopupProps {
  open: boolean;
  onClose: () => void;
  anchorEl: HTMLElement | null;
}

const AccountPopup: React.FC<AccountPopupProps> = ({ open, onClose, anchorEl }) => {
  const popupRef = useRef<HTMLDivElement>(null);
  const userEmail = "shiv.kumar@mscorpres.in";
  const userName = "Shiv Kumar";
  const managedBy = "companyName";

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
        { name: 'offset', options: { offset: [0, 16] } }, // 8px arrow + 8px gap
      ]}
    >
      <Paper
        ref={popupRef}
        elevation={8}
        sx={{
          width: 320,
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
        <Box sx={{ p: 2, borderBottom: '1px solid #e0e0e0' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
            <Box>
              <Typography variant="body2" sx={{ fontWeight: 600, color: '#000' }}>
                {userEmail}
              </Typography>
              <Typography variant="caption" sx={{ color: '#666', display: 'block' }}>
                Managed by {managedBy}
              </Typography>
            </Box>
            <IconButton size="small" onClick={onClose} sx={{ color: '#666' }}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>

        {/* Profile Section */}
        <Box sx={{ p: 2, textAlign: 'center' }}>
          <Box sx={{ position: 'relative', display: 'inline-block', mb: 2 }}>
            <Avatar
              sx={{
                width: 80,
                height: 80,
                bgcolor: '#1a73e8',
                fontSize: '2rem',
                fontWeight: 600,
              }}
            >
              {userName.split(' ').map(n => n[0]).join('')}
            </Avatar>
            <IconButton
              size="small"
              sx={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                backgroundColor: '#fff',
                border: '2px solid #fff',
                '&:hover': { backgroundColor: '#f5f5f5' },
              }}
            >
              <CameraIcon fontSize="small" sx={{ color: '#666' }} />
            </IconButton>
          </Box>

          <Typography variant="h6" sx={{ fontWeight: 600, color: '#000', mb: 2 }}>
            Hi, {userName}!
          </Typography>

          <Button
            variant="outlined"
            sx={{
              borderColor: '#dadce0',
              color: '#1a73e8',
              textTransform: 'none',
              borderRadius: 2,
              px: 3,
              py: 1,
              '&:hover': {
                borderColor: '#1a73e8',
                backgroundColor: '#f8f9fa',
              },
            }}
          >
            Manage your TMS Account
          </Button>
        </Box>

        <Divider />

        {/* Sign Out Section */}
        <Box sx={{ p: 2 }}>
          <Button
            fullWidth
            variant="outlined"
            onClick={() => {
              localStorage.removeItem("token");
              window.location.href = "/login";
            }}
            sx={{
              borderColor: '#dadce0',
              color: '#d93025',
              textTransform: 'none',
              borderRadius: 2,
              py: 1.5,
              '&:hover': {
                borderColor: '#d93025',
                backgroundColor: '#fef7f7',
              },
            }}
          >
            Sign out
          </Button>
        </Box>

        {/* Footer */}
        <Box sx={{ p: 2, pt: 1, textAlign: 'center' }}>
          <Typography variant="caption" sx={{ color: '#666' }}>
            <span style={{ cursor: 'pointer', textDecoration: 'underline' }}>Privacy Policy</span>
            {' • '}
            <span style={{ cursor: 'pointer', textDecoration: 'underline' }}>Terms of Service</span>
          </Typography>
        </Box>
      </Paper>
    </Popper>
  );
};

export default AccountPopup; 