import { IconButton, Typography } from "@mui/material";
import NoteAddIcon from "@mui/icons-material/NoteAdd";
import { useNavigate, useParams } from "react-router-dom";
import GenralForm from "./GenralForm";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useTabs } from "../../../contextApi/TabsContext";
import { useEffect } from "react";
import { useToast } from "../../../hooks/useToast";

const SupportForms = () => {
  const pageId: any = useParams();

  // const { setActiveTab, setTabs, addTab } = useTabs();

  // const path = window.location.pathname;
  // console.log(path, "path");

  // useEffect(() => {
  //   addTab({ label: pageId.title || "", path: `${pageId.title}/${pageId.id}` });
  //   setActiveTab(pageId.title || "");
  // }, []);

  return (
    <div className="w-full flex flex-col justify-center items-center gap-6 py-6">
      <div className=" flex  items-center gap-2">
        <span className="bg-blue-600 text-white p-1.5 rounded-md flex items-center justify-center">
          <NoteAddIcon fontSize="small" />
        </span>
        <div className="flex  flex-col ml-2 ">
          <Typography variant="body1">Submit a Support Form</Typography>
          <Typography variant="subtitle2">
            Required fields are marked with
            <span className="text-red-600">*</span>
          </Typography>
        </div>
      </div>
      <div className="w-1/2  mx-auto shadow-[0_0_10px_rgba(0,0,0,0.18)] p-4 ">
        <IconButton
          size="small"
          onClick={() => {
            window.history.back();
          }}
        >
          <ArrowBackIcon fontSize="small" />
        </IconButton>
        <GenralForm pageId={pageId.id} />
      </div>
    </div>
  );
};

export default SupportForms;
