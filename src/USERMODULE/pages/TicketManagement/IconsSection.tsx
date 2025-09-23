import React from 'react';
import { Box, IconButton } from '@mui/material';
import { Person, Chat, ArrowForwardIos, Info } from '@mui/icons-material';

interface IconsSectionProps {
  onToggleCustomerInfo: () => void;
  isCustomerInfoVisible: boolean;
  onInfoClick: () => void;
  onPersonClick: () => void;
  onChatClick: () => void;
  chatCount?: number;
  activeContent?: 'customer' | 'info' | 'chat';
  
}

const IconsSection: React.FC<IconsSectionProps> = ({ onToggleCustomerInfo, isCustomerInfoVisible, onInfoClick, onPersonClick, onChatClick, chatCount = 0, activeContent }) => {
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
          backgroundColor: activeContent === 'info' ? '#1976d2' : '#f5f5f5',
          border: '1px solid #e0e0e0',
          '&:hover': {
            backgroundColor: activeContent === 'info' ? '#1565c0' : '#e8f0fe',
          },
        }}
      >
        <Info sx={{ 
          fontSize: '20px', 
          color: activeContent === 'info' ? 'white' : '#666' 
        }} />
      </IconButton>

      {/* Person Icon */}
      <IconButton
        onClick={onPersonClick}
        sx={{
          width: '40px',
          height: '40px',
          backgroundColor: activeContent === 'customer' ? '#1976d2' : '#f5f5f5',
          border: '1px solid #e0e0e0',
          '&:hover': {
            backgroundColor: activeContent === 'customer' ? '#1565c0' : '#e8f0fe',
          },
        }}
      >
        <Person sx={{ 
          fontSize: '20px', 
          color: activeContent === 'customer' ? 'white' : '#666' 
        }} />
      </IconButton>

      {/* Chat Icon */}
      <Box sx={{ position: 'relative' }}>
        <IconButton
          onClick={onChatClick}
          sx={{
            width: '40px',
            height: '40px',
            backgroundColor: activeContent === 'chat' ? '#1976d2' : '#f5f5f5',
            border: '1px solid #e0e0e0',
            '&:hover': {
              backgroundColor: activeContent === 'chat' ? '#1565c0' : '#e8f0fe',
            },
          }}
        >
          <Chat sx={{ 
            fontSize: '20px', 
            color: activeContent === 'chat' ? 'white' : '#666' 
          }} />
        </IconButton>
        
        {/* Blue Counter Badge */}
        <Box
          sx={{
            position: 'absolute',
            top: '-6px',
            right: '-6px',
            backgroundColor: '#1976d2',
            color: 'white',
            borderRadius: '50%',
            width: '20px',
            height: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '11px',
            fontWeight: 'bold',
            border: '2px solid white',
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
            minWidth: '20px',
            padding: '0 2px',
          }}
        >
          {chatCount}
        </Box>
      </Box>

    </Box>
  );
};

export default IconsSection;
