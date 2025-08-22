import React, { useState } from "react";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import WorkIcon from "@mui/icons-material/Work";
import { IconButton, TextField } from "@mui/material";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import SaveIcon from "@mui/icons-material/Save";
import { Close } from "@mui/icons-material";
import { useAuth } from "../../../contextApi/AuthContext";
import { useCommanApiMutation } from "../../../services/threadsApi";

const AboutTab = ({
  name: initialName,
  email: initialEmail,
  phone: initialPhone,
  jobTitle: initialJobTitle,
  attribute,
  handleAttributeChange,
}: any) => {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(initialName);
  const [email, setEmail] = useState(initialEmail);
  const [phone, setPhone] = useState(initialPhone);
  const [commanApi] = useCommanApiMutation();
  const [jobTitle, setJobTitle] = useState(initialJobTitle);
  //@ts-ignore
  const userId = useAuth().user?.id || Math.floor(Math.random() * 1000);

  const handleSave = () => {
    const payload = {
      url: `update-profile/about/${userId}`,
      body: {
        name,
        email,
        phone,
        jobTitle,
        attribute,
      },
    };
    commanApi(payload);

    setIsEditing(false);
  };

  const toggleEdit = () => {
    if (isEditing) {
      handleSave();
    } else {
      setIsEditing(true);
    }
  };

  return (
    <>
      <style>
        {`
          .custom-scrollbar::-webkit-scrollbar {
            width: 6px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: #f1f1f1;
            border-radius: 3px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: #c1c1c1;
            border-radius: 3px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: #a8a8a8;
          }
        `}
      </style>
      <div
        className="bg-white rounded border border-gray-200 p-3 mb-4 custom-scrollbar"
        style={{
          maxHeight: "300px",
          overflow: "auto",
          scrollbarWidth: "thin",
          scrollbarColor: "#c1c1c1 #f1f1f1",
        }}
      >
        <div className="flex items-center justify-between mb-2">
          <div className="font-semibold text-sm text-gray-700 ">About</div>
          <div className="space-x-2">
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
        </div>

        {/* Email */}
        <div className="flex items-center gap-2 mb-1">
          <EmailIcon className="text-gray-900" fontSize="small" />
          <span className="text-xs text-gray-800">Email</span>
        </div>
        {isEditing ? (
          <TextField
            size="small"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={{ mb: 2 }}
          />
        ) : (
          <div className="text-xs text-blue-700 mb-2">
            <a href={`mailto:${email}`} className="hover:underline">
              {email}
            </a>
          </div>
        )}

        {/* Phone */}
        <div className="flex items-center gap-2 mb-1">
          <PhoneIcon className="text-gray-900" fontSize="small" />
          <span className="text-xs text-gray-800">Phone</span>
        </div>
        {isEditing ? (
          <TextField
            size="small"
            fullWidth
            value={phone}
            onChange={(e) => {
              const value = e.target.value;
              if (/^\d*$/.test(value)) {
             
                setPhone(value);
              }
            }}
            sx={{ mb: 2 }}
          />
        ) : (
          <div className="text-xs text-gray-500 mb-2">
            {phone || <span className="italic">Phone</span>}
          </div>
        )}

        {/* Job Title */}
        <div className="flex items-center gap-2 mb-1">
          <WorkIcon className="text-gray-900" fontSize="small" />
          <span className="text-xs text-gray-800">Job title</span>
        </div>
        {isEditing ? (
          <TextField
            size="small"
            fullWidth
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
            sx={{ mb: 2 }}
          />
        ) : (
          <div className="text-xs text-gray-500 mb-2">
            {jobTitle || <span className="italic">Job title</span>}
          </div>
        )}

        {/* Attribute dropdown */}
        <Select
          value={attribute}
          onChange={handleAttributeChange}
          displayEmpty
          size="small"
          className="w-full mt-2 text-xs"
          sx={{ fontSize: 13 }}
          disabled={!isEditing}
        >
          <MenuItem value="">
            <span className="text-xs text-gray-500">Add Attribute</span>
          </MenuItem>
          <MenuItem value={"Department"}>Department</MenuItem>
          <MenuItem value={"Location"}>Location</MenuItem>
        </Select>
      </div>
    </>
  );
};

export default AboutTab;
