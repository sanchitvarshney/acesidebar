import React from "react";

const TicketDetailSkeleton = () => (
  <div className="flex w-full h-full">
    {/* Sidebar skeleton */}
    <div className="w-80 min-w-[300px] border-l bg-gray-50 flex flex-col h-full p-4 animate-pulse">
      <div className="h-6 w-24 bg-gray-200 rounded mb-4" />
      <div className="h-4 w-32 bg-gray-200 rounded mb-2" />
      <div className="h-4 w-20 bg-gray-200 rounded mb-2" />
      <div className="h-4 w-28 bg-gray-200 rounded mb-2" />
      <div className="h-4 w-24 bg-gray-200 rounded mb-6" />
      <div className="h-10 w-10 bg-gray-200 rounded-full mb-4" />
      <div className="h-4 w-32 bg-gray-200 rounded mb-2" />
      <div className="h-4 w-20 bg-gray-200 rounded mb-2" />
      <div className="h-8 w-24 bg-gray-200 rounded mb-2" />
    </div>
    {/* Main content skeleton */}
    <div className="flex-1 flex flex-col p-8 animate-pulse">
      {/* Header */}
      <div className="h-8 w-1/2 bg-gray-200 rounded mb-6" />
      {/* Thread items */}
      <div className="space-y-6 flex-1">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-white rounded shadow p-6 border border-gray-100 flex flex-col gap-2"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-gray-200 rounded-full" />
              <div className="h-4 w-32 bg-gray-200 rounded" />
              <div className="h-4 w-16 bg-gray-200 rounded ml-auto" />
            </div>
            <div className="h-4 w-3/4 bg-gray-200 rounded mb-1" />
            <div className="h-4 w-2/3 bg-gray-200 rounded mb-1" />
            <div className="h-4 w-1/2 bg-gray-200 rounded" />
          </div>
        ))}
      </div>
      {/* Editor skeleton */}
      <div className="mt-8 bg-white rounded shadow p-6 border border-gray-100">
        <div className="h-4 w-1/3 bg-gray-200 rounded mb-2" />
        <div className="h-20 w-full bg-gray-200 rounded mb-2" />
        <div className="h-8 w-24 bg-gray-200 rounded" />
      </div>
    </div>
  </div>
);

export default TicketDetailSkeleton;
