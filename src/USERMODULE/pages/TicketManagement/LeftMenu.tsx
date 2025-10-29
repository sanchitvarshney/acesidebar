import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Collapse,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Typography,
} from "@mui/material";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import AddTaskIcon from "@mui/icons-material/AddTask";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

const LeftMenu: React.FC = () => {
  const [gettingStartedExpanded, setGettingStartedExpanded] = useState(false);

  const gettingStartedItems = [
    {
      id: 1,
      title: "Learn the basics",
      completed: false,
      isOptional: false,
      icon: <AddTaskIcon />,
    },
    {
      id: 2,
      title: "Advanced setup",
      completed: true,
      isOptional: true,
      icon: <AddTaskIcon />,
    },
  ];

  return (
    <Box
      sx={{
        height: "100%",
        minHeight:"100vh",
        position: "relative",
        overflow: "visible",
        width: gettingStartedExpanded ? 240 : 55,
        transition: "width 0.3s ease",
        backgroundColor: "#e8f0fe",
      }}
    >
      
      <Box
        sx={{
          opacity: gettingStartedExpanded ? 0 : 1,
          visibility: gettingStartedExpanded ? "hidden" : "visible",
          transition: "opacity 0.2s ease, visibility 0.2s ease",
          width: 55,
          minWidth: 55,
          backgroundColor: "#e8f0fe",
          height: "100%",
        }}
      >
        <IconButton
          sx={{
            borderRadius: 0,
            borderTopRightRadius: 10,
            borderBottomRightRadius: 10,
            position: "absolute",
            bottom: "calc(100% - 700px)",
            right: 10,
          }}
          onClick={() => setGettingStartedExpanded(true)}
        >
          <ArrowForwardIosIcon />
        </IconButton>
      </Box>

      {/* Expanded Collapse (Replaces sidebar) */}
      <Collapse
        in={gettingStartedExpanded}
        orientation="horizontal"
        timeout={400}
        unmountOnExit={false}
        sx={{
          display: "flex",
          mt: 10,
          backgroundColor: "#e8f0fe",
          height: "100%",
        
        }}
      >
        <Box
          sx={{
            width: 240,
            p: 2,
            bgcolor: "#e8f0fe",
            height: "100%",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: 1,
            }}
          >
            <Typography variant="subtitle1" fontWeight={600}>
              Getting Started
            </Typography>

            <IconButton
              size="small"
              onClick={() => setGettingStartedExpanded(false)}
            >
              <ArrowForwardIosIcon sx={{ transform: "rotate(180deg)" }} />
            </IconButton>
          </Box>

          <List dense>
            {gettingStartedItems.map((item) => (
              <ListItem
                key={item.id}
                sx={{
                  borderRadius: 1,
                  "&:hover": { bgcolor: "#f0f0f0" },
                }}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.title} />
              </ListItem>
            ))}
          </List>
        </Box>
      </Collapse>
    </Box>
  );
};

export default LeftMenu;
