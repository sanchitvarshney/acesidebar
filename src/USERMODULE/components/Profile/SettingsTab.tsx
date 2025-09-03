import React from "react";
import { Box, Button, Paper, Stack, Typography } from "@mui/material";

const SettingsTab: React.FC = () => {
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
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                Notification Preferences
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Manage how you receive notifications about tickets and updates.
              </Typography>
              <Button variant="outlined" size="small">
                Configure Notifications
              </Button>
            </Box>
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
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
    </Box>
  );
};

export default SettingsTab;
