import React, { useState } from "react";

interface SearchDropdownPanelProps {
  recentSearched: string[];
  setRecentSearched: React.Dispatch<React.SetStateAction<string[]>>;
  recentViewed: { title: string; id: number }[];
  setRecentViewed: React.Dispatch<
    React.SetStateAction<{ title: string; id: number }[]>
  >;
  isSearching?: boolean;
  searchResult?: any;
  searchQuery?: string;
}

const FILTERS = ["All", "Tickets", "Contacts", "Solutions", "Forums"];

const SearchDropdownPanel: React.FC<SearchDropdownPanelProps> = ({
  recentSearched,
  setRecentSearched,
  recentViewed,
  setRecentViewed,
  isSearching,
  searchResult,
  searchQuery,
}) => {
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState({
    subject: true,
    description: true,
    properties: true,
    notes: true,
    attachments: true,
    spam: true,
  });
  const handleToggle = (key: keyof typeof settings) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };
  const handleCancel = () => setShowSettings(false);
  const handleApply = () => setShowSettings(false);

  // Ticket card rendering for search result
  const renderTicketResult = (ticket: any) => (
    <div className="bg-white rounded border border-gray-200 mb-3 flex items-center px-4 py-3 shadow-sm hover:shadow transition relative mt-4">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-semibold text-gray-800 truncate text-lg">
            {ticket?.subject || ticket?.title || "No subject"}
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600 flex-wrap">
          <span className="flex items-center gap-1">
            <span className="text-gray-800 text-base">
              #{ticket?.ticketId || ticket?.id}
            </span>
            <span className="font-medium">
              {ticket?.fromUser || ticket?.requester}
            </span>
            <span className="text-xs">
              • Created: {ticket?.createDt || ticket?.createdAt}
            </span>
          </span>
        </div>
      </div>
    </div>
  );
console.log(searchResult)
  return (
    <div className="absolute left-0 top-12 w-[480px] z-50 rounded-lg shadow-lg border border-gray-200 bg-white">
      {/* Filter bar */}
      <div className="px-4 pt-4 pb-2 select-none">
        <div className="flex items-center gap-2 mb-2">
          <div className="flex gap-1 flex-1">
            {FILTERS.map((filter, idx) => (
              <span
                key={filter}
                className={`font-medium text-sm px-3 py-1 rounded border border-gray-200 cursor-pointer ${
                  idx === 0
                    ? "bg-blue-600 text-white border-blue-600"
                    : "text-gray-700 bg-white"
                }`}
              >
                {filter}
              </span>
            ))}
          </div>
          {/* Settings button */}
          <button
            className="ml-2 w-7 h-7 flex items-center justify-center rounded text-gray-400 hover:text-gray-600 border border-gray-200 bg-white"
            onClick={() => setShowSettings(true)}
            aria-label="Search settings"
          >
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
              <path
                stroke="currentColor"
                strokeWidth="2"
                d="M12 15.5A3.5 3.5 0 1 0 12 8.5a3.5 3.5 0 0 0 0 7Zm7.94-2.06a1 1 0 0 0-.22-1.09l-1.43-1.43a7.03 7.03 0 0 0 0-2.84l1.43-1.43a1 1 0 0 0 .22-1.09 9.02 9.02 0 0 0-2.12-3.67 1 1 0 0 0-1.09-.22l-1.43 1.43a7.03 7.03 0 0 0-2.84 0l-1.43-1.43a1 1 0 0 0-1.09-.22A9.02 9.02 0 0 0 4.12 6.65a1 1 0 0 0-.22 1.09l1.43 1.43a7.03 7.03 0 0 0 0 2.84l-1.43 1.43a1 1 0 0 0-.22 1.09 9.02 9.02 0 0 0 2.12 3.67 1 1 0 0 0 1.09.22l1.43-1.43a7.03 7.03 0 0 0 2.84 0l1.43 1.43a1 1 0 0 0 1.09.22 9.02 9.02 0 0 0 3.67-2.12Z"
              />
            </svg>
          </button>
        </div>
      </div>
      {/* Settings panel inside dropdown */}
      {showSettings ? (
        <div className="select-none cursor-default">
          <div className="px-6 pt-6 pb-2 text-gray-700 font-semibold text-base select-none">
            Search preferences
          </div>
          <div className="px-6 pt-2 pb-2 text-gray-700 font-medium text-sm select-none">
            Tickets
          </div>
          <div className="border-t border-gray-100 mb-2" />
          <div className="flex-1 px-6">
            <div className="flex items-center justify-between py-2 border-b border-gray-100 select-none">
              <span className="text-gray-700">Subject</span>
              <button
                onClick={() => handleToggle("subject")}
                className={`w-10 h-6 flex items-center rounded-full p-1 transition-colors ${
                  settings.subject ? "bg-blue-600" : "bg-gray-300"
                }`}
              >
                <span
                  className={`w-4 h-4 bg-white rounded-full shadow transform transition-transform ${
                    settings.subject ? "translate-x-4" : ""
                  }`}
                ></span>
              </button>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-100 select-none">
              <span className="text-gray-700">Description</span>
              <button
                onClick={() => handleToggle("description")}
                className={`w-10 h-6 flex items-center rounded-full p-1 transition-colors ${
                  settings.description ? "bg-blue-600" : "bg-gray-300"
                }`}
              >
                <span
                  className={`w-4 h-4 bg-white rounded-full shadow transform transition-transform ${
                    settings.description ? "translate-x-4" : ""
                  }`}
                ></span>
              </button>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-100 select-none">
              <span className="text-gray-700">Ticket properties</span>
              <button
                onClick={() => handleToggle("properties")}
                className={`w-10 h-6 flex items-center rounded-full p-1 transition-colors ${
                  settings.properties ? "bg-blue-600" : "bg-gray-300"
                }`}
              >
                <span
                  className={`w-4 h-4 bg-white rounded-full shadow transform transition-transform ${
                    settings.properties ? "translate-x-4" : ""
                  }`}
                ></span>
              </button>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-100 select-none">
              <span className="text-gray-700">Notes & replies</span>
              <button
                onClick={() => handleToggle("notes")}
                className={`w-10 h-6 flex items-center rounded-full p-1 transition-colors ${
                  settings.notes ? "bg-blue-600" : "bg-gray-300"
                }`}
              >
                <span
                  className={`w-4 h-4 bg-white rounded-full shadow transform transition-transform ${
                    settings.notes ? "translate-x-4" : ""
                  }`}
                ></span>
              </button>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-100 select-none">
              <span className="text-gray-700">Attachments (File names)</span>
              <button
                onClick={() => handleToggle("attachments")}
                className={`w-10 h-6 flex items-center rounded-full p-1 transition-colors ${
                  settings.attachments ? "bg-blue-600" : "bg-gray-300"
                }`}
              >
                <span
                  className={`w-4 h-4 bg-white rounded-full shadow transform transition-transform ${
                    settings.attachments ? "translate-x-4" : ""
                  }`}
                ></span>
              </button>
            </div>
            <div className="bg-gray-50 rounded p-3 mt-4 flex items-center justify-between select-none">
              <span className="text-gray-700">Include spam tickets</span>
              <button
                onClick={() => handleToggle("spam")}
                className={`w-10 h-6 flex items-center rounded-full p-1 transition-colors ${
                  settings.spam ? "bg-blue-600" : "bg-gray-300"
                }`}
              >
                <span
                  className={`w-4 h-4 bg-white rounded-full shadow transform transition-transform ${
                    settings.spam ? "translate-x-4" : ""
                  }`}
                ></span>
              </button>
            </div>
          </div>
          <div className="flex justify-end gap-2 px-6 py-4 bg-gray-50 border-t border-gray-100 select-none">
            <button
              className="px-4 py-2 rounded border border-gray-300 bg-white text-gray-700 font-medium"
              onClick={handleCancel}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 rounded bg-blue-600 text-white font-semibold"
              onClick={handleApply}
            >
              Apply
            </button>
          </div>
        </div>
      ) : isSearching ? (
        <div className="p-6">
          <div className="h-16 bg-gray-200 rounded w-full animate-pulse mb-2" />
          <div className="h-6 bg-gray-100 rounded w-1/2 animate-pulse mb-2" />
        </div>
      ) : searchResult && searchQuery ? (
        <div className="p-4 max-h-80 overflow-y-auto">
          {Array.isArray(searchResult) && searchResult.length === 0 && (
            <div className="text-gray-400 text-center py-8">
              No tickets found.
            </div>
          )}
          {Array.isArray(searchResult)
            ? searchResult.map(renderTicketResult)
            : renderTicketResult(searchResult)}
        </div>
      ) : (
        <>
          <div className="border-t border-gray-100" />
          {/* Recently searched */}
          <div className="px-4 pt-2">
            <div className="flex justify-between items-center mb-1">
              <span className="text-gray-500 font-medium text-sm">
                Recently searched
              </span>
              <button
                className="text-blue-600 text-sm font-medium hover:underline"
                onClick={() => setRecentSearched([])}
              >
                Clear
              </button>
            </div>
            <ul className="py-0">
              {recentSearched.length === 0 && (
                <li className="text-gray-400 text-sm py-1">
                  No recent searches
                </li>
              )}
              {recentSearched.map((item, idx) => (
                <li key={idx} className="flex items-center gap-2 py-1">
                  <svg
                    className="text-gray-400"
                    width="18"
                    height="18"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      cx="11"
                      cy="11"
                      r="7"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                    <path
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      d="M21 21l-4.35-4.35"
                    />
                  </svg>
                  <span className="text-gray-700 text-sm">{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="border-t border-gray-100 my-2" />
          {/* Recently viewed */}
          <div className="px-4 pb-4">
            <div className="flex justify-between items-center mb-1">
              <span className="text-gray-500 font-medium text-sm">
                Recently viewed
              </span>
              <button
                className="text-blue-600 text-sm font-medium hover:underline"
                onClick={() => setRecentViewed([])}
              >
                Clear
              </button>
            </div>
            <ul className="py-0">
              {recentViewed.length === 0 && (
                <li className="text-gray-400 text-sm py-1">No recent views</li>
              )}
              {recentViewed.map((item, idx) => (
                <li key={idx} className="flex items-center gap-2 py-1">
                  <svg
                    className="text-green-400"
                    width="18"
                    height="18"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <rect
                      x="3"
                      y="7"
                      width="18"
                      height="10"
                      rx="2"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                    <path
                      stroke="currentColor"
                      strokeWidth="2"
                      d="M7 7V5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2"
                    />
                  </svg>
                  <span className="text-gray-700 text-sm font-medium">
                    {item.title}{" "}
                    <span className="text-gray-400 font-normal">
                      #{item.id}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  );
};

export default SearchDropdownPanel;
