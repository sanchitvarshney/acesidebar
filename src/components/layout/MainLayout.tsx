import { Suspense, useState } from "react";
import { Box, CssBaseline, styled } from "@mui/material";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";
import { Outlet } from "react-router-dom";
import { usePopupContext } from "../../contextApi/PopupContext";
import logo from "../../assets/image/ajaxter-logo.webp";
import PrivateTurnstile from "../common/PrivateTurnstile";
import { useDispatch, useSelector } from "react-redux";
import { setToggle } from "../../reduxStore/Slices/shotcutSlices";
import { RootState } from "../../reduxStore/Store";

const drawerWidth = 0;

const Main = styled("main", {
  shouldForwardProp: (prop) => prop !== "open" && prop !== "isPopupOpen",
})<{
  open?: boolean;
  isPopupOpen?: boolean;
}>(({ theme, open, isPopupOpen }) => ({
  flexGrow: 1,
  padding: theme.spacing(2),
  transition: theme.transitions.create("margin", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: `-${drawerWidth}px`,
  backgroundColor: "#fafafa",
  minHeight: "80vh",
  ...(open && {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  }),
  ...(isPopupOpen && {
    WebkitFilter: "blur(2.5px)",
    filter: "blur(2.5px)",
    overflow: "hidden",
    pointerEvents: "none",
    userSelect: "none",
    WebkitUserSelect: "none",
    WebkitTouchCallout: "none",
    WebkitTapHighlightColor: "transparent",
    WebkitOverflowScrolling: "touch",
    touchAction: "none",
    msTouchAction: "none",
    msOverflowStyle: "-ms-autohiding-scrollbar",
    msContentZooming: "none",
    msScrollChaining: "none",
    msUserSelect: "none",
  }),
}));

const MainContent = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(8),
  padding: theme.spacing(0),
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  
}));

const MainLayout = () => {

  const { isAnyPopupOpen } = usePopupContext();
  const { isOpen } = useSelector((state:RootState) => state.shotcut);
  const dispatch = useDispatch();

  const handleDrawerToggle = () => {
   dispatch(setToggle(!isOpen));  
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <TopBar open={isOpen} handleDrawerToggle={handleDrawerToggle} />
      <Sidebar open={isOpen} handleDrawerToggle={handleDrawerToggle} />
      <Main open={isOpen} isPopupOpen={isAnyPopupOpen}>
        <MainContent>
          <Suspense
            fallback={
              <div className="flex items-center justify-center">
                {" "}
                <img src={logo} alt="Ajaxter Logo" className="w-[300px]  " />
              </div>
            }
          >
            <Outlet />
          </Suspense>
        </MainContent>
      </Main>
      {/* <BottomBar /> */}
      <PrivateTurnstile />
    </Box>
  );
};

export default MainLayout;
