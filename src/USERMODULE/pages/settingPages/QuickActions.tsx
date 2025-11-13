import React, { useState } from "react";
import {
  Box,
  Typography,
  Card,
  TextField,
  InputAdornment,
  Avatar,
  IconButton,
} from "@mui/material";
import {
  Search,
  Email,
  Assignment,
  Create,
  Call,
  Refresh,
  RocketLaunch,
  Star,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setOpenTask } from "../../../reduxStore/Slices/shotcutSlices";

const quickActions = [
  {
    id: "send-email",
    title: "Send an e-mail",
    description: "Compose and send professional emails",
    icon: <Email sx={{ fontSize: 32 }} />,
    color: "#2566b0",
    bgColor: "#e3f2fd",
    action: "email",
    featured: true,
  },
  {
    id: "raise-ticket",
    title: "Raise Ticket or Incident",
    description: "Create new support ticket",
    icon: <Create sx={{ fontSize: 32 }} />,
    color: "#f57c00",
    bgColor: "#fff3e0",
    action: "ticket",
  },
  {
    id: "call-agent",
    title: "Call Agent or Department",
    description: "Call support agent",
    icon: <Call sx={{ fontSize: 32 }} />,
    color: "#388e3c",
    bgColor: "#e8f5e8",
    action: "call",
  },
  {
    id: "create-task",
    title: "Assign Task",
    description: "Create and assign task",
    icon: <Assignment sx={{ fontSize: 32 }} />,
    color: "#7b1fa2",
    bgColor: "#f3e5f5",
    action: "task",
  },
];

const QuickActions: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
const dispatch = useDispatch();

  // Filter actions based on search query
  const filteredActions = quickActions.filter((action) => {
    if (!searchQuery.trim()) return true;

    const searchLower = searchQuery.toLowerCase();
    return (
      action.title.toLowerCase().includes(searchLower) ||
      action.description.toLowerCase().includes(searchLower) ||
      action.action.toLowerCase().includes(searchLower)
    );
  });

  const handleQuickAction = (action: string) => {
    switch (action) {
      case "email":
        // Navigate to send-email page
        navigate("/send-email");
        break;
      case "ticket":
        navigate("/create-ticket");
        break;
      case "call":
        // Handle call action
        break;
      case "task":
        dispatch(setOpenTask(true));
        navigate("/tasks");
        break;
      case "contact":
        break;
      case "group":
        // Handle group creation
        break;
      case "meeting":
        break;
      case "notification":
        // Handle notification sending
        break;
    }
  };

  return (
    <Box
      sx={{
        p: 3,
        bgcolor: "#f8f9fa",
        minHeight: "calc(100vh - 98px)",
        // Global focus styles to remove black borders
        "& *": {
          "&:focus": {
            outline: "none !important",
          },
          "&:focus-visible": {
            outline: "none !important",
          },
        },
        // Specific styles for buttons and interactive elements
        "& button": {
          "&:focus": {
            outline: "none !important",
            boxShadow: "0 0 0 2px rgba(25, 118, 210, 0.3) !important",
          },
          "&:focus-visible": {
            outline: "none !important",
            boxShadow: "0 0 0 2px rgba(25, 118, 210, 0.3) !important",
          },
        },
        "& .MuiTextField-root": {
          "& .MuiOutlinedInput-root": {
            "&:focus": {
              outline: "none !important",
            },
            "&:focus-visible": {
              outline: "none !important",
            },
          },
        },
        // Rocket animation
        "@keyframes rocket-pulse": {
          "0%": {
            transform: "scale(1)",
            opacity: 1,
          },
          "50%": {
            transform: "scale(1.1)",
            opacity: 0.8,
          },
          "100%": {
            transform: "scale(1)",
            opacity: 1,
          },
        },
      }}
    >
      {/* Header Section */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <RocketLaunch
            sx={{
              fontSize: 30,
              animation: "rocket-pulse 2s ease-in-out infinite",
            }}
          />
          <Typography variant="h4" sx={{ fontWeight: 700, color: "#1a1a1a" }}>
            Quick Actions
          </Typography>
        </Box>
        <Typography variant="body1" sx={{ color: "#666", mb: 3 }}>
          Access quick actions for efficient communication
        </Typography>

        {/* Search Bar */}
        <TextField
          fullWidth
          autoFocus
          placeholder="Search quick actions..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search sx={{ color: "#666" }} />
              </InputAdornment>
            ),
            endAdornment: searchQuery && (
              <InputAdornment position="end">
                <IconButton onClick={() => setSearchQuery("")} size="small">
                  <Refresh />
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={{
            maxWidth: 600,
            "& .MuiOutlinedInput-root": {
              borderRadius: 2,
              bgcolor: "white",
            },
          }}
        />
      </Box>

      <Box>
        {/* Quick Actions */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              md: "repeat(3, 1fr)",
              lg: "repeat(4, 1fr)",
            },
            gap: 2,
          }}
        >
          {filteredActions.length > 0 ? (
            filteredActions.map((action, index) => (
              <Box key={action.id}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -4 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Card
                    sx={{
                      borderRadius: 2,
                      maxHeight: 200,
                      minHeight: 200,
                      border: action.featured
                        ? `2px solid ${action.color}`
                        : "1px solid #e0e0e0",
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                      p: 3,
                      position: "relative",
                      background: action.featured
                        ? `linear-gradient(135deg, ${action.bgColor} 0%, ${action.bgColor}dd 100%)`
                        : "white",
                      "&:hover": {
                        boxShadow: action.featured
                          ? `0 12px 32px ${action.color}30, 0 8px 24px rgba(0,0,0,0.12)`
                          : "0 8px 24px rgba(0,0,0,0.12)",
                        borderColor: action.color,
                        transform: action.featured
                          ? "translateY(-6px)"
                          : "translateY(-4px)",
                      },
                      "&:focus": {
                        outline: "none",
                        boxShadow: `0 0 0 2px ${action.color}40, 0 8px 24px rgba(0,0,0,0.12)`,
                        borderColor: action.color,
                      },
                      "&:focus-visible": {
                        outline: "none",
                        boxShadow: `0 0 0 2px ${action.color}40, 0 8px 24px rgba(0,0,0,0.12)`,
                        borderColor: action.color,
                      },
                    }}
                    onClick={() => handleQuickAction(action.action)}
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        handleQuickAction(action.action);
                      }
                    }}
                  >
                    {/* Featured Badge */}
                    {action.featured && (
                      <Box
                        sx={{
                          position: "absolute",
                          top: -8,
                          right: -8,
                          bgcolor: "#ffd700",
                          color: "#000",
                          borderRadius: "50%",
                          width: 32,
                          height: 32,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                          zIndex: 1,
                        }}
                      >
                        <Star sx={{ fontSize: 16 }} />
                      </Box>
                    )}

                    <Box sx={{ textAlign: "center" }}>
                      <Avatar
                        sx={{
                          width: 64,
                          height: 64,
                          bgcolor: action.featured ? "white" : action.bgColor,
                          color: action.color,
                          mx: "auto",
                          mb: 2,
                          boxShadow: action.featured
                            ? "0 4px 12px rgba(0,0,0,0.15)"
                            : "none",
                        }}
                      >
                        {action.icon}
                      </Avatar>
                      <Typography
                        variant="subtitle1"
                        sx={{
                          fontWeight: 600,
                          mb: 1,
                          color: action.featured ? action.color : "inherit",
                        }}
                      >
                        {action.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: action.featured ? "#555" : "#666",
                          fontWeight: action.featured ? 500 : 400,
                        }}
                      >
                        {action.description}
                      </Typography>
                    </Box>
                  </Card>
                </motion.div>
              </Box>
            ))
          ) : (
            <Box
              sx={{
                gridColumn: "1 / -1",
                textAlign: "center",
                py: 8,
                color: "#666",
              }}
            >
              <Typography variant="h6" sx={{ mb: 1 }}>
                No actions found
              </Typography>
              <Typography variant="body2">
                Try searching for "email", "ticket", "call", or "task"
              </Typography>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default QuickActions;
