import React, { useState, useRef } from "react";
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
} from "@mui/material";
import CustomPopover from "../../../reusable/CustomPopover";

const SettingsTab: React.FC = () => {
  const [notifOpen, setNotifOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [emailNotif, setEmailNotif] = useState(true);
  const [pushNotif, setPushNotif] = useState(false);
  const [language, setLanguage] = useState("en");
  const [timezone, setTimezone] = useState("UTC");

  // Anchor refs for popovers
  const notifAnchorRef = useRef<HTMLDivElement>(null);
  const langAnchorRef = useRef<HTMLDivElement>(null);

  return (
    <Box sx={{ display: "flex", gap: 3, height: "100%" }}>
      <Box sx={{ flex: 2 }}>
        <Paper
          elevation={0}
          sx={{
            p: 3,
            bgcolor: "background.paper",
            borderRadius: 2,
            border: "1px solid #e5e7eb",
            height: "100%",
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
            Profile Settings
          </Typography>
          <Stack spacing={3}>
            <Box
              ref={notifAnchorRef}
              onClick={() => setNotifOpen(true)}
              role="button"
              tabIndex={0}
              sx={{
                p: 1,
                borderRadius: 1,
                "&:hover": { bgcolor: "action.hover" },
                cursor: "pointer",
              }}
            >
              <Typography
                variant="subtitle2"
                sx={{ fontWeight: 600, mb: 1, color: "text.primary" }}
              >
                Notification Preferences
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Manage how you receive notifications about tickets and updates.
              </Typography>
              <Button variant="outlined" size="small">
                Configure Notifications
              </Button>
            </Box>
            <Box
              ref={langAnchorRef}
              onClick={() => setLangOpen(true)}
              role="button"
              tabIndex={0}
              sx={{
                p: 1,
                borderRadius: 1,
                "&:hover": { bgcolor: "action.hover" },
                cursor: "pointer",
              }}
            >
              <Typography
                variant="subtitle2"
                sx={{ fontWeight: 600, mb: 1, color: "text.primary" }}
              >
                Language & Region
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Set your preferred language and timezone.
              </Typography>
              <Button variant="outlined" size="small">
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
            border: "1px solid #e5e7eb",
            height: "100%",
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
            Account Info
          </Typography>
          <Stack spacing={2}>
            <Box>
              <Typography variant="caption" color="text.secondary">
                Member Since
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                January 2024
              </Typography>
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary">
                Last Login
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                Today at 9:30 AM
              </Typography>
            </Box>
          </Stack>
        </Paper>
      </Box>

      <CustomPopover
        open={notifOpen}
        close={() => setNotifOpen(false)}
        anchorEl={notifAnchorRef}
        width={350}
        isCone={true}
      >
        <Box sx={{ p: 2 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Choose how you'd like to be notified.
          </Typography>
          <FormControlLabel
            control={
              <Switch
                checked={emailNotif}
                onChange={(e) => setEmailNotif(e.target.checked)}
              />
            }
            label="Email notifications"
          />
          <FormControlLabel
            control={
              <Switch
                checked={pushNotif}
                onChange={(e) => setPushNotif(e.target.checked)}
              />
            }
            label="Push notifications"
          />
          <Box sx={{ textAlign: "right", mt: 2 }}>
            <Button variant="text" onClick={() => setNotifOpen(false)}>
              DONE
            </Button>
          </Box>
        </Box>
      </CustomPopover>

      <CustomPopover
        open={langOpen}
        close={() => setLangOpen(false)}
        anchorEl={langAnchorRef}
        width={300}
        isCone={true}
      >
        <Box sx={{ p: 2 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Set language and timezone.
          </Typography>
          <Stack spacing={2}>
            <Select
              size="small"
              value={language}
              onChange={(e) => setLanguage(e.target.value as string)}
            >
              <MenuItem value="en">English</MenuItem>
              <MenuItem value="hi">Hindi</MenuItem>
            </Select>
            <Select
              size="small"
              value={timezone}
              onChange={(e) => setTimezone(e.target.value as string)}
            >
              <MenuItem value="UTC">UTC</MenuItem>
              <MenuItem value="IST">IST</MenuItem>
            </Select>
          </Stack>
          <Box sx={{ textAlign: "right", mt: 2 }}>
            <Button variant="text" onClick={() => setLangOpen(false)}>
              DONE
            </Button>
          </Box>
        </Box>
      </CustomPopover>
    </Box>
  );
};

export default SettingsTab;
