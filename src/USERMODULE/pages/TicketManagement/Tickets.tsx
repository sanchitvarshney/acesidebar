import React, { useState } from "react";
import TicketFilterPanel from "./TicketSidebar";
import { Avatar, IconButton, Button, Checkbox } from "@mui/material";
import LeftMenu from "./LeftMenu";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
import {
  useGetTicketListQuery,
  useGetPriorityListQuery,
  useGetTicketListSortingQuery,
  useGetTicketSortingOptionsQuery,
} from "../../../services/ticketAuth";
import { useToast } from "../../../hooks/useToast";

import TicketSkeleton from "../../skeleton/TicketSkeleton";
import TablePagination from "@mui/material/TablePagination";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CallMergeIcon from "@mui/icons-material/CallMerge";
import BlockIcon from "@mui/icons-material/Block";
import CustomDropdown from "../../../components/shared/CustomDropdown";
import PersonIcon from "@mui/icons-material/Person";
import MonitorHeartIcon from "@mui/icons-material/MonitorHeart";
import AgentAssignPopover from "../../../components/shared/AgentAssignPopover";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import TicketSubjectPopover from "../../../components/shared/TicketSubjectPopover";
import TicketSortingPopover from "../../../components/shared/TicketSortingPopover";
import FilterListIcon from "@mui/icons-material/FilterList";
import TicketDetailTemplate from "./TicketDetailTemplate";
import { useGetTicketDetailStaffViewQuery } from "../../../services/ticketDetailAuth";
import DeleteIcon from "@mui/icons-material/Delete";
import TicketDetailSkeleton from "../../skeleton/TicketDetailSkeleton";
import { useParams, useNavigate } from "react-router-dom";
import UserHoverPopup from "../../../components/popup/UserHoverPopup";

import {
  useCommanApiMutation,
  useTicketStatusChangeMutation,
} from "../../../services/threadsApi";
import ConfirmationModal from "../../../components/reusable/ConfirmationModal";
import AssignTicket from "../../components/AssignTicket";
import CustomSideBarPanel from "../../../components/reusable/CustomSideBarPanel";
import Mergeticket from "../../components/Mergeticket";

// Priority/Status/Agent dropdown options
const STATUS_OPTIONS = [
  { label: "Open", value: "open" },
  { label: "Pending", value: "pending" },
  { label: "Resolved", value: "resolved" },
  { label: "Closed", value: "closed" },
  { label: "Waiting on Third Party", value: "waiting" },
];
const SENTIMENT_EMOJI = { POS: "🙂", NEU: "😐", NEG: "🙁" };

const Tickets: React.FC = () => {
  const navigate = useNavigate();
  // Page-based navigation now handled via router; keep default UI static
  const [sortBy, setSortBy] = useState("Sort By");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [selectedTickets, setSelectedTickets] = useState<string[]>([]);
  const [masterChecked, setMasterChecked] = useState(false);
  const [ticketDropdowns, setTicketDropdowns] = useState<
    Record<string, { priority: string; agent: string; status: string }>
  >({});

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const openAssign = Boolean(anchorEl);

  const handleAssignClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleAssignClose = () => {
    setAnchorEl(null);
  };

  const [sortOrder, setSortOrder] = useState("desc");
  const [sortType, setSortType] = useState<string | null>(null);
  const [popoverAnchorEl, setPopoverAnchorEl] = useState<null | HTMLElement>(
    null
  );

  const [popoverHovered, setPopoverHovered] = useState(false);
  const closePopoverTimer = React.useRef<NodeJS.Timeout | null>(null);

  const [userPopoverAnchorEl, setUserPopoverAnchorEl] =
    useState<null | HTMLElement>(null);
  const [userPopoverHovered, setUserPopoverHovered] = useState(false);
  const userPopoverTimer = React.useRef<NodeJS.Timeout | null>(null);
  const [userPopoverUser, setUserPopoverUser] = useState<any>(null);

  const [filtersOpen, setFiltersOpen] = useState(true);
  const [isMergeModal, setIsMergeModal] = useState(false);

  // Sorting popover state
  const [sortingPopoverAnchorEl, setSortingPopoverAnchorEl] =
    useState<HTMLElement | null>(null);
  const [sortingPopoverOpen, setSortingPopoverOpen] = useState(false);
  const [openTicketNumber, setOpenTicketNumber] = useState<string | null>(null);

  const [userPopupAnchorEl, setUserPopupAnchorEl] =
    useState<HTMLElement | null>(null);
  const [userPopupUser, setUserPopupUser] = useState<any>(null);
  const userPopupTimer = React.useRef<NodeJS.Timeout | null>(null);
  const [copiedTicketNumber, setCopiedTicketNumber] = useState<string | null>(
    null
  );
  const [isDeleteModal, setIsDeleteModal] = useState(false);
  const [isCloseModal, setIsCloseModal] = useState(false);
  const [ticketStatusChange] = useTicketStatusChangeMutation();
  const [commanApi] = useCommanApiMutation();

  // Fetch live priority list
  const { data: priorityList, isLoading: isPriorityListLoading } =
    useGetPriorityListQuery();

  // Fetch sorting options
  const { data: sortingOptions, isLoading: isSortingOptionsLoading } =
    useGetTicketSortingOptionsQuery();

  // const [closeTicket] = useCloseTicketMutation();

  const optionsRef = React.useRef(null);

  // Map API priorities to dropdown options
  const PRIORITY_OPTIONS = (priorityList || []).map((item: any) => ({
    label: item.specification,
    value: item.priorityName,
    color: item.color,
    key: item?.key,
  }));

  // Handle sorting popover open
  const handleSortingPopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
    setSortingPopoverAnchorEl(event.currentTarget);
    setSortingPopoverOpen(true);
  };

  // Handle sorting popover close
  const handleSortingPopoverClose = () => {
    setSortingPopoverOpen(false);
    setSortingPopoverAnchorEl(null);
  };

  // Handle field change
  const handleFieldChange = (field: string) => {
    setSortType(field);
    setSortBy(
      sortingOptions?.fields?.find((f: any) => f.key === field)?.text ||
        "Date created"
    );
    setSortOrder("desc"); // Reset to default order
    setPage(1); // Reset to first page
  };

  // Handle mode change
  const handleModeChange = (mode: string) => {
    setSortOrder(mode);
    setPage(1); // Reset to first page
  };
  // Restore getApiParams for ticket list API
  const getApiParams = () => {
    return {
      page,
      limit,
    };
  };
  const {
    data: ticketList,
    isLoading: isTicketListLoading,
    isFetching: isTicketListFetching,
    refetch,
  } = useGetTicketListQuery(getApiParams());
  const sortingParams = sortType
    ? { type: sortType, order: sortOrder, page, limit }
    : undefined;
  const {
    data: sortedTicketList,
    isLoading: isSortedTicketListLoading,
    isFetching: isSortedTicketListFetching,
    refetch: refetchSorted,
  } = useGetTicketListSortingQuery(
    sortingParams as {
      type: string;
      order: string;
      page: number;
      limit: number;
    },
    { skip: !sortType }
  );
  const { showToast } = useToast();
  const ticketsToShow = sortType ? sortedTicketList : ticketList;
  const isTicketsLoading = sortType
    ? isSortedTicketListLoading
    : isTicketListLoading;
  const isTicketsFetching = sortType
    ? isSortedTicketListFetching
    : isTicketListFetching;
  console.log(ticketsToShow);
  // Handle filter apply
  const handleApplyFilters = (newFilters: any) => {
    // TODO: Trigger API call with newFilters
  };

  // Handle ticket checkbox change
  const handleTicketCheckbox = (ticketId: string) => {
    setSelectedTickets((prev) =>
      prev.includes(ticketId)
        ? prev.filter((id) => id !== ticketId)
        : [...prev, ticketId]
    );
  };

  // Handle master checkbox change
  const handleMasterCheckbox = () => {
    if (selectedTickets.length === ticketList?.data?.length) {
      setSelectedTickets([]);
      setMasterChecked(false);
    } else {
      setSelectedTickets(
        ticketList?.data?.map((t: any) => t.ticketNumber) || []
      );
      setMasterChecked(true);
    }
  };

  // Update master checkbox if all/none selected
  React.useEffect(() => {
    if (!ticketList?.data) return;
    setMasterChecked(
      ticketList.data.length > 0 &&
        selectedTickets.length === ticketList.data.length
    );
  }, [selectedTickets, ticketList]);

  const handlePopoverOpen = (
    event: React.MouseEvent<HTMLElement>,
    ticket: any
  ) => {
    if (closePopoverTimer.current) {
      clearTimeout(closePopoverTimer.current);
      closePopoverTimer.current = null;
    }
    setPopoverAnchorEl(event.currentTarget as HTMLElement);
    setPopoverHovered(true);
  };

  const handlePopoverClose = () => {
    setPopoverAnchorEl(null);
    setPopoverHovered(false);
  };

  const handlePopoverEnter = () => {
    if (closePopoverTimer.current) {
      clearTimeout(closePopoverTimer.current);
      closePopoverTimer.current = null;
    }
    setPopoverHovered(true);
  };

  const handlePopoverLeave = () => {
    closePopoverTimer.current = setTimeout(() => {
      setPopoverHovered(false);
      setPopoverAnchorEl(null);
    }, 200);
  };

  const handleUserPopoverOpen = (
    event: React.MouseEvent<HTMLElement>,
    user: any
  ) => {
    if (userPopoverTimer.current) {
      clearTimeout(userPopoverTimer.current);
      userPopoverTimer.current = null;
    }
    setUserPopoverAnchorEl(event.currentTarget as HTMLElement);
    setUserPopoverUser(user);
    setUserPopoverHovered(true);
  };
  const handleUserPopoverClose = () => {
    setUserPopoverAnchorEl(null);
    setUserPopoverUser(null);
    setUserPopoverHovered(false);
  };
  const handleUserPopoverEnter = () => {
    if (userPopoverTimer.current) {
      clearTimeout(userPopoverTimer.current);
      userPopoverTimer.current = null;
    }
    setUserPopoverHovered(true);
  };
  const handleUserPopoverLeave = () => {
    userPopoverTimer.current = setTimeout(() => {
      setUserPopoverHovered(false);
      setUserPopoverAnchorEl(null);
      setUserPopoverUser(null);
    }, 200);
  };

  // Handle user popup hover with delay
  const handleUserHover = (event: React.MouseEvent<HTMLElement>, user: any) => {
    if (userPopupTimer.current) {
      clearTimeout(userPopupTimer.current);
      userPopupTimer.current = null;
    }
    setUserPopupAnchorEl(event.currentTarget);
    setUserPopupUser(user);
  };

  const handleUserLeave = () => {
    userPopupTimer.current = setTimeout(() => {
      setUserPopupAnchorEl(null);
      setUserPopupUser(null);
    }, 500); // 0.5 second delay
  };

  const handlePopupEnter = () => {
    if (userPopupTimer.current) {
      clearTimeout(userPopupTimer.current);
      userPopupTimer.current = null;
    }
  };

  const handlePopupLeave = () => {
    setUserPopupAnchorEl(null);
    setUserPopupUser(null);
  };

  const handleCopyTicketNumber = async (ticketNumber: string) => {
    try {
      await navigator.clipboard.writeText(ticketNumber);
      setCopiedTicketNumber(ticketNumber);
      setTimeout(() => setCopiedTicketNumber(null), 2000); // Reset after 2 seconds
    } catch (err) {
      console.error("Failed to copy ticket number:", err);
    }
  };

  const { id: routeTicketId } = useParams();

  // When a ticket is opened, update the URL
  const handleTicketSubjectClick = (ticketNumber: string) => {
    setOpenTicketNumber(ticketNumber);
    navigate(`/tickets/${ticketNumber}`);
  };

  // When closing a ticket, go back to /tickets
 

  // On mount, if there is an id param, open that ticket
  React.useEffect(() => {
    if (routeTicketId) {
      setOpenTicketNumber(routeTicketId);
    }
  }, [routeTicketId]);

  // Cleanup timer on unmount
  React.useEffect(() => {
    return () => {
      if (userPopupTimer.current) {
        clearTimeout(userPopupTimer.current);
      }
    };
  }, []);

  // const handleSendReply = (replyText: string, threadItem?: any) => {

  //   if (replyText.trim()) {

  //     console.log("Sending reply:", replyText, threadItem);
  //     setIsSuccessModal(true);

  //   } else {
  //     showToast("Please enter a reply message", "error");
  //   }
  // };

  const handleDelete = () => {
    if (selectedTickets.length < 0) {
      return;
    }
    const payload = {
      url: "delete-ticket",
      body: { ids: selectedTickets },
    };

    commanApi(payload);
  };

  const handleClose = () => {
    if (selectedTickets.length < 0) {
      return;
    }
    const payload = {
      url: "close-ticket",
      body: { ids: selectedTickets },
    };

    commanApi(payload);
  };

  const handleDropdownChange = (value: any, ticket: any, type: any) => {
    const payload = {
      type,
      body: { ticketId: ticket.ticketNumber, priority: value },
    };
    ticketStatusChange(payload);

    // setTicketDropdowns((prev) => ({
    //   ...prev,
    //   [ticket.ticketNumber]: { ...dropdownState, priority: value },
    // }));
  };



  // Card-style ticket rendering
  const renderTicketCard = (ticket: any) => {
    // Sentiment emoji logic
    const sentiment: keyof typeof SENTIMENT_EMOJI = ticket.sentiment || "NEU";
    const emoji = SENTIMENT_EMOJI[sentiment] || "😐";
    // State for dropdowns
    const dropdownState = ticketDropdowns[ticket.ticketNumber] || {
      priority: ticket.priority?.value || ticket.priority?.name || "low",
      agent: ticket.assignedTo?.name || "",
      status:
        typeof ticket.status === "object" && ticket.status !== null
          ? (ticket.status as any).name || ticket.status
          : ticket.status || "open",
    };
    return (
      <div
        key={ticket?.ticketNumber}
        className="relative bg-white rounded border border-blue-200 mb-3 flex items-center px-4 py-2 shadow-sm transition-shadow
    hover:shadow-[inset_1px_0_0_rgb(218,220,224),inset_-1px_0_0_rgb(218,220,224),0_1px_2px_0_rgba(60,64,67,0.3),0_1px_3px_1px_rgba(60,64,67,0.15)]
    before:content-[''] before:absolute before:top-0 before:left-0 before:w-1 before:h-full before:bg-[#1a73e8] before:rounded-l"
      >
        {/* Left: Checkbox, Avatar, Sentiment */}
        <div className="flex items-center mr-4 min-w-[60px]">
          <Checkbox
            checked={selectedTickets.includes(ticket.ticketNumber)}
            onChange={() => handleTicketCheckbox(ticket.ticketNumber)}
            sx={{
              mr: 1,
              color: "#666",
              "&.Mui-checked": {
                color: "#1a73e8",
              },
              "&:hover": {
                backgroundColor: "rgba(26, 115, 232, 0.04)",
              },
            }}
          />
          <div className="relative">
            {ticket?.avatarUrl ? (
              <Avatar src={ticket?.avatarUrl} className="w-10 h-10" />
            ) : (
              <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center text-lg font-bold text-pink-600">
                {ticket?.fromUser?.name?.[0] || "D"}
              </div>
            )}
            {/* Sentiment emoji overlay */}
            <span
              className="absolute -bottom-1 -right-1 text-xl"
              title="Sentiment"
            >
              {emoji}
            </span>
          </div>
        </div>
        {/* Middle: Ticket info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            {ticket.status === "open" && (
              <span className="bg-red-100 text-red-600 text-xs font-semibold px-2 py-0.5 rounded mr-2">
                First response due
              </span>
            )}
            {ticket.status === "undelivered" && (
              <span className="bg-gray-200 text-pink-600 text-xs font-semibold px-2 py-0.5 rounded mr-2">
                Undelivered
              </span>
            )}
            <TicketSubjectPopover
              anchorEl={popoverAnchorEl}
              open={Boolean(popoverAnchorEl) && popoverHovered}
              onClose={handlePopoverClose}
              onPopoverEnter={handlePopoverEnter}
              onPopoverLeave={handlePopoverLeave}
              name={ticket.fromUser?.name || "Unknown"}
              actionType={"forwarded"}
              date={ticket.createdDt?.timestamp || ""}
              message={
                typeof ticket.description === "string"
                  ? ticket.description
                  : ticket.description?.name || ""
              }
              avatar={ticket.avatarUrl}
              children={({ onMouseEnter, onMouseLeave }) => (
                <span
                  className="font-semibold text-gray-800 truncate text-lg max-w-[320px] overflow-hidden whitespace-nowrap cursor-pointer"
                  title={ticket?.subject}
                  onClick={() => handleTicketSubjectClick(ticket.ticketNumber)}
                >
                  {ticket?.subject}
                </span>
              )}
            />
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600 flex-wrap">
            <span className="flex items-center gap-1">
              <span className="flex items-center gap-1">
                <span className="text-xs text-gray-800 text-base">
                  #{ticket?.ticketNumber}
                </span>
                <IconButton
                  size="small"
                  onClick={() => handleCopyTicketNumber(ticket?.ticketNumber)}
                  sx={{
                    p: 0.5,
                    color:
                      copiedTicketNumber === ticket?.ticketNumber
                        ? "#4caf50"
                        : "#666",
                    "&:hover": {
                      backgroundColor: "rgba(0, 0, 0, 0.04)",
                    },
                  }}
                >
                  {copiedTicketNumber === ticket?.ticketNumber ? (
                    <CheckCircleOutlineIcon sx={{ fontSize: 14 }} />
                  ) : (
                    <ContentCopyIcon sx={{ fontSize: 14 }} />
                  )}
                </IconButton>
                <span className="text-xs text-gray-800"></span>
              </span>
              {/* <UserPopover
                anchorEl={userPopoverAnchorEl}
                open={Boolean(userPopoverAnchorEl) && userPopoverHovered}
                onClose={handleUserPopoverClose}
                onPopoverEnter={handleUserPopoverEnter}
                onPopoverLeave={handleUserPopoverLeave}
                avatar={ticket.fromUser?.avatarUrl}
                name={ticket.fromUser?.name || ""}
                company={ticket.fromUser?.company}
                email={ticket.fromUser?.email}
                phone={ticket.fromUser?.phone}
                children={({ onMouseEnter, onMouseLeave }) => (
                  <span
                    className="font-medium max-w-[120px] truncate overflow-hidden whitespace-nowrap cursor-pointer hover:underline"
                    title={ticket.fromUser?.name}
                    onMouseEnter={(e) => {
                      onMouseEnter(e);
                      handleUserPopoverOpen(e, ticket.fromUser);
                    }}
                    onMouseLeave={(e) => {
                      onMouseLeave(e);
                      handleUserPopoverLeave();
                    }}
                  >
                    {ticket.fromUser?.name}
                  </span>
                )}
              /> */}
              <span
                className="text-xs max-w-[120px] truncate overflow-hidden whitespace-nowrap cursor-pointer hover:underline"
                onMouseEnter={(e) => handleUserHover(e, ticket.fromUser)}
                onMouseLeave={handleUserLeave}
              >
                {ticket.fromUser?.name}
              </span>
              <span className="text-xs text-gray-500">
                • Created: {ticket?.createdDt?.timestamp}
              </span>
              {ticket.updatedAt && (
                <span className="text-xs">
                  • Agent responded: {ticket?.stats?.agentRespondedAt?.timeAgo}
                </span>
              )}
              <span className="text-xs"> {ticket?.lastupdate?.timeAgo}</span>
            </span>
          </div>
        </div>
        {/* Right: Priority, Agent, Status dropdowns */}
        <div className="flex flex-col gap-1 w-[140px] ml-4 flex-shrink-0">
          <div className="flex items-center w-full">
            <CustomDropdown
              value={dropdownState.priority}
              onChange={(val) => handleDropdownChange(val, ticket, "priority")}
              options={PRIORITY_OPTIONS}
              colorDot={true}
              width={90}
            />
          </div>
          <div className="flex items-center w-full">
            <AgentAssignPopover
              value={dropdownState.agent || "Unassigned"}
              onChange={(val) => handleDropdownChange(val, ticket, "agent")}
              // onChange={(val) =>
              //   setTicketDropdowns((prev) => ({
              //     ...prev,
              //     [ticket.ticketNumber]: { ...dropdownState, agent: val },
              //   }))
              // }
              agentList={["Admin", "Agent 1", "Agent 2"]}
              departmentList={["Support", "Sales", "Billing"]}
              trigger={
                <Button
                  variant="text"
                  size="small"
                  fullWidth
                  startIcon={
                    <PersonIcon fontSize="small" sx={{ color: "#666" }} />
                  }
                  endIcon={<ArrowDropDownIcon fontSize="small" />}
                  sx={{
                    textTransform: "none",
                    fontSize: "13px",
                    fontWeight: 500,
                    color: "#333",
                    justifyContent: "flex-start",
                    minHeight: "25px",
                    padding: "4px 8px",
                    "&:hover": {
                      backgroundColor: "#f5f5f5",
                    },
                  }}
                >
                  <span
                    style={{
                      fontSize: "13px",
                      maxWidth: "80px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {dropdownState.agent || "Unassigned"}
                  </span>
                </Button>
              }
            />
          </div>
          <div className="flex items-center w-full">
            <CustomDropdown
              value={
                typeof dropdownState.status === "object" &&
                dropdownState.status !== null
                  ? (dropdownState.status as any).name || dropdownState.status
                  : dropdownState.status
              }
              onChange={
                (val) => handleDropdownChange(val, ticket, "status")
                // setTicketDropdowns((prev) => ({
                //   ...prev,
                //   [ticket.ticketNumber]: { ...dropdownState, status: val },
                // }))
              }
              options={STATUS_OPTIONS}
              colorDot={false}
              width={110}
              icon={
                <MonitorHeartIcon fontSize="small" className="text-gray-500" />
              }
            />
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      {/* {isTicketDetailLoading ? (
        <TicketDetailSkeleton />
      ) : openTicketNumber && ticketDetailData ? (
        <TicketDetailTemplate ticket={ticketDetailData} onBack={handleBack} />
      ) : ( */}
        <div className="flex flex-col bg-[#f0f4f9] h-[calc(100vh-115px)]">
          {/* Main Header Bar */}
          <div className="flex items-center justify-between px-5 py-2 pb-2 border-b w-full bg-#f0f4f9">
            {/* Left: Title, master checkbox, count, and action buttons (inline) */}
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <Checkbox
                checked={masterChecked}
                onChange={handleMasterCheckbox}
                aria-label="Select all tickets"
                sx={{
                  mr: 1,
                  color: "#666",
                  "&.Mui-checked": {
                    color: "#1a73e8",
                  },
                  "&:hover": {
                    backgroundColor: "rgba(26, 115, 232, 0.04)",
                  },
                }}
              />
              <span className="text-xl font-semibold whitespace-nowrap">
                All tickets
              </span>
              <span className="bg-[#f0f4f9] text-gray-700 rounded px-2 py-0.5 text-xs font-semibold ml-1">
                {ticketList?.data?.length}
              </span>
              {selectedTickets.length > 0 && (
                <div className="flex items-center gap-2 ml-4 flex-wrap">
                  <Button
                    id="assign-button"
                    variant="contained"
                    size="small"
                    color="inherit"
                    aria-controls={openAssign ? "basic-menu" : undefined}
                    aria-haspopup="true"
                    aria-expanded={openAssign ? "true" : undefined}
                    onClick={handleAssignClick}
                    startIcon={
                      <PersonAddAltIcon
                        fontSize="small"
                        sx={{ color: "#1a73e8" }}
                      />
                    }
                    sx={{
                      fontSize: "0.875rem",
                      fontWeight: 500,
                    }}
                  >
                    Assign
                  </Button>

                  <AssignTicket
                    close={handleAssignClose}
                    open={openAssign}
                    anchorEl={anchorEl}
                    selectedTickets={selectedTickets}
                  />

                  <Button
                    variant="contained"
                    color="inherit"
                    size="small"
                    startIcon={
                      <CheckCircleIcon
                        fontSize="small"
                        sx={{ color: "#43a047" }}
                      />
                    }
                    sx={{
                      fontSize: "0.875rem",
                      fontWeight: 500,
                    }}
                    onClick={() => setIsCloseModal(true)}
                  >
                    Close
                  </Button>
                  <Button
                    variant="contained"
                    color="inherit"
                    size="small"
                    startIcon={
                      <CallMergeIcon
                        fontSize="small"
                        sx={{ color: "#ff9800" }}
                      />
                    }
                    sx={{
                      fontSize: "0.875rem",
                      fontWeight: 500,
                    }}
                    onClick={() => setIsMergeModal(true)}
                  >
                    Merge
                  </Button>
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

                  {/* <Button
                    variant="contained"
                    size="small"
                    color="inherit"
                    startIcon={
                      <BlockIcon fontSize="small" sx={{ color: "#d32f2f" }} />
                    }
                    sx={{
                      fontSize: "0.875rem",
                      fontWeight: 500,
                    }}
                  >
                    Spam
                  </Button> */}
                  <Button
                    variant="contained"
                    size="small"
                    color="inherit"
                    startIcon={
                      <DeleteIcon fontSize="small" sx={{ color: "#d32f2f" }} />
                    }
                    sx={{
                      fontSize: "0.875rem",
                      fontWeight: 500,
                    }}
                    onClick={() => setIsDeleteModal(true)}
                  >
                    Delete
                  </Button>
                </div>
              )}
              {selectedTickets.length === 0 && (
                <div className="flex items-center gap-2 ml-4">
                  <Button
                    variant="contained"
                    size="small"
                    color="inherit"
                    onClick={handleSortingPopoverOpen}
                    endIcon={<FilterAltOutlinedIcon fontSize="small" />}
                    sx={{
                      fontSize: "0.875rem",
                      fontWeight: 500,
                    }}
                  >
                    {sortBy}
                  </Button>

                  <TicketSortingPopover
                    anchorEl={sortingPopoverAnchorEl}
                    open={sortingPopoverOpen}
                    onClose={handleSortingPopoverClose}
                    fields={sortingOptions?.sort?.type || []}
                    modes={sortingOptions?.sort?.mode || []}
                    selectedField={sortType || ""}
                    selectedMode={sortOrder}
                    onFieldChange={handleFieldChange}
                    onModeChange={handleModeChange}
                  />
                </div>
              )}
            </div>

            {/* Right: Controls */}
            <div className="flex items-center gap-3 flex-wrap">
              {/* Pagination */}
              {ticketList?.pagination && (
                <TablePagination
                  component="div"
                  count={ticketList.pagination.total}
                  page={page - 1}
                  onPageChange={(_, newPage) => setPage(newPage + 1)}
                  rowsPerPage={limit}
                  onRowsPerPageChange={(e) => {
                    setLimit(parseInt(e.target.value, 10));
                    setPage(1);
                  }}
                  rowsPerPageOptions={[10, 20, 30, 50, 100]}
                  labelRowsPerPage=""
                />
              )}
              {/* + New Button */}
              <Button
                variant="contained"
                size="small"
                onClick={() => navigate("/create-ticket")}
                sx={{
                  textTransform: "none",
                  fontSize: "0.875rem",
                  fontWeight: 600,
                  backgroundColor: "#1976d2",
                  "&:hover": {
                    backgroundColor: "#1565c0",
                  },
                }}
              >
                + New
              </Button>
              {/* Filters Icon Button */}
              <Button
                variant="contained"
                color="inherit"
                size="small"
                onClick={() => setFiltersOpen((prev) => !prev)}
                startIcon={<FilterListIcon fontSize="small" />}
                aria-label="Toggle Filters"
              >
                Filters
              </Button>
            </div>
          </div>
          {/* Main Content: Tickets + Filters */}
          <div className="flex flex-1 h-0 min-h-0">
            <LeftMenu />
            <div className="flex-1 p-2 h-full overflow-y-auto bg-[#fafafa]">
              {isTicketsFetching ? (
                <TicketSkeleton />
              ) : (
                <div>
                  {ticketsToShow && ticketsToShow?.data?.length > 0 ? (
                    ticketsToShow?.data?.map(renderTicketCard)
                  ) : (
                    <div className="text-gray-400 text-center py-8">
                      No tickets found.
                    </div>
                  )}
                </div>
              )}
            </div>
            {filtersOpen && (
              <div className="w-80 min-w-[300px] border-l bg-white flex flex-col h-full">
                <div className="flex-1 overflow-y-auto h-full">
                  <TicketFilterPanel onApplyFilters={handleApplyFilters} />
                </div>
              </div>
            )}
          </div>
        </div>
      {/* )} */}

      {/* User Hover Popup */}
      <UserHoverPopup
        open={Boolean(userPopupAnchorEl)}
        anchorEl={userPopupAnchorEl}
        onClose={handlePopupLeave}
        onMouseEnter={handlePopupEnter}
        onMouseLeave={handlePopupLeave}
        user={userPopupUser}
      />

      {/* {isSuccessModal && (
        <CustomModal
          open={isSuccessModal}
          onClose={() => {}}
          title={"Ticket Save"}
          msg="Ticket save successfully"
          primaryButton={{
            title: "Go Next",
            onClick: () => {},
          }}
          secondaryButton={{
            title: "Ticket List",
            onClick: () => {
              setIsSuccessModal(false);
            },
          }}
        />
      )} */}
      <ConfirmationModal
        open={isDeleteModal}
        onClose={() => setIsDeleteModal(false)}
        onConfirm={handleDelete}
        type="delete"
      />
      <ConfirmationModal
        open={isCloseModal}
        onClose={() => setIsCloseModal(false)}
        onConfirm={handleClose}
        type="close"
      />
    </>
  );
};

export default Tickets;
