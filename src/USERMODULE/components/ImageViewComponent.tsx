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
  onRemove?: any;
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
    <div style={{padding:"6px"}}>
      <Typography variant="subtitle1" sx={{ mb: 0.5 }}>
        Attached Files
      </Typography>
      <List sx={{ width: "100%", bgcolor: "background.paper" }}>
        {images?.map((file: any, index: number) => (
          <ListItem
            key={index}
            // secondaryAction={
            //   onRemove && (
            //     <IconButton edge="end" onClick={() => onRemove(index)}>
            //       <DeleteIcon  />
            //     </IconButton>
            //   )
            // }
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
              secondary={`${file.type || "Unknown"} • ${formatFileSize(
                file.size
              )}`}
            />
            <IconButton size="small" sx={{ ml: 2 }} onClick={() => onRemove(index)}>
              <DeleteIcon fontSize="small" color="error" />
            </IconButton>
          </ListItem>
        ))}
      </List>
    </div>
  );
};

export default ImageViewComponent;
