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
import { useToast } from "../../../hooks/useToast";
import { fetchOptions, isValidEmail } from "../../../utils/Utils";

interface ForwardPanelProps {
  open: boolean;
  onClose: () => void;
  fields: any;
  onFieldChange: any;
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
  const toFieldRef = useRef<HTMLInputElement>(null);
  const { showToast } = useToast();

  const [ccChangeValue, setCcChangeValue] = React.useState("");
  const [bccChangeValue, setBccChangeValue] = React.useState("");
  const [toChangeValue, setToChangeValue] = React.useState("");
  const [options, setOptions] = useState<any[]>([]);
  const [openCcfield, setOpenCcfield] = useState(false);
  const [openBccfield, setOpenBccfield] = useState(false);

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

  // simulate API call

  useEffect(() => {
    const filterValue: any = fetchOptions(
      ccChangeValue || bccChangeValue || toChangeValue
    );

    filterValue?.length > 0
      ? setOptions(filterValue)
      : setOptions([
          {
            userName: ccChangeValue || bccChangeValue || toChangeValue,
            userEmail: ccChangeValue || bccChangeValue || toChangeValue,
          },
        ]);
  }, [ccChangeValue, bccChangeValue, toChangeValue]);

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

  const handleSelectedOption = (
    _: React.SyntheticEvent,
    value: any,
    type: string
  ) => {
    if (!value) return;

    const dataValue = { name: value.userName, email: value.userEmail };
    if (!isValidEmail(dataValue.email)) {
      showToast("Invalid email format", "error");
      return;
    }

    if (type === "cc") {
      if (fields.cc.some((item: any) => item.email === value.userEmail)) {
        showToast("Email already Exist", "error");
        return;
      }
      if (fields.cc.length >= 3) {
        showToast("Maximum 3 cc allowed", "error");
        return;
      }

      onFieldChange("cc", [...fields.cc, dataValue]);
    } else if (type === "to") {
      onFieldChange("to", dataValue.email);
    } else {
      if (fields.bcc.some((item: any) => item.email === value.userEmail)) {
        showToast("Email already Exist", "error");
        return;
      }
      if (fields.bcc.length >= 3) {
        showToast("Maximum 3 bcc allowed", "error");
        return;
      }

      onFieldChange("bcc", [...fields.bcc, dataValue]);
    }
  };

  const handleDelete = (type: string, item: any) => {
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
  const displayCCOptions: any = ccChangeValue ? options : [];
  const displayBCCOptions: any = bccChangeValue ? options : [];
  const displayToOptions: any = toChangeValue ? options : [];

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
        <Typography sx={{ flex: 1, fontSize: "17px", fontWeight: 600 }}>
          Forward
        </Typography>
        {onExpandToggle && (
          <IconButton
            onClick={onExpandToggle}
            size="small"
            sx={{ marginRight: 2 }}
          >
            {expand ? <CloseFullscreenIcon /> : <OpenInFullIcon />}
          </IconButton>
        )}
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </MuiBox>

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
          value={fields.subject}
          onChange={(e) => onFieldChange("subject", e.target.value)}
          required
          sx={{ mb: 1 }}
        />

        <Autocomplete
          disableClearable
          popupIcon={null}
          sx={{ my: 1.5 }}
          getOptionLabel={(option) => {
            if (typeof option === "string") return option;
            return option.userEmail || option.userName || "";
          }}
          options={displayToOptions}
          value={fields.to}
          onChange={(event, newValue) => {
            handleSelectedOption(event, newValue, "to");
          }}
          onInputChange={(_, value) => setToChangeValue(value)}
          filterOptions={(x) => x}
          getOptionDisabled={(option) => option === "Type to search"}
          noOptionsText="No Data Found"
          renderOption={(props, option) => (
            <li {...props}>
              {typeof option === "string" ? (
                option
              ) : (
                <div
                  className="flex items-center gap-3 p-2 rounded-md w-full"
                  style={{ cursor: "pointer" }}
                >
                  <Avatar
                    sx={{
                      width: 30,
                      height: 30,
                      backgroundColor: "primary.main",
                    }}
                  >
                    {option.userName?.charAt(0).toUpperCase()}
                  </Avatar>

                  <div className="flex flex-col">
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                      {option.userName}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {option.userEmail}
                    </Typography>
                  </div>
                </div>
              )}
            </li>
          )}
          renderTags={(toValue, getTagProps) =>
            toValue?.map((option, index) => (
              <Chip
                variant="outlined"
                color="primary"
                label={typeof option === "string" ? option : option?.name}
                {...getTagProps({ index })}
                sx={{
                  cursor: "pointer",
                  height: "20px",
                  // backgroundColor: "#6EB4C9",
                  color: "primary.main",
                  "& .MuiChip-deleteIcon": {
                    color: "error.main",
                    width: "12px",
                  },
                  "& .MuiChip-deleteIcon:hover": {
                    color: "#e87f8c",
                  },
                }}
              />
            ))
          }
          renderInput={(params) => (
            <TextField
              {...params}
              inputRef={toFieldRef}
              label="To *"
              variant="outlined"
              fullWidth
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "4px",
                  backgroundColor: "#f9fafb",
                  "&:hover fieldset": { borderColor: "#9ca3af" },
                  "&.Mui-focused fieldset": { borderColor: "#1a73e8" },
                },
                "& label.Mui-focused": { color: "#1a73e8" },
                "& label": { fontWeight: "bold" },
              }}
            />
          )}
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
              style={{ marginTop: "10px", marginBottom: "8px" }}
            >
              <Autocomplete
                size="small"
                fullWidth
                disablePortal
                value={null}
                options={displayCCOptions}
                getOptionLabel={(option: any) => {
                  if (typeof option === "string") return option;
                  return "";
                }}
                renderOption={(props, option: any) => (
                  <li {...props}>
                    {typeof option === "string" ? (
                      option
                    ) : (
                      <div
                        className="flex items-center gap-3 p-2 rounded-md w-full"
                        style={{ cursor: "pointer" }}
                      >
                        <Avatar
                          sx={{
                            width: 30,
                            height: 30,
                            backgroundColor: "primary.main",
                          }}
                        >
                          {option.userName?.charAt(0).toUpperCase()}
                        </Avatar>

                        <div className="flex flex-col">
                          <Typography
                            variant="subtitle2"
                            sx={{ fontWeight: 600 }}
                          >
                            {option.userName}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {option.userEmail}
                          </Typography>
                        </div>
                      </div>
                    )}
                  </li>
                )}
                open={openCcfield}
                onOpen={() => setOpenCcfield(true)}
                onClose={() => setOpenCcfield(false)}
                inputValue={ccChangeValue}
                onInputChange={(_, value) => setCcChangeValue(value)}
                onChange={(event, newValue) =>
                  handleSelectedOption(event, newValue, "cc")
                }
                filterOptions={(x) => x} // disable default filtering
                getOptionDisabled={(option) => option === "Type to search"}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    // InputLabelProps={{ shrink: true }}
                    label="CC"
                    variant="outlined"
                    size="small"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "4px",
                        backgroundColor: "#f9fafb",
                        "&:hover fieldset": { borderColor: "#9ca3af" },
                        "&.Mui-focused fieldset": { borderColor: "#1a73e8" },
                      },
                      "& label.Mui-focused": { color: "#1a73e8" },
                      "& label": { fontWeight: "bold" },
                    }}
                  />
                )}
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
              <Autocomplete
                size="small"
                disablePortal
                value={null}
                options={displayBCCOptions}
                getOptionLabel={(option: any) => {
                  if (typeof option === "string") return option;
                  return "";
                }}
                renderOption={(props, option: any) => (
                  <li {...props}>
                    {typeof option === "string" ? (
                      option
                    ) : (
                      <div
                        className="flex items-center gap-3 p-2 rounded-md w-full"
                        style={{ cursor: "pointer" }}
                      >
                        <Avatar
                          sx={{
                            width: 30,
                            height: 30,
                            backgroundColor: "primary.main",
                          }}
                        >
                          {option.userName?.charAt(0).toUpperCase()}
                        </Avatar>

                        <div className="flex flex-col">
                          <Typography
                            variant="subtitle2"
                            sx={{ fontWeight: 600 }}
                          >
                            {option.userName}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {option.userEmail}
                          </Typography>
                        </div>
                      </div>
                    )}
                  </li>
                )}
                open={openBccfield}
                onOpen={() => setOpenBccfield(true)}
                onClose={() => setOpenBccfield(false)}
                inputValue={bccChangeValue}
                onInputChange={(_, value) => setBccChangeValue(value)}
                onChange={(event, value) =>
                  handleSelectedOption(event, value, "bcc")
                }
                filterOptions={(x) => x} // disable default filtering
                getOptionDisabled={(option) => option === "Type to search"}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    // InputLabelProps={{ shrink: true }}
                    label="BCC"
                    variant="outlined"
                    size="small"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "4px",
                        backgroundColor: "#f9fafb",
                        "&:hover fieldset": { borderColor: "#9ca3af" },
                        "&.Mui-focused fieldset": { borderColor: "#1a73e8" },
                      },
                      "& label.Mui-focused": { color: "#1a73e8" },
                      "& label": { fontWeight: "bold" },
                    }}
                  />
                )}
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
          value={fields.message}
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
          variant="outlined"
          color="inherit"
          sx={{ minWidth: 80 }}
        >
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
