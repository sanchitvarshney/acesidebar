import React, { useMemo, useRef, useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Divider,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Paper,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Toolbar,
  Tooltip,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import CustomSideBarPanel from "../../../components/reusable/CustomSideBarPanel";
import StackEditor from "../../../components/reusable/Editor";
import {
  TextField,
  FormControlLabel,
  RadioGroup,
  Radio,
  InputLabel,
  FormControl,
} from "@mui/material";
import CustomToolTip from "../../../reusable/CustomToolTip";
import ImageViewComponent from "../../components/ImageViewComponent";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import CloseIcon from "@mui/icons-material/Close";
import empty from "../../../assets/image/overview-empty-state.svg";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
type Folder = {
  id: string;
  name: string;
};

type CannedResponse = {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  folderId: string;
};

const formatDate = (iso: string) => {
  const date = new Date(iso);
  const time = date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
  const day = date.toLocaleDateString([], {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  return `${day} ${time}`;
};

const CanenResponseMasterPage = () => {
  const navigate = useNavigate();
  const [folders] = useState<Folder[]>([
    { id: "personal", name: "Personal" },
    { id: "general", name: "General" },
  ]);

  const [responses] = useState<CannedResponse[]>([
    {
      id: "1",
      title: "Account cancellation",
      createdAt: "2025-07-10T09:22:00Z",
      updatedAt: "2025-07-10T09:22:00Z",
      folderId: "general",
    },
    {
      id: "2",
      title: "Response for demo request",
      createdAt: "2025-07-10T09:22:00Z",
      updatedAt: "2025-07-10T09:22:00Z",
      folderId: "general",
    },
    {
      id: "3",
      title: "Trial extension",
      createdAt: "2025-07-10T09:22:00Z",
      updatedAt: "2025-07-10T09:22:00Z",
      folderId: "general",
    },
    {
      id: "4",
      title: "Upgrade or downgrade a plan",
      createdAt: "2025-07-10T09:22:00Z",
      updatedAt: "2025-07-10T09:22:00Z",
      folderId: "general",
    },
  ]);

  const [activeFolderId, setActiveFolderId] = useState<string>("general");
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const [sortBy, setSortBy] = useState<"title" | "created" | "updated">(
    "title"
  );
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState<"create" | "edit">("create");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formTitle, setFormTitle] = useState("");
  const [formFolderId, setFormFolderId] = useState<string>("general");
  const [formAvailability, setFormAvailability] = useState<"myself" | "all">(
    "all"
  );
  const [formMessage, setFormMessage] = useState("");
  const [images, setImages] = useState<any[]>([]);
  const [showImagesModal, setShowImagesModal] = useState(false);
  const [newFolderOpen, setNewFolderOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const visibleResponses = useMemo(() => {
    const list = responses.filter((r) => r.folderId === activeFolderId);
    if (sortBy === "title") {
      return [...list].sort((a, b) => a.title.localeCompare(b.title));
    }
    if (sortBy === "created") {
      return [...list].sort(
        (a, b) => +new Date(a.createdAt) - +new Date(b.createdAt)
      );
    }
    return [...list].sort(
      (a, b) => +new Date(a.updatedAt) - +new Date(b.updatedAt)
    );
  }, [responses, activeFolderId, sortBy]);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const allSelected = useMemo(() => {
    if (visibleResponses.length === 0) return false;
    return visibleResponses.every((r) => selected[r.id]);
  }, [visibleResponses, selected]);

  const selectedCount = useMemo(() => {
    return visibleResponses.filter((r) => selected[r.id]).length;
  }, [visibleResponses, selected]);
  const handleRemoveImage = (id: string | number) => {
    const updatedImages = images.filter((image) => image.fileId !== id);
    setImages(updatedImages);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;
    const file = files[0];
    const formData = new FormData();
    formData.append("image", file, file.name);
    setImages((prevImages) => [...prevImages, file]);
  };
  const toggleAll = () => {
    if (allSelected) {
      const next = { ...selected };
      visibleResponses.forEach((r) => delete next[r.id]);
      setSelected(next);
    } else {
      const next = { ...selected };
      visibleResponses.forEach((r) => (next[r.id] = true));
      setSelected(next);
    }
  };

  const countsByFolder: Record<string, number> = useMemo(() => {
    const map: Record<string, number> = {};
    folders.forEach((f) => (map[f.id] = 0));
    responses.forEach((r) => (map[r.folderId] = (map[r.folderId] || 0) + 1));
    return map;
  }, [folders, responses]);
  const handleIconClick = () => {
    if (images.length > 3) {
      alert("You can upload a maximum of 4 images");
      return;
    }
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <Box
      sx={{ width: "100%", height: "calc(100vh - 96px)", overflow: "hidden" }}
    >
      {/* Toolbar */}
      <Toolbar
        sx={{
     

          py: 2,
          justifyContent: "space-between",
        }}
      >
        {" "}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <IconButton onClick={() => navigate("/settings/agent-productivity")}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h5" sx={{ fontWeight: 600, color: "#1a1a1a" }}>
            Canned Responses
          </Typography>
        </Box>
        <Stack direction="row" spacing={2} alignItems="center">
          {selectedCount > 0 ? (
            <>
              <Typography variant="body2" color="text.secondary">
                {selectedCount} selected
              </Typography>
              <Button size="small">Move to</Button>
              <Button size="small" color="error">
                Delete
              </Button>
            </>
          ) : (
            <Typography variant="body2" color="text.secondary">
              &nbsp;
            </Typography>
          )}
        </Stack>
        <Stack direction="row" spacing={2} alignItems="center">
          <Typography variant="body2" color="text.secondary">
            Sort by:
          </Typography>
          <Select
            size="small"
            variant="standard"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
          >
            <MenuItem value="title">Title</MenuItem>
            <MenuItem value="created">Created</MenuItem>
            <MenuItem value="updated">Updated</MenuItem>
          </Select>
          <Button
            variant="outlined"
            size="small"
            onClick={() => setNewFolderOpen(true)}
          >
            New Folder
          </Button>
          <Button
            variant="contained"
            size="small"
            onClick={() => {
              setDrawerMode("create");
              setEditingId(null);
              setFormTitle("");
              setFormFolderId(activeFolderId);
              setFormAvailability("all");
              setFormMessage("");
              setDrawerOpen(true);
            }}
          >
            New Canned Response
          </Button>
        </Stack>
      </Toolbar>

      <Stack
        direction="row"
        sx={{ minHeight: "calc(100vh - 170px)", bgcolor: "background.paper" }}
      >
        {/* Left: Folders */}
        <Paper variant="outlined" square sx={{ width: 340 }}>
          <Box sx={{ px: 3, py: 2.5 }}>
            <Typography
              variant="subtitle2"
              fontWeight={600}
              color="text.primary"
            >
              FOLDERS
            </Typography>
          </Box>
          <Divider />
          <Box
            sx={{
              height: "calc(100% - 48px)",
              overflowY: "auto",
              px: 1,
              pb: 2,
            }}
          >
            <List disablePadding>
              {folders.map((folder) => {
                const isActive = activeFolderId === folder.id;
                const count = countsByFolder[folder.id] || 0;
                return (
                  <ListItemButton
                    key={folder.id}
                    selected={isActive}
                    onClick={() => setActiveFolderId(folder.id)}
                    sx={{ borderRadius: 1, mx: 1, my: 0.5 }}
                  >
                    <ListItemIcon sx={{ minWidth: 32 }}>📁</ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography variant="body1" fontWeight={500}>
                          {folder.name}
                        </Typography>
                      }
                      secondary={
                        <Typography variant="caption" color="text.secondary">
                          {count} canned responses
                        </Typography>
                      }
                    />
                  </ListItemButton>
                );
              })}
            </List>
          </Box>
        </Paper>

        {/* Right: List */}
        <Box sx={{ flex: 1 }}>
          {/* Empty state for folders without items */}
          {visibleResponses.length === 0 ? (
            <Stack
              alignItems="center"
              justifyContent="center"
              spacing={1.5}
              sx={{ height: 520, px: 3 }}
            >
              <img src={empty} alt="No responses" />
              <Typography variant="subtitle1" fontWeight={600}>
                You haven’t created any canned responses.
              </Typography>
              <Typography variant="body2" color="text.secondary" align="center">
                Pre-create replies to quickly insert them in responses to
                customers
              </Typography>
              <Button
                variant="contained"
                size="small"
                onClick={() => setDrawerOpen(true)}
              >
                New Canned Response
              </Button>
            </Stack>
          ) : (
            <Box sx={{ px: 2, py: 0 }}>
              <TableContainer component={Paper} variant="outlined">
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell padding="checkbox">
                        <Checkbox checked={allSelected} onChange={toggleAll} />
                      </TableCell>
                      <TableCell>Title</TableCell>
                      <TableCell>Created</TableCell>
                      <TableCell>Updated</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {visibleResponses.map((item) => {
                      const checked = !!selected[item.id];
                      return (
                        <TableRow key={item.id} hover>
                          <TableCell padding="checkbox">
                            <Checkbox
                              checked={checked}
                              onChange={() =>
                                setSelected((prev) => ({
                                  ...prev,
                                  [item.id]: !prev[item.id],
                                }))
                              }
                            />
                          </TableCell>
                          <TableCell
                            onClick={() => {
                              setDrawerMode("edit");
                              setEditingId(item.id);
                              setFormTitle(item.title);
                              setFormFolderId(item.folderId);
                              setFormAvailability("all");
                              setFormMessage("");
                              setDrawerOpen(true);
                            }}
                            sx={{ cursor: "pointer" }}
                          >
                            <Typography variant="body2" fontWeight={500}>
                              {item.title}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" color="text.secondary">
                              {`${formatDate(item.createdAt)}`}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" color="text.secondary">
                              {`${formatDate(item.updatedAt)}`}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}
        </Box>
      </Stack>
      <CustomSideBarPanel
        open={drawerOpen}
        close={() => setDrawerOpen(false)}
        title={
          drawerMode === "create"
            ? "New Canned Response"
            : "Edit Canned Response"
        }
        width={720}
      >
        <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
          <Box sx={{ p: 3, flex: 1, overflowY: "auto" }}>
            <Box sx={{ pb: 2 }}>
              <TextField
                fullWidth
                size="small"
                label="Response title"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
              />
              <Stack spacing={1} sx={{ mt: 2 }}>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  Message
                </Typography>
                <Box
                  sx={{
                    bgcolor: "background.paper",
                  }}
                >
                  <StackEditor
                    initialContent={formMessage}
                    onChange={setFormMessage}
                    isFull={false}
                    onFocus={() => {}}
                    customHeight="300px"
                  />
                </Box>

                <div className="flex items-center  gap-2">
                  <div className="flex items-center gap-1">
                    <input
                      type="file"
                      accept="image/*"
                      ref={fileInputRef}
                      style={{ display: "none" }}
                      onChange={handleFileChange}
                    />
                    {/* {attachedLoading ? (
                      <CircularProgress size={16} />
                    ) : ( */}
                    <Tooltip
                      title={"Attach file < 10MB"}
                      placement={"top-start"}
                    >
                      <IconButton size="small" onClick={handleIconClick}>
                        <AttachFileIcon
                          fontSize="small"
                          sx={{ transform: "rotate(45deg)" }}
                        />
                      </IconButton>
                    </Tooltip>
                  </div>

                  {images?.length > 0 && (
                    <CustomToolTip
                      title={
                        <ImageViewComponent
                          images={images}
                          handleRemove={(id: any) => handleRemoveImage(id)}
                          // ticketId={header?.ticketId}
                        />
                      }
                      open={showImagesModal}
                      close={() => setShowImagesModal(false)}
                      placement={"top"}
                      width={400}
                    >
                      <span
                        className="bg-[#1a73e8] w-6 text-sm rounded-full h-6 flex items-center justify-center text-white cursor-pointer"
                        onClick={() => setShowImagesModal(true)}
                      >
                        {images.length}
                      </span>
                    </CustomToolTip>
                  )}
                </div>
              </Stack>
              <FormControl fullWidth size="small" sx={{ mt: 2 }}>
                <InputLabel>Folder</InputLabel>
                <Select
                  label="Folder"
                  size="small"
                  value={formFolderId}
                  onChange={(e) => setFormFolderId(e.target.value as string)}
                >
                  {folders.map((f) => (
                    <MenuItem key={f.id} value={f.id}>
                      {f.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Stack sx={{ mt: 2 }}>
                <Typography variant="body2" sx={{ mb: 0.5 }}>
                  Available for
                </Typography>
                <RadioGroup
                  row
                  value={formAvailability}
                  onChange={(e) => setFormAvailability(e.target.value as any)}
                >
                  <FormControlLabel
                    value="myself"
                    control={<Radio size="small" />}
                    label="Myself"
                  />
                  <FormControlLabel
                    value="all"
                    control={<Radio size="small" />}
                    label="All agents"
                  />
                </RadioGroup>
              </Stack>
            </Box>
          </Box>
          <Box
            sx={{
              p: 2,
              borderTop: "1px solid #eee",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 1,
              backgroundColor: "#fafafa",
            }}
          >
            <Box sx={{ display: "flex", gap: 1 }}>
              <Button
                onClick={() => setDrawerOpen(false)}
                variant="text"
                sx={{ minWidth: 80, fontWeight: 600 }}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                sx={{ minWidth: 120, fontWeight: 600 }}
              >
                {drawerMode === "create" ? "Create" : "Save"}
              </Button>
            </Box>
          </Box>
        </Box>
      </CustomSideBarPanel>

      {/* New Folder Dialog */}
      <Dialog open={newFolderOpen} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ display: "flex", alignItems: "center" }}>
          <Typography variant="h6" sx={{ flex: 1, fontWeight: 700 }}>
            New Folder
          </Typography>
          <IconButton onClick={() => setNewFolderOpen(false)} size="small">
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 1, fontWeight: 600 }}>
            Folder name <span style={{ color: "#d32f2f" }}>*</span>
          </Typography>
          <TextField
            fullWidth
            placeholder="Enter Folder name"
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
            size="small"
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2, bgcolor: "#f3f4f6" }}>
          <Button onClick={() => setNewFolderOpen(false)} variant="text">
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              if (!newFolderName.trim()) return;
              setNewFolderOpen(false);
              setNewFolderName("");
            }}
            disabled={!newFolderName.trim()}
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CanenResponseMasterPage;
