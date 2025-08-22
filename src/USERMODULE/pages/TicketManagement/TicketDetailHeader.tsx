import React, { useState } from "react";
import ReplyIcon from "@mui/icons-material/Reply";
import NoteAddIcon from "@mui/icons-material/NoteAdd";
import ForwardToInboxIcon from "@mui/icons-material/ForwardToInbox";
import MergeTypeIcon from "@mui/icons-material/MergeType";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import LocalPrintshopIcon from "@mui/icons-material/LocalPrintshop";
import BlockIcon from "@mui/icons-material/Block";
import ListIcon from "@mui/icons-material/List";
import AddAlarmIcon from "@mui/icons-material/AddAlarm";
import {
  IconButton,
  Popover,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
} from "@mui/material";
import ConfirmationModal from "../../../components/reusable/ConfirmationModal";

import { Button } from "@mui/material";
import Mergeticket from "../../components/Mergeticket";

const ActionButton = ({
  icon,
  label,
  onClick,
  className,
}: {
  icon: React.ReactNode;
  label: string;
  onClick?: (event: React.MouseEvent<HTMLElement>) => void;
  className?: string;
}) => {
  return (
    <Button
      variant="contained"
      color="inherit"
      onClick={onClick}
      size="small"
      className={`flex items-center gap-1 normal-case shadow-none px-3 py-1 text-sm ${
        className || ""
      }`}
      sx={{
        fontSize: "0.875rem",
        fontWeight: 500,
      }}
    >
      {icon}
      <span>{label}</span>
    </Button>
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
  hasNextTicket = true,
}: any) => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);
  const [moreAnchorEl, setMoreAnchorEl] = React.useState<HTMLElement | null>(
    null
  );
  const [moreOpen, setMoreOpen] = React.useState(false);
    const [isMergeModal, setIsMergeModal] = useState(false);

  // More dropdown options
  const moreOptions = [
    {
      label: "Attachments",
      icon: <AttachFileIcon fontSize="small" />,
      action: () => console.log("Attachments clicked"),
    },
    {
      label: "Log time",
      icon: <AddAlarmIcon fontSize="small" />,
      action: () => console.log("Log time clicked"),
    },
    {
      label: "Activity",
      icon: <ListIcon fontSize="small" />,
      action: () => console.log("Activity clicked"),
    },
    {
      label: "Spam",
      icon: <BlockIcon fontSize="small" />,
      action: () => console.log("Spam clicked"),
    },
    {
      label: "Print",
      icon: <LocalPrintshopIcon fontSize="small" />,
      action: () => console.log("Print clicked"),
    },
  ];

  const handleMoreClick = (event: React.MouseEvent<HTMLElement>) => {
    setMoreAnchorEl(event.currentTarget);
    setMoreOpen(true);
  };

  const handleMoreClose = () => {
    setMoreOpen(false);
    setMoreAnchorEl(null);
  };
  return (
    <div className="flex items-center w-full px-6 py-2 border border-[#bad0ff]  bg-[#e8f0fe] z-10">
      {/* Breadcrumb */}
      <nav className="flex items-center text-xs text-gray-500 font-medium gap-1 min-w-[180px]">
        <IconButton
          onClick={onBack}
          size="small"
          className="text-blue-600 hover:bg-blue-50 hover:text-blue-600"
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
          icon={<ReplyIcon fontSize="small" className="text-blue-600" />}
          label="Reply"
          onClick={onReply}
        />
        <ActionButton
          icon={<NoteAddIcon fontSize="small" className="text-green-600" />}
          label="Add note"
          onClick={onNote}
        />
        <ActionButton
          icon={
            <ForwardToInboxIcon fontSize="small" className="text-orange-600" />
          }
          label="Forward"
          onClick={onForward}
        />
        <ActionButton
        onClick={() => setIsMergeModal(true)}
          icon={<MergeTypeIcon fontSize="small" className="text-purple-600" />}
          label="Merge"
        />
        <Mergeticket
          open={isMergeModal}
          initialPrimary={{
            id: "T-1001",
            title: "Unable to login to portal",
            group: "Support",
            agent: "John Doe",
            closedAgo: "2 days ago",
            resolvedOnTime: true,
            isPrimary: true, // this is your main ticket
          }}
          onClose={() => setIsMergeModal(false)}
        />
        <ActionButton
          icon={<DeleteIcon fontSize="small" className="text-red-600" />}
          label="Delete"
          onClick={() => setIsDeleteModalOpen(true)}
        />

        {/* Divider line */}
        <div className="w-px h-7 bg-gray-300 mx-2"></div>

        <ActionButton
          icon={
            <div className="flex items-center gap-1">
              <ArrowDropDownIcon fontSize="small" className="text-blue-600" />
            </div>
          }
          label="More"
          onClick={handleMoreClick}
        />
      </div>

      {/* Navigation buttons - Right side */}

      <div className="flex gap-1 ml-auto">
        <IconButton
          onClick={onPreviousTicket}
          disabled={!hasPreviousTicket}
          size="small"
          className={`${
            hasPreviousTicket
              ? "text-blue-600 hover:bg-blue-50 hover:text-blue-600"
              : "text-gray-400"
          } disabled:text-gray-400`}
        >
          <ArrowBackIosIcon fontSize="small" />
        </IconButton>
        <IconButton
          onClick={onNextTicket}
          disabled={!hasNextTicket}
          size="small"
          className={`${
            hasNextTicket
              ? "text-blue-600 hover:bg-blue-50 hover:text-blue-600"
              : "text-gray-400"
          } disabled:text-gray-400`}
        >
          <ArrowForwardIosIcon fontSize="small" />
        </IconButton>
      </div>
      <ConfirmationModal
        open={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={() => {}}
        type="delete"
      />

      {/* More dropdown popup */}
      <Popover
        open={moreOpen}
        anchorEl={moreAnchorEl}
        onClose={handleMoreClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        PaperProps={{
          className:
            "shadow-lg rounded-lg mt-1 relative border border-gray-200 w-56",
        }}
      >
        <List className="py-1">
          {moreOptions.map((option, index) => (
            <ListItem key={index} disablePadding>
              <ListItemButton
                onClick={() => {
                  option.action();
                  handleMoreClose();
                }}
                className="py-1.5 px-3 mx-1 rounded-md hover:bg-blue-50 active:bg-blue-100"
              >
                <ListItemIcon sx={{ minWidth: 35 }}>{option.icon}</ListItemIcon>
                <ListItemText primary={option.label} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Popover>
    </div>
  );
};

export default TicketDetailHeader;
