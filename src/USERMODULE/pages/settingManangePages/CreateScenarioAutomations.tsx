import emptyImg from "../../../assets/image/overview-empty-state.svg";
import {
  Box,
  IconButton,
  Typography,
  Card,
  CardContent,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  RadioGroup,
  FormControlLabel,
  Radio,
  Stack,
  Chip,
  Divider,
} from "@mui/material";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

interface Action {
  id: string;
  type: string;
  value: string;
}

const CreateScenarioAutomations = () => {
  const navigate = useNavigate();

  // Form state
  const [scenarioName, setScenarioName] = useState("");
  const [description, setDescription] = useState("");
  const [actions, setActions] = useState<Action[]>([
    { id: "1", type: "Set Type as", value: "Problem" },
  ]);
  const [availability, setAvailability] = useState("myself");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedAgent, setSelectedAgent] = useState("");
  const [showDepartmentSelect, setShowDepartmentSelect] = useState(false);
  const [showAgentSelect, setShowAgentSelect] = useState(false);

  // Action types and their corresponding values
  const actionTypes = [
    "Set Type as",
    "Add Tag",
    "Set Priority as",
    "Set Status as",
    "Assign to",
    "Set Category as",
    "Add Note",
  ];

  const actionValues = {
    "Set Type as": ["Problem", "Question", "Incident", "Request"],
    "Add Tag": [],
    "Set Priority as": ["Low", "Medium", "High", "Urgent"],
    "Set Status as": ["Open", "In Progress", "Resolved", "Closed"],
    "Assign to": [],
    "Set Category as": ["Technical", "Billing", "General", "Support"],
    "Add Note": [],
  };

  const departments = [
    "IT Support",
    "Customer Service",
    "Billing",
    "Technical",
    "Sales",
  ];

  const agents = [
    "John Doe",
    "Jane Smith",
    "Mike Johnson",
    "Sarah Wilson",
    "David Brown",
  ];

  const handleAddAction = () => {
    const newAction: Action = {
      id: Date.now().toString(),
      type: "Set Type as",
      value: "Problem",
    };
    setActions([...actions, newAction]);
  };

  const handleRemoveAction = (id: string) => {
    setActions(actions.filter((action) => action.id !== id));
  };

  const handleActionTypeChange = (id: string, type: string) => {
    setActions(
      actions.map((action) =>
        action.id === id
          ? {
              ...action,
              type,
              value: actionValues[type as keyof typeof actionValues][0] || "",
            }
          : action
      )
    );
  };

  const handleActionValueChange = (id: string, value: string) => {
    setActions(
      actions.map((action) =>
        action.id === id ? { ...action, value } : action
      )
    );
  };

  const handleAvailabilityChange = (value: string) => {
    setAvailability(value);

    // Reset selections when changing availability
    setSelectedDepartment("");
    setSelectedAgent("");

    // Show/hide select fields based on selection
    if (value === "department") {
      setShowDepartmentSelect(true);
      setShowAgentSelect(false);
    } else if (value === "agent") {
      setShowDepartmentSelect(false);
      setShowAgentSelect(true);
    } else {
      setShowDepartmentSelect(false);
      setShowAgentSelect(false);
    }
  };

  return (
    <Box
      sx={{
        height: "calc(100vh - 96px)",
        display: "grid",
        gridTemplateColumns: "3fr 1fr",
        overflow: "hidden",
      }}
    >
      {/* Left Content */}
      <Box
        sx={{
          p: 1,
          display: "flex",
          flexDirection: "column",
          gap: 2,
          height: "100%",
          minHeight: 0,
          overflow: "hidden",
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 600, color: "#1a1a1a" }}>
          New Scenario
        </Typography>

        <Box sx={{ flex: 1, minHeight: 0, overflow: "auto", p: 2 }}>
          {/* Scenario Name */}
          <Box sx={{ mb: 3 }}>
            <Typography
              variant="body2"
              sx={{ mb: 1, fontWeight: 500, color: "#1a1a1a" }}
            >
              Scenario Name <span style={{ color: "red" }}>*</span>
            </Typography>
            <TextField
              size="small"
              fullWidth
              placeholder="example: Assign QA"
              value={scenarioName}
              onChange={(e) => setScenarioName(e.target.value)}
            />
          </Box>

          {/* Description */}
          <Box sx={{ mb: 4 }}>
            <Typography
              variant="body2"
              sx={{ mb: 1, fontWeight: 500, color: "#1a1a1a" }}
            >
              Description
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={3}
              placeholder="example: Mark the Ticket as a Bug and assign to QA"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Box>

          {/* Actions Section */}
          <Box sx={{ mb: 4 }}>
            <Typography
              variant="h6"
              sx={{ mb: 1, fontWeight: 600, color: "#1a1a1a" }}
            >
              Actions
            </Typography>
            <Typography variant="body2" sx={{ mb: 3, color: "#65676b" }}>
              Perform these actions
            </Typography>

            <Stack spacing={2}>
              {actions.map((action, index) => (
                <Box
                  key={action.id}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    p: 2,
                    border: "1px solid #e0e0e0",
                    borderRadius: "8px",
                    bgcolor: "#fafafa",
                  }}
                >
                  {/* Delete Button */}
                  <IconButton
                    size="small"
                    onClick={() => handleRemoveAction(action.id)}
                    sx={{ color: "#f44336" }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                  {/* 
               
                  <IconButton
                    size="small"
                    sx={{ color: "#9e9e9e", cursor: "grab" }}
                  >
                    <DragIndicatorIcon fontSize="small" />
                  </IconButton> */}

                  {/* Action Type Dropdown */}
                  <FormControl sx={{ minWidth: 150 }}>
                    <Select
                      size="small"
                      value={action.type}
                      onChange={(e) =>
                        handleActionTypeChange(action.id, e.target.value)
                      }
                    >
                      {actionTypes.map((type) => (
                        <MenuItem key={type} value={type}>
                          {type}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  {/* Action Value Input/Dropdown */}
                  {typeof action.type === "string" && (
                    <>
                      {" "}
                      {actionValues[action.type as keyof typeof actionValues]
                        .length > 0 ? (
                        <FormControl sx={{ minWidth: 150 }}>
                          <Select
                            size="small"
                            value={action.value}
                            onChange={(e) =>
                              handleActionValueChange(action.id, e.target.value)
                            }
                          >
                            {actionValues[
                              action.type as keyof typeof actionValues
                            ].map((value) => (
                              <MenuItem key={value} value={value}>
                                {value}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      ) : (
                        <TextField
                          size="small"
                          placeholder="Enter one or more values"
                          value={action.value}
                          onChange={(e) =>
                            handleActionValueChange(action.id, e.target.value)
                          }
                          sx={{
                            minWidth: 200,
                          }}
                        />
                      )}
                    </>
                  )}
                </Box>
              ))}
            </Stack>

            {/* Add New Action Button */}
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={handleAddAction}
              sx={{
                mt: 2,
              }}
            >
              Add new action
            </Button>
          </Box>

          {/* Available for Section */}
          <Box
            sx={{
              my: 2,
              width: "100%",
              display: "flex",
              flexDirection: "row",
              gap: 2,
            }}
          >
            <RadioGroup
              value={availability}
              onChange={(e) => handleAvailabilityChange(e.target.value)}
              sx={{
                gap: 1,
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <FormControlLabel
                value="department"
                control={
                  <Radio
                    sx={{
                      color: "#1faaa8",
                      "&.Mui-checked": { color: "#1faaa8" },
                    }}
                  />
                }
                label="Department"
                sx={{ "& .MuiFormControlLabel-label": { color: "#1a1a1a" } }}
              />
              <FormControlLabel
                value="agent"
                control={
                  <Radio
                    sx={{
                      color: "#1faaa8",
                      "&.Mui-checked": { color: "#1faaa8" },
                    }}
                  />
                }
                label="Agent"
                sx={{ "& .MuiFormControlLabel-label": { color: "#1a1a1a" } }}
              />
            </RadioGroup>

            {/* Department Selection (when "Department" is selected) */}
            {showDepartmentSelect && (
              <Box sx={{}}>
                <FormControl sx={{ minWidth: 200 }}>
                  <InputLabel>Select Department</InputLabel>
                  <Select
                  
                    value={selectedDepartment}
                    onChange={(e) => setSelectedDepartment(e.target.value)}
                    label="Select Department"
                  >
                    {departments.map((dept) => (
                      <MenuItem key={dept} value={dept}>
                        {dept}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            )}

            {/* Agent Selection (when "Agent" is selected) */}
            {showAgentSelect && (
              <Box sx={{}}>
                <FormControl sx={{ minWidth: 200 }}>
                  <InputLabel id="select-agent" >Select Agent</InputLabel>
                  <Select
                 
                    value={selectedAgent}
                    onChange={(e) => setSelectedAgent(e.target.value)}
                    label="Select Agent"
                    labelId="select-agent-label"
                    id="select-agent"
                  >
                    {agents.map((agent) => (
                      <MenuItem key={agent} value={agent}>
                        {agent}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            )}
          </Box>
        </Box>
        <div className="flex items-center justify-end gap-2">
          <Button
            variant="text"
            onClick={() => navigate("/scenario-automation")}
          >
            Back
          </Button>
          <Button variant="contained">Save</Button>
        </div>
      </Box>

      {/* Right Sidebar */}
      <Box
        sx={{
          maxHeight: "calc(100vh - 100px)",
          overflowY: "auto",
          p: 2,
          bgcolor: "#f8f9fa",
          borderLeft: "1px solid #e0e0e0",
        }}
      >
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <Card sx={{ boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
            <CardContent>
              <Typography
                variant="h6"
                sx={{ fontWeight: 600, mb: 2, color: "#1a1a1a" }}
              >
                Scenario Automations
              </Typography>
              <Typography
                variant="body2"
                sx={{ lineHeight: 1.6, color: "#65676b" }}
              >
                Scenario Automations let you carry out a series of updates to
                the ticket with a single click. They help you quickly handle
                recurring scenarios. For example, you could create a scenario
                called “Assign to the Escalation team” and send an email to the
                Escalation team in a single click whenever an issue related to
                login is reported.
              </Typography>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Box>
  );
};

export default CreateScenarioAutomations;
