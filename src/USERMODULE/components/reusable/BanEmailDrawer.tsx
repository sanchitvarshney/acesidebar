import React, { useState, useEffect } from "react";
import {
    Drawer,
    Box,
    Typography,
    TextField,
    Button,
    IconButton,
    CircularProgress,
} from "@mui/material";
import ControlPointDuplicateIcon from '@mui/icons-material/ControlPointDuplicate';
import CloseIcon from "@mui/icons-material/Close";
import EmailIcon from "@mui/icons-material/Email";
import NotesIcon from "@mui/icons-material/Notes";
import { useAddBanEmailMutation } from "../../../services/settingServices";
import { useToast } from "../../../hooks/useToast";

interface BanEmailDrawerProps {
    open: boolean;
    onClose: () => void;
    onSuccess?: () => void;
    editData?: any;
}

const BanEmailDrawer: React.FC<BanEmailDrawerProps> = ({
    open,
    onClose,
    onSuccess,
    editData,
}) => {
    const { showToast } = useToast();
    const [formData, setFormData] = useState({
        emailAddress: "",
        internalNotes: "",
    });
    const [errors, setErrors] = useState<any>({});
    const [addBanEmail, { isLoading: isSubmitting }] = useAddBanEmailMutation();

    const validateEmail = (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleInputChange = (field: keyof typeof formData, value: string) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));

        // Clear error when user starts typing
        if (errors[field]) {
            setErrors((prev: any) => ({
                ...prev,
                [field]: undefined,
            }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const newErrors: any = {};
        if (!formData.emailAddress.trim()) {
            newErrors.emailAddress = "Email address is required";
        } else if (!validateEmail(formData.emailAddress)) {
            newErrors.emailAddress = "Valid email address is required";
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setErrors({});

        try {
            const payload = {
                email: formData.emailAddress,
                notes: formData.internalNotes,
            };
            const res = await addBanEmail(payload).unwrap();
            if (res?.type === "error") {
                showToast(res?.message, "error");
                return;
            }
            if (res?.type === "success") {
                showToast(res?.message, "success");
                handleReset();
                onSuccess?.();
                onClose();
            }
        } catch (error: any) {
            showToast("Failed to add banned email", "error");
        }
    };

    const handleReset = () => {
        setFormData({
            emailAddress: "",
            internalNotes: "",
        });
        setErrors({});
    };

    const handleClose = () => {
        handleReset();
        onClose();
    };

    useEffect(() => {
        if (editData) {
            setFormData({
                emailAddress: editData.email || "",
                internalNotes: editData.internalNotes || "",
            });
        }
    }, [editData]);

    return (
        <Drawer
            anchor="right"
            open={open}
            onClose={handleClose}
            sx={{
                "& .MuiDrawer-paper": {
                    width: { xs: "100%", sm: "35%" },
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
                        backgroundColor: "#fafafa",
                        overflowX: "hidden",
                    }}
                >
                    <IconButton size="small">
                        <ControlPointDuplicateIcon />
                    </IconButton>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: "#1a1a1a", flex: 1, mr: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        Email to Ban
                    </Typography>
                    <IconButton onClick={handleClose} size="small">
                        <CloseIcon />
                    </IconButton>
                </Box>

                {/* Form Content */}
                <Box sx={{ flex: 1, overflowY: "auto", overflowX: "hidden", p: 2 }}>
                    <form onSubmit={handleSubmit}>
                        {/* Error Message */}
                        {errors.emailAddress && (
                            <Typography
                                variant="body2"
                                sx={{
                                    color: "error.main",
                                    fontStyle: "italic",
                                    mb: 2,
                                }}
                            >
                                {errors.emailAddress}
                            </Typography>
                        )}

                        {/* Email Address Section */}
                        <Box sx={{ mb: 3 }}>
                            <Typography
                                variant="subtitle2"
                                sx={{
                                    fontWeight: 600,
                                    color: "#374151",
                                    mb: 1,
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 1,
                                }}
                            >
                                <EmailIcon sx={{ fontSize: 20, color: "#6b7280" }} />
                                Email Address
                                <Typography
                                    component="span"
                                    sx={{ color: "error.main", ml: 0.5 }}
                                >
                                    *
                                </Typography>
                            </Typography>
                            <TextField
                                fullWidth
                                placeholder="Enter email address to ban"
                                value={formData.emailAddress}
                                onChange={(e) =>
                                    handleInputChange("emailAddress", e.target.value)
                                }
                                variant="outlined"
                                size="small"
                                required
                                error={!!errors.emailAddress}
                                helperText={errors.emailAddress}
                                sx={{
                                    width: "100%",
                                    "& .MuiOutlinedInput-root": {
                                        "& fieldset": {
                                            borderColor: "#d1d5db",
                                        },
                                        "&:hover fieldset": {
                                            borderColor: "#9ca3af",
                                        },
                                        "&.Mui-focused fieldset": {
                                            borderColor: "#2566b0",
                                        },
                                    },
                                }}
                            />
                        </Box>

                        {/* Internal Notes Section */}
                        <Box sx={{ mb: 3 }}>
                            <Typography
                                variant="subtitle2"
                                sx={{
                                    fontWeight: 600,
                                    color: "#374151",
                                    mb: 1,
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 1,
                                }}
                            >
                                <NotesIcon sx={{ fontSize: 20, color: "#6b7280" }} />
                                Internal Notes
                                <Typography variant="caption" sx={{ color: "#6b7280", ml: 1 }}>
                                    (Admin Notes)
                                </Typography>
                            </Typography>
                            <TextField
                                fullWidth
                                placeholder="Add internal notes about this ban..."
                                value={formData.internalNotes}
                                onChange={(e) =>
                                    handleInputChange("internalNotes", e.target.value)
                                }
                                variant="outlined"
                                multiline
                                rows={6}
                                size="small"
                                sx={{
                                    width: "100%",
                                    "& .MuiOutlinedInput-root": {
                                        "& fieldset": {
                                            borderColor: "#d1d5db",
                                        },
                                        "&:hover fieldset": {
                                            borderColor: "#9ca3af",
                                        },
                                        "&.Mui-focused fieldset": {
                                            borderColor: "#2566b0",
                                        },
                                    },
                                }}
                            />
                        </Box>
                    </form>
                </Box>

                {/* Action Buttons */}
                <Box
                    sx={{
                        borderTop: "1px solid #e0e0e0",
                        p: 2,
                        backgroundColor: "#fafafa",
                        display: "flex",
                        gap: 2,
                        justifyContent: "center",
                        overflowX: "hidden",
                    }}
                >
                    <Button
                        variant="outlined"
                        onClick={handleClose}
                        disabled={isSubmitting}
                        sx={{ minWidth: 100, fontWeight: 600 }}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        sx={{ minWidth: 100, fontWeight: 600 }}
                    >
                        {isSubmitting ? (
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                <CircularProgress size={16} />
                                Adding...
                            </Box>
                        ) : (
                            "Add"
                        )}
                    </Button>
                </Box>
            </Box>
        </Drawer>
    );
};

export default BanEmailDrawer;
