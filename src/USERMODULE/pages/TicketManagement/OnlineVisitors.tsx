import React, { useState } from "react";
import {
  Box,
  Card,
  Typography,
  Chip,
  IconButton,
  Button,
  Stack,
  Pagination,
  TableContainer,
  Table,
  TableHead,
  LinearProgress,
  TableRow,
  TableCell,
  TableBody,
  Menu,
  MenuItem,
  Paper,
  Popover,
  FormControlLabel,
  Checkbox,
  Divider,
  TextField,
  TablePagination,
} from "@mui/material";
import {
  Search as SearchIcon,
  People as PeopleIcon,
  Visibility as VisibilityIcon,
  Chat as ChatIcon,
  AccessTime as AccessTimeIcon,
  Close,
} from "@mui/icons-material";
import AddIcon from "@mui/icons-material/Add";
import PersonIcon from "@mui/icons-material/Person";
import BusinessIcon from "@mui/icons-material/Business";
import WorkIcon from "@mui/icons-material/Work";
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

interface OnlineVisitor {
  id: string;
  name: string;
  email?: string;
  location: string;
  country: string;
  language: string;
  currentPage: string;
  timeOnSite: string;
  visitCount: number;
  lastActivity: string;
  status: "browsing" | "engaged" | "idle";
  priority: "low" | "medium" | "high";
  source: string;
  device: string;
  browser: string;
  ipAddress: string;
  canContact: boolean;
}

const OnlineVisitors: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
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
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    totalPages: 3,
  });
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

  const visitors: OnlineVisitor[] = [
        {
      id: "1",
      name: "John Doe",
      email: "john@example.com",
      location: "New York, NY",
      country: "United States",
      language: "English",
      currentPage: "/products",
      timeOnSite: "5 min",
      visitCount: 3,
      lastActivity: "2 min ago",
      status: "engaged",
      priority: "high",
      source: "Google Search",
      device: "Desktop",
      browser: "Chrome",
      ipAddress: "192.168.1.1",
      canContact: true,
    },
    {
      id: "2",
      name: "Jane Smith",
      email: "jane@example.com",
      location: "London, UK",
      country: "United Kingdom",
      language: "English",
      currentPage: "/support",
      timeOnSite: "12 min",
      visitCount: 1,
      lastActivity: "1 min ago",
      status: "browsing",
      priority: "medium",
      source: "Direct",
      device: "Mobile",
      browser: "Safari",
      ipAddress: "192.168.1.2",
      canContact: true,
    },
    {
      id: "3",
      name: "Bob Johnson",
      email: "bob@example.com",
      location: "Toronto, CA",
      country: "Canada",
      language: "English",
      currentPage: "/pricing",
      timeOnSite: "3 min",
      visitCount: 5,
      lastActivity: "30 sec ago",
      status: "idle",
      priority: "low",
      source: "Social Media",
      device: "Tablet",
      browser: "Firefox",
      ipAddress: "192.168.1.3",
      canContact: false,
    },
    {
      id: "1",
      name: "John Doe",
      email: "john@example.com",
      location: "New York, NY",
      country: "United States",
      language: "English",
      currentPage: "/products",
      timeOnSite: "5 min",
      visitCount: 3,
      lastActivity: "2 min ago",
      status: "engaged",
      priority: "high",
      source: "Google Search",
      device: "Desktop",
      browser: "Chrome",
      ipAddress: "192.168.1.1",
      canContact: true,
    },
    {
      id: "2",
      name: "Jane Smith",
      email: "jane@example.com",
      location: "London, UK",
      country: "United Kingdom",
      language: "English",
      currentPage: "/support",
      timeOnSite: "12 min",
      visitCount: 1,
      lastActivity: "1 min ago",
      status: "browsing",
      priority: "medium",
      source: "Direct",
      device: "Mobile",
      browser: "Safari",
      ipAddress: "192.168.1.2",
      canContact: true,
    },
    {
      id: "3",
      name: "Bob Johnson",
      email: "bob@example.com",
      location: "Toronto, CA",
      country: "Canada",
      language: "English",
      currentPage: "/pricing",
      timeOnSite: "3 min",
      visitCount: 5,
      lastActivity: "30 sec ago",
      status: "idle",
      priority: "low",
      source: "Social Media",
      device: "Tablet",
      browser: "Firefox",
      ipAddress: "192.168.1.3",
      canContact: false,
    },
  ];

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setPagination((prev) => ({ ...prev, page: value }));
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
  let filterData = visitors;
  filterData = applyFilters(filterData);
  return (
    <Box
      sx={{
        p: 3,
        maxHeight: "calc(100vh - 96px)",
        overflowY: "auto",
        width: "100%",
      }}
    >
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
          Online Visitors
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Monitor and engage with visitors in real-time
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            lg: "repeat(4, 1fr)",
          },
          gap: 2,
          mb: 3,
        }}
      >
        <Card sx={{ p: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Box
              sx={{
                p: 1,
                bgcolor: "primary.main",
                borderRadius: 1,
                color: "white",
              }}
            >
              <PeopleIcon />
            </Box>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {visitors.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Online Now
              </Typography>
            </Box>
          </Box>
        </Card>

        <Card sx={{ p: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Box
              sx={{
                p: 1,
                bgcolor: "success.main",
                borderRadius: 1,
                color: "white",
              }}
            >
              <ChatIcon />
            </Box>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {visitors.filter((v) => v.status === "engaged").length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Engaged
              </Typography>
            </Box>
          </Box>
        </Card>

        <Card sx={{ p: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Box
              sx={{
                p: 1,
                bgcolor: "info.main",
                borderRadius: 1,
                color: "white",
              }}
            >
              <VisibilityIcon />
            </Box>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {visitors.filter((v) => v.status === "browsing").length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Browsing
              </Typography>
            </Box>
          </Box>
        </Card>

        <Card sx={{ p: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Box
              sx={{
                p: 1,
                bgcolor: "warning.main",
                borderRadius: 1,
                color: "white",
              }}
            >
              <AccessTimeIcon />
            </Box>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {Math.round(
                  visitors.reduce((acc, v) => acc + parseInt(v.timeOnSite), 0) /
                    visitors.length
                )}{" "}
                min
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Avg. Time
              </Typography>
            </Box>
          </Box>
        </Card>
      </Box>

      <Box
        sx={{
          display: "flex",
          gap: 2,
          mb: 3,
          alignItems: "center",
          width: "100%",
        }}
      >
        <Box
          sx={{
            backgroundColor: "#fff",
            borderRadius: 1,
            border: "1px solid #e0e0e0",

            display: "grid",
            gridTemplateColumns: "80% 20%",
            overflow: "hidden",
            width: "100%",
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
                sx={{ display: "flex", alignItems: "center", gap: 2, flex: 1 }}
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
                      index === activeFilters.length - 1 ? setLastChipRef : null
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
                        borderColor: "#1976d2",
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
                    color: "#1976d2",
                    borderColor: "#1976d2",
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
      </Box>

      {/* Chat History List */}
      {/* <Box sx={{ height: "calc(100vh - 400px)", overflow: "auto" }}> */}
      <Card sx={{ flex: 1, boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
        <TableContainer
          sx={{
            maxHeight: "calc(100vh - 350px)",
            overflow: "auto",
            position: "relative",
          }}
          className="custom-scrollbar"
        >
          <Table stickyHeader>
            <TableHead sx={{ position: "relative" }}>
              {/* Linear Progress Loader */}
              {false && (
                <LinearProgress
                  sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    zIndex: 1,
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
              <TableRow sx={{ bgcolor: "#f8f9fa" }}>
                <TableCell
                  sx={{
                    fontWeight: 600,
                    fontSize: "14px",
                    color: "#1a1a1a",
                    borderBottom: "2px solid #e0e0e0",
                  }}
                >
                  Department Name
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: 600,
                    fontSize: "14px",
                    color: "#1a1a1a",
                    borderBottom: "2px solid #e0e0e0",
                  }}
                >
                  Type
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: 600,
                    fontSize: "14px",
                    color: "#1a1a1a",
                    borderBottom: "2px solid #e0e0e0",
                  }}
                >
                  Manager
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: 600,
                    fontSize: "14px",
                    color: "#1a1a1a",
                    borderBottom: "2px solid #e0e0e0",
                  }}
                >
                  Team Size
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: 600,
                    fontSize: "14px",
                    color: "#1a1a1a",
                    borderBottom: "2px solid #e0e0e0",
                  }}
                >
                  Status
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {filterData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 6 }}>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: 2,
                      }}
                    >
                      <Typography variant="h6" color="textSecondary">
                        No departments found
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Create a new department to get started
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              ) : (
                filterData.map((row: any, index: number) => (
                  <TableRow
                    key={row.id || row.key || index}
                    hover
                    sx={{
                      "&:last-child td, &:last-child th": { border: 0 },
                      "&:hover": {
                        bgcolor: "#f8f9fa",
                      },
                    }}
                  >
                    <TableCell
                      sx={{
                        fontWeight: 500,
                        fontSize: "15px",
                        color: "#1a1a1a",
                      }}
                    >
                      {row.departmentName}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={row.departmentType || "N/A"}
                        size="small"
                        sx={{
                          bgcolor: "#e3f2fd",
                          color: "#1976d2",
                          fontWeight: 500,
                          fontSize: "11px",
                        }}
                      />
                    </TableCell>
                    <TableCell
                      sx={{
                        fontSize: "14px",
                        color: "#65676b",
                      }}
                    >
                      {row.manager || "Not assigned"}
                    </TableCell>
                    <TableCell
                      sx={{
                        fontSize: "14px",
                        color: "#65676b",
                      }}
                    >
                      {row.agentCount || 0}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={row.isActive === false ? "Inactive" : "Active"}
                        size="small"
                        sx={{
                          bgcolor:
                            row.isActive === false ? "#ffebee" : "#e8f5e8",
                          color: row.isActive === false ? "#d32f2f" : "#2e7d32",
                          fontWeight: 600,
                          fontSize: "12px",
                        }}
                      />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          component="div"
          count={filterData.length}
          page={0}
          onPageChange={() => {}}
          rowsPerPage={1}
          onRowsPerPageChange={() => {}}
          rowsPerPageOptions={[5, 10, 25, 50]}
          labelRowsPerPage="Rows per page"
        />
      </Card>

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

export default OnlineVisitors;
