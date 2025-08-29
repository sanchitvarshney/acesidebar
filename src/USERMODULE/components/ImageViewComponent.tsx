import React, { useEffect, useState } from "react";
import {
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  IconButton,
  Typography,
  CircularProgress,
  FormGroup,
  FormControlLabel,
  Switch,
  Tooltip,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useDeleteAttachedFileMutation } from "../../services/uploadDocServices";
import { useToast } from "../../hooks/useToast";
import HelpIcon from "@mui/icons-material/Help";
import {
  useCommanApiMutation,
  useGetAttacedFileQuery,
} from "../../services/threadsApi";

interface ImageViewComponentProps {
  images: any; // Array of uploaded image files
  ticketId?: any;
  handleRemove: any;
  isToggle?: boolean;

  isPrivate?: string;
}

const ImageViewComponent: React.FC<ImageViewComponentProps> = ({
  images,
  ticketId,
  handleRemove,
  isToggle = false,

  isPrivate,
}) => {
  const { showToast } = useToast();
  const [deleteAttachedFile, { isLoading: deleteLoading }] =
    useDeleteAttachedFileMutation();
  const [changeTypeTrackId, setChangeTypeTrackId] = useState("");
  const [triggerCommanApi, { isLoading, data: changeTypeData }] =
    useCommanApiMutation();
  const { refetch } = useGetAttacedFileQuery({ ticketId });

  const [filePrivacyById, setFilePrivacyById] = useState<
    Record<string, string>
  >({});

  useEffect(() => {
    if (Array.isArray(images)) {
      const next: Record<string, string> = {};
      images.forEach((f: any) => {
        if (f?.fileId) {
          const initial = (f as any)?.isPublic ?? isPrivate;
          if (typeof initial === "string") {
            next[f.fileId] = initial;
          }
        }
      });
      setFilePrivacyById((prev) => ({ ...prev, ...next }));
    }
  }, [images, isPrivate]);
  const handleChangeValue = (signature: string, value: any) => {
    const payload = {
      url: "attachments/privacy",
      method: "PUT",
      body: {
        ticket: ticketId,
        signature: signature,
        isPublic: value === true ? "PUBLIC" : "PRIVATE",
      },
    };

    // optimistic UI update
    setFilePrivacyById((prev) => ({
      ...prev,
      [signature]: value === true ? "PUBLIC" : "PRIVATE",
    }));

    triggerCommanApi(payload)
      .then((res) => {
        if (res?.data?.success !== true) {
          showToast(
            res?.data?.message || "An error occurred while change type ",
            "error"
          );
          // revert
          setFilePrivacyById((prev) => ({
            ...prev,
            [signature]: value === true ? "PRIVATE" : "PUBLIC",
          }));
          return;
        }
        refetch();
      })
      .catch((err: any) => {
        showToast(err?.data?.message || "type failed", "error");
        // revert
        setFilePrivacyById((prev) => ({
          ...prev,
          [signature]: value === true ? "PRIVATE" : "PUBLIC",
        }));
      });
  };

  const onRemove = (fileId: string) => {
    if (!fileId) {
      showToast("File not exist please try again", "error");
      return;
    }
    const payload = {
      ticketNumber: ticketId,
      signature: fileId,
    };

    deleteAttachedFile(payload).then((res) => {
      if (res?.data?.success !== true) {
        showToast(
          res?.data?.message || "An error occurred while deleting",
          "error"
        );
        return;
      }
      handleRemove(fileId);
    });
  };
  return (
    <div style={{ padding: "6px" }}>
      <Typography variant="subtitle1" sx={{ mb: 0.5 }}>
        Attached Files
      </Typography>
      <List sx={{ width: "100%", bgcolor: "background.paper" }}>
        {images?.map((file: any) => (
          <ListItem
            key={file?.fileId}
            sx={{
              width: "100%",
              cursor: "pointer",
              justifyContent: "space-between",
              "&:hover": {
                backgroundColor: "#f5f5f5",
              },
            }}
          >
            <ListItemText
              primary={
                <span
                  style={{
                    display: "inline-block",
                    maxWidth: "160px", // adjust width
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    verticalAlign: "bottom",
                  }}
                >
                  {file?.name}
                </span>
              }
              secondary={`${file.type || "Unknown"} • ${file.size}`}
            />
            {isToggle && (
              <div>
                {isLoading && changeTypeTrackId === file?.fileId ? (
                  <CircularProgress size={16} />
                ) : (
                  <FormGroup>
                    <FormControlLabel
                      control={
                        <Tooltip
                          title={`Currently: ${
                            (filePrivacyById[file?.fileId] ?? isPrivate) ===
                            "PRIVATE"
                              ? "Private"
                              : "Public"
                          }`}
                        >
                          <Switch size="small" />
                        </Tooltip>
                      }
                      label={
                        <Tooltip title="File type (Public or Private)">
                          <HelpIcon fontSize="small" />
                        </Tooltip>
                      }
                      onChange={(e: any) => {
                        setChangeTypeTrackId(file.fileId);
                        handleChangeValue(file.fileId, e.target.checked);
                      }}
                      checked={
                        (filePrivacyById[file?.fileId] ?? isPrivate) ===
                        "PUBLIC"
                      }
                    />
                  </FormGroup>
                )}
              </div>
            )}
            <div>
              {deleteLoading ? (
                <CircularProgress size={16} />
              ) : (
                <IconButton
                  size="small"
                  sx={{}}
                  onClick={() => onRemove(file.fileId)}
                >
                  <DeleteIcon fontSize="small" color="error" />
                </IconButton>
              )}
            </div>
          </ListItem>
        ))}
      </List>
    </div>
  );
};

export default ImageViewComponent;
