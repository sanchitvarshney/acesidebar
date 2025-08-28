import React, { useState, useRef, useEffect } from "react";
import {
  IconButton,
  TextField,
  Button,
  Typography,
  Box as MuiBox,
  Avatar,
  Chip,
  Divider,
  Alert,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  ListItemSecondaryAction,
  Tabs,
  Tab,
  Paper,
  Tooltip,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import {
  AttachFile,
  CloudUpload,
  Download,
  Delete,
  Visibility,
  MoreVert,
  Folder,
  Image,
  Description,
  PictureAsPdf,
  VideoFile,
  AudioFile,
  Archive,
  Code,
  Search,
  CreateNewFolder,
} from "@mui/icons-material";
import { useToast } from "../../../hooks/useToast";
import {
  useCommanApiMutation,
  useGetAttacedFileQuery,
} from "../../../services/threadsApi";

interface AttachmentsProps {
  open: boolean;
  onClose: () => void;
  ticketId: string | number;
}


const Attachments: React.FC<AttachmentsProps> = ({
  open,
  onClose,
  ticketId,
}) => {
  const [commanApi] = useCommanApiMutation();

  const { data } = useGetAttacedFileQuery({ ticketId });

  const { showToast } = useToast();

  const [attachments, setAttachments] = useState<any[]>([]);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("uploadedAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [selectedAttachments, setSelectedAttachments] = useState<string[]>([]);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [folderDialogOpen, setFolderDialogOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [newFolderDescription, setNewFolderDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (open && inputRef.current) {
      //@ts-ignore
      setTimeout(() => inputRef.current.focus(), 100);
    }
  }, [open]);

  // Filter and sort attachments
  // Assuming you have a proper Attachment type:
  type Attachment = {
    fileName: string;
    uploadedAt: string;
    // Add other fields you expect to sort by
  };

  const filteredAttachments = data?.data
    ?.filter((attachment: Attachment) => {
      const matchesSearch = attachment.fileName
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

      return matchesSearch; // && matchesCategory;
    })
    .sort((a: any, b: any) => {
      let aValue = a[sortBy as keyof Attachment];
      let bValue = b[sortBy as keyof Attachment];

      // Handle uploadedAt as a date
      if (sortBy === "uploadedAt") {
        aValue = new Date(aValue as string).getTime();
        bValue = new Date(bValue as string).getTime();
      }

      // Ensure undefined values don't break sorting
      if (aValue === undefined) return 1;
      if (bValue === undefined) return -1;

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
      } else {
        return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
      }
    });

  // Get unique categories
  const categories = ["All Categories"];

  const getFileIcon = (type: string) => {
    if (type.startsWith("image/")) return <Image />;
    if (type.startsWith("video/")) return <VideoFile />;
    if (type.startsWith("audio/")) return <AudioFile />;
    if (type === "application/pdf") return <PictureAsPdf />;
    if (type.includes("zip") || type.includes("rar")) return <Archive />;
    if (type.includes("code") || type.includes("json") || type.includes("xml"))
      return <Code />;
    return <Description />;
  };

  const handleFileUpload = async (files: FileList) => {
    setIsLoading(true);

    const uploadPromises = Array.from(files).map(async (file) => {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("ticketId", ticketId.toString());
      formData.append(
        "category",
        selectedCategory === "all" ? "Uncategorized" : selectedCategory
      );

      const payload = {
        url: `tickets/${ticketId}/attachments`,
        method: "POST",
        body: formData,
      };

      return commanApi(payload);
    });

    await Promise.all(uploadPromises);
    showToast("Files uploaded successfully", "success");
    setUploadDialogOpen(false);

    // Refresh attachments list
    const refreshPayload = {
      url: `tickets/${ticketId}/attachments`,
      method: "GET",
    };
    commanApi(refreshPayload);

    setIsLoading(false);
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      handleFileUpload(files);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const files = e.dataTransfer.files;
    if (files) {
      handleFileUpload(files);
    }
  };

  const handleDownload = async (attachment: Attachment) => {
    const payload = {
      // url: `tickets/${ticketId}/attachments/${attachment.id}/download`,
      method: "GET",
    };

    commanApi(payload);
    showToast("Download started", "success");
  };

  const handleDelete = async (attachmentId: string) => {
    const payload = {
      url: `tickets/${ticketId}/attachments/${attachmentId}`,
      method: "DELETE",
    };

    commanApi(payload);
    setAttachments((prev) => prev.filter((a) => a.id !== attachmentId));
    showToast("File deleted successfully", "success");
  };

  const handleBulkDelete = async () => {
    if (selectedAttachments.length === 0) return;

    const deletePromises = selectedAttachments.map((id) =>
      commanApi({
        url: `tickets/${ticketId}/attachments/${id}`,
        method: "DELETE",
      })
    );

    await Promise.all(deletePromises);
    setAttachments((prev) =>
      prev.filter((a) => !selectedAttachments.includes(a.id))
    );
    setSelectedAttachments([]);
    showToast("Selected files deleted successfully", "success");
  };

  const handleAttachmentSelect = (attachmentId: string) => {
    setSelectedAttachments((prev) =>
      prev.includes(attachmentId)
        ? prev.filter((id) => id !== attachmentId)
        : [...prev, attachmentId]
    );
  };

  // Bulk download selected attachments
  const handleBulkDownload = () => {
    if (selectedAttachments.length === 0) return;

    const payload = {
      url: `tickets/${ticketId}/attachments/bulk-download`,
      method: "POST",
      body: { attachmentIds: selectedAttachments },
    };
    commanApi(payload);
  };

  // Refresh attachments list
  const handleRefreshAttachments = () => {
    const payload = {
      url: `tickets/${ticketId}/attachments`,
      method: "GET",
    };
    commanApi(payload);
  };

  return (
    <MuiBox
      sx={{
        p: 0,
        bgcolor: "#fff",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        width: "100%",
        maxWidth: "100%",
        boxShadow: 1,
        position: "relative",
        m: 0,
      }}
    >
      <MuiBox sx={{ p: 2, flex: 1, overflowY: "auto", width: "100%" }}>
        {/* Header with Actions */}
        <MuiBox
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Ticket Attachments
          </Typography>
          <MuiBox sx={{ display: "flex", gap: 1 }}>
            <Button
              variant="text"
              size="small"
              startIcon={<RefreshIcon />}
              onClick={handleRefreshAttachments}
              sx={{ fontWeight: 600 }}
            >
              Refresh
            </Button>

            <Button
              variant="text"
              size="small"
              startIcon={<CloudUpload />}
              onClick={() => setUploadDialogOpen(true)}
              sx={{ fontWeight: 600 }}
            >
              Upload Files
            </Button>
          </MuiBox>
        </MuiBox>

        <MuiBox>
          {/* Search and Filters */}
          <MuiBox sx={{ mb: 3 }}>
            <div className="grid grid-cols-12 gap-4 items-center">
              <div className="col-span-12 md:col-span-6">
                <TextField
                  fullWidth
                  autoFocus
                  inputRef={inputRef}
                  size="small"
                  placeholder="Search attachments..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  InputProps={{
                    startAdornment: <Search sx={{ color: "#666", mr: 1 }} />,
                  }}
                />
              </div>
              <div className="col-span-6 md:col-span-3">
                <FormControl fullWidth size="small">
                  <InputLabel>Category</InputLabel>
                  <Select
                    value={selectedCategory}
                    label="Category"
                    onChange={(e) => setSelectedCategory(e.target.value)}
                  >
                    {categories.map((category) => (
                      <MenuItem key={category} value={category}>
                        {category === "all" ? "All Categories" : category}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
              <div className="col-span-6 md:col-span-3">
                <FormControl fullWidth size="small">
                  <InputLabel>Sort By</InputLabel>
                  <Select
                    value={sortBy}
                    label="Sort By"
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <MenuItem value="uploadedAt">Upload Date</MenuItem>
                    <MenuItem value="name">Name</MenuItem>
                    <MenuItem value="size">Size</MenuItem>
                  </Select>
                </FormControl>
              </div>
            </div>
          </MuiBox>

          {/* Bulk Actions */}
          {selectedAttachments.length > 0 && (
            <MuiBox
              sx={{
                mb: 2,
                p: 2,
                bgcolor: "#f3f8ff",
                borderRadius: 1,
                border: "1px solid #1976d2",
              }}
            >
              <MuiBox
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography variant="body2">
                  {selectedAttachments.length} file(s) selected
                </Typography>
                <MuiBox sx={{ display: "flex", gap: 1 }}>
                  <Button
                    size="small"
                    variant="outlined"
                    startIcon={<Download />}
                    onClick={handleBulkDownload}
                  >
                    Download Selected
                  </Button>
                  <Button
                    size="small"
                    variant="outlined"
                    color="error"
                    startIcon={<Delete />}
                    onClick={handleBulkDelete}
                  >
                    Delete Selected
                  </Button>
                </MuiBox>
              </MuiBox>
            </MuiBox>
          )}

          {/* Attachments List */}
          <MuiBox>
            {filteredAttachments?.length === 0 ? (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ textAlign: "center", py: 4 }}
              >
                No attachments found matching your criteria.
              </Typography>
            ) : (
              <List>
                {filteredAttachments?.map((attachment: any) => (
                  <ListItem
                    key={attachment.signature}
                    sx={{
                      border: "1px solid #e0e0e0",
                      borderRadius: 1,
                      mb: 1,
                      backgroundColor: selectedAttachments.includes(
                        attachment.signature
                      )
                        ? "#f3f8ff"
                        : "#fff",
                      "&:hover": {
                        backgroundColor: selectedAttachments.includes(
                          attachment.signature
                        )
                          ? "#f3f8ff"
                          : "#f5f5f5",
                      },
                    }}
                  >
                    <ListItemAvatar>
                      <Avatar sx={{ backgroundColor: "primary.main" }}>
                        {getFileIcon(attachment.mime)}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <MuiBox
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            mb: 0.5,
                          }}
                        >
                          <Typography variant="body1" sx={{ fontWeight: 500 }}>
                            {attachment.fileName}
                          </Typography>
                          {attachment.dt.ago && (
                            <Chip
                              label={attachment.dt.ago}
                              size="small"
                              color="success"
                              variant="outlined"
                            />
                          )}
                        </MuiBox>
                      }
                      secondary={
                        <MuiBox>
                          <Typography variant="body2" color="text.secondary">
                            {attachment.fileSize} • {attachment.mime} • Uploaded
                            by {attachment.uploadedBy}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {`${attachment.dt.ds} ${attachment.dt.ts}`} •{" "}
                            {attachment.downloads} downloads
                          </Typography>
                        </MuiBox>
                      }
                    />
                    <ListItemSecondaryAction>
                      <MuiBox sx={{ display: "flex", gap: 1 }}>
                        <Tooltip title="Download">
                          <IconButton
                            size="small"
                            onClick={() => handleDownload(attachment)}
                          >
                            <Download />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleDelete(attachment.id)}
                          >
                            <Delete />
                          </IconButton>
                        </Tooltip>
                      </MuiBox>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            )}
          </MuiBox>
        </MuiBox>
      </MuiBox>

      {/* Upload Dialog */}
      <Dialog
        open={uploadDialogOpen}
        onClose={() => setUploadDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Upload Files</DialogTitle>
        <DialogContent>
          <MuiBox
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            sx={{
              p: 4,
              border: dragOver ? "2px dashed #1976d2" : "2px dashed #ccc",
              borderRadius: 2,
              textAlign: "center",
              backgroundColor: dragOver ? "#f3f8ff" : "#fafafa",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
            onClick={() => fileInputRef.current?.click()}
          >
            <CloudUpload sx={{ fontSize: 48, color: "#1976d2", mb: 2 }} />
            <Typography variant="h6" sx={{ mb: 1 }}>
              {dragOver ? "Drop files here" : "Drag & drop files here"}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              or click to browse files
            </Typography>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              style={{ display: "none" }}
              onChange={handleFileSelect}
            />
          </MuiBox>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setUploadDialogOpen(false)}>Cancel</Button>
        </DialogActions>
      </Dialog>

      {/* Create Folder Dialog */}
      <Dialog
        open={folderDialogOpen}
        onClose={() => setFolderDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Create New Folder</DialogTitle>
        <DialogContent>
          <MuiBox sx={{ pt: 1 }}>
            <TextField
              fullWidth
              label="Folder Name"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Description (Optional)"
              value={newFolderDescription}
              onChange={(e) => setNewFolderDescription(e.target.value)}
              multiline
              rows={3}
            />
          </MuiBox>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setFolderDialogOpen(false)}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </MuiBox>
  );
};

export default Attachments;
