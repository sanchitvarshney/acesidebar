import React from "react";
import { Box } from "@mui/material";
import Sidebar from "../layout/Sidebar";
import TicketDetailHeader from "./TicketDetailHeader";
import TicketThreadSection from "./TicketThreadSection";
import TicketPropertiesSidebar from "./TicketPropertiesSidebar";
import TicketDetailAccordion from "./TicketDetailAccordion";

interface TicketDetailTemplateProps {
  ticket: any; // expects { header, response, other }
  onBack: () => void;
  replyText: string;
  onReplyTextChange: (val: string) => void;
  onSendReply: () => void;
  children?: React.ReactNode;
}

const TicketDetailTemplate: React.FC<TicketDetailTemplateProps> = ({
  ticket,
  onBack,
  replyText,
  onReplyTextChange,
  onSendReply,
  children,
}) => {
  if (!ticket) return null;
  return (
    <Box sx={{ display: "flex" }}>
      <Sidebar open={false} handleDrawerToggle={() => {}} />
      <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <TicketDetailHeader ticket={ticket.header} onBack={onBack} />
        <Box sx={{ display: "flex" }}>
          <Box sx={{ flex: 1 }}>
            <TicketThreadSection
              thread={ticket.response}
              header={ticket.header}
            />
          </Box>
          <TicketPropertiesSidebar ticket={ticket.header} />
        </Box>
        <TicketDetailAccordion ticket={ticket} />
      </Box>
    </Box>
  );
};

export default TicketDetailTemplate;
