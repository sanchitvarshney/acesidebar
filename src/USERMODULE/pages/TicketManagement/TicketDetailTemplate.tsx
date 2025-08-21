import React from "react";
import { Box } from "@mui/material";
import Sidebar from "../../../components/layout/Sidebar";
import TicketDetailHeader from "./TicketDetailHeader";
import TicketThreadSection from "./TicketThreadSection";
import TicketPropertiesSidebar from "./TicketPropertiesSidebar";
import TicketDetailAccordion from "./TicketDetailAccordion";
import OpenInFullIcon from "@mui/icons-material/OpenInFull";
import CloseFullscreenIcon from "@mui/icons-material/CloseFullscreen";
import {
  Drawer,
  IconButton,
  TextField,
  Button,
  Typography,
  Box as MuiBox,
  Avatar,
  Modal,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ForwardPanel from "./ForwardPanel";
import { useAuth } from "../../../contextApi/AuthContext";
import { set } from "react-hook-form";
import {
  useCommanApiMutation,
  useForwardThreadMutation,
} from "../../../services/threadsApi";
import { email } from "zod/v4/core/regexes";

interface TicketDetailTemplateProps {
  ticket: any; // expects { header, response, other }
  onBack: () => void;
}

const TicketDetailTemplate: React.FC<TicketDetailTemplateProps> = ({
  ticket,
  onBack,
}) => {
  const [forwardOpen, setForwardOpen] = React.useState(false);
  const [expandForward, setExpandForward] = React.useState(false);
  const [forwardFields, setForwardFields] = React.useState({
    from:
      ticket?.header?.requester ||
      "MsCorpres Automation PvtLtd (support@postmanreply.com)",
    subject: ticket?.header?.subject ? `Fwd: ${ticket.header.subject}` : "",
    to: [],
    cc: [],
    bcc: [],

    message: ticket?.header?.description || "",
    documents:[]
  });
  const [showReplyEditor, setShowReplyEditor] = React.useState(false);
  const [showEditorNote, setShowEditorNote] = React.useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = React.useState(false);
  const [value, setValue] = React.useState("");
  const [forwardThread] = useForwardThreadMutation();

  const [commanApi] = useCommanApiMutation();

  // Pass this to children to allow opening the forward panel
  const handleOpenForward = () => setForwardOpen(true);
  const handleCloseForward = () => setForwardOpen(false);
  const handleForwardFieldChange = (field: string, value: string) => {
    setForwardFields((prev) => ({ ...prev, [field]: value }));
  };
  const handleForwardSend = () => {
    if (!ticket) return;

    const payload = {
      url: "forward-thread",
      body: {
        email: {
          from: ticket?.header?.requester,
          to: forwardFields.to,
          cc: forwardFields.cc,
          bcc: forwardFields.bcc,
        },
        subject: ticket?.header?.subject
          ? `FWD: ${ticket.header.subject}`
          : forwardFields.subject,
        message: ticket?.header?.description || forwardFields.message,
        attachments: [
          {
            filename: "report.pdf",
            base64_data: "JVBERi0xLjQKJc...",
          },
        ],
      },
    };

    // Call your API
    forwardThread(payload)
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.error(error);
      });
    setForwardOpen(false);
    setForwardFields({
      from:
        ticket?.header?.requester ||
        "MsCorpres Automation PvtLtd (support@postmanreply.com)",
      subject: ticket?.header?.subject ? `Fwd: ${ticket.header.subject}` : "",
      to: [],
      cc: [],
      bcc: [],
      message: ticket?.header?.description || "",
      documents:[],
    });
  };

  const handleReply = () => {
    setShowReplyEditor(true);
    setValue("Reply");
  };

  const handleCloseReply = () => setShowReplyEditor(false);
  const handleAddNote = () => {
    setShowEditorNote(true);
    setValue("Note");
  };
  const handleAddNoteClose = () => setShowEditorNote(false);
  const handleDelete = () => setDeleteModalOpen(true);
  const handleCloseDelete = () => setDeleteModalOpen(false);
  const handleConfirmDelete = () => {
    // TODO: Implement delete logic
    setDeleteModalOpen(false);
    onBack(); // After delete, go back to dashboard
  };

  if (!ticket) return null;
  return (
    <Box
      sx={{
        display: "flex",
        position: "relative",
        overflow: "hidden",
        height: "calc(100vh - 112px)",
      }}
    >
      <Sidebar open={false} handleDrawerToggle={() => {}} />
      <Box
        id="ticket-header"
        sx={{ flex: 1, display: "flex", flexDirection: "column" }}
      >
        <div className="sticky top-0 z-[99]">
          <TicketDetailHeader
            ticket={ticket.header}
            onBack={onBack}
            onForward={handleOpenForward}
            onReply={handleReply}
            onDelete={handleDelete}
            onNote={handleAddNote}
          />
        </div>
        <div className="w-full  grid grid-cols-[3fr_1fr] ">
          <div
            style={{ width: "100%", height: "100%", overflow: "auto" }}
            id="ticket-thread"
          >
            <TicketThreadSection
              thread={ticket.response}
              header={ticket.header}
              onForward={handleOpenForward}
              showReplyEditor={showReplyEditor}
              onCloseReply={handleCloseReply}
              showEditorNote={showEditorNote}
              onCloseEditorNote={handleAddNoteClose}
              value={value}
            />
          </div>
          <div style={{ width: "100%", height: "100%", overflow: "hidden" }}>
            <TicketPropertiesSidebar ticket={ticket.header} />

            {/* Forward Panel positioned inside the right column */}
          </div>
        </div>
      </Box>
      {/* Forward Drawer (MUI Slider) */}
      {!expandForward && (
        <Drawer
          anchor="right"
          open={forwardOpen}
          onClose={() => {
            setExpandForward(false);
            handleCloseForward();
          }}
          sx={{
            "& .MuiDrawer-paper": {
              width: 600,
              maxWidth: "100vw",
              boxShadow: 24,
            },
          }}
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
            onExpandToggle={() => {
              setExpandForward((prev) => !prev);
            }}
          />
        </Drawer>
      )}
      {/* Forward Modal (centered) */}
      {expandForward && (
        <Modal
          open={forwardOpen}
          onClose={() => {
            setExpandForward(false);
            handleCloseForward();
          }}
          aria-labelledby="forward-modal-title"
          aria-describedby="forward-modal-description"
        >
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              bgcolor: "background.paper",
              boxShadow: 24,
              borderRadius: 2,
              p: 0,
              width: {
                xs: "98vw",
                sm: "90vw",
                md: "70vw",
                lg: "60vw",
                xl: "900px",
              },
              maxWidth: "98vw",
              maxHeight: "90vh",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
            }}
          >
            <Box sx={{ flex: 1, overflow: "auto" }}>
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
                onExpandToggle={() => {
                  setExpandForward((prev) => !prev);
                }}
              />
            </Box>
          </Box>
        </Modal>
      )}
      {/* Delete Modal */}
      <Modal
        open={deleteModalOpen}
        onClose={handleCloseDelete}
        aria-labelledby="delete-modal-title"
        aria-describedby="delete-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            boxShadow: 24,
            borderRadius: 2,
            p: 4,
            width: { xs: "90vw", sm: "400px" },
            maxWidth: "90vw",
          }}
        >
          <Typography variant="h6" id="delete-modal-title" sx={{ mb: 2 }}>
            Confirm Delete
          </Typography>
          <Typography id="delete-modal-description" sx={{ mb: 3 }}>
            Are you sure you want to delete this ticket?
          </Typography>
          <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
            <Button
              onClick={handleCloseDelete}
              variant="contained"
              color="inherit"
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
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default TicketDetailTemplate;
