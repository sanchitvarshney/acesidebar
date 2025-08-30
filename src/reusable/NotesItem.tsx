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
        mt: 1,
        mb: 2,
        p: 1,
        boxShadow: "0px 2px 5px 1px rgba(0, 0, 0, 0.1)",
        "&:hover": {
          cursor: "pointer",
          backgroundColor: "#f8f8f8ff",
          
        },
      }}
    >
      {/* Header Section */}
      <Box display="flex" alignItems="center" mb={0.5}>
        {/* Content Section */}
        <Typography variant="body2" sx={{ mb: 0.5 }}>
          {data?.name}
        </Typography>
      </Box>
      <div className="flex flex-col">
        <Typography variant="subtitle2" sx={{ color: "#000", fontSize: 10 }}>
          {data?.createBy}
        </Typography>
        <Typography
          variant="subtitle1"
          color="text.secondary"
          sx={{ fontSize: 11 }}
        >
          {data?.creatDt.timeStamp}
          <br />({data?.creatDt.ago})
        </Typography>
      </div>

      {isEdit && editNoteId === data.key && (
        <AddNotes
          inputText={inputText}
          note={data?.name}
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
