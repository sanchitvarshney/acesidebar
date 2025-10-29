import React from "react";
import {
    Box,
    Typography,
    Button,
    Container,
    Paper,
    Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { WarningAmber as WarningAmberIcon } from "@mui/icons-material";

const SessionExpiredPage: React.FC = () => {
    const navigate = useNavigate();

    const handleGoToLogin = () => {
        // Clear any existing session data
        sessionStorage.clear();
        localStorage.removeItem("userToken");
        localStorage.removeItem("userData");
        localStorage.removeItem("baseUrl");

        // Navigate to login page
        navigate("/login");
    };

    return (
        <Box
            sx={{
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#f5f5f5",
                padding: 2,
            }}
        >
            <Container maxWidth="lg">
                <Paper
                    elevation={3}
                    sx={{
                        padding: 4,
                        borderRadius: 2,
                        backgroundColor: "white",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                    }}
                >
                    {/* Title */}
                    <Typography
                        variant="h4"
                        component="h1"
                        gutterBottom
                        sx={{
                            fontWeight: "bold",
                            textAlign: "center",
                            fontSize: "1.5rem",
                            textTransform: "uppercase",
                            mb: 4,
                        }}
                    >
                        APPLICATION SECURITY ERROR !!!
                    </Typography>

                    {/* Grid Layout */}
                    <Box sx={{ display: "flex", gap: 4, mb: 4, flexWrap: "wrap" }}>
                        {/* Left Section - Alert */}
                        <Box sx={{ flex: "1 1 300px", minWidth: "300px" }}>
                            <Alert
                                severity="warning"
                                sx={{
                                    mb: 3,
                                    borderRadius: 2,
                                    backgroundColor: "#fff3e0",
                                    border: "1px solid #ff9800",
                                    "& .MuiAlert-icon": {
                                        color: "#ff9800",
                                    },
                                    "& .MuiAlert-message": {
                                        fontSize: "0.9rem",
                                        color: "#333",
                                        fontWeight: 600
                                    },
                                }}
                            >
                                This error has occurred for one of the following reasons:
                            </Alert>

                            {/* Reasons List */}
                            <Box>
                                <Typography
                                    component="ul"
                                    sx={{
                                        color: "#333",
                                        fontSize: "0.9rem",
                                        lineHeight: 1.5,
                                        pl: 2,
                                        "& li": {
                                            mb: 1,
                                        },
                                    }}
                                >
                                    <li>You have used Back/Forward/Refresh button of your Browser.</li>
                                    <li>You have kept the browser window idle for a long time.</li>
                                    <li>You have logged in from another browser window.</li>
                                    <li>You are accessing the application URL from a saved or static page.</li>
                                    <li>The access to the application is disabled. Contact the Bank Administrator.</li>
                                </Typography>
                            </Box>
                        </Box>

                        {/* Right Section - Centered Icon */}
                        <Box sx={{ flex: "0 0 200px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    height: "100%",
                                    minHeight: "200px",
                                }}
                            >
                                <WarningAmberIcon
                                    sx={{
                                        fontSize: 120,
                                        opacity: 0.8,
                                    }}
                                />
                            </Box>
                        </Box>
                    </Box>

                    {/* Action Button */}
                    <Box sx={{ textAlign: "center" }}>
                        <Button
                            variant="contained"
                            size="large"
                            onClick={handleGoToLogin}
                            sx={{
                                variant: "contained",
                                color: "primary",
                                padding: "12px 32px",
                                fontSize: "0.9rem",
                                fontWeight: 600,
                                borderRadius: 2,
                                textTransform: "none",
                            }}
                        >
                            GO TO LOGIN PAGE
                        </Button>
                    </Box>
                </Paper>
            </Container>
        </Box>
    );
};

export default SessionExpiredPage;
