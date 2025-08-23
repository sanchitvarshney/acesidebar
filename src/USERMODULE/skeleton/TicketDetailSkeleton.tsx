import React from "react";

const TicketDetailSkeleton = () => (
  <div className="flex flex-col lg:flex-row w-full h-full overflow-hidden">
    {/* Main content skeleton */}
    <div className="flex-1 flex flex-col p-4 sm:p-6 lg:p-8 animate-pulse overflow-hidden min-w-0">
      {/* Header */}
      <div className="h-6 sm:h-8 w-3/4 sm:w-1/2 bg-gray-200 rounded mb-4 sm:mb-6 flex-shrink-0" />
      {/* Thread items */}
      <div className="space-y-4 sm:space-y-6 flex-1 overflow-y-auto">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-white rounded shadow p-3 sm:p-4 lg:p-6 border border-gray-100 flex flex-col gap-2 flex-shrink-0"
          >
            <div className="flex items-center gap-2 sm:gap-3 mb-2">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-200 rounded-full" />
              <div className="h-3 sm:h-4 w-24 sm:w-32 bg-gray-200 rounded" />
              <div className="h-3 sm:h-4 w-12 sm:w-16 bg-gray-200 rounded ml-auto" />
            </div>
            <div className="h-3 sm:h-4 w-full sm:w-3/4 bg-gray-200 rounded mb-1" />
            <div className="h-3 sm:h-4 w-4/5 sm:w-2/3 bg-gray-200 rounded mb-1" />
            <div className="h-3 sm:h-4 w-3/5 sm:w-1/2 bg-gray-200 rounded" />
          </div>
        ))}
      </div>
      {/* Editor skeleton */}
      <div className="mt-6 sm:mt-8 bg-white rounded shadow p-3 sm:p-4 lg:p-6 border border-gray-100 flex-shrink-0">
        <div className="h-3 sm:h-4 w-1/2 sm:w-1/3 bg-gray-200 rounded mb-2" />
        <div className="h-16 sm:h-20 w-full bg-gray-200 rounded mb-2" />
        <div className="h-6 sm:h-8 w-20 sm:w-24 bg-gray-200 rounded" />
      </div>
    </div>
    {/* Sidebar skeleton - hidden on mobile, visible on larger screens */}
    <div className="hidden lg:flex w-64 lg:w-72 xl:w-80 border-l bg-gray-50 flex-col h-full p-3 lg:p-4 animate-pulse overflow-hidden flex-shrink-0">
      <div className="h-6 w-20 bg-gray-200 rounded mb-3 flex-shrink-0" />
      <div className="h-4 w-28 bg-gray-200 rounded mb-2 flex-shrink-0" />
      <div className="h-4 w-16 bg-gray-200 rounded mb-2 flex-shrink-0" />
      <div className="h-4 w-24 bg-gray-200 rounded mb-2 flex-shrink-0" />
      <div className="h-4 w-20 bg-gray-200 rounded mb-4 flex-shrink-0" />
      <div className="h-8 w-8 bg-gray-200 rounded-full mb-3 flex-shrink-0" />
      <div className="h-4 w-28 bg-gray-200 rounded mb-2 flex-shrink-0" />
      <div className="h-4 w-16 bg-gray-200 rounded mb-2 flex-shrink-0" />
      <div className="h-6 w-20 bg-gray-200 rounded mb-2 flex-shrink-0" />
    </div>
  </div>
);

export default TicketDetailSkeleton;
