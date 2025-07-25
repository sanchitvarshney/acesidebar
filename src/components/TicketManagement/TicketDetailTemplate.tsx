import React from "react";
import { Box } from "@mui/material";
import Sidebar from "../layout/Sidebar";
import TicketDetailHeader from "./TicketDetailHeader";
import TicketThreadSection from "./TicketThreadSection";
import TicketPropertiesSidebar from "./TicketPropertiesSidebar";
import TicketDetailAccordion from "./TicketDetailAccordion";
import {
  Drawer,
  IconButton,
  TextField,
  Button,
  Typography,
  Box as MuiBox,
  Avatar,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ForwardPanel from "./ForwardPanel";

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
  const [forwardOpen, setForwardOpen] = React.useState(false);
  const [expandForward, setExpandForward] = React.useState(false);
  const [forwardFields, setForwardFields] = React.useState({
    from:
      ticket?.header?.requester ||
      "MsCorpres Automation PvtLtd (support@postmanreply.com)",
    subject: ticket?.header?.subject ? `Fwd: ${ticket.header.subject}` : "",
    to: "",
    cc: "",
    bcc: "",
    message: ticket?.header?.description || "",
  });

  // Pass this to children to allow opening the forward panel
  const handleOpenForward = () => setForwardOpen(true);
  const handleCloseForward = () => setForwardOpen(false);
  const handleForwardFieldChange = (field: string, value: string) => {
    setForwardFields((prev) => ({ ...prev, [field]: value }));
  };
  const handleForwardSend = () => {
    // TODO: Implement actual forward logic
    setForwardOpen(false);
    setForwardFields({
      from:
        ticket?.header?.requester ||
        "MsCorpres Automation PvtLtd (support@postmanreply.com)",
      subject: ticket?.header?.subject ? `Fwd: ${ticket.header.subject}` : "",
      to: "",
      cc: "",
      bcc: "",
      message: ticket?.header?.description || "",
    });
  };

  if (!ticket) return null;
  return (
    <Box sx={{ display: "flex", position: "relative" }}>
      <Sidebar open={false} handleDrawerToggle={() => {}} />
      <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <TicketDetailHeader
          ticket={ticket.header}
          onBack={onBack}
          onForward={handleOpenForward}
        />
        <Box sx={{ display: "flex" }}>
          <Box sx={{ flex: 1 }}>
            <TicketThreadSection
              thread={ticket.response}
              header={ticket.header}
              onSendReply={onSendReply}
              onForward={handleOpenForward}
            />
          </Box>
          <div className="">
            {!expandForward && forwardOpen ? (
              <ForwardPanel
                open={true}
                onClose={() => {
                  setExpandForward(false);
                  handleCloseForward();
                }}
                fields={forwardFields}
                onFieldChange={handleForwardFieldChange}
                onSend={handleForwardSend}
                expand={false}
                onExpandToggle={() => setExpandForward((prev) => !prev)}
              />
            ) : !forwardOpen ? (
              <TicketPropertiesSidebar ticket={ticket.header} />
            ) : null}
          </div>
        </Box>
      </Box>
      {expandForward && forwardOpen && (
        <ForwardPanel
          open={true}
          onClose={() => {
            setExpandForward(false);
            handleCloseForward();
          }}
          fields={forwardFields}
          onFieldChange={handleForwardFieldChange}
          onSend={handleForwardSend}
          expand={true}
          onExpandToggle={() => setExpandForward((prev) => !prev)}
        />
      )}
    </Box>
  );
};

export default TicketDetailTemplate;
