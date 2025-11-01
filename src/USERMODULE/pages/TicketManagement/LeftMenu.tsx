import React, { useState } from "react";
import {
  Box,
  Collapse,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Tooltip,
  Typography,
} from "@mui/material";

import AddTaskIcon from "@mui/icons-material/AddTask";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { useHelpCenter } from "../../../contextApi/HelpCenterContext";

const LeftMenu: React.FC = () => {
  const [gettingStartedExpanded, setGettingStartedExpanded] = useState(false);
  const { helpCenterOpen, closeHelpCenter } = useHelpCenter();

  const gettingStartedItems = [
    {
      id: 1,
      title: "Learn the basics",
      completed: false,
      isOptional: false,
      icon: <AddTaskIcon />,
    },
 {
      id: 2,
      title: "Advanced setup",
      completed: true,
      isOptional: true,
      icon: <AddTaskIcon />,
    },
  ];

  return (
    <Box
      sx={{
        height: "100%",
        minHeight: "calc(100vh - 70px)",

        overflow: "visible",
        width: gettingStartedExpanded ? 240 : 55,
        transition: "width 0.3s ease",
        backgroundColor: "#e8f0fe",
        marginTop: 8,
        display: helpCenterOpen ? "none" : "flex",
        position: "relative",
      }}
    >
      {/* Expanded Collapse (Replaces sidebar) */}
      <div>
        <Collapse
          in={gettingStartedExpanded}
          orientation="horizontal"
          timeout={400}
          unmountOnExit={false}
          sx={{
            display: "flex",
            backgroundColor: "#e8f0fe",
            height: "100%",
            minHeight: "calc(100vh - 70px)",
          }}
        >
          <Box
            sx={{
              width: 240,
              py: 2,

              height: "100%",
              display: "flex",
              justifyContent: "space-between",
              flexDirection: "column",
            }}
          >
            <Box sx={{ pr: 1 }}>
              <List
                dense
                sx={{ display: "flex", gap: 1, flexDirection: "column" }}
              >
                {gettingStartedItems.map((item) => (
                  <ListItem
                    key={item.id}
                    sx={{
                      borderTopRightRadius: 30,
                      borderBottomRightRadius: 30,
                      py: 1,
                      "&:hover": { bgcolor: "#fff" },
                    }}
                  >
                    {/* <ListItemIcon>{item.icon}</ListItemIcon> */}
                    <ListItemText primary={item.title} />
                  </ListItem>
                ))}
              </List>
            </Box>

            <div className="flex justify-end py-4 border-t border-gray-200">
              <IconButton
                onClick={() => setGettingStartedExpanded(false)}
                sx={{
                  borderRadius: 0,
                  borderTopLeftRadius: 10,
                  borderBottomLeftRadius: 10,
                }}
              >
                <ArrowForwardIosIcon sx={{ transform: "rotate(180deg)" }} />
              </IconButton>
            </div>
          </Box>
        </Collapse>
      </div>
      <div>
        {!gettingStartedExpanded && (
          <Box
            sx={{
              opacity: gettingStartedExpanded ? 0 : 1,
              transition: "opacity 0.2s ease, visibility 0.2s ease",
              width: 55,
              minWidth: 55,
              justifyItems: "flex-end",
              height: "100%",
            }}
          >
            <IconButton
              sx={{
                borderRadius: 0,
                borderTopRightRadius: 10,
                borderBottomRightRadius: 10,
                position: "absolute",
                bottom: "5%",
                right: "35%",
              }}
              onClick={() => setGettingStartedExpanded(true)}
            >
              <ArrowForwardIosIcon />
            </IconButton>
          </Box>
        )}
      </div>
    </Box>
  );
};

export default LeftMenu;
