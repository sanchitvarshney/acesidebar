import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Avatar,
  Box,
  IconButton,
  Typography,
} from "@mui/material";

import {
  Delete as DeleteIcon,
  Reply as ReplyIcon,
  Forward as ForwardIcon,
} from "@mui/icons-material";
import { useState } from "react";

const TicketReplayThread = ({
  reply,
  message,
  forward
}: {
  reply: () => void;
  message: any;
  forward:any
}) => {
  const [expanded, setExpanded] = useState<boolean>(false);
   const [hovered, setHovered] = useState<string | null>(null);

  const handleToggle = () => {
    setExpanded(!expanded);
  };

  // console.log(message);
  return (
    <Accordion
      expanded={expanded}
      onChange={handleToggle}
      sx={{ boxShadow: "none" }}
          onMouseEnter={() => setHovered(message?.user?.id)}
      onMouseLeave={() => setHovered(null)}
    >
      <AccordionSummary
        // expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1-content"
        id="panel1-header"
        sx={{
          paddingX: 0,
          paddingY: 1,
        }}
      >
        <Box
          sx={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box display="flex" alignItems="center">
            <Avatar sx={{ width: 40, height: 40, mr: 2 }} />
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                {message.user?.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {message?.subject}
              </Typography>
            </Box>
          </Box>

          <Typography variant="caption" color="text.secondary">
            {message?.time
              ? new Date(message.time).toLocaleString()
              : "Just now"}
          </Typography>
        </Box>

              {hovered === message?.user?.id && !expanded && (
            <Box sx={{ display: "flex", gap: 1, position: "absolute", top: 0, right: 0 }}>
        
              <IconButton size="small" color="primary" onClick={() => reply()} >
                <ReplyIcon fontSize="small" />
              </IconButton>
            </Box>
          )}
      </AccordionSummary>

      <AccordionDetails sx={{ pl: 6 }}>
        <Typography variant="body2" sx={{ mb: 2 }}>
          {message?.text}
        </Typography>

        <Box sx={{ display: "flex", justifyContent: "flex-start", gap: 1 }}>
          <IconButton onClick={() => reply()} size="small">
            <ReplyIcon fontSize="small" />
          </IconButton>
          <IconButton onClick={forward} size="small">
            <ForwardIcon fontSize="small" />
          </IconButton>
        </Box>
        
      </AccordionDetails>
 
    </Accordion>
  );
};

export default TicketReplayThread;
