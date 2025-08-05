import React, { useState, useEffect } from "react";
import { useGetAdvancedSearchQuery } from "../../services/ticketAuth";
import TicketFilterSkeleton from "../skeleton/TicketFilterSkeleton";
import TextField from "@mui/material/TextField";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import emptyimg from "../../assets/image/overview-empty-state.svg"
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

interface TicketFilterPanelProps {
  onApplyFilters: (filters: Record<string, any>) => void;
}

const TicketFilterPanel: React.FC<any> = ({ onApplyFilters }) => {
  const {
    data: searchCriteria,
    isLoading,
    error,
  } = useGetAdvancedSearchQuery();
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [showCustomFilters, setShowCustomFilters] = useState(true);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [filterSearch, setFilterSearch] = useState("");
  const closePopoverTimer = React.useRef<NodeJS.Timeout | null>(null);
  const topAnchorRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (searchCriteria && Array.isArray(searchCriteria)) {
      const initialFilters: Record<string, any> = {};
      searchCriteria.forEach((field: any) => {
        if (field.type === "chip") initialFilters[field.name] = [];
        else initialFilters[field.name] = "";
      });
      setFilters(initialFilters);
    }
  }, [searchCriteria]);

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
    onApplyFilters(filters);
    console.log(filters);
  };

  // Add a reset handler
  const handleResetFilters = () => {
    const cleared: Record<string, any> = {};
    criteriaArray.forEach((field: any) => {
      if (field.type === "chip") cleared[field.name] = [];
      else cleared[field.name] = "";
    });
    setFilters(cleared);
    onApplyFilters(cleared);
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

  const availableFilters = criteriaArray.filter(
    (field: any) => !activeFilters.includes(field.name)
  );
  const filteredAvailableFilters = availableFilters.filter((field: any) =>
    field.label.toLowerCase().includes(filterSearch.toLowerCase())
  );

  const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
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
    <Box className="w-100 min-w-100 shadow rounded-lg flex flex-col h-full p-4 relative bg-#f5f7f9">
      <div ref={topAnchorRef} />
      {/* Header */}
      <Box className="flex items-center justify-between mb-2">
        <span className="font-semibold text-gray-700 text-sm">FILTERS</span>
        {!showCustomFilters ? (
          <Button
            variant="text"
            size="small"
            onClick={() => setShowCustomFilters(true)}
            sx={{
              textTransform: 'none',
              fontSize: '0.75rem',
              color: '#1976d2',
              fontWeight: 400,
              padding: 0,
              minWidth: 'auto',
              '&:hover': {
                textDecoration: 'underline',
                backgroundColor: 'transparent',
              },
            }}
          >
            Show applied filters
          </Button>
        ) : (
          <Button
            variant="text"
            size="small"
            onClick={() => setShowCustomFilters(false)}
            sx={{
              textTransform: 'none',
              fontSize: '0.75rem',
              color: '#1976d2',
              fontWeight: 400,
              padding: 0,
              minWidth: 'auto',
              '&:hover': {
                textDecoration: 'underline',
                backgroundColor: 'transparent',
              },
            }}
          >
            Show All Filters
          </Button>
        )}
      </Box>
      {/* Filter fields */}
      {!showCustomFilters ? (
        <Box className="flex-1 overflow-y-auto">
          {criteriaArray.map((field: any) => (
            <Box className="mb-4" key={field.name}>
              {field.type === "dropdown" && field.name === "priority" && (
                <div style={{ marginBottom: 16 }}>
                  <div
                    style={{
                      fontSize: 13,
                      color: "#555",
                      fontWeight: 500,
                      marginBottom: 4,
                    }}
                  >
                    {field.label}
                  </div>
                  <FormControl fullWidth size="small">
                    <Select
                      name={field.name}
                      value={filters[field.name] ?? ""}
                      onChange={handleSelectChange}
                      displayEmpty
                      renderValue={(selected) => {
                        if (!selected || selected === "") {
                          return <span style={{ color: "#aaa" }}></span>;
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
                                  backgroundColor: opt.color || "#ccc",
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
                </div>
              )}
              {field.type === "dropdown" && field.name !== "priority" && (
                <div style={{ marginBottom: 16 }}>
                  <div
                    style={{
                      fontSize: 13,
                      color: "#555",
                      fontWeight: 500,
                      marginBottom: 4,
                    }}
                  >
                    {field.label}
                  </div>
                  <FormControl fullWidth size="small">
                    <Select
                      name={field.name}
                      value={filters[field.name] ?? ""}
                      onChange={handleSelectChange}
                      displayEmpty
                      renderValue={(selected) => {
                        if (!selected || selected === "") {
                          return <span style={{ color: "#aaa" }}></span>;
                        }
                        const selectedOption = field.choices?.find(
                          (opt: { value: string; label: string }) =>
                            opt.value === selected
                        );
                        return selectedOption ? selectedOption.label : selected;
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
                </div>
              )}
              {field.type === "text" && (
                <div style={{ marginBottom: 16 }}>
                  <div
                    style={{
                      fontSize: 13,
                      color: "#555",
                      fontWeight: 500,
                      marginBottom: 4,
                    }}
                  >
                    {field.label}
                  </div>
                  <TextField
                    fullWidth
                    size="small"
                    name={field.name}
                    value={filters[field.name]}
                    onChange={handleChange}
                    variant="outlined"
                    // No label or placeholder
                  />
                </div>
              )}
              {field.type === "date" && (
                <div style={{ marginBottom: 16 }}>
                  <div
                    style={{
                      fontSize: 13,
                      color: "#555",
                      fontWeight: 500,
                      marginBottom: 4,
                    }}
                  >
                    {field.label}
                  </div>
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
                          // No label or placeholder
                        },
                      }}
                      format="DD/MM/YYYY"
                    />
                  </LocalizationProvider>
                </div>
              )}
              {field.type === "chip" && (
                <div style={{ marginBottom: 16 }}>
                  <div
                    style={{
                      fontSize: 13,
                      color: "#555",
                      fontWeight: 500,
                      marginBottom: 4,
                    }}
                  >
                    {field.label}
                  </div>
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
                          return <span style={{ color: "#aaa" }}></span>;
                        }
                        return (
                          <Box
                            sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}
                          >
                            {selected.map((value: string) => {
                              const label =
                                field.choices.find(
                                  (c: { value: string; label: string }) =>
                                    c.value === value
                                )?.label || value;
                              return (
                                <Chip key={value} label={label} size="small" />
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
                </div>
              )}
            </Box>
          ))}
        </Box>
      ) : (
        // Custom dynamic filter panel (copied from previous dynamic logic)
        <Box className="flex-1 overflow-y-auto">
          {/* Add filters button and popover */}
          <Box className="mb-2">
            <Popover
              open={Boolean(anchorEl)}
              anchorEl={anchorEl}
              onClose={handlePopoverClose}
              anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
              PaperProps={{
                sx: {
                  p: 0,
                  minWidth: 290,
                  maxWidth: 290,
                  boxShadow: 3,
                  borderRadius: 2,
                },
              }}
            >
              <Box sx={{ p: 1, minWidth: 290 }}>
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
                          setActiveFilters((prev) => [...prev, field.name]);
                          handlePopoverClose(); // Close popover after adding filter
                          setFilterSearch("");
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
                style={{ width: 120, height: 120, marginBottom: 16 }}
              />
              <span className="text-gray-400 text-base">
                No filters applied
              </span>
              {activeFilters.length === 0 && (
                <Button
                  startIcon={<AddIcon />}
                  onClick={handlePopoverOpen}
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
                const field = criteriaArray.find(
                  (f: any) => f.name === filterName
                );
                if (!field) return null;
                return (
                  <Box className="mb-4" key={field.name}>
                    <Box className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">
                        {field.label}
                      </span>
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
                        variant="outlined"
                        placeholder={field.placeholder || field.label || ""}
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
              <Button
                startIcon={<AddIcon />}
                onClick={handlePopoverOpen}
                sx={{
                  color: "#1a73e8",
                  fontWeight: 500,
                  textTransform: "none",
                  pl: 0,
                  mt: 1, // margin top for spacing
                }}
              >
                Add filters
              </Button>
              <Popover
                open={Boolean(anchorEl)}
                anchorEl={anchorEl}
                onClose={handlePopoverClose}
                anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
                PaperProps={{
                  sx: {
                    p: 0,
                    minWidth: 290,
                    maxWidth: 290,
                    boxShadow: 3,
                    borderRadius: 2,
                  },
                }}
              >
                <Box sx={{ p: 1, minWidth: 290 }}>
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
                            setActiveFilters((prev) => [...prev, field.name]);
                            handlePopoverClose(); // Close popover after adding filter
                            setFilterSearch("");
                          }}
                        >
                          {field.label}
                        </MenuItem>
                      ))
                    )}
                  </Box>
                </Box>
              </Popover>
            </>
          )}
        </Box>
      )}
      {/* Fixed Apply and Reset buttons */}
      <Box className="pt-2 pb-0 z-10 bg-white flex gap-2">
        {showCustomFilters && (
          <Button
            variant="contained"
            color="inherit"
            fullWidth
            onClick={handleResetFilters}
            sx={{
              fontSize: '0.875rem',
              fontWeight: 600,              
              '&:disabled': {
                opacity: 0.5,
              },
            }}
          >
            Reset
          </Button>
        )}
        <Button
          variant="contained"
          fullWidth
          color="primary"
          onClick={handleApply}
          disabled={activeFilters.length === 0}
          sx={{
            fontSize: '0.875rem',
            fontWeight: 600,
            '&:disabled': {
              opacity: 0.5,
              backgroundColor: '#9ca3af',
            },
          }}
        >
          Apply
        </Button>
      </Box>
    </Box>
  );
};

export default TicketFilterPanel;
