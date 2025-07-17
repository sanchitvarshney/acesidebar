import React, { useState } from "react";
import TicketFilterPanel from "./TicketSidebar";
import { Avatar, Select, MenuItem } from "@mui/material";
import {
  useGetTicketListQuery,
  useGetPriorityListQuery,
  useGetTicketListSortingQuery,
} from "../../services/ticketAuth";
import { useToast } from "../../hooks/useToast";
import CreateTicketDialog from "./CreateTicketDialog";
import TicketSkeleton from "../skeleton/TicketSkeleton";
import TablePagination from "@mui/material/TablePagination";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CallMergeIcon from "@mui/icons-material/CallMerge";
import BlockIcon from "@mui/icons-material/Block";
import DeleteIcon from "@mui/icons-material/Delete";
import CustomDropdown from "../shared/CustomDropdown";
import PersonIcon from "@mui/icons-material/Person";
import MonitorHeartIcon from "@mui/icons-material/MonitorHeart";
import AgentAssignPopover from "../shared/AgentAssignPopover";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import TicketSubjectTooltip from "../shared/TicketSubjectTooltip";
import TicketSubjectPopover from "../shared/TicketSubjectPopover";

// Priority/Status/Agent dropdown options
const STATUS_OPTIONS = [
  { label: "Open", value: "open" },
  { label: "Pending", value: "pending" },
  { label: "Resolved", value: "resolved" },
  { label: "Closed", value: "closed" },
  { label: "Waiting on Third Party", value: "waiting" },
];
const AGENT_OPTIONS = [
  { label: "Unassigned", value: "" },
  { label: "Admin", value: "admin" },
  { label: "Agent 1", value: "agent1" },
  { label: "Agent 2", value: "agent2" },
];
const SENTIMENT_EMOJI = { POS: "🙂", NEU: "😐", NEG: "🙁" };

const Tickets: React.FC = () => {
  const [sortBy, setSortBy] = useState("Date created");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [selectedTickets, setSelectedTickets] = useState<string[]>([]);
  const [masterChecked, setMasterChecked] = useState(false);
  const [ticketDropdowns, setTicketDropdowns] = useState<
    Record<string, { priority: string; agent: string; status: string }>
  >({});

  const [sortOrder, setSortOrder] = useState("desc");
  const [sortType, setSortType] = useState<string | null>(null);
  const [popoverAnchorEl, setPopoverAnchorEl] = useState<null | HTMLElement>(
    null
  );
  const [popoverTicket, setPopoverTicket] = useState<any>(null);
  const [popoverHovered, setPopoverHovered] = useState(false);
  const closePopoverTimer = React.useRef<NodeJS.Timeout | null>(null);

  // Fetch live priority list
  const { data: priorityList, isLoading: isPriorityListLoading } =
    useGetPriorityListQuery();

  // Map API priorities to dropdown options
  const PRIORITY_OPTIONS = (priorityList || []).map((item: any) => ({
    label: item.specification,
    value: item.priorityName,
    color: item.color,
    key: item?.key,
  }));
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
    setPopoverTicket(ticket);
    setPopoverHovered(true);
  };

  const handlePopoverClose = () => {
    setPopoverAnchorEl(null);
    setPopoverTicket(null);
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
      setPopoverTicket(null);
    }, 200);
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
      status: ticket.status || "open",
    };
    return (
      <div
        key={ticket?.ticketNumber}
        className="bg-white rounded border border-gray-200 mb-3 flex items-center px-4 py-3 shadow-sm hover:shadow transition relative"
      >
        {/* Left: Checkbox, Avatar, Sentiment */}
        <div className="flex items-center mr-4 min-w-[60px]">
          <input
            type="checkbox"
            // className="mr-3"
            className="mr-2 w-4 h-4 accent-blue-600"
            checked={selectedTickets.includes(ticket.ticketNumber)}
            onChange={() => handleTicketCheckbox(ticket.ticketNumber)}
          />
          <div className="relative">
            {ticket?.avatarUrl ? (
              <Avatar src={ticket.avatarUrl} className="w-10 h-10" />
            ) : (
              <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center text-lg font-bold text-pink-600">
                {ticket?.fromUser?.name[0] || "D"}
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
                  onMouseEnter={(e) => {
                    onMouseEnter(e);
                    handlePopoverOpen(e, ticket);
                  }}
                  onMouseLeave={(e) => {
                    onMouseLeave(e);
                    handlePopoverLeave();
                  }}
                >
                  {ticket?.subject}
                </span>
              )}
            />
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600 flex-wrap">
            <span className="flex items-center gap-1">
              <span className="text-gray-800 text-base">
                #{ticket?.ticketNumber} |{" "}
              </span>
              <span
                className="font-medium max-w-[120px] truncate overflow-hidden whitespace-nowrap"
                title={ticket.fromUser?.name}
              >
                {ticket.fromUser?.name}
              </span>
              <span className="text-xs">
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
        <div className="flex flex-col items-end gap-1 min-w-[140px] ml-4">
          <div className="flex items-center w-full">
            <CustomDropdown
              value={dropdownState.priority}
              onChange={(val) =>
                setTicketDropdowns((prev) => ({
                  ...prev,
                  [ticket.ticketNumber]: { ...dropdownState, priority: val },
                }))
              }
              options={PRIORITY_OPTIONS}
              colorDot={true}
              width={90}
            />
          </div>
          <div className="flex items-center w-full">
            <AgentAssignPopover
              value={dropdownState.agent || "Unassigned"}
              onChange={(val) =>
                setTicketDropdowns((prev) => ({
                  ...prev,
                  [ticket.ticketNumber]: { ...dropdownState, agent: val },
                }))
              }
              agentList={["Admin", "Agent 1", "Agent 2"]}
              departmentList={["Support", "Sales", "Billing"]}
              trigger={
                <span
                  className="flex items-center gap-1 text-gray-600 text-sm cursor-pointer max-w-[120px] truncate overflow-hidden whitespace-nowrap"
                  title={dropdownState.agent || "Unassigned"}
                >
                  <PersonIcon fontSize="small" />
                  <span>{dropdownState.agent || "Unassigned"}</span>
                  <ArrowDropDownIcon fontSize="small" />
                </span>
              }
            />
          </div>
          <div className="flex items-center w-full">
            <MonitorHeartIcon fontSize="small" className="mr-1 text-gray-500" />
            <CustomDropdown
              value={dropdownState.status}
              onChange={(val) =>
                setTicketDropdowns((prev) => ({
                  ...prev,
                  [ticket.ticketNumber]: { ...dropdownState, status: val },
                }))
              }
              options={STATUS_OPTIONS}
              colorDot={false}
              width={110}
            />
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="flex flex-col bg-gray-50 h-[calc(100vh-160px)]">
        {/* Main Header Bar */}
        <div className="flex items-center justify-between px-6 pb-2 border-b bg-white w-full">
          {/* Left: Title, master checkbox, count, and action buttons (inline) */}
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <input
              type="checkbox"
              className="mr-2 w-5 h-5 accent-blue-600"
              checked={masterChecked}
              onChange={handleMasterCheckbox}
              aria-label="Select all tickets"
            />
            <span className="text-xl font-semibold whitespace-nowrap">
              All tickets
            </span>
            <span className="bg-gray-200 text-gray-700 rounded px-2 py-0.5 text-xs font-semibold ml-1">
              {ticketList?.data?.length}
            </span>
            {selectedTickets.length > 0 && (
              <div className="flex items-center gap-2 ml-4 flex-wrap">
                <button className="flex items-center gap-1 px-3 py-1 border border-gray-300 rounded bg-white text-sm font-medium shadow-sm hover:bg-gray-100">
                  <PersonAddAltIcon
                    fontSize="small"
                    sx={{ color: "#1976d2" }}
                  />{" "}
                  Assign
                </button>
                <button className="flex items-center gap-1 px-3 py-1 border border-gray-300 rounded bg-white text-sm font-medium shadow-sm hover:bg-gray-100">
                  <CheckCircleIcon fontSize="small" sx={{ color: "#43a047" }} />{" "}
                  Close
                </button>
                {/* <button className="flex items-center gap-1 px-3 py-1 border border-gray-300 rounded bg-white text-sm font-medium shadow-sm hover:bg-gray-100">
                  <SyncAltIcon fontSize="small" /> Bulk update
                </button> */}
                <button className="flex items-center gap-1 px-3 py-1 border border-gray-300 rounded bg-white text-sm font-medium shadow-sm hover:bg-gray-100">
                  <CallMergeIcon fontSize="small" sx={{ color: "#ff9800" }} />{" "}
                  Merge
                </button>
                {/* <button className="flex items-center gap-1 px-3 py-1 border border-gray-300 rounded bg-white text-sm font-medium shadow-sm hover:bg-gray-100">
                  <AssignmentIcon fontSize="small" /> Scenarios
                </button> */}
                <button className="flex items-center gap-1 px-3 py-1 border border-gray-300 rounded bg-white text-sm font-medium shadow-sm hover:bg-gray-100">
                  <BlockIcon fontSize="small" sx={{ color: "#e53935" }} /> Spam
                </button>
                <button className="flex items-center gap-1 px-3 py-1 border border-gray-300 rounded bg-white text-sm font-medium shadow-sm hover:bg-gray-100">
                  <DeleteIcon fontSize="small" sx={{ color: "#6d4c41" }} />{" "}
                  Delete
                </button>
              </div>
            )}
            {selectedTickets.length === 0 && (
              <div className="flex items-center gap-2 ml-4">
                <span className="text-sm text-gray-600">Sort by:</span>
                <Select
                  size="small"
                  value={sortBy}
                  onChange={(e) => {
                    setSortBy(e.target.value);
                    let type = "createdAt";
                    if (e.target.value === "Priority") type = "priority";
                    else if (e.target.value === "Status") type = "status";
                    else if (e.target.value === "Date created")
                      type = "createdAt";
                    setSortType(type);
                    setSortOrder("desc");
                  }}
                  sx={{ minWidth: 140, background: "#fff" }}
                >
                  <MenuItem value="Date created">Date created</MenuItem>
                  <MenuItem value="Priority">Priority</MenuItem>
                  <MenuItem value="Status">Status</MenuItem>
                </Select>
              </div>
            )}
          </div>

          {/* Right: Controls */}
          <div className="flex items-center gap-3 flex-wrap">
            {/* Export */}
            <button className="px-3 py-1 border border-gray-300 rounded bg-white text-sm font-medium hover:bg-gray-100">
              Export
            </button>
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
            <button
              className="bg-blue-600 text-white px-4 py-1.5 rounded font-semibold text-sm"
              onClick={() => setCreateDialogOpen(true)}
            >
              + New
            </button>
          </div>
        </div>
        {/* Main Content: Tickets + Filters */}
        <div className="flex flex-1 h-0 min-h-0">
          {/* Ticket List */}
          <div className="flex-1 p-3 h-full overflow-y-auto">
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
          <div className="w-80 min-w-[300px] border-l bg-white flex flex-col h-full">
            <div className="flex-1 overflow-y-auto h-full">
              <TicketFilterPanel onApplyFilters={handleApplyFilters} />
            </div>
          </div>
        </div>
      </div>
      {createDialogOpen && (
        <CreateTicketDialog
          open={createDialogOpen}
          onClose={() => {
            setCreateDialogOpen(false);
            refetch();
          }}
        />
      )}
    </>
  );
};

export default Tickets;
