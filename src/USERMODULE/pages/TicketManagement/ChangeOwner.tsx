import React, { useState, useEffect, useRef } from "react";
import {
  TextField,
  Button,
  Typography,
  Box as MuiBox,
  Avatar,
  Divider,
  Alert,
  CircularProgress,
} from "@mui/material";
import { SwapHoriz } from "@mui/icons-material";
import { useToast } from "../../../hooks/useToast";
import { useCommanApiMutation } from "../../../services/threadsApi";
import { useLazyGetUserBySeachQuery } from "../../../services/agentServices";

import SingleValueAsynAutocomplete from "../../../components/reusable/SingleValueAsynAutocomplete";

interface ChangeOwnerProps {
  open: boolean;
  onClose: () => void;
  ticketId: any | number;
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

  const [triggerSeachUser, { isLoading: seachUserLoading }] =
    useLazyGetUserBySeachQuery();
  const inputRef = useRef(null);

  useEffect(() => {
    if (open && inputRef.current) {
      //@ts-ignore
      setTimeout(() => inputRef.current.focus(), 100);
    }
  }, [open]);

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
        owner: selectedAgent.email,
        reason: transferReason,
      },
    };

    triggerChangeOwner(payload).then((res: any) => {
      console.log("res", res);
      if (res?.data?.type === "error") {
        showToast(res?.data?.message || "An error occurred", "error");
        return;
      }
      if (res?.data?.type === "success") {
        showToast(
          res?.data?.message || "Ticket ownership transferred successfully",
          "success"
        );
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
                sx={{ width: 40, height: 40, bgcolor: "#03363d" }}
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
          <SingleValueAsynAutocomplete
            qtkMethod={triggerSeachUser}
            value={selectedAgent}
            onChange={setSelectedAgent}
            label="Select New Owner"
            loading={seachUserLoading}
            isFallback={true}
            renderOptionExtra={(user) => (
              <Typography variant="body2" color="text.secondary">
                {user.email}
              </Typography>
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
