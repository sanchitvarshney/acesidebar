import React, { useState } from "react";
import {
  Avatar,
  Box,
  IconButton,
  ListItem,
  ListItemButton,
  Typography,
  TextField,
} from "@mui/material";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import XIcon from "@mui/icons-material/X";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import SaveIcon from "@mui/icons-material/Save";

interface SharingDataType {
  id: string;
  label: string;
  icon: any;
  url: string;
}

const initialSharingData: SharingDataType[] = [
  {
    id: "facebook",
    label: "Facebook",
    icon: <FacebookIcon fontSize="small" />,
    url: "https://www.facebook.com/",
  },
  {
    id: "twitter",
    label: "Twitter",
    icon: <XIcon fontSize="small" />,
    url: "https://www.twitter.com/",
  },
  {
    id: "linkedin",
    label: "Linkedin",
    icon: <LinkedInIcon fontSize="small" />,
    url: "https://www.linkedin.com/",
  },
  {
    id: "instagram",
    label: "Instagram",
    icon: <InstagramIcon fontSize="small" />,
    url: "https://www.instagram.com/",
  },
];

const SharingTab = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [socialLinks, setSocialLinks] = useState(initialSharingData);

  const toggleEdit = () => setIsEditing((prev) => !prev);

  const handleUrlChange = (id: string, value: string) => {
    setSocialLinks((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, url: value } : item
      )
    );
  };

  const handleSave = () => {
    console.log("Updated social links:", socialLinks); // <-- API call can go here
    setIsEditing(false);
  };

  return (
    <div className="bg-white rounded border border-gray-200 p-3 mb-4">
      <div className="flex items-center justify-between mb-2">
        <div className="font-semibold text-sm text-gray-700 ">
          Social Media
        </div>
        <IconButton size="small" onClick={isEditing ? handleSave : toggleEdit}>
          {isEditing ? (
            <SaveIcon sx={{ fontSize: 20 }} />
          ) : (
            <ModeEditIcon sx={{ fontSize: 20 }} />
          )}
        </IconButton>
      </div>

      <div>
        {socialLinks.map((item) => (
          <ListItem
            key={item.id}
            component="div"
            disablePadding
            sx={{
              backgroundColor: "#fff",
              transition: "background-color 0.2s ease",
            }}
          >
            <ListItemButton
              sx={{
                padding: "12px 16px",
                alignItems: "flex-start",
                minHeight: 60,
                borderRadius: 1,
                transition: "box-shadow 0.2s",
                "&:hover, &:focus": {
                  backgroundColor: "#f5f5f5ff",
                  boxShadow: "0 2px 8px rgba(25, 118, 210, 0.08)",
                },
              }}
            >
              <Box display="flex" gap={2} width="100%" alignItems="flex-start">
                <div className="flex items-center">{item.icon}</div>
                <Box flex={1} minWidth={0}>
                  <Typography
                    variant="subtitle2"
                    fontWeight={600}
                    sx={{
                      color: "#2c3e50",
                      fontSize: "0.9rem",
                      lineHeight: 1.2,
                    }}
                  >
                    {item.label}
                  </Typography>

                  {isEditing ? (
                    <TextField
                      size="small"
                      fullWidth
                      value={item.url}
                      onChange={(e) =>
                        handleUrlChange(item.id, e.target.value)
                      }
                      sx={{ mt: 0.5 }}
                    />
                  ) : (
                    <Typography
                      variant="body2"
                      sx={{
                        color: "#34495e",
                        lineHeight: 1.4,
                        fontSize: "0.8rem",
                        wordBreak: "break-word",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {item.url}
                    </Typography>
                  )}
                </Box>
              </Box>
            </ListItemButton>
          </ListItem>
        ))}
      </div>
    </div>
  );
};

export default SharingTab;
