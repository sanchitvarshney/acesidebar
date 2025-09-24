import { Box,Skeleton} from "@mui/material";
import SecurityIcon from "@mui/icons-material/Security";


export default function SessionManagementSkeleton() {
  return (
    <Box>
      {/* Status Skeleton */}
      <Box className="mb-8">
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <SecurityIcon className="h-5 w-5 text-gray-300 mt-1" />
            </div>
            <div className="ml-3 w-full">
              <Skeleton variant="text" width={120} height={24} />
              <Skeleton variant="text" width="80%" height={20} />
            </div>
          </div>
        </div>
      </Box>

      {/* Sessions List Skeleton */}
      <Box className="rounded-lg shadow-sm border bg-white">
        <div className="px-6 py-2 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <Skeleton variant="text" width={150} height={24} />
              <Skeleton variant="text" width={100} height={18} />
            </div>
            <Skeleton variant="rectangular" width={120} height={36} className="rounded" />
          </div>
        </div>

        {/* List Items */}
        <div className="p-6 space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-gray-50 border border-gray-200 rounded-lg p-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gray-200 rounded" />
                  <div>
                    <Skeleton variant="text" width={100} height={16} />
                    <Skeleton variant="text" width={180} height={20} />
                    <Skeleton variant="text" width={140} height={14} />
                  </div>
                </div>
                <Skeleton variant="rectangular" width={100} height={32} className="rounded" />
              </div>
            </div>
          ))}
        </div>
      </Box>

      {/* Continue Button Skeleton */}
      <Box className="mt-8 text-center">
        <Skeleton variant="rectangular" width={220} height={48} className="mx-auto rounded-lg" />
      </Box>
    </Box>
  );
}
