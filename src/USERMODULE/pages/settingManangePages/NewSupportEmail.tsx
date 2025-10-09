import React, { useState } from "react";
import {
  Box,
  Typography,
  IconButton,
  Card,
  CardContent,
  FormControl,
  MenuItem,
  Select,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
import googleimg from "../../../assets/google.png";
import emailimg from "../../../assets/email.png";
import gmailimg from "../../../assets/gmail.png";
import microsoftimg from "../../../assets/microsoft.png";
import wordimg from "../../../assets/word.png";
const selecetFieldJsonData = [
  {
    value: "1",
    title: "Incoming & Outgoing",
    subTitle: "Create email as tickets and reply to them.",
  },
  {
    value: "2",
    title: "Incoming only",
    subTitle: "Only receive emails as tickets.",
  },
  {
    value: "3",
    title: "Outgoing only",
    subTitle: "Use this email only to reply to tickets.",
  },
];

const dummyData = [
  {
    id: 1,
    title: "Gmail",
    src: gmailimg,
  },
  {
    id: 1,
    title: "Microsoft Office 365",
    src: wordimg,
  },
  {
    id: 1,
    title: "Custom",
    src: emailimg,
  },
];

const ResuableCard = ({ item }: any) => {
  return (
    <div
      className="group  flex items-center gap-2 flex-col border border-gray-200 rounded p-4 py-6 min-w-[200px] 
  hover:border-blue-500 transition-colors duration-200 cursor-pointer hover:scale-110 transition-scale "
    >
      <img src={item.src} alt="Image" className="w-10" />
      <span>{item?.title}</span>
      <span className=" border border-gray-400 p-3 flex items-center gap-2    hidden group-hover:flex ">
        <img
          src={
            item?.title === "Gmail"
              ? googleimg
              : item?.title === "Microsoft Office 365"
              ? microsoftimg
              : item?.title === "Custom"
              ? emailimg
              : ""
          }
          alt="Image"
          className="w-4"
        />{" "}
        <p className="text-sm">Sign in</p>
      </span>
    </div>
  );
};

const NewSupportEmail: React.FC = () => {
  const navigate = useNavigate();
  const [selectFieldValue, setSelectFieldValue] = useState(
    selecetFieldJsonData[0].value
  );

  const handleChange = (event: any) => {
    setSelectFieldValue(event.target.value);
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
      <Box sx={{ p: 1, display: "flex", flexDirection: "column", gap: 2 }}>
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
              onClick={() => navigate("/settings/emails/email-settings")}
            >
              <ArrowBackIcon />
            </IconButton>
            <div className="flex flex-col gap-1">
              <Typography
                variant="h5"
                sx={{ fontWeight: 600, color: "#1a1a1a" }}
              >
                New support email
              </Typography>
              <Typography
                variant="body1"
                sx={{ fontSize: 14, color: "#7a7a7a" }}
              >
                New support email
              </Typography>
            </div>
          </Box>
        </Box>

        <div className="w-full max-h-[calc(100vh-180px)] p-2 overflow-y-auto">
          <div className="space-y-2">
            <Typography variant="subtitle1">Connect your email</Typography>
            <FormControl variant="outlined" size="small" sx={{ minWidth: 280 }}>
              <Select
                value={selectFieldValue}
                onChange={handleChange}
                // label="Age"
                sx={{ maxWidth: 280 }}
                MenuProps={{
                  PaperProps: {
                    sx: { width: 280, maxWidth: 280 },
                  },
                }}
                renderValue={(value) => {
                  const option = selecetFieldJsonData.find(
                    (o) => o.value === value
                  );
                  return option ? option.title : "";
                }}
              >
                {selecetFieldJsonData.map((item) => (
                  <MenuItem
                    value={item.value}
                    key={`${item.value}-${item.title}`}
                    sx={{ alignItems: "flex-start" }}
                  >
                    <Box sx={{ maxWidth: "100%" }}>
                      <Typography
                        variant="body2"
                        sx={{ whiteSpace: "normal", overflowWrap: "anywhere" }}
                      >
                        {item.title}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{
                          color: "text.secondary",
                          whiteSpace: "normal",
                          overflowWrap: "anywhere",
                        }}
                      >
                        {item.subTitle}
                      </Typography>
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>

          <div className="w-full flex flex-wrap gap-8  p-4 my-4">
            {dummyData.map((item: any) => (
              <ResuableCard key={item.id} item={item} />
            ))}
          </div>
        </div>
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
            className="custom-scrollbar"
      >
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <Card sx={{ boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
            <CardContent>
              <Typography
                variant="h6"
                sx={{ fontWeight: 600, mb: 2, color: "#1a1a1a" }}
              >
                Connect your email
              </Typography>
              <Typography
                variant="body2"
                sx={{ lineHeight: 1.6, color: "#65676b" }}
              >
                Enter your support email address to get started. Any email sent
                here will automatically convert into a ticket you can work on.
              </Typography>
              <Typography
                variant="body2"
                sx={{ lineHeight: 1.6, color: "#65676b" }}
              >
                You can completely customize your email replies to reflect your
                brand. Empower agents to create new outbound tickets and also
                allow them to choose their own name as the sender name to give
                the conversation a personal touch
              </Typography>
            </CardContent>
          </Card>
          <Card sx={{ boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
            <CardContent>
              <Typography
                variant="h6"
                sx={{ fontWeight: 600, mb: 1, color: "#1a1a1a" }}
              >
                Choose how to convert incoming emails as tickets in Freshdesk
              </Typography>
              <div className="space-y-4">
                <div>
                  <Typography variant="subtitle2">Gmail Server</Typography>
                  <Typography
                    variant="body2"
                    sx={{ lineHeight: 1.6, color: "#65676b" }}
                  >
                    Select this if your email ID is configured on Google's mail
                    server.
                  </Typography>
                </div>
                <div>
                  <Typography variant="subtitle2">
                    Office365 Mail Server
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ lineHeight: 1.6, color: "#65676b" }}
                  >
                    Select this if your email is configured on Microsoft's mail
                    server.
                  </Typography>
                </div>
                <div>
                  <Typography variant="subtitle2">
                    Freshworks mail server
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ lineHeight: 1.6, color: "#65676b" }}
                  >
                    Select this option to manually setup forwarding from your
                    email ID to Freshworks' mail server. You will need to verify
                    your email domain to reply to tickets.
                  </Typography>
                </div>
                <div>
                  <Typography variant="subtitle2">
                    Custom Mail Server
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ lineHeight: 1.6, color: "#65676b" }}
                  >
                    Select this if your email ID is on another mail server or a
                    private server.
                  </Typography>
                </div>
              </div>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Box>
  );
};

export default NewSupportEmail;
