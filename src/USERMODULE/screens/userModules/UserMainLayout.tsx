import { Suspense, useEffect } from "react";
import { Box, CssBaseline, styled } from "@mui/material";

import UserTopBar from "../../components/userModuleComponents/UserTopBar";
import UserSidebar from "../../components/userModuleComponents/UserSidebar";
import { useDispatch, useSelector } from "react-redux";

import { Outlet } from "react-router-dom";
import { setToggale } from "../../../reduxStore/Slices/genralSlices";

const Main = styled("main", {
  shouldForwardProp: (prop) =>
    prop !== "open" && prop !== "isPopupOpen" && prop !== "helpCenterOpen",
})<{
  open?: boolean;
  isPopupOpen?: boolean;
  helpCenterOpen?: boolean;
}>(({ theme, open, isPopupOpen, helpCenterOpen }) => ({
  flexGrow: 1,
  padding: "5px",
  transition: theme.transitions.create("margin", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),

  backgroundColor: "#f3f4f6",
  width: "100%",
  height: "100%",
  overflow: "auto",
  ...(open && {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  }),
  ...(helpCenterOpen && {
    marginLeft: "300px", // 80px (sidebar) + 400px (help center) = 480px
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
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
  backgroundColor: "#f3f4f6",
  borderRadius: theme.shape.borderRadius,
  overflow: "auto",
}));

const UserMainLayout = () => {
  const { isOpenToggle } = useSelector((state: any) => state.genral);
  const dispatch = useDispatch();
  return (
    <Box sx={{ width: "100%", display: "flex", overflow: "hidden" }}>
      <CssBaseline />

      <UserTopBar
        open={isOpenToggle}
        handleDrawerToggle={() => dispatch(setToggale(!isOpenToggle))}
      />
      <UserSidebar />
      <Main open={false} sx={{ position: "relative" }}>
        <MainContent className="custom-scrollbar">
          <Suspense
            fallback={<div className="flex items-center justify-center"></div>}
          >
            <Outlet />
          </Suspense>
        </MainContent>
      </Main>
    </Box>
  );
};

export default UserMainLayout;
