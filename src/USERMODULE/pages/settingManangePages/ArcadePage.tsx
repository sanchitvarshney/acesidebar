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
  TextField,
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
  { label: "Points", value: "1" },
  { label: "Quests", value: "2" },
];
const dummyData = [
  {
    id: 1,
    title: "Earn Customer Love!",
    description:
      "Resolve 10 tickets in a week with Customer Satisfaction rating of Awesome and unlock the 'Heart' badge and get 200 Bonus points!",
    badgeName: "Heart",
  },
  {
    id: 2,
    title: "Share Knowledge!",
    description:
      "Publish 5 Solution articles in a week to unlock the 'Writer' badge and win 250 Bonus points!",
    badgeName: "Writer",
    points: 250,
  },
  {
    id: 3,
    title: "Go Social!",
    description:
      "Resolve 25 tickets from Twitter or Facebook in a week to unlock the 'Social Supporter' badge and win 150 Bonus points!",
    badgeName: "Social Supporter",
  },
  {
    id: 4,
    title: "Be a Knowledge Guru!",
    description:
      "Publish 15 Solution articles in a month to unlock the 'Super Writer' badge and earn 500 Bonus Points!",
    badgeName: "Super Writer",
  
  },
  {
    id: 5,
    title: "Show them you can write!",
    description:
      "Publish 10 solution articles with more than 50 customer likes and unlock the 'Best Seller' badge and earn 500 Bonus points!",
    badgeName: "Best Seller",
  
  },
];

const ArcadePage = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [events, setEvents] = useState<any>();
  const [value, setValue] = useState("1");



  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };
  const handleToggle = (key: any, status: any) => {
    const payload = {
      key,

      type: status ? "disable" : "enable",
    };


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
            <IconButton onClick={() => navigate("/settings/agents-productivity")}>
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h5" sx={{ fontWeight: 600, color: "#1a1a1a" }}>
              Arcade Settings
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
            {/* {listSettingsLoading ? (
              <div className="w-full h-80 flex justify-center items-center">
                <CircularProgress />
              </div>
            ) : ( */}
              <>
                <TabPanel
                  value="1"
                  sx={{
                    px: 1,
                    py: 0,
                    gap: 4,
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <Typography variant="body1">Award points</Typography>
                  <div className="grid grid-cols-4 gap-4  ">
                    <span>When agent resolves a ticket:</span>
                    <div className="flex flex-col item-center">
                      <span>{`Fast (< 1 hour) `}</span>
                      <div className="flex items-center gap-2">
                        <TextField
                          size="small"
                          sx={{ mt: 1, width: 100, textAlign: "end" }}
                          fullWidth
                          placeholder="Points"
                          variant="outlined"
                          value={events?.awardPoints}
                        />
                        <span>pts</span>
                      </div>
                    </div>
                    <div className="flex flex-col item-center">
                      <span>{`On time (Within SLA)`}</span>
                      <div className="flex items-center gap-2">
                        <TextField
                          size="small"
                          sx={{ mt: 1, width: 100, textAlign: "end" }}
                          fullWidth
                          placeholder="Points"
                          variant="outlined"
                          value={events?.awardPoints}
                        />
                        <span>pts</span>
                      </div>
                    </div>
                    <div className="flex flex-col item-center">
                      <span>{`Late (Overdue)`}</span>
                      <div className="flex items-center gap-2">
                        <TextField
                          size="small"
                          sx={{ mt: 1, width: 100, textAlign: "end" }}
                          fullWidth
                          placeholder="Points"
                          variant="outlined"
                          value={events?.awardPoints}
                        />
                        <span>pts</span>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-4 gap-4  ">
                    <span>Bonus points for:</span>
                    <div className="flex flex-col item-center">
                      <span>First Call Resolution</span>
                      <div className="flex items-center gap-2">
                        <TextField
                          size="small"
                          sx={{ mt: 1, width: 100, textAlign: "end" }}
                          fullWidth
                          placeholder="Points"
                          variant="outlined"
                          value={events?.awardPoints}
                        />
                        <span>pts</span>
                      </div>
                    </div>
                    <div className="flex flex-col item-center">
                      <span>Happy Customer</span>
                      <div className="flex items-center gap-2">
                        <TextField
                          size="small"
                          sx={{ mt: 1, width: 100, textAlign: "end" }}
                          fullWidth
                          placeholder="Points"
                          variant="outlined"
                          value={events?.awardPoints}
                        />
                        <span>pts</span>
                      </div>
                    </div>
                    <div className="flex flex-col item-center">
                      <span>Unhappy Customer</span>
                      <div className="flex items-center gap-2">
                        <TextField
                          size="small"
                          sx={{ mt: 1, width: 100, textAlign: "end" }}
                          fullWidth
                          placeholder="Points"
                          variant="outlined"
                          value={events?.awardPoints}
                        />
                        <span>pts</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <Typography variant="body1">Agent levels</Typography>
                    <Typography variant="subtitle2">
                      Set points to be achieved by an agent to reach a level
                    </Typography>
                  </div>
                  <div className="grid grid-cols-6 gap-4  ">
                    <div className="flex flex-col item-center">
                      <span>Beginner</span>

                      <TextField
                        size="small"
                        sx={{ mt: 1, width: 100, textAlign: "end" }}
                        fullWidth
                        placeholder="Points"
                        variant="outlined"
                        value={events?.awardPoints}
                      />
                    </div>
                    <div className="flex flex-col item-center">
                      <span>Intermediate</span>

                      <TextField
                        size="small"
                        sx={{ mt: 1, width: 100, textAlign: "end" }}
                        fullWidth
                        placeholder="Points"
                        variant="outlined"
                        value={events?.awardPoints}
                      />
                    </div>
                    <div className="flex flex-col item-center">
                      <span>Professional</span>

                      <TextField
                        size="small"
                        sx={{ mt: 1, width: 100, textAlign: "end" }}
                        fullWidth
                        placeholder="Points"
                        variant="outlined"
                        value={events?.awardPoints}
                      />
                    </div>

                    <div className="flex flex-col item-center">
                      <span>Expert</span>

                      <TextField
                        size="small"
                        sx={{ mt: 1, width: 100, textAlign: "end" }}
                        fullWidth
                        placeholder="Points"
                        variant="outlined"
                        value={events?.awardPoints}
                      />
                    </div>
                    <div className="flex flex-col item-center">
                      <span>Master</span>

                      <TextField
                        size="small"
                        sx={{ mt: 1, width: 100, textAlign: "end" }}
                        fullWidth
                        placeholder="Points"
                        variant="outlined"
                        value={events?.awardPoints}
                      />
                    </div>
                    <div className="flex flex-col item-center">
                      <span>Guru</span>

                      <TextField
                        size="small"
                        sx={{ mt: 1, width: 100, textAlign: "end" }}
                        fullWidth
                        placeholder="Points"
                        variant="outlined"
                        value={events?.awardPoints}
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 px-4 mt-4">
                    <Button
                      variant="text"
                      sx={{
                        fontWeight: 600,
                      }}
                    >
                      Cancel
                    </Button>
                    <Button variant="contained">Save</Button>
                  </div>
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
                    {dummyData.map(
                      (event: any, index: number) => (
                        <ListItem
                          key={event?.id}
                          secondaryAction={
                            <Button
                              variant="text"
                              size="small"
                              color="error"
                              sx={{ fontWeight: 600 }}
                              // onClick={() => {
                              //   navigate(`/create-email-notification`, {
                              //     state: { event },
                              //   });
                              // }}
                            >
                              Delete
                            </Button>
                          }
                          sx={{
                            bgcolor: index % 2 === 1 ? "grey.50" : "white", // alternate row color
                            borderBottom: "1px solid #eee",
                          }}
                        >
                          <IconSwitch
                            checked={true}
                            onChange={() =>
                              handleToggle(event?.key, event?.status)
                            }
                            color="success"
                            sx={{ mr: 2 }}
                          />
                          <ListItemText
                            primary={event.title}
                            secondary={event.description}
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
            {/* )} */}
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
                Points and levels
              </Typography>
              <Typography
                variant="body2"
                sx={{ lineHeight: 1.6, color: "#65676b" }}
              >
                Points are awarded to agents based on how fast they resolve the
                tickets assigned to them. There are also bonus points for first
                call resolution and satisfied customers. Agents also lose points
                for late resolution of tickets and for unhappy customers. <br />{" "}
                An agent can reach higher levels as he keeps getting more and
                more points, the set points to be achieved will be set by the
                Admin.
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
                Trophies
              </Typography>
              <Typography
                variant="body2"
                sx={{ lineHeight: 1.6, color: "#65676b" }}
              >
                The agent will receive 4 trophies based on different criteria.
                <Box
                  component="span"
                  sx={{ fontWeight: 600, color: "#1877f2" }}
                >
                  Most Valuable Player
                </Box>
                ,{" "}
                <Box
                  component="span"
                  sx={{ fontWeight: 600, color: "#1877f2" }}
                >
                  Customer Wow Champion
                </Box>
                ,{" "}
                <Box
                  component="span"
                  sx={{ fontWeight: 600, color: "#1877f2" }}
                >
                  Sharpshooter
                </Box>
                , and{" "}
                <Box
                  component="span"
                  sx={{ fontWeight: 600, color: "#1877f2" }}
                >
                  Speed Racer
                </Box>
              </Typography>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Box>
  );
};

export default ArcadePage;
