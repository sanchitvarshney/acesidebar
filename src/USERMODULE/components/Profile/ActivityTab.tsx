import React, { useState, useRef } from "react";
import { Box, Paper, Typography, Button } from "@mui/material";
import {
  timelineOppositeContentClasses,
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineDot,
  TimelineContent,
} from "@mui/lab";
import CheckIcon from "@mui/icons-material/CheckCircle";
import MailIcon from "@mui/icons-material/Mail";
import CustomPopover from "../../../reusable/CustomPopover";

const ActivityTab: React.FC = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const activityAnchorRef = useRef<HTMLDivElement>(null);

  return (
    <Box sx={{ display: "flex", gap: 3, height: "100%" }}>
      <Box sx={{ flex: 2 }}>
        <Paper
          elevation={0}
          sx={{
            p: 3,
            bgcolor: "background.paper",
            borderRadius: 2,
            border: "1px solid #e5e7eb",
            height: "100%",
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
            Recent Activity
          </Typography>
          <Timeline
            sx={{
              [`& .${timelineOppositeContentClasses.root}`]: { flex: 0.2 },
              p: 0,
            }}
          >
            <TimelineItem
              ref={activityAnchorRef}
              onClick={() => setOpenIdx(0)}
              sx={{ cursor: "pointer" }}
            >
              <TimelineSeparator>
                <TimelineConnector sx={{ bgcolor: "success.main" }} />
                <TimelineDot sx={{ bgcolor: "success.main" }}>
                  <CheckIcon fontSize="small" />
                </TimelineDot>
                <TimelineConnector sx={{ bgcolor: "success.main" }} />
              </TimelineSeparator>
              <TimelineContent sx={{ py: "12px", px: 2 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                  Profile Updated
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Updated contact information • 2 hours ago
                </Typography>
              </TimelineContent>
            </TimelineItem>
            <TimelineItem
              onClick={() => setOpenIdx(1)}
              sx={{ cursor: "pointer" }}
            >
              <TimelineSeparator>
                <TimelineConnector sx={{ bgcolor: "primary.main" }} />
                <TimelineDot sx={{ bgcolor: "primary.main" }}>
                  <MailIcon fontSize="small" />
                </TimelineDot>
                <TimelineConnector sx={{ bgcolor: "primary.main" }} />
              </TimelineSeparator>
              <TimelineContent sx={{ py: "12px", px: 2 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                  New Ticket Created
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Created ticket #1234 • 1 day ago
                </Typography>
              </TimelineContent>
            </TimelineItem>
          </Timeline>
        </Paper>
      </Box>
      <Box sx={{ flex: 1 }}>
        <Paper
          elevation={0}
          sx={{
            p: 3,
            bgcolor: "background.paper",
            borderRadius: 2,
            border: "1px solid #e5e7eb",
            height: "100%",
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
            Quick Stats
          </Typography>
          <Box
            sx={{
              textAlign: "center",
              p: 2,
              bgcolor: "primary.50",
              borderRadius: 2,
              mb: 2,
            }}
          >
            <Typography
              variant="h4"
              sx={{ fontWeight: 700, color: "primary.main" }}
            >
              12
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total Tickets
            </Typography>
          </Box>
          <Box
            sx={{
              textAlign: "center",
              p: 2,
              bgcolor: "success.50",
              borderRadius: 2,
            }}
          >
            <Typography
              variant="h4"
              sx={{ fontWeight: 700, color: "success.main" }}
            >
              8
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Resolved
            </Typography>
          </Box>
        </Paper>
      </Box>

      <CustomPopover
        open={openIdx !== null}
        close={() => setOpenIdx(null)}
        anchorEl={activityAnchorRef}
        width={400}
        isCone={true}
      >
        <Box sx={{ p: 2 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {openIdx === 0
              ? "Updated contact information • 2 hours ago"
              : openIdx === 1
              ? "Created ticket #1234 • 1 day ago"
              : "Details"}
          </Typography>
          <Button
            variant="contained"
            size="small"
            onClick={() => setOpenIdx(null)}
          >
            DONE
          </Button>
        </Box>
      </CustomPopover>
    </Box>
  );
};

export default ActivityTab;
