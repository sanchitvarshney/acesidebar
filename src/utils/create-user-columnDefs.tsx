export const columnDefs = [
  {
    headerName: "",
    field: "checkbox",
    maxWidth: 50,
    cellRenderer: "textInputCellRenderer",
    sortable: false,
    filter: false,
    resizable: false,
    cellStyle: {
      display: "flex",
      justifyContent: "center",
    },
  },
  {
    headerName: "Contact",
    field: "contact",
    minWidth: 200,
    flex: 1,
    cellRenderer: "textInputCellRenderer",
    sortable: false,
    filter: false,
    cellStyle: {
      display: "flex",
      justifyContent: "flex-start",
    },
  },
  {
    headerName: "Title",
    field: "title",
    minWidth: 150,
    flex: 1,

    cellRenderer: "textInputCellRenderer",
    sortable: false,
    filter: false,
    cellStyle: {
      display: "flex",
      justifyContent: "flex-start",
      color: "#666",
    },
  },
  {
    headerName: "Company",
    field: "company",
    minWidth: 180,
    flex: 1,

    cellRenderer: "textInputCellRenderer",
    sortable: false,
    filter: false,
    cellStyle: {
      display: "flex",
      justifyContent: "flex-start",
      color: "#666",
    },
  },
  {
    headerName: "Email address",
    field: "email",
    minWidth: 200,
    flex: 1,

    cellRenderer: "textInputCellRenderer",
    sortable: false,
    filter: false,
    cellStyle: {
      display: "flex",
      justifyContent: "flex-start",
      color: "#666",
    },
  },
  {
    headerName: "Work phone",
    field: "phone",
    minWidth: 140,
    flex: 1,

    cellRenderer: "textInputCellRenderer",
    sortable: false,
    filter: false,
    cellStyle: {
      display: "flex",
      justifyContent: "flex-start",
      color: "#666",
    },
  },
  {
    headerName: "Facebook",
    field: "facebook",
    minWidth: 120,
    flex: 1,

    cellRenderer: "textInputCellRenderer",
    sortable: false,
    filter: false,
    cellStyle: {
      display: "flex",
      justifyContent: "flex-start",
      color: "#666",
    },
  },
  {
    headerName: "Twitter",
    field: "twitter",
    minWidth: 120,
    flex: 1,

    cellRenderer: "textInputCellRenderer",
    sortable: false,
    filter: false,
    cellStyle: {
      display: "flex",
      justifyContent: "flex-start",
      color: "#666",
    },
  },
  {
    headerName: "",
    field: "actions",
      maxWidth: 50,
    cellRenderer: "textInputCellRenderer",
    sortable: false,
    filter: false,
    resizable: false,
       cellStyle: {
      display: "flex",
      justifyContent: "center",
      color: "#666",
    },
  },
];
