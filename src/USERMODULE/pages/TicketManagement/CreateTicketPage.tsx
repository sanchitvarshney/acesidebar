import React, {  useState } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Alert,
  InputAdornment,
  FormHelperText,
  Autocomplete,
  CircularProgress,
} from "@mui/material";
import {
  Email,
  Subject,
  PriorityHigh,
  Assignment,
  LocalOffer,
  Warning,
  Business,
  Person,
  ConfirmationNumber,
} from "@mui/icons-material";
import {
  useCreateTicketMutation,
  useGetPriorityListQuery,
  useGetTagListQuery,
  useGetTypeListQuery,
} from "../../../services/ticketAuth";
import { useToast } from "../../../hooks/useToast";
import TopicIcon from '@mui/icons-material/Topic';
import StackEditor from "../../../components/reusable/Editor";
import { useNavigate } from "react-router-dom";

import {
  useLazyGetAgentsBySeachQuery,
  useLazyGetDepartmentBySeachQuery,
  useLazyGetUserBySeachQuery,
} from "../../../services/agentServices";
import SingleValueAsynAutocomplete from "../../../components/reusable/SingleValueAsynAutocomplete";
import { useGetTicketFieldQuery } from "../../../services/ticketField";
import { useGetTopicListQuery } from "../../../services/threadsApi";

interface TicketFormData {
  user_name: string;
  user_email: string;
  user_phone: string;
  subject: string;
  body: string;
  priority: string;
  format: string;
  type: string;
  topic: string;
  recipients: any;
}

const CreateTicketPage: React.FC = () => {
  const navigate = useNavigate();
  const [createTicket, { isLoading: isCreating }] = useCreateTicketMutation();
  const { data: priorityList, isLoading: isPriorityListLoading } =
    useGetPriorityListQuery();
const { data: topicList } = useGetTopicListQuery({});
  const { data: tagList } = useGetTagListQuery();
  const { data: ticketFields } = useGetTicketFieldQuery({});

  const { showToast } = useToast();
  const [tagOptions, setTagOptions] = useState<any>();
  // Form validation errors
  const [errors, setErrors] = useState<Partial<TicketFormData>>({});
  const [tagValue, setTagValue] = useState<any>([]);
  const [changeTagValue, setChangeTabValue] = useState("");
  const [agentValue, setAgentValue] = useState<any>("");
  const { data: typeList } = useGetTypeListQuery();
  const [dept, setDept] = useState<any>("");

  const [triggerDept, { isLoading: deptLoading }] =
    useLazyGetDepartmentBySeachQuery();
  // const [triggerSeachAgent, { isLoading: seachAgentLoading }] =
  //   useLazyGetAgentsBySeachQuery();
  const [triggerSeachUser, { isLoading: seachUserLoading }] =
    useLazyGetUserBySeachQuery();

  const [newTicket, setNewTicket] = useState<TicketFormData>({
    user_name: "",
    user_email: "",
    user_phone: "",
    subject: "",
    body: "",
    priority: "", // Set to 0 initially, will be updated when priorityList loads
    format: "html",
    type: "",
    topic:"",
    recipients: null,
  });

  // Validation function
  const validateForm = (): boolean => {
    const newErrors: Partial<TicketFormData> = {};

    // if (!newTicket.user_email.trim()) {
    //   newErrors.user_email = "Please select from address";
    // }
    if (!newTicket.subject.trim()) {
      newErrors.subject = "Subject is required";
    }
    if (!newTicket.body.trim()) {
      newErrors.body = "Message body is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const displayOptions = changeTagValue.length >= 3 ? tagOptions : [];

  const fetchTagOptions = (value: string) => {
    if (!value || value.length < 3) return [];
    const filteredOptions = tagList?.filter((option: any) =>
      option.tagName?.toLowerCase().includes(value?.toLowerCase())
    );
    if (filteredOptions || filteredOptions?.length > 0) {
      setTagOptions(filteredOptions);
    } else {
      setTagOptions([]);
    }
  };

  const handleCreateTicketSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      const payload = {
        priority: newTicket.priority,
        name: newTicket.user_name || "Guest",
        email: newTicket.user_email,
        phone: newTicket.user_phone || "0",
        subject: newTicket.subject,
        body: newTicket.body,
        type: newTicket.type,
        tags: tagValue.map((tag: any) => tag?.tagID),
        assignee: agentValue?.agentID,
        department: dept?.deptID,
        topic:newTicket?.topic,
      };

      const res = await createTicket(payload).unwrap();

      if (res.success) {
        showToast(res?.message || "Ticket created successfully!", "success");

        // Navigate back to tickets list
        navigate("/tickets");
      } else {
        showToast(res?.message || "Failed to create ticket", "error");
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

  const handleSelectedOption = (
    _: React.SyntheticEvent,
    value: any,
    type: string
  ) => {
    if (!value) return;

    if (type === "tag") {
      if (!Array.isArray(value) || value.length === 0) {
        showToast("Tag already exists", "error");
        return;
      }

      setTagValue((prev: any) => {
        // Find newly added tags (those not already in prev)
        const addedTags = value.filter(
          (tag: any) => !prev.some((p: any) => p.tagID === tag.tagID)
        );

        if (addedTags.length === 0) {
          // No new tags (all duplicates)
          showToast("Tag already exists", "error");
          return prev;
        }

        return [...prev, ...addedTags];
      });
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
                borderColor: "#2566b0",
                color: "#2566b0",
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
                priority: "",
                format: "html",
                type: "",
                topic: "",
                recipients: [],
              });
              setErrors({});
              setAgentValue(null);
              setTagValue([]);
              setDept(null);
            }}
            sx={{
              fontWeight: 600,
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
            {isCreating ? <CircularProgress size={16} /> : "Create ticket"}
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

            {/* Priority */}

            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              {ticketFields?.map((field: any) => {
                switch (field.ui.widget) {
                  case "select":
                    return (
                      <>
                      <FormControl fullWidth size="small" variant="outlined">
                          <InputLabel>Topic</InputLabel>
                          <Select
                            value={newTicket.topic.toString()}
                            onChange={(e) =>
                              setNewTicket((prev) => ({
                                ...prev,
                                topic: e.target.value,
                              }))
                            }
                            label="Topic"
                            startAdornment={
                              <TopicIcon
                                fontSize="small"
                                sx={{ color: "#666", mr: 1 }}
                              />
                            }
                            sx={{
                              "&:hover .MuiOutlinedInput-notchedOutline": {
                                borderColor: "#9ca3af",
                              },
                              "&.Mui-focused .MuiOutlinedInput-notchedOutline":
                                {
                                  borderColor: "#2566b0",
                                },
                              backgroundColor: "#fff",
                              fontSize: "0.775rem",
                            }}
                          >
                            {topicList?.map((option: any) => (
                              <MenuItem key={option.key} value={option.key}>
                                {option.topic}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                        <FormControl fullWidth size="small" variant="outlined">
                          <InputLabel>Type</InputLabel>
                          <Select
                            value={newTicket.type.toString()}
                            onChange={(e) =>
                              setNewTicket((prev) => ({
                                ...prev,
                                type: e.target.value,
                              }))
                            }
                            label="Type"
                            startAdornment={
                              <ConfirmationNumber
                                fontSize="small"
                                sx={{ color: "#666", mr: 1 }}
                              />
                            }
                            sx={{
                              "&:hover .MuiOutlinedInput-notchedOutline": {
                                borderColor: "#9ca3af",
                              },
                              "&.Mui-focused .MuiOutlinedInput-notchedOutline":
                                {
                                  borderColor: "#2566b0",
                                },
                              backgroundColor: "#fff",
                              fontSize: "0.775rem",
                            }}
                          >
                            {typeList?.map((option: any) => (
                              <MenuItem key={option.key} value={option.key}>
                                {option.typeName}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                        <FormControl fullWidth size="small" variant="outlined">
                          <InputLabel>Priority</InputLabel>
                          <Select
                            value={newTicket.priority.toString() || ""}
                            onChange={(e) =>
                              handleInputChange("priority", e.target.value)
                            }
                            label="Priority"
                            startAdornment={
                              <PriorityHigh
                                fontSize="small"
                                sx={{ color: "#666", mr: 1 }}
                              />
                            }
                            sx={{
                              "&:hover .MuiOutlinedInput-notchedOutline": {
                                borderColor: "#9ca3af",
                              },
                              "&.Mui-focused .MuiOutlinedInput-notchedOutline":
                                {
                                  borderColor: "#2566b0",
                                },
                              backgroundColor: "#fff",
                              fontSize: "0.775rem",
                            }}
                          >
                            {priorityList?.map((option: any) => (
                              <MenuItem key={option.key} value={option.key}>
                                <Box
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 1,
                                  }}
                                >
                                  {isPriorityListLoading ? (
                                    <CircularProgress size={18} />
                                  ) : (
                                    <>
                                      <Box
                                        sx={{
                                          width: 12,
                                          height: 12,
                                          borderRadius: "50%",
                                          backgroundColor: option.color,
                                          flexShrink: 0,
                                        }}
                                      />
                                      {option.specification}
                                    </>
                                  )}
                                </Box>
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                        <SingleValueAsynAutocomplete
                          value={dept}
                          label="Department"
                          qtkMethod={triggerDept}
                          onChange={setDept}
                          loading={deptLoading}
                          // isFallback={true}
                          icon={
                            <Business
                              fontSize="small"
                              sx={{ color: "#666", mr: 1 }}
                            />
                          }
                          size="small"
                          optionLabelKey="deptName"
                        />
                        <SingleValueAsynAutocomplete
                          value={agentValue}
                          label="Assignee"
                          qtkMethod={triggerSeachUser}
                          onChange={setAgentValue}
                          loading={seachUserLoading}
                          isFallback={true}
                          icon={
                            <Assignment
                              fontSize="small"
                              sx={{ color: "#666", mr: 1 }}
                            />
                          }
                          renderOptionExtra={(user) => (
                            <Typography variant="body2" color="text.secondary">
                              {user.email}
                            </Typography>
                          )}
                          size="small"
                        />

                        <Autocomplete
                          multiple
                          disableClearable
                          popupIcon={null}
                          getOptionLabel={(option) => {
                            if (typeof option === "string") return option;
                            return option?.tagName || option.name || "";
                          }}
                          options={displayOptions}
                          value={tagValue}
                          onChange={(event, newValue) => {
                            handleSelectedOption(event, newValue, "tag");
                          }}
                          onInputChange={(_, value) => {
                            setChangeTabValue(value);
                            fetchTagOptions(value);
                          }}
                          filterOptions={(x) => x}
                          getOptionDisabled={(option) =>
                            option === "Type to search"
                          }
                          noOptionsText={
                            changeTagValue.length < 3
                              ? "Type at least 3 characters to search"
                              : "No tags found"
                          }
                          renderOption={(props, option) => {
                            return (
                              <li {...props} key={option.tagID}>
                                {typeof option === "string" ? (
                                  option
                                ) : (
                                  <div
                                    className="flex items-center gap-3 p-1 rounded-md w-full"
                                    style={{ cursor: "pointer" }}
                                  >
                                    <div className="flex flex-col">
                                      <Typography
                                        variant="subtitle2"
                                        sx={{ fontWeight: 600 }}
                                      >
                                        {option?.tagName}
                                      </Typography>
                                    </div>
                                  </div>
                                )}
                              </li>
                            );
                          }}
                          renderTags={(editTags, getTagProps) =>
                            editTags.map((option, index) => {
                              const label =
                                typeof option === "string"
                                  ? option
                                  : option?.tagName ||
                                    option?.name ||
                                    "Unknown Tag";

                              return (
                                <Chip
                                  key={index}
                                  label={label}
                                  onDelete={() => {
                                    const newTags = editTags.filter(
                                      (_, i) => i !== index
                                    );
                                    setTagValue(newTags);
                                  }}
                                  sx={{
                                    "& .MuiChip-deleteIcon": {
                                      color: "error.main",
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
                              label="Tags"
                              variant="outlined"
                              size="medium"
                              fullWidth
                              InputProps={{
                                ...params.InputProps,
                                startAdornment: (
                                  <>
                                    <LocalOffer
                                      fontSize="small"
                                      sx={{ color: "#666", mr: 1 }}
                                    />
                                    {params.InputProps.startAdornment}
                                  </>
                                ),
                              }}
                              sx={{
                                "& .MuiOutlinedInput-root": {
                                  borderRadius: "4px",
                                  backgroundColor: "#f9fafb",
                                  "&:hover fieldset": {
                                    borderColor: "#9ca3af",
                                  },
                                  "&.Mui-focused fieldset": {
                                    borderColor: "#2566b0",
                                  },
                                },
                                "& label.Mui-focused": { color: "#2566b0" },
                                "& label": { fontWeight: "bold" },
                              }}
                            />
                          )}
                        />
                      </>
                    );

                  default:
                    return null;
                }
              })}
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
            className="custom-scrollbar"
          >
            {/* Mandatory Fields Alert */}
            <Alert
              severity="info"
              sx={{
                mb: 3,
                borderRadius: 2,
                "& .MuiAlert-icon": { color: "#2566b0", pt: 1.5 },
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
              {/* <SingleValueAsynAutocomplete
                value={newTicket?.user_name}
                label="From *"
                qtkMethod={triggerSeachUser}
                onChange={(newValue: any) => {
                  setNewTicket((prev) => ({
                    ...prev,
                    user_name: newValue.name,
                    user_email: newValue.email,
                    user_phone: newValue.phone,
                  }));
                }}
                loading={seachUserLoading}
                isFallback={true}
                icon={
                  <Email
                    fontSize="small"
                    sx={{
                      color: errors.user_email ? "#d32f2f" : "#666",
                    }}
                  />
                }
                renderOptionExtra={(user) => (
                  <Typography variant="body2" color="text.secondary">
                    {user.email}
                  </Typography>
                )}
              /> */}

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
                      borderColor: errors.subject ? "#d32f2f" : "#2566b0",
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
                <Email sx={{ fontSize: 48, color: "#2566b0" }} />
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
