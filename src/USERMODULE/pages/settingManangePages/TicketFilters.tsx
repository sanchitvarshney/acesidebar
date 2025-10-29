import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Menu,
  MenuItem,
  Card,
  LinearProgress,
  Chip,
  TablePagination,
  Stack,
  Popover,
  FormControlLabel,
  Checkbox,
  TextField,
  Divider,
} from "@mui/material";
import empty from "../../../assets/image/overview-empty-state.svg";
import {
  Add as AddIcon,
  MoreVert as MoreVertIcon,
  ArrowUpward as ArrowUpwardIcon,
  ArrowDownward as ArrowDownwardIcon,
  Settings as SettingsIcon,
  ArrowBack as ArrowBackIcon,
  Edit,
  Delete,
  Search,
  Person,
  Work,
  Email,
  Close,
} from "@mui/icons-material";
import AddFilterDrawer from "../../components/reusable/AddFilterDrawer";
import { useNavigate } from "react-router-dom";

const TicketFilters: React.FC = () => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [sortColumn, setSortColumn] = useState<string>("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [addFilterDrawerOpen, setAddFilterDrawerOpen] = useState(false);
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
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const [selectedFilterField, setSelectedFilterField] = useState<{
    field: string;
    label: string;
    type?: string;
    options?: string[];
    operators?: string[];
    defaultOperator?: string;
  } | null>(null);
  const [lastChipRef, setLastChipRef] = useState<null | HTMLElement>(null);
  const [modelOpenref, setModelOpenref] = useState<null | HTMLElement>(null);
  const [filterValue, setFilterValue] = useState("");
  const [checkboxValues, setCheckboxValues] = useState<string[]>([]);

  const [selectedOperator, setSelectedOperator] = useState("startsWith");
  const handleMoreClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMoreClose = () => {
    setAnchorEl(null);
  };

  const handleFilterSave = (filterData: any) => {
    console.log("Filter saved:", filterData);
    // Handle saving the filter data here
    // You can add API calls or state updates as needed
  };
  const fieldOptions = [
    {
      value: "name",
      label: "Name",
      icon: <Person />,
      type: "text",
      operator: "startsWith",
    },
    {
      value: "role",
      label: "Role",
      icon: <Person />,
      type: "text",
      operator: "startsWith",
    },
    {
      value: "isActive",
      label: "Status",
      icon: <Work />,
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

  const rows: any = [];

  const applyFilter = () => {
    setModelOpenref(null);
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

  // Remove filter function
  const removeFilter = (filterId: string) => {
    setActiveFilters(activeFilters.filter((filter) => filter.id !== filterId));
  };

  // Clear all filters function
  const clearAllFilters = () => {
    setActiveFilters([]);
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

  // Use all departments without search filtering
  const filteredDepartments = rows || [];

  // Apply custom filters
  let filterData = filteredDepartments;
  filterData = applyFilters(filterData);

  return (
    <Box
      sx={{
        p: 0,
        backgroundColor: "#f8f9fa",
        minHeight: "calc(100vh - 200px)",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 1,
          p: 2,
          borderBottom: "1px solid #e0e0e0",
          backgroundColor: "#fafafa",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <IconButton onClick={() => navigate("/settings/help-support")}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h5" sx={{ fontWeight: 600, color: "#1a1a1a" }}>
            Ticket Filters
          </Typography>
        </Box>

        <Box sx={{ display: "flex", gap: 1 }}>
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            sx={{
              fontWeight: 600
            }}
            onClick={() => setAddFilterDrawerOpen(true)}
          >
            Add New Filter
          </Button>

          <Button
            variant="outlined"
            sx={{
              fontWeight: 600
            }}
            startIcon={<SettingsIcon />}
            endIcon={<ArrowDownwardIcon sx={{ fontSize: 16 }} />}
            onClick={handleMoreClick}
          >
            More
          </Button>
        </Box>
      </Box>

      <Box
        sx={{
          backgroundColor: "#fff",
          borderRadius: 1,
          border: "1px solid #e0e0e0",
          minHeight: 60,
          display: "grid",
          gridTemplateColumns: "80% 20%",
          overflow: "hidden",
          flexShrink: 0,
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
              <Search fontSize="small" />
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

      {/* Table */}
      <Card sx={{ flex: 1, boxShadow: "0 2px 8px rgba(0,0,0,0.1)", mt: 1 }}>
        <TableContainer
          sx={{
            height: "calc(100vh - 360px)",
            minHeight: "350px",
          }}
          className="custom-scrollbar"
        >
          <Table stickyHeader>
            <TableHead sx={{ position: "relative" }}>
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
              <TableRow sx={{ bgcolor: "#f8f9fa" }}>
                <TableCell
                  sx={{
                    fontWeight: 600,
                    fontSize: "14px",
                    color: "#1a1a1a",
                    borderBottom: "2px solid #e0e0e0",
                  }}
                >
                  Name
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

                <TableCell
                  sx={{
                    fontWeight: 600,
                    fontSize: "14px",
                    color: "#1a1a1a",
                    borderBottom: "2px solid #e0e0e0",
                  }}
                >
                  Rule
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: 600,
                    fontSize: "14px",
                    color: "#1a1a1a",
                    borderBottom: "2px solid #e0e0e0",
                  }}
                >
                  Order
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: 600,
                    fontSize: "14px",
                    color: "#1a1a1a",
                    borderBottom: "2px solid #e0e0e0",
                  }}
                >
                  Last Update
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: 600,
                    fontSize: "14px",
                    color: "#1a1a1a",
                    borderBottom: "2px solid #e0e0e0",
                  }}
                />
              </TableRow>
            </TableHead>

            <TableBody>
              {rows.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    align="center"
                    sx={{ py: 8, border: "none" }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: 2,
                      }}
                    >
                      <img src={empty} alt="No Data" className="w-40" />
                    </Box>
                  </TableCell>
                </TableRow>
              ) : (
                rows.map((row: any, index: number) => (
                  <TableRow
                    key={row.id || row.key || row._id || index}
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
                      {row.topic}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={row.status}
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
                      {row.type}
                    </TableCell>
                    <TableCell
                      sx={{
                        fontSize: "14px",
                        color: "#65676b",
                      }}
                    >
                      {row.priority}
                    </TableCell>
                    <TableCell
                      sx={{
                        fontSize: "14px",
                        color: "#65676b",
                      }}
                    >
                      {row.department}
                    </TableCell>
                    <TableCell
                      sx={{
                        fontSize: "14px",
                        color: "#65676b",
                      }}
                    >
                      <div className="flex gap-2">
                        <IconButton
                          aria-label="edit"
                          onClick={() =>
                            navigate(`/settings/emails/add-new-banlist`, {
                              state: row,
                            })
                          }
                          size="small"
                        >
                          <Edit fontSize="small" />
                        </IconButton>
                        <IconButton
                          aria-label="delete"
                          onClick={() => {}}
                          size="small"
                          sx={{
                            color: "red",
                          }}
                          // disabled={removeBanEmailLoading}
                        >
                          <Delete fontSize="small" />
                          {/* )} */}
                        </IconButton>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          sx={{ borderTop: "1px solid #e0e0e0" }}
          component="div"
          count={2}
          page={1}
          onPageChange={() => {}}
          rowsPerPage={10}
          onRowsPerPageChange={() => {}}
          rowsPerPageOptions={[10, 20, 50]}
        />
      </Card>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMoreClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <MenuItem onClick={handleMoreClose}>Import Filters</MenuItem>
        <MenuItem onClick={handleMoreClose}>Export Filters</MenuItem>
        <MenuItem onClick={handleMoreClose}>Bulk Actions</MenuItem>
        <MenuItem onClick={handleMoreClose}>Settings</MenuItem>
      </Menu>

      {/* Add Filter Drawer */}
      <AddFilterDrawer
        open={addFilterDrawerOpen}
        onClose={() => setAddFilterDrawerOpen(false)}
        onSave={handleFilterSave}
      />
      {/* Filter Options Menu */}
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

export default TicketFilters;
