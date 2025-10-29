import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  IconButton,
  Card,
  CardContent,
  Button,
  TextField,
  TableContainer,
  Table,
  TableHead,
  LinearProgress,
  TableRow,
  TableCell,
  TableBody,
  Chip,
  Menu,
  MenuItem,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import RefreshIcon from "@mui/icons-material/Refresh";
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate } from "react-router-dom";
import { SettingsIcon } from "lucide-react";
import { Stars } from "@mui/icons-material";
import MoreVertIcon from "@mui/icons-material/MoreVert";

const emailSample = [
  {
    product: "Product 1",
    name: "name 1",
    email: "Email 1",
    group: "Group 1",
    status: "Active",
  },
  {
    product: "Product 2",
    name: "name 2",
    email: "Email 2",
    group: "Group 2",
    status: "Inactive",
  },
  {
    product: "Product 3",
    name: "name 3",
    email: "Email 3",
    group: "Group 3",
    status: "Active",
  },
];

const EmailServerPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredTeams, setFilteredTeams] = useState(emailSample);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedTeam, setSelectedTeam] = useState<any>(null);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, team: any) => {
    setAnchorEl(event.currentTarget);
    setSelectedTeam(team);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedTeam(null);
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchTerm(value);
    applyFilters(searchTerm);
  };

  const applyFilters = (search: string) => {
    let filtered = emailSample;

    // Search filter
    if (search) {
      filtered = filtered.filter((team) =>
        team.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    setFilteredTeams(filtered);
  };
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
      <Box sx={{ p: 0, display: "flex", flexDirection: "column", gap: 2 }}>
        {/* Header Section */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 1,
                 p: 2,
               borderBottom: "1px solid #e0e0e0",
          backgroundColor: "#fafafa",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <IconButton
              onClick={() => navigate("/settings/emails")}
            >
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h5" sx={{ fontWeight: 600, color: "#1a1a1a" }}>
              Email Server
            </Typography>
          </Box>

          <Box sx={{ display: "flex", gap: 2 }}>
          
            <Button
              variant="outlined"
              color="primary"
              onClick={() =>
                navigate("/settings/emails/email-settings-advanced")
              }
              size="small"
              sx={{ fontWeight: 600 }}
              startIcon={<SettingsIcon size={18}/>}
            >
              Advanced setting
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate("/settings/emails/new-support-email")}
              size="small"
              sx={{ fontWeight: 600 }}
            >
              New support email
            </Button>
          </Box>
        </Box>
        {/* Filter Section */}
        <Box
          sx={{
            display: "flex",
            gap: 2,
            alignItems: "center",
            flexWrap: "wrap",
            p: 2,
            bgcolor: "#f8f9fa",
            borderRadius: 2,
          }}
        >
          <TextField
            size="small"
            placeholder="Search email addresses"
            value={searchTerm}
            onChange={handleSearch}
            InputProps={{
              startAdornment: <SearchIcon sx={{ color: "#666", mr: 1 }} />,
            }}
            sx={{ minWidth: 250 }}
          />
        </Box>
        <div className="w-full max-h-[calc(100vh-180px)] p-2 overflow-y-auto custom-scrollbar">
          {/* Teams Table */}
          <Paper sx={{ flex: 1, overflow: "hidden" }}>
            <TableContainer sx={{ height: "100%" }}>
              <Table stickyHeader sx={{ position: "relative" }}>
                <TableHead>
                  {false && (
                    <LinearProgress
                      sx={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        zIndex: 10,
                        height: 4,
                        "& .MuiLinearProgress-bar": {
                          backgroundColor: "#1976d2",
                        },
                        "& .MuiLinearProgress-root": {
                          backgroundColor: "#e0e0e0",
                        },
                      }}
                    />
                  )}
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600, bgcolor: "#f8f9fa" }}>
                      Product
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600, bgcolor: "#f8f9fa" }}>
                      Name
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600, bgcolor: "#f8f9fa" }}>
                      Email address
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600, bgcolor: "#f8f9fa" }}>
                      Group
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600, bgcolor: "#f8f9fa" }}>
                      Status
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600, bgcolor: "#f8f9fa" }}>
                      Action
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredTeams.map((row: any, index) => (
                    <TableRow key={index} hover>
                      <TableCell>
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <Stars sx={{ color: "#666" }} />
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {row.product}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {row.name}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{row.email}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{row.group}</Typography>
                      </TableCell>

                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {row.status}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <IconButton
                          size="small"
                          onClick={(e) => handleMenuClick(e, row)}
                        >
                          <MoreVertIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </div>
        {/* Action Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={() => {}}>Edit</MenuItem>
          {/* <MenuItem
            onClick={() => {
              const mockEvent = { currentTarget: null } as any;
              handleViewMembers(mockEvent, selectedTeam);
            }}
          >
            <VisibilityIcon sx={{ mr: 1 }} />
            View Members
          </MenuItem>
          <Divider />
          <MenuItem onClick={handleDeleteTeam} sx={{ color: "error.main" }}>
            <DeleteIcon sx={{ mr: 1 }} />
            Delete Team
          </MenuItem> */}
        </Menu>
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
        className="custom-scrollbar"
      >
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <Card sx={{ boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
            <CardContent>
              <Typography
                variant="h6"
                sx={{ fontWeight: 600, mb: 2, color: "#1a1a1a" }}
              >
                Connect your email
              </Typography>
              <Typography
                variant="body2"
                sx={{ lineHeight: 1.6, color: "#65676b" }}
              >
                Enter your support email address to get started. Any email sent
                here will automatically convert into a ticket you can work on.
              </Typography>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Box>
  );
};

export default EmailServerPage;
