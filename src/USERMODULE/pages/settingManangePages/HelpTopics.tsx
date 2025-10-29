import { useState } from "react";

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
  TablePagination,
} from "@mui/material";
import ControlPointDuplicateIcon from "@mui/icons-material/ControlPointDuplicate";
import SearchIcon from "@mui/icons-material/Search";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import RefreshIcon from "@mui/icons-material/Refresh";
import { useNavigate } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import empty from "../../../assets/image/overview-empty-state.svg";
import { useToast } from "../../../hooks/useToast";

const helpTopicData = [
  {
    id: 1,
    topic: "Topic 1",
    status: "Active",
    type: "Type 1",
    priority: "Priority 1",
    department: "Department 1",
  },
  {
    id: 2,
    topic: "Topic 2",
    status: "Inactive",
    type: "Type 2",
    priority: "Priority 2",
    department: "Department 2",
  },
  {
    id: 3,
    topic: "Topic 3",
    status: "Active",
    type: "Type 3",
    priority: "Priority 3",
    department: "Department 3",
  },
];

const HelpTopics = () => {
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [rows, setRows] = useState<any[]>(helpTopicData);

  const [trackId, setTrackId] = useState<any>("");
  //   const fetchList = async (
  //     p = page,
  //     limit = rowsPerPage,
  //     search = searchTerm
  //   ) => {
  //     const params = { page: p + 1, limit, search };
  //     const res: any = await triggerGetList(params);
  //     const data = res?.data;
  //     const list =
  //       data?.data?.items ||
  //       data?.data?.list ||
  //       data?.items ||
  //       data?.list ||
  //       data?.data ||
  //       [];
  //     const total =
  //       data?.data?.total ||
  //       data?.total ||
  //       data?.pagination?.total ||
  //       list?.length ||
  //       0;
  //     setRows(Array.isArray(list) ? list : []);
  //     setTotalCount(Number(total) || 0);
  //   };

  //   useEffect(() => {
  //     fetchList();
  //     // eslint-disable-next-line react-hooks/exhaustive-deps
  //   }, [page, rowsPerPage]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchTerm(value);
    setPage(0);
    // fetchList(0, rowsPerPage, value);
  };

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newLimit = parseInt(event.target.value, 10);
    setRowsPerPage(newLimit);
    setPage(0);
  };
  //remove ban email
  const handleRemove = (data: any) => {
    // const payload = {
    //   email: data.email,
    //   ref: data.reference,
    // };
    // removeBanEmail(payload).then((res: any) => {
    //   if (res?.data?.type === "error") {
    //     showToast(res?.data?.message, "error");
    //     return;
    //   }
    //   if (res?.data?.type === "success") {
    //     showToast(res?.data?.message, "success");
    //     fetchList();
    //   }
    // });
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
            p: 2,
            borderBottom: "1px solid #e0e0e0",
            backgroundColor: "#fafafa",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <IconButton onClick={() => navigate("/settings/help-support")}>
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h5" sx={{ fontWeight: 600, color: "#1a1a1a" }}>
              Help Topics
            </Typography>
          </Box>
          <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
            {false ? <CircularProgress size={16} /> : null}
            <IconButton
              size="small"
              color="primary"
              //   onClick={() => fetchList()}
              sx={{ border: "1px solid #e0e0e0" }}
              aria-label="Refresh"
              title="Refresh"
            >
              <RefreshIcon fontSize="small" />
            </IconButton>

            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate("/settings/help-support/add-help-topics")}
              size="small"
              sx={{ fontWeight: 600 }}
              startIcon={<ControlPointDuplicateIcon />}
            >
              Add Help Topic
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
            placeholder="Search ..."
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
              height: "calc(100vh - 380px)",
              minHeight: "300px",
            }}
            className="custom-scrollbar"
          >
            <Table stickyHeader>
              <TableHead sx={{ position: "relative" }}>
                {false && (
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
                )}
                <TableRow sx={{ bgcolor: "#f8f9fa" }}>
                  <TableCell
                    sx={{
                      fontWeight: 600,
                      fontSize: "14px",
                      color: "#1a1a1a",
                      borderBottom: "2px solid #e0e0e0",
                    }}
                  >
                    Help Topic
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
                    Type
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: 600,
                      fontSize: "14px",
                      color: "#1a1a1a",
                      borderBottom: "2px solid #e0e0e0",
                    }}
                  >
                    Priority
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: 600,
                      fontSize: "14px",
                      color: "#1a1a1a",
                      borderBottom: "2px solid #e0e0e0",
                    }}
                  >
                    Department
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
                {rows.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      align="center"
                      sx={{ py: 8, border: "none" }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          gap: 2,
                        }}
                      >
                        <img src={empty} alt="No Data" className="w-40" />
                      </Box>
                    </TableCell>
                  </TableRow>
                ) : (
                  rows.map((row: any, index: number) => (
                    <TableRow
                      key={row.id || row.key || row._id || index}
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
                        {row.topic}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={row.status}
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
                        {row.type}
                      </TableCell>
                      <TableCell
                        sx={{
                          fontSize: "14px",
                          color: "#65676b",
                        }}
                      >
                        {row.priority}
                      </TableCell>
                      <TableCell
                        sx={{
                          fontSize: "14px",
                          color: "#65676b",
                        }}
                      >
                        {row.department}
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
                            onClick={() =>
                              navigate(`/settings/emails/add-new-banlist`, {
                                state: row,
                              })
                            }
                            size="small"
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                          <IconButton
                            aria-label="delete"
                            onClick={() => {
                              setTrackId(row.reference);
                              handleRemove(row);
                            }}
                            size="small"
                            sx={{
                              color: "red",
                            }}
                            // disabled={removeBanEmailLoading}
                          >
                            {/* {removeBanEmailLoading &&
                            row.reference === trackId ? (
                              <CircularProgress size={16} color="error" />
                            ) : ( */}
                            <DeleteIcon fontSize="small" />
                            {/* )} */}
                          </IconButton>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            sx={{ borderTop: "1px solid #e0e0e0" }}
            component="div"
            count={totalCount}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[10, 20, 50]}
          />
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
        className="custom-scrollbar"
      >
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          {/* Banned Email List */}
          <Card sx={{ boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
            <CardContent>
              <Typography
                variant="h6"
                sx={{ fontWeight: 600, mb: 2, color: "#1a1a1a" }}
              >
                Help Topics
              </Typography>
              <Typography
                variant="body2"
                sx={{ lineHeight: 1.6, color: "#65676b", mb: 2 }}
              >
                The Help Topics section provides users and administrators with
                quick access to guidance, explanations, and best practices for
                using different parts of the system. Each topic covers a
                specific area such as security, account management, or
                notifications, ensuring users can easily find the information
                they need.
              </Typography>

              <Typography
                variant="body2"
                sx={{ lineHeight: 1.6, color: "#65676b", mt: 2 }}
              >
                Keeping help topics up to date ensures that users always have
                access to accurate, relevant information, improving efficiency
                and reducing support requests.
              </Typography>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Box>
  );
};

export default HelpTopics;
