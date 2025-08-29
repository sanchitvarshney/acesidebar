import React, { useState, useRef, useEffect } from "react";
import CloseIcon from "@mui/icons-material/Close";
import {
  IconButton,
  TextField,
  Button,
  Typography,
  Box as MuiBox,
  Avatar,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  ListItemSecondaryAction,
  Tooltip,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  CircularProgress,
  Switch,
  FormGroup,
  FormControlLabel,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import {
  CloudUpload,
  Download,
  Delete,
  Image,
  Description,
  PictureAsPdf,
  VideoFile,
  AudioFile,
  Archive,
  Code,
  Search,
} from "@mui/icons-material";
import { useToast } from "../../../hooks/useToast";
import {
  useCommanApiMutation,
  useGetAttacedFileQuery,
} from "../../../services/threadsApi";
import {
  useAttachedFileMutation,
  useDeleteAttachedFileMutation,
  useLazyDownloadAttachedFileQuery,
} from "../../../services/uploadDocServices";

import ImageViewComponent from "../../components/ImageViewComponent";

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
  const [attachedFile, { isLoading: isUploading,data: attachedFileData }] = useAttachedFileMutation();

  const { data, refetch } = useGetAttacedFileQuery({ ticketId });

  const [triggerDownload, { isLoading: isDownloading }] =
    useLazyDownloadAttachedFileQuery();
  const [deleteAttachedFile, { isLoading: deleteLoading }] =
    useDeleteAttachedFileMutation();
  const { showToast } = useToast();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("uploadedAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [isPrivate, setIsPrivate] = useState(false);

  const [deleteingValue, setDeletingValue] = useState("");
  const [downloadingValue, setdownloadingValue] = useState("");
  const [images, setImages] = useState<any>([]);
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
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;
    const file = files[0];
    const type = isPrivate ? "PRIVATE" : "PUBLIC";
    const formData = new FormData();
    formData.append("image", file, file.name);
    formData.append("ticket", String(ticketId));
    formData.append("type", type);

    attachedFile(formData)
      .then((res: any) => {
        if (res?.data?.success !== true) {
          showToast(res?.data?.message || "Image upload failed", "error");
          return;
        }
        const data = res?.data?.data;
        const imageData = {
          fileId: data?.signature,
          name: data?.fileName,
          size: data?.size,
          type: data?.mime,
        };
        refetch();
        setImages((prevImages: any) => [...prevImages, imageData]);
      })
      .catch((err: any) => {
        showToast(err?.data?.message || "Image upload failed", "error");
      });
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

  const handleDownload = async (id: string, fileName: string) => {
    if (!id || !ticketId) {
      showToast("Invalid attachment ID", "error");
      return;
    }

    const payload = {
      ticketNumber: ticketId,
      signature: id,
    };

    try {
      const res = await triggerDownload(payload).unwrap();

      if (res instanceof Blob) {
        const url = window.URL.createObjectURL(res);
        const a = document.createElement("a");
        a.href = url;
        a.download = "attachment";
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
        showToast("Download completed", "success");
        return;
      }

      if (res?.success === true && res?.data) {
        const byteCharacters = atob(res.data);
        const byteNumbers = new Array(byteCharacters.length)
          .fill(0)
          .map((_, i) => byteCharacters.charCodeAt(i));
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], {
          type: "application/octet-stream",
        });

        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = fileName || "attachment";
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);

        showToast("Download completed", "success");
      } else {
        showToast(
          res?.message || "An error occurred while downloading",
          "error"
        );
      }
    } catch (error) {
      showToast("Failed to download file", "error");
    }
  };
  
  const onRemove = (fileId: string) => {
    if (!fileId || !ticketId) {
      showToast("File not exist please try again", "error");
      return;
    }
    console.log("ticket id during delete file", ticketId);
    const payload = {
      ticketNumber: ticketId,
      signature: fileId,
    };

    deleteAttachedFile(payload).then((res) => {
      if (res?.data?.success !== true) {
        showToast(
          res?.data?.message || "An error occurred while deleting",
          "error"
        );
        return;
      }
      refetch();
    });
  };

  // Refresh attachments list
  const handleRefreshAttachments = () => {
    refetch();
  };

  const handleRemoveImage = (id: string | number) => {
    const updatedImages = images.filter((image: any) => image.fileId !== id);
    setImages(updatedImages);
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
                      backgroundColor: "#fff",
                      "&:hover": {
                        backgroundColor: "#f5f5f5",
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
                          {attachment.type && (
                            <Chip
                              label={attachment.type}
                              size="small"
                              color={
                                attachment.type == "PUBLIC"
                                  ? "success"
                                  : "warning"
                              }
                              variant="outlined"
                            />
                          )}
                        </MuiBox>
                      }
                      secondary={
                        <MuiBox>
                          <Typography variant="body2" color="text.secondary">
                            {attachment.fileSize} • Uploaded by:{" "}
                            {attachment.uploadedBy?.name} (
                            {attachment.uploadedBy?.type == "S"
                              ? "Agent"
                              : attachment.uploadedBy?.type == "U"
                              ? "Client"
                              : "Admin"}
                            )
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {`${attachment.dt.ds} ${attachment.dt.ts}`} • (
                            {attachment.dt.ago}) | {attachment.downloads}{" "}
                            downloads
                          </Typography>
                        </MuiBox>
                      }
                    />
                    <ListItemSecondaryAction>
                      <MuiBox sx={{ display: "flex", gap: 1 }}>
                        <Tooltip title="Download">
                          <IconButton
                            size="small"
                            onClick={() => {
                              setdownloadingValue(attachment?.signature);
                              handleDownload(
                                attachment?.signature,
                                attachment?.fileName
                              );
                            }}
                          >
                            {isDownloading &&
                            downloadingValue === attachment?.signature ? (
                              <CircularProgress size={18} />
                            ) : (
                              <Download />
                            )}
                          </IconButton>
                        </Tooltip>

                        {attachment?.deletable && (
                          <Tooltip title="Delete">
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => {
                                setDeletingValue(attachment?.signature);
                                onRemove(attachment.signature);
                              }}
                            >
                              {deleteLoading &&
                              deleteingValue === attachment?.signature ? (
                                <CircularProgress size={18} />
                              ) : (
                                <Delete />
                              )}
                            </IconButton>
                          </Tooltip>
                        )}
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
        <DialogTitle sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="h6">Upload Files</Typography>{" "}
          <IconButton>
            <CloseIcon
              onClick={() => {
                setUploadDialogOpen(false);
                setImages([]);
              }}
            />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <MuiBox
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            sx={{
              p: 2,
              border: dragOver ? "2px dashed #1976d2" : "2px dashed #ccc",
              borderRadius: 2,
              textAlign: "center",
              backgroundColor: dragOver ? "#f3f8ff" : "#fafafa",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
            onClick={() => fileInputRef.current?.click()}
          >
            {isUploading ? (
              <CircularProgress size={45} />
            ) : (
              <CloudUpload sx={{ fontSize: 48, color: "#1976d2", mb: 2 }} />
            )}
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

          {images.length > 0 && (
            <div className="mt-3">
              <ImageViewComponent
                images={images}
                handleRemove={(id: any) => handleRemoveImage(id)}
                isToggle={true}
                isPrivate={attachedFileData?.data?.isPublic}
                ticketId={ticketId}
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </MuiBox>
  );
};

export default Attachments;
