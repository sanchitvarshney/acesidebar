import emptyImg from "../../../assets/image/overview-empty-state.svg";
import {
  Box,
  IconButton,
  Typography,
  Card,
  CardContent,
  Switch,
  styled,
  Button,
} from "@mui/material";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";

const ScenarioAutomations = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        height: "calc(100vh - 96px)",
        display: "grid",
        gridTemplateColumns: "3fr 1fr",
        overflow: "hidden",
      }}
    >
      {/* Left Content */}
      <Box
        sx={{
          p: 0,
          display: "flex",
          flexDirection: "column",
          gap: 2,
          height: "100%",
          minHeight: 0,
          overflow: "hidden",
        }}
      >
        {/* Header Section */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 1,
            p: 2,
            borderBottom: "1px solid #e0e0e0",
            backgroundColor: "#fafafa",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <IconButton onClick={() => navigate("/settings/tickets-workflows")}>
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h5" sx={{ fontWeight: 600, color: "#1a1a1a" }}>
              Scenario Automations
            </Typography>
          </Box>
          <Button
            variant="contained"
            onClick={() => navigate("/scenario-automations/new")}
          >
            New Scenario
          </Button>
        </Box>

        <Box sx={{ flex: 1, minHeight: 0, overflow: "auto", p: 2 }}>
          <div className="w-full h-full flex flex-col items-center justify-center gap-2">
            <img src={emptyImg} alt="scenario" className="w-40" />
            <Typography>
              You haven’t created any scenario automations.{" "}
              <span
                className="text-blue-600 cursor-pointer hover:underline"
                onClick={() => navigate("/scenario-automations/new")}
              >
                Create New
              </span>
            </Typography>
          </div>
        </Box>
      </Box>

      {/* Right Sidebar */}
      <Box
        sx={{
          maxHeight: "calc(100vh - 100px)",
          overflowY: "auto",
          p: 2,
          bgcolor: "#f8f9fa",
          borderLeft: "1px solid #e0e0e0",
        }}
      >
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <Card sx={{ boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
            <CardContent>
              <Typography
                variant="h6"
                sx={{ fontWeight: 600, mb: 2, color: "#1a1a1a" }}
              >
                Scenario Automations
              </Typography>
              <Typography
                variant="body2"
                sx={{ lineHeight: 1.6, color: "#65676b" }}
              >
                Scenario Automations let you carry out a series of updates to
                the ticket with a single click. They help you quickly handle
                recurring scenarios. For example, you could create a scenario
                called “Assign to the Escalation team” and send an email to the
                Escalation team in a single click whenever an issue related to
                login is reported.
              </Typography>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Box>
  );
};

export default ScenarioAutomations;
