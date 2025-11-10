import {
  Autocomplete,
  Avatar,
  Chip,
  CircularProgress,
  TextField,
  Typography,
} from "@mui/material";
import CustomToolTip from "./CustomToolTip"; // adjust path
import React, { useEffect, useState } from "react";
import { useDebounce } from "../../hooks/useDebounce";
import { isValidEmail } from "../../utils/Utils";
import { useToast } from "../../hooks/useToast";
export const formatName = (name: any) => {
  if (!name) return "";

  if (name.length > 5) {
    return name.slice(0, 5) + "....";
  }

  return name; // return full name if short
};
interface EmailAutocompleteProps {
  label: string;

  value: any[];
  qtkMethod: any;
  type: "cc" | "bcc" | "to" | "notify" | "approvalTo" | "approvalCc"; // so it knows which field it's for
  optionLabelKey?: keyof any;
  onDelete: (index: number, type: string) => void;
  onChange: (value: any) => void;
  optionKey?: keyof any;
  renderOptionExtra?: (option: any) => React.ReactNode;
  width?: any;
  isRendered?: boolean;
}

const EmailAutocomplete: React.FC<EmailAutocompleteProps> = ({
  label,
  optionKey,
  value,
  qtkMethod,
  type,
  optionLabelKey = "name",
  onDelete,
  onChange,
  renderOptionExtra,
  width,
  isRendered = true,
}) => {
  const { showToast } = useToast();
  const [inputValue, setInputValue] = useState("");
  const [options, setOptions] = useState<any[]>([]);
  const [internalLoading, setInternalLoading] = useState(false);
  const debouncedValue: any = useDebounce(inputValue, 300);

  useEffect(() => {
    const fetchOptions = async () => {
      if (!debouncedValue) {
        setOptions([]);
        return;
      }

      try {
        setInternalLoading(true);
        const res = await qtkMethod({ search: debouncedValue }).unwrap();

        const data = Array.isArray(res) ? res : res?.data;

        if (Array.isArray(data) && data.length > 0) {
          setOptions(data);
        } else {
          setOptions([
            {
              [optionLabelKey]: debouncedValue,
            },
          ]);
        }
      } catch {
        setOptions([]);
      } finally {
        setInternalLoading(false);
      }
    };

    fetchOptions();
  }, [debouncedValue, qtkMethod]);

  const handleOnChange = (newValue: any) => {
    if (!newValue) return;

    const values = Array.isArray(newValue) ? newValue : [newValue];
    const lastSelected = values[values.length - 1];

    const possibleEmail = lastSelected?.email || lastSelected?.name;

    // Validation checks
    if (possibleEmail && !isValidEmail(possibleEmail)) {
      showToast("Invalid email format", "error");
      return;
    }

    if (
      Array.isArray(value) &&
      value.some((item) => item?.email === lastSelected?.email)
    ) {
      showToast("Email already exists", "error");
      return;
    }

    if (
      Array.isArray(value) &&
      value.length >= 3 &&
      (type === "cc" || type === "bcc" || type === "approvalCc")
    ) {
      showToast("Maximum 3 CC allowed", "error");
      return;
    }

    onChange(newValue);
  };

  const getOptionLabel = (option: any | string) => {
    if (typeof option === "string") return option; // fallback string case
    return (option?.[optionLabelKey] as string) || "";
  };

  return (
    <Autocomplete
      multiple
      disableClearable
      popupIcon={null}
      options={options}
      value={value}
      loading={internalLoading}
      getOptionLabel={(option) => getOptionLabel(option)}
      filterOptions={(x) => x}
      onChange={(_, newVal: any) => handleOnChange(newVal)}
      onInputChange={(_, newVal) => setInputValue(newVal)}
      getOptionDisabled={(option) => option === "Type to search"}
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
      {...(isRendered
        ? {
            renderTags: (selected, getTagProps) =>
              selected.map((option: any, index) => (
                <CustomToolTip
                  key={index}
                  title={
                    <Typography variant="subtitle2" sx={{ p: 1.5 }}>
                      {option.name
                        ? `${option.name} (${option.email})`
                        : option.email}
                    </Typography>
                  }
                >
                  <Chip
                    {...getTagProps({ index })}
                    variant="outlined"
                    color="primary"
                    label={
                      typeof option === "string"
                        ? option
                        : formatName(
                            option?.name || option?.userName || option?.email
                          )
                    }
                    onDelete={() => onDelete(index, type)}
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
                </CustomToolTip>
              )),
          }
        : {
            renderTags: () => null,
          })}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label && label}
          variant="outlined"
          fullWidth
          size="small"
          InputProps={{
            ...params.InputProps,

            endAdornment: (
              <>
                {internalLoading ? (
                  <CircularProgress color="inherit" size={16} />
                ) : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
          sx={{
            width: width && width,
            "& .MuiOutlinedInput-root": {
              borderRadius: "4px",
              backgroundColor: "#f9fafb",
              "&:hover fieldset": { borderColor: "#9ca3af" },
              "&.Mui-focused fieldset": { borderColor: "#1a73e8" },
            },
            "& label.Mui-focused": { color: "#1a73e8" },
            "& label": { fontWeight: "bold" },
          }}
        />
      )}
    />
  );
};

export default React.memo(EmailAutocomplete);
