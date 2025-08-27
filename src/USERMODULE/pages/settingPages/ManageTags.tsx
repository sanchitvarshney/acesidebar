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
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import React, { useState, useMemo, useCallback } from "react";
import { useGetTagListQuery } from "../../../services/ticketAuth";
import ConfirmationModal from "../../../components/reusable/ConfirmationModal";
import { useCommanApiMutation } from "../../../services/threadsApi";

const ManageTags = () => {
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
    return trimmed.length > 0 && !tagList?.some((tag: any) => tag.tagName.toLowerCase() === trimmed.toLowerCase());
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
    const isDuplicate = tagList?.some((tag: any) => 
      tag.tagName.toLowerCase() === trimmed.toLowerCase() && 
      tag.tagID !== editingTag
    );

    if (isDuplicate) {
      // You might want to show a toast notification here
      console.error('Tag name already exists');
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
      console.error('Failed to update tag:', error);
      // You might want to show a toast notification here
    } finally {
      setIsEditingLoading(false);
    }
  }, [editValue, editingTag, commanApi, tagList]);

  return (
    <div className="w-full h-full grid grid-cols-[3fr_1fr] ">
      <div className=" min-h-[calc(100vh-100px)] max-h-[calc(100vh-100px)] overflow-y-auto p-4  space-y-6 border-r border-gray-200">
        <section className="space-y-4">
          <Typography variant="h6" fontWeight={600}>
            Tags
          </Typography>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={1}
            alignItems={{ xs: "stretch", sm: "flex-start" }}
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
            />
            <Button variant="contained" onClick={handleAdd} disabled={!canAdd}>
              Add
            </Button>
            <Button
              variant="outlined"
              color="inherit"
              onClick={handleClear}
              disabled={!tagInput}
            >
              Clear
            </Button>
          </Stack>
        </section>

        <Divider />

        {isTagListLoading ? (
          <div className="flex items-center justify-center  text-gray-500">
            <CircularProgress color="primary" />
          </div>
        ) : (
          <section className="space-y-2">
            <Typography variant="subtitle1" fontWeight={600}>
              All tags
            </Typography>
            <Paper
              variant="outlined"
              sx={{ width: "100%", overflow: "hidden", borderRadius: 1 }}
            >
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Tag</TableCell>
                    <TableCell align="right">Actions</TableCell>
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
                          <TableCell align="right">
                            {isEditing ? (
                              <Stack
                                direction="row"
                                spacing={0.5}
                                justifyContent="flex-end"
                              >
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
                              <Stack
                                direction="row"
                                spacing={0.5}
                                justifyContent="flex-end"
                              >
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
        )}
      </div>

      <div className="max-h-[calc(100vh-100px)] overflow-y-auto p-4 space-y-6">
        <div className="space-y-4">
          <section>
            <Typography variant="subtitle1" fontWeight={600}>
              Managing Tags
            </Typography>
            <Typography variant="body2">
              This page shows you a list of all tags that are currently being
              used in your helpdesk. By default, you can get the usage count for
              every tag, including the number of linked tickets, customers or
              solution articles at a glance by looking them up from the list. If
              you want to, you can also open up a complete list of tagged items
              by clicking on the corresponding numbers. When you want to rename
              them altogether, click on the tag names to update all of their
              instances automatically. Additionally, you can choose to merge two
              or more tags together by giving them the same name.
            </Typography>
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
