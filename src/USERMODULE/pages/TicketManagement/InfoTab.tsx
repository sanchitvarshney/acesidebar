import React from "react";
import DateRangeIcon from "@mui/icons-material/DateRange";
import PreviewIcon from "@mui/icons-material/Preview";
import { Divider } from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import AllInboxIcon from "@mui/icons-material/AllInbox";
import DnsIcon from "@mui/icons-material/Dns";
import ComputerIcon from "@mui/icons-material/Computer";
import LanguageIcon from "@mui/icons-material/Language";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PageviewIcon from "@mui/icons-material/Pageview";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";

interface InfoTabProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
}

const InfoContent: React.FC<InfoTabProps> = ({ icon, label, value }) => (
  <div className=" flex items-center  w-full p-2   mb-1">
    <div className="w-[100px] flex items-center gap-2">
      {icon}
      <span className="text-xs text-gray-600">{label}</span>
    </div>
    <span className="text-xs text-gray-500 ">{value}</span>
  </div>
);

const InfoTab = () => (
  <div className="bg-white rounded border border-gray-200 p-3 mb-4">
    <span className="text-sm font-semibold text-gray-500">Additional Info</span>
    <InfoContent
      icon={<DateRangeIcon fontSize="small" />}
      label="Created"
      value="date or time"
    />
    <InfoContent
      icon={<DateRangeIcon fontSize="small" />}
      label="Updated"
      value="date or time"
    />
    <InfoContent
      icon={<PreviewIcon fontSize="small" />}
      label="First Seen"
      value="date or time"
    />
    <InfoContent
      icon={<PreviewIcon fontSize="small" />}
      label="Last Seen"
      value="date or time"
    />
    <Divider sx={{ my: 1 }} />

    <span className="text-sm font-semibold text-gray-500">Location</span>
    <InfoContent
      icon={<LocationOnIcon fontSize="small" />}
      label="Country"
      value="contry name"
    />
    <InfoContent
      icon={<LocationOnIcon fontSize="small" />}
      label="City"
      value="city name"
    />
    <InfoContent
      icon={<LocationOnIcon fontSize="small" />}
      label="Region"
      value="regin name"
    />
    <Divider sx={{ my: 1 }} />

    <span className="text-sm font-semibold text-gray-500">Device</span>
    <InfoContent
      icon={<AllInboxIcon fontSize="small" />}
      label="Host Name"
      value="host name"
    />
    <InfoContent
      icon={<DnsIcon fontSize="small" />}
      label="IP Address"
      value="ip address"
    />
    <InfoContent
      icon={<ComputerIcon fontSize="small" />}
      label="Os"
      value="os name"
    />
    <InfoContent
      icon={<LanguageIcon fontSize="small" />}
      label="Browser"
      value="browser name"
    />
    <Divider sx={{ my: 1 }} />
  

    <span className="text-sm font-semibold text-gray-500">Ticket</span>
    <InfoContent
      icon={<ConfirmationNumberIcon fontSize="small" />}
      label="First Ticket"
      value="date or time"
    />
    <InfoContent
      icon={<ConfirmationNumberIcon fontSize="small" />}
      label="Latest Ticket"
      value="date or time"
    />
    <InfoContent
      icon={<ConfirmationNumberIcon fontSize="small" />}
      label="Total Tickets"
      value={1}
    />
  </div>
);

export default InfoTab;
