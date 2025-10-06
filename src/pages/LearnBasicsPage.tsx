import React, { useState } from "react";
import {
  Box,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Button,
  Card,
  CardContent,
  LinearProgress,
  Chip,
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  CheckCircle as CheckCircleIcon,
  School as SchoolIcon,
  VideoLibrary as VideoLibraryIcon,
  Article as ArticleIcon,
  Quiz as QuizIcon,
  PlayArrow as PlayArrowIcon,
  Star as StarIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const LearnBasicsPage: React.FC = () => {
  const navigate = useNavigate();

  const [completedModules, setCompletedModules] = useState<number[]>([1, 2]);


  const learnBasicsItems = [
    {
      id: 1,
      title: "Welcome to Ajaxter",
      description: "Get started with the basics of our platform",
      icon: <SchoolIcon sx={{ color: "#1976d2", fontSize: 24 }} />,
      type: "video",
      duration: "5 min",
      completed: true,
    },
    {
      id: 2,
      title: "Dashboard Overview",
      description: "Learn about your main dashboard and navigation",
      icon: <VideoLibraryIcon sx={{ color: "#4caf50", fontSize: 24 }} />,
      type: "video",
      duration: "8 min",
      completed: true,
    },
    {
      id: 3,
      title: "Creating Your First Ticket",
      description: "Step-by-step guide to ticket creation",
      icon: <ArticleIcon sx={{ color: "#ff9800", fontSize: 24 }} />,
      type: "article",
      duration: "6 min",
      completed: false,
    },
    {
      id: 4,
      title: "Managing Customers",
      description: "Customer relationship management basics",
      icon: <CheckCircleIcon sx={{ color: "#9c27b0", fontSize: 24 }} />,
      type: "video",
      duration: "10 min",
      completed: false,
    },
    {
      id: 5,
      title: "Quick Actions Guide",
      description: "Master the quick action features",
      icon: <QuizIcon sx={{ color: "#f44336", fontSize: 24 }} />,
      type: "quiz",
      duration: "7 min",
      completed: false,
    },
  ];

  const completedCount = completedModules.length;
  const totalCount = learnBasicsItems.length;
  const progressPercentage = (completedCount / totalCount) * 100;

  const handleModuleClick = (moduleId: number) => {
    if (!completedModules.includes(moduleId)) {
      setCompletedModules([...completedModules, moduleId]);
    }
  };

  return (
    <div className="w-full  ">
      <Box sx={{ display: "grid", gap: 2 }}>
        {learnBasicsItems.map((item) => (
          <Card
            key={item.id}
            sx={{
              cursor: "pointer",
              transition: "all 0.3s ease",
              border: completedModules.includes(item.id)
                ? "2px solid #4caf50"
                : "1px solid #e0e0e0",
              "&:hover": {
                transform: "translateY(-2px)",
                boxShadow: 4,
                borderColor: "#1976d2",
              },
            }}
            onClick={() => handleModuleClick(item.id)}
          >
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
                <Box
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    backgroundColor: completedModules.includes(item.id)
                      ? "#e8f5e8"
                      : "#f5f5f5",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {item.icon}
                </Box>

                <Box sx={{ flex: 1 }}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                      mb: 1,
                    }}
                  >
                    <Typography
                      variant="h6"
                      sx={{ fontWeight: 600, color: "#1a1a1a" }}
                    >
                      {item.title}
                    </Typography>
                    {completedModules.includes(item.id) && (
                      <Chip
                        label="Completed"
                        size="small"
                        color="success"
                        icon={<CheckCircleIcon />}
                      />
                    )}
                  </Box>
                  <Typography variant="body2" sx={{ color: "#666", mb: 1 }}>
                    {item.description}
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Chip
                      label={item.type}
                      size="small"
                      variant="outlined"
                      sx={{ textTransform: "capitalize" }}
                    />
                    <Typography variant="caption" sx={{ color: "#999" }}>
                      {item.duration}
                    </Typography>
                  </Box>
                </Box>

                <Box>
                  <PlayArrowIcon sx={{ color: "#1976d2", fontSize: 28 }} />
                </Box>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>
    </div>
  );
};

export default LearnBasicsPage;
