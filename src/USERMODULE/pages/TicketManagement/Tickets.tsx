import React, { useState } from "react";
import TicketFilterPanel from "./TicketSidebar";
import { IconButton, Button, Checkbox, Popover, FormControl, Select, MenuItem, Tooltip } from "@mui/material";
import LeftMenu from "./LeftMenu";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import PushPinIcon from '@mui/icons-material/PushPin';
import PushPinOutlinedIcon from '@mui/icons-material/PushPinOutlined';
import ConfirmationModal from "../../../components/reusable/ConfirmationModal";
import {
  useGetTicketListQuery,
  useGetPriorityListQuery,
  useGetTicketListSortingQuery,
  useGetTicketSortingOptionsQuery,
  useGetStatusListQuery,
} from "../../../services/ticketAuth";
import TicketSkeleton from "../../skeleton/TicketSkeleton";
import TablePagination from "@mui/material/TablePagination";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CallMergeIcon from "@mui/icons-material/CallMerge";
import TicketSortingPopover from "../../../components/shared/TicketSortingPopover";
import FilterListIcon from "@mui/icons-material/FilterList";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import UserHoverPopup from "../../../components/popup/UserHoverPopup";

import {
  useCommanApiMutation,
} from "../../../services/threadsApi";

import AssignTicket from "../../components/AssignTicket";
import Mergeticket from "../../components/Mergeticket";
import { useToast } from "../../../hooks/useToast";

// Priority/Status/Agent dropdown options
interface PriorityOption {
  label: string;
  value: string;
  color: string;
  key: string;
}

interface StatusOption {
  label: string;
  value: string;
}

const Tickets: React.FC = () => {
  const navigate = useNavigate();
  const [sortBy, setSortBy] = useState("Sort By");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [selectedTickets, setSelectedTickets] = useState<string[]>([]);
  const [masterChecked, setMasterChecked] = useState(false);

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const { showToast } = useToast();
  const openAssign = Boolean(anchorEl);

  const handleAssignClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleAssignClose = () => {
    setAnchorEl(null);
  };

  const [sortOrder, setSortOrder] = useState("desc");
  const [sortType, setSortType] = useState<string | null>(null);
  const [filtersOpen, setFiltersOpen] = useState(true);
  const [isMergeModal, setIsMergeModal] = useState(false);

  // Sorting popover state
  const [sortingPopoverAnchorEl, setSortingPopoverAnchorEl] =
    useState<HTMLElement | null>(null);
  const [sortingPopoverOpen, setSortingPopoverOpen] = useState(false);
  const [userPopupAnchorEl, setUserPopupAnchorEl] =
    useState<HTMLElement | null>(null);
  const [userPopupUser, setUserPopupUser] = useState<any>(null);
  const userPopupTimer = React.useRef<NodeJS.Timeout | null>(null);
  const [isDeleteModal, setIsDeleteModal] = useState(false);
  const [isCloseModal, setIsCloseModal] = useState(false);
  // Quick update popup state
  const [quickUpdateAnchorEl, setQuickUpdateAnchorEl] = useState<HTMLElement | null>(null);
  const [quickUpdateValues, setQuickUpdateValues] = useState({
    priority: '',
    status: '',
    group: '',
    agent: ''
  });

  const [commanApi] = useCommanApiMutation();
  // Fetch live priority list
  const { data: priorityList } = useGetPriorityListQuery();
  const { data: statusList } = useGetStatusListQuery();

  const STATUS_OPTIONS: StatusOption[] = statusList?.map((item: any) => ({
    label: item.statusName,
    value: item.key,
  })) || [];

  // Fetch sorting options
  const { data: sortingOptions } = useGetTicketSortingOptionsQuery();

  // Map API priorities to dropdown options
  const PRIORITY_OPTIONS: PriorityOption[] = (priorityList || []).map((item: any) => ({
    label: item.specification,
    value: item.key,
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
  const { data: ticketList, isFetching: isTicketListFetching } =
    useGetTicketListQuery(getApiParams());
  const sortingParams = sortType
    ? { type: sortType, order: sortOrder, page, limit }
    : undefined;
  const { data: sortedTicketList, isFetching: isSortedTicketListFetching } =
    useGetTicketListSortingQuery(
      sortingParams as {
        type: string;
        order: string;
        page: number;
        limit: number;
      },
      { skip: !sortType }
    );

  const ticketsToShow = sortType ? sortedTicketList : ticketList;
  const isTicketsFetching = sortType
    ? isSortedTicketListFetching
    : isTicketListFetching;

  // Handle filter apply
  const handleApplyFilters = (newFilters: any) => {
    // TODO: Trigger API call with newFilters
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

  // Handle user popup hover with delayuseC
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

  // When a ticket is opened, update the URL
  const handleTicketSubjectClick = (ticketNumber: string) => {
    navigate(`/tickets/${ticketNumber}`);
  };

  React.useEffect(() => {
    return () => {
      if (userPopupTimer.current) {
        clearTimeout(userPopupTimer.current);
      }
    };
  }, []);

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

  // Quick update handlers
  const handleQuickUpdateOpen = (event: React.MouseEvent<HTMLElement>, ticket: any) => {
    event.stopPropagation();
    setQuickUpdateAnchorEl(event.currentTarget);
    setQuickUpdateValues({
      priority: ticket.priority?.key || '',
      status: ticket.status?.key || '',
      group: ticket.group || '',
      agent: ticket.assignedTo?.name || ''
    });
  };

  const handleQuickUpdateClose = () => {
    setQuickUpdateAnchorEl(null);
  };

  const handleQuickUpdateChange = (field: string, value: string) => {
    setQuickUpdateValues(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle toggle important status
  const handleToggleImportant = (ticket: any) => {
    const newImportantStatus = !ticket.important;
    const payload = {
      url: `edit-property/${ticket.ticketNumber}?important=${newImportantStatus}`,
    };

    commanApi(payload).then((res: any) => {
      if (res?.data?.type === "error") {
        showToast(res?.message || res?.data?.message, "error");
        return;
      }
      showToast(
        `Ticket ${newImportantStatus ? 'marked as important' : 'removed from important'}`,
        "success"
      );
    }).catch(() => {
      showToast("Failed to update ticket importance", "error");
    });
  };

  // Card-style ticket rendering
  const renderTicketCard = (ticket: any) => {
    // Get priority color and label - use actual API data
    const priorityColor = ticket.priority?.color || '#6b7280'; // Default gray
    const priorityLabel = ticket.priority?.name || 'Low';
    return (
      <div
        key={ticket?.ticketNumber}
        className="bg-white border-2 border-blue-200 rounded-xl mb-4 p-4 hover:shadow-lg transition-shadow duration-200 cursor-pointer relative"
        onClick={() => handleTicketSubjectClick(ticket.ticketNumber)}
      >
        {/* Top section */}
        <div className="flex gap-4 mb-3">
          {/* Left column: Priority badge and ticket number */}
          <div className="flex flex-col items-start gap-1">
            <div
              className="px-3 py-1 text-xs font-bold rounded text-white"
              style={{ backgroundColor: priorityColor }}
            >
              {priorityLabel.toUpperCase()}
            </div>
            <span className="text-sm font-medium text-gray-700">
              #{ticket?.ticketNumber || ""}
            </span>
          </div>

          {/* Right column: Title and description */}
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h3 className="text-md font-medium text-gray-900">
                  {ticket?.subject || ""}
                </h3>
                <span className="text-gray-400 text-sm">
                  ({ticket?.stats?.totalThreads || 0})
                </span>
                <span className="text-sm text-gray-500">
                  {ticket?.lastupdate?.timeAgo || ""}
                </span>
              </div>
              <IconButton
                size="small"
                onClick={(e) => handleQuickUpdateOpen(e, ticket)}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                <MoreVertIcon fontSize="small" />
              </IconButton>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">
              {typeof ticket.description === "string"
                ? ticket.description
                : (ticket.body || "")}
            </p>
          </div>
        </div>

        {/* Divider line */}
        <div className="border-t border-gray-200 my-3"></div>

        {/* Bottom section with counts and user info */}
        <div className="flex items-center gap-8 text-xs">
          {/* Important Pin */}
          <Tooltip
            title={ticket?.important ? "Remove from important" : "Mark as important"}
            placement="right"
          >
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                handleToggleImportant(ticket);
              }}
              className={ticket?.important ? "text-amber-500 hover:text-amber-600" : "text-gray-400 hover:text-amber-500"}
            >
              {ticket?.important ? (
                <PushPinIcon fontSize="small" />
              ) : (
                <PushPinOutlinedIcon fontSize="small" />
              )}
            </IconButton>
          </Tooltip>

          {/* Separator */}
          <div className="text-gray-300">|</div>

          {/* Assignee */}
          <div className="flex flex-col">
            <span className="text-gray-500 mb-1">assignee</span>
            <span className="text-gray-700">{ticket?.assignee?.name || "~"}</span>
          </div>

          {/* Separator */}
          <div className="text-gray-300">|</div>

          {/* Raised by */}
          <div className="flex flex-col">
            <span className="text-gray-500 mb-1">raised by</span>
            <div className="flex items-center gap-1">
              <div className="w-5 h-5 rounded-full bg-purple-100 flex items-center justify-center">
                <span className="text-xs font-medium text-purple-700">
                  {(ticket?.fromUser?.name || "")?.[0]?.toUpperCase()}
                </span>
              </div>
              <span
                className="text-gray-700 font-medium cursor-pointer hover:underline"
                onMouseEnter={(e) => handleUserHover(e, ticket.fromUser)}
                onMouseLeave={handleUserLeave}
              >
                {ticket?.fromUser?.name || ""}
              </span>
            </div>
          </div>

          {/* Separator */}
          <div className="text-gray-300">|</div>

          {/* Department */}
          <div className="flex flex-col">
            <span className="text-gray-500 mb-1">department</span>
            <span className="text-gray-700">{ticket?.department?.name || "Support"}</span>
          </div>

          {/* Separator */}
          <div className="text-gray-300">|</div>

          {/* Status */}
          <div className="flex flex-col">
            <span className="text-gray-500 mb-1">status</span>
            <span className="text-gray-700">{ticket?.status?.name || 'Review'}</span>
          </div>

          {/* Separator */}
          <div className="text-gray-300">|</div>

          {/* Due Date */}
          <div className="flex flex-col">
            <span className="text-gray-500 mb-1">due date</span>
            <span className="text-gray-700">~</span>
          </div>

          {/* Red dot at the end */}
          <div className="w-3 h-3 bg-red-500 rounded-full ml-auto"></div>
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
      <div className="flex flex-col bg-[#f0f4f9] h-[calc(100vh-98px)]">
        {/* Main Header Bar */}
        <div className="flex items-center justify-between px-6 py-3 border-b bg-white shadow-sm">
          {/* Left: Title, master checkbox, count, and action buttons (inline) */}
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <Checkbox
              checked={masterChecked}
              onChange={handleMasterCheckbox}
              aria-label="Select all tickets"
              sx={{
                color: "#666",
                "&.Mui-checked": {
                  color: "#1a73e8",
                },
                "&:hover": {
                  backgroundColor: "rgba(26, 115, 232, 0.04)",
                },
              }}
            />
            <h1 className="text-xl font-medium text-gray-900">
              Tickets
            </h1>
            <span className="bg-gray-100 text-gray-600 rounded-full px-2 py-1 text-xs font-medium">
              {ticketList?.data?.length || 0}
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
                    <CallMergeIcon fontSize="small" sx={{ color: "#ff9800" }} />
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
          <div className="flex-1 h-full overflow-y-auto bg-gray-50">
            <div className="max-w-6xl mx-auto">
              {isTicketsFetching ? (
                <TicketSkeleton />
              ) : (
                <div className="p-4">
                  {ticketsToShow && ticketsToShow?.data?.length > 0 ? (
                    <div>
                      {ticketsToShow?.data?.map(renderTicketCard)}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="text-gray-400 text-lg">No tickets found</div>
                      <div className="text-gray-500 text-sm mt-2">
                        Try adjusting your filters or create a new ticket
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
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

      {/* Quick Update Popup */}
      <Popover
        open={Boolean(quickUpdateAnchorEl)}
        anchorEl={quickUpdateAnchorEl}
        onClose={handleQuickUpdateClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        PaperProps={{
          elevation: 8,
          sx: {
            mt: 1,
            borderRadius: 2,
            border: '1px solid #e0e0e0',
            maxWidth: 400,
            minWidth: 380,
          }
        }}
      >
        <div className="p-6 bg-white">
          {/* Header */}
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-lg font-semibold text-gray-900">Quick update properties</h3>
            <IconButton
              size="small"
              onClick={handleQuickUpdateClose}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </IconButton>
          </div>

          {/* Form Grid */}
          <div className="grid grid-cols-2 gap-4">
            {/* Priority */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Priority</label>
              <FormControl fullWidth size="small" variant="outlined">
                <Select
                  value={quickUpdateValues.priority}
                  onChange={(e) => handleQuickUpdateChange('priority', e.target.value)}
                  displayEmpty
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: '#d1d5db',
                      },
                      '&:hover fieldset': {
                        borderColor: '#9ca3af',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#3b82f6',
                      },
                    },
                  }}
                >
                  <MenuItem value="">
                    <span className="text-gray-500">Select priority</span>
                  </MenuItem>
                  {PRIORITY_OPTIONS.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: option.color }}
                        ></div>
                        <span className="text-gray-700">{option.label}</span>
                      </div>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>

            {/* Status */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Status</label>
              <FormControl fullWidth size="small" variant="outlined">
                <Select
                  value={quickUpdateValues.status}
                  onChange={(e) => handleQuickUpdateChange('status', e.target.value)}
                  displayEmpty
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: '#d1d5db',
                      },
                      '&:hover fieldset': {
                        borderColor: '#9ca3af',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#3b82f6',
                      },
                    },
                  }}
                >
                  <MenuItem value="">
                    <span className="text-gray-500">Select status</span>
                  </MenuItem>
                  {STATUS_OPTIONS.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      <span className="text-gray-700">{option.label}</span>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>

            {/* Groups */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Groups</label>
              <FormControl fullWidth size="small" variant="outlined">
                <Select
                  value={quickUpdateValues.group}
                  onChange={(e) => handleQuickUpdateChange('group', e.target.value)}
                  displayEmpty
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: '#d1d5db',
                      },
                      '&:hover fieldset': {
                        borderColor: '#9ca3af',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#3b82f6',
                      },
                    },
                  }}
                >
                  <MenuItem value="">
                    <span className="text-gray-500">Select group</span>
                  </MenuItem>
                  <MenuItem value="Billing">
                    <span className="text-gray-700">Billing</span>
                  </MenuItem>
                  <MenuItem value="Support">
                    <span className="text-gray-700">Support</span>
                  </MenuItem>
                  <MenuItem value="Sales">
                    <span className="text-gray-700">Sales</span>
                  </MenuItem>
                  <MenuItem value="Technical">
                    <span className="text-gray-700">Technical</span>
                  </MenuItem>
                </Select>
              </FormControl>
            </div>

            {/* Agents */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Agents</label>
              <FormControl fullWidth size="small" variant="outlined">
                <Select
                  value={quickUpdateValues.agent}
                  onChange={(e) => handleQuickUpdateChange('agent', e.target.value)}
                  displayEmpty
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: '#d1d5db',
                      },
                      '&:hover fieldset': {
                        borderColor: '#9ca3af',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#3b82f6',
                      },
                    },
                  }}
                >
                  <MenuItem value="">
                    <span className="text-gray-500">Unassigned</span>
                  </MenuItem>
                  <MenuItem value="Amy">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center">
                        <span className="text-xs font-medium text-purple-700">A</span>
                      </div>
                      <span className="text-gray-700">Amy</span>
                    </div>
                  </MenuItem>
                  <MenuItem value="John">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="text-xs font-medium text-blue-700">J</span>
                      </div>
                      <span className="text-gray-700">John</span>
                    </div>
                  </MenuItem>
                  <MenuItem value="Sarah">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                        <span className="text-xs font-medium text-green-700">S</span>
                      </div>
                      <span className="text-gray-700">Sarah</span>
                    </div>
                  </MenuItem>
                  <MenuItem value="Mike">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center">
                        <span className="text-xs font-medium text-orange-700">M</span>
                      </div>
                      <span className="text-gray-700">Mike</span>
                    </div>
                  </MenuItem>
                </Select>
              </FormControl>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
            <Button
              variant="text"
              size="small"
              onClick={handleQuickUpdateClose}
              sx={{ minWidth: 80, fontWeight: 600 }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              size="small"
              onClick={() => {
                // Handle save logic here
                console.log('Saving:', quickUpdateValues);
                handleQuickUpdateClose();
                showToast('Properties updated successfully', 'success');
              }}
              sx={{
                textTransform: 'none',
                backgroundColor: '#3b82f6',
                '&:hover': {
                  backgroundColor: '#2563eb',
                },
              }}
            >
              Update
            </Button>
          </div>
        </div>
      </Popover>
    </>
  );
};

export default Tickets;
