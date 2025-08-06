import React, { useState } from "react";
import { Box, CssBaseline, useTheme, styled } from "@mui/material";

import { Outlet } from "react-router-dom";

import SupportHeader from "../components/supportcomponents/SupportHeader";

const drawerWidth = 0;

const MainContent = styled(Box)(({ theme }) => ({
  width: "100%",
  height:"calc(100vh - 125px)",
  padding: theme.spacing(0),
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  overflow:"hidden"
}));

const SupportMainScreen = () => {
  return (
    <Box sx={{ width: "100%", display: "flex", flexDirection: "column" }}>
      <Box sx={{ width: "100%", height: 125,  }}>
        <SupportHeader />
      </Box>

      <MainContent>
        <Outlet />
      </MainContent>
    </Box>
  );
};

export default SupportMainScreen;
