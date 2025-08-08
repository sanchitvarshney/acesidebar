import React, { useState } from "react";
import { Box, CssBaseline, useTheme, styled } from "@mui/material";

import { Outlet } from "react-router-dom";
import SupportHeader from "../components/supportcomponents/SupportHeader";
import SupportFooter from "../components/supportcomponents/SupportFooter";

const MainContent = styled(Box)(({ theme }) => ({
  width: "100%",
  marginTop: "125px",
  padding: theme.spacing(0),
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  overflow: "auto",
  height: `calc(100vh - 125px)`,
}));

const SupportMainScreen = () => {
  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        height: "100vh",
      }}
    >
      <Box
        sx={{
          width: "100%",
          height: 125,
          position: "fixed",
          top: 0,
          zIndex: 100,
        }}
      >
        <SupportHeader />
      </Box>

      <MainContent>
        <Box
          sx={{
            minHeight: "calc(100vh - 198px)",
            overflowY: "auto",
            willChange: "transform",
          }}
        >
          <Outlet />
        </Box>

        <SupportFooter />
      </MainContent>
    </Box>
  );
};

export default SupportMainScreen;
