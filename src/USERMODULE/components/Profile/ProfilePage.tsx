import { useMemo, useState } from "react";
import {
  Box,
  Button,
  Tab,
  Tabs,
  Typography,
  IconButton,
  Avatar,
} from "@mui/material";

import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  MergeType as MergeIcon,
  PersonAdd as AgentIcon,
  Password as PasswordIcon,
  Add as AddIcon,
  ArrowBack as ArrowBackIcon,
} from "@mui/icons-material";
import ConfirmationModal from "../../../components/reusable/ConfirmationModal";
import CustomSideBarPanel from "../../../components/reusable/CustomSideBarPanel";
import EditUser from "../../pages/EditUser";
import ConvertProfile from "../ConvertProfile";
import ChangePassword from "../ChangePassword";
import MergeContact from "../MergeContact";

import { useNavigate, useParams } from "react-router-dom";
import { useCommanApiMutation } from "../../../services/threadsApi";
import OverviewTab from "./OverviewTab";
import TicketsTab from "./TicketsTab";
import ActivityTab from "./ActivityTab";
import SettingsTab from "./SettingsTab";
import SecurityTab from "./SecurityTab";
import { useGetUserOverviewDataQuery } from "../../../services/auth";

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
  {
    id: 4,
    title: "404 error when on a specific page #1",
    description:
      "Hi there, I tried to access my sales data in my account today but it showed a 404 error. Can you please help me fix this?",
    status: "Closed",
    group: "Escalations",
    closed: "17 days ago",
    resolved_late: true,
  },
  {
    id: 5,
    title: "404 error when on a specific page #1",
    description:
      "Hi there, I tried to access my sales data in my account today but it showed a 404 error. Can you please help me fix this?",
    status: "Closed",
    group: "Escalations",
    closed: "17 days ago",
    resolved_late: true,
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


const ProfilePage = () => {
  const navigate = useNavigate();

  const userId = useParams().id;

  const { data: UserData } = useGetUserOverviewDataQuery({
    client: userId,
    skip: !userId,
    refetchOnMountOrArgChange: true,
  });
  const [tab, setTab] = useState<number>(0);

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
    <Box sx={{ display: "flex", height: "calc(100vh - 96px)" }}>
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
            gap: 1,
          }}
        >
          <IconButton
            size="small"
            sx={{
              bgcolor: "grey.100",
              "&:hover": { bgcolor: "grey.200" },
            }}
            onClick={() => navigate("/create-user")}
          >
            <ArrowBackIcon fontSize="small" />
          </IconButton>
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
        </Box>

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
        <div style={{ flex: 1, padding: 2, backgroundColor: "#fff", overflow: "auto" }} className="custom-scrollbar">
          {tab === 0 && <OverviewTab user={UserData} />}
          {tab === 1 && <TicketsTab tickets={ticketData} />}
          {tab === 2 && <ActivityTab />}
          {tab === 3 && <SettingsTab />}
          {tab === 4 && <SecurityTab />}
        </div>
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
        userId={userId}
      />

      <CustomSideBarPanel
        open={isMerge}
        close={() => setIsMerge(false)}
        title={"Merge Contact"}
        width={600}
      >
        <MergeContact
          data={{
            userName: UserData?.fullName,
            userEmail: UserData?.email,
            isPrimaryEmail: isPrimaryEmail,
          }}
          close={() => setIsMerge(false)}
        />
      </CustomSideBarPanel>
    </Box>
  );
};

export default ProfilePage;
