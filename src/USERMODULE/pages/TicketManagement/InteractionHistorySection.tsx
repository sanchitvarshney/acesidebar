import React from 'react';
import { Box, Typography, IconButton, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import { Refresh, ExpandLess, ExpandMore } from '@mui/icons-material';

interface InteractionHistorySectionProps {
  isExpanded: boolean;
  onToggle: () => void;
}

const InteractionHistorySection: React.FC<InteractionHistorySectionProps> = ({ isExpanded, onToggle }) => {

  return (
    <Accordion 
      expanded={isExpanded} 
      onChange={onToggle}
      sx={{ 
        marginBottom: '16px',
        '&:before': {
          display: 'none',
        },
        boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
      }}
    >
      <AccordionSummary
        sx={{
          backgroundColor: '#f5f5f5',
          minHeight: '48px',
          '&.Mui-expanded': {
            minHeight: '48px',
          },
          '& .MuiAccordionSummary-content': {
            margin: '8px 0',
            alignItems: 'center',
          },
        }}
        expandIcon={<ExpandMore sx={{ color: '#666' }} />}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
          <Typography variant="subtitle2" sx={{ flex: 1, fontWeight: 600 }}>
            Interaction h...
          </Typography>
          <IconButton size="small" sx={{ padding: '4px', marginRight: '4px' }}>
            <Refresh sx={{ fontSize: '16px', color: '#666' }} />
          </IconButton>
        </Box>
      </AccordionSummary>
      
      <AccordionDetails sx={{ padding: '16px', minHeight: '120px' }}>
        <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', marginTop: '20px' }}>
          No interaction history available
        </Typography>
      </AccordionDetails>
    </Accordion>
  );
};

export default InteractionHistorySection;
