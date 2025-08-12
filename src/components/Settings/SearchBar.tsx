import React from "react";
import { SearchIcon } from "lucide-react";

const SettingsSearchBar: React.FC = () => {
  return (
       <div className="flex items-center ">
          <div className={` transition-all duration-200  w-[350px] relative`}>
            <div className="flex items-center w-full bg-white border border-gray-300 rounded-full px-4 py-3  shadow-sm transition-shadow focus-within:shadow-[0_1px_6px_rgba(32,33,36,0.28)] hover:shadow-[0_1px_6px_rgba(32,33,36,0.28)] ">
              <SearchIcon className="text-gray-500 mr-3" size={18} />
              <input
                onChange={(e) => {
                 ;
                }}
                type="text"
                placeholder="Search…"
                className="flex-1 bg-transparent outline-none text-gray-800 text-[15px] leading-tight placeholder-gray-500"
              />
            </div>
          </div>
        </div>
  );
};

export default SettingsSearchBar;
