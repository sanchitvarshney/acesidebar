import React from "react";
import { Box, Button, Paper, Stack, Typography } from "@mui/material";

const SecurityTab: React.FC = () => {
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
            Security Settings
          </Typography>
          <Stack spacing={3}>
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                Two-Factor Authentication
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Add an extra layer of security to your account.
              </Typography>
              <Button variant="outlined" size="small" color="warning">
                Enable 2FA
              </Button>
            </Box>
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                Login Sessions
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                View and manage your active login sessions.
              </Typography>
              <Button variant="outlined" size="small">
                View Sessions
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
            Security Status
          </Typography>
          <Box
            sx={{
              textAlign: "center",
              p: 2,
              bgcolor: "warning.50",
              borderRadius: 2,
              mb: 2,
            }}
          >
            <Typography
              variant="h6"
              sx={{ fontWeight: 700, color: "warning.main" }}
            >
              Medium
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Security Level
            </Typography>
          </Box>
          <Box
            sx={{
              textAlign: "center",
              p: 2,
              bgcolor: "success.50",
              borderRadius: 2,
            }}
          >
            <Typography
              variant="h6"
              sx={{ fontWeight: 700, color: "success.main" }}
            >
              ✓
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Password Strong
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default SecurityTab;
