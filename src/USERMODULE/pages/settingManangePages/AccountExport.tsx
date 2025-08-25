import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import {
  Avatar,
  Box,
  Button,
  Chip,
  LinearProgress,
  Typography,
} from "@mui/material";

const columns: GridColDef[] = [
  {
    field: "initiatedBy",
    headerName: "Initiated By",
    flex: 1,
    sortable: false,
    headerAlign: "left",
    align: "left",
    renderCell: (params) => {
      const name: string = params.value || "";
      const avatarSrc: string | undefined = params.row?.initiatedByAvatar;

      return (
        <Box
          sx={{ display: "flex", alignItems: "center", gap: 1, minWidth: 0 }}
        >
          <Avatar src={avatarSrc} sx={{ width: 28, height: 28 }}>
            {name?.charAt(0) || "?"}
          </Avatar>
          <Typography variant="body2" noWrap>
            {name}
          </Typography>
        </Box>
      );
    },
  },
  {
    field: "initiatedAt",
    headerName: "Initiated At",
    flex: 1,
    sortable: false,
    headerAlign: "left",
    align: "left",
  },
  { field: "type", headerName: "Type", flex: 1 },
  {
    field: "status",
    headerName: "Status",
    flex: 1,
    sortable: false,
    headerAlign: "center",
    align: "center",
    renderCell: (params) => {
      const status: string = (params.value || "").toString();
      const normalized = status.toLowerCase();
      const color =
        normalized === "completed"
          ? "success"
          : normalized === "pending"
          ? "warning"
          : "default";
      return (
        <Chip
          size="small"
          label={status}
          color={color as any}
          variant={color === "default" ? "outlined" : "filled"}
        />
      );
    },
  },
  {
    field: "process",
    headerName: "Process",
    flex: 1,
    sortable: false,
    headerAlign: "left",
    align: "left",
    renderCell: (params) => {
      const value = Number(params.value) || 0; // Expecting process to be a number (0–100)

      return (
        <Box
          sx={{ width: "100%", display: "flex", alignItems: "center", gap: 1 }}
        >
          <Typography
            variant="caption"
            sx={{ minWidth: 36 }}
          >{`${value}%`}</Typography>
          <LinearProgress
            variant="determinate"
            value={value}
            sx={{ flexGrow: 1, height: 8, borderRadius: 4 }}
          />
        </Box>
      );
    },
  },
  {
    field: "export",
    headerName: "Export file",
    flex: 1,
    sortable: false,
    headerAlign: "center",
    align: "center",
    renderCell: () => {
      return (
        <Button variant="text" size="small" color="primary">
          Download
        </Button>
      );
    },
  },
  {
    field: "details",
    headerName: "Details",
    flex: 1,
    sortable: false,
    headerAlign: "center",
    align: "center",
    renderCell: (params) => {
      const value = params.value; // Expecting process to be a number (0–100)

      return (
        <Button variant="contained" color="inherit">
          Details
        </Button>
      );
    },
  },
];

const rows = [
  {
    id: 1,
    initiatedBy: "Developer",
    initiatedByAvatar: "",
    initiatedAt: "11 Aug at 10:00 pm",
    type: "Export",
    status: "Completed",
    process: 100,
  },
  {
    id: 2,
    initiatedBy: "Admin",
    initiatedByAvatar: "",
    initiatedAt: "12 Aug at 02:00 pm",
    type: "Backup",
    status: "Pending",
    process: 80,
  },
];

const AccountExport = () => {
  return (
    <Paper sx={{ width: "100%" }}>
      <DataGrid
        rows={rows}
        columns={columns.map((col) => ({ ...col, editable: false }))}
        rowHeight={56}
        hideFooterPagination
        hideFooterSelectedRowCount
        autoHeight
        sx={{
          border: 0,
          "& .MuiDataGrid-cell": {
            display: "flex",
            alignItems: "center",
          },
          "& .MuiDataGrid-cellContent": {
            width: "100%",
          },
          "& .MuiDataGrid-cell:focus": {
            outline: "none !important",
          },
          "& .MuiDataGrid-cell:focus-within": {
            outline: "none !important",
          },
          "& .MuiDataGrid-cell.Mui-selected": {
            backgroundColor: "transparent !important",
          },
          "& .MuiDataGrid-cell.Mui-selected:hover": {
            backgroundColor: "transparent !important",
          },
          "& .MuiDataGrid-cell:focus-visible": {
            outline: "none !important",
          },
        }}
        //@ts-ignore
        columnResizeMode="onChange"
        disableColumnResize={false}
        disableRowSelectionOnClick
        disableCellSelection
        disableColumnSelection
      />
    </Paper>
  );
};

export default AccountExport;
