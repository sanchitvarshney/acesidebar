import React from "react";
import ReplyIcon from "@mui/icons-material/Reply";
import NoteAddIcon from "@mui/icons-material/NoteAdd";
import ForwardToInboxIcon from "@mui/icons-material/ForwardToInbox";
import CloseIcon from "@mui/icons-material/Close";
import MergeTypeIcon from "@mui/icons-material/MergeType";
import DeleteIcon from "@mui/icons-material/Delete";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
const buttonStyles: Record<
  string,
  { text: string; border: string; hover: string }
> = {
  Reply: {
    text: "text-blue-600",
    border: "border-blue-600",
    hover: "hover:bg-blue-50",
  },
  "Add note": {
    text: "text-green-600",
    border: "border-green-600",
    hover: "hover:bg-green-50",
  },
  Forward: {
    text: "text-orange-600",
    border: "border-orange-600",
    hover: "hover:bg-orange-50",
  },
  Close: {
    text: "text-purple-600",
    border: "border-purple-600",
    hover: "hover:bg-purple-50",
  },
  Merge: {
    text: "text-cyan-600",
    border: "border-cyan-600",
    hover: "hover:bg-cyan-50",
  },
  Delete: {
    text: "text-red-600",
    border: "border-red-600",
    hover: "hover:bg-red-50",
  },
  More: {
    text: "text-gray-600",
    border: "border-gray-600",
    hover: "hover:bg-gray-50",
  },
};

const ActionButton = ({
  icon,
  label,
  onClick,
  className,
}: {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
  className?: string;
}) => {
  const styles = buttonStyles[label] || {
    text: "text-gray-700",
    border: "border-gray-300",
    hover: "hover:bg-gray-50",
  };

  return (
    <button
      className={`flex items-center gap-1 px-3 py-1 rounded bg-white text-sm font-medium 
                  border transition 
                  ${styles.text} ${styles.border} ${styles.hover} ${
        className || ""
      }`}
      onClick={onClick}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
};

const TicketDetailHeader = ({ ticket, onBack, onForward, onReply }: any) => {
  return (
    <div className="flex items-center w-full px-6 py-2 border-b bg-white z-10">
      {/* Breadcrumb */}
      <nav className="flex items-center text-xs text-gray-500 font-medium gap-1 min-w-[180px]">
        <button onClick={onBack} className="hover:underline text-xl">
          All tickets
        </button>
        <span className="mx-1">&gt;</span>
        <span className="text-[#0891b2] font-semibold text-md">
          {ticket?.ticketId || "6"}
        </span>
      </nav>
      {/* Action buttons */}
      <div className="flex gap-2 ml-8">
        <ActionButton
          icon={<ReplyIcon fontSize="small" />}
          label="Reply"
          onClick={onReply}
        />
        <ActionButton
          icon={<NoteAddIcon fontSize="small" />}
          label="Add note"
        />
        <ActionButton
          icon={<ForwardToInboxIcon fontSize="small" />}
          label="Forward"
          onClick={onForward}
        />
        <ActionButton icon={<CloseIcon fontSize="small" />} label="Close" />
        <ActionButton icon={<MergeTypeIcon fontSize="small" />} label="Merge" />
        <ActionButton icon={<DeleteIcon fontSize="small" />} label="Delete" />
        <ActionButton icon={<MoreHorizIcon fontSize="small" />} label="More" />
      </div>
      {/* Tabs */}
      {/* <div className="flex gap-2 ml-auto">
        <button className="px-3 py-1 text-sm font-semibold text-blue-700 bg-blue-50 rounded hover:bg-blue-100">
          Threads
        </button>
        <button className="px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded">
          Show activities
        </button>
        <button className="px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded">
          ...
        </button>
      </div> */}
    </div>
  );
};

export default TicketDetailHeader;
