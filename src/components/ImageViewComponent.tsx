import React from "react";
import {
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  IconButton,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

interface ImageViewComponentProps {
  images: any; // Array of uploaded image files
  onRemove?: (index: number) => void;
}

const formatFileSize = (size: number) => {
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
};

const ImageViewComponent: React.FC<ImageViewComponentProps> = ({
  images,
  onRemove,
}) => {
  return (
    <div style={{ }}>
      <Typography variant="subtitle1" sx={{ mb: 0.5 }}>
        Attached Files
      </Typography>
      <List sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}>
        {images?.map((file: any, index: number) => (
          <ListItem
            key={index}
            secondaryAction={
              onRemove && (
                <IconButton edge="end" onClick={() => onRemove(index)}>
                  <DeleteIcon />
                </IconButton>
              )
            }
            sx={{
              cursor: "pointer",
              "&:hover": {
                backgroundColor: "#f5f5f5",
              },
            }}
          >
            <ListItemText
              primary={file.name}
              secondary={`${file.type || "Unknown"} • ${formatFileSize(
                file.size
              )}`}
            />
          </ListItem>
        ))}
      </List>
    </div>
  );
};

export default ImageViewComponent;
