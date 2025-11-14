import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Tab,
  Tabs,
  Typography,
  IconButton,
  CircularProgress,
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
import { useLazyGetUserDataQuery } from "../../../services/auth";

const ProfilePage = () => {
  const navigate = useNavigate();
  const userId = useParams().id;
  const [tab, setTab] = useState<number>(0);
  const [userData, setUserData] = useState<any>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [isConvertProfile, setIsConvertProfile] = useState(false);
  const [isChangePassword, setIsChangePassword] = useState(false);
  const [isMerge, setIsMerge] = useState(false);
  const [isPrimaryEmail, setIsPrimaryEmail] = useState(false);
  const [commanApi] = useCommanApiMutation();
  const [getUserData, { isLoading: getUserDataLoading }] =
    useLazyGetUserDataQuery();

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
  const fetchData = () => {
    getUserData({ client: userId }).then((res) => {
      setUserData(res?.data);
    });
  };

  useEffect(() => {
    if (!userId) return;
    fetchData();
  }, [userId]);

  return (
    <Box sx={{ display: "flex", height: "calc(100vh - 96px)" }}>
      {/* Left Sidebar */}
      <Box
        sx={{
          minWidth: 280,
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
            onClick={() => navigate("/user")}
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
              color: "#2566b0",
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
              color: "#2566b0",
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
              color: "#2566b0",
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
              color: "#2566b0",
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
              color: "#2566b0",
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
        {getUserDataLoading ? (
          <div className="w-full h-[calc(100vh-160px] flex justify-center align-center">
            <CircularProgress />
          </div>
        ) : (
          <div
            style={{
              flex: 1,

              padding: 2,
              backgroundColor: "#fff",
              overflow: "auto",
            }}
            className="custom-scrollbar"
          >
            {tab === 0 && <OverviewTab user={userData} />}
            {tab === 1 && <TicketsTab userId={userId} />}
            {tab === 2 && <ActivityTab />}
            {tab === 3 && <SettingsTab />}
            {tab === 4 && <SecurityTab />}
          </div>
        )}
      </Box>

      {/* Modals - Keep all existing functionality */}
      <ConfirmationModal
        open={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        type={"delete"}
      />

      <EditUser
        isEdit={isEdit}
        close={() => {
          setIsEdit(false);
          fetchData();
        }}
        userData={userData}
        userId={userId}
      />

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
            userName: userData?.fullName,
            userEmail: userData?.email,
            isPrimaryEmail: isPrimaryEmail,
          }}
          close={() => setIsMerge(false)}
        />
      </CustomSideBarPanel>
    </Box>
  );
};

export default ProfilePage;
