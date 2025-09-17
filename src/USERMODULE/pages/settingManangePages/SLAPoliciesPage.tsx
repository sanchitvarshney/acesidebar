import { useMemo, useState } from "react";

import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  IconButton,
  LinearProgress,
  Menu,
  MenuItem,
  Paper,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AddIcon from "@mui/icons-material/Add";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import RefreshIcon from "@mui/icons-material/Refresh";
import { useNavigate } from "react-router-dom";
import CustomToolTip from "../../../reusable/CustomToolTip";

type SlaPolicy = {
  id: number;
  name: string;
  description: string;
  priority: "Low" | "Medium" | "High" | "Urgent";
  responseInHrs: number;
  resolveInHrs: number;
  isDefault?: boolean;
  isActive: boolean;
};

const samplePolicies: SlaPolicy[] = [
  {
    id: 1,
    name: "Default policy",
    description:
      "Ensures every ticket has an SLA if no other custom SLA matches the ticket.",
    priority: "Medium",
    responseInHrs: 4,
    resolveInHrs: 24,
    isDefault: true,
    isActive: true,
  },
];

const SLAPoliciesPage = () => {
  const navigate = useNavigate();
  const [policies, setPolicies] = useState<SlaPolicy[]>(samplePolicies);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedPolicy, setSelectedPolicy] = useState<SlaPolicy | null>(null);
  const isMenuOpen = Boolean(anchorEl);

  const orderedPolicies = useMemo(() => {
    // Default first, then others in insertion order
    return [...policies].sort((a, b) =>
      a.isDefault ? -1 : b.isDefault ? 1 : 0
    );
  }, [policies]);

  const togglePolicy = (id: number) => {
    setPolicies((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isActive: !p.isActive } : p))
    );
  };

  const openMenu = (
    event: React.MouseEvent<HTMLButtonElement>,
    policy: SlaPolicy
  ) => {
    setAnchorEl(event.currentTarget);
    setSelectedPolicy(policy);
  };

  const closeMenu = () => {
    setAnchorEl(null);
    setSelectedPolicy(null);
  };

  const handleDuplicate = () => {
    if (!selectedPolicy) return;
    const copy: SlaPolicy = {
      ...selectedPolicy,
      id: Date.now(),
      name: `${selectedPolicy.name} (Copy)`,
      isDefault: false,
      isActive: false,
    };
    setPolicies((prev) => [copy, ...prev]);
    closeMenu();
  };

  const handleDelete = () => {
    if (!selectedPolicy) return;
    if (selectedPolicy.isDefault) {
      alert("Default policy cannot be deleted");
      return;
    }
    setPolicies((prev) => prev.filter((p) => p.id !== selectedPolicy.id));
    closeMenu();
  };

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
      <Box sx={{ p: 2, display: "flex", flexDirection: "column", gap: 2 }}>
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 1,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <IconButton
              onClick={() => navigate("/settings/workflow")}
            >
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h5" sx={{ fontWeight: 600, color: "#1a1a1a" }}>
              SLA Policies
            </Typography>
          </Box>

          <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
            <IconButton
              size="small"
              aria-label="Refresh"
              title="Refresh"
              sx={{ border: "1px solid #e0e0e0" }}
            >
              <RefreshIcon fontSize="small" />
            </IconButton>
            {/* <Button
              variant="contained"
              size="small"
              startIcon={<AddIcon />}
              onClick={() => alert("Create SLA Policy - to be implemented")}
            >
              New Policy
            </Button> */}
          </Box>
        </Box>

        <TableContainer sx={{ height: "100%", position: "relative", border: "none" }} >
          {/* If loading in future */}
          {/* <LinearProgress sx={{ position: "absolute", top: 0, left: 0, right: 0 }} /> */}
          <Table
            stickyHeader
            sx={{
              "& .MuiTableCell-root": { borderBottom: "none" },
            }}
          >
            <TableHead>
              <TableRow sx={{ bgcolor: "#f8f9fa" }}>
                <TableCell sx={{ fontWeight: 600 }}>Policy</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orderedPolicies.map((policy, idx) => (
                <TableRow key={policy.id} sx={{ "&:hover": { backgroundColor: "transparent" } }}>
                  <TableCell>
                    <Box sx={{ display: "flex", flexDirection: "column" }}>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                          {idx + 1}. {policy.name}
                        </Typography>
                        {policy.isDefault && (
                          <Chip
                            label="Default"
                            size="small"
                            color="primary"
                            variant="outlined"
                          />
                        )}
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        {policy.description}
                      </Typography>
                    </Box>
                  </TableCell>
            
                
                  <TableCell align="center">
                    <CustomToolTip title={<Typography variant="body2" sx={{p:0.5}}>Default Policy cannot be turnned off</Typography>}>
                      <Box component="span" sx={{ display: "inline-block", cursor: "not-allowed" }}>
                        <Switch
                          checked={policy.isActive}
                          onChange={() => togglePolicy(policy.id)}
                          disabled
                        />
                      </Box>
                    </CustomToolTip>
                  </TableCell>
                  <TableCell align="center">
                    <IconButton
                      size="small"
                      onClick={(e) => openMenu(e as any, policy)}
                    >
                      <MoreVertIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
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
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                SLA policy
              </Typography>
              <Typography variant="body2" color="text.secondary">
                A service level agreement (SLA) lets you set response and
                resolution targets for your support team. You can have multiple
                policies that trigger on conditions like priority, requester
                type, group, or product. The first matching policy will be
                applied to a ticket.
              </Typography>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                Using Multiple SLA Policies
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Order your policies carefully. Move the most specific rules
                higher so they match before generic ones like the default
                policy.
              </Typography>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                SLA reminders
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Configure notifications when a ticket is nearing or breaching
                its target to keep agents on track.
              </Typography>
            </CardContent>
          </Card>
        </Box>
      </Box>

      {/* Actions menu */}
      <Menu anchorEl={anchorEl} open={isMenuOpen} onClose={closeMenu}>
        <MenuItem
          onClick={() => {
            const id = selectedPolicy?.id ?? 0;
            closeMenu();
            navigate(`/sla-policies/${id}`);
          }}
        >
          Edit
        </MenuItem>
        {/* <MenuItem onClick={handleDuplicate}>Duplicate</MenuItem> */}
        <MenuItem onClick={handleDelete} sx={{ color: "error.main" }}>
          Delete
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default SLAPoliciesPage;
