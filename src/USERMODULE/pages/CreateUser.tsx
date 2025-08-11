import { useEffect, useMemo, useRef, useState } from "react";

import { AgGridReact } from "ag-grid-react";
import { columns } from "../../utils/create-user-columnDefs";
import { OverlayNoRowsTemplate } from "../config/commanAgGridConfig";
import { Button, Checkbox, Paper, Typography } from "@mui/material";
import TextInputCellRenderer from "../components/TextInputCellRenderer";
import { SearchIcon } from "lucide-react";
import PlayForWorkIcon from "@mui/icons-material/PlayForWork";
import { DataGrid, GridColDef } from "@mui/x-data-grid";

const rowData: any = [
  {
    id: 1,
    name: "Bob Tree",
    title: "CEO",
    company: "Freshworks",
    email: "bob.tree@freshdesk.com",
    phone: "8295701297",
    facebook: "--",
    twitter: "--",
    avatar: null,
  },
  {
    id: 2,
    name: "Emily Garcia",
    title: "Associate Director",
    company: "Acme Inc",
    email: "emily.garcia@acme.com",
    phone: "+1448081698824",
    facebook: "--",
    twitter: "--",
    avatar: null,
  },
  {
    id: 3,
    name: "Emily Dean",
    title: "Chartered Accountant",
    company: "Global Learning Inc",
    email: "emily.dean@globallearning.org",
    phone: "257715491",
    facebook: "--",
    twitter: "--",
    avatar: null,
  },
  {
    id: 4,
    name: "Johnny Appleseed",
    title: "Manager Customer Support",
    company: "Jet Propulsion Laboratory, NASA",
    email: "johnny.appleseed@jpl.gov",
    phone: "123412834",
    facebook: "--",
    twitter: "--",
    avatar: null,
  },
  {
    id: 5,
    name: "Sarah James",
    title: "Manager Public relations",
    company: "Advanced Machinery",
    email: "sarah.james@advancedmachinery.com",
    phone: "1855747676",
    facebook: "--",
    twitter: "--",
    avatar: null,
  },
  {
    id: 6,
    name: "Test Name",
    title: "--",
    company: "--",
    email: "bobiga8081@hostbyt.com",
    phone: "--",
    facebook: "--",
    twitter: "--",
    avatar: null,
  },
  {
    id: 7,
    name: "tr4mr82aym@vwhins.com",
    title: "--",
    company: "--",
    email: "tr4mr82aym@vwhins.com",
    phone: "--",
    facebook: "--",
    twitter: "--",
    avatar: null,
  },
];

const CreateUser = () => {
  // const gridRef = useRef<AgGridReact<any>>(null);
  // const [isAllSelect, setIsAllSelect] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const filterData = searchQuery
    ? rowData.filter((row: any) =>
        Object.values(row).some((value: any) =>
          value?.toString().toLowerCase().includes(searchQuery.toLowerCase())
        )
      )
    : rowData;

  //   useEffect(() => {
  //    //@ts-ignore
  //  gridRef.current?.api?.paginationSetPageSize(20);
  // console.log(gridRef.current)
  //   }, [])

  const paginationModel = { page: 0, pageSize: 10 };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center ">
          <div className={` transition-all duration-200  w-[300px] relative`}>
            <div className="flex items-center w-full bg-white border border-gray-300 rounded-full px-4 py-2  shadow-sm transition-shadow focus-within:shadow-[0_1px_6px_rgba(32,33,36,0.28)] hover:shadow-[0_1px_6px_rgba(32,33,36,0.28)] ">
              <SearchIcon className="text-gray-500 mr-3" size={18} />
              <input
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                }}
                type="text"
                placeholder="Search…"
                className="flex-1 bg-transparent outline-none text-gray-800 text-[15px] leading-tight placeholder-gray-500"
              />
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="contained"
            size="small"
            sx={{ "&:hover": { bgcolor: "#1b66c9" } }}
          >
            <Typography variant="subtitle1">
              <PlayForWorkIcon
                fontSize="small"
                sx={{ transform: "rotate(180deg)" }}
              />{" "}
              Export
            </Typography>
          </Button>
          <Button
            variant="contained"
            size="small"
            sx={{ "&:hover": { bgcolor: "#1b66c9" } }}
          >
            <Typography variant="subtitle1">
              <PlayForWorkIcon fontSize="small" /> Import
            </Typography>
          </Button>
        </div>
      </div>
      <div className=" h-[calc(100vh-155px)] w-full ">
        <DataGrid
          rows={filterData}
          columns={columns}
          initialState={{ pagination: { paginationModel } }}
          pageSizeOptions={[10, 20, 30, 100]}
          checkboxSelection
          //@ts-ignore
          columnResizeMode="onChange" // ✅ correct prop name for controlling resize behavior
          sx={{ border: 0, height: 600 }}
          autoHeight={false} // ✅ keep fixed height
          disableColumnResize={false} // ✅ allow resizing
        />

        {/* <AgGridReact
          ref={gridRef}
          rowData={filterData}
          columnDefs={columnDefs as any}
          defaultColDef={{
            filter: true,
            sortable: true,
            resizable: true,
            suppressMovable: true,
          }}
          pagination={true}
          paginationPageSize={20}
          animateRows={true}
          components={components}
          // gridOptions={commonAgGridConfig}
          suppressRowClickSelection={false}
          suppressCellFocus={true}
          overlayNoRowsTemplate={OverlayNoRowsTemplate}
          rowHeight={60}
          headerHeight={50}
          context={{ isAllSelect }}
          domLayout="normal"
          className="contact-table"
        /> */}
      </div>
    </div>
  );
};

export default CreateUser;
