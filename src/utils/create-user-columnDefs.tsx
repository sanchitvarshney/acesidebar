import TextInputCellRenderer from "../USERMODULE/components/TextInputCellRenderer";

export const columns = [
  {
    field: "contact",
    headerName: "Contact",
    flex: 1,
    minWidth: 200,
    resizable: true ,
    sortable: false,
    filterable: false,

    renderCell: (params:any) => (
      <TextInputCellRenderer {...params} />
    ),
  },
  {
    field: "title",
    headerName: "Title",
    flex: 1,
    minWidth: 150,
    resizable: true ,
    sortable: false,
    filterable: false,
  
    renderCell: (params:any) => (
      <span style={{ color: "#666" }}>{params.value}</span>
    ),
  },
  {
    field: "company",
    headerName: "Company",
    flex: 1,
    minWidth: 180,
    resizable: true ,
    renderCell: (params:any) => (
      <span style={{ color: "#666" }}>{params.value}</span>
    ),
  },
  {
    field: "email",
    headerName: "Email address",
    flex: 1,
    minWidth: 200,
    resizable: true ,
    renderCell: (params:any) => (
      <span style={{ color: "#666" }}>{params.value}</span>
    ),
  },
  {
    field: "phone",
    headerName: "Work phone",
    flex: 1,
    minWidth: 140,
    resizable: true ,
    renderCell: (params:any) => (
      <span style={{ color: "#666" }}>{params.value}</span>
    ),
  },
  {
    field: "facebook",
    headerName: "Facebook",
    flex: 1,
    minWidth: 120,
    resizable: true ,
    renderCell: (params:any) => (
      <span style={{ color: "#666" }}>{params.value}</span>
    ),
  },
  {
    field: "twitter",
    headerName: "Twitter",
    flex: 1,
    minWidth: 120,
    resizable: true ,
    renderCell: (params:any) => (
      <span style={{ color: "#666" }}>{params.value}</span>
    ),
  },
  {
    field: "actions",
    headerName: "",
    width: 50,
    sortable: false,
    filterable: false,
    resizable: true ,
    renderCell: (params:any) => (
      <TextInputCellRenderer {...params} />
    ),
  },
];