import React, { useState } from "react";
import {
  Box,
  Button,
  Paper,
  Stack,
  Typography,
  Link as MuiLink,
  Divider,
  Chip,
} from "@mui/material";

export type SecurityTabProps = {
  onChangePassword?: () => void;
  onToggleTwoFA?: (nextEnabled: boolean) => void;
  onAddRecoveryEmail?: () => void;
  onUpdateRecoveryPhone?: () => void;
  onViewSessions?: () => void;
  twoFAEnabled?: boolean;
  recoveryEmail?: string | null;
  recoveryPhone?: string | null;
};

const SecurityTab: React.FC<SecurityTabProps> = ({
  onChangePassword,
  onToggleTwoFA,
  onAddRecoveryEmail,
  onUpdateRecoveryPhone,
  onViewSessions,
  twoFAEnabled = false,
  recoveryEmail = null,
  recoveryPhone = null,
}) => {
  const [isTwoFAEnabled, setIsTwoFAEnabled] = useState<boolean>(twoFAEnabled);

  const handleToggle2FA = () => {
    const next = !isTwoFAEnabled;
    setIsTwoFAEnabled(next);
    onToggleTwoFA && onToggleTwoFA(next);
  };

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
          <Typography
            variant="h6"
            sx={{ fontWeight: 600, mb: 3, color: "text.primary" }}
          >
            Security
          </Typography>

          {/* Password settings header */}
          <Typography
            variant="subtitle2"
            sx={{ fontWeight: 600, color: "text.secondary", mb: 2 }}
          >
            Password settings
          </Typography>

          <Stack
            spacing={3}
            divider={<Divider flexItem sx={{ borderColor: "#eee" }} />}
          >
            {/* Password */}
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", sm: "220px 1fr" },
                gap: 2,
                alignItems: "flex-start",
              }}
            >
              <Typography
                variant="body2"
                sx={{ fontWeight: 600, color: "text.primary" }}
              >
                Password
              </Typography>
              <Box>
                <Typography
                  variant="body2"
                  sx={{ color: "text.secondary", mb: 1 }}
                >
                  Reset the user's password.
                </Typography>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={onChangePassword}
                >
                  Reset password
                </Button>
              </Box>
            </Box>

            {/* 2-step verification */}
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", sm: "220px 1fr" },
                gap: 2,
                alignItems: "flex-start",
              }}
            >
              <Typography
                variant="body2"
                sx={{ fontWeight: 600, color: "text.primary" }}
              >
                2-step verification
              </Typography>
              <Box>
                <Stack
                  direction="row"
                  spacing={1}
                  alignItems="center"
                  sx={{ mb: 1 }}
                >
                  <Chip
                    size="small"
                    label={isTwoFAEnabled ? "ON" : "OFF"}
                    color={isTwoFAEnabled ? "success" : "default"}
                  />
                  <Typography variant="caption" color="text.secondary">
                    {isTwoFAEnabled
                      ? "Enabled for this account"
                      : "Not enforced across your organization"}
                  </Typography>
                </Stack>
                <Typography
                  variant="body2"
                  sx={{ color: "text.secondary", mb: 1 }}
                >
                  Add an additional authentication factor for sign in.
                </Typography>
                <Button
                  variant="outlined"
                  size="small"
                  color={isTwoFAEnabled ? "warning" : "primary"}
                  onClick={handleToggle2FA}
                >
                  {isTwoFAEnabled ? "Disable 2FA" : "Enable 2FA"}
                </Button>
              </Box>
            </Box>

            {/* Recovery information */}
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", sm: "220px 1fr" },
                gap: 2,
                alignItems: "flex-start",
              }}
            >
              <Typography
                variant="body2"
                sx={{ fontWeight: 600, color: "text.primary" }}
              >
                Recovery information
              </Typography>
              <Stack spacing={1}>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Email
                  </Typography>
                  {recoveryEmail ? (
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {recoveryEmail}
                    </Typography>
                  ) : (
                    <MuiLink
                      component="button"
                      type="button"
                      underline="hover"
                      sx={{ fontSize: 14 }}
                      onClick={onAddRecoveryEmail}
                    >
                      Add a recovery email
                    </MuiLink>
                  )}
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Phone
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {recoveryPhone || "Not added"}
                  </Typography>
                  <MuiLink
                    component="button"
                    type="button"
                    underline="hover"
                    sx={{ fontSize: 14 }}
                    onClick={onUpdateRecoveryPhone}
                  >
                    {recoveryPhone ? "Change phone" : "Add a phone"}
                  </MuiLink>
                </Box>
              </Stack>
            </Box>

            {/* Sessions */}
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", sm: "220px 1fr" },
                gap: 2,
                alignItems: "flex-start",
              }}
            >
              <Typography
                variant="body2"
                sx={{ fontWeight: 600, color: "text.primary" }}
              >
                Login sessions
              </Typography>
              <Box>
                <Typography
                  variant="body2"
                  sx={{ color: "text.secondary", mb: 1 }}
                >
                  View and manage active login sessions for this account.
                </Typography>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={onViewSessions}
                >
                  View sessions
                </Button>
              </Box>
            </Box>
          </Stack>
        </Paper>
      </Box>

      {/* Right panel - optional help text */}
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
          <Typography
            variant="h6"
            sx={{ fontWeight: 600, mb: 2, color: "text.primary" }}
          >
            Security guidance
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Use strong passwords and enable 2-step verification to protect your
            account. Keep recovery information up-to-date so you can regain
            access if needed.
          </Typography>
        </Paper>
      </Box>
    </Box>
  );
};

export default SecurityTab;
