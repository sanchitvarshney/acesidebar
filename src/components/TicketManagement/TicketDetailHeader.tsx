import React from "react";
import ReplyIcon from "@mui/icons-material/Reply";
import NoteAddIcon from "@mui/icons-material/NoteAdd";
import ForwardToInboxIcon from "@mui/icons-material/ForwardToInbox";
import CloseIcon from "@mui/icons-material/Close";
import MergeTypeIcon from "@mui/icons-material/MergeType";
import DeleteIcon from "@mui/icons-material/Delete";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { IconButton } from "@mui/material";
import CustomModal from "../layout/CustomModal";
import ConfirmationModal from "../reusable/ConfirmationModal";


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


  return (
    <button
      className="flex items-center gap-1 px-3 py-1 rounded bg-white text-sm font-medium 
                  border transition  text-gray-700 border-gray-300 hover:bg-gray-50
             "
      onClick={onClick}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
};

const TicketDetailHeader = ({ 
  ticket, 
  onBack, 
  onForward, 
  onReply, 
  onNote, 
  onPreviousTicket, 
  onNextTicket,
  hasPreviousTicket = true,
  hasNextTicket = true 
}: any) => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);
  return (
    <div className="flex items-center w-full px-6 py-2 border border-[#bad0ff]  bg-[#e8f0fe] z-10">

      {/* Breadcrumb */}
      <nav className="flex items-center text-xs text-gray-500 font-medium gap-1 min-w-[180px]">
        <IconButton 
          onClick={onBack} 
          size="small"
          sx={{ 
            color: "#1a73e8",
            '&:hover': {
              backgroundColor: 'rgba(26, 115, 232, 0.08)',
              color: "#1a73e8"
            }
          }}
        >
          <ArrowBackIcon fontSize="small" />
        </IconButton>
        <span className="text-[#1a73e8] font-semibold text-md">
          {ticket?.ticketId || "6"}
        </span>
      </nav>
      
      {/* Action buttons */}
      <div className="flex gap-2 ml-8">
        <ActionButton
          icon={<ReplyIcon fontSize="small"  sx={{color :"#1a73e8"}} />}
          label="Reply"
          onClick={onReply}
        />
        <ActionButton
          icon={<NoteAddIcon fontSize="small" color="success" />}
          label="Add note"
          onClick={onNote}
        />
        <ActionButton
          icon={<ForwardToInboxIcon fontSize="small" sx={{color:"#ea580c"}} />}
          label="Forward"
          onClick={onForward}
        />
        <ActionButton icon={<CloseIcon fontSize="small"  color="error" />} label="Close" />
        <ActionButton icon={<MergeTypeIcon fontSize="small"  sx={{color:"#1a73e8"}}/>} label="Merge" />
        <ActionButton icon={<DeleteIcon fontSize="small"  color="error"/>} label="Delete"  onClick={() => setIsDeleteModalOpen(true)}/>
      </div>

      {/* Navigation buttons - Right side */}
      <div className="flex gap-1 ml-auto">
        <IconButton 
          onClick={onPreviousTicket} 
          disabled={!hasPreviousTicket}
          size="small"
          sx={{ 
            color: hasPreviousTicket ? "#1a73e8" : "#ccc",
            '&:hover': {
              backgroundColor: hasPreviousTicket ? 'rgba(26, 115, 232, 0.08)' : 'transparent',
              color: hasPreviousTicket ? "#1a73e8" : "#ccc"
            },
            '&.Mui-disabled': {
              color: '#ccc'
            }
          }}
        >
          <ArrowBackIosIcon fontSize="small" />
        </IconButton>
        <IconButton 
          onClick={onNextTicket} 
          disabled={!hasNextTicket}
          size="small"
          sx={{ 
            color: hasNextTicket ? "#1a73e8" : "#ccc",
            '&:hover': {
              backgroundColor: hasNextTicket ? 'rgba(26, 115, 232, 0.08)' : 'transparent',
              color: hasNextTicket ? "#1a73e8" : "#ccc"
            },
            '&.Mui-disabled': {
              color: '#ccc'
            }
          }}
        >
          <ArrowForwardIosIcon fontSize="small" />
        </IconButton>
      </div>
      <ConfirmationModal bgColor="rgba(244, 67, 54, 1)" open={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false) } onConfirm={()=>{} }   />
      
    </div>
  );
};

export default TicketDetailHeader;
