import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  Modal,
} from "@mui/material";

import {
  useAddTagMutation,
} from "../../services/ticketAuth";
import { useToast } from "../../hooks/useToast";

interface TicketSidebarProps {
  open:boolean
  onClose:any
}
const TicketSidebar: React.FC<TicketSidebarProps> = ({
open,
onClose
}) => {
  const { showToast } = useToast();
  const [tagName, setTagName] = useState("");
  const [isTagModalOpen, setIsTagModalOpen] = useState(false);

  const [tagDescription, setTagDescription] = useState("");
  const [addTag, { isLoading: isAddingTag }] = useAddTagMutation();

  return (
    <Modal open={isTagModalOpen} onClose={() => setIsTagModalOpen(false)}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
          minWidth: 350,
          maxWidth: 500,
          width: "90%",
        }}
      >
        <Typography variant="h6" sx={{ mb: 2 }}>
          Add Tag
        </Typography>
        <TextField
          label="Tag Name"
          fullWidth
          value={tagName}
          onChange={(e) => setTagName(e.target.value)}
          sx={{ mb: 2 }}
        />
        <TextField
          label="Description"
          fullWidth
          value={tagDescription}
          onChange={(e) => setTagDescription(e.target.value)}
          sx={{ mb: 2 }}
        />
        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
          <Button onClick={() => setIsTagModalOpen(false)} color="secondary">
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={async () => {
              if (!tagName) return;
              try {
                const res = await addTag({
                  name: tagName,
                  description: tagDescription,
                }).unwrap();
                if (res?.success) {
                  setTagName("");
                  setTagDescription("");
                  setIsTagModalOpen(false)
                  showToast(res?.message || "Tag Created Succesfully");
                }
              } catch (error: any) {
                showToast(error?.data?.message || "Failed to add tag", "error");
              }
            }}
            disabled={!tagName || isAddingTag}
          >
            {isAddingTag ? "Adding..." : "Add"}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default TicketSidebar;
