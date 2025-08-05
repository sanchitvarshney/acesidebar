import {
  Box,
  Button,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  ListItem,
  ListItemButton,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import CustomSearch from "./common/CustomSearch";
import { useEffect, useState } from "react";
import ClearIcon from "@mui/icons-material/Clear";
import EditIcon from "@mui/icons-material/Edit";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { AppDispatch, RootState } from "../reduxStore/Store";
import { useDispatch, useSelector } from "react-redux";
import { setShotcuts } from "../reduxStore/Slices/shotcutSlices";
import emptyimg from "../assets/image/overview-empty-state.svg"
import LoadingCheck from "./reusable/LoadingCheck";

const elementValue = [
  {
    id: 1,
    name: "Ticket Form",
    value: "Ticket Form",
  },
  {
    id: 2,
    name: "File",
    value: "File",
  },
  {
    id: 3,
    name: "Lead Capture Form",
    value: "Lead Capture Form",
  },
  {
    id: 3,
    name: "Suggested Messages",
    value: "Suggested Messages",
  },
];

const ShortcutsTab = () => {
  const [isAddShortcutOpen, setIsAddShortcutOpen] = useState(false);
  const [isEditShortCut, setIsEditShortCut] = useState(false);
  const [selectedElement, setSelectedElement] = useState<any>([]);
  const [shortcutName, setShortcutName] = useState<any>("");
  const [shortcutId, setShortcutId] = useState<any>("");
  const [message, setMessage] = useState<any>("");
  const { shotcutData } = useSelector((state: RootState) => state.shotcut);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch<AppDispatch>();

  const handleChangeValue = (event: any) => {
    setSelectedElement((prev: any) => {
      return [
        ...prev,
        {
          id: new Date().getTime(),
          name: event.target.value,

          value: event.target.value,
        },
      ];
    });
    setShortcutName("");
  };

  const handleDeleteItem = (id: any) => {
    setSelectedElement((prev: any) =>
      prev.filter((item: any) => item.id !== id)
    );
  };

  const handleSubmit = () => {
    if (isEditShortCut) {
      dispatch(
        setShotcuts(
          shotcutData.map((item: any) => {
            if (item.id === shortcutId) {
              return {
                ...item,
                shortcutName: "/" + shortcutName,
                message: message,
              };
            }
            return item;
          })
        )
      );
      setIsEditShortCut(false);
    } else {
      dispatch(
        setShotcuts([
          ...shotcutData,
          {
            id: Date.now(),
            shortcutName: "/" + shortcutName,
            message: message,
          },
        ])
      );
      setIsAddShortcutOpen(false);
    }
  };

  const handleEditShortcut = (id: any) => {
    const item = shotcutData.find((item: any) => item.id === id);
    const removeSlash = item.shortcutName.replace("/", "");
    setShortcutName(removeSlash);
    setMessage(item.message);
    setShortcutId(id);
    setIsEditShortCut(true);
  };

  useEffect(() => {
    if (!loading) {
      return;
    }
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, [loading]);

  return (
    <div className="p-2 w-full">
      <div className="font-semibold text-xs mb-2 text-gray-500">Shortcuts</div>
      {/* <div className="text-xs text-gray-500">No shortcuts found</div> */}
      <CustomSearch width="100%" placeholder="Search" onChange={() => {}} />

      <div className="my-3 wi-full h-[calc(100vh-375px)] overflow-y-auto">
        {isAddShortcutOpen || isEditShortCut ? (
          <div className="flex flex-col gap-3">
            <div>
              {" "}
              <span className="text-sm text-gray-500 font-semibold">
                Shortcut
              </span>{" "}
              <TextField
                size="small"
                placeholder={"Enter Shortcut"}
                onChange={(e: any) => setShortcutName(e.target.value)}
                value={shortcutName}
                // rows={rows}
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment
                      position="start"
                      sx={{ 
                        color: "#6366f1",
                        px: 1,
                        py: 0.5,
                        mr: 1
                      }}
                    >
                      /
                    </InputAdornment>
                  ),
                }}
                sx={{
                  width: "100%",
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "#ccc", // default border
                    },
                    "&:hover fieldset": {
                      borderColor: "#ccc", // border color on hover
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#1a73e8", // border color on focus
                      // backgroundColor: "#fff",
                    },
                  },
                  "& .MuiInputLabel-root": {
                    fontStyle: "italic",
                    color: "#999", // default label color
                  },
                  "& .MuiInputLabel-root.Mui-focused": {
                    color: "green", // label color on focus
                  },
                  "& .MuiOutlinedInput-input::placeholder": {
                    fontStyle: "italic",
                    color: "gray",
                    opacity: 1,
                  },
                }}
              />
            </div>
            <TextField
              size="small"
              placeholder={"Enter Message"}
              onChange={(e) => setMessage(e.target.value)}
              multiline
              rows={5}
              value={message}
              // rows={rows}
              InputLabelProps={{ shrink: true }}
              sx={{
                width: "100%",
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "#ccc", // default border
                  },
                  "&:hover fieldset": {
                    borderColor: "#ccc", // border color on hover
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#1a73e8", // border color on focus
                    // backgroundColor: "#fff",
                  },
                },
                "& .MuiInputLabel-root": {
                  fontStyle: "italic",
                  color: "#999", // default label color
                },
                "& .MuiInputLabel-root.Mui-focused": {
                  color: "green", // label color on focus
                },
                "& .MuiOutlinedInput-input::placeholder": {
                  fontStyle: "italic",
                  color: "gray",
                  opacity: 1,
                },
              }}
            />

            {selectedElement && selectedElement.length > 0 && (
              <div className="w-full  ">
                {selectedElement.map((item: any) => (
                  <div
                    className="flex items-center justify-between p-2"
                    key={item.id}
                  >
                    <span>{item.value}</span>
                    <IconButton onClick={() => handleDeleteItem(item.id)}>
                      <ClearIcon sx={{ fontSize: "20px" }} />
                    </IconButton>
                  </div>
                ))}
              </div>
            )}
            <Box sx={{ minWidth: 200 }}>
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">
                  Add Element
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  //   value={}
                  label="Add Element"
                  onChange={handleChangeValue}
                >
                  {elementValue.map((item) => (
                    <MenuItem key={item?.id} value={item?.value}>
                      {item?.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </div>
        ) : (
          <div className="flex flex-col gap-3 my-2">
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
                    <Box
                      display="flex"
                      gap={2}
                      width="100%"
                      alignItems="center"
                    >
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
                          onClick={() => handleEditShortcut(item.id)}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        {loading ? (
                          <LoadingCheck />
                        ) : (
                          <IconButton
                            size="small"
                            onClick={() => {
                              navigator.clipboard.writeText(item.message);
                              setLoading(true);
                            }}
                          >
                            <ContentCopyIcon fontSize="small" />
                          </IconButton>
                        )}
                      </Box>
                    </Box>
                  </ListItem>
                ))}
              </>
            ) : (
              <div className="flex flex-col items-center mt-4">
                <img
                  src={emptyimg}
                  alt="notes"
                  className="mx-auto w-40 h-40"
                />
              </div>
            )}
          </div>
        )}
      </div>

      <div className="py-1 shadow-2xl/30  ">
        {isAddShortcutOpen || isEditShortCut ? (
          <div className="flex gap-2 ">
            <Button
              variant="contained"
              color="inherit"
              fullWidth
              onClick={() => {
                if (isEditShortCut) {
                  setIsEditShortCut(false);
                } else {
                  setIsAddShortcutOpen(false);
                }
              }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              sx={{ bgcolor: "#1a73e8", color: "white" }}
              fullWidth
              onClick={handleSubmit}
            >
              {isEditShortCut ? "Update" : "Save"}
            </Button>
          </div>
        ) : (
          <Button
            variant="contained"
            sx={{ bgcolor: "#1a73e8", color: "white" }}
            fullWidth
            onClick={() => {
              setIsAddShortcutOpen(true);
              setShortcutName("");
              setMessage("");
            }}
          >
            Add New Shortcut
          </Button>
        )}
      </div>
    </div>
  );
};

export default ShortcutsTab;
