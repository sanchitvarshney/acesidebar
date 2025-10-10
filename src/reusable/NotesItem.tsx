import React, { FC, useState } from "react";
import {
  Box,
  Typography,
  IconButton,
  Paper,
  CircularProgress,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddNotes from "./AddNotes";

interface NoteItemProps {
  data: any;
  handleDelete: any;
  handleEdit: any;
  isEdit: any;
  loadingDelete: any;
  handleSave: any;
  inputText: any;
  editNoteId: any;
  onEdit: any;
  currentNote: string;
  isEditLoading: any;
  addingLoading: any;
}

const NoteItem: FC<NoteItemProps> = ({
  data,
  handleDelete,
  handleEdit,
  isEdit,
  loadingDelete,
  handleSave,
  inputText,
  editNoteId,
  onEdit,
  currentNote,
  addingLoading,
  isEditLoading,
}) => {
  const [trackId, setTrackId] = useState<any>("");
  const [isDeletingThisItem, setIsDeletingThisItem] = useState(false);
  return (
    <Paper
      elevation={1}
      sx={{
        mt: 1,
        mb: 2,
        p: 1,
        overflow: "auto",
        boxShadow: "0px 2px 5px 1px rgba(0, 0, 0, 0.1)",
        "&:hover": {
          cursor: "pointer",
          backgroundColor: "#f8f8f8ff",
        },
      }}
    >
      {/* Content Section */}
      <Typography variant="body2" sx={{ mb: 0.5 }}>
        {data?.name}
      </Typography>

      <div className="flex flex-col">
        <Typography variant="subtitle2" sx={{ color: "#000", fontSize: 10 }}>
          {data?.createBy}
        </Typography>
        <Typography
          variant="subtitle1"
          color="text.secondary"
          sx={{ fontSize: 11 }}
        >
          {data?.creatDt?.timeStamp}
          <br />({data?.creatDt?.ago})
        </Typography>
      </div>

      {isEdit && editNoteId === data.key && (
        <AddNotes
          inputText={inputText}
          note={currentNote}
          onCancel={onEdit}
          handleSave={handleSave}
          addingLoading={addingLoading}
          isEditLoading={isEditLoading}
        />
      )}

      {/* Action Buttons */}
      {!isEdit && !isDeletingThisItem && (
        <Box display="flex" justifyContent="flex-end" gap={1}>
          <IconButton
            size="small"
            color="primary"
            onClick={handleEdit}
            disabled={isEditLoading || addingLoading || loadingDelete}
          >
            <EditIcon sx={{ fontSize: "16px" }} />
          </IconButton>
          <IconButton
            size="small"
            color="error"
            onClick={async () => {
              setIsDeletingThisItem(true);
              setTrackId(data.key);
              await handleDelete();
              setIsDeletingThisItem(false);
            }}
            disabled={loadingDelete || isDeletingThisItem}
          >
            {loadingDelete && trackId === data.key ? (
              <CircularProgress size={16} />
            ) : (
              <DeleteIcon sx={{ fontSize: "16px" }} />
            )}
          </IconButton>
        </Box>
      )}

      {/* Show loading state when deleting */}
      {isDeletingThisItem && (
        <Box display="flex" justifyContent="flex-end" gap={1} sx={{ mt: 1 }}>
          <CircularProgress size={16} />
        </Box>
      )}
    </Paper>
  );
};

export default NoteItem;
