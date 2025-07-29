import React, { FC } from "react";
import { Box, Typography, IconButton, Paper } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddNotes from "./AddNotes";

interface NoteItemProps {
  data: any;
  handleDelete: any;
  handleEdit: any;
  isEdit: any;
  note: any;
  handleSave: any;
  inputText: any;
  editNoteId: any;
  onEdit: any;
}

const NoteItem: FC<NoteItemProps> = ({
  data,
  handleDelete,
  handleEdit,
  isEdit,
  note,
  handleSave,
  inputText,
  editNoteId,
  onEdit,
}) => {
  return (
    <Paper
      elevation={0}
         sx={{
          mb:2,
          p:1,
          "&:hover": {
            cursor: "pointer",
            backgroundColor: "#ccc",
          },
        }}
    >
      {/* Header Section */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={0.5}
    
      >
        <Typography variant="caption" sx={{ color: "#000" }}>
          {data?.createdBy}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {data?.createdAt}
        </Typography>
      </Box>

      {/* Content Section */}
      <Typography variant="body2" sx={{ mb: 0.5 }}>
        {data?.note}
      </Typography>
      {isEdit && editNoteId === data.id && (
        <AddNotes
          inputText={inputText}
          note={note}
          onCancel={onEdit}
          handleSave={handleSave}
        />
      )}

      {/* Action Buttons */}
      <Box display="flex" justifyContent="flex-end" gap={1}>
        <IconButton size="small" color="primary" onClick={handleEdit}>
          <EditIcon sx={{ fontSize: "16px" }} />
        </IconButton>
        <IconButton size="small" color="error" onClick={handleDelete}>
          <DeleteIcon sx={{ fontSize: "16px" }} />
        </IconButton>
      </Box>
    </Paper>
  );
};

export default NoteItem;
