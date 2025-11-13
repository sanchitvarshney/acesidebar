import React, { useEffect, useState, useRef } from "react";
import {
  IconButton,
  TextField,
  Button,
  Typography,
  Box as MuiBox,
  Modal,
  FormControlLabel,
  Checkbox,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";

import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs, { Dayjs } from "dayjs";
import { useToast } from "../../../hooks/useToast";
import { ElectricalServicesOutlined, Person } from "@mui/icons-material";
import { useCommanApiMutation } from "../../../services/threadsApi";

interface LogTimePanelProps {
  open: boolean;
  onClose: () => void;
  ticketId: string | number | any;
}

interface Agent {
  id: string;
  name: string;
  email: string;
}
// Sample agents data - replace with actual API call
const agents: Agent[] = [
  { id: "1", name: "Developer Account", email: "developer@example.com" },
  { id: "2", name: "Support Agent", email: "support@example.com" },
  { id: "3", name: "Manager", email: "manager@example.com" },
  { id: "4", name: "QA Engineer", email: "qa@example.com" },
  { id: "5", name: "Product Manager", email: "pm@example.com" },
];

const LogTimePanel: React.FC<LogTimePanelProps> = ({
  open,
  onClose,
  ticketId,
}) => {
  const [commanApi] = useCommanApiMutation();
  const { showToast } = useToast();
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [logTimeFields, setLogTimeFields] = useState({
    agent: "",
    timeSpent: "",
    billable: false,
    date: new Date(),
    note: "",
  });

    const inputRef = useRef(null);
  
    useEffect(() => {
      if (open && inputRef.current) {
        //@ts-ignore
        setTimeout(() => inputRef.current.focus(), 100);
      }
    }, [open]);

  const handleLogTimeFieldChange = (field: string, value: any) => {
    setLogTimeFields((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleLogTimeSave = () => {
    let payload;

    if (logTimeFields.timeSpent === "") {
      payload = {
        url: `log-time/${ticketId}`,
        method: "POST",
        body: {
          agent_id: logTimeFields.agent,
          timer_running: true,
          billable: logTimeFields.billable,
          executed_at: dayjs(logTimeFields.date).format("YYYY-MM-DD"),
          note: logTimeFields.note || " ",
        },
      };
    } else {
      payload = {
        url: `log-time/${ticketId}`,
        method: "POST",
        body: {
          agent_id: logTimeFields.agent,
          time_spent: logTimeFields.timeSpent,
          billable: logTimeFields.billable,
          executed_at: dayjs(logTimeFields.date).format("YYYY-MM-DD"),
          note: logTimeFields.note || " ",
        },
      };
    }

    // Call API after setting payload
    commanApi(payload);

    // Close modal and reset fields
    onClose();
    setLogTimeFields({
      agent: "",
      timeSpent: "",
      billable: false,
      date: new Date(),
      note: "",
    });
  };

  // Format seconds to HH:MM for display
  const formatTimeHHMM = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}`;
  };

  // Parse HH:MM input to seconds
  const parseTimeInput = (timeString: string) => {
    if (!timeString || timeString === "") return 0;
    const [hours, minutes] = timeString.split(":").map(Number);
    if (isNaN(hours) || isNaN(minutes)) return 0;
    return hours * 3600 + minutes * 60;
  };

  // Handle time input change
  const handleTimeChange = (value: string) => {
    // Always update so user can type freely
    handleLogTimeFieldChange("timeSpent", value);
  };

  const validateAndConvertTime = (value: string) => {
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (!value) return; // allow blank

    if (!timeRegex.test(value)) {
      // Invalid format → reset or show error
      handleLogTimeFieldChange("timeSpent", "");
      return;
    }

    const seconds = parseTimeInput(value);
    setTimerSeconds(seconds);
  };

  // Handle save
  const handleSave = () => {
    if (!logTimeFields.agent) {
      showToast("Please select an agent", "error");
      return;
    }

    if (!logTimeFields.date) {
      showToast("Please select a date", "error");

      return;
    }

    handleLogTimeSave();
  };

  const panelContent = (
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
        {/* <FormControl fullWidth size="small" variant="outlined" sx={{ mb: 3 }}>
          <InputLabel>Agent</InputLabel>
          <Select
          autoFocus
      
            value={logTimeFields.agent}
            label="Agent"
            onChange={(e) => handleLogTimeFieldChange("agent", e.target.value)}
            startAdornment={
              <Person fontSize="small" sx={{ color: "#666", mr: 1 }} />
            }
            renderValue={(selected: any) => {
              const agent = agents.find((a) => a.id === selected);
              return agent ? agent.name : selected;
            }}
            sx={{
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "#dadce0",
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: "#2566b0",
              },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: "#2566b0",
              },
              backgroundColor: "#fff",
              fontSize: "0.875rem",
        
            }}
          >
            {agents?.map((agent: any) => (
              <MenuItem key={agent.id} value={agent.id}>
                {agent.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl> */}

        <TextField
          label="HH:MM"
          fullWidth
          size="small"
          margin="dense"
          value={logTimeFields.timeSpent}
          onChange={(e) => handleTimeChange(e.target.value)}
          onBlur={() => validateAndConvertTime(logTimeFields.timeSpent)}
          placeholder="00:00"
          helperText={
            !logTimeFields.timeSpent
              ? "Leave as blank to start the auto-timer."
              : "Enter time in HH:MM or decimals (like 1:30 or 1.5 for an hour and 30 minutes)."
          }
          sx={{ mb: 2 }}
        />

        <FormControlLabel
          control={
            <Checkbox
              checked={logTimeFields.billable || false}
              onChange={(e) =>
                handleLogTimeFieldChange("billable", e.target.checked)
              }
              color="primary"
            />
          }
          label="Billable"
          sx={{ mb: 2 }}
        />

        {/* Date Field */}
        <DatePicker
          label="On Date"
          format="DD-MM-YYYY"
          value={logTimeFields.date ? dayjs(logTimeFields.date) : dayjs()}
          onChange={(newValue:any, _context) => {
            handleLogTimeFieldChange("date", newValue?.toDate() || new Date());
          }}
          slotProps={{
            textField: {
              fullWidth: true,
              size: "small",
              margin: "dense",
              sx: { mb: 2 },
            },
          }}
        />

        {/* Note Field */}
        <TextField
          label="Note"
          fullWidth
          margin="dense"
          multiline
          minRows={3}
          value={logTimeFields.note || ""}
          onChange={(e) => handleLogTimeFieldChange("note", e.target.value)}
          placeholder="Add a note about the time spent..."
          sx={{ mb: 2 }}
        />

        {/* Time Summary */}
        {(logTimeFields.timeSpent || timerSeconds > 0) && (
          <MuiBox
            sx={{
              p: 2,
              bgcolor: "grey.50",
              borderRadius: 1,
              border: "1px solid",
              borderColor: "grey.200",
              mb: 2,
            }}
          >
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
              Time Summary
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total time:{" "}
              {logTimeFields.timeSpent || formatTimeHHMM(timerSeconds)}
              {logTimeFields.billable && (
                <span style={{ color: "green", fontWeight: 500 }}>
                  {" "}
                  • Billable
                </span>
              )}
            </Typography>
            {logTimeFields.note && (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Note: {logTimeFields.note}
              </Typography>
            )}
          </MuiBox>
        )}
      </MuiBox>

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
          onClick={onClose}
          variant="text"
        
          sx={{ minWidth: 80, fontWeight:600 }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          color="primary"
          // disabled={logTimeFields.timeSpent}
          sx={{ minWidth: 120,fontWeight:600 }}
        >
          {logTimeFields.timeSpent === "" || !logTimeFields.timeSpent
            ? "SAVE"
            : "START TIMER"}
        </Button>
      </MuiBox>
    </MuiBox>
  );

  // Sidebar panel (not modal) when expand is false
  return (
    <MuiBox
      sx={{
        width: "100%",
        height: "100%",
        boxShadow: 1,
        bgcolor: "#fff",
        position: "relative",
        zIndex: 1200,
      }}
    >
      {panelContent}
    </MuiBox>
  );
};

export default LogTimePanel;
