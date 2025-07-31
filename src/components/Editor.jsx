import React, { useEffect, useState, useRef } from "react";
import { Editor } from "primereact/editor";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import CheckIcon from "@mui/icons-material/Check";
import ReplyIcon from "@mui/icons-material/Reply";
import PrivateConnectivityIcon from '@mui/icons-material/PrivateConnectivity';
import PublicIcon from '@mui/icons-material/Public';
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
  Chip
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import ShortcutIcon from "@mui/icons-material/Shortcut";
import { set } from "react-hook-form";

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
    icon:<PrivateConnectivityIcon fontSize="small" />,
    title: "Private",
    subTitle:"Only visible to you",
    value: "1",
  },
  {
    id: 2,
    icon:<PublicIcon fontSize="small" />,
    title: "Public",
    subTitle:"Visible to everyone",
    value: "2",
  },
];

const StackEditor = ({ initialContent = "", onChange, ...props }) => {
  const { isEditorExpended, isExpended,onCloseReply } = props;
  const isMounted = React.useRef(true);
  const [value, setValue] = React.useState("1");
  const [notifyValue, setNotifyValue] = React.useState("--");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const editorRef = useRef(null);
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);
  const optionsRef = React.useRef(null);
  const [selectedIndex, setSelectedIndex] = useState("1");
  const [selectedOptionValue, setSelectedOptionValue] = useState("1");
  const [showCc, setShowCc] = React.useState(false);
  const [showBcc, setShowBcc] = React.useState(false);
  const [optionChangeKey, setOptionChangeKey] = useState(0);
  const[notifyTag, setNotifyTag] = useState([]);


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

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  // useEffect(() => {
  //   if (editorRef.current) {
  //     const quill = editorRef.current.getQuill();

  //     // Set placeholder text
  //     quill.root.dataset.placeholder = "Add a note, @mention";

  //     // Optional: style the placeholder text
  //     quill.root.style.fontStyle = "italic";
  //     quill.root.style.color = "#999";
  //   }
  // }, []);

  const toggleFullscreen = () => {
    setIsFullscreen((prev) => !prev);
  };

  const handleSelect = (index) => {
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
            <button className="ql-video" aria-label="Video"></button>

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

  // const handleChange = (eventy, newValue) => {
  //   setValue(newValue);
  // };

  const handleChangeValue = (event) => {
    console.log(event);
    setSelectedOptionValue(event);
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
            size="small"
            sx={{
              width: 300,
              "& fieldset": { border: "none" }, // Removes the outline border
              "& .MuiOutlinedInput-notchedOutline": { border: "none" }, // Another safe way
            }}
          >
            {optionsofPrivate.map((item) => (
              <MenuItem key={item?.id} value={item?.value} sx={{width: 300}}>
                <div className="flex items-center gap-2">
                  <div>{item?.icon}</div>
                  <div className="flex flex-col ">
                    <span>{item?.title}</span>
                    <span className="text-xs text-gray-500">{item?.subTitle}</span>
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
              if (reason === 'createOption' || reason === 'selectOption') {
                setNotifyTag(newValue);
              } else if (reason === 'removeOption') {
                setNotifyTag(newValue);
              }
            }}
            onInputChange={(event, newInputValue) => {
              setNotifyValue(newInputValue);
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
                    "& fieldset": { borderColor: "#000" },
                    "&:hover fieldset": { borderColor: "#9ca3af" },
                    "&.Mui-focused fieldset": { borderColor: "#2eacb3" },
                  },
                  "& label.Mui-focused": { color: "#2eacb3" },
                  "& label": { fontWeight: "bold" },
                }}
              />
            )}
          />
        </div>
      )}
    </div>
  );

  return (
    <div className={isFullscreen ? "editor-fullscreen" : ""}>
      <div className="flex items-center justify-between p-2 mb-2">
        <div className="flex items-center gap-2">
          <Avatar
            src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
            sx={{ width: 25, height: 25 }}
          />

          <span
            onClick={() => setIsOptionsOpen(true)}
            className="cursor-pointer "
            ref={optionsRef}
          >
            {renderIcon}
            <KeyboardArrowDownIcon fontSize="small" />
          </span>
          {renderComponentBasedOnSelection}
        </div>
        <div>
          {!isFullscreen && (
            <IconButton onClick={onCloseReply} size="small">
              <KeyboardArrowUpIcon
                // sx={{ transform: isEditorExpended ? "rotate(180deg)" : "" }}
              />
            </IconButton>
          )}
        </div>
      </div>

      {renderComponentBasedOnOptions}

      <div className="flex items-center gap-4 mb-2 px-2">
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
      

      <Editor
        ref={editorRef}
        key={optionChangeKey}
        value={initialContent}
        onTextChange={(e) => onChange(e.htmlValue)}
        style={{
          height: isFullscreen ? "100vh" : isEditorExpended ? "500px" : "52vh",
        }}
        headerTemplate={header}
        placeholder={
          selectedIndex === "1" ? "Reply..." : "Add a note, @mention"
        }
      />
      <Popper
      
        open={isOptionsOpen}
        anchorEl={optionsRef.current}
        onClose={() => setIsOptionsOpen(false)}
        role={undefined}
        placement="bottom-start"
        transition
        disablePortal
        sx={{ zIndex: 9999,boxShadow:6 }}
      >
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin:
                placement === "bottom-start" ? "left top" : "left bottom",
            }}
          >
            <Paper
            elevation={0}
              sx={{
                p: 1,
                border: "1px solid #ccc",
              }}
            >
              {/* <div
                style={{
                  position: "absolute",
                  top: "-6px",
                  left: "8px", // Arrow aligned to right
                  width: 0,
                  height: 0,
                  borderLeft: "7px solid transparent",
                  borderRight: "7px solid transparent",
                  borderBottom: "7px solid #ccc",
                  zIndex: 999,
                }}
              /> */}
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList
                  autoFocusItem={isOptionsOpen}
                  id="composition-menu"
                  aria-labelledby="composition-button"
                  onKeyDown={handleListKeyDown}
                >
                  {selectionsOptions.map((item, index) => (
                    <div
                      className={`flex justify-between items-center px-2 py-1 cursor-pointer ${
                        selectedIndex === item.value
                          ? "bg-gray-100"
                          : "bg-transparent"
                      } hover:bg-gray-200`}
                    >
                      <MenuItem
                        key={index}
                        onClick={() => handleSelect(item.value)}
                        selected={selectedIndex === item.value} // MUI built-in selected style
                        sx={{
                          width: "100%",
                          "&.Mui-selected": {
                            backgroundColor: "transparent !important", // Remove selected background
                            color: "inherit",
                            "&:hover": {
                              backgroundColor: "transparent !important", // Remove hover when selected
                            },
                          },
                          "&:hover": {
                            backgroundColor: "transparent !important", // Remove hover when unselected
                          },
                        }}
                      >
                        {item.name}
                      </MenuItem>
                      {selectedIndex === item.value && (
                        <CheckIcon fontSize="small" sx={{ color: "#0891b2" }} />
                      )}
                    </div>
                  ))}
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </div>
  );
};

export default StackEditor;
