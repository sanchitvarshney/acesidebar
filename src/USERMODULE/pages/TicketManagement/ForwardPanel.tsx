import React, { useEffect, useState, useRef } from "react";
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
  Autocomplete,
  Stack,
  CircularProgress,
  Alert,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

import AttachFileIcon from "@mui/icons-material/AttachFile";
import DeleteIcon from "@mui/icons-material/Delete";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import ImageIcon from "@mui/icons-material/Image";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import DescriptionIcon from "@mui/icons-material/Description";
import { AnimatePresence, motion } from "framer-motion";
import { useToast } from "../../../hooks/useToast";
import { isValidEmail } from "../../../utils/Utils";
import { useSelector } from "react-redux";
import { useLazyGetAgentsBySeachQuery } from "../../../services/agentServices";
import EmailAutocomplete from "../../../components/reusable/EmailAutocomplete";
import SingleValueAsynAutocomplete from "../../../components/reusable/SingleValueAsynAutocomplete";

interface ForwardPanelProps {
  open: boolean;
  onClose: () => void;
  fields: any;
  onFieldChange: any;
  onSend: () => void;
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
}) => {
  const [showCc, setShowCc] = React.useState(false);
  const [showBcc, setShowBcc] = React.useState(false);
  const [attachedFiles, setAttachedFiles] = React.useState<AttachedFile[]>([]);
  const [isDragOver, setIsDragOver] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const toFieldRef = useRef<HTMLInputElement>(null);
  const { showToast } = useToast();

  const { forwardData } = useSelector((state: any) => state.shotcut);
  const [triggerSeachAgent, { isLoading: seachAgentLoading }] =
    useLazyGetAgentsBySeachQuery();

  useEffect(() => {
    if (forwardData) {
      onFieldChange("subject", forwardData.subject);
      onFieldChange("message", forwardData.message);
      onFieldChange("threadID", forwardData.threadID);
    }
  }, [forwardData]);

  const handleFileSelect = async (files: FileList | null) => {
    if (!files) return;

    const currentFileCount = attachedFiles.length;
    const newFileCount = files.length;
    const totalFiles = currentFileCount + newFileCount;

    if (totalFiles > MAX_FILES) {
      showToast(
        `Maximum ${MAX_FILES} files allowed. You can only upload ${
          MAX_FILES - currentFileCount
        } more file(s).`,
        "error"
      );
      return;
    }

    const newFiles = await Promise.all(
      Array.from(files).map(
        (file) =>
          new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = () => {
              resolve({
                file_id: `${Date.now()}-${file.name}`,
                file_type: file.type,
                file_name: file.name,
                file_size: file.size,
                base64_data: (reader?.result as string).split(",")[1], // Remove the data: prefix
              });
            };
            reader?.readAsDataURL(file);
          })
      )
    );

    //@ts-ignore

    onFieldChange("documents", [...fields.documents, ...newFiles]);
  };

  const handleFileRemove = (fileId: string) => {
    //@ts-ignore
    onFieldChange(
      "documents",
      fields.documents.filter((file: any) => file.file_id !== fileId)
    );
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

  // Focus on To field when panel opens
  useEffect(() => {
    if (open && toFieldRef.current) {
      // Small delay to ensure the component is fully rendered
      const timer = setTimeout(() => {
        toFieldRef.current?.focus();
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [open]);

  const handleDelete = (type: any, item: any) => {
    if (type === "cc") {
      onFieldChange(
        "cc",
        fields.cc.filter((i: any) => i.email !== item)
      );
    } else {
      onFieldChange(
        "bcc",
        fields.bcc.filter((i: any) => i.email !== item)
      );
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getFileIcon = (type: string) => {
    if (type?.startsWith("image/")) return <ImageIcon />;
    if (type === "application/pdf") return <PictureAsPdfIcon />;
    if (type?.startsWith("text/")) return <DescriptionIcon />;
    return <InsertDriveFileIcon />;
  };

  const canAddMoreFiles = fields.documents?.length < MAX_FILES;

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
        boxShadow: 1,
        position: "relative",
        m: 0,
      }}
    >
  

      <MuiBox sx={{ p: 2, flex: 1, overflowY: "auto", width: "100%" }}>
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
          value={fields.subject ?? ""}
          onChange={(e) => onFieldChange("subject", e.target.value)}
          required
          sx={{ mb: 2 }}
        />
        <SingleValueAsynAutocomplete
          qtkMethod={triggerSeachAgent}
          value={fields.to}
          onChange={(newValue) => onFieldChange("to", newValue)}
          label="To"
          renderOptionExtra={(user: any) => (
            <Typography variant="body2" color="text.secondary">
              {user.email}
            </Typography>
          )}
          loading={seachAgentLoading}
          showIcon={false}
          isFallback={true}
        />

        <div className="flex gap-2 justify-end mr-1 my-1">
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
              style={{ marginTop: "10px", marginBottom: "8px" }}
            >
              <EmailAutocomplete
                label="CC"
                value={fields.cc}
                onChange={(newValue) => onFieldChange("cc", newValue)}
                qtkMethod={triggerSeachAgent}
                type="cc"
                onDelete={handleDelete}
                renderOptionExtra={(user: any) => (
                  <Typography variant="body2" color="text.secondary">
                    {user.email}
                  </Typography>
                )}
                isRendered={false}
              />

              {fields.cc.length > 0 && (
                <Stack
                  direction="row"
                  spacing={1}
                  mt={1}
                  sx={{ overflowX: "auto", p: 1 }}
                >
                  {fields.cc.map((item: any, index: number) => (
                    <Chip
                      label={
                        item.name ? `${item.name} (${item.email})` : item.email
                      }
                      variant="outlined"
                      onDelete={() => handleDelete("cc", item.email)}
                    />
                  ))}
                </Stack>
              )}
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
              style={{ marginTop: "16px", marginBottom: "8px" }}
            >
              <EmailAutocomplete
                label="BCC"
                value={fields.bcc}
                onChange={(newValue) => onFieldChange("bcc", newValue)}
                qtkMethod={triggerSeachAgent}
                type="bcc"
                onDelete={handleDelete}
                renderOptionExtra={(user: any) => (
                  <Typography variant="body2" color="text.secondary">
                    {user.email}
                  </Typography>
                )}
                isRendered={false}
              />

              {fields.bcc.length > 0 && (
                <Stack
                  direction="row"
                  spacing={1}
                  mt={1}
                  sx={{ overflowX: "auto", p: 1 }}
                >
                  {fields.bcc.map((item: any, index: number) => (
                    <Chip
                      label={
                        item.name ? `${item.name} (${item.email})` : item.email
                      }
                      variant="outlined"
                      onDelete={() => handleDelete("bcc", item.email)}
                    />
                  ))}
                </Stack>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <TextField
          label="Message"
          fullWidth
          margin="dense"
          multiline
          minRows={4}
          value={fields.message ?? ""}
          onChange={(e) => onFieldChange("message", e.target.value)}
          sx={{ mb: 2 }}
        />

        {/* File Attachment Section */}
        <MuiBox sx={{ mb: 2 }}>
          <Typography
            variant="subtitle2"
            sx={{ mb: 1, fontWeight: 600, color: "#666" }}
          >
            Attachments ({fields.documents?.length}/{MAX_FILES})
          </Typography>

          {/* Drag & Drop Area */}
          <Paper
            elevation={0}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            sx={{
              p: 1,
              border: isDragOver ? "2px dashed #1976d2" : "2px dashed #e0e0e0",
              borderRadius: 2,
              backgroundColor: isDragOver ? "#f3f8ff" : "#fafafa",
              textAlign: "center",
              cursor: canAddMoreFiles ? "pointer" : "not-allowed",
              transition: "all 0.2s ease",
              opacity: canAddMoreFiles ? 1 : 0.6,
              "&:hover": canAddMoreFiles
                ? {
                    borderColor: "#1976d2",
                    backgroundColor: "#f3f8ff",
                  }
                : {},
            }}
            onClick={() => canAddMoreFiles && fileInputRef.current?.click()}
          >
            <AttachFileIcon
              sx={{
                fontSize: 35,
                color: canAddMoreFiles ? "#666" : "#ccc",
                mb: 1,
              }}
            />
            <Typography
              variant="body2"
              sx={{ color: canAddMoreFiles ? "#666" : "#ccc", mb: 1 }}
            >
              {!canAddMoreFiles
                ? `Maximum ${MAX_FILES} files reached`
                : isDragOver
                ? "Drop files here"
                : "Drag & drop files here or click to browse"}
            </Typography>
            <Typography
              variant="caption"
              sx={{ color: canAddMoreFiles ? "#999" : "#ccc" }}
            >
              {canAddMoreFiles
                ? `Supported formats: PDF, Images, Documents (Max ${MAX_FILES} files)`
                : "Remove some files to add more"}
            </Typography>
          </Paper>

          <input
            ref={fileInputRef}
            type="file"
            multiple
            style={{ display: "none" }}
            onChange={(e) => handleFileSelect(e.target.files)}
            disabled={!canAddMoreFiles}
          />
        </MuiBox>

        {/* Attached Files List */}
        {fields.documents?.length > 0 && (
          <MuiBox sx={{ mb: 2 }}>
            <Typography
              variant="subtitle2"
              sx={{ mb: 1, fontWeight: 600, color: "#666" }}
            >
              Attached Files ({fields.documents?.length})
            </Typography>
            <List sx={{ p: 0, bgcolor: "#f8f9fa", borderRadius: 1 }}>
              {fields.documents?.map((file: any) => (
                <ListItem
                  key={file.file_id}
                  sx={{
                    borderBottom: "1px solid #e0e0e0",
                    "&:last-child": { borderBottom: "none" },
                    py: 1,
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    {getFileIcon(file.file_type)}
                  </ListItemIcon>
                  <ListItemText
                    primary={file.file_name}
                    secondary={formatFileSize(file.file_size)}
                    primaryTypographyProps={{
                      fontSize: "0.875rem",
                      fontWeight: 500,
                    }}
                    secondaryTypographyProps={{ fontSize: "0.75rem" }}
                  />
                  <ListItemSecondaryAction>
                    <IconButton
                      edge="end"
                      size="small"
                      onClick={() => handleFileRemove(file.file_id)}
                      sx={{ color: "#f44336" }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          </MuiBox>
        )}
        <Alert
          severity="warning"
          sx={{
            backgroundColor: "rgb(254 249 195)",
            border: "1px solid #FFC107",
          }}
        >
          <Typography variant="subtitle1" sx={{ fontSize: 12 }}>
            {" "}
            {forwardData && forwardData.threadID
              ? "Forwarding only this thread may exclude important context from the rest of the ticket."
              : "Once forwarded, this ticket will be visible to the selected recipient. This action cannot be undone."}
          </Typography>
        </Alert>
      </MuiBox>

      <MuiBox
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
        <Button
          onClick={onClose}
          variant="text"
          sx={{ minWidth: 80, fontWeight: 600 }}
        >
          Cancel
        </Button>
        <Button
          onClick={onSend}
          variant="contained"
          color="primary"
          disabled={!fields.subject || !fields.to}
          sx={{ minWidth: 100, fontWeight: 600 }}
        >
          Forward
        </Button>
      </MuiBox>
    </MuiBox>
  );

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
