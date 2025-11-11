import { Refresh, Sort } from "@mui/icons-material";
import { Divider, IconButton } from "@mui/material";
import { Search } from "lucide-react";

const UserHomeScreen = () => {
  return (
    <div className="w-full h-full min-h-[calc(100vh-74px)] grid grid-cols-[2fr_3fr]">
      <div className="bg-white  ">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center">
            <div className={` transition-all duration-200  w-[340px] relative`}>
              <div className="flex items-center w-full bg-white border border-gray-300 rounded-full px-4 py-2 shadow-sm transition-shadow focus-within:shadow-[0_1px_6px_rgba(32,33,36,0.28)] hover:shadow-[0_1px_6px_rgba(32,33,36,0.28)] ">
                <Search className="text-gray-500 mr-3" />
                <input
                  type="text"
                  placeholder="Search…"
                  className="flex-1 bg-transparent outline-none text-gray-800 text-[15px] leading-tight placeholder-gray-500"
                />
              </div>
            </div>
          </div>
          <div>
            <IconButton>
              <Sort />
            </IconButton>
            <IconButton>
              <Refresh />
            </IconButton>
          </div>
        </div>
        <Divider />
      </div>
      <div className="bg-gray-200"></div>
    </div>
  );
};

export default UserHomeScreen;
