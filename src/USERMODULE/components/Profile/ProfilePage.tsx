import React, { useMemo, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Tab,
  Tabs,
  Typography,
  IconButton,
  Card,
  CardContent,
  Stack,
  Badge,
} from "@mui/material";

import {
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineDot,
  TimelineContent,
  timelineOppositeContentClasses,
  Timeline,
} from "@mui/lab";
import EmailIcon from "@mui/icons-material/Email";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  MergeType as MergeIcon,
  PersonAdd as AgentIcon,
  Password as PasswordIcon,
  Add as AddIcon,
  Phone as PhoneIcon,
  Mail as MailIcon,
  LocationOn as LocationIcon,
  CheckCircle as CheckIcon,
  Business as BusinessIcon,
  Work as WorkIcon,
  Schedule as ScheduleIcon,
  PriorityHigh as PriorityIcon,
  ArrowBack as ArrowBackIcon,
} from "@mui/icons-material";
import ConfirmationModal from "../../../components/reusable/ConfirmationModal";
import CustomSideBarPanel from "../../../components/reusable/CustomSideBarPanel";
import EditUser from "../../pages/EditUser";
import ConvertProfile from "../ConvertProfile";
import ChangePassword from "../ChangePassword";
import MergeContact from "../MergeContact";
import CustomToolTip from "../../../reusable/CustomToolTip";
import { useNavigate, useParams } from "react-router-dom";
import { common } from "@mui/material/colors";
import { useCommanApiMutation } from "../../../services/threadsApi";
import OverviewTab from "./OverviewTab";
import TicketsTab from "./TicketsTab";
import ActivityTab from "./ActivityTab";
import SettingsTab from "./SettingsTab";
import SecurityTab from "./SecurityTab";

const ticketData: any = [
  {
    id: 2,
    title: "Authentication failure #2",
    description:
      "Hello, We're receiving authentication failure errors while attempting to use your APIs. Can someone please help?",
    status: "Open",
    group: "Escalations",
    created: "a month ago",
    overdue: true,
    overdue_by: "a month",
  },
  {
    id: 1,
    title: "404 error when on a specific page #1",
    description:
      "Hi there, I tried to access my sales data in my account today but it showed a 404 error. Can you please help me fix this?",
    status: "Closed",
    group: "Escalations",
    closed: "17 days ago",
    resolved_late: true,
  },
];

const getUserData = () => {
  try {
    const userDataStr = localStorage.getItem("userData");
    if (!userDataStr) return null;
    return JSON.parse(userDataStr);
  } catch {
    return null;
  }
};

const ProfilePage = () => {
  const userData = getUserData();
  const navigate = useNavigate();

  const username = userData?.username || userData?.user?.username || "John Doe";
  const role = userData?.role || userData?.user?.role || "CEO";
  const company = userData?.company || "Freshworks";
  const email = userData?.email || userData?.user?.email || "abcd.com";
  const phone = userData?.phone || userData?.user?.phone || "27637738";
  const address = userData?.address || "7, fngu ,wiuf ";

  const userId = useParams().id;

  const [tab, setTab] = useState<number>(0);

  const initials = useMemo(() => {
    if (!username) return "?";
    const parts = String(username).split(" ");
    return (parts[0]?.[0] || "").toUpperCase();
  }, [username]);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [isConvertProfile, setIsConvertProfile] = useState(false);
  const [isChangePassword, setIsChangePassword] = useState(false);
  const [isMerge, setIsMerge] = useState(false);
  const [isPrimaryEmail, setIsPrimaryEmail] = useState(false);
  const [commanApi] = useCommanApiMutation();

  const handleDelete = () => {
    const payload = {
      url: `delete-user/${userId}`,
      method: "DELETE",
    };
    commanApi(payload);
  };
  const handleMakeAgent = () => {
    const payload = {
      url: `make-agent/${userId}`,
      method: "PUT",
      body: {
        type: "agent",
      },
    };
    commanApi(payload);
  };

  const handleMergeContact = () => {
    setIsMerge(true);
    setIsPrimaryEmail(true);
  };

  return (
    <Box sx={{ display: "flex", height: "calc(100vh - 98px)" }}>
      {/* Left Sidebar */}
      <Box
        sx={{
          width: 280,
          bgcolor: "background.paper",
          borderRight: "1px solid #e5e7eb",
          p: 3,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Sidebar Header */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 3,
          }}
        >
          <Typography
            variant="h5"
            sx={{
              fontWeight: 600,
              color: "text.primary",
              fontSize: "1.25rem",
            }}
          >
            User Profile
          </Typography>
          <IconButton
            size="small"
            sx={{
              bgcolor: "grey.100",
              "&:hover": { bgcolor: "grey.200" },
            }}
          >
            <ArrowBackIcon fontSize="small" />
          </IconButton>
        </Box>

        {/* Sidebar Info Message */}
        <Typography
          variant="body2"
          sx={{
            color: "text.secondary",
            fontSize: "0.875rem",
            lineHeight: 1.5,
            mb: 4,
          }}
        >
          Manage your profile settings and account preferences.
        </Typography>

        {/* Action Buttons */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 1.5,
            mt: "auto",
          }}
        >
          <Button
            size="small"
            startIcon={<EditIcon />}
            variant="outlined"
            onClick={() => setIsEdit(true)}
            sx={{ justifyContent: "flex-start", textTransform: "none" }}
          >
            Edit Profile
          </Button>
          <Button
            size="small"
            startIcon={<DeleteIcon />}
            variant="outlined"
            color="error"
            onClick={() => setIsDeleteModalOpen(true)}
            sx={{ justifyContent: "flex-start", textTransform: "none" }}
          >
            Delete
          </Button>
          <Button
            size="small"
            startIcon={<MergeIcon />}
            variant="outlined"
            onClick={handleMergeContact}
            sx={{ justifyContent: "flex-start", textTransform: "none" }}
          >
            Merge Contact
          </Button>
          <Button
            size="small"
            startIcon={<AgentIcon />}
            variant="outlined"
            onClick={() => setIsConvertProfile(true)}
            sx={{ justifyContent: "flex-start", textTransform: "none" }}
          >
            Convert to Agent
          </Button>
          <Button
            size="small"
            startIcon={<PasswordIcon />}
            variant="outlined"
            onClick={() => setIsChangePassword(true)}
            sx={{ justifyContent: "flex-start", textTransform: "none" }}
          >
            Change Password
          </Button>
          <Button
            size="small"
            startIcon={<AddIcon />}
            variant="outlined"
            onClick={() => navigate("/create-ticket")}
            sx={{ justifyContent: "flex-start", textTransform: "none" }}
          >
            New Ticket
          </Button>
        </Box>
      </Box>

      {/* Main Content Area */}
      <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {/* Top Navigation Tabs */}
        <Box
          sx={{
            borderBottom: "1px solid #e5e7eb",
            bgcolor: "background.paper",
            px: 3,
          }}
        >
          <Tabs
            value={tab}
            onChange={(_, v) => setTab(v)}
            sx={{
              "& .MuiTab-root": {
                textTransform: "none",
                fontWeight: 500,
                fontSize: "0.875rem",
                minHeight: 48,
                px: 3,
              },
              "& .MuiTabs-indicator": {
                height: 2,
                backgroundColor: "primary.main",
              },
            }}
          >
            <Tab label="Overview" />
            <Tab label="Tickets" />
            <Tab label="Activity" />
            <Tab label="Settings" />
            <Tab label="Security" />
          </Tabs>
        </Box>

        {/* Main Content */}
        <Box sx={{ flex: 1, p: 3, bgcolor: "#f5f6fa", overflow: "auto" }}>
          {tab === 0 && (
            <Box sx={{ display: "flex", gap: 3, height: "100%" }}>
              {/* Left Column - Profile Info & Timeline */}
              <Box
                sx={{
                  flex: 2,
                  display: "flex",
                  flexDirection: "column",
                  gap: 3,
                }}
              >
                {/* Profile Header Card */}
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    bgcolor: "background.paper",
                    borderRadius: 2,
                    border: "1px solid #e5e7eb",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 3,
                      mb: 3,
                    }}
                  >
                    <Avatar
                      sx={{
                        width: 80,
                        height: 80,
                        bgcolor: "primary.main",
                        fontSize: 32,
                        fontWeight: "bold",
                      }}
                    >
                      {initials}
                    </Avatar>
                    <Box>
                      <Typography
                        variant="h4"
                        sx={{
                          fontWeight: 700,
                          color: "text.primary",
                          mb: 1,
                        }}
                      >
                        {username}
                      </Typography>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 2,
                          mb: 1,
                        }}
                      >
                        <Chip
                          icon={<WorkIcon />}
                          label={role}
                          size="small"
                          sx={{ bgcolor: "primary.main", color: "white" }}
                        />
                        <Chip
                          icon={<BusinessIcon />}
                          label={company}
                          variant="outlined"
                          size="small"
                          sx={{
                            borderColor: "primary.main",
                            color: "primary.main",
                          }}
                        />
                      </Box>
                    </Box>
                  </Box>
                </Paper>

                {/* Timeline & Tickets Card */}
                <Paper
                  elevation={0}
                  sx={{
                    flex: 1,
                    bgcolor: "background.paper",
                    borderRadius: 2,
                    border: "1px solid #e5e7eb",
                    overflow: "hidden",
                  }}
                >
                  <Box sx={{ p: 3, borderBottom: "1px solid #e5e7eb" }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                      {tab === 0 ? "Timeline" : "Tickets"}
                    </Typography>
                  </Box>

                  <Box
                    sx={{ p: 3, height: "calc(100% - 80px)", overflow: "auto" }}
                  >
                    {tab === 0 ? (
                      <Timeline
                        sx={{
                          [`& .${timelineOppositeContentClasses.root}`]: {
                            flex: 0.2,
                          },
                          p: 0,
                        }}
                      >
                        <TimelineItem
                          sx={{
                            "&::before": {
                              display: "none",
                            },
                          }}
                        >
                          <TimelineSeparator>
                            <TimelineConnector
                              sx={{ bgcolor: "primary.main" }}
                            />
                            <TimelineDot sx={{ bgcolor: "primary.main" }}>
                              <MailOutlineIcon fontSize="small" />
                            </TimelineDot>
                            <TimelineConnector
                              sx={{ bgcolor: "primary.main" }}
                            />
                          </TimelineSeparator>

                          <TimelineContent sx={{ py: "12px", px: 2 }}>
                            <Card
                              elevation={0}
                              sx={{
                                borderRadius: 2,
                                border: "1px solid #e5e7eb",
                                bgcolor: "background.paper",
                              }}
                            >
                              <CardContent sx={{ p: 3 }}>
                                <Box
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 2,
                                    mb: 2,
                                  }}
                                >
                                  <ScheduleIcon
                                    sx={{ color: "primary.main" }}
                                  />
                                  <Typography
                                    variant="body2"
                                    sx={{
                                      color: "primary.main",
                                      fontWeight: 600,
                                      fontSize: "0.875rem",
                                    }}
                                  >
                                    Thu, 10 Jul, 2025 • 9:22 AM
                                  </Typography>
                                </Box>

                                <Box
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 2,
                                    mb: 2,
                                  }}
                                >
                                  <Box
                                    sx={{
                                      width: 24,
                                      height: 24,
                                      borderRadius: 1,
                                      bgcolor: "primary.main",
                                    }}
                                  />
                                  <Typography
                                    variant="h6"
                                    sx={{
                                      fontWeight: 600,
                                      color: "text.primary",
                                    }}
                                  >
                                    Issues with reports #3
                                  </Typography>
                                </Box>

                                <Stack
                                  direction="row"
                                  spacing={2}
                                  sx={{ mb: 2 }}
                                >
                                  <Chip
                                    icon={<PriorityIcon />}
                                    label="Priority: Low"
                                    size="small"
                                    color="success"
                                    variant="outlined"
                                  />
                                  <Chip
                                    label="Status: Open"
                                    size="small"
                                    color="primary"
                                    variant="outlined"
                                  />
                                  <Chip
                                    label="Group: Escalations"
                                    size="small"
                                    color="secondary"
                                    variant="outlined"
                                  />
                                </Stack>

                                <Box
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 2,
                                    flexWrap: "wrap",
                                  }}
                                >
                                  <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{ fontSize: "0.875rem" }}
                                  >
                                    Agent responded: a month ago
                                  </Typography>
                                  <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{ fontSize: "0.875rem" }}
                                  >
                                    Overdue by: a month
                                  </Typography>
                                  <Chip
                                    size="small"
                                    label="Overdue"
                                    color="error"
                                    variant="outlined"
                                    sx={{ fontWeight: 600 }}
                                  />
                                </Box>
                              </CardContent>
                            </Card>
                          </TimelineContent>
                        </TimelineItem>
                      </Timeline>
                    ) : tab === 1 ? (
                      <TicketsTab tickets={ticketData} />
                    ) : null}
                  </Box>
                </Paper>
              </Box>

              {/* Right Column - Contact Details */}
              <Box sx={{ flex: 1 }}>
                <Paper
                  elevation={0}
                  sx={{
                    height: "100%",
                    bgcolor: "background.paper",
                    borderRadius: 2,
                    border: "1px solid #e5e7eb",
                    p: 3,
                  }}
                >
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                    Contact Details
                  </Typography>

                  {/* Tags Section */}
                  <Box sx={{ mb: 3 }}>
                    <Typography
                      variant="subtitle2"
                      sx={{ fontWeight: 600, color: "text.secondary", mb: 1.5 }}
                    >
                      Tags
                    </Typography>
                    <Button
                      size="small"
                      variant="outlined"
                      color="primary"
                      sx={{ fontWeight: 600, borderRadius: 1 }}
                    >
                      Add tags
                    </Button>
                  </Box>

                  <Divider sx={{ my: 3 }} />

                  {/* Contact Information */}
                  <Stack spacing={3}>
                    <Box>
                      <Typography
                        variant="subtitle2"
                        sx={{
                          fontWeight: 600,
                          color: "text.secondary",
                          mb: 1.5,
                        }}
                      >
                        Email Address
                      </Typography>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 2,
                          p: 2,
                          borderRadius: 2,
                          bgcolor: "primary.50",
                          border: "1px solid",
                          borderColor: "primary.200",
                        }}
                      >
                        <MailIcon sx={{ color: "primary.main" }} />
                        <Typography
                          variant="body2"
                          sx={{ fontWeight: 500, color: "text.primary" }}
                        >
                          {email}
                        </Typography>
                      </Box>
                    </Box>

                    <Box>
                      <Typography
                        variant="subtitle2"
                        sx={{
                          fontWeight: 600,
                          color: "text.secondary",
                          mb: 1.5,
                        }}
                      >
                        Work Phone
                      </Typography>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 2,
                          p: 2,
                          borderRadius: 2,
                          bgcolor: "success.50",
                          border: "1px solid",
                          borderColor: "success.200",
                        }}
                      >
                        <PhoneIcon sx={{ color: "success.main" }} />
                        <Typography
                          variant="body2"
                          sx={{ fontWeight: 500, color: "text.primary" }}
                        >
                          {phone}
                        </Typography>
                      </Box>
                    </Box>

                    <Box>
                      <Typography
                        variant="subtitle2"
                        sx={{
                          fontWeight: 600,
                          color: "text.secondary",
                          mb: 1.5,
                        }}
                      >
                        Address
                      </Typography>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "flex-start",
                          gap: 2,
                          p: 2,
                          borderRadius: 2,
                          bgcolor: "warning.50",
                          border: "1px solid",
                          borderColor: "warning.200",
                        }}
                      >
                        <LocationIcon sx={{ color: "warning.main", mt: 0.5 }} />
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: 500,
                            color: "text.primary",
                            lineHeight: 1.5,
                          }}
                        >
                          {address}
                        </Typography>
                      </Box>
                    </Box>
                  </Stack>
                </Paper>
              </Box>
            </Box>
          )}

          {/* Other Tab Content */}
          {tab === 2 && <ActivityTab />}
          {tab === 3 && <SettingsTab />}
          {tab === 4 && <SecurityTab />}
        </Box>
      </Box>

      {/* Modals - Keep all existing functionality */}
      <ConfirmationModal
        open={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
      />

      <EditUser isEdit={isEdit} close={() => setIsEdit(false)} />

      <ConvertProfile
        open={isConvertProfile}
        onClose={() => setIsConvertProfile(false)}
        onConfirm={handleMakeAgent}
      />

      <ChangePassword
        open={isChangePassword}
        onClose={() => setIsChangePassword(false)}
        onConfirm={() => {}}
      />

      <CustomSideBarPanel
        open={isMerge}
        close={() => setIsMerge(false)}
        title={"Merge Contact"}
        width={600}
      >
        <MergeContact
          data={{
            userName: username,
            userEmail: email,
            isPrimaryEmail: isPrimaryEmail,
          }}
          close={() => setIsMerge(false)}
        />
      </CustomSideBarPanel>
    </Box>
  );
};

export default ProfilePage;
