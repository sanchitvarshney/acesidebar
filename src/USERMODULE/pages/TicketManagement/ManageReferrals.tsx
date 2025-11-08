import React, { useState, useEffect, useRef } from "react";
import {
  IconButton,
  TextField,
  Button,
  Typography,
  Box as MuiBox,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Avatar,
  Chip,
  Divider,
  Alert,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  ListItemSecondaryAction,
  Badge,
  Tabs,
  Tab,
  InputAdornment,
  Autocomplete,
  Box,
  CircularProgress,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Dayjs } from "dayjs";
import dayjs from "dayjs";
import {
  Person,
  Search,
  Share,
  Add,
  Remove,
  History,
  Pending,
  CheckCircle,
  Cancel,
  Info,
  Business,
  Group,
} from "@mui/icons-material";
import { useToast } from "../../../hooks/useToast";
import { useCommanApiMutation } from "../../../services/threadsApi";
import { fetchOptions, isValidEmail } from "../../../utils/Utils";
import {
  useLazyGetDepartmentBySeachQuery,
  useLazyGetUserBySeachQuery,
} from "../../../services/agentServices";
import { useGetPriorityListQuery } from "../../../services/ticketAuth";

interface ManageReferralsProps {
  open: boolean;
  onClose: () => void;
  ticket: any;
}

interface Referral {
  id: string;
  type: "department" | "agent" | "external";
  name: string;
  email?: string;
  department?: string;
  status: "pending" | "accepted" | "rejected" | "completed";
  priority: any;
  assignedAt: string;
  dueDate?: string;
  notes?: string;
  assignedBy: string;
}

interface Department {
  id: string;
  name: string;
  description: string;
  agentCount: number;
  avgResponseTime: string;
}

interface Agent {
  id: string;
  name: string;
  email: string;
  department: string;
  specialization: string[];
  currentWorkload: number;
  isAvailable: boolean;
}

// Sample data - replace with actual API calls
const departments: Department[] = [
  {
    id: "1",
    name: "Technical Support",
    description: "Handles technical issues and system problems",
    agentCount: 8,
    avgResponseTime: "2 hours",
  },
  {
    id: "2",
    name: "Billing & Finance",
    description: "Manages billing inquiries and payment issues",
    agentCount: 5,
    avgResponseTime: "4 hours",
  },
  {
    id: "3",
    name: "Product Development",
    description: "Handles feature requests and product feedback",
    agentCount: 12,
    avgResponseTime: "24 hours",
  },
  {
    id: "4",
    name: "Customer Success",
    description: "Provides onboarding and account management",
    agentCount: 6,
    avgResponseTime: "1 hour",
  },
];

const agents: Agent[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john.doe@example.com",
    department: "Technical Support",
    specialization: ["Network", "Security"],
    currentWorkload: 3,
    isAvailable: true,
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    department: "Billing & Finance",
    specialization: ["Payments", "Invoicing"],
    currentWorkload: 5,
    isAvailable: true,
  },
  {
    id: "3",
    name: "Mike Johnson",
    email: "mike.johnson@example.com",
    department: "Product Development",
    specialization: ["Frontend", "UI/UX"],
    currentWorkload: 2,
    isAvailable: false,
  },
  {
    id: "4",
    name: "Sarah Wilson",
    email: "sarah.wilson@example.com",
    department: "Customer Success",
    specialization: ["Onboarding", "Training"],
    currentWorkload: 4,
    isAvailable: true,
  },
];

const existingReferrals: Referral[] = [
  {
    id: "1",
    type: "department",
    name: "Technical Support",
    status: "pending",
    priority: "high",
    assignedAt: "2024-01-15T10:00:00Z",
    dueDate: "2024-01-16T10:00:00Z",
    notes: "Customer experiencing login issues",
    assignedBy: "John Manager",
  },
  {
    id: "2",
    type: "agent",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    status: "accepted",
    priority: "medium",
    assignedAt: "2024-01-14T14:30:00Z",
    dueDate: "2024-01-17T14:30:00Z",
    notes: "Billing inquiry follow-up",
    assignedBy: "Support Team",
  },
];

const ManageReferrals: React.FC<ManageReferralsProps> = ({
  open,
  onClose,
  ticket,
}) => {
  const [commanApi] = useCommanApiMutation();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState(0);
  const [referralType, setReferralType] = useState<
    "department" | "agent" | "team" | ""
  >("");
  const [selectedDepartment, setSelectedDepartment] = useState<any>(null);
  const [selectedAgent, setSelectedAgent] = useState<any>(null);
  const [selectedTeam, setSelectedTeam] = useState<any>(null);
  const [priority, setPriority] = useState<any>("");
  const [dueDate, setDueDate] = useState<Dayjs | null>(null);
  const [notes, setNotes] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const { data: priorityList, isLoading: isPriorityListLoading } =
    useGetPriorityListQuery();
  const [contactChangeValue, setContactChangeValue] = useState("");

  const [options, setOptions] = useState<any[]>([]);

  const displayContactOptions: any = contactChangeValue ? options : [];
  const inputRef = useRef(null);
  const [triggerSeachUser, { isLoading: seachUserLoading }] =
    useLazyGetUserBySeachQuery();
  const [triggerDept, { isLoading: deptLoading }] =
    useLazyGetDepartmentBySeachQuery();

  useEffect(() => {
    if (ticket?.status) {
      setPriority(ticket?.status);
    }
  }, [ticket?.status]);

  useEffect(() => {
    if (open && inputRef.current) {
      //@ts-ignore
      setTimeout(() => inputRef.current.focus(), 100);
    }
  }, [open]);
 

  const fetchUserOptions = async (query: string) => {
    if (!query) {
      setOptions([]);
      return;
    }

    try {
      const res =
        referralType === "department"
          ? await triggerDept({ search: query }).unwrap()
          : await triggerSeachUser({ search: query }).unwrap();

      //@ts-ignore
      const data = Array.isArray(res) ? res : res?.data;

      const currentValue = contactChangeValue;
      const fallback: any = [];

      referralType === "department" &&
        fallback.push({
          id: currentValue,
          name: currentValue,
        });

      referralType === "agent" &&
        fallback.push({
          name: currentValue,
          email: currentValue,
        });

      if (Array.isArray(data)) {
        setOptions(data.length > 0 ? data : fallback);
      } else {
        setOptions([]);
      }
    } catch (error) {
      setOptions([]);
    }
  };

  const handleSelectedOption = (_: React.SyntheticEvent, value: any) => {
    if (!value) return;
    console.log(value, "value");

    if (referralType === "team") {
      const dataValue = { name: value.name, email: value.userEmail };
      if (!isValidEmail(dataValue.email)) {
        showToast("Invalid email format", "error");
        return;
      }
      setSelectedTeam(dataValue);
    } else if (referralType === "agent") {
      const dataValue = { name: value.name, email: value.email };
      if (!isValidEmail(dataValue.email)) {
        showToast("Invalid email format", "error");
        return;
      }
      setSelectedAgent(dataValue);
    } else {
      setSelectedDepartment(value);
    }
  };

  const handleCreateReferral = async () => {
    if (referralType === "department" && !selectedDepartment) {
      showToast("Please select a department", "error");
      return;
    }
    if (referralType === "agent" && !selectedAgent) {
      showToast("Please select an agent", "error");
      return;
    }
    if (referralType === "team" && !selectedTeam.trim()) {
      showToast("Please enter an external email", "error");
      return;
    }
    if (!notes.trim()) {
      showToast("Please add notes for the referral", "error");
      return;
    }

    const payload = {
      url: `tickets/${ticket.id}/referrals`,
      method: "POST",
      body: {
        type: referralType,
        targetId:
          referralType === "department"
            ? selectedDepartment?.id
            : referralType === "agent"
            ? selectedAgent?.id
            : null,
        targetEmail: referralType === "team" ? selectedTeam : "",
        priority,
        dueDate: dueDate ? dueDate.toISOString() : null,
        notes,
        status: "pending",
      },
    };

    commanApi(payload);
  };

  const handleUpdateReferralStatus = async (
    referralId: string,
    newStatus: Referral["status"]
  ) => {
    const payload = {
      url: `tickets/${ticket?.id}/referrals/${referralId}/status`,
      method: "PUT",
      body: { status: newStatus },
    };

    commanApi(payload);
  };

  const resetForm = () => {
    setSelectedDepartment(null);
    setSelectedAgent(null);
    setSelectedTeam("");
    setPriority("");
    setDueDate(null);
    setNotes("");
    setSearchQuery("");
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const getStatusColor = (status: Referral["status"]) => {
    switch (status) {
      case "pending":
        return "warning";
      case "accepted":
        return "info";
      case "rejected":
        return "error";
      case "completed":
        return "success";
      default:
        return "default";
    }
  };

  const getStatusIcon = (status: Referral["status"]) => {
    switch (status) {
      case "pending":
        return <Pending />;
      case "accepted":
        return <CheckCircle />;
      case "rejected":
        return <Cancel />;
      case "completed":
        return <CheckCircle />;
      default:
        return <History />;
    }
  };

  return (
    <MuiBox
      sx={{
        p: 0,
        bgcolor: "#fff",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        width: "100%",
        maxWidth: "100%",
        boxShadow: 1,
        position: "relative",
        m: 0,
      }}
    >
      <MuiBox sx={{ p: 2, flex: 1, overflowY: "auto", width: "100%" }}>
        {/* Tabs */}
        <MuiBox sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
          <Tabs
            value={activeTab}
            onChange={(_, newValue) => setActiveTab(newValue)}
          >
            <Tab label="Create Referral" icon={<Add />} iconPosition="start" />
            <Tab
              label="Existing Referrals"
              icon={<History />}
              iconPosition="start"
            />
          </Tabs>
        </MuiBox>

        {activeTab === 0 && (
          /* Create Referral Tab */
          <MuiBox>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
              Create New Referral
            </Typography>

            {/* Referral Type Selection */}
            <MuiBox sx={{ mb: 3 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                Referral Type
              </Typography>
              <FormControl fullWidth size="small">
                <InputLabel>Select Type</InputLabel>
                <Select
                  value={referralType || ""}
                  autoFocus
                  inputRef={inputRef}
                  label="Select Type"
                  onChange={(e) => setReferralType(e.target.value as any)}
                >
                  <MenuItem value="department">
                    <MuiBox
                      sx={{ display: "flex", alignItems: "center", gap: 1 }}
                    >
                      <Business fontSize="small" />
                      Department
                    </MuiBox>
                  </MenuItem>
                  <MenuItem value="agent">
                    <MuiBox
                      sx={{ display: "flex", alignItems: "center", gap: 1 }}
                    >
                      <Person fontSize="small" />
                      Specific Agent
                    </MuiBox>
                  </MenuItem>
                  <MenuItem value="team">
                    <MuiBox
                      sx={{ display: "flex", alignItems: "center", gap: 1 }}
                    >
                      <Share fontSize="small" />
                      Team
                    </MuiBox>
                  </MenuItem>
                </Select>
              </FormControl>
            </MuiBox>

            <MuiBox sx={{ mb: 3 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                {referralType === "department"
                  ? "Select Department"
                  : referralType === "agent"
                  ? "Select Agent"
                  : "Select Team"}
              </Typography>

              <Autocomplete
                disableClearable
                popupIcon={null}
                sx={{ my: 1.5 }}
                getOptionLabel={(option) => {
                  if (typeof option === "string") return option;
                  return option.name || option.deptName || "";
                }}
                options={displayContactOptions}
                value={
                  referralType === "department"
                    ? selectedDepartment
                    : referralType === "agent"
                    ? selectedAgent
                    : selectedTeam
                }
                onChange={(event, newValue) => {
                  handleSelectedOption(event, newValue);
                }}
                onInputChange={(_, value) => {
                  setContactChangeValue(value);
                  fetchUserOptions(value);
                }}
                filterOptions={(x) => x}
                getOptionDisabled={(option) => option === "Type to search"}
                noOptionsText="No Data Found"
                renderOption={(props, option) => {
                  return (
                    <li {...props}>
                      {typeof option === "string" ? (
                        option
                      ) : (
                        <div
                          className="flex items-center gap-3 p-2 rounded-md w-full"
                          style={{ cursor: "pointer" }}
                        >
                          <div className="flex flex-col">
                            <Typography
                              variant="subtitle2"
                              sx={{ fontWeight: 600 }}
                            >
                              {option.name ?? option?.deptName}
                            </Typography>
                            {option.email && (
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                {option.userEmail}
                              </Typography>
                            )}
                          </div>
                        </div>
                      )}
                    </li>
                  );
                }}
                renderTags={(value, getTagProps) =>
                  value?.map((option, index) => (
                    <Chip
                      variant="outlined"
                      color="primary"
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
                    label={`Search ${
                      referralType === "department"
                        ? "departments"
                        : referralType === "agent"
                        ? "agents"
                        : "teams"
                    }...`}
                    variant="outlined"
                    fullWidth
                    InputProps={{
                      ...params.InputProps,
                      startAdornment: (
                        <InputAdornment position="start">
                          <Search sx={{ color: "#666", mr: 1 }} />
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
            </MuiBox>

            {/* Priority and Due Date */}
            <MuiBox sx={{ display: "flex", gap: 2, mb: 3 }}>
              <FormControl  size="small" variant="outlined">
                <InputLabel>Priority</InputLabel>
                <Select
                  value={priority || ""}
                  onChange={(e) =>
                    setPriority(e.target.value)
                  }
                  label="Priority"
                  // startAdornment={
                  //   <PriorityHigh
                  //     fontSize="small"
                  //     sx={{ color: "#666", mr: 1 }}
                  //   />
                  // }
                  sx={{
                    width:300,
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#9ca3af",
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#03363d",
                    },
                    backgroundColor: "#fff",
                    fontSize: "0.875rem",
                  }}
                >
                  {priorityList?.map((option: any) => (
                    <MenuItem key={option.key} value={option.key}>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
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
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Due Date (Optional)"
                  value={dueDate}
                  
                  onChange={(newValue:any, _context) => setDueDate(newValue)}
                  format="DD-MM-YYYY"
                  slotProps={{
                    textField: {
                      variant: "outlined",
                      size: "small",
                      sx: {
                        width: 200,
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "4px",
                          backgroundColor: "#f9fafb",
                          "& .MuiOutlinedInput-notchedOutline": {
                            borderColor: "#9ca3af",
                          },
                          "&:hover .MuiOutlinedInput-notchedOutline": {
                            borderColor: "#9ca3af",
                          },
                          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                            borderColor: "#1a73e8",
                          },
                        },
                        "& label.Mui-focused": { color: "#1a73e8" },
                        "& label": { fontWeight: "bold" },
                      },
                    },
                  }}
                
                />
              </LocalizationProvider>
            </MuiBox>

            {/* Notes */}
            <MuiBox sx={{ mb: 3 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                Referral Notes
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={3}
                placeholder="Explain why this referral is needed..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </MuiBox>

            {/* Info Alert */}
            <Alert severity="info" sx={{ mb: 2 }}>
              <Typography variant="body2" component="div">
                <strong>Note:</strong> Creating a referral will:
                <ul style={{ margin: "4px 0", paddingLeft: "20px" }}>
                  <li>
                    Notify the selected department/agent about the referral
                  </li>
                  <li>Track the referral status and progress</li>
                  <li>Allow collaboration between teams</li>
                  <li>Maintain a complete audit trail</li>
                </ul>
              </Typography>
            </Alert>
          </MuiBox>
        )}

        {activeTab === 1 && (
          /* Existing Referrals Tab */
          <MuiBox>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
              Existing Referrals
            </Typography>

            {existingReferrals.length === 0 ? (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ textAlign: "center", py: 4 }}
              >
                No referrals have been created for this ticket yet.
              </Typography>
            ) : (
              <List>
                {existingReferrals.map((referral) => (
                  <ListItem
                    key={referral.id}
                    sx={{
                      border: "1px solid #e0e0e0",
                      borderRadius: 1,
                      mb: 1,
                      backgroundColor: "#fafafa",
                    }}
                  >
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: "#03363d" }}>
                        {referral.type === "department" ? (
                          <Business />
                        ) : (
                          <Person />
                        )}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <MuiBox
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            mb: 0.5,
                          }}
                        >
                          <Typography variant="body1" sx={{ fontWeight: 500 }}>
                            {referral.name}
                          </Typography>
                          <Chip
                            icon={getStatusIcon(referral.status)}
                            label={referral.status}
                            size="small"
                            color={getStatusColor(referral.status) as any}
                            sx={{ textTransform: "capitalize" }}
                          />
                          <Chip
                            label={referral.priority}
                            size="small"
                            variant="outlined"
                            color={
                              referral.priority === "high"
                                ? "error"
                                : referral.priority === "medium"
                                ? "warning"
                                : "success"
                            }
                            sx={{ textTransform: "capitalize" }}
                          />
                        </MuiBox>
                      }
                      secondary={
                        <MuiBox>
                          <Typography variant="body2" color="text.secondary">
                            Assigned by: {referral.assignedBy} •{" "}
                            {new Date(referral.assignedAt).toLocaleDateString()}
                          </Typography>
                          {referral.dueDate && (
                            <Typography variant="body2" color="text.secondary">
                              Due:{" "}
                              {new Date(referral.dueDate).toLocaleDateString()}
                            </Typography>
                          )}
                          {referral.notes && (
                            <Typography variant="body2" sx={{ mt: 1 }}>
                              {referral.notes}
                            </Typography>
                          )}
                        </MuiBox>
                      }
                    />
                    <ListItemSecondaryAction>
                      {referral.status === "pending" && (
                        <MuiBox sx={{ display: "flex", gap: 1 }}>
                          <Button
                            size="small"
                            variant="outlined"
                            color="success"
                            onClick={() =>
                              handleUpdateReferralStatus(
                                referral.id,
                                "accepted"
                              )
                            }
                          >
                            Accept
                          </Button>
                          <Button
                            size="small"
                            variant="outlined"
                            color="error"
                            onClick={() =>
                              handleUpdateReferralStatus(
                                referral.id,
                                "rejected"
                              )
                            }
                          >
                            Reject
                          </Button>
                        </MuiBox>
                      )}
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            )}
          </MuiBox>
        )}
      </MuiBox>

      {/* Action Buttons */}
      {activeTab === 0 && (
        <MuiBox
          sx={{
            p: 2,
            borderTop: "1px solid #eee",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 1,
            backgroundColor: "#fafafa",
          }}
        >
          <Button
            onClick={handleClose}
            variant="text"
            sx={{ minWidth: 80, fontWeight: 600 }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleCreateReferral}
            variant="contained"
            color="primary"
            disabled={
              (referralType === "department" && !selectedDepartment) ||
              (referralType === "agent" && !selectedAgent) ||
              (referralType === "team" && !selectedTeam) ||
              !notes.trim()
            }
            startIcon={<Share />}
            sx={{ minWidth: 120, fontWeight: 600 }}
          >
            Create Referral
          </Button>
        </MuiBox>
      )}
    </MuiBox>
  );
};

export default ManageReferrals;
