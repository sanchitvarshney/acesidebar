import {
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import logo from "../../assets/buildings.png";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import TicketSkeleton from "../TicketManagement/TicketSkeleton";

const InstractionComponent = ({ data }: { data: any }) => {
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));

  // Use real API data
  const tickets = data || [];

  // Card-style ticket rendering for real data
  const renderTicketCard = (ticket: any) => (
    <div
      key={ticket.id}
      className="bg-white rounded border border-gray-200 mb-3 flex flex-col md:flex-row items-start md:items-center px-4 py-3 shadow-sm hover:shadow transition relative"
    >
      <div className="flex items-center mr-4 mb-2 md:mb-0">
        <input type="checkbox" className="mr-3" />
        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-lg font-bold text-gray-500 mr-3">
          {ticket.fromUser?.[0] || "U"}
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          {ticket.priority?.desc && (
            <span
              className="text-xs font-semibold px-2 py-0.5 rounded mr-2"
              style={{
                background: ticket?.priority?.color,
                color:
                  ticket.priority.name === "emergency"
                    ? "#d32f2f"
                    : ticket.priority.name === "normal"
                    ? "#bfa600"
                    : "#388e3c",
              }}
            >
              {ticket.priority.desc}
            </span>
          )}
          <span className="font-semibold text-gray-800 truncate">
            {ticket.subject}{" "}
            <span className="text-gray-400">#{ticket.ticketNumber}</span>
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600 flex-wrap">
          <span className="font-medium">{ticket.fromUser}</span>
          <span className="text-xs">• Dept: {ticket.department}</span>
          {ticket.lastupdate && (
            <span className="text-xs">• Last update: {ticket.lastupdate}</span>
          )}
          <span className="text-xs">
            • Assigned: {ticket.assignedTo || "--"}
          </span>
        </div>
      </div>
      <div className="flex flex-col items-end ml-auto min-w-[120px] gap-2">
        <div className="flex items-center gap-2">
          <span
            className={`text-xs font-semibold`}
            style={{ color: ticket?.priority?.color }}
          >
            {ticket.priority?.desc}
          </span>
          <span className="w-2 h-2 rounded-full bg-green-400 inline-block"></span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">Open</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Box sx={{ width: { xs: 100, sm: 150, md: 180 }, mb: 2 }}>
        <img
          src={logo}
          alt="logo"
          style={{
            width: "100%",
            height: "100%",
          }}
        />
      </Box>
      <Typography
        variant="h5"
        fontWeight={700}
        sx={{ mb: 2, letterSpacing: 1 }}
      >
        Ticket Management
      </Typography>
      <List dense sx={{ color: { md: "white" } }}>
        {isSmall ? <TicketSkeleton rows={5} /> : tickets.map(renderTicketCard)}
      </List>
    </div>
  );
};

export default InstractionComponent;
