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
} from "@mui/material";
import { Search, SwapHoriz } from "@mui/icons-material";
import { useToast } from "../../../hooks/useToast";
import { useCommanApiMutation } from "../../../services/threadsApi";
import { fetchOptions, isValidEmail } from "../../../utils/Utils";

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
  const [commanApi] = useCommanApiMutation();
  const { showToast } = useToast();

  const [selectedAgent, setSelectedAgent] = useState<any>("");
  const [transferReason, setTransferReason] = useState("");
  const [contactChangeValue, setContactChangeValue] = useState("");

  const [options, setOptions] = useState<any>();

  const displayContactOptions: any = contactChangeValue ? options : [];

  const inputRef = useRef(null);

  useEffect(() => {
    if (open && inputRef.current) {
      //@ts-ignore
      setTimeout(() => inputRef.current.focus(), 100);
    }
  }, [open]);

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

  const handleSelectedOption = (_: React.SyntheticEvent, value: any) => {
    if (!value) return;

    const dataValue = { name: value.userName, email: value.userEmail };
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
      url: `tickets/${ticketId}/change-owner`,
      method: "PUT",
      body: {
        newOwnerId: selectedAgent.id,
        reason: transferReason,
        transferredAt: new Date().toISOString(),
      },
    };

    commanApi(payload);

    showToast("Ticket ownership transferred successfully", "success");
    onClose();

    // Reset form
    setSelectedAgent("");
    setTransferReason("");
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
                src={currentOwner.avatar}
                sx={{ width: 40, height: 40, bgcolor: "#1976d2" }}
              >
                {currentOwner.name.charAt(0)}
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
            getOptionLabel={(option) => {
              if (typeof option === "string") return option;
              return option.userEmail || option.userName || "";
            }}
            options={displayContactOptions}
            value={selectedAgent}
            onChange={(event, newValue) => {
              handleSelectedOption(event, newValue);
            }}
            onInputChange={(_, value) => setContactChangeValue(value)}
            filterOptions={(x) => x}
            getOptionDisabled={(option) => option === "Type to search"}
            noOptionsText="No Data Found"
            renderOption={(props, option) => {
              console.log("Option:", option);
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
                        <Typography
                          variant="subtitle2"
                          sx={{ fontWeight: 600 }}
                        >
                          {option.userName}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {option.userEmail}
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
          <Typography variant="body2">
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
          startIcon={<SwapHoriz />}
          sx={{ minWidth: 120, fontWeight: 600 }}
        >
          Transfer Ownership
        </Button>
      </MuiBox>
    </MuiBox>
  );
};

export default ChangeOwner;
