import React, { useState } from "react";
import {
    Box,
    Typography,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    Chip,
    Menu,
    MenuItem,
} from "@mui/material";
import {
    Add as AddIcon,
    MoreVert as MoreVertIcon,
    ArrowUpward as ArrowUpwardIcon,
    ArrowDownward as ArrowDownwardIcon,
    Settings as SettingsIcon,
} from "@mui/icons-material";
import AddFilterDrawer from "../../components/reusable/AddFilterDrawer";

const TicketFilters: React.FC = () => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [sortColumn, setSortColumn] = useState<string>("name");
    const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
    const [addFilterDrawerOpen, setAddFilterDrawerOpen] = useState(false);

    const handleMoreClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMoreClose = () => {
        setAnchorEl(null);
    };

    const handleFilterSave = (filterData: any) => {
        console.log("Filter saved:", filterData);
        // Handle saving the filter data here
        // You can add API calls or state updates as needed
    };

    const handleSort = (column: string) => {
        if (sortColumn === column) {
            setSortDirection(sortDirection === "asc" ? "desc" : "asc");
        } else {
            setSortColumn(column);
            setSortDirection("asc");
        }
    };

    const getSortIcon = (column: string) => {
        if (sortColumn !== column) {
            return (
                <Box sx={{ display: "flex", flexDirection: "column", ml: 0.5 }}>
                    <ArrowUpwardIcon sx={{ fontSize: 12, color: "#ccc" }} />
                    <ArrowDownwardIcon sx={{ fontSize: 12, color: "#ccc" }} />
                </Box>
            );
        }
        return sortDirection === "asc" ? (
            <ArrowUpwardIcon sx={{ fontSize: 12, ml: 0.5 }} />
        ) : (
            <ArrowDownwardIcon sx={{ fontSize: 12, ml: 0.5 }} />
        );
    };

    return (
        <Box sx={{ p: 3, backgroundColor: "#f8f9fa", minHeight: "100vh" }}>
            {/* Header */}
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                <Typography variant="h4" sx={{ fontWeight: 600, color: "#1976d2" }}>
                    Ticket Filters
                </Typography>
                
                <Box sx={{ display: "flex", gap: 1 }}>
                    <Button
                        variant="outlined"
                        startIcon={<AddIcon />}
                        onClick={() => setAddFilterDrawerOpen(true)}
                        sx={{
                            backgroundColor: "white",
                            color: "#333",
                            borderColor: "#d0d0d0",
                            "&:hover": {
                                backgroundColor: "#f5f5f5",
                                borderColor: "#b0b0b0",
                            }
                        }}
                    >
                        Add New Filter
                    </Button>
                    
                    <Button
                        variant="outlined"
                        startIcon={<SettingsIcon />}
                        endIcon={<ArrowDownwardIcon sx={{ fontSize: 16 }} />}
                        onClick={handleMoreClick}
                        sx={{
                            backgroundColor: "white",
                            color: "#333",
                            borderColor: "#d0d0d0",
                            "&:hover": {
                                backgroundColor: "#f5f5f5",
                                borderColor: "#b0b0b0",
                            }
                        }}
                    >
                        More
                    </Button>
                </Box>
            </Box>

            {/* Table */}
            <TableContainer component={Paper} sx={{ boxShadow: "none", border: "1px solid #e0e0e0" }}>
                <Table>
                    <TableHead>
                        <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                            <TableCell
                                sx={{
                                    fontWeight: 600,
                                    color: "#333",
                                    cursor: "pointer",
                                    backgroundColor: sortColumn === "name" ? "#e3f2fd" : "transparent",
                                    "&:hover": { backgroundColor: "#e3f2fd" }
                                }}
                                onClick={() => handleSort("name")}
                            >
                                <Box sx={{ display: "flex", alignItems: "center" }}>
                                    Name
                                    {getSortIcon("name")}
                                </Box>
                            </TableCell>
                            <TableCell
                                sx={{
                                    fontWeight: 600,
                                    color: "#333",
                                    cursor: "pointer",
                                    "&:hover": { backgroundColor: "#e3f2fd" }
                                }}
                                onClick={() => handleSort("status")}
                            >
                                <Box sx={{ display: "flex", alignItems: "center" }}>
                                    Status
                                    {getSortIcon("status")}
                                </Box>
                            </TableCell>
                            <TableCell
                                sx={{
                                    fontWeight: 600,
                                    color: "#333",
                                    cursor: "pointer",
                                    "&:hover": { backgroundColor: "#e3f2fd" }
                                }}
                                onClick={() => handleSort("order")}
                            >
                                <Box sx={{ display: "flex", alignItems: "center" }}>
                                    Order
                                    {getSortIcon("order")}
                                </Box>
                            </TableCell>
                            <TableCell
                                sx={{
                                    fontWeight: 600,
                                    color: "#333",
                                    cursor: "pointer",
                                    "&:hover": { backgroundColor: "#e3f2fd" }
                                }}
                                onClick={() => handleSort("rules")}
                            >
                                <Box sx={{ display: "flex", alignItems: "center" }}>
                                    Rules
                                    {getSortIcon("rules")}
                                </Box>
                            </TableCell>
                            <TableCell
                                sx={{
                                    fontWeight: 600,
                                    color: "#333",
                                    cursor: "pointer",
                                    "&:hover": { backgroundColor: "#e3f2fd" }
                                }}
                                onClick={() => handleSort("target")}
                            >
                                <Box sx={{ display: "flex", alignItems: "center" }}>
                                    Target
                                    {getSortIcon("target")}
                                </Box>
                            </TableCell>
                            <TableCell
                                sx={{
                                    fontWeight: 600,
                                    color: "#333",
                                    cursor: "pointer",
                                    "&:hover": { backgroundColor: "#e3f2fd" }
                                }}
                                onClick={() => handleSort("dateAdded")}
                            >
                                <Box sx={{ display: "flex", alignItems: "center" }}>
                                    Date Added
                                    {getSortIcon("dateAdded")}
                                </Box>
                            </TableCell>
                            <TableCell
                                sx={{
                                    fontWeight: 600,
                                    color: "#333",
                                    cursor: "pointer",
                                    "&:hover": { backgroundColor: "#e3f2fd" }
                                }}
                                onClick={() => handleSort("lastUpdated")}
                            >
                                <Box sx={{ display: "flex", alignItems: "center" }}>
                                    Last Updated
                                    {getSortIcon("lastUpdated")}
                                </Box>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow>
                            <TableCell colSpan={7} sx={{ textAlign: "center", py: 4, backgroundColor: "#f5f5f5" }}>
                                <Typography variant="body1" color="text.secondary">
                                    No filters found
                                </Typography>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>

            {/* More Menu */}
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMoreClose}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right",
                }}
                transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                }}
            >
                <MenuItem onClick={handleMoreClose}>Import Filters</MenuItem>
                <MenuItem onClick={handleMoreClose}>Export Filters</MenuItem>
                <MenuItem onClick={handleMoreClose}>Bulk Actions</MenuItem>
                <MenuItem onClick={handleMoreClose}>Settings</MenuItem>
            </Menu>

            {/* Add Filter Drawer */}
            <AddFilterDrawer
                open={addFilterDrawerOpen}
                onClose={() => setAddFilterDrawerOpen(false)}
                onSave={handleFilterSave}
            />
        </Box>
    );
};

export default TicketFilters;
