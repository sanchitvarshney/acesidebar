import React, { useState } from "react";
import { Box, CssBaseline, useTheme, styled } from "@mui/material";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";
import { Outlet } from "react-router-dom";
import BottomBar from "./BottomBar";

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
  minHeight: "80vh",
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

const MainLayout = ({}) => {
  const [open, setOpen] = useState(true);
  const theme = useTheme();

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <TopBar open={open} handleDrawerToggle={handleDrawerToggle} />
      <Sidebar open={open} handleDrawerToggle={handleDrawerToggle} />
      <Main open={open}>
        <MainContent>
          <Outlet />
        </MainContent>
      </Main>
      {/* <BottomBar /> */}
    </Box>
  );
};

export default MainLayout;
