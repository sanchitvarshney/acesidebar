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
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useDeleteAttachedFileMutation } from "../../services/uploadDocServices";
import { useToast } from "../../hooks/useToast";

interface ImageViewComponentProps {
  images: any; // Array of uploaded image files
  ticketId?: any;
  handleRemove:any
}

const ImageViewComponent: React.FC<ImageViewComponentProps> = ({
  images,
  ticketId,
  handleRemove
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

    deleteAttachedFile(payload).then((res)=> {
      if (res?.data?.success !== true) {
        showToast(res?.data?.message || "An error occurred while deleting", "error");
        return;
      }
handleRemove(fileId)

    })
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
                  {file.name}
                </span>
              }
              secondary={`${file.type || "Unknown"} • ${file.size}`}
            />
         {
          deleteLoading ? (
            <CircularProgress size={16}/>
          ):(
               <IconButton
              size="small"
              sx={{ ml: 2 }}
              onClick={() => onRemove(file.fileId)}
            >
              <DeleteIcon fontSize="small" color="error" />
            </IconButton>
          )
         }
          </ListItem>
        ))}
      </List>
    </div>
  );
};

export default ImageViewComponent;
