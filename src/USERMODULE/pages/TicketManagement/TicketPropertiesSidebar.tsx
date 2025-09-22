import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import DescriptionIcon from "@mui/icons-material/Description";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import ContentCutIcon from "@mui/icons-material/ContentCut";
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
  { key: "notes", icon: <DescriptionIcon fontSize="small" />, label: "Notes" },
  {
    key: "shortcuts",
    icon: <ContentCutIcon fontSize="small" />,
    label: "Shortcuts",
  },
];


const TicketPropertiesSidebar = ({ ticket }: any) => {
  const { showToast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const { data: tagList } = useGetTagListQuery();
  const [activeTopTab, setActiveTopTab] = useState<any>(0);
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
    setActiveTopTab(newValue);
  };


  const handleSave = () => {
    const credentials = {
      ticket: ticket?.ticketId,
      tags: editTags.map((tag: any) => tag.tagId || tag.key),
    };
    const payload = {
      url: `add-tag`,
      body: {
        ticket: credentials.ticket,
        tags: credentials.tags,
      },
    };
    triggerUpdateUserData(payload).then((res: any) => {
      const success = res?.data?.success === true;
      const errorSuccess = res?.error?.data?.success === true;

      if (!success && !errorSuccess) {
        const message =
          res?.data?.message ||
          res?.error?.data?.message ||
          "An error occurred";

        showToast(message, "error");
        return;
      }
      // setTags((prevTags: any)=> [...prevTags, ...credentials.tags])
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
    // notes
    mainContent = <NotesTab ticketData={ticket} />;
  } else if (activeTopTab === 2) {
    // shortcuts
    mainContent = <ShortcutsTab />;
  } else if (activeTopTab === 0) {
    // status
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
        // Mobile responsive adjustments
        minHeight: { xs: "100vh", sm: "auto" },
        maxHeight: { xs: "100vh", sm: "100%" },
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
          // Mobile adjustments
          position: { xs: "sticky", sm: "static" },
          top: { xs: 0, sm: "auto" },
          zIndex: { xs: 1000, sm: "auto" },
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
              justifyContent: { xs: "center", sm: "space-between" },
              alignItems: "center",
              mx: { xs: 0.5, sm: 1 },
              gap: { xs: 1, sm: 0 },
            },
            "& .MuiTab-root": {
              color: "#6b7280",
              minWidth: { xs: "auto", sm: 60 },
              padding: { xs: "8px 12px", sm: "12px 16px" },
              fontSize: { xs: "0.75rem", sm: "0.875rem" },
              "&.Mui-selected": {
                color: "#1a73e8",
              },
            },
            "& .MuiTabs-indicator": {
              backgroundColor: "#1a73e8",
            },
            // Mobile scroll improvements
            "& .MuiTabs-scrollButtons": {
              display: { xs: "flex", sm: "flex" },
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
                minWidth: { xs: "auto", sm: 60 },
                flex: { xs: 1, sm: "none" },
                maxWidth: { xs: "120px", sm: "none" },
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
          p: { xs: 0.5, sm: 1 },
          // Mobile improvements
          flex: 1,
          minHeight: 0, // Important for flexbox scrolling
          "&::-webkit-scrollbar": {
            width: { xs: "4px", sm: "6px" },
          },
          "&::-webkit-scrollbar-track": {
            backgroundColor: "transparent",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: { xs: "#c1c1c1", sm: "#d1d5db" },
            borderRadius: "3px",
          },
          "&::-webkit-scrollbar-thumb:hover": {
            backgroundColor: { xs: "#a1a1a1", sm: "#9ca3af" },
          },
        }}
      >
        {mainContent}
      </Box>
    </Box>
  );
};

export default TicketPropertiesSidebar;
