import React, { useState } from "react";
import { Box, CssBaseline, useTheme, styled } from "@mui/material";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";

const drawerWidth = 0;

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })<{
  open?: boolean;
}>(({ theme, open }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  transition: theme.transitions.create("margin", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: `-${drawerWidth}px`,
  backgroundColor: theme.palette.background.default,
  minHeight: "100vh",
  ...(open && {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  }),
}));

const MainContent = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(8),
  padding: theme.spacing(3),
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[1],
}));

const Footer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  backgroundColor: theme.palette.background.paper,
  borderTop: `1px solid ${theme.palette.divider}`,
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  [theme.breakpoints.down("sm")]: {
    display: "none",
  },
}));

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [open, setOpen] = useState(true);
  const theme = useTheme();

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <CssBaseline />
      <TopBar open={open} handleDrawerToggle={handleDrawerToggle} />
      <Sidebar open={open} handleDrawerToggle={handleDrawerToggle} />
      <Main open={open}>
        <MainContent>{children}</MainContent>
        <Footer>
          <Box>
            <span
              style={{ color: theme.palette.primary.main, fontWeight: "bold" }}
            >
              Ace
            </span>
            <span style={{ color: theme.palette.text.secondary }}>
              {" "}
              Application &copy; {new Date().getFullYear()}
            </span>
          </Box>
          <Box sx={{ display: "flex", gap: 2 }}>
            <a href="#" style={{ color: theme.palette.primary.main }}>
              <i className="fab fa-twitter-square"></i>
            </a>
            <a href="#" style={{ color: theme.palette.primary.dark }}>
              <i className="fab fa-facebook"></i>
            </a>
            <a href="#" style={{ color: theme.palette.warning.main }}>
              <i className="fa fa-rss-square"></i>
            </a>
          </Box>
        </Footer>
      </Main>
    </Box>
  );
};

export default MainLayout;
