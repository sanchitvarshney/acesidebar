import { useState, useMemo, useCallback } from "react";

import { columns } from "../../utils/create-user-columnDefs";

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
  Checkbox,
  FormControlLabel,
} from "@mui/material";

import { DataGrid } from "@mui/x-data-grid";
import AddIcon from "@mui/icons-material/Add";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import WorkIcon from "@mui/icons-material/Work";
import SplitscreenIcon from "@mui/icons-material/Splitscreen";
import CustomSideBarPanel from "../../components/reusable/CustomSideBarPanel";
import ImportContact from "../components/ImportContact";
import ExportContact from "../components/ExportContact";
import AddContact from "../components/AddContact";
import { Close } from "@mui/icons-material";
import { useGetAgentsQuery } from "../../services/agentServices";

const ContactList = () => {
  const [isExport, setIsExport] = useState(false);
  const [isImport, setIsImport] = useState(false);
  const [isAdd, setIsAdd] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
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
  const [filterValue, setFilterValue] = useState("");
  const [selectedOperator, setSelectedOperator] = useState("startsWith");
  const [checkboxValues, setCheckboxValues] = useState<string[]>([]);
  const [columnOrganizerOpen, setColumnOrganizerOpen] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState<string[]>([
    "contact",
    "emailAddress",
    "company",
    "phoneNumber",
    "roleType",
    "facebook",
    "twitter",
  ]);
  const {
    data: agentList,
    isLoading: agentListData,
    error: agentListError,
  } = useGetAgentsQuery();
  const [modelOpenref, setModelOpenref] = useState<null | HTMLElement>(null);

  // Field options for filter (matching your images)
  const fieldOptions = [
    {
      value: "firstName",
      label: "First name",
      icon: <PersonIcon />,
      type: "text",
      operator: "startsWith",
    },
    {
      value: "lastName",
      label: "Last name",
      icon: <PersonIcon />,
      type: "text",
      operator: "startsWith",
    },
    {
      value: "emailAddress",
      label: "Email",
      icon: <EmailIcon />,
      type: "text",
      operator: "contains",
    },
    {
      value: "status",
      label: "Status",
      icon: <WorkIcon />,
      type: "multiCheckbox",
      options: ["Active", "Inactive", "Suspended"],
      operator: "equals",
    },
    {
      value: "phoneNumber",
      label: "Mobile no",
      icon: <PhoneIcon />,
      type: "text",
      operator: "contains",
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
    { value: "matches", label: "Matches" },
    { value: "greaterThan", label: "Greater than (>)" },
    { value: "lessThan", label: "Less than (<)" },
    { value: "greaterThanOrEqual", label: "Greater than or equal (≥)" },
    { value: "lessThanOrEqual", label: "Less than or equal (≤)" },
  ];

  // Open filter dialog for selected field
  const openFilterDialog = useCallback(
    (field: string, label: string) => {
      // Check if maximum filters reached
      if (activeFilters.length >= 5) {
        alert("Maximum 5 filters allowed");
        return;
      }

      const fieldOption = fieldOptions.find((option) => option.value === field);
      setSelectedFilterField({ field, label, ...fieldOption });

      // Set default values based on field type
      if (fieldOption?.type === "multiCheckbox") {
        setCheckboxValues([]);
        setFilterValue("");
        setSelectedOperator(fieldOption.operator || "equals");
      } else {
        setFilterValue("");
        setSelectedOperator(fieldOption?.operator || "startsWith");
      }

      setFilterDialogOpen(true);
    },
    [activeFilters.length]
  );

  // Apply filter from dialog
  const applyFilter = useCallback(() => {
    setModelOpenref(null);
    let valueToUse = "";
    let isValidFilter = false;

    // Handle different input types
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
      // Check if filter for this field already exists
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
        // Update existing filter
        setActiveFilters((prev) => {
          const updatedFilters = [...prev];
          updatedFilters[existingFilterIndex] = newFilter;
          return updatedFilters;
        });
      } else {
        // Add new filter
        setActiveFilters((prev) => [...prev, newFilter]);
      }

      // Here you can add your API call
      console.log("API Call - Filter applied:", newFilter);

      // Auto-close popup after applying filter
      setFilterDialogOpen(false);
      setFilterValue("");
      setCheckboxValues([]);
      setSelectedFilterField(null);
    }
  }, [
    selectedFilterField,
    checkboxValues,
    filterValue,
    selectedOperator,
    activeFilters,
  ]);

  // Remove filter function
  const removeFilter = useCallback((filterId: string) => {
    setActiveFilters((prev) => prev.filter((filter) => filter.id !== filterId));
  }, []);

  // Clear all filters function
  const clearAllFilters = useCallback(() => {
    setActiveFilters([]);
  }, []);

  // Apply search and filters to data
  const applyFilters = useCallback(
    (data: any[]) => {
      let filteredData = data;

      // Apply search query first
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        filteredData = filteredData.filter((row: any) => {
          return (
            row.firstName?.toLowerCase().includes(query) ||
            row.lastName?.toLowerCase().includes(query) ||
            row.emailAddress?.toLowerCase().includes(query) ||
            row.phoneNumber?.toLowerCase().includes(query) ||
            row.company?.toLowerCase().includes(query) ||
            row.roleType?.toLowerCase().includes(query)
          );
        });
      }

      // Apply custom filters
      return filteredData.filter((row: any) => {
        return activeFilters.every((filter) => {
          // Skip filter if no value is set
          if (!filter.value || filter.value.trim() === "") {
            return true;
          }

          const cellValue = row[filter.field]?.toString() || "";
          const filterValue = filter.value;

          // Handle multiCheckbox filters (Status)
          if (filter.field === "status" && filter.value.includes(",")) {
            const selectedStatuses = filter.value.split(", ");
            return filter.operator === "equals"
              ? selectedStatuses.includes(cellValue)
              : !selectedStatuses.includes(cellValue);
          }

          // Handle number filters
          if (filter.field === "ticketCount") {
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
            case "matches":
              // Simple pattern matching for phone numbers
              const pattern = filterValueLower
                .replace(/\*/g, ".*")
                .replace(/\?/g, ".");
              const regex = new RegExp(pattern, "i");
              return regex.test(cellValue);
            default:
              return true;
          }
        });
      });
    },
    [searchQuery, activeFilters]
  );

  // Apply filters to data
  const filterData = useMemo(() => {
    return applyFilters(agentList || []);
  }, [agentList, applyFilters]);

  // Filter columns based on visibility
  const filteredColumns = useMemo(() => {
    return columns.filter(
      (column) =>
        column.field === "__check__" || visibleColumns.includes(column.field)
    );
  }, [visibleColumns]);

  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });

  return (
    <>
      <Box
        sx={{
          height: "calc(100vh - 100px)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* Header Section - Like your images */}
        <Box
          sx={{
            backgroundColor: "#f8f9fa",
            p: 1.5,
            mb: 0,
            borderRadius: 1,
            flexShrink: 0,
           width: "100%",
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              my: 2,
            }}
          >
            {/* Left side - Users title */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, color: "#333" }}>
                Users
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "#666", fontSize: "0.875rem" }}
              >
                | Showing all users
              </Typography>
            </Box>

            {/* Right side - Search and Action buttons */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              {/* Search Input */}
              <TextField
                size="small"
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                inputProps={{
                  "aria-label": "Search users",
                  role: "searchbox",
                }}
                sx={{
                  minWidth: 200,
                  "& .MuiOutlinedInput-root": {
                    fontSize: "0.875rem",
                    "& fieldset": {
                      borderColor: "#e0e0e0",
                    },
                    "&:hover fieldset": {
                      borderColor: "#1976d2",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#1976d2",
                    },
                  },
                }}
              />

              <Button
                variant="text"
                size="small"
                onClick={() => setIsAdd(true)}
                aria-label="Add new user"
                sx={{
                  color: "#1976d2",
                  textTransform: "none",
                  fontWeight: 500,
                  fontSize: "0.875rem",
                  "&:hover": {
                    backgroundColor: "rgba(25, 118, 210, 0.04)",
                  },
                }}
              >
                Add new user
              </Button>

              <Button
                variant="text"
                size="small"
                onClick={() => {
                  /* Handle bulk update */
                }}
                aria-label="Bulk update users"
                sx={{
                  color: "#1976d2",
                  textTransform: "none",
                  fontWeight: 500,
                  fontSize: "0.875rem",
                  "&:hover": {
                    backgroundColor: "rgba(25, 118, 210, 0.04)",
                  },
                }}
              >
                Bulk update users
              </Button>

              <Button
                variant="text"
                size="small"
                onClick={() => setIsExport(true)}
                aria-label="Download users"
                sx={{
                  color: "#1976d2",
                  textTransform: "none",
                  fontWeight: 500,
                  fontSize: "0.875rem",
                  "&:hover": {
                    backgroundColor: "rgba(25, 118, 210, 0.04)",
                  },
                }}
              >
                Download users
              </Button>
            </Box>
          </Box>
        </Box>

        {/* Filter Section - 80% Editable + 20% Actions */}
        <Box
          sx={{
            backgroundColor: "#fff",
            borderRadius: 1,
            mb: 1.5,
            border: "1px solid #e0e0e0",
            minHeight: 50,
            display: "grid",
            gridTemplateColumns: "80% 20%",
            overflow: "hidden",
            flexShrink: 0,
            width: columnOrganizerOpen
              ? { xs: "0%", sm: "62%", md: "72%" }
              : "100%",
            transition: "width 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        >
          {/* 80% Editable Area */}
          <Box
            sx={{
              p: 2,
              cursor: activeFilters.length === 0 ? "pointer" : "default",
              display: "flex",
              flexDirection: "column",

              gap: 1.5,
              borderRight: "1px solid #e0e0e0",
              "&:hover":
                activeFilters.length === 0
                  ? {
                      backgroundColor: "#f8f9fa",
                    }
                  : {},
            }}
            onClick={
              activeFilters.length === 0
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
                    ref={setLastChipRef}
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

          {/* 20% Actions Area - Non-editable */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 0.5,
              p: 1.5,
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
              {/* Clear all Filter button - only when filters exist */}
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

              {/* Splitscreen icon - always visible in center */}
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  setColumnOrganizerOpen(true);
                }}
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
                <SplitscreenIcon fontSize="small" />
              </IconButton>
            </Box>

            {/* Filter counter and max message */}
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
                setFilterMenuAnchor(null); // Close dropdown immediately

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

        {/* DataGrid and Column Organizer Container */}
        <Box
          sx={{
            backgroundColor: "#fff",
            borderRadius: 1,
            border: "1px solid #e0e0e0",
            flex: 1,
            display: "flex",
            flexDirection: "row",
            overflow: "hidden",
            minHeight: 0,
            width: columnOrganizerOpen
              ? { xs: "0%", sm: "62%", md: "72%" }
              : "100%",
            transition: "width 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
            position: "relative",
          }}
        >
          {/* DataGrid Section */}
          <Box
            sx={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
              minWidth: 0,
              minHeight: 0,
            }}
          >
            <DataGrid
              rows={filterData || []}
              getRowId={(row) => row.agentID}
              columns={filteredColumns}
              loading={agentListData} // Show loading state when data is being fetched
              paginationModel={paginationModel}
              onPaginationModelChange={setPaginationModel}
              initialState={{
                sorting: {
                  sortModel: [{ field: "contact", sort: "asc" }],
                },
              }}
              pageSizeOptions={[10, 20, 50, 100]}
              checkboxSelection
              density="comfortable"
              disableRowSelectionOnClick
              disableColumnSelector
              disableDensitySelector
              slots={{
                noRowsOverlay: () => (
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      height: "100%",
                      color: "#666",
                    }}
                  >
                    {agentListError ? (
                      <>
                        <Typography variant="h6" color="error" sx={{ mb: 1 }}>
                          Error loading users
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          Please try refreshing the page
                        </Typography>
                      </>
                    ) : (
                      <>
                        <Typography
                          variant="h6"
                          color="textSecondary"
                          sx={{ mb: 1 }}
                        >
                          No users match your current selection.
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          Try adjusting your search criteria or filters
                        </Typography>
                      </>
                    )}
                  </Box>
                ),
                loadingOverlay: () => (
                  <Box
                    sx={{
                      position: "relative",
                      height: "100%",
                      width: "100%",
                    }}
                  >
                    {/* Linear loader at the top */}
                    <Box
                      sx={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        width: "100%",
                        height: 4,
                        backgroundColor: "#f0f0f0",
                        overflow: "hidden",
                        zIndex: 1,
                      }}
                    >
                      <Box
                        sx={{
                          height: "100%",
                          backgroundColor: "#1976d2",
                          animation: "progress 1.5s ease-in-out infinite",
                          "@keyframes progress": {
                            "0%": {
                              transform: "translateX(-100%)",
                              width: "30%",
                            },
                            "50%": {
                              transform: "translateX(0%)",
                              width: "70%",
                            },
                            "100%": {
                              transform: "translateX(100%)",
                              width: "30%",
                            },
                          },
                        }}
                      />
                    </Box>

                    {/* Loading text in center */}
                    <Box
                      sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        textAlign: "center",
                      }}
                    >
                      <Typography variant="body2" color="textSecondary">
                        Loading users...
                      </Typography>
                    </Box>
                  </Box>
                ),
              }}
              sx={{
                border: 0,
                width: "100%",
                height: "100%",
                transition: "width 0.4s cubic-bezier(0.4, 0, 0.2, 1)",

                // Loading overlay styling
                "& .MuiDataGrid-overlayWrapper": {
                  minHeight: 400,
                },

                // Checkbox column styling
                "& .MuiDataGrid-checkboxInput": {
                  color: "#1976d2",
                  "&.Mui-checked": {
                    color: "#1976d2",
                  },
                },

                // Set checkbox column width to 200px
                "& .MuiDataGrid-columnHeader--checkboxSelection": {
                  width: "200px !important",
                  minWidth: "200px !important",
                  maxWidth: "200px !important",
                },

                "& .MuiDataGrid-cell--checkboxSelection": {
                  width: "200px !important",
                  minWidth: "200px !important",
                  maxWidth: "200px !important",
                  paddingLeft: "16px",
                },

                // Header styling
                "& .MuiDataGrid-columnHeaders": {
                  backgroundColor: "#f8f9fa",
                  borderBottom: "1px solid #e0e0e0",
                  fontSize: "0.875rem",
                  fontWeight: 500,
                  color: "#666",
                },

                "& .MuiDataGrid-columnHeader": {
                  padding: "12px",
                  "&:focus": {
                    outline: "none",
                  },
                  "&:focus-within": {
                    outline: "none",
                  },
                },

                "& .MuiDataGrid-columnHeaderTitle": {
                  fontWeight: 500,
                  fontSize: "0.875rem",
                },

                // Row styling
                "& .MuiDataGrid-row": {
                  borderBottom: "1px solid #f0f0f0",
                  "&:hover": {
                    backgroundColor: "#f8f9fa",
                  },
                  "&.Mui-selected": {
                    backgroundColor: "#e3f2fd !important",
                    "&:hover": {
                      backgroundColor: "#bbdefb !important",
                    },
                  },
                },

                // Cell styling
                "& .MuiDataGrid-cell": {
                  padding: "12px",
                  fontSize: "0.875rem",
                  color: "#333",
                  borderBottom: "none",
                  "&:focus": {
                    outline: "none",
                  },
                  "&:focus-within": {
                    outline: "none",
                  },
                },

                // Footer styling
                "& .MuiDataGrid-footerContainer": {
                  borderTop: "1px solid #e0e0e0",
                  backgroundColor: "#fafafa",
                },

                // Scrollbar styling
                "& .MuiDataGrid-virtualScroller": {
                  "&::-webkit-scrollbar": {
                    width: "8px",
                    height: "8px",
                  },
                  "&::-webkit-scrollbar-track": {
                    backgroundColor: "#f1f1f1",
                    borderRadius: "4px",
                  },
                  "&::-webkit-scrollbar-thumb": {
                    backgroundColor: "#c1c1c1",
                    borderRadius: "4px",
                    "&:hover": {
                      backgroundColor: "#a8a8a8",
                    },
                  },
                },
              }}
            />
          </Box>

          {/* Inline Column Organizer Panel */}
          <Box
            sx={{
              width: { xs: "100%", sm: "40%", md: "30%" },
              borderLeft: "1px solid #e0e0e0",
              display: "flex",
              flexDirection: "column",
              backgroundColor: "#fff",
              transform: columnOrganizerOpen
                ? "translateX(0)"
                : "translateX(100%)",
              transition: "transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
              position: "fixed",
              right: 0,
              top: 64,
              bottom: 0,
              height: "100vh",
              zIndex: 1300,
              // boxShadow: columnOrganizerOpen ? "-4px 0 12px rgba(0, 0, 0, 0.15)" : "none",
              visibility: columnOrganizerOpen ? "visible" : "hidden",
              minWidth: { xs: "280px", sm: "300px", md: "300px" },
              maxWidth: { xs: "100%", sm: "400px", md: "400px" },
            }}
          >
            {/* Header */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                p: 3,
                pb: 2,
                borderBottom: "1px solid #e0e0e0",
              }}
            >
              <SplitscreenIcon sx={{ color: "#666" }} />
              <Typography variant="h6" sx={{ fontWeight: 600, flex: 1 }}>
                Organize columns
              </Typography>
              <IconButton
                onClick={() => setColumnOrganizerOpen(false)}
                size="small"
              >
                <Close />
              </IconButton>
            </Box>

            {/* Content */}
            <Box sx={{ flex: 1, p: 3, overflow: "auto" }}>
              {/* Showing in table section */}
              <Box sx={{ mb: 3 }}>
                <Typography
                  variant="subtitle2"
                  sx={{ mb: 2, color: "#666", fontWeight: 500 }}
                >
                  Showing in table
                </Typography>

                {columns
                  .filter((col) => col.field !== "__check__")
                  .map((column) => (
                    <Box
                      key={column.field}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        py: 1.5,
                        px: 1,
                        borderRadius: 1,
                        "&:hover": {
                          backgroundColor: "#f5f5f5",
                        },
                      }}
                    >
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1.5 }}
                      >
                        <Box
                          sx={{
                            display: "grid",
                            gridTemplateColumns: "repeat(2, 1fr)",
                            gap: "2px",
                            width: 16,
                            height: 16,
                          }}
                        >
                          {[...Array(4)].map((_, i) => (
                            <Box
                              key={i}
                              sx={{
                                width: 6,
                                height: 6,
                                backgroundColor: "#999",
                                borderRadius: "1px",
                              }}
                            />
                          ))}
                        </Box>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {column.headerName}
                        </Typography>
                      </Box>

                      <IconButton
                        size="small"
                        onClick={() => {
                          setVisibleColumns((prev) =>
                            prev.filter((col) => col !== column.field)
                          );
                        }}
                        sx={{
                          color: visibleColumns.includes(column.field)
                            ? "#d32f2f"
                            : "#999",
                          "&:hover": {
                            backgroundColor: "rgba(211, 47, 47, 0.1)",
                          },
                        }}
                      >
                        {visibleColumns.includes(column.field) ? (
                          <Close fontSize="small" />
                        ) : (
                          <Box
                            sx={{
                              width: 16,
                              height: 16,
                              border: "1px solid #ccc",
                              borderRadius: "2px",
                              backgroundColor: "#f5f5f5",
                            }}
                          />
                        )}
                      </IconButton>
                    </Box>
                  ))}
              </Box>

              {/* Available to add section */}
              <Box>
                <Typography
                  variant="subtitle2"
                  sx={{ mb: 2, color: "#666", fontWeight: 500 }}
                >
                  Available to add
                </Typography>

                {columns
                  .filter(
                    (col) =>
                      col.field !== "__check__" &&
                      !visibleColumns.includes(col.field)
                  )
                  .map((column) => (
                    <Box
                      key={column.field}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        py: 1.5,
                        px: 1,
                        borderRadius: 1,
                        "&:hover": {
                          backgroundColor: "#f5f5f5",
                        },
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{ fontWeight: 500, color: "#666" }}
                      >
                        {column.headerName}
                      </Typography>

                      <IconButton
                        size="small"
                        onClick={() => {
                          setVisibleColumns((prev) => [...prev, column.field]);
                        }}
                        sx={{
                          color: "#1976d2",
                          "&:hover": {
                            backgroundColor: "rgba(25, 118, 210, 0.1)",
                          },
                        }}
                      >
                        <AddIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  ))}
              </Box>
            </Box>

            {/* Footer */}
            <Box
              sx={{
                p: 3,
                borderTop: "1px solid #e0e0e0",
                display: "flex",
                gap: 2,
                justifyContent: "flex-end",
              }}
            >
              <Button
                variant="outlined"
                onClick={() => setColumnOrganizerOpen(false)}
                sx={{
                  textTransform: "none",
                  borderColor: "#e0e0e0",
                  color: "#666",
                }}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                onClick={() => {
                  // Apply column changes and close
                  setColumnOrganizerOpen(false);
                }}
                sx={{
                  textTransform: "none",
                  backgroundColor: "#1976d2",
                }}
              >
                Save
              </Button>
            </Box>
          </Box>
        </Box>

        <CustomSideBarPanel
          open={isExport}
          close={() => setIsExport(false)}
          isHeader={true}
          title={"Export Contact"}
          width={"45%"}
          btn={{ main: "Export", secondary: "Cancel" }}
        >
          <ExportContact />
        </CustomSideBarPanel>

        <CustomSideBarPanel
          open={isImport}
          close={() => setIsImport(false)}
          isHeader={true}
          title={"Import Contact"}
          width={"45%"}
          btn={{ primary: "Import", secondary: "Cancel" }}
        >
          <ImportContact />
        </CustomSideBarPanel>

        <AddContact isAdd={isAdd} close={() => setIsAdd(false)} />

        {/* Filter Popover - Auto positioned near last chip or filter area */}
        <Popover
          open={filterDialogOpen}
          anchorEl={modelOpenref}
          onClose={() => setFilterDialogOpen(false)}
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
              mt:0.5,
              borderRadius: 1,
              boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
              width: 400,
              maxHeight: 300,
            },
          }}
        >
          <Paper elevation={0}>
            {/* Blue Header - Exact match to image */}
            <Box
              sx={{
                backgroundColor: "#4A90E2", // Exact blue from image
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
              {/* Field Label */}
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
                    selectedFilterField?.field === "emailAddress"
                      ? "Enter email prefix..."
                      : selectedFilterField?.field === "phoneNumber"
                      ? "Enter phone number..."
                      : selectedFilterField?.field === "firstName" ||
                        selectedFilterField?.field === "lastName"
                      ? "Enter name..."
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
                disabled={
                  selectedFilterField?.type === "multiCheckbox"
                    ? checkboxValues.length === 0
                    : !filterValue.trim() || !selectedFilterField
                }
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
    </>
  );
};

export default ContactList;
