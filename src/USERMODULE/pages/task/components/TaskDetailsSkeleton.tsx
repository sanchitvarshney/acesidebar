import React from 'react';
import {
  Card,
  CardContent,
  Skeleton,
  Box,
  Divider,
} from '@mui/material';

const TaskDetailsSkeleton: React.FC = () => {
  return (
    <div className="flex flex-col h-full">
      {/* Header Skeleton */}
      <div className="bg-white border-b px-6 py-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <Skeleton variant="circular" width={48} height={48} />
            <div>
              <Skeleton variant="text" width={300} height={32} />
              <div className="flex items-center gap-2 mt-1">
                <Skeleton variant="rounded" width={80} height={24} />
                <Skeleton variant="rounded" width={80} height={24} />
              </div>
            </div>
          </div>
          <Skeleton variant="rounded" width={120} height={40} />
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="flex-1 overflow-y-auto p-6">
        {/* Task Details Card */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="space-y-4">
              <div>
                <Skeleton variant="text" width={100} height={20} />
                <Skeleton variant="text" width={200} height={24} />
              </div>
              <div>
                <Skeleton variant="text" width={100} height={20} />
                <Skeleton variant="text" width={150} height={24} />
              </div>
              <div>
                <Skeleton variant="text" width={100} height={20} />
                <Skeleton variant="text" width={180} height={24} />
              </div>
              <div>
                <Skeleton variant="text" width={100} height={20} />
                <Skeleton variant="text" width={250} height={24} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Comments Card */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <Skeleton variant="text" width={200} height={24} />
              <Skeleton variant="rounded" width={120} height={36} />
            </div>

            {/* Comment Items Skeleton */}
            <div className="space-y-4">
              {[1, 2, 3].map((index) => (
                <div key={index} className="flex items-start gap-3">
                  <Skeleton variant="circular" width={32} height={32} />
                  <div className="flex-1 min-w-0">
                    <div className="bg-gray-50 rounded-2xl rounded-tl-md px-4 py-3">
                      <div className="flex items-center justify-between mb-2">
                        <Skeleton variant="text" width={100} height={16} />
                        <Skeleton variant="rounded" width={20} height={20} />
                      </div>
                      <Skeleton variant="text" width="100%" height={16} />
                      <Skeleton variant="text" width="80%" height={16} />
                    </div>
                    <div className="flex items-center gap-2 mt-2 ml-1">
                      <Skeleton variant="text" width={80} height={12} />
                      <Skeleton variant="text" width={20} height={12} />
                      <Skeleton variant="text" width={60} height={12} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TaskDetailsSkeleton;
