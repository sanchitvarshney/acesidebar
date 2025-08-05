import React, { useEffect } from "react";
import SupportHeader from "../components/supportcomponents/SupportHeader";
import { Typography } from "@mui/material";
import CustomSearch from "../components/common/CustomSearch";
import CustomToolTip from "../reusable/CustomToolTip";
import SearchItems from "../components/supportcomponents/SearchItems";

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
  }, [searchQuery])
  
  return (
    <div className="w-full h-full">
      <SupportHeader />
      <Typography variant="h5" sx={{ textAlign: "center", py: 4 }}>
        Hello, how can we help you?
      </Typography>
      <div className="w-1/2 flex bg-transparent mx-auto items-center justify-center  ">
        {/* <CustomSearch /> */}
        <CustomToolTip title={<SearchItems close={handleClose} searchQuery={searchQuery }/>} open={isSearchOpen} width={"80vh"} disableHoverListener placement={"bottom"} >
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
    </div>
  );
};

export default SupportScreen;
