import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Tooltip } from "@mui/material";
import ForumIcon from "@mui/icons-material/Forum";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import AddTaskIcon from "@mui/icons-material/AddTask";

const LeftMenu: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (key: string) => {
    if (key === "Ticket") return location.pathname.startsWith("/tickets") || location.pathname === "/";
    if (key === "Task") return location.pathname.startsWith("/tasks");
    if (key === "Chat") return location.pathname.startsWith("/chat");
    return false;
  };

  const goto = (key: string) => {
    if (key === "Ticket") navigate("/tickets");
    else if (key === "Task") navigate("/tasks");
    else if (key === "Chat") navigate("/chat");
  };

  const getIcon = (key: string) => {
    if (key === "Ticket") return <ConfirmationNumberIcon sx={{ fontSize: 22 }} />;
    if (key === "Task") return <AddTaskIcon sx={{ fontSize: 22 }} />;
    if (key === "Chat") return <ForumIcon sx={{ fontSize: 22 }} />;
    return null;
  };

  return (
    <div className="w-55 min-w-[55px] border-r bg-white h-full">
      <div className="py-2">
        {["Ticket", "Task", "Chat"].map((item) => (
          <Tooltip key={item} title={item} placement="right">
            <button
              aria-label={item}
              onClick={() => goto(item)}
              className={`w-full text-left px-4 py-3 hover:bg-blue-100 flex items-center ${isActive(item) ? "bg-blue-200 font-semibold" : ""
                }`}
            >
              <span className="text-gray-700">{getIcon(item)}</span>
            </button>
          </Tooltip>
        ))}
      </div>
    </div>
  );
};

export default LeftMenu;


