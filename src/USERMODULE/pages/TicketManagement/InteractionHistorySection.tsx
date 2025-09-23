import React from "react";
import {
  Box,
  Typography,
  IconButton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  Divider,
} from "@mui/material";
import {
  Refresh,
  ExpandLess,
  ExpandMore,
  Assignment,
  Person,
  Schedule,
  PriorityHigh,
} from "@mui/icons-material";

interface InteractionHistorySectionProps {
  isExpanded: boolean;
  onToggle: () => void;
}

const InteractionHistorySection: React.FC<InteractionHistorySectionProps> = ({
  isExpanded,
  onToggle,
}) => {
  // Sample recent active tickets data
  const recentTickets = [
    {
      id: "TK-2024-001",
      status: "Open",
      priority: "High",
      assignee: "John Smith",
      created: "2 hours ago",
      statusColor: "#f44336",
    },
    {
      id: "TK-2024-002",
      status: "In Progress",
      priority: "Medium",
      assignee: "Sarah Johnson",
      created: "4 hours ago",
      statusColor: "#ff9800",
    },
    {
      id: "TK-2024-003",
      status: "Resolved",
      priority: "Low",
      assignee: "Mike Wilson",
      created: "1 day ago",
      statusColor: "#4caf50",
    },
    {
      id: "TK-2024-004",
      status: "Open",
      priority: "Critical",
      assignee: "Alex Brown",
      created: "2 days ago",
      statusColor: "#f44336",
    },
    {
      id: "TK-2024-005",
      status: "In Progress",
      priority: "Medium",
      assignee: "Emma Davis",
      created: "3 days ago",
      statusColor: "#ff9800",
    },
      {
      id: "TK-2024-003",
      status: "Resolved",
      priority: "Low",
      assignee: "Mike Wilson",
      created: "1 day ago",
      statusColor: "#4caf50",
    },
    {
      id: "TK-2024-004",
      status: "Open",
      priority: "Critical",
      assignee: "Alex Brown",
      created: "2 days ago",
      statusColor: "#f44336",
    },
    {
      id: "TK-2024-005",
      status: "In Progress",
      priority: "Medium",
      assignee: "Emma Davis",
      created: "3 days ago",
      statusColor: "#ff9800",
    },  {
      id: "TK-2024-003",
      status: "Resolved",
      priority: "Low",
      assignee: "Mike Wilson",
      created: "1 day ago",
      statusColor: "#4caf50",
    },
    {
      id: "TK-2024-004",
      status: "Open",
      priority: "Critical",
      assignee: "Alex Brown",
      created: "2 days ago",
      statusColor: "#f44336",
    },
    {
      id: "TK-2024-005",
      status: "In Progress",
      priority: "Medium",
      assignee: "Emma Davis",
      created: "3 days ago",
      statusColor: "#ff9800",
    },
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Critical":
        return "#f44336";
      case "High":
        return "#ff5722";
      case "Medium":
        return "#ff9800";
      case "Low":
        return "#4caf50";
      default:
        return "#9e9e9e";
    }
  };

  return (
    <Accordion
      expanded={isExpanded}
      onChange={onToggle}
      sx={{
        marginBottom: "16px",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        "&:before": {
          display: "none",
        },
      }}
    >
      <AccordionSummary
        expandIcon={<ExpandMore />}
        sx={{
          backgroundColor: "#f5f5f5",
          minHeight: "48px",
          "&.Mui-expanded": {
            minHeight: "48px",
          },
          "& .MuiAccordionSummary-content": {
            margin: "12px 0",
            "&.Mui-expanded": {
              margin: "12px 0",
            },
          },
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Assignment sx={{ fontSize: "20px", color: "#666" }} />
          <Typography
            variant="subtitle1"
            sx={{ fontWeight: 600, color: "#333" }}
          >
            Recent Active Tickets
          </Typography>
        </Box>
      </AccordionSummary>
      <AccordionDetails sx={{ padding: "0" }}>
        <Box
          sx={{
            width: "100%",
            maxHeight: "calc(100vh - 355px)",
            overflowY: "auto",
          
          }}
        >
          <List sx={{ padding: 0 }}>
            {recentTickets.map((ticket, index) => (
              <React.Fragment key={ticket.id}>
                <ListItem
                  sx={{
                    padding: "12px 16px",
                    "&:hover": {
                      backgroundColor: "#f5f5f5",
                      cursor: "pointer",
                    },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: "40px" }}>
                    <Assignment sx={{ fontSize: "18px", color: "#666" }} />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          mb: 0.5,
                        }}
                      >
                        <Typography
                          variant="body2"
                          sx={{ fontWeight: 600, color: "#1976d2" }}
                        >
                          {ticket.id}
                        </Typography>
                        <Chip
                          label={ticket.status}
                          size="small"
                          sx={{
                            backgroundColor: ticket.statusColor,
                            color: "white",
                            fontSize: "10px",
                            height: "20px",
                            "& .MuiChip-label": {
                              padding: "0 8px",
                            },
                          }}
                        />
                        <Chip
                          label={ticket.priority}
                          size="small"
                          sx={{
                            backgroundColor: getPriorityColor(ticket.priority),
                            color: "white",
                            fontSize: "10px",
                            height: "20px",
                            "& .MuiChip-label": {
                              padding: "0 8px",
                            },
                          }}
                        />
                      </Box>
                    }
                    secondary={
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          fontSize: "11px",
                          color: "#666",
                          mt: 0.5,
                        }}
                      >
                        <Person sx={{ fontSize: "14px" }} />
                        <Typography variant="caption">
                          {ticket.assignee}
                        </Typography>
                        <Schedule sx={{ fontSize: "14px", ml: 1 }} />
                        <Typography variant="caption">
                          {ticket.created}
                        </Typography>
                      </Box>
                    }
                  />
                </ListItem>
                {index < recentTickets.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        </Box>
      </AccordionDetails>
    </Accordion>
  );
};

export default InteractionHistorySection;
