import {
  AppBar,
  Box,
  Button,
  Divider,
  List,
  ListItemButton,
  ListItemText,
  Toolbar,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { navItems } from "../../data/instractions";
import { useLocation, useNavigate } from "react-router-dom";
import LoginDialog from "../../components/supportcomponents/LoginDialog";

const SupportHeader = () => {
  const navigate = useNavigate();
  const path = window.location.pathname;
  const lastSegment = path.split("/").filter(Boolean).pop();

  // Find the navItem that matches the current path
  const currentNavItem = navItems.find(
    (item: any) => item.path === lastSegment
  );

  const [activeTab, setActiveTab] = useState(
    currentNavItem ? currentNavItem.label : navItems[0].label
  );
  const [tabs, setTabs] = useState<string[]>([activeTab]);
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    const activeIndex = navItems.findIndex((item) => item.label === activeTab);
    if (activeIndex >= 0) {
      setTabs(navItems.slice(0, activeIndex + 1).map((item) => item.label));
    }
  }, [activeTab]);

  useEffect(() => {
    if (currentNavItem) {
      setActiveTab(currentNavItem.label);
    }
    // else {
    //   const activeUrl = window.location.pathname.toUpperCase();
    //   let lastSegment = activeUrl.substring(activeUrl.lastIndexOf("/") + 1);
    //   lastSegment = decodeURIComponent(lastSegment);
    //   const formatted = lastSegment
    //     .toLowerCase()
    //     .split(" ")
    //     .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    //     .join("-");
    //     console.log(formatted);

    // }
  }, [window.location.pathname]);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={{ width: "100%" }} elevation={0}>
        <Toolbar
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography
            variant="subtitle1"
            fontSize={"1.2rem"}
            fontWeight={600}
            component="span"
          >
            Help Desk
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <List
              sx={{
                display: "flex",
                gap: 2,
                p: 0,
              }}
            >
              {navItems.map((item) => {
                const isActive = activeTab === item.label;
                return (
                  <ListItemButton
                    key={item.id}
                    disableRipple
                    disableTouchRipple
                    onClick={() => {
                      setActiveTab(item.label);
                      navigate(item.path);
                    }}
                    sx={{
                      color: "white",
                      position: "relative",
                      px: 2,
                      py: 1,
                      "&:hover": {
                        backgroundColor: "transparent",
                        transform: "scale(1.05)",
                        color: "rgba(255, 255, 255, 0.9)",
                        "&::after": {
                          width: "100%",
                        },
                      },
                      "&::after": {
                        content: '""',
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        width: isActive ? "100%" : "0%",
                        height: "2px",
                        backgroundColor: "currentColor",
                        transition: "width 0.3s ease-in-out",
                      },
                      transition: "transform 0.2s ease, color 0.2s ease",
                    }}
                  >
                    <ListItemText
                      primary={item.label}
                      primaryTypographyProps={{
                        fontWeight: 500,
                        fontSize: "1rem",
                      }}
                    />
                  </ListItemButton>
                );
              })}
            </List>

            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              {["Sign up", "Login"].map((btn, index) => (
                <>
                  <Button
                    key={index}
                    color="inherit"
                    onClick={() => {
                      if (btn === "Login") {
                        setShowLoginModal(true);
                      }
                    }}
                    disableRipple
                    disableFocusRipple
                    sx={{
                      position: "relative",
                      "&:hover": {
                        backgroundColor: "transparent",
                        transform: "scale(1.05)",
                        "&::after": {
                          width: "100%",
                        },
                        color: "rgba(255, 255, 255, 0.9)",
                      },
                      "&::after": {
                        content: '""',
                        position: "absolute",
                        bottom: "0",
                        left: "0",
                        width: "0%",
                        height: "2px",
                        backgroundColor: "currentColor",
                        transition: "width 0.3s ease-in-out",
                      },
                      transition: "transform 0.2s ease, color 0.2s ease",
                    }}
                  >
                    {btn}
                  </Button>

                  {index === 0 && (
                    <Divider
                      orientation="vertical"
                      sx={{ height: "1.5rem", bgcolor: "white" }}
                    />
                  )}
                </>
              ))}
            </Box>
          </Box>
        </Toolbar>
      </AppBar>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          py: 2,
          px: 4,
          boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.2)",
        }}
      >
        {tabs.map((tab, i) => {
          const isActive = tab === activeTab;
          return (
            <Box key={i} sx={{ display: "flex", alignItems: "center" }}>
              <Typography
                variant="subtitle1"
                fontSize={"1rem"}
                fontWeight={600}
                component="span"
                sx={{
                  textDecoration: isActive ? "none" : "underline",
                  cursor: isActive ? "default" : "pointer",
                }}
                onClick={() => {
                  if (!isActive) {
                    setActiveTab(tab);
                  }
                }}
              >
                {tab}
              </Typography>
              {i < tabs.length - 1 && (
                <ChevronRightIcon
                  sx={{
                    mx: 1,
                    fontSize: "1rem",
                    color: "#000",
                  }}
                />
              )}
            </Box>
          );
        })}
      </Box>
      <LoginDialog
        open={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLogin={function () {}}
      />
    </Box>
  );
};

export default SupportHeader;
