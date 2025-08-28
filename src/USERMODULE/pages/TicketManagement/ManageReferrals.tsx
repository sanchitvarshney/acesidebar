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
} from "@mui/material";
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

interface ManageReferralsProps {
  open: boolean;
  onClose: () => void;
  ticketId: string | number;
}

interface Referral {
  id: string;
  type: "department" | "agent" | "external";
  name: string;
  email?: string;
  department?: string;
  status: "pending" | "accepted" | "rejected" | "completed";
  priority: "low" | "medium" | "high";
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
  ticketId,
}) => {
  const [commanApi] = useCommanApiMutation();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState(0);
  const [referralType, setReferralType] = useState<
    "department" | "agent" | "team" | null
  >(null);
  const [selectedDepartment, setSelectedDepartment] = useState<any>("");
  const [selectedAgent, setSelectedAgent] = useState<any>("");
  const [selectedTeam, setSelectedTeam] = useState("");
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium");
  const [dueDate, setDueDate] = useState("");
  const [notes, setNotes] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const [contactChangeValue, setContactChangeValue] = useState("");

  const [options, setOptions] = useState<any>();

  const displayContactOptions: any = contactChangeValue ? options : [];
  const inputRef = useRef(null);

  useEffect(() => {
    if (open && inputRef.current) {
      //@ts-ignore
      setTimeout(() => inputRef.current.focus(), 100);
    }
  }, [open]);

  useEffect(() => {
    const filterValue: any = fetchOptions(contactChangeValue);

    filterValue?.length > 0
      ? setOptions(filterValue)
      : setOptions([
          {
            userName: contactChangeValue,
            userEmail: contactChangeValue,
          },
        ]);
  }, [contactChangeValue]);

  const handleSelectedOption = (_: React.SyntheticEvent, value: any) => {
    if (!value) return;

    const dataValue = { name: value.userName, email: value.userEmail };
    if (!isValidEmail(dataValue.email)) {
      showToast("Invalid email format", "error");
      return;
    }

    if (referralType === "team") {
      setSelectedTeam(dataValue.email);
    } else if (referralType === "agent") {
      setSelectedAgent(dataValue.email);
    } else {
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
      url: `tickets/${ticketId}/referrals`,
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
        dueDate: dueDate || null,
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
      url: `tickets/${ticketId}/referrals/${referralId}/status`,
      method: "PUT",
      body: { status: newStatus },
    };

    commanApi(payload);
  };

  const resetForm = () => {
    setSelectedDepartment(null);
    setSelectedAgent(null);
    setSelectedAgent("");
    setPriority("medium");
    setDueDate("");
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
                  value={referralType}
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
                  return option.userEmail || option.userName || "";
                }}
                options={displayContactOptions}
                value={selectedAgent}
                onChange={(event, newValue) => {
                  handleSelectedOption(event, newValue);
                }}
                onInputChange={(_, value) => setContactChangeValue(value)}
                filterOptions={(x) => x}
                getOptionDisabled={(option) => option === "Type to search"}
                noOptionsText="No Data Found"
                renderOption={(props, option) => {
                  console.log("Option:", option);
                  return (
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
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              {option.userEmail}
                            </Typography>
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
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel>Priority</InputLabel>
                <Select
                  value={priority}
                  label="Priority"
                  onChange={(e) => setPriority(e.target.value as any)}
                >
                  <MenuItem value="low">Low</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="high">High</MenuItem>
                </Select>
              </FormControl>
              <TextField
                size="small"
                type="date"
                label="Due Date (Optional)"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
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
              <Typography variant="body2">
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
                      <Avatar sx={{ bgcolor: "#1976d2" }}>
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
