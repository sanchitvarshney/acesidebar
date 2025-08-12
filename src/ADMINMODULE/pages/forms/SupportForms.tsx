import { IconButton, Typography } from "@mui/material";
import NoteAddIcon from "@mui/icons-material/NoteAdd";
import { useParams } from "react-router-dom";
import GenralForm from "./GenralForm";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useTabs } from "../../../contextApi/TabsContext";

const SupportForms = () => {
  const pageId: any = useParams().id;
 const { setActiveTab, setTabs,activeTab } =  useTabs();

  return (
    <div className="w-full flex flex-col justify-center items-center gap-6 py-6">
      <div className=" flex  items-center gap-2">
        <span className="bg-blue-600 text-white p-1.5 rounded-md flex items-center justify-center">
          <NoteAddIcon fontSize="small" />
        </span>
        <div className="flex  flex-col ml-2 ">
          <Typography variant="body1" >
            Submit a Support Form
          </Typography>
          <Typography variant="subtitle2">
            Required fields are marked with
            <span className="text-red-600">*</span>
          </Typography>
        </div>
      </div>
      <div className="w-1/2  mx-auto shadow-[0_0_10px_rgba(0,0,0,0.18)] p-4 ">
      <IconButton size="small" onClick={() => { 
        window.history.back()
        setTabs((prev:any)=>prev.slice(0,prev.length-1))
  setActiveTab("Submit Ticket");
        }} >
        <ArrowBackIcon fontSize="small" />
      </IconButton>
        <GenralForm pageId={pageId} />
      </div>
    </div>
  );
};

export default SupportForms;
