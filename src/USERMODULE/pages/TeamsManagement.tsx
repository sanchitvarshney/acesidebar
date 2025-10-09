import { useState } from "react";

import {
  Box,
  Button,
  IconButton,
  Typography,
  Stack,
  TextField,
  MenuItem,
  Menu,
  Divider,
  Chip,
  Popover,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  LinearProgress,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

import PersonIcon from "@mui/icons-material/Person";
import BusinessIcon from "@mui/icons-material/Business";
import WorkIcon from "@mui/icons-material/Work";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Close } from "@mui/icons-material";
import RefreshIcon from "@mui/icons-material/Refresh";

// Column definitions for teams
const teamColumns = [
  {
    id: "name",
    label: "Team Name",
    minWidth: 200,
    align: "left" as const,
  },
  {
    id: "description",
    label: "Description",
    minWidth: 250,
    align: "left" as const,
  },
  {
    id: "members",
    label: "Members",
    minWidth: 100,
    align: "center" as const,
  },
  {
    id: "department",
    label: "Department",
    minWidth: 150,
    align: "left" as const,
  },
  {
    id: "status",
    label: "Status",
    minWidth: 100,
    align: "center" as const,
  },
  {
    id: "created",
    label: "Created",
    minWidth: 120,
    align: "left" as const,
  },
  {
    id: "actions",
    label: "Actions",
    minWidth: 100,
    align: "center" as const,
  },
];

// Sample team data
const sampleTeams = [
  {
    id: 1,
    name: "Customer Support Team",
    description:
      "Primary customer support team handling all customer inquiries",
    members: 8,
    department: "Customer Service",
    status: "Active",
    created: "2024-01-15",
    memberList: [
      {
        id: 1,
        name: "John Doe",
        email: "john.doe@company.com",
        role: "Team Lead",
      },
      {
        id: 2,
        name: "Jane Smith",
        email: "jane.smith@company.com",
        role: "Senior Agent",
      },
      {
        id: 3,
        name: "Mike Johnson",
        email: "mike.johnson@company.com",
        role: "Agent",
      },
      {
        id: 4,
        name: "Sarah Wilson",
        email: "sarah.wilson@company.com",
        role: "Agent",
      },
      {
        id: 5,
        name: "David Brown",
        email: "david.brown@company.com",
        role: "Agent",
      },
      {
        id: 6,
        name: "Lisa Davis",
        email: "lisa.davis@company.com",
        role: "Agent",
      },
      {
        id: 7,
        name: "Tom Miller",
        email: "tom.miller@company.com",
        role: "Agent",
      },
      {
        id: 8,
        name: "Amy Garcia",
        email: "amy.garcia@company.com",
        role: "Agent",
      },
    ],
  },
  {
    id: 2,
    name: "Technical Support Team",
    description: "Technical support team for complex technical issues",
    members: 5,
    department: "IT Support",
    status: "Active",
    created: "2024-01-20",
    memberList: [
      {
        id: 9,
        name: "Alex Chen",
        email: "alex.chen@company.com",
        role: "Team Lead",
      },
      {
        id: 10,
        name: "Maria Rodriguez",
        email: "maria.rodriguez@company.com",
        role: "Senior Engineer",
      },
      {
        id: 11,
        name: "Kevin Lee",
        email: "kevin.lee@company.com",
        role: "Engineer",
      },
      {
        id: 12,
        name: "Emma Taylor",
        email: "emma.taylor@company.com",
        role: "Engineer",
      },
      {
        id: 13,
        name: "Chris Anderson",
        email: "chris.anderson@company.com",
        role: "Engineer",
      },
    ],
  },
  {
    id: 3,
    name: "Sales Team",
    description:
      "Sales team responsible for customer acquisition and retention",
    members: 6,
    department: "Sales",
    status: "Active",
    created: "2024-02-01",
    memberList: [
      {
        id: 14,
        name: "Robert Wilson",
        email: "robert.wilson@company.com",
        role: "Sales Manager",
      },
      {
        id: 15,
        name: "Jennifer Martinez",
        email: "jennifer.martinez@company.com",
        role: "Senior Sales Rep",
      },
      {
        id: 16,
        name: "Daniel Thompson",
        email: "daniel.thompson@company.com",
        role: "Sales Rep",
      },
      {
        id: 17,
        name: "Michelle White",
        email: "michelle.white@company.com",
        role: "Sales Rep",
      },
      {
        id: 18,
        name: "James Harris",
        email: "james.harris@company.com",
        role: "Sales Rep",
      },
      {
        id: 19,
        name: "Ashley Clark",
        email: "ashley.clark@company.com",
        role: "Sales Rep",
      },
    ],
  },
  {
    id: 4,
    name: "Marketing Team",
    description: "Marketing team handling campaigns and brand management",
    members: 4,
    department: "Marketing",
    status: "Inactive",
    created: "2024-02-10",
    memberList: [
      {
        id: 20,
        name: "Rachel Green",
        email: "rachel.green@company.com",
        role: "Marketing Manager",
      },
      {
        id: 21,
        name: "Steven King",
        email: "steven.king@company.com",
        role: "Marketing Specialist",
      },
      {
        id: 22,
        name: "Nicole Scott",
        email: "nicole.scott@company.com",
        role: "Content Creator",
      },
      {
        id: 23,
        name: "Brandon Adams",
        email: "brandon.adams@company.com",
        role: "Graphic Designer",
      },
    ],
  },
];

const TeamsManagement = () => {
  const navigate = useNavigate();
  const [teams, setTeams] = useState(sampleTeams);
  const [filteredTeams, setFilteredTeams] = useState(sampleTeams);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [departmentFilter, setDepartmentFilter] = useState("All");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedTeam, setSelectedTeam] = useState<any>(null);
  const [showMemberDetails, setShowMemberDetails] = useState(false);
  const [memberDetailsAnchor, setMemberDetailsAnchor] =
    useState<null | HTMLElement>(null);

  // Get unique departments for filter
  const departments = Array.from(new Set(teams.map((team) => team.department)));

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchTerm(value);
    applyFilters(value, statusFilter, departmentFilter);
  };

  const handleStatusFilter = (event: any) => {
    const value = event.target.value;
    setStatusFilter(value);
    applyFilters(searchTerm, value, departmentFilter);
  };

  const handleDepartmentFilter = (event: any) => {
    const value = event.target.value;
    setDepartmentFilter(value);
    applyFilters(searchTerm, statusFilter, value);
  };

  const applyFilters = (search: string, status: string, department: string) => {
    let filtered = teams;

    // Search filter
    if (search) {
      filtered = filtered.filter(
        (team) =>
          team.name.toLowerCase().includes(search.toLowerCase()) ||
          team.description.toLowerCase().includes(search.toLowerCase()) ||
          team.department.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Status filter
    if (status !== "All") {
      filtered = filtered.filter((team) => team.status === status);
    }

    // Department filter
    if (department !== "All") {
      filtered = filtered.filter((team) => team.department === department);
    }

    setFilteredTeams(filtered);
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, team: any) => {
    setAnchorEl(event.currentTarget);
    setSelectedTeam(team);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedTeam(null);
  };

  const handleViewMembers = (
    event: React.MouseEvent<HTMLElement>,
    team: any
  ) => {
    setMemberDetailsAnchor(event.currentTarget);
    setSelectedTeam(team);
    setShowMemberDetails(true);
  };

  const handleMemberDetailsClose = () => {
    setMemberDetailsAnchor(null);
    setSelectedTeam(null);
    setShowMemberDetails(false);
  };

  const handleEditTeam = () => {
    navigate(`/edit-team/${selectedTeam.id}`);
    handleMenuClose();
  };

  const handleDeleteTeam = () => {
    if (
      window.confirm(`Are you sure you want to delete "${selectedTeam.name}"?`)
    ) {
      setTeams(teams.filter((team) => team.id !== selectedTeam.id));
      setFilteredTeams(
        filteredTeams.filter((team) => team.id !== selectedTeam.id)
      );
    }
    handleMenuClose();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "success";
      case "Inactive":
        return "error";
      default:
        return "default";
    }
  };

  return (
    <Box
      sx={{
        height: "calc(100vh - 100px)",
        display: "grid",
        // gridTemplateColumns: "3fr 1fr",
        overflow: "hidden",
      }}
    >
      {/* Left Content */}
      <Box sx={{ p: 2, display: "flex", flexDirection: "column", gap: 2 }}>
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
            <IconButton
              onClick={() => navigate("/settings/agents-productivity")}
            >
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h5" sx={{ fontWeight: 600, color: "#1a1a1a" }}>
              Teams
            </Typography>
          </Box>

          <Box sx={{ display: "flex", gap: 2 }}>
            <IconButton
              size="small"
              color="primary"
              onClick={() => window.location.reload()}
              sx={{ border: "1px solid #e0e0e0" }}
              aria-label="Refresh"
              title="Refresh"
            >
              <RefreshIcon fontSize="small" />
            </IconButton>
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate("/create-team")}
              size="small"
            >
              New Team
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
            placeholder="Search teams..."
            value={searchTerm}
            onChange={handleSearch}
            InputProps={{
              startAdornment: <SearchIcon sx={{ color: "#666", mr: 1 }} />,
            }}
            sx={{ minWidth: 250 }}
          />

          <TextField
            select
            size="small"
            label="Status"
            value={statusFilter}
            onChange={handleStatusFilter}
            sx={{ minWidth: 120 }}
          >
            <MenuItem value="All">All</MenuItem>
            <MenuItem value="Active">Active</MenuItem>
            <MenuItem value="Inactive">Inactive</MenuItem>
          </TextField>

          <TextField
            select
            size="small"
            label="Department"
            value={departmentFilter}
            onChange={handleDepartmentFilter}
            sx={{ minWidth: 150 }}
          >
            <MenuItem value="All">All</MenuItem>
            {departments.map((dept) => (
              <MenuItem key={dept} value={dept}>
                {dept}
              </MenuItem>
            ))}
          </TextField>
        </Box>

        {/* Teams Table */}
        <Paper sx={{ flex: 1, overflow: "hidden" }}>
          <TableContainer sx={{ height: "100%" }}    className="custom-scrollbar">
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
                  {teamColumns.map((column) => (
                    <TableCell
                      key={column.id}
                      align={column.align}
                      style={{ minWidth: column.minWidth }}
                      sx={{ fontWeight: 600, bgcolor: "#f8f9fa" }}
                    >
                      {column.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredTeams.map((team) => (
                  <TableRow key={team.id} hover>
                    <TableCell>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <WorkIcon sx={{ color: "#666" }} />
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {team.name}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {team.description}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        label={team.members}
                        size="small"
                        color="primary"
                        variant="outlined"
                        onClick={(e) => handleViewMembers(e, team)}
                        sx={{ cursor: "pointer" }}
                      />
                    </TableCell>
                    <TableCell>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <BusinessIcon sx={{ color: "#666", fontSize: 16 }} />
                        <Typography variant="body2">
                          {team.department}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        label={team.status}
                        size="small"
                        color={getStatusColor(team.status) as any}
                        variant="filled"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {team.created}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <IconButton
                        size="small"
                        onClick={(e) => handleMenuClick(e, team)}
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
      </Box>

      {/* Right Sidebar */}

      {/* Member Details Popover */}
      <Popover
        open={showMemberDetails}
        anchorEl={memberDetailsAnchor}
        onClose={handleMemberDetailsClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
      >
        <Paper sx={{ p: 2, minWidth: 300, maxWidth: 400 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: 2,
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {selectedTeam?.name} Members
            </Typography>
            <IconButton size="small" onClick={handleMemberDetailsClose}>
              <Close />
            </IconButton>
          </Box>

          <Stack spacing={1}>
            {selectedTeam?.memberList?.map((member: any) => (
              <Box
                key={member.id}
                sx={{
                  p: 1.5,
                  border: "1px solid #e0e0e0",
                  borderRadius: 1,
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                <PersonIcon sx={{ color: "#666" }} />
                <Box sx={{ flex: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {member.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {member.email}
                  </Typography>
                </Box>
                <Chip
                  label={member.role}
                  size="small"
                  variant="outlined"
                  color="primary"
                />
              </Box>
            ))}
          </Stack>
        </Paper>
      </Popover>
    </Box>
  );
};

export default TeamsManagement;
