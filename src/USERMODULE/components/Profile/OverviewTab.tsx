import React from "react";
import {
  Avatar,
  Box,
  Chip,
  Paper,
  Typography,
  Card,
  CardContent,
  Stack,
} from "@mui/material";
import {
  timelineOppositeContentClasses,
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineDot,
  TimelineContent,
} from "@mui/lab";
import { UserProfileInfo, TicketItem } from "./types";
import WorkIcon from "@mui/icons-material/Work";
import BusinessIcon from "@mui/icons-material/Business";
import ScheduleIcon from "@mui/icons-material/Schedule";
import PriorityIcon from "@mui/icons-material/PriorityHigh";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import EmailIcon from "@mui/icons-material/Email";
import ContactDetails from "./ContactDetails";

type OverviewTabProps = {
  user: UserProfileInfo & { initials: string };
  ticketsSample?: TicketItem[];
};

const OverviewTab: React.FC<OverviewTabProps> = ({ user }) => {
  return (
    <Box sx={{ display: "flex", gap: 3, height: "100%" }}>
      <Box sx={{ flex: 2, display: "flex", flexDirection: "column", gap: 3 }}>
        <Paper
          elevation={0}
          sx={{
            p: 3,
            bgcolor: "background.paper",
            borderRadius: 2,
            border: "1px solid #e5e7eb",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 3, mb: 3 }}>
            <Avatar
              sx={{
                width: 80,
                height: 80,
                bgcolor: "primary.main",
                fontSize: 32,
                fontWeight: "bold",
              }}
            >
              {user.initials}
            </Avatar>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                {user.username}
              </Typography>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}
              >
                <Chip
                  icon={<WorkIcon />}
                  label={user.role}
                  size="small"
                  sx={{ bgcolor: "primary.main", color: "white" }}
                />
                <Chip
                  icon={<BusinessIcon />}
                  label={user.company}
                  variant="outlined"
                  size="small"
                  sx={{ borderColor: "primary.main", color: "primary.main" }}
                />
              </Box>
            </Box>
          </Box>
        </Paper>

        <Paper
          elevation={0}
          sx={{
            flex: 1,
            bgcolor: "background.paper",
            borderRadius: 2,
            border: "1px solid #e5e7eb",
            overflow: "hidden",
          }}
        >
          <Box sx={{ p: 3, borderBottom: "1px solid #e5e7eb" }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Timeline
            </Typography>
          </Box>
          <Box sx={{ p: 3, height: "calc(100% - 80px)", overflow: "auto" }}>
            <Timeline
              sx={{
                [`& .${timelineOppositeContentClasses.root}`]: { flex: 0.2 },
                p: 0,
              }}
            >
              <TimelineItem sx={{ "&::before": { display: "none" } }}>
                <TimelineSeparator>
                  <TimelineConnector sx={{ bgcolor: "primary.main" }} />
                  <TimelineDot sx={{ bgcolor: "primary.main" }}>
                    <MailOutlineIcon fontSize="small" />
                  </TimelineDot>
                  <TimelineConnector sx={{ bgcolor: "primary.main" }} />
                </TimelineSeparator>
                <TimelineContent sx={{ py: "12px", px: 2 }}>
                  <Card
                    elevation={0}
                    sx={{
                      borderRadius: 2,
                      border: "1px solid #e5e7eb",
                      bgcolor: "background.paper",
                    }}
                  >
                    <CardContent sx={{ p: 3 }}>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 2,
                          mb: 2,
                        }}
                      >
                        <ScheduleIcon sx={{ color: "primary.main" }} />
                        <Typography
                          variant="body2"
                          sx={{
                            color: "primary.main",
                            fontWeight: 600,
                            fontSize: "0.875rem",
                          }}
                        >
                          Thu, 10 Jul, 2025 • 9:22 AM
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 2,
                          mb: 2,
                        }}
                      >
                        <Box
                          sx={{
                            width: 24,
                            height: 24,
                            borderRadius: 1,
                            bgcolor: "primary.main",
                          }}
                        />
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                          Issues with reports #3
                        </Typography>
                      </Box>
                      <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
                        <Chip
                          icon={<PriorityIcon />}
                          label="Priority: Low"
                          size="small"
                          color="success"
                          variant="outlined"
                        />
                        <Chip
                          label="Status: Open"
                          size="small"
                          color="primary"
                          variant="outlined"
                        />
                        <Chip
                          label="Group: Escalations"
                          size="small"
                          color="secondary"
                          variant="outlined"
                        />
                      </Stack>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 2,
                          flexWrap: "wrap",
                        }}
                      >
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ fontSize: "0.875rem" }}
                        >
                          Agent responded: a month ago
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ fontSize: "0.875rem" }}
                        >
                          Overdue by: a month
                        </Typography>
                        <Chip
                          size="small"
                          label="Overdue"
                          color="error"
                          variant="outlined"
                          sx={{ fontWeight: 600 }}
                        />
                      </Box>
                    </CardContent>
                  </Card>
                </TimelineContent>
              </TimelineItem>
            </Timeline>
          </Box>
        </Paper>
      </Box>

      <ContactDetails
        email={user.email}
        phone={user.phone}
        address={user.address}
      />
    </Box>
  );
};

export default OverviewTab;
