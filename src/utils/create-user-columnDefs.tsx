import { GridColDef } from "@mui/x-data-grid";
import { Chip, Typography } from "@mui/material";
import TextInputCellRenderer from "../USERMODULE/components/TextInputCellRenderer";

export const columns: GridColDef[] = [
  {
    field: "contact",
    headerName: "Contact",
    flex: 1,
    minWidth: 220,
    sortable: true,
    filterable: true,
    renderCell: (params) => <TextInputCellRenderer {...params} />,
    headerAlign: "left",
    align: "left",
  },
  {
    field: "roleType",
    headerName: "Title",
    flex: 0.8,
    minWidth: 150,
    sortable: true,
    filterable: true,
    renderCell: (params) => (
      <Chip
        label={params.value || "N/A"}
        size="small"
        variant="outlined"
        sx={{
          borderColor: "#e0e0e0",
          backgroundColor: "#f8f9fa",
          fontWeight: 500,
        }}
      />
    ),
    headerAlign: "left",
    align: "left",
  },
  {
    field: "company",
    headerName: "Company",
    flex: 1,
    minWidth: 180,
    sortable: true,
    filterable: true,
    renderCell: (params) => (
      <Typography
        variant="body2"
        sx={{
          color: "#424242",
          fontWeight: 500,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {params.value || "-"}
      </Typography>
    ),
    headerAlign: "left",
    align: "left",
  },
  {
    field: "email",
    headerName: "Email Address",
    flex: 1.2,
    minWidth: 220,
    sortable: true,
    filterable: true,
    renderCell: (params) => (
      <Typography
        variant="body2"
        sx={{
          color: "#1976d2",
          textDecoration: "none",
          cursor: "pointer",
          "&:hover": { textDecoration: "underline" },
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
        onClick={() => window.open(`mailto:${params.value}`)}
      >
        {params.value || "-"}
      </Typography>
    ),
    headerAlign: "left",
    align: "left",
  },
  {
    field: "phoneNumber",
    headerName: "Work Phone",
    flex: 0.9,
    minWidth: 140,
    sortable: true,
    filterable: true,
    renderCell: (params) => (
      <Typography
        variant="body2"
        sx={{
          color: "#424242",
          fontFamily: "monospace",
          fontSize: "0.875rem",
        }}
      >
        {params.value || "-"}
      </Typography>
    ),
    headerAlign: "left",
    align: "left",
  },
  {
    field: "facebook",
    headerName: "Facebook",
    flex: 0.8,
    minWidth: 120,
    sortable: true,
    filterable: true,
    renderCell: (params) => (
      <Typography
        variant="body2"
        sx={{
          color: "#1877f2",
          cursor: params.value ? "pointer" : "default",
          "&:hover": params.value ? { textDecoration: "underline" } : {},
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
        onClick={() =>
          params.value &&
          window.open(`https://facebook.com/${params.value}`, "_blank")
        }
      >
        {params.value || "-"}
      </Typography>
    ),
    headerAlign: "left",
    align: "left",
  },
  {
    field: "twitter",
    headerName: "Twitter",
    flex: 0.8,
    minWidth: 120,
    sortable: true,
    filterable: true,
    renderCell: (params) => (
      <Typography
        variant="body2"
        sx={{
          color: "#1da1f2",
          cursor: params.value ? "pointer" : "default",
          "&:hover": params.value ? { textDecoration: "underline" } : {},
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
        onClick={() =>
          params.value &&
          window.open(`https://twitter.com/${params.value}`, "_blank")
        }
      >
        {params.value ? `@${params.value}` : "-"}
      </Typography>
    ),
    headerAlign: "left",
    align: "left",
  },
  {
    field: "actions",
    headerName: "Actions",
    width: 80,
    sortable: false,
    filterable: false,
    disableColumnMenu: true,
    renderCell: (params) => <TextInputCellRenderer {...params} />,
    headerAlign: "center",
    align: "center",
  },
];
