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
      <AppBar position="static" sx={{ width: "100%", bgcolor: "white" }} elevation={0} >
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
            sx={{ color: "#1976d2" }}
          >
            Help Desk
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center", gap: 2, color: "#1976d2" }}>
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
                      position: "relative",
                      px: 2,
                      py: 1,
                      "&:hover": {
                        backgroundColor: "transparent",
                        transform: "scale(1.05)",
                        color: "#1976d2",
                        "&::after": {
                          width: "100%",
                        },
                      },
                      "&::after": {
                        content: '""',
                        position: "absolute",
                        bottom: 0,
                        color: "#1976d2",
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
                <div  key={index}>
                  <Button
                   
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
                        backgroundColor: "#f2f4f6",
                        transform: "scale(1.05)",
                        "&::after": {
                          width: "100%",
                        }
                      },
                      "&::after": {
                        content: '""',
                        position: "absolute",
                        bottom: "0",
                        left: "0",
                        backgroundColor: "#1976d2",
                        width: "0%",
                        height: "2px",
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
                </div>
              ))}
            </Box>
          </Box>
        </Toolbar>
      </AppBar>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          backgroundColor: "#1976d2",
          py: 2,
          px: 4,
          color: "white",
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
                    color: "white",
                    mx: 1,
                    fontSize: "1rem"
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
