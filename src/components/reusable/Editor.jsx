import React, { useEffect, useState, useRef } from "react";
import { Editor } from "primereact/editor";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import CheckIcon from "@mui/icons-material/Check";
import ReplyIcon from "@mui/icons-material/Reply";
import PrivateConnectivityIcon from "@mui/icons-material/PrivateConnectivity";
import PublicIcon from "@mui/icons-material/Public";
import { useDispatch, useSelector } from "react-redux";

import {
  Avatar,
  IconButton,
  Paper,
  Typography,
  ClickAwayListener,
  MenuList,
  MenuItem,
  TextField,
  Autocomplete,
  FormControl,
  Select,
  Chip,
  LinearProgress,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import ShortcutIcon from "@mui/icons-material/Shortcut";
import CustomToolTip from "../../reusable/CustomToolTip";
import { useToast } from "../../hooks/useToast";
import { fetchOptions, isValidEmail } from "../../utils/Utils";
import { useUploadFileApiMutation } from "../../services/uploadDocServices";

import { setSelectedIndex } from "../../reduxStore/Slices/shotcutSlices";
export const formatName = (name) => {
  if (!name) return "";

  if (name.length > 5) {
    return name.slice(0, 5) + "....";
  }

  return name; // return full name if short
};

const selectionsOptions = [
  {
    id: 1,
    name: "Reply",
    value: "1",
  },
  {
    id: 2,
    name: "Add note",
    value: "2",
  },
  {
    id: 3,
    name: "Forward",
    value: "3",
  },
];
const optionsofPrivate = [
  {
    id: 1,
    icon: <PrivateConnectivityIcon fontSize="small" />,
    title: "Private",
    subTitle: "Only visible to you",
    value: "private",
  },
  {
    id: 2,
    icon: <PublicIcon fontSize="small" />,
    title: "Public",
    subTitle: "Visible to everyone",
    value: "public",
  },
];

const StackEditor = ({
  initialContent = "",
  onChange,
  isFull = true,
  shouldFocus = false,
  shouldFocusNotify = false,
  onFocus,
  ...props
}) => {
  const {
    isEditorExpended,
    isExpended,
    onCloseReply,
    signatureValue,
    isValues,
    onForward,
    customHeight = "calc(100vh - 350px)",
    handleChangeValue,
    selectedValue,
    changeNotify = () => {},
    notifyTag = [],
    ticketId,
    setIsReply,
  } = props;

  const isMounted = React.useRef(true);
  const { showToast } = useToast();
  const dispatch = useDispatch();
  const [notifyValue, setNotifyValue] = React.useState("");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const editorRef = useRef(null);
  const signatureEditorRef = useRef(null);
  const notifyInputRef = useRef(null);
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);
  const optionsRef = React.useRef(null);
  const { selectedIndex } = useSelector((state) => state.shotcut);
  const [showCc, setShowCc] = React.useState(false);
  const [showBcc, setShowBcc] = React.useState(false);
  const [optionChangeKey, setOptionChangeKey] = useState(0);
  const [currentSignature, setCurrentSignature] = useState("");
  const [ccValue, setCcValue] = React.useState([]);
  const [bccValue, setBccValue] = React.useState([]);
  const [ccChangeValue, setCcChangeValue] = React.useState("");
  const [bccChangeValue, setBccChangeValue] = React.useState("");
  const [options, setOptions] = useState([]);
  const [localNotifyTag, setLocalNotifyTag] = React.useState(notifyTag || []);
  const [uploadingCount, setUploadingCount] = useState(0);
  const [uploadFileApi] = useUploadFileApiMutation();

  // Helper function to compare arrays
  const arraysEqual = (a, b) => {
    if (a === b) return true;
    if (a == null || b == null) return false;
    if (a.length !== b.length) return false;

    for (let i = 0; i < a.length; i++) {
      if (a[i].email !== b[i].email || a[i].name !== b[i].name) {
        return false;
      }
    }
    return true;
  };

  const displayCCOptions = ccChangeValue ? options : [];
  const displayBCCOptions = bccChangeValue ? options : [];
  const displayNotifyOptions = notifyValue ? options : [];

  useEffect(() => {
    const filterValue = fetchOptions(
      ccChangeValue || bccChangeValue || notifyValue
    );
    filterValue?.length > 0
      ? setOptions(filterValue)
      : setOptions([
          {
            userName: ccChangeValue || bccChangeValue || notifyValue,
            userEmail: ccChangeValue || bccChangeValue || notifyValue,
          },
        ]);
  }, [ccChangeValue, bccChangeValue, notifyValue]);

  const handleSelectedOption = (_, newValue, type) => {
    if (!Array.isArray(newValue) || newValue.length === 0) return;

    const lastSelected = newValue[newValue.length - 1];

    if (!lastSelected?.userEmail) return;

    const dataValue = {
      name: lastSelected.userName || lastSelected.name,
      email: lastSelected.userEmail || lastSelected.email,
    };

    if (!isValidEmail(dataValue.email)) {
      showToast("Invalid email format", "error");
      return;
    }

    if (type === "cc") {
      if (ccValue.some((item) => item.email === dataValue.email)) {
        showToast("Email already exists", "error");
        return;
      }
      if (ccValue.length >= 3) {
        showToast("Maximum 3 CC allowed", "error");
        return;
      }
      setCcValue((prev) => [...prev, dataValue]);
    } else if (type === "bcc") {
      if (bccValue.some((item) => item.email === dataValue.email)) {
        showToast("Email already exists", "error");
        return;
      }
      if (bccValue.length >= 3) {
        showToast("Maximum 3 BCC allowed", "error");
        return;
      }
      setBccValue((prev) => [...prev, dataValue]);
    } else {
      if (localNotifyTag.some((item) => item.email === dataValue.email)) {
        showToast("Email already exists", "error");
        return;
      }
      if (localNotifyTag.length >= 3) {
        showToast("Maximum 3 Notify allowed", "error");
        return;
      }
      const newNotifyTag = [...localNotifyTag, dataValue];
      setLocalNotifyTag(newNotifyTag);
      changeNotify(newNotifyTag);
    }
  };

  // Handle deletion for all Autocomplete components
  const handleDelete = (index, type) => {
    if (type === "cc") {
      const newCcValue = ccValue.filter((_, i) => i !== index);
      setCcValue(newCcValue);
    } else if (type === "bcc") {
      const newBccValue = bccValue.filter((_, i) => i !== index);
      setBccValue(newBccValue);
    } else if (type === "notify") {
      const newNotifyTag = localNotifyTag.filter((_, i) => i !== index);
      setLocalNotifyTag(newNotifyTag);
      changeNotify(newNotifyTag);
    }
  };

  useEffect(() => {
    if (editorRef.current && shouldFocus) {
      const quill = editorRef.current.getQuill();
      if (quill) {
        setTimeout(() => {
          try {
            quill.focus();
            const length = quill.getLength();
            quill.setSelection(length, 0);
            if (onFocus) {
              onFocus();
            }
          } catch (error) {
            console.error("Error focusing quill editor:", error);
          }
        }, 300);
      } else {
        setTimeout(() => {
          const quill = editorRef.current?.getQuill();
          if (quill && shouldFocus) {
            try {
              quill.focus();
              const length = quill.getLength();
              quill.setSelection(length, 0);

              if (onFocus) {
                onFocus();
              }
            } catch (error) {
              console.error("Error focusing quill editor on retry:", error);
            }
          }
        }, 500);
      }
    }
  }, [shouldFocus, onFocus]);

  // Focus the Notify input when requested and when in Add note mode
  useEffect(() => {
    if (shouldFocusNotify && selectedIndex !== "1") {
      const inputEl = notifyInputRef.current;
      if (inputEl && typeof inputEl.focus === "function") {
        setTimeout(() => {
          try {
            inputEl.focus();
          } catch (e) {}
        }, 200);
      }
    }
  }, [shouldFocusNotify, selectedIndex]);

  useEffect(() => {
    if (shouldFocus && editorRef.current) {
      const timeoutId = setTimeout(() => {
        const quill = editorRef.current?.getQuill();
        if (quill && shouldFocus) {
          try {
            quill.focus();
            const length = quill.getLength();
            quill.setSelection(length, 0);

            if (onFocus) {
              onFocus();
            }
          } catch (error) {
            console.error("Error in additional focus attempt:", error);
          }
        }
      }, 800);

      return () => clearTimeout(timeoutId);
    }
  }, [shouldFocus, onFocus]);

  useEffect(() => {
    if (!isValues) return;
    if (isValues === "Reply") {
      dispatch(setSelectedIndex("1"));
    } else {
      dispatch(setSelectedIndex("2"));
    }
  }, [isValues]);

  useEffect(() => {
    if (signatureValue) {
      setCurrentSignature(signatureValue);
    } else {
      setCurrentSignature("");
    }
  }, [signatureValue]);

  useEffect(() => {
    if (notifyTag && !arraysEqual(notifyTag, localNotifyTag)) {
      setLocalNotifyTag(notifyTag);
    }
  }, [notifyTag]);

  useEffect(() => {
    let attached = false;
    let cancelled = false;

    const attachToolbarHandlers = () => {
      if (cancelled) return;
      const quill = editorRef.current?.getQuill?.();
      if (!quill) {
        setTimeout(attachToolbarHandlers, 300);
        return;
      }

      const toolbar = quill.getModule("toolbar");
      if (!toolbar) return;

      toolbar.addHandler("video", () => {
        const url = prompt("Enter video URL (YouTube, Vimeo, etc):");
        if (url) {
          const range = quill.getSelection();
          quill.insertEmbed(range.index, "video", url);
        }
      });

      // Override image button to upload to server instead of base64
      toolbar.addHandler("image", () => {
        const input = document.createElement("input");
        input.setAttribute("type", "file");
        input.setAttribute("accept", "image/*");
        input.onchange = async () => {
          const file = input.files && input.files[0];
          if (!file) return;
          try {
            const url = await uploadPastedImage(file);
            const range = quill.getSelection(true) || {
              index: quill.getLength(),
              length: 0,
            };
            quill.insertEmbed(range.index, "image", url, "user");
            quill.setSelection(range.index + 1, 0, "silent");
          } catch (err) {
            showToast(err?.message || "Failed to upload image", "error");
          }
        };
        input.click();
      });

      attached = true;
    };

    attachToolbarHandlers();
    return () => {
      cancelled = true;
      attached = false;
    };
  }, [optionChangeKey]);

  // Upload image helper
  const uploadPastedImage = async (file) => {
    setUploadingCount((c) => c + 1);
    const formData = new FormData();
    const fileName = file?.name || `pasted_${Date.now()}.png`;
    formData.append("image", file, fileName);
    formData.append("ticket", ticketId);

    try {
      const response = await uploadFileApi(formData);

      if (response?.data?.success !== true) {
        // throw new Error(response?.data?.message || "Image upload failed");
        showToast(response?.data?.message || "Image upload failed", "error");
      }

      const url = response?.data?.data?.url;
      console.log(url);
      if (!url) showToast("Upload succeeded but URL missing", "error");
      return url;
    } finally {
      setUploadingCount((c) => Math.max(0, c - 1));
    }
  };

  // Helpers to control image sizing inside the editor
  const IMAGE_DEFAULT_WIDTH = 45;
  const setImageElementSize = (imageElement) => {
    try {
      if (!imageElement) return;
      // imageElement.style.width = `${IMAGE_DEFAULT_WIDTH}%`;
      imageElement.style.maxWidth = `${IMAGE_DEFAULT_WIDTH}%`;
    } catch (_) {}
  };

  const setImageSizeByUrl = (quillInstance, imageUrl) => {
    try {
      if (!quillInstance || !imageUrl) return;
      const root = quillInstance.root;
      const imgs = Array.from(root.querySelectorAll("img"));
      imgs
        .filter((img) => (img?.src || "") === imageUrl)
        .forEach((img) => setImageElementSize(img));
    } catch (_) {}
  };

  // Handle paste images into editor: upload then insert URL
  useEffect(() => {
    let removeListener = () => {};
    let cancelled = false;
    let pasteInProgress = false;

    const attach = () => {
      if (cancelled) return;
      const quill = editorRef.current?.getQuill?.();
      if (!quill) {
        setTimeout(attach, 300);
        return;
      }

      const replaceDataUrlImagesInEditor = async () => {
        const root = quill.root;
        const imgs = Array.from(root.querySelectorAll("img"));
        const dataImgs = imgs.filter((img) =>
          (img?.src || "").startsWith("data:image")
        );
        for (const img of dataImgs) {
          try {
            const src = img.src;
            const res = await fetch(src);
            const blob = await res.blob();
            const file = new File([blob], `pasted_${Date.now()}.png`, {
              type: blob.type || "image/png",
            });
            const url = await uploadPastedImage(file);
            img.src = url;
            setImageElementSize(img);
          } catch (err) {
            // Remove the base64 image if upload fails
            try {
              img.remove();
            } catch (_) {}
            showToast(err?.message || "Failed to upload pasted image", "error");
          }
        }
      };

      const handlePaste = async (event) => {
        if (pasteInProgress) return; // de-duplicate re-entrant paste
        const clipboard = event.clipboardData;
        if (!clipboard) return;

        const items = clipboard.items ? Array.from(clipboard.items) : [];
        const filesList = clipboard.files ? Array.from(clipboard.files) : [];

        let imageFiles = [];
        if (items.length) {
          imageFiles = items
            .filter((i) => i.kind === "file" && i.type.startsWith("image/"))
            .map((i) => i.getAsFile())
            .filter(Boolean);
        }

        if (imageFiles.length === 0 && filesList.length) {
          imageFiles = filesList.filter(
            (f) => f.type && f.type.startsWith("image/")
          );
        }

        // If there are file images in clipboard, prevent default and upload/insert
        if (imageFiles.length > 0) {
          event.preventDefault();
          try {
            event.stopPropagation();
          } catch (_) {}
          try {
            if (typeof event.stopImmediatePropagation === "function")
              event.stopImmediatePropagation();
          } catch (_) {}
          pasteInProgress = true;
          if (!process.env.REACT_APP_API_URL) {
            showToast("Missing API URL configuration", "error");
            pasteInProgress = false;
            return;
          }

          const originalSelection = quill.getSelection(true) || {
            index: quill.getLength(),
            length: 0,
          };

          for (const file of imageFiles) {
            try {
              const url = await uploadPastedImage(file);
              const currentIndex =
                (quill.getSelection(true)?.index ?? originalSelection.index) ||
                quill.getLength();
              quill.insertEmbed(currentIndex, "image", url, "user");
              quill.setSelection(currentIndex + 1, 0, "silent");
              setImageSizeByUrl(quill, url);
            } catch (err) {
              // On failure, ensure no base64 image remains
              const root = quill.root;
              const imgs = Array.from(root.querySelectorAll("img"));
              const dataImgs = imgs.filter((img) =>
                (img?.src || "").startsWith("data:image")
              );
              dataImgs.forEach((img) => {
                try {
                  img.remove();
                } catch (_) {}
              });
              showToast(err?.message || "Failed to upload image", "error");
            }
          }
          pasteInProgress = false;
          return;
        }

        // Otherwise let Quill paste happen, then replace any data URL images with uploaded URLs
        setTimeout(replaceDataUrlImagesInEditor, 0);
      };

      const root = quill.root;
      root.addEventListener("paste", handlePaste, true);
      removeListener = () =>
        root.removeEventListener("paste", handlePaste, true);
    };

    attach();
    return () => {
      cancelled = true;
      removeListener();
    };
  }, [optionChangeKey]);

  useEffect(() => {
    if (signatureEditorRef.current) {
      const quill = signatureEditorRef.current.getQuill();
      if (!quill) return;

      quill.enable(false);

      const styleElement = document.createElement("style");
      styleElement.textContent = `
        .ql-editor {
          min-height: 100px !important;
          max-height: 150px !important;
          overflow-y: auto !important;
          background-color: #f9fafb !important;
          border: 1px solid #e5e7eb !important;
          border-radius: 6px !important;
          padding: 12px !important;
          color: #6b7280 !important;
          font-style: italic !important;
        }
        
        .ql-editor:focus {
          outline: none !important;
          border-color: #d1d5db !important;
        }
        
        .ql-editor p {
          margin: 0 !important;
          padding: 0 !important;
        }
        
        .ql-editor strong {
          color: #374151 !important;
        }
      `;
      quill.root.appendChild(styleElement);
    }
  }, []);

  useEffect(() => {
    if (signatureEditorRef.current) {
      const quill = signatureEditorRef.current.getQuill();
      if (!quill) return;

      quill.root.innerHTML =
        currentSignature ||
        '<p style="color: #9ca3af; font-style: italic;">No signature selected</p>';
    }
  }, [currentSignature]);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  const toggleFullscreen = () => {
    setIsFullscreen((prev) => !prev);
  };

  const handleSelect = (index) => {
    if (index === "3") {
      onForward();
    }

    setIsReply(index === "2" ? false : true);
    dispatch(setSelectedIndex(index));
    setIsOptionsOpen(false); // Close after selection
    setOptionChangeKey((prevKey) => prevKey + 1);
  };

  const renderHeader = () => {
    return (
      <div className="w-full flex justify-between items-center p-0 ">
        <div className="w-full">
          <span className="ql-formats ">
            <button className="ql-code" aria-label="Code"></button>

            <button className="ql-bold" aria-label="Bold"></button>
            <button className="ql-italic" aria-label="Italic"></button>
            <button className="ql-underline" aria-label="Underline"></button>
            <button className="ql-link" aria-label="Link"></button>
            <button className="ql-image" aria-label="Image"></button>
            {/* <button className="ql-video" aria-label="Video"></button> */}

            <select className="ql-color " aria-label="Font Color"></select>
          </span>
        </div>

        {isFull && (
          <div className="space-x-2 flex items-center">
            <button
              className="ql-fullscreen"
              aria-label="Full Screen"
              onClick={toggleFullscreen}
            >
              ⛶
            </button>
          </div>
        )}
      </div>
    );
  };

  const header = renderHeader();
  const handleClose = (event) => {
    if (optionsRef.current && optionsRef.current.contains(event.target)) {
      return;
    }

    setIsOptionsOpen(false);
  };

  function handleListKeyDown(event) {
    if (event.key === "Tab") {
      event.preventDefault();
      setIsOptionsOpen(false);
    } else if (event.key === "Escape") {
      setIsOptionsOpen(false);
    }
  }

  const renderIcon =
    selectedIndex === "1" ? (
      <ReplyIcon fontSize="small" />
    ) : selectedIndex === "3" ? (
      <ShortcutIcon fontSize="small" />
    ) : null;

  const renderComponentBasedOnSelection = (
    <div className="flex items-center  ">
      {selectedIndex === "1" ? (
        <span className="text-sm  ">Email: test (test)</span>
      ) : (
        // <Box sx={{ minWidth: 200 }}>
        <FormControl fullWidth>
          {/* <InputLabel id="demo-simple-select-label">Add Element</InputLabel> */}
          <Select
            id="demo-simple-select"
            value={selectedValue}
            onChange={(e) => handleChangeValue(e.target.value)}
            MenuProps={{
              sx: {
                zIndex: isFullscreen ? 10001 : 9999,
              },
            }}
            sx={{
              height: 40,
              width: 300,
              "& fieldset": { border: "none" }, // Removes the outline border
              "& .MuiOutlinedInput-notchedOutline": { border: "none" }, // Another safe way
            }}
          >
            {optionsofPrivate.map((item) => (
              <MenuItem key={item?.id} value={item?.value} sx={{ width: 300 }}>
                <div className="flex items-center gap-2">
                  <div>{item?.icon}</div>
                  <div className="flex flex-col ">
                    <span>{item?.title}</span>
                    <span className="text-xs text-gray-500">
                      {item?.subTitle}
                    </span>
                  </div>
                </div>
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        // </Box>
      )}
    </div>
  );
  const renderToolTipComponent = (
    <Paper
      elevation={0}
      sx={{
        backgroundColor: "transparent",
      }}
    >
      <ClickAwayListener onClickAway={handleClose}>
        <MenuList
          autoFocusItem={isOptionsOpen}
          id="composition-menu"
          aria-labelledby="composition-button"
          onKeyDown={handleListKeyDown}
        >
          {selectionsOptions.map((item, index) => {
            const isSelected = selectedIndex === item.value;
            return (
              <MenuItem
                key={index}
                onClick={() => handleSelect(item.value)}
                selected={isSelected}
                sx={{
                  mb: 0.5,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  width: "100%",
                  borderRadius: "0px",
                  // px: 2,
                  // py: 1,
                  backgroundColor: isSelected ? "#000" : "transparent",
                  color: isSelected ? "#000" : "#000",
                  transition: "all 0.2s ease",
                  "&:hover": {
                    backgroundColor: isSelected ? "#d2d3d4a6" : "#d2d3d4a6",
                    color: isSelected ? "" : "#000",
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
                <span>{item.name}</span>
                {isSelected && (
                  <CheckIcon sx={{ color: "#000", fontSize: 18, ml: 2 }} />
                )}
              </MenuItem>
            );
          })}
        </MenuList>
      </ClickAwayListener>
    </Paper>
  );

  const renderComponentBasedOnOptions = (
    <div className="flex items-center justify-between mb-2 px-2">
      {selectedIndex === "1" ? (
        <>
          <div>
            <span className="font-semibold text-gray-600 text-sm">To:</span>{" "}
            <span className="text-sm text-gray-600">Test</span>
          </div>
          <div className="flex items-center gap-2">
            <p
              className="text-xs text-gray-500 cursor-pointer hover:underline  "
              onClick={() => setShowCc((prev) => !prev)}
            >
              Cc
            </p>
            <p
              className="text-xs text-gray-500 cursor-pointer hover:underline  "
              onClick={() => setShowBcc((prev) => !prev)}
            >
              Bcc
            </p>
          </div>
        </>
      ) : (
        <div className="w-full flex items-center gap-2">
          <span className="font-semibold text-gray-600 text-sm">Notify:</span>
          <Autocomplete
            multiple
            disableClearable
            popupIcon={null}
            getOptionLabel={(option) => {
              if (typeof option === "string") return option;
              return option.userEmail || option.userName || option.email || "";
            }}
            options={displayNotifyOptions}
            value={localNotifyTag}
            onChange={(event, newValue) => {
              handleSelectedOption(event, newValue, "notify");
            }}
            onInputChange={(_, value) => setNotifyValue(value)}
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
            renderTags={(value, getTagProps) =>
              value?.map((option, index) => (
                <CustomToolTip
                  title={
                    <Typography variant="subtitle2" sx={{ p: 1.5 }}>
                      {option.name
                        ? `${option.name} (${option.email})`
                        : option.email}
                    </Typography>
                  }
                >
                  <Chip
                    variant="outlined"
                    color="primary"
                    key={index}
                    label={
                      typeof option === "string"
                        ? option
                        : formatName(
                            option?.name || option?.userName || option?.email
                          ) // Handle all data structures
                    }
                    onDelete={() => handleDelete(index, "notify")}
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
                </CustomToolTip>
              ))
            }
            renderInput={(params) => (
              <TextField
                {...params}
                // label="CC"
                variant="outlined"
                size="small"
                sx={{
                  width: 400,
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
        </div>
      )}
    </div>
  );

  const editorHeight = isFullscreen
    ? "100vh"
    : isEditorExpended
    ? "436px"
    : (showCc || showBcc) && currentSignature
    ? "calc(100vh - 565px)"
    : showCc || showBcc
    ? "calc(100vh - 385px)"
    : currentSignature
    ? "calc(100vh - 515px)"
    : selectedIndex !== "1"
    ? "calc(100vh - 354px)"
    : customHeight;

  return (
    <div
      className={
        isFullscreen ? "editor-fullscreen relative " : " w-full h-full"
      }
    >
      {uploadingCount > 0 && (
        <div className="w-full px-2 mb-2">
          <LinearProgress />
        </div>
      )}
      {isFull && (
        <>
          <div
            className="flex items-center justify-between p-2 mb-2"
            style={isFullscreen ? { position: "relative", zIndex: 10000 } : {}}
          >
            <div className="flex items-center gap-2 z-[10000]">
              <Avatar
                src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
                sx={{ width: 25, height: 25 }}
              />

              <CustomToolTip
                title={renderToolTipComponent}
                placement="bottom-start"
                open={isOptionsOpen}
                // close={() => setIsOptionsOpen(false)}
              >
                <span
                  onClick={() => setIsOptionsOpen(true)}
                  className="cursor-pointer  relative z-[10000]"
                  ref={optionsRef}
                >
                  {renderIcon}
                  <KeyboardArrowDownIcon fontSize="small" />
                </span>
              </CustomToolTip>

              {renderComponentBasedOnSelection}
            </div>
            <div>
              {!isFullscreen && (
                <IconButton onClick={onCloseReply} size="small">
                  <KeyboardArrowUpIcon sx={{ transform: "rotate(180deg)" }} />
                </IconButton>
              )}
            </div>
          </div>

          <div
            style={isFullscreen ? { position: "relative", zIndex: 10000 } : {}}
          >
            {renderComponentBasedOnOptions}
          </div>
        </>
      )}

      {selectedIndex === "1" && (
        <div
          className="flex items-center gap-4 mb-2 px-2"
          style={isFullscreen ? { position: "relative", zIndex: 10000 } : {}}
        >
          {showCc && (
            <div>
              <Autocomplete
                multiple
                disableClearable
                popupIcon={null}
                getOptionLabel={(option) => {
                  if (typeof option === "string") return option;
                  return (
                    option.userEmail || option.userName || option.email || ""
                  );
                }}
                options={displayCCOptions}
                value={ccValue}
                onChange={(event, newValue) => {
                  if (newValue.length < ccValue.length) {
                    // Item was deleted
                    setCcValue(newValue);
                  } else {
                    // Item was added
                    handleSelectedOption(event, newValue, "cc");
                  }
                }}
                onInputChange={(_, value) => setCcChangeValue(value)}
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
                renderTags={(ccValue, getTagProps) =>
                  ccValue?.map((option, index) => (
                    <CustomToolTip
                      title={
                        <Typography variant="subtitle2" sx={{ p: 1.5 }}>
                          {option.name
                            ? `${option.name} (${option.email})`
                            : option.email}
                        </Typography>
                      }
                    >
                      <Chip
                        variant="outlined"
                        color="primary"
                        key={index}
                        label={
                          typeof option === "string"
                            ? option
                            : formatName(
                                option?.name ||
                                  option?.userName ||
                                  option?.email
                              ) // Handle all data structures
                        }
                        onDelete={() => handleDelete(index, "cc")}
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
                    </CustomToolTip>
                  ))
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="CC"
                    variant="outlined"
                    size="small"
                    sx={{
                      width: 400,
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
            </div>
          )}

          {showBcc && (
            <div>
              <Autocomplete
                multiple
                disableClearable
                popupIcon={null}
                getOptionLabel={(option) => {
                  if (typeof option === "string") return option;
                  return (
                    option.userEmail || option.userName || option.email || ""
                  );
                }}
                options={displayBCCOptions}
                value={bccValue}
                onChange={(event, newValue) => {
                  if (newValue.length < bccValue.length) {
                    // Item was deleted
                    setBccValue(newValue);
                  } else {
                    // Item was added
                    handleSelectedOption(event, newValue, "bcc");
                  }
                }}
                onInputChange={(_, value) => setBccChangeValue(value)}
                filterOptions={(x) => x}
                getOptionDisabled={(option) => option === "Type to search"}
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
                renderTags={(bccValue, getTagProps) =>
                  bccValue.map((option, index) => (
                    <CustomToolTip
                      title={
                        <Typography variant="subtitle2" sx={{ p: 1.5 }}>
                          {option.name
                            ? `${option.name} (${option.email})`
                            : option.email}
                        </Typography>
                      }
                    >
                      <Chip
                        variant="outlined"
                        color="primary"
                        key={index}
                        label={
                          typeof option === "string"
                            ? option
                            : formatName(
                                option?.name ||
                                  option?.userName ||
                                  option?.email
                              ) // Handle all data structures
                        }
                        onDelete={() => handleDelete(index, "bcc")}
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
                    </CustomToolTip>
                  ))
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Bcc"
                    variant="outlined"
                    size="small"
                    sx={{
                      width: 400,
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
            </div>
          )}
        </div>
      )}
      {/* <div className="flex flex-col h-full w-full overflow-y-scroll"> */}

      {/* Main Editor for Message */}
      <div className="mb-0">
        <Editor
          ref={editorRef}
          key={optionChangeKey}
          value={initialContent}
          onTextChange={(text) => onChange(text.htmlValue)}
          style={{ height: editorHeight }}
          headerTemplate={header}
          placeholder={
            selectedIndex === "1" ? "Reply..." : "Add a note, @mention"
          }
        />
      </div>

      {/* Signature Editor (Read-only) */}
      {currentSignature && (
        <Editor
          ref={signatureEditorRef}
          value={currentSignature}
          readOnly={true}
          style={{ height: "175px", borderTop: "none" }}
          placeholder="No signature selected"
          showHeader={false}
        />
      )}
    </div>

    // </div>
  );
};

export default StackEditor;
