import React, { useState } from "react";
import emptyimg from "../../../assets/image/overview-empty-state.svg";
import ClickAwayListener from "@mui/material/ClickAwayListener";

interface SearchItemsProps {
  searchQuery?: string;
  close: any;
}

const SearchItems: React.FC<SearchItemsProps> = ({
  searchQuery = "",
  close,
}) => {
  const [activeFilter, setActiveFilter] = useState<
    "all" | "articles" | "tickets"
  >("tickets");

  const filterTabs = [
    { id: "all", label: "All" },
    { id: "articles", label: "Articles" },
    { id: "tickets", label: "Tickets" },
  ];

  return (
    <div className=" bg-white rounded-lg shadow-lg p-6 fle mx-auto">
      <ClickAwayListener onClickAway={close}>
        <>
          {/* Filter Tabs */}
          <div className="flex gap-2 mb-6">
            {filterTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() =>
                  setActiveFilter(tab.id as "all" | "articles" | "tickets")
                }
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeFilter === tab.id
                    ? "bg-[#2566b0] text-white"
                    : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Empty State */}
          <div className="flex flex-col items-center py-8">
            <img src={emptyimg} alt="No Results" className="mb-4" />
            <div className="text-gray-600 text-center">
              <p className="text-lg mb-2">Sorry! nothing found for</p>
              {searchQuery && (
                <p className="text-lg font-bold text-gray-800 max-w-[400px]">
                  "{searchQuery}"
                </p>
              )}
            </div>
          </div>
        </>
      </ClickAwayListener>
    </div>
  );
};

export default SearchItems;
