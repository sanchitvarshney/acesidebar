import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Typography,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Alert,
  Container,
  InputAdornment,
  FormHelperText,
  Autocomplete,
  Avatar,
  Stack,
} from "@mui/material";
import {
  Person,
  Email,
  Phone,
  Subject,
  PriorityHigh,
  Assignment,
  LocalOffer,
  Description,
  Warning,
  CheckCircle,
  Business,
} from "@mui/icons-material";
import {
  useCreateTicketMutation,
  useGetPriorityListQuery,
  useGetTagListQuery,
} from "../../../services/ticketAuth";
import { useToast } from "../../../hooks/useToast";

import StackEditor from "../../../components/reusable/Editor";
import { useNavigate } from "react-router-dom";
import { fetchOptions, isValidEmail } from "../../../utils/Utils";

// Priority options for dropdown
const priorityOptions = [
  { label: "Low", value: "1", color: "#4caf50" },
  { label: "Medium", value: "2", color: "#ff9800" },
  { label: "High", value: "3", color: "#f44336" },
  { label: "Urgent", value: "4", color: "#9c27b0" },
  { label: "Critical", value: "5", color: "#d32f2f" },
];
// Agent options for AssignTo dropdown
const agentOptions = [
  { label: "Any agent", value: "any" },
  { label: "Agent 1", value: "agent1" },
  { label: "Agent 2", value: "agent2" },
];

// Department options for dropdown
const departmentOptions = [
  { label: "Technical Support", value: "technical" },
  { label: "Customer Service", value: "customer_service" },
  { label: "Sales", value: "sales" },
  { label: "Billing", value: "billing" },
  { label: "General", value: "general" },
];

interface TicketFormData {
  user_name: string;
  user_email: string;
  user_phone: string;
  subject: string;
  body: string;
  priority: number;
  format: string;
  recipients: string;
  assignee: string;
  department: string;
  tags: any[];
}

const CreateTicketPage: React.FC = () => {
  const navigate = useNavigate();
  const [createTicket, { isLoading: isCreating }] = useCreateTicketMutation();
  const { data: priorityList, isLoading: isPriorityListLoading } =
    useGetPriorityListQuery();
  const { data: tagList, isLoading: isTagListLoading } = useGetTagListQuery();
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);
  const { showToast } = useToast();
  const [fromChangeValue, setfromChangeValue] = React.useState("");
  const [contactChangeValue, setContactChangeValue] = React.useState("");
  const [openContactField, setOpenContactField] = useState(false);
  const [options, setOptions] = useState<any>();
  // Form validation errors
  const [errors, setErrors] = useState<Partial<TicketFormData>>({});

  const [newTicket, setNewTicket] = useState<TicketFormData>({
    user_name: "",
    user_email: "",
    user_phone: "",
    subject: "",
    body: "",
    priority: 2,
    format: "html",
    recipients: "",
    assignee: "",
    department: "",
    tags: [],
  });

  // Validation function
  const validateForm = (): boolean => {
    const newErrors: Partial<TicketFormData> = {};

    if (!newTicket.user_email.trim()) {
      newErrors.user_email = "Please select from address";
    }
    if (!newTicket.subject.trim()) {
      newErrors.subject = "Subject is required";
    }
    if (!newTicket.body.trim()) {
      newErrors.body = "Message body is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const displayFromOptions: any = fromChangeValue ? options : [];

  const displayContactOptions: any = contactChangeValue ? options : [];

  useEffect(() => {
    const filterValue: any = fetchOptions(
      fromChangeValue || contactChangeValue
    );

    filterValue?.length > 0
      ? setOptions(filterValue)
      : setOptions([
          {
            userName: fromChangeValue || contactChangeValue,
            userEmail: fromChangeValue || contactChangeValue,
          },
        ]);
  }, [fromChangeValue, contactChangeValue]);

  const handleCreateTicketSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      const payload = {
        priority: Number(newTicket.priority),
        user_name: newTicket.user_name || "Guest",
        user_email: newTicket.user_email,
        user_phone: newTicket.user_phone || "0",
        subject: newTicket.subject,
        body: newTicket.body,
        format: newTicket.format,
        recipients: selectedContacts.join(", "),
        tags: selectedTags,
        assignee: newTicket.assignee,
        department: newTicket.department,
      };

      const res = await createTicket(payload).unwrap();

      if (res.success) {
        showToast(
          res?.payload?.message || "Ticket created successfully!",
          "success"
        );

        // Navigate back to tickets list
        navigate("/tickets");
      } else {
        showToast(res.payload.message || "Failed to create ticket", "error");
      }
    } catch (error) {
      showToast("Failed to create ticket", "error");
    }
  };

  const handleInputChange = (
    field: keyof TicketFormData,
    value: string | number
  ) => {
    setNewTicket((prev) => ({ ...prev, [field]: value }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

 
  const handleDeleteContact = (id: any) => {
    setSelectedContacts((prev) => prev.filter((contact) => contact !== id));
  };

  const handleSelectedOption = (
    _: React.SyntheticEvent,
    value: any,
    type: string
  ) => {
    if (!value) return;

    const dataValue = { name: value.userName, email: value.userEmail };
    if (!isValidEmail(dataValue.email)) {
      showToast("Invalid email format", "error");
      return;
    }

    if (type === "from") {
      setNewTicket((prev) => ({ ...prev, user_email: dataValue.email }));
    }

    if (type === "contact") {
      if (selectedContacts.some((item: any) => item === value.userEmail)) {
        showToast("Contact already Exist", "error");
        return;
      }

      setSelectedContacts((prev) => [...prev, dataValue.email]);
    }
  };

  return (
    <Box
      sx={{
        height: "calc(100vh - 98px)",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#f9f9f9",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          p: 2,
          backgroundColor: "#fff",
          borderBottom: "1px solid #e0e0e0",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Button
            variant="outlined"
            onClick={() => navigate("/tickets")}
            sx={{
              textTransform: "none",
              borderColor: "#dadce0",
              color: "#666",
              "&:hover": {
                borderColor: "#1976d2",
                color: "#1976d2",
              },
            }}
          >
            ← Back to Tickets
          </Button>
          <Box>
            <Typography
              variant="h6"
              sx={{ fontWeight: 600, color: "#1a1a1a", mb: 0.5 }}
            >
              Create New Ticket
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: "#666", fontSize: "12px" }}
            >
              Fill in the details below to create a new support ticket
            </Typography>
          </Box>
        </Box>

        {/* Action Buttons */}
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button
            variant="text"
            onClick={() => {
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
                department: "",
                tags: [],
              });
              setErrors({});
              setSelectedTags([]);
              setSelectedContacts([]);
            }}
            sx={{
              textTransform: "none",
              borderColor: "#dadce0",
              color: "#666",
              "&:hover": {
                borderColor: "#666",
                backgroundColor: "#f5f5f5",
              },
            }}
          >
            Reset
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleCreateTicketSubmit}
            disabled={isCreating}
            sx={{
              textTransform: "none",
              fontSize: 14,
              fontWeight: 600,
              px: 3,
              py: 1,
              "&:disabled": {
                backgroundColor: "#ccc",
                color: "#666",
              },
            }}
          >
            {isCreating ? "Creating..." : "Create ticket"}
          </Button>
        </Box>
      </Box>

      {/* Main Content - 3 Column Layout */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          gap: 2,
          p: 2,
          overflow: "auto",
          maxHeight: "calc(100vh - 150px)",
        }}
      >
        {/* Left Column - Ticket Details */}
        <Box sx={{ width: 300, flexShrink: 0 }}>
          <Box
            sx={{
              backgroundColor: "#fff",
              borderRadius: 2,
              p: 3,
              border: "1px solid #e0e0e0",
              height: "100%",
            }}
          >
            <Typography
              variant="h6"
              sx={{ fontWeight: 600, mb: 2, color: "#1a1a1a" }}
            >
              Ticket details
            </Typography>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {/* Priority */}
              <FormControl
                fullWidth
                size="small"
                variant="outlined"
                sx={{ mb: 3 }}
              >
                <InputLabel>Priority</InputLabel>
                <Select
                  value={newTicket.priority.toString()}
                  onChange={(e) =>
                    handleInputChange("priority", parseInt(e.target.value))
                  }
                  label="Priority"
                  startAdornment={
                    <PriorityHigh
                      fontSize="small"
                      sx={{ color: "#666", mr: 1 }}
                    />
                  }
                  sx={{
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#dadce0",
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#1976d2",
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#1976d2",
                    },
                    backgroundColor: "#fff",
                    fontSize: "0.875rem",
                  }}
                >
                  {priorityOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <Box
                          sx={{
                            width: 12,
                            height: 12,
                            borderRadius: "50%",
                            backgroundColor: option.color,
                            flexShrink: 0,
                          }}
                        />
                        {option.label}
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Assignee */}
              <FormControl
                fullWidth
                size="small"
                variant="outlined"
                sx={{ mb: 2 }}
              >
                <InputLabel>Assignee</InputLabel>
                <Select
                  value={newTicket.assignee || "any"}
                  onChange={(e) =>
                    handleInputChange("assignee", e.target.value)
                  }
                  label="Assignee"
                  startAdornment={
                    <Assignment
                      fontSize="small"
                      sx={{ color: "#666", mr: 1 }}
                    />
                  }
                  sx={{
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#dadce0",
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#1976d2",
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#1976d2",
                    },
                    backgroundColor: "#fff",
                    fontSize: "0.875rem",
                  }}
                >
                  {agentOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Department */}
              <FormControl
                fullWidth
                size="small"
                variant="outlined"
                sx={{ mb: 3 }}
              >
                <InputLabel>Department</InputLabel>
                <Select
                  value={newTicket.department || ""}
                  onChange={(e) =>
                    handleInputChange("department", e.target.value)
                  }
                  label="Department"
                  startAdornment={
                    <Business fontSize="small" sx={{ color: "#666", mr: 1 }} />
                  }
                  sx={{
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#dadce0",
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#1976d2",
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#1976d2",
                    },
                    backgroundColor: "#fff",
                    fontSize: "0.875rem",
                  }}
                >
                  {departmentOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl
                fullWidth
                size="small"
                variant="outlined"
                sx={{ mb: 3 }}
              >
                <InputLabel>Tags</InputLabel>
                <Select
                  multiple
                  value={newTicket.tags || []}
                  onChange={(e: any) =>
                    handleInputChange("tags", e.target.value)
                  }
                  label="Tags"
                  startAdornment={
                    <LocalOffer
                      fontSize="small"
                      sx={{ color: "#666", mr: 1 }}
                    />
                  }
                  renderValue={(selected) => selected.join(", ")}
                  sx={{
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#dadce0",
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#1976d2",
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#1976d2",
                    },
                    backgroundColor: "#fff",
                    fontSize: "0.875rem",
                  }}
                  MenuProps={{
                    PaperProps: {
                      sx: {
                        maxHeight: 300, // optional: controls the menu height
                      },
                    },
                  }}
                >
                  {tagList?.map((option: any) => (
                    <MenuItem
                      key={option.tagID}
                      value={option.tagName}
                      sx={{
                        minHeight: 40, // Adjust this value to control item height
                        py: 1, // padding top-bottom
                      }}
                    >
                      {option.tagName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

            </Box>
          </Box>
        </Box>

        {/* Middle Column - Main Form */}
        <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
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
              maxHeight: "calc(100vh - 198px)",
            }}
          >
            {/* Mandatory Fields Alert */}
            <Alert
              severity="info"
              sx={{
                mb: 3,
                borderRadius: 2,
                "& .MuiAlert-icon": { color: "#1976d2", pt: 1.5 },
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

            {/* Form Fields */}
            <Box
              sx={{ display: "flex", flexDirection: "column", gap: 3, flex: 1 }}
            >
             
              <Autocomplete
                disableClearable
                popupIcon={null}
                getOptionLabel={(option: any) => {
                  if (typeof option === "string") return option;
                  return option.userEmail || option.userName || "";
                }}
                options={displayFromOptions}
                value={newTicket.user_email}
                onChange={(event, newValue) => {
                  handleSelectedOption(event, newValue, "tag");
                }}
                onInputChange={(_, value) => setfromChangeValue(value)}
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
                        <Avatar
                          sx={{
                            width: 30,
                            height: 30,
                            backgroundColor: "primary.main",
                          }}
                        >
                          {option.userName?.charAt(0).toUpperCase()}
                        </Avatar>

                        <div className="flex flex-col">
                          <Typography
                            variant="subtitle2"
                            sx={{ fontWeight: 600 }}
                          >
                            {option.userName}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {option.userEmail}
                          </Typography>
                        </div>
                      </div>
                    )}
                  </li>
                )}
                renderTags={(toValue, getTagProps) =>
                  toValue?.map((option, index) => (
                    <Chip
                      variant="outlined"
                      color="primary"
                      //@ts-ignore
                      label={typeof option === "string" ? option : option?.name}
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
                  ))
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
                          <Email
                            fontSize="small"
                            sx={{
                              color: errors.user_email ? "#d32f2f" : "#666",
                            }}
                          />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <>
                          {errors.user_email && (
                            <InputAdornment position="end">
                              <Warning sx={{ color: "#d32f2f" }} />
                            </InputAdornment>
                          )}
                          {params.InputProps.endAdornment}
                        </>
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

              {/* Contacts Field */}
              <Autocomplete
                size="small"
                fullWidth
                disablePortal
                value={null}
                options={displayContactOptions}
                getOptionLabel={(option: any) => {
                  if (typeof option === "string") return option;
                  return "";
                }}
                renderOption={(props, option: any) => (
                  <li {...props}>
                    {typeof option === "string" ? (
                      option
                    ) : (
                      <div
                        className="flex items-center gap-3 p-2 rounded-md w-full"
                        style={{ cursor: "pointer" }}
                      >
                        <Avatar
                          sx={{
                            width: 30,
                            height: 30,
                            backgroundColor: "primary.main",
                          }}
                        >
                          {option.userName?.charAt(0).toUpperCase()}
                        </Avatar>

                        <div className="flex flex-col">
                          <Typography
                            variant="subtitle2"
                            sx={{ fontWeight: 600 }}
                          >
                            {option.userName}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {option.userEmail}
                          </Typography>
                        </div>
                      </div>
                    )}
                  </li>
                )}
                open={openContactField}
                onOpen={() => setOpenContactField(true)}
                onClose={() => setOpenContactField(false)}
                inputValue={contactChangeValue}
                onInputChange={(_, value) => setContactChangeValue(value)}
                onChange={(event, newValue) =>
                  handleSelectedOption(event, newValue, "contact")
                }
                filterOptions={(x) => x} // disable default filtering
                getOptionDisabled={(option) => option === "Type to search"}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Contacts *"
                    variant="outlined"
                    size="small"
                    InputProps={{
                      ...params.InputProps,
                      startAdornment: (
                        <InputAdornment position="start">
                          <Person fontSize="small" sx={{ color: "#666" }} />
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
              {selectedContacts.length > 0 && (
                <Stack
                  direction="row"
                  spacing={1}
                  mt={1}
                  sx={{ overflowX: "auto", p: 1 }}
                >
                  {selectedContacts.map((contact: any, index: number) => (
                    <Chip
                      key={index}
                      label={contact}
                      variant="outlined"
                      onDelete={() => handleDeleteContact(contact)}
                    />
                  ))}
                </Stack>
              )}

              {/* Subject Field */}
              <TextField
                label="Subject*"
                size="small"
                fullWidth
                variant="outlined"
                value={newTicket.subject}
                onChange={(e) => handleInputChange("subject", e.target.value)}
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
                  initialContent={newTicket.body}
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
        </Box>

        {/* Right Column - Contact Details */}
        <Box sx={{ width: 300, flexShrink: 0 }}>
          <Box
            sx={{
              backgroundColor: "#fff",
              borderRadius: 2,
              p: 3,
              border: "1px solid #e0e0e0",
              height: "100%",
            }}
          >
            <Typography
              variant="h6"
              sx={{ fontWeight: 600, mb: 2, color: "#1a1a1a" }}
            >
              Contact details
            </Typography>

            <Box
              sx={{
                textAlign: "center",
                p: 3,
                backgroundColor: "#f8f9fa",
                borderRadius: 2,
                border: "1px solid #e9ecef",
                mt: 2,
              }}
            >
              {/* Illustration Placeholder */}
              <Box
                sx={{
                  width: 120,
                  height: 120,
                  margin: "0 auto 16px",
                  backgroundColor: "#e3f2fd",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "relative",
                }}
              >
                <Email sx={{ fontSize: 48, color: "#1976d2" }} />
                <Box
                  sx={{
                    position: "absolute",
                    top: -8,
                    right: -8,
                    width: 32,
                    height: 32,
                    backgroundColor: "#ff9800",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Warning sx={{ fontSize: 20, color: "#fff" }} />
                </Box>
              </Box>

              <Typography
                variant="body2"
                sx={{ color: "#666", fontSize: "0.875rem" }}
              >
                Enter email to see their details and recent conversations here
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default CreateTicketPage;
