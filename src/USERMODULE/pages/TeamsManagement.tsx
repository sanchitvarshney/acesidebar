import { useState } from "react";

import {
  Box,
  Button,
  IconButton,
  Typography,
  Stack,
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
  Divider,
  Menu,
  MenuItem,
  FormControlLabel,
  Checkbox,
  TextField,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ControlPointDuplicateIcon from "@mui/icons-material/ControlPointDuplicate";
import PersonIcon from "@mui/icons-material/Person";
import BusinessIcon from "@mui/icons-material/Business";
import WorkIcon from "@mui/icons-material/Work";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Close } from "@mui/icons-material";
import RefreshIcon from "@mui/icons-material/Refresh";
import AddIcon from "@mui/icons-material/Add";
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
  const [selectedTeam, setSelectedTeam] = useState<any>(null);
  const [showMemberDetails, setShowMemberDetails] = useState(false);
  const [memberDetailsAnchor, setMemberDetailsAnchor] =
    useState<null | HTMLElement>(null);

  const [modelOpenref, setModelOpenref] = useState<null | HTMLElement>(null);
  const [lastChipRef, setLastChipRef] = useState<null | HTMLElement>(null);
  const [activeFilters, setActiveFilters] = useState<
    Array<{
      id: string;
      field: string;
      operator: string;
      value: string;
      label: string;
    }>
  >([]);
  const [filterMenuAnchor, setFilterMenuAnchor] = useState<null | HTMLElement>(
    null
  );
  const [selectedFilterField, setSelectedFilterField] = useState<{
    field: string;
    label: string;
    type?: string;
    options?: string[];
    operators?: string[];
    defaultOperator?: string;
  } | null>(null);
  const [filterValue, setFilterValue] = useState("");
  const [selectedOperator, setSelectedOperator] = useState("startsWith");
  const [checkboxValues, setCheckboxValues] = useState<string[]>([]);
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  // Field options for filter - Corporate relevant filters
  const fieldOptions = [
    {
      value: "departmentName",
      label: "Department Name",
      icon: <BusinessIcon />,
      type: "text",
      operator: "startsWith",
    },
    {
      value: "manager",
      label: "Department Manager",
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
      value: "agentCount",
      label: "Team Size",
      icon: <PersonIcon />,
      type: "number",
      operator: "equals",
    },
    {
      value: "departmentType",
      label: "Department Type",
      icon: <BusinessIcon />,
      type: "multiCheckbox",
      options: [
        "Support",
        "Sales",
        "Technical",
        "Administrative",
        "Finance",
        "HR",
        "Operations",
      ],
      operator: "equals",
    },
  ];

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

  const removeFilter = (filterId: string) => {
    setActiveFilters(activeFilters.filter((filter) => filter.id !== filterId));
  };
  const clearAllFilters = () => {
    setActiveFilters([]);
  };
  // Open filter dialog for selected field
  const openFilterDialog = (field: string, label: string) => {
    if (activeFilters.length >= 5) {
      alert("Maximum 5 filters allowed");
      return;
    }

    const fieldOption = fieldOptions.find((option) => option.value === field);
    setSelectedFilterField({ field, label, ...fieldOption });

    if (fieldOption?.type === "multiCheckbox") {
      setCheckboxValues([]);
      setFilterValue("");
      setSelectedOperator(fieldOption.operator || "equals");
    } else {
      setFilterValue("");
      setSelectedOperator(fieldOption?.operator || "startsWith");
    }
    setCheckboxValues([]);

    setFilterDialogOpen(true);
  };

  // Apply filters to data
  const applyFilters = (data: any[]) => {
    return data.filter((row: any) => {
      return activeFilters.every((filter) => {
        if (!filter.value || filter.value.trim() === "") {
          return true;
        }

        const cellValue = row[filter.field]?.toString() || "";
        const filterValue = filter.value;

        // Handle multiCheckbox filters (Status)
        if (filter.field === "isActive" && filter.value.includes(",")) {
          const selectedStatuses = filter.value.split(", ");
          const isActive = row.isActive !== false;
          const status = isActive ? "Active" : "Inactive";
          return filter.operator === "equals"
            ? selectedStatuses.includes(status)
            : !selectedStatuses.includes(status);
        }

        // Handle number filters
        if (filter.field === "agentCount") {
          const cellNum = parseFloat(cellValue) || 0;
          const filterNum = parseFloat(filterValue) || 0;

          switch (filter.operator) {
            case "equals":
              return cellNum === filterNum;
            case "doesNotEqual":
              return cellNum !== filterNum;
            case "greaterThan":
              return cellNum > filterNum;
            case "lessThan":
              return cellNum < filterNum;
            case "greaterThanOrEqual":
              return cellNum >= filterNum;
            case "lessThanOrEqual":
              return cellNum <= filterNum;
            default:
              return true;
          }
        }

        // Handle text filters
        const cellValueLower = cellValue.toLowerCase();
        const filterValueLower = filterValue.toLowerCase();

        switch (filter.operator) {
          case "contains":
            return cellValueLower.includes(filterValueLower);
          case "equals":
            return cellValueLower === filterValueLower;
          case "doesNotEqual":
            return cellValueLower !== filterValueLower;
          case "startsWith":
            return cellValueLower.startsWith(filterValueLower);
          case "endsWith":
            return cellValueLower.endsWith(filterValueLower);
          case "doesNotContain":
            return !cellValueLower.includes(filterValueLower);
          default:
            return true;
        }
      });
    });
  };
  // Apply filter from dialog
  const applyFilter = () => {
    let valueToUse = "";
    let isValidFilter = false;

    if (selectedFilterField?.type === "multiCheckbox") {
      isValidFilter = checkboxValues.length > 0;
      valueToUse = checkboxValues.join(", ");
    } else if (selectedFilterField?.type === "number") {
      isValidFilter = filterValue.trim() !== "";
      valueToUse = filterValue.trim();
    } else {
      isValidFilter = filterValue.trim() !== "";
      valueToUse = filterValue.trim();
    }

    if (selectedFilterField && isValidFilter) {
      const existingFilterIndex = activeFilters.findIndex(
        (filter) => filter.field === selectedFilterField.field
      );

      const newFilter = {
        id: Date.now().toString(),
        field: selectedFilterField.field,
        operator: selectedOperator,
        value: valueToUse,
        label: selectedFilterField.label,
      };

      if (existingFilterIndex >= 0) {
        const updatedFilters = [...activeFilters];
        updatedFilters[existingFilterIndex] = newFilter;
        setActiveFilters(updatedFilters);
      } else {
        setActiveFilters([...activeFilters, newFilter]);
      }

      setFilterDialogOpen(false);
      setFilterValue("");
      setSelectedFilterField(null);
    }
  };

  // Apply custom filters
  let filterData = sampleTeams;
  filterData = applyFilters(filterData);

  return (
    <Box
      sx={{
        height: "calc(100vh - 100px)",
     
      }}
    >
      {/* Left Content */}
      <Box sx={{ p: 0, display: "flex", flexDirection: "column", gap: 1 }}>
        {/* Header Section */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            p: 2,
            borderBottom: "1px solid #e0e0e0",
            backgroundColor: "#fafafa",
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
              sx={{ fontWeight: 600 }}
              startIcon={<ControlPointDuplicateIcon />}
            >
              New Team
            </Button>
          </Box>
        </Box>

 
          <Box
            sx={{
              backgroundColor: "#fff",
              borderRadius: 1,
              border: "1px solid #e0e0e0",

              display: "grid",
              gridTemplateColumns: "80% 20%",
              overflow: "hidden",
              mx:1
            }}
          >
            {/* 80% Editable Area */}
            <Box
              sx={{
                p: 3,
                cursor: activeFilters.length < 5 ? "pointer" : "default",
                display: "flex",
                flexDirection: "column",
                gap: 2,
                borderRight: "1px solid #e0e0e0",
                "&:hover":
                  activeFilters.length < 5
                    ? {
                        backgroundColor: "#f8f9fa",
                      }
                    : {},
              }}
              onClick={
                activeFilters.length < 5
                  ? (event) => setFilterMenuAnchor(event.currentTarget)
                  : undefined
              }
            >
              {/* Editable Filter Input Area - Show only when no filters */}
              {activeFilters.length === 0 && (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    flex: 1,
                  }}
                >
                  <IconButton
                    size="small"
                    sx={{
                      backgroundColor: "#f5f5f5",
                      color: "#666",
                      width: 32,
                      height: 32,
                      "&:hover": {
                        backgroundColor: "#e0e0e0",
                      },
                    }}
                  >
                    <AddIcon fontSize="small" />
                  </IconButton>

                  <Typography
                    variant="body1"
                    sx={{
                      color: "#999",
                      fontSize: "0.875rem",
                      fontStyle: "italic",
                      userSelect: "none",
                      flex: 1,
                    }}
                  >
                    Add a filter
                  </Typography>
                </Box>
              )}

              {/* Applied Filters Display in Editable Area */}
              {activeFilters.length > 0 && (
                <Stack
                  direction="row"
                  spacing={1}
                  flexWrap="wrap"
                  useFlexGap
                  sx={{ alignItems: "center" }}
                >
                  {activeFilters.map((filter, index) => (
                    <Chip
                      key={filter.id}
                      ref={
                        index === activeFilters.length - 1
                          ? setLastChipRef
                          : null
                      }
                      label={`${filter.label}: "${filter.value}"`}
                      onDelete={(e) => {
                        e.stopPropagation();
                        removeFilter(filter.id);
                      }}
                      size="small"
                      sx={{
                        backgroundColor: "#e8e8e8",
                        color: "#333",
                        fontSize: "0.875rem",
                        fontWeight: 500,
                        "& .MuiChip-deleteIcon": {
                          color: "#666",
                          "&:hover": {
                            color: "#333",
                          },
                        },
                      }}
                    />
                  ))}

                  {/* Add filter placeholder after existing filters */}
                  {activeFilters.length < 5 && (
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        padding: "6px 12px",
                        borderRadius: "16px",
                        border: "1px dashed #d0d0d0",
                        backgroundColor: "#f9f9f9",
                        cursor: "pointer",
                        color: "#999",
                        fontSize: "0.875rem",
                        "&:hover": {
                          borderColor: "#03363d",
                          backgroundColor: "#f5f5f5",
                          color: "#666",
                        },
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setFilterMenuAnchor(e.currentTarget);
                      }}
                    >
                      <AddIcon fontSize="small" />
                      <Typography
                        variant="body2"
                        sx={{ fontSize: "0.875rem", fontStyle: "italic" }}
                      >
                        Add a filter
                      </Typography>
                    </Box>
                  )}
                </Stack>
              )}
            </Box>

            {/* 20% Actions Area */}
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 1,
                p: 2,
                backgroundColor: "#f8f9fa",
                borderLeft: "1px solid #e0e0e0",
              }}
            >
              {/* Action buttons row */}
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  gap: 1,
                  alignItems: "center",
                }}
              >
                {/* Clear all Filter button */}
                {activeFilters.length > 0 && (
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      clearAllFilters();
                    }}
                    sx={{
                      borderColor: "#e0e0e0",
                      color: "#666",
                      textTransform: "none",
                      fontSize: "0.75rem",
                      minWidth: "auto",
                      padding: "4px 8px",
                      "&:hover": {
                        borderColor: "#d32f2f",
                        color: "#d32f2f",
                        backgroundColor: "#fff5f5",
                      },
                    }}
                  >
                    Clear all Filter
                  </Button>
                )}

                {/* Search icon */}
                <IconButton
                  size="small"
                  sx={{
                    color: "#666",
                    border: "1px solid #e0e0e0",
                    "&:hover": {
                      color: "#03363d",
                      borderColor: "#03363d",
                      backgroundColor: "#f5f5f5",
                    },
                  }}
                >
                  <SearchIcon fontSize="small" />
                </IconButton>
              </Box>

              {/* Filter counter */}
              {activeFilters.length > 0 && (
                <Typography
                  variant="body2"
                  sx={{
                    color: activeFilters.length >= 5 ? "#f57c00" : "#999",
                    fontSize: "0.7rem",
                    textAlign: "center",
                    fontStyle: "italic",
                  }}
                >
                  {activeFilters.length >= 5
                    ? "Maximum 5 filters reached"
                    : `${activeFilters.length}/5`}
                </Typography>
              )}
            </Box>
          </Box>
  

        {/* Teams Table */}
        <Paper sx={{ flex: 1, overflow: "hidden", mx: 1 }}>
          <TableContainer sx={{ height: "100%" }} className="custom-scrollbar">
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
                        backgroundColor: "#03363d",
                      },
                      "& .MuiLinearProgress-root": {
                        backgroundColor: "#e0e0e0",
                      },
                    }}
                  />
                )}
                <TableRow>
                  {teamColumns.map((column: any) => (
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
                {filterData.map((team) => (
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

      <Menu
        anchorEl={
          activeFilters.length > 0 && lastChipRef
            ? lastChipRef
            : filterMenuAnchor
        }
        open={Boolean(filterMenuAnchor)}
        onClose={() => setFilterMenuAnchor(null)}
        PaperProps={{
          elevation: 3,
          sx: {
            overflow: "visible",
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
            mt: 1.5,
            minWidth: 200,
            maxHeight: 400,
            "&:before": {
              content: '""',
              display: "block",
              position: "absolute",
              top: 0,
              left: 28,
              width: 10,
              height: 10,
              bgcolor: "background.paper",
              transform: "translateY(-50%) rotate(45deg)",
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: "left", vertical: "top" }}
        anchorOrigin={{
          horizontal: activeFilters.length > 0 ? "right" : "left",
          vertical: "bottom",
        }}
      >
        {fieldOptions.map((option) => (
          <MenuItem
            key={option.value}
            onClick={(e) => {
              e.stopPropagation();
              setModelOpenref(filterMenuAnchor);
              setFilterMenuAnchor(null);
              openFilterDialog(option.value, option.label);
            }}
            disabled={activeFilters.some(
              (filter) => filter.field === option.value
            )}
            sx={{
              py: 1,
              px: 2,
              fontSize: "0.875rem",
              "&:hover": {
                backgroundColor: "#f5f5f5",
              },
              "&.Mui-disabled": {
                opacity: 0.5,
              },
            }}
          >
            <Typography variant="body2" sx={{ fontWeight: 400 }}>
              {option.label}
            </Typography>
          </MenuItem>
        ))}
      </Menu>

      {/* Filter Popover */}
      <Popover
        open={filterDialogOpen}
        anchorEl={modelOpenref}
        onClose={() => {
          setFilterDialogOpen(false);
          setModelOpenref(null);
        }}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: lastChipRef ? "right" : "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        disablePortal={false}
        PaperProps={{
          sx: {
            mt: 0.5,
            borderRadius: 1,
            boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
            width: 400,
            maxHeight: 300,
          },
        }}
      >
        <Paper elevation={0}>
          {/* Blue Header */}
          <Box
            sx={{
              backgroundColor: "#4A90E2",
              color: "#fff",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              py: 2,
              px: 3,
              fontSize: "1.1rem",
              fontWeight: 500,
            }}
          >
            <Typography
              variant="h6"
              sx={{ fontWeight: 500, fontSize: "1.1rem" }}
            >
              {selectedFilterField?.label || "Filter"}
            </Typography>
            <IconButton
              onClick={() => {
                setFilterDialogOpen(false);
                setModelOpenref(null);
              }}
              sx={{
                color: "#fff",
                padding: "4px",
                "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.1)" },
              }}
            >
              <Close fontSize="small" />
            </IconButton>
          </Box>

          {/* Content */}
          <Box sx={{ p: 2 }}>
            <Typography
              variant="body2"
              sx={{
                color: "#4A90E2",
                mb: 2,
                fontWeight: 500,
                fontSize: "0.875rem",
              }}
            >
              {selectedFilterField?.label} -{" "}
              {
                operatorOptions.find((op) => op.value === selectedOperator)
                  ?.label
              }
            </Typography>

            {/* Dynamic Input Field */}
            {selectedFilterField?.type === "multiCheckbox" ? (
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                {selectedFilterField.options?.map((option) => (
                  <FormControlLabel
                    key={option}
                    control={
                      <Checkbox
                        checked={checkboxValues.includes(option)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setCheckboxValues([...checkboxValues, option]);
                          } else {
                            setCheckboxValues(
                              checkboxValues.filter((v) => v !== option)
                            );
                          }
                        }}
                        size="small"
                        sx={{
                          color: "#4A90E2",
                          "&.Mui-checked": {
                            color: "#4A90E2",
                          },
                        }}
                      />
                    }
                    label={
                      <Typography sx={{ fontSize: "0.875rem" }}>
                        {option}
                      </Typography>
                    }
                  />
                ))}
              </Box>
            ) : (
              <TextField
                fullWidth
                variant="standard"
                placeholder={
                  selectedFilterField?.field === "departmentName"
                    ? "Enter department name..."
                    : selectedFilterField?.field === "manager"
                    ? "Enter manager name..."
                    : selectedFilterField?.field === "agentCount"
                    ? "Enter number..."
                    : "Enter value..."
                }
                value={filterValue}
                onChange={(e) => setFilterValue(e.target.value)}
                autoFocus
                sx={{
                  "& .MuiInput-root": {
                    fontSize: "0.875rem",
                    "&:before": {
                      borderBottomColor: "#e0e0e0",
                    },
                    "&:hover:before": {
                      borderBottomColor: "#4A90E2",
                    },
                    "&:after": {
                      borderBottomColor: "#4A90E2",
                    },
                  },
                }}
              />
            )}
          </Box>

          <Divider sx={{ mx: 3 }} />

          {/* Actions */}
          <Box sx={{ p: 3, display: "flex", justifyContent: "flex-end" }}>
            <Button
              onClick={applyFilter}
              variant="text"
              disabled={!filterValue.trim() && checkboxValues.length === 0}
              sx={{
                color: "#4A90E2",
                fontWeight: 400,
                textTransform: "uppercase",
                fontSize: "0.875rem",
                px: 2,
                py: 1,
                "&:hover": {
                  backgroundColor: "rgba(74, 144, 226, 0.04)",
                },
                "&.Mui-disabled": {
                  color: "#cccccc",
                },
              }}
            >
              Apply
            </Button>
          </Box>
        </Paper>
      </Popover>
    </Box>
  );
};

export default TeamsManagement;
