import {
  Typography,
  TextField,
  Button,
  Stack,
  IconButton,
  Divider,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  CircularProgress,
  Box,
  CardActions,
  CardContent,
  Card,
  LinearProgress,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import React, { useState, useMemo, useCallback } from "react";
import { useGetTagListQuery } from "../../../services/ticketAuth";
import ConfirmationModal from "../../../components/reusable/ConfirmationModal";
import { useCommanApiMutation } from "../../../services/threadsApi";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import PersonIcon from "@mui/icons-material/Person";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
const ManageTags = () => {
  const navigate = useNavigate();
  const [tagInput, setTagInput] = useState<string>("");
  const [editingTag, setEditingTag] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>("");
  const [isEditingLoading, setIsEditingLoading] = useState(false);
  const { data: tagList, isLoading: isTagListLoading } = useGetTagListQuery();
  const [isDeleteTag, setIsDeleteTag] = useState(false);
  const [deleteTagId, setDeleteTagId] = useState("");
  const [commanApi] = useCommanApiMutation();

  const canAdd = useMemo(() => {
    const trimmed = tagInput.trim();
    return (
      trimmed.length > 0 &&
      !tagList?.some(
        (tag: any) => tag.tagName.toLowerCase() === trimmed.toLowerCase()
      )
    );
  }, [tagInput, tagList]);

  const handleAdd = useCallback(() => {
    // const trimmed = tagInput.trim().toLowerCase();
    // if (!trimmed) return;
    // if (tags.includes(trimmed)) return;
    // setTags((prev) => [...prev, trimmed]);
    // setTagInput("");
  }, [tagInput, tagList]);

  const handleClear = useCallback(() => {
    setTagInput("");
  }, []);

  const handleDelete = useCallback(
    (value: string) => {
      console.log(value);
      if (!value) {
        return;
      }
      const payload = { url: `delete-tag/${value}` };
      commanApi(payload);
    },
    [deleteTagId]
  );

  const startEdit = useCallback((value: any) => {
    setEditingTag(value.tagID); // Fixed: Use tagID instead of tagId
    setEditValue(value.tagName);
  }, []);

  const cancelEdit = useCallback(() => {
    setEditingTag(null);
    setEditValue("");
  }, []);

  const saveEdit = useCallback(async () => {
    const trimmed = editValue.trim();
    if (!editingTag || !trimmed) return;

    // Check for duplicate names (excluding the current tag being edited)
    const isDuplicate = tagList?.some(
      (tag: any) =>
        tag.tagName.toLowerCase() === trimmed.toLowerCase() &&
        tag.tagID !== editingTag
    );

    if (isDuplicate) {
      // You might want to show a toast notification here
      console.error("Tag name already exists");
      return;
    }

    setIsEditingLoading(true);
    try {
      const payload = {
        url: `update-tag/${editingTag}`,
        body: { name: trimmed },
      };

      await commanApi(payload).unwrap();
      setEditingTag(null);
      setEditValue("");
    } catch (error) {
      console.error("Failed to update tag:", error);
      // You might want to show a toast notification here
    } finally {
      setIsEditingLoading(false);
    }
  }, [editValue, editingTag, commanApi, tagList]);

  return (
    <div className="w-full h-full grid grid-cols-[3fr_1fr] ">
      <div className=" min-h-[calc(100vh-100px)] max-h-[calc(100vh-100px)] overflow-y-auto p-0  space-y-6 border-r border-gray-200">
        <section className="space-y-4">
          <Box sx={{ display: "flex", alignItems: "center", gap: 2,        p: 2,
            borderBottom: "1px solid #e0e0e0",
            backgroundColor: "#fafafa", }}>
            <IconButton
              onClick={() => navigate("/settings/tickets-workflows")}
            >
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h5" sx={{ fontWeight: 600, color: "#1a1a1a" }}>
              Tags
            </Typography>
          </Box>
 
        </section>

                 <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={1}
            alignItems={{ xs: "stretch", sm: "flex-start" }}
            mx={1}
          >
            <TextField
              size="small"
              label="Add a tag"
              // placeholder="e.g. priority-high"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && canAdd) {
                  e.preventDefault();
                  handleAdd();
                }
              }}
              sx={{
                width: { xs: "100%", md: "45%" },
              }}
            />
            <Button
              variant="contained"
              onClick={handleAdd}
              disabled={!canAdd}
              sx={{ fontWeight: 600 }}
            >
              Add
            </Button>
            <Button
              variant="text"
              onClick={handleClear}
              disabled={!tagInput}
              sx={{ fontWeight: 600 }}
            >
              Clear
            </Button>
          </Stack>

    
          <section className="space-y-2 mx-1">
            <Typography variant="subtitle1" fontWeight={600}>
              All tags
            </Typography>
            <Paper
              variant="outlined"
              sx={{ width: "100%", overflow: "hidden", borderRadius: 1 }}
            >
              <Table size="small">
                <TableHead sx={{position: "relative"}}>
                   {isTagListLoading && (
                  <LinearProgress
                    sx={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      zIndex: 10,
                      height: 4,
                      "& .MuiLinearProgress-bar": {
                        backgroundColor: "#1976d2",
                      },
                      "& .MuiLinearProgress-root": {
                        backgroundColor: "#e0e0e0",
                      },
                    }}
                  />
                )}
                  <TableRow>
                    <TableCell>Tag</TableCell>
                    <TableCell /> <TableCell /> <TableCell />
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {tagList?.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={2}>
                        No tags yet. Add your first tag above.
                      </TableCell>
                    </TableRow>
                  ) : (
                    tagList?.map((tag: any) => {
                      const isEditing = editingTag === tag.tagID; // Fixed: Use tagID instead of tagName
                      return (
                        <TableRow key={tag.tagID} hover>
                          <TableCell>
                            {isEditing ? (
                              <TextField
                                size="small"
                                value={editValue}
                                onChange={(e) => setEditValue(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter" && !isEditingLoading) {
                                    e.preventDefault();
                                    saveEdit();
                                  }
                                  if (e.key === "Escape") {
                                    e.preventDefault();
                                    cancelEdit();
                                  }
                                }}
                                autoFocus
                                disabled={isEditingLoading}
                              />
                            ) : (
                              <Typography variant="body2">
                                {tag.tagName}
                              </Typography>
                            )}
                          </TableCell>
                          <TableCell>
                            <IconButton>
                              <ConfirmationNumberIcon />
                            </IconButton>
                          </TableCell>{" "}
                          <TableCell>
                            <IconButton>
                              <PersonIcon />
                            </IconButton>
                          </TableCell>{" "}
                          <TableCell>
                            <IconButton>
                              <InsertDriveFileIcon />
                            </IconButton>
                          </TableCell>{" "}
                          <TableCell>
                            {isEditing ? (
                              <Stack direction="row" spacing={0.5}>
                                <IconButton
                                  color="primary"
                                  aria-label="save"
                                  onClick={saveEdit}
                                  size="small"
                                  disabled={isEditingLoading}
                                >
                                  {isEditingLoading ? (
                                    <CircularProgress size={16} />
                                  ) : (
                                    <CheckIcon fontSize="small" />
                                  )}
                                </IconButton>
                                <IconButton
                                  aria-label="cancel"
                                  onClick={cancelEdit}
                                  size="small"
                                  disabled={isEditingLoading}
                                >
                                  <CloseIcon fontSize="small" />
                                </IconButton>
                              </Stack>
                            ) : (
                              <Stack direction="row" spacing={0.5}>
                                <IconButton
                                  aria-label="edit"
                                  onClick={() => startEdit(tag)}
                                  size="small"
                                >
                                  <EditIcon fontSize="small" />
                                </IconButton>
                                <IconButton
                                  aria-label="delete"
                                  onClick={() => {
                                    setDeleteTagId(tag.tagID);
                                    setIsDeleteTag(true);
                                  }}
                                  size="small"
                                  color="error"
                                >
                                  <DeleteIcon fontSize="small" />
                                </IconButton>
                              </Stack>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </Paper>
          </section>
        {/* )} */}
      </div>

      <div className="max-h-[calc(100vh-100px)] overflow-y-auto p-4 space-y-6">
        <div className="space-y-4">
          <section className="space-y-2">
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                  Ticket Tags
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 2 }}
                >
                  Tags let you categorize and organize tickets for easier
                  filtering and reporting. Add multiple tags to a ticket to
                  capture context such as product, issue type, or priority.
                </Typography>

                <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap" }}>
                  <Box
                    sx={{
                      bgcolor: "rgb(226 232 240)",
                      px: 1.5,
                      py: 0.5,
                      borderRadius: 2,
                      fontSize: 14,
                    }}
                  >
                    Billing
                  </Box>
                  <Box
                    sx={{
                      bgcolor: "rgb(226 232 240)",
                      px: 1.5,
                      py: 0.5,
                      borderRadius: 2,
                      fontSize: 14,
                    }}
                  >
                    Urgent
                  </Box>
                  <Box
                    sx={{
                      bgcolor: "rgb(226 232 240)",
                      px: 1.5,
                      py: 0.5,
                      borderRadius: 2,
                      fontSize: 14,
                    }}
                  >
                    Feature Request
                  </Box>
                </Stack>
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                  Managing Tags
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 2 }}
                >
                  Keep your workspace organized by managing your tags. Rename,
                  merge, or delete unused tags. Ensure consistency so your team
                  applies the correct tags to tickets.
                </Typography>
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                  Auto-tagging Rules
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 2 }}
                >
                  Set up rules to automatically add tags when a ticket matches
                  certain conditions (e.g., subject contains "payment" → add
                  "Billing").
                </Typography>

                <Stack spacing={1}>
                  <Typography variant="body2">
                    Rule: Subject contains “refund” → Tag: <b>Billing</b>
                  </Typography>
                  <Typography variant="body2">
                    Rule: Priority is High → Tag: <b>Urgent</b>
                  </Typography>
                </Stack>
              </CardContent>
            </Card>
          </section>
        </div>
      </div>
      <ConfirmationModal
        open={isDeleteTag}
        onClose={() => setIsDeleteTag(false)}
        onConfirm={() => handleDelete(deleteTagId)}
      />
    </div>
  );
};

export default ManageTags;
