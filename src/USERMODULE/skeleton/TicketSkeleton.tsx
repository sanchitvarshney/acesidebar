import React from "react";

const TicketSkeleton: React.FC<{ rows?: number }> = ({ rows = 5 }) => {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, idx) => (
        <div
          key={idx}
          className="bg-white rounded border border-gray-200 flex flex-col md:flex-row items-start md:items-center px-4 py-2 shadow-sm animate-pulse"
        >
          {/* Checkbox and Avatar */}
          <div className="flex items-center mr-4 mb-2 md:mb-0">
            <span className="w-4 h-4 rounded border border-gray-300 bg-gray-100 mr-3" />
            <span className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center text-lg font-bold text-pink-600 mr-3">
              <span className="w-6 h-6 bg-gray-200 rounded-full" />
            </span>
          </div>
          {/* Ticket Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="block h-4 w-24 bg-gray-200 rounded" />
              <span className="block h-4 w-16 bg-gray-100 rounded" />
            </div>
            <div className="flex items-center gap-1">
              <span className="block h-4 w-20 bg-gray-100 rounded" />
              <span className="block h-4 w-28 bg-gray-100 rounded" />
            </div>
          </div>
          {/* Priority and Status */}
          <div className="flex flex-col items-end ml-auto min-w-[120px] gap-2">
            <div className="flex items-center gap-2">
              <span className="block h-4 w-10 bg-gray-200 rounded" />
              <span className="w-2 h-2 rounded-full bg-gray-200" />
            </div>
            <div className="flex items-center gap-2">
              <span className="block h-4 w-8 bg-gray-100 rounded" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TicketSkeleton;
