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
  CircularProgress,
} from "@mui/material";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import RefreshIcon from "@mui/icons-material/Refresh";

import { useNavigate } from "react-router-dom";
import {
  useGetEmailNotificationsSettingsQuery,
  useUpdateEmailNotificationsSettingStatusMutation,
} from "../../../services/settingServices";
import { useToast } from "../../../hooks/useToast";

const tabs = [
  { label: "Agent Notifications", value: "1" },
  { label: "CC Notifications", value: "2" },
  { label: "Customer Notifications", value: "3" },
];

const EmailNotificationsPage = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { data: listSettings, isLoading: listSettingsLoading } =
    useGetEmailNotificationsSettingsQuery({});
  const [updateEmailNotificationsSettingStatus, { isLoading: updateLoading }] =
    useUpdateEmailNotificationsSettingStatusMutation();
  const [events, setEvents] = useState<any>();
  const [value, setValue] = useState("1");

  useEffect(() => {
    if (!listSettings) return;
    setEvents(listSettings);
  }, [listSettings]);

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };
  const handleToggle = (key: any, status: any) => {
    const payload = {
      key,

      type: status ? "disable" : "enable",
    };

    updateEmailNotificationsSettingStatus(payload).then((res: any) => {
      if (res?.data?.type === "error") {
        showToast(res?.data?.message, "error");
        return;
      }

      if (res?.data?.type === "success") {
        setEvents((prev: any) => {
          if (!prev) return prev;
          const toggleInList = (list: any[]) =>
            Array.isArray(list)
              ? list.map((item) =>
                  item?.key === key ? { ...item, status: !status } : item
                )
              : list;
          return {
            ...prev,
            agentNotification: toggleInList(prev.agentNotification),
            ccNotification: toggleInList(prev.ccNotification),
            customerNotification: toggleInList(prev.customerNotification),
          };
        });
        showToast(res?.data?.message, "success");
      }
    });
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
          backgroundColor: "#22c55e", 
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
      backgroundColor: "#e4e6eb", 
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
            <IconButton onClick={() => navigate("/settings/emails")}>
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
          <div className="w-full max-h-[calc(100vh-240px)]  overflow-y-auto  custom-scrollbar">
            {listSettingsLoading ? (
              <div className="w-full h-80 flex justify-center items-center">
                <CircularProgress />
              </div>
            ) : (
              <>
                <TabPanel value="1" sx={{ p: 0 }}>
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
                    {events?.agentNotification.map(
                      (event: any, index: number) => (
                        <ListItem
                          key={event?.key}
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
                            bgcolor: index % 2 === 1 ? "grey.50" : "white",
                            borderBottom: "1px solid #eee",
                          }}
                        >
                          <IconSwitch
                            checked={event.status}
                            onChange={() =>
                              handleToggle(event.key, event.status)
                            }
                            color="success"
                            sx={{ mr: 2 }}
                          />
                          <ListItemText
                            primary={event.title}
                            primaryTypographyProps={{
                              fontWeight: 600,
                              color: event.active
                                ? "text.primary"
                                : "text.secondary",
                            }}
                          />
                        </ListItem>
                      )
                    )}
                  </List>
                </TabPanel>
                <TabPanel value="2" sx={{ p: 0 }}>
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
                    {events?.ccNotification.map((event: any, index: number) => (
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
                          checked={event.status}
                          onChange={() =>
                            handleToggle(event.key, event?.status)
                          }
                          color="success"
                          sx={{ mr: 2 }}
                        />
                        <ListItemText
                          primary={event.title}
                          primaryTypographyProps={{
                            fontWeight: 600,
                            color: event.status
                              ? "text.primary"
                              : "text.secondary",
                          }}
                        />
                      </ListItem>
                    ))}
                  </List>
                </TabPanel>
                <TabPanel value="3" sx={{ p: 0 }}>
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
                    {events?.customerNotification.map(
                      (event: any, index: number) => (
                        <ListItem
                          key={event?.key}
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
                            checked={event.status}
                            onChange={() =>
                              handleToggle(event?.key, event?.status)
                            }
                            color="success"
                            sx={{ mr: 2 }}
                          />
                          <ListItemText
                            primary={event.title}
                            primaryTypographyProps={{
                              fontWeight: 600,
                              color: event.status
                                ? "text.primary"
                                : "text.secondary",
                            }}
                          />
                        </ListItem>
                      )
                    )}
                  </List>
                </TabPanel>
              </>
            )}
          </div>
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
            className="custom-scrollbar"
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
