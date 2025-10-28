import React, { useState } from "react";
import {
    Drawer,
    Box,
    Typography,
    IconButton,
    Button,
    TextField,
    Checkbox,
    FormControlLabel,
    Divider,
    Autocomplete,
    Chip,
} from "@mui/material";
import {
    Close as CloseIcon,
    Add as AddIcon,
    CheckBox as CheckBoxIcon,
    CheckBoxOutlineBlank as CheckBoxOutlineBlankIcon,
    KeyboardArrowDown as KeyboardArrowDownIcon,
} from "@mui/icons-material";

interface AddFilterDrawerProps {
    open: boolean;
    onClose: () => void;
    onSave?: (filterData: any) => void;
}

const AddFilterDrawer: React.FC<AddFilterDrawerProps> = ({
    open,
    onClose,
    onSave,
}) => {
    const [filterName, setFilterName] = useState("");
    const [selectedStatuses, setSelectedStatuses] = useState<string[]>([
        "Answered", "Calling", "Chatting", "New", "Open", "Resolved", "Postponed", "Closed"
    ]);
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [selectedSources, setSelectedSources] = useState<string[]>([
        "Email", "Chat button", "Contact form", "Invitation", "Call", "Call widget",
        "Facebook", "Facebook message", "Forum", "X", "Suggestion", "Instagram",
        "Instagram mention", "Viber", "WhatsApp"
    ]);

    const statusOptions = [
        "Answered", "Calling", "Chatting", "Spam", "Deleted", "New", "Open",
        "Resolved", "Postponed", "Closed"
    ];

    const sourceOptions = [
        "Email", "Chat button", "Contact form", "Invitation", "Call", "Call widget",
        "Facebook", "Facebook message", "Forum", "X", "Suggestion", "Instagram",
        "Instagram mention", "Viber", "WhatsApp"
    ];

    const handleClose = () => {
        onClose();
    };

    const handleSave = () => {
        if (onSave) {
            onSave({
                name: filterName,
                statuses: selectedStatuses,
                tags: selectedTags,
                sources: selectedSources,
            });
        }
        onClose();
    };

    const handleSelectAllStatuses = () => {
        setSelectedStatuses(statusOptions);
    };

    const handleDeselectAllStatuses = () => {
        setSelectedStatuses([]);
    };

    const handleSelectAllSources = () => {
        setSelectedSources(sourceOptions);
    };

    const handleDeselectAllSources = () => {
        setSelectedSources([]);
    };

    const handleStatusChange = (status: string, checked: boolean) => {
        if (checked) {
            setSelectedStatuses(prev => [...prev, status]);
        } else {
            setSelectedStatuses(prev => prev.filter(s => s !== status));
        }
    };

    const handleSourceChange = (source: string, checked: boolean) => {
        if (checked) {
            setSelectedSources(prev => [...prev, source]);
        } else {
            setSelectedSources(prev => prev.filter(s => s !== source));
        }
    };

    return (
        <Drawer
            anchor="right"
            open={open}
            onClose={handleClose}
            sx={{
                "& .MuiDrawer-paper": {
                    width: { xs: "100%", sm: "60%" },
                    maxWidth: "100vw",
                    overflowX: "hidden",
                },
            }}
        >
            <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
                {/* Header */}
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        p: 2,
                        borderBottom: "1px solid #e0e0e0",
                        backgroundColor: "#f8f9fa",
                    }}
                >
                    <Typography variant="h6" sx={{ fontWeight: 600, color: "#1a1a1a" }}>
                        Add New Filter
                    </Typography>
                    <IconButton onClick={handleClose} size="small">
                        <CloseIcon />
                    </IconButton>
                </Box>

                {/* Content */}
                <Box sx={{ flex: 1, overflowY: "auto", overflowX: "hidden", p: 3 }}>
                    {/* Filter Name */}
                    <Box sx={{ mb: 3 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600, color: "#ff9800", mb: 1 }}>
                            Filter name
                        </Typography>
                        <TextField
                            fullWidth
                            placeholder="Name your filter"
                            value={filterName}
                            onChange={(e) => setFilterName(e.target.value)}
                            sx={{
                                "& .MuiOutlinedInput-root": {
                                    borderColor: "#ffb74d",
                                    "&:hover .MuiOutlinedInput-notchedOutline": {
                                        borderColor: "#ff9800",
                                    },
                                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                        borderColor: "#ff9800",
                                    },
                                },
                            }}
                        />
                    </Box>

                    {/* Filter Criteria Card */}
                    <Box sx={{ 
                        backgroundColor: "white", 
                        borderRadius: 2, 
                        p: 3, 
                        border: "1px solid #e0e0e0",
                        boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
                    }}>
                        {/* Status Section */}
                        <Box sx={{ mb: 3 }}>
                            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
                                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                    Status
                                </Typography>
                                <Box sx={{ display: "flex", gap: 1 }}>
                                    <IconButton size="small" onClick={handleSelectAllStatuses}>
                                        <CheckBoxIcon sx={{ fontSize: 20, color: "#4caf50" }} />
                                    </IconButton>
                                    <IconButton size="small" onClick={handleDeselectAllStatuses}>
                                        <CheckBoxOutlineBlankIcon sx={{ fontSize: 20, color: "#999" }} />
                                    </IconButton>
                                </Box>
                            </Box>
                            
                            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                                {statusOptions.map((status) => (
                                    <FormControlLabel
                                        key={status}
                                        control={
                                            <Checkbox
                                                checked={selectedStatuses.includes(status)}
                                                onChange={(e) => handleStatusChange(status, e.target.checked)}
                                                size="small"
                                            />
                                        }
                                        label={status}
                                        sx={{ minWidth: "120px" }}
                                    />
                                ))}
                            </Box>
                        </Box>

                        <Divider sx={{ my: 2 }} />

                        {/* Tags Section */}
                        <Box sx={{ mb: 3 }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                                Tags
                            </Typography>
                            
                            <Box sx={{ mb: 2 }}>
                                <Autocomplete
                                    multiple
                                    freeSolo
                                    options={[]}
                                    value={selectedTags}
                                    onChange={(event, newValue) => setSelectedTags(newValue)}
                                    renderTags={(value, getTagProps) =>
                                        value.map((option, index) => (
                                            <Chip
                                                variant="outlined"
                                                label={option}
                                                {...getTagProps({ index })}
                                                key={option}
                                            />
                                        ))
                                    }
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            placeholder="contains"
                                            size="small"
                                            sx={{ width: 300 }}
                                        />
                                    )}
                                />
                            </Box>
                            
                            <Button
                                variant="outlined"
                                startIcon={<AddIcon />}
                                endIcon={<KeyboardArrowDownIcon />}
                                size="small"
                                sx={{
                                    borderColor: "#d0d0d0",
                                    color: "#333",
                                    "&:hover": {
                                        borderColor: "#b0b0b0",
                                        backgroundColor: "#f5f5f5",
                                    }
                                }}
                            >
                                Add tag
                            </Button>
                        </Box>

                        <Divider sx={{ my: 2 }} />

                        {/* Source Section */}
                        <Box sx={{ mb: 3 }}>
                            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
                                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                    Source
                                </Typography>
                                <Box sx={{ display: "flex", gap: 1 }}>
                                    <IconButton size="small" onClick={handleSelectAllSources}>
                                        <CheckBoxIcon sx={{ fontSize: 20, color: "#4caf50" }} />
                                    </IconButton>
                                    <IconButton size="small" onClick={handleDeselectAllSources}>
                                        <CheckBoxOutlineBlankIcon sx={{ fontSize: 20, color: "#999" }} />
                                    </IconButton>
                                </Box>
                            </Box>
                            
                            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                                {sourceOptions.map((source) => (
                                    <FormControlLabel
                                        key={source}
                                        control={
                                            <Checkbox
                                                checked={selectedSources.includes(source)}
                                                onChange={(e) => handleSourceChange(source, e.target.checked)}
                                                size="small"
                                            />
                                        }
                                        label={source}
                                        sx={{ minWidth: "140px" }}
                                    />
                                ))}
                            </Box>
                        </Box>

                        <Divider sx={{ my: 2 }} />

                        {/* Add Search Condition */}
                        <Button
                            variant="outlined"
                            startIcon={<AddIcon />}
                            endIcon={<KeyboardArrowDownIcon />}
                            size="small"
                            sx={{
                                borderColor: "#d0d0d0",
                                color: "#333",
                                "&:hover": {
                                    borderColor: "#b0b0b0",
                                    backgroundColor: "#f5f5f5",
                                }
                            }}
                        >
                            Add search condition
                        </Button>
                    </Box>
                </Box>

                {/* Footer */}
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        gap: 2,
                        p: 2,
                        borderTop: "1px solid #e0e0e0",
                        backgroundColor: "#f8f9fa",
                    }}
                >
                    <Button variant="outlined" onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button variant="contained" onClick={handleSave}>
                        Save Filter
                    </Button>
                </Box>
            </Box>
        </Drawer>
    );
};

export default AddFilterDrawer;
