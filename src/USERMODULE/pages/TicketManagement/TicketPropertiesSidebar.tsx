import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import PersonIcon from "@mui/icons-material/Person";
import ShareIcon from "@mui/icons-material/Share";
import InfoIcon from "@mui/icons-material/Info";
import DescriptionIcon from "@mui/icons-material/Description";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import ContentCutIcon from "@mui/icons-material/ContentCut";
import AboutTab from "./AboutTab";
import SharingTab from "./SharingTab";
import InfoTab from "./InfoTab";
import NotesTab from "./NotesTab";
import SaveIcon from "@mui/icons-material/Save";
import { Close } from "@mui/icons-material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import {
  Autocomplete,
  Chip,
  CircularProgress,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import ShortcutsTab from "../../components/ShortcitsTab";
import CloseIcon from "@mui/icons-material/Close";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import emptyimg from "../../../assets/image/overview-empty-state.svg";
import { useCommanApiMutation } from "../../../services/threadsApi";
import { useToast } from "../../../hooks/useToast";

import { useGetTagListQuery } from "../../../services/ticketAuth";
import { Icon } from "lucide-react";
import StatusTab from "./StatusTab";

// Placeholder components for new top-level tabs
const KnowledgeBaseTab = () => (
  <div className="p-4 flex flex-col justify-center items-center w-full h-full">
    <img src={emptyimg} alt="No Knowledge" className="mb-4" />
    <div className="font-semibold text-base mb-2">Knowledge Base</div>
    <div className="text-xs text-gray-500">No articles found</div>
  </div>
);

const topTabs = [
  {
    key: "status",
    icon: <CheckCircleIcon fontSize="small" />,
    label: "Status",
  },
  { key: "profile", icon: <PersonIcon fontSize="small" />, label: "Profile" },
  {
    key: "knowledge",
    icon: <MenuBookIcon fontSize="small" />,
    label: "Knowledge Base",
  },
  {
    key: "shortcuts",
    icon: <ContentCutIcon fontSize="small" />,
    label: "Shortcuts",
  },
];

const profileTabs = [
  { key: "about", icon: <PersonIcon fontSize="small" />, label: "About" },
  { key: "share", icon: <ShareIcon fontSize="small" />, label: "Sharing" },
  { key: "info", icon: <InfoIcon fontSize="small" />, label: "Info" },
  { key: "notes", icon: <DescriptionIcon fontSize="small" />, label: "Notes" },
];

const TicketPropertiesSidebar = ({ ticket }: any) => {
  const { showToast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const { data: tagList } = useGetTagListQuery();
  const [activeTopTab, setActiveTopTab] = useState<any>(0);
  const [activeProfileTab, setActiveProfileTab] = useState(0);
  const [tags, setTags] = useState<any>([]);
  const [editTags, setEditTags] = useState<any>([]);
  const [options, setOptions] = useState<any>([]);
  const [triggerCommanApi] = useCommanApiMutation();
  const [triggerUpdateUserData, { isLoading: isUserDataLoading, isSuccess }] =
    useCommanApiMutation();

  const [editChangeValue, setEditChangeValue] = React.useState("");

  const displayOptions = editChangeValue.length >= 3 ? options : [];

  const fetchOptions = (value: string) => {
    if (!value || value.length < 3) return [];
    const filteredOptions = tagList?.filter((option: any) =>
      option.tagName?.toLowerCase().includes(value?.toLowerCase())
    );
    return filteredOptions || [];
  };

  useEffect(() => {
    if (editChangeValue.length >= 3) {
      const filterValue: any = fetchOptions(editChangeValue);
      setOptions(filterValue);
    } else {
      setOptions([]);
    }
  }, [editChangeValue, tagList]);

  useEffect(() => {
    if (!ticket) return;
    setTags(ticket?.tags);
  }, [ticket, isSuccess]);

  const handleDeleteTag = (tagId: number) => {
    if (!tagId || !ticket?.ticketId) {
      showToast("Invalid tag ID or ticket ID", "error");
      return;
    }
    const credentials = {
      ticket: ticket?.ticketId,
      tag: tagId,
    };
    const payload = {
      url: `delete-tag/${credentials.ticket}/${credentials.tag}`,
      method: "DELETE",
    };
    triggerCommanApi(payload).then((res: any) => {
      if (res?.data?.success !== true) {
        showToast(res?.data?.message || "An error occurred", "error");
        return;
      }
      setTags((prevTags: any) =>
        prevTags.filter((tag: any) => tag.key !== tagId)
      );
    });
  };

  const handleTopTabChange = (
    event: React.SyntheticEvent,
    newValue: number
  ) => {
    console.log(newValue);
    setActiveTopTab(newValue);
  };

  const handleProfileTabChange = (
    event: React.SyntheticEvent,
    newValue: number
  ) => {
    setActiveProfileTab(newValue);
  };

  const handleSave = () => {
    const credentials = {
      ticket: ticket?.ticketId,
      tags: editTags,
    };
    const payload = {
      url: `add-tag`,
      body: {
        ticket: credentials.ticket,
        tags: credentials.tags,
      },
    };
    triggerUpdateUserData(payload).then((res: any) => {
      if (res?.data?.success !== true) {
        showToast(res?.data?.message || "An error occurred", "error");
        return;
      }
      // updatetag after save
    });

    setIsEditing(false);
  };

  const handleSelectedOption = (_: any, newValue: any) => {
    if (!Array.isArray(newValue)) return;

    // Normalize keys: ensure each item has tagId (not tagID)
    const normalizedNewValue = newValue.map((tag: any) => ({
      tagId: tag.tagId ?? tag.tagID,
      tagName: tag.tagName,
    }));

    // Find the newly added tag
    const previousTagIds = editTags.map((tag: any) => tag.tagId);
    const newlyAddedTag = normalizedNewValue.find(
      (tag: any) => !previousTagIds.includes(tag.tagId)
    );

    if (newlyAddedTag) {
      // Add newly added tag
      setEditTags((prev: any) => [...prev, newlyAddedTag]);
    } else {
      // If no new tag found, just update the state (e.g., after deletion)
      setEditTags(normalizedNewValue);
    }
  };

  const toggleEdit = () => {
    if (isEditing) {
      handleSave();
    } else {
      if (tags.length > 0) {
        setEditTags(tags);
      } else {
        setEditTags([]);
      }
      setIsEditing(true);
    }
  };

  // Top-level tab content
  let mainContent = null;
  if (activeTopTab === 1) {
    // profile
    mainContent = (
      <div className="w-full overflow-hidden ">
        <div className="flex items-center gap-3 mb-4">
          <Avatar
            sx={{
              bgcolor: "#FFC107",
              width: 48,
              height: 48,
              fontWeight: "bold",
              fontSize: 24,
            }}
          >
            {ticket?.username?.[0]?.toUpperCase() || "?"}
          </Avatar>
          <div>
            <div className="font-semibold text-base text-gray-800">
              {ticket?.username}
            </div>
          </div>
        </div>

        {/* Profile tab bar using MUI Tabs */}
        <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }}>
          <Tabs
            value={activeProfileTab}
            onChange={handleProfileTabChange}
            variant="scrollable"
            scrollButtons="auto"
            allowScrollButtonsMobile
            sx={{
              "& .MuiTabs-flexContainer": {
                display: "flex",
                justifyContent: "space-between", // <-- apply here
                alignItems: "center",
              },
              "& .MuiTab-root": {
                // minHeight: 40,
                color: "#6b7280",
                "&.Mui-selected": {
                  color: "#1a73e8",
                },
              },
              "& .MuiTabs-indicator": {
                backgroundColor: "#1a73e8",
                // height: 2,
              },
            }}
          >
            {profileTabs.map((tab, index) => (
              <Tab
                key={tab.key}
                icon={tab.icon}
                id={`profile-tab-${index}`}
                aria-controls={`profile-tabpanel-${index}`}
                aria-label={tab.label}
                sx={{
                  minWidth: 60,
                }}
              />
            ))}
          </Tabs>
        </Box>

        <div className="w-full h-[calc(100vh-365px)] overflow-y-scroll">
          {/* Profile tab content */}
          {activeProfileTab === 0 && <AboutTab ticketData={ticket} />}
          {activeProfileTab === 1 && <SharingTab ticketData={ticket} />}
          {activeProfileTab === 2 && <InfoTab />}
          {activeProfileTab === 3 && <NotesTab ticketData={ticket} />}

          {/* Organization section */}
          <div className="bg-white rounded border border-gray-200 p-2 flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <div className="space-x-2">
                {" "}
                <LocalOfferIcon sx={{ fontSize: 20 }} />
                <span className="text-sm font-medium">Tags</span>
              </div>
              {isUserDataLoading ? (
                <CircularProgress size={16} />
              ) : (
                <div>
                  <IconButton
                    size="small"
                    onClick={() => isEditing && setIsEditing(false)}
                  >
                    {isEditing && <Close sx={{ fontSize: 20 }} />}
                  </IconButton>
                  <IconButton size="small" onClick={toggleEdit}>
                    {isEditing ? (
                      <SaveIcon sx={{ fontSize: 20 }} />
                    ) : (
                      <ModeEditIcon sx={{ fontSize: 20 }} />
                    )}
                  </IconButton>
                </div>
              )}
            </div>
            {isEditing ? (
              <Box sx={{ width: "100%" }}>
                <Autocomplete
                  multiple
                  disableClearable
                  popupIcon={null}
                  getOptionLabel={(option) => {
                    if (typeof option === "string") return option;
                    return option.tagName || option.name || "";
                  }}
                  options={displayOptions}
                  value={editTags}
                  onChange={(event, newValue) => {
                    handleSelectedOption(event, newValue);
                  }}
                  onInputChange={(_, value) => setEditChangeValue(value)}
                  filterOptions={(x) => x}
                  getOptionDisabled={(option) => option === "Type to search"}
                  noOptionsText={
                    editChangeValue.length < 3
                      ? "Type at least 3 characters to search"
                      : "No tags found"
                  }
                  renderOption={(props, option) => {
                    return (
                      <li {...props}>
                        {typeof option === "string" ? (
                          option
                        ) : (
                          <div
                            className="flex items-center gap-3 p-1 rounded-md w-full"
                            style={{ cursor: "pointer" }}
                          >
                            <div className="flex flex-col">
                              <Typography
                                variant="subtitle2"
                                sx={{ fontWeight: 600 }}
                              >
                                {option.tagName}
                              </Typography>
                            </div>
                          </div>
                        )}
                      </li>
                    );
                  }}
                  renderTags={(editTags, getTagProps) =>
                    editTags?.map((option, index) => (
                      <Chip
                        variant="outlined"
                        color="primary"
                        key={index}
                        label={
                          typeof option === "string"
                            ? option
                            : option.name ?? option.tagName
                        }
                        onDelete={() => {
                          const newTags = editTags.filter(
                            (_, i) => i !== index
                          );
                          setEditTags(newTags);
                        }}
                        sx={{
                          cursor: "pointer",
                          height: "20px",
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
                    ))
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="outlined"
                      size="small"
                      fullWidth
                      placeholder="Type at least 3 characters to search tags..."
                      sx={{
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
              </Box>
            ) : (
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                {tags?.map((item: any) => {
                  return (
                    <Chip
                      key={item.key}
                      label={item.name}
                      onDelete={() => handleDeleteTag(item.key)}
                      deleteIcon={
                        <CloseIcon
                          sx={{
                            transition: "color 0.2s",
                          }}
                        />
                      }
                      sx={{
                        "&:hover .MuiChip-deleteIcon": {
                          color: "error.main",
                        },
                        "& .MuiChip-deleteIcon": {
                          fontSize: 18,
                        },
                      }}
                    />
                  );
                })}
              </Box>
            )}
          </div>
        </div>
      </div>
    );
  } else if (activeTopTab === 2) {
    // knowledge
    mainContent = <KnowledgeBaseTab />;
  } else if (activeTopTab === 3) {
    // shortcuts
    mainContent = <ShortcutsTab />;
  } else if (activeTopTab === 0) {
    // history
    mainContent = <StatusTab ticket={ticket} />;
  }

  return (
    <Box
      sx={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#f8f9fa",
        // overflow: "hidden",
      }}
    >
      {/* Top-level tab bar using MUI Tabs */}
      <Box
        sx={{
          borderBottom: 1,
          borderColor: "divider",
          backgroundColor: "white",
          flexShrink: 0,
          overflow: "hidden",
        }}
      >
        <Tabs
          value={activeTopTab}
          onChange={handleTopTabChange}
          variant="scrollable"
          scrollButtons="auto"
          allowScrollButtonsMobile
          sx={{
            "& .MuiTabs-flexContainer": {
              display: "flex",
              justifyContent: "space-between", // <-- apply here
              alignItems: "center",
              mx: 1,
            },
            "& .MuiTab-root": {
              color: "#6b7280",

              "&.Mui-selected": {
                color: "#1a73e8",
              },
            },
            "& .MuiTabs-indicator": {
              backgroundColor: "#1a73e8",
            },
          }}
        >
          {topTabs.map((tab, index) => (
            <Tab
              key={tab.key}
              icon={tab.icon}
              id={`top-tab-${index}`}
              aria-controls={`top-tabpanel-${index}`}
              aria-label={tab.label}
              sx={{
                minWidth: 60,
              }}
            />
          ))}
        </Tabs>
      </Box>

      {/* Scrollable content area */}
      <Box
        sx={{
          width: "100%",
          overflow: "auto",
          height: "100%",
          backgroundColor: "#f8f9fa",
          p: 1,
        }}
      >
        {mainContent}
      </Box>
    </Box>
  );
};

export default TicketPropertiesSidebar;
