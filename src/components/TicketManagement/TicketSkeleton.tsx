import React from "react";
import { Box, Skeleton, Paper } from "@mui/material";

const TicketSkeleton: React.FC<{ rows?: number }> = ({ rows = 10 }) => {
  return (
    <Box>
      {/* Section header skeleton */}
      <Box
        sx={{
          px: 3,
          py: 1,
          background: "rgba(0,0,0,0.03)",
          borderBottom: "1px solid #eee",
        }}
      >
        <Skeleton variant="text" width={120} height={28} />
      </Box>
      {/* Ticket row skeletons */}
      {[...Array(rows)].map((_, idx) => (
        <Paper
          key={idx}
          sx={{
            display: "flex",
            alignItems: "center",
            px: 2,
            py: 1,
            mb: 1,
            borderRadius: 0,
            boxShadow: "none",
            borderBottom: "1px solid #eee",
            gap: 6,
          }}
        >
          <Skeleton variant="circular" width={24} height={24} sx={{ mr: 2 }} />
          <Skeleton
            variant="rectangular"
            width={60}
            height={20}
            sx={{ mr: 2, borderRadius: 1 }}
          />
          <Skeleton variant="text" width={180} height={20} sx={{ mr: 2 }} />
          <Skeleton variant="text" width={80} height={20} sx={{ mr: 2 }} />
          <Skeleton
            variant="rectangular"
            width={60}
            height={20}
            sx={{ mr: 2, borderRadius: 1 }}
          />
          <Skeleton variant="text" width={100} height={20} sx={{ mr: 2 }} />
          <Skeleton variant="circular" width={24} height={24} />
          <Skeleton variant="text" width={100} height={20} sx={{ mr: 2 }} />

        </Paper>
      ))}
    </Box>
  );
};

export default TicketSkeleton;
