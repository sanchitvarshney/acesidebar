import React, { useEffect, useState, useRef } from "react";
import { Editor } from "primereact/editor";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import CheckIcon from "@mui/icons-material/Check";
import ReplyIcon from "@mui/icons-material/Reply";
import PrivateConnectivityIcon from "@mui/icons-material/PrivateConnectivity";
import PublicIcon from "@mui/icons-material/Public";
import Slide from "@mui/material/Slide";
import {
  Avatar,
  IconButton,
  Paper,
  Popper,
  Grow,
  ClickAwayListener,
  MenuList,
  MenuItem,
  TextField,
  Autocomplete,
  FormControl,
  Select,
  Chip,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import ShortcutIcon from "@mui/icons-material/Shortcut";
import { set } from "react-hook-form";
import CustomToolTip from "../reusable/CustomToolTip";

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
    value: "1",
  },
  {
    id: 2,
    icon: <PublicIcon fontSize="small" />,
    title: "Public",
    subTitle: "Visible to everyone",
    value: "2",
  },
];

const StackEditor = ({ initialContent = "", onChange, shouldFocus = false, onFocus, ...props }) => {
  const {
    isEditorExpended,
    isExpended,
    onCloseReply,
    signatureValue,
    isValues,
    onForward
  } = props;
  const isMounted = React.useRef(true);
  const [editorContent, setEditorContent] = useState("");
  const [notifyValue, setNotifyValue] = React.useState("--");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const editorRef = useRef(null);
  const signatureEditorRef = useRef(null);
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);
  const optionsRef = React.useRef(null);
  const [selectedIndex, setSelectedIndex] = useState("1");
  const [selectedOptionValue, setSelectedOptionValue] = useState("1");
  const [showCc, setShowCc] = React.useState(false);
  const [showBcc, setShowBcc] = React.useState(false);
  const [optionChangeKey, setOptionChangeKey] = useState(0);
  const [notifyTag, setNotifyTag] = useState([]);
  const [currentSignature, setCurrentSignature] = useState("");

  // Focus the editor when it opens
  useEffect(() => {
    console.log('StackEditor focus useEffect triggered:', { shouldFocus, editorRef: !!editorRef.current });
    
    if (editorRef.current && shouldFocus) {
      const quill = editorRef.current.getQuill();
      console.log('Quill instance found:', !!quill);
      
      if (quill) {
        // Longer delay to ensure the editor is fully rendered and initialized
        setTimeout(() => {
          console.log('Attempting to focus quill editor...');
          try {
            quill.focus();
            // Move cursor to the end of the content
            const length = quill.getLength();
            quill.setSelection(length, 0);
            console.log('Focus applied, cursor moved to position:', length);
            // Call onFocus callback if provided
            if (onFocus) {
              onFocus();
            }
          } catch (error) {
            console.error('Error focusing quill editor:', error);
          }
        }, 300);
      } else {
        // If quill is not available, try again after a short delay
        setTimeout(() => {
          const quill = editorRef.current?.getQuill();
          if (quill && shouldFocus) {
            console.log('Quill instance found on retry, attempting to focus...');
            try {
              quill.focus();
              const length = quill.getLength();
              quill.setSelection(length, 0);
              console.log('Focus applied on retry, cursor moved to position:', length);
              if (onFocus) {
                onFocus();
              }
            } catch (error) {
              console.error('Error focusing quill editor on retry:', error);
            }
          }
        }, 500);
      }
    }
  }, [shouldFocus, onFocus]);

  // Additional effect to handle focus when editor becomes visible
  useEffect(() => {
    if (shouldFocus && editorRef.current) {
      // Try to focus after a longer delay to ensure everything is ready
      const timeoutId = setTimeout(() => {
        const quill = editorRef.current?.getQuill();
        if (quill && shouldFocus) {
          console.log('Additional focus attempt for visible editor...');
          try {
            quill.focus();
            const length = quill.getLength();
            quill.setSelection(length, 0);
            console.log('Additional focus applied, cursor moved to position:', length);
            if (onFocus) {
              onFocus();
            }
          } catch (error) {
            console.error('Error in additional focus attempt:', error);
          }
        }
      }, 800);

      return () => clearTimeout(timeoutId);
    }
  }, [shouldFocus, onFocus]);

  useEffect(() => {
    if (!isValues) return;
    if (isValues === "Reply") {
      setSelectedIndex("1");
    } else {
      setSelectedIndex("2");
    }
  }, [isValues]);

 

  // Handle signature changes from parent component
  useEffect(() => {
    if (signatureValue) {
      setCurrentSignature(signatureValue);
    } else {
      setCurrentSignature("");
    }
  }, [signatureValue]);

  // Enhanced text change handler
  // const handleTextChange = (e) => {
  //   const htmlValue = e.htmlValue;

  //   // Update editor content
  //   setEditorContent(htmlValue);

  //   // Call parent onChange with content + signature
  //   const fullContent = currentSignature
  //     ? htmlValue +
  //       `<div class="signature-section" contenteditable="false">${currentSignature}</div>`
  //     : htmlValue;

  //   onChange(fullContent);
  // };

  // Initialize main editor
  useEffect(() => {
    if (editorRef.current) {
      const quill = editorRef.current.getQuill();
      if (!quill) return;

      // Override the default video handler
      quill?.getModule("toolbar").addHandler("video", () => {
        const url = prompt("Enter video URL (YouTube, Vimeo, etc):");
        if (url) {
          const range = quill.getSelection();
          quill.insertEmbed(range.index, "video", url);
        }
      });
    }
  }, []);

  // Initialize signature editor
  useEffect(() => {
    if (signatureEditorRef.current) {
      const quill = signatureEditorRef.current.getQuill();
      if (!quill) return;

      // Make signature editor read-only
      quill.enable(false);

      // Add custom styles to signature editor
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

  // Update signature editor when signature changes
  useEffect(() => {
    if (signatureEditorRef.current) {
      const quill = signatureEditorRef.current.getQuill();
      if (!quill) return;

      // Update signature content
      quill.root.innerHTML =
        currentSignature ||
        '<p style="color: #9ca3af; font-style: italic;">No signature selected</p>';
    }
  }, [currentSignature]);

  // Debug function to test signature
  // const testSignature = () => {
  //   const testSignature = `<p>Best regards,</p><p><strong>John Doe</strong><br>Senior Support Engineer<br>Email: john.doe@company.com</p>`;
  //   setCurrentSignature(testSignature);
  // };

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
    setSelectedIndex(index);
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

        <div className="space-x-2 flex items-center">
          <button
            className="ql-fullscreen"
            aria-label="Full Screen"
            onClick={toggleFullscreen}
          >
            ⛶
          </button>
        </div>
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

  const handleChangeValue = (event) => {
   
    setSelectedOptionValue(event);
    // setShowBcc(false);

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
            value={selectedOptionValue}
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
            freeSolo
            options={["--", "Option 1", "Option 2", "Option 3"]}
            value={notifyTag}
            onChange={(event, newValue, reason) => {
              if (reason === "createOption" || reason === "selectOption") {
                setNotifyTag(newValue);
              } else if (reason === "removeOption") {
                setNotifyTag(newValue);
              }
            }}
            onInputChange={(event, newInputValue) => {
              setNotifyValue(newInputValue);
            }}
            slotProps={{
              popper: {
                sx: {
                  zIndex: isFullscreen ? 10001 : 9999,
                },
              },
            }}
            renderTags={(tagValue, getTagProps) =>
              tagValue.map((option, index) => (
                <Chip
                  label={option}
                  {...getTagProps({ index })}
                  sx={{
                    backgroundColor: "#6EB4C9",
                    color: "white",
                    "& .MuiChip-deleteIcon": {
                      color: "white",
                    },
                  }}
                />
              ))
            }
            renderInput={(params) => (
              <TextField
                {...params}
                InputLabelProps={{ shrink: true }}
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
    ? "450px"
    : (showCc || showBcc) && currentSignature
    ? "calc(100vh - 580px)"
    : showCc || showBcc
    ? "calc(100vh - 405px)"
    : currentSignature
    ? "calc(100vh - 530px)"
    : "calc(100vh - 370px)";

  return (
    <div className={isFullscreen ? "editor-fullscreen relative " : " w-full h-full"}>
      <div
        className="flex items-center justify-between p-2 mb-2"
        style={
          isFullscreen ? { position: "relative", zIndex: 10000 } : {}
        }
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

      <div style={isFullscreen ? { position: "relative", zIndex: 10000 } : {}}>
        {renderComponentBasedOnOptions}
      </div>

     {selectedIndex === "1" && (
        <div
        className="flex items-center gap-4 mb-2 px-2"
        style={isFullscreen ? { position: "relative", zIndex: 10000 } : {}}
      >
        {showCc && (
          <div>
            <TextField
              label="Cc"
              size="small"
              margin="dense"
              // value={fields.cc}
              onChange={(e) => {}}
              sx={{ width: 400 }}
            />
          </div>
        )}

        {showBcc && (
          <div>
            <TextField
              label="Bcc"
              size="small"
              margin="dense"
              // value={fields.bcc}
              onChange={(e) => {}}
              sx={{ width: 400 }}
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
