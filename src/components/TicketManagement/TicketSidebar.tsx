import React, { useState, useEffect } from "react";
import { useGetAdvancedSearchQuery } from "../../services/ticketAuth";
import TicketFilterSkeleton from "../skeleton/TicketFilterSkeleton";
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Chip from "@mui/material/Chip";
import Box from "@mui/material/Box";

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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>
  ) => {
    const { name, value } = e.target;
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

  return (
    <Box className="w-72 min-w-72 bg-white shadow rounded-lg flex flex-col h-full p-4 relative h-calc(100vh - 80px) overflow-scroll">
      <Box className="flex items-center justify-between mb-2">
        <span className="font-semibold text-gray-700 text-sm">FILTERS</span>
        <button className="text-xs text-blue-600 hover:underline">
          Show applied filters
        </button>
      </Box>
      {/* DYNAMIC FIELDS */}
      {criteriaArray.map((field: any) => (
        <Box className="mb-4" key={field.name}>
          {field.type === "dropdown" && (
            <FormControl fullWidth size="small">
              <InputLabel>{field.label}</InputLabel>
              <Select
                name={field.name}
                value={filters[field.name]}
                label={field.label}
                onChange={() => handleChange}
              >
                <MenuItem value="">Select {field.label}</MenuItem>
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
            <TextField
              fullWidth
              size="small"
              label={field.label}
              name={field.name}
              value={filters[field.name]}
              onChange={handleChange}
              type="date"
              InputLabelProps={{ shrink: true }}
              variant="outlined"
            />
          )}
          {field.type === "chip" && (
            <FormControl fullWidth size="small">
              <InputLabel>{field.label}</InputLabel>
              <Select
                multiple
                name={field.name}
                value={
                  Array.isArray(filters[field.name]) ? filters[field.name] : []
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
                      return <Chip key={value} label={label} size="small" />;
                    })}
                  </Box>
                )}
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
      ))}
      <Box className="sticky bottom-0 left-0 right-0 bg-white pt-2 pb-0 z-10">
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
