import React, { useState, useEffect, useRef } from "react";
import {
  TextField,
  Button,
  Typography,
  Box as MuiBox,
  Avatar,
  Chip,
  Divider,
  Alert,
  Autocomplete,
  InputAdornment,
  CircularProgress,
} from "@mui/material";
import { Search, SwapHoriz } from "@mui/icons-material";
import { useToast } from "../../../hooks/useToast";
import { useCommanApiMutation } from "../../../services/threadsApi";
import { fetchOptions, isValidEmail } from "../../../utils/Utils";
import { useLazyGetUserBySeachQuery } from "../../../services/agentServices";
import { error } from "console";

interface ChangeOwnerProps {
  open: boolean;
  onClose: () => void;
  ticketId: string | number;
  currentOwner?: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
}

const ChangeOwner: React.FC<ChangeOwnerProps> = ({
  open,
  onClose,
  ticketId,
  currentOwner,
}) => {
  const [
    triggerChangeOwner,
    { isLoading: changeOwnerLoading, error: changeOwnerError },
  ] = useCommanApiMutation();
  const { showToast } = useToast();

  const [selectedAgent, setSelectedAgent] = useState<any>("");
  const [transferReason, setTransferReason] = useState("");
  const [contactChangeValue, setContactChangeValue] = useState("");

  const [options, setOptions] = useState<any[]>([]);

  const displayContactOptions: any = contactChangeValue
    ? Array.isArray(options)
      ? options
      : []
    : [];
  const [triggerSeachUser, { isLoading: seachUserLoading }] =
    useLazyGetUserBySeachQuery();
  const inputRef = useRef(null);

  useEffect(() => {
    if (open && inputRef.current) {
      //@ts-ignore
      setTimeout(() => inputRef.current.focus(), 100);
    }
  }, [open]);

  const fetchUserOptions = async (query: any) => {
    if (!query) {
      setOptions([]);
      return;
    }

    try {
      const res = await triggerSeachUser({ search: query }).unwrap();
      const data = Array.isArray(res) ? res : res?.data;
      console.log(data);

      const currentValue = contactChangeValue;

      const fallback = [
        {
          name: currentValue,
          email: currentValue,
        },
      ];

      if (Array.isArray(data)) {
        setOptions(data.length > 0 ? data : fallback);
      } else {
        setOptions([]);
      }
    } catch (error) {
      setOptions([]);
    }
  };

  const handleSelectedOption = (_: React.SyntheticEvent, value: any) => {
    if (!value) return;

    const dataValue = { name: value.name, email: value.email };
    if (!isValidEmail(dataValue.email)) {
      showToast("Invalid email format", "error");
      return;
    }

    setSelectedAgent(dataValue.email);
  };

  const handleTransfer = async () => {
    if (!selectedAgent) {
      showToast("Please select an agent to transfer the ticket to", "error");
      return;
    }

    if (!transferReason.trim()) {
      showToast("Please provide a reason for the transfer", "error");
      return;
    }

    const payload = {
      url: `change-owner/${ticketId}`,
      method: "PUT",
      body: {
        owner: selectedAgent,
        reason: transferReason,
      },
    };

    triggerChangeOwner(payload).then((res) => {
      if (changeOwnerError) {
        const msg =
          //@ts-ignore
          changeOwnerError?.data?.message || changeOwnerError?.message;
        showToast(msg || "An error occurred", "error");
        return;
      } else {
        showToast("Ticket ownership transferred successfully", "success");
        onClose();

        // Reset form
        setSelectedAgent("");
        setTransferReason("");
      }
    });
  };

  const handleClose = () => {
    setSelectedAgent("");
    setTransferReason("");
    onClose();
  };

  return (
    <MuiBox
      sx={{
        p: 0,
        bgcolor: "#fff",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        width: "100%",
        maxWidth: "100%",
        boxShadow: 1,
        position: "relative",
        m: 0,
      }}
    >
      <MuiBox sx={{ p: 2, flex: 1, overflowY: "auto", width: "100%" }}>
        {/* Current Owner Section */}
        {currentOwner && (
          <MuiBox sx={{ mb: 3 }}>
            <Typography
              variant="subtitle2"
              sx={{ fontWeight: 600, mb: 1, color: "#666" }}
            >
              Current Owner
            </Typography>
            <MuiBox
              sx={{
                p: 2,
                border: "1px solid #e0e0e0",
                borderRadius: 1,
                backgroundColor: "#f8f9fa",
                display: "flex",
                alignItems: "center",
                gap: 2,
              }}
            >
              <Avatar
                src={currentOwner?.avatar}
                sx={{ width: 40, height: 40, bgcolor: "#1976d2" }}
              >
                {currentOwner?.name?.charAt(0)}
              </Avatar>
              <MuiBox>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  {currentOwner.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {currentOwner.email}
                </Typography>
              </MuiBox>
            </MuiBox>
          </MuiBox>
        )}

        <Divider sx={{ mb: 3 }} />

        <MuiBox sx={{ mb: 3 }}>
          <Autocomplete
            disableClearable
            popupIcon={null}
            sx={{ my: 1.5 }}
            getOptionLabel={(option: any) => {
              if (typeof option === "string") return option;
              return option?.email || "";
            }}
            options={displayContactOptions}
            value={selectedAgent}
            onChange={(event, newValue) => {
              handleSelectedOption(event, newValue);
            }}
            onInputChange={(_, value) => {
              setContactChangeValue(value);
              fetchUserOptions(value);
            }}
            filterOptions={(x) => x}
            getOptionDisabled={(option) => option === "Type to search"}
            noOptionsText="No Data Found"
            renderOption={(props, option) => {
              return (
                <li {...props} key={option.userID}>
                  {typeof option === "string" ? (
                    option
                  ) : (
                    <div
                      className="flex items-center gap-3 p-2 rounded-md w-full"
                      style={{ cursor: "pointer" }}
                    >
                      <div className="flex flex-col">
                        <Typography
                          variant="subtitle2"
                          sx={{ fontWeight: 600 }}
                        >
                          {option.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {option.email}
                        </Typography>
                      </div>
                    </div>
                  )}
                </li>
              );
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
                autoFocus
                inputRef={inputRef}
                {...params}
                label="Select New Owner"
                variant="outlined"
                fullWidth
                InputProps={{
                  ...params.InputProps,
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search sx={{ color: "#666", mr: 1 }} />
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
        </MuiBox>

        {/* Transfer Reason Section */}
        <MuiBox sx={{ mb: 3 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
            Transfer Reason
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={3}
            placeholder="Please provide a reason for transferring this ticket..."
            value={transferReason}
            onChange={(e) => setTransferReason(e.target.value)}
            sx={{ mb: 1 }}
          />
          <Typography variant="caption" color="text.secondary">
            This reason will be logged in the ticket history
          </Typography>
        </MuiBox>

        {/* Info Alert */}
        <Alert severity="info" sx={{ mb: 2 }}>
          <Typography variant="body2" component="div">
            <strong>Note:</strong> Transferring ticket ownership will:
            <ul style={{ margin: "4px 0", paddingLeft: "20px" }}>
              <li>Update the ticket's assigned agent</li>
              <li>Send a notification to the new owner</li>
              <li>Log this action in the ticket history</li>
              <li>Maintain all existing ticket data and attachments</li>
            </ul>
          </Typography>
        </Alert>
      </MuiBox>

      {/* Action Buttons */}
      <MuiBox
        sx={{
          p: 2,
          borderTop: "1px solid #eee",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 1,
          backgroundColor: "#fafafa",
        }}
      >
        <Button
          onClick={handleClose}
          variant="text"
          sx={{ minWidth: 80, fontWeight: 600 }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleTransfer}
          variant="contained"
          color="primary"
          disabled={!selectedAgent || !transferReason.trim()}
          startIcon={!changeOwnerLoading && <SwapHoriz />}
          sx={{ minWidth: 120, fontWeight: 600 }}
        >
          {changeOwnerLoading ? (
            <CircularProgress size={20} color="inherit" />
          ) : (
            "Transfer Ownership"
          )}
        </Button>
      </MuiBox>
    </MuiBox>
  );
};

export default ChangeOwner;
