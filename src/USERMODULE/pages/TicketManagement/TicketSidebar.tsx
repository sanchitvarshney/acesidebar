import React, { useState, useEffect } from "react";
import { useGetAdvancedSearchQuery } from "../../../services/ticketAuth";
import TicketFilterSkeleton from "../../skeleton/TicketFilterSkeleton";
import TextField from "@mui/material/TextField";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import emptyimg from "../../../assets/image/overview-empty-state.svg";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Chip from "@mui/material/Chip";
import Box from "@mui/material/Box";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import InputAdornment from "@mui/material/InputAdornment";
import Popover from "@mui/material/Popover";
import SearchIcon from "@mui/icons-material/Search";
import FilterListAltIcon from "@mui/icons-material/FilterListAlt";
import CustomAlert from "../../../components/reusable/CustomAlert";

import { Typography, Divider, Slide, CircularProgress } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CustomSideBarPanel from "../../../components/reusable/CustomSideBarPanel";

const TicketFilterPanel: React.FC<any> = ({ onApplyFilters }) => {
  const {
    data: searchCriteria,
    isLoading,
    error,
  } = useGetAdvancedSearchQuery();
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const MAX_FILTERS = 4;
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [filterSearch, setFilterSearch] = useState("");
  const closePopoverTimer = React.useRef<NodeJS.Timeout | null>(null);
  const topAnchorRef = React.useRef<HTMLDivElement>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [showMaxFiltersAlert, setShowMaxFiltersAlert] = useState(false);
  const [isApplying, setIsApplying] = useState(false);

  // Find ticket ID field from API response
  const ticketIdField = searchCriteria?.find(
    (field: any) => field.name === "ticket_id"
  );

  // Utility: check non-empty value
  const isNonEmptyValue = (value: any) => {
    if (value === undefined || value === null) return false;
    if (Array.isArray(value)) return value.length > 0;
    if (typeof value === "string") return value.trim() !== "";
    return true;
  };

  // Ensure activeFilters reflects value changes
  const ensureActiveSync = (fieldName: string, value: any) => {
    const shouldBeActive = isNonEmptyValue(value);
    setActiveFilters((prev) => {
      const alreadyActive = prev.includes(fieldName);
      if (shouldBeActive && !alreadyActive) {
        // Allow adding from drawer even if MAX_FILTERS reached
        if (prev.length < MAX_FILTERS || drawerOpen) {
          return [...prev, fieldName];
        }
        return prev;
      }
      if (!shouldBeActive && alreadyActive && fieldName !== "ticket_id") {
        return prev.filter((n) => n !== fieldName);
      }
      return prev;
    });
  };

  // Build cleared filters (helper used for reset without apply)
  const buildClearedFilters = () => {
    const cleared: Record<string, any> = {};
    if (ticketIdField) {
      cleared["ticket_id"] = "";
    }
    criteriaArray.forEach((field: any) => {
      if (field.type === "chip") cleared[field.name] = [];
      else cleared[field.name] = "";
    });
    return cleared;
  };

  useEffect(() => {
    if (searchCriteria && Array.isArray(searchCriteria)) {
      const initialFilters: Record<string, any> = {};
      // Initialize ticket ID field if it exists in API response
      if (ticketIdField) {
        initialFilters["ticket_id"] = "";
      }
      searchCriteria.forEach((field: any) => {
        if (field.type === "chip") initialFilters[field.name] = [];
        else initialFilters[field.name] = "";
      });
      setFilters(initialFilters);

      // Automatically add ticket ID field to active filters if it exists
      if (ticketIdField && !activeFilters.includes("ticket_id")) {
        setActiveFilters((prev) => [...prev, "ticket_id"]);
      }
    }
  }, [searchCriteria, ticketIdField]);

  // When searchCriteria loads, initialize masterFilters as well, but do not overwrite regular filters
  useEffect(() => {
    if (searchCriteria && Array.isArray(searchCriteria)) {
      const initialMasterFilters: Record<string, any> = {};
      searchCriteria.forEach((field: any) => {
        if (field.type === "chip") initialMasterFilters[field.name] = [];
        else initialMasterFilters[field.name] = "";
      });
      // setMasterFilters(initialMasterFilters); // This state is no longer used
    }
  }, [searchCriteria]);

  // Calculate variables before early returns
  const criteriaArray = Array.isArray(searchCriteria)
    ? searchCriteria
    : Array.isArray(searchCriteria?.data)
    ? searchCriteria.data
    : [];

  const availableFilters = criteriaArray.filter(
    (field: any) =>
      !activeFilters.includes(field.name) && field.name !== "ticket_id"
  );

  const canAddMoreFilters = activeFilters.length < MAX_FILTERS;
  const filteredAvailableFilters = availableFilters.filter((field: any) =>
    field.label.toLowerCase().includes(filterSearch.toLowerCase())
  );

  // Handle max filters alert animation - now safe to use variables
  useEffect(() => {
    if (!drawerOpen && !canAddMoreFilters && activeFilters.length === MAX_FILTERS) {
      setShowMaxFiltersAlert(true);

      // Hide alert after 3 seconds
      const timer = setTimeout(() => {
        setShowMaxFiltersAlert(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [canAddMoreFilters, activeFilters.length, MAX_FILTERS]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>
  ) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name as string]: value }));
    ensureActiveSync(name as string, value);
  };

  // Add a handler for MUI Select (dropdown) fields
  const handleSelectChange = (
    event:
      | React.ChangeEvent<{ name?: string; value: unknown }>
      | SelectChangeEvent<string | string[]>
  ) => {
    const name = (event.target as HTMLInputElement).name;
    const value = event.target.value;
    setFilters((prev) => ({ ...prev, [name as string]: value }));
    ensureActiveSync(name as string, value);
  };

  const handleChipChange = (event: any, fieldName: string) => {
    const nextValue = event.target.value;
    setFilters((prev) => ({ ...prev, [fieldName]: nextValue }));
    ensureActiveSync(fieldName, nextValue);
  };

  // Check if there are any valid filters applied
  const hasValidFilters = () => {
    const selectedFilters: Record<string, any> = Object.fromEntries(
      Object.entries(filters).filter(([key]) => activeFilters.includes(key))
    );

    return Object.values(selectedFilters).some((value) => {
      if (value === undefined || value === null) return false;
      if (Array.isArray(value) && value.length === 0) return false;
      if (typeof value === "string" && value.trim() === "") return false;
      return true;
    });
  };

  const handleApply = async () => {
    if (isApplying) return; // Prevent multiple clicks

    const wasDrawerOpen = drawerOpen;
    setIsApplying(true);

    try {
      // Build payload with only relevant filters
      const buildNonEmpty = (obj: Record<string, any>) => {
        const result: Record<string, any> = {};
        Object.entries(obj).forEach(([key, value]) => {
          if (value === undefined || value === null) return;
          if (Array.isArray(value) && value.length === 0) return;
          if (typeof value === "string" && value.trim() === "") return;
          result[key] = value;
        });
        return result;
      };

      // Only include active filter fields
      const selectedFilters: Record<string, any> = Object.fromEntries(
        Object.entries(filters).filter(([key]) => activeFilters.includes(key))
      );

      const cleanedFilters = buildNonEmpty(selectedFilters);

      if (typeof onApplyFilters === "function") {
        await onApplyFilters(cleanedFilters);
      }

      // If apply was triggered from Drawer, reset state like Clear filters
      if (wasDrawerOpen) {
        const cleared = buildClearedFilters();
        setFilters(cleared);
        setActiveFilters(ticketIdField ? ["ticket_id"] : []);
      }
    } finally {
      // Reset applying state after a short delay to prevent rapid clicking
      setTimeout(() => {
        setIsApplying(false);
      }, 1000);
    }
  };

  // Add a reset handler
  const handleResetFilters = () => {
    const cleared = buildClearedFilters();
    setFilters(cleared);
    setActiveFilters(ticketIdField ? ["ticket_id"] : []); // Keep ticket ID field active if it exists
    if (typeof onApplyFilters === "function") {
      onApplyFilters({});
    }
  };

  // Reset filters state when Drawer opens (fresh start) without triggering apply
  useEffect(() => {
    if (drawerOpen) {
      const cleared = buildClearedFilters();
      setFilters(cleared);
      setActiveFilters(ticketIdField ? ["ticket_id"] : []);
    }
  }, [drawerOpen]);

  if (isLoading) {
    return <TicketFilterSkeleton />;
  }
  if (!criteriaArray || criteriaArray.length === 0) {
    return null;
  }

  const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
    if (!canAddMoreFilters && !drawerOpen) {
      // Show alert when user tries to add more filters beyond limit
      setShowMaxFiltersAlert(true);

      // Hide alert after 3 seconds
      setTimeout(() => {
        setShowMaxFiltersAlert(false);
      }, 3000);

      return; // Don't open popover if max filters reached
    }
    if (closePopoverTimer.current) {
      clearTimeout(closePopoverTimer.current);
      closePopoverTimer.current = null;
    }
    if (activeFilters.length === 0 && topAnchorRef.current) {
      setAnchorEl(topAnchorRef.current);
    } else {
      setAnchorEl(event.currentTarget as HTMLElement);
    }
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box className="w-100 min-w-100 shadow rounded-lg flex flex-col h-full relative">
      <div ref={topAnchorRef} />
      {/* Header */}
      <Box
        className="flex items-center justify-between mb-3 p-2"
        sx={{
          borderBottom: "1px solid #eee",
          backgroundColor: "#e8f0fe",
        }}
      >
        <span className="font-semibold text-gray-700 text-sm">FILTERS</span>
        <Button
          variant="text"
          size="small"
          sx={{ fontSize: 10, fontWeight: "Bold" }}
          onClick={() => setDrawerOpen(true)}
        >
          Show All Filters
        </Button>
      </Box>
      {/* Custom dynamic filter panel */}
      <Box className="flex-1 overflow-y-auto">
        {/* Add filters button and popover */}
        <Box>
          <Popover
            open={Boolean(anchorEl)}
            anchorEl={anchorEl}
            onClose={handlePopoverClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
            PaperProps={{
              sx: {
                p: 0,
                minWidth: 315,
                maxWidth: 315,
                boxShadow: 3,
                borderRadius: 2,
              },
            }}
          >
            <Box sx={{ p: 1, minWidth: 315 }}>
              <TextField
                size="small"
                placeholder="Search..."
                value={filterSearch}
                onChange={(e) => setFilterSearch(e.target.value)}
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon fontSize="small" />
                    </InputAdornment>
                  ),
                }}
                sx={{ mb: 1 }}
              />
              <Box sx={{ maxHeight: 200, overflowY: "auto" }}>
                {filteredAvailableFilters.length === 0 ? (
                  <Box sx={{ color: "text.secondary", p: 1, fontSize: 14 }}>
                    No filters found
                  </Box>
                ) : (
                  filteredAvailableFilters.map((field: any) => (
                    <MenuItem
                      key={field.name}
                      onClick={() => {
                        if (canAddMoreFilters) {
                          setActiveFilters((prev) => [...prev, field.name]);
                          handlePopoverClose(); // Close popover after adding filter
                          setFilterSearch("");
                        }
                      }}
                    >
                      {field.label}
                    </MenuItem>
                  ))
                )}
              </Box>
            </Box>
          </Popover>
        </Box>
        {activeFilters.length === 0 ? (
          <Box className="flex flex-col items-center justify-center py-12">
            <img
              src={emptyimg}
              alt="No filters"
              style={{ width: 120, height: 120, marginTop: 18 }}
            />
            <span className="text-gray-400 text-base">No filters applied</span>
            {activeFilters.length === 0 && (
              <Button
                startIcon={<AddIcon />}
                onClick={handlePopoverOpen}
                disabled={!canAddMoreFilters}
                sx={{
                  color: "#1a73e8",
                  fontWeight: 500,
                  textTransform: "none",
                  pl: 0,
                }}
              >
                Add filters
              </Button>
            )}
          </Box>
        ) : (
          <>
            {activeFilters.map((filterName) => {
              // Handle ticket ID field specially
              const field =
                filterName === "ticket_id"
                  ? ticketIdField
                  : criteriaArray.find((f: any) => f.name === filterName);
              if (!field) return null;

              return (
                <Box className="p-2" key={field.name}>
                  <Box className="flex items-center justify-between mb-1">
                    <div>
                      <span className="text-sm font-medium text-gray-700">
                        {field.label}
                      </span>
                    </div>
                    {/* Only show remove button if it's not the ticket ID field */}
                    {field.name !== "ticket_id" && (
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => {
                          setActiveFilters((prev) =>
                            prev.filter((f) => f !== field.name)
                          );
                          setFilters((prev) => ({
                            ...prev,
                            [field.name]: field.type === "chip" ? [] : "",
                          }));
                        }}
                      >
                        <RemoveCircleOutlineIcon fontSize="small" />
                      </IconButton>
                    )}
                  </Box>
                  {field.type === "dropdown" && field.name === "priority" && (
                    <FormControl fullWidth size="small">
                      <Select
                        name={field.name}
                        value={filters[field.name] ?? ""}
                        onChange={handleSelectChange}
                        displayEmpty
                        renderValue={(selected) => {
                          if (!selected || selected === "") {
                            return (
                              <span style={{ color: "#aaa" }}>
                                {field.placeholder || field.label || "Select"}
                              </span>
                            );
                          }
                          const selectedOption = field.choices?.find(
                            (opt: { value: string; label: string }) =>
                              opt.value === selected
                          );
                          return selectedOption ? (
                            <span
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 6,
                              }}
                            >
                              <span
                                style={{
                                  display: "inline-block",
                                  width: 12,
                                  height: 12,
                                  borderRadius: "50%",
                                  backgroundColor: selectedOption.color,
                                  marginRight: 6,
                                }}
                              ></span>
                              {selectedOption.label}
                            </span>
                          ) : (
                            selected
                          );
                        }}
                      >
                        <MenuItem value="">
                          <span style={{ color: "#aaa" }}>
                            {field.placeholder || field.label || "Select"}
                          </span>
                        </MenuItem>
                        {field.choices?.map((opt: any) => (
                          <MenuItem key={opt.value} value={opt.value}>
                            <span
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 6,
                              }}
                            >
                              <span
                                style={{
                                  display: "inline-block",
                                  width: 12,
                                  height: 12,
                                  borderRadius: "50%",
                                  backgroundColor: opt.color || "#ccc",
                                  marginRight: 6,
                                }}
                              ></span>
                              {opt.label}
                            </span>
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  )}
                  {field.type === "dropdown" && field.name !== "priority" && (
                    <FormControl fullWidth size="small">
                      <Select
                        name={field.name}
                        value={filters[field.name] ?? ""}
                        onChange={handleSelectChange}
                        displayEmpty
                      >
                        <MenuItem value="">
                          <span style={{ color: "#aaa" }}>
                            {field.placeholder || field.label || "Select"}
                          </span>
                        </MenuItem>
                        {field.choices?.map((opt: any) => (
                          <MenuItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  )}
                  {field.type === "text" && (
                    <TextField
                      fullWidth
                      size="small"
                      name={field.name}
                      value={filters[field.name] ?? ""}
                      onChange={handleChange}
                      variant="filled"
                      placeholder={field.placeholder || field.label || ""}
                      sx={{
                        "& .MuiFilledInput-root": {
                          backgroundColor: "#f7f7f7",
                          "&.Mui-focused": {
                            backgroundColor: "#fffbeb",
                          },
                        },
                        "& .MuiFilledInput-underline:before": {
                          borderBottom: "2px solid #c4c4c4", // default (not focused)
                        },
                        "& .MuiFilledInput-underline:hover:not(.Mui-disabled):before":
                          {
                            borderBottom: "2px solid #c4c4c4", // on hover
                          },
                        "& .MuiFilledInput-underline:after": {
                          borderBottom: "2px solid #c4c4c4", // on focus
                        },
                      }}
                    />
                  )}
                  {field.type === "date" && (
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        value={filters[field.name] || null}
                        onChange={(newValue: any) => {
                          setFilters((prev) => ({
                            ...prev,
                            [field.name]: newValue,
                          }));
                          ensureActiveSync(field.name, newValue);
                        }}
                        slotProps={{
                          textField: {
                            fullWidth: true,
                            size: "small",
                            variant: "outlined",
                            name: field.name,
                            placeholder: field.placeholder || field.label || "",
                          },
                        }}
                        format="DD/MM/YYYY"
                      />
                    </LocalizationProvider>
                  )}
                  {field.type === "chip" && (
                    <FormControl fullWidth size="small">
                      <Select
                        multiple
                        name={field.name}
                        value={
                          Array.isArray(filters[field.name])
                            ? filters[field.name]
                            : []
                        }
                        onChange={(e) => handleChipChange(e, field.name)}
                        displayEmpty
                        renderValue={(selected) => {
                          if (!selected || selected.length === 0) {
                            return (
                              <span style={{ color: "#aaa" }}>
                                {field.placeholder || field.label || "Select"}
                              </span>
                            );
                          }
                          return (
                            <Box
                              sx={{
                                display: "flex",
                                flexWrap: "wrap",
                                gap: 0.5,
                              }}
                            >
                              {selected.map((value: string) => {
                                const label =
                                  field.choices.find(
                                    (c: { value: string; label: string }) =>
                                      c.value === value
                                  )?.label || value;
                                return (
                                  <Chip
                                    key={value}
                                    label={label}
                                    size="small"
                                  />
                                );
                              })}
                            </Box>
                          );
                        }}
                      >
                        <MenuItem value="">
                          <span style={{ color: "#aaa" }}>
                            {field.placeholder || field.label || "Select"}
                          </span>
                        </MenuItem>
                        {field.choices?.map((opt: any) => (
                          <MenuItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  )}
                </Box>
              );
            })}
            <Popover
              open={Boolean(anchorEl)}
              anchorEl={anchorEl}
              onClose={handlePopoverClose}
              anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
              PaperProps={{
                sx: {
                  p: 0,
                  minWidth: 315,
                  maxWidth: 315,
                  boxShadow: 3,
                  borderRadius: 2,
                },
              }}
            >
              <Box sx={{ p: 1, minWidth: 315 }}>
                <TextField
                  size="small"
                  placeholder="Search..."
                  value={filterSearch}
                  onChange={(e) => setFilterSearch(e.target.value)}
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon fontSize="small" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ mb: 1 }}
                />
                <Box sx={{ maxHeight: 200, overflowY: "auto" }}>
                  {filteredAvailableFilters.length === 0 ? (
                    <Box sx={{ color: "text.secondary", p: 1, fontSize: 14 }}>
                      No filters found
                    </Box>
                  ) : (
                    filteredAvailableFilters.map((field: any) => (
                      <MenuItem
                        key={field.name}
                        onClick={() => {
                          if (canAddMoreFilters) {
                            setActiveFilters((prev) => [...prev, field.name]);
                            handlePopoverClose(); // Close popover after adding filter
                            setFilterSearch("");
                          }
                        }}
                      >
                        {field.label}
                      </MenuItem>
                    ))
                  )}
                </Box>
              </Box>
            </Popover>

            {/* Add Filter Button - Show when there are active filters but not at max */}
            {canAddMoreFilters && activeFilters.length > 0 && (
              <Box sx={{ mt: 2, display: "flex", justifyContent: "center" }}>
                <Button
                  startIcon={<AddIcon />}
                  onClick={handlePopoverOpen}
                  variant="text"
                  color="primary"
                  size="small"
                  sx={{
                    fontWeight: 550,
                  }}
                >
                  Add Filter ({activeFilters.length}/{MAX_FILTERS})
                </Button>
              </Box>
            )}

            {/* Max Filters Reached Alert - hidden when drawer is open */}
            {!drawerOpen && (
              <Slide
                direction="up"
                in={showMaxFiltersAlert}
                mountOnEnter
                unmountOnExit
              >
                <Box
                  sx={{
                    position: "absolute",
                    bottom: "80px",
                    left: "10px",
                    right: "10px",
                    zIndex: 1000,
                  }}
                >
                  <CustomAlert title="You have exceeded the maximum number of filters" />
                </Box>
              </Slide>
            )}
          </>
        )}
      </Box>
      {/* Fixed Apply and Reset buttons */}
      <Box className="p-2 pb-2 pb-0 z-10 bg-white flex gap-2">
        <Button
          variant="text"
          color="primary"
          fullWidth
          onClick={handleResetFilters}
          sx={{
            fontSize: "0.875rem",
            fontWeight: 600,
            "&:disabled": {
              opacity: 0.5,
            },
          }}
        >
          Reset
        </Button>
        <Button
          variant="contained"
          fullWidth
          color="primary"
          onClick={handleApply}
          disabled={!hasValidFilters() || isApplying}
        >
          {isApplying ? (
            <CircularProgress size={18} color="inherit" />
          ) : (
            "Apply"
          )}
        </Button>
      </Box>

      <CustomSideBarPanel
        open={drawerOpen}
        close={() => {
          setDrawerOpen(false);
        }}
        title={
          <div className="flex items-center gap-2">
            <FilterListAltIcon fontSize="small" />
            <Typography variant="subtitle1" fontWeight={600}>
              {" "}
              All Filters
            </Typography>
          </div>
        }
        width={"30%"}
      >
        <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
          {/* Header */}

          <Divider sx={{ mb: 2 }} />

          {/* Filters List */}
          <Box sx={{ flex: 1, overflowY: "auto", p: 2 }} className="custom-scrollbar">
            {criteriaArray.map((field: any) => (
              <Box
                key={field.name}
                sx={{
                  mb: 3,
                  p: 2,
                  border: "1px solid #e0e0e0",
                  borderRadius: 2,
                }}
              >
                {/* Filter Header */}
                <Typography
                  variant="subtitle2"
                  sx={{ fontWeight: 600, color: "#2c3e50", mb: 2 }}
                >
                  {field.label}
                </Typography>

                {/* Filter Input Components */}
                <Box>
                  {field.type === "text" && (
                    <TextField
                      fullWidth
                      size="small"
                      name={field.name}
                      value={filters[field.name] ?? ""}
                      onChange={handleChange}
                      variant="filled"
                      sx={{
                        "& .MuiFilledInput-root": {
                          backgroundColor: "#f7f7f7",
                          "&.Mui-focused": {
                            backgroundColor: "#fffbeb",
                          },
                        },
                        "& .MuiFilledInput-underline:before": {
                          borderBottom: "2px solid #c4c4c4",
                        },
                        "& .MuiFilledInput-underline:hover:not(.Mui-disabled):before":
                          {
                            borderBottom: "2px solid #c4c4c4",
                          },
                        "& .MuiFilledInput-underline:after": {
                          borderBottom: "2px solid #c4c4c4",
                        },
                      }}
                    />
                  )}

                  {field.type === "dropdown" && field.name === "priority" && (
                    <FormControl fullWidth size="small">
                      <Select
                        name={field.name}
                        value={filters[field.name] ?? ""}
                        onChange={handleSelectChange}
                        renderValue={(selected) => {
                          if (!selected || selected === "") {
                            return (
                              <span style={{ color: "#aaa" }}>
                                Select Priority
                              </span>
                            );
                          }
                          const selectedOption = field.choices?.find(
                            (opt: { value: string; label: string }) =>
                              opt.value === selected
                          );
                          return selectedOption ? (
                            <span
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 6,
                              }}
                            >
                              <span
                                style={{
                                  display: "inline-block",
                                  width: 12,
                                  height: 12,
                                  borderRadius: "50%",
                                  backgroundColor: selectedOption.color,
                                  marginRight: 6,
                                }}
                              ></span>
                              {selectedOption.label}
                            </span>
                          ) : (
                            selected
                          );
                        }}
                      >
                        {field.choices?.map(
                          (opt: {
                            value: string;
                            label: string;
                            color?: string;
                          }) => (
                            <MenuItem key={opt.value} value={opt.value}>
                              <span
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 6,
                                }}
                              >
                                <span
                                  style={{
                                    display: "inline-block",
                                    width: 12,
                                    height: 12,
                                    borderRadius: "50%",
                                    backgroundColor: opt.color || "#c4c4c4",
                                    marginRight: 6,
                                  }}
                                ></span>
                                {opt.label}
                              </span>
                            </MenuItem>
                          )
                        )}
                      </Select>
                    </FormControl>
                  )}

                  {field.type === "dropdown" && field.name !== "priority" && (
                    <FormControl fullWidth size="small">
                      <Select
                        displayEmpty
                        name={field.name}
                        value={filters[field.name] ?? ""}
                        onChange={handleSelectChange}
                      >
                        {field.choices?.map(
                          (opt: { value: string; label: string }) => (
                            <MenuItem key={opt.value} value={opt.value}>
                              {opt.label}
                            </MenuItem>
                          )
                        )}
                      </Select>
                    </FormControl>
                  )}

                  {field.type === "date" && (
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        value={filters[field.name] || null}
                        onChange={(newValue: any) => {
                          setFilters((prev) => ({
                            ...prev,
                            [field.name]: newValue,
                          }));
                          ensureActiveSync(field.name, newValue);
                        }}
                        slotProps={{
                          textField: {
                            fullWidth: true,
                            size: "small",
                            variant: "outlined",
                            name: field.name,
                          },
                        }}
                        format="DD/MM/YYYY"
                      />
                    </LocalizationProvider>
                  )}

                  {field.type === "chip" && (
                    <FormControl fullWidth size="small">
                      <Select
                        multiple
                        name={field.name}
                        value={
                          Array.isArray(filters[field.name])
                            ? filters[field.name]
                            : []
                        }
                        onChange={(e) => handleChipChange(e, field.name)}
                        displayEmpty
                        renderValue={(selected) => {
                          if (!selected || selected.length === 0) {
                            return (
                              <span style={{ color: "#aaa" }}>
                                Select {field.label}
                              </span>
                            );
                          }
                          return (
                            <Box
                              sx={{
                                display: "flex",
                                flexWrap: "wrap",
                                gap: 0.5,
                              }}
                            >
                              {selected.map((value: string) => {
                                const label =
                                  field.choices?.find(
                                    (c: { value: string; label: string }) =>
                                      c.value === value
                                  )?.label || value;
                                return (
                                  <Chip
                                    key={value}
                                    label={label}
                                    size="small"
                                  />
                                );
                              })}
                            </Box>
                          );
                        }}
                      >
                        {field.choices?.map(
                          (opt: { value: string; label: string }) => (
                            <MenuItem key={opt.value} value={opt.value}>
                              {opt.label}
                            </MenuItem>
                          )
                        )}
                      </Select>
                    </FormControl>
                  )}
                </Box>
              </Box>
            ))}
          </Box>

          {/* Footer Actions */}
          <Box sx={{ borderTop: "1px solid #e0e0e0", p: 2 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: 2,
              }}
            >
              {/* Clear filters link on the left */}
              <Button
                variant="text"
                onClick={() => {
                  handleResetFilters();
                  setDrawerOpen(false);
                }}
                sx={{ fontWeight: 600 }}
              >
                Clear filters
              </Button>

              {/* Cancel and Apply buttons on the right */}
              <Box sx={{ display: "flex", gap: 1 }}>
                <Button
                  variant="contained"
                  color="primary"
                  disabled={!hasValidFilters() || isApplying}
                  onClick={() => {
                    handleApply();
                    if (drawerOpen) {
                      setDrawerOpen(false);
                    }
                  }}
                >
                  {isApplying ? (
                    <CircularProgress size={18} color="inherit" />
                  ) : (
                    "Apply filter"
                  )}
                </Button>
              </Box>
            </Box>
          </Box>
        </Box>
      </CustomSideBarPanel>
    </Box>
  );
};

export default TicketFilterPanel;
