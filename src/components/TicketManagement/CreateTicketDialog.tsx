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
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import {
  useCreateTicketMutation,
  useGetPriorityListQuery,
  useGetTicketListQuery,
  useTicketSearchMutation,
  useGetTagListQuery,
} from "../../services/ticketAuth";
import { useToast } from "../../hooks/useToast";
import CustomDropdown from "../shared/CustomDropdown";
import CustomSideBarPanel from "../reusable/CustomSideBarPanel";

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
    <Box
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
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
        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5 }}>
          Ticket Details
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Fill in the details below to create a new ticket.
        </Typography>
<Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
  
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
          >
            {agentOptions.map((agent) => (
              <MenuItem key={agent} value={agent}>
                {agent}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

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
          <Typography variant="caption" color="text.secondary">
            Maximum 5 tags can be selected.
          </Typography>
        </FormControl>
</Box>

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
          <Button onClick={() => {}} variant="outlined">
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
    </Box>
  );
};

export default CreateTicketDialog;
