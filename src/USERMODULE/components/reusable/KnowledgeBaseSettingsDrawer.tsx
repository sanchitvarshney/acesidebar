import React, { useState } from "react";
import {
    Drawer,
    Box,
    Typography,
    IconButton,
    Button,
    Switch,
    FormControlLabel,
    Alert,
    Tooltip,
} from "@mui/material";
import {
    Close as CloseIcon,
    Info as InfoIcon,
} from "@mui/icons-material";
import CustomAlert from "../../../components/reusable/CustomAlert";
import MenuBookIcon from '@mui/icons-material/MenuBook';

interface KnowledgeBaseSettingsDrawerProps {
    open: boolean;
    onClose: () => void;
    onSave?: (settings: any) => void;
}

const KnowledgeBaseSettingsDrawer: React.FC<KnowledgeBaseSettingsDrawerProps> = ({
    open,
    onClose,
    onSave,
}) => {
    const [settings, setSettings] = useState({
        enableKnowledgeBase: true,
        requireClientLogin: false,
        enableCannedResponses: true,
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
                    <div className="flex items-center gap-2">
                        <MenuBookIcon />
                    <Typography variant="h6" sx={{ fontWeight: 600, color: "#1a1a1a" }}>
                        Knowledge Base Settings
                    </Typography>
                    </div>
                    <IconButton onClick={handleClose} size="small">
                        <CloseIcon />
                    </IconButton>
                </Box>

                {/* Content */}
                <Box sx={{ flex: 1, overflowY: "auto", overflowX: "hidden", p: 3 }}>
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                        {/* Knowledge Base Status */}
                        <Box>
                            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                                Status:
                            </Typography>

                            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                    <FormControlLabel
                                        control={
                                            <Switch
                                                checked={settings.enableKnowledgeBase}
                                                onChange={(e) =>
                                                    setSettings(prev => ({ ...prev, enableKnowledgeBase: e.target.checked }))
                                                }
                                            />
                                        }
                                        label="Enable Knowledge Base"
                                        sx={{ alignItems: "flex-start" }}
                                    />
                                    <Tooltip title="Enable or disable the knowledge base functionality">
                                        <IconButton size="small" sx={{ color: "#999" }}>
                                            <InfoIcon />
                                        </IconButton>
                                    </Tooltip>
                                </Box>

                                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                    <FormControlLabel
                                        control={
                                            <Switch
                                                checked={settings.requireClientLogin}
                                                onChange={(e) =>
                                                    setSettings(prev => ({ ...prev, requireClientLogin: e.target.checked }))
                                                }
                                            />
                                        }
                                        label="Require Client Login"
                                        sx={{ alignItems: "flex-start" }}
                                    />
                                    <Tooltip title="Require clients to login before accessing knowledge base">
                                        <IconButton size="small" sx={{ color: "#999" }}>
                                            <InfoIcon />
                                        </IconButton>
                                    </Tooltip>
                                </Box>
                            </Box>
                            
                        </Box>

                        {/* Canned Responses */}
                        <Box>
                            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                                Canned Responses:
                            </Typography>

                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={settings.enableCannedResponses}
                                            onChange={(e) =>
                                                setSettings(prev => ({ ...prev, enableCannedResponses: e.target.checked }))
                                            }
                                        />
                                    }
                                    label="Enable Canned Responses"
                                    sx={{ alignItems: "flex-start" }}
                                />
                                <Tooltip title="Enable predefined responses for common queries">
                                    <IconButton size="small" sx={{ color: "#999" }}>
                                        <InfoIcon />
                                    </IconButton>
                                </Tooltip>
                            </Box>
                        </Box>
                    </Box>
                </Box>
              <div className="p-3">
                  <CustomAlert
                        title="Disabling knowledge base disables clients' interface."
                    />
              </div>

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

export default KnowledgeBaseSettingsDrawer;
