import React, { useState, useEffect } from "react";
import {
  Autocomplete,
  Chip,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";

import { useDebounce } from "../../hooks/useDebounce";

import { isValidEmail } from "../../utils/Utils";
import { useToast } from "../../hooks/useToast";
import { Search } from "@mui/icons-material";

interface AsyncAutocompleteProps<T> {
  label?: string;
  qtkMethod: any; // RTK trigger
  value: any | null;
  onChange: (value: T | null) => void;
  optionLabelKey?: keyof T; // e.g. "name"
  optionKey?: keyof T | any; // e.g. "userID"
  renderOptionExtra?: (option: T) => React.ReactNode;
  placeholder?: string;
  debounceTime?: number;
  multiple?: boolean; // allow multi-select if needed
  isFallback?: boolean;
  loading?: boolean;
  icon?: any;
  size?: "small" | "medium";
}

function AsyncAutocomplete<T extends Record<string, any>>({
  label = "Select Option",
  qtkMethod,
  value,
  onChange,
  optionLabelKey = "name",
  optionKey,
  renderOptionExtra,
  placeholder = "Type to search...",
  debounceTime = 500,
  multiple = false,
  isFallback = false,
  loading,
  icon = <Search sx={{ color: "#666", mr: 1 }} />,
  size = "medium",
}: AsyncAutocompleteProps<T>) {
  console.log("value", value);
  const { showToast } = useToast();
  const [inputValue, setInputValue] = useState("");
  const [options, setOptions] = useState<T[]>([]);

  const debouncedValue: any = useDebounce(inputValue, debounceTime);

  useEffect(() => {
    const fetchOptions = async () => {
      if (!debouncedValue) {
        setOptions([]);
        return;
      }

      try {
        const res = await qtkMethod({ search: debouncedValue }).unwrap();
        const data = Array.isArray(res) ? res : res?.data;

        if (Array.isArray(data) && data.length > 0) {
          setOptions(data);
        } else {
          setOptions(
            isFallback
              ? [
                  {
                    [optionLabelKey]: debouncedValue,
                  } as T,
                ]
              : []
          );
        }
      } catch {
        setOptions([]);
      }
    };

    fetchOptions();
  }, [debouncedValue, qtkMethod]);

  const handleOnChange = (newValue: any) => {
    const possibleEmail = newValue?.email || newValue?.name;

    if (possibleEmail && !isValidEmail(possibleEmail)) {
      showToast("Invalid email format", "error");
      return;
    } else {
      onChange(newValue);
    }
  };

  const getOptionLabel = (option: T | string) => {
    if (typeof option === "string") return option; // fallback string case
    return (option?.[optionLabelKey] as string) || "";
  };

  return (
    <Autocomplete
      disableClearable
      popupIcon={null}
      multiple={multiple}
      sx={{ my: 1.5 }}
      value={value}
      options={options}
      loading={loading}
      getOptionLabel={getOptionLabel}
      onChange={(_, newVal: any) => handleOnChange(newVal)}
      onInputChange={(_, newVal) => setInputValue(newVal)}
      filterOptions={(x) => x}
      noOptionsText="No Data Found"
      renderOption={(props, option: any) => (
        <li
          {...props}
          key={optionKey ? option[optionKey] : getOptionLabel(option)}
        >
          <div className="flex flex-col">
            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
              {getOptionLabel(option)}
            </Typography>
            {renderOptionExtra && renderOptionExtra(option)}
          </div>
        </li>
      )}
      renderTags={(selected, getTagProps) =>
        selected.map((option, index) => (
          <Chip
            //@ts-ignore
            key={optionKey ? option[optionKey] : getOptionLabel(option)}
            variant="outlined"
            color="primary"
            label={getOptionLabel(option)}
            {...getTagProps({ index })}
            sx={{
              cursor: "pointer",
              height: "20px",
              color: "primary.main",
              "& .MuiChip-deleteIcon": {
                color: "error.main",
                width: "12px",
              },
              "& .MuiChip-deleteIcon:hover": {
                color: "#e87f8c",
              },
            }}
          />
        ))
      }
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          placeholder={placeholder}
          size= {size}
          fullWidth
          InputProps={{
            ...params.InputProps,
            startAdornment: (
              <InputAdornment position="start">{icon}</InputAdornment>
            ),
          }}
        />
      )}
    />
  );
}

export default React.memo(AsyncAutocomplete);
