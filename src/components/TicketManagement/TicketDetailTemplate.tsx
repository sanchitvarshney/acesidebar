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
import { useAuth } from "../../contextApi/AuthContext";

interface TicketDetailTemplateProps {
  ticket: any; // expects { header, response, other }
  onBack: () => void;
  replyText: string;
  onReplyTextChange: (val: string) => void;
  onSendReply: any;
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
  const [showReplyEditor, setShowReplyEditor] = React.useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = React.useState(false);

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
  const handleReply = () => setShowReplyEditor(true);
  const handleCloseReply = () => setShowReplyEditor(false);
  const handleDelete = () => setDeleteModalOpen(true);
  const handleCloseDelete = () => setDeleteModalOpen(false);
  const handleConfirmDelete = () => {
    // TODO: Implement delete logic
    setDeleteModalOpen(false);
    onBack(); // After delete, go back to dashboard
  };

  if (!ticket) return null;
  return (
    <Box sx={{ display: "flex", position: "relative", height: "80vh" }}>
      <Sidebar open={false} handleDrawerToggle={() => {}} />
      <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <TicketDetailHeader
          ticket={ticket.header}
          onBack={onBack}
          onForward={handleOpenForward}
          onReply={handleReply}
          onDelete={handleDelete}
        />
        <Box sx={{ display: "flex", height: "80vh" }}>
          <Box sx={{ flex: 1, height: "80vh", overflow: "auto" }}>
            <TicketThreadSection
              thread={ticket.response}
              header={ticket.header}
              onSendReply={onSendReply}
              onForward={handleOpenForward}
              showReplyEditor={showReplyEditor}
              onCloseReply={handleCloseReply}

            />
          </Box>
          <div className="">
            <TicketPropertiesSidebar ticket={ticket.header} />
          </div>
        </Box>
      </Box>
      {(expandForward || forwardOpen || showReplyEditor) && (
        <div
          className={`${expandForward ? "w-full h-full" : "absolute top-0 right-0"}`}
        >
          <ForwardPanel
            open={forwardOpen}
            onClose={() => {
              setExpandForward(false);
              handleCloseForward();
            }}
            fields={forwardFields}
            onFieldChange={handleForwardFieldChange}
            onSend={handleForwardSend}
            expand={expandForward}
            onExpandToggle={() => setExpandForward((prev) => !prev)}
          />
        </div>
      )}
      {/* Delete Modal */}
      <MuiBox>
        <Button
          onClick={handleCloseDelete}
          style={{
            display: deleteModalOpen ? "block" : "none",
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            zIndex: 2000,
            background: "rgba(0,0,0,0.3)",
          }}
        />
        {deleteModalOpen && (
          <MuiBox
            sx={{
              position: "fixed",
              top: "40%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              bgcolor: "#fff",
              p: 4,
              borderRadius: 2,
              boxShadow: 24,
              zIndex: 2100,
            }}
          >
            <Typography variant="h6">Confirm Delete</Typography>
            <Typography sx={{ mb: 2 }}>
              Are you sure you want to delete this ticket?
            </Typography>
            <Button
              onClick={handleCloseDelete}
              variant="outlined"
              sx={{ mr: 2 }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmDelete}
              variant="contained"
              color="error"
            >
              Delete
            </Button>
          </MuiBox>
        )}
      </MuiBox>
    </Box>
  );
};

export default TicketDetailTemplate;
