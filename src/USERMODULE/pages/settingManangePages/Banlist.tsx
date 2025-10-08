import { useState, useEffect } from "react";

import {
  Box,
  Button,
  IconButton,
  Typography,
  TextField,
  Chip,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  LinearProgress,
  CircularProgress,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import RefreshIcon from "@mui/icons-material/Refresh";
import { useNavigate } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

const banned_emails = [
  {
    id: 1,
    email: "spamuser@example.com",
    status: "banned",
    date_added: "2025-10-01T10:23:45Z",
    date_updated: "2025-10-05T15:12:00Z",
  },
  {
    id: 2,
    email: "bot123@fakeemail.com",
    status: "banned",
    date_added: "2025-09-20T09:00:00Z",
    date_updated: "2025-09-21T14:30:00Z",
  },
  {
    id: 3,
    email: "malicious.user@phishmail.net",
    status: "banned",
    date_added: "2025-10-03T18:45:12Z",
    date_updated: "2025-10-06T11:00:30Z",
  },
  {
    id: 4,
    email: "testspam@randommail.org",
    status: "pending_review",
    date_added: "2025-10-07T08:30:00Z",
    date_updated: "2025-10-07T09:00:00Z",
  },
];

const Banlist = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredTeams, setFilteredTeams] = useState(banned_emails);
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchTerm(value);
    applyFilters(value);
  };
  const applyFilters = (search: string) => {
    let filtered = banned_emails;

    // Search filter
    if (search) {
      filtered = filtered.filter((team) =>
        team.email.toLowerCase().includes(search.toLowerCase())
      );
    }

    setFilteredTeams(filtered);
  };

  return (
    <Box
      sx={{
        height: "calc(100vh - 100px)",
        display: "grid",
        gridTemplateColumns: "3fr 1fr",
        overflow: "hidden",
      }}
    >
      {/* Left Content */}
      <Box sx={{ p: 2, display: "flex", flexDirection: "column", gap: 2 }}>
        {/* Header Section */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 1,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <IconButton onClick={() => navigate("/settings/emails")}>
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h5" sx={{ fontWeight: 600, color: "#1a1a1a" }}>
              Banned Email Addresses
            </Typography>
          </Box>
          <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
            {/* {agentListLoading ? (
              <CircularProgress size={16} />
            ) : ( */}
            <IconButton
              size="small"
              color="primary"
              // onClick={() => getAgentList()}

              sx={{ border: "1px solid #e0e0e0" }}
              aria-label="Refresh"
              title="Refresh"
            >
              <RefreshIcon fontSize="small" />
            </IconButton>
            {/* )} */}

            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate("/settings/emails/add-new-banlist")}
              size="small"
            >
              Ban New Email
            </Button>
          </Box>
        </Box>
        <Box
          sx={{
            display: "flex",
            gap: 2,
            alignItems: "center",
            flexWrap: "wrap",
            p: 2,
            bgcolor: "#f8f9fa",
            borderRadius: 2,
          }}
        >
          <TextField
            size="small"
            placeholder="Search Email Address"
            value={searchTerm}
            onChange={handleSearch}
            InputProps={{
              startAdornment: <SearchIcon sx={{ color: "#666", mr: 1 }} />,
            }}
            sx={{ minWidth: 250 }}
          />
        </Box>

        {/* Table Section */}
        <Card sx={{ flex: 1, boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
          <TableContainer
            sx={{
              height: "calc(100vh - 280px)",
              minHeight: "400px",
            }}
          >
            <Table stickyHeader>
              <TableHead sx={{ position: "relative" }}>
                {/* Linear Progress Loader in Header */}
                {/* {agentListLoading && (
                  <LinearProgress
                    sx={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      zIndex: 10,
                      height: 4,
                      "& .MuiLinearProgress-bar": {
                        backgroundColor: "#1976d2",
                      },
                      "& .MuiLinearProgress-root": {
                        backgroundColor: "#e0e0e0",
                      },
                    }}
                  />
                )} */}
                <TableRow sx={{ bgcolor: "#f8f9fa" }}>
                  <TableCell
                    sx={{
                      fontWeight: 600,
                      fontSize: "14px",
                      color: "#1a1a1a",
                      borderBottom: "2px solid #e0e0e0",
                    }}
                  >
                    Email
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: 600,
                      fontSize: "14px",
                      color: "#1a1a1a",
                      borderBottom: "2px solid #e0e0e0",
                    }}
                  >
                    Status
                  </TableCell>

                  <TableCell
                    sx={{
                      fontWeight: 600,
                      fontSize: "14px",
                      color: "#1a1a1a",
                      borderBottom: "2px solid #e0e0e0",
                    }}
                  >
                    Date Added
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: 600,
                      fontSize: "14px",
                      color: "#1a1a1a",
                      borderBottom: "2px solid #e0e0e0",
                    }}
                  >
                    Last Updated
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: 600,
                      fontSize: "14px",
                      color: "#1a1a1a",
                      borderBottom: "2px solid #e0e0e0",
                    }}
                  />
                </TableRow>
              </TableHead>

              <TableBody>
                {filteredTeams.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center" sx={{ py: 6 }}>
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          gap: 2,
                        }}
                      >
                        <Typography variant="h6" color="textSecondary">
                          No agents found
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          Create a new agent to get started
                        </Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                ) : (
                  banned_emails.map((row: any, index: number) => (
                    <TableRow
                      key={row.id || row.key || index}
                      hover
                      sx={{
                        "&:last-child td, &:last-child th": { border: 0 },
                        "&:hover": {
                          bgcolor: "#f8f9fa",
                        },
                      }}
                    >
                      <TableCell
                        sx={{
                          fontWeight: 500,
                          fontSize: "15px",
                          color: "#1a1a1a",
                        }}
                      >
                        {row.email}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={row.status || "N/A"}
                          size="small"
                          sx={{
                            bgcolor: "#e3f2fd",
                            color: "#1976d2",
                            fontWeight: 500,
                            fontSize: "11px",
                          }}
                        />
                      </TableCell>
                      <TableCell
                        sx={{
                          fontSize: "14px",
                          color: "#65676b",
                        }}
                      >
                        {row.date_added || "Not assigned"}
                      </TableCell>
                      <TableCell
                        sx={{
                          fontSize: "14px",
                          color: "#65676b",
                        }}
                      >
                        {row.last_updated || "Not assigned"}
                      </TableCell>
                      <TableCell
                        sx={{
                          fontSize: "14px",
                          color: "#65676b",
                        }}
                      >
                        <div className="flex gap-2">
                          <IconButton
                            aria-label="edit"
                            onClick={() => navigate(`/settings/emails/add-new-banlist`, { state: row })}
                            size="small"
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                          <IconButton
                            aria-label="delete"
                            onClick={() => {}}
                            size="small"
                            sx={{
                              color: "red",
                            }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
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
      >
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          {/* Banned Email List */}
          <Card sx={{ boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
            <CardContent>
              <Typography
                variant="h6"
                sx={{ fontWeight: 600, mb: 2, color: "#1a1a1a" }}
              >
                Banned Email List
              </Typography>
              <Typography
                variant="body2"
                sx={{ lineHeight: 1.6, color: "#65676b", mb: 2 }}
              >
                The banned email list contains addresses that are restricted
                from accessing or registering within the system. This feature
                helps maintain system integrity and prevent unwanted activity
                such as spam, abuse, or fraudulent sign-ups.
              </Typography>

              <Typography
                variant="subtitle2"
                sx={{ fontWeight: 600, color: "#1a1a1a", mb: 1 }}
              >
                Key Details:
              </Typography>
              <Box component="ul" sx={{ pl: 2, m: 0, "& li": { mb: 1 } }}>
                <Typography
                  component="li"
                  variant="body2"
                  sx={{ lineHeight: 1.6, color: "#65676b" }}
                >
                  <Box
                    component="span"
                    sx={{ fontWeight: 600, color: "#1877f2" }}
                  >
                    Email:
                  </Box>{" "}
                  The address of the banned user or domain.
                </Typography>
                <Typography
                  component="li"
                  variant="body2"
                  sx={{ lineHeight: 1.6, color: "#65676b" }}
                >
                  <Box
                    component="span"
                    sx={{ fontWeight: 600, color: "#1877f2" }}
                  >
                    Status:
                  </Box>{" "}
                  Indicates whether the email is{" "}
                  <Box component="span" sx={{ fontWeight: 600 }}>
                    banned
                  </Box>
                  ,{" "}
                  <Box component="span" sx={{ fontWeight: 600 }}>
                    under review
                  </Box>
                  , or{" "}
                  <Box component="span" sx={{ fontWeight: 600 }}>
                    unbanned
                  </Box>
                  .
                </Typography>
                <Typography
                  component="li"
                  variant="body2"
                  sx={{ lineHeight: 1.6, color: "#65676b" }}
                >
                  <Box
                    component="span"
                    sx={{ fontWeight: 600, color: "#1877f2" }}
                  >
                    Date Added / Updated:
                  </Box>{" "}
                  Shows when the email was added to or modified in the ban list
                  for audit and tracking purposes.
                </Typography>
              </Box>

              <Typography
                variant="body2"
                sx={{ lineHeight: 1.6, color: "#65676b", mt: 2 }}
              >
                Regularly reviewing and updating the ban list ensures only
                verified users can access your services, improving overall
                system security and reliability.
              </Typography>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Box>
  );
};

export default Banlist;
