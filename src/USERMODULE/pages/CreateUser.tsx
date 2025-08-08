import  { useMemo, useRef, useState } from "react";

import { AgGridReact } from "ag-grid-react";
import { columnDefs } from "../../utils/create-user-columnDefs";
import {

  OverlayNoRowsTemplate,
} from "../config/commanAgGridConfig";
import { Button, Checkbox, Typography } from "@mui/material";
import TextInputCellRenderer from "../components/TextInputCellRenderer";
import { SearchIcon } from "lucide-react";
import PlayForWorkIcon from "@mui/icons-material/PlayForWork";

const rowData = [
  {
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
  const gridRef = useRef<AgGridReact<any>>(null);
  const [isAllSelect, setIsAllSelect] =useState(false);

  const components = useMemo(
    () => ({
      textInputCellRenderer: TextInputCellRenderer,
    }),
    []
  );
 

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <Checkbox
             checked={isAllSelect}
          
            onClick={()=>setIsAllSelect(!isAllSelect)}
          />
          <Typography variant="subtitle2" color="text.primary">
            Select All
          </Typography>

          <div
            className={` transition-all duration-200 ml-10 w-[300px] relative`}
          >
            <div className="flex items-center w-full bg-white border border-gray-300 rounded-full px-4 py-2  shadow-sm transition-shadow focus-within:shadow-[0_1px_6px_rgba(32,33,36,0.28)] hover:shadow-[0_1px_6px_rgba(32,33,36,0.28)] ">
              <SearchIcon className="text-gray-500 mr-3" size={18} />
              <input
                onChange={(e) => {
                  // setSearchQuery(e.target.value);
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
      <div className="ag-theme-quartz h-[calc(100vh-155px)] w-full ">
        <AgGridReact
          ref={gridRef}
          rowData={rowData}
          columnDefs={columnDefs as any}
          defaultColDef={{
            filter: true,
            sortable: true,
            resizable: true,
            suppressMovable: true,
          }}
          pagination={true}
          paginationPageSize={10}
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
        />
      </div>
    </div>
  );
};

export default CreateUser;
