import React from "react";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import PersonIcon from "@mui/icons-material/Person";
import ShareIcon from "@mui/icons-material/Share";
import InfoIcon from "@mui/icons-material/Info";
import DescriptionIcon from "@mui/icons-material/Description";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import ContentCutIcon from "@mui/icons-material/ContentCut";
import HistoryIcon from "@mui/icons-material/History";
import OpenInFullIcon from "@mui/icons-material/OpenInFull";
// import CloseIcon from "@mui/icons-material/Close";
import AboutTab from "./AboutTab";
import SharingTab from "./SharingTab";
import InfoTab from "./InfoTab";
import NotesTab from "./NotesTab";
import { useGetTagListQuery } from "../../services/ticketAuth";
import { Chip, MenuItem } from "@mui/material";
import ShortcutsTab from "../ShortcitsTab";
import CloseIcon from "@mui/icons-material/Close";

// Placeholder components for new top-level tabs
const KnowledgeBaseTab = () => (
  <div className="p-4">
    <div className="font-semibold text-base mb-2">Knowledge Base</div>
    <div className="text-xs text-gray-500">No articles found</div>
  </div>
);

const HistoryTab = () => (
  <div className="p-4">
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
  const [activeTopTab, setActiveTopTab] = React.useState("profile");
  const [activeProfileTab, setActiveProfileTab] = React.useState("about");
  const { data: tagList, isLoading: isTagListLoading } = useGetTagListQuery();
  const handleAttributeChange = (event: any) => {
    setAttribute(event.target.value);
  };

  // Top-level tab content
  let mainContent = null;
  if (activeTopTab === "profile") {
    mainContent = (
      <>
       
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
        {/* Profile tab bar */}
        <div className="flex items-center justify-between bg-gray-50 rounded px-2 py-1 mb-4 border border-gray-200">
          {profileTabs.map((tab) => (
            <button
              key={tab.key}
              className={`flex-1 flex justify-center items-center py-1 rounded transition-colors ${
                activeProfileTab === tab.key ? "bg-white" : ""
              }`}
              style={{
                borderBottom:
                  activeProfileTab === tab.key
                    ? "2px solid #0891b2"
                    : "2px solid transparent",
              }}
              onClick={() => setActiveProfileTab(tab.key)}
              aria-label={tab.label}
              type="button"
            >
              {React.cloneElement(tab.icon, {
                className:
                  activeProfileTab === tab.key
                    ? "text-[#0891b2]"
                    : "text-gray-400",
              })}
            </button>
          ))}
        </div>
        {/* Profile tab content */}
        {activeProfileTab === "about" && (
          <AboutTab
            name={name}
            email={email}
            phone={phone}
            jobTitle={jobTitle}
            attribute={attribute}
            handleAttributeChange={handleAttributeChange}
          />
        )}
        {activeProfileTab === "share" && <SharingTab />}
        {activeProfileTab === "info" && <InfoTab />}
        {activeProfileTab === "notes" && <NotesTab />}
        {/* Organization section */}
        <div className="bg-white rounded border border-gray-200 p-2 flex flex-col  ">
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
                      onDelete={() => {}}
                      deleteIcon={<CloseIcon />}
                      sx={{
                        "& .MuiChip-deleteIcon": {
                          fontSize: 18, // controls icon size
                        },
                      }}
                    />
                  );
                })}
              </>
            )}
          </Box>
        </div>
      </>
    );
  } else if (activeTopTab === "knowledge") {
    mainContent = <KnowledgeBaseTab />;
  } else if (activeTopTab === "shortcuts") {
    mainContent = <ShortcutsTab />;
  } else if (activeTopTab === "history") {
    mainContent = <HistoryTab />;
  }

  return (
    <Box
      className="p-2 bg-red-800"
      style={{ background: "#fff", borderRadius: 0, width: 350, minWidth: 350 }}
    >
      {/* Top-level tab bar */}
      <div className="flex items-center justify-between bg-white rounded px-2 py-1 mb-2 border border-gray-200">
        {topTabs.map((tab) => (
          <button
            key={tab.key}
            className={`flex-1 flex justify-center items-center py-1 rounded transition-colors ${
              activeTopTab === tab.key ? "bg-white" : ""
            }`}
            style={{
              borderBottom:
                activeTopTab === tab.key
                  ? "2px solid #0891b2"
                  : "2px solid transparent",
            }}
            onClick={() => setActiveTopTab(tab.key)}
            aria-label={tab.label}
            type="button"
          >
            {React.cloneElement(tab.icon, {
              className:
                activeTopTab === tab.key ? "text-[#0891b2]" : "text-gray-400",
            })}
          </button>
        ))}
        {/* Expand and Close buttons */}
        {/* <button
          className="flex justify-center items-center ml-2"
          style={{ minWidth: 32, minHeight: 32 }}
          onClick={onExpand}
          aria-label="Expand"
          type="button"
        >
          <OpenInFullIcon className="text-gray-400" />
        </button>
        <button
          className="flex justify-center items-center ml-1"
          style={{ minWidth: 32, minHeight: 32 }}
          onClick={onClose}
          aria-label="Close"
          type="button"
        >
          <CloseIcon className="text-gray-400" />
        </button> */}
      </div>
      {/* Main content below top tabs */}
     <div className="w-full h-[calc(100vh-230px)] overflow-y-auto will-change-transform">
        {mainContent}
      </div>
    </Box>
  );
};

export default TicketPropertiesSidebar;
