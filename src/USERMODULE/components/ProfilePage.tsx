import React, { useMemo, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Chip,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import {
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineDot,
  TimelineContent,
  timelineOppositeContentClasses,
  Timeline,
  TimelineOppositeContent,
} from "@mui/lab";

import MailOutlineIcon from "@mui/icons-material/MailOutline"; // mail icon
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
} from "@mui/icons-material";
import ConfirmationModal from "../../components/reusable/ConfirmationModal";
import CustomSideBarPanel from "../../components/reusable/CustomSideBarPanel";
import EditUser from "../pages/EditUser";
import ConvertProfile from "./ConvertProfile";
import ChangePassword from "./ChangePassword";
import MergeContact from "./MergeContact";

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

  const username = userData?.username || userData?.user?.username || "John Doe";
  const role = userData?.role || userData?.user?.role || "CEO";
  const company = userData?.company || "Freshworks";
  const email = userData?.email || userData?.user?.email || "abcd.com";
  const phone = userData?.phone || userData?.user?.phone || "27637738";
  const address = userData?.address || "7, fngu ,wiuf ";

  const [tab, setTab] = useState(0);

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

  const handleMergeContact = () => {
    setIsMerge(true);
    setIsPrimaryEmail(true);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        p: 2,
        bgcolor: "#f5f6fa",
        height: "calc(100vh - 98px)",
        overflow: "hidden",
      }}
    >
      <div className="  space-x-2 p-2 ">
        {/* <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 1 }}> */}
        <Button
          size="small"
          startIcon={<EditIcon />}
          variant="contained"
          onClick={() => setIsEdit(true)}
        >
          Edit
        </Button>
        <Button
          size="small"
          startIcon={<DeleteIcon />}
          variant="contained"
          color="error"
          onClick={() => setIsDeleteModalOpen(true)}
        >
          Delete
        </Button>
        <Button
          size="small"
          startIcon={<MergeIcon />}
          variant="contained"
          onClick={handleMergeContact}
        >
          Merge
        </Button>
        <Button
          size="small"
          startIcon={<AgentIcon />}
          variant="contained"
          onClick={() => setIsConvertProfile(true)}
        >
          Convert to agent
        </Button>
        <Button
          size="small"
          startIcon={<PasswordIcon />}
          variant="contained"
          onClick={() => setIsChangePassword(true)}
        >
          Change password
        </Button>
        <Button
          size="small"
          startIcon={<AddIcon />}
          variant="contained"
          color="primary"
        >
          New ticket
        </Button>
        {/* </Box> */}
      </div>
      <div className=" grid grid-cols-[3fr_1fr] gap-4 h-[calc(100vh-100px)] overflow-y-auto ">
        <div className="">
          <Box
            sx={{
              flex: 1,
              minWidth: 0,
              display: "flex",
              flexDirection: "column",
              height: "100%",
            }}
          >
            <Paper
              elevation={0}
              sx={{
                // position: "sticky",
                // top: 0,
                zIndex: 1,
                p: 2,
                mb: 2,
                bgcolor: "background.paper",
                borderBottom: "1px solid #e5e7eb",
                flexShrink: 0,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 2,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    minWidth: 0,
                  }}
                >
                  <Avatar
                    sx={{
                      width: 64,
                      height: 64,
                      bgcolor: "#1976d2",
                      fontSize: 28,
                    }}
                  >
                    {initials}
                  </Avatar>
                  <Box sx={{ minWidth: 0 }}>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 700,
                        lineHeight: 1.2,
                        whiteSpace: "nowrap",
                        textOverflow: "ellipsis",
                        overflow: "hidden",
                      }}
                    >
                      {username}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {role}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="primary.main"
                      sx={{ mt: 0.5 }}
                    >
                      {company}
                    </Typography>
                    <Box sx={{ display: "flex", gap: 2, mt: 0.5 }}>
                      <Button size="small" variant="text">
                        Change
                      </Button>
                      <Button size="small" variant="text" color="error">
                        Remove
                      </Button>
                    </Box>
                  </Box>
                </Box>
                <Box sx={{ display: "flex", gap: 1, flexShrink: 0 }}>
                  <Button
                    size="small"
                    startIcon={<PhoneIcon />}
                    variant="outlined"
                  >
                    Call
                  </Button>
                </Box>
              </Box>

              <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mt: 2 }}>
                <Tab label="TIMELINE" />
                <Tab label="TICKETS" />
              </Tabs>
            </Paper>

            <Paper
              elevation={0}
              sx={{ p: 0, flex: "unset", overflowY: "auto" }}
            >
              {tab === 0 && (
                <Timeline
                  sx={{
                    [`& .${timelineOppositeContentClasses.root}`]: {
                      flex: 0.2,
                    },
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
                      <TimelineConnector sx={{ bgcolor: "secondary.main" }} />
                      <TimelineDot color="secondary">
                        <MailOutlineIcon fontSize="small" />
                      </TimelineDot>
                      <TimelineConnector />
                    </TimelineSeparator>

                    <TimelineContent sx={{ py: "12px", px: 2 }}>
                      <Box
                        sx={{
                          px: 2,
                          py: 1.5,
                          borderBottom: "1px solid #e5e7eb",
                          color: "text.secondary",
                        }}
                      >
                        Thu, 10 Jul, 2025
                      </Box>

                      <Box sx={{ p: 2 }}>
                        <Typography variant="caption" color="text.secondary">
                          9:22 AM
                        </Typography>

                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            mt: 0.5,
                          }}
                        >
                          <Box
                            sx={{
                              width: 20,
                              height: 20,
                              borderRadius: 1,
                              bgcolor: "#e5e7eb",
                            }}
                          />
                          <Typography
                            variant="subtitle1"
                            sx={{ fontWeight: 600 }}
                          >
                            Issues with reports #3
                          </Typography>
                        </Box>

                        <Box
                          sx={{
                            display: "flex",
                            gap: 2,
                            mt: 0.5,
                            flexWrap: "wrap",
                          }}
                        >
                          <Typography variant="body2" color="text.secondary">
                            Priority: Low
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Status: Open
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Group: Escalations
                          </Typography>
                        </Box>

                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 2,
                            mt: 0.5,
                            flexWrap: "wrap",
                          }}
                        >
                          <Typography variant="body2" color="text.secondary">
                            Agent responded: a month ago
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Overdue by: a month
                          </Typography>
                          <Chip
                            size="small"
                            label="Overdue"
                            color="error"
                            variant="outlined"
                          />
                        </Box>
                      </Box>
                    </TimelineContent>
                  </TimelineItem>
                </Timeline>
              )}
              {tab === 1 && (
                <Box sx={{ p: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    No tickets to show.
                  </Typography>
                </Box>
              )}
            </Paper>
          </Box>
        </div>
        <div className="h-full ">
          <Box
            sx={{
              position: "sticky",
              top: 0,

              height: "calc(100vh - 192px)",
              overflow: "hidden",
            }}
          >
            <Paper
              elevation={0}
              sx={{ p: 2, height: "100%", width: "100%", overflow: "hidden" }}
            >
              <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.5 }}>
                DETAILS
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Typography variant="caption" color="text.secondary">
                  Tags
                </Typography>
                <Box sx={{ mt: 0.5 }}>
                  <Button size="small" variant="text">
                    Add tags
                  </Button>
                </Box>
              </Box>
              <Divider />
              <Box sx={{ mt: 2 }}>
                <Typography variant="caption" color="text.secondary">
                  Emails
                </Typography>
                <List dense sx={{ py: 0 }}>
                  <ListItem disableGutters>
                    <ListItemIcon sx={{ minWidth: 32 }}>
                      <MailIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText
                      primaryTypographyProps={{ variant: "body2" }}
                      primary={email}
                    />
                  </ListItem>
                </List>
              </Box>
              <Box sx={{ mt: 1.5 }}>
                <Typography variant="caption" color="text.secondary">
                  Work Phone
                </Typography>
                <List dense sx={{ py: 0 }}>
                  <ListItem disableGutters>
                    <ListItemIcon sx={{ minWidth: 32 }}>
                      <PhoneIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText
                      primaryTypographyProps={{ variant: "body2" }}
                      primary={phone}
                    />
                  </ListItem>
                </List>
              </Box>
              <Box sx={{ mt: 1.5 }}>
                <Typography variant="caption" color="text.secondary">
                  Address
                </Typography>
                <List dense sx={{ py: 0 }}>
                  <ListItem disableGutters>
                    <ListItemIcon sx={{ minWidth: 32 }}>
                      <LocationIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText
                      primaryTypographyProps={{ variant: "body2" }}
                      primary={address}
                    />
                  </ListItem>
                </List>
              </Box>
            </Paper>
          </Box>
        </div>
      </div>
      <ConfirmationModal
        open={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={() => {}}
      />

      <EditUser isEdit={isEdit} close={() => setIsEdit(false)} />

      <ConvertProfile
        open={isConvertProfile}
        onClose={() => setIsConvertProfile(false)}
        onConfirm={() => {}}
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
