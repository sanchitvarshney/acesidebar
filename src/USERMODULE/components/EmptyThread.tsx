import { IconButton, Typography } from "@mui/material";
import React from "react";

const EmptyThread = ({ subject }: any) => {
  return (
    <div className="flex-1">
      <div className={`rounded flex `}>
        <div className="w-[100%] min-h-[20vh] flex flex-col items-center justify-center border border-gray-200 shadow-[0_2px_3px_0_rgb(172,172,172,0.4)] rounded-lg">
          <div className="flex items-center justify-center flex-col  w-full px-8 py-2">
            <Typography variant="h6">{subject}</Typography>
            <Typography>No Thread Found</Typography>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmptyThread;
