import { useState, useEffect } from "react";

import {
  Box,
  Button,
  IconButton,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Switch,
  styled,
} from "@mui/material";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import RefreshIcon from "@mui/icons-material/Refresh";

import { useNavigate } from "react-router-dom";

const tabs = [
  { label: "Agent Notifications", value: "1" },
  { label: "Requester Notifications", value: "2" },
  { label: "CC Notifications", value: "3" },
  { label: "Templates", value: "4" },
];

const EmailNotificationsPage = () => {
  const navigate = useNavigate();

  const [events, setEvents] = useState([
    { label: "New Ticket Created", active: true },
    { label: "Ticket Assigned to Group", active: false },
    { label: "Ticket Assigned to Agent", active: false },
    { label: "Requester Replies to Ticket", active: true },
    { label: "Ticket Unattended in Group", active: true },
    { label: "First Response SLA Violation", active: true },
    { label: "Resolution Time SLA Violation", active: true },
  ]);
  const [value, setValue] = useState("1");

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };
  const handleToggle = (index: number) => {
    const updated = [...events];
    updated[index].active = !updated[index].active;
    setEvents(updated);
  };

  const IconSwitch = styled(Switch)(({ theme }) => ({
    width: 46,
    height: 26,
    padding: 0,
    display: "flex",
    "& .MuiSwitch-switchBase": {
      padding: 2,
      "&.Mui-checked": {
        transform: "translateX(20px)",
        color: "#fff",
        "& + .MuiSwitch-track": {
          backgroundColor: "#22c55e", // green background when ON
          opacity: 1,
          border: 0,
        },
      },
    },
    "& .MuiSwitch-thumb": {
      backgroundColor: "#fff",
      width: 22,
      height: 22,
      borderRadius: "50%",
      boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
      position: "relative",
    },
    "& .MuiSwitch-track": {
      borderRadius: 26 / 2,
      backgroundColor: "#e4e6eb", // grey background when OFF
      opacity: 1,
      transition: theme.transitions.create(["background-color"], {
        duration: 300,
      }),
      position: "relative",
      "&:before, &:after": {
        content: '""',
        position: "absolute",
        top: "50%",
        transform: "translateY(-50%)",
        width: 14,
        height: 14,
        display: "inline-block",
        textAlign: "center",
        lineHeight: "14px",
        fontSize: 12,
        fontWeight: 700,
      },
      // Left check symbol
      "&:before": {
        left: 6,
        content: '"✓"',
        color: "#16a34a",
        opacity: 0.9,
      },
      // Right close symbol
      "&:after": {
        right: 6,
        content: '"✕"',
        color: "#7d8895",
        opacity: 0.9,
      },
    },
    // When checked, invert the symbol colors for better contrast
    "& .Mui-checked + .MuiSwitch-track": {
      "&:before": {
        color: "#ffffff",
      },
      "&:after": {
        color: "#e2e8f0",
      },
    },
  }));
  return (
    <Box
      sx={{
        height: "calc(100vh - 96px)",
        display: "grid",
        gridTemplateColumns: "3fr 1fr",
        overflow: "hidden",
      }}
    >
      {/* Left Content */}
      <Box sx={{ p: 1, display: "flex", flexDirection: "column", gap: 2 }}>
        {/* Header Section */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 1,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <IconButton onClick={() => navigate("/settings/team")}>
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h5" sx={{ fontWeight: 600, color: "#1a1a1a" }}>
              Email Notifications
            </Typography>
          </Box>
          <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
            {/* {agentListLoading ? (
              <CircularProgress size={16} />
            ) : ( */}
            <IconButton
              size="small"
              color="primary"
              // onClick={() => getAgentList()}
              // disabled={agentListLoading}
              sx={{ border: "1px solid #e0e0e0" }}
              aria-label="Refresh"
              title="Refresh"
            >
              <RefreshIcon fontSize="small" />
            </IconButton>
            {/* )} */}
          </Box>
        </Box>
        <TabContext value={value}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <TabList onChange={handleChange} aria-label="lab API tabs example">
              {tabs.map((tab) => (
                <Tab key={tab.value} label={tab.label} value={tab.value} />
              ))}
            </TabList>
          </Box>
          <TabPanel value="1">
            {" "}
            <List
              sx={{
                width: "100%",
                height: "100%",
                bgcolor: "background.paper",
                borderRadius: 2,
                boxShadow: 2,
              }}
            >
              {events.map((event, index) => (
                <ListItem
                  key={index}
                  secondaryAction={
                    <Button variant="outlined" size="small">
                      Edit
                    </Button>
                  }
                  sx={{
                    bgcolor: index % 2 === 1 ? "grey.50" : "white", // alternate row color
                    borderBottom: "1px solid #eee",
                  }}
                >
                  <IconSwitch
                    checked={event.active}
                    onChange={() => handleToggle(index)}
                    color="success"
                    sx={{ mr: 2 }}
                  />
                  <ListItemText
                    primary={event.label}
                    primaryTypographyProps={{
                      fontWeight: 500,
                      color: event.active ? "text.primary" : "text.secondary",
                    }}
                  />
                </ListItem>
              ))}
            </List>
          </TabPanel>
          <TabPanel value="2">
            {" "}
            <List
              sx={{
                width: "100%",
                height: "100%",
                bgcolor: "background.paper",
                borderRadius: 2,
                boxShadow: 2,
              }}
            >
              {events.map((event, index) => (
                <ListItem
                  key={index}
                  secondaryAction={
                    <Button variant="outlined" size="small">
                      Edit
                    </Button>
                  }
                  sx={{
                    bgcolor: index % 2 === 1 ? "grey.50" : "white", // alternate row color
                    borderBottom: "1px solid #eee",
                  }}
                >
                  <IconSwitch
                    checked={event.active}
                    onChange={() => handleToggle(index)}
                    color="success"
                    sx={{ mr: 2 }}
                  />
                  <ListItemText
                    primary={event.label}
                    primaryTypographyProps={{
                      fontWeight: 500,
                      color: event.active ? "text.primary" : "text.secondary",
                    }}
                  />
                </ListItem>
              ))}
            </List>
          </TabPanel>
          <TabPanel value="3">
            {" "}
            <List
              sx={{
                width: "100%",
                height: "100%",
                bgcolor: "background.paper",
                borderRadius: 2,
                boxShadow: 2,
              }}
            >
              {events.map((event, index) => (
                <ListItem
                  key={index}
                  secondaryAction={
                    <Button variant="outlined" size="small">
                      Edit
                    </Button>
                  }
                  sx={{
                    bgcolor: index % 2 === 1 ? "grey.50" : "white", // alternate row color
                    borderBottom: "1px solid #eee",
                  }}
                >
                  <IconSwitch
                    checked={event.active}
                    onChange={() => handleToggle(index)}
                    color="success"
                    sx={{ mr: 2 }}
                  />
                  <ListItemText
                    primary={event.label}
                    primaryTypographyProps={{
                      fontWeight: 500,
                      color: event.active ? "text.primary" : "text.secondary",
                    }}
                  />
                </ListItem>
              ))}
            </List>
          </TabPanel>
          <TabPanel value="4">
            {" "}
            <List
              sx={{
                width: "100%",
                height: "100%",
                bgcolor: "background.paper",
                borderRadius: 2,
                boxShadow: 2,
              }}
            >
              {events.map((event, index) => (
                <ListItem
                  key={index}
                  secondaryAction={
                    <Button variant="outlined" size="small">
                      Edit
                    </Button>
                  }
                  sx={{
                    bgcolor: index % 2 === 1 ? "grey.50" : "white", // alternate row color
                    borderBottom: "1px solid #eee",
                  }}
                >
                  <IconSwitch
                    checked={event.active}
                    onChange={() => handleToggle(index)}
                    color="success"
                    sx={{ mr: 2 }}
                  />
                  <ListItemText
                    primary={event.label}
                    primaryTypographyProps={{
                      fontWeight: 500,
                      color: event.active ? "text.primary" : "text.secondary",
                    }}
                  />
                </ListItem>
              ))}
            </List>
          </TabPanel>
        </TabContext>

        {/* </Card> */}
      </Box>

      {/* Right Sidebar */}
      <Box
        sx={{
          maxHeight: "calc(100vh - 100px)",
          overflowY: "auto",
          p: 3,
          bgcolor: "#f8f9fa",
          borderLeft: "1px solid #e0e0e0",
        }}
      >
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <Card sx={{ boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
            <CardContent>
              <Typography
                variant="h6"
                sx={{ fontWeight: 600, mb: 2, color: "#1a1a1a" }}
              >
                Email Notifications Overview
              </Typography>
              <Typography
                variant="body2"
                sx={{ lineHeight: 1.6, color: "#65676b" }}
              >
                Email notifications keep your team and customers informed about
                ticket updates, SLA breaches, and important activities. Properly
                configuring notifications ensures that the right people are
                alerted at the right time, improving response speed and customer
                satisfaction.
              </Typography>
            </CardContent>
          </Card>

          {/* Notification Types */}
          <Card sx={{ boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
            <CardContent>
              <Typography
                variant="h6"
                sx={{ fontWeight: 600, mb: 2, color: "#1a1a1a" }}
              >
                Notification Types
              </Typography>
              <Typography
                variant="body2"
                sx={{ lineHeight: 1.6, color: "#65676b" }}
              >
                Notifications can be triggered for different events, such as{" "}
                <Box
                  component="span"
                  sx={{ fontWeight: 600, color: "#1877f2" }}
                >
                  new tickets
                </Box>
                ,{" "}
                <Box
                  component="span"
                  sx={{ fontWeight: 600, color: "#1877f2" }}
                >
                  ticket assignments
                </Box>
                ,{" "}
                <Box
                  component="span"
                  sx={{ fontWeight: 600, color: "#1877f2" }}
                >
                  customer replies
                </Box>
                , and{" "}
                <Box
                  component="span"
                  sx={{ fontWeight: 600, color: "#1877f2" }}
                >
                  SLA violations
                </Box>
                . Each type can be customized to reach the appropriate users.
              </Typography>
            </CardContent>
          </Card>

          {/* Configuration Options */}
          <Card sx={{ boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
            <CardContent>
              <Typography
                variant="h6"
                sx={{ fontWeight: 600, mb: 2, color: "#1a1a1a" }}
              >
                Configuration Options
              </Typography>
              <Typography
                variant="body2"
                sx={{ lineHeight: 1.6, color: "#65676b", mb: 2 }}
              >
                You can fine-tune who receives notifications and under what
                conditions.
              </Typography>

              <Typography
                variant="subtitle2"
                sx={{ fontWeight: 600, color: "#1a1a1a", mb: 1 }}
              >
                Common Settings:
              </Typography>
              <Box component="ul" sx={{ pl: 2, m: 0, "& li": { mb: 1 } }}>
                <Typography
                  component="li"
                  variant="body2"
                  sx={{ lineHeight: 1.6, color: "#65676b" }}
                >
                  <Box
                    component="span"
                    sx={{ fontWeight: 600, color: "#1877f2" }}
                  >
                    Recipients:
                  </Box>{" "}
                  Decide whether notifications go to agents, groups, or
                  requesters.
                </Typography>
                <Typography
                  component="li"
                  variant="body2"
                  sx={{ lineHeight: 1.6, color: "#65676b" }}
                >
                  <Box
                    component="span"
                    sx={{ fontWeight: 600, color: "#1877f2" }}
                  >
                    Frequency:
                  </Box>{" "}
                  Choose between instant updates, batched digests, or daily
                  summaries.
                </Typography>
                <Typography
                  component="li"
                  variant="body2"
                  sx={{ lineHeight: 1.6, color: "#65676b" }}
                >
                  <Box
                    component="span"
                    sx={{ fontWeight: 600, color: "#1877f2" }}
                  >
                    Templates:
                  </Box>{" "}
                  Customize the content and design of notification emails for
                  consistent branding.
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Box>
  );
};

export default EmailNotificationsPage;
