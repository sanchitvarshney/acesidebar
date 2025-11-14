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
  Alert,
  Snackbar,
  CircularProgress,
} from "@mui/material";
import CustomSearch from "../../components/common/CustomSearch";
import DeleteIcon from "@mui/icons-material/Delete";
import { useEffect, useState } from "react";
import EditIcon from "@mui/icons-material/Edit";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import emptyimg from "../../assets/image/overview-empty-state.svg";
import LoadingCheck from "../../components/reusable/LoadingCheck";
import {
  useAddShortcutMutation,
  useDeleteShortcutMutation,
  useEditShortcutMutation,
  useGetShortCutListQuery,
} from "../../services/threadsApi";
import { useToast } from "../../hooks/useToast";

const elementValue = [
  {
    id: 1,
    name: "Text",
    value: "HTML",
  },
  {
    id: 2,
    name: "Attachment",
    value: "FILE",
  },
  {
    id: 3,
    name: "Form",
    value: "FORM",
  },
];

const ShortcutsTab = () => {
  const { showToast } = useToast();
  const [isAddShortcutOpen, setIsAddShortcutOpen] = useState<any>(false);
  const [isEditShortCut, setIsEditShortCut] = useState(false);
  const [selectedElement, setSelectedElement] = useState<any>("");
  const [shortcutName, setShortcutName] = useState<any>("");
  const [shortcutId, setShortcutId] = useState<any>("");
  const [message, setMessage] = useState<any>("");
  const [trackId, setTrackId] = useState<any>("");
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const {
    data: shortcutList,
    isLoading: shortcutLoading,
    refetch,
  } = useGetShortCutListQuery({ refetchOnMountOrArgChange: true });
  const [editShortcut, { isLoading: editLoading }] = useEditShortcutMutation();
  const [addShortcut, { isLoading: addLoading, data: addData }] =
    useAddShortcutMutation();
  const [deleteShortcut, { isLoading: deleteLoading }] =
    useDeleteShortcutMutation();

  const handleChangeValue = (event: any) => {
    console.log("event", event);

    const valueData = event?.target?.value ? event?.target?.value : event;
    setSelectedElement(valueData);
  };

  const handledelete = (id: any) => {
    const payload = {
      key: id,
    };
    deleteShortcut(payload).then((res: any) => {
      console.log("res", res);
      if (res?.data?.type === "error") {
        showToast(res?.data?.message || "An error occurred", "error");
        return;
      }
      refetch();
    });
  };

  const handleSubmit = async () => {
    if (!shortcutName.trim() || !message.trim()) {
      return;
    }

    try {
      if (isEditShortCut) {
        // Edit existing shortcut
        const payload = {
          key: shortcutId,
          body: {
            shortcut: shortcutName,
            text: message,
            type: "HTML",
          },
        };

        editShortcut(payload).then((res: any) => {
          if (res?.data?.success !== true) {
            showToast(res?.data?.message || "An error occurred", "error");
            return;
          }
          refetch();
          resetForm();

          setIsEditShortCut(false);
        });
      } else {
        // Create new shortcut
        const payload = {
          shortcut: shortcutName,
          text: message,
          type: "HTML",
        };

        addShortcut(payload).then((res: any) => {
          if (res?.data?.success !== true) {
            showToast(res?.data?.message || "An error occurred", "error");
            return;
          }
          refetch();
          showToast(
            res?.data?.message || "Add shortcut successfully",
            "success"
          );
          resetForm();
          setIsAddShortcutOpen(false);
        });
      }
    } catch (error: any) {}
  };

  const resetForm = () => {
    setShortcutName("");
    setMessage("");
    setSelectedElement("");
    setShortcutId("");
  };

  const handleEditShortcut = (id: any) => {
    const item = shortcutList.find((item: any) => item.key === id);

    if (item) {
      const removeSlash = item.shortcut.replace("/", "");
      setShortcutName(removeSlash);
      setMessage(item.text);
      handleChangeValue(item?.type);
      setShortcutId(id);
      setIsEditShortCut(true);
      setIsAddShortcutOpen(false);
    }
  };

  const handleCancel = () => {
    if (isEditShortCut) {
      setIsEditShortCut(false);
    } else {
      setIsAddShortcutOpen(false);
    }
    resetForm();
  };

  const handleAddNewShortcut = () => {
    setIsAddShortcutOpen(true);
    setIsEditShortCut(false);
    resetForm();
  };

  useEffect(() => {
    if (!loading) {
      return;
    }
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, [loading]);

  // Filter shortcuts based on search query
  const filteredShortcuts =
    shortcutList?.filter((item: any) => {
      if (!searchQuery.trim()) return true;

      const searchLower = searchQuery.toLowerCase();
      const shortcutName = item.shortcut?.toLowerCase() || "";
      const shortcutText = item.text?.toLowerCase() || "";

      return (
        shortcutName.includes(searchLower) || shortcutText.includes(searchLower)
      );
    }) || [];

  return (
    <div className="p-2 w-full">
      <div className="font-semibold text-xs mb-2 text-gray-500">Shortcuts</div>
      {/* <div className="text-xs text-gray-500">No shortcuts found</div> */}
      <CustomSearch
        width="100%"
        placeholder="Search shortcuts..."
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setSearchQuery(e.target.value)
        }
      />

      <div className="my-3 wi-full h-[calc(100vh-350px)] overflow-y-auto">
        {isAddShortcutOpen || isEditShortCut ? (
          <div className="flex flex-col gap-3">
            <div>
              {" "}
              <span className="text-sm text-gray-500 font-semibold">
                Shortcut
              </span>{" "}
              <TextField
                size="small"
                placeholder="Enter Shortcut"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  let value = e.target.value;

                  value = value.replace(/[^a-zA-Z0-9_]/g, "").slice(0, 20);
                  setShortcutName(value);
                }}
                value={shortcutName}
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment
                      position="start"
                      sx={{
                        color: "#6366f1",
                        px: 1,
                        py: 0.5,
                        mr: 1,
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
                      borderColor: "#ccc",
                    },
                    "&:hover fieldset": {
                      borderColor: "#ccc",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#2566b0",
                    },
                  },
                  "& .MuiInputLabel-root": {
                    fontStyle: "italic",
                    color: "#999",
                  },
                  "& .MuiInputLabel-root.Mui-focused": {
                    color: "green",
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
                    borderColor: "#2566b0", // border color on focus
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
            {/* 
            <Box sx={{ minWidth: 200 }}>
              <FormControl fullWidth>
                <InputLabel>Add Element</InputLabel>
                <Select
                  value={selectedElement}
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
            </Box> */}
          </div>
        ) : (
          <div className="flex flex-col gap-3 my-2">
            {shortcutLoading ? (
              <CircularProgress size={20} />
            ) : (
              <>
                {" "}
                {filteredShortcuts?.length > 0 ? (
                  <>
                    {(filteredShortcuts ?? [])?.map((item: any) => (
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
                            {item.elements && item.elements.length > 0 && (
                              <Box mt={1}>
                                <Typography
                                  variant="caption"
                                  sx={{
                                    color: "#6b7280",
                                    fontSize: "0.75rem",
                                  }}
                                >
                                  Elements:{" "}
                                  {item.elements
                                    .map((el: any) => el.value)
                                    .join(", ")}
                                </Typography>
                              </Box>
                            )}
                          </Box>

                          <Box display="flex" gap={1}>
                            <IconButton
                              size="small"
                              onClick={() => handleEditShortcut(item.key)}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                            {loading && trackId === item.key ? (
                              <LoadingCheck />
                            ) : (
                              <IconButton
                                size="small"
                                onClick={() => {
                                  setTrackId(item.key);
                                  navigator.clipboard.writeText(
                                    item.description
                                  );
                                  setLoading(true);
                                }}
                              >
                                <ContentCopyIcon fontSize="small" />
                              </IconButton>
                            )}

                            <IconButton
                              size="small"
                              onClick={() => {
                                setTrackId(item.key);
                                handledelete(item.key);
                              }}
                            >
                              {deleteLoading && trackId === item.key ? (
                                <CircularProgress size={16} />
                              ) : (
                                <DeleteIcon fontSize="small" color="error" />
                              )}
                            </IconButton>
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
                    {searchQuery.trim() ? (
                      <div className="text-sm text-gray-500 mt-2">
                        No shortcuts found matching "{searchQuery}"
                      </div>
                    ) : (
                      <div className="text-sm text-gray-500 mt-2">
                        No shortcuts found
                      </div>
                    )}
                  </div>
                )}
              </>
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
              onClick={handleCancel}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={handleSubmit}
              disabled={!shortcutName.trim() || !message.trim()}
            >
              {editLoading || addLoading ? (
                <CircularProgress color="inherit" size={20} />
              ) : isEditShortCut ? (
                "Update"
              ) : (
                "Save"
              )}
            </Button>
          </div>
        ) : (
          <Button
            variant="contained"
            color="primary"
            sx={{ fontWeight: 600 }}
            fullWidth
            onClick={handleAddNewShortcut}
          >
            Add New Shortcut
          </Button>
        )}
      </div>
    </div>
  );
};

export default ShortcutsTab;
