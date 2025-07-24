import React, { useState } from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import ConfirmationNumberOutlinedIcon from "@mui/icons-material/ConfirmationNumberOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import CheckBoxOutlinedIcon from "@mui/icons-material/CheckBoxOutlined";
import TicketMetaSidebar from "./TicketMetaSidebar";
import { Box } from "@mui/material";

const ContactDetails = ({ name, email }: any) => (
  <div className="flex items-center mb-2">
    <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center text-lg font-bold text-pink-600">
      {name?.[0] || "?"}
    </div>
    <div>
      <div className="font-semibold text-sm text-gray-800">{name}</div>
      <div className="text-xs text-gray-500">{email}</div>
      <button className="text-xs text-blue-600 hover:underline mt-1">
        View more info
      </button>
    </div>
  </div>
);

const RecentTickets = () => (
  <div>
    <div className="flex flex-col gap-2">
      <div>
        <span className="text-xs text-blue-700 font-semibold cursor-pointer hover:underline">
          You can further adjust the...
        </span>
        <div className="text-xs text-gray-500">Status: Open</div>
      </div>
      <div>
        <span className="text-xs text-blue-700 font-semibold cursor-pointer hover:underline">
          TEST MAIL #4
        </span>
        <div className="text-xs text-gray-500">Status: Open</div>
      </div>
    </div>
  </div>
);

const TimeLogs = () => (
  <div>
    <button className="w-full border border-gray-300 rounded px-2 py-1 text-xs font-medium text-gray-700 hover:bg-gray-100">
      Log time
    </button>
  </div>
);

const ToDoSection = () => (
  <div>
    <div className="text-xs text-gray-800">No to-do items.</div>
  </div>
);

const TicketPropertiesSidebar = ({ ticket }: any) => {
  const [expanded, setExpanded] = useState("panel1");
  const handleChange =
    (panel: string) => (_event: any, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : "");
    };
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        width: 400,
        minWidth: 400,
        height: "100vh",
        overflow: "hidden",
        bgcolor: "white",
        boxShadow: 1,
      }}
    >
      <Box
        sx={{
          width: 200,
          minWidth: 200,
          bgcolor: "white",
          p: 0,
          display: "flex",
          flexDirection: "column",
          height: "100vh",
          boxShadow: 1,
          borderRight: 1,
          borderColor: "divider",
        }}
      >
        <TicketMetaSidebar ticket={ticket} />
      </Box>
      <Box
        sx={{
          width: 200,
          minWidth: 200,
          bgcolor: "white",
          p: 0,
          display: "flex",
          flexDirection: "column",
          height: "100vh",
          boxShadow: 1,
        }}
      >
        <aside
          style={{
            width: "100%",
            minWidth: 0,
            background: "transparent",
            display: "flex",
            flexDirection: "column",
            height: "100%",
            padding: 8,
          }}
        >
          <Accordion
            expanded={expanded === "panel1"}
            onChange={handleChange("panel1")}
            sx={{ borderRadius: 2, boxShadow: 1, mb: 1 }}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              {" "}
              <InfoOutlinedIcon
                fontSize="small"
                sx={{ mr: 1, color: "gray" }}
              />{" "}
              CONTACT DETAILS{" "}
            </AccordionSummary>
            <AccordionDetails>
              <ContactDetails
                name={ticket?.requester || "Developer Account"}
                email={ticket?.email || "postmanreply@gmail.com"}
              />
            </AccordionDetails>
          </Accordion>
          <Accordion
            expanded={expanded === "panel2"}
            onChange={handleChange("panel2")}
            sx={{ borderRadius: 2, boxShadow: 1, mb: 1 }}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              {" "}
              <ConfirmationNumberOutlinedIcon
                fontSize="small"
                sx={{ mr: 1, color: "gray" }}
              />{" "}
              RECENT TICKETS{" "}
            </AccordionSummary>
            <AccordionDetails>
              <RecentTickets />
            </AccordionDetails>
          </Accordion>
          <Accordion
            expanded={expanded === "panel3"}
            onChange={handleChange("panel3")}
            sx={{ borderRadius: 2, boxShadow: 1, mb: 1 }}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              {" "}
              <AccessTimeOutlinedIcon
                fontSize="small"
                sx={{ mr: 1, color: "gray" }}
              />{" "}
              TIME LOGS{" "}
            </AccordionSummary>
            <AccordionDetails>
              <TimeLogs />
            </AccordionDetails>
          </Accordion>
          <Accordion
            expanded={expanded === "panel4"}
            onChange={handleChange("panel4")}
            sx={{ borderRadius: 2, boxShadow: 1 }}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              {" "}
              <CheckBoxOutlinedIcon
                fontSize="small"
                sx={{ mr: 1, color: "gray" }}
              />{" "}
              TO-DO{" "}
            </AccordionSummary>
            <AccordionDetails>
              <ToDoSection />
            </AccordionDetails>
          </Accordion>
        </aside>
      </Box>
    </Box>
  );
};

export default TicketPropertiesSidebar;
