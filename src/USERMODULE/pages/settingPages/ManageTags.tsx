import { Typography, TextField, Button, Stack, IconButton, Divider, Table, TableHead, TableRow, TableCell, TableBody, Paper } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import React, { useState, useMemo, useCallback } from "react";

const ManageTags = () => {
  const [tagInput, setTagInput] = useState<string>("");
  const [tags, setTags] = useState<string[]>(["urgent", "bug", "feature", "customer" ]);
  const [editingTag, setEditingTag] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>("");

  const canAdd = useMemo(() => {
    const trimmed = tagInput.trim();
    return trimmed.length > 0 && !tags.includes(trimmed.toLowerCase());
  }, [tagInput, tags]);

  const handleAdd = useCallback(() => {
    const trimmed = tagInput.trim().toLowerCase();
    if (!trimmed) return;
    if (tags.includes(trimmed)) return;
    setTags(prev => [...prev, trimmed]);
    setTagInput("");
  }, [tagInput, tags]);

  const handleClear = useCallback(() => {
    setTagInput("");
  }, []);

  const handleDelete = useCallback((value: string) => {
    setTags(prev => prev.filter(t => t !== value));
  }, []);

  const startEdit = useCallback((value: string) => {
    setEditingTag(value);
    setEditValue(value);
  }, []);

  const cancelEdit = useCallback(() => {
    setEditingTag(null);
    setEditValue("");
  }, []);

  const saveEdit = useCallback(() => {
    const trimmed = editValue.trim().toLowerCase();
    if (!editingTag) return;
    if (!trimmed) return;
    setTags(prev => {
      const withoutOld = prev.filter(t => t !== editingTag);
      if (!withoutOld.includes(trimmed)) {
        return [...withoutOld, trimmed];
      }
      return withoutOld;
    });
    setEditingTag(null);
    setEditValue("");
  }, [editValue, editingTag]);

  return (
    <div className="w-full h-full grid grid-cols-[3fr_1fr] ">
      <div className=" min-h-[calc(100vh-100px)] max-h-[calc(100vh-100px)] overflow-y-auto p-4  space-y-6 border-r border-gray-200">
        <section className="space-y-4">
          <Typography variant="h6" fontWeight={600}>Tags</Typography>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={1} alignItems={{ xs: "stretch", sm: "flex-start" }}>
            <TextField
              size="small"
              label="Add a tag"
              placeholder="e.g. priority-high"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && canAdd) {
                  e.preventDefault();
                  handleAdd();
                }
              }}
            />
            <Button variant="contained" onClick={handleAdd} disabled={!canAdd}>Add</Button>
            <Button variant="outlined" color="inherit" onClick={handleClear} disabled={!tagInput}>Clear</Button>
          </Stack>
        </section>

        <Divider />

        <section className="space-y-2">
          <Typography variant="subtitle1" fontWeight={600}>All tags</Typography>
          <Paper variant="outlined" sx={{ width: "100%", overflow: "hidden", borderRadius: 1 }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Tag</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tags.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={2}>No tags yet. Add your first tag above.</TableCell>
                  </TableRow>
                ) : (
                  tags.map((tag) => {
                    const isEditing = editingTag === tag;
                    return (
                      <TableRow key={tag} hover>
                        <TableCell>
                          {isEditing ? (
                            <TextField
                              size="small"
                              value={editValue}
                              onChange={(e) => setEditValue(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  e.preventDefault();
                                  saveEdit();
                                }
                                if (e.key === "Escape") {
                                  e.preventDefault();
                                  cancelEdit();
                                }
                              }}
                              autoFocus
                            />
                          ) : (
                            <Typography variant="body2">{tag}</Typography>
                          )}
                        </TableCell>
                        <TableCell align="right">
                          {isEditing ? (
                            <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                              <IconButton color="primary" aria-label="save" onClick={saveEdit} size="small">
                                <CheckIcon fontSize="small" />
                              </IconButton>
                              <IconButton aria-label="cancel" onClick={cancelEdit} size="small">
                                <CloseIcon fontSize="small" />
                              </IconButton>
                            </Stack>
                          ) : (
                            <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                              <IconButton aria-label="edit" onClick={() => startEdit(tag)} size="small">
                                <EditIcon fontSize="small" />
                              </IconButton>
                              <IconButton aria-label="delete" onClick={() => handleDelete(tag)} size="small" color="error">
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
    </div>
  );
};

export default ManageTags;
