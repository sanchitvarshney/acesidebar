import { useMemo, useState } from "react";

import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
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
import { AnimatePresence, motion } from "framer-motion";

type PriorityKey = "Urgent" | "High" | "Medium" | "Low";

type PriorityTarget = {
  firstResponse: string; // e.g., "15m", "1h"
  resolution: string; // e.g., "8h", "1d"
  operationalHours: "Calendar" | "Business"; // simplified selector
  escalation: boolean;
};

type DepartmentTargets = Record<PriorityKey, PriorityTarget>;

const defaultTargets: DepartmentTargets = {
  Urgent: {
    firstResponse: "15m",
    resolution: "8h",
    operationalHours: "Calendar",
    escalation: true,
  },
  High: {
    firstResponse: "30m",
    resolution: "16h",
    operationalHours: "Calendar",
    escalation: true,
  },
  Medium: {
    firstResponse: "1h",
    resolution: "1d",
    operationalHours: "Calendar",
    escalation: true,
  },
  Low: {
    firstResponse: "2h",
    resolution: "32h",
    operationalHours: "Calendar",
    escalation: true,
  },
};

const departmentsSample = [
  { id: "support", name: "Support" },
  { id: "sales", name: "Sales" },
  { id: "it", name: "IT Support" },
  { id: "marketing", name: "Marketing" },
];

type DepartmentSection = {
  sectionId: string;
  departmentId: string;
};

const SLAEditPage = () => {
  const navigate = useNavigate();
  const params = useParams();

  const [name, setName] = useState(params?.id ? "Default policy" : "");
  const [description, setDescription] = useState(
    params?.id
      ? "This policy ensures every ticket has an SLA if no other custom SLA matches the ticket."
      : ""
  );

  // Map department -> targets
  const [departmentToTargets, setDepartmentToTargets] = useState<
    Record<string, DepartmentTargets>
  >({
    [departmentsSample[0].id]: defaultTargets,
  });
  // Multiple editable sections, each with its own department selector
  const [sections, setSections] = useState<DepartmentSection[]>([
    { sectionId: `sec-${Date.now()}`, departmentId: "" },
  ]);

  const cloneDefaultTargets = (): DepartmentTargets => ({
    Urgent: { ...defaultTargets.Urgent },
    High: { ...defaultTargets.High },
    Medium: { ...defaultTargets.Medium },
    Low: { ...defaultTargets.Low },
  });

  const getTargetsForDepartment = (deptId: string): DepartmentTargets => {
    return (
      departmentToTargets[deptId] || {
        Urgent: { ...defaultTargets.Urgent },
        High: { ...defaultTargets.High },
        Medium: { ...defaultTargets.Medium },
        Low: { ...defaultTargets.Low },
      }
    );
  };

  const updateTargetForDepartment = (
    departmentId: string,
    priority: PriorityKey,
    patch: Partial<PriorityTarget>
  ) => {
    setDepartmentToTargets((prev) => {
      const existing =
        prev[departmentId] || getTargetsForDepartment(departmentId);
      return {
        ...prev,
        [departmentId]: {
          ...existing,
          [priority]: { ...existing[priority], ...patch },
        },
      };
    });
  };

  const addSection = () => {
    setSections((prev) => [
      ...prev,
      {
        sectionId: `sec-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        departmentId: "",
      },
    ]);
  };

  const updateSectionDepartment = (sectionId: string, newDeptId: string) => {
    setSections((prev) =>
      prev.map((s) =>
        s.sectionId === sectionId ? { ...s, departmentId: newDeptId } : s
      )
    );
    setDepartmentToTargets((prev) =>
      prev[newDeptId] ? prev : { ...prev, [newDeptId]: cloneDefaultTargets() }
    );
  };

  const removeSection = (sectionId: string) => {
    setSections((prev) => {
      if (prev.length <= 1) return prev; // keep at least one section
      return prev.filter((s) => s.sectionId !== sectionId);
    });
  };

  const handleSave = () => {
    // In a real app, call API here with name, description, departmentToTargets
    console.log("Saving SLA policy", {
      id: params.id,
      name,
      description,
      departmentToTargets,
    });
    navigate("/sla-policies");
  };

  return (
    <Box
      sx={{
        height: "calc(100vh - 100px)",
        display: "grid",
        gridTemplateColumns: "3fr 1fr",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          height: "calc(100vh - 100px)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <Box
          sx={{
            p: 2,
            display: "flex",
            alignItems: "center",
            gap: 2,
            borderBottom: "1px solid #e0e0e0",
          }}
        >
          <IconButton
            onClick={() => navigate("/settings/tickets-workflows/sla-policies")}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            {params.id ? "Edit SLA Policy" : "New SLA Policy"}
          </Typography>
        </Box>

        {/* Content scroll area */}
        <Box sx={{ p: 2, overflowY: "auto", flex: 1 }}>
          <Card sx={{ mb: 1 }} elevation={0}>
            <CardContent>
              <Stack spacing={3}>
                <TextField
                  label="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  sx={{
                    width: "60%",
                  }}
                  size="small"
                />
                <TextField
                  label="Description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  multiline
                  rows={3}
                  sx={{
                    width: "60%",
                  }}
                />
              </Stack>
            </CardContent>
          </Card>

          {/* Multiple Department Sections */}
          <Stack spacing={1} sx={{ px: 2 }}>
            {sections.map((section, idx) => {
              const deptId = section.departmentId;
              const targets = deptId ? getTargetsForDepartment(deptId) : null;
              const isLast = idx === sections.length - 1;
              return (
                <Box key={section.sectionId}>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <TextField
                      select
                      size="small"
                      label="Department"
                      value={deptId}
                      onChange={(e) => {
                        const newDeptId = e.target.value as string;
                        updateSectionDepartment(section.sectionId, newDeptId);
                      }}
                      sx={{ minWidth: 340 }}
                    >
                      {departmentsSample.map((d) => (
                        <MenuItem key={d.id} value={d.id}>
                          {d.name}
                        </MenuItem>
                      ))}
                    </TextField>
                    <Typography variant="body2" color="text.secondary">
                      Configure SLA targets per department and priority
                    </Typography>
                    {sections.length > 1 && (
                      <Button
                        size="small"
                        color="error"
                        variant="text"
                        onClick={() => removeSection(section.sectionId)}
                      >
                        Remove
                      </Button>
                    )}
                  </Stack>
                  <AnimatePresence>
                    {deptId && targets && (
                      <motion.div
                        initial={{ height: 0, opacity: 0, y: -10 }}
                        animate={{ height: "auto", opacity: 1, y: 0 }}
                        exit={{ height: 0, opacity: 0, y: -10 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                      >
                        <Card elevation={0}>
                          <CardContent>
                            <Typography
                              variant="subtitle1"
                              sx={{ fontWeight: 600, mb: 1 }}
                            >
                              Set SLA target as {deptId}:
                            </Typography>
                            <TableContainer>
                              <Table stickyHeader>
                                <TableHead>
                                  <TableRow sx={{ bgcolor: "#f8f9fa" }}>
                                    <TableCell sx={{ fontWeight: 600 }}>
                                      Priority
                                    </TableCell>
                                    <TableCell sx={{ fontWeight: 600 }}>
                                      First response time
                                    </TableCell>
                                    <TableCell sx={{ fontWeight: 600 }}>
                                      Resolution time
                                    </TableCell>
                                    <TableCell sx={{ fontWeight: 600 }}>
                                      Operational hours
                                    </TableCell>
                                    <TableCell sx={{ fontWeight: 600 }}>
                                      Escalation
                                    </TableCell>
                                  </TableRow>
                                </TableHead>
                                <TableBody>
                                  {(
                                    [
                                      "Urgent",
                                      "High",
                                      "Medium",
                                      "Low",
                                    ] as PriorityKey[]
                                  ).map((p) => (
                                    <TableRow key={p}>
                                      <TableCell>
                                        <Stack
                                          direction="row"
                                          spacing={1}
                                          alignItems="center"
                                        >
                                          <Chip
                                            size="small"
                                            sx={{
                                              bgcolor:
                                                p === "Urgent"
                                                  ? "#ffebee"
                                                  : p === "Low"
                                                  ? "#e8f5e8"
                                                  : "#fff3e0",
                                              color:
                                                p === "Urgent"
                                                  ? "#d32f2f"
                                                  : p === "Low"
                                                  ? "#2e7d32"
                                                  : "#f57c00",
                                            }}
                                            label={p}
                                          />
                                        </Stack>
                                      </TableCell>
                                      <TableCell>
                                        <TextField
                                          size="small"
                                          value={targets[p].firstResponse}
                                          onChange={(e) =>
                                            updateTargetForDepartment(
                                              deptId,
                                              p,
                                              {
                                                firstResponse: e.target.value,
                                              }
                                            )
                                          }
                                        />
                                      </TableCell>
                                      <TableCell>
                                        <TextField
                                          size="small"
                                          value={targets[p].resolution}
                                          onChange={(e) =>
                                            updateTargetForDepartment(
                                              deptId,
                                              p,
                                              {
                                                resolution: e.target.value,
                                              }
                                            )
                                          }
                                        />
                                      </TableCell>
                                      <TableCell>
                                        <TextField
                                          select
                                          size="small"
                                          value={targets[p].operationalHours}
                                          onChange={(e) =>
                                            updateTargetForDepartment(
                                              deptId,
                                              p,
                                              {
                                                operationalHours: e.target
                                                  .value as any,
                                              }
                                            )
                                          }
                                        >
                                          <MenuItem value="Calendar">
                                            Calendar hours (24x7)
                                          </MenuItem>
                                          <MenuItem value="Business">
                                            Business hours
                                          </MenuItem>
                                        </TextField>
                                      </TableCell>
                                      <TableCell>
                                        <FormControlLabel
                                          control={
                                            <Switch
                                              checked={targets[p].escalation}
                                              onChange={(e) =>
                                                updateTargetForDepartment(
                                                  deptId,
                                                  p,
                                                  {
                                                    escalation:
                                                      e.target.checked,
                                                  }
                                                )
                                              }
                                            />
                                          }
                                          label={
                                            targets[p].escalation ? "On" : "Off"
                                          }
                                        />
                                      </TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </TableContainer>
                          </CardContent>
                        </Card>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  {isLast && !!deptId && (
                    <div className="flex items-center justify-center text-gray-500">
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={addSection}
                      >
                        Add more
                      </Button>
                    </div>
                  )}
                </Box>
              );
            })}
          </Stack>

          {/* Reminder and Escalation placeholders */}
          <Card sx={{ mt: 2 }} elevation={0}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                Remind agents when the SLA due time approaches
              </Typography>
              <Box
                sx={{
                  p: 2,
                  border: "1px dashed #e0e0e0",
                  borderRadius: 1,
                  bgcolor: "#fafafa",
                  width: "60%",
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  Set reminder to agents when the SLA due time approaches.
                </Typography>
                <Button size="small" sx={{ mt: 1 }} startIcon={"+" as any}>
                  Add new reminders
                </Button>
              </Box>
            </CardContent>
          </Card>

          <Card sx={{ mt: 2 }} elevation={0}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                Send escalation when the SLA is violated
              </Typography>
              <Box
                sx={{
                  p: 2,
                  border: "1px dashed #e0e0e0",
                  borderRadius: 1,
                  bgcolor: "#fafafa",
                  width: "60%",
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  Set escalation whenever the SLA is been breached.
                </Typography>
                <Button size="small" sx={{ mt: 1 }} startIcon={"+" as any}>
                  Add new escalations
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Box>

        {/* Bottom actions */}
        <Box
          sx={{
            p: 1,
            borderTop: "1px solid #e0e0e0",
            bgcolor: "#fff",
            display: "flex",
            justifyContent: "flex-end",
            gap: 1,
          }}
        >
          <Button
            variant="text"
            onClick={() => navigate("/sla-policies")}
            sx={{ fontWeight: 600 }}
          >
            Cancel
          </Button>
          <Button variant="contained" onClick={handleSave}>
            Save
          </Button>
        </Box>
      </Box>

      <Box
        sx={{
          maxHeight: "calc(100vh - 100px)",
          overflowY: "auto",
          p: 3,
          bgcolor: "#f8f9fa",
          borderLeft: "1px solid #e0e0e0",
        }}
      >
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                SLA policy
              </Typography>
              <Typography variant="body2" color="text.secondary">
                A service level agreement (SLA) lets you set response and
                resolution targets for your support team. You can have multiple
                policies that trigger on conditions like priority, requester
                type, group, or product. The first matching policy will be
                applied to a ticket.
              </Typography>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                Using Multiple SLA Policies
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Order your policies carefully. Move the most specific rules
                higher so they match before generic ones like the default
                policy.
              </Typography>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                SLA reminders
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Configure notifications when a ticket is nearing or breaching
                its target to keep agents on track.
              </Typography>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Box>
  );
};

export default SLAEditPage;
