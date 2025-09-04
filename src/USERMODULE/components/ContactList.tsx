import { useState } from "react";

import { columns } from "../../utils/create-user-columnDefs";

import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Modal,
  Typography,
} from "@mui/material";

import { SearchIcon } from "lucide-react";
import PlayForWorkIcon from "@mui/icons-material/PlayForWork";
import { DataGrid } from "@mui/x-data-grid";
import CustomSideBarPanel from "../../components/reusable/CustomSideBarPanel";
import ImportContact from "../components/ImportContact";
import ExportContact from "../components/ExportContact";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import AddContact from "../components/AddContact";
import { useNavigate } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import { Close, Save } from "@mui/icons-material";
import { useGetAgentsQuery } from "../../services/agentServices";

const ContactList = () => {
  const [isExport, setIsExport] = useState(false);
  const [isImport, setIsImport] = useState(false);
  const [isAdd, setIsAdd] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { data: agentList, isLoading: agentListData } = useGetAgentsQuery();
 
  const navigate = useNavigate();

  const filterData = searchQuery
    ? agentList.filter((row: any) =>
        Object.values(row).some((value: any) =>
          value?.toString().toLowerCase().includes(searchQuery.toLowerCase())
        )
      )
    : agentList;

  const paginationModel = { page: 0, pageSize: 10 };

 

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-4">
          <Button
            variant="contained"
            size="small"
            sx={{ "&:hover": { bgcolor: "#1b66c9" } }}
            onClick={() => setIsAdd(true)}
          >
            <Typography variant="subtitle1">
              <AddCircleOutlineIcon fontSize="small" /> Add User
            </Typography>
          </Button>
          <div className={` transition-all duration-200  w-[350px] relative`}>
            <div className="flex items-center w-full bg-white border border-gray-300 rounded-full px-4 py-3  shadow-sm transition-shadow focus-within:shadow-[0_1px_6px_rgba(32,33,36,0.28)] hover:shadow-[0_1px_6px_rgba(32,33,36,0.28)] ">
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
            onClick={() => setIsExport(true)}
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
            onClick={() => setIsImport(true)}
          >
            <Typography variant="subtitle1">
              <PlayForWorkIcon fontSize="small" /> Import
            </Typography>
          </Button>
        </div>
      </div>
      {filterData && filterData.length > 0 ? (
        <div className=" h-[calc(100vh-160px)] w-full ">
          <DataGrid
            rows={filterData}
            getRowId={(row) => row.agentID}
            columns={columns.map((col) => ({ ...col, editable: false }))}
            initialState={{ pagination: { paginationModel } }}
            pageSizeOptions={[10, 20, 30, 100]}
            checkboxSelection
            //@ts-ignore
            columnResizeMode="onChange"
            sx={{
              border: 0,
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
            autoHeight={false}
            disableColumnResize={false}
            disableRowSelectionOnClick
            disableCellSelection
            disableColumnSelection
          />
        </div>
      ) : (
        <div className="h-[calc(100vh-160px)] w-full flex justify-center items-center">
          <CircularProgress />
        </div>
      )}
      <CustomSideBarPanel
        open={isExport}
        close={() => setIsExport(false)}
        isHeader={true}
        title={"Export Contact"}
        width={"45%"}
        btn={{ main: "Export", secondary: "Cancel" }}
      >
        <ExportContact />
      </CustomSideBarPanel>
      <CustomSideBarPanel
        open={isImport}
        close={() => setIsImport(false)}
        isHeader={true}
        title={"Import Contact"}
        width={"45%"}
        btn={{ primary: "Import", secondary: "Cancel" }}
      >
        <ImportContact />
      </CustomSideBarPanel>

      <AddContact isAdd={isAdd} close={() => setIsAdd(false)} />
    </div>
  );
};

export default ContactList;
