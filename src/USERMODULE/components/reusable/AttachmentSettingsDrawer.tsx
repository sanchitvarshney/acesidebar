import React, { useState } from "react";
import {
    Drawer,
    Box,
    Typography,
    IconButton,
    Button,
    Switch,
    FormControlLabel,
    TextField,
    Select,
    MenuItem,
    FormControl,
    Divider,
} from "@mui/material";
import {
    Close as CloseIcon,
    Edit as EditIcon,
    Info as InfoIcon,
} from "@mui/icons-material";

interface AttachmentSettingsDrawerProps {
    open: boolean;
    onClose: () => void;
    onSave?: (settings: any) => void;
}

const AttachmentSettingsDrawer: React.FC<AttachmentSettingsDrawerProps> = ({
    open,
    onClose,
    onSave,
}) => {
    const [settings, setSettings] = useState({
        enableAttachments: true,
        maxFileSize: "small",
        restrictFileType: "No restrictions",
        additionalFileTypes: "",
        strictMimeTypeCheck: false,
        maxFiles: "No limit",
        helpText: "Details on the reason(s) for creating the task.",
    });

    const handleClose = () => {
        onClose();
    };

    const handleSave = () => {
        if (onSave) {
            onSave(settings);
        }
        onClose();
    };

    return (
        <Drawer
            anchor="right"
            open={open}
            onClose={handleClose}
            sx={{
                "& .MuiDrawer-paper": {
                    width: { xs: "100%", sm: "50%" },
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
                        Task Attachment Settings
                    </Typography>
                    <IconButton onClick={handleClose} size="small">
                        <CloseIcon />
                    </IconButton>
                </Box>

                {/* Content */}
                <Box sx={{ flex: 1, overflowY: "auto", overflowX: "hidden", p: 3 }}>
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                        {/* Enable Attachments */}
                        <Box>
                            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                                Enable Attachments:
                            </Typography>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={settings.enableAttachments}
                                        onChange={(e) =>
                                            setSettings(prev => ({ ...prev, enableAttachments: e.target.checked }))
                                        }
                                    />
                                }
                                label="Enables attachments, regardless of channel"
                                sx={{ alignItems: "flex-start" }}
                            />
                        </Box>

                        <Divider />

                        {/* Maximum File Size */}
                        <Box>
                            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                                Maximum File Size:
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                Choose maximum size of a single file uploaded to this field
                            </Typography>
                            <FormControl size="small" sx={{ width: 200 }}>
                                <Select
                                    value={settings.maxFileSize}
                                    onChange={(e) =>
                                        setSettings(prev => ({ ...prev, maxFileSize: e.target.value }))
                                    }
                                >
                                    <MenuItem value="small">Small</MenuItem>
                                    <MenuItem value="medium">Medium</MenuItem>
                                    <MenuItem value="large">Large</MenuItem>
                                    <MenuItem value="custom">Custom</MenuItem>
                                </Select>
                            </FormControl>
                        </Box>

                        {/* Restrict by File Type */}
                        <Box>
                            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                                Restrict by File Type:
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                Optionally, choose acceptable file types.
                            </Typography>
                            <TextField
                                size="small"
                                value={settings.restrictFileType}
                                onChange={(e) =>
                                    setSettings(prev => ({ ...prev, restrictFileType: e.target.value }))
                                }
                                sx={{ width: "100%", maxWidth: 400 }}
                            />
                        </Box>

                        {/* Additional File Type Filters */}
                        <Box>
                            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                                Additional File Type Filters:
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                Optionally, enter comma-separated list of additional file types, by extension. (e.g. .doc, .pdf).
                            </Typography>
                            <TextField
                                multiline
                                rows={3}
                                size="small"
                                value={settings.additionalFileTypes}
                                onChange={(e) =>
                                    setSettings(prev => ({ ...prev, additionalFileTypes: e.target.value }))
                                }
                                placeholder="Enter file extensions separated by commas..."
                                sx={{ width: "100%" }}
                            />
                        </Box>

                        {/* Strict Mime Type Check */}
                        <Box>
                            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                                Strict Mime Type Check:
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                File Mime Type associations is OS dependent
                            </Typography>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={settings.strictMimeTypeCheck}
                                        onChange={(e) =>
                                            setSettings(prev => ({ ...prev, strictMimeTypeCheck: e.target.checked }))
                                        }
                                    />
                                }
                                label="Enable strict Mime Type check"
                                sx={{ alignItems: "flex-start" }}
                            />
                        </Box>

                        {/* Maximum Files */}
                        <Box>
                            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                                Maximum Files:
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                Users cannot upload more than this many files.
                            </Typography>
                            <TextField
                                size="small"
                                value={settings.maxFiles}
                                onChange={(e) =>
                                    setSettings(prev => ({ ...prev, maxFiles: e.target.value }))
                                }
                                sx={{ width: 200 }}
                            />
                        </Box>

                        {/* Help Text */}
                        <Box>
                            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                                Help Text:
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                Help text shown with the field
                            </Typography>
                            <TextField
                                multiline
                                rows={4}
                                size="small"
                                value={settings.helpText}
                                onChange={(e) =>
                                    setSettings(prev => ({ ...prev, helpText: e.target.value }))
                                }
                                sx={{ width: "100%" }}
                            />
                        </Box>
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
                        Save Settings
                    </Button>
                </Box>
            </Box>
        </Drawer>
    );
};

export default AttachmentSettingsDrawer;
