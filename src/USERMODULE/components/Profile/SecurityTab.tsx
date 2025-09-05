import React, { useState, useRef } from "react";
import {
  Box,
  Button,
  Paper,
  Stack,
  Typography,
  Link as MuiLink,
  Divider,
  Chip,
  TextField,
} from "@mui/material";
import CustomSideBarPanel from "../../../components/reusable/CustomSideBarPanel";
import CustomPopover from "../../../reusable/CustomPopover";
import ChangePassword from "../ChangePassword";

export type SecurityTabProps = {
  onChangePassword?: () => void;
  onToggleTwoFA?: (nextEnabled: boolean) => void;
  onAddRecoveryEmail?: (email: string) => void;
  onUpdateRecoveryPhone?: (phone: string) => void;
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

  // Popover state
  const [isPwdOpen, setIsPwdOpen] = useState(false);
  const [isTwoFAOpen, setIsTwoFAOpen] = useState(false);
  const [isRecoveryEmailOpen, setIsRecoveryEmailOpen] = useState(false);
  const [isRecoveryPhoneOpen, setIsRecoveryPhoneOpen] = useState(false);
  const [isSessionsOpen, setIsSessionsOpen] = useState(false);

  // Local form state
  const [emailInput, setEmailInput] = useState("");
  const [phoneInput, setPhoneInput] = useState("");

  // Anchor refs for popovers
  const twoFAAnchorRef = useRef<HTMLDivElement>(null);
  const recoveryEmailAnchorRef = useRef<HTMLDivElement>(null);
  const recoveryPhoneAnchorRef = useRef<HTMLDivElement>(null);
  const sessionsAnchorRef = useRef<HTMLDivElement>(null);

  const handleToggle2FAConfirm = () => {
    const next = !isTwoFAEnabled;
    setIsTwoFAEnabled(next);
    onToggleTwoFA && onToggleTwoFA(next);
    setIsTwoFAOpen(false);
  };

  const handleAddRecoveryEmail = () => {
    onAddRecoveryEmail && onAddRecoveryEmail(emailInput.trim());
    setIsRecoveryEmailOpen(false);
  };

  const handleUpdateRecoveryPhone = () => {
    onUpdateRecoveryPhone && onUpdateRecoveryPhone(phoneInput.trim());
    setIsRecoveryPhoneOpen(false);
  };

  const handleViewSessions = () => {
    onViewSessions && onViewSessions();
    // keep panel open to show list below
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
              <Box
                ref={twoFAAnchorRef}
                onClick={() => setIsTwoFAOpen(true)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") setIsTwoFAOpen(true);
                }}
                sx={{
                  p: 1,
                  borderRadius: 1,
                  "&:hover": { bgcolor: "action.hover" },
                  cursor: "pointer",
                }}
              >
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
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsTwoFAOpen(true);
                  }}
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
              <Stack
                ref={recoveryEmailAnchorRef}
                spacing={1}
                onClick={() => setIsRecoveryEmailOpen(true)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ")
                    setIsRecoveryEmailOpen(true);
                }}
                sx={{
                  p: 1,
                  borderRadius: 1,
                  "&:hover": { bgcolor: "action.hover" },
                  cursor: "pointer",
                }}
              >
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
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsRecoveryEmailOpen(true);
                      }}
                    >
                      Add a recovery email
                    </MuiLink>
                  )}
                </Box>
                <Box
                  ref={recoveryPhoneAnchorRef}
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsRecoveryPhoneOpen(true);
                  }}
                >
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
              <Box
                ref={sessionsAnchorRef}
                onClick={() => setIsSessionsOpen(true)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ")
                    setIsSessionsOpen(true);
                }}
                sx={{
                  p: 1,
                  borderRadius: 1,
                  "&:hover": { bgcolor: "action.hover" },
                  cursor: "pointer",
                }}
              >
                <Typography
                  variant="body2"
                  sx={{ color: "text.secondary", mb: 1 }}
                >
                  View and manage active login sessions for this account.
                </Typography>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsSessionsOpen(true);
                  }}
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

      {/* POPUPS */}
      <CustomSideBarPanel
        open={isPwdOpen}
        close={() => setIsPwdOpen(false)}
        title={"Password"}
        width={900}
      >
        <Box sx={{ p: 2 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography variant="body1" sx={{ fontWeight: 600 }}>
              Reset password
            </Typography>
            <Button
              variant="contained"
              size="small"
              onClick={() => {
                onChangePassword && onChangePassword();
                setIsPwdOpen(false);
              }}
            >
              RESET PASSWORD
            </Button>
          </Box>
          <ChangePassword
            open={isPwdOpen}
            onClose={() => setIsPwdOpen(false)}
            onConfirm={() => {
              onChangePassword && onChangePassword();
              setIsPwdOpen(false);
            }}
          />
          <Box sx={{ textAlign: "right", mt: 2 }}>
            <Button variant="text" onClick={() => setIsPwdOpen(false)}>
              DONE
            </Button>
          </Box>
        </Box>
      </CustomSideBarPanel>

      <CustomPopover
        open={isTwoFAOpen}
        close={() => setIsTwoFAOpen(false)}
        anchorEl={twoFAAnchorRef}
        width={400}
        isCone={true}
      >
        <Box sx={{ p: 2 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography variant="body1" sx={{ fontWeight: 600 }}>
              {isTwoFAEnabled ? "Disable 2FA" : "Enable 2FA"}
            </Typography>
            <Button
              variant="contained"
              size="small"
              color={isTwoFAEnabled ? "warning" : "primary"}
              onClick={handleToggle2FAConfirm}
            >
              {isTwoFAEnabled ? "DISABLE" : "ENABLE"}
            </Button>
          </Box>
          <Typography variant="body2" color="text.secondary">
            {isTwoFAEnabled
              ? "2FA is currently ON. Click Disable to turn it off."
              : "2FA is currently OFF. Click Enable to secure sign-ins with an additional factor."}
          </Typography>
          <Box sx={{ textAlign: "right", mt: 2 }}>
            <Button variant="text" onClick={() => setIsTwoFAOpen(false)}>
              DONE
            </Button>
          </Box>
        </Box>
      </CustomPopover>

      <CustomPopover
        open={isRecoveryEmailOpen}
        close={() => setIsRecoveryEmailOpen(false)}
        anchorEl={recoveryEmailAnchorRef}
        width={350}
        isCone={true}
      >
        <Box sx={{ p: 2 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography variant="body1" sx={{ fontWeight: 600 }}>
              Add a recovery email
            </Typography>
            <Button
              variant="contained"
              size="small"
              onClick={handleAddRecoveryEmail}
            >
              SAVE
            </Button>
          </Box>
          <TextField
            size="small"
            fullWidth
            label="Recovery email"
            value={emailInput}
            onChange={(e) => setEmailInput(e.target.value)}
          />
          <Box sx={{ textAlign: "right", mt: 2 }}>
            <Button
              variant="text"
              onClick={() => setIsRecoveryEmailOpen(false)}
            >
              DONE
            </Button>
          </Box>
        </Box>
      </CustomPopover>

      <CustomPopover
        open={isRecoveryPhoneOpen}
        close={() => setIsRecoveryPhoneOpen(false)}
        anchorEl={recoveryPhoneAnchorRef}
        width={350}
        isCone={true}
      >
        <Box sx={{ p: 2 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography variant="body1" sx={{ fontWeight: 600 }}>
              {recoveryPhone ? "Change phone" : "Add a phone"}
            </Typography>
            <Button
              variant="contained"
              size="small"
              onClick={handleUpdateRecoveryPhone}
            >
              {recoveryPhone ? "SAVE" : "ADD"}
            </Button>
          </Box>
          <TextField
            size="small"
            fullWidth
            label="Recovery phone"
            value={phoneInput}
            onChange={(e) => setPhoneInput(e.target.value)}
          />
          <Box sx={{ textAlign: "right", mt: 2 }}>
            <Button
              variant="text"
              onClick={() => setIsRecoveryPhoneOpen(false)}
            >
              DONE
            </Button>
          </Box>
        </Box>
      </CustomPopover>

      <CustomPopover
        open={isSessionsOpen}
        close={() => setIsSessionsOpen(false)}
        anchorEl={sessionsAnchorRef}
        width={400}
        isCone={true}
      >
        <Box sx={{ p: 2 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography variant="body1" sx={{ fontWeight: 600 }}>
              Active sessions
            </Typography>
            <Button
              variant="contained"
              size="small"
              onClick={handleViewSessions}
            >
              REFRESH
            </Button>
          </Box>
          <Typography variant="body2" color="text.secondary">
            List active sessions here (device, location, last activity) with an
            action to sign out.
          </Typography>
          <Box sx={{ textAlign: "right", mt: 2 }}>
            <Button variant="text" onClick={() => setIsSessionsOpen(false)}>
              DONE
            </Button>
          </Box>
        </Box>
      </CustomPopover>
    </Box>
  );
};

export default SecurityTab;
