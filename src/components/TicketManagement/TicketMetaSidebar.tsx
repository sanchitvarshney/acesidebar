import React from "react";
import {
  Box,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
} from "@mui/material";

const TicketMetaSidebar = ({ ticket }: any) => (
  <Box
    sx={{
      width: 200,
      minWidth: 200,
      bgcolor: "white",
      p: 2,
      display: "flex",
      flexDirection: "column",
      height: "100vh",
      boxShadow: 1,
    }}
  >
    <Box mb={2}>
      <Box sx={{ fontSize: 12, color: "grey.600", fontWeight: 600, mb: 0.5 }}>
        FIRST RESPONSE DUE
      </Box>
      <Box sx={{ fontSize: 13, color: "grey.900", fontWeight: 700 }}>
        by {ticket?.firstResponseDue || "Fri, Jul 18, 2025 3:00 PM"}
      </Box>
    </Box>
    <Box mb={2}>
      <Box sx={{ fontSize: 12, color: "grey.600", fontWeight: 600, mb: 0.5 }}>
        RESOLUTION DUE
      </Box>
      <Box sx={{ fontSize: 13, color: "grey.900", fontWeight: 700 }}>
        by {ticket?.resolutionDue || "Wed, Jul 23, 2025 6:00 PM"}
      </Box>
      <Button
        variant="text"
        size="small"
        sx={{ mt: 0.5, p: 0, minWidth: 0, color: "primary.main", fontSize: 11 }}
      >
        Edit
      </Button>
    </Box>
    <Box mb={1} sx={{ fontSize: 12, color: "grey.600", fontWeight: 600 }}>
      PROPERTIES
    </Box>
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
      <TextField
        label="Tags"
        size="small"
        variant="outlined"
        fullWidth
        sx={{ mb: 1 }}
      />
      <FormControl size="small" fullWidth sx={{ mb: 1 }}>
        <InputLabel>Type</InputLabel>
        <Select label="Type" defaultValue="Incident">
          <MenuItem value="Incident">Incident</MenuItem>
          <MenuItem value="Question">Question</MenuItem>
        </Select>
      </FormControl>
      <FormControl size="small" fullWidth sx={{ mb: 1 }}>
        <InputLabel>Status</InputLabel>
        <Select label="Status" defaultValue="Open">
          <MenuItem value="Open">Open</MenuItem>
          <MenuItem value="Closed">Closed</MenuItem>
        </Select>
      </FormControl>
      <FormControl size="small" fullWidth sx={{ mb: 1 }}>
        <InputLabel>Priority</InputLabel>
        <Select label="Priority" defaultValue="Low">
          <MenuItem value="Low">Low</MenuItem>
          <MenuItem value="Medium">Medium</MenuItem>
          <MenuItem value="High">High</MenuItem>
        </Select>
      </FormControl>
      <TextField
        label="Group"
        size="small"
        variant="outlined"
        fullWidth
        sx={{ mb: 1 }}
      />
      <Button
        variant="outlined"
        size="small"
        fullWidth
        sx={{ mb: 1, justifyContent: "flex-start", textTransform: "none" }}
      >
        + Add Agent
      </Button>
      <TextField
        label="Product"
        size="small"
        variant="outlined"
        fullWidth
        sx={{ mb: 1 }}
      />
      <TextField
        label="Reference Number"
        size="small"
        variant="outlined"
        fullWidth
        sx={{ mb: 1 }}
      />
    </Box>
  </Box>
);

export default TicketMetaSidebar;
