import React from "react";
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

interface ImageViewComponentProps {
  images: any; // Array of uploaded image files
  ticketId?: any;
  handleRemove: any;
  isToggle?: boolean;
  handleSelectValue?: any;
  isPrivate?: boolean;
}

const ImageViewComponent: React.FC<ImageViewComponentProps> = ({
  images,
  ticketId,
  handleRemove,
  isToggle = false,
  handleSelectValue,
  isPrivate,
}) => {
  const { showToast } = useToast();
  const [deleteAttachedFile, { isLoading: deleteLoading }] =
    useDeleteAttachedFileMutation();

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
                <FormGroup>
                  <FormControlLabel
                    control={
                      <Tooltip
                        title={`Currently: ${isPrivate ? "Private" : "Public"}`}
                      >
                        <Switch size="small" />
                      </Tooltip>
                    }
                    label={
                      <Tooltip title="File type (Public or Private)">
                        <HelpIcon fontSize="small" />
                      </Tooltip>
                    }
                    onChange={(e: any) => handleSelectValue(e.target.checked)}
                  />
                </FormGroup>
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
