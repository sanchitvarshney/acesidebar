import React, { useEffect, useState } from "react";
import EditDocumentIcon from "@mui/icons-material/EditDocument";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import LinkIcon from "@mui/icons-material/Link";
import AddAlarmIcon from "@mui/icons-material/AddAlarm";
import BlockIcon from "@mui/icons-material/Block";
import { Box, Typography } from "@mui/material";
import CustomSideBarPanel from "./reusable/CustomSideBarPanel";
import LinkTickets from "../USERMODULE/components/LinkTicket";
import LogTimePanel from "../USERMODULE/pages/TicketManagement/LogTimePanel";
import ConfirmationModal from "./reusable/ConfirmationModal";
import Activity from "../USERMODULE/pages/TicketManagement/Activity";
import Attachments from "../USERMODULE/pages/TicketManagement/Attachments";
import ManageReferrals from "../USERMODULE/pages/TicketManagement/ManageReferrals";
import ChangeOwner from "../USERMODULE/pages/TicketManagement/ChangeOwner";
import EditTicket from "../USERMODULE/pages/EditTicket";
import { useCommanApiMutation } from "../services/threadsApi";
import { useToast } from "../hooks/useToast";
import ListIcon from "@mui/icons-material/List";
import LocalPrintshopIcon from "@mui/icons-material/LocalPrintshop";
import SearchIcon from "@mui/icons-material/Search";

const MoreOptionsPage = ({
  ticket,
  onTicketUpdated,
  ticketNumber,
  onDrawerStateChange, // New prop to notify parent about drawer state
  onMenuClose,
}: any) => {
  const { showToast } = useToast();
  const [isLogTimeModal, setIsLogTimeModal] = useState(false);
  const [isEditTicket, setIsEditTicket] = useState(false);
  const [isChangeOwnerModal, setIsChangeOwnerModal] = useState(false);
  const [isManageReferralsModal, setIsManageReferralsModal] = useState(false);
  const [isAttachmentsModal, setIsAttachmentsModal] = useState(false);
  const [isActivityModal, setIsActivityModal] = useState(false);
  const [isLinkModal, setIsLinkModal] = useState(false);
  const [spamValue, setSpamValue] = useState<any>(null);
  const [isSpamModal, setIsSpamModal] = useState(false);
  const [spamTicketSuccess, setSpamTicketSuccess] = useState(false);
  const [commanApi] = useCommanApiMutation();
  const [spamTicket, { isLoading: isSpamTicketLoading }] =
    useCommanApiMutation();
  const handleMenuClose = React.useCallback(() => {
    if (typeof onMenuClose === "function") {
      onMenuClose();
    }
  }, [onMenuClose]);

  const openThenClose = React.useCallback(
    (openSetter: (value: boolean) => void) => {
      openSetter(true);
      handleMenuClose();
    },
    [handleMenuClose]
  );

  const [editOverrides, setEditOverrides] = useState<{
    subject?: string;
    description?: string;
  }>({});

  const handleSpamTicket = (ticketId: any, status: any) => {
    const statusValue = status ? 0 : 1;
    if (!ticketId || ticketId === "") {
      showToast(" Status or ticket missing", "error");
      return;
    }
    const payload = {
      url: `spam/${ticketId}/${statusValue}`,
      method: "PUT",
    };
    spamTicket(payload).then((res: any) => {
      if (res?.data?.type === "error") {
        showToast(res?.data?.message, "error");
        return;
      }
      if (res?.data?.type === "success") {
        setSpamTicketSuccess(true);
        setSpamValue(!spamValue);
      }
    });
  };

  const handlePrintData = React.useCallback((ticketId: any) => {
    if (!ticketId || ticketId === "") {
      return;
    }
    const payload = {
      url: `${ticketId}/print`,
      method: "GET",
    };
    commanApi(payload);
  }, [commanApi]);

  const effectiveSubject = editOverrides.subject ?? ticket?.subject;
  const effectiveDescription = editOverrides.description ?? ticket?.body;

  const isAnyDrawerOpen =
    isLogTimeModal ||
    isEditTicket ||
    isChangeOwnerModal ||
    isManageReferralsModal ||
    isAttachmentsModal ||
    isActivityModal ||
    isLinkModal ||
    isSpamModal;

  useEffect(() => {
    onDrawerStateChange && onDrawerStateChange(isAnyDrawerOpen);
  }, [isAnyDrawerOpen, onDrawerStateChange]);
  const moreOptions = React.useMemo(
    () => [
      {
        id: "change-owner",
        title: "Change Owner",
        icon: <PersonAddAlt1Icon sx={{ color: "#1a73e8" }} />,
        iconBg: "#dbeafe",
        onClick: () => {
          openThenClose(setIsChangeOwnerModal);
        },
      },
    {
      id: "edit-ticket",
      title: "Edit Ticket",
      // description: "Modify ticket details",
      icon: <EditDocumentIcon sx={{ color: "#f59e0b" }} />,
      iconBg: "#fef3c7",
      onClick: () => {
        openThenClose(setIsEditTicket);
      },
    },
    {
      id: "link-tickets",
      title: "Link Tickets",
      // description: "Connect related tickets",
      icon: <LinkIcon sx={{ color: "#059669" }} />,
      iconBg: "#d1fae5",
      onClick: () => {
        openThenClose(setIsLinkModal);
      },
    },
    {
      id: "manage-referrals",
      title: "Manage Referrals",
      // description: "Handle ticket referrals",
      icon: <ManageAccountsIcon sx={{ color: "#9333ea" }} />,
      iconBg: "#f3e8ff",
      onClick: () => {
        openThenClose(setIsManageReferralsModal);
      },
    },
    {
      id: "attachments",
      title: "Attachments",
      // description: "Manage ticket files",
      icon: <AttachFileIcon sx={{ color: "#dc2626" }} />,
      iconBg: "#fef2f2",
      onClick: () => {
        openThenClose(setIsAttachmentsModal);
      },
    },
    {
      id: "activity",
      title: "Activity",
      // description: "View ticket history",
      icon: <ListIcon sx={{ color: "#0284c7" }} />,
      iconBg: "#e0f2fe",
      onClick: () => {
        openThenClose(setIsActivityModal);
      },
    },
    {
      id: "log-time",
      title: "Log Time",
      // description: "Track time spent on ticket",
      icon: <AddAlarmIcon sx={{ color: "#eab308" }} />,
      iconBg: "#fef7cd",
      onClick: () => {
        openThenClose(setIsLogTimeModal);
      },
    },
    {
      id: "spam",
      title: ` ${spamValue ? "Unmark" : "Mark"} Spam`,
      // description: `${spamValue ? "Unmark" : "Mark"} ticket as spam`,
      icon: <BlockIcon sx={{ color: "#dc2626" }} />,
      iconBg: "#fef2f2",
      onClick: () => {
        openThenClose(setIsSpamModal);
      },
    },
      {
        id: "print",
        title: "Print",
        icon: <LocalPrintshopIcon sx={{ color: "#0ea5e9" }} />,
        iconBg: "#f0f9ff",
        onClick: () => {
          handleMenuClose();
          handlePrintData(ticketNumber);
        },
      },
    ],
    [handleMenuClose, handlePrintData, openThenClose, spamValue]
  );

  useEffect(() => {
    if (ticket?.isSpam) {
      setSpamValue(ticket?.isSpam);
    }
  }, [ticket?.isSpam]);
  return (
    <Box
      sx={{
        display: "grid",
        gap: 2,
        py: 1,
        maxHeight: "calc(100vh - 200px)",
        overflowY: "auto",
        paddingRight: 1,
        minWidth: { xs: "100%", md: 250 },
        maxWidth: { xs: "100%", md: 250 },
      }}
      className="custom-scrollbar"
      id="more-options-grid"
    >
      {moreOptions.length > 0 ? (
        moreOptions.map((option: any) => (
          <Box
            key={option.id}
            onClick={option.onClick}
            sx={{
              py: 0.8,
              px: 1.4,
              mx: 0.5,
              backgroundColor: "white",
              borderRadius: 19,
              // border: "1px solid #e1e7ee",
              cursor: "pointer",
              // transition: "all 0.2s ease",
              "&:hover": {
                // transform: "translateY(-2px)",
                // boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
                borderColor: "#1a73e8",
                backgroundColor: "#e0e0e0", //light gray
              },
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              {/* <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: 2,
                  backgroundColor: option.iconBg,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              > */}
              {option.icon}
              {/* </Box> */}
              <Box>
                <Typography
                  variant="subtitle1"
                  sx={{ fontWeight: "bold", color: "#1e293b" }}
                >
                  {option.title}
                </Typography>
                {/* <Typography variant="body2" sx={{ color: "#64748b" }}>
                  {option.description}
                </Typography> */}
              </Box>
            </Box>
          </Box>
        ))
      ) : (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            py: 4,
            textAlign: "center",
          }}
        >
          <SearchIcon sx={{ fontSize: 48, color: "#9ca3af", mb: 2 }} />
          <Typography
            variant="h6"
            sx={{ color: "#6b7280", fontWeight: "medium", mb: 1 }}
          >
            No options found
          </Typography>
          <Typography variant="body2" sx={{ color: "#9ca3af" }}>
            Try searching with different keywords
          </Typography>
        </Box>
      )}

      <CustomSideBarPanel
        open={isLinkModal}
        close={() => setIsLinkModal(false)}
        title={
          <div className="flex items-center gap-2">
            <LinkIcon fontSize="small" />
            <Typography variant="subtitle1" fontWeight={600}>
              Link Ticket
            </Typography>
          </div>
        }
        width={600}
      >
        {isLinkModal ? (
          <LinkTickets
            open={isLinkModal}
            onClose={() => setIsLinkModal(false)}
            currentTicket={{
              id: ticket?.ticketId,
              title: ticket?.subject,
              subject: ticket?.subject,
            }}
          />
        ) : null}
      </CustomSideBarPanel>

      <CustomSideBarPanel
        open={isLogTimeModal}
        close={() => {
          setIsLogTimeModal(false);
        }}
        title={
          <Typography variant="subtitle2">
            {" "}
            <AddAlarmIcon fontSize="small" /> Log Time
          </Typography>
        }
        width={600}
      >
        {isLogTimeModal ? (
          <LogTimePanel
            open={isLogTimeModal}
            onClose={() => {
              setIsLogTimeModal(false);
            }}
            ticketId={ticketNumber}
          />
        ) : null}
      </CustomSideBarPanel>

      <CustomSideBarPanel
        open={isEditTicket}
        close={() => {
          setIsEditTicket(false);
        }}
        title={
          <div className="flex items-center gap-2">
            <EditDocumentIcon fontSize="small" />
            <Typography variant="subtitle1" fontWeight={600}>
              {" "}
              Edit Ticket (#{ticketNumber})
            </Typography>
          </div>
        }
        width={600}
      >
        {isEditTicket ? (
          <EditTicket
            open={isEditTicket}
            onClose={() => {
              setIsEditTicket(false);
            }}
            ticket={{
              subject: effectiveSubject,
              description: effectiveDescription,
              client: {
                id: ticket?.userID,
                name: ticket?.username,
                email: ticket?.email,
              },
              ticketId: ticket?.ticketId,
            }}
            onUpdated={(updated: any) => {
              try {
                setEditOverrides({
                  subject: updated?.subject,
                  description: updated?.description,
                });
                // Bubble up if parent wants to sync global state
                onTicketUpdated && onTicketUpdated(updated);
              } catch (_) {
                // optional callback
              }
            }}
          />
        ) : null}
      </CustomSideBarPanel>

      {/* Change Owner Panel */}
      <CustomSideBarPanel
        open={isChangeOwnerModal}
        close={() => {
          setIsChangeOwnerModal(false);
        }}
        title={
          <div className="flex items-center gap-2">
            <PersonAddAlt1Icon fontSize="small" />
            <Typography variant="subtitle1" fontWeight={600}>
              Change Owner
            </Typography>
          </div>
        }
        width={600}
      >
        {isChangeOwnerModal ? (
          <ChangeOwner
            open={isChangeOwnerModal}
            onClose={() => {
              setIsChangeOwnerModal(false);
            }}
            ticketId={ticketNumber}
            currentOwner={{
              id: ticket?.assignor?.userID,
              name: ticket?.assignor?.name,
              email: ticket?.email,
            }}
          />
        ) : null}
      </CustomSideBarPanel>

      {/* Manage Referrals Panel */}
      <CustomSideBarPanel
        open={isManageReferralsModal}
        close={() => {
          setIsManageReferralsModal(false);
        }}
        title={
          <div className="flex items-center gap-2">
            <ManageAccountsIcon fontSize="small" />
            <Typography variant="subtitle1" fontWeight={600}>
              Manage Referrals
            </Typography>
          </div>
        }
        width={700}
      >
        {isManageReferralsModal ? (
          <ManageReferrals
            open={isManageReferralsModal}
            onClose={() => {
              setIsManageReferralsModal(false);
            }}
            ticket={{
              id: ticket?.ticketId,
              status: ticket?.status?.key,
            }}
          />
        ) : null}
      </CustomSideBarPanel>

      {/* Attachments Panel */}
      <CustomSideBarPanel
        open={isAttachmentsModal}
        close={() => {
          setIsAttachmentsModal(false);
        }}
        title={
          <div className="flex items-center gap-2">
            <AttachFileIcon fontSize="small" />
            <Typography variant="subtitle1" fontWeight={600}>
              Attachments
            </Typography>
          </div>
        }
        width={800}
      >
        {isAttachmentsModal ? (
          <Attachments
            open={isAttachmentsModal}
            onClose={() => {
              setIsAttachmentsModal(false);
            }}
            ticketId={ticketNumber}
          />
        ) : null}
      </CustomSideBarPanel>

      {/* Activity Panel */}
      <CustomSideBarPanel
        open={isActivityModal}
        close={() => {
          setIsActivityModal(false);
        }}
        title={
          <div className="flex items-center gap-2">
            <AddAlarmIcon fontSize="small" />
            <Typography variant="subtitle1" fontWeight={600}>
              Activity Log
            </Typography>
          </div>
        }
        width={900}
      >
        {isActivityModal ? (
          <Activity
            open={isActivityModal}
            onClose={() => {
              setIsActivityModal(false);
            }}
            ticketId={ticketNumber}
          />
        ) : null}
      </CustomSideBarPanel>
      <ConfirmationModal
        open={isSpamModal}
        onClose={() => {
          setIsSpamModal(false);
          setSpamTicketSuccess(false);
        }}
        onConfirm={() => handleSpamTicket(ticketNumber, spamValue)}
        title={`${spamValue ? "Unspam" : "Spam"} Ticket`}
        message={`Are you sure you want to ${
          spamValue ? "unspam" : "spam"
        } this ticket?`}
        isLoading={isSpamTicketLoading}
        type="close"
      />
    </Box>
  );
};

export default React.memo(MoreOptionsPage);
