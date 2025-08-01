import React, { useCallback, useEffect, useRef, useState } from "react";
import ReplyIcon from "@mui/icons-material/Reply";
import EditIcon from "@mui/icons-material/Edit";
import CommentIcon from "@mui/icons-material/Comment";
import DeleteIcon from "@mui/icons-material/Delete";
import StackEditor from "../Editor";
import AddBoxIcon from "@mui/icons-material/AddBox";

import AttachFileIcon from "@mui/icons-material/AttachFile";
import PublishedWithChangesIcon from "@mui/icons-material/PublishedWithChanges";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import {
  FormControl,
  Select,
  MenuItem,
  IconButton,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  CircularProgress,
  Typography,
  Chip,
  ClickAwayListener,
  Box,
  Paper,
  ListItem,
  Alert,
} from "@mui/material";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import ShortCutPopover from "../shared/ShortCutPopover";
import ShotCutContent from "../ShotCutContent";

import ShortcutIcon from "@mui/icons-material/Shortcut";

import CustomToolTip from "../../reusable/CustomToolTip";
import CustomSideBarPanel from "../reusable/CustomSideBarPanel";
import { set } from "react-hook-form";
import { Add } from "@mui/icons-material";
import { useSelector } from "react-redux";
import { RootState } from "../../reduxStore/Store";
import ImageViewComponent from "../ImageViewComponent";

const signatureValues: any = [
  {
    id: 1,
    name: "None",
    value: "1",
    signature: "",
  },
  {
    id: 2,
    name: "My Signature",
    value: "2",
    signature: `<p>Best regards,</p>
<p><strong>John Doe</strong><br>
Senior Support Engineer<br>
Email: john.doe@company.com<br>
Phone: +1 (555) 123-4567<br>
Company Name<br>
www.company.com</p>`,
  },
  {
    id: 3,
    name: "Department Signature (Support)",
    value: "3",
    signature: `<p>Best regards,</p>
<p><strong>Support Team</strong><br>
Technical Support Department<br>
Email: support@company.com<br>
Phone: +1 (555) 987-6543<br>
Company Name<br>
www.company.com<br>
Working Hours: Mon-Fri 9AM-6PM EST</p>`,
  },
];

const TicketSubjectBar = ({ header }: any) => (
  <div className="flex items-center gap-2 mb-2">
    <span className="text-2xl">
      {header?.sentiment ? JSON.parse(header.sentiment).emoji : "🙂"}
    </span>
    <span className="font-semibold text-xl text-gray-800">
      {header?.subject || "Ticket Subject"}
    </span>
  </div>
);

const ThreadItem = ({
  item,
  onReplyClick,
  replyText,
  onReplyTextChange,
  onSendReply,
  onForward,
}: any) => {
  const [open, setOpen] = useState(false);
  const [showReplyEditor, setShowReplyEditor] = useState(false);
  const [localReplyText, setLocalReplyText] = useState("");
  const [markdown, setMarkdown] = useState("");

  const handleReplyClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onForward();
  };

  const handleSendReply = () => {
    if (localReplyText.trim()) {
      onReplyClick(item, localReplyText);
      setLocalReplyText("");
      setShowReplyEditor(false);
    }
  };

  const handleEditorChange = (value: string) => {
    setMarkdown(value);
  };

  return (
    <div className="flex gap-3 mb-6">
      {/* Avatar */}
      <div className="flex-shrink-0">
        {item.repliedBy?.avatarUrl ? (
          <img
            src={item.repliedBy.avatarUrl}
            alt={item.repliedBy.name}
            className="w-10 h-10 rounded-full object-cover"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-green-200 flex items-center justify-center text-lg font-bold text-green-700">
            {item.repliedBy?.name?.[0] || "?"}
          </div>
        )}
      </div>
      {/* Email content */}
      <div className="flex-1">
        <div
          className="bg-orange-50 rounded shadow p-4 border border-gray-100 cursor-pointer group"
          onClick={() => setOpen((o) => !o)}
        >
          <div className="flex items-center justify-between mb-1">
            <div>
              <span className="font-semibold text-blue-700">
                {item.repliedBy?.name || "User"}
              </span>
              <span className="ml-2 text-xs text-gray-500">
                added a private note
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400">
                {item.repliedAt?.timestamp}
              </span>
              <div className="hidden group-hover:flex items-center bg-white rounded-full shadow border ml-2 overflow-hidden">
                <button
                  className="px-2 py-1.5 hover:bg-gray-100 focus:outline-none"
                  onClick={handleReplyClick}
                >
                  <ShortcutIcon sx={{ fontSize: 18 }} />
                </button>
                <div className="w-px h-5 bg-gray-200" />
                <button className="px-2 py-1.5 hover:bg-gray-100 focus:outline-none">
                  <EditIcon sx={{ fontSize: 18 }} />
                </button>
                <div className="w-px h-5 bg-gray-200" />
                <button className="px-2 py-1.5 hover:bg-gray-100 focus:outline-none">
                  <CommentIcon sx={{ fontSize: 18 }} />
                </button>
                <div className="w-px h-5 bg-gray-200" />
                <button className="px-2 py-1.5 hover:bg-gray-100 focus:outline-none text-red-600">
                  <DeleteIcon sx={{ fontSize: 18 }} />
                </button>
              </div>
            </div>
          </div>
          {open && (
            <div
              className="text-sm text-gray-800 whitespace-pre-line mb-2"
              dangerouslySetInnerHTML={{ __html: item.message }}
            />
          )}
        </div>

        {/* Inline Reply Editor */}
        {/* {showReplyEditor && (
          <div className="mt-3 border rounded bg-white p-3 flex flex-col gap-2">
             <ForwardPanel
            open={showReplyEditor}
            onClose={() => {
              setShowReplyEditor(false);
           
            }}
            fields={forwardFields}
            onFieldChange={handleForwardFieldChange}
            onSend={handleForwardSend}
            expand={expandForward}
            onExpandToggle={() => setExpandForward((prev) => !prev)}
          />
          </div>
        )} */}
      </div>
    </div>
  );
};

const ThreadList = ({ thread, onReplyClick, onForward }: any) => (
  <div className="">
    {thread && thread.length > 0 ? (
      thread.map((item: any, idx: number) => (
        <ThreadItem
          key={idx}
          item={item}
          onReplyClick={onReplyClick}
          onForward={onForward}
        />
      ))
    ) : (
      <div className="text-gray-400">No thread items.</div>
    )}
  </div>
);

const EditorBar = ({ replyText, onReplyTextChange, onSendReply }: any) => (
  <div className="border rounded bg-white p-3 flex flex-col gap-2">
    <textarea
      className="w-full min-h-[80px] border rounded p-2 text-sm"
      placeholder="Type your reply..."
      value={replyText}
      onChange={(e) => onReplyTextChange(e.target.value)}
    />
    <div className="flex items-center justify-between">
      <div className="flex gap-2">
        {/* Toolbar icons placeholder */}
        <button className="text-gray-500 hover:text-blue-600">B</button>
        <button className="text-gray-500 hover:text-blue-600">I</button>
        <button className="text-gray-500 hover:text-blue-600">A</button>
      </div>
      <button
        className="bg-blue-600 text-white px-4 py-1.5 rounded font-semibold text-sm hover:bg-blue-700"
        onClick={onSendReply}
      >
        Send
      </button>
    </div>
  </div>
);

const TicketThreadSection = ({
  thread,
  header,
  onSendReply,
  onForward,
  showReplyEditor = false,
  onCloseReply,
}: any) => {
  // const [ticketStatus, setTicketStatus] = useState(header?.status || "open");
  const [showEditor, setShowEditor] = useState(false);
  // const [replyText, setReplyText] = useState("");
  const [markdown, setMarkdown] = useState("");
  const [showShotcut, setShowShotcut] = useState(false);
  const [slashTriggered, setSlashTriggered] = useState(false);
  const shotcutRef = React.useRef(null);
  const [stateChangeKey, setStateChangeKey] = useState(0);
  const [isEditorExpended, setIsEditorExpended] = useState(false);
  const [selectedOptionValue, setSelectedOptionValue] = useState("1");
  const [images, setImages] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showImagesModal, setShowImagesModal] = useState(false);
  const [canned, setCanned] = useState(false);
  const [suggest, setSuggest] = useState(false);
  const { shotcutData } = useSelector((state: RootState) => state.shotcut);
  const [signature, setSignature] = useState("");
  const [signatureUpdateKey, setSignatureUpdateKey] = useState(0);

  const handleSignatureChange = (event: string) => {
    setSelectedOptionValue(event);

    // Get selected signature object
    const selectedSignature = signatureValues.find(
      (sig: any) => sig.value === event
    );

    if (selectedSignature) {
      // Remove old signature pattern from current markdown content
      const signaturePattern = /<div id="signature">[\s\S]*<\/div>/;
      let updatedContent = markdown || ""; // Use current editor content instead of signature state

      // Remove old signature if exists
      updatedContent = updatedContent.replace(signaturePattern, "");

      if (selectedSignature.value === "1") {
        // "None" → just save cleaned content (no signature)
        setMarkdown(updatedContent);
        setSignature(""); // Clear signature state
      } else {
        // Append new signature at the end with proper formatting
        const newSignatureBlock = `<div id="signature" style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
${selectedSignature.signature}
</div>`;
        const contentWithSignature = updatedContent + newSignatureBlock;
        setMarkdown(contentWithSignature);
        setSignature(selectedSignature.signature); // Update signature state
      }

      // Force editor re-render
      setSignatureUpdateKey((prev) => prev + 1);
    }
  };

  // console.log(signature,"Signature Value");

  // Function to check if current content has a signature
  const hasSignature = (content: string) => {
    return content.includes("Best regards,") && selectedOptionValue !== "1";
  };

  // Function to get current signature name
  const getCurrentSignatureName = () => {
    const currentSignature = signatureValues.find(
      (sig: any) => sig.value === selectedOptionValue
    );
    return currentSignature?.name || "None";
  };

  const handleEditorChange = (value: string) => {
    if (value === null) {
      return;
    }

    // Check for slash commands without stripping HTML
    const textForSlashCheck = value?.replace(/<[^>]*>/g, "");

    if (!slashTriggered && textForSlashCheck?.includes("/")) {
      setShowShotcut(true);
      setSlashTriggered(true);
    }

    // Reset trigger if "/" is removed
    if (!textForSlashCheck.includes("/")) {
      setSlashTriggered(false);
    }

    // Store the full HTML content including signatures
    setMarkdown(value);
  };
  useEffect(() => {
    if (slashTriggered || !markdown) return;
    setShowShotcut(false);
  }, [slashTriggered, markdown]);

  // Handler for Reply button
  const handleReplyButton = () => {
    setShowEditor(!showEditor);
  };

  const handleIconClick = () => {
    if (images.length > 3) {
      alert("You can upload a maximum of 4 images");
      return;
    }
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;

    if (files) {
      const newFiles = Array.from(files);
      setImages((prev: any[]) => {
        const combined = [...prev, ...newFiles];
        if (combined.length > 4) {
          return combined.slice(0, 4); // Keep only first 4
        }
        return combined;
      });
    }
  };

  // Handler for Save button
  const handleSave = () => {
    if (markdown === null || !markdown) {
      return;
    }
    if (markdown && markdown.trim()) {
      // console.log("Saving reply:", markdown);
      onSendReply(markdown);
      setMarkdown("");
      setSignature(""); // Clear signature state
      setSelectedOptionValue("1"); // Reset to "None"
      setSignatureUpdateKey(0); // Reset signature update key
      setShowEditor(false);
      if (onCloseReply) onCloseReply();
    }
  };

  return (
    <div className="flex flex-col gap-2   min-h-[100%] relative">
      <div className="p-2">
        <TicketSubjectBar header={header} />
        <div className="flex flex-col gap-2   overflow-y-auto  ">
          <ThreadList thread={thread} onForward={onForward} />
        </div>
      </div>
      {/* Reply bar below thread */}
      {/* <div className="flex items-center gap-2 mt-4 mb-2">
        <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center text-lg font-bold text-pink-600">
          D
        </div>
        <button
          className="flex items-center gap-1 px-3 py-1 rounded bg-white text-gray-700 text-sm font-medium border border-gray-200 hover:bg-gray-100 transition"
          onClick={handleReplyButton}
        >
          <span>&#8592;</span> Reply
        </button>
        <button className="flex items-center gap-1 px-3 py-1 rounded bg-white text-gray-700 text-sm font-medium border border-gray-200 hover:bg-gray-100 transition">
          <span>&#128221;</span> Add note
        </button>
        <button
          className="flex items-center gap-1 px-3 py-1 rounded bg-white text-gray-700 text-sm font-medium border border-gray-200 hover:bg-gray-100 transition"
          onClick={onForward}
        >
          <span>&#8594;</span> Forward
        </button>
      </div> */}
      {/* Rich editor below reply bar */}
      {/* {(showEditor || showReplyEditor) && ( */}
      <div className="rounded w-full   flex flex-col absolute bottom-0 overflow-hidden">
        <Accordion
          elevation={0}
          expanded={showEditor}
          onChange={handleReplyButton}
          sx={{
            position: "relative",
            background: "transparent",
            boxShadow: "none",
            "&:before": { display: "none" },
          }}
        >
          {/* {!showEditor && ( */}
          <AccordionSummary
            expandIcon={showEditor ? null : <ExpandMoreIcon />}
            aria-controls="panel2-content"
            id="panel2-header"
            sx={{
              backgroundColor: showEditor ? "transparent" : "#f9fafb",
              border: showEditor ? "none" : "1px solid #d1d5db",
              borderRadius: "4px",
              padding: "4px 12px",
              minHeight: "40px !important",
              display: "flex",
              alignItems: "center",
              cursor: "text !important",
              "&:hover": {
                borderColor: showEditor ? "transparent" : "#9ca3af",
                backgroundColor: showEditor ? "transparent" : "#f3f4f6",
              },
              "& .MuiAccordionSummary-content": {
                margin: 0,
              },
            }}
          >
            {!showEditor && (
              <Typography
                component="span"
                sx={{ fontSize: "14px", color: "#374151", fontStyle: "italic" }}
              >
                Reply....
              </Typography>
            )}
          </AccordionSummary>
          {/* // )} */}

          <AccordionDetails sx={{ p: 0, height: "100%" }}>
            {/* <AnimatePresence>
              {showEditor && (
                <motion.div
                  key="editor-container"
                  initial={{ y: 200, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 200, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="rounded p-0 flex flex-col overflow-hidden w-full h-full"
                > */}
            <div
              ref={shotcutRef}
              style={{
                overflow: "hidden",
                backgroundColor: "#fff",
                padding: 0,
                maxHeight: "100%",
              }}
            >
              {/* Signature indicator */}
              {/* {hasSignature(signature) && selectedOptionValue !== "1" && (
                <div className="bg-green-50 border-l-4 border-green-400 p-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-green-600 text-sm font-medium">
                      ✓ Signature Active
                    </span>
                    <span className="text-green-500 text-xs">
                      {getCurrentSignatureName()}
                    </span>
                  </div>
                </div>
              )} */}
              <StackEditor
                initialContent={markdown}
                signatureValue={signature}
                onChange={handleEditorChange}
                key={`editor-${stateChangeKey}-${signatureUpdateKey}`}
                isEditorExpended={isEditorExpended}
                isExpended={() => setIsEditorExpended(!isEditorExpended)}
                onCloseReply={() => setShowEditor(false)}
              />
            </div>

            {showShotcut && (
              <ShortCutPopover
                open={showShotcut}
                close={() => setShowShotcut(false)}
                anchorEl={shotcutRef}
                width={600}
              >
                <ShotCutContent
                  onChange={(e: any) => {
                    setMarkdown((prev) => prev?.replace(/\/$/, e));
                  }}
                  onClose={() => setShowShotcut(false)}
                  stateChangeKey={() => setStateChangeKey((prev) => prev + 1)}
                />
              </ShortCutPopover>
            )}

            <div className="w-full flex items-center justify-between gap-2 mt-2">
              <div className="flex items-center gap-2">
                <FormControl fullWidth>
                  <Select
                    value={selectedOptionValue}
                    onChange={(e) => {
                      handleSignatureChange(e.target.value);
                    }}
                    size="small"
                    sx={{
                      width: 300,
                      "& fieldset": { border: "none" },
                      "& .MuiOutlinedInput-notchedOutline": {
                        border: "none",
                      },
                    }}
                  >
                    {signatureValues.map((item: any) => (
                      <MenuItem
                        key={item?.id}
                        value={item?.value}
                        sx={{ width: 300 }}
                      >
                        <div className="flex items-center justify-between w-full">
                          <span>{item?.name}</span>
                          {hasSignature(markdown) &&
                            item.value === selectedOptionValue &&
                            item.value !== "1" && (
                              <Chip
                                label="Active"
                                size="small"
                                color="success"
                                sx={{ fontSize: "0.7rem", height: "20px" }}
                              />
                            )}
                        </div>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <div className="flex items-center gap-2">
                  {images?.length > 0 && (
                    <CustomToolTip
                      title={<ImageViewComponent images={images} />}
                      open={showImagesModal}
                      close={() => setShowImagesModal(false)}
                      placement={"top"}
                    >
                      <span
                        className="bg-[#0891b2] w-6 text-sm rounded-full h-6 flex items-center justify-center text-white cursor-pointer"
                        onClick={() => setShowImagesModal(true)}
                      >
                        {images.length}
                      </span>
                    </CustomToolTip>
                  )}
                  <Divider orientation="vertical" flexItem />
                  <CustomToolTip
                    title={"Attach file < 10MB"}
                    placement={"top-start"}
                  >
                    <div className="flex items-center gap-1">
                      {" "}
                      <input
                        type="file"
                        accept="image/*"
                        ref={fileInputRef}
                        style={{ display: "none" }}
                        onChange={handleFileChange}
                      />
                      <IconButton size="small" onClick={handleIconClick}>
                        <AttachFileIcon
                          fontSize="small"
                          sx={{ transform: "rotate(45deg)" }}
                        />
                      </IconButton>
                    </div>
                  </CustomToolTip>
                  <Divider orientation="vertical" flexItem />
                  <CustomToolTip title={"Canned Responses"}>
                    <IconButton
                      size="small"
                      onClick={() => {
                        setSuggest(false);
                        setCanned(!canned);
                      }}
                    >
                      <PublishedWithChangesIcon fontSize="small" />
                    </IconButton>
                  </CustomToolTip>
                  <Divider orientation="vertical" flexItem />
                  <CustomToolTip title={"Suggested Solutions"}>
                    <IconButton
                      size="small"
                      onClick={() => {
                        setCanned(false);
                        setSuggest(!suggest);
                      }}
                    >
                      <MenuBookIcon fontSize="small" />
                    </IconButton>
                  </CustomToolTip>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  className="bg-gray-200 text-gray-700 px-4 py-1.5 rounded font-semibold text-sm hover:bg-gray-300"
                  onClick={() => {
                    setMarkdown("");
                    setSignature("");
                    setSelectedOptionValue("1"); // Reset to "None"
                    setStateChangeKey((prev) => prev + 1);
                    setSignatureUpdateKey(0); // Reset signature update key
                  }}
                >
                  Reset
                </button>
                <button
                  className="bg-[#0891b2] text-white px-4 py-1.5 rounded font-semibold text-sm hover:bg-[#0ca5c9]"
                  onClick={handleSave}
                >
                  Save
                </button>
              </div>
            </div>
            {/* </motion.div> */}
            {/* )} */}
            {/* </AnimatePresence> */}
          </AccordionDetails>
        </Accordion>
      </div>

      <CustomSideBarPanel
        open={canned}
        close={() => setCanned(false)}
        title={
          <span>
            {" "}
            <PublishedWithChangesIcon fontSize="small" /> Canned Responses
          </span>
        }
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            height: "100%",
            gap: 2,
          }}
        >
          {/* Accordion Item 1 */}
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              sx={{
                "& .MuiAccordionSummary-content": {
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  width: "100%",
                },
              }}
            >
              {/* Left Section (Expand Icon + Title) */}
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Typography>Section 1</Typography>
              </Box>

              {/* Right Section (Custom Add Icon) */}
              <IconButton
                size="small"
                onClick={(e: any) => {
                  e.stopPropagation(); // Prevent accordion toggle
                  setMarkdown(
                    (prevMarkdown) =>
                      prevMarkdown + "Content for section 1 inside the drawer."
                  );
                }}
              >
                <AddBoxIcon />
              </IconButton>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>Content for section 1 inside the drawer.</Typography>
            </AccordionDetails>
          </Accordion>
        </Box>
        {/* </div> */}
      </CustomSideBarPanel>

      <CustomSideBarPanel
        open={suggest}
        close={() => setSuggest(false)}
        title={
          <span>
            {" "}
            <MenuBookIcon fontSize="small" /> Solution
          </span>
        }
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            height: "100%",
            gap: 2,
          }}
        >
          {shotcutData?.length > 0 ? (
            <>
              {(shotcutData ?? [])?.map((item: any) => (
                <ListItem
                  key={item.id}
                  disablePadding
                  sx={{
                    backgroundColor: "#fff",
                    borderBottom: "1px solid #e5e7eb", // Tailwind border-gray-200
                    px: 2,
                    py: 1,
                  }}
                >
                  <Box display="flex" gap={2} width="100%" alignItems="center">
                    <Box flex={1}>
                      <Typography
                        variant="subtitle2"
                        fontWeight={600}
                        sx={{
                          color: "#2c3e50",
                          fontSize: "0.9rem",
                          lineHeight: 1.2,
                          mb: 0.5,
                        }}
                      >
                        {item.shortcutName}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: "#4b5563", // Tailwind text-gray-600
                          fontSize: "0.85rem",
                          lineHeight: 1.4,
                        }}
                      >
                        {item.message}
                      </Typography>
                    </Box>

                    <Box display="flex" gap={1}>
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          setMarkdown(
                            (prevMarkdown) => prevMarkdown + ` ${item.message}`
                          );
                        }}
                      >
                        <AddBoxIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </Box>
                </ListItem>
              ))}
            </>
          ) : (
            <div className="flex flex-col items-center mt-4">
              <img
                src={"/image/empty.svg"}
                alt="notes"
                className="mx-auto w-40 h-40"
              />
            </div>
          )}
        </Box>
      </CustomSideBarPanel>
    </div>
  );
};

export default TicketThreadSection;
