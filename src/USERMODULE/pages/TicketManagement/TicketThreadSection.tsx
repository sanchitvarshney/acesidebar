import React, { useCallback, useEffect, useRef, useState } from "react";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import StackEditor from "../../../components/reusable/Editor";
import AddBoxIcon from "@mui/icons-material/AddBox";
import StarIcon from "@mui/icons-material/Star";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import EmojiFlagsIcon from "@mui/icons-material/EmojiFlags";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import PublishedWithChangesIcon from "@mui/icons-material/PublishedWithChanges";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import emptyimg from "../../../assets/image/overview-empty-state.svg";
import web from "../../../assets/icons/ticket_source_web.gif";
import email from "../../../assets/icons/ticket_source_email.gif";
import fileicon from "../../../assets/archive.png";
import DownloadIcon from "@mui/icons-material/Download";
import {
  FormControl,
  Select,
  MenuItem,
  IconButton,
  Divider,
  Typography,
  Chip,
  ClickAwayListener,
  Box,
  Paper,
  ListItem,
  Alert,
  MenuList,
  Drawer,
  Tooltip,
  Button,
  Avatar,
  CircularProgress,
  List,
  ListItemText,
} from "@mui/material";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AddTaskIcon from '@mui/icons-material/AddTask';
import ShotCutContent from "../../components/ShotCutContent";
import ShortcutIcon from "@mui/icons-material/Shortcut";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../reduxStore/Store";
import ImageViewComponent from "../../components/ImageViewComponent";

import {
  setForwardData,
  setReplyValue,
} from "../../../reduxStore/Slices/shotcutSlices";
import CustomModal from "../../../components/layout/CustomModal";
import {
  useCommanApiMutation,
  useGetAttacedFileQuery,
  useGetShortCutListQuery,
} from "../../../services/threadsApi";
import CustomToolTip from "../../../reusable/CustomToolTip";
import { v4 as uuidv4 } from "uuid";
import {
  useAttachedFileMutation,
  useLazyDownloadAttachedFileQuery,
} from "../../../services/uploadDocServices";
import { useToast } from "../../../hooks/useToast";
import { useParams } from "react-router-dom";

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
  onForward,
  marginBottomClass,
  subject,
}: any) => {
  const [commanApi] = useCommanApiMutation();
  const { showToast } = useToast();
  const [open, setOpen] = useState(false);
  const [isReported, setIsReported] = useState<boolean>(false);
  const ticketId = useParams().id;
  const optionsRef = React.useRef<any>(null);
  const [hovered, setHovered] = useState<number | null>(null);
  const [selected, setSelected] = useState<number>(0);
  const [trackDownloadId, setTrackDownloadId] = useState<string>("");

  const dispatch = useDispatch();
  const [triggerDownload, { isLoading: isDownloading }] =
    useLazyDownloadAttachedFileQuery();

  const handleReplyClick = (e: any) => {
    onForward();
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
      const payloadForward = {
        subject: `#Forward: ${subject}`,
        message: item.message,
      };
      dispatch(setForwardData(payloadForward));

      handleReplyClick(null);
      setOpen(false);
    } else if (value === "2") {
    } else {
    }
  };

  const handleReview = (value: any) => {
    const pathId = window.location.pathname.split("/").pop();

    setSelected(value);
    const payload = {
      url: "review-ticket",
      body: {
        ticket: pathId,
        rate: value,
        thread: item.entryId,
      },
    };

    commanApi(payload)
      .then((response) => { })
      .catch((error) => { });
  };

  const downloadFile = async (fileId: string, fileName: string) => {
    if (!fileId || !ticketId) {
      showToast("Invalid attachment ID or ticketId", "error");
      return;
    }

    const payload = {
      ticketNumber: ticketId,
      signature: fileId,
    };

    try {
      const res = await triggerDownload(payload).unwrap();

      if (res instanceof Blob) {
        const url = window.URL.createObjectURL(res);
        const a = document.createElement("a");
        a.href = url;
        a.download = fileName || "attachment";
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
        a.download = "attachment";
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
      console.log(error);
      showToast("Failed to download file", "error");
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
  //@ts-ignore
  const isCurrentUser = item?.replyType === "S";
  const bubbleBackgroundColor = isReported
    ? "#fee2e2"
    : isCurrentUser
      ? "#f7faff"
      : "#fafafa";
  const bubbleFooter = isCurrentUser
    ? "IP: 127.0.0.1 | Location: India"
    : "IP: 127.0.0.1 | Location: India";
  // const isRatingDisabled = isCurrentUser;

  const decodeHtmlEntities = (encoded: string) => {
    try {
      const textarea = document.createElement("textarea");
      textarea.innerHTML = encoded ?? "";
      return textarea.value;
    } catch {
      return encoded ?? "";
    }
  };

  const sanitizeMessageHtml = (html: string) => {
    if (!html) return "";
    let out = html;
    // Remove script tags and their content
    out = out.replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "");
    // Remove event handler attributes like onclick, onerror, etc. (both quote styles)
    out = out.replace(/on[a-z]+\s*=\s*"[^"]*"/gi, "");
    out = out.replace(/on[a-z]+\s*=\s*'[^']*'/gi, "");
    // Neutralize javascript: URLs
    out = out.replace(/href\s*=\s*"javascript:[^"]*"/gi, 'href="#"');
    out = out.replace(/href\s*=\s*'javascript:[^']*'/gi, "href='#'");
    out = out.replace(/src\s*=\s*"javascript:[^"]*"/gi, 'src="#"');
    out = out.replace(/src\s*=\s*'javascript:[^']*'/gi, "src='#'");
    return out;
  };

  const handleReportTicket = () => {
    const payload = {
      url: `report-ticket/${item.entryId}`,
      method: "GET",
    };
    commanApi(payload)
      .then((response) => { })
      .catch((error) => { });
    setIsReported((v) => !v);
  };

  return (
    <div className={`w-full flex p-2 overflow-auto ${marginBottomClass}`}>
      {/* Email content */}
      <div className="flex-1">
        <div
          className={`rounded flex ${isCurrentUser ? " flex-row-reverse" : "flex-row "
            }`}
        >
          <div className=" relative flex px-4 py-2 flex-col items-center">
            <div
              style={{
                position: "absolute",
                top: "15px",
                [isCurrentUser ? "left" : "right"]: `0px`,
                width: 0,
                height: 0,
                borderTop: "10px solid transparent",
                borderBottom: "10px solid transparent",
                [isCurrentUser
                  ? "borderLeft"
                  : "borderRight"]: `12px solid ${bubbleBackgroundColor}`,
              }}
            />
            <div
              style={{
                position: "absolute",
                top: "15px",
                [isCurrentUser ? "left" : "right"]: `-20px`,
              }}
            >
              {item.repliedBy?.avatarUrl ? (
                // <img
                //   src={item.repliedBy.avatarUrl}
                //   alt={item.repliedBy.name}
                //   className="w-10 h-10 rounded-full object-cover"
                // />
                <Avatar
                  src={item.repliedBy.avatarUrl}
                  alt={item.repliedBy.name}
                  className="w-10 h-10 rounded-full object-cover"
                  sx={{
                    backgroundColor: isCurrentUser
                      ? "hsl(45deg 100% 51.37%)"
                      : "primary.main",
                  }}
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-lg font-bold text-gray-600 border border-[#c3d9ff]">
                  <Avatar
                    sizes="sm"
                    sx={{
                      backgroundColor: isCurrentUser
                        ? "hsl(45deg 100% 51.37%)"
                        : "primary.main",
                    }}
                  >
                    {item.repliedBy?.name?.[0]}
                  </Avatar>
                </div>
              )}
            </div>
            <div
              style={{
                position: "absolute",
                top: "60px",
                [isCurrentUser ? "left" : "right"]: `-16px`,
              }}
            >
              {!isCurrentUser && (
                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-lg font-bold text-gray-600 border border-[#c3d9ff]">
                  <IconButton size="small" onClick={handleReportTicket}>
                    <EmojiFlagsIcon
                      sx={{ color: isReported ? "#ef4444" : "#9ca3af" }}
                      fontSize="small"
                    />
                  </IconButton>
                </div>
              )}
            </div>
          </div>
          <div
            className="w-[100%] flex flex-col items-center justify-between border border-gray-200 shadow-[0_2px_3px_0_rgb(172,172,172,0.4)] rounded-lg"
            style={{ backgroundColor: bubbleBackgroundColor }}
          >
            <div className="flex items-center justify-between  w-full px-8 py-2">
              <div className={`w-full  flex flex-col`}>
                <div
                  className={`flex  items-center justify-between  w-full border-b-2 border-gray-200 pb-4  ${isCurrentUser ? " flex-row-reverse" : "flex-row "
                    }`}
                >
                  <span className="font-semibold text-[#1a73e8] text-sm">
                    {item.repliedBy?.name || "User"}
                  </span>
                  <div className="flex flex-col ">
                    <div
                      className={`flex items-center gap-2 ${isCurrentUser ? "justify-start" : "justify-end"
                        }`}
                    >
                      <img src={isCurrentUser ? email : web} alt="ip" />
                      <span className="text-xs text-gray-400 ">
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
                          <ArrowDropDownIcon fontSize="small" />
                        </IconButton>
                      </CustomToolTip>
                    </div>
                    <span className="text-xs text-gray-500">
                      {bubbleFooter}
                    </span>
                  </div>
                </div>

                <div
                  className="w-4/5 text-xs text-gray-500 my-3 message-container"
                  dangerouslySetInnerHTML={{
                    __html: sanitizeMessageHtml(
                      decodeHtmlEntities(item?.message)
                    ),
                  }}
                />
                {item?.attachments.length > 0 && (
                  <div className="mt-4">
                    <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                      Attachments ({item?.attachments?.length} files)
                    </Typography>
                    <List
                      disablePadding
                      sx={{ width: 260, bgcolor: "transparent", px: 0.8 }}
                    >
                      {item?.attachments?.map((file: any) => (
                        <ListItem disablePadding key={file?.fileSignature}>
                          <ListItemText
                            primary={
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <span>
                                    <img
                                      src={fileicon}
                                      alt=""
                                      className="w-5"
                                    />
                                  </span>
                                  <span
                                    style={{
                                      display: "inline-block",
                                      maxWidth: "120px", // adjust width
                                      whiteSpace: "nowrap",
                                      overflow: "hidden",
                                      textOverflow: "ellipsis",
                                      verticalAlign: "bottom",
                                    }}
                                  >
                                    {file?.fileName}
                                  </span>
                                </div>
                                <IconButton
                                  size="small"
                                  onClick={() => {
                                    setTrackDownloadId(file?.fileSignature);
                                    downloadFile(
                                      file?.fileSignature,
                                      file?.fileName
                                    );
                                  }}
                                >
                                  {isDownloading &&
                                    trackDownloadId === file?.fileSignature ? (
                                    <CircularProgress size={16} />
                                  ) : (
                                    <DownloadIcon fontSize="small" />
                                  )}
                                </IconButton>
                              </div>
                            }
                          />
                        </ListItem>
                      ))}
                    </List>
                  </div>
                )}
              </div>
            </div>
            <div
              className="flex items-center justify-between w-full py-3 px-8 bg-white border-t-2 border-[#c3d9ff] bg-[#e2f2fd] rounded-b-lg"
              style={{ borderTopColor: isReported ? "#ffb6b6" : "#c3d9ff" }}
            >
              {/* {item?.attachments.length > 0 ? (
                <span className="text-xs text-gray-500 cursor-pointer hover:text-decoration-underline ">
                  {item?.attachments.fileName}
                </span>
              ) : ( */}
              <span />
              {/* )} */}
              {!isCurrentUser && (
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
                          opacity: 1,
                          fontSize: "18px",
                          transition: "all 0.2s ease",
                          pointerEvents: "auto",
                          "&:hover": {
                            color: "#fbbf24",
                            transform: "scale(1.1)",
                          },
                        }}
                        onMouseEnter={() => setHovered(idx)}
                        onMouseLeave={() => setHovered(null)}
                        onClick={() => handleReview(idx + 1)}
                      />
                    );
                  })}
                  {selected > 0 && (
                    <span className="ml-2 text-xs text-gray-600">
                      {selected} star{selected > 1 ? "s" : ""}
                    </span>
                  )}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ThreadList = ({ thread, onReplyClick, onForward, subject }: any) => (
  <div className="">
    {thread && thread.length > 0 ? (
      thread.map((item: any, idx: number) => {
        const next = thread[idx + 1];
        const isCurrentStaff = item?.replyType === "S";
        const isNextStaff = next ? next?.replyType === "S" : undefined;
        const marginBottomClass =
          next === undefined || isCurrentStaff !== isNextStaff
            ? "mb-10"
            : "mb-3";

        return (
          <ThreadItem
            key={idx}
            item={item}
            onReplyClick={onReplyClick}
            onForward={onForward}
            marginBottomClass={marginBottomClass}
            subject={subject}
          />
        );
      })
    ) : (
      <div className="text-gray-400">No thread items.</div>
    )}
  </div>
);

const TicketThreadSection = ({
  thread,
  header,

  onForward,
  showReplyEditor,
  showEditorNote,
  onCloseReply,
  onCloseEditorNote,
  value,
}: any) => {
  const { showToast } = useToast();
  const dispatch = useDispatch();
  const { refetch } = useGetAttacedFileQuery({ ticketId: header?.ticketId });
  const [isReply, setIsReply] = useState(true);
  const [commonApi] = useCommanApiMutation();
  const [showEditor, setShowEditor] = useState<any>(false);
  const [showShotcut, setShowShotcut] = useState(false);
  const [slashTriggered, setSlashTriggered] = useState(false);
  const shotcutRef = React.useRef(null);
  const [stateChangeKey, setStateChangeKey] = useState(0);
  const [isEditorExpended, setIsEditorExpended] = useState(false);
  const [selectedOptionValue, setSelectedOptionValue] = useState("1");
  const [images, setImages] = useState<any[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showImagesModal, setShowImagesModal] = useState(false);
  const [canned, setCanned] = useState(false);
  const [suggest, setSuggest] = useState(false);
  const [selectedValue, setSelectedValue] = useState("public");
  //@ts-ignore
  const { shotcutData, replyValue } = useSelector(
    (state: RootState) => state.shotcut
  );
  const [signature, setSignature] = useState("");
  const [signatureUpdateKey, setSignatureUpdateKey] = useState(0);
  const [shouldFocusEditor, setShouldFocusEditor] = useState(false);
  const [shouldFocusNotify, setShouldFocusNotify] = useState(false);
  const [isSuccessModal, setIsSuccessModal] = useState<any>(false);
  const [notifyTag, setNotifyTag] = useState([]);
  const { data: shortcutList, isLoading: shortcutLoading } =
    useGetShortCutListQuery({ refetchOnMountOrArgChange: true });
  const [attachedFile, { isLoading: attachedLoading }] =
    useAttachedFileMutation();

  const handleChangeValue = (event: any) => {
    setSelectedValue(event);
    // setShowBcc(false);
  };

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
    return content?.includes("Best regards,") && selectedOptionValue !== "1";
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

    dispatch(setReplyValue(value));
  };
  useEffect(() => {
    if (slashTriggered || !replyValue) return;
    setShowShotcut(false);
  }, [slashTriggered, replyValue]);

  // Handler for Reply button
  const handleReplyButton = () => {
    const newShowEditor = !showEditor;

    setShowEditor(newShowEditor);
    if (newShowEditor) {
      setShouldFocusEditor(true);
    }
  };

  useEffect(() => {
    if (!value) return;
    handleReplyButton();
    if (value === "Add note") {
      setSelectedValue("private");
      setShouldFocusNotify(true);
    } else {
      setShouldFocusNotify(false);
    }
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
    if (!files) return;
    const file = files[0];
    const formData = new FormData();
    formData.append("image", file, file.name);
    formData.append("ticket", String(header?.ticketId));

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
        setImages((prevImages: any) => [...prevImages, imageData]);
      })
      .catch((err: any) => {
        showToast(err?.data?.message || "Image upload failed", "error");
      });
  };

  // Extract signature key from an uploaded image URL
  const extractSignatureFromUrl = (url: string): string | null => {
    try {
      // match last hyphen-separated token before extension, e.g. ...-ac2dd664.png
      const match = url.match(
        /-([a-zA-Z0-9]+)\.(png|jpg|jpeg|gif|webp)(\?.*)?$/
      );
      return match ? match[1] : null;
    } catch {
      return null;
    }
  };

  // Upload a data URL image and return signature key
  const uploadDataUrlImage = async (
    dataUrl: string,
    ticket: string | number
  ) => {
    // Convert data URL to Blob
    const res = await fetch(dataUrl);
    const blob = await res.blob();
    const file = new File([blob], `pasted_${Date.now()}.png`, {
      type: blob.type || "image/png",
    });

    const formData = new FormData();
    formData.append("image", file, file.name);
    formData.append("ticket", String(ticket));

    const headers = new Headers();
    const token = localStorage.getItem("userToken");
    if (token) headers.append("Authorization", `Bearer ${token}`);
    headers.append("x-request-key", uuidv4());

    const endpoint = `${process.env.REACT_APP_API_URL}ticket/reply/image/upload`;
    const resp = await fetch(endpoint, {
      method: "POST",
      headers,
      body: formData,
    });
    const data = await resp.json();
    if (data?.status !== true) {
      throw new Error(data?.message || "Image upload failed");
    }
    const signature = data?.data?.signature || data?.signature;
    if (!signature) throw new Error("Upload succeeded but signature missing");
    return signature as string;
  };

  // Transform editor HTML to replace images with signature;{key}
  const transformMessageHtmlForSubmit = async (
    html: string
  ): Promise<string> => {
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html || "", "text/html");
      const imgs = Array.from(doc.body.querySelectorAll("img"));
      // Process images sequentially; ensure exactly one signature per logical image
      for (const img of imgs) {
        const src = img.getAttribute("src") || "";
        if (!src) continue;
        if (src.startsWith("data:image")) {
          // Upload inline base64 image and replace with signature token
          const sig = await uploadDataUrlImage(src, header?.ticketId);
          img.setAttribute("src", `signature;${sig}`);
        } else {
          const sig = extractSignatureFromUrl(src);
          if (sig) {
            img.setAttribute("src", `signature;${sig}`);
          }
        }
      }
      // Deduplicate any duplicated consecutive signature images that Quill might have inserted
      const cleanImgs = Array.from(doc.body.querySelectorAll("img"));
      const toRemove: Element[] = [];
      for (let i = 1; i < cleanImgs.length; i++) {
        const prev = cleanImgs[i - 1];
        const curr = cleanImgs[i];
        const ps = prev.getAttribute("src") || "";
        const cs = curr.getAttribute("src") || "";
        if (
          ps.startsWith("signature;") &&
          cs.startsWith("signature;") &&
          ps === cs
        ) {
          toRemove.push(curr);
        }
      }
      toRemove.forEach((el) => el.parentElement?.removeChild(el));
      return doc.body.innerHTML;
    } catch {
      return html;
    }
  };

  // Handler for Save button
  const handleSave = async () => {
    if (replyValue === null || !replyValue) {
      return;
    }

    const finalMessage = await transformMessageHtmlForSubmit(replyValue);

    const payload = {
      url: "reply-ticket",
      body: {
        ticket: header?.ticketId,

        reply: {
          type: selectedValue,
          isReply: isReply === true ? "R" : "N",
          to: "example@example.com",
          cc: [],
          bcc: [],
          message: finalMessage,
          signatureKey: signature,
          attachments: [
            {
              filename: "image.jpg",
              base64_data: images,
            },
          ],
          note: notifyTag,
          statusKey: "",
        },
      },
    };

    commonApi(payload)
      .then((res: any) => {
        dispatch(setReplyValue(""));
        setSignature("");
        setSelectedOptionValue("1");
        setSignatureUpdateKey(0);
        setShowEditor(false);
        if (onCloseReply) onCloseReply();
        refetch();
      })
      .catch((error: any) => {
        console.error(error);
      });
  };

  const handleRemoveImage = (id: string | number) => {
    const updatedImages = images.filter((image) => image.fileId !== id);
    setImages(updatedImages);
  };

  const onReplyClose = () => {
    setShowEditor(false);
    setShouldFocusEditor(false);
    onCloseReply();
    onCloseEditorNote();
  };

  useEffect(() => {
    if (showReplyEditor || showEditorNote) {
      setShowEditor(true);
      setShouldFocusEditor(true);
    }
  }, [showEditorNote, showReplyEditor]);

  return (
    <div className="flex flex-col gap-2  w-full h-[100%]  overflow-hidden ">
      <div className="w-full p-2 ">
        <div className="sticky top-0 z-[99]">
          <TicketSubjectBar header={header} />
        </div>
        <div className="flex flex-col gap-0 w-full h-[calc(100vh-272px)]  overflow-y-auto relative  will-change-transform ">
          <ThreadList
            thread={thread}
            onForward={onForward}
            subject={header.subject}
          />
        </div>
        <div className="rounded   p-1 w-[74%]  bg-white  flex z-[999] absolute bottom-0 hover:shadow-[0_1px_6px_rgba(32,33,36,0.28)">
          <Accordion
            elevation={0}
            expanded={showEditor || showReplyEditor || showEditorNote}
            onChange={handleReplyButton}
            sx={{
              width: "100%",
              position: "relative",
              background: "transparent",
              boxShadow: "none",
              "&:before": { display: "none" },
            }}
          >
            {/* {!showEditor && !showReplyEditor && !showEditorNote && ( */}
            <AccordionSummary
              component="div"
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
                padding: "0px 25px",
                // width: "100% !important",
                minHeight: "55px !important",
                display:
                  !showEditor && !showReplyEditor && !showEditorNote
                    ? "flex"
                    : "none",
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
              <div className="flex items-center justify-between w-full">
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

                {/* Task Icon */}
                <div className="flex items-center gap-2 mr-4">
                  <Tooltip title="Add Tasks" placement="left">
                    <IconButton
                      onClick={(e) => {
                        e.stopPropagation();
                        alert("Add Tasks");
                      }}
                      size="small"
                      sx={{
                        color: "#1a73e8",
                        backgroundColor: "#e8f0fe",
                        border: "1px solid #bad0ff",
                        borderRadius: "3px",
                        width: "100px",
                        padding: "10px",
                        position: "relative",
                        "&:hover": {
                          backgroundColor: "#bad0ff",
                          color: "#1a73e8",
                          borderColor: "#e8f0fe",
                          transform: "scale(1.05)",
                        },
                        transition: "all 0.2s ease-in-out",
                      }}
                    >
                      <AddTaskIcon fontSize="small" />
                       {/* Small indicator dot */}
                       <Box
                        sx={{
                          position: "absolute",
                          top: "6px",
                          right: "10px",
                          width: "15px",
                          height: "15px",
                          backgroundColor: "#34a853",
                          borderRadius: "50%",
                          border: "2px solid #ffffff",
                        }}
                      />
                    </IconButton>
                  </Tooltip>
                </div>
              </div>


            </AccordionSummary>
            {/* )} */}

            <AccordionDetails sx={{ p: 0, height: "100%" }}>
              <div
                ref={shotcutRef}
                style={{
                  overflow: "hidden",
                  padding: 0,
                  maxHeight: "100%",
                }}
              >
                <StackEditor
                  initialContent={replyValue}
                  signatureValue={signature}
                  onChange={(value: any) => handleEditorChange(value)}
                  isEditorExpended={isEditorExpended}
                  isExpended={() => setIsEditorExpended(!isEditorExpended)}
                  onCloseReply={onReplyClose}
                  isValues={value}
                  onForward={onForward}
                  shouldFocus={shouldFocusEditor}
                  shouldFocusNotify={shouldFocusNotify}
                  onFocus={() => {
                    setShouldFocusEditor(false);
                    setShouldFocusNotify(false);
                  }}
                  handleChangeValue={handleChangeValue}
                  selectedValue={selectedValue}
                  changeNotify={(value: any) => setNotifyTag(value)}
                  notifyTag={notifyTag}
                  ticketId={header?.ticketId}
                  setIsReply={(value: any) => setIsReply(value)}
                />
              </div>

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
                            {hasSignature(replyValue) &&
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
                            handleRemove={(id: any) => handleRemoveImage(id)}
                            ticketId={header?.ticketId}
                          />
                        }
                        open={showImagesModal}
                        close={() => setShowImagesModal(false)}
                        placement={"top"}
                        width={400}
                      >
                        <span
                          className="bg-[#1a73e8] w-6 text-sm rounded-full h-6 flex items-center justify-center text-white cursor-pointer"
                          onClick={() => setShowImagesModal(true)}
                        >
                          {images.length}
                        </span>
                      </CustomToolTip>
                    )}
                    <Divider orientation="vertical" flexItem />
                    <Tooltip
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
                        {attachedLoading ? (
                          <CircularProgress size={16} />
                        ) : (
                          <IconButton size="small" onClick={handleIconClick}>
                            <AttachFileIcon
                              fontSize="small"
                              sx={{ transform: "rotate(45deg)" }}
                            />
                          </IconButton>
                        )}
                      </div>
                    </Tooltip>
                    <Divider orientation="vertical" flexItem />
                    <Tooltip title={"Canned Responses"}>
                      <IconButton
                        size="small"
                        onClick={() => {
                          setSuggest(false);
                          setCanned(!canned);
                        }}
                      >
                        <PublishedWithChangesIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Divider orientation="vertical" flexItem />
                    <Tooltip title={"Suggested Solutions"}>
                      <IconButton
                        size="small"
                        onClick={() => {
                          setCanned(false);
                          setSuggest(!suggest);
                        }}
                      >
                        <MenuBookIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="contained"
                    onClick={() => {
                      dispatch(setReplyValue(""));
                      setSignature("");
                      setSelectedOptionValue("1");
                      setStateChangeKey((prev) => prev + 1);
                      setSignatureUpdateKey(0);
                    }}
                    sx={{
                      backgroundColor: "#e5e7eb", // Tailwind: bg-gray-200
                      color: "#374151", // Tailwind: text-gray-700
                      fontWeight: 600,
                      fontSize: "0.875rem", // text-sm
                      padding: "6px 16px", // py-1.5 px-4
                      borderRadius: "0.375rem", // rounded
                      "&:hover": {
                        backgroundColor: "#d1d5db", // Tailwind: hover:bg-gray-300
                      },
                    }}
                  >
                    Reset
                  </Button>

                  <Button
                    variant="contained"
                    onClick={handleSave}
                    sx={{
                      backgroundColor: "#1a73e8",
                      color: "white",
                      fontWeight: 600,
                      fontSize: "0.875rem",
                      padding: "6px 16px",
                      borderRadius: "0.375rem",
                      "&:hover": {
                        backgroundColor: "#1b66c9",
                      },
                    }}
                  >
                    Save
                  </Button>
                </div>
              </div>
              {/* </motion.div> */}
              {/* )} */}
              {/* </AnimatePresence> */}
            </AccordionDetails>
          </Accordion>
        </div>
      </div>

      <Drawer
        anchor="right"
        open={canned}
        onClose={() => setCanned(false)}
        sx={{
          "& .MuiDrawer-paper": {
            width: 600,
            maxWidth: "100vw",
            boxShadow: 24,
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            p: 2,
            borderBottom: "1px solid #eee",
            backgroundColor: "#e8f0fe",
          }}
        >
          <PublishedWithChangesIcon fontSize="small" sx={{ mr: 1 }} />
          <Typography sx={{ flex: 1, fontSize: "17px", fontWeight: 600 }}>
            Canned Responses
          </Typography>
          <IconButton onClick={() => setCanned(false)} size="small">
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            height: "calc(100% - 64px)",
            gap: 2,
            p: 2,
            overflow: "auto",
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

                  dispatch(
                    setReplyValue(
                      (prevMarkdown: any) =>
                        prevMarkdown +
                        "Content for section 1 inside the drawer."
                    )
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
      </Drawer>

      <Drawer
        anchor="right"
        open={suggest}
        onClose={() => setSuggest(false)}
        sx={{
          "& .MuiDrawer-paper": {
            width: 600,
            maxWidth: "100vw",
            boxShadow: 24,
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            p: 2,
            borderBottom: "1px solid #eee",
            backgroundColor: "#e8f0fe",
          }}
        >
          <MenuBookIcon fontSize="small" sx={{ mr: 1 }} />
          <Typography sx={{ flex: 1, fontSize: "17px", fontWeight: 600 }}>
            Solution
          </Typography>
          <IconButton onClick={() => setSuggest(false)} size="small">
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            height: "calc(100% - 64px)",
            gap: 2,
            p: 2,
            overflow: "auto",
          }}
        >
          {shortcutList?.length > 0 ? (
            <>
              {(shortcutList ?? [])?.map((item: any) => (
                <ListItem
                  key={item.key}
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
                        {item.shortcut}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: "#4b5563", // Tailwind text-gray-600
                          fontSize: "0.85rem",
                          lineHeight: 1.4,
                        }}
                      >
                        {item.text}
                      </Typography>
                    </Box>

                    <Box display="flex" gap={1}>
                      <IconButton
                        size="small"
                        onClick={() => {
                          dispatch(
                            setReplyValue(replyValue + item.text)
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
              <img src={emptyimg} alt="notes" className="mx-auto w-40 h-40" />
            </div>
          )}
        </Box>
      </Drawer>

      {isSuccessModal && (
        <CustomModal
          open={isSuccessModal}
          onClose={() => { }}
          title={"Ticket Save"}
          msg="Ticket save successfully"
          primaryButton={{
            title: "Go Next",
            onClick: () => { },
          }}
          secondaryButton={{
            title: "Ticket List",
            onClick: () => {
              setIsSuccessModal(false);
            },
          }}
        />
      )}
    </div>
  );
};

export default TicketThreadSection;
