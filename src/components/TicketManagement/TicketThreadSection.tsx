import React, { useCallback, useEffect, useState } from "react";
import ReplyIcon from "@mui/icons-material/Reply";
import EditIcon from "@mui/icons-material/Edit";
import CommentIcon from "@mui/icons-material/Comment";
import DeleteIcon from "@mui/icons-material/Delete";
import StackEditor from "../Editor";

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
} from "@mui/material";

import ShortCutPopover from "../shared/ShortCutPopover";
import ShotCutContent from "../ShotCutContent";

import ShortcutIcon from "@mui/icons-material/Shortcut";
import { AnimatePresence, motion } from "framer-motion";
import { set } from "react-hook-form";

const signatureValues: any = [
  {
    id: 1,
    name: "None",
    value: "1",
  },
  {
    id: 2,
    name: "My Signature",
    value: "2",
  },
  {
    id: 3,
    name: "Department Signature (Support)",
    value: "3",
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
  const [ticketStatus, setTicketStatus] = useState(header?.status || "open");
  const [showEditor, setShowEditor] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [markdown, setMarkdown] = useState("");
  const [showShotcut, setShowShotcut] = useState(false);
  const [slashTriggered, setSlashTriggered] = useState(false);
  const shotcutRef = React.useRef(null);
  const [stateChangeKey, setStateChangeKey] = useState(0);
  const [isEditorExpended, setIsEditorExpended] = useState(false);
  const [selectedOptionValue, setSelectedOptionValue] = useState("1");
  const [editorLoading, setEditorLoading] = useState(false);

  const handleChangeValue = (event: any) => {
    setSelectedOptionValue(event);
  };

  useEffect(() => {
   if (editorLoading) {
    setTimeout(() => {
        setEditorLoading(false);
      setShowEditor(true);
    
    }, 500);
   }
  }, [editorLoading])
  

  const handleEditorChange = (value: string) => {
    if (value === null) {
      return;
    }
    const text: any = value?.replace(/<[^>]*>/g, "");

    if (!slashTriggered && text?.includes("/")) {
      setShowShotcut(true);
      setSlashTriggered(true);
    }

    // Reset trigger if "/" is removed
    if (!text.includes("/")) {
      setSlashTriggered(false);
    }

    setMarkdown(text);
  };
  useEffect(() => {
    if (slashTriggered || !markdown) return;
    setShowShotcut(false);
  }, [slashTriggered, markdown]);

  // Handler for Reply button
  const handleReplyButton = () => {
    setEditorLoading(true);
   
  };

  console.log(markdown);

  // Handler for Save button
  const handleSave = () => {
    if (markdown === null || !markdown) {
      return;
    }
    if (markdown && markdown.trim()) {
      // console.log("Saving reply:", markdown);
      onSendReply(markdown);
      setMarkdown("");
      setShowEditor(false);
      if (onCloseReply) onCloseReply();
    }
  };

  return (
    <div className="flex flex-col gap-2   min-h-[570px] relative">
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

      {!showEditor ? (
        <div className="rounded w-full   px-4 flex flex-col   absolute bottom-0  ">
          <span
            contentEditable
            suppressContentEditableWarning
            className="flex-1 border px-4 py-1 rounded bg-gray-50 text-sm outline-none focus:ring-1 focus:ring-cyan-400"
            onClick={handleReplyButton}
          >
            Reply
          </span>
        </div>
      ) : (
        <AnimatePresence>
          <motion.div
            initial={{ y: "-100%", opacity: 0 }}
            animate={{ y: "0%", opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{
              duration: 0.5,
              ease: [0.25, 0.1, 0.25, 1],
            }}
            className="w-full h-full z-99"
          >
            <div className=" rounded   p-0 flex flex-col bg-red-100  w-full h-full   absolute bottom-0  ">
              <div
                ref={shotcutRef}
                style={{
                  // height: 250,
                  // width: 985,
                  overflow: "auto",
                  background: "#fff",
                  // borderRadius: 8,
                  // border: "1px solid #e5e7eb",
                  padding: 0,
                }}
              >
                <StackEditor
                  initialContent={markdown}
                  onChange={handleEditorChange}
                  key={stateChangeKey}
                  isEditorExpended={isEditorExpended}
                  isExpended={() => setIsEditorExpended(!isEditorExpended)}
                  onCloseReply={() => setShowEditor(false)}
                />
              </div>
              {showShotcut && (
                <ShortCutPopover
                  open={showShotcut}
                  close={() => setShowShotcut(false)}
                  //@ts-ignore
                  anchorEl={shotcutRef}
                  width={600}
                  // height={360}
                >
                  <ShotCutContent
                    onChange={(e: any) => {
                      setMarkdown((prev: any) => {
                        return prev?.replace(/\/$/, e);
                      });
                    }}
                    onClose={() => {
                      // setSlashTriggered(false);
                      setShowShotcut(false);
                    }}
                    stateChangeKey={() => setStateChangeKey((prev) => prev + 1)}
                  />
                </ShortCutPopover>
              )}
              <div className="w-full flex items-center justify-between gap-2 mt-2">
                <div className="flex items-center  gap-2">
                  <FormControl fullWidth>
                    {/* <InputLabel id="demo-simple-select-label">Add Element</InputLabel> */}
                    <Select
                      id="demo-simple-select"
                      value={selectedOptionValue}
                      onChange={(e) => handleChangeValue(e.target.value)}
                      size="small"
                      sx={{
                        width: 300,
                        "& fieldset": { border: "none" }, // Removes the outline border
                        "& .MuiOutlinedInput-notchedOutline": {
                          border: "none",
                        }, // Another safe way
                      }}
                    >
                      {signatureValues.map((item: any) => (
                        <MenuItem
                          key={item?.id}
                          value={item?.value}
                          sx={{ width: 300 }}
                        >
                          {item?.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <div className="flex items-center gap-2">
                    <Divider orientation="vertical" flexItem />
                    <IconButton size="small">
                      <AttachFileIcon fontSize="small" />
                    </IconButton>
                    <Divider orientation="vertical" flexItem />
                    <IconButton size="small">
                      <PublishedWithChangesIcon fontSize="small" />
                    </IconButton>
                    <Divider orientation="vertical" flexItem />
                    <IconButton size="small">
                      <MenuBookIcon fontSize="small" />
                    </IconButton>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    className="bg-gray-200 text-gray-700 px-4 py-1.5 rounded font-semibold text-sm hover:bg-gray-300"
                    onClick={() => {
                      setMarkdown("");
                      setStateChangeKey((prev) => prev + 1);
                    }}
                  >
                    Reset
                  </button>
                  <button
                    className="bg-[#0891b2] text-white px-4 py-1.5 rounded font-semibold text-sm hover:bg-[#0ca5c9] "
                    onClick={handleSave}
                  >
                    Save
                  </button>
                </div>
              </div>{" "}
            </div>
          </motion.div>
        </AnimatePresence>
      )}
    <Dialog
      open={editorLoading}
      // onClose={close}
      BackdropProps={{
        sx: {
          backgroundColor: "rgba(0, 0, 0, 0.4)",
          // backdropFilter: "blur(1px)",
          // WebkitBackdropFilter: "blur(1px)",
        },
      }}
      PaperProps={{
        sx: {
          overflow: "visible",
          borderRadius: 3,
          p: 3,
          pt: 6,
          minWidth: 500,
          border: "3px solid #1b8fbdff",
          background: "#fefff4ff",
        },
      }}
      // className=" bg-gradient-to-br from-[#d7f1f3] to-[#d7f1f3]"
    >
      
      <DialogTitle sx={{ textAlign: "center", fontWeight: "bold" }}>
        Please Wait ......
      </DialogTitle>

      <DialogContent
        sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
      >
        <CircularProgress color="primary" />
      </DialogContent>

    </Dialog>
      {/* )} */}
    </div>
  );
};

export default TicketThreadSection;
