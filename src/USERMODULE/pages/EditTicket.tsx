import { Email, Person, Subject, Warning } from "@mui/icons-material";
import {
  Alert,
  Autocomplete,
  Avatar,
  Box,
  Button,
  Chip,
  FormHelperText,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import StackEditor from "../../components/reusable/Editor";
import { fetchOptions, isValidEmail } from "../../utils/Utils";
import { useToast } from "../../hooks/useToast";

const EditTicket = ({ onClose }: any) => {
  const { showToast } = useToast();
  const [contactChangeValue, setContactChangeValue] = useState("");
  
  const [options, setOptions] = useState<any>();

  const [errors, setErrors] = useState<{ subject?: string; body?: string }>({});
  const [editData, setEditData] = useState<any>({
    contact: "",
    subject: "",
    body: "",
  });

  const displayContactOptions: any = contactChangeValue ? options : [];

  useEffect(() => {
    const filterValue: any = fetchOptions(contactChangeValue);
  

    filterValue?.length > 0
      ? setOptions(filterValue)
      : setOptions([
          {
            userName: contactChangeValue,
            userEmail: contactChangeValue,
          },
        ]);
  }, [contactChangeValue]);

  

  const handleInputChange = (field: string, value: string) => {
    setEditData((prev: any) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error when user starts typing
    if (errors[field as keyof typeof errors]) {
      setErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }));
    }
  };

  const handleSelectedOption = (
    _: React.SyntheticEvent,
    value: any,
    type: string
  ) => {
    if (!value) return;

    const dataValue = { name: value.userName, email: value.userEmail };
    if (!isValidEmail(dataValue.email)) {
      showToast("Invalid email format", "error");
      return;
    }

    if (type === "contact") {
      setEditData((prev: any) => ({
        ...prev,
        contact: dataValue.email,
      }));
    }
  };

  

  const handleSave = () => {
    // Validate required fields
    const newErrors: { subject?: string; body?: string } = {};

    if (!editData.subject.trim()) {
      newErrors.subject = "Subject is required";
    }

    if (!editData.body.trim()) {
      newErrors.body = "Message body is required";
    }

    if (editData.contact.length === 0) {
      showToast("At least one contact is required", "error");
      return;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Save logic here
    showToast("Ticket updated successfully", "success");
    console.log("Saving ticket data:", editData);
  };

  return (
    <Box sx={{ flex: 1, display: "flex", flexDirection: "column", height: "100%" }}>
      <Box
        sx={{
          backgroundColor: "#fff",
          borderRadius: 2,
          p: 2,
          border: "1px solid #e0e0e0",
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflowY: "auto",
        }}
      >
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3, flex: 1, mb: 2 }}>
          <Autocomplete
            disableClearable
            popupIcon={null}
            sx={{ my: 1.5 }}
            getOptionLabel={(option) => {
              if (typeof option === "string") return option;
              return option.userEmail || option.userName || "";
            }}
            options={displayContactOptions}
            value={editData.contact}
            onChange={(event, newValue) => {
              handleSelectedOption(event, newValue, "contact");
            }}
            onInputChange={(_, value) => setContactChangeValue(value)}
            filterOptions={(x) => x}
            getOptionDisabled={(option) => option === "Type to search"}
            noOptionsText="No Data Found"
            renderOption={(props, option) => {
              console.log("Option:", option)
              return (
              <li {...props}>
                {typeof option === "string" ? (
                  option
                ) : (
                  <div
                    className="flex items-center gap-3 p-2 rounded-md w-full"
                    style={{ cursor: "pointer" }}
                  >
                    <Avatar
                      sx={{
                        width: 30,
                        height: 30,
                        backgroundColor: "primary.main",
                      }}
                    >
                      {option.userName?.charAt(0).toUpperCase()}
                    </Avatar>

                    <div className="flex flex-col">
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        {option.userName}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {option.userEmail}
                      </Typography>
                    </div>
                  </div>
                )}
              </li>
            )
            }}
            renderTags={(value, getTagProps) =>
              value?.map((option, index) => (
                <Chip
                  variant="outlined"
                  color="primary"
                  label={typeof option === "string" ? option : option?.name}
                  {...getTagProps({ index })}
                  sx={{
                    cursor: "pointer",
                    height: "20px",
                    // backgroundColor: "#6EB4C9",
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
                label="Contact"
                variant="outlined"
                fullWidth
                InputProps={{
                      ...params.InputProps,
                  startAdornment: (
                    <InputAdornment position="start">
                      <Person
                        fontSize="small"
                        sx={{ color: errors.subject ? "#d32f2f" : "#666" }}
                      />
                    </InputAdornment>
                  ),
                }}
                sx={{
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

          {/* Subject Field */}
          <TextField
            label="Subject*"
            size="small"
            fullWidth
            variant="outlined"
            value={editData.subject}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handleInputChange("subject", e.target.value)
            }
            error={!!errors.subject}
            InputProps={{
                 
              startAdornment: (
                <InputAdornment position="start">
                  <Subject
                    fontSize="small"
                    sx={{ color: errors.subject ? "#d32f2f" : "#666" }}
                  />
                </InputAdornment>
              ),
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderColor: errors.subject ? "#d32f2f" : "#dadce0",
                "&.Mui-focused": {
                  borderColor: errors.subject ? "#d32f2f" : "#1976d2",
                },
              },
            }}
          />
          {errors.subject && (
            <FormHelperText error sx={{ mt: 0.5, fontSize: "0.75rem" }}>
              {errors.subject}
            </FormHelperText>
          )}

          {/* Message Body */}
          <Box sx={{ flex: 1, minHeight: 300 }}>
            <Typography
              variant="body2"
              sx={{ mb: 1, color: "#666", fontSize: "0.875rem" }}
            >
              Please enter the user concern here*
            </Typography>

            <StackEditor
              onChange={(content: string) => {
                handleInputChange("body", content);
              }}
              onFocus={undefined}
              initialContent={editData.body}
              isFull={false}
              customHeight="250px"
            />
            {errors.body && (
              <FormHelperText error sx={{ mt: 0.5, fontSize: "0.75rem" }}>
                {errors.body}
              </FormHelperText>
            )}
          </Box>
        </Box>
      </Box>

      {/* Action Buttons - Same styling as LogTimePanel */}
      <Box
        sx={{
          p: 2,
          borderTop: "1px solid #eee",
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          gap: 1,
          backgroundColor: "#fafafa",
          mt: "auto",
        }}
      >
        <Button
          onClick={onClose}
          variant="outlined"
          color="inherit"
          sx={{ minWidth: 80 }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          color="primary"
          disabled={
            !editData.subject || !editData.body || editData.contact.length === 0
          }
          sx={{ minWidth: 100 }}
        >
          Save
        </Button>
      </Box>
    </Box>
  );
};

export default EditTicket;
