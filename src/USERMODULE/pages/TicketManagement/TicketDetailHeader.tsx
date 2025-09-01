import React, { useState } from "react";
import ReplyIcon from "@mui/icons-material/Reply";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import NoteAddIcon from "@mui/icons-material/NoteAdd";
import EditDocumentIcon from "@mui/icons-material/EditDocument";
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
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import NotificationsIcon from '@mui/icons-material/Notifications';
import NotificationsOffIcon from '@mui/icons-material/NotificationsOff';
import VisibilityIcon from '@mui/icons-material/Visibility';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';

import {
  IconButton,
  Popover,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Tooltip,
  Typography,
  Switch,
  FormControlLabel,
  TextField,
  InputAdornment,
  Avatar,
  Chip,
  Autocomplete,
} from "@mui/material";
import ConfirmationModal from "../../../components/reusable/ConfirmationModal";

import { Button } from "@mui/material";
import Mergeticket from "../../components/Mergeticket";
import LinkIcon from "@mui/icons-material/Link";
import CustomToolTip from "../../../reusable/CustomToolTip";
import LinkTickets from "../../components/LinkTicket";
import { useCommanApiMutation } from "../../../services/threadsApi";
import LogTimePanel from "./LogTimePanel";
import CustomSideBarPanel from "../../../components/reusable/CustomSideBarPanel";
import EditTicket from "../EditTicket";
import ChangeOwner from "./ChangeOwner";
import ManageReferrals from "./ManageReferrals";
import Attachments from "./Attachments";
import Activity from "./Activity";

const ActionButton = ({
  icon,
  tooltip,
  onClick,
  className,
  hasDropdown = false,
  onDropdownClick,
}: {
  icon: React.ReactNode;
  tooltip: string;
  onClick?: (event: React.MouseEvent<HTMLElement>) => void;
  className?: string;
  hasDropdown?: boolean;
  onDropdownClick?: (event: React.MouseEvent<HTMLElement>) => void;
}) => {
  return (
    <div className="flex items-center">
      <Tooltip title={tooltip}>
        <Button
          variant="contained"
          color="inherit"
          onClick={onClick}
          size="small"
          className={`flex items-center justify-center normal-case shadow-none px-3 py-1 text-sm ${className || ""
            }`}
          sx={{
            fontSize: "0.875rem",
            fontWeight: 500,
            minWidth: "40px",
          }}
        >
          {icon}
        </Button>
      </Tooltip>
      {hasDropdown && (
        <CustomToolTip
          title={
            <Typography className="px-2 py-1" variant="subtitle2">
              {tooltip}
            </Typography>
          }
          placement="top"
        >
          <Button
            variant="contained"
            color="inherit"
            onClick={onDropdownClick}
            size="small"
            className="flex items-center justify-center normal-case shadow-none px-1 py-1 text-sm ml-0"
            sx={{
              fontSize: "0.875rem",
              fontWeight: 500,
              minWidth: "24px",
              borderLeft: "1px solid #e0e0e0",
              borderRadius: "0 4px 4px 0",
            }}
          >
            <ArrowDropDownIcon fontSize="small" />
          </Button>
        </CustomToolTip>
      )}
    </div>
  );
};

const TicketDetailHeader = ({
  ticket,
  onBack,
  ticketNumber,
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
  const [isLinkModal, setIsLinkModal] = useState(false);
  const [statusAnchorEl, setStatusAnchorEl] =
    React.useState<HTMLElement | null>(null);
  const [statusOpen, setStatusOpen] = React.useState(false);
  const [isLogTimeModal, setIsLogTimeModal] = useState(false);
  const [isEditTicket, setIsEditTicket] = useState(false);
  const [isChangeOwnerModal, setIsChangeOwnerModal] = useState(false);
  const [isManageReferralsModal, setIsManageReferralsModal] = useState(false);
  const [isAttachmentsModal, setIsAttachmentsModal] = useState(false);
  const [isActivityModal, setIsActivityModal] = useState(false);
  const [isSpamModal, setIsSpamModal] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [watchersAnchorEl, setWatchersAnchorEl] = useState<HTMLElement | null>(null);
  const [watchersOpen, setWatchersOpen] = useState(false);
  const [watchers, setWatchers] = useState([
    { id: 1, name: "Diwuebfiuekj", email: "diwuebfiuekj@example.com", avatar: "D" },
    { id: 2, name: "Me (Developer Account)", email: "developer@example.com", avatar: "D" }
  ]);
  const [searchQuery, setSearchQuery] = useState("");

  const [commanApi] = useCommanApiMutation();

  const handlePrintData = (ticketId: any) => {
    if (!ticketId || ticketId === "") {
      return;
    }
    const payload = {
      url: `${ticketId}/print`,
      method: "GET",
    };
    commanApi(payload);
  };

  const hanldeDeleteThread = (ticketId: any) => {
    if (!ticketId || ticketId === "") {
      return;
    }
    const payload = {
      url: `${ticketId}/delete`,
      method: "DeLETE",
    };
    commanApi(payload);
  };

  const handleSpamTicket = (ticketId: any) => {
    if (!ticketId || ticketId === "") {
      return;
    }
    const payload = {
      url: `${ticketId}/spam`,
      method: "PUT",
    };
    commanApi(payload);
  };

  // Status dropdown options
  const statusOptions = [
    {
      label: "Hold",
      icon: <ArrowBackIcon fontSize="small" />,
      action: () => console.log("Status changed to Hold"),
    },
    {
      label: "Open",
      icon: <ArrowBackIcon fontSize="small" />,
      action: () => console.log("Status changed to Open"),
    },
    {
      label: "Resolved",
      icon: <ListIcon fontSize="small" />,
      action: () => console.log("Status changed to Resolved"),
    },
  ];

  // More dropdown options
  const moreOptions = [
    {
      label: "Change Owner",
      icon: <PersonAddAlt1Icon fontSize="small" />,
      action: () => setIsChangeOwnerModal(true),
    },
    {
      label: "Edit Ticket",
      icon: <EditDocumentIcon fontSize="small" />,
      action: () => setIsEditTicket(true),
    },
    {
      label: "Link Tickets",
      icon: <LinkIcon />,
      action: () => setIsLinkModal(true),
    },
    {
      label: "Manage Referrals",
      icon: <ManageAccountsIcon fontSize="small" />,
      action: () => setIsManageReferralsModal(true),
    },
    {
      label: "Attachments",
      icon: <AttachFileIcon fontSize="small" />,
      action: () => setIsAttachmentsModal(true),
    },
    {
      label: "Log time",
      icon: <AddAlarmIcon fontSize="small" />,
      action: () => setIsLogTimeModal(true),
    },
    {
      label: "Activity",
      icon: <AccessTimeIcon fontSize="small" />,
      action: () => setIsActivityModal(true),
    },
    {
      label: "Spam",
      icon: <BlockIcon fontSize="small" />,
      action: () => setIsSpamModal(true),
    },
    {
      label: "Print",
      icon: <LocalPrintshopIcon fontSize="small" />,
      action: () => handlePrintData(ticketNumber),
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

  const handleStatusClick = (event: React.MouseEvent<HTMLElement>) => {
    setStatusAnchorEl(event.currentTarget);
    setStatusOpen(true);
  };

  const handleStatusClose = () => {
    setStatusOpen(false);
    setStatusAnchorEl(null);
  };

  const handleNotificationToggle = () => {
    setNotificationsEnabled(!notificationsEnabled);
    // You can add API call here to update notification settings
    console.log('Notifications', notificationsEnabled ? 'disabled' : 'enabled');
  };

  const handleWatchersClick = (event: React.MouseEvent<HTMLElement>) => {
    setWatchersAnchorEl(event.currentTarget);
    setWatchersOpen(true);
  };

  const handleWatchersClose = () => {
    setWatchersOpen(false);
    setWatchersAnchorEl(null);
  };

  const handleRemoveWatcher = (watcherId: number) => {
    setWatchers(watchers.filter(watcher => watcher.id !== watcherId));
  };

  const handleAddWatcher = (newWatcher: any) => {
    if (newWatcher && !watchers.find(w => w.id === newWatcher.id)) {
      setWatchers([...watchers, newWatcher]);
    }
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
          tooltip="Post Reply"
          onClick={onReply}
        />
        <ActionButton
          icon={<NoteAddIcon fontSize="small" className="text-green-600" />}
          tooltip="Add Note"
          onClick={onNote}
        />

        <ActionButton
          icon={<SwapHorizIcon fontSize="small" className="text-purple-600" />}
          tooltip="Transfer"
          onClick={() => onForward()}
        />
        <ActionButton
          onClick={() => setIsMergeModal(true)}
          icon={<MergeTypeIcon fontSize="small" className="text-purple-600" />}
          tooltip="Merge"
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
          tooltip="Delete"
          onClick={() => setIsDeleteModalOpen(true)}
        />

        {/* Divider line */}
        <div className="w-px h-7 bg-gray-300 mx-2"></div>

        <ActionButton
          icon={
            <div className="flex items-center gap-1">
              More <MoreVertIcon fontSize="small" className="text-blue-600 " />
            </div>
          }
          tooltip="More"
          onClick={handleMoreClick}
        />
      </div>

      {/* Navigation buttons - Right side */}

      <div className="flex gap-8 ml-auto">
        {/* Notification Switch with Icon */}
        <Tooltip title={notificationsEnabled ? "Disable Notifications" : "Enable Notifications"} placement="left">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            {notificationsEnabled ? (
              <NotificationsIcon fontSize="small" sx={{ color: '#1a73e8' }} />
            ) : (
              <NotificationsOffIcon fontSize="small" sx={{ color: '#9ca3af' }} />
            )}
            <Switch
              checked={notificationsEnabled}
              onChange={handleNotificationToggle}
              size="small"
              sx={{
                '& .MuiSwitch-switchBase.Mui-checked': {
                  color: '#1a73e8',
                  '& + .MuiSwitch-track': {
                    backgroundColor: '#1a73e8',
                  },
                },
                '& .MuiSwitch-track': {
                  backgroundColor: '#d1d5db',
                },
              }}
            />
          </Box>
        </Tooltip>

        {/* Watchers Button */}
        <Tooltip
          title={
            <Box className="p-2 rounded-md text-black">
              <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                Ticket watchers ({watchers.length})
              </Typography>
              <Typography variant="caption" sx={{ display: 'block', mb: 1 }}>
                Agents added as watchers will receive alerts when this ticket is updated
              </Typography>
            </Box>
          }
          placement="bottom"
          componentsProps={{
            tooltip: {
              sx: {
                backgroundColor: 'white',
                color: 'black',
                boxShadow: 3,
                border: '1px solid #e0e0e0',
              },
            },
          }}
        >
          <IconButton
            onClick={handleWatchersClick}
            size="small"
            className="text-blue-600 hover:bg-blue-50 hover:text-blue-600"
          >
            <VisibilityIcon fontSize="small" />
          </IconButton>
        </Tooltip>


        {/* Previous Ticket Button */}
        <IconButton
          onClick={onPreviousTicket}
          disabled={!hasPreviousTicket}
          size="small"
          className={`${hasPreviousTicket
              ? "text-blue-600 hover:bg-blue-50 hover:text-blue-600"
              : "text-gray-400"
            } disabled:text-gray-400`}
        >
          <ArrowBackIosIcon fontSize="small" />
        </IconButton>

        {/* Next Ticket Button */}
        <IconButton
          onClick={onNextTicket}
          disabled={!hasNextTicket}
          size="small"
          className={`${hasNextTicket
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
        onConfirm={() => hanldeDeleteThread(ticketNumber)}
        type="delete"
      />

      {/* Status dropdown popup */}
      <Popover
        open={statusOpen}
        anchorEl={statusAnchorEl}
        onClose={handleStatusClose}
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
            "shadow-lg rounded-lg mt-1 relative border border-gray-200 w-48",
        }}
      >
        <List className="py-1">
          {statusOptions.map((option, index) => (
            <ListItem key={index} disablePadding>
              <ListItemButton
                onClick={() => {
                  option.action();
                  handleStatusClose();
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

      <LinkTickets
        open={isLinkModal}
        onClose={() => setIsLinkModal(false)}
        currentTicket={{
          id: "T-1001",
          title: "Unable to login to portal",
          group: "Support",
          agent: "John Doe",
          closedAgo: "2 days ago",
          resolvedOnTime: true,
          isPrimary: true, // this is your main ticket
        }}
      />

      <CustomSideBarPanel
        open={isLogTimeModal}
        close={() => {
          setIsLogTimeModal(false);
        }}
        title={
          <Typography variant="subtitle2">
            {" "}
            <AddAlarmIcon fontSize="small" /> Log Time
          </Typography>
        }
        width={600}
      >
        <LogTimePanel
          open={isLogTimeModal}
          onClose={() => {
            setIsLogTimeModal(false);
          }}
          ticketId={ticketNumber}
        />
      </CustomSideBarPanel>

      <CustomSideBarPanel
        open={isEditTicket}
        close={() => {
          setIsEditTicket(false);
        }}
        title={
          <div className="flex items-center gap-2">
            <EditDocumentIcon fontSize="small" />
            <Typography variant="subtitle1" fontWeight={600}>
              {" "}
              Edit Ticket
            </Typography>
          </div>
        }
        width={600}
      >
        <EditTicket
          open={isEditTicket}
          onClose={() => {
            setIsEditTicket(false);
          }}
        />
      </CustomSideBarPanel>

      {/* Change Owner Panel */}
      <CustomSideBarPanel
        open={isChangeOwnerModal}
        close={() => {
          setIsChangeOwnerModal(false);
        }}
        title={
          <div className="flex items-center gap-2">
            <PersonAddAlt1Icon fontSize="small" />
            <Typography variant="subtitle1" fontWeight={600}>
              Change Owner
            </Typography>
          </div>
        }
        width={600}
      >
        <ChangeOwner
          open={isChangeOwnerModal}
          onClose={() => {
            setIsChangeOwnerModal(false);
          }}
          ticketId={ticketNumber}
          currentOwner={{
            id: "1",
            name: "John Doe",
            email: "john.doe@example.com",
          }}
        />
      </CustomSideBarPanel>

      {/* Manage Referrals Panel */}
      <CustomSideBarPanel
        open={isManageReferralsModal}
        close={() => {
          setIsManageReferralsModal(false);
        }}
        title={
          <div className="flex items-center gap-2">
            <ManageAccountsIcon fontSize="small" />
            <Typography variant="subtitle1" fontWeight={600}>
              Manage Referrals
            </Typography>
          </div>
        }
        width={700}
      >
        <ManageReferrals
          open={isManageReferralsModal}
          onClose={() => {
            setIsManageReferralsModal(false);
          }}
          ticketId={ticketNumber}
        />
      </CustomSideBarPanel>

      {/* Attachments Panel */}
      <CustomSideBarPanel
        open={isAttachmentsModal}
        close={() => {
          setIsAttachmentsModal(false);
        }}
        title={
          <div className="flex items-center gap-2">
            <AttachFileIcon fontSize="small" />
            <Typography variant="subtitle1" fontWeight={600}>
              Attachments
            </Typography>
          </div>
        }
        width={800}
      >
        <Attachments
          open={isAttachmentsModal}
          onClose={() => {
            setIsAttachmentsModal(false);
          }}
          ticketId={ticketNumber}
        />
      </CustomSideBarPanel>

      {/* Activity Panel */}
      <CustomSideBarPanel
        open={isActivityModal}
        close={() => {
          setIsActivityModal(false);
        }}
        title={
          <div className="flex items-center gap-2">
            <AddAlarmIcon fontSize="small" />
            <Typography variant="subtitle1" fontWeight={600}>
              Activity Log
            </Typography>
          </div>
        }
        width={900}
      >
        <Activity
          open={isActivityModal}
          onClose={() => {
            setIsActivityModal(false);
          }}
          ticketId={ticketNumber}
        />
      </CustomSideBarPanel>
      <ConfirmationModal
        open={isSpamModal}
        onClose={() => setIsSpamModal(false)}
        onConfirm={() => handleSpamTicket(ticketNumber)}
        type="custom"
        title="Spam Ticket"
        message="Are you sure you want to spam this ticket?"
      />

      {/* Watchers Popover */}
      <Popover
        open={watchersOpen}
        anchorEl={watchersAnchorEl}
        onClose={handleWatchersClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        PaperProps={{
          sx: {
            width: 400,
            maxHeight: 500,
            p: 2,
          },
        }}
      >
        <Box>
          {/* Header */}
          <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
            Ticket watchers ({watchers.length})
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
            Agents added as watchers will receive alerts when this ticket is updated
          </Typography>

          {/* Search Bar */}
          <TextField
            fullWidth
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            size="small"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
            sx={{ mb: 2 }}
          />

          {/* Add More Dropdown */}
          <Autocomplete
            options={[
              { id: 3, name: "John Doe", email: "john@example.com", avatar: "J" },
              { id: 4, name: "Jane Smith", email: "jane@example.com", avatar: "J" },
              { id: 5, name: "Mike Johnson", email: "mike@example.com", avatar: "M" },
            ]}
            getOptionLabel={(option) => option.name}
            onChange={(event, newValue) => {
              if (newValue) {
                handleAddWatcher(newValue);
              }
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder="Add more watchers..."
                size="small"
                InputProps={{
                  ...params.InputProps,
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonAddIcon fontSize="small" />
                    </InputAdornment>
                  ),
                }}
              />
            )}
            renderOption={(props, option) => (
              <Box component="li" {...props}>
                <Avatar sx={{ width: 24, height: 24, mr: 1, fontSize: '0.75rem' }}>
                  {option.avatar}
                </Avatar>
                <Box>
                  <Typography variant="body2">{option.name}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {option.email}
                  </Typography>
                </Box>
              </Box>
            )}
            sx={{ mb: 2 }}
          />

          {/* Watchers List */}
          <Box sx={{ maxHeight: 200, overflowY: 'auto' }}>
            {watchers.map((watcher) => (
              <Box
                key={watcher.id}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  p: 1,
                  border: '1px solid #e0e0e0',
                  borderRadius: 1,
                  mb: 1,
                  '&:hover': {
                    backgroundColor: '#f5f5f5',
                  },
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <IconButton
                    size="small"
                    onClick={() => handleRemoveWatcher(watcher.id)}
                    sx={{
                      color: '#ef4444',
                      mr: 1,
                      '&:hover': { backgroundColor: '#fee2e2' }
                    }}
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                  <Avatar sx={{ width: 32, height: 32, mr: 1, fontSize: '0.875rem' }}>
                    {watcher.avatar}
                  </Avatar>
                  <Box>
                    <Typography variant="body2">{watcher.name}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {watcher.email}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      </Popover>
    </div>
  );
};

export default TicketDetailHeader;
