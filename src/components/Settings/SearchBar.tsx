import React, { useState, useEffect, useRef } from "react";
import { SearchIcon, X } from "lucide-react";
import { IconType } from "react-icons";

// Define the searchable item type
type SearchableItem = {
  id: string;
  title: string;
  description: string;
  icon: IconType;
  iconClass: string;
};

type SettingsSearchBarProps = {
  onSearchResultSelect?: (sectionId: string) => void;
  menuSections?: SearchableItem[];
};

const SettingsSearchBar: React.FC<SettingsSearchBarProps> = ({ 
  onSearchResultSelect, 
  menuSections = [] 
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchableItem[]>([]);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const blurTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isClickingResultRef = useRef(false);

  // Search functionality
  const performSearch = (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    const lowerQuery = query.toLowerCase();
    const results = menuSections.filter(item => 
      item.title.toLowerCase().includes(lowerQuery) ||
      item.description.toLowerCase().includes(lowerQuery)
    );
 

    setSearchResults(results);
  };

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    performSearch(query);
    setShowResults(true);
  };

  // Handle search result selection
  const handleResultClick = (item: SearchableItem) => {
   
    
    
    isClickingResultRef.current = true;
    
  
    if (blurTimeoutRef.current) {
      clearTimeout(blurTimeoutRef.current);
      blurTimeoutRef.current = null;
    }

  
    if (onSearchResultSelect) {
    
      onSearchResultSelect(item.id);
    } 

    
    setSearchQuery("");
    setSearchResults([]);
    setShowResults(false);
    setIsSearchFocused(false);
    
    // Reset the flag after a short delay
    setTimeout(() => {
      isClickingResultRef.current = false;
    }, 100);
  };

  // Handle clear search
  const handleClearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
    setShowResults(false);
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      handleClearSearch();
    }
  };

  // Handle focus
  const handleFocus = () => {
    setIsSearchFocused(true);
    if (searchQuery) setShowResults(true);
  };

  // Handle blur
  const handleBlur = () => {
  
    setIsSearchFocused(false);
    

    if (!isClickingResultRef.current) {
      blurTimeoutRef.current = setTimeout(() => {
        
        setShowResults(false);
      }, 200);
    }
  };


  useEffect(() => {
    return () => {
      if (blurTimeoutRef.current) {
        clearTimeout(blurTimeoutRef.current);
      }
    };
  }, []);

 

  // Highlight search terms in text
  const highlightText = (text: string, query: string) => {
    if (!query.trim()) return text;
    
    const regex = new RegExp(`(${query})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <span key={index} className="bg-yellow-200 font-semibold">
          {part}
        </span>
      ) : part
    );
  };

  return (
    <div className="flex items-center relative">
      <div className={`transition-all duration-200 w-[350px] relative`}>
        <div className="flex items-center w-full bg-white border border-gray-300 rounded-full px-4 py-3 shadow-sm transition-shadow focus-within:shadow-[0_1px_6px_rgba(32,33,36,0.28)] hover:shadow-[0_1px_6px_rgba(32,33,36,0.28)]">
          <SearchIcon className="text-gray-500 mr-3" size={18} />
          <input
            value={searchQuery}
            onChange={handleSearchChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
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

        {/* Search Results Dropdown */}
        {showResults && searchResults.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
            {searchResults.map((item, index) => (
              <div
                key={item.id}
                onMouseDown={(e) => {
                
                  e.preventDefault();
                  e.stopPropagation();
                  handleResultClick(item);
                }}
                className="flex items-start gap-3 p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors"
              >
                <div className="text-lg mt-0.5">
                  {item.icon({ className: item.iconClass })}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-900 text-sm mb-1">
                    {highlightText(item.title, searchQuery)}
                  </div>
                  <div className="text-gray-600 text-xs leading-relaxed">
                    {highlightText(item.description, searchQuery)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* No Results */}
        {showResults && searchQuery && searchResults.length === 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 p-4">
            <div className="text-center text-gray-500">
              <div className="text-sm font-medium mb-1">No results found</div>
              <div className="text-xs">Try searching for something else</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SettingsSearchBar;
