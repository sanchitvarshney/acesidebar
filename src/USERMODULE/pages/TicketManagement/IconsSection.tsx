import React from 'react';
import { Box, IconButton } from '@mui/material';
import { Person, Chat, Apps, ArrowForwardIos, Info } from '@mui/icons-material';

interface IconsSectionProps {
  onToggleCustomerInfo: () => void;
  isCustomerInfoVisible: boolean;
  onInfoClick: () => void;
  onPersonClick: () => void;
  onChatClick: () => void;
}

const IconsSection: React.FC<IconsSectionProps> = ({ onToggleCustomerInfo, isCustomerInfoVisible, onInfoClick, onPersonClick, onChatClick }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '16px 8px',
        backgroundColor: 'white',
        border: '1px solid #e0e0e0',
        borderRadius: '8px',
        height: '100%',
        gap: '8px',
        justifyContent: 'flex-start',
      }}
    >
      {/* Arrow Forward Icon - First */}
      <IconButton
        onClick={onToggleCustomerInfo}
        sx={{
          width: '40px',
          height: '40px',
          backgroundColor: '#f5f5f5',
          border: '1px solid #e0e0e0',
          '&:hover': {
            backgroundColor: '#e8f0fe',
          },
        }}
      >
        <ArrowForwardIos 
          sx={{ 
            fontSize: '20px', 
            color: '#666',
            transform: isCustomerInfoVisible ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.3s ease-in-out'
          }} 
        />
      </IconButton>

      {/* Info Icon - Second */}
      <IconButton
        onClick={onInfoClick}
        sx={{
          width: '40px',
          height: '40px',
          backgroundColor: '#f5f5f5',
          border: '1px solid #e0e0e0',
          '&:hover': {
            backgroundColor: '#e8f0fe',
          },
        }}
      >
        <Info sx={{ fontSize: '20px', color: '#666' }} />
      </IconButton>

      {/* Person Icon */}
      <IconButton
        onClick={onPersonClick}
        sx={{
          width: '40px',
          height: '40px',
          backgroundColor: '#f5f5f5',
          border: '1px solid #e0e0e0',
          '&:hover': {
            backgroundColor: '#e8f0fe',
          },
        }}
      >
        <Person sx={{ fontSize: '20px', color: '#666' }} />
      </IconButton>

      {/* Chat Icon */}
      <IconButton
        onClick={onChatClick}
        sx={{
          width: '40px',
          height: '40px',
          backgroundColor: '#f5f5f5',
          border: '1px solid #e0e0e0',
          '&:hover': {
            backgroundColor: '#e8f0fe',
          },
        }}
      >
        <Chat sx={{ fontSize: '20px', color: '#666' }} />
      </IconButton>

      {/* Grid/Apps Icon */}
      <IconButton
        sx={{
          width: '40px',
          height: '40px',
          backgroundColor: '#f5f5f5',
          border: '1px solid #e0e0e0',
          '&:hover': {
            backgroundColor: '#e8f0fe',
          },
        }}
      >
        <Apps sx={{ fontSize: '20px', color: '#666' }} />
      </IconButton>
    </Box>
  );
};

export default IconsSection;
