import React from "react";
import {
  IconButton,
  TextField,
  Button,
  Typography,
  Box as MuiBox,
  Avatar,
  Modal,
  Chip,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import OpenInFullIcon from "@mui/icons-material/OpenInFull";
import CloseFullscreenIcon from "@mui/icons-material/CloseFullscreen";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import DeleteIcon from "@mui/icons-material/Delete";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import ImageIcon from "@mui/icons-material/Image";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import DescriptionIcon from "@mui/icons-material/Description";
import { AnimatePresence, motion } from "framer-motion";
import { useToast } from "../../hooks/useToast";

interface ForwardPanelProps {
  open: boolean;
  onClose: () => void;
  fields: {
    from: string;
    subject: string;
    to: string;
    cc: string;
    bcc: string;
    message: string;
  };
  onFieldChange: (field: string, value: string) => void;
  onSend: () => void;
  expand?: boolean;
  onExpandToggle?: () => void;
}

interface AttachedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  file: File;
}

const MAX_FILES = 2;

const ForwardPanel: React.FC<ForwardPanelProps> = ({
  open,
  onClose,
  fields,
  onFieldChange,
  onSend,
  expand = false,
  onExpandToggle,
}) => {
  const [showCc, setShowCc] = React.useState(false);
  const [showBcc, setShowBcc] = React.useState(false);
  const [attachedFiles, setAttachedFiles] = React.useState<AttachedFile[]>([]);
  const [isDragOver, setIsDragOver] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const { showToast } = useToast();

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return;
    
    const currentFileCount = attachedFiles.length;
    const newFileCount = files.length;
    const totalFiles = currentFileCount + newFileCount;
    
    if (totalFiles > MAX_FILES) {
      showToast(`Maximum ${MAX_FILES} files allowed. You can only upload ${MAX_FILES - currentFileCount} more file(s).`, "error");
      return;
    }
    
    const newFiles: AttachedFile[] = Array.from(files).map((file) => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: file.size,
      type: file.type,
      file: file,
    }));
    
    setAttachedFiles(prev => [...prev, ...newFiles]);
    
    if (newFileCount > 1) {
      showToast(`${newFileCount} files attached successfully!`, "success");
    } else {
      showToast("File attached successfully!", "success");
    }
  };

  const handleFileRemove = (fileId: string) => {
    setAttachedFiles(prev => prev.filter(file => file.id !== fileId));
    showToast("File removed successfully!", "success");
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return <ImageIcon />;
    if (type === 'application/pdf') return <PictureAsPdfIcon />;
    if (type.startsWith('text/')) return <DescriptionIcon />;
    return <InsertDriveFileIcon />;
  };

  const canAddMoreFiles = attachedFiles.length < MAX_FILES;

  // Sidebar style panel (not modal) when expand is false
  const panelContent = (
    <MuiBox
      sx={{
        p: 0,
        bgcolor: "#fff",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        width: "100%",
        maxWidth: "100%",
        boxShadow: expand ? 24 : 1,
        position: "relative",
        m: 0,
      }}
    >
      <MuiBox
        sx={{
          display: "flex",
          alignItems: "center",
          p: 2,
          borderBottom: "1px solid #eee",
          backgroundColor: "#e8f0fe",
        }}
      >
        <Typography sx={{ flex: 1, fontSize: "17px", fontWeight: 600 }}>Forward</Typography>
        {onExpandToggle && (
          <IconButton onClick={onExpandToggle} size="small" sx={{ marginRight: 2 }}> 
            {expand ? <CloseFullscreenIcon /> : <OpenInFullIcon />}
          </IconButton>
        )}
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </MuiBox>
      
      <MuiBox sx={{ p: 2, flex: 1, overflowY: "auto" }}>
        <MuiBox sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <Avatar sx={{ mr: 1, bgcolor: "primary.main" }}>D</Avatar>
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            {fields.from}
          </Typography>
        </MuiBox>
        
        <TextField
          label="Subject"
          fullWidth
          size="small"
          margin="dense"
          value={fields.subject}
          onChange={(e) => onFieldChange("subject", e.target.value)}
          required
          sx={{ mb: 1 }}
        />
        
        <TextField
          label="To"
          size="medium"
          fullWidth
          margin="dense"
          value={fields.to}
          onChange={(e) => onFieldChange("to", e.target.value)}
          required
          sx={{ mb: 1 }}
        />

        <div className="flex gap-2 justify-end mr-1 mb-1">
          <p
            className="text-xs text-gray-500 cursor-pointer hover:underline"
            onClick={() => setShowCc((prev) => !prev)}
          >
            Cc
          </p>
          <p
            className="text-xs text-gray-500 cursor-pointer hover:underline"
            onClick={() => setShowBcc((prev) => !prev)}
          >
            Bcc
          </p>
        </div>

        <AnimatePresence>
          {showCc && (
            <motion.div
              initial={{ height: 0, opacity: 0, y: -10 }}
              animate={{ height: "auto", opacity: 1, y: 0 }}
              exit={{ height: 0, opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <TextField
                label="Cc"
                fullWidth
                size="small"
                margin="dense"
                value={fields.cc}
                onChange={(e) => onFieldChange("cc", e.target.value)}
                sx={{ mb: 1 }}
              />
            </motion.div>
          )}
        </AnimatePresence>
        
        <AnimatePresence>
          {showBcc && (
            <motion.div
              initial={{ height: 0, opacity: 0, y: -10 }}
              animate={{ height: "auto", opacity: 1, y: 0 }}
              exit={{ height: 0, opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <TextField
                label="Bcc"
                fullWidth
                size="small"
                margin="dense"
                value={fields.bcc}
                onChange={(e) => onFieldChange("bcc", e.target.value)}
                sx={{ mb: 1 }}
              />
            </motion.div>
          )}
        </AnimatePresence>
        
        <TextField
          label="Message"
          fullWidth
          margin="dense"
          multiline
          minRows={4}
          value={fields.message}
          onChange={(e) => onFieldChange("message", e.target.value)}
          sx={{ mb: 2 }}
        />

        {/* File Attachment Section */}
        <MuiBox sx={{ mb: 2 }}>
          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, color: '#666' }}>
            Attachments ({attachedFiles.length}/{MAX_FILES})
          </Typography>
          
          {/* Drag & Drop Area */}
          <Paper
          elevation={0}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            sx={{
              p: 1,
              border: isDragOver ? '2px dashed #1976d2' : '2px dashed #e0e0e0',
              borderRadius: 2,
              backgroundColor: isDragOver ? '#f3f8ff' : '#fafafa',
              textAlign: 'center',
              cursor: canAddMoreFiles ? 'pointer' : 'not-allowed',
              transition: 'all 0.2s ease',
              opacity: canAddMoreFiles ? 1 : 0.6,
              '&:hover': canAddMoreFiles ? {
                borderColor: '#1976d2',
                backgroundColor: '#f3f8ff',
              } : {},
            }}
            onClick={() => canAddMoreFiles && fileInputRef.current?.click()}
          >
            <AttachFileIcon sx={{ fontSize: 35, color: canAddMoreFiles ? '#666' : '#ccc', mb: 1 }} />
            <Typography variant="body2" sx={{ color: canAddMoreFiles ? '#666' : '#ccc', mb: 1 }}>
              {!canAddMoreFiles 
                ? `Maximum ${MAX_FILES} files reached` 
                : isDragOver 
                  ? 'Drop files here' 
                  : 'Drag & drop files here or click to browse'
              }
            </Typography>
            <Typography variant="caption" sx={{ color: canAddMoreFiles ? '#999' : '#ccc' }}>
              {canAddMoreFiles 
                ? `Supported formats: PDF, Images, Documents (Max ${MAX_FILES} files)`
                : 'Remove some files to add more'
              }
            </Typography>
          </Paper>
          
          <input
            ref={fileInputRef}
            type="file"
            multiple
            style={{ display: 'none' }}
            onChange={(e) => handleFileSelect(e.target.files)}
            disabled={!canAddMoreFiles}
          />
        </MuiBox>

        {/* Attached Files List */}
        {attachedFiles.length > 0 && (
          <MuiBox sx={{ mb: 2 }}>
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, color: '#666' }}>
              Attached Files ({attachedFiles.length})
            </Typography>
            <List sx={{ p: 0, bgcolor: '#f8f9fa', borderRadius: 1 }}>
              {attachedFiles.map((file) => (
                <ListItem
                  key={file.id}
                  sx={{
                    borderBottom: '1px solid #e0e0e0',
                    '&:last-child': { borderBottom: 'none' },
                    py: 1,
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    {getFileIcon(file.type)}
                  </ListItemIcon>
                  <ListItemText
                    primary={file.name}
                    secondary={formatFileSize(file.size)}
                    primaryTypographyProps={{ fontSize: '0.875rem', fontWeight: 500 }}
                    secondaryTypographyProps={{ fontSize: '0.75rem' }}
                  />
                  <ListItemSecondaryAction>
                    <IconButton
                      edge="end"
                      size="small"
                      onClick={() => handleFileRemove(file.id)}
                      sx={{ color: '#f44336' }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          </MuiBox>
        )}
      </MuiBox>
      
      <MuiBox
        sx={{
          p: 2,
          borderTop: "1px solid #eee",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 1,
          backgroundColor: '#fafafa',
        }}
      >
        <Button onClick={onClose} variant="outlined" color="inherit" sx={{ minWidth: 80 }}>
          Cancel
        </Button>
        <Button
          onClick={onSend}
          variant="contained"
          color="primary"
          disabled={!fields.subject || !fields.to}
          sx={{ minWidth: 100 }}
        >
          Forward
        </Button>
      </MuiBox>
    </MuiBox>
  );

  if (expand) {
    return (
      <Modal
        open={open}
        onClose={onClose}
        BackdropProps={{
          sx: {
            backdropFilter: "blur(4px)",
            backgroundColor: "rgba(0, 0, 0, 0.4)",
          },
        }}
      >
        <MuiBox
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "60vw",
            maxWidth: "60vw",
            maxHeight: "80vh",
            height: "80vh",
            bgcolor: "#fff",
            boxShadow: 24,
            outline: "none",
            p: 0,
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {panelContent}
        </MuiBox>
      </Modal>
    );
  }

  // Sidebar panel (not modal)
  return (
    <MuiBox
      sx={{
        width: "100%",
        height: "100%",
        boxShadow: 1,
        bgcolor: "#fff",
        position: "relative",
        zIndex: 1200,
      }}
    >
      {panelContent}
    </MuiBox>
  );
};

export default ForwardPanel;
