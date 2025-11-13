import React, { useMemo, useRef, useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Divider,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Paper,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Toolbar,
  Tooltip,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Card,
  LinearProgress,
  Pagination,
  Menu,
  Popover,
} from "@mui/material";
import CustomSideBarPanel from "../../../components/reusable/CustomSideBarPanel";
import StackEditor from "../../../components/reusable/Editor";
import {
  TextField,
  FormControlLabel,
  RadioGroup,
  Radio,
  InputLabel,
  FormControl,
} from "@mui/material";
import CustomToolTip from "../../../reusable/CustomToolTip";
import ImageViewComponent from "../../components/ImageViewComponent";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import CloseIcon from "@mui/icons-material/Close";
import empty from "../../../assets/image/overview-empty-state.svg";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import PersonIcon from "@mui/icons-material/Person";
import BusinessIcon from "@mui/icons-material/Business";
import WorkIcon from "@mui/icons-material/Work";
import { Search as SearchIcon, Close } from "@mui/icons-material";
const operatorOptions = [
  { value: "startsWith", label: "Starts with" },
  { value: "endsWith", label: "Ends with" },
  { value: "contains", label: "Contains" },
  { value: "equals", label: "Equals" },
  { value: "doesNotContain", label: "Does not contain" },
  { value: "doesNotEqual", label: "Does not equal" },
  { value: "greaterThan", label: "Greater than (>)" },
  { value: "lessThan", label: "Less than (<)" },
  { value: "greaterThanOrEqual", label: "Greater than or equal (≥)" },
  { value: "lessThanOrEqual", label: "Less than or equal (≤)" },
  { value: "between", label: "Between" },
  { value: "in", label: "In" },
  { value: "notIn", label: "Not in" },
];
type Folder = {
  id: string;
  name: string;
};

type CannedResponse = {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  folderId: string;
};

const formatDate = (iso: string) => {
  const date = new Date(iso);
  const time = date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
  const day = date.toLocaleDateString([], {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  return `${day} ${time}`;
};

const CanenResponseMasterPage = () => {
  const navigate = useNavigate();
  const [folders] = useState<Folder[]>([
    { id: "personal", name: "Personal" },
    { id: "general", name: "General" },
  ]);

  const [responses] = useState<CannedResponse[]>([
    {
      id: "1",
      title: "Account cancellation",
      createdAt: "2025-07-10T09:22:00Z",
      updatedAt: "2025-07-10T09:22:00Z",
      folderId: "general",
    },
    {
      id: "2",
      title: "Response for demo request",
      createdAt: "2025-07-10T09:22:00Z",
      updatedAt: "2025-07-10T09:22:00Z",
      folderId: "general",
    },
    {
      id: "3",
      title: "Trial extension",
      createdAt: "2025-07-10T09:22:00Z",
      updatedAt: "2025-07-10T09:22:00Z",
      folderId: "general",
    },
    {
      id: "4",
      title: "Upgrade or downgrade a plan",
      createdAt: "2025-07-10T09:22:00Z",
      updatedAt: "2025-07-10T09:22:00Z",
      folderId: "general",
    },
  ]);

  const [activeFolderId, setActiveFolderId] = useState<string>("general");
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState<"create" | "edit">("create");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formTitle, setFormTitle] = useState("");
  const [formFolderId, setFormFolderId] = useState<string>("general");
  const [formAvailability, setFormAvailability] = useState<"myself" | "all">(
    "all"
  );
  const [formMessage, setFormMessage] = useState("");
  const [images, setImages] = useState<any[]>([]);
  const [showImagesModal, setShowImagesModal] = useState(false);
  const [newFolderOpen, setNewFolderOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [modelOpenref, setModelOpenref] = useState<null | HTMLElement>(null);
  const [lastChipRef, setLastChipRef] = useState<null | HTMLElement>(null);
  const [activeFilters, setActiveFilters] = useState<
    Array<{
      id: string;
      field: string;
      operator: string;
      value: string;
      label: string;
    }>
  >([]);
  const [filterMenuAnchor, setFilterMenuAnchor] = useState<null | HTMLElement>(
    null
  );
  const [selectedFilterField, setSelectedFilterField] = useState<{
    field: string;
    label: string;
    type?: string;
    options?: string[];
    operators?: string[];
    defaultOperator?: string;
  } | null>(null);
  const [filterValue, setFilterValue] = useState("");
  const [selectedOperator, setSelectedOperator] = useState("startsWith");
  const [checkboxValues, setCheckboxValues] = useState<string[]>([]);
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    totalPages: 5,
  });

  // Field options for filter - Corporate relevant filters
  const fieldOptions = [
    {
      value: "departmentName",
      label: "Department Name",
      icon: <BusinessIcon />,
      type: "text",
      operator: "startsWith",
    },
    {
      value: "manager",
      label: "Department Manager",
      icon: <PersonIcon />,
      type: "text",
      operator: "startsWith",
    },
    {
      value: "isActive",
      label: "Status",
      icon: <WorkIcon />,
      type: "multiCheckbox",
      options: ["Active", "Inactive"],
      operator: "equals",
    },
    {
      value: "agentCount",
      label: "Team Size",
      icon: <PersonIcon />,
      type: "number",
      operator: "equals",
    },
    {
      value: "departmentType",
      label: "Department Type",
      icon: <BusinessIcon />,
      type: "multiCheckbox",
      options: [
        "Support",
        "Sales",
        "Technical",
        "Administrative",
        "Finance",
        "HR",
        "Operations",
      ],
      operator: "equals",
    },
  ];

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setPagination((prev) => ({ ...prev, page: value }));
  };

  const removeFilter = (filterId: string) => {
    setActiveFilters(activeFilters.filter((filter) => filter.id !== filterId));
  };
  const clearAllFilters = () => {
    setActiveFilters([]);
  };
  // Open filter dialog for selected field
  const openFilterDialog = (field: string, label: string) => {
    if (activeFilters.length >= 5) {
      alert("Maximum 5 filters allowed");
      return;
    }

    const fieldOption = fieldOptions.find((option) => option.value === field);
    setSelectedFilterField({ field, label, ...fieldOption });

    if (fieldOption?.type === "multiCheckbox") {
      setCheckboxValues([]);
      setFilterValue("");
      setSelectedOperator(fieldOption.operator || "equals");
    } else {
      setFilterValue("");
      setSelectedOperator(fieldOption?.operator || "startsWith");
    }
    setCheckboxValues([]);

    setFilterDialogOpen(true);
  };

  // Apply filters to data
  const applyFilters = (data: any[]) => {
    return data.filter((row: any) => {
      return activeFilters.every((filter) => {
        if (!filter.value || filter.value.trim() === "") {
          return true;
        }

        const cellValue = row[filter.field]?.toString() || "";
        const filterValue = filter.value;

        // Handle multiCheckbox filters (Status)
        if (filter.field === "isActive" && filter.value.includes(",")) {
          const selectedStatuses = filter.value.split(", ");
          const isActive = row.isActive !== false;
          const status = isActive ? "Active" : "Inactive";
          return filter.operator === "equals"
            ? selectedStatuses.includes(status)
            : !selectedStatuses.includes(status);
        }

        // Handle number filters
        if (filter.field === "agentCount") {
          const cellNum = parseFloat(cellValue) || 0;
          const filterNum = parseFloat(filterValue) || 0;

          switch (filter.operator) {
            case "equals":
              return cellNum === filterNum;
            case "doesNotEqual":
              return cellNum !== filterNum;
            case "greaterThan":
              return cellNum > filterNum;
            case "lessThan":
              return cellNum < filterNum;
            case "greaterThanOrEqual":
              return cellNum >= filterNum;
            case "lessThanOrEqual":
              return cellNum <= filterNum;
            default:
              return true;
          }
        }

        // Handle text filters
        const cellValueLower = cellValue.toLowerCase();
        const filterValueLower = filterValue.toLowerCase();

        switch (filter.operator) {
          case "contains":
            return cellValueLower.includes(filterValueLower);
          case "equals":
            return cellValueLower === filterValueLower;
          case "doesNotEqual":
            return cellValueLower !== filterValueLower;
          case "startsWith":
            return cellValueLower.startsWith(filterValueLower);
          case "endsWith":
            return cellValueLower.endsWith(filterValueLower);
          case "doesNotContain":
            return !cellValueLower.includes(filterValueLower);
          default:
            return true;
        }
      });
    });
  };
  // Apply filter from dialog
  const applyFilter = () => {
    let valueToUse = "";
    let isValidFilter = false;

    if (selectedFilterField?.type === "multiCheckbox") {
      isValidFilter = checkboxValues.length > 0;
      valueToUse = checkboxValues.join(", ");
    } else if (selectedFilterField?.type === "number") {
      isValidFilter = filterValue.trim() !== "";
      valueToUse = filterValue.trim();
    } else {
      isValidFilter = filterValue.trim() !== "";
      valueToUse = filterValue.trim();
    }

    if (selectedFilterField && isValidFilter) {
      const existingFilterIndex = activeFilters.findIndex(
        (filter) => filter.field === selectedFilterField.field
      );

      const newFilter = {
        id: Date.now().toString(),
        field: selectedFilterField.field,
        operator: selectedOperator,
        value: valueToUse,
        label: selectedFilterField.label,
      };

      if (existingFilterIndex >= 0) {
        const updatedFilters = [...activeFilters];
        updatedFilters[existingFilterIndex] = newFilter;
        setActiveFilters(updatedFilters);
      } else {
        setActiveFilters([...activeFilters, newFilter]);
      }

      setFilterDialogOpen(false);
      setFilterValue("");
      setSelectedFilterField(null);
    }
  };

  // Apply custom filters
  let filterData = responses;
  filterData = applyFilters(filterData);

  const visibleResponses = useMemo(() => {
    return responses.filter((r) => r.folderId === activeFolderId);
  }, [responses, activeFolderId]);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const allSelected = useMemo(() => {
    if (visibleResponses.length === 0) return false;
    return visibleResponses.every((r) => selected[r.id]);
  }, [visibleResponses, selected]);

  const selectedCount = useMemo(() => {
    return visibleResponses.filter((r) => selected[r.id]).length;
  }, [visibleResponses, selected]);
  const handleRemoveImage = (id: string | number) => {
    const updatedImages = images.filter((image) => image.fileId !== id);
    setImages(updatedImages);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;
    const file = files[0];
    const formData = new FormData();
    formData.append("image", file, file.name);
    setImages((prevImages) => [...prevImages, file]);
  };
  const toggleAll = () => {
    if (allSelected) {
      const next = { ...selected };
      visibleResponses.forEach((r) => delete next[r.id]);
      setSelected(next);
    } else {
      const next = { ...selected };
      visibleResponses.forEach((r) => (next[r.id] = true));
      setSelected(next);
    }
  };

  const countsByFolder: Record<string, number> = useMemo(() => {
    const map: Record<string, number> = {};
    folders.forEach((f) => (map[f.id] = 0));
    responses.forEach((r) => (map[r.folderId] = (map[r.folderId] || 0) + 1));
    return map;
  }, [folders, responses]);
  const handleIconClick = () => {
    if (images.length > 3) {
      alert("You can upload a maximum of 4 images");
      return;
    }
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <Box
      sx={{ width: "100%", height: "calc(100vh - 96px)", overflow: "hidden" }}
    >
      {/* Toolbar */}
      <Toolbar
        sx={{
          py: 2,
          justifyContent: "space-between",
                       p: 2,
               borderBottom: "1px solid #e0e0e0",
          backgroundColor: "#fafafa",
          mb:1,
        }}
      >
        {" "}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <IconButton onClick={() => navigate("/settings/agents-productivity")}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h5" sx={{ fontWeight: 600, color: "#1a1a1a" }}>
            Canned Responses
          </Typography>
        </Box>
        <Stack direction="row" spacing={2} alignItems="center">
          {selectedCount > 0 ? (
            <>
              <Typography variant="body2" color="text.secondary">
                {selectedCount} selected
              </Typography>
              <Button size="small">Move to</Button>
              <Button size="small" color="error">
                Delete
              </Button>
            </>
          ) : (
            <Typography variant="body2" color="text.secondary">
              &nbsp;
            </Typography>
          )}
        </Stack>
        <Stack direction="row" spacing={2} alignItems="center">
          <Button
            variant="outlined"
            size="small"
            sx={{ fontWeight: 600 }}
            onClick={() => setNewFolderOpen(true)}
          >
            New Folder
          </Button>
          <Button
            variant="contained"
            size="small"
            sx={{ fontWeight: 600 }}
            onClick={() => {
              setDrawerMode("create");
              setEditingId(null);
              setFormTitle("");
              setFormFolderId(activeFolderId);
              setFormAvailability("all");
              setFormMessage("");
              setDrawerOpen(true);
            }}
          >
            New Canned Response
          </Button>
        </Stack>
      </Toolbar>

      <Stack
        direction="row"
        sx={{ minHeight: "calc(100vh - 185px)", bgcolor: "background.paper" }}
      >
        {/* Left: Folders */}
        <Paper variant="outlined" square sx={{ width: 340 }}>
          <Box sx={{ px: 3, py: 2.5 }}>
            <Typography
              variant="subtitle2"
              fontWeight={600}
              color="text.primary"
            >
              FOLDERS
            </Typography>
          </Box>
          <Divider />
          <Box
            sx={{
              height: "calc(100% - 48px)",
              overflowY: "auto",
              px: 1,
              pb: 2,
            }}
          >
            <List disablePadding>
              {folders.map((folder) => {
                const isActive = activeFolderId === folder.id;
                const count = countsByFolder[folder.id] || 0;
                return (
                  <ListItemButton
                    key={folder.id}
                    selected={isActive}
                    onClick={() => setActiveFolderId(folder.id)}
                    sx={{ borderRadius: 1, mx: 1, my: 0.5 }}
                  >
                    <ListItemIcon sx={{ minWidth: 32 }}>📁</ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography variant="body1" fontWeight={500}>
                          {folder.name}
                        </Typography>
                      }
                      secondary={
                        <Typography variant="caption" color="text.secondary">
                          {count} canned responses
                        </Typography>
                      }
                    />
                  </ListItemButton>
                );
              })}
            </List>
          </Box>
        </Paper>

        {/* Right: List */}
        <Box sx={{ flex: 1, px: 2 }}>
          {/* Search and Filters */}
          <Box
            sx={{
              display: "flex",
              gap: 2,
              mb: 3,
              alignItems: "center",
              width: "100%",
            }}
          >
            <Box
              sx={{
                backgroundColor: "#fff",
                borderRadius: 1,
                border: "1px solid #e0e0e0",

                display: "grid",
                gridTemplateColumns: "80% 20%",
                overflow: "hidden",
                width: "100%",
              }}
            >
              {/* 80% Editable Area */}
              <Box
                sx={{
                  p: 3,
                  cursor: activeFilters.length < 5 ? "pointer" : "default",
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                  borderRight: "1px solid #e0e0e0",
                  "&:hover":
                    activeFilters.length < 5
                      ? {
                          backgroundColor: "#f8f9fa",
                        }
                      : {},
                }}
                onClick={
                  activeFilters.length < 5
                    ? (event) => setFilterMenuAnchor(event.currentTarget)
                    : undefined
                }
              >
                {/* Editable Filter Input Area - Show only when no filters */}
                {activeFilters.length === 0 && (
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                      flex: 1,
                    }}
                  >
                    <IconButton
                      size="small"
                      sx={{
                        backgroundColor: "#f5f5f5",
                        color: "#666",
                        width: 32,
                        height: 32,
                        "&:hover": {
                          backgroundColor: "#e0e0e0",
                        },
                      }}
                    >
                      <AddIcon fontSize="small" />
                    </IconButton>

                    <Typography
                      variant="body1"
                      sx={{
                        color: "#999",
                        fontSize: "0.875rem",
                        fontStyle: "italic",
                        userSelect: "none",
                        flex: 1,
                      }}
                    >
                      Add a filter
                    </Typography>
                  </Box>
                )}

                {/* Applied Filters Display in Editable Area */}
                {activeFilters.length > 0 && (
                  <Stack
                    direction="row"
                    spacing={1}
                    flexWrap="wrap"
                    useFlexGap
                    sx={{ alignItems: "center" }}
                  >
                    {activeFilters.map((filter, index) => (
                      <Chip
                        key={filter.id}
                        ref={
                          index === activeFilters.length - 1
                            ? setLastChipRef
                            : null
                        }
                        label={`${filter.label}: "${filter.value}"`}
                        onDelete={(e) => {
                          e.stopPropagation();
                          removeFilter(filter.id);
                        }}
                        size="small"
                        sx={{
                          backgroundColor: "#e8e8e8",
                          color: "#333",
                          fontSize: "0.875rem",
                          fontWeight: 500,
                          "& .MuiChip-deleteIcon": {
                            color: "#666",
                            "&:hover": {
                              color: "#333",
                            },
                          },
                        }}
                      />
                    ))}

                    {/* Add filter placeholder after existing filters */}
                    {activeFilters.length < 5 && (
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          padding: "6px 12px",
                          borderRadius: "16px",
                          border: "1px dashed #d0d0d0",
                          backgroundColor: "#f9f9f9",
                          cursor: "pointer",
                          color: "#999",
                          fontSize: "0.875rem",
                          "&:hover": {
                            borderColor: "#2566b0",
                            backgroundColor: "#f5f5f5",
                            color: "#666",
                          },
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          setFilterMenuAnchor(e.currentTarget);
                        }}
                      >
                        <AddIcon fontSize="small" />
                        <Typography
                          variant="body2"
                          sx={{ fontSize: "0.875rem", fontStyle: "italic" }}
                        >
                          Add a filter
                        </Typography>
                      </Box>
                    )}
                  </Stack>
                )}
              </Box>

              {/* 20% Actions Area */}
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 1,
                  p: 2,
                  backgroundColor: "#f8f9fa",
                  borderLeft: "1px solid #e0e0e0",
                }}
              >
                {/* Action buttons row */}
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    gap: 1,
                    alignItems: "center",
                  }}
                >
                  {/* Clear all Filter button */}
                  {activeFilters.length > 0 && (
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        clearAllFilters();
                      }}
                      sx={{
                        borderColor: "#e0e0e0",
                        color: "#666",
                        textTransform: "none",
                        fontSize: "0.75rem",
                        minWidth: "auto",
                        padding: "4px 8px",
                        "&:hover": {
                          borderColor: "#d32f2f",
                          color: "#d32f2f",
                          backgroundColor: "#fff5f5",
                        },
                      }}
                    >
                      Clear all Filter
                    </Button>
                  )}

                  {/* Search icon */}
                  <IconButton
                    size="small"
                    sx={{
                      color: "#666",
                      border: "1px solid #e0e0e0",
                      "&:hover": {
                        color: "#2566b0",
                        borderColor: "#2566b0",
                        backgroundColor: "#f5f5f5",
                      },
                    }}
                  >
                    <SearchIcon fontSize="small" />
                  </IconButton>
                </Box>

                {/* Filter counter */}
                {activeFilters.length > 0 && (
                  <Typography
                    variant="body2"
                    sx={{
                      color: activeFilters.length >= 5 ? "#f57c00" : "#999",
                      fontSize: "0.7rem",
                      textAlign: "center",
                      fontStyle: "italic",
                    }}
                  >
                    {activeFilters.length >= 5
                      ? "Maximum 5 filters reached"
                      : `${activeFilters.length}/5`}
                  </Typography>
                )}
              </Box>
            </Box>
          </Box>
          <Card sx={{ flex: 1, boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
            <TableContainer
              sx={{
                height: "calc(100vh - 300px)",

                position: "relative",
              }}
              className="custom-scrollbar"
            >
              <Table stickyHeader>
                <TableHead sx={{ position: "relative" }}>
                  {/* Linear Progress Loader */}
                  {false && (
                    <LinearProgress
                      sx={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        zIndex: 1,
                        height: 4,
                        "& .MuiLinearProgress-bar": {
                          backgroundColor: "#2566b0",
                        },
                        "& .MuiLinearProgress-root": {
                          backgroundColor: "#e0e0e0",
                        },
                      }}
                    />
                  )}
                  <TableRow sx={{ bgcolor: "#f8f9fa" }}>
                    <TableCell
                      sx={{
                        fontWeight: 600,
                        fontSize: "14px",
                        color: "#1a1a1a",
                        borderBottom: "2px solid #e0e0e0",
                      }}
                    >
                      Department Name
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: 600,
                        fontSize: "14px",
                        color: "#1a1a1a",
                        borderBottom: "2px solid #e0e0e0",
                      }}
                    >
                      Type
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: 600,
                        fontSize: "14px",
                        color: "#1a1a1a",
                        borderBottom: "2px solid #e0e0e0",
                      }}
                    >
                      Manager
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: 600,
                        fontSize: "14px",
                        color: "#1a1a1a",
                        borderBottom: "2px solid #e0e0e0",
                      }}
                    >
                      Team Size
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: 600,
                        fontSize: "14px",
                        color: "#1a1a1a",
                        borderBottom: "2px solid #e0e0e0",
                      }}
                    >
                      Status
                    </TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {filterData.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} align="center" sx={{ py: 6 }}>
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            gap: 2,
                          }}
                        >
                          <Typography variant="h6" color="textSecondary">
                            No departments found
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            Create a new department to get started
                          </Typography>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filterData.map((row: any, index: number) => (
                      <TableRow
                        key={row.id || row.key || index}
                        hover
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                          "&:hover": {
                            bgcolor: "#f8f9fa",
                          },
                        }}
                      >
                        <TableCell
                          sx={{
                            fontWeight: 500,
                            fontSize: "15px",
                            color: "#1a1a1a",
                          }}
                        >
                          {row.departmentName}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={row.departmentType || "N/A"}
                            size="small"
                            sx={{
                              bgcolor: "#e3f2fd",
                              color: "#2566b0",
                              fontWeight: 500,
                              fontSize: "11px",
                            }}
                          />
                        </TableCell>
                        <TableCell
                          sx={{
                            fontSize: "14px",
                            color: "#65676b",
                          }}
                        >
                          {row.manager || "Not assigned"}
                        </TableCell>
                        <TableCell
                          sx={{
                            fontSize: "14px",
                            color: "#65676b",
                          }}
                        >
                          {row.agentCount || 0}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={
                              row.isActive === false ? "Inactive" : "Active"
                            }
                            size="small"
                            sx={{
                              bgcolor:
                                row.isActive === false ? "#ffebee" : "#e8f5e8",
                              color:
                                row.isActive === false ? "#d32f2f" : "#2e7d32",
                              fontWeight: 600,
                              fontSize: "12px",
                            }}
                          />
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        
        </Box>
      </Stack>
      <Menu
        anchorEl={
          activeFilters.length > 0 && lastChipRef
            ? lastChipRef
            : filterMenuAnchor
        }
        open={Boolean(filterMenuAnchor)}
        onClose={() => setFilterMenuAnchor(null)}
        PaperProps={{
          elevation: 3,
          sx: {
            overflow: "visible",
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
            mt: 1.5,
            minWidth: 200,
            maxHeight: 400,
            "&:before": {
              content: '""',
              display: "block",
              position: "absolute",
              top: 0,
              left: 28,
              width: 10,
              height: 10,
              bgcolor: "background.paper",
              transform: "translateY(-50%) rotate(45deg)",
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: "left", vertical: "top" }}
        anchorOrigin={{
          horizontal: activeFilters.length > 0 ? "right" : "left",
          vertical: "bottom",
        }}
      >
        {fieldOptions.map((option) => (
          <MenuItem
            key={option.value}
            onClick={(e) => {
              e.stopPropagation();
              setModelOpenref(filterMenuAnchor);
              setFilterMenuAnchor(null);
              openFilterDialog(option.value, option.label);
            }}
            disabled={activeFilters.some(
              (filter) => filter.field === option.value
            )}
            sx={{
              py: 1,
              px: 2,
              fontSize: "0.875rem",
              "&:hover": {
                backgroundColor: "#f5f5f5",
              },
              "&.Mui-disabled": {
                opacity: 0.5,
              },
            }}
          >
            <Typography variant="body2" sx={{ fontWeight: 400 }}>
              {option.label}
            </Typography>
          </MenuItem>
        ))}
      </Menu>

      {/* Filter Popover */}
      <Popover
        open={filterDialogOpen}
        anchorEl={modelOpenref}
        onClose={() => {
          setFilterDialogOpen(false);
          setModelOpenref(null);
        }}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: lastChipRef ? "right" : "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        disablePortal={false}
        PaperProps={{
          sx: {
            mt: 0.5,
            borderRadius: 1,
            boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
            width: 400,
            maxHeight: 300,
          },
        }}
      >
        <Paper elevation={0}>
          {/* Blue Header */}
          <Box
            sx={{
              backgroundColor: "#4A90E2",
              color: "#fff",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              py: 2,
              px: 3,
              fontSize: "1.1rem",
              fontWeight: 500,
            }}
          >
            <Typography
              variant="h6"
              sx={{ fontWeight: 500, fontSize: "1.1rem" }}
            >
              {selectedFilterField?.label || "Filter"}
            </Typography>
            <IconButton
              onClick={() => {
                setFilterDialogOpen(false);
                setModelOpenref(null);
              }}
              sx={{
                color: "#fff",
                padding: "4px",
                "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.1)" },
              }}
            >
              <Close fontSize="small" />
            </IconButton>
          </Box>

          {/* Content */}
          <Box sx={{ p: 2 }}>
            <Typography
              variant="body2"
              sx={{
                color: "#4A90E2",
                mb: 2,
                fontWeight: 500,
                fontSize: "0.875rem",
              }}
            >
              {selectedFilterField?.label} -{" "}
              {
                operatorOptions.find((op) => op.value === selectedOperator)
                  ?.label
              }
            </Typography>

            {/* Dynamic Input Field */}
            {selectedFilterField?.type === "multiCheckbox" ? (
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                {selectedFilterField.options?.map((option) => (
                  <FormControlLabel
                    key={option}
                    control={
                      <Checkbox
                        checked={checkboxValues.includes(option)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setCheckboxValues([...checkboxValues, option]);
                          } else {
                            setCheckboxValues(
                              checkboxValues.filter((v) => v !== option)
                            );
                          }
                        }}
                        size="small"
                        sx={{
                          color: "#4A90E2",
                          "&.Mui-checked": {
                            color: "#4A90E2",
                          },
                        }}
                      />
                    }
                    label={
                      <Typography sx={{ fontSize: "0.875rem" }}>
                        {option}
                      </Typography>
                    }
                  />
                ))}
              </Box>
            ) : (
              <TextField
                fullWidth
                variant="standard"
                placeholder={
                  selectedFilterField?.field === "departmentName"
                    ? "Enter department name..."
                    : selectedFilterField?.field === "manager"
                    ? "Enter manager name..."
                    : selectedFilterField?.field === "agentCount"
                    ? "Enter number..."
                    : "Enter value..."
                }
                value={filterValue}
                onChange={(e) => setFilterValue(e.target.value)}
                autoFocus
                sx={{
                  "& .MuiInput-root": {
                    fontSize: "0.875rem",
                    "&:before": {
                      borderBottomColor: "#e0e0e0",
                    },
                    "&:hover:before": {
                      borderBottomColor: "#4A90E2",
                    },
                    "&:after": {
                      borderBottomColor: "#4A90E2",
                    },
                  },
                }}
              />
            )}
          </Box>

          <Divider sx={{ mx: 3 }} />

          {/* Actions */}
          <Box sx={{ p: 3, display: "flex", justifyContent: "flex-end" }}>
            <Button
              onClick={applyFilter}
              variant="text"
              disabled={!filterValue.trim() && checkboxValues.length === 0}
              sx={{
                color: "#4A90E2",
                fontWeight: 400,
                textTransform: "uppercase",
                fontSize: "0.875rem",
                px: 2,
                py: 1,
                "&:hover": {
                  backgroundColor: "rgba(74, 144, 226, 0.04)",
                },
                "&.Mui-disabled": {
                  color: "#cccccc",
                },
              }}
            >
              Apply
            </Button>
          </Box>
        </Paper>
      </Popover>
      <CustomSideBarPanel
        open={drawerOpen}
        close={() => setDrawerOpen(false)}
        title={
          drawerMode === "create"
            ? "New Canned Response"
            : "Edit Canned Response"
        }
        width={720}
      >
        <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
          <Box
            sx={{ p: 3, flex: 1, overflowY: "auto" }}
            className="custom-scrollbar"
          >
            <Box sx={{ pb: 2 }}>
              <TextField
                fullWidth
                size="small"
                label="Response title"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
              />
              <Stack spacing={1} sx={{ mt: 2 }}>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  Message
                </Typography>
                <Box
                  sx={{
                    bgcolor: "background.paper",
                  }}
                >
                  <StackEditor
                    initialContent={formMessage}
                    onChange={setFormMessage}
                    isFull={false}
                    onFocus={() => {}}
                    customHeight="300px"
                  />
                </Box>

                <div className="flex items-center  gap-2">
                  <div className="flex items-center gap-1">
                    <input
                      type="file"
                      accept="image/*"
                      ref={fileInputRef}
                      style={{ display: "none" }}
                      onChange={handleFileChange}
                    />
                    {/* {attachedLoading ? (
                      <CircularProgress size={16} />
                    ) : ( */}
                    <Tooltip
                      title={"Attach file < 10MB"}
                      placement={"top-start"}
                    >
                      <IconButton size="small" onClick={handleIconClick}>
                        <AttachFileIcon
                          fontSize="small"
                          sx={{ transform: "rotate(45deg)" }}
                        />
                      </IconButton>
                    </Tooltip>
                  </div>

                  {images?.length > 0 && (
                    <CustomToolTip
                      title={
                        <ImageViewComponent
                          images={images}
                          handleRemove={(id: any) => handleRemoveImage(id)}
                          // ticketId={header?.ticketId}
                        />
                      }
                      open={showImagesModal}
                      close={() => setShowImagesModal(false)}
                      placement={"top"}
                      width={400}
                    >
                      <span
                        className="bg-[#1a73e8] w-6 text-sm rounded-full h-6 flex items-center justify-center text-white cursor-pointer"
                        onClick={() => setShowImagesModal(true)}
                      >
                        {images.length}
                      </span>
                    </CustomToolTip>
                  )}
                </div>
              </Stack>
              <FormControl fullWidth size="small" sx={{ mt: 2 }}>
                <InputLabel>Folder</InputLabel>
                <Select
                  label="Folder"
                  size="small"
                  value={formFolderId}
                  onChange={(e) => setFormFolderId(e.target.value as string)}
                >
                  {folders.map((f) => (
                    <MenuItem key={f.id} value={f.id}>
                      {f.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Stack sx={{ mt: 2 }}>
                <Typography variant="body2" sx={{ mb: 0.5 }}>
                  Available for
                </Typography>
                <RadioGroup
                  row
                  value={formAvailability}
                  onChange={(e) => setFormAvailability(e.target.value as any)}
                >
                  <FormControlLabel
                    value="myself"
                    control={<Radio size="small" />}
                    label="Myself"
                  />
                  <FormControlLabel
                    value="all"
                    control={<Radio size="small" />}
                    label="All agents"
                  />
                </RadioGroup>
              </Stack>
            </Box>
          </Box>
          <Box
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
            <Box sx={{ display: "flex", gap: 1 }}>
              <Button
                onClick={() => setDrawerOpen(false)}
                variant="text"
                sx={{ minWidth: 80, fontWeight: 600 }}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                sx={{ minWidth: 120, fontWeight: 600 }}
              >
                {drawerMode === "create" ? "Create" : "Save"}
              </Button>
            </Box>
          </Box>
        </Box>
      </CustomSideBarPanel>

      {/* New Folder Dialog */}
      <Dialog open={newFolderOpen} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ display: "flex", alignItems: "center" }}>
          <Typography variant="h6" sx={{ flex: 1, fontWeight: 700 }}>
            New Folder
          </Typography>
          <IconButton onClick={() => setNewFolderOpen(false)} size="small">
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 1, fontWeight: 600 }}>
            Folder name <span style={{ color: "#d32f2f" }}>*</span>
          </Typography>
          <TextField
            fullWidth
            placeholder="Enter Folder name"
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
            size="small"
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2, bgcolor: "#f3f4f6" }}>
          <Button onClick={() => setNewFolderOpen(false)} variant="text">
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              if (!newFolderName.trim()) return;
              setNewFolderOpen(false);
              setNewFolderName("");
            }}
            disabled={!newFolderName.trim()}
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CanenResponseMasterPage;
