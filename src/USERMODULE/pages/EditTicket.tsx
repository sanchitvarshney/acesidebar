import { Email, Person, Subject, Warning } from "@mui/icons-material";
import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  FormHelperText,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import React, { useCallback, useEffect, useRef, useState } from "react";
import StackEditor from "../../components/reusable/Editor";
import { useToast } from "../../hooks/useToast";
import { useEditTicketMutation } from "../../services/threadsApi";
import { useLazyGetUserBySeachQuery } from "../../services/agentServices";
import SingleValueAsynAutocomplete from "../../components/reusable/SingleValueAsynAutocomplete";

const SourceOptions: any = [
  { value: "web", label: "Web" },
  { value: "email", label: "Email" },
  { value: "phone", label: "Phone" },
  { value: "chat", label: "Chat" },
  { value: "app", label: "App" },
  { value: "social_media", label: "Social Media" },
  { value: "other", label: "Other" },
];

const EditTicket = ({ onClose, open, ticket, onUpdated }: any) => {
  const { showToast } = useToast();

  const [errors, setErrors] = useState<{ subject?: string; body?: string }>({});
  const [editData, setEditData] = useState<any>({
    contact: "",
    subject: "",
    source: "",
    body: "",
  });
  const [selectedContact, setSelectedContact] = useState<any | null>(null);

  const inputRef = useRef(null);
  const [editTicket, { isLoading: isUpdating }] = useEditTicketMutation();
  const [triggerSeachUser, { isLoading: seachUserLoading }] =
    useLazyGetUserBySeachQuery();

  useEffect(() => {
    if (open && inputRef.current) {
      //@ts-ignore
      setTimeout(() => inputRef.current.focus(), 100);
    }
  }, [open]);

  useEffect(() => {
    if (ticket) {
      const nextSelected = ticket?.client
        ? {
            name: ticket?.client?.name || ticket?.client?.email,
            email: ticket?.client?.email,
          }
        : null;

      setSelectedContact(nextSelected);
      setEditData({
        client: ticket?.client?.id,
        contact: ticket?.client?.email || "",
        subject: ticket?.subject || "",
        source: ticket?.source || "",
        body: ticket?.description || "",
      });
    }
  }, [ticket]);

  const handleInputChange = useCallback(
    (field: string, value: string) => {
      setEditData((prev: any) => ({
        ...prev,
        [field]: value,
      }));

      if (errors[field as keyof typeof errors]) {
        setErrors((prev) => ({
          ...prev,
          [field]: undefined,
        }));
      }
    },
    [errors]
  );

  const handleSelectedOption = useCallback((value: any) => {
    if (!value) return;
    setSelectedContact(value);
    setEditData((prev: any) => ({
      ...prev,
      contact: value,
    }));
  }, []);

  const handleSave = async () => {
    // Validate required fields
    const newErrors: { subject?: string; body?: string } = {};

    if (!editData.subject.trim()) {
      newErrors.subject = "Subject is required";
    }

    if (!editData.body.trim()) {
      newErrors.body = "Message body is required";
    }

    if (editData.contact.length === 0) {
      showToast("At least one contact is required", "error");
      return;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const payload = {
      ticket: ticket?.ticketId,
      client: ticket?.client?.id,
      body: {
        subject: editData.subject,
        body: editData.body,
      },
    };

    const editDataRes = await editTicket(payload).unwrap();

    if (editDataRes?.data?.type === "error" || editDataRes?.type === "error") {
      showToast(
        editDataRes?.data?.message ||
          editDataRes?.message ||
          "An error occurred",
        "error"
      );
      return;
    } else {
      const successMessage =
        editDataRes?.data?.message ||
        editDataRes?.message ||
        "Ticket updated successfully";

      // Optimistically notify parent to update UI instantly without refetch
      try {
        const updatedTicket = {
          ...ticket,
          subject: editData.subject,
          description: editData.body,
        };
        onUpdated && onUpdated(updatedTicket);
      } catch (_) {
        // optional callback, ignore if not provided
      }

      showToast(successMessage, "success");
      setEditData({ contact: "", subject: "", body: "" });
      onClose();
    }
  };

  return (
    <Box
      sx={{ flex: 1, display: "flex", flexDirection: "column", height: "100%" }}
    >
      <Box
        sx={{
          backgroundColor: "#fff",
          p: 2,
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflowY: "auto",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 3,
            flex: 1,
            mb: 2,
          }}
        >
          <SingleValueAsynAutocomplete
            qtkMethod={triggerSeachUser}
            value={selectedContact}
            optionLabelKey="email"
            optionKey="email"
            onChange={handleSelectedOption}
            label="From *"
            loading={seachUserLoading}
            icon={<Email fontSize="small" />}
            isFallback={true}
          />

          {/* Subject Field */}
          <TextField
            label="Subject*"
            size="small"
            fullWidth
            variant="outlined"
            value={editData.subject}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handleInputChange("subject", e.target.value)
            }
            error={!!errors.subject}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Subject
                    fontSize="small"
                    sx={{ color: errors.subject ? "#d32f2f" : "#666" }}
                  />
                </InputAdornment>
              ),
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderColor: errors.subject ? "#d32f2f" : "#dadce0",
                "&.Mui-focused": {
                  borderColor: errors.subject ? "#d32f2f" : "#1976d2",
                },
              },
            }}
          />
          {errors.subject && (
            <FormHelperText error sx={{ mt: 0.5, fontSize: "0.75rem" }}>
              {errors.subject}
            </FormHelperText>
          )}


          {/* Message Body */}
          <Box sx={{ flex: 1, minHeight: 300 }}>
            <Typography
              variant="body2"
              sx={{ mb: 1, color: "#666", fontSize: "0.875rem" }}
            >
              Please enter the user concern here*
            </Typography>

            <StackEditor
              onChange={(content: string) => {
                handleInputChange("body", content);
              }}
              onFocus={undefined}
              initialContent={editData.body}
              isFull={false}
              customHeight="250px"
            />
            {errors.body && (
              <FormHelperText error sx={{ mt: 0.5, fontSize: "0.75rem" }}>
                {errors.body}
              </FormHelperText>
            )}
          </Box>
        </Box>
      </Box>

      {/* Action Buttons - Same styling as LogTimePanel */}
      <Box
        sx={{
          p: 2,
          borderTop: "1px solid #eee",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 1,
          backgroundColor: "#fafafa",
          mt: "auto",
        }}
      >
        <Button
          onClick={onClose}
          variant="text"
          sx={{ minWidth: 80, fontWeight: 600 }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          color="primary"
          disabled={!editData.subject || !editData.body || !selectedContact}
          sx={{ minWidth: 100, fontWeight: 600 }}
        >
          {isUpdating ? <CircularProgress size={20} color="inherit" /> : "Save"}
        </Button>
      </Box>
    </Box>
  );
};

export default React.memo(EditTicket);
