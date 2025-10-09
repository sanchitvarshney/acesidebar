import React from "react";
import {
  Box,
  Typography,
  Divider,
  Switch,
  FormControlLabel,
  Paper,
  IconButton,
  Card,
  CardContent,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import RefreshIcon from "@mui/icons-material/Refresh";

import { useNavigate } from "react-router-dom";

const SettingRow: React.FC<{
  title: string;
  description?: string;
  defaultChecked?: boolean;
}> = ({ title, description, defaultChecked }) => {
  return (
    <Box className="w-full" sx={{ py: 2 }}>
      <Box className="flex items-center justify-between gap-4">
        <Box className="flex-1">
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            {title}
          </Typography>
          {description && (
            <Typography variant="body2" color="text.secondary">
              {description}
            </Typography>
          )}
        </Box>
        <FormControlLabel
          control={<Switch defaultChecked={Boolean(defaultChecked)} />}
          label=""
        />
      </Box>
      <Divider sx={{ mt: 2 }} />
    </Box>
  );
};

const EmailSettingsPage: React.FC = () => {
  const navigate = useNavigate();
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
            <IconButton onClick={() => navigate("/settings/emails/email-settings")}>
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h5" sx={{ fontWeight: 600, color: "#1a1a1a" }}>
              Email Setting
            </Typography>
          </Box>
        </Box>

        <div className="w-full max-h-[calc(100vh-180px)] p-2 overflow-y-auto  custom-scrollbar">
          <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
            <SettingRow
              title="Create a new ticket for each customer response"
              description="If enabled, every requester reply creates a new ticket instead of threading."
            />
            <SettingRow
              title="Ignore the sender email address while threading replies to tickets"
              description="If enabled, requester checks are not considered while threading a response."
            />
            <SettingRow
              title="Detect automated replies"
              description="Automatically identify automated replies and exclude them from customer responses."
              defaultChecked
            />
            <SettingRow
              title="Enable all messages to be included as part of quoted text for agent replies"
              description="Include all previous messages of the ticket as quoted text in agent replies."
            />
            <SettingRow
              title="Create a new ticket when subject line changes"
              description="When the subject changes, replies will not be threaded and a new ticket will be created."
            />
            <SettingRow
              title="Flexible email recipients"
              description="Allow agents to add or move recipients between To, Cc and Bcc."
            />
          </Paper>

          <Paper variant="outlined" sx={{ p: 2 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>
              Advanced email settings
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <SettingRow
              title="Allow agents to initiate conversation with customers"
              description="Enable sending outbound emails that convert to outbound tickets."
              defaultChecked
            />
            <SettingRow
              title="Use agent names in ticket replies and outbound emails"
              description="Agents can choose their own displayed sender name in replies and outbound emails."
            />
            <SettingRow
              title="Use 'Reply-to' email address to create requester contacts"
              description="Create contacts using the reply-to address when available."
              defaultChecked
            />
          </Paper>
        </div>
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
                Email settings
              </Typography>
              <Typography
                variant="body2"
                sx={{ lineHeight: 1.6, color: "#65676b" }}
              >
                You can completely customize your email replies to reflect your
                brand. Empower agents to create new outbound tickets and also
                allow them to choose their own name as the sender name to give
                the conversation a personal touch
              </Typography>
              <Typography
                variant="body2"
                sx={{ lineHeight: 1.6, color: "#65676b" }}
              >
                You can completely customize your email replies to reflect your
                brand. Empower agents to create new outbound tickets and also
                allow them to choose their own name as the sender name to give
                the conversation a personal touch
              </Typography>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Box>
  );
};

export default EmailSettingsPage;
