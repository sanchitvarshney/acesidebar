import React from "react";
import { Box } from "@mui/material";
import Sidebar from "../../../components/layout/Sidebar";
import TicketDetailHeader from "./TicketDetailHeader";
import TicketThreadSection from "./TicketThreadSection";
import TicketPropertiesSidebar from "./TicketPropertiesSidebar";
import {
  Drawer,
  Button,
  Typography,
  Box as MuiBox,
  Avatar,
  Modal,
} from "@mui/material";

import ForwardPanel from "./ForwardPanel";

import { useCommanApiMutation } from "../../../services/threadsApi";
import { useGetTicketDetailStaffViewQuery } from "../../../services/ticketDetailAuth";
import { useNavigate, useParams } from "react-router-dom";
import TicketDetailSkeleton from "../../skeleton/TicketDetailSkeleton";

// interface TicketDetailTemplateProps {
//   ticket: any; // expects { header, response, other }
//   onBack: () => void;
// }

const TicketDetailTemplate = () => {
  const navigate = useNavigate();

  const openTicketNumber = useParams().id;
  const { data: ticket, isFetching: isTicketDetailLoading } =
    useGetTicketDetailStaffViewQuery(
      openTicketNumber
        ? { ticketNumber: openTicketNumber }
        : { ticketNumber: "" },
      { skip: !openTicketNumber }
    );

  const [forwardOpen, setForwardOpen] = React.useState(false);
  const [forwardFields, setForwardFields] = React.useState({
    from:
      ticket?.header?.requester ||
      "MsCorpres Automation PvtLtd (support@postmanreply.com)",
    subject: ticket?.header?.subject ? `Fwd: ${ticket.header.subject}` : "",
    to: "",
    cc: [],
    bcc: [],

    message: ticket?.header?.description || "",
    documents: [],
  });
  const [showReplyEditor, setShowReplyEditor] = React.useState(false);
  const [showEditorNote, setShowEditorNote] = React.useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = React.useState(false);
  const [value, setValue] = React.useState("");

  const [commanApi] = useCommanApiMutation();

  const handleBack = () => {
    // setOpenTicketNumber(null);
    navigate("/tickets");
  };

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
        attachments: forwardFields.documents.map((file: any) => {
          return {
            file_id: file.file_id,
            file_name: file.file_name,
            file_type: file.file_type,
            file_size: file.file_size,
            base64_data: file.base64_data,
          };
        }),
      },
    };

    // Call your API
    commanApi(payload)
      .then((response) => {})
      .catch((error) => {});
    setForwardOpen(false);
    setForwardFields({
      from:
        ticket?.header?.requester ||
        "MsCorpres Automation PvtLtd (support@postmanreply.com)",
      subject: ticket?.header?.subject ? `Fwd: ${ticket.header.subject}` : "",
      to: "",
      cc: [],
      bcc: [],
      message: ticket?.header?.description || "",
      documents: [],
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
    handleBack(); // After delete, go back to dashboard
  };

  if (isTicketDetailLoading || !ticket) {
    return <TicketDetailSkeleton />;
  }
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
            onBack={handleBack}
            onForward={handleOpenForward}
            onReply={handleReply}
            onDelete={handleDelete}
            onNote={handleAddNote}
            ticketNumber={openTicketNumber}
          />
        </div>
        <div className="w-full bg-gray-100 grid grid-cols-[3fr_1fr] ">
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
      {/* Forward Drawer */}
      <Drawer
        anchor="right"
        open={forwardOpen}
        onClose={handleCloseForward}
        ModalProps={{
          disableEscapeKeyDown: false,
          keepMounted: true,
          BackdropProps: {
            style: { backgroundColor: "rgba(0, 0, 0, 0.5)" },
            onClick: (e) => {
              e.stopPropagation();
            },
          },
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
          onClose={handleCloseForward}
          fields={forwardFields}
          onFieldChange={handleForwardFieldChange}
          onSend={handleForwardSend}
        />
      </Drawer>
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
