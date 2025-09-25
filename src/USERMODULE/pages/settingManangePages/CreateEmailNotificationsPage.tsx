import { useState, useEffect, useRef } from "react";

import {
  Box,
  Button,
  IconButton,
  Typography,
  Card,
  CardContent,
  Switch,
  styled,
  TextField,
  Popover,
  Slide,
  Divider,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";

import StackEditor from "../../../components/reusable/Editor";
import { AnimatePresence } from "framer-motion";
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

const CreateEmailNotificationsPage = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const containerRef = useRef<HTMLElement>(null);

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
            <IconButton onClick={() => navigate("/settings/workflow")}>
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h5" sx={{ fontWeight: 600, color: "#1a1a1a" }}>
              Agent Notifications / dynamically
            </Typography>
          </Box>
          <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
            <Typography variant="body2" sx={{ fontSize: 12 }}>
              Notification
            </Typography>
            <IconSwitch
              checked={true}
              onChange={() => {}}
              color="success"
              sx={{ mr: 2 }}
            />
          </Box>
        </Box>

        <Box
          sx={{
            display: "flex",
            gap: 2,
            flexDirection: "column",
            height: "calc(100vh - 245px)",
            overflow: "hidden",
            py: 2,
            px: 5,
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 0.4,
              width: "100%",
            }}
            ref={containerRef}
          >
            <Typography variant="subtitle2">
              Subject <span className="text-red-500">*</span>
            </Typography>

            <TextField
              fullWidth
              value=""
              size="small"
              onChange={(e) => {}}
              placeholder="Enter agent name"
              required
            />
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              width: "100%",
            }}
          >
            <Typography variant="subtitle2">
              Message <span className="text-red-500">*</span>
            </Typography>
            <StackEditor
              onChange={(content: string) => {}}
              onFocus={undefined}
              initialContent={` 
  
    <div style="height: 100px ;background-color: #8e98a0; color: #fff; padding: 10px; font-size: 20px">
      Hi 
      <br style="background-color: #8e98a0; color: #fff;"  />
     A new <span style="font-weight: bold; padding: 10px">ticket has been created.</span> Please have a look at the details and reply to the query.
    </div>
    <br/> <br/> 
    <div>
      <span style="font-weight: bold; padding: 10px">Subject: {{subject}}</span>
      <br/>
      <p>{{ticket.description}}</p>
    </div>
        <br/> <br/>     <br/> <br/> 
    <div>Button</div>
 
`}
              isFull={false}
              customHeight="240px"
            />
          </Box>
        </Box>
        <Divider />
        <Box sx={{ display: "flex", gap: 1, justifyContent: "space-between" }}>
          <Button variant="text" color="primary" sx={{ fontWeight: 600 }}>
            Preview
          </Button>
          <div className="flex gap-2">
            {" "}
            <Button variant="text" color="primary" sx={{ fontWeight: 600 }}>
              Cancel
            </Button>
            <Button variant="contained" color="primary">
              Save
            </Button>
          </div>
        </Box>
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
                New Ticket Created
              </Typography>
              <Typography
                variant="body2"
                sx={{ lineHeight: 1.6, color: "#65676b" }}
              >
                The New Ticket Created email will be sent out to your agents
                whenever a new ticket is created in your help desk. You can pick
                which agent should be receiving this notification. This email
                could contain the ticket URL making it easier for the agent to
                check the ticket. If you’ve setup multiple supported languages
                in your helpdesk, you can create this notification specific to
                each language. The icon indicates that the notification
                translations in other languages may be outdated.
              </Typography>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Box>
  );
};

export default CreateEmailNotificationsPage;
