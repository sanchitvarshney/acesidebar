import React, { useState } from "react";
import TicketFilterPanel from "./TicketSidebar";
import { Avatar } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import AppsIcon from "@mui/icons-material/Apps";
import {
  useCreateTicketMutation,
  useGetPriorityListQuery,
  useGetTicketListQuery,
  useTicketSearchMutation,
} from "../../services/ticketAuth";
import { useToast } from "../../hooks/useToast";
import CreateTicketDialog from "./CreateTicketDialog";

const Tickets: React.FC = () => {
  const [sortBy, setSortBy] = useState("Date created");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [ticketSearch, { isLoading: isTicketSearchLoading }] =
    useTicketSearchMutation();

  const [createTicket, { isLoading: isCreating }] = useCreateTicketMutation();
  const { data: priorityList, isLoading: isPriorityListLoading } =
    useGetPriorityListQuery();
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

  // Card-style ticket rendering
  const renderTicketCard = (ticket: any) => (
    <div
      key={ticket?.ticketNumber}
      className="bg-white rounded border border-gray-200 mb-3 flex flex-col md:flex-row items-start md:items-center px-4 py-3 shadow-sm hover:shadow transition relative"
    >
      <div className="flex items-center mr-4 mb-2 md:mb-0">
        <input type="checkbox" className="mr-3" />
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
              • Created: {ticket?.lastupdate?.timestamp}
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
          <span className="w-2 h-2 rounded-full inline-block"></span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">Open</span>
        </div>
      </div>
    </div>
  );
  console.log(ticketList);
  return (
    <>
      <div className="flex flex-col bg-gray-50 h-[calc(100vh-160px)]">
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b bg-white">
          <div className="flex items-center gap-4">
            <span className="text-xl font-semibold">All tickets</span>
            <span className="bg-gray-200 text-gray-700 rounded px-2 py-0.5 text-xs font-semibold">
              {ticketList?.length}
            </span>
            <div className="ml-6 flex items-center gap-2">
              <span className="text-sm text-gray-600">Sort by:</span>
              <select
                className="border border-gray-300 rounded px-2 py-1 text-sm"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option>Date created</option>
                <option>Priority</option>
                <option>Status</option>
              </select>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              className="bg-blue-600 text-white px-4 py-1.5 rounded font-semibold text-sm"
              onClick={() => {
                setCreateDialogOpen(true);
                console.log("okk");
              }}
            >
              + New
            </button>

            <button className="p-2 rounded hover:bg-gray-100">
              <HelpOutlineIcon className="text-xl" />
            </button>
          </div>
        </div>
        {/* Main Content */}
        <div className="flex flex-1 ">
          {/* Ticket List */}
          <div className="flex-1 p-6 ">
            <div className="mb-4 flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Sort by: <span className="font-medium">{sortBy}</span>
              </div>
              <div className="text-sm text-gray-600">
                Layout: <span className="font-medium">Card</span>
              </div>
              <div className="text-sm text-gray-600">Export</div>
            </div>
            <div>
              {ticketList && ticketList.length > 0 ? (
                ticketList.map(renderTicketCard)
              ) : (
                <div className="text-gray-400 text-center py-8">
                  No tickets found.
                </div>
              )}
            </div>
          </div>
          {/* Filters Panel */}
          <div className="w-80 min-w-[320px] border-l bg-white flex flex-col ">
            <div className="flex-1 overflow-y-auto">
              <TicketFilterPanel onApplyFilters={handleApplyFilters} />
            </div>
          </div>
        </div>
      </div>
      {createDialogOpen && (
        <CreateTicketDialog
          open={createDialogOpen}
          onClose={() => setCreateDialogOpen(false)}
        />
      )}
    </>
  );
};

export default Tickets;
