import React from "react";

const TaskListSkeleton: React.FC<{ count?: number }> = ({ count = 5 }) => {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className="bg-white border border-gray-300 rounded-lg mb-3 p-4 animate-pulse"
        >
          <div className="flex items-start gap-3">
            {/* Checkbox skeleton */}
            <div className="flex-shrink-0">
              <div className="w-4 h-4 rounded border border-gray-300 bg-gray-100" />
            </div>

            {/* Status icon skeleton */}
            <div className="flex-shrink-0">
              <div className="w-10 h-10 rounded-full bg-gray-200" />
            </div>

            {/* Content skeleton */}
            <div className="flex-1 min-w-0">
              {/* Title and chips */}
              <div className="flex items-center gap-2 mb-2">
                <div className="h-4 w-3/4 bg-gray-200 rounded" />
                <div className="h-5 w-16 bg-gray-100 rounded-full" />
              </div>

              {/* Info row */}
              <div className="flex items-center gap-4 mb-2">
                <div className="h-3 w-20 bg-gray-100 rounded" />
                <div className="h-3 w-24 bg-gray-100 rounded" />
                <div className="h-3 w-16 bg-gray-100 rounded" />
              </div>

              {/* Bottom row */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-5 w-16 bg-gray-200 rounded-full" />
                  <div className="h-5 w-12 bg-gray-100 rounded-full" />
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-8 bg-gray-100 rounded" />
                  <div className="h-6 w-6 bg-gray-100 rounded" />
                  <div className="h-3 w-4 bg-gray-100 rounded" />
                  <div className="h-6 w-6 bg-gray-100 rounded" />
                  <div className="h-3 w-4 bg-gray-100 rounded" />
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TaskListSkeleton;
