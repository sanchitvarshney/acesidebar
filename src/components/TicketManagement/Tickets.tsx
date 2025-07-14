import React, { useState } from "react";
import TicketFilterPanel from "./TicketSidebar";
import { Avatar } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import {
  useGetTicketListQuery,
  useTicketSearchMutation,
} from "../../services/ticketAuth";
import { useToast } from "../../hooks/useToast";
import CreateTicketDialog from "./CreateTicketDialog";
import TicketSkeleton from "../skeleton/TicketSkeleton";
import TablePagination from "@mui/material/TablePagination";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import SyncAltIcon from "@mui/icons-material/SyncAlt";
import CallMergeIcon from "@mui/icons-material/CallMerge";
import AssignmentIcon from "@mui/icons-material/Assignment";
import BlockIcon from "@mui/icons-material/Block";
import DeleteIcon from "@mui/icons-material/Delete";

const Tickets: React.FC = () => {
  const [sortBy, setSortBy] = useState("Date created");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [selectedTickets, setSelectedTickets] = useState<string[]>([]);
  const [masterChecked, setMasterChecked] = useState(false);
  const [ticketSearch, { isLoading: isTicketSearchLoading }] =
    useTicketSearchMutation();
  const getApiParams = () => {
    const params: any = {
      page,
      limit,
    };

    // Map UI filters to API parameters
    // if (currentFilter !== "all") {
    //   if (["emergency", "high", "normal", "low"].includes(currentFilter)) {
    //     params.priority = currentFilter.toUpperCase();
    //   } else if (
    //     ["open", "in-progress", "resolved", "closed"].includes(currentFilter)
    //   ) {
    //     params.status = currentFilter.toUpperCase();
    //   }
    // }

    // if (currentTag) {
    //   params.department = currentTag.toUpperCase();
    // }

    return params;
  };
  const {
    data: ticketList,
    isLoading: isTicketListLoading,
    isFetching: isTicketListFetching,
    refetch,
  } = useGetTicketListQuery(getApiParams());
  const { showToast } = useToast();
  const tickets = [
    {
      id: 1,
      avatarUrl: "https://via.placeholder.com/50",
      requester: "John Doe",
      createdAt: "2023-10-26T10:00:00Z",
      updatedAt: "2023-10-26T11:00:00Z",
      title: "Issue with product delivery",
      status: "open",
      priority: "high",
    },
    {
      id: 2,
      avatarUrl: "https://via.placeholder.com/50",
      requester: "Jane Smith",
      createdAt: "2023-10-25T14:30:00Z",
      updatedAt: "2023-10-25T15:00:00Z",
      title: "Website not loading",
      status: "undelivered",
      priority: "urgent",
    },
    {
      id: 3,
      avatarUrl: "https://via.placeholder.com/50",
      requester: "Peter Jones",
      createdAt: "2023-10-24T09:15:00Z",
      updatedAt: "2023-10-24T09:45:00Z",
      title: "Payment processing issue",
      status: "open",
      priority: "low",
    },
  ]; // Replace with API data as needed

  // Handle filter apply
  const handleApplyFilters = (newFilters: any) => {
    // TODO: Trigger API call with newFilters
  };
  console.log(ticketList);
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
  // Card-style ticket rendering
  const renderTicketCard = (ticket: any) => (
    <div
      key={ticket?.ticketNumber}
      className="bg-white rounded border border-gray-200 mb-3 flex flex-col md:flex-row items-start md:items-center px-4 py-3 shadow-sm hover:shadow transition relative"
    >
      <div className="flex items-center mr-4 mb-2 md:mb-0">
        <input
          type="checkbox"
          className="mr-3"
          checked={selectedTickets.includes(ticket.ticketNumber)}
          onChange={() => handleTicketCheckbox(ticket.ticketNumber)}
        />
        {ticket?.avatarUrl ? (
          <Avatar src={ticket.avatarUrl} className="w-10 h-10 mr-3" />
        ) : (
          <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center text-lg font-bold text-pink-600 mr-3">
            {ticket?.fromUser?.name[0] || "D"}
          </div>
        )}
      </div>
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
          <span className="font-semibold text-gray-800 truncate">
            {ticket?.subject}{" "}
            <span className="text-gray-400">#{ticket?.ticketNumber}</span>
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600 flex-wrap">
          <span className="flex items-center gap-1">
            <span className="font-medium">{ticket.fromUser?.name}</span>
            <span className="text-xs">
              • Created: {ticket?.createdDt?.timestamp}
            </span>
            {ticket.updatedAt && (
              <span className="text-xs">
                • Agent responded: {ticket?.stats?.agentRespondedAt?.timeAgo}
              </span>
            )}
            <span className="text-xs">• {ticket?.lastupdate?.timeAgo}</span>
          </span>
        </div>
      </div>
      <div className="flex flex-col items-end ml-auto min-w-[120px] gap-2">
        <div className="flex items-center gap-2">
          <span className={`text-xs font-semibold ${ticket.priority?.color}`}>
            {ticket?.priority?.name}
          </span>
          <span
            className="w-2 h-2 rounded-full inline-block"
            style={{ backgroundColor: ticket.priority?.color }}
          ></span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">Open</span>
        </div>
      </div>
    </div>
  );

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
                  <PersonAddAltIcon fontSize="small" /> Assign
                </button>
                <button className="flex items-center gap-1 px-3 py-1 border border-gray-300 rounded bg-white text-sm font-medium shadow-sm hover:bg-gray-100">
                  <CheckCircleIcon fontSize="small" /> Close
                </button>
                <button className="flex items-center gap-1 px-3 py-1 border border-gray-300 rounded bg-white text-sm font-medium shadow-sm hover:bg-gray-100">
                  <SyncAltIcon fontSize="small" /> Bulk update
                </button>
                <button className="flex items-center gap-1 px-3 py-1 border border-gray-300 rounded bg-white text-sm font-medium shadow-sm hover:bg-gray-100">
                  <CallMergeIcon fontSize="small" /> Merge
                </button>
                <button className="flex items-center gap-1 px-3 py-1 border border-gray-300 rounded bg-white text-sm font-medium shadow-sm hover:bg-gray-100">
                  <AssignmentIcon fontSize="small" /> Scenarios
                </button>
                <button className="flex items-center gap-1 px-3 py-1 border border-gray-300 rounded bg-white text-sm font-medium shadow-sm hover:bg-gray-100">
                  <BlockIcon fontSize="small" /> Spam
                </button>
                <button className="flex items-center gap-1 px-3 py-1 border border-gray-300 rounded bg-white text-sm font-medium shadow-sm hover:bg-gray-100">
                  <DeleteIcon fontSize="small" /> Delete
                </button>
              </div>
            )}
            {selectedTickets.length === 0 && (
              <div className="flex items-center gap-2 ml-4">
                <span className="text-sm text-gray-600">Sort by:</span>
                <select
                  className="border border-gray-300 rounded px-2 py-1 text-sm bg-white"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option>Date created</option>
                  <option>Priority</option>
                  <option>Status</option>
                </select>
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
          <div className="flex-1 p-6 h-full overflow-y-auto">
            {isTicketListFetching ? (
              <TicketSkeleton />
            ) : (
              <div>
                {ticketList && ticketList?.data?.length > 0 ? (
                  ticketList?.data?.map(renderTicketCard)
                ) : (
                  <div className="text-gray-400 text-center py-8">
                    No tickets found.
                  </div>
                )}
              </div>
            )}
          </div>
          <div className="w-80 min-w-[320px] border-l bg-white flex flex-col h-full">
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
