import React, { useState } from "react";
import {
  Avatar,
  Box,
  Chip,
  Paper,
  Typography,
  Card,
  CardContent,
  Stack,
  Divider,
  Button,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Collapse,
} from "@mui/material";
import {
  timelineOppositeContentClasses,
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineDot,
  TimelineContent,
} from "@mui/lab";
import { UserProfileInfo, TicketItem } from "./types";
import WorkIcon from "@mui/icons-material/Work";
import BusinessIcon from "@mui/icons-material/Business";
import ScheduleIcon from "@mui/icons-material/Schedule";
import PriorityIcon from "@mui/icons-material/PriorityHigh";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import EmailIcon from "@mui/icons-material/Email";
import EditIcon from "@mui/icons-material/Edit";
import NotificationsIcon from "@mui/icons-material/Notifications";
import AssignmentIcon from "@mui/icons-material/Assignment";
import BugReportIcon from "@mui/icons-material/BugReport";
import SupportIcon from "@mui/icons-material/Support";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import DescriptionIcon from "@mui/icons-material/Description";
import PhoneIcon from "@mui/icons-material/Phone";
import LocationIcon from "@mui/icons-material/LocationOn";
import SecurityIcon from "@mui/icons-material/Security";
import GroupIcon from "@mui/icons-material/Group";
import AppsIcon from "@mui/icons-material/Apps";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import CustomSideBarPanel from "../../../components/reusable/CustomSideBarPanel";
import ContactDetails from "./ContactDetails";

type OverviewTabProps = {
  user: UserProfileInfo & { initials: string };
  ticketsSample?: TicketItem[];
};

const OverviewTab: React.FC<OverviewTabProps> = ({ user }) => {
  const [expandedSections, setExpandedSections] = useState({
    userInfo: true,
    apps: true,
  });
  const [metricOpen, setMetricOpen] = useState<null | string>(null);
  const [editInfoOpen, setEditInfoOpen] = useState(false);

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  return (
    <Box sx={{ display: "flex", height: "100%", bgcolor: "#f8f9fa" }}>
      {/* Left Sidebar */}
      <Box
        sx={{ width: 320, bgcolor: "white", borderRight: "1px solid #e8eaed" }}
      >
        <Box sx={{ p: 3, borderBottom: "1px solid #e8eaed" }}>
          <Typography
            variant="h6"
            sx={{ fontWeight: 600, color: "#202124", mb: 2 }}
          >
            ADMIN
          </Typography>

          {/* User Info */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
            <Avatar sx={{ width: 48, height: 48, bgcolor: "#5f6368" }}>
              {user.initials}
            </Avatar>
            <Box>
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: 600, color: "#202124" }}
              >
                {user.username}
              </Typography>
              <Typography variant="body2" sx={{ color: "#5f6368" }}>
                {user.email}
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Profile Actions styled list - omitted as per latest change */}
      </Box>

      {/* Main Content Area */}
      <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {/* Content */}
        <Box sx={{ flex: 1, p: 3, overflow: "auto" }}>
          {/* Profile header card with edit */}
          <Paper
            elevation={0}
            sx={{
              p: 3,
              mb: 3,
              bgcolor: "white",
              borderRadius: 2,
              border: "1px solid #e8eaed",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
              <Avatar
                sx={{
                  width: 80,
                  height: 80,
                  bgcolor: "#4285f4",
                  fontSize: 32,
                  fontWeight: "bold",
                  border: "4px solid #e8f0fe",
                }}
              >
                {user.initials}
              </Avatar>
              <Box sx={{ flex: 1 }}>
                <Typography
                  variant="h4"
                  sx={{ fontWeight: 600, color: "#202124", mb: 1 }}
                >
                  {user.username}
                </Typography>
                <Stack direction="row" spacing={2} sx={{ mb: 1 }}>
                  <Chip
                    icon={<WorkIcon />}
                    label={user.role}
                    size="medium"
                    sx={{
                      bgcolor: "#e8f0fe",
                      color: "#1a73e8",
                      fontWeight: 500,
                      "& .MuiChip-icon": { color: "#1a73e8" },
                    }}
                  />
                  <Chip
                    icon={<BusinessIcon />}
                    label={user.company}
                    variant="outlined"
                    size="medium"
                    sx={{
                      borderColor: "#dadce0",
                      color: "#5f6368",
                      fontWeight: 500,
                      "& .MuiChip-icon": { color: "#5f6368" },
                    }}
                  />
                </Stack>
                <Typography variant="body1" sx={{ color: "#5f6368" }}>
                  {user.email} • {user.phone}
                </Typography>
              </Box>
              <Button
                variant="outlined"
                size="small"
                onClick={() => setEditInfoOpen(true)}
              >
                Edit info
              </Button>
            </Box>
          </Paper>

          {/* Ticket metrics */}
          <Paper
            elevation={0}
            sx={{
              p: 3,
              bgcolor: "white",
              borderRadius: 2,
              border: "1px solid #e8eaed",
            }}
          >
            <Typography
              variant="h6"
              sx={{ fontWeight: 600, color: "#202124", mb: 2 }}
            >
              Ticket metrics
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 4 }}>
              <Box
                sx={{
                  textAlign: "center",
                  p: 1,
                  borderRadius: 2,
                  cursor: "pointer",
                  "&:hover": { bgcolor: "action.hover" },
                }}
                onClick={() => setMetricOpen("total")}
              >
                <AssignmentIcon
                  sx={{ fontSize: 32, color: "#5f6368", mb: 1 }}
                />
                <Typography variant="body2" sx={{ color: "#5f6368" }}>
                  Total Tickets
                </Typography>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 600, color: "#202124" }}
                >
                  47
                </Typography>
              </Box>
              <Box
                sx={{
                  textAlign: "center",
                  p: 1,
                  borderRadius: 2,
                  cursor: "pointer",
                  "&:hover": { bgcolor: "action.hover" },
                }}
                onClick={() => setMetricOpen("open")}
              >
                <BugReportIcon sx={{ fontSize: 32, color: "#5f6368", mb: 1 }} />
                <Typography variant="body2" sx={{ color: "#5f6368" }}>
                  Open Tickets
                </Typography>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 600, color: "#202124" }}
                >
                  12
                </Typography>
              </Box>
              <Box
                sx={{
                  textAlign: "center",
                  p: 1,
                  borderRadius: 2,
                  cursor: "pointer",
                  "&:hover": { bgcolor: "action.hover" },
                }}
                onClick={() => setMetricOpen("resolved")}
              >
                <SupportIcon sx={{ fontSize: 32, color: "#5f6368", mb: 1 }} />
                <Typography variant="body2" sx={{ color: "#5f6368" }}>
                  Resolved
                </Typography>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 600, color: "#202124" }}
                >
                  35
                </Typography>
              </Box>
              <Box
                sx={{
                  textAlign: "center",
                  p: 1,
                  borderRadius: 2,
                  cursor: "pointer",
                  "&:hover": { bgcolor: "action.hover" },
                }}
                onClick={() => setMetricOpen("overdue")}
              >
                <TrendingUpIcon
                  sx={{ fontSize: 32, color: "#5f6368", mb: 1 }}
                />
                <Typography variant="body2" sx={{ color: "#5f6368" }}>
                  Overdue
                </Typography>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 600, color: "#202124" }}
                >
                  3
                </Typography>
              </Box>
            </Box>
          </Paper>

          {/* User Information */}
          <Paper
            elevation={0}
            sx={{
              p: 3,
              mb: 3,
              bgcolor: "white",
              borderRadius: 2,
              border: "1px solid #e8eaed",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                cursor: "pointer",
                mb: 2,
              }}
              onClick={() => toggleSection("userInfo")}
            >
              <Typography
                variant="h6"
                sx={{ fontWeight: 600, color: "#202124" }}
              >
                User information
              </Typography>
              {expandedSections.userInfo ? (
                <ExpandLessIcon />
              ) : (
                <ExpandMoreIcon />
              )}
            </Box>

            <Collapse in={expandedSections.userInfo}>
              <Stack spacing={2}>
                <Box>
                  <Typography
                    variant="body2"
                    sx={{ color: "#5f6368", mb: 0.5 }}
                  >
                    Secondary email
                  </Typography>
                  <Button
                    variant="text"
                    sx={{
                      color: "#1a73e8",
                      textTransform: "none",
                      fontWeight: 500,
                      p: 0,
                      minWidth: "auto",
                      "&:hover": { bgcolor: "transparent" },
                    }}
                    onClick={(e: any) => {
                      e.stopPropagation();
                      // setAnchorEl(e.currentTarget); // This state was removed, so this line is removed.
                    }}
                  >
                    Add a secondary email
                  </Button>
                  {/* CustomDataUpdatePopover was removed, so this component is removed. */}
                </Box>

                <Box>
                  <Typography
                    variant="body2"
                    sx={{ color: "#5f6368", mb: 0.5 }}
                  >
                    Phone number | Work
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#202124" }}>
                    {user.phone}
                  </Typography>
                </Box>
              </Stack>
            </Collapse>
          </Paper>

          {/* Apps */}
          <Paper
            elevation={0}
            sx={{
              p: 3,
              bgcolor: "white",
              borderRadius: 2,
              border: "1px solid #e8eaed",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                cursor: "pointer",
                mb: 2,
              }}
              onClick={() => toggleSection("apps")}
            >
              <Typography
                variant="h6"
                sx={{ fontWeight: 600, color: "#202124" }}
              >
                Apps
              </Typography>
              {expandedSections.apps ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </Box>

            <Collapse in={expandedSections.apps}>
              <Stack spacing={2}>
                <Typography
                  variant="body2"
                  sx={{ color: "#202124", fontWeight: 500 }}
                >
                  Ticket Management System
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: "#202124", fontWeight: 500 }}
                >
                  Support Portal
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: "#202124", fontWeight: 500 }}
                >
                  Knowledge Base
                </Typography>
              </Stack>
            </Collapse>
          </Paper>
        </Box>
      </Box>

      {/* Popovers */}
      <CustomSideBarPanel
        open={!!metricOpen}
        close={() => setMetricOpen(null)}
        title={
          metricOpen
            ? `${metricOpen[0].toUpperCase()}${metricOpen.slice(1)} tickets`
            : "Tickets"
        }
        width={900}
      >
        <Box sx={{ p: 2 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Preview of {metricOpen} tickets. Use this to show a small list or
            quick filters.
          </Typography>
          <Button
            variant="contained"
            size="small"
            onClick={() => setMetricOpen(null)}
          >
            DONE
          </Button>
        </Box>
      </CustomSideBarPanel>

      <CustomSideBarPanel
        open={editInfoOpen}
        close={() => setEditInfoOpen(false)}
        title={"Edit profile info"}
        width={520}
      >
        <Box sx={{ p: 2 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Quick edit of user information.
          </Typography>
          <Button
            variant="contained"
            size="small"
            onClick={() => setEditInfoOpen(false)}
          >
            SAVE
          </Button>
          <Box sx={{ textAlign: "right", mt: 2 }}>
            <Button variant="text" onClick={() => setEditInfoOpen(false)}>
              DONE
            </Button>
          </Box>
        </Box>
      </CustomSideBarPanel>
    </Box>
  );
};

export default OverviewTab;
