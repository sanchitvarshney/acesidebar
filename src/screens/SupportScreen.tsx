import React, { useEffect } from "react";
import SupportHeader from "../components/supportcomponents/SupportHeader";
import { Typography } from "@mui/material";
import CustomSearch from "../components/common/CustomSearch";
import CustomToolTip from "../reusable/CustomToolTip";
import SearchItems from "../components/supportcomponents/SearchItems";
import TicketDetailCard from "../components/supportcomponents/TicketDetailCard";
import LayersIcon from "@mui/icons-material/Layers";

import browseIcon from "../assets/image/idea.png";
import ticketsIcon from "../assets/image/ready.png";
import submitIcon from "../assets/image/analysis.png";
import SupportCard from "../components/supportcomponents/SupportCard";

const ticketDetailsData = [
  {
    id: 1,
    icon: browseIcon,
    title: "Browse articles",
    description:
      "Explore How-To's and learn best practices from our knowledge base",
  },
  {
    id: 2,
    icon: ticketsIcon,
    title: "View all tickets",
    description:
      "Track all your ticket's progress and your interaction with the support team",
  },
  {
    id: 3,
    icon: submitIcon,
    title: "Submit a ticket",
    description: "Describe your issue by filling out the support ticket form",
  },
];
const ticketFaqData = [
  {
    id: 1,
    icon: <LayersIcon color="primary" sx={{ fontSize: 60 }} />,
    title: "How tos",
    description: "How tos category",
  },
  {
    id: 2,
    icon: <LayersIcon color="primary" sx={{ fontSize: 60 }} />,
    title: "FAQs",
    description: "FAQs category",
  },
  {
    id: 3,
    icon: <LayersIcon color="primary" sx={{ fontSize: 60 }} />,
    title: "Troubleshooting",
    description: "Troubleshooting category",
  },
];
const SupportScreen = () => {
  const [isSearchOpen, setIsSearchOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const handleClose = (event: any) => {
    setIsSearchOpen(false);
  };
  useEffect(() => {
    if (searchQuery.length > 0) {
      setIsSearchOpen(true);
    }
  }, [searchQuery]);

  return (
    <div className="w-full h-full">
 
      <Typography variant="h5" sx={{ textAlign: "center", py: 4 }}>
        Hello, how can we help you?
      </Typography>
      <div className="w-1/2 flex bg-transparent mx-auto items-center justify-center  ">
        {/* <CustomSearch /> */}
        <CustomToolTip
          title={<SearchItems close={handleClose} searchQuery={searchQuery} />}
          open={isSearchOpen}
          width={"80vh"}
          disableHoverListener
          placement={"bottom"}
        >
          <CustomSearch
            width={"80ch"}
            placeholder={"Seach for articals"}
            onChange={(e) => {
              setSearchQuery(e.target.value);
            }}
            bgColor="#fff"
            bgOpacity={0}
            borderRadius={10}
          />
        </CustomToolTip>
      </div>

      <div className="w-2/3 mx-auto grid grid-cols-3 gap-4  my-8">
        {ticketDetailsData.map((item: any) => (
          <TicketDetailCard
            key={item.id}
            icon={item.icon}
            title={item.title}
            desc={item.description}
          />
        ))}
      </div>
      <div className="flex flex-col items-center justify-center w-full my-4">
        <Typography variant="h5" gutterBottom>
          Knowledge Base
        </Typography>
        <span className="text-blue-600 cursor-pointer">View all articles</span>
      </div>

      <div className="w-2/3 mx-auto grid grid-cols-3 gap-4  my-8">
        {ticketFaqData.map((item: any) => (
          <SupportCard
            key={item.id}
            icon={item.icon}
            title={item.title}
            desc={item.description}
          />
        ))}
      </div>
    </div>
  );
};

export default SupportScreen;
