import React, { useState } from "react";
import {
  DragIndicator,
  VisibilityOff,
  Close,
  CalendarToday,
  List,
  CheckBox,
  Numbers,
  Tag,
  FormatAlignLeft,
  TextFields,
  Search,
  Settings,
  Visibility,
  Delete,
  Add,
} from "@mui/icons-material";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Chip,
  IconButton,
  Checkbox,
  FormControlLabel,
  Divider,
  Tooltip,
  InputAdornment,
  Paper,
  AccordionSummary,
  AccordionDetails,
  Accordion,
  Backdrop,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { useSelector } from "react-redux";
import { RootState } from "../../../reduxStore/Store";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
// Field types that can be dragged and dropped
const fieldTypes = [
  {
    id: "single-line-text",
    name: "Single-line text",
    icon: TextFields,
    description: "A single line text input field",
  },
  {
    id: "multi-line-text",
    name: "Multi-line text",
    icon: FormatAlignLeft,
    description: "A multi-line text area field",
  },
  {
    id: "checkbox",
    name: "Checkbox",
    icon: CheckBox,
    description: "A checkbox field for yes/no values",
  },
  {
    id: "dropdown",
    name: "Dropdown",
    icon: List,
    description: "A dropdown selection field",
  },
  {
    id: "dependent-field",
    name: "Dependent field",
    icon: Settings,
    description: "A field that depends on another field",
  },
  {
    id: "date",
    name: "Date",
    icon: CalendarToday,
    description: "A date picker field",
  },
  {
    id: "number",
    name: "Number",
    icon: Numbers,
    description: "A numeric input field",
  },
  {
    id: "decimal",
    name: "Decimal",
    icon: Tag,
    description: "A decimal number input field",
  },
];

// Default existing fields
const defaultFields = [
  {
    id: "search-requester",
    name: "Search a requester",
    type: "single-line-text",
    isDefault: true,
    isDisabled: false,
    isVisible: true,
  },
  {
    id: "subject",
    name: "Subject",
    type: "single-line-text",
    isDefault: true,
    isDisabled: false,
    isVisible: true,
  },
  {
    id: "type",
    name: "Type",
    type: "dropdown",
    isDefault: true,
    isDisabled: false,
    isVisible: true,
  },
  {
    id: "source",
    name: "Source",
    type: "dropdown",
    isDefault: true,
    isDisabled: true,
    isVisible: false,
  },
  {
    id: "status",
    name: "Status",
    agents: {
      subReq: true,
      closeReq: false,
      isField: true,
    },
    customers: {
      view: true,
      edit: false,
      subReq: false,
      isField: false,
    },
    isDefault: true,
    isDisabled: false,
    isVisible: true,
  },
  {
    id: "priority",
    name: "Priority",
    agents: {
      subReq: true,
      closeReq: false,
      isField: true,
    },
    customers: {
      view: true,
      edit: true,
      subReq: false,
      isField: false,
    },
    isDefault: true,
    isDisabled: false,
    isVisible: true,
  },
  {
    id: "group",
    name: "Group",
    type: "dropdown",
    isDefault: true,
    isDisabled: true,
    isVisible: false,
  },
  {
    id: "agent",
    name: "Agent",
    type: "dropdown",
    isDefault: true,
    isDisabled: false,
    isVisible: true,
  },
  {
    id: "description",
    name: "Description",
    type: "multi-line-text",
    isDefault: true,
    isDisabled: false,
    isVisible: true,
  },
];

// Default status dropdown choices
const defaultStatusChoices = [
  {
    id: "open",
    labelForAgents: "Open",
    labelForCustomers: "Open",
    hasSlaTimer: false,
    isDefault: true,
  },
  {
    id: "pending",
    labelForAgents: "Pending",
    labelForCustomers: "Pending",
    hasSlaTimer: true,
    isDefault: true,
  },
  {
    id: "resolved",
    labelForAgents: "Resolved",
    labelForCustomers: "Resolved",
    hasSlaTimer: false,
    isDefault: true,
  },
  {
    id: "closed",
    labelForAgents: "Closed",
    labelForCustomers: "Closed",
    hasSlaTimer: false,
    isDefault: true,
  },
];

const TicketFieldsPage: React.FC = () => {
const navigate = useNavigate();
  const [fields, setFields] = useState<any[]>(defaultFields);
  const [selectedField, setSelectedField] = useState<any | null>(null);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [isDropActive, setIsDropActive] = useState(false);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [statusChoices, setStatusChoices] =
    useState<any[]>(defaultStatusChoices);
  const [newChoiceText, setNewChoiceText] = useState("");
  const { isOpen } = useSelector((state: RootState) => state.shotcut);
  const getFieldIcon = (type: string) => {
    const fieldType = fieldTypes.find((ft) => ft.id === type);
    return fieldType ? fieldType.icon : TextFields;
  };

  const handleDragStart = (e: React.DragEvent, itemId: string) => {
    if (!!selectedField) {
      return;
    }
    setDraggedItem(itemId);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    setDragOverIndex(index);
  };

  const handleDragLeave = () => {
    setDragOverIndex(null);
  };

  const handleDrop = (e: React.DragEvent, targetIndex?: number) => {
    e.preventDefault();

    if (!draggedItem) return;

    // Check if it's a field type being added
    const fieldType = fieldTypes.find((ft) => ft.id === draggedItem);
    if (fieldType) {
      const newField = {
        id: `${fieldType.id}-${Date.now()}`,
        name: `New ${fieldType.name.toLowerCase()}`,
        type: fieldType.id,
        isDefault: false,
        isDisabled: false,
        isVisible: true,
        labelForAgents: "",
        labelForCustomers: "",
        requiredForAgents: false,
        requiredForCustomers: false,
        requiredWhenClosing: false,
        canView: true,
        canEdit: true,
      };

      const newFields = [...fields];
      if (targetIndex !== undefined) {
        newFields.splice(targetIndex, 0, newField);
      } else {
        newFields.push(newField);
      }
      setFields(newFields);
    } else {
      // Reordering existing field
      const draggedIndex = fields.findIndex(
        (field) => field.id === draggedItem
      );
      if (draggedIndex !== -1 && targetIndex !== undefined) {
        const newFields = [...fields];
        const [reorderedField] = newFields.splice(draggedIndex, 1);
        newFields.splice(targetIndex, 0, reorderedField);
        setFields(newFields);
      }
    }

    setDraggedItem(null);
    setDragOverIndex(null);
    setIsDropActive(false);
  };

  const handleAddField = (e: any, fieldId: any) => {

    if (!!selectedField) return;
    const fieldType = fieldTypes.find((ft) => ft.id === fieldId);
    if (fieldType) {
      const newField = {
        id: `${fieldType.id}-${Date.now()}`,
        name: `New ${fieldType.name.toLowerCase()}`,
        type: fieldType.id,
        isDefault: false,
        isDisabled: false,
        isVisible: true,
        labelForAgents: "",
        labelForCustomers: "",
        requiredForAgents: false,
        requiredForCustomers: false,
        requiredWhenClosing: false,
        canView: true,
        canEdit: true,
      };

      const newFields = [...fields];

      newFields.push(newField);

      setFields(newFields);
    }
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
    setDragOverIndex(null);
    setIsDropActive(false);
  };

  const handleFieldClick = (e: any, field: any) => {
    setSelectedField(field);
  };

  const handleSaveField = (updatedField: any) => {
    setFields((prev) =>
      prev.map((field) => (field.id === updatedField.id ? updatedField : field))
    );

    setSelectedField(null);
    setExpandedIndex(null);
  };

  const handleDeleteField = (fieldId: string) => {
    setFields((prev) => prev.filter((field) => field.id !== fieldId));
  };

  const handleToggleVisibility = (fieldId: string) => {
    setFields((prev) =>
      prev.map((field) =>
        field.id === fieldId ? { ...field, isVisible: !field.isVisible } : field
      )
    );
  };

  // Dropdown choices handlers
  const handleAddChoice = () => {
    if (newChoiceText.trim()) {
      const newChoice = {
        id: `choice-${Date.now()}`,
        labelForAgents: newChoiceText.trim(),
        labelForCustomers: newChoiceText.trim(),
        hasSlaTimer: false,
        isDefault: false,
      };
      setStatusChoices((prev) => [...prev, newChoice]);
      setNewChoiceText("");
    }
  };

  const handleDeleteChoice = (choiceId: string) => {
    setStatusChoices((prev) => prev.filter((choice) => choice.id !== choiceId));
  };

  const handleUpdateChoice = (choiceId: string, field: string, value: any) => {
    setStatusChoices((prev) =>
      prev.map((choice) =>
        choice.id === choiceId ? { ...choice, [field]: value } : choice
      )
    );
  };

  const handleChoiceDragStart = (e: React.DragEvent, choiceId: string) => {
    setDraggedItem(choiceId);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleChoiceDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    setDragOverIndex(index);
  };

  const handleChoiceDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    if (!draggedItem) return;

    const draggedIndex = statusChoices.findIndex(
      (choice) => choice.id === draggedItem
    );
    if (draggedIndex !== -1) {
      const newChoices = [...statusChoices];
      const [reorderedChoice] = newChoices.splice(draggedIndex, 1);
      newChoices.splice(targetIndex, 0, reorderedChoice);
      setStatusChoices(newChoices);
    }

    setDraggedItem(null);
    setDragOverIndex(null);
  };

  const filteredFields = fields.filter((field) => {
    const matchesFilter =
      filter === "all" ||
      (filter === "default" && field.isDefault) ||
      (filter === "custom" && !field.isDefault);

    const matchesSearch = field?.name
      ?.toLowerCase()
      ?.includes(searchTerm?.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  return (
    <Box sx={{ bgcolor: "grey.50", height: "calc(100vh - 100px)" }}>
      <Box sx={{ mb: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <IconButton onClick={() => navigate("/settings/workflow")}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h5" sx={{ fontWeight: 600, color: "#1a1a1a" }}>
           Ticket Fields

          </Typography>
        </Box>
        <Typography variant="body1" color="text.secondary">
          Customize your ticket type to categorize, prioritize, and route
          tickets efficiently.
        </Typography>
      </Box>

      <Box
        sx={{
          display: "flex",
          gap: 3,
          flexDirection: { xs: "column", lg: "row" },
        }}
      >
        {/* Left Panel - Field Types */}
        <Box
          sx={{
            flex: { xs: 1, lg: "0 0 300px" },
            maxHeight: "calc(100vh - 170px)",
            overflowY: "auto",
          }}
        >
          <Card>
            <CardContent>
              <Typography variant="subtitle2" sx={{ mb: 2 }}>
                Drag and drop to create fields
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                {fieldTypes.map((fieldType) => {
                  const IconComponent = fieldType.icon;
                  return (
                    <Card
                      key={fieldType.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, fieldType.id)}
                      onDragEnd={handleDragEnd}
                      onClick={(e) => handleAddField(e as any, fieldType.id)}
                      sx={{
                        p: 2,
                        cursor: !!selectedField ? "" : "pointer",
                        "&:hover": {
                          bgcolor: !!selectedField ? "" : "grey.50",
                        },
                        border: "1px solid",
                        borderColor: "grey.300",
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                      }}
                    >
                      <IconComponent sx={{ color: "primary.main" }} />
                      <Typography variant="body2" sx={{ fontWeight: "medium" }}>
                        {fieldType.name}
                      </Typography>
                    </Card>
                  );
                })}
              </Box>
            </CardContent>
          </Card>
        </Box>

        {/* Right Panel - Existing Fields */}
        <Box sx={{ flex: 1 }}>
          <Card elevation={0}>
            {/* Header with filters and search */}
            <Box
              sx={{
                p: 2,
                borderBottom: "1px solid",
                borderColor: "grey.200",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                  alignItems: "center",
                  flexDirection: { xs: "column", sm: "row" },
                }}
              >
                <FormControl size="small" sx={{ minWidth: 150 }}>
                  <InputLabel>Filter</InputLabel>
                  <Select
                    value={filter}
                    onChange={(e) => {
                      setFilter(e.target.value);
                    }}
                    label="Filter"
                    disabled={!!selectedField}
                  >
                    <MenuItem value="all">All fields</MenuItem>
                    <MenuItem value="default">Default fields</MenuItem>
                    <MenuItem value="custom">Custom fields</MenuItem>
                  </Select>
                </FormControl>
                <TextField
                  disabled={!!selectedField}
                  size="small"
                  placeholder="Search fields"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search sx={{ color: "grey.500" }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ width: { xs: "100%", sm: "300px" } }}
                />
              </Box>
            </Box>

            {/* Backdrop when any accordion is expanded */}
            <Backdrop
              open={expandedIndex !== null}
              onClick={() => setExpandedIndex(null)}
              sx={{
                top: 64,
                left: isOpen ? 78 : 0,
                zIndex: (theme) => theme.zIndex.drawer + 1,
                // backdropFilter: "blur(1px)",
                bgcolor: "rgba(0, 0, 0, 0.08)",
                pointerEvents: "none",
                transition: "left 600ms ease-in-out",
              }}
            />

            {/* Fields List */}
            <Box
              sx={{ p: 2, maxHeight: "calc(100vh - 235px)", overflowY: "auto" }}
            >
              <Box
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDropActive(true);
                }}
                onDragLeave={() => setIsDropActive(false)}
                onDrop={(e) => handleDrop(e)}
                sx={{
                  mb: 2,
                  p: 2,
                  border: "1.5px dashed",
                  borderColor: isDropActive ? "primary.main" : "grey.300",
                  bgcolor: isDropActive ? "primary.50" : "grey.50",
                  color: "text.secondary",
                  borderRadius: 1,
                  textAlign: "center",
                  transition: "all 0.2s ease",
                }}
              >
                <Typography variant="body2">
                  Drag here to add a new field
                </Typography>
              </Box>

              {filteredFields.map((field, index) => {
                const IconComponent = getFieldIcon(field.type);
                return (
                  <Accordion
                    disabled={!!selectedField}
                    elevation={0}
                    expanded={expandedIndex === index}
                    onChange={(_, isExpanded: any) => {
                      if (!!selectedField) {
                        return;
                      }
                      setExpandedIndex(isExpanded ? index : null);
                    }}
                    sx={{
                      "&.Mui-disabled": {
                        backgroundColor: "#f5f5f5", // light grey background
                        cursor: "default",
                        opacity: 1,
                      },
                      // pointerEvents: expandedIndex === index ? "auto" : "none", // block clicks

                      cursor: !!selectedField ? "pointer" : " ",
                      border: "none",
                      boxShadow: "none",
                      "&:before": { display: "none" },
                      position: "relative",
                      zIndex:
                        expandedIndex === index
                          ? (theme) => theme.zIndex.modal + 0
                          : "auto",
                    }}
                  >
                    <AccordionSummary>
                      <Card
                        elevation={0}
                        key={field.id}
                        draggable={!field.isDisabled}
                        onDragStart={(e) =>
                          !field.isDisabled && handleDragStart(e, field.id)
                        }
                        onDragOver={(e) => handleDragOver(e, index)}
                        onDragLeave={handleDragLeave}
                        onDrop={(e) => handleDrop(e, index)}
                        onDragEnd={handleDragEnd}
                        onClick={(e) => {
                          !field.isDisabled && handleFieldClick(e, field);
                        }}
                        sx={{
                          width: "100%",

                          cursor:
                            field.isDisabled || !!selectedField
                              ? ""
                              : "pointer",
                          opacity: field.isDisabled ? 0.6 : 1,
                          border: "1px solid",
                          borderColor:
                            dragOverIndex === index
                              ? "primary.main"
                              : "grey.300",
                          bgcolor:
                            dragOverIndex === index ? "primary.50" : "white",
                          "&:hover": {
                            bgcolor: field.isDisabled ? "white" : "grey.50",
                          },
                          transition: "all 0.2s",
                          borderRadius: 1,
                        }}
                      >
                        <CardContent
                          sx={{ p: 1.5, "&:last-child": { pb: 1.5 } }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 2,
                            }}
                          >
                            <DragIndicator
                              color="action"
                              sx={{ cursor: "grab" }}
                            />
                            <IconComponent sx={{ color: "primary.main" }} />
                            <Typography
                              variant="body1"
                              sx={{ flexGrow: 1, fontWeight: "medium" }}
                            >
                              {field.name}
                            </Typography>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                              }}
                            >
                              {field.isDefault && (
                                <Chip
                                  label="Default"
                                  size="small"
                                  color="default"
                                />
                              )}
                              <Tooltip
                                title={field.isVisible ? "Hide" : "Show"}
                              >
                                <IconButton
                                  size="small"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleToggleVisibility(field.id);
                                  }}
                                  color={
                                    field.isVisible ? "default" : "primary"
                                  }
                                >
                                  {field.isVisible ? (
                                    <Visibility />
                                  ) : (
                                    <VisibilityOff />
                                  )}
                                </IconButton>
                              </Tooltip>
                              {!field.isDefault && (
                                <Tooltip title="Delete field">
                                  <IconButton
                                    size="small"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDeleteField(field.id);
                                    }}
                                    color="error"
                                  >
                                    <Close />
                                  </IconButton>
                                </Tooltip>
                              )}
                            </Box>
                          </Box>
                        </CardContent>
                      </Card>
                    </AccordionSummary>
                    <AccordionDetails sx={{}}>
                      <FieldConfigurationModal
                        field={selectedField}
                        onSave={handleSaveField}
                        onClose={() => {
                          setSelectedField(null);
                          setExpandedIndex(null);
                        }}
                      />
                    </AccordionDetails>
                  </Accordion>
                );
              })}

              {filteredFields.length === 0 && (
                <Box
                  sx={{ textAlign: "center", py: 6, color: "text.secondary" }}
                >
                  <Typography variant="body2">
                    No fields match your filters.
                  </Typography>
                </Box>
              )}
            </Box>
          </Card>
        </Box>
      </Box>
    </Box>
  );
};

// Field Configuration Modal Component
interface FieldConfigurationModalProps {
  onClose: () => void;
  field: any | null;
  onSave: (field: any) => void;
}

const FieldConfigurationModal: React.FC<FieldConfigurationModalProps> = ({
  field,
  onSave,
  onClose,
}) => {
  const [formData, setFormData] = useState<any | null>(null);
  const [statusChoices, setStatusChoices] =
    useState<any[]>(defaultStatusChoices);
  const [newChoiceText, setNewChoiceText] = useState("");

  React.useEffect(() => {
    if (field) {
      setFormData(field);
    }
  }, [field]);

  // Dropdown choices handlers
  const handleAddChoice = () => {
    if (newChoiceText.trim()) {
      const newChoice = {
        id: `choice-${Date.now()}`,
        labelForAgents: newChoiceText.trim(),
        labelForCustomers: newChoiceText.trim(),
        hasSlaTimer: false,
        isDefault: false,
      };
      setStatusChoices((prev) => [...prev, newChoice]);
      setNewChoiceText("");
    }
  };

  const handleDeleteChoice = (choiceId: string) => {
    setStatusChoices((prev) => prev.filter((choice) => choice.id !== choiceId));
  };

  const handleUpdateChoice = (choiceId: string, field: string, value: any) => {
    setStatusChoices((prev) =>
      prev.map((choice) =>
        choice.id === choiceId ? { ...choice, [field]: value } : choice
      )
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData) {
      onSave(formData);
    }
  };

  if (!field || !formData) return null;

  return (
    <Paper elevation={5} sx={{ p: 3, width: "100%" }}>
      <Box component="form" onSubmit={handleSubmit}>
        {/* Behavior for Agents */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: "medium" }}>
            BEHAVIOR FOR AGENTS
          </Typography>
          <Box sx={{ display: "flex", gap: 1 }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.agents?.subReq || false}
                  onChange={(e) =>
                    setFormData((prev: any) =>
                      prev
                        ? {
                            ...prev,
                            agents: {
                              ...prev.agents,
                              subReq: e.target.checked,
                            },
                          }
                        : null
                    )
                  }
                />
              }
              label="Required when submitting the ticket"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.agents?.closeReq || false}
                  onChange={(e) =>
                    setFormData((prev: any) =>
                      prev
                        ? {
                            ...prev,
                            agents: {
                              ...prev.agents,
                              closeReq: e.target.checked,
                            },
                          }
                        : null
                    )
                  }
                />
              }
              label="Required when closing the ticket"
            />
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Behavior for Customers */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: "medium" }}>
            BEHAVIOR FOR CUSTOMERS
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "row", gap: 1 }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.customers?.view || false}
                  onChange={(e) =>
                    setFormData((prev: any) =>
                      prev
                        ? {
                            ...prev,
                            customers: {
                              ...prev.customers,
                              view: e.target.checked,
                            },
                          }
                        : null
                    )
                  }
                />
              }
              label="Can view"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.customers?.edit || false}
                  onChange={(e) =>
                    setFormData((prev: any) =>
                      prev
                        ? {
                            ...prev,
                            customers: {
                              ...prev.customers,
                              edit: e.target.checked,
                            },
                          }
                        : null
                    )
                  }
                />
              }
              label="Can edit"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.customers?.subReq || false}
                  onChange={(e) =>
                    setFormData((prev: any) =>
                      prev
                        ? {
                            ...prev,
                            customers: {
                              ...prev.customers,
                              subReq: e.target.checked,
                            },
                          }
                        : null
                    )
                  }
                />
              }
              label="Required when submitting a ticket"
            />
          </Box>
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Labels */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: "medium" }}>
            LABEL
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "row", gap: 2 }}>
            <TextField
              disabled={formData?.agents?.isField}
              label="Label for agents"
              required
              value={formData?.name || ""}
              onChange={(e) =>
                setFormData((prev: any) =>
                  prev
                    ? {
                        ...prev,
                        name: e.target.value,
                      }
                    : null
                )
              }
              placeholder="Enter label for agents"
              fullWidth
            />
            <TextField
              label="Label for customers"
              required
              value={formData?.name || ""}
              onChange={(e) =>
                setFormData((prev: any) =>
                  prev
                    ? {
                        ...prev,
                        name: e.target.value,
                      }
                    : null
                )
              }
              placeholder="Enter label for customers"
              fullWidth
            />
          </Box>
        </Box>

        {/* Dropdown Choices for Status field */}
        {formData?.id === "status" && (
          <>
            <Divider sx={{ my: 3 }} />
            <Box sx={{ mb: 2 }}>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}
              >
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  Dropdown choices
                </Typography>
              </Box>

              <TableContainer
                component={Paper}
                elevation={0}
                sx={{ border: "1px solid", borderColor: "grey.300" }}
              >
                <Table>
                  <TableHead>
                    <TableRow sx={{ bgcolor: "grey.50" }}>
                      <TableCell
                        sx={{
                          fontWeight: "bold",
                          borderRight: "1px solid",
                          borderColor: "grey.300",
                        }}
                      >
                        Label for agents
                      </TableCell>
                      <TableCell
                        sx={{
                          fontWeight: "bold",
                          borderRight: "1px solid",
                          borderColor: "grey.300",
                        }}
                      >
                        Label for customers
                      </TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>
                        SLA timer
                      </TableCell>
                      <TableCell sx={{ width: 50 }}></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {statusChoices.map((choice, index) => (
                      <TableRow
                        key={choice.id}
                        sx={{ "&:hover": { bgcolor: "grey.50" } }}
                      >
                        <TableCell
                          sx={{
                            borderRight: "1px solid",
                            borderColor: "grey.300",
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            <DragIndicator
                              sx={{ color: "grey.500", cursor: "grab" }}
                            />
                            <TextField
                              size="small"
                              value={choice.labelForAgents}
                              onChange={(e) =>
                                handleUpdateChoice(
                                  choice.id,
                                  "labelForAgents",
                                  e.target.value
                                )
                              }
                              disabled={choice.isDefault}
                              sx={{
                                "& .MuiInputBase-input": {
                                  py: 0.6,
                                  px: 1,
                                  color: choice.isDefault
                                    ? "grey.500"
                                    : "text.primary",
                                },
                              }}
                              variant="standard"
                              InputProps={{ disableUnderline: true }}
                            />
                          </Box>
                        </TableCell>
                        <TableCell
                          sx={{
                            borderRight: "1px solid",
                            borderColor: "grey.300",
                          }}
                        >
                          <TextField
                            size="small"
                            value={choice.labelForCustomers}
                            onChange={(e) =>
                              handleUpdateChoice(
                                choice.id,
                                "labelForCustomers",
                                e.target.value
                              )
                            }
                            variant="standard"
                            InputProps={{ disableUnderline: true }}
                          />
                        </TableCell>
                        <TableCell>
                          <Switch
                            checked={choice.hasSlaTimer}
                            onChange={(e) =>
                              handleUpdateChoice(
                                choice.id,
                                "hasSlaTimer",
                                e.target.checked
                              )
                            }
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <IconButton
                            size="small"
                            onClick={() => handleDeleteChoice(choice.id)}
                            disabled={choice.isDefault}
                            color="error"
                          >
                            <Delete fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              {/* Add new choice */}
              <Box
                sx={{ mt: 2, display: "flex", alignItems: "center", gap: 1 }}
              >
                <TextField
                  size="small"
                  placeholder="Add a choice"
                  value={newChoiceText}
                  onChange={(e) => setNewChoiceText(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleAddChoice()}
                  sx={{ flexGrow: 1 }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Add sx={{ color: "grey.500" }} />
                      </InputAdornment>
                    ),
                  }}
                />
                <Button
                  variant="outlined"
                  size="small"
                  onClick={handleAddChoice}
                  disabled={!newChoiceText.trim()}
                >
                  Add
                </Button>
              </Box>
            </Box>
          </>
        )}
      </Box>
      <div className="flex justify-center gap-2">
        <Button onClick={onClose} variant="text" color="inherit">
          Cancel
        </Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          Save field
        </Button>
      </div>
    </Paper>
  );
};

export default TicketFieldsPage;
