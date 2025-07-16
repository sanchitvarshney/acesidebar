import React, { useState, useEffect } from "react";
import { useGetAdvancedSearchQuery } from "../../services/ticketAuth";
import TicketFilterSkeleton from "../skeleton/TicketFilterSkeleton";
import TextField from "@mui/material/TextField";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
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
  const [showCustomFilters, setShowCustomFilters] = useState(false);
  const [activeFilters, setActiveFilters] = useState<string[]>(["createdAt"]);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [filterSearch, setFilterSearch] = useState("");

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

  return (
    <Box className="w-72 min-w-72 bg-white shadow rounded-lg flex flex-col h-full p-4 relative">
      {/* Header */}
      <Box className="flex items-center justify-between mb-2">
        <span className="font-semibold text-gray-700 text-sm">FILTERS</span>
        {!showCustomFilters ? (
          <button
            className="text-xs text-blue-600 hover:underline"
            onClick={() => setShowCustomFilters(true)}
          >
            Show applied filters
          </button>
        ) : (
          <button
            className="text-xs text-blue-600 hover:underline"
            onClick={() => setShowCustomFilters(false)}
          >
            Show All Filters
          </button>
        )}
      </Box>
      {/* Filter fields */}
      {!showCustomFilters ? (
        <Box className="flex-1 overflow-y-auto">
          {criteriaArray.map((field: any) => (
            <Box className="mb-4" key={field.name}>
              {field.type === "dropdown" && (
                <FormControl fullWidth size="small">
                  <InputLabel>{field.label}</InputLabel>
                  <Select
                    name={field.name}
                    value={filters[field.name]}
                    onChange={handleSelectChange}
                    label={field.label}
                  >
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
                  label={field.label}
                  name={field.name}
                  value={filters[field.name]}
                  onChange={handleChange}
                  variant="outlined"
                />
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
                  />
                </LocalizationProvider>
              )}
              {field.type === "chip" && (
                <FormControl fullWidth size="small">
                  <InputLabel>{field.label}</InputLabel>
                  <Select
                    multiple
                    name={field.name}
                    value={
                      Array.isArray(filters[field.name])
                        ? filters[field.name]
                        : []
                    }
                    onChange={(e) => handleChipChange(e, field.name)}
                    label={field.label}
                    renderValue={(selected) => (
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
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
                    )}
                  >
                    {field.choices?.map((opt: any) => (
                      <MenuItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            </Box>
          ))}
        </Box>
      ) : (
        // Custom dynamic filter panel (copied from previous dynamic logic)
        <Box className="flex-1 overflow-y-auto">
          {activeFilters.map((filterName) => {
            const field = criteriaArray.find((f: any) => f.name === filterName);
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
                {field.type === "dropdown" && (
                  <FormControl fullWidth size="small">
                    <Select
                      name={field.name}
                      value={filters[field.name]}
                      onChange={handleSelectChange}
                      displayEmpty
                    >
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
                    label={field.label}
                    name={field.name}
                    value={filters[field.name]}
                    onChange={handleChange}
                    variant="outlined"
                  />
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
                      renderValue={(selected) => (
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
                      )}
                    >
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
          {/* Add filters button and popover */}
          <Box className="mb-2">
            <Button
              startIcon={<AddIcon />}
              onClick={(e) => setAnchorEl(e.currentTarget)}
              sx={{
                color: "#2563eb",
                fontWeight: 500,
                textTransform: "none",
                pl: 0,
              }}
            >
              Add filters
            </Button>
            <Popover
              open={Boolean(anchorEl)}
              anchorEl={anchorEl}
              onClose={() => {
                setAnchorEl(null);
                setFilterSearch("");
              }}
              anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
            >
              <Box sx={{ p: 1, minWidth: 220 }}>
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
                          setAnchorEl(null);
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
        </Box>
      )}
      {/* Fixed Apply button */}
      <Box className="pt-2 pb-0 z-10 bg-white">
        <button
          className="w-full bg-blue-600 text-white font-semibold py-2 rounded disabled:opacity-50"
          onClick={handleApply}
          type="button"
        >
          Apply
        </button>
      </Box>
    </Box>
  );
};

export default TicketFilterPanel;
