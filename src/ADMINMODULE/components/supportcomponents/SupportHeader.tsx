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

import { useLocation, useNavigate } from "react-router-dom";
import LoginDialog from "./LoginDialog";
import { navItems } from "../../../data/instractions";
import { useTabs } from "../../../contextApi/TabsContext";

const SupportHeader = () => {
  const [showLoginModal, setShowLoginModal] = useState(false);

  const navigate = useNavigate();
  const { activeTab, setActiveTab, tabs, setTabs, addTab } = useTabs();

  const path = window.location.pathname;

  const lastSegment = path.split("/").filter(Boolean).pop();
  const currentNavItem = navItems.find(
    (item: any) => item.path === lastSegment
  );

  useEffect(() => {

    if (currentNavItem) {
      setActiveTab(currentNavItem.label);
      setTabs(
        navItems.slice(
          0,
          navItems.findIndex((item) => item.label === currentNavItem.label) + 1
        )
      );
    }
  }, [path]);


  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        position="static"
        sx={{ width: "100%", bgcolor: "white" }}
        elevation={0}
      >
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
            sx={{ color: "#03363d" }}
          >
            Help Desk
          </Typography>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              color: "#03363d",
            }}
          >
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
                        color: "#03363d",
                        "&::after": {
                          width: "100%",
                        },
                      },
                      "&::after": {
                        content: '""',
                        position: "absolute",
                        bottom: 0,
                        color: "#03363d",
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

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                flexDirection: "row",
                gap: 1,
              }}
            >
              {["Sign up", "Login"].map((btn, index) => (
                <div key={index} className="flex items-center gap-2">
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
                        },
                      },
                      "&::after": {
                        content: '""',
                        position: "absolute",
                        bottom: "0",
                        left: "0",
                        backgroundColor: "#03363d",
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
          backgroundColor: "#03363d",
          py: 2,
          px: 4,
          color: "white",
          boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.2)",
        }}
      >
        {tabs.map((tab, i) => {
          const isActive = tab.label === activeTab;
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
                  navigate(tab?.path || "");
                  if (!isActive) {
                    setActiveTab(tab.label);
                  }
                }}
              >
                {tab.label}
              </Typography>
              {i < tabs.length - 1 && (
                <ChevronRightIcon
                  sx={{
                    color: "white",
                    mx: 1,
                    fontSize: "1rem",
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
