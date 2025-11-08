import React, { useState } from "react";
import {
  Box,
  Collapse,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
} from "@mui/material";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { useHelpCenter } from "../../../contextApi/HelpCenterContext";
import { useLocation, useNavigate } from "react-router-dom";

const UserLeftMenu: React.FC = () => {
  const [expanded, setExpanded] = useState(true);
  const { helpCenterOpen } = useHelpCenter();
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    {
      id: 1,
      title: "All customers",
      path: "/user",
      isActive: location.pathname === "/user" || location.pathname === "/user/",
    },
    {
      id: 2,
      title: "Suspended users",
      path: "/user/suspended",
      isActive: location.pathname === "/user/suspended",
    },
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <Box
      sx={{
        height: "100%",
        minHeight: "calc(100vh - 70px)",
        overflow: "visible",
        width: expanded ? 240 : 55,
        transition: "width 0.3s ease",
        backgroundColor: "#e0e0e0",
        marginTop: 8,
        display: helpCenterOpen ? "none" : "flex",
        position: "relative",
      }}
    >
      {/* Expanded Collapse */}
      <div>
        <Collapse
          in={expanded}
          orientation="horizontal"
          timeout={400}
          unmountOnExit={false}
          sx={{
            display: "flex",
            backgroundColor: "#e8eaec",
            height: "100%",
            minHeight: "calc(100vh - 70px)",
          }}
        >
          <Box
            sx={{
              width: 240,
              py: 2,
              height: "100%",
              display: "flex",
              justifyContent: "space-between",
              flexDirection: "column",
            }}
          >
            <Box sx={{ p: 2 }}>
              <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
                Customer lists
              </Typography>
              <List dense sx={{ display: "flex", gap: 0.5, flexDirection: "column" }}>
                {menuItems.map((item) => (
                  <ListItem
                    key={item.id}
                    disablePadding
                    sx={{
                      mb: 0.5,
                    }}
                  >
                    <ListItemButton
                      onClick={() => handleNavigation(item.path)}
                      sx={{
                        px: 2,
                        py: 1,
                        borderRadius: "4px",
                        backgroundColor: item.isActive ? "#e3f2fd" : "transparent",
                        "&:hover": {
                          backgroundColor: item.isActive ? "#e3f2fd" : "#f5f5f5",
                        },
                      }}
                    >
                      <ListItemText
                        primary={item.title}
                        primaryTypographyProps={{
                          fontSize: "0.875rem",
                          fontWeight: item.isActive ? 600 : 400,
                          color: item.isActive ? "#03363d" : "#333",
                        }}
                      />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </Box>

            <div className="flex justify-end py-4 border-t border-gray-200">
              <IconButton
                onClick={() => setExpanded(false)}
                sx={{
                  borderRadius: 0,
                  borderTopLeftRadius: 10,
                  borderBottomLeftRadius: 10,
                }}
              >
                <ArrowForwardIosIcon sx={{ transform: "rotate(180deg)" }} />
              </IconButton>
            </div>
          </Box>
        </Collapse>
      </div>
      <div>
        {!expanded && (
          <Box
            sx={{
              opacity: expanded ? 0 : 1,
              transition: "opacity 0.2s ease, visibility 0.2s ease",
              width: 55,
              minWidth: 55,
              justifyItems: "flex-end",
              height: "100%",
            }}
          >
            <IconButton
              sx={{
                borderRadius: 0,
                borderTopRightRadius: 10,
                borderBottomRightRadius: 10,
                position: "absolute",
                bottom: "5%",
                right: "35%",
              }}
              onClick={() => setExpanded(true)}
            >
              <ArrowForwardIosIcon />
            </IconButton>
          </Box>
        )}
      </div>
    </Box>
  );
};

export default UserLeftMenu;

