import React, { useEffect, useState } from "react";
import { AppBar, Box, Button, Container, Divider, Toolbar, Typography } from "@mui/material";
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import LoginComponent from "../components/authscreencomponents/LoginComponent";

const LoginScreen = () => {
  const [showFooter, setShowFooter] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowFooter(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#ffffff", display: "flex", flexDirection: "column" }}>
      <AppBar position="static" sx={{ bgcolor: "#0b5ecf" }} elevation={0}>
        <Toolbar sx={{ minHeight: 72, gap: 2 }} >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <SupportAgentIcon sx={{ color: '#fff' }} />
            <Typography variant="h6" sx={{ fontWeight: 700, letterSpacing: 0.5 }}>
              Ajaxter Ticket
            </Typography>
          </Box>
          <Box sx={{ flex: 1 }} />
          <Button
            variant="outlined"
            color="inherit"
            sx={{ textTransform: "none", mr: 1, borderColor: 'rgba(255,255,255,0.6)', borderRadius: 9999, borderWidth: 2 }}
            onClick={() => {
              const baseUrl = process.env.REACT_APP_FRONTEND_URL || window.location.origin;
              window.location.href = `${baseUrl}/ticket/support`;
            }}
          >
            Submit a ticket
          </Button>
          <Button
            variant="outlined"
            color="inherit"
            sx={{ textTransform: "none", mr: 1, borderColor: 'rgba(255,255,255,0.6)', borderRadius: 9999, borderWidth: 2 }}
            onClick={() => {
              const baseUrl = process.env.REACT_APP_FRONTEND_URL || window.location.origin;
              window.location.href = `${baseUrl}/ticket/view-existing-ticket`;
            }}
          >
            My Tickets
          </Button>
        </Toolbar>

      </AppBar>
      <Box sx={{ color: '#0B49B4' }}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1900 47" preserveAspectRatio="none" width="100%" height="47">
          <g fill="currentColor" fillRule="evenodd">
            <path fillRule="nonzero" fill="#0b5ecf" d="M403.925926,32 C583.088889,32 1900,0 1900,0 L0,0 C0,0 163.540741,32 403.925926,32 Z" transform="translate(-250)"></path>
            <path fillOpacity="0.2" fillRule="nonzero" d="M1342.66667,76 C1552.37037,76 1900,0.2 1900,0.2 L0,0.2 C0,0.2 896.518519,76 1342.66667,76 Z" transform="translate(0 -29)"></path>
            <path fillOpacity="0.2" fillRule="nonzero" d="M1342.66667,76 C1552.37037,76 1900,0.2 1900,0.2 L0,0.2 C0,0.2 896.518519,76 1342.66667,76 Z" transform="translate(617 -29)"></path>
          </g>
        </svg>
      </Box>

      <Container maxWidth="lg" sx={{ flex: 1, py: 6, display: 'flex', alignItems: 'center', minHeight: 'calc(100vh - 72px - 47px)' }}>
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 4, width: '100%' }}>
          <Box>
            <LoginComponent />
          </Box>

          <Box>
            <Box sx={{ bgcolor: "#fff", p: 5 }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
                ...or login using
              </Typography>
              <Button variant="contained" sx={{ bgcolor: "#ea4335", textTransform: "none" }}>
                G Google
              </Button>

              <Divider sx={{ my: 3 }} />

              <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
                Sign up
              </Typography>
              <Button variant="contained" sx={{ textTransform: "none", bgcolor: "#0b5ecf" }}>
                Sign up with us
              </Button>
              <Typography variant="body2" sx={{ mt: 2, color: "text.secondary" }}>
                Once you sign up, you will have complete access to our self service portal and you can use your account to raise support tickets and track their status.
              </Typography>
            </Box>
          </Box>
        </Box>
      </Container>
      {/* Add slight space so the page can scroll; footer reveals once scrolled */}
      <Box sx={{ height: { xs: '20vh', md: '15vh' } }} />
      <Box component="footer" sx={{ mt: 'auto', py: 4, bgcolor: '#0b5ecf', color: '#fff', display: showFooter ? 'block' : 'none', transition: 'opacity 0.3s ease' }}>
        <Container maxWidth="lg" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>Need help?</Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              Our support team is here for you. Browse our knowledge base or raise a ticket and we’ll get back quickly.
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button variant="outlined" color="inherit" sx={{ textTransform: 'none', borderColor: 'rgba(255,255,255,0.7)', borderRadius: 9999 }}
              onClick={() => {
                const baseUrl = process.env.REACT_APP_FRONTEND_URL || window.location.origin;
                window.location.href = `${baseUrl}/ticket/view-existing-ticket`;
              }}
            >
              Submit a ticket
            </Button>
            <Button variant="outlined" color="inherit" sx={{ textTransform: 'none', bgcolor: 'rgba(255,255,255,0.15)', borderRadius: 9999 }}
              onClick={() => {
                const baseUrl = process.env.REACT_APP_FRONTEND_URL || window.location.origin;
                window.location.href = `${baseUrl}/ticket/support`;
              }}
            >
              Knowledge base
            </Button>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default LoginScreen;
