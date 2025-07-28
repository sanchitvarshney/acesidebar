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
      elevation={1}
      sx={{
        p: 2,
        borderRadius: 2,
        mb: 2,
      }}
    >
      {/* Header Section */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={1}
      >
        <Typography variant="caption" sx={{ color: "#000" }}>
          {data?.createdBy}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {data?.createdAt}
        </Typography>
      </Box>

      {/* Content Section */}
      <Typography variant="body2" sx={{ mb: 1 }}>
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
          <EditIcon fontSize="small" />
        </IconButton>
        <IconButton size="small" color="error" onClick={handleDelete}>
          <DeleteIcon fontSize="small" />
        </IconButton>
      </Box>
    </Paper>
  );
};

export default NoteItem;
