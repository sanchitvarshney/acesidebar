import React, { useState, useCallback, useRef } from "react";
import {
  DragIndicator,
  VisibilityOff,
  Close,
  Check,
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  Grid,
} from "@mui/material";

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
    type: "dropdown",
    isDefault: true,
    isDisabled: false,
    isVisible: true,
  },
  {
    id: "priority",
    name: "Priority",
    type: "dropdown",
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

interface FieldConfig {
  id: string;
  name: string;
  type: string;
  isDefault: boolean;
  isDisabled: boolean;
  isVisible: boolean;
  labelForAgents?: string;
  labelForCustomers?: string;
  requiredForAgents?: boolean;
  requiredForCustomers?: boolean;
  requiredWhenClosing?: boolean;
  canView?: boolean;
  canEdit?: boolean;
}

const TicketFieldsPage: React.FC = () => {
  const [fields, setFields] = useState<FieldConfig[]>(defaultFields);
  const [selectedField, setSelectedField] = useState<FieldConfig | null>(null);
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const dragRef = useRef<HTMLDivElement>(null);

  const getFieldIcon = (type: string) => {
    const fieldType = fieldTypes.find((ft) => ft.id === type);
    return fieldType ? fieldType.icon : TextFields;
  };

  const handleDragStart = (e: React.DragEvent, itemId: string) => {
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
      const newField: FieldConfig = {
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
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
    setDragOverIndex(null);
  };

  const handleFieldClick = (field: FieldConfig) => {
    setSelectedField(field);
    setIsConfigOpen(true);
  };

  const handleSaveField = (updatedField: FieldConfig) => {
    setFields((prev) =>
      prev.map((field) => (field.id === updatedField.id ? updatedField : field))
    );
    setIsConfigOpen(false);
    setSelectedField(null);
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

  const filteredFields = fields.filter((field) => {
    const matchesFilter =
      filter === "all" ||
      (filter === "default" && field.isDefault) ||
      (filter === "custom" && !field.isDefault);

    const matchesSearch = field.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  return (
    <Box sx={{  bgcolor: 'grey.50', minHeight: '100vh' }}>
      <Box sx={{ maxWidth: '1400px', mx: 'auto' }}>
        <Box sx={{ mb: 2 }}>
          <Typography variant="h4" component="h1" sx={{ mb: 1, fontWeight: 'bold' }}>
            Ticket Fields
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Customize your ticket type to categorize, prioritize, and route
            tickets efficiently.
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', lg: 'row' } }}>
          {/* Left Panel - Field Types */}
          <Box sx={{ flex: { xs: 1, lg: '0 0 300px' } }}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 'semibold' }}>
                  Drag and drop to create fields
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {fieldTypes.map((fieldType, index) => {
                    const IconComponent = fieldType.icon;
                    return (
                      <Card
                        key={fieldType.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, fieldType.id)}
                        onDragEnd={handleDragEnd}
                        sx={{
                          p: 2,
                          cursor: 'grab',
                          '&:hover': { bgcolor: 'grey.50' },
                          border: '1px solid',
                          borderColor: 'grey.300',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 2,
                        }}
                      >
                        <IconComponent color="action" />
                        <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
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
            <Card>
              {/* Header with filters and search */}
              <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'grey.200' }}>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexDirection: { xs: 'column', sm: 'row' } }}>
                  <FormControl size="small" sx={{ minWidth: 150 }}>
                    <InputLabel>Filter</InputLabel>
                    <Select
                      value={filter}
                      onChange={(e) => setFilter(e.target.value)}
                      label="Filter"
                    >
                      <MenuItem value="all">All fields</MenuItem>
                      <MenuItem value="default">Default fields</MenuItem>
                      <MenuItem value="custom">Custom fields</MenuItem>
                    </Select>
                  </FormControl>
                  <TextField
                    size="small"
                    placeholder="Search fields"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    InputProps={{
                      startAdornment: <Search sx={{ mr: 1, color: 'grey.400' }} />,
                    }}
                    sx={{ width: { xs: '100%', sm: '300px' } }}
                  />
                </Box>
              </Box>

              {/* Fields List */}
              <Box sx={{ p: 2 }}>
                {/* Drop Zone for new fields */}
                <Box
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragOverIndex(-1);
                  }}
                  onDrop={(e) => handleDrop(e)}
                  sx={{
                    minHeight: 60,
                    border: '2px dashed',
                    borderColor: dragOverIndex === -1 ? 'primary.main' : 'grey.300',
                    borderRadius: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 2,
                    bgcolor: dragOverIndex === -1 ? 'primary.50' : 'transparent',
                    transition: 'all 0.2s',
                  }}
                >
                  <Typography variant="body2" color="text.secondary">
                    Drop new fields here
                  </Typography>
                </Box>

                {filteredFields.map((field, index) => {
                  const IconComponent = getFieldIcon(field.type);
                  return (
                    <Card
                      key={field.id}
                      draggable={!field.isDisabled}
                      onDragStart={(e) =>
                        !field.isDisabled && handleDragStart(e, field.id)
                      }
                      onDragOver={(e) => handleDragOver(e, index)}
                      onDragLeave={handleDragLeave}
                      onDrop={(e) => handleDrop(e, index)}
                      onDragEnd={handleDragEnd}
                      onClick={() =>
                        !field.isDisabled && handleFieldClick(field)
                      }
                      sx={{
                        mb: 1,
                        cursor: field.isDisabled ? 'default' : 'pointer',
                        opacity: field.isDisabled ? 0.6 : 1,
                        border: '1px solid',
                        borderColor: dragOverIndex === index ? 'primary.main' : 'grey.300',
                        bgcolor: dragOverIndex === index ? 'primary.50' : 'white',
                        '&:hover': { bgcolor: field.isDisabled ? 'white' : 'grey.50' },
                        transition: 'all 0.2s',
                      }}
                    >
                      <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <DragIndicator color="action" sx={{ cursor: 'grab' }} />
                          <IconComponent color="action" />
                          <Typography variant="body1" sx={{ flexGrow: 1, fontWeight: 'medium' }}>
                            {field.name}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            {field.isDefault && (
                              <Chip label="Default" size="small" color="default" />
                            )}
                            <IconButton
                              size="small"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleToggleVisibility(field.id);
                              }}
                              color={field.isVisible ? 'default' : 'primary'}
                            >
                              {field.isVisible ? <Visibility /> : <VisibilityOff />}
                            </IconButton>
                            {!field.isDefault && (
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
                            )}
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  );
                })}
              </Box>
            </Card>
          </Box>
        </Box>
      </Box>

      {/* Field Configuration Modal */}
      <FieldConfigurationModal
        open={isConfigOpen}
        field={selectedField}
        onSave={handleSaveField}
        onClose={() => {
          setIsConfigOpen(false);
          setSelectedField(null);
        }}
      />
    </Box>
  );
};

// Field Configuration Modal Component
interface FieldConfigurationModalProps {
  open: boolean;
  field: FieldConfig | null;
  onSave: (field: FieldConfig) => void;
  onClose: () => void;
}

const FieldConfigurationModal: React.FC<FieldConfigurationModalProps> = ({
  open,
  field,
  onSave,
  onClose,
}) => {
  const [formData, setFormData] = useState<FieldConfig | null>(null);

  React.useEffect(() => {
    if (field) {
      setFormData(field);
    }
  }, [field]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData) {
      onSave(formData);
    }
  };

  const getFieldIcon = (type: string) => {
    const fieldType = fieldTypes.find((ft) => ft.id === type);
    return fieldType ? fieldType.icon : TextFields;
  };

  if (!field || !formData) return null;

  const IconComponent = getFieldIcon(field.type);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconComponent color="action" />
          <Typography variant="h6">{formData.name}</Typography>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          {/* Behavior for Agents */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 'medium' }}>
              BEHAVIOR FOR AGENTS
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.requiredForAgents || false}
                    onChange={(e) =>
                      setFormData((prev) => prev ? ({
                        ...prev,
                        requiredForAgents: e.target.checked,
                      }) : null)
                    }
                  />
                }
                label="Required when submitting the ticket"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.requiredWhenClosing || false}
                    onChange={(e) =>
                      setFormData((prev) => prev ? ({
                        ...prev,
                        requiredWhenClosing: e.target.checked,
                      }) : null)
                    }
                  />
                }
                label="Required when closing the ticket"
              />
            </Box>
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* Behavior for Customers */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 'medium' }}>
              BEHAVIOR FOR CUSTOMERS
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.canView || false}
                    onChange={(e) =>
                      setFormData((prev) => prev ? ({
                        ...prev,
                        canView: e.target.checked,
                      }) : null)
                    }
                  />
                }
                label="Can view"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.canEdit || false}
                    onChange={(e) =>
                      setFormData((prev) => prev ? ({
                        ...prev,
                        canEdit: e.target.checked,
                      }) : null)
                    }
                  />
                }
                label="Can edit"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.requiredForCustomers || false}
                    onChange={(e) =>
                      setFormData((prev) => prev ? ({
                        ...prev,
                        requiredForCustomers: e.target.checked,
                      }) : null)
                    }
                  />
                }
                label="Required when submitting a ticket"
              />
            </Box>
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* Labels */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 'medium' }}>
              LABEL
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                label="Label for agents"
                required
                value={formData.labelForAgents || ""}
                onChange={(e) =>
                  setFormData((prev) => prev ? ({
                    ...prev,
                    labelForAgents: e.target.value,
                  }) : null)
                }
                placeholder="Enter label for agents"
                fullWidth
              />
              <TextField
                label="Label for customers"
                required
                value={formData.labelForCustomers || ""}
                onChange={(e) =>
                  setFormData((prev) => prev ? ({
                    ...prev,
                    labelForCustomers: e.target.value,
                  }) : null)
                }
                placeholder="Enter label for customers"
                fullWidth
              />
            </Box>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 3 }}>
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          color="primary"
        >
          Save field
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TicketFieldsPage;
