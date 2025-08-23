import {
  Typography,
  Button,
  Divider,
  List,
  ListItem,
  ListItemButton,
  Box,
} from "@mui/material";

import { Bell, Trash2 } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "../../reduxStore/Store";

const ShotCutContent = ({
  onChange,
  onClose,
  stateChangeKey,
}: {
  onChange: any;
  onClose: any;
  stateChangeKey: any;
}) => {
  const { shotcutData } = useSelector((state: RootState) => state.shotcut);

  return (
    <div className="w-full  bg-white rounded-[6px] shadow-2xl  overflow-hidden">
      {/* Header */}
      <div className="bg-[#1a73e8] p-2 text-white">
        <Typography sx={{ fontSize: 16, fontWeight: 600 }}>
          Shortcut's
        </Typography>
      </div>

      <div className="max-h-70 overflow-y-auto custom-scrollbar-for-menu">
        {/* Content */}
        {shotcutData.length <= 0 ? (
          <div className="p-3 space-y-2">
            <span>No Shotcuts</span>
          </div>
        ) : (
          shotcutData?.map((item: any, index: number) => (
            <ListItem
              key={item.id}
              component="div"
              disablePadding
              sx={{
                backgroundColor: "#fff",
                transition: "background-color 0.2s ease",
              }}
            >
              <ListItemButton
                sx={{
                  padding: "12px 16px",
                  alignItems: "flex-start",
                  minHeight: 60,
                  //   borderRadius: 1,
                  transition: "box-shadow 0.2s",
                  "&:hover, &:focus": {
                    backgroundColor: "#ddddddff",
                    boxShadow: "0 2px 8px rgba(25, 118, 210, 0.08)",
                  },
                }}
                tabIndex={0}
                onClick={() => {
                  onChange(item.message);
                  stateChangeKey();
                  onClose();
                }}
              >
                <Box
                  display="flex"
                  gap={2}
                  width="100%"
                  alignItems="flex-start"
                >
                  <Box flex={1} minWidth={0}>
                    <Box display="flex" gap={1}>
                      {/* <div className="flex  justify-between w-full items-center"> */}
                      <Typography
                        variant="subtitle2"
                        fontWeight={600}
                        sx={{
                          color: "#2c3e50",
                          fontSize: "0.9rem",
                          lineHeight: 1.2,
                        }}
                      >
                        {item.shortcutName}
                      </Typography>

                      {/* </div> */}
                    </Box>

                    <Typography
                      variant="body2"
                      sx={{
                        color: "#34495e",
                        lineHeight: 1.4,
                        fontSize: "0.8rem",
                        wordBreak: "break-word",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {item.message}
                    </Typography>
                  </Box>
                </Box>
              </ListItemButton>
            </ListItem>
          ))
        )}
      </div>
    </div>
  );
};

export default ShotCutContent;
