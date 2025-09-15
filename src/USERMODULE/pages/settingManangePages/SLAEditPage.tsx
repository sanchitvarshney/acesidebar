import { useMemo, useState } from "react";

import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  FormControlLabel,
  IconButton,
  MenuItem,
  Stack,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate, useParams } from "react-router-dom";

type PriorityKey = "Urgent" | "High" | "Medium" | "Low";

type PriorityTarget = {
  firstResponse: string; // e.g., "15m", "1h"
  resolution: string; // e.g., "8h", "1d"
  operationalHours: "Calendar" | "Business"; // simplified selector
  escalation: boolean;
};

type DepartmentTargets = Record<PriorityKey, PriorityTarget>;

const defaultTargets: DepartmentTargets = {
  Urgent: { firstResponse: "15m", resolution: "8h", operationalHours: "Calendar", escalation: true },
  High: { firstResponse: "30m", resolution: "16h", operationalHours: "Calendar", escalation: true },
  Medium: { firstResponse: "1h", resolution: "1d", operationalHours: "Calendar", escalation: true },
  Low: { firstResponse: "2h", resolution: "32h", operationalHours: "Calendar", escalation: true },
};

const departmentsSample = [
  { id: "support", name: "Support" },
  { id: "sales", name: "Sales" },
  { id: "it", name: "IT Support" },
  { id: "marketing", name: "Marketing" },
];

const SLAEditPage = () => {
  const navigate = useNavigate();
  const params = useParams();

  const [name, setName] = useState("Default policy");
  const [description, setDescription] = useState(
    "This policy ensures every ticket has an SLA if no other custom SLA matches the ticket."
  );

  const [selectedDepartmentId, setSelectedDepartmentId] = useState<string>(departmentsSample[0].id);
  // Map department -> targets
  const [departmentToTargets, setDepartmentToTargets] = useState<Record<string, DepartmentTargets>>({
    [departmentsSample[0].id]: defaultTargets,
  });

  const currentTargets = useMemo<DepartmentTargets>(() => {
    return (
      departmentToTargets[selectedDepartmentId] || {
        Urgent: { ...defaultTargets.Urgent },
        High: { ...defaultTargets.High },
        Medium: { ...defaultTargets.Medium },
        Low: { ...defaultTargets.Low },
      }
    );
  }, [departmentToTargets, selectedDepartmentId]);

  const updateTarget = (priority: PriorityKey, patch: Partial<PriorityTarget>) => {
    setDepartmentToTargets((prev) => {
      const existing = prev[selectedDepartmentId] || currentTargets;
      return {
        ...prev,
        [selectedDepartmentId]: {
          ...existing,
          [priority]: { ...existing[priority], ...patch },
        },
      };
    });
  };

  const handleSave = () => {
    // In a real app, call API here with name, description, departmentToTargets
    console.log("Saving SLA policy", { id: params.id, name, description, departmentToTargets });
    navigate("/sla-policies");
  };

  return (
    <Box
      sx={{
        height: "calc(100vh - 100px)",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        bgcolor: "#f5f5f5",
      }}
    >
      {/* Header */}
      <Box sx={{ p: 2, display: "flex", alignItems: "center", gap: 2, borderBottom: "1px solid #e0e0e0", bgcolor: "#fff" }}>
        <IconButton onClick={() => navigate("/sla-policies")}> 
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h5" sx={{ fontWeight: 600 }}>Edit SLA policy</Typography>
      </Box>

      {/* Content scroll area */}
      <Box sx={{ p: 2, overflowY: "auto", flex: 1 }}>
        <Card sx={{ mb: 2 }}>
          <CardContent>
            <Stack spacing={2}>
              <TextField label="Name" value={name} onChange={(e) => setName(e.target.value)} fullWidth />
              <TextField label="Description" value={description} onChange={(e) => setDescription(e.target.value)} multiline rows={3} fullWidth />

              <Stack direction="row" spacing={2} alignItems="center">
                <TextField
                  select
                  label="Department"
                  value={selectedDepartmentId}
                  onChange={(e) => setSelectedDepartmentId(e.target.value)}
                  sx={{ minWidth: 240 }}
                >
                  {departmentsSample.map((d) => (
                    <MenuItem key={d.id} value={d.id}>{d.name}</MenuItem>
                  ))}
                </TextField>
                <Typography variant="body2" color="text.secondary">
                  Configure SLA targets per department and priority
                </Typography>
              </Stack>
            </Stack>
          </CardContent>
        </Card>

        {/* Targets table */}
        <Card>
          <CardContent>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>Set SLA target as:</Typography>

            <TableContainer>
              <Table stickyHeader>
                <TableHead>
                  <TableRow sx={{ bgcolor: "#f8f9fa" }}>
                    <TableCell sx={{ fontWeight: 600 }}>Priority</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>First response time</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Resolution time</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Operational hours</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Escalation</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {(["Urgent", "High", "Medium", "Low"] as PriorityKey[]).map((p) => (
                    <TableRow key={p}>
                      <TableCell>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Chip size="small" sx={{ bgcolor: p === "Urgent" ? "#ffebee" : p === "Low" ? "#e8f5e8" : "#fff3e0", color: p === "Urgent" ? "#d32f2f" : p === "Low" ? "#2e7d32" : "#f57c00" }} label={p} />
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <TextField size="small" value={currentTargets[p].firstResponse} onChange={(e) => updateTarget(p, { firstResponse: e.target.value })} />
                      </TableCell>
                      <TableCell>
                        <TextField size="small" value={currentTargets[p].resolution} onChange={(e) => updateTarget(p, { resolution: e.target.value })} />
                      </TableCell>
                      <TableCell>
                        <TextField select size="small" value={currentTargets[p].operationalHours} onChange={(e) => updateTarget(p, { operationalHours: e.target.value as any })}>
                          <MenuItem value="Calendar">Calendar hours (24x7)</MenuItem>
                          <MenuItem value="Business">Business hours</MenuItem>
                        </TextField>
                      </TableCell>
                      <TableCell>
                        <FormControlLabel control={<Switch checked={currentTargets[p].escalation} onChange={(e) => updateTarget(p, { escalation: e.target.checked })} />} label={currentTargets[p].escalation ? "On" : "Off"} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>

        {/* Reminder and Escalation placeholders */}
        <Card sx={{ mt: 2 }}>
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>Remind agents when the SLA due time approaches</Typography>
            <Box sx={{ p: 2, border: "1px dashed #e0e0e0", borderRadius: 1, bgcolor: "#fafafa" }}>
              <Typography variant="body2" color="text.secondary">Set reminder to agents when the SLA due time approaches.</Typography>
              <Button size="small" sx={{ mt: 1 }} startIcon={"+" as any}>Add new reminders</Button>
            </Box>
          </CardContent>
        </Card>

        <Card sx={{ mt: 2, mb: 8 }}>
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>Send escalation when the SLA is violated</Typography>
            <Box sx={{ p: 2, border: "1px dashed #e0e0e0", borderRadius: 1, bgcolor: "#fafafa" }}>
              <Typography variant="body2" color="text.secondary">Set escalation whenever the SLA is been breached.</Typography>
              <Button size="small" sx={{ mt: 1 }} startIcon={"+" as any}>Add new escalations</Button>
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* Bottom actions */}
      <Box sx={{ p: 2, borderTop: "1px solid #e0e0e0", bgcolor: "#fff", display: "flex", justifyContent: "flex-end", gap: 1 }}>
        <Button variant="text" onClick={() => navigate("/sla-policies")}>Cancel</Button>
        <Button variant="contained" onClick={handleSave}>Save</Button>
      </Box>
    </Box>
  );
};

export default SLAEditPage;


