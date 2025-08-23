import React, { useState } from "react";
import {
  Box,
  Typography,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  IconButton,
  Collapse,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  Divider,
} from "@mui/material";
import {
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Link as LinkIcon,
   LinkOff as UnlinkIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import { useCommanApiMutation } from "../../services/threadsApi";

interface LinkedTicket {
  id: string;
  title: string;
  status: string;
  priority: string;
  relationshipType: string;
  description?: string;
  createdAt: string;
}

interface LinkedTicketsDisplayProps {
  linkedTickets: LinkedTicket[];
  currentTicketId: string;
  onRefresh: () => void;
}

const relationshipColors: Record<string, string> = {
  blocks: "error",
  blocked_by: "warning",
  duplicate: "info",
  related: "default",
  parent: "success",
  child: "secondary",
};

const relationshipLabels: Record<string, string> = {
  blocks: "Blocks",
  blocked_by: "Blocked By",
  duplicate: "Duplicate",
  related: "Related",
  parent: "Parent",
  child: "Child",
};

const LinkedTicketsDisplay: React.FC<LinkedTicketsDisplayProps> = ({
  linkedTickets,
  currentTicketId,
  onRefresh,
}) => {
  const [commanApi] = useCommanApiMutation();
  const [expanded, setExpanded] = useState(true);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingTicket, setEditingTicket] = useState<LinkedTicket | null>(null);
  const [editDescription, setEditDescription] = useState("");
  const [editRelationshipType, setEditRelationshipType] = useState("");

  const handleExpandToggle = () => {
    setExpanded(!expanded);
  };

  const handleEditTicket = (ticket: LinkedTicket) => {
    setEditingTicket(ticket);
    setEditDescription(ticket.description || "");
    setEditRelationshipType(ticket.relationshipType);
    setEditDialogOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!editingTicket) return;

    try {
      await commanApi({
        url: "update-ticket-link",
        body: {
          sourceTicketId: currentTicketId,
          linkedTicketId: editingTicket.id,
          relationshipType: editRelationshipType,
          description: editDescription,
        },
      });
      
      setEditDialogOpen(false);
      setEditingTicket(null);
      onRefresh();
    } catch (error) {
      console.error("Failed to update ticket link:", error);
    }
  };

  const handleUnlinkTicket = async (ticketId: string) => {
    try {
      await commanApi({
        url: "unlink-ticket",
        body: {
          sourceTicketId: currentTicketId,
          linkedTicketId: ticketId,
        },
      });
      
      onRefresh();
    } catch (error) {
      console.error("Failed to unlink ticket:", error);
    }
  };

  const handleCloseEditDialog = () => {
    setEditDialogOpen(false);
    setEditingTicket(null);
    setEditDescription("");
    setEditRelationshipType("");
  };

  if (linkedTickets.length === 0) {
    return (
      <Box sx={{ p: 2, textAlign: "center" }}>
        <LinkIcon sx={{ fontSize: 40, color: "text.secondary", mb: 1 }} />
        <Typography variant="body2" color="text.secondary">
          No linked tickets
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Link tickets to create relationships and dependencies
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          cursor: "pointer",
          p: 1,
          "&:hover": { bgcolor: "action.hover" },
          borderRadius: 1,
        }}
        onClick={handleExpandToggle}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <LinkIcon fontSize="small" color="primary" />
          <Typography variant="subtitle2">
            Linked Tickets ({linkedTickets.length})
          </Typography>
        </Box>
        {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
      </Box>

      <Collapse in={expanded}>
        <List dense sx={{ pt: 0 }}>
          {linkedTickets.map((ticket) => (
            <ListItem
              key={ticket.id}
              sx={{
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 1,
                mb: 1,
                "&:hover": { bgcolor: "action.hover" },
              }}
            >
              <ListItemAvatar>
                <Avatar
                  sx={{
                    width: 32,
                    height: 32,
                    bgcolor: "primary.main",
                    fontSize: "0.75rem",
                  }}
                >
                  {ticket.title.charAt(0).toUpperCase()}
                </Avatar>
              </ListItemAvatar>

              <ListItemText
                primary={
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
                    <Typography variant="subtitle2" component="span">
                      #{ticket.id}
                    </Typography>
                    <Chip
                      label={relationshipLabels[ticket.relationshipType] || ticket.relationshipType}
                      color={relationshipColors[ticket.relationshipType] as any}
                      size="small"
                      variant="outlined"
                    />
                  </Box>
                }
                secondary={
                  <Box>
                    <Typography variant="body2" color="text.primary">
                      {ticket.title}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Status: {ticket.status} • Priority: {ticket.priority}
                    </Typography>
                    {ticket.description && (
                      <Typography variant="caption" display="block" color="text.secondary">
                        {ticket.description}
                      </Typography>
                    )}
                  </Box>
                }
              />

              <Box sx={{ display: "flex", gap: 0.5 }}>
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEditTicket(ticket);
                  }}
                  sx={{ color: "primary.main" }}
                >
                  <EditIcon fontSize="small" />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleUnlinkTicket(ticket.id);
                  }}
                  sx={{ color: "error.main" }}
                >
                  <UnlinkIcon fontSize="small" />
                </IconButton>
              </Box>
            </ListItem>
          ))}
        </List>
      </Collapse>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onClose={handleCloseEditDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Link Relationship</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Ticket #{editingTicket?.id} - {editingTicket?.title}
              </Typography>
            </Box>

            <FormControl fullWidth size="small">
              <InputLabel>Relationship Type</InputLabel>
              <Select
                value={editRelationshipType}
                onChange={(e) => setEditRelationshipType(e.target.value)}
                label="Relationship Type"
              >
                {Object.entries(relationshipLabels).map(([value, label]) => (
                  <MenuItem key={value} value={value}>
                    {label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              fullWidth
              size="small"
              label="Description (Optional)"
              placeholder="Add context about this relationship..."
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              multiline
              rows={3}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditDialog}>Cancel</Button>
          <Button onClick={handleSaveEdit} variant="contained">
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default LinkedTicketsDisplay;