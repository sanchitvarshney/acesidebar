import React from "react";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import GroupIcon from "@mui/icons-material/Group";
import PersonIcon from "@mui/icons-material/Person";
import ShareIcon from "@mui/icons-material/Share";
import InfoIcon from "@mui/icons-material/Info";
import DescriptionIcon from "@mui/icons-material/Description";
import AboutTab from "./AboutTab";
import SharingTab from "./SharingTab";
import InfoTab from "./InfoTab";
import NotesTab from "./NotesTab";

const tabList = [
  { key: "about", icon: <PersonIcon />, label: "About" },
  { key: "share", icon: <ShareIcon />, label: "Sharing" },
  { key: "info", icon: <InfoIcon />, label: "Info" },
  { key: "notes", icon: <DescriptionIcon />, label: "Notes" },
];

const TicketPropertiesSidebar = ({ ticket }: any) => {
  // Example data, replace with real ticket/user data as needed
  const name = ticket?.name || "shiv kumar";
  const email = ticket?.email || "postmanreply@gmail.com";
  const phone = ticket?.phone || "";
  const jobTitle = ticket?.jobTitle || "";

  const [attribute, setAttribute] = React.useState("");
  const [activeTab, setActiveTab] = React.useState("about");
  const handleAttributeChange = (event: any) => {
    setAttribute(event.target.value);
  };

  return (
    <Box
      className="p-2"
      style={{ background: "#fff", borderRadius: 8, width: 350, minWidth: 350 }}
    >
      {/* Details label */}
      <div className="text-xs font-medium text-gray-600 mb-2">Details</div>
      {/* Avatar and name/email */}
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
      {/* Icon tab bar */}
      <div className="flex items-center justify-between bg-gray-50 rounded px-2 py-1 mb-4 border border-gray-200">
        {tabList.map((tab) => (
          <button
            key={tab.key}
            className={`flex-1 flex justify-center items-center py-1 rounded transition-colors ${
              activeTab === tab.key ? "bg-white" : ""
            }`}
            style={{
              borderBottom:
                activeTab === tab.key
                  ? "2px solid #22c55e"
                  : "2px solid transparent",
            }}
            onClick={() => setActiveTab(tab.key)}
            aria-label={tab.label}
            type="button"
          >
            {React.cloneElement(tab.icon, {
              className:
                activeTab === tab.key ? "text-green-600" : "text-gray-400",
            })}
          </button>
        ))}
      </div>
      {/* Tab content */}
      {activeTab === "about" && (
        <AboutTab
          name={name}
          email={email}
          phone={phone}
          jobTitle={jobTitle}
          attribute={attribute}
          handleAttributeChange={handleAttributeChange}
        />
      )}
      {activeTab === "share" && <SharingTab />}
      {activeTab === "info" && <InfoTab />}
      {activeTab === "notes" && <NotesTab />}
      {/* Organization section */}
      <div className="bg-white rounded border border-gray-200 p-3 flex flex-col items-center">
        <div className="flex items-center gap-2 mb-2">
          <GroupIcon className="text-gray-500" />
          <span className="text-sm text-gray-700 font-medium">
            Organization
          </span>
        </div>
        <Button
          variant="contained"
          color="success"
          className="w-full"
          sx={{
            textTransform: "none",
            fontWeight: 500,
            fontSize: 14,
            borderRadius: 2,
          }}
        >
          + New Organization
        </Button>
      </div>
    </Box>
  );
};

export default TicketPropertiesSidebar;
