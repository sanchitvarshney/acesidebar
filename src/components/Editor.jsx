import React, { useEffect, useState } from "react";
import { Editor } from "primereact/editor";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { IconButton, Typography } from "@mui/material";
import ReplyIcon from '@mui/icons-material/Reply';
import PrivateConnectivityIcon from '@mui/icons-material/PrivateConnectivity';
const StackEditor = ({ initialContent = "", onChange, ...props }) => {
  const { isEditorExpended, isExpended } = props;
  const isMounted = React.useRef(true);
  const [value, setValue] = React.useState('1');
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  const toggleFullscreen = () => {
    setIsFullscreen((prev) => !prev);
  };

  const uploadImageCallback = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        setTimeout(() => {
          if (isMounted.current) {
            resolve({ data: { link: reader.result } });
          }
        }, 0);
      };
      reader.onerror = () => {
        if (isMounted.current) {
          reject(new Error("Image upload failed"));
        }
      };
      reader.readAsDataURL(file);
    });
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
          {/* <label for="elementSelect">Add Element</label> */}

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
  

  const handleChange = (eventy, newValue) => {
    setValue(newValue);
  };


  return (
    <div className={isFullscreen ? "editor-fullscreen" : ""}>
       <TabContext value={value}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" , width:"100%", display:"flex", alignItems:"center",justifyContent:"space-between"}}>
        <TabList onChange={handleChange}  aria-label="lab API tabs example">
          <Tab label={<div><Typography><ReplyIcon /> Reply</Typography></div>} value="1" />
          <Tab label={<div><Typography><PrivateConnectivityIcon /> Whisper</Typography></div>} value="2" />
     
        </TabList>
          {!isFullscreen && (
            <IconButton onClick={isExpended}>
              <KeyboardArrowUpIcon
                sx={{ transform: isEditorExpended ? "rotate(180deg)" : "" }}
              />
            </IconButton>
          )}
      </Box>
      </TabContext>
      <Editor
        value={initialContent}
        onTextChange={(e) => {}}
        style={{
          height: isFullscreen ? "100vh" : isEditorExpended ? "300px" : "120px",
        }}
        headerTemplate={header}
      />
    </div>
  );
};

export default StackEditor;
