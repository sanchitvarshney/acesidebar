import React from "react";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import WorkIcon from "@mui/icons-material/Work";
import { IconButton } from "@mui/material";
import ModeEditIcon from "@mui/icons-material/ModeEdit";

const AboutTab = ({
  name,
  email,
  phone,
  jobTitle,
  attribute,
  handleAttributeChange,
}: any) => (
  <div className="bg-white rounded border border-gray-200 p-3 mb-4">
    <div className="flex items-center justify-between mb-2">
      <div className="font-semibold text-sm text-gray-700 ">About</div>
      <IconButton size="small">
        <ModeEditIcon sx={{ fontSize: 20 }} />
      </IconButton>
    </div>
    <div className="flex items-center gap-2 mb-1">
      <EmailIcon className="text-gray-900" fontSize="small" />
      <span className="text-xs text-gray-800">Email</span>
    </div>
    <div className="text-xs text-blue-700 mb-2">
      <a href={`mailto:${email}`} className="hover:underline">
        {email}
      </a>
    </div>
    <div className="flex items-center gap-2 mb-1">
      <PhoneIcon className="text-gray-900" fontSize="small" />
      <span className="text-xs text-gray-800">Phone</span>
    </div>
    <div className="text-xs text-gray-500 mb-2">
      {phone || <span className="italic">Phone</span>}
    </div>
    <div className="flex items-center gap-2 mb-1">
      <WorkIcon className="text-gray-900" fontSize="small" />
      <span className="text-xs text-gray-800">Job title</span>
    </div>
    <div className="text-xs text-gray-500 mb-2">
      {jobTitle || <span className="italic">Job title</span>}
    </div>
    {/* Add Attribute dropdown */}
    <Select
      value={attribute}
      onChange={handleAttributeChange}
      displayEmpty
      size="small"
      className="w-full mt-2 text-xs"
      sx={{ fontSize: 13 }}
    >
      <MenuItem value="">
        <span className="text-xs text-gray-500">Add Attribute</span>
      </MenuItem>
      <MenuItem value={"Department"}>Department</MenuItem>
      <MenuItem value={"Location"}>Location</MenuItem>
    </Select>
  </div>
);

export default AboutTab;
