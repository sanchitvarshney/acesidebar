import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Typography,
  IconButton,
  Button,
  Card,
  CardContent,
  LinearProgress,
  Chip,
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  CheckCircle as CheckCircleIcon,
  PlayArrow as PlayArrowIcon,
  Star as StarIcon,
} from "@mui/icons-material";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { baseSteps } from "../components/layout/HelpCenterSlider";
import { useSelector } from "react-redux";

const SetUpPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const item = location.state || {};

  const currentPath = item?.path || location.pathname.split("/").pop();
  const currentIndex = Math.max(
    0,
    baseSteps.findIndex((s: any) => s.path === currentPath)
  );
  const currentTitle = item?.title || baseSteps[currentIndex]?.title;
  const { payload } = useSelector((state: any) => state.setUp);

  const readCompleted = (): Set<string> => {
    try {
      const raw = "";
      const arr = raw ? JSON.parse(raw) : [];
      return Array.isArray(arr) ? new Set<string>(arr) : new Set<string>();
    } catch {
      return new Set<string>();
    }
  };
  const writeCompleted = (completed: Set<string>): void => {};

  const [completedPaths, setCompletedPaths] = useState<Set<string>>();

  useEffect(() => {
    // if (!completedPaths.has(currentPath)) {
    //   const next = new Set(completedPaths);
    //   next.add(currentPath);
    //   setCompletedPaths(next);
    //   writeCompleted(next);
    // }
  }, [currentPath]);

  const totalSteps = baseSteps.length;
  // const completedCount = completedPaths.size;
  // const progressPercentage = (completedCount / totalSteps) * 100;
  const completedCount = 0;
  const progressPercentage = 0;
  const nextStep = useMemo(() => {
    return baseSteps[Math.min(currentIndex + 1, baseSteps.length - 1)];
  }, [currentIndex]);

  // Remove old module-based progress; wizard progress is step-based now

  return (
    <Box
      sx={{
        height: "calc(100vh - 96px)",
        // backgroundColor: "#f5f5f5",
        p: 2,
        overflow: "hidden",
        maxWidth: "70%",
        mx: "auto",
      }}
    >
      {/* Header */}
      {/* Progress Section */}
      <Card elevation={0} sx={{ flexGrow: 0, border: "1px solid #ccc" }}>
        <CardContent>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 0.5,
            }}
          >
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: 600, color: "#1a1a1a" }}
            >
              Getting Started Progress
            </Typography>
            <Chip
              size="small"
              label={`${completedCount}/${totalSteps} completed`}
              color="primary"
              icon={<StarIcon />}
            />
          </Box>

          <Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}>
              <Typography
                variant="h5"
                sx={{ color: "#4caf50", fontWeight: 600 }}
              >
                {Math.round(progressPercentage)}%
              </Typography>
              <Typography variant="body2" sx={{ color: "#666" }}>
                {completedCount} of {totalSteps} steps completed
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={progressPercentage}
              sx={{
                height: 6,
                borderRadius: 4,
                backgroundColor: "#e0e0e0",
                "& .MuiLinearProgress-bar": {
                  backgroundColor: "#4caf50",
                  borderRadius: 4,
                },
              }}
            />
          </Box>
        </CardContent>
      </Card>
      <Box
        sx={{
          py: 2,
        }}
      >
        <Typography variant="body1" sx={{ fontWeight: 600, color: "#1a1a1a" }}>
          {currentTitle}
        </Typography>
        <Typography variant="subtitle2" sx={{ color: "#666" }}>
          Master Ajaxter with our comprehensive learning modules
        </Typography>
      </Box>

      <Card
        elevation={0}
        sx={{
          flexGrow: 0,
          borderTop: "1px solid #ccc",
          borderRight: "1px solid #ccc",
          borderLeft: "1px solid #ccc",
          borderRadius: 0,
          width: "100%",
          maxHeight: "calc(100vh - 390px)",
          overflow: "auto",
        }}
      >
        <CardContent>
          <Outlet />
        </CardContent>
      </Card>

      <Card
        elevation={0}
        sx={{ flexGrow: 0, border: "1px solid #ccc", borderRadius: 0 }}
      >
        <CardContent
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Button
            variant="text"
            sx={{ fontWeight: 600 }}
            onClick={() => navigate(-1)}
          >
            Back
          </Button>
          <Button
            variant="contained"
            sx={{ fontWeight: 600 }}
            startIcon={<PlayArrowIcon />}
            onClick={() => {
              navigate(`/getting-started/${nextStep.path}`, {
                state: { title: nextStep.title, path: nextStep.path },
              });
              console.log(payload, "<<<<<<<<<<<<<<<<<<<<payload");
            }}
          >
            Continue Learning
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
};

export default SetUpPage;
