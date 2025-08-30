import React, { useEffect, useState } from "react";
import {
  Avatar,
  Box,
  IconButton,
  ListItem,
  ListItemButton,
  Typography,
  TextField,
  CircularProgress,
} from "@mui/material";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import XIcon from "@mui/icons-material/X";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import SaveIcon from "@mui/icons-material/Save";
import { useAuth } from "../../../contextApi/AuthContext";
import {
  useCommanApiMutation,
  useUpdateUserDataMutation,
} from "../../../services/threadsApi";
import { useToast } from "../../../hooks/useToast";

interface SharingDataType {
  id: string;
  label: string;
  icon: any;
  url?: string;
}

const initialSharingData: SharingDataType[] = [
  {
    id: "fb",
    label: "Facebook",
    icon: <FacebookIcon fontSize="small" />,
  },
  {
    id: "x",
    label: "Twitter",
    icon: <XIcon fontSize="small" />,
  },
  {
    id: "li",
    label: "Linkedin",
    icon: <LinkedInIcon fontSize="small" />,
  },
  {
    id: "ig",
    label: "Instagram",
    icon: <InstagramIcon fontSize="small" />,
  },
];

const SharingTab = ({ ticketData }: any) => {
  const { showToast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [socialLinks, setSocialLinks] = useState<any>([]);
  const [updateUserData, { isLoading: isUpdating, data }] =
    useUpdateUserDataMutation();
  const [changeUrl, setChangeUrl] = useState<Record<string, string>>({});
  //@ts-ignore

  const toggleEdit = () => {
    // When entering edit mode, prefill inputs with current URLs
    setIsEditing((prev) => {
      const next = !prev;
      if (next) {
        const prefilled: Record<string, string> = {};
        socialLinks.forEach((item: any) => {
          prefilled[item.id] = item.url ?? "";
        });
        setChangeUrl(prefilled);
      }
      return next;
    });
  };

  const handleUrlChange = (id: string, value: string) => {
    setChangeUrl((prev: any) => ({
      ...prev,
      [id]: value,
    }));
  };

  useEffect(() => {
    // Determine source: mutation data if available, otherwise ticketData
    const source =
      data?.type === "success" && data?.socialData
        ? data.socialData
        : ticketData?.socialAccount;

    if (!source) return;

    const list: any[] = initialSharingData.map((item) => ({
      ...item,
      url: source[item.id] ?? "",
    }));

    setSocialLinks(list);
  }, [ticketData?.socialAccount, data]);

  const handleSave = () => {
    const payload = {
      USERID: ticketData.userID,
      type: "social",
      body: {
        socialData: {
          x: changeUrl.x ?? ticketData?.socialAccount?.x ?? "",
          fb: changeUrl.fb ?? ticketData?.socialAccount?.fb ?? "",
          li: changeUrl.li ?? ticketData?.socialAccount?.li ?? "",
          ig: changeUrl.ig ?? ticketData?.socialAccount?.ig ?? "",
        },
      },
    };
    updateUserData(payload).then((res: any) => {
      if (res?.data?.success !== true) {
        showToast(res?.data?.message || "An error occurred", "error");
        return;
      }
    });

    setIsEditing(false);
  };

  return (
    <div className="bg-white rounded border border-gray-200 p-3 mb-4">
      <div className="flex items-center justify-between mb-2">
        <div className="font-semibold text-sm text-gray-700 ">Social Media</div>
        {isUpdating ? (
          <CircularProgress size={16} />
        ) : (
          <IconButton
            size="small"
            onClick={isEditing ? handleSave : toggleEdit}
          >
            {isEditing ? (
              <SaveIcon sx={{ fontSize: 20 }} />
            ) : (
              <ModeEditIcon sx={{ fontSize: 20 }} />
            )}
          </IconButton>
        )}
      </div>

      <div>
        {socialLinks.map((item: any) => (
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
                      value={changeUrl[item.id] ?? item.url}
                      onChange={(e: any) =>
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
