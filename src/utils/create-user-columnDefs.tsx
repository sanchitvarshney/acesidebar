import { GridColDef } from "@mui/x-data-grid";
import { Chip, styled, Switch, Typography } from "@mui/material";
import TextInputCellRenderer from "../USERMODULE/components/TextInputCellRenderer";
import { Text } from "lucide-react";

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
  // {
  //   field: "roleType",
  //   headerName: "Title",
  //   flex: 0.8,
  //   minWidth: 150,
  //   sortable: true,
  //   filterable: true,
  //   renderCell: (params) => (
  //     <Chip
  //       label={params.value || "N/A"}
  //       size="small"
  //       variant="outlined"
  //       sx={{
  //         borderColor: "#e0e0e0",
  //         backgroundColor: "#f8f9fa",
  //         fontWeight: 500,
  //       }}
  //     />
  //   ),
  //   headerAlign: "left",
  //   align: "left",
  // },
  // {
  //   field: "company",
  //   headerName: "Company",
  //   flex: 1,
  //   minWidth: 180,
  //   sortable: true,
  //   filterable: true,
  //   renderCell: (params) => (
  //     <Typography
  //       variant="body2"
  //       sx={{
  //         color: "#424242",
  //         fontWeight: 500,
  //         overflow: "hidden",
  //         textOverflow: "ellipsis",
  //         whiteSpace: "nowrap",
  //       }}
  //     >
  //       {params.value || "-"}
  //     </Typography>
  //   ),
  //   headerAlign: "left",
  //   align: "left",
  // },
  {
    field: "email",
    headerName: "Email Address",
    flex: 1.2,
    minWidth: 220,
    sortable: true,
    filterable: true,
    renderCell: (params) => <TextInputCellRenderer {...params} />,
  },
  {
    field: "phoneNumber",
    headerName: "Mobile Number",
    flex: 0.9,
    minWidth: 140,
    sortable: true,
    filterable: true,
    renderCell: (params) => <TextInputCellRenderer {...params} />,
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
    <TextInputCellRenderer {...params} />
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
     <TextInputCellRenderer {...params} />
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






export const IconSwitch = styled(Switch)(({ theme }) => ({
  width: 46,
  height: 26,
  padding: 0,
  display: "flex",
  "& .MuiSwitch-switchBase": {
    padding: 2,
    "&.Mui-checked": {
      transform: "translateX(20px)",
      color: "#fff",
      "& + .MuiSwitch-track": {
        backgroundColor: "#22c55e", // green background when ON
        opacity: 1,
        border: 0,
      },
    },
  },
  "& .MuiSwitch-thumb": {
    backgroundColor: "#fff",
    width: 22,
    height: 22,
    borderRadius: "50%",
    boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
    position: "relative",
  },
  "& .MuiSwitch-track": {
    borderRadius: 26 / 2,
    backgroundColor: "#e4e6eb", // grey background when OFF
    opacity: 1,
    transition: theme.transitions.create(["background-color"], {
      duration: 300,
    }),
    position: "relative",
    "&:before, &:after": {
      content: '""',
      position: "absolute",
      top: "50%",
      transform: "translateY(-50%)",
      width: 14,
      height: 14,
      display: "inline-block",
      textAlign: "center",
      lineHeight: "14px",
      fontSize: 12,
      fontWeight: 700,
    },
    // Left check symbol
    "&:before": {
      left: 6,
      content: '"✓"',
      color: "#16a34a",
      opacity: 0.9,
    },
    // Right close symbol
    "&:after": {
      right: 6,
      content: '"✕"',
      color: "#7d8895",
      opacity: 0.9,
    },
  },
  // When checked, invert the symbol colors for better contrast
  "& .Mui-checked + .MuiSwitch-track": {
    "&:before": {
      color: "#ffffff",
    },
    "&:after": {
      color: "#e1e7ee",
    },
  },
}));
