import React, { useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardActionArea,
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
} from "@mui/icons-material";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import QuickCreateForm from "../../components/quickActions/QuickCreateForm";

const quickActions = [
  {
    id: "send-email",
    title: "Send an e-mail",
    description: "Compose and send email",
    icon: <Email sx={{ fontSize: 32 }} />,
    color: "#1976d2",
    bgColor: "#e3f2fd",
    action: "email",
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
  const [selectedAction, setSelectedAction] = useState<string | null>(null);
  const [quickFormOpen, setQuickFormOpen] = useState(false);
  const [quickFormType, setQuickFormType] = useState<
    "email" | "ticket" | "task" | "contact" | "meeting"
  >("email");
  const [selectedContact, setSelectedContact] = useState<{
    id: number;
    name: string;
    email: string;
  } | null>(null);

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
    setSelectedAction(action);
    switch (action) {
      case "email":
        setQuickFormType("email");
        setQuickFormOpen(true);
        break;
      case "ticket":
        setQuickFormType("ticket");
        setQuickFormOpen(true);
        break;
      case "call":
        // Handle call action
        break;
      case "task":
        setQuickFormType("task");
        setQuickFormOpen(true);
        break;
      case "contact":
        setQuickFormType("contact");
        setQuickFormOpen(true);
        break;
      case "group":
        // Handle group creation
        break;
      case "meeting":
        setQuickFormType("meeting");
        setQuickFormOpen(true);
        break;
      case "notification":
        // Handle notification sending
        break;
    }
  };

  return (
    <Box sx={{
      p: 3,
      bgcolor: "#f8f9fa",
      minHeight: "calc(100vh - 98px)",
      // Global focus styles to remove black borders
      '& *': {
        '&:focus': {
          outline: 'none !important',
        },
        '&:focus-visible': {
          outline: 'none !important',
        },
      },
      // Specific styles for buttons and interactive elements
      '& button': {
        '&:focus': {
          outline: 'none !important',
          boxShadow: '0 0 0 2px rgba(25, 118, 210, 0.3) !important',
        },
        '&:focus-visible': {
          outline: 'none !important',
          boxShadow: '0 0 0 2px rgba(25, 118, 210, 0.3) !important',
        },
      },
      '& .MuiTextField-root': {
        '& .MuiOutlinedInput-root': {
          '&:focus': {
            outline: 'none !important',
          },
          '&:focus-visible': {
            outline: 'none !important',
          },
        },
      },
      // Rocket animation
      '@keyframes rocket-pulse': {
        '0%': {
          transform: 'scale(1)',
          opacity: 1,
        },
        '50%': {
          transform: 'scale(1.1)',
          opacity: 0.8,
        },
        '100%': {
          transform: 'scale(1)',
          opacity: 1,
        },
      },
    }}>
       {/* Header Section */}
       <Box sx={{ mb: 4 }}>
         <Box sx={{ display: 'flex', alignItems: 'center', gap: 2}}>
           <RocketLaunch 
             sx={{ 
               fontSize: 30, 
               animation: 'rocket-pulse 2s ease-in-out infinite'
             }} 
           />
           <Typography
             variant="h4"
             sx={{ fontWeight: 700, color: "#1a1a1a" }}
           >
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
                       border: "1px solid #e0e0e0",
                       cursor: "pointer",
                       transition: "all 0.2s ease",
                       p: 3,
                       "&:hover": {
                         boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                         borderColor: action.color,
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
                       if (e.key === 'Enter' || e.key === ' ') {
                         e.preventDefault();
                         handleQuickAction(action.action);
                       }
                     }}
                   >

                      <Box sx={{ textAlign: "center" }}>
                        <Avatar
                          sx={{
                            width: 64,
                            height: 64,
                            bgcolor: action.bgColor,
                            color: action.color,
                            mx: "auto",
                            mb: 2,
                          }}
                        >
                          {action.icon}
                        </Avatar>
                        <Typography
                          variant="subtitle1"
                          sx={{ fontWeight: 600, mb: 1 }}
                        >
                          {action.title}
                        </Typography>
                        <Typography variant="body2" sx={{ color: "#666" }}>
                          {action.description}
                        </Typography>
                      </Box>
                  </Card>
                </motion.div>
              </Box>
            ))
          ) : (
            <Box sx={{ 
              gridColumn: "1 / -1", 
              textAlign: "center", 
              py: 8,
              color: "#666"
            }}>
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

      {/* Quick Create Form Modal */}
      <QuickCreateForm
        open={quickFormOpen}
        onClose={() => {
          setQuickFormOpen(false);
          setSelectedContact(null);
        }}
        type={quickFormType}
        contactId={selectedContact?.id}
        contactName={selectedContact?.name}
        contactEmail={selectedContact?.email}
      />
    </Box>
  );
};

export default QuickActions;
