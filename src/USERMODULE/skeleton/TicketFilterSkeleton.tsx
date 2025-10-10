import React from "react";

const skeletonRows = Array.from({ length: 7 });

const TicketFilterSkeleton: React.FC = () => {
  return (
    <div className="w-72 min-w-72 bg-white shadow rounded-lg flex flex-col h-full p-4 animate-pulse overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <div className="h-4 w-20 bg-gray-200 rounded" />
        <div className="h-3 w-16 bg-gray-200 rounded" />
      </div>
      {skeletonRows.map((_, idx) => (
        <div className="mb-6" key={idx}>
          <div className="h-3 w-24 bg-gray-200 rounded mb-2" />
          <div className="h-8 w-full bg-gray-200 rounded" />
        </div>
      ))}
      <div className="mt-auto pt-2">
        <div className="h-10 w-full bg-gray-200 rounded" />
      </div>
    </div>
  );
};

export default TicketFilterSkeleton;
