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
            sx={{
              fontWeight: 500,
              color: "#1a73e8",
              fontSize: "0.875rem",
            }}
          >
            Edit Profile
          </Button>
          <Button
            size="small"
            startIcon={<DeleteIcon />}
            variant="outlined"
            color="error"
            onClick={() => setIsDeleteModalOpen(true)}
            sx={{
              fontWeight: 500,
              color: "red",
              fontSize: "0.875rem",
            }}
          >
            Delete
          </Button>
          <Button
            size="small"
            startIcon={<MergeIcon />}
            variant="outlined"
            onClick={handleMergeContact}
            sx={{
              fontWeight: 500,
              color: "#1a73e8",
              fontSize: "0.875rem",
            }}
          >
            Merge Contact
          </Button>
          <Button
            size="small"
            startIcon={<AgentIcon />}
            variant="outlined"
            onClick={() => setIsConvertProfile(true)}
            sx={{
              fontWeight: 500,
              color: "#1a73e8",
              fontSize: "0.875rem",
            }}
          >
            Convert to Agent
          </Button>
          <Button
            size="small"
            startIcon={<PasswordIcon />}
            variant="outlined"
            onClick={() => setIsChangePassword(true)}
            sx={{
              fontWeight: 500,
              color: "#1a73e8",
              fontSize: "0.875rem",
            }}
          >
            Change Password
          </Button>
          <Button
            size="small"
            startIcon={<AddIcon />}
            variant="outlined"
            onClick={() => navigate("/create-ticket")}
            sx={{
              fontWeight: 500,
              color: "#1a73e8",
              fontSize: "0.875rem",
            }}
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
            <OverviewTab
              user={{
                username,
                role,
                company,
                email,
                phone,
                address,
                initials,
              }}
            />
          )}
          {tab === 1 && <TicketsTab tickets={ticketData} />}
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
