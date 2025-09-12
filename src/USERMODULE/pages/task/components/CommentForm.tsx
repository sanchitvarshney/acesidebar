import React, { useRef, useEffect } from "react";
import { TextField, Button, Checkbox, IconButton, Box } from "@mui/material";
import {
  AttachFile as AttachFileIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import {
  validateComment,
  getWordCount,
  getRemainingWords,
  validateFileUpload,
  formatFileSize,
  getFileIcon,
} from "../utils/taskUtils";
import { FILE_UPLOAD_CONFIG } from "../data/taskData";

interface CommentFormProps {
  isOpen: boolean;
  comment: string;
  isInternal: boolean;
  showAttachments: boolean;
  attachments: File[];
  error: string;
  onCommentChange: (comment: string) => void;
  onInternalChange: (isInternal: boolean) => void;
  onShowAttachmentsChange: (showAttachments: boolean) => void;
  onAttachmentsChange: (attachments: File[]) => void;
  onErrorChange: (error: string) => void;
  onSubmit: () => void;
  onCancel: () => void;
}

const CommentForm: React.FC<CommentFormProps> = ({
  isOpen,
  comment,
  isInternal,
  showAttachments,
  attachments,
  error,
  onCommentChange,
  onInternalChange,
  onShowAttachmentsChange,
  onAttachmentsChange,
  onErrorChange,
  onSubmit,
  onCancel,
}) => {
  const commentTextareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-focus comment textarea when form is shown
  useEffect(() => {
    if (isOpen) {
      const attemptFocus = () => {
        if (commentTextareaRef.current) {
          commentTextareaRef.current.focus();
          return true;
        }
        return false;
      };

      if (!attemptFocus()) {
        const timer1 = setTimeout(attemptFocus, 100);
        const timer2 = setTimeout(attemptFocus, 300);
        const timer3 = setTimeout(attemptFocus, 500);

        return () => {
          clearTimeout(timer1);
          clearTimeout(timer2);
          clearTimeout(timer3);
        };
      }
    }
  }, [isOpen]);

  const handleCommentChange = (text: string) => {
    onCommentChange(text);
    const validationError = validateComment(text);
    onErrorChange(validationError);
  };

  const handleFileUpload = (files: File[]) => {
    const { validFiles, errors } = validateFileUpload(files, attachments);

    if (errors.length > 0) {
      errors.forEach((error) => alert(error));
      return;
    }

    if (validFiles.length > 0) {
      onAttachmentsChange([...attachments, ...validFiles]);
    }
  };

  const removeAttachment = (index: number) => {
    onAttachmentsChange(attachments.filter((_, i) => i !== index));
  };

  const handleInternalChange = (checked: boolean) => {
    onInternalChange(checked);
    if (checked && showAttachments) {
      onShowAttachmentsChange(false);
      onAttachmentsChange([]); // Clear any existing attachments
    }
  };

  if (!isOpen) return null;

  return (
    <div className="overflow-hidden transition-all duration-300 ease-in-out max-h-[800px] opacity-100 mb-4">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="space-y-4">
          {/* Comment Body */}
          <div className="space-y-2">
            <TextField
              label="Comment"
              multiline
              rows={4}
              fullWidth
              value={comment}
              onChange={(e) => handleCommentChange(e.target.value)}
              placeholder="Write your comment here..."
              size="medium"
              error={error.length > 0}
              helperText={error}
              inputRef={commentTextareaRef}
            />

            {/* Word Count and Remaining */}
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-4">
                <span
                  className={`font-medium ${
                    getWordCount(comment) > 500
                      ? "text-red-600"
                      : "text-gray-600"
                  }`}
                >
                  Words: {getWordCount(comment)}/500 |
                </span>
                <span
                  className={`font-medium ${
                    getRemainingWords(comment) < 50
                      ? "text-orange-600"
                      : "text-gray-500"
                  }`}
                >
                  Remaining: {getRemainingWords(comment)} words
                </span>
              </div>
            </div>
          </div>

          {/* Private Comment Toggle */}
          <div className="flex items-start gap-2 mb-3">
            <Checkbox
              checked={isInternal}
              onChange={(e) => handleInternalChange(e.target.checked)}
              size="small"
              sx={{ padding: "2px", marginTop: "-2px" }}
            />
            <div className="text-xs text-gray-700">
              <div>Mark as Private</div>
              <div className="text-xs text-gray-500">Only you can see this</div>
            </div>
          </div>

          {/* Attachments Section */}
          <div className="flex items-start gap-2 mb-3">
            <Checkbox
              checked={showAttachments}
              onChange={(e) => onShowAttachmentsChange(e.target.checked)}
              disabled={isInternal}
              size="small"
              sx={{ padding: "2px", marginTop: "-2px" }}
            />
            <div
              className={`text-xs ${
                isInternal ? "text-gray-400" : "text-gray-700"
              }`}
            >
              <div>Add note attachment</div>
              <div className="text-xs text-gray-500">
                Will always be public for agents
              </div>
            </div>
          </div>

          <div
            className={`overflow-hidden transition-all duration-300 ease-in-out ${
              showAttachments
                ? "max-h-[600px] opacity-100"
                : "max-h-0 opacity-0"
            }`}
          >
            <div className="border-t pt-4">
              <div className="flex items-center justify-end mb-3">
                <span className="text-xs text-gray-500">
                  {attachments.length}/{FILE_UPLOAD_CONFIG.maxFiles} files
                </span>
              </div>

              {/* File Upload Area */}
              <div
                className={`border-2 border-dashed rounded-lg p-4 text-center transition-colors ${
                  attachments.length >= FILE_UPLOAD_CONFIG.maxFiles
                    ? "border-gray-200 bg-gray-50"
                    : "border-gray-300 hover:border-blue-400 hover:bg-blue-50"
                }`}
              >
                <input
                  type="file"
                  multiple
                  className="hidden"
                  id="file-upload"
                  onChange={(e) => {
                    const files = Array.from(e.target.files || []);
                    handleFileUpload(files);
                  }}
                  accept={FILE_UPLOAD_CONFIG.acceptedExtensions}
                  disabled={attachments.length >= FILE_UPLOAD_CONFIG.maxFiles}
                />
                <label
                  htmlFor="file-upload"
                  className={`cursor-pointer ${
                    attachments.length >= FILE_UPLOAD_CONFIG.maxFiles
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                >
                  <AttachFileIcon className="text-gray-400 text-2xl mx-auto mb-2" />
                  <p className="text-sm text-gray-600 mb-1">
                    <span className="text-blue-600 hover:text-blue-700 font-medium">
                      Click to upload
                    </span>{" "}
                    or drag and drop
                  </p>
                  <p className="text-xs text-gray-500">
                    Office files only (PDF, DOC, XLS, PPT) up to 5MB • Max 3
                    files
                  </p>
                  {attachments.length >= FILE_UPLOAD_CONFIG.maxFiles && (
                    <p className="text-xs text-red-500 mt-1">
                      Maximum 3 files reached
                    </p>
                  )}
                </label>
              </div>

              {/* File List Preview */}
              {attachments.length > 0 && (
                <div className="mt-3 space-y-2">
                  {attachments.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between bg-gray-50 p-3 rounded-lg"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-lg">
                          {getFileIcon(file.name)}
                        </span>
                        <div>
                          <div className="text-sm font-medium">{file.name}</div>
                          <div className="text-xs text-gray-500">
                            {formatFileSize(file.size)}
                          </div>
                        </div>
                      </div>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => removeAttachment(index)}
                      >
                        <CloseIcon fontSize="small" />
                      </IconButton>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-2">
            <Button
              variant="text"
              onClick={onCancel}
              size="small"
              sx={{ fontWeight: 550 }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={onSubmit}
              size="small"
              disabled={error.length > 0 || comment.trim().length === 0}
            >
              Send Comment
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommentForm;

