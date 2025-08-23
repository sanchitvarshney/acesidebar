import React from "react";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import PersonIcon from "@mui/icons-material/Person";
import ShareIcon from "@mui/icons-material/Share";
import InfoIcon from "@mui/icons-material/Info";
import DescriptionIcon from "@mui/icons-material/Description";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import ContentCutIcon from "@mui/icons-material/ContentCut";
import HistoryIcon from "@mui/icons-material/History";
import OpenInFullIcon from "@mui/icons-material/OpenInFull";
import AboutTab from "./AboutTab";
import SharingTab from "./SharingTab";
import InfoTab from "./InfoTab";
import NotesTab from "./NotesTab";
import { useGetTagListQuery } from "../../../services/ticketAuth";
import { Chip, MenuItem } from "@mui/material";
import ShortcutsTab from "../../components/ShortcitsTab";
import CloseIcon from "@mui/icons-material/Close";
import { Height } from "@mui/icons-material";
import emptyimg from "../../../assets/image/overview-empty-state.svg";
import { useCommanApiMutation } from "../../../services/threadsApi";

// Placeholder components for new top-level tabs
const KnowledgeBaseTab = () => (
  <div className="p-4 flex flex-col justify-center items-center w-full h-full">
    <img src={emptyimg} alt="No Knowledge" className="mb-4" />
    <div className="font-semibold text-base mb-2">Knowledge Base</div>
    <div className="text-xs text-gray-500">No articles found</div>
  </div>
);

const HistoryTab = () => (
  <div className="p-4 flex flex-col justify-center items-center w-full h-full">
    <img src={emptyimg} alt="No History" className="mb-4" />
    <div className="font-semibold text-base mb-2">History</div>
    <div className="text-xs text-gray-500">No history found</div>
  </div>
);

const topTabs = [
  { key: "profile", icon: <PersonIcon />, label: "Profile" },
  { key: "knowledge", icon: <MenuBookIcon />, label: "Knowledge Base" },
  { key: "shortcuts", icon: <ContentCutIcon />, label: "Shortcuts" },
  { key: "history", icon: <HistoryIcon />, label: "History" },
];

const profileTabs = [
  { key: "about", icon: <PersonIcon />, label: "About" },
  { key: "share", icon: <ShareIcon />, label: "Sharing" },
  { key: "info", icon: <InfoIcon />, label: "Info" },
  { key: "notes", icon: <DescriptionIcon />, label: "Notes" },
];

const TicketPropertiesSidebar = ({ ticket, onExpand, onClose }: any) => {
  // Example data, replace with real ticket/user data as needed
  const name = ticket?.name || "shiv kumar";
  const email = ticket?.email || "postmanreply@gmail.com";
  const phone = ticket?.phone || "";
  const jobTitle = ticket?.jobTitle || "";

  const [attribute, setAttribute] = React.useState("");
  const [activeTopTab, setActiveTopTab] = React.useState(0);
  const [activeProfileTab, setActiveProfileTab] = React.useState(0);
  const { data: tagList, isLoading: isTagListLoading } = useGetTagListQuery();
 const [commanApi] = useCommanApiMutation();

const   handleDeleteTag = (tagId: number) => {
    const  payload = {
      url: `delete-tag/${tagId}`,
    }
    commanApi(payload)
  };

  const handleAttributeChange = (event: any) => {
    setAttribute(event.target.value);
  };

  const handleTopTabChange = (
    event: React.SyntheticEvent,
    newValue: number
  ) => {
    setActiveTopTab(newValue);
  };

  const handleProfileTabChange = (
    event: React.SyntheticEvent,
    newValue: number
  ) => {
    setActiveProfileTab(newValue);
  };

  // Top-level tab content
  let mainContent = null;
  if (activeTopTab === 0) {
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
            {name?.[0]?.toUpperCase() || "?"}
          </Avatar>
          <div>
            <div className="font-semibold text-base text-gray-800">{name}</div>
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
              />
            ))}
          </Tabs>
        </Box>

        <div className="w-full h-[calc(100vh-365px)] overflow-y-scroll">
          {/* Profile tab content */}
          {activeProfileTab === 0 && (
            <AboutTab
              name={name}
              email={email}
              phone={phone}
              jobTitle={jobTitle}
              attribute={attribute}
              handleAttributeChange={handleAttributeChange}
            />
          )}
          {activeProfileTab === 1 && <SharingTab />}
          {activeProfileTab === 2 && <InfoTab />}
          {activeProfileTab === 3 && <NotesTab />}

          {/* Organization section */}
          <div className="bg-white rounded border border-gray-200 p-2 flex flex-col">
            <div className="flex items-center gap-2 mb-2">
              <LocalOfferIcon className="text-gray-500" />
              <span className="text-sm text-gray-700 font-medium">Tags</span>
            </div>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
              {isTagListLoading ? (
                <div>Loading...</div>
              ) : (
                <>
                  {tagList?.map((item: any, tagID: any) => {
                    return (
                      <Chip
                        key={tagID}
                        label={item.tagName}
                      onDelete={() => handleDeleteTag(item.tagID)}
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
                </>
              )}
            </Box>
          </div>
        </div>
      </div>
    );
  } else if (activeTopTab === 1) {
    // knowledge
    mainContent = <KnowledgeBaseTab />;
  } else if (activeTopTab === 2) {
    // shortcuts
    mainContent = <ShortcutsTab />;
  } else if (activeTopTab === 3) {
    // history
    mainContent = <HistoryTab />;
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
          p: 2,
        }}
      >
        {mainContent}
      </Box>
    </Box>
  );
};

export default TicketPropertiesSidebar;
