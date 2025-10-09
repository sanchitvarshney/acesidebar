import React, { useState, useEffect, useRef } from "react";
import {
  IconButton,
  TextField,
  Typography,
  Box as MuiBox,
  Avatar,
  Chip,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import SystemUpdateAltIcon from "@mui/icons-material/SystemUpdateAlt";

import {
  Search,
  Reply,
  AttachFile,
  Delete,
  SwapHoriz,
  Share,
  CheckCircle,
  Info,
  Schedule,
  PriorityHigh,
  Label,
  Comment,
  Print,
  Block,
  Merge,
  Link,
  Description,
  VideoFile,
  Image,
  PictureAsPdf,
  Archive,
  Code,
} from "@mui/icons-material";
import { useCommanApiMutation } from "../../../services/threadsApi";
import SearchIcon from "@mui/icons-material/Search";
import { useGetActivityQuery } from "../../../services/ticketAuth";

const getActivityColor = (type: ActivityItem["type"]) => {
  switch (type) {
    case "status_change":
      return "#4caf50";
    case "owner_change":
      return "#2196f3";
    case "reply":
      return "#ff9800";
    case "note":
      return "#9c27b0";
    case "attachment":
      return "#795548";
    case "referral":
      return "#607d8b";
    case "merge":
      return "#e91e63";
    case "link":
      return "#00bcd4";
    case "time_log":
      return "#8bc34a";
    case "priority_change":
      return "#f44336";
    case "tag_change":
      return "#9e9e9e";
    case "spam":
      return "#f44336";
    case "delete":
      return "#f44336";
    case "print":
      return "#795548";
    case "forward":
      return "#607d8b";
    case "transfer":
      return "#2196f3";
    default:
      return "#757575";
  }
};

// Custom Timeline components using standard MUI components
const Timeline = ({
  children,
  position = "left",
}: {
  children: React.ReactNode;
  position?: "left" | "right" | "alternate";
}) => <MuiBox sx={{ position: "relative" }}>{children}</MuiBox>;

const TimelineItem = ({ children }: { children: React.ReactNode }) => (
  <MuiBox sx={{ display: "flex", mb: 2 }}>{children}</MuiBox>
);

const TimelineSeparator = ({ children }: { children: React.ReactNode }) => (
  <MuiBox
    sx={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      mr: 2,
      minWidth: 60,
    }}
  >
    {children}
  </MuiBox>
);

const TimelineConnector = () => (
  <MuiBox sx={{ width: 2, height: 20, bgcolor: "#e0e0e0", my: 0.5 }} />
);

const TimelineDot = ({
  children,
  sx,
}: {
  children: React.ReactNode;
  sx?: any;
}) => (
  <MuiBox
    sx={{
      width: 32,
      height: 32,
      borderRadius: "50%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "white",
      fontSize: "1rem",
      ...sx,
    }}
  >
    {children}
  </MuiBox>
);

const TimelineContent = ({
  children,
  sx,
}: {
  children: React.ReactNode;
  sx?: any;
}) => <MuiBox sx={{ flex: 1, ...sx }}>{children}</MuiBox>;

const TimelineOppositeContent = ({
  children,
  sx,
}: {
  children: React.ReactNode;
  sx?: any;
}) => (
  <MuiBox sx={{ minWidth: 100, textAlign: "right", mr: 2, ...sx }}>
    {children}
  </MuiBox>
);

interface ActivityProps {
  open: boolean;
  onClose: () => void;
  ticketId: any | number;
}

interface ActivityItem {
  id: string;
  type:
    | "status_change"
    | "owner_change"
    | "reply"
    | "note"
    | "attachment"
    | "referral"
    | "merge"
    | "link"
    | "time_log"
    | "priority_change"
    | "tag_change"
    | "spam"
    | "delete"
    | "print"
    | "forward"
    | "transfer";
  action: string;
  description: string;
  timestamp: string;
  performedBy: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  details?: {
    oldValue?: string;
    newValue?: string;
    reason?: string;
    duration?: string;
    fileCount?: number;
    fileNames?: string[];
    recipient?: string;
    department?: string;
    priority?: string;
    tags?: string[];
    timeSpent?: string;
    billable?: boolean;
  };
  metadata?: {
    ipAddress?: string;
    userAgent?: string;
    location?: string;
  };
}

// Sample activity data - replace with actual API calls
const sampleActivities: ActivityItem[] = [
  {
    id: "1",
    type: "status_change",
    action: "Status Changed",
    description: "Ticket status updated from 'Open' to 'In Progress'",
    timestamp: "2024-01-16T14:30:00Z",
    performedBy: {
      id: "1",
      name: "John Doe",
      email: "john.doe@example.com",
    },
    details: {
      oldValue: "Open",
      newValue: "In Progress",
      reason: "Started working on the issue",
    },
  },
  {
    id: "2",
    type: "reply",
    action: "Reply Posted",
    description: "Public reply sent to customer",
    timestamp: "2024-01-16T14:25:00Z",
    performedBy: {
      id: "1",
      name: "John Doe",
      email: "john.doe@example.com",
    },
    details: {
      recipient: "customer@example.com",
    },
  },
  {
    id: "3",
    type: "attachment",
    action: "Files Attached",
    description: "3 files uploaded to the ticket",
    timestamp: "2024-01-16T14:20:00Z",
    performedBy: {
      id: "1",
      name: "John Doe",
      email: "john.doe@example.com",
    },
    details: {
      fileCount: 3,
      fileNames: ["screenshot.png", "error-log.txt", "config.json"],
    },
  },
  {
    id: "4",
    type: "time_log",
    action: "Time Logged",
    description: "2 hours 30 minutes logged on this ticket",
    timestamp: "2024-01-16T14:15:00Z",
    performedBy: {
      id: "1",
      name: "John Doe",
      email: "john.doe@example.com",
    },
    details: {
      timeSpent: "2:30",
      billable: true,
    },
  },
  {
    id: "5",
    type: "referral",
    action: "Referred to Department",
    description: "Ticket referred to Technical Support department",
    timestamp: "2024-01-16T14:10:00Z",
    performedBy: {
      id: "1",
      name: "John Doe",
      email: "john.doe@example.com",
    },
    details: {
      department: "Technical Support",
      reason: "Requires technical expertise",
    },
  },
  {
    id: "6",
    type: "owner_change",
    action: "Owner Changed",
    description: "Ticket ownership transferred to Jane Smith",
    timestamp: "2024-01-16T14:05:00Z",
    performedBy: {
      id: "1",
      name: "John Doe",
      email: "john.doe@example.com",
    },
    details: {
      oldValue: "John Doe",
      newValue: "Jane Smith",
      reason: "Better suited for this type of issue",
    },
  },
  {
    id: "7",
    type: "priority_change",
    action: "Priority Changed",
    description: "Ticket priority updated from 'Medium' to 'High'",
    timestamp: "2024-01-16T14:00:00Z",
    performedBy: {
      id: "1",
      name: "John Doe",
      email: "john.doe@example.com",
    },
    details: {
      oldValue: "Medium",
      newValue: "High",
      reason: "Customer experiencing critical business impact",
    },
  },
  {
    id: "8",
    type: "tag_change",
    action: "Tags Updated",
    description: "Tags added: 'urgent', 'billing'",
    timestamp: "2024-01-16T13:55:00Z",
    performedBy: {
      id: "1",
      name: "John Doe",
      email: "john.doe@example.com",
    },
    details: {
      tags: ["urgent", "billing"],
    },
  },
];

const Activity: React.FC<ActivityProps> = ({ open, onClose, ticketId }) => {

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedUser, setSelectedUser] = useState<string>("all");
  const [dateRange, setDateRange] = useState<{ start: string; end: string }>({
    start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
    end: new Date().toISOString().split("T")[0],
  });
  const inputRef = useRef(null);

  const { data: activityData } = useGetActivityQuery({
    filter: ticketId,
    module: "TICKET",
  });


  useEffect(() => {
    if (open && inputRef.current) {
      //@ts-ignore
      setTimeout(() => inputRef.current.focus(), 100);
    }
  }, [open]);
  // Capture the initial date range so we know if user changed it later
  const defaultDateRangeRef = useRef<{ start: string; end: string } | null>(null);
  useEffect(() => {
    if (defaultDateRangeRef.current === null) {
      defaultDateRangeRef.current = { ...dateRange };
    }
  }, [dateRange]);

  const hasActiveFilters =
    (searchQuery?.trim()?.length ?? 0) > 0 ||
    selectedType !== "all" ||
    selectedUser !== "all" ||
    (defaultDateRangeRef.current &&
      (dateRange.start !== defaultDateRangeRef.current.start ||
        dateRange.end !== defaultDateRangeRef.current.end));

  // Compute filtered activities only when filters are active
  const computedFilteredActivities = React.useMemo(() => {
    if (!Array.isArray(activityData)) return activityData;

    return activityData.filter((activity: any) => {
      const haystacks = [
        activity?.action ?? "",
        activity?.description ?? "",
        activity?.agent ?? "",
        activity?.performedBy?.name ?? "",
        activity?.performedBy?.email ?? "",
      ];

      const q = (searchQuery || "").toLowerCase();
      const matchesSearch = q === "" || haystacks.some((h: string) => (h || "").toLowerCase().includes(q));

      const matchesType = selectedType === "all" || activity?.type === selectedType;

      const matchesUser = selectedUser === "all" || activity?.performedBy?.id === selectedUser;

      const ts = activity?.timestamp?.dt ?? activity?.timestamp;
      const activityDate = ts ? new Date(ts) : null;
      const startDate = dateRange.start ? new Date(dateRange.start) : null;
      const endDate = dateRange.end ? new Date(dateRange.end) : null;

      const matchesDate =
        !startDate ||
        !endDate ||
        (activityDate instanceof Date &&
          !isNaN(activityDate.getTime()) &&
          activityDate >= startDate &&
          activityDate <= endDate);

      return matchesSearch && matchesType && matchesUser && matchesDate;
    });
  }, [activityData, searchQuery, selectedType, selectedUser, dateRange]);

  const filteredActivities = hasActiveFilters ? computedFilteredActivities : activityData;


  // Get unique activity types and users
  const activityTypes = [
    { value: "all", label: "All Activities" },
    { value: "status_change", label: "Status Changes" },
    { value: "owner_change", label: "Owner Changes" },
    { value: "reply", label: "Replies" },
    { value: "note", label: "Notes" },
    { value: "attachment", label: "Attachments" },
    { value: "referral", label: "Referrals" },
    { value: "merge", label: "Merges" },
    { value: "link", label: "Links" },
    { value: "time_log", label: "Time Logs" },
    { value: "priority_change", label: "Priority Changes" },
    { value: "tag_change", label: "Tag Changes" },
    { value: "spam", label: "Spam Actions" },
    { value: "delete", label: "Deletions" },
    { value: "print", label: "Print Actions" },
    { value: "forward", label: "Forward Actions" },
    { value: "transfer", label: "Transfers" },
  ];

  const getActivityIcon = (type: ActivityItem["type"]) => {
    switch (type) {
      case "status_change":
        return <CheckCircle />;
      case "owner_change":
        return <SwapHoriz />;
      case "reply":
        return <Reply />;
      case "note":
        return <Comment />;
      case "attachment":
        return <AttachFile />;
      case "referral":
        return <Share />;
      case "merge":
        return <Merge />;
      case "link":
        return <Link />;
      case "time_log":
        return <Schedule />;
      case "priority_change":
        return <PriorityHigh />;
      case "tag_change":
        return <Label />;
      case "spam":
        return <Block />;
      case "delete":
        return <Delete />;
      case "print":
        return <Print />;
      case "forward":
        return <Share />;
      case "transfer":
        return <SwapHoriz />;
      default:
        return <Info />;
    }
  };

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split(".").pop()?.toLowerCase();
    if (["jpg", "jpeg", "png", "gif", "bmp", "webp"].includes(extension || ""))
      return <Image />;
    if (["mp4", "avi", "mov", "wmv", "flv"].includes(extension || ""))
      return <VideoFile />;
    if (extension === "pdf") return <PictureAsPdf />;
    if (["zip", "rar", "7z", "tar", "gz"].includes(extension || ""))
      return <Archive />;
    if (
      ["js", "ts", "jsx", "tsx", "json", "xml", "html", "css"].includes(
        extension || ""
      )
    )
      return <Code />;
    return <Description />;
  };


  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours} hour(s) ago`;
    if (diffInHours < 48) return "Yesterday";
    return date.toLocaleDateString();
  };

  const renderActivityDetails = (activity: ActivityItem) => {
    const { details } = activity;
    if (!details) return null;

    return (
      <MuiBox sx={{ mt: 1, p: 1, bgcolor: "#f5f5f5", borderRadius: 1 }}>
        {details.oldValue && details.newValue && (
          <Typography variant="body2" sx={{ mb: 0.5 }}>
            <strong>Change:</strong> {details.oldValue} → {details.newValue}
          </Typography>
        )}
        {details.reason && (
          <Typography variant="body2" sx={{ mb: 0.5 }}>
            <strong>Reason:</strong> {details.reason}
          </Typography>
        )}
        {details.timeSpent && (
          <Typography variant="body2" sx={{ mb: 0.5 }}>
            <strong>Time:</strong> {details.timeSpent}{" "}
            {details.billable && "(Billable)"}
          </Typography>
        )}
        {details.fileCount && details.fileNames && (
          <MuiBox>
            <Typography variant="body2" sx={{ mb: 0.5 }}>
              <strong>Files ({details.fileCount}):</strong>
            </Typography>
            <MuiBox sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
              {details.fileNames.map((fileName, index) => (
                <Chip
                  key={index}
                  icon={getFileIcon(fileName)}
                  label={fileName}
                  size="small"
                  variant="outlined"
                  sx={{ fontSize: "0.75rem" }}
                />
              ))}
            </MuiBox>
          </MuiBox>
        )}
        {details.department && (
          <Typography variant="body2" sx={{ mb: 0.5 }}>
            <strong>Department:</strong> {details.department}
          </Typography>
        )}
        {details.recipient && (
          <Typography variant="body2" sx={{ mb: 0.5 }}>
            <strong>Recipient:</strong> {details.recipient}
          </Typography>
        )}
        {details.tags && details.tags.length > 0 && (
          <MuiBox>
            <Typography variant="body2" sx={{ mb: 0.5 }}>
              <strong>Tags:</strong>
            </Typography>
            <MuiBox sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
              {details.tags.map((tag, index) => (
                <Chip
                  key={index}
                  label={tag}
                  size="small"
                  variant="outlined"
                  sx={{ fontSize: "0.75rem" }}
                />
              ))}
            </MuiBox>
          </MuiBox>
        )}
      </MuiBox>
    );
  };

  const renderTimelineView = () => (
    <Timeline position="left">
      {filteredActivities?.map((activity:any, index:number) => (
        <TimelineItem key={activity.key}>
          <TimelineOppositeContent sx={{ m: "auto 0" }}>
            <Typography variant="body2" color="text.secondary">
              {activity?.timestamp?.ago}
            </Typography>
          </TimelineOppositeContent>
          <TimelineSeparator>
            <TimelineDot sx={{ bgcolor: getActivityColor(activity.type) }}>
              {getActivityIcon(activity.type) || "--"}
            </TimelineDot>
            {index < filteredActivities.length - 1 && <TimelineConnector />}
          </TimelineSeparator>
          <TimelineContent sx={{ py: "12px", px: 2 }}>
            <Paper elevation={1} sx={{ p: 2 }}>
              <MuiBox
                sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}
              >
                <Avatar
                  src={activity?.by?.avatar}
                  sx={{ width: 24, height: 24, fontSize: "0.75rem" }}
                >
                  {activity?.by?.name.charAt(0)}
                </Avatar>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  {activity?.by?.name}
                </Typography>
                <Chip
                  label={activity?.action}
                  size="small"
                  sx={{
                    bgcolor: getActivityColor(activity.type) || "#e0e0e0",
                    color: "white",
                    fontSize: "0.75rem",
                  }}
                />
              </MuiBox>
              <Typography variant="body2" sx={{ mb: 1 }}>
                {activity?.description}
              </Typography>
              {activity && renderActivityDetails(activity)}
            </Paper>
          </TimelineContent>
        </TimelineItem>
      ))}
    </Timeline>
  );

  return (
    <MuiBox
      sx={{
        p: 0,
        bgcolor: "#fff",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        width: "100%",
        maxWidth: "100%",
        boxShadow: 1,
        position: "relative",
        m: 0,
      }}
    >
      <MuiBox sx={{ p: 2, flex: 1, overflowY: "auto", width: "100%" }}>
        {/* Header */}
        <MuiBox
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Ticket Activity Log
          </Typography>
          <MuiBox sx={{ display: "flex", gap: 1 }}>
            <IconButton size="small" onClick={()=>{}}>
              <SystemUpdateAltIcon fontSize="small" color="primary" />
            </IconButton>
          </MuiBox>
        </MuiBox>

        {/* Search and Filters */}
        <MuiBox sx={{ mb: 3 }}>
          <div className="flex items-center justify-between ">
            <div className="flex gap-2  ">
              <div className="">
                <TextField
                  fullWidth
                  size="small"
                  autoFocus
                  inputRef={inputRef}
                  placeholder="Search activities..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  InputProps={{
                    startAdornment: <Search sx={{ color: "#666", mr: 1 }} />,
                  }}
                />
              </div>
              <div className="">
                <FormControl fullWidth size="small">
                  <InputLabel>Type</InputLabel>
                  <Select
                    value={selectedType}
                    label="Type"
                    onChange={(e) => setSelectedType(e.target.value)}
                  >
                    {activityTypes.map((type) => (
                      <MenuItem key={type.value} value={type.value}>
                        {type.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
            </div>

            <div className="flex gap-2">
              <div className="">
                <TextField
                  size="small"
                  type="date"
                  label="From"
                  value={dateRange.start}
                  onChange={(e) =>
                    setDateRange((prev) => ({ ...prev, start: e.target.value }))
                  }
                  InputLabelProps={{ shrink: true }}
                />
              </div>
              <div className="space-x-2">
                <TextField
                  size="small"
                  type="date"
                  label="To"
                  value={dateRange.end}
                  onChange={(e) =>
                    setDateRange((prev) => ({ ...prev, end: e.target.value }))
                  }
                  InputLabelProps={{ shrink: true }}
                />
                <IconButton size="medium">
                  <SearchIcon fontSize="small" color="primary" />
                </IconButton>
              </div>
            </div>
          </div>
        </MuiBox>

        {/* Activity Summary */}
        <MuiBox
          sx={{
            mb: 3,
            p: 2,
            bgcolor: "#f8f9fa",
            borderRadius: 1,
            border: "1px solid #e0e0e0",
          }}
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <Typography variant="h6" color="primary">
                {activityData?.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Activities
              </Typography>
            </div>
            <div className="text-center">
              <Typography variant="h6" color="success.main">
                {filteredActivities?.filter((a:any) => a.type === "reply")?.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Replies
              </Typography>
            </div>
            <div className="text-center">
              <Typography variant="h6" color="warning.main">
                {
                  filteredActivities?.filter((a:any) => a.type === "attachment")?.length
                }
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Attachments
              </Typography>
            </div>
            <div className="text-center">
              <Typography variant="h6" color="text.secondary">
                {filteredActivities?.filter((a:any) => a.type === "time_log")?.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Time Logs
              </Typography>
            </div>
          </div>
        </MuiBox>

        {/* Activities Content */}
        {filteredActivities?.length === 0 ? (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ textAlign: "center", py: 4 }}
          >
            No activities found matching your criteria.
          </Typography>
        ) : (
          renderTimelineView()
        )}
      </MuiBox>
    </MuiBox>
  );
};

export default Activity;
