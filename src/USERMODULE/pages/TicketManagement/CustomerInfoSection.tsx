import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  IconButton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  CircularProgress,
} from "@mui/material";
import {
  Person,
  OpenInNew,
  ExpandLess,
  ExpandMore,
  Email,
  Phone,
  Business,
  EditNote,
  ModeEdit,
  Save,
  Close,
} from "@mui/icons-material";
import { useUpdateUserDataMutation } from "../../../services/threadsApi";
import { useToast } from "../../../hooks/useToast";

interface CustomerInfoSectionProps {
  isExpanded: boolean;
  onToggle: () => void;
  ticketData?: any;
}

const CustomerInfoSection: React.FC<CustomerInfoSectionProps> = ({
  isExpanded,
  onToggle,
  ticketData,
}) => {
  const { showToast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [extension, setExtension] = useState("");
  const [internalNote, setInternalNote] = useState("");
  const [notes, setNotes] = useState("");

  const [updateUserData, { isLoading }] = useUpdateUserDataMutation();

  useEffect(() => {
    if (ticketData) {
      setEmail(ticketData.email ?? "");
      setPhone(ticketData.phone ?? "");
      setExtension(ticketData.extensionNo ?? ticketData.ext ?? "");
      setInternalNote(
        ticketData.internalNotes ?? ticketData.internal_notes ?? ""
      );
    }
  }, [ticketData]);

  const handleSave = () => {
    if (!ticketData?.userID) {
      showToast("User ID not available", "error");
      return;
    }

    const payload = {
      USERID: ticketData.userID,
      type: "about",
      body: {
        email,
        phone,
        ext: extension,
        internal_notes: internalNote,
      },
    };

    updateUserData(payload).then((res: any) => {
      if (res?.error?.data?.type === "error") {
        showToast(res?.error?.data?.message || "An error occurred", "error");
        return;
      }
      showToast("User data updated successfully", "success");
    });

    setIsEditing(false);
  };

  const toggleEdit = () => {
    if (isEditing) {
      handleSave();
    } else {
      setIsEditing(true);
    }
  };

  return (
    <Accordion
      expanded={isExpanded}
      onChange={() => {
        if (isEditing) return;
        onToggle();
      }}
      sx={{
        marginBottom: "16px",
        "&:before": {
          display: "none",
        },
        boxShadow: "0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)",
      }}
    >
      <AccordionSummary
        sx={{
          backgroundColor: "#f5f5f5",
          minHeight: "48px",
          "&.Mui-expanded": {
            minHeight: "48px",
          },
          "& .MuiAccordionSummary-content": {
            margin: "8px 0",
            alignItems: "center",
          },
        }}
        expandIcon={!isEditing && <ExpandMore sx={{ color: "#666" }} />}
      >
        <Box sx={{ display: "flex", alignItems: "center", width: "100%" }}>
          <Person
            sx={{ color: "#666", marginRight: "8px", fontSize: "20px" }}
          />
          <Typography variant="subtitle2" sx={{ flex: 1, fontWeight: 600 }}>
            Customer
          </Typography>
          <IconButton size="small" sx={{ padding: "4px", marginRight: "4px" }}>
            <OpenInNew sx={{ fontSize: "16px", color: "#666" }} />
          </IconButton>
          {isLoading ? (
            <CircularProgress size={16} sx={{ marginRight: "4px" }} />
          ) : (
            <IconButton
              size="small"
              onClick={toggleEdit}
              sx={{ padding: "4px", marginRight: "4px" }}
            >
              {isEditing ? (
                <Save sx={{ fontSize: "16px", color: "#666" }} />
              ) : (
                <ModeEdit sx={{ fontSize: "16px", color: "#666" }} />
              )}
            </IconButton>
          )}
          {isEditing && (
            <IconButton
              size="small"
              onClick={() => setIsEditing(false)}
              sx={{ padding: "4px" }}
            >
              <Close sx={{ fontSize: "16px", color: "#666" }} />
            </IconButton>
          )}
        </Box>
      </AccordionSummary>

      <AccordionDetails sx={{ padding: "16px" }}>
        {/* Email */}
        <Box sx={{ marginBottom: "12px" }}>
          <Box
            sx={{ display: "flex", alignItems: "center", marginBottom: "4px" }}
          >
            <Email
              sx={{ fontSize: "16px", color: "#666", marginRight: "8px" }}
            />
            <Typography variant="caption" color="text.secondary">
              Email
            </Typography>
          </Box>
          {isEditing ? (
            <TextField
              size="small"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{ fontSize: "14px" }}
            />
          ) : (
            <Typography
              variant="body2"
              sx={{
                color: "#1976d2",
                textDecoration: "underline",
                cursor: "pointer",
              }}
            >
              {email || "No email provided"}
            </Typography>
          )}
        </Box>

        {/* Phone */}
        <Box sx={{ marginBottom: "12px" }}>
          <Box
            sx={{ display: "flex", alignItems: "center", marginBottom: "4px" }}
          >
            <Phone
              sx={{ fontSize: "16px", color: "#666", marginRight: "8px" }}
            />
            <Typography variant="caption" color="text.secondary">
              Phone
            </Typography>
          </Box>
          {isEditing ? (
            <TextField
              size="small"
              fullWidth
              value={phone}
              onChange={(e) => {
                const value = e.target.value;
                if (/^\d*$/.test(value)) {
                  setPhone(value);
                }
              }}
              sx={{ fontSize: "14px" }}
            />
          ) : (
            <Typography variant="body2">
              {phone || "No phone provided"}
            </Typography>
          )}
        </Box>

        {/* Extension */}
        <Box sx={{ marginBottom: "12px" }}>
          <Box
            sx={{ display: "flex", alignItems: "center", marginBottom: "4px" }}
          >
            <Business
              sx={{ fontSize: "16px", color: "#666", marginRight: "8px" }}
            />
            <Typography variant="caption" color="text.secondary">
              Extension
            </Typography>
          </Box>
          {isEditing ? (
            <TextField
              size="small"
              fullWidth
              value={extension}
              onChange={(e) => setExtension(e.target.value)}
              sx={{ fontSize: "14px" }}
            />
          ) : (
            <Typography variant="body2">
              {extension || "No extension provided"}
            </Typography>
          )}
        </Box>

        {/* Internal Notes */}
        <Box sx={{ marginBottom: "12px" }}>
          <Box
            sx={{ display: "flex", alignItems: "center", marginBottom: "4px" }}
          >
            <EditNote
              sx={{ fontSize: "16px", color: "#666", marginRight: "8px" }}
            />
            <Typography variant="caption" color="text.secondary">
              Internal Notes
            </Typography>
          </Box>
          {isEditing ? (
            <TextField
              multiline
              rows={3}
              size="small"
              fullWidth
              value={internalNote}
              onChange={(e) => {
                let value = e.target.value;
                // Filter out disallowed characters
                value = value.replace(
                  /[^a-zA-Z0-9\s,\.@#&'\[\]\{\}!|\/\\\*\%\(\);]/g,
                  ""
                );
                // Limit to 200 words
                const words = value.trim().split(/\s+/);
                if (words.length > 200) {
                  value = words.slice(0, 200).join(" ");
                }
                setInternalNote(value);
              }}
              sx={{ fontSize: "14px" }}
            />
          ) : (
            <Typography variant="body2">
              {internalNote || "No internal notes"}
            </Typography>
          )}
        </Box>

        {/* User Notes */}
        <Box>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ display: "block", marginBottom: "4px" }}
          >
            User Notes
          </Typography>
          <TextField
            multiline
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add user notes"
            variant="outlined"
            size="small"
            fullWidth
            sx={{
              "& .MuiOutlinedInput-root": {
                fontSize: "14px",
                "& fieldset": {
                  borderColor: "#e0e0e0",
                },
                "&:hover fieldset": {
                  borderColor: "#bdbdbd",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#1976d2",
                },
              },
            }}
          />
        </Box>
      </AccordionDetails>
    </Accordion>
  );
};

export default CustomerInfoSection;
