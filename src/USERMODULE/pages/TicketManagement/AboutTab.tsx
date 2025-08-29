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
import FifteenMpIcon from "@mui/icons-material/FifteenMp";
import EditNoteIcon from "@mui/icons-material/EditNote";

const AboutTab = ({
  name: initialName,
  email: initialEmail,
  phone: initialPhone,
  extention: initialExtention,

  internalNote: initialInternalNote,
}: any) => {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(initialName);
  const [email, setEmail] = useState(initialEmail);
  const [phone, setPhone] = useState(initialPhone);
  const [commanApi] = useCommanApiMutation();
  const [extention, setExtention] = useState(initialExtention);
  const [internalNote, setInternalNote] = useState(initialInternalNote);
  //@ts-ignore
  const userId = useAuth().user?.id || Math.floor(Math.random() * 1000);

  const handleSave = () => {
    const payload = {
      url: `update-profile/about/${userId}`,
      body: {
        name,
        email,
        phone,
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
          <FifteenMpIcon className="text-gray-900" fontSize="small" />
          <span className="text-xs text-gray-800">Extension</span>
        </div>
        {isEditing ? (
          <TextField
            size="small"
            fullWidth
            value={extention}
            onChange={(e) => setExtention(e.target.value)}
            sx={{ mb: 2 }}
          />
        ) : (
          <div className="text-xs text-gray-500 mb-2">
            {extention || <span className="italic">Extension</span>}
          </div>
        )}

        {/* Job Title */}
        <div className="flex items-center gap-2 mb-1">
          <EditNoteIcon className="text-gray-900" fontSize="small" />
          <span className="text-xs text-gray-800">Internal Note</span>
        </div>
        {isEditing ? (
          <TextField
            size="small"
            fullWidth
            value={internalNote}
            onChange={(e) => setInternalNote(e.target.value)}
            sx={{ mb: 2 }}
          />
        ) : (
          <div className="text-xs text-gray-500 mb-2">
            {internalNote || <span className="italic">Internal Note</span>}
          </div>
        )}
      </div>
    </>
  );
};

export default AboutTab;
