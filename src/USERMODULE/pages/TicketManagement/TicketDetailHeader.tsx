import React, { useEffect, useState } from "react";
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
import ReadMoreIcon from "@mui/icons-material/ReadMore";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import VisibilityIcon from "@mui/icons-material/Visibility";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

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
  Drawer,
  CircularProgress,
} from "@mui/material";
import ConfirmationModal from "../../../components/reusable/ConfirmationModal";

import { Button } from "@mui/material";
import Mergeticket from "../../components/Mergeticket";
import LinkIcon from "@mui/icons-material/Link";
import CustomToolTip from "../../../reusable/CustomToolTip";
import LinkTickets from "../../components/LinkTicket";
import {
  useCommanApiMutation,
  useGetWatcherQuery,
} from "../../../services/threadsApi";
import LogTimePanel from "./LogTimePanel";
import CustomSideBarPanel from "../../../components/reusable/CustomSideBarPanel";
import EditTicket from "../EditTicket";
import ChangeOwner from "./ChangeOwner";
import ManageReferrals from "./ManageReferrals";
import Attachments from "./Attachments";
import Activity from "./Activity";

import { useToast } from "../../../hooks/useToast";
import { useLazyGetAgentsBySeachQuery } from "../../../services/agentServices";

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
          className={`flex items-center justify-center normal-case shadow-none px-3 py-1 text-sm ${
            className || ""
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
  const [triggerDeleteWatcher, { isLoading: isDeletingLoading }] =
    useCommanApiMutation();
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

  const [watcherEnabled, setWatcherEnabled] = useState(true);
  const [watchersAnchorEl, setWatchersAnchorEl] = useState<HTMLElement | null>(
    null
  );
  const [onChangeAgent, setOnChangeAgent] = useState("");
  const [agentOptions, setAgentOptions] = useState<any>([]);
  const { showToast } = useToast();
  const [watchersOpen, setWatchersOpen] = useState(false);
  const {
    data: watcherData,
    refetch,
    isLoading: watcherLoading,
  } = useGetWatcherQuery(
    { ticket: ticket?.ticketId },
    { skip: !ticket?.ticketId } 
  );

  const [spamValue, setSpamValue] = useState<any>(null);
  const [triggerSeachAgent, { isLoading: seachAgentLoading }] =
    useLazyGetAgentsBySeachQuery();
  const [searchQuery, setSearchQuery] = useState("");
  const [trackId, setTrackId] = useState("");
  const [moreDrawerOpen, setMoreDrawerOpen] = useState(false);
  const [moreOptionsSearchQuery, setMoreOptionsSearchQuery] = useState("");
  const [triggerWatcherStatus, { isLoading: watcherStatusLoading }] =
    useCommanApiMutation();
  const [triggerWatchApi] = useCommanApiMutation();
  const displayAgentOptions = onChangeAgent ? agentOptions : [];

  const fetchAgentOptions = async (query: string) => {
    if (!query) {
      setAgentOptions([]);
      return;
    }

    try {
      const res = await triggerSeachAgent({
        search: query,
      }).unwrap();
      const data = Array.isArray(res) ? res : res?.data;

      const currentValue = onChangeAgent;
      const fallback = [
        {
          fName: currentValue,
          emailAddress: currentValue,
        },
      ];

      if (Array.isArray(data)) {
        setAgentOptions(data.length > 0 ? data : fallback);
      } else {
        setAgentOptions([]);
      }
    } catch (error) {
      setAgentOptions([]);
    }
  };

  // More options data
  const moreOptions = [
    {
      id: "change-owner",
      title: "Change Owner",
      description: "Transfer ticket ownership",
      icon: <PersonAddAlt1Icon sx={{ color: "#1a73e8" }} />,
      iconBg: "#dbeafe",
      onClick: () => {
        setIsChangeOwnerModal(true);
        handleMoreDrawerClose();
      },
    },
    {
      id: "edit-ticket",
      title: "Edit Ticket",
      description: "Modify ticket details",
      icon: <EditDocumentIcon sx={{ color: "#f59e0b" }} />,
      iconBg: "#fef3c7",
      onClick: () => {
        setIsEditTicket(true);
        handleMoreDrawerClose();
      },
    },
    {
      id: "link-tickets",
      title: "Link Tickets",
      description: "Connect related tickets",
      icon: <LinkIcon sx={{ color: "#059669" }} />,
      iconBg: "#d1fae5",
      onClick: () => {
        setIsLinkModal(true);
        handleMoreDrawerClose();
      },
    },
    {
      id: "manage-referrals",
      title: "Manage Referrals",
      description: "Handle ticket referrals",
      icon: <ManageAccountsIcon sx={{ color: "#9333ea" }} />,
      iconBg: "#f3e8ff",
      onClick: () => {
        setIsManageReferralsModal(true);
        handleMoreDrawerClose();
      },
    },
    {
      id: "attachments",
      title: "Attachments",
      description: "Manage ticket files",
      icon: <AttachFileIcon sx={{ color: "#dc2626" }} />,
      iconBg: "#fef2f2",
      onClick: () => {
        setIsAttachmentsModal(true);
        handleMoreDrawerClose();
      },
    },
    {
      id: "activity",
      title: "Activity",
      description: "View ticket history",
      icon: <ListIcon sx={{ color: "#0284c7" }} />,
      iconBg: "#e0f2fe",
      onClick: () => {
        setIsActivityModal(true);
        handleMoreDrawerClose();
      },
    },
    {
      id: "log-time",
      title: "Log Time",
      description: "Track time spent on ticket",
      icon: <AddAlarmIcon sx={{ color: "#eab308" }} />,
      iconBg: "#fef7cd",
      onClick: () => {
        setIsLogTimeModal(true);
        handleMoreDrawerClose();
      },
    },
    {
      id: "spam",
      title: ` ${spamValue ? "Unmark" : "Mark"} Spam`,
      description: `${spamValue ? "Unmark" : "Mark"} ticket as spam`,
      icon: <BlockIcon sx={{ color: "#dc2626" }} />,
      iconBg: "#fef2f2",
      onClick: () => {
        setIsSpamModal(true);
        handleMoreDrawerClose();
      },
    },
    {
      id: "print",
      title: "Print",
      description: "Print ticket details",
      icon: <LocalPrintshopIcon sx={{ color: "#0ea5e9" }} />,
      iconBg: "#f0f9ff",
      onClick: () => handlePrintData(ticketNumber),
    },
  ];

  // Filter options based on search query
  const filteredOptions = moreOptions.filter(
    (option) =>
      option.title
        .toLowerCase()
        .includes(moreOptionsSearchQuery.toLowerCase()) ||
      option.description
        .toLowerCase()
        .includes(moreOptionsSearchQuery.toLowerCase())
  );

  const [commanApi] = useCommanApiMutation();
  const [spamTicket, { isLoading: isSpamTicketLoading }] =
    useCommanApiMutation();
  const [spamTicketSuccess, setSpamTicketSuccess] = useState(false);

  useEffect(() => {
    if (ticket?.isSpam) {
      setSpamValue(ticket?.isSpam);
    }
  }, [ticket?.isSpam]);

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

  const handleSpamTicket = (ticketId: any, status: any) => {
    const statusValue = status ? 0 : 1;
    if (!ticketId || ticketId === "") {
      showToast(" Status or ticket missing", "error");
      return;
    }
    const payload = {
      url: `spam/${ticketId}/${statusValue}`,
      method: "PUT",
    };
    spamTicket(payload).then((res: any) => {
      if (res?.data?.type === "error") {
        showToast(res?.data?.message, "error");
        return;
      }
      if (res?.data?.type === "success") {
        setSpamTicketSuccess(true);
        setSpamValue(!spamValue);
      }
    });
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

  const handleStatusClick = (event: React.MouseEvent<HTMLElement>) => {
    setStatusAnchorEl(event.currentTarget);
    setStatusOpen(true);
  };

  const handleStatusClose = () => {
    setStatusOpen(false);
    setStatusAnchorEl(null);
  };

  const handleWatcherToggle = () => {
    const urlValues = {
      ticketId: ticket?.ticketId,
      status: watcherEnabled ? 1 : 2,
    };
    const payload = {
      url: `watchers-status/${urlValues.ticketId}/${urlValues.status}`,
      method: "PUT",
    };
    triggerWatcherStatus(payload).then((res: any) => {
      if (res?.error?.data?.type === "error") {
        return;
      } else {
        setWatcherEnabled(!watcherEnabled);
      }
    });
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
    const watchID = watcherId;
    const ticketvalue = { ticket: ticket?.ticketId };
    const payload = {
      url: `remove-watcher/${ticketvalue.ticket}/${watchID}`,
      method: "DELETE",
    };

    triggerDeleteWatcher(payload)
      //@ts-ignore
      .unwrap()
      .then(() => {
        refetch();
      })
      .catch((error: any) => {
        showToast(error?.message || "Failed to remove watcher", "error");
      });
  };

  const handleAddWatcher = (newWatcher: any) => {
    const selectedAgentId = newWatcher?.agentID;
    if (!selectedAgentId) {
      return;
    }

    const isAlreadyAdded = watcherData?.some(
      (existing: any) => existing?.watchKey === selectedAgentId
    );
    if (isAlreadyAdded) {
      return;
    }

    const ticketID = ticket?.ticketId;
    const payload = {
      url: `add-watcher/${ticketID}`,
      //@ts-ignore
      body: { watchers: [selectedAgentId] },
    };
    triggerWatchApi(payload)
      //@ts-ignore
      .unwrap()
      .then(() => {
        setOnChangeAgent("");
        refetch();
      })
      .catch((error: any) => {
        showToast(error?.message || "An error occurred", "error");
      });
  };

  const handleMoreDrawerOpen = () => {
    setMoreDrawerOpen(true);
  };

  const handleMoreDrawerClose = () => {
    setMoreDrawerOpen(false);
    setMoreOptionsSearchQuery(""); // Clear search when drawer closes
  };

  return (
    <div className="flex items-center w-full px-6 py-2 border border-[#d4e6ff]  bg-[#e8f0fe] z-10">
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
          {ticket?.ticketId && ticket?.ticketId}
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
          tooltip="Forward"
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
              More <ReadMoreIcon fontSize="small" className="text-blue-600 " />
            </div>
          }
          tooltip="More Options"
          onClick={handleMoreDrawerOpen}
        />
      </div>

      {/* Navigation buttons - Right side */}

      <div className="flex gap-8 ml-auto items-center">
        {watcherStatusLoading && <CircularProgress size={15} />}
        <div className="space-x-2">
          <Tooltip
            title={watcherEnabled ? "Disable Watchers" : "Enable Watchers"}
            placement="right"
          >
            <Switch
              checked={watcherEnabled}
              onChange={handleWatcherToggle}
              size="small"
              sx={{
                "& .MuiSwitch-switchBase.Mui-checked": {
                  color: "#1a73e8",
                  "& + .MuiSwitch-track": {
                    backgroundColor: "#1a73e8",
                  },
                },
                "& .MuiSwitch-track": {
                  backgroundColor: "#d1d5db",
                },
              }}
            />
          </Tooltip>
          <Tooltip
            title={
              <Box className="p-2 rounded-md text-black">
                <Typography
                  variant="body2"
                  sx={{ fontWeight: "bold", mb: 0.5 }}
                >
                  Ticket watchers ({watcherData?.length})
                </Typography>
                <Typography variant="caption" sx={{ display: "block", mb: 1 }}>
                  Agents added as watchers will receive alerts when this ticket
                  is updated
                </Typography>
              </Box>
            }
            placement="bottom"
            componentsProps={{
              tooltip: {
                sx: {
                  backgroundColor: "white",
                  color: "black",
                  boxShadow: 3,
                  border: "1px solid #e0e0e0",
                },
              },
            }}
          >
            {watcherEnabled ? (
              <IconButton
                onClick={handleWatchersClick}
                size="small"
                className="text-blue-600 hover:bg-blue-50 hover:text-blue-600"
              >
                <VisibilityIcon fontSize="small" />
              </IconButton>
            ) : (
              <IconButton disabled size="small" disableRipple>
                <VisibilityOffIcon fontSize="small" />
              </IconButton>
            )}
          </Tooltip>
        </div>
        {/* Previous Ticket Button */}
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

        {/* Next Ticket Button */}
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

      <CustomSideBarPanel
        open={isLinkModal}
        close={() => setIsLinkModal(false)}
        title={
          <div className="flex items-center gap-2">
            <LinkIcon fontSize="small" />
            <Typography variant="subtitle1" fontWeight={600}>
              Link Ticket
            </Typography>
          </div>
        }
        width={600}
      >
        <LinkTickets
          open={isLinkModal}
          onClose={() => setIsLinkModal(false)}
          currentTicket={{
            id: ticket?.ticketId,
            title: ticket?.subject,
            subject: ticket?.subject,
          }}
        />
      </CustomSideBarPanel>

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
              Edit Ticket (#{ticketNumber})
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
          ticket={{
            subject: ticket?.subject,
            description: ticket?.body,
            client: {
              id: ticket?.userID,
              name: ticket?.username,
              email: ticket?.email,
            },
            ticketId: ticket?.ticketId,
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
            id: ticket?.userID,
            name: ticket?.username,
            email: ticket?.email,
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
          ticket={{
            id: ticket?.ticketId,
            status: ticket?.status?.key,
          }}
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
        onClose={() => {
          setIsSpamModal(false);
          setSpamTicketSuccess(false);
        }}
        onConfirm={() => handleSpamTicket(ticketNumber, spamValue)}
        type="custom"
        title={`${spamValue ? "Unspam" : "Spam"} Ticket`}
        message={`Are you sure you want to ${
          spamValue ? "unspam" : "spam"
        } this ticket?`}
        isSuccess={spamTicketSuccess}
        isLoading={isSpamTicketLoading}
        successMessage={`Ticket ${
          spamValue ? "unspammed" : "spammed"
        } successfully`}
      />

      {/* Watchers Popover */}
      <Popover
        open={watchersOpen}
        anchorEl={watchersAnchorEl}
        onClose={handleWatchersClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
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
          <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
            Ticket watchers ({watcherData?.length})
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary", mb: 2 }}>
            Agents added as watchers will receive alerts when this ticket is
            updated
          </Typography>

          <Autocomplete
            key={`watchers-${watcherData?.length}`}
            disableClearable={false}
            popupIcon={null}
            sx={{ my: 1.5 }}
            getOptionLabel={(option: any) => {
              if (typeof option === "string") return option;
              return option.fName || "";
            }}
            value={null}
            inputValue={onChangeAgent}
            isOptionEqualToValue={(option: any, value: any) =>
              option?.agentID === value?.agentID
            }
            options={displayAgentOptions}
            onChange={(event, newValue) => {
              if (newValue) {
                handleAddWatcher(newValue);
                setOnChangeAgent("");
              }
            }}
            onInputChange={(_, value, reason) => {
              setOnChangeAgent(value);
              if (reason === "input") {
                fetchAgentOptions(value);
              }
            }}
            filterOptions={(x) => x}
            getOptionDisabled={(option) =>
              typeof option === "string" && option === "Type to search"
            }
            clearOnBlur
            selectOnFocus
            handleHomeEndKeys
            noOptionsText={
              <div>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {seachAgentLoading ? (
                    <CircularProgress size={18} />
                  ) : (
                    "Type to search"
                  )}
                </Typography>
              </div>
            }
            renderOption={(props, option: any) => (
              <li {...props}>
                {typeof option === "string" ? (
                  option
                ) : (
                  <div className="flex flex-col" key={option.agentID}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                      {option.fName} {option.lName}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {option.emailAddress}
                    </Typography>
                  </div>
                )}
              </li>
            )}
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder="Add more watchers..."
                size="small"
                fullWidth
                InputProps={{
                  ...params.InputProps,
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonAddIcon fontSize="small" />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "4px",
                    backgroundColor: "#f9fafb",
                    "&:hover fieldset": { borderColor: "#9ca3af" },
                    "&.Mui-focused fieldset": { borderColor: "#1a73e8" },
                  },
                  "& label.Mui-focused": { color: "#1a73e8" },
                  "& label": { fontWeight: "bold" },
                }}
              />
            )}
          />

          {/* Watchers List */}
          <Box sx={{ maxHeight: 200, overflowY: "auto" }}>
            {watcherLoading ? (
              <CircularProgress size={18} />
            ) : (
              <>
                {watcherData?.map((watcher: any) => (
                  <Box
                    key={watcher?.watchKey}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      p: 1,
                      border: "1px solid #e0e0e0",
                      borderRadius: 1,
                      mb: 1,
                      "&:hover": {
                        backgroundColor: "#f5f5f5",
                      },
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      {isDeletingLoading && trackId === watcher?.watchKey ? (
                        <CircularProgress size={16} sx={{ mr: 1 }} />
                      ) : (
                        <IconButton
                          size="small"
                          onClick={() => {
                            setTrackId(watcher?.watchKey);
                            handleRemoveWatcher(watcher?.watchKey);
                          }}
                          sx={{
                            color: "#ef4444",
                            mr: 1,
                            "&:hover": { backgroundColor: "#fee2e2" },
                          }}
                        >
                          <CloseIcon fontSize="small" />
                        </IconButton>
                      )}
                      <Avatar
                        sx={{
                          width: 32,
                          height: 32,
                          mr: 1,
                          fontSize: "0.875rem",
                        }}
                      >
                        {watcher?.firstName?.charAt(0).toUpperCase()}
                      </Avatar>
                      <Box>
                        <Typography variant="body2">
                          {watcher.firstName} {watcher.lastName}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {watcher?.emailID}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                ))}
              </>
            )}
          </Box>
        </Box>
      </Popover>

      {/* More Options Drawer */}
      <Drawer
        anchor="right"
        open={moreDrawerOpen}
        onClose={handleMoreDrawerClose}
        PaperProps={{
          sx: {
            width: "30%",
            borderTopLeftRadius: "50px",
            borderBottomLeftRadius: "50px",
            borderTopRightRadius: "0px",
            borderBottomRightRadius: "0px",
          },
        }}
      >
        <Box sx={{ p: 3, height: "100%" }}>
          {/* Header */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: 3,
            }}
          >
            <Typography
              variant="h5"
              sx={{ fontWeight: "bold", color: "#1e293b" }}
            >
              More Options
            </Typography>
            <IconButton
              onClick={handleMoreDrawerClose}
              sx={{ color: "#64748b" }}
            >
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Search */}
          <TextField
            fullWidth
            placeholder="Search options..."
            size="small"
            value={moreOptionsSearchQuery}
            onChange={(e) => setMoreOptionsSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: "#64748b" }} />
                </InputAdornment>
              ),
            }}
            sx={{
              mb: 2,
              "& .MuiOutlinedInput-root": {
                backgroundColor: "white",
                borderRadius: 2,
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#cbd5e1",
                },
              },
            }}
          />

          {/* Options Grid */}
          <Box
            sx={{
              display: "grid",
              gap: 2,
              py: 1,
              maxHeight: "calc(100vh - 200px)",
              overflowY: "auto",
              paddingRight: 1,
            }}
            id="more-options-grid"
          >
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <Box
                  key={option.id}
                  onClick={option.onClick}
                  sx={{
                    p: 2,
                    backgroundColor: "white",
                    borderRadius: 2,
                    border: "1px solid #e1e7ee",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    "&:hover": {
                      transform: "translateY(-2px)",
                      boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
                      borderColor: "#1a73e8",
                    },
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: 2,
                        backgroundColor: option.iconBg,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {option.icon}
                    </Box>
                    <Box>
                      <Typography
                        variant="subtitle1"
                        sx={{ fontWeight: "bold", color: "#1e293b" }}
                      >
                        {option.title}
                      </Typography>
                      <Typography variant="body2" sx={{ color: "#64748b" }}>
                        {option.description}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              ))
            ) : (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  py: 4,
                  textAlign: "center",
                }}
              >
                <SearchIcon sx={{ fontSize: 48, color: "#9ca3af", mb: 2 }} />
                <Typography
                  variant="h6"
                  sx={{ color: "#6b7280", fontWeight: "medium", mb: 1 }}
                >
                  No options found
                </Typography>
                <Typography variant="body2" sx={{ color: "#9ca3af" }}>
                  Try searching with different keywords
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
      </Drawer>
    </div>
  );
};

export default TicketDetailHeader;
