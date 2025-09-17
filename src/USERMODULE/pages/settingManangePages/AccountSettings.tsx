import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  IconButton,
  Stack,
  Switch,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { useNavigate } from "react-router-dom";

const AccountSettings = () => {
  const navigate = useNavigate();
  return (
    <Box width="100%" height="calc(100vh - 96px)" p={2}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb:2 }}>
        <IconButton onClick={() => navigate("/settings/account/accounts")}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h5" sx={{ fontWeight: 600, color: "#1a1a1a" }}>
          Account Settings Support
        </Typography>
      </Box>

      <Box
        sx={{
          display: "grid",
          gap: 3,
          gridTemplateColumns: { xs: "1fr", md: "repeat(2, minmax(0, 1fr))" },
          alignItems: "stretch",
          justifyItems: "stretch",
          maxHeight: "calc(100vh - 170px)",
          overflow: "auto",
        }}
      >
        {/* Developer Account */}
        <Card
          variant="outlined"
          sx={{ borderRadius: 2, display: "flex", flexDirection: "column" }}
        >
          <CardContent sx={{ flexGrow: 1 }}>
            <Stack direction="row" spacing={2} alignItems="flex-start">
              <Avatar
                sx={{
                  width: 96,
                  height: 96,
                  bgcolor: "rgb(226 232 240)",
                  color: "rgb(100 116 139)",
                  fontSize: 40,
                }}
              >
                D
              </Avatar>
              <Box flex={1}>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 600, color: "rgb(30 41 59)" }}
                >
                  Developer Account
                </Typography>
                <Typography sx={{ color: "rgb(71 85 105)", mt: 1 }}>
                  postmanreply@gmail.com
                </Typography>
                <CardActions sx={{ px: 0, mt: "auto" }}>
                  <Button variant="outlined" size="small">
                    Edit
                  </Button>
                </CardActions>
              </Box>
            </Stack>
          </CardContent>
        </Card>

        {/* Account Status */}
        <Card
          variant="outlined"
          sx={{ borderRadius: 2, display: "flex", flexDirection: "column" }}
        >
          <CardContent sx={{ flexGrow: 1 }}>
            <Typography
              variant="h6"
              sx={{ fontWeight: 600, color: "rgb(30 41 59)" }}
            >
              Account Status
            </Typography>
            <Typography sx={{ color: "rgb(71 85 105)", mt: 1 }}>
              Account active since
            </Typography>
            <Typography sx={{ color: "rgb(30 41 59)", fontWeight: 600 }}>
              10 Jul, 2025{" "}
              <Box
                component="span"
                sx={{ color: "rgb(100 116 139)", fontWeight: 400 }}
              >
                (1 month)
              </Box>
            </Typography>
            <CardActions sx={{ px: 0, mt: "auto" }}>
              <Button variant="contained" color="error" size="small">
                Cancel account
              </Button>
            </CardActions>
          </CardContent>
        </Card>

        {/* Export Data */}
        <Card
          variant="outlined"
          sx={{ borderRadius: 2, display: "flex", flexDirection: "column" }}
        >
          <CardContent sx={{ flexGrow: 1 }}>
            <Typography
              variant="h6"
              sx={{ fontWeight: 600, color: "rgb(30 41 59)" }}
            >
              Export Data
            </Typography>
            <Typography sx={{ color: "rgb(71 85 105)", mt: 1 }}>
              Create an XML/JSON file with all your data from this Freshdesk
              account.
            </Typography>
            <CardActions sx={{ px: 0, mt: "auto" }}>
              <Button variant="outlined" size="small">
                Export
              </Button>
            </CardActions>
          </CardContent>
        </Card>

        {/* Data Policy */}
        <Card
          variant="outlined"
          sx={{ borderRadius: 2, display: "flex", flexDirection: "column" }}
        >
          <CardContent sx={{ flexGrow: 1 }}>
            <Typography
              variant="h6"
              sx={{ fontWeight: 600, color: "rgb(30 41 59)" }}
            >
              Data Policy
            </Typography>
            <Typography sx={{ color: "rgb(71 85 105)", mt: 1 }}>
              We've securely placed your data in our Indian data center.
            </Typography>
            <CardActions sx={{ px: 0, mt: "auto" }}>
              <Button variant="outlined" size="small">
                Learn more
              </Button>
            </CardActions>
          </CardContent>
        </Card>

        {/* Notification Preferences */}
        <Card
          variant="outlined"
          sx={{ borderRadius: 2, display: "flex", flexDirection: "column" }}
        >
          <CardContent>
            <Typography
              variant="h6"
              sx={{ fontWeight: 600, color: "rgb(30 41 59)" }}
            >
              Notification Preferences
            </Typography>
            <Stack spacing={1} mt={1}>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography>Email Notifications</Typography>
                <Switch defaultChecked />
              </Stack>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography>Desktop Alerts</Typography>
                <Switch />
              </Stack>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography>Ticket Updates</Typography>
                <Switch defaultChecked />
              </Stack>
            </Stack>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card
          variant="outlined"
          sx={{ borderRadius: 2, display: "flex", flexDirection: "column" }}
        >
          <CardContent>
            <Typography
              variant="h6"
              sx={{ fontWeight: 600, color: "rgb(30 41 59)" }}
            >
              Security Settings
            </Typography>
            <Stack spacing={1} mt={1}>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography>Two-Factor Authentication</Typography>
                <Switch />
              </Stack>
              <Typography sx={{ color: "rgb(71 85 105)", fontSize: 14 }}>
                Last login: 17 Sep 2025, 3:40 PM from Chrome, Windows
              </Typography>
            </Stack>
          </CardContent>
        </Card>

        {/* API Access */}
        <Card
          variant="outlined"
          sx={{ borderRadius: 2, display: "flex", flexDirection: "column" }}
        >
          <CardContent>
            <Typography
              variant="h6"
              sx={{ fontWeight: 600, color: "rgb(30 41 59)" }}
            >
              API Access
            </Typography>
            <Stack direction="row" spacing={1} alignItems="center" mt={1}>
              <TextField
                size="small"
                value="abcd-xxxx-1234-xxxx"
                InputProps={{
                  readOnly: true,
                  endAdornment: (
                    <Tooltip title="Copy">
                      <IconButton size="small">
                        <ContentCopyIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  ),
                }}
              />
            </Stack>
            <CardActions sx={{ px: 0, mt: 2 }}>
              <Button variant="outlined" size="small">
                Regenerate Key
              </Button>
            </CardActions>
          </CardContent>
        </Card>

        {/* Billing & Subscription */}
        <Card
          variant="outlined"
          sx={{ borderRadius: 2, display: "flex", flexDirection: "column" }}
        >
          <CardContent>
            <Typography
              variant="h6"
              sx={{ fontWeight: 600, color: "rgb(30 41 59)" }}
            >
              Billing & Subscription
            </Typography>
            <Typography sx={{ color: "rgb(71 85 105)", mt: 1 }}>
              Current Plan: <b>Professional</b>
            </Typography>
            <Typography sx={{ color: "rgb(71 85 105)" }}>
              Next Billing: 01 Oct 2025
            </Typography>
            <CardActions sx={{ px: 0, mt: 2 }}>
              <Button variant="outlined" size="small">
                Upgrade
              </Button>
              <Button variant="text" size="small">
                Manage Plan
              </Button>
            </CardActions>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default AccountSettings;
