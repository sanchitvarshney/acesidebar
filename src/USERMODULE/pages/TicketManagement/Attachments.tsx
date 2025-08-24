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
  Sort,
  FilterList,
  Add,
  CreateNewFolder,
} from "@mui/icons-material";
import { useToast } from "../../../hooks/useToast";
import { useCommanApiMutation } from "../../../services/threadsApi";

interface AttachmentsProps {
  open: boolean;
  onClose: () => void;
  ticketId: string | number;
}

interface Attachment {
  id: string;
  name: string;
  size: number;
  type: string;
  uploadedAt: string;
  uploadedBy: string;
  category?: string;
  tags?: string[];
  description?: string;
  isPublic: boolean;
  downloadCount: number;
  lastDownloaded?: string;
}

interface Folder {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  createdBy: string;
  attachmentCount: number;
}

// Sample data - replace with actual API calls
const sampleAttachments: Attachment[] = [
  {
    id: "1",
    name: "screenshot-2024-01-15.png",
    size: 2457600, // 2.4MB
    type: "image/png",
    uploadedAt: "2024-01-15T10:00:00Z",
    uploadedBy: "John Doe",
    category: "Screenshots",
    tags: ["error", "login"],
    description: "Error screenshot showing login failure",
    isPublic: true,
    downloadCount: 5,
    lastDownloaded: "2024-01-16T14:30:00Z"
  },
  {
    id: "2",
    name: "error-log-2024-01-15.txt",
    size: 15360, // 15KB
    type: "text/plain",
    uploadedAt: "2024-01-15T10:05:00Z",
    uploadedBy: "John Doe",
    category: "Logs",
    tags: ["error", "debug"],
    description: "System error log file",
    isPublic: false,
    downloadCount: 2,
    lastDownloaded: "2024-01-15T16:20:00Z"
  },
  {
    id: "3",
    name: "user-manual.pdf",
    size: 5242880, // 5MB
    type: "application/pdf",
    uploadedAt: "2024-01-14T09:00:00Z",
    uploadedBy: "Support Team",
    category: "Documentation",
    tags: ["manual", "user-guide"],
    description: "User manual for the application",
    isPublic: true,
    downloadCount: 12,
    lastDownloaded: "2024-01-16T11:15:00Z"
  },
  {
    id: "4",
    name: "video-tutorial.mp4",
    size: 15728640, // 15MB
    type: "video/mp4",
    uploadedAt: "2024-01-13T15:30:00Z",
    uploadedBy: "Training Team",
    category: "Videos",
    tags: ["tutorial", "training"],
    description: "Step-by-step tutorial video",
    isPublic: true,
    downloadCount: 8,
    lastDownloaded: "2024-01-16T09:45:00Z"
  }
];

const sampleFolders: Folder[] = [
  {
    id: "1",
    name: "Screenshots",
    description: "Error screenshots and visual evidence",
    createdAt: "2024-01-10T00:00:00Z",
    createdBy: "Support Team",
    attachmentCount: 15
  },
  {
    id: "2",
    name: "Logs",
    description: "System and application logs",
    createdAt: "2024-01-08T00:00:00Z",
    createdBy: "Dev Team",
    attachmentCount: 8
  },
  {
    id: "3",
    name: "Documentation",
    description: "User guides and technical docs",
    createdAt: "2024-01-05T00:00:00Z",
    createdBy: "Content Team",
    attachmentCount: 23
  }
];

const Attachments: React.FC<AttachmentsProps> = ({
  open,
  onClose,
  ticketId,
}) => {
  const [commanApi] = useCommanApiMutation();
  const { showToast } = useToast();
  
  const [activeTab, setActiveTab] = useState(0);
  const [attachments, setAttachments] = useState<Attachment[]>(sampleAttachments);
  const [folders, setFolders] = useState<Folder[]>(sampleFolders);
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

  // Fetch attachments on component mount
  useEffect(() => {
    const payload = {
      url: `tickets/${ticketId}/attachments`,
      method: "GET",
    };
    commanApi(payload);
  }, [ticketId, commanApi]);

  // Fetch folders on component mount
  useEffect(() => {
    const payload = {
      url: `tickets/${ticketId}/folders`,
      method: "GET",
    };
    commanApi(payload);
  }, [ticketId, commanApi]);

  // Filter and sort attachments
  const filteredAttachments = attachments
    .filter(attachment => {
      const matchesSearch = attachment.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           attachment.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           attachment.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesCategory = selectedCategory === "all" || attachment.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      let aValue: any = a[sortBy as keyof Attachment];
      let bValue: any = b[sortBy as keyof Attachment];
      
      if (sortBy === "uploadedAt") {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      }
      
      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  // Get unique categories
  const categories = ["all", ...Array.from(new Set(attachments.map(a => a.category).filter(Boolean)))];

  const getFileIcon = (type: string) => {
    if (type.startsWith("image/")) return <Image />;
    if (type.startsWith("video/")) return <VideoFile />;
    if (type.startsWith("audio/")) return <AudioFile />;
    if (type === "application/pdf") return <PictureAsPdf />;
    if (type.includes("zip") || type.includes("rar")) return <Archive />;
    if (type.includes("code") || type.includes("json") || type.includes("xml")) return <Code />;
    return <Description />;
  };

  const getFileColor = (type: string) => {
    if (type.startsWith("image/")) return "#4caf50";
    if (type.startsWith("video/")) return "#ff9800";
    if (type.startsWith("audio/")) return "#9c27b0";
    if (type === "application/pdf") return "#f44336";
    if (type.includes("zip") || type.includes("rar")) return "#795548";
    if (type.includes("code") || type.includes("json") || type.includes("xml")) return "#2196f3";
    return "#757575";
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const handleFileUpload = async (files: FileList) => {
    setIsLoading(true);
    
    const uploadPromises = Array.from(files).map(async (file) => {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("ticketId", ticketId.toString());
      formData.append("category", selectedCategory === "all" ? "Uncategorized" : selectedCategory);
      
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
      url: `tickets/${ticketId}/attachments/${attachment.id}/download`,
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
    setAttachments(prev => prev.filter(a => a.id !== attachmentId));
    showToast("File deleted successfully", "success");
  };

  const handleBulkDelete = async () => {
    if (selectedAttachments.length === 0) return;
    
    const deletePromises = selectedAttachments.map(id => 
      commanApi({
        url: `tickets/${ticketId}/attachments/${id}`,
        method: "DELETE",
      })
    );
    
    await Promise.all(deletePromises);
    setAttachments(prev => prev.filter(a => !selectedAttachments.includes(a.id)));
    setSelectedAttachments([]);
    showToast("Selected files deleted successfully", "success");
  };

  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) {
      showToast("Please enter a folder name", "error");
      return;
    }
    
    const payload = {
      url: `tickets/${ticketId}/folders`,
      method: "POST",
      body: {
        name: newFolderName,
        description: newFolderDescription,
      },
    };
    
    commanApi(payload);
    showToast("Folder created successfully", "success");
    setFolderDialogOpen(false);
    setNewFolderName("");
    setNewFolderDescription("");
    
    // Refresh folders list
    const refreshPayload = {
      url: `tickets/${ticketId}/folders`,
      method: "GET",
    };
    commanApi(refreshPayload);
  };

  const handleAttachmentSelect = (attachmentId: string) => {
    setSelectedAttachments(prev => 
      prev.includes(attachmentId) 
        ? prev.filter(id => id !== attachmentId)
        : [...prev, attachmentId]
    );
  };

  const handleSelectAll = () => {
    if (selectedAttachments.length === filteredAttachments.length) {
      setSelectedAttachments([]);
    } else {
      setSelectedAttachments(filteredAttachments.map(a => a.id));
    }
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
        <MuiBox sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Ticket Attachments
          </Typography>
                     <MuiBox sx={{ display: "flex", gap: 1 }}>
             <Button
               variant="outlined"
               size="small"
               startIcon={<CreateNewFolder />}
               onClick={() => setFolderDialogOpen(true)}
             >
               New Folder
             </Button>
             <Button
               variant="outlined"
               size="small"
               onClick={handleRefreshAttachments}
             >
               Refresh
             </Button>
             <Button
               variant="contained"
               size="small"
               startIcon={<CloudUpload />}
               onClick={() => setUploadDialogOpen(true)}
             >
               Upload Files
             </Button>
           </MuiBox>
        </MuiBox>

        {/* Tabs */}
        <MuiBox sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
          <Tabs value={activeTab} onChange={(_, newValue) => setActiveTab(newValue)}>
            <Tab label="Files" icon={<AttachFile />} iconPosition="start" />
            <Tab label="Folders" icon={<Folder />} iconPosition="start" />
          </Tabs>
        </MuiBox>

        {activeTab === 0 && (
          /* Files Tab */
          <MuiBox>
                         {/* Search and Filters */}
             <MuiBox sx={{ mb: 3 }}>
               <div className="grid grid-cols-12 gap-4 items-center">
                 <div className="col-span-12 md:col-span-6">
                   <TextField
                     fullWidth
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
                       {categories.map(category => (
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
                       <MenuItem value="downloadCount">Downloads</MenuItem>
                     </Select>
                   </FormControl>
                 </div>
               </div>
             </MuiBox>

                         {/* Bulk Actions */}
             {selectedAttachments.length > 0 && (
               <MuiBox sx={{ mb: 2, p: 2, bgcolor: "#f3f8ff", borderRadius: 1, border: "1px solid #1976d2" }}>
                 <MuiBox sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
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
              {filteredAttachments.length === 0 ? (
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: "center", py: 4 }}>
                  No attachments found matching your criteria.
                </Typography>
              ) : (
                <List>
                  {filteredAttachments.map((attachment) => (
                    <ListItem
                      key={attachment.id}
                      sx={{
                        border: "1px solid #e0e0e0",
                        borderRadius: 1,
                        mb: 1,
                        backgroundColor: selectedAttachments.includes(attachment.id) ? "#f3f8ff" : "#fff",
                        "&:hover": {
                          backgroundColor: selectedAttachments.includes(attachment.id) ? "#f3f8ff" : "#f5f5f5",
                        },
                      }}
                    >
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: getFileColor(attachment.type) }}>
                          {getFileIcon(attachment.type)}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <MuiBox sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
                            <Typography variant="body1" sx={{ fontWeight: 500 }}>
                              {attachment.name}
                            </Typography>
                            {attachment.isPublic ? (
                              <Chip label="Public" size="small" color="success" variant="outlined" />
                            ) : (
                              <Chip label="Private" size="small" color="default" variant="outlined" />
                            )}
                          </MuiBox>
                        }
                        secondary={
                          <MuiBox>
                            <Typography variant="body2" color="text.secondary">
                              {formatFileSize(attachment.size)} • {attachment.type} • Uploaded by {attachment.uploadedBy}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {new Date(attachment.uploadedAt).toLocaleDateString()} • {attachment.downloadCount} downloads
                            </Typography>
                            {attachment.description && (
                              <Typography variant="body2" sx={{ mt: 0.5 }}>
                                {attachment.description}
                              </Typography>
                            )}
                            {attachment.tags && attachment.tags.length > 0 && (
                              <MuiBox sx={{ display: "flex", gap: 0.5, mt: 0.5 }}>
                                {attachment.tags.map(tag => (
                                  <Chip key={tag} label={tag} size="small" variant="outlined" sx={{ fontSize: "0.75rem" }} />
                                ))}
                              </MuiBox>
                            )}
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
        )}

        {activeTab === 1 && (
          /* Folders Tab */
          <MuiBox>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
              Organized Folders
            </Typography>
            
                         {folders.length === 0 ? (
               <Typography variant="body2" color="text.secondary" sx={{ textAlign: "center", py: 4 }}>
                 No folders have been created yet.
               </Typography>
             ) : (
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                 {folders.map((folder) => (
                   <Paper
                     key={folder.id}
                     sx={{
                       p: 2,
                       cursor: "pointer",
                       border: "1px solid #e0e0e0",
                       "&:hover": {
                         borderColor: "#1976d2",
                         boxShadow: 2,
                       },
                     }}
                   >
                     <MuiBox sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                       <Avatar sx={{ bgcolor: "#1976d2" }}>
                         <Folder />
                       </Avatar>
                       <MuiBox sx={{ flex: 1 }}>
                         <Typography variant="body1" sx={{ fontWeight: 500 }}>
                           {folder.name}
                         </Typography>
                         <Typography variant="body2" color="text.secondary">
                           {folder.description}
                         </Typography>
                         <Typography variant="caption" color="text.secondary">
                           {folder.attachmentCount} files • Created by {folder.createdBy}
                         </Typography>
                       </MuiBox>
                     </MuiBox>
                   </Paper>
                 ))}
               </div>
             )}
          </MuiBox>
        )}
      </MuiBox>

      {/* Upload Dialog */}
      <Dialog open={uploadDialogOpen} onClose={() => setUploadDialogOpen(false)} maxWidth="sm" fullWidth>
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
      <Dialog open={folderDialogOpen} onClose={() => setFolderDialogOpen(false)} maxWidth="sm" fullWidth>
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
          <Button 
            onClick={handleCreateFolder} 
            variant="contained"
            disabled={!newFolderName.trim()}
          >
            Create Folder
          </Button>
        </DialogActions>
      </Dialog>
    </MuiBox>
  );
};

export default Attachments;
