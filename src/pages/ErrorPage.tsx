import React from "react";
import {
  Button,
  Container,
  Typography,
  Box,
  Grid
} from "@mui/material";
import {
  Home as HomeIcon,
  Refresh as RefreshIcon
} from "@mui/icons-material";
import pageCrashImage from "../assets/image/page-crash.webp";

const ErrorPage = ({ onReload }: { onReload?: () => void }) => {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#ffffff",
        display: "flex",
        alignItems: "center",
        py: 4,
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4} alignItems="center">
          {/* Left Side - Text Content */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Box sx={{ pr: { md: 4 } }}>
              {/* Main Error Message */}
              <Typography
                variant="h2"
                sx={{
                  fontWeight: "bold",
                  color: "#2c3e50",
                  mb: 2,
                  fontSize: { xs: "2.5rem", md: "3.5rem" },
                }}
              >
                Oops!
              </Typography>

              <Typography
                variant="h5"
                sx={{
                  color: "#34495e",
                  mb: 2,
                  fontWeight: 500,
                }}
              >
                Well, this is unexpected...
              </Typography>

              {/* Apology Message */}
              <Typography
                variant="h6"
                sx={{
                  color: "#03363d",
                  mb: 3,
                  fontWeight: 600,
                  fontStyle: "italic",
                }}
              >
                Sorry, it's not you. It's us.
              </Typography>

              {/* Error Code */}
              <Typography
                variant="body1"
                sx={{
                  color: "#7f8c8d",
                  mb: 3,
                  fontSize: "1.1rem",
                }}
              >
              </Typography>

              {/* Error Description */}
              <Typography
                variant="body1"
                sx={{
                  color: "#2c3e50",
                  mb: 3,
                  lineHeight: 1.6,
                  fontSize: "1.1rem",
                }}
              >
                An error has occurred and we're working to fix the problem!<br />We'll be up and running shortly.
              </Typography>

              {/* Support Information */}
              <Typography
                variant="body2"
                sx={{
                  color: "#7f8c8d",
                  mb: 4,
                  lineHeight: 1.6,
                }}
              >
                Our team has been notified and is working to fix the problem.<br />Thanks for your patience!
              </Typography>

              {/* Action Buttons */}
              <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={onReload || (() => window.location.reload())}
                  startIcon={<RefreshIcon />}
                  sx={{
                    px: 3,
                    py: 1.5,
                    borderRadius: 2,
                    textTransform: "none",
                    fontSize: "1rem",
                    fontWeight: 600,
                  }}
                >
                  Reload Page
                </Button>

                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => (window.location.href = "/")}
                  startIcon={<HomeIcon />}
                  sx={{
                    px: 3,
                    py: 1.5,
                    borderRadius: 2,
                    textTransform: "none",
                    fontSize: "1rem",
                    fontWeight: 600,
                  }}
                >
                  Go Home
                </Button>
              </Box>
            </Box>
          </Grid>

          {/* Right Side - Image */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: { xs: "300px", md: "500px" },
              }}
            >
              <Box
                component="img"
                src={pageCrashImage}
                alt="Page crashed illustration"
                sx={{
                  width: "100%",
                  height: "100%",
                  maxWidth: "500px",
                  maxHeight: "500px",
                  objectFit: "contain",
                  borderRadius: 2,
                }}
              />
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default ErrorPage;
