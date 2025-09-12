import React, { useState, useEffect, useRef } from "react";
import { SearchIcon, X } from "lucide-react";

type SettingsSearchBarProps = {
  onSearchResultSelect?: (sectionId: string) => void;

  searchQuery?: string;
  onSearchQueryChange?: (query: string) => void;
  showResults?: boolean;
  onShowResultsChange?: (show: boolean) => void;
};

const SettingsSearchBar: React.FC<SettingsSearchBarProps> = ({
  searchQuery: externalSearchQuery,
  onSearchQueryChange,
  onShowResultsChange,
}) => {
  const [internalSearchQuery, setInternalSearchQuery] = useState("");

  // Use external state if provided, otherwise use internal state
  const searchQuery =
    externalSearchQuery !== undefined
      ? externalSearchQuery
      : internalSearchQuery;
  const setSearchQuery = onSearchQueryChange || setInternalSearchQuery;

  const blurTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (inputRef.current) {
      //@ts-ignore
      setTimeout(() => inputRef.current.focus(), 100);
    }
  }, []);

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
  };

  // Handle clear search
  const handleClearSearch = () => {
    setSearchQuery("");
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      handleClearSearch();
    }
  };

  // Handle blur

  useEffect(() => {
    return () => {
      if (blurTimeoutRef.current) {
        clearTimeout(blurTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="flex items-center relative">
      <div className={`transition-all duration-200 w-[600px] relative`}>
        <div className="flex items-center w-full bg-white border border-gray-300 rounded-full px-4 py-3 shadow-sm transition-shadow focus-within:shadow-[0_1px_6px_rgba(32,33,36,0.28)] hover:shadow-[0_1px_6px_rgba(32,33,36,0.28)]">
          <SearchIcon className="text-gray-500 mr-3" size={18} />
          <input
            ref={inputRef}
            value={searchQuery}
            onChange={handleSearchChange}
            onKeyDown={handleKeyDown}
            type="text"
            placeholder="Search settings..."
            className="flex-1 bg-transparent outline-none text-gray-800 text-[15px] leading-tight placeholder-gray-500"
          />
          {searchQuery && (
            <button
              onClick={handleClearSearch}
              className="ml-2 p-1 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X size={16} className="text-gray-500" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsSearchBar;
