import React, { useCallback, useEffect, useRef, useState } from "react";
import ReplyIcon from "@mui/icons-material/Reply";
import EditIcon from "@mui/icons-material/Edit";
import CommentIcon from "@mui/icons-material/Comment";
import DeleteIcon from "@mui/icons-material/Delete";
import StackEditor from "../Editor";
import AddBoxIcon from "@mui/icons-material/AddBox";
import StarIcon from "@mui/icons-material/Star";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
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
  MenuList,
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

const replyOptions = [
  {
    id: 1,
    name: "Forward",
    value: "1",
    icon: <ShortcutIcon sx={{ fontSize: 18 }} />,
  },
  {
    id: 2,
    name: "Edit",
    value: "2",
    icon: <EditIcon sx={{ fontSize: 18 }} />,
  },
  {
    id: 3,
    name: "Delete",
    value: "3",
    icon: <DeleteIcon sx={{ fontSize: 18 }} />,
  },
];

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

  const optionsRef = React.useRef<any>(null);
  const [hovered, setHovered] = useState<number | null>(null);
  const [selected, setSelected] = useState<number>(0);

  const handleReplyClick = (e: any) => {
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

  function handleListKeyDown(event: any) {
    if (event.key === "Tab") {
      event.preventDefault();
      setOpen(false);
    } else if (event.key === "Escape") {
      setOpen(false);
    }
  }

  const handleClose = (event: any) => {
    if (optionsRef.current && optionsRef.current.contains(event.target)) {
      return;
    }

    setOpen(false);
  };

  const handleSelect = (value: string) => {
    if (value === "1") {
      handleReplyClick(null);
      setOpen(false);
    } else if (value === "2") {
    } else {
    }
  };

  const renderReplyOption = (
    <Paper
      elevation={0}
      sx={{
        width: 100,
        backgroundColor: "transparent",
      }}
    >
      <ClickAwayListener onClickAway={handleClose}>
        <MenuList
          autoFocusItem={open}
          id="composition-menu"
          aria-labelledby="composition-button"
          onKeyDown={handleListKeyDown}
        >
          {replyOptions.map((item, index) => {
            // const isSelected = selectedIndex === item.value;
            return (
              <MenuItem
                key={index}
                onClick={() => handleSelect(item.value)}
                // selected={isSelected}
                sx={{
                  mb: 0.5,
                  display: "flex",
                  justifyContent: "flex-start",
                  alignItems: "center",
                  width: "100%",
                  borderRadius: "0px",
                  // px: 2,
                  // py: 1,
                  backgroundColor: "transparent",
                  color: "#000",
                  transition: "all 0.2s ease",
                  "&:hover": {
                    backgroundColor: "#d2d3d4a6",
                    color: "#000",
                  },
                  "&.Mui-selected": {
                    backgroundColor: "#e6e7e7bd !important",
                    color: "#000 !important",
                    "&:hover": {
                      backgroundColor: "#b4b4b4a6 !important",
                    },
                  },
                }}
              >
                {/* <CheckIcon sx={{ color: "#000", fontSize: 18, ml: 2 }} /> */}
                {item.icon}
                <span className="ml-2">{item.name}</span>
              </MenuItem>
            );
          })}
        </MenuList>
      </ClickAwayListener>
    </Paper>
  );
  // Check if this is the current user's message or someone else's
  const isCurrentUser =
    item.repliedBy?.name === "Current User" || item.repliedBy?.name === "You"; // Adjust this condition based on your user identification logic

  return (
    <div className="flex p-2 overflow-auto gap-3 mb-6">
      {/* Email content */}
      <div className="flex-1">
        <div
          className={`rounded flex ${
            isCurrentUser ? " flex-row-reverse" : "flex-row "
          }`}
        >
          <div className="w-20 relative flex px-4 py-2">
            <div
              style={{
                position: "absolute",
                top: "15px",
                [isCurrentUser ? "left" : "right"]: `0px`,
                width: 0,
                height: 0,
                borderTop: "10px solid transparent",
                borderBottom: "10px solid transparent",
                [isCurrentUser ? "borderLeft" : "borderRight"]:
                  "12px solid #ebebebff",
              }}
            />
            {item.repliedBy?.avatarUrl ? (
              <img
                src={item.repliedBy.avatarUrl}
                alt={item.repliedBy.name}
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-lg font-bold text-gray-600 border border-[#c3d9ff]">
                {item.repliedBy?.name?.[0] || "?"}
              </div>
            )}
          </div>
          <div className="w-full flex flex-col items-center justify-between bg-[#fff] border border-gray-200">
            <div className="flex items-center justify-between w-full px-4 py-2">
              <div className="w-full flex flex-col">
                <div className="flex items-center justify-between w-full">
                  <span className="font-semibold text-[#0891b2]">
                    {item.repliedBy?.name || "User"}
                  </span>
                  <div>
                    <span className="text-xs text-gray-400">
                      {item.repliedAt?.timestamp}
                    </span>{" "}
                    <CustomToolTip
                      title={renderReplyOption}
                      open={open}
                      placement={"bottom-end"}
                    >
                      <IconButton
                        size="small"
                        onClick={() => setOpen(true)}
                        ref={optionsRef}
                      >
                        <ArrowDropDownIcon />
                      </IconButton>
                    </CustomToolTip>
                  </div>
                </div>

                <span className="w-4/5 text-xs text-gray-500">
                  added a private note
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between w-full py-3 px-4 bg-white border-t-2 border-[#c3d9ff] bg-[#f4f8ff]">
              <span className="text-xs text-gray-500">Rate this response</span>
              <span className="flex gap-1">
                {Array.from({ length: 5 }).map((_, idx) => {
                  const isActive =
                    hovered !== null ? idx <= hovered : idx < selected;

                  return (
                    <StarIcon
                      key={idx}
                      sx={{
                        color: isActive ? "#fbbf24" : "#a4a4a4ff",
                        cursor: "pointer",
                        fontSize: "18px",
                        transition: "all 0.2s ease",
                        "&:hover": {
                          color: "#fbbf24",
                          transform: "scale(1.1)",
                        },
                      }}
                      onMouseEnter={() => setHovered(idx)}
                      onMouseLeave={() => setHovered(null)}
                      onClick={() => {
                        setSelected(idx + 1);
                        // You can add API call here to save the rating
                        console.log(`Rated ${idx + 1} stars`);
                      }}
                    />
                  );
                })}
                {selected > 0 && (
                  <span className="ml-2 text-xs text-gray-600">
                    {selected} star{selected > 1 ? "s" : ""}
                  </span>
                )}
              </span>
            </div>
          </div>
        </div>
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
  showReplyEditor,
  showEditorNote,
  onCloseReply,
  value,
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
      if (selectedSignature.value === "1") {
        // "None" → clear signature
        setSignature(""); // Clear signature state
      } else {
        // Set new signature content
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

    // Store the full HTML content (Editor component now handles signature separation)
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

  useEffect(() => {
    if (!value) return;
    handleReplyButton();
  }, [value]);

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

  const handleRemoveImage = (index: number) => {
    const updatedImages = [...images];
    updatedImages.splice(index, 1);
    setImages(updatedImages);
  };
  const onReplyClose = (value: boolean) => {
    setShowEditor(value);
  };

  console.log(showEditor);

  return (
    <div className="flex flex-col gap-2    overflow-y-auto ">
      <div className="p-2">
        <TicketSubjectBar header={header} />
        <div className="flex flex-col gap-2  h-[100vh] overflow-y-auto relative  ">
          <ThreadList thread={thread} onForward={onForward} />
          <div className="rounded  w-full  flex flex-col absolute bottom-0 overflow-hidden">
            <Accordion
              elevation={0}
              expanded={showEditor || showReplyEditor || showEditorNote}
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
                expandIcon={
                  showEditor || showReplyEditor || showEditorNote ? null : (
                    <ExpandMoreIcon sx={{ transform: "rotate(180deg)" }} />
                  )
                }
                aria-controls="panel2-content"
                id="panel2-header"
                sx={{
                  // mx: 1,
                  backgroundColor:
                    showEditor || showReplyEditor || showEditorNote
                      ? "transparent"
                      : "#f9fafb",
                  border:
                    showEditor || showReplyEditor || showEditorNote
                      ? "none"
                      : "1px solid #d1d5db",
                  borderRadius: "50px",
                  padding: "4px 25px",
                  // width: "100% !important",
                  minHeight: "55px !important",
                  display: "flex",
                  alignItems: "center",
                  cursor: "text !important",
                  "&:hover": {
                    borderColor:
                      showEditor || showReplyEditor || showEditorNote
                        ? "transparent"
                        : "#9ca3af",
                    backgroundColor:
                      showEditor || showReplyEditor || showEditorNote
                        ? "transparent"
                        : "#f3f4f6",
                  },
                  "& .MuiAccordionSummary-content": {
                    margin: 0,
                    borderRadius: "none",
                  },
                }}
              >
                {!showEditor && !showReplyEditor && !showEditorNote && (
                  <Typography
                    component="span"
                    sx={{
                      fontSize: "14px",
                      color: "#374151",
                      fontStyle: "italic",
                      borderRadius: "none",
                    }}
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
                    onCloseReply={() => onReplyClose(false)}
                    isValues={value}
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
                      stateChangeKey={() =>
                        setStateChangeKey((prev) => prev + 1)
                      }
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
                          title={
                            <ImageViewComponent
                              images={images}
                              onRemove={handleRemoveImage}
                            />
                          }
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
