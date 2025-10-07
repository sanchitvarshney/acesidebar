import React, { useState } from "react";
import {
  Box,
  Button,
  IconButton,
  Typography,
  Card,
  CardContent,
  TextField,
  Divider,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useLocation, useNavigate } from "react-router-dom";

import StackEditor from "../../../components/reusable/Editor";
import {
  useValidatePlaceholdersMutation,
  usePreviewNotificationMutation,
} from "../../../services/placeholderServices";
import { useGetEmailNotificationsSettingsTemplateQuery } from "../../../services/settingServices";

const CreateEmailNotificationsPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { event } = location.state;
  const [validatePlaceholders] = useValidatePlaceholdersMutation();
  const [previewNotification] = usePreviewNotificationMutation();
  const { data: template } = useGetEmailNotificationsSettingsTemplateQuery({
    key: event?.key && event?.key,
  });

  // Form state management
  const [formData, setFormData] = useState<any>({
    eventType: event?.type || "",
    eventLabel: event?.title || "",
    subject: template?.subject || "",
    message: "",
    isEnabled: true,
    language: "en",
    recipients: [],
    templateId: event?.key || "",
  });

  // console.log("payload", placeholders);
  //   useEffect(() => {
  //     if (placeholders?.Ticket?.Subject) {
  //       setFormData((prev: any) => ({
  //         ...prev,
  //         subject: placeholders.Ticket.Subject,
  //         message: `

  //     <div style=" height: 100px ;background-color: #8e98a0; color: #fff; padding: 10px; font-size: 20px">
  //       Hi
  //       <br style="background-color: #8e98a0; color: #fff;"  />
  //      A new <span style="font-weight: bold; padding: 10px">ticket has been created.</span> Please have a look at the details and reply to the query.
  //     </div>
  //     <br/> <br/>
  //     <div>
  //       <span style="font-weight: bold; padding: 10px">Subject: ${placeholders?.Ticket?.Subject}</span>
  //       <br/>
  //       <p>${placeholders?.Ticket?.Description}</p>
  //     </div>
  //         <br/> <br/>     <br/> <br/>
  //     <div><button style="!cursor: pointer">Reply</button></div>

  // `,
  //       }));
  //     }
  //   }, [placeholders]);

  // Form validation

  // Handle form field changes
  const handleSubjectChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev: any) => ({
      ...prev,
      subject: e.target.value,
    }));
  };

  const handleMessageChange = (content: string) => {
    setFormData((prev: any) => ({
      ...prev,
      message: content,
    }));
  };


  // Handle form submission
  const handleSubmit = async () => {
    const title = formData.subject.trim();
    const payload = {
      title,
      content: {
        eventType: formData.eventType,
        eventLabel: formData.eventLabel,

        message: formData.message.trim(),
        isEnabled: formData.isEnabled,
        language: formData.language,
        recipients: formData.recipients,
        templateId: formData.templateId,
      },
    };

    validatePlaceholders(payload).then((response: any) => {
      if (response?.data) {
        console.log("Email Notification Payload:", payload);
      } else {
        console.log("Email Notification Payload:", payload);
      }
    });
    console.log("Email Notification Payload:", payload);
  };

  const handleCancel = () => {
    navigate("/settings/emails/email-notifications");
  };

  const handlePreview = () => {
    const payload = {
      ticketID: "1",
      data: {
        eventType: formData.eventType,
        eventLabel: formData.eventLabel,
        subject: formData.subject,
        message: formData.message.trim(),
        isEnabled: formData.isEnabled,
        language: formData.language,
        recipients: formData.recipients,
        templateId: formData.templateId,
      },
    };
    previewNotification(payload).then((response: any) => {
      if (response?.data) {
        console.log("Email Notification Payload:", payload);
      } else {
        console.log("Email Notification Payload:", payload);
      }
    });
    console.log("Email Notification Payload:", payload);
  };

  return (
    <Box
      sx={{
        height: "calc(100vh - 96px)",
        display: "grid",
        gridTemplateColumns: "3fr 1fr",
        overflow: "hidden",
      }}
    >
      {/* Left Content */}
      <Box
        sx={{
          p: 1,
          display: "flex",
          flexDirection: "column",
          gap: 2,
          height: "calc(100vh - 110px)",
        }}
      >
        {/* Header Section */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 1,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <IconButton
              onClick={() => navigate("/settings/emails/email-notifications")}
            >
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h5" sx={{ fontWeight: 600, color: "#1a1a1a" }}>
              Agent Notifications / {event.title}
            </Typography>
          </Box>
        </Box>

        <Box
          sx={{
            display: "flex",
            gap: 2,
            flexDirection: "column",
            height: "calc(100vh - 245px)",
            overflow: "auto",
            py: 2,
            px: 5,
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 0.4,
              width: "100%",
            }}
          >
            <Typography variant="subtitle2">
              Subject <span className="text-red-500">*</span>
            </Typography>

            <TextField
              fullWidth
              value={formData.subject}
              size="small"
              onChange={handleSubjectChange}
              placeholder="Enter email subject"
              required
            />
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              width: "100%",
            }}
          >
            <Typography variant="subtitle2">
              Message <span className="text-red-500">*</span>
            </Typography>
            <StackEditor
              onChange={handleMessageChange}
              onFocus={undefined}
              initialContent={`<div style=" height: 100px ;background-color: #8e98a0; color: #fff; padding: 10px; font-size: 20px">
      Hi 
       <br style="background-color: #8e98a0; color: #fff;"  />
      A new <span style="font-weight: bold; padding: 10px">ticket has been created.</span> Please have a look at the details and reply to the query.
     </div>
    <br/> <br/> 
    <div>
      <span style="font-weight: bold; padding: 10px">Subject: ${template?.subject}</span>
      <br/>
      <p>${template?.content}</p>
    </div>
        <br/> <br/>     <br/> <br/> 
    <div><button style="!cursor: pointer">Reply</button></div>`}
              isFull={false}
              customHeight="220px"
            />
          </Box>
        </Box>
        <Divider />
        <Box sx={{ display: "flex", gap: 1, justifyContent: "space-between" }}>
          <Button
            variant="text"
            color="primary"
            sx={{ fontWeight: 600 }}
            onClick={handlePreview}
          >
            Preview
          </Button>
          <div className="flex gap-2">
            <Button
              variant="text"
              color="primary"
              sx={{ fontWeight: 600 }}
              onClick={handleCancel}
            >
              Cancel
            </Button>
            <Button variant="contained" color="primary" onClick={handleSubmit}>
              Save
            </Button>
          </div>
        </Box>
      </Box>

      {/* Right Sidebar */}
      <Box
        sx={{
          maxHeight: "calc(100vh - 100px)",
          overflowY: "auto",
          p: 3,
          bgcolor: "#f8f9fa",
          borderLeft: "1px solid #e0e0e0",
        }}
      >
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <Card sx={{ boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
            <CardContent>
              <Typography
                variant="h6"
                sx={{ fontWeight: 600, mb: 2, color: "#1a1a1a" }}
              >
                New Ticket Created
              </Typography>
              <Typography
                variant="body2"
                sx={{ lineHeight: 1.6, color: "#65676b" }}
              >
                The New Ticket Created email will be sent out to your agents
                whenever a new ticket is created in your help desk. You can pick
                which agent should be receiving this notification. This email
                could contain the ticket URL making it easier for the agent to
                check the ticket. If you’ve setup multiple supported languages
                in your helpdesk, you can create this notification specific to
                each language. The icon indicates that the notification
                translations in other languages may be outdated.
              </Typography>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Box>
  );
};

export default CreateEmailNotificationsPage;
