import React from "react";
import Tooltip from "@mui/material/Tooltip";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

interface TicketSubjectTooltipProps {
  subject: string;
  description?: string;
  status?: string;
  children: React.ReactNode;
}

const TicketSubjectTooltip: React.FC<TicketSubjectTooltipProps> = ({
  subject,
  description,
  status,
  children,
}) => {
  return (
    <Tooltip
      title={
        <Box sx={{ p: 1, minWidth: 220 }}>
          <Typography variant="subtitle2" fontWeight={600} gutterBottom>
            {subject}
          </Typography>
          {description && (
            <Typography variant="body2" color="text.secondary" gutterBottom>
              <strong>Description:</strong> {description}
            </Typography>
          )}
          {status && (
            <Typography variant="body2" color="text.secondary">
              <strong>Status:</strong> {status}
            </Typography>
          )}
        </Box>
      }
      arrow
      placement="top"
    >
      {children as React.ReactElement}
    </Tooltip>
  );
};

export default TicketSubjectTooltip;
