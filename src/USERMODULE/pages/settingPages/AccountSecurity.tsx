import { Alert, Autocomplete, Link, Tooltip } from "@mui/material";

import ContentCopyIcon from "@mui/icons-material/ContentCopy";

import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

import { useState, useEffect, useMemo } from "react";

import {
  Box,
  Button,
  IconButton,
  Typography,
  Stack,
  TextField,
  Chip,
  Checkbox,
  FormControlLabel,
  Card,
  CardContent,
  CircularProgress,
  Switch,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import PersonIcon from "@mui/icons-material/Person";

import WorkIcon from "@mui/icons-material/Work";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import RefreshIcon from "@mui/icons-material/Refresh";

import { Email } from "@mui/icons-material";
import { useLazyGetAgentListQuery } from "../../../services/agentServices";

import { useNavigate } from "react-router-dom";

const AccountSecurity = () => {
  const availableRecipients = useMemo(
    () => [
      "admins@acme.com",
      "it-ops@acme.com",
      "security@acme.com",
      "owner@acme.com",
      "lead.support@acme.com",
    ],
    []
  );

  const handleCopyToken = async () => {
    try {
      await navigator.clipboard.writeText(widgetSSOToken);
    } catch {
      // no-op
    }
  };

  const handleResetToken = () => {
    // local reset for demo; real implementation should request a new token from backend
    const next =
      Math.random().toString(16).slice(2) + Math.random().toString(16).slice(2);
    setWidgetSSOToken(next.slice(0, 32));
  };

  const [activeFilters, setActiveFilters] = useState<
    Array<{
      id: string;
      field: string;
      operator: string;
      value: string;
      label: string;
    }>
  >([]);

  const [filterValue, setFilterValue] = useState("");
  const [selectedOperator, setSelectedOperator] = useState("startsWith");
  const [checkboxValues, setCheckboxValues] = useState<string[]>([]);
  const [visibleColumns, setVisibleColumns] = useState<string[]>([
    "name",
    "role",
    "email",
    "isActive",
  ]);
  const [getAgentList, { data: agentList, isLoading: agentListLoading }] =
    useLazyGetAgentListQuery();

  useEffect(() => {
    getAgentList();
  }, []);

  const navigate = useNavigate();

  const [freshworksSSOEnabled, setFreshworksSSOEnabled] = useState(false);
  const [allowIframeEmbedding, setAllowIframeEmbedding] = useState(false);
  const [enableCookiePolicy, setEnableCookiePolicy] = useState(true);
  const [restrictAttachmentAccess, setRestrictAttachmentAccess] =
    useState(false);
  const [allowSpecificAttachments, setAllowSpecificAttachments] =
    useState(true);
  const [widgetSSOEnabled, setWidgetSSOEnabled] = useState(false);
  const [widgetSSOToken, setWidgetSSOToken] = useState(
    "ccabf3d2d52d738c8b4c1915af449bbe"
  );
  const [adminNotificationRecipients, setAdminNotificationRecipients] =
    useState<string[]>(["Developer Account"]);

  // Field options for filter - Corporate relevant filters
  const fieldOptions = [
    {
      value: "name",
      label: "Name",
      icon: <PersonIcon />,
      type: "text",
      operator: "startsWith",
    },
    {
      value: "role",
      label: "Role",
      icon: <PersonIcon />,
      type: "text",
      operator: "startsWith",
    },
    {
      value: "isActive",
      label: "Status",
      icon: <WorkIcon />,
      type: "multiCheckbox",
      options: ["Active", "Inactive"],
      operator: "equals",
    },
    {
      value: "email",
      label: "Email",
      icon: <Email />,
      type: "number",
      operator: "equals",
    },
  ];

  // Operator options for filters
  const operatorOptions = [
    { value: "startsWith", label: "Starts with" },
    { value: "endsWith", label: "Ends with" },
    { value: "contains", label: "Contains" },
    { value: "equals", label: "Equals" },
    { value: "doesNotContain", label: "Does not contain" },
    { value: "doesNotEqual", label: "Does not equal" },
    { value: "greaterThan", label: "Greater than (>)" },
    { value: "lessThan", label: "Less than (<)" },
    { value: "greaterThanOrEqual", label: "Greater than or equal (≥)" },
    { value: "lessThanOrEqual", label: "Less than or equal (≤)" },
    { value: "between", label: "Between" },
    { value: "in", label: "In" },
    { value: "notIn", label: "Not in" },
  ];

  return (
    <Box
      sx={{
        height: "calc(100vh - 100px)",
        display: "grid",
        gridTemplateColumns: "3fr 1fr",
        overflow: "hidden",
      }}
    >
      {/* Left Content */}
      <Box
        sx={{
          flex: 1,
          p: 2,
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <IconButton onClick={() => navigate("/settings/account/accounts")}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h5" sx={{ fontWeight: 600, color: "#1a1a1a" }}>
            Security Settings
          </Typography>
        </Box>

        <Box
          sx={{
            maxHeight: "calc(100vh - 180px)",

            overflowY: "auto",
          }}
        >
          <Card variant="outlined">
            {" "}
            <CardContent>
              <Stack spacing={1.5}>
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Typography variant="h6">Freshworks SSO</Typography>
                  <Chip label="New" color="primary" size="small" />{" "}
                </Stack>
                <Typography variant="body2" color="text.secondary">
                  This allows you to have a single Freshworks login with
                  enhanced security and privacy features. You can configure
                  Freshworks SSO only if you are an Org admin.{" "}
                  <Link component="button" underline="hover">
                    Learn more
                  </Link>
                </Typography>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Button variant="outlined" color="primary">
                    Configure Freshworks SSO
                  </Button>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={freshworksSSOEnabled}
                        onChange={(e) =>
                          setFreshworksSSOEnabled(e.target.checked)
                        }
                      />
                    }
                    label={freshworksSSOEnabled ? "Active" : "Inactive"}
                  />
                </Stack>
              </Stack>
            </CardContent>
          </Card>

          {/* Portal Security Settings */}
          <Card variant="outlined">
            <CardContent>
              <Stack spacing={2}>
                <Typography variant="h6">Portal Security Settings</Typography>
                <FormControlLabel
                  control={
                    <Switch
                      checked={allowIframeEmbedding}
                      onChange={(e) =>
                        setAllowIframeEmbedding(e.target.checked)
                      }
                    />
                  }
                  label="Allow Portals to be embedded as iframes"
                />
                <Typography variant="body2" color="text.secondary">
                  Authorize access for third-party sites to embed portal pages
                  as iframes
                </Typography>
              </Stack>
            </CardContent>
          </Card>

          {/* Cookie Policy */}
          <Card variant="outlined">
            <CardContent>
              <Stack spacing={1.5}>
                <Typography variant="h6">Cookie Policy</Typography>
                <FormControlLabel
                  control={
                    <Switch
                      checked={enableCookiePolicy}
                      onChange={(e) => setEnableCookiePolicy(e.target.checked)}
                    />
                  }
                  label={
                    <>
                      Enable default Freshdesk cookie policy on all customer
                      portals.{" "}
                      <Link component="button" underline="hover">
                        Learn more
                      </Link>
                    </>
                  }
                />
              </Stack>
            </CardContent>
          </Card>

          {/* Access setting for attachments */}
          <Card variant="outlined">
            <CardContent>
              <Stack spacing={1.5}>
                <Typography variant="h6">
                  Access setting for attachments
                </Typography>
                <FormControlLabel
                  control={
                    <Switch
                      checked={restrictAttachmentAccess}
                      onChange={(e) =>
                        setRestrictAttachmentAccess(e.target.checked)
                      }
                    />
                  }
                  label="Allow only logged in users to access attachments"
                />
                {restrictAttachmentAccess && (
                  <Typography variant="caption" color="text.secondary">
                    Note: Secured attachment links are sent in the email
                    notifications instead of the actual files
                  </Typography>
                )}
              </Stack>
            </CardContent>
          </Card>

          {/* Attachment Settings */}
          <Card variant="outlined">
            <CardContent>
              <Stack spacing={1.5}>
                <Typography variant="h6">Attachment Settings</Typography>
                <Stack direction="row" spacing={1} alignItems="center">
                  <InfoOutlinedIcon color="action" fontSize="small" />
                  <Typography variant="body2" color="text.secondary">
                    Image formats such as JPG, PNG, GIF, WEBP can't be blocked
                  </Typography>
                </Stack>
                <FormControlLabel
                  control={
                    <Switch
                      checked={allowSpecificAttachments}
                      onChange={(e) =>
                        setAllowSpecificAttachments(e.target.checked)
                      }
                    />
                  }
                  label={
                    <>
                      Allow or Block specific attachments{" "}
                      <Link component={"button"} underline="hover">
                        Learn more
                      </Link>
                    </>
                  }
                />
                <Typography variant="caption" color="text.secondary">
                  Disabling this setting allows all file types to be uploaded by
                  both agents and customers during interactions
                </Typography>
              </Stack>
            </CardContent>
          </Card>

          {/* Widget Settings */}
          <Card variant="outlined">
            <CardContent>
              <Stack spacing={1.5}>
                <Typography variant="h6">Widget Settings</Typography>
                <FormControlLabel
                  control={
                    <Switch
                      checked={widgetSSOEnabled}
                      onChange={(e) => setWidgetSSOEnabled(e.target.checked)}
                    />
                  }
                  label="Single sign on for widget"
                />
                <Typography variant="body2" color="text.secondary">
                  If you have solution articles or the contact form restricted
                  to just logged in users, use this token to authenticate users
                  into the widget.
                </Typography>
                <Stack direction="row" spacing={1} alignItems="center">
                  <TextField
                    size="small"
                    fullWidth
                    value={widgetSSOToken}
                    onChange={(e) => setWidgetSSOToken(e.target.value)}
                    InputProps={{
                      endAdornment: (
                        <Stack
                          direction="row"
                          spacing={0.5}
                          alignItems="center"
                        >
                          <Tooltip title="Copy">
                            <IconButton
                              size="small"
                              onClick={handleCopyToken}
                              aria-label="Copy token"
                            >
                              <ContentCopyIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Reset">
                            <IconButton
                              size="small"
                              onClick={handleResetToken}
                              aria-label="Reset token"
                            >
                              <RefreshIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      ),
                    }}
                  />
                </Stack>
                <Typography variant="body2" color="text.secondary">
                  Learn more about authentication in the widget here.
                </Typography>
              </Stack>
            </CardContent>
          </Card>

          {/* Admin notifications */}
          <Card variant="outlined">
            <CardContent>
              <Stack spacing={1.5}>
                <Typography variant="h6">Admin notifications</Typography>
                <Alert severity="info" variant="outlined">
                  An email notification will be sent when: 1) Agent is added 2)
                  Agent is deleted
                </Alert>
                <Stack spacing={0.5}>
                  <Stack direction="row" spacing={0.5} alignItems="center">
                    <Typography variant="subtitle2">
                      Choose recipients
                    </Typography>
                    <Typography variant="subtitle2" color="error">
                      *
                    </Typography>
                  </Stack>
                  <Autocomplete
                    multiple
                    options={availableRecipients}
                    value={adminNotificationRecipients}
                    onChange={(e, val) => setAdminNotificationRecipients(val)}
                    renderTags={(value, getTagProps) =>
                      value.map((option, index) => (
                        <Chip
                          {...getTagProps({ index })}
                          key={option}
                          label={option}
                        />
                      ))
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        placeholder="Developer Account"
                        size="small"
                      />
                    )}
                  />
                </Stack>
              </Stack>
            </CardContent>
          </Card>
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
          {/* Agent Overview */}
          {/* Security Overview */}
          <Card sx={{ boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
            <CardContent>
              <Typography
                variant="h6"
                sx={{ fontWeight: 600, mb: 2, color: "#1a1a1a" }}
              >
                Security Overview
              </Typography>
              <Typography
                variant="body2"
                sx={{ lineHeight: 1.6, color: "#65676b" }}
              >
                Security settings help protect your support system from
                unauthorized access and ensure sensitive data is kept safe.
                Proper configuration of authentication, access controls, and
                monitoring safeguards your team and customers from potential
                threats.
              </Typography>
            </CardContent>
          </Card>

          {/* Authentication & Access */}
          <Card sx={{ boxShadow: "0 2px 8px rgba(0,0,0,0.1)", height: "100%" }}>
            <CardContent>
              <Typography
                variant="h6"
                sx={{ fontWeight: 600, mb: 2, color: "#1a1a1a" }}
              >
                Authentication & Access
              </Typography>
              <Typography
                variant="body2"
                sx={{ lineHeight: 1.6, color: "#65676b" }}
              >
                You can enforce strong authentication methods to reduce risks.
                Common options include{" "}
                <Box
                  component="span"
                  sx={{ fontWeight: 600, color: "#1877f2" }}
                >
                  Single Sign-On (SSO)
                </Box>
                ,{" "}
                <Box
                  component="span"
                  sx={{ fontWeight: 600, color: "#1877f2" }}
                >
                  Multi-Factor Authentication (MFA)
                </Box>
                , and{" "}
                <Box
                  component="span"
                  sx={{ fontWeight: 600, color: "#1877f2" }}
                >
                  role-based access
                </Box>
                . These settings ensure that only authorized users can access
                tickets, reports, and configurations.
              </Typography>
            </CardContent>
          </Card>

          {/* Additional Security Options */}
          <Card sx={{ boxShadow: "0 2px 8px rgba(0,0,0,0.1)", height: "100%" }}>
            <CardContent>
              <Typography
                variant="h6"
                sx={{ fontWeight: 600, mb: 2, color: "#1a1a1a" }}
              >
                Advanced Security Options
              </Typography>
              <Typography
                variant="body2"
                sx={{ lineHeight: 1.6, color: "#65676b", mb: 2 }}
              >
                Fine-tune your security policies to match organizational
                requirements.
              </Typography>

              <Typography
                variant="subtitle2"
                sx={{ fontWeight: 600, color: "#1a1a1a", mb: 1 }}
              >
                Recommended Settings:
              </Typography>
              <Box component="ul" sx={{ pl: 2, m: 0, "& li": { mb: 1 } }}>
                <Typography
                  component="li"
                  variant="body2"
                  sx={{ lineHeight: 1.6, color: "#65676b" }}
                >
                  <Box
                    component="span"
                    sx={{ fontWeight: 600, color: "#1877f2" }}
                  >
                    Password policies:
                  </Box>{" "}
                  Enforce complexity rules and regular password rotation.
                </Typography>
                <Typography
                  component="li"
                  variant="body2"
                  sx={{ lineHeight: 1.6, color: "#65676b" }}
                >
                  <Box
                    component="span"
                    sx={{ fontWeight: 600, color: "#1877f2" }}
                  >
                    IP restrictions:
                  </Box>{" "}
                  Limit login access to specific IP ranges for higher security.
                </Typography>
                <Typography
                  component="li"
                  variant="body2"
                  sx={{ lineHeight: 1.6, color: "#65676b" }}
                >
                  <Box
                    component="span"
                    sx={{ fontWeight: 600, color: "#1877f2" }}
                  >
                    Session management:
                  </Box>{" "}
                  Control session timeout, concurrent logins, and device
                  tracking.
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Box>
  );
};

export default AccountSecurity;
