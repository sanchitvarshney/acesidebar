import React, { useState } from "react";
import {
  Box,
  Button,
  Paper,
  Stack,
  Typography,
  Switch,
  FormControlLabel,
  Select,
  MenuItem,
  Chip,
  Divider,
} from "@mui/material";
import NotificationsActiveOutlinedIcon from "@mui/icons-material/NotificationsActiveOutlined";
import TuneOutlinedIcon from "@mui/icons-material/TuneOutlined";
import TranslateOutlinedIcon from "@mui/icons-material/TranslateOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import DoneOutlinedIcon from "@mui/icons-material/DoneOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import LoginOutlinedIcon from "@mui/icons-material/LoginOutlined";

import CustomDataUpdatePopover from "../../../reusable/CustomDataUpdatePopover";

const SettingsTab: React.FC = () => {
  const [notifOpen, setNotifOpen] = useState(null);
  const [langOpen, setLangOpen] = useState(null);
  const [emailNotif, setEmailNotif] = useState(true);
const [pushNotif, setPushNotif] = useState(false);
  const [language, setLanguage] = useState("en");
  const [timezone, setTimezone] = useState("UTC");

  return (
    <Box sx={{ display: "flex", gap: 3, height: "100%" }}>
      <Box sx={{ flex: 2 }}>
        <Paper
          elevation={0}
          sx={{
            p: 3,
            bgcolor: "background.paper",
            borderRadius: 2,
            border: "1px solid",
            borderColor: "divider",
            height: "100%",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1.5 }}>
            <Stack direction="row" spacing={1.5} alignItems="center">
              <Box sx={{ width: 36, height: 36, borderRadius: 1.5, bgcolor: "action.selected", color: "text.primary", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <SettingsOutlinedIcon fontSize="small" />
              </Box>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
                  Profile Settings
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Customize your preferences and regional settings
                </Typography>
              </Box>
            </Stack>
            <Chip size="small" color="primary" variant="outlined" label="Preferences" />
          </Box>
          <Divider sx={{ mb: 2 }} />
          <Stack spacing={3}>
            <Box
              sx={{
                p: 2,
                borderRadius: 2,
                border: "1px solid",
                borderColor: "divider",
                bgcolor: "action.hover",
                transition: "all .2s ease",
                "&:hover": { boxShadow: "0 6px 18px rgba(0,0,0,0.06)", transform: "translateY(-1px)" },
              }}
            >
              <Typography
                variant="subtitle2"
                sx={{ fontWeight: 700, mb: 1, color: "text.primary" }}
              >
                Notification Preferences
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Manage how you receive notifications about tickets and updates.
              </Typography>
              <Button
                variant="outlined"
                size="small"
                startIcon={<NotificationsActiveOutlinedIcon fontSize="small" />}
                onClick={(e: any) => setNotifOpen(e.currentTarget)}
              >
                Configure Notifications
              </Button>
            </Box>
            <Box
              sx={{
                p: 2,
                borderRadius: 2,
                border: "1px solid",
                borderColor: "divider",
                bgcolor: "action.hover",
                transition: "all .2s ease",
                "&:hover": { boxShadow: "0 6px 18px rgba(0,0,0,0.06)", transform: "translateY(-1px)" },
              }}
            >
              <Typography
                variant="subtitle2"
                sx={{ fontWeight: 700, mb: 1, color: "text.primary" }}
              >
                Language & Region
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Set your preferred language and timezone.
              </Typography>
              <Button
                variant="outlined"
                size="small"
                startIcon={<TranslateOutlinedIcon fontSize="small" />}
                onClick={(e: any) => setLangOpen(e.currentTarget)}
              >
                Change Settings
              </Button>
            </Box>
          </Stack>
        </Paper>
      </Box>
      <Box sx={{ flex: 1 }}>
        <Paper
          elevation={0}
          sx={{
            p: 3,
            bgcolor: "background.paper",
            borderRadius: 2,
            border: "1px solid",
            borderColor: "divider",
            height: "100%",
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
            Account Info
          </Typography>
          <Stack spacing={1.5}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, p: 1.5, borderRadius: 2, border: "1px solid", borderColor: "divider", bgcolor: "action.hover" }}>
              <Box sx={{ width: 36, height: 36, borderRadius: 1, bgcolor: "primary.main", color: "primary.contrastText", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <CalendarTodayOutlinedIcon fontSize="small" />
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Member Since
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  January 2024
                </Typography>
              </Box>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, p: 1.5, borderRadius: 2, border: "1px solid", borderColor: "divider", bgcolor: "action.hover" }}>
              <Box sx={{ width: 36, height: 36, borderRadius: 1, bgcolor: "success.main", color: "success.contrastText", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <LoginOutlinedIcon fontSize="small" />
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Last Login
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  Today at 9:30 AM
                </Typography>
              </Box>
            </Box>
          </Stack>
        </Paper>
      </Box>

      <CustomDataUpdatePopover close={() => setNotifOpen(null)} anchorEl={notifOpen}>
        <Box sx={{ p: 2, minWidth: { xs: 260, sm: 360 } }}>
          <Stack direction="row" spacing={1.5} alignItems="flex-start" sx={{ mb: 1.5 }}>
            <Box sx={{ width: 36, height: 36, borderRadius: 1, bgcolor: "action.selected", display: "flex", alignItems: "center", justifyContent: "center", color: "text.primary" }}>
              <NotificationsActiveOutlinedIcon fontSize="small" />
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
                Notification Preferences
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Choose how you'd like to be notified
              </Typography>
            </Box>
          </Stack>
          <Box sx={{ bgcolor: "action.hover", border: "1px solid", borderColor: "divider", borderRadius: 1.5, p: 1.5, mb: 2 }}>
            <Stack spacing={1}>
              <FormControlLabel
                control={<Switch checked={emailNotif} onChange={(e) => setEmailNotif(e.target.checked)} />}
                label="Email notifications"
              />
              <FormControlLabel
                control={<Switch checked={pushNotif} onChange={(e) => setPushNotif(e.target.checked)} />}
                label="Push notifications"
              />
            </Stack>
          </Box>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
            <Button variant="contained" size="small" startIcon={<TuneOutlinedIcon fontSize="small" />} onClick={() => setNotifOpen(null)}>
              Save
            </Button>
            <Button variant="outlined" size="small" onClick={() => setNotifOpen(null)}>
              Cancel
            </Button>
          </Stack>
          <Divider sx={{ my: 1.5 }} />
          <Box sx={{ textAlign: "right" }}>
            <Button variant="text" size="small" onClick={() => setNotifOpen(null)} startIcon={<DoneOutlinedIcon fontSize="small" />}>
              DONE
            </Button>
          </Box>
        </Box>
      </CustomDataUpdatePopover>

      <CustomDataUpdatePopover close={() => setLangOpen(null)} anchorEl={langOpen}>
        <Box sx={{ p: 2, minWidth: { xs: 260, sm: 360 } }}>
          <Stack direction="row" spacing={1.5} alignItems="flex-start" sx={{ mb: 1.5 }}>
            <Box sx={{ width: 36, height: 36, borderRadius: 1, bgcolor: "action.selected", display: "flex", alignItems: "center", justifyContent: "center", color: "text.primary" }}>
              <TranslateOutlinedIcon fontSize="small" />
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
                Language & Region
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Set language and timezone
              </Typography>
            </Box>
          </Stack>
          <Box sx={{ bgcolor: "action.hover", border: "1px solid", borderColor: "divider", borderRadius: 1.5, p: 1.5, mb: 2 }}>
            <Stack spacing={1.5}>
              <Box>
                <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: "block" }}>
                  Language
                </Typography>
                <Select size="small" value={language} onChange={(e) => setLanguage(e.target.value as string)} fullWidth>
                  <MenuItem value="en">English</MenuItem>
                  <MenuItem value="hi">Hindi</MenuItem>
                </Select>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: "block" }}>
                  Timezone
                </Typography>
                <Select size="small" value={timezone} onChange={(e) => setTimezone(e.target.value as string)} fullWidth>
                  <MenuItem value="UTC">UTC</MenuItem>
                  <MenuItem value="IST">IST</MenuItem>
                </Select>
              </Box>
            </Stack>
          </Box>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
            <Button variant="contained" size="small" startIcon={<AccessTimeOutlinedIcon fontSize="small" />} onClick={() => setLangOpen(null)}>
              Save
            </Button>
            <Button variant="outlined" size="small" onClick={() => setLangOpen(null)}>
              Cancel
            </Button>
          </Stack>
          <Divider sx={{ my: 1.5 }} />
          <Box sx={{ textAlign: "right" }}>
            <Button variant="text" size="small" onClick={() => setLangOpen(null)} startIcon={<DoneOutlinedIcon fontSize="small" />}>
              DONE
            </Button>
          </Box>
        </Box>
      </CustomDataUpdatePopover>
    </Box>
  );
};

export default SettingsTab;
