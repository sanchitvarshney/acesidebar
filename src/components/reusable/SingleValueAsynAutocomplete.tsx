import React, { useState, useEffect } from "react";
import {
  Autocomplete,
  Chip,
  CircularProgress,
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
  showIcon?: boolean;
  width?: any;

  variant?: any;
}

function AsyncAutocomplete<T extends Record<string, any>>({
  label,
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
  showIcon = true,
  width,

  variant = "outlined",
}: AsyncAutocompleteProps<T>) {
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
      sx={{ width: width && width }}
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
      renderInput={(params) => (
        <TextField
          {...params}
          label={label && label}
          placeholder={placeholder}
          size={size}
          fullWidth
          variant={variant}
          InputProps={{
            ...params.InputProps,
            startAdornment: showIcon && (
              <InputAdornment position="start">{icon}</InputAdornment>
            ),
            endAdornment: (
              <>
                {loading ? (
                  <CircularProgress color="inherit" size={16} />
                ) : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
    />
  );
}

export default React.memo(AsyncAutocomplete);
