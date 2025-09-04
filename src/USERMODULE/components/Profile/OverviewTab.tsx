import React from "react";
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
import ContactDetails from "./ContactDetails";

type OverviewTabProps = {
  user: UserProfileInfo & { initials: string };
  ticketsSample?: TicketItem[];
};

const OverviewTab: React.FC<OverviewTabProps> = ({ user }) => {
  const [expandedSections, setExpandedSections] = React.useState({
    userInfo: true,
    apps: true,
  });

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

          <Chip
            label="Active"
            size="small"
            sx={{
              bgcolor: "#e6f4ea",
              color: "#137333",
              fontWeight: 600,
              mb: 2,
            }}
          />

          <Typography variant="body2" sx={{ color: "#5f6368", mb: 1 }}>
            Last sign in: 13 minutes ago
          </Typography>
          <Typography variant="body2" sx={{ color: "#5f6368", mb: 1 }}>
            Created: Aug 23, 2024
          </Typography>
          <Typography variant="body2" sx={{ color: "#5f6368", mb: 2 }}>
            Organizational unit: {user.company}
          </Typography>
        </Box>
      </Box>

      {/* Main Content Area */}
      <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {/* Content */}
        <Box sx={{ flex: 1, p: 3, overflow: "auto" }}>
          {/* Alerts Section */}
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
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <NotificationsIcon sx={{ color: "#5f6368" }} />
                <Typography
                  variant="body1"
                  sx={{ fontWeight: 500, color: "#202124" }}
                >
                  Alerts in the last 7 days for {user.username}
                </Typography>
              </Box>
              <Button
                variant="text"
                sx={{
                  color: "#1a73e8",
                  textTransform: "none",
                  fontWeight: 500,
                  "&:hover": { bgcolor: "#e8f0fe" },
                }}
              >
                View alerts
              </Button>
            </Box>
          </Paper>

          {/* Ticket Usage */}
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
            <Typography
              variant="h6"
              sx={{ fontWeight: 600, color: "#202124", mb: 3 }}
            >
              Ticket usage and statistics for {user.username}
            </Typography>

            <Box sx={{ display: "flex", alignItems: "center", gap: 4, mb: 3 }}>
              <Box sx={{ textAlign: "center" }}>
                <AssignmentIcon
                  sx={{ fontSize: 32, color: "#5f6368", mb: 1 }}
                />
                <Typography variant="body2" sx={{ color: "#5f6368", mb: 0.5 }}>
                  Total Tickets
                </Typography>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 600, color: "#202124" }}
                >
                  47
                </Typography>
              </Box>

              <Divider orientation="vertical" flexItem />

              <Box sx={{ textAlign: "center" }}>
                <BugReportIcon sx={{ fontSize: 32, color: "#5f6368", mb: 1 }} />
                <Typography variant="body2" sx={{ color: "#5f6368", mb: 0.5 }}>
                  Open Tickets
                </Typography>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 600, color: "#202124" }}
                >
                  12
                </Typography>
              </Box>

              <Divider orientation="vertical" flexItem />

              <Box sx={{ textAlign: "center" }}>
                <SupportIcon sx={{ fontSize: 32, color: "#5f6368", mb: 1 }} />
                <Typography variant="body2" sx={{ color: "#5f6368", mb: 0.5 }}>
                  Resolved
                </Typography>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 600, color: "#202124" }}
                >
                  35
                </Typography>
              </Box>

              <Divider orientation="vertical" flexItem />

              <Box sx={{ textAlign: "center" }}>
                <TrendingUpIcon
                  sx={{ fontSize: 32, color: "#5f6368", mb: 1 }}
                />
                <Typography variant="body2" sx={{ color: "#5f6368", mb: 0.5 }}>
                  Overdue
                </Typography>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 600, color: "#202124" }}
                >
                  3
                </Typography>
              </Box>

              <Divider orientation="vertical" flexItem />

              <Box sx={{ textAlign: "center" }}>
                <DescriptionIcon
                  sx={{ fontSize: 32, color: "#5f6368", mb: 1 }}
                />
                <Typography variant="body2" sx={{ color: "#5f6368", mb: 0.5 }}>
                  Avg Response
                </Typography>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 600, color: "#202124" }}
                >
                  2.3h
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: "flex", gap: 4 }}>
              <Box>
                <Typography variant="body2" sx={{ color: "#5f6368", mb: 0.5 }}>
                  Priority level
                </Typography>
                <Typography variant="body2" sx={{ color: "#202124" }}>
                  Standard
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
                  >
                    Add a secondary email
                  </Button>
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
    </Box>
  );
};

export default OverviewTab;
