import React from "react";
import LeftMenu from "./LeftMenu";

const Tasks: React.FC = () => {
  return (
    <div className="flex flex-col bg-[#f0f4f9] h-[calc(100vh-115px)]">
      <div className="flex items-center justify-between px-5 py-2 pb-2 border-b w-full bg-#f0f4f9">
        <span className="text-xl font-semibold">Tasks</span>
      </div>
      <div className="flex flex-1 h-0 min-h-0">
        <LeftMenu />
        <div className="flex-1 h-full bg-white flex items-center justify-center text-gray-500">
          Task view coming soon
        </div>
      </div>
    </div>
  );
};

export default Tasks;


