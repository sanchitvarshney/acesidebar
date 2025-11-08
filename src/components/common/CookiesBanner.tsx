import { useEffect, useState } from "react";
import { Box, Button, Paper, Typography } from "@mui/material";
import cookiesImage from "../../assets/icons/coooookies.png";

const STORAGE_KEY = "cookie-consent";

const CookiesBanner = () => {
    const [visible, setVisible] = useState(false);
    const [hasMounted, setHasMounted] = useState(false);

    useEffect(() => {
        if (typeof window === "undefined") {
            return;
        }

        const consentGiven = window.localStorage.getItem(STORAGE_KEY);
        setVisible(!consentGiven);
        setHasMounted(true);
    }, []);

    const handleAccept = () => {
        if (typeof window !== "undefined") {
            const now = new Date().getTime();
            const expiry = now + 30 * 24 * 60 * 60 * 1000; // 30 days in ms
            window.localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify({ accepted: true, expiry })
            );
        }
        setVisible(false);
    };

    const handleOpenPolicy = () => {
        if (typeof window !== "undefined") {
            window.open("/privacy-policy", "_blank", "noopener");
        }
    };

    useEffect(() => {
        if (!hasMounted || typeof window === "undefined") {
            return;
        }

        const raw = window.localStorage.getItem(STORAGE_KEY);
        if (!raw) {
            return;
        }

        try {
            const parsed = JSON.parse(raw);
            if (parsed?.expiry && parsed.expiry < Date.now()) {
                window.localStorage.removeItem(STORAGE_KEY);
                setVisible(true);
            }
        } catch (error) {
            window.localStorage.removeItem(STORAGE_KEY);
            setVisible(true);
        }
    }, [hasMounted]);

    if (!visible) {
        return null;
    }

    return (
        <Box
            sx={{
                position: "fixed",
                bottom: { xs: 16, md: 24 },
                left: { xs: 16, md: 24 },
                zIndex: 1400,
                maxWidth: "30%",
            }}
        >
            <Paper
                elevation={6}
                sx={{
                    p: 3,
                    borderRadius: 4,
                    textAlign: "center",
                    backgroundColor: "#ffffff",
                    boxShadow: "0px 0px 45px #767676",
                }}
            >
                <Box
                    component="img"
                    src={cookiesImage}
                    alt="Cookies"
                    sx={{
                        width: 80,
                        height: 80,
                        mx: "auto",
                        mb: 1.5,
                        objectFit: "contain",
                    }}
                />
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2, textAlign: "justify", fontSize: "12px" }}>
                    <b>Important info about cookies. </b> <br /> By browsing our website or closing/agreeing this message,
                    you consent to the use of cookies as described in our Cookie Policy.
                </Typography>

                <Box sx={{ display: "flex", gap: 1 }}>
                    <Button
                        variant="text"
                        onClick={handleOpenPolicy}
                        sx={{
                            flex: 1,
                            borderRadius: 9999,
                            border: "1px solid #e0e0e0",
                            color: "#1f1f1f",
                            fontWeight: 600,
                            textTransform: "none",
                            bgcolor: "#f7f7f7",
                            "&:hover": {
                                bgcolor: "#efefef",
                            },
                        }}
                    >
                        Privacy Policy
                    </Button>
                    <Button
                        variant="contained"
                        onClick={handleAccept}
                        sx={{
                            flex: 1,
                            borderRadius: 9999,
                            textTransform: "none",
                            fontWeight: 600,
                            bgcolor: "#03363d",
                            color: "#ffffff"
                        }}
                    >
                        OK
                    </Button>
                </Box>
            </Paper>
        </Box>
    );
};

export default CookiesBanner;

