import React, { useState, useMemo, useEffect, useRef } from "react";
import ReactSimpleWysiwyg from "react-simple-wysiwyg";
import {
  Box,
  Grid,
  Typography,
  IconButton,
  Button,
  Divider,
  MenuItem,
  TextField,
  FormControl,
  InputLabel,
  Select,
  OutlinedInput,
  useTheme,
  Drawer,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import {
  useCreateTicketMutation,
  useGetPriorityListQuery,
  useGetTicketListQuery,
  useTicketSearchMutation,
} from "../../services/ticketAuth";
import { useToast } from "../../hooks/useToast";

interface Ticket {
  id: string;
  title: string;
  description: string;
  status: "open" | "in-progress" | "resolved" | "closed";
  priority: "low" | "normal" | "high" | "emergency";
  assignee: string;
  requester: string;
  createdAt: string;
  updatedAt: string;
  hasAttachment: boolean;
  isStarred: boolean;
  isRead: boolean;
  tags: string[];
  thread: any[] | undefined;
}

// Mock data for demonstration (fallback)
export const mockTickets: Ticket[] = [
  {
    id: "1",
    title: "Login page not working properly",
    description:
      "Users are unable to log in to the application. The login button is not responding.",
    status: "open",
    priority: "emergency",
    assignee: "John Doe",
    requester: "Sarah Wilson",
    createdAt: "2024-01-15T10:30:00Z",
    updatedAt: "2024-01-15T14:20:00Z",
    hasAttachment: true,
    isStarred: true,
    isRead: false,
    tags: ["frontend", "authentication"],
    thread: [],
  },
  {
    id: "2",
    title: "Database connection timeout",
    description:
      "The application is experiencing frequent database connection timeouts during peak hours.",
    status: "in-progress",
    priority: "high",
    assignee: "Mike Johnson",
    requester: "David Brown",
    createdAt: "2024-01-14T09:15:00Z",
    updatedAt: "2024-01-15T11:45:00Z",
    hasAttachment: false,
    isStarred: false,
    isRead: true,
    tags: ["backend", "database"],
    thread: [],
  },
  {
    id: "3",
    title: "Add dark mode feature",
    description:
      "Users have expressed a strong interest in having a dark mode to improve their experience. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Many have suggested that a darker theme would enhance usability and comfort. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quisquam, quos. Feedback continues to highlight the desire for a dark mode interface. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quisquam, quos. There is a recurring demand for a night-friendly viewing option. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quisquam, quos. Several users have emphasized the benefits of a dark theme for extended use. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quisquam, quos. The request for a visually soothing dark mode remains one of the most common. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quisquam, quos.",
    status: "open",
    priority: "normal",
    assignee: "Lisa Chen",
    requester: "Alex Thompson",
    createdAt: "2024-01-13T16:20:00Z",
    updatedAt: "2024-01-13T16:20:00Z",
    hasAttachment: false,
    isStarred: false,
    isRead: true,
    tags: ["feature-request", "ui"],
    thread: [],
  },
  {
    id: "4",
    title: "Payment processing error",
    description: "Credit card payments are failing with error code 500.",
    status: "resolved",
    priority: "emergency",
    assignee: "Tom Wilson",
    requester: "Emma Davis",
    createdAt: "2024-01-12T13:45:00Z",
    updatedAt: "2024-01-14T10:30:00Z",
    hasAttachment: true,
    isStarred: true,
    isRead: true,
    tags: ["payment", "critical"],
    thread: [],
  },
  {
    id: "5",
    title: "Mobile app crashes on startup",
    description:
      "The mobile application crashes immediately after launching on iOS devices.",
    status: "open",
    priority: "high",
    assignee: "Rachel Green",
    requester: "Mark Anderson",
    createdAt: "2024-01-11T08:30:00Z",
    updatedAt: "2024-01-15T09:15:00Z",
    hasAttachment: false,
    isStarred: false,
    isRead: false,
    tags: ["mobile", "ios", "crash"],
    thread: [],
  },
];

interface Props {
  open: any;
  onClose: any;
}

const CreateTicketDialog: React.FC<Props> = ({ open, onClose }) => {

  const [createTicket, { isLoading: isCreating }] = useCreateTicketMutation();
  const { data: priorityList, isLoading: isPriorityListLoading } =
    useGetPriorityListQuery();
  const { showToast } = useToast();

  const [newTicket, setNewTicket] = useState({
    user_name: "",
    user_email: "",
    user_phone: "",
    subject: "",
    body: "",
    priority: 2,
    format: "html",
    recipients: "",
  });

  const handleCreateTicketSubmit = async () => {
    const payload = {
      priority: Number(newTicket.priority),
      user_name: newTicket.user_name,
      user_email: newTicket.user_email,
      user_phone: newTicket.user_phone,
      subject: newTicket.subject,
      body: newTicket.body,
      format: newTicket.format,
      recipients: newTicket.recipients,
    };
    const res = await createTicket(payload).unwrap();
    if (res.success) {
      showToast(
        res?.payload?.message || "Ticket created successfully!",
        "success"
      );
      onClose();
      setNewTicket({
        user_name: "",
        user_email: "",
        user_phone: "",
        subject: "",
        body: "",
        priority: 2,
        format: "html",
        recipients: "",
      });
      // Refresh the ticket list
    } else {
      showToast(res.payload.message || "Failed to create ticket", "error");
    }
  };

  return (
    <Box sx={{ height: "78vh", display: "flex", flexDirection: "column" }}>
      {/* Create Ticket Drawer */}
      <Drawer
        anchor="right"
        open={open}
        onClose={() => onClose()}
        PaperProps={{
          sx: {
            width: 780,
            maxWidth: "100vw",
            p: 0,
            borderRadius: "12px 0 0 12px",
          },
        }}
      >
        <Box
          sx={{
            p: 3,
            height: "100%",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: 2,
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Create New Ticket
            </Typography>
            <IconButton onClick={() => onClose()}>
              <CloseIcon />
            </IconButton>
          </Box>
          <Divider sx={{ mb: 2 }} />
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5 }}>
            Ticket Details
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Fill in the details below to create a new ticket.
          </Typography>
          <Grid container spacing={2} alignItems="flex-start">
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Name"
                fullWidth
                value={newTicket.user_name}
                onChange={(e) =>
                  setNewTicket((prev) => ({
                    ...prev,
                    user_name: e.target.value,
                  }))
                }
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Email"
                fullWidth
                value={newTicket.user_email}
                onChange={(e) =>
                  setNewTicket((prev) => ({
                    ...prev,
                    user_email: e.target.value,
                  }))
                }
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Phone"
                fullWidth
                value={newTicket.user_phone}
                onChange={(e) =>
                  setNewTicket((prev) => ({
                    ...prev,
                    user_phone: e.target.value,
                  }))
                }
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Subject"
                fullWidth
                value={newTicket.subject}
                onChange={(e) =>
                  setNewTicket((prev) => ({
                    ...prev,
                    subject: e.target.value,
                  }))
                }
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Recipients"
                fullWidth
                value={newTicket.recipients}
                onChange={(e) =>
                  setNewTicket((prev) => ({
                    ...prev,
                    recipients: e.target.value,
                  }))
                }
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth>
                <InputLabel>Priority</InputLabel>
                <Select
                  value={newTicket.priority}
                  onChange={(e) =>
                    setNewTicket((prev) => ({
                      ...prev,
                      priority: e.target.value,
                    }))
                  }
                  input={<OutlinedInput label="Priority" />}
                >
                  {priorityList?.map((item: any) => (
                    <MenuItem key={item.key} value={item.key}>
                      {item.specification}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid size={12}>
              <Typography variant="body1" sx={{ fontWeight: 600, pb: 1 }}>
                Body
              </Typography>
              <ReactSimpleWysiwyg
                value={newTicket.body}
                onChange={(e) =>
                  setNewTicket((prev) => ({
                    ...prev,
                    body: e.target.value,
                  }))
                }
                style={{
                  minHeight: 120,
                  height: "100%",
                  padding: 8,
                  boxSizing: "border-box",
                }}
              />
            </Grid>
          </Grid>
          <Box sx={{ flexGrow: 1 }} />
          <Divider sx={{ my: 2 }} />
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              gap: 1,
              paddingBottom: 4,
            }}
          >
            <Button onClick={() => onClose()} variant="outlined">
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleCreateTicketSubmit}
              disabled={
                isCreating ||
                !newTicket.user_name ||
                !newTicket.user_email ||
                !newTicket.subject ||
                !newTicket.body
              }
            >
              {isCreating ? "Creating..." : "Create Ticket"}
            </Button>
          </Box>
        </Box>
      </Drawer>
    </Box>
  );
};

export default CreateTicketDialog;
