import React, { useEffect, useState } from "react";

import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";

import { CircularProgress, IconButton, TextField } from "@mui/material";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import SaveIcon from "@mui/icons-material/Save";
import { Close } from "@mui/icons-material";

import FifteenMpIcon from "@mui/icons-material/FifteenMp";
import EditNoteIcon from "@mui/icons-material/EditNote";
import { useUpdateUserDataMutation } from "../../../services/threadsApi";
import { useToast } from "../../../hooks/useToast";

const getCharacters = (text: string) => {
  const val = 200 - text.length;
  if (val < 0) {
    return 0;
  } else {
    return val;
  }
};

const AboutTab = ({ ticketData }: any) => {
  const { showToast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [extention, setExtention] = useState("");
  const [internalNote, setInternalNote] = useState("");

  const [updateUserData, { isLoading, data }] = useUpdateUserDataMutation();

  useEffect(() => {
    const source =
      data?.type === "success" && data?.aboutData ? data.aboutData : ticketData;

    if (!source) return;

    setEmail(source.email ?? "");
    setPhone(source.phone ?? "");
    setExtention(source.extensionNo ?? source.ext ?? "");
    setInternalNote(source.internalNotes ?? source.internal_notes ?? "");
  }, [ticketData, data]);

  const handleSave = () => {
    const payload = {
      USERID: ticketData.userID,
      type: "about",
      body: {
        email,
        phone,
        ext: extention,
        internal_notes: internalNote,
      },
    };
    updateUserData(payload).then((res: any) => {
     
      if ( res?.error?.data?.type === "error") {
        showToast(res?.error?.data?.message  || "An error occurred", "error");
        return;
      }
    });

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
      <div className=" h-[calc(100vh-350px)] rounded border border-gray-200 p-3 custom-scrollbar bg-gray-100">
        <div className="flex items-center justify-between mb-2">
          <div className="font-semibold text-sm text-gray-700 ">About</div>
          <div className="space-x-2">
            {isLoading ? (
              <CircularProgress size={16} />
            ) : (
              <>
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
              </>
            )}
          </div>
        </div>

        {/* Email */}
       <div className="space-y-3">
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
          <div>
            <TextField
              size="small"
              multiline
              rows={2}
              fullWidth
              value={internalNote}
              onChange={(e) => {
                let value = e.target.value;

                // Filter out disallowed characters (dash removed)
                value = value.replace(
                  /[^a-zA-Z0-9\s,\.@#&'\[\]\{\}!|\/\\\*\%\(\);]/g,
                  ""
                );

                // Limit to 200 words
                const words = value.trim().split(/\s+/);
                if (words.length > 200) {
                  value = words.slice(0, 200).join(" "); // Keep only first 200 words
                }

                setInternalNote(value);
              }}
              sx={{ mb: 1 }}
            />
            <p className="text-xs text-gray-500  text-right ">{`${
              internalNote.length === 0 ? 500 : getCharacters(internalNote)
            } remaining characters`}</p>
          </div>
        ) : (
          <div className="text-xs text-gray-500 mb-2">
            {internalNote || <span className="italic">Internal Note</span>}
          </div>
        )}
       </div>
      </div>
    </>
  );
};

export default AboutTab;
