import React from "react";
import ReplyIcon from "@mui/icons-material/Reply";
import NoteAddIcon from "@mui/icons-material/NoteAdd";
import ForwardToInboxIcon from "@mui/icons-material/ForwardToInbox";
import CloseIcon from "@mui/icons-material/Close";
import MergeTypeIcon from "@mui/icons-material/MergeType";
import DeleteIcon from "@mui/icons-material/Delete";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";

const ActionButton = ({
  icon,
  label,
}: {
  icon: React.ReactNode;
  label: string;
}) => (
  <button className="flex items-center gap-1 px-3 py-1 rounded bg-white text-gray-700 text-sm font-medium border border-gray-200 hover:bg-gray-100 transition">
    {icon}
    <span>{label}</span>
  </button>
);

const TicketDetailHeader = ({ ticket, onBack }: any) => {
  return (
    <div className="flex items-center w-full px-6 py-2 border-b bg-white z-10">
      {/* Breadcrumb */}
      <nav className="flex items-center text-xs text-gray-500 font-medium gap-1 min-w-[180px]">
        <button onClick={onBack} className="hover:underline text-xl">
          All tickets
        </button>
        <span className="mx-1">&gt;</span>
        <span className="text-blue-700 font-semibold text-md">
          {ticket?.ticketId || "6"}
        </span>
      </nav>
      {/* Action buttons */}
      <div className="flex gap-2 ml-8">
        <ActionButton icon={<ReplyIcon fontSize="small" />} label="Reply" />
        <ActionButton
          icon={<NoteAddIcon fontSize="small" />}
          label="Add note"
        />
        <ActionButton
          icon={<ForwardToInboxIcon fontSize="small" />}
          label="Forward"
        />
        <ActionButton icon={<CloseIcon fontSize="small" />} label="Close" />
        <ActionButton icon={<MergeTypeIcon fontSize="small" />} label="Merge" />
        <ActionButton icon={<DeleteIcon fontSize="small" />} label="Delete" />
        <ActionButton icon={<MoreHorizIcon fontSize="small" />} label="" />
      </div>
      {/* Tabs */}
      <div className="flex gap-2 ml-auto">
        <button className="px-3 py-1 text-sm font-semibold text-blue-700 bg-blue-50 rounded hover:bg-blue-100">
          Threads
        </button>
        <button className="px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded">
          Show activities
        </button>
        <button className="px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded">
          ...
        </button>
      </div>
    </div>
  );
};

export default TicketDetailHeader;
