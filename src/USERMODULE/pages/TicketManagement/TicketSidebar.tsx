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
import { useCommanApiMutation } from "../../../services/threadsApi";
import CustomAlert from "../../../components/reusable/CustomAlert";

import { Drawer, Typography, Divider } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
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
  const [commanApi] = useCommanApiMutation();
  const [drawerOpen, setDrawerOpen] = useState(false);
  
  // Find ticket ID field from API response
  const ticketIdField = searchCriteria?.find((field: any) => field.name === "ticket_id");

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
        setActiveFilters(prev => [...prev, "ticket_id"]);
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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>
  ) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name as string]: value }));
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
  };

  const handleChipChange = (event: any, fieldName: string) => {
    setFilters((prev) => ({ ...prev, [fieldName]: event.target.value }));
  };

  const handleApply = () => {
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

    const payload = {
      url: "apply-filters",
      body: cleanedFilters,
    };
    commanApi(payload);
    if (typeof onApplyFilters === "function") {
      onApplyFilters(cleanedFilters);
    }
  };

  // Add a reset handler
  const handleResetFilters = () => {
    const cleared: Record<string, any> = {};
    // Preserve ticket ID field if it exists
    if (ticketIdField) {
      cleared["ticket_id"] = "";
    }
    criteriaArray.forEach((field: any) => {
      if (field.type === "chip") cleared[field.name] = [];
      else cleared[field.name] = "";
    });
    setFilters(cleared);
    setActiveFilters(ticketIdField ? ["ticket_id"] : []); // Keep ticket ID field active if it exists
    if (typeof onApplyFilters === "function") {
      onApplyFilters({});
    }
  };

  if (isLoading) {
    return <TicketFilterSkeleton />;
  }
  if (error) {
    return <div className="p-4 text-red-500">Failed to load filters.</div>;
  }
  const criteriaArray = Array.isArray(searchCriteria)
    ? searchCriteria
    : Array.isArray(searchCriteria?.data)
    ? searchCriteria.data
    : [];
  if (!criteriaArray || criteriaArray.length === 0) {
    return null;
  }

  const availableFilters = criteriaArray.filter((field: any) => 
    !activeFilters.includes(field.name) && field.name !== "ticket_id"
  );

  // Check if we can add more filters (max 5, with ticket_id always included)
  const canAddMoreFilters = activeFilters.length < MAX_FILTERS;
  const filteredAvailableFilters = availableFilters.filter((field: any) =>
    field.label.toLowerCase().includes(filterSearch.toLowerCase())
  );

  const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
    if (!canAddMoreFilters) {
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
    <Box className="w-100 min-w-100 shadow rounded-lg flex flex-col h-full relative bg-#f5f7f9">
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
              <span className="text-gray-400 text-base">
                No filters applied
              </span>
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
                const field = filterName === "ticket_id" 
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
                          value={filters[field.name]}
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
                          value={filters[field.name]}
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
                        value={filters[field.name]}
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
                        "& .MuiFilledInput-underline:hover:not(.Mui-disabled):before": {
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
                          }}
                          slotProps={{
                            textField: {
                              fullWidth: true,
                              size: "small",
                              variant: "outlined",
                              name: field.name,
                              placeholder:
                                field.placeholder || field.label || "",
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
                    fontWeight: 550
                  }}
                >
                  Add Filter ({activeFilters.length}/{MAX_FILTERS})
                </Button>
              </Box>
            )}

            {/* Max Filters Reached Alert */}
            {!canAddMoreFilters && (
              <Box
                sx={{
                  bottom: "80px",
                  position: "absolute",
                  padding: "0 10px"
                }}
              >
                <CustomAlert title="You have exceeded the maximum number of filters" />
        </Box>
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
          disabled={activeFilters.length === 0}
          sx={{
            fontSize: "0.875rem",
            fontWeight: 600,
            "&:disabled": {
              opacity: 0.5,
              backgroundColor: "#9ca3af",
            },
          }}
        >
          Apply
        </Button>
      </Box>

      {/* All Filters Drawer */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        sx={{
          "& .MuiDrawer-paper": {
            width: "30%",
            padding: 0,
          },
        }}
      >
        <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
          {/* Header */}
          <Box sx={{ p: 2, display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: "#e8f0fe" }}>
            <Typography variant="h6" sx={{ fontWeight: 600, color: "#2c3e50" }}>
              All Filters
            </Typography>
            <IconButton onClick={() => setDrawerOpen(false)} size="small">
              <CloseIcon />
            </IconButton>
          </Box>

          <Divider sx={{ mb: 2 }} />

          {/* Filters List */}
          <Box sx={{ flex: 1, overflowY: "auto", p: 2 }}>
            {criteriaArray.map((field: any) => (
              <Box key={field.name} sx={{ mb: 3, p: 2, border: "1px solid #e0e0e0", borderRadius: 2 }}>
                {/* Filter Header */}
                <Typography variant="subtitle2" sx={{ fontWeight: 600, color: "#2c3e50", mb: 2 }}>
                  {field.label}
                </Typography>

                {/* Filter Input Components */}
                <Box>
                  {field.type === "text" && (
                    <TextField
                      fullWidth
                      size="small"
                      name={field.name}
                      label={field.label}
                      value={filters[field.name]}
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
                        "& .MuiFilledInput-underline:hover:not(.Mui-disabled):before": {
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
                        displayEmpty
                        renderValue={(selected) => {
                          if (!selected || selected === "") {
                            return <span style={{ color: "#aaa" }}>Select Priority</span>;
                          }
                          const selectedOption = field.choices?.find(
                            (opt: { value: string; label: string }) => opt.value === selected
                          );
                          return selectedOption ? (
                            <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
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
                        {field.choices?.map((opt: { value: string; label: string; color?: string }) => (
                          <MenuItem key={opt.value} value={opt.value}>
                            <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
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
                        ))}
                      </Select>
                    </FormControl>
                  )}

                  {field.type === "dropdown" && field.name !== "priority" && (
                    <FormControl fullWidth size="small">
                      <InputLabel>{field.label}</InputLabel>
                      <Select
                        name={field.name}
                        labelId={field.name}
                        id={field.name}
                        label={field.label}
                        value={filters[field.name] ?? ""}
                        onChange={handleSelectChange}
                      >
                        {field.choices?.map((opt: { value: string; label: string }) => (
                          <MenuItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  )}

                  {field.type === "date" && (
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        label={field.label}
                        value={filters[field.name] || null}
                        onChange={(newValue: any) => {
                          setFilters((prev) => ({
                            ...prev,
                            [field.name]: newValue,
                          }));
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
                      <InputLabel>{field.label}</InputLabel>
                      <Select
                        multiple
                        name={field.name}
                        value={Array.isArray(filters[field.name]) ? filters[field.name] : []}
                        onChange={(e) => handleChipChange(e, field.name)}
                        displayEmpty
                        renderValue={(selected) => {
                          if (!selected || selected.length === 0) {
                            return <span style={{ color: "#aaa" }}>Select {field.label}</span>;
                          }
                          return (
                            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                              {selected.map((value: string) => {
                                const label = field.choices.find(
                                  (c: { value: string; label: string }) => c.value === value
                                )?.label || value;
                                return (
                                  <Chip key={value} label={label} size="small" />
                                );
                              })}
                            </Box>
                          );
                        }}
                      >
                        {field.choices?.map((opt: { value: string; label: string }) => (
                          <MenuItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  )}
                </Box>
              </Box>
            ))}
          </Box>

          {/* Footer Actions */}
          <Box sx={{ borderTop: "1px solid #e0e0e0", p: 2 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              {/* Clear filters link on the left */}
              <Button
                variant="text"
                onClick={() => {
                  handleResetFilters();
                  setDrawerOpen(false);
                }}
                sx={{
                  color: "#1976d2",
                  textTransform: "none",
                  fontSize: "0.875rem",
                  fontWeight: 500,
                  padding: 0,
                  minWidth: "auto",
                  "&:hover": {
                    backgroundColor: "transparent",
                    textDecoration: "underline",
                  },
                }}
              >
                Clear filters
              </Button>

              {/* Cancel and Apply buttons on the right */}
              <Box sx={{ display: "flex", gap: 1 }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => {
                    handleApply();
                    setDrawerOpen(false);
                  }}
                >
                  Apply filter
                </Button>
              </Box>
            </Box>
          </Box>
        </Box>
      </Drawer>
    </Box>
  );
};

export default TicketFilterPanel;
