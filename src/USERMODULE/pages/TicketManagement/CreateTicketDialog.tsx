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
  Chip,
  Alert,
  Container,
  InputAdornment,
} from "@mui/material";
import { 
  Close as CloseIcon,
  Person,
  Email,
  Phone,
  Subject,
  PriorityHigh,
  Assignment,
  LocalOffer,
  Description
} from "@mui/icons-material";
import {
  useCreateTicketMutation,
  useGetPriorityListQuery,
  useGetTicketListQuery,
  useTicketSearchMutation,
  useGetTagListQuery,
} from "../../../services/ticketAuth";
import { useToast } from "../../../hooks/useToast";
import CustomDropdown from "../../../components/shared/CustomDropdown";
import CustomSideBarPanel from "../../../components/reusable/CustomSideBarPanel";
import StackEditor from "../../../components/reusable/Editor";

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

const CreateTicketDialog = () => {
  const [createTicket, { isLoading: isCreating }] = useCreateTicketMutation();
  const { data: priorityList, isLoading: isPriorityListLoading } =
    useGetPriorityListQuery();
  const { data: tagList, isLoading: isTagListLoading } = useGetTagListQuery();
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const { showToast } = useToast();

  // Add agentOptions for AssignTo dropdown
  const agentOptions = ["Any agent", "Agent 1", "Agent 2"];

  const [newTicket, setNewTicket] = useState({
    user_name: "",
    user_email: "",
    user_phone: "",
    subject: "",
    body: "",
    priority: 2,
    format: "html",
    recipients: "",
    assignee: "", // Add assignee field
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
      tags: selectedTags, // Now tagIDs
      assignee: newTicket.assignee,
    };
    const res = await createTicket(payload).unwrap();
    if (res.success) {
      showToast(
        res?.payload?.message || "Ticket created successfully!",
        "success"
      );

      setNewTicket({
        user_name: "",
        user_email: "",
        user_phone: "",
        subject: "",
        body: "",
        priority: 2,
        format: "html",
        recipients: "",
        assignee: "",
      });
      setSelectedTags([]); // Clear selected tags on successful creation
      // Refresh the ticket list
    } else {
      showToast(res.payload.message || "Failed to create ticket", "error");
    }
  };

  return (
    <Container maxWidth="md" sx={{ height: "100%" }}>
      <Box sx={{ py: 2, height: "100%" }}>
        {/* Mandatory Fields Alert */}
        <Alert
          severity="info"
          sx={{
            mb: 2,
            borderRadius: 2,
            "& .MuiAlert-icon": { color: "#1976d2" },
          }}
        >
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            Fields marked with{" "}
            <span
              style={{ color: "#d32f2f", fontSize: 18, fontWeight: "bold" }}
            >
              *
            </span>{" "}
            are mandatory
          </Typography>
        </Alert>

        {/* Form Content */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            maxHeight: "calc(100vh - 180px)",
            overflowY: "auto",
            pr: 1,
          }}
        >
          {/* Requester Information Section */}
          <Box>
            <Typography
              variant="h6"
              sx={{
                mb: 2,
                color: "#1976d2",
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <Person sx={{ fontSize: 20 }} />
              Requester Information
            </Typography>

            <TextField
              label={
                <Typography>
                  Full Name{" "}
                  <span className="text-red-500 text-lg font-bold">*</span>
                </Typography>
              }
              fullWidth
              value={newTicket.user_name}
              onChange={(e) =>
                setNewTicket((prev) => ({
                  ...prev,
                  user_name: e.target.value,
                }))
              }
              variant="outlined"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Person color="action" />
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#1976d2",
                  },
                },
              }}
            />
          </Box>

          {/* Contact Information Section */}
          <Box>
            <Typography
              variant="h6"
              sx={{
                mb: 2,
                color: "#1976d2",
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <Email sx={{ fontSize: 20 }} />
              Contact Information
            </Typography>

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                gap: 2,
              }}
            >
              <TextField
                label={
                  <Typography>
                    Email Address{" "}
                    <span className="text-red-500 text-lg font-bold">*</span>
                  </Typography>
                }
                fullWidth
                value={newTicket.user_email}
                onChange={(e) =>
                  setNewTicket((prev) => ({
                    ...prev,
                    user_email: e.target.value,
                  }))
                }
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email color="action" />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#1976d2",
                    },
                  },
                }}
              />

              <TextField
                label="Phone Number"
                fullWidth
                value={newTicket.user_phone}
                onChange={(e) =>
                  setNewTicket((prev) => ({
                    ...prev,
                    user_phone: e.target.value,
                  }))
                }
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Phone color="action" />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#1976d2",
                    },
                  },
                }}
              />
            </Box>
          </Box>

          {/* Ticket Details Section */}
          <Box>
            <Typography
              variant="h6"
              sx={{
                mb: 2,
                color: "#1976d2",
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <Subject sx={{ fontSize: 20 }} />
              Ticket Details
            </Typography>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <TextField
                label={
                  <Typography>
                    Subject{" "}
                    <span className="text-red-500 text-lg font-bold">*</span>
                  </Typography>
                }
                fullWidth
                value={newTicket.subject}
                onChange={(e) =>
                  setNewTicket((prev) => ({
                    ...prev,
                    subject: e.target.value,
                  }))
                }
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Subject color="action" />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#1976d2",
                    },
                  },
                }}
              />

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
                variant="outlined"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#1976d2",
                    },
                  },
                }}
              />
            </Box>
          </Box>

          {/* Ticket Configuration Section */}
          <Box>
            <Typography
              variant="h6"
              sx={{
                mb: 2,
                color: "#1976d2",
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <PriorityHigh sx={{ fontSize: 20 }} />
              Ticket Configuration
            </Typography>

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                gap: 2,
              }}
            >
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
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#1976d2",
                      },
                    },
                  }}
                >
                  {priorityList?.map((item: any) => (
                    <MenuItem key={item.key} value={item.key}>
                      {item.specification}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel>Assign To</InputLabel>
                <Select
                  value={newTicket.assignee}
                  onChange={(e) =>
                    setNewTicket((prev) => ({
                      ...prev,
                      assignee: e.target.value,
                    }))
                  }
                  input={<OutlinedInput label="Assign To" />}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#1976d2",
                      },
                    },
                  }}
                >
                  {agentOptions.map((agent) => (
                    <MenuItem key={agent} value={agent}>
                      {agent}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </Box>

          {/* Tags Section */}
          <Box>
            <Typography
              variant="h6"
              sx={{
                mb: 2,
                color: "#1976d2",
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <LocalOffer sx={{ fontSize: 20 }} />
              Tags
            </Typography>

            <FormControl fullWidth>
              <InputLabel>Tags</InputLabel>
              <Select
                multiple
                value={selectedTags}
                onChange={(e) => {
                  const value =
                    typeof e.target.value === "string"
                      ? e.target.value.split(",")
                      : e.target.value;
                  if (value.length <= 5) {
                    setSelectedTags(value);
                  }
                }}
                input={<OutlinedInput label="Tags" />}
                renderValue={(selected) => (
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                    {selected.map((tagID) => {
                      const tagObj = tagList?.find(
                        (tag: any) => tag.tagID === tagID
                      );
                      return (
                        <Chip
                          key={tagID}
                          label={tagObj ? tagObj.tagName : tagID}
                          onDelete={(e) => {
                            e.stopPropagation();
                            setSelectedTags((prev) =>
                              prev.filter((id) => id !== tagID)
                            );
                          }}
                        />
                      );
                    })}
                  </Box>
                )}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#1976d2",
                    },
                  },
                }}
              >
                {isTagListLoading ? (
                  <MenuItem disabled>
                    <span>Loading...</span>
                  </MenuItem>
                ) : (
                  tagList?.map((tag: any) => (
                    <MenuItem
                      key={tag.tagID}
                      value={tag.tagID}
                      disabled={
                        selectedTags.length >= 5 &&
                        !selectedTags.includes(tag.tagID)
                      }
                    >
                      {tag.tagName}
                    </MenuItem>
                  ))
                )}
              </Select>
              <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
                Maximum 5 tags can be selected.
              </Typography>
            </FormControl>
          </Box>

          {/* Ticket Body Section */}
          <Box>
            <Typography
              variant="h6"
              sx={{
                mb: 2,
                color: "#1976d2",
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <Description sx={{ fontSize: 20 }} />
              Ticket Description
            </Typography>

            <StackEditor
              onChange={(e: any) => {
                console.log(e);
                setNewTicket((prev) => ({
                  ...prev,
                  body: e,
                }));
              }}
              onFocus={undefined}
              initialContent={newTicket.body}
              isFull={false}
              customHeight="calc(100vh - 650px)" 
            />
          </Box>

          {/* Submit Button Section */}
          <Box sx={{ textAlign: "center", pt: 2 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleCreateTicketSubmit}
              sx={{
                textTransform: "none",
                "&:hover": { backgroundColor: "#0080ffff" },
                fontSize: 15,
              }}
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
      </Box>
    </Container>
  );
};

export default CreateTicketDialog;
