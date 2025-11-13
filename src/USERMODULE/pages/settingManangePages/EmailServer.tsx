import React, { use, useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  IconButton,
  Card,
  CardContent,
  Button,
  TextField,
  TableContainer,
  Table,
  TableHead,
  LinearProgress,
  TableRow,
  TableCell,
  TableBody,
  Chip,
  CircularProgress,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate } from "react-router-dom";
import { SettingsIcon } from "lucide-react";
import { Delete, Stars } from "@mui/icons-material";
import {
  useDeleteEmailServerMutation,
  useGetEmailServerListQuery,
} from "../../../services/agentServices";
import { useToast } from "../../../hooks/useToast";

const EmailServerPage: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredTeams, setFilteredTeams] = useState<any>();
  const [trackItem, setTrackItem] = useState<any>(null);
  const {
    data: emailServerList,
    isLoading: emailServerLoading,
    refetch,
  } = useGetEmailServerListQuery({});
  const [deleteEmailServer, { isLoading: deleteEmailServerLoading }] =
    useDeleteEmailServerMutation();

  const handleDeleteItem = (itemId: any) => {
    const payload = {
      key: itemId,
    };
    deleteEmailServer(payload).then((res: any) => {
      console.log("res", res);
      if (res?.data?.type === "error") {
        showToast(res?.data?.message, "error");
        return;
      }
      if (res?.data?.type === "success") {
        showToast(res?.data?.message, "success");
        refetch();
      }
    });
  };

  useEffect(() => {
    setFilteredTeams(emailServerList);
  }, [emailServerList]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchTerm(value);
  };

  useEffect(() => {
    if (emailServerList) {
      let filtered = emailServerList;

      if (searchTerm.trim() !== "") {
        filtered = emailServerList.filter(
          (team: any) =>
            team.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            team.email?.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      setFilteredTeams(filtered);
    }
  }, [emailServerList, searchTerm]);
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
      <Box sx={{ p: 0, display: "flex", flexDirection: "column", gap: 2 }}>
        {/* Header Section */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            p: 2,
            borderBottom: "1px solid #e0e0e0",
            backgroundColor: "#fafafa",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <IconButton onClick={() => navigate("/settings/emails")}>
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h5" sx={{ fontWeight: 600, color: "#1a1a1a" }}>
              Email Server
            </Typography>
          </Box>

          <Box sx={{ display: "flex", gap: 2 }}>
            <Button
              variant="outlined"
              color="primary"
              onClick={() =>
                navigate("/settings/emails/email-settings-advanced")
              }
              size="small"
              sx={{ fontWeight: 600 }}
              startIcon={<SettingsIcon size={18} />}
            >
              Advanced setting
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate("/settings/emails/new-support-email")}
              size="small"
              sx={{ fontWeight: 600 }}
            >
              New support email
            </Button>
          </Box>
        </Box>
        {/* Filter Section */}
        <Box
          sx={{
            display: "flex",
            gap: 2,
            alignItems: "center",
            flexWrap: "wrap",
            borderRadius: 2,
            px: 2,
          }}
        >
          <TextField
            size="small"
            placeholder="Search email addresses"
            value={searchTerm}
            onChange={handleSearch}
            InputProps={{
              startAdornment: <SearchIcon sx={{ color: "#666", mr: 1 }} />,
            }}
            sx={{ minWidth: 250 }}
          />
        </Box>
        <div className="w-full max-h-[calc(100vh-180px)] px-2 overflow-y-auto custom-scrollbar">
          {/* Teams Table */}
          <Paper sx={{ flex: 1, overflow: "hidden" }}>
            <TableContainer sx={{ height: "100%" }}>
              <Table stickyHeader sx={{ position: "relative" }}>
                <TableHead>
                  {emailServerLoading && (
                    <LinearProgress
                      sx={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        zIndex: 10,
                        height: 4,
                        "& .MuiLinearProgress-bar": {
                          backgroundColor: "#2566b0",
                        },
                        "& .MuiLinearProgress-root": {
                          backgroundColor: "#e0e0e0",
                        },
                      }}
                    />
                  )}
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600, bgcolor: "#f8f9fa" }}>
                      Name
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600, bgcolor: "#f8f9fa" }}>
                      Email address
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600, bgcolor: "#f8f9fa" }}>
                      Created
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600, bgcolor: "#f8f9fa" }}>
                      Status
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600, bgcolor: "#f8f9fa" }}>
                      Action
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredTeams?.map((row: any, index: any) => (
                    <TableRow key={row?.key} hover>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {row?.name}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{row.email}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {row?.insert?.dt}
                        </Typography>
                      </TableCell>

                      <TableCell>
                        <Chip
                          label={row.isActive ? "Active" : "Inactive"}
                          color={row.isActive ? "success" : "error"}
                          variant={row.isActive ? "filled" : "outlined"}
                          size="small"
                          sx={{
                            fontWeight: 500,
                            textTransform: "capitalize",
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            setTrackItem(row?.key);
                            handleDeleteItem(row?.key);
                          }}
                        >
                          {deleteEmailServerLoading &&
                          row?.key === trackItem ? (
                            <CircularProgress size={20} />
                          ) : (
                            <Delete fontSize="small" color="error" />
                          )}
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </div>
      </Box>

      {/* Right Sidebar */}
      <Box
        sx={{
          maxHeight: "calc(100vh - 100px)",
          overflowY: "auto",
          p: 3,
          bgcolor: "#f8f9fa",
          borderLeft: "1px solid #e0e0e0",
        }}
        className="custom-scrollbar"
      >
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <Card sx={{ boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
            <CardContent>
              <Typography
                variant="h6"
                sx={{ fontWeight: 600, mb: 2, color: "#1a1a1a" }}
              >
                Connect your email
              </Typography>
              <Typography
                variant="body2"
                sx={{ lineHeight: 1.6, color: "#65676b" }}
              >
                Enter your support email address to get started. Any email sent
                here will automatically convert into a ticket you can work on.
              </Typography>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Box>
  );
};

export default EmailServerPage;
