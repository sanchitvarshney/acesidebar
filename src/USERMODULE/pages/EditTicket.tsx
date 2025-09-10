import { Email, Person, Subject, Warning } from "@mui/icons-material";
import {
  Alert,
  Autocomplete,
  Avatar,
  Box,
  Button,
  Chip,
  CircularProgress,
  FormHelperText,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import StackEditor from "../../components/reusable/Editor";
import { fetchOptions, isValidEmail } from "../../utils/Utils";
import { useToast } from "../../hooks/useToast";
import { useEditTicketMutation } from "../../services/threadsApi";
import { useLazyGetUserBySeachQuery } from "../../services/agentServices";

const EditTicket = ({ onClose, open, ticket }: any) => {
  const { showToast } = useToast();
  const [contactChangeValue, setContactChangeValue] = useState("");
  const [options, setOptions] = useState<any>();
  const [errors, setErrors] = useState<{ subject?: string; body?: string }>({});
  const [editData, setEditData] = useState<any>({
    contact: "",
    subject: "",
    body: "",
  });
  const displayContactOptions: any = contactChangeValue ? options : [];
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
      setEditData({
        client: ticket?.client?.id,
        contact: ticket?.client?.email,
        subject: ticket?.subject,
        body: ticket?.description,
      });
    }
  }, [ticket]);

  const fetchUserOptions = async (query: string) => {
    if (!query) {
      setOptions([]);
      return;
    }

    try {
      const res = await triggerSeachUser({ search: query }).unwrap();
      const data = Array.isArray(res) ? res : res?.data;

      const currentValue = contactChangeValue;
      const fallback = [
        {
          name: currentValue,
          email: currentValue,
        },
      ];

      if (Array.isArray(data)) {
        setOptions(data.length > 0 ? data : fallback);
      } else {
        setOptions([]);
      }
    } catch (error) {
      setOptions([]);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setEditData((prev: any) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error when user starts typing
    if (errors[field as keyof typeof errors]) {
      setErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }));
    }
  };

  const handleSelectedOption = (
    _: React.SyntheticEvent,
    value: any,
    type: string
  ) => {
    if (!value) return;

    if (type === "from") {
      const dataValue = {
        name: value.name,
        email: value.email,
        phone: value.phone,
      };
      if (!isValidEmail(dataValue.email)) {
        showToast("Invalid email format", "error");
        return;
      }

      setEditData((prev: any) => ({
        ...prev,
        contact: dataValue.email,
      }));
    }
  };

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
      showToast(
        editDataRes?.data?.message ||
          editDataRes?.message ||
          "Ticket updated successfully",
        "success"
      );
      setEditData({ contact: "", subject: "", body: "" });
      onClose();
    }

    console.log("Saving ticket data:", editData);
  };

  return (
    <Box
      sx={{ flex: 1, display: "flex", flexDirection: "column", height: "100%" }}
    >
      <Box
        sx={{
          backgroundColor: "#fff",
          borderRadius: 2,
          p: 2,
          border: "1px solid #e0e0e0",
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
          <Autocomplete
            disableClearable
            popupIcon={null}
            getOptionLabel={(option: any) => {
              if (typeof option === "string") return option;
              return option.email || "";
            }}
            options={displayContactOptions}
            value={editData.contact}
            onInputChange={(_, value) => {
              setContactChangeValue(value);

              fetchUserOptions(value);
            }}
            onChange={(event, newValue) =>
              handleSelectedOption(event, newValue, "from")
            }
            filterOptions={(x) => x}
            getOptionDisabled={(option) => option === "Type to search"}
            noOptionsText="No Data Found"
            renderOption={(props, option: any) => (
              <li {...props}>
                {typeof option === "string" ? (
                  option
                ) : (
                  <div
                    className="flex items-center gap-3 p-2 rounded-md w-full"
                    style={{ cursor: "pointer" }}
                  >
                    <div className="flex flex-col">
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        {option.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {option.email}
                      </Typography>
                    </div>
                  </div>
                )}
              </li>
            )}
            renderTags={(toValue, getTagProps) =>
              toValue?.map((option: any, index) => {
                console.log("option", option);
                return (
                  <Chip
                    variant="outlined"
                    color="primary"
                    //@ts-ignore
                    label={
                      typeof option === "string"
                        ? option
                        : option?.recipients?.email
                    }
                    {...getTagProps({ index })}
                    sx={{
                      cursor: "pointer",
                      height: "20px",
                      // backgroundColor: "#6EB4C9",
                      color: "primary.main",
                      "& .MuiChip-deleteIcon": {
                        color: "error.main",
                        width: "12px",
                      },
                      "& .MuiChip-deleteIcon:hover": {
                        color: "#e87f8c",
                      },
                    }}
                  />
                );
              })
            }
            renderInput={(params) => (
              <TextField
                {...params}
                label="From *"
                variant="outlined"
                fullWidth
                InputProps={{
                  ...params.InputProps,
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email fontSize="small" />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "4px",
                    backgroundColor: "#f9fafb",
                    "&:hover fieldset": { borderColor: "#9ca3af" },
                    "&.Mui-focused fieldset": { borderColor: "#1a73e8" },
                  },
                  "& label.Mui-focused": { color: "#1a73e8" },
                  "& label": { fontWeight: "bold" },
                }}
              />
            )}
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
          disabled={
            !editData.subject || !editData.body || editData.contact.length === 0
          }
          sx={{ minWidth: 100, fontWeight: 600 }}
        >
          {isUpdating ? <CircularProgress size={20} color="inherit" /> : "Save"}
        </Button>
      </Box>
    </Box>
  );
};

export default EditTicket;
