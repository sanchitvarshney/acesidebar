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

  const username =
    userData?.username || userData?.user?.username || "John Doe";
  const role = userData?.role || userData?.user?.role || "CEO";
  const company = userData?.company || "Freshworks";
  const email = userData?.email || userData?.user?.email || "abcd.com";
  const phone = userData?.phone || userData?.user?.phone || "27637738";
  const address =
    userData?.address || "7, fngu ,wiuf ";

  const [tab, setTab] = useState(0);
  const [todoOpen, setTodoOpen] = useState(true);

  const initials = useMemo(() => {
    if (!username) return "?";
    const parts = String(username).split(" ");
    return (parts[0]?.[0] || "").toUpperCase();
  }, [username]);

  return (
    <Box sx={{ display: "flex", gap: 2, p: 2, bgcolor: "#f5f6fa", height:"calc(100vh - 100px)", overflow: "hidden" }}>
      {/* Main Column */}
      <Box sx={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", height: "100%" }}>
        {/* Header (sticky, non-scrollable) */}
        <Paper
          elevation={0}
          sx={{
            position: "sticky",
            top: 0,
            zIndex: 1,
            p: 2,
            mb: 2,
            bgcolor: "background.paper",
            borderBottom: "1px solid #e5e7eb",
            flexShrink: 0,
          }}
        >
          {/* Row 1: Top action buttons */}
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 1 }}>
            <Button size="small" startIcon={<EditIcon />} variant="outlined">Edit</Button>
            <Button size="small" startIcon={<DeleteIcon />} variant="outlined" color="error">Delete</Button>
            <Button size="small" startIcon={<MergeIcon />} variant="outlined">Merge</Button>
            <Button size="small" startIcon={<AgentIcon />} variant="outlined">Convert to agent</Button>
            <Button size="small" startIcon={<PasswordIcon />} variant="outlined">Change password</Button>
          </Box>

          {/* Row 2: Avatar + name (left) | New ticket + Call (right) */}
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 2, mt: 3 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, minWidth: 0 }}>
              <Avatar sx={{ width: 64, height: 64, bgcolor: "#1976d2", fontSize: 28 }}>
                {initials}
          </Avatar>
              <Box sx={{ minWidth: 0 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.2, whiteSpace: "nowrap", textOverflow: "ellipsis", overflow: "hidden" }}>{username}</Typography>
                <Typography variant="body2" color="text.secondary">{role}</Typography>
                <Typography variant="body2" color="primary.main" sx={{ mt: 0.5 }}>{company}</Typography>
                <Box sx={{ display: "flex", gap: 2, mt: 0.5 }}>
                  <Button size="small" variant="text">Change</Button>
                  <Button size="small" variant="text" color="error">Remove</Button>
                </Box>
              </Box>
            </Box>
            <Box sx={{ display: "flex", gap: 1, flexShrink: 0 }}>
              <Button size="small" startIcon={<AddIcon />} variant="contained" color="primary">New ticket</Button>
              <Button size="small" startIcon={<PhoneIcon />} variant="outlined">Call</Button>
            </Box>
          </Box>

          {/* Tabs */}
          <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mt: 2 }}>
            <Tab label="TIMELINE" />
            <Tab label="TICKETS" />
          </Tabs>
        </Paper>

        {/* Tab content */}
        <Paper elevation={0} sx={{ p: 0, flex: 1, overflowY: "auto" }}>
          {tab === 0 && (
            <Box>
              <Box sx={{ px: 2, py: 1.5, borderBottom: "1px solid #e5e7eb", color: "text.secondary" }}>
                Thu, 10 Jul, 2025
              </Box>
              <Box sx={{ p: 2 }}>
                <Typography variant="caption" color="text.secondary">9:22 AM</Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 0.5 }}>
                  <Box sx={{ width: 20, height: 20, borderRadius: 1, bgcolor: "#e5e7eb" }} />
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>Issues with reports #3</Typography>
                </Box>
                <Box sx={{ display: "flex", gap: 2, mt: 0.5, flexWrap: "wrap" }}>
                  <Typography variant="body2" color="text.secondary">Priority: Low</Typography>
                  <Typography variant="body2" color="text.secondary">Status: Open</Typography>
                  <Typography variant="body2" color="text.secondary">Group: Escalations</Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2, mt: 0.5, flexWrap: "wrap" }}>
                  <Typography variant="body2" color="text.secondary">Agent responded: a month ago</Typography>
                  <Typography variant="body2" color="text.secondary">Overdue by: a month</Typography>
                  <Chip size="small" label="Overdue" color="error" variant="outlined" />
                </Box>
              </Box>
         

            </Box>
            
          )}
          {tab === 1 && (
            <Box sx={{ p: 2 }}>
              <Typography variant="body2" color="text.secondary">No tickets to show.</Typography>
            </Box>
          )}
        </Paper>
      </Box>

      {/* Right Sidebar Details */}
      <Box sx={{ width: 340, flexShrink: 0 }}>
        <Paper elevation={0} sx={{ p: 2 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.5 }}>DETAILS</Typography>
          <Box sx={{ mb: 2 }}>
            <Typography variant="caption" color="text.secondary">Tags</Typography>
            <Box sx={{ mt: 0.5 }}>
              <Button size="small" variant="text">Add tags</Button>
            </Box>
          </Box>
          <Divider />
          <Box sx={{ mt: 2 }}>
            <Typography variant="caption" color="text.secondary">Emails</Typography>
            <List dense sx={{ py: 0 }}>
              <ListItem disableGutters>
                <ListItemIcon sx={{ minWidth: 32 }}>
                  <MailIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primaryTypographyProps={{ variant: "body2" }} primary={email} />
              </ListItem>
            </List>
          </Box>
          <Box sx={{ mt: 1.5 }}>
            <Typography variant="caption" color="text.secondary">Work Phone</Typography>
            <List dense sx={{ py: 0 }}>
              <ListItem disableGutters>
                <ListItemIcon sx={{ minWidth: 32 }}>
                  <PhoneIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primaryTypographyProps={{ variant: "body2" }} primary={phone} />
              </ListItem>
            </List>
          </Box>
          <Box sx={{ mt: 1.5 }}>
            <Typography variant="caption" color="text.secondary">Address</Typography>
            <List dense sx={{ py: 0 }}>
              <ListItem disableGutters>
                <ListItemIcon sx={{ minWidth: 32 }}>
                  <LocationIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primaryTypographyProps={{ variant: "body2" }} primary={address} />
              </ListItem>
            </List>
          </Box>
        </Paper>

       
        </Box>
    </Box>
  );
};

export default ProfilePage;
