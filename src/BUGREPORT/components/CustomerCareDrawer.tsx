import React, { useState, useRef, useEffect } from "react";
import {
    Drawer,
    Box,
    Typography,
    TextField,
    Button,
    IconButton,
    Checkbox,
    FormControlLabel,
    Divider,
    Alert,
    Chip,
    Paper,
    Collapse,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SendIcon from "@mui/icons-material/Send";
import BugReportIcon from "@mui/icons-material/BugReport";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ErrorIcon from "@mui/icons-material/Error";
import BackHandIcon from "@mui/icons-material/BackHand";
import { motion } from "framer-motion";
import { ToastCreateContext } from "../../contextApi/ToastContext";
import { useContext } from "react";
import { CustomerCareDrawerProps, BugReportPayload } from "../types";
import { submitErrorReport } from "../services/submitErrorReport";

/**
 * CustomerCareDrawer Component
 * 
 * A right-side drawer that opens when "Contact Customer Care" is clicked.
 * Features:
 * - Auto-focus on textarea when opened
 * - 500 character limit with real-time validation
 * - Invalid character detection and error messaging
 * - Email opt-in required for submission
 * - Collapsible error information section
 * - Success toaster on submission
 * - Error dialog for submission failures
 * - Complete error payload in submission
 */
const CustomerCareDrawer: React.FC<CustomerCareDrawerProps> = ({
    open,
    onClose,
    errorMessage,
    errorReport,
    originalError,
}) => {
    const [feedback, setFeedback] = useState("");
    const [includeScreenshot, setIncludeScreenshot] = useState(false);
    const [emailOptIn, setEmailOptIn] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showErrorDialog, setShowErrorDialog] = useState(false);
    const [dialogErrorMessage, setDialogErrorMessage] = useState("");
    const [charCount, setCharCount] = useState(0);
    const [hasInvalidChars, setHasInvalidChars] = useState(false);
    const textareaRef = useRef<HTMLDivElement>(null);
    const toastContext = useContext(ToastCreateContext);
    const showToast = toastContext?.showToast;

    // Debug logging
    React.useEffect(() => {
        if (open) {
            console.log("CustomerCareDrawer opened with data:", {
                errorMessage,
                errorReport,
                originalError
            });
        }
    }, [open, errorMessage, errorReport, originalError]);

    // Auto-focus textarea when drawer opens
    useEffect(() => {
        if (open && textareaRef.current) {
            // Small delay to ensure drawer is fully rendered
            setTimeout(() => {
                const textarea = textareaRef.current?.querySelector('textarea');
                if (textarea) {
                    textarea.focus();
                }
            }, 100);
        }
    }, [open]);

    // Check for invalid characters
    const checkInvalidChars = (text: string) => {
        const invalidChars = /[",.@#'\[\]{}|/\\!&*%();]/g;
        return invalidChars.test(text);
    };

    // Update character count and invalid chars when feedback changes
    useEffect(() => {
        setCharCount(feedback.length);
        setHasInvalidChars(checkInvalidChars(feedback));
    }, [feedback]);

    const handleSubmit = async () => {
        if (hasInvalidChars || !emailOptIn) {
            return;
        }

        setIsSubmitting(true);

        // Prepare the complete error payload
        const errorPayload: BugReportPayload = {
            feedback: feedback.trim(),
            errorDetails: {
                message: errorMessage,
                report: errorReport,
                originalError: originalError,
                userAgent: navigator.userAgent,
                url: window.location.href,
                timestamp: new Date().toISOString(),
            },
            preferences: {
                emailOptIn,
            },
        };

        try {
            // Submit error report to API
            console.log("Submitting error report with payload:", errorPayload);
            
            const result = await submitErrorReport(
                errorPayload,
                errorReport.reqId,
                errorReport.errorId
            );

            console.log("Error report submitted successfully:", result);

            // Show success toaster and close drawer
            showToast?.("Your feedback has been submitted successfully. Our team will review it and get back to you soon.", "success");
            
            // Close drawer and reset form
            onClose();
            setFeedback("");
            setIncludeScreenshot(false);
            setEmailOptIn(false);
        } catch (error) {
            console.error("Failed to submit feedback:", error);
            setDialogErrorMessage("Failed to submit feedback. Please try again.");
            setShowErrorDialog(true);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        if (!isSubmitting) {
            onClose();
            setFeedback("");
            setIncludeScreenshot(false);
            setEmailOptIn(false);
        }
    };

    return (
        <>
            <Drawer
                anchor="right"
                open={open}
                onClose={(event, reason) => {
                    // Prevent closing on backdrop click or ESC key
                    if (reason === 'backdropClick' || reason === 'escapeKeyDown') {
                        return;
                    }
                    handleClose();
                }}
                disableEscapeKeyDown
                sx={{
                    "& .MuiDrawer-paper": {
                        width: { xs: "100%", sm: "60%", md: "50%" },
                        maxWidth: "600px",
                        boxShadow: "-4px 0 20px rgba(0, 0, 0, 0.15)",
                    },
                }}
                BackdropProps={{
                    sx: {
                        backgroundColor: "rgba(0, 0, 0, 0.4)",
                    },
                }}
            >
                <Box
                    sx={{
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        backgroundColor: "#fafafa",
                    }}
                >
                    {/* Header */}
                    <Box
                        sx={{
                            p: 2,
                            backgroundColor: "#fff3e0",
                            borderBottom: "1px solid #e0e0e0",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                        }}
                    >
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                            <BugReportIcon sx={{ color: "#e65100", fontSize: 24 }} />
                            <Typography variant="h6" sx={{ fontWeight: 600, color: "#e65100" }}>
                            Send feedback to Ajaxter
                            </Typography>
                        </Box>
                        <IconButton
                            onClick={handleClose}
                            disabled={isSubmitting}
                            sx={{
                                color: "#5f6368",
                                "&:hover": {
                                    backgroundColor: "rgba(0, 0, 0, 0.04)",
                                },
                            }}
                        >
                            <CloseIcon />
                        </IconButton>
                    </Box>

                    {/* Content */}
                    <Box sx={{ flex: 1, p: 3, overflow: "auto" }}>
                        <>
                            {/* Feedback Form */}
                            <Typography
                                variant="subtitle1"
                                sx={{ fontWeight: 600, mb: 1, color: "#202124" }}
                            >
                                Describe your feedback
                            </Typography>
                            <TextField
                                ref={textareaRef}
                                multiline
                                rows={6}
                                fullWidth
                                value={feedback}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    if (value.length <= 500) {
                                        setFeedback(value);
                                    }
                                }}
                                placeholder="Tell us what prompted this feedback..."
                                variant="outlined"
                                inputProps={{
                                    maxLength: 500,
                                }}
                                helperText={
                                    <Box sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}>
                                        <Typography 
                                            variant="caption" 
                                            sx={{ 
                                                color: hasInvalidChars ? "#f44336" : "#5f6368"
                                            }}
                                        >
                                            {hasInvalidChars 
                                                ? "Special characters are not allowed: , . @ # ' [ ] { } | / \\ ! & * % ( ) ;" 
                                                : ""
                                            }
                                        </Typography>
                                        <Typography 
                                            variant="caption" 
                                            sx={{ 
                                                color: charCount > 450 ? "#f44336" : charCount > 400 ? "#ff9800" : "#5f6368",
                                                fontWeight: 500
                                            }}
                                        >
                                            {charCount}/500
                                        </Typography>
                                    </Box>
                                }
                                sx={{
                                    mb: 2,
                                    "& .MuiOutlinedInput-root": {
                                        backgroundColor: "white",
                                    },
                                }}
                                disabled={isSubmitting}
                            />

                            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                                <BackHandIcon sx={{ color: "#5f6368", fontSize: "1rem" }} />
                                <Typography variant="body2" sx={{ color: "#5f6368", fontSize: "0.8rem" }}>
                                    Please don't include any sensitive information
                                </Typography>
                            </Box>


                            {/* Email Opt-in */}
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={emailOptIn}
                                        onChange={(e) => setEmailOptIn(e.target.checked)}
                                        disabled={isSubmitting}
                                        sx={{ color: "#2566b0" }} 
                                    />
                                }
                                label={
                                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                                        <Typography sx={{ fontSize: "0.8rem" }}>
                                            We may email you for more information or updates
                                        </Typography>
                                        <Typography sx={{ color: "#f44336", fontSize: "0.8rem" }}>
                                            *
                                        </Typography>
                                    </Box>
                                }
                                sx={{ mb: 2 }}
                            />


                            {/* Collapsible Error Information */}
                            <Accordion
                                defaultExpanded={false}
                                sx={{
                                    mb: 3,
                                    boxShadow: 'none',
                                    '&:before': {
                                        display: 'none',
                                    },
                                    '&.Mui-expanded': {
                                        margin: 0,
                                    }
                                }}
                            >
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    sx={{
                                        borderRadius: 1,
                                        minHeight: 48,
                                        '&.Mui-expanded': {
                                            minHeight: 48,
                                        },
                                        '& .MuiAccordionSummary-content': {
                                            margin: '12px 0',
                                        }
                                    }}
                                >
                                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                        <ErrorIcon sx={{ color: "#e65100", fontSize: "1.2rem" }} />
                                        <Typography variant="subtitle2" sx={{ fontWeight: 600, color: "#e65100" }}>
                                            Error Information
                                        </Typography>
                                    </Box>
                                </AccordionSummary>
                                <AccordionDetails sx={{ p: 2, backgroundColor: "#fff3e0", border: "1px solid #ffcc02", borderRadius: 1 }}>
                                    <Typography variant="body2" sx={{ mb: 2, color: "#bf360c" }}>
                                        {errorMessage}
                                    </Typography>
                                    <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                                        <Chip
                                            label={`Request ID: ${errorReport.reqId || 'N/A'}`}
                                            size="small"
                                            variant="outlined"
                                            sx={{ fontSize: "0.75rem" }}
                                        />
                                        <Chip
                                            label={`Error ID: ${errorReport.errorId || 'N/A'}`}
                                            size="small"
                                            variant="outlined"
                                            sx={{ fontSize: "0.75rem" }}
                                        />
                                        <Chip
                                            label={`Time: ${errorReport.timestamp ? new Date(errorReport.timestamp).toLocaleString() : 'N/A'}`}
                                            size="small"
                                            variant="outlined"
                                            sx={{ fontSize: "0.75rem" }}
                                        />
                                    </Box>
                                </AccordionDetails>
                            </Accordion>

                            <Divider sx={{ mb: 3 }} />

                            {/* Privacy Information */}
                            <Typography variant="caption" sx={{ color: "#5f6368", lineHeight: 1.5 }}>
                                Some account and system information may be sent to our support team. We will use it to fix problems and improve our services, subject to our{" "}
                                <Typography
                                    component="span"
                                    sx={{
                                        fontSize: "0.75rem",
                                        color: "#2566b0",
                                        textDecoration: "underline",
                                        textDecorationStyle: "dotted",
                                        cursor: "pointer",
                                    }}
                                >
                                    Privacy Policy
                                </Typography>{" "}
                                and{" "}
                                <Typography
                                    component="span"
                                    sx={{
                                        fontSize: "0.75rem",
                                        color: "#2566b0",
                                        textDecoration: "underline",
                                        textDecorationStyle: "dotted",
                                        cursor: "pointer",
                                    }}
                                >
                                    Terms of Service
                                </Typography>
                                . We may email you for more information or updates.
                            </Typography>
                        </>
                    </Box>

                    {/* Footer */}
                    <Box
                        sx={{
                            p: 3,
                            backgroundColor: "white",
                            borderTop: "1px solid #e0e0e0",
                            display: "flex",
                            justifyContent: "center",
                        }}
                    >
                        <Button
                            variant="contained"
                            onClick={handleSubmit}
                            disabled={isSubmitting || hasInvalidChars || !emailOptIn}
                            startIcon={<SendIcon />}
                            sx={{
                                textTransform: "none",
                                fontWeight: 500,
                                minWidth: 120,
                            }}
                        >
                            {isSubmitting ? "Sending..." : "Send"}
                        </Button>
                    </Box>
                </Box>
            </Drawer>

            {/* Error Dialog */}
        <Dialog
            open={showErrorDialog}
            onClose={() => setShowErrorDialog(false)}
            maxWidth="sm"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: 2,
                    boxShadow: 24,
                },
            }}
        >
            <DialogTitle
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    pb: 1,
                    px: 3,
                    pt: 3,
                }}
            >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <BugReportIcon
                        sx={{
                            color: "#f44336",
                            fontSize: 24,
                        }}
                    />
                    <Typography 
                        variant="h6" 
                        sx={{ 
                            fontWeight: 600,
                            color: "#f44336",
                            fontSize: "1.25rem"
                        }}
                    >
                        Submission Error
                    </Typography>
                </Box>
            </DialogTitle>

            <DialogContent sx={{ px: 3, py: 2 }}>
                <Typography variant="body1" sx={{ color: "text.primary" }}>
                    {dialogErrorMessage}
                </Typography>
            </DialogContent>

            <DialogActions sx={{ px: 3, pb: 2 }}>
                <Button
                    onClick={() => setShowErrorDialog(false)}
                    variant="contained"
                    color="primary"
                    sx={{
                        textTransform: "none",
                        fontWeight: 500,
                        minWidth: 100,
                    }}
                >
                    OK
                </Button>
            </DialogActions>
        </Dialog>
        </>
    );
};

export default CustomerCareDrawer;
