import React, { useEffect } from "react";
import SupportHeader from "../components/supportcomponents/SupportHeader";
import { Typography, Tooltip } from "@mui/material";
import CustomSearch from "../components/common/CustomSearch";
import SearchItems from "../components/supportcomponents/SearchItems";
import TicketDetailCard from "../components/supportcomponents/TicketDetailCard";
import LayersIcon from "@mui/icons-material/Layers";

import browseIcon from "../assets/image/idea.png";
import ticketsIcon from "../assets/image/ready.png";
import submitIcon from "../assets/image/analysis.png";
import SupportCard from "../components/supportcomponents/SupportCard";
import { SearchIcon } from "lucide-react";
import CustomToolTip from "../components/reusable/CustomToolTip";


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
    icon: submitIcon,
    title: "Submit a ticket",
    description: "Describe your issue by filling out the support ticket form",

  },
  {
    id: 3,
    icon: ticketsIcon,
    title: "View existing tickets",
    description:
      "Track all your ticket's progress and your interaction with the support team",
   
  }
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
    <div className="w-full h-full  will-change-transform">
      <Typography variant="h5" sx={{ textAlign: "center", py: 4 }}>
        Hello, how can we help you?
      </Typography>
      <div className="w-1/2 flex bg-transparent mx-auto items-center justify-center  ">
        <CustomToolTip
          title={<SearchItems close={handleClose} searchQuery={searchQuery} />}
          open={isSearchOpen}
          disableHoverListener
          placement={"bottom"}
          width={500}
        >
          <div>
            <div
              className={` transition-all duration-200 ml-30 w-[800px] relative`}
            >
              <div className="flex items-center w-full bg-white border border-gray-300 rounded-full px-4 py-2 h-[60px] shadow-sm transition-shadow focus-within:shadow-[0_1px_6px_rgba(32,33,36,0.28)] hover:shadow-[0_1px_6px_rgba(32,33,36,0.28)] ">
                <SearchIcon className="text-gray-500 mr-3" />
                <input
                  onChange={(e) => {
              setSearchQuery(e.target.value);
            }}
                  type="text"
                  placeholder="Search…"
                  className="flex-1 bg-transparent outline-none text-gray-800 text-[15px] leading-tight placeholder-gray-500"
                />
              </div>
            </div>
          </div>
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
