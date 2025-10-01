import React, { useState, useRef } from "react";
import {
  Box,
  Paper,
  Typography,
  Button,
  Stack,
  Chip,
  Divider,
} from "@mui/material";
import {
  timelineOppositeContentClasses,
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineDot,
  TimelineContent,
  TimelineOppositeContent,
} from "@mui/lab";
import CheckIcon from "@mui/icons-material/CheckCircle";
import MailIcon from "@mui/icons-material/Mail";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
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
            border: "1px solid",
            borderColor: "divider",
            height: "100%",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: 2,
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Recent Activity
            </Typography>
            <Chip
              size="small"
              color="primary"
              variant="outlined"
              label="Live"
            />
          </Box>

          <Timeline
            // position="alternate"
            sx={{
              p: 0,
              m: 0,
              [`& .${timelineOppositeContentClasses.root}`]: {
                flex: 0.25,
                m: 0,
                px: 2,
                textAlign: { xs: "left", sm: "right" },
              },
              [`& .MuiTimelineItem-root:before`]: { flex: 0, padding: 0 },
            }}
          >
            <TimelineItem
              ref={activityAnchorRef}
              onClick={() => setOpenIdx(0)}
              sx={{ cursor: "pointer" }}
            >
              {/* <TimelineOppositeContent sx={{ py: 1 }} color="text.secondary">
                2 hours ago
              </TimelineOppositeContent> */}
              <TimelineSeparator>
                <TimelineConnector
                  sx={{ bgcolor: "success.main", opacity: 0.6 }}
                />
                <TimelineDot
                  sx={{
                    bgcolor: "success.main",
                    boxShadow: "0 0 0 6px rgba(46, 125, 50, 0.14)",
                  }}
                >
                  <CheckIcon fontSize="small" />
                </TimelineDot>
                <TimelineConnector
                  sx={{ bgcolor: "success.main", opacity: 0.6 }}
                />
              </TimelineSeparator>
              <TimelineContent sx={{ py: 1, px: 2 }}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    border: "1px solid",
                    borderColor: "divider",
                  }}
                >
                  <Typography
                    variant="subtitle2"
                    sx={{ fontWeight: 700, lineHeight: 1.2, mb: 0.5 }}
                  >
                    Profile Updated
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Updated contact information
                  </Typography>
                </Paper>
              </TimelineContent>
            </TimelineItem>
            <Typography sx={{ textAlign: "center" }} variant="subtitle2">
              today
            </Typography>
            <TimelineItem
              onClick={() => setOpenIdx(1)}
              sx={{ cursor: "pointer" }}
            >
              {/* <TimelineOppositeContent sx={{ py: 1 }} color="text.secondary">
                1 day ago
              </TimelineOppositeContent> */}
              <TimelineSeparator>
                <TimelineConnector
                  sx={{ bgcolor: "primary.main", opacity: 0.6 }}
                />
                <TimelineDot
                  sx={{
                    bgcolor: "primary.main",
                    boxShadow: "0 0 0 6px rgba(25, 118, 210, 0.14)",
                  }}
                >
                  <MailIcon fontSize="small" />
                </TimelineDot>
                <TimelineConnector
                  sx={{ bgcolor: "primary.main", opacity: 0.6 }}
                />
              </TimelineSeparator>
              <TimelineContent sx={{ py: 1, px: 2 }}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    border: "1px solid",
                    borderColor: "divider",
                  }}
                >
                  <Typography
                    variant="subtitle2"
                    sx={{ fontWeight: 700, lineHeight: 1.2, mb: 0.5 }}
                  >
                    New Ticket Created
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Created ticket #1234
                  </Typography>
                </Paper>
              </TimelineContent>
            </TimelineItem>
                 <Typography sx={{ textAlign: "center" }} variant="subtitle2">
              yesterday
            </Typography>
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
            border: "1px solid",
            borderColor: "divider",
            height: "100%",
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
            Quick Stats
          </Typography>
          <Stack spacing={2}>
            <Box
              sx={{
                textAlign: "center",
                p: 2,
                bgcolor: "primary.50",
                borderRadius: 2,
                border: "1px solid",
                borderColor: "divider",
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
                border: "1px solid",
                borderColor: "divider",
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
          </Stack>
        </Paper>
      </Box>

      <CustomPopover
        open={openIdx !== null}
        close={() => setOpenIdx(null)}
        anchorEl={activityAnchorRef}
        width={420}
        isCone={true}
      >
        <Box sx={{ p: 2, minWidth: { xs: 260, sm: 380 } }}>
          <Stack
            direction="row"
            spacing={1.5}
            alignItems="flex-start"
            sx={{ mb: 1.5 }}
          >
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: 1,
                bgcolor: "action.selected",
                color: "text.primary",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <InfoOutlinedIcon fontSize="small" />
            </Box>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: 700, lineHeight: 1.2 }}
              >
                {openIdx === 0
                  ? "Profile Updated"
                  : openIdx === 1
                  ? "New Ticket Created"
                  : "Details"}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {openIdx === 0
                  ? "Updated contact information • 2 hours ago"
                  : openIdx === 1
                  ? "Created ticket #1234 • 1 day ago"
                  : ""}
              </Typography>
            </Box>
          </Stack>

          <Box
            sx={{
              bgcolor: "action.hover",
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 1.5,
              p: 1.5,
              mb: 2,
            }}
          >
            <Typography
              variant="subtitle2"
              sx={{ color: "text.secondary", mb: 0.5 }}
            >
              Summary
            </Typography>
            <Typography variant="body2">
              {openIdx === 0
                ? "User updated contact details including phone and email."
                : openIdx === 1
                ? "Ticket #1234 created regarding login issues and password reset."
                : "Event details."}
            </Typography>
          </Box>

          <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
            <Button
              variant="contained"
              size="small"
              startIcon={<OpenInNewIcon fontSize="small" />}
            >
              View details
            </Button>
            <Button variant="outlined" size="small">
              Dismiss
            </Button>
          </Stack>
          <Divider sx={{ my: 1.5 }} />
          <Box sx={{ textAlign: "right" }}>
            <Button
              variant="text"
              size="small"
              onClick={() => setOpenIdx(null)}
            >
              DONE
            </Button>
          </Box>
        </Box>
      </CustomPopover>
    </Box>
  );
};

export default ActivityTab;
