import { useState, useEffect } from "react";

import {
  Box,
  Button,
  IconButton,
  Typography,
  Card,
  CardContent,
  List,
  ListItem,
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
import TicketCreationAutomation from "./automationPages/TicketCreationAutomation";

const tabs = [
  { label: "Ticket Creation", value: "1" },
  { label: "Ticket Updates", value: "2" },
  { label: "Hourly Triggers", value: "3" },
];

const AutomationMaster = () => {
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
        color: "#e1e7ee",
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
      <Box
        sx={{
          p: 1,
          display: "flex",
          flexDirection: "column",
          gap: 2,
          height: "100%",
          minHeight: 0,
          overflow: "hidden",
        }}
      >
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
            <IconButton onClick={() => navigate("/settings/tickets-workflows")}>
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h5" sx={{ fontWeight: 600, color: "#1a1a1a" }}>
              Automations
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
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              flex: 1,
              minHeight: 0,
              overflow: "hidden",
            }}
          >
            <Box
              sx={{
                borderBottom: 1,
                borderColor: "divider",
                display: "flex",
                alignItems: "center",
                gap: 2,
              }}
            >
              <Typography variant="subtitle1">Rules that run on:</Typography>
              <TabList
                onChange={handleChange}
                aria-label="lab API tabs example"
              >
                {tabs.map((tab) => (
                  <Tab key={tab.value} label={tab.label} value={tab.value} />
                ))}
              </TabList>
            </Box>
            <Box
              sx={{ flex: 1, minHeight: 0, overflow: "auto", p: 2 }}
              className="custom-scrollbar"
            >
              <TabPanel value="1" sx={{ p: 0, height: "100%" }}>
                <TicketCreationAutomation />
              </TabPanel>
              <TabPanel value="2" sx={{ p: 0, height: "100%" }}>
                {" "}
                <List
                  sx={{
                    width: "100%",
                    height: "auto",
                    bgcolor: "background.paper",
                    borderRadius: 2,
                    boxShadow: 2,
                  }}
                >
                  {events.map((event, index) => (
                    <ListItem
                      key={index}
                      secondaryAction={
                        <Button
                          variant="text"
                          size="small"
                          sx={{ fontWeight: 600 }}
                          onClick={() => {
                            navigate(`/create-email-notification`, {
                              state: { event },
                            });
                          }}
                        >
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
                          fontWeight: 600,
                          color: event.active
                            ? "text.primary"
                            : "text.secondary",
                        }}
                      />
                    </ListItem>
                  ))}
                </List>
              </TabPanel>
              <TabPanel value="3" sx={{ p: 0, height: "100%" }}>
                {" "}
                <List
                  sx={{
                    width: "100%",
                    height: "auto",
                    bgcolor: "background.paper",
                    borderRadius: 2,
                    boxShadow: 2,
                  }}
                >
                  {events.map((event, index) => (
                    <ListItem
                      key={index}
                      secondaryAction={
                        <Button
                          variant="text"
                          size="small"
                          sx={{ fontWeight: 600 }}
                          onClick={() => {
                            navigate(`/create-email-notification`, {
                              state: { event },
                            });
                          }}
                        >
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
                          fontWeight: 600,
                          color: event.active
                            ? "text.primary"
                            : "text.secondary",
                        }}
                      />
                    </ListItem>
                  ))}
                </List>
              </TabPanel>
            </Box>
          </Box>
        </TabContext>

        {/* </Card> */}
      </Box>

      {/* Right Sidebar */}
      <Box
        sx={{
          maxHeight: "calc(100vh - 100px)",
          overflowY: "auto",
          p: 2,
          bgcolor: "#f8f9fa",
          borderLeft: "1px solid #e0e0e0",
        }}
        className="custom-scrollbar"
      >
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <Card sx={{ boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
            <CardContent>
              <Typography
                variant="h6"
                sx={{ fontWeight: 600, mb: 2, color: "#1a1a1a" }}
              >
                Rules that run on ticket creation
              </Typography>
              <Typography
                variant="body2"
                sx={{ lineHeight: 1.6, color: "#65676b" }}
              >
                These rules run as soon as a ticket is created. They help keep
                customers updated, triage issues, etc. Please note that the
                order of the rules is important, as they run one after the
                other.
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
                Rules that run on ticket updates
              </Typography>
              <Typography
                variant="body2"
                sx={{ lineHeight: 1.6, color: "#65676b" }}
              >
                These automations constantly monitor your tickets for updates.
                Based on any action that an agent or your customers take, you
                can automate subsequent work to reduce manual effort.
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
                Rules that run on hourly triggers
              </Typography>
              <Typography
                variant="body2"
                sx={{ lineHeight: 1.6, color: "#65676b", mb: 2 }}
              >
                These automations scan tickets every hour. They can check for
                the ticket's age and how long it has been since it was updated.
                You can use them to send reminders and ensure that nothing slips
                through the crac
              </Typography>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Box>
  );
};

export default AutomationMaster;
