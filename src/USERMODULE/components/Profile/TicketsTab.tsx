import React, { useMemo, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Chip,
  Stack,
  Typography,
  Pagination,
} from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import { TicketItem } from "./types";
import TicketFilterPanel from "../../pages/TicketManagement/TicketSidebar";

type TicketsTabProps = {
  tickets: TicketItem[];
};

const TicketsTab: React.FC<TicketsTabProps> = ({ tickets }) => {
  const [appliedFilters, setAppliedFilters] = useState<Record<string, any>>({});
  const filteredTickets = useMemo(() => {
    if (!tickets) return [];
    if (!appliedFilters || Object.keys(appliedFilters).length === 0)
      return tickets;
    return tickets.filter((t) => {
      const searchText = (appliedFilters.ticket_id || "")
        .toString()
        .toLowerCase();
      const matchesText =
        !searchText ||
        t.title?.toLowerCase().includes(searchText) ||
        t.description?.toLowerCase().includes(searchText);

      const status = (appliedFilters.status || appliedFilters.ticket_status) as
        | string
        | undefined;
      const matchesStatus = !status || status === "All" || t.status === status;

      const group = (appliedFilters.group || appliedFilters.ticket_group) as
        | string
        | undefined;
      const matchesGroup = !group || group === "All" || t.group === group;

      return matchesText && matchesStatus && matchesGroup;
    });
  }, [tickets, appliedFilters]);

  return (
    <Box sx={{ width: "100%", height: "100%" }}>
      {/* <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1 }}>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          My Tickets
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {tickets?.length || 0} total
        </Typography>
      </Box> */}

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "3fr 1fr" },
          gap: 2,
        }}
      >
        <Box>
          <Stack spacing={2}>
            <div className="w-full h-[calc(100vh-220px)] overflow-y-scroll gap-2 flex flex-col">
              {filteredTickets?.map((item, index) => (
                <Card
                  key={index}
                  elevation={0}
                  sx={{
                    mr: 0.25,
                    flexGrow: 1,
                    flexShrink: 0,
                    position: "relative",
                    overflow: "hidden",
                    borderRadius: 2,
                    border: "1px solid",
                    borderColor: "divider",
                    bgcolor: "background.paper",
                    transition: "all 0.2s ease",
                    cursor: "pointer",
                    "&:before": {
                      content: '""',
                      position: "absolute",
                      left: 0,
                      top: 0,
                      bottom: 0,
                      width: 3,
                      bgcolor:
                        item?.status === "Open"
                          ? "primary.main"
                          : item?.status === "Pending"
                          ? "warning.main"
                          : "success.main",
                    },
                    "&:hover": {
                      borderColor: "primary.main",
                      boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
                      transform: "translateY(-1px)",
                    },
                  }}
                  onClick={(e: any) => {}}
                >
                  <CardContent sx={{ p: 2 }}>
                    <Stack direction="row" spacing={2} alignItems="flex-start">
                      <Box
                        sx={{
                          width: 48,
                          height: 48,
                          borderRadius: 2,
                          bgcolor: "primary.main",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "white",
                          flexShrink: 0,
                          boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.2)",
                        }}
                      >
                        <EmailIcon />
                      </Box>

                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "flex-start",
                            justifyContent: "space-between",
                            gap: 2,
                            mb: 1,
                          }}
                        >
                          <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Stack direction="row" spacing={1} sx={{ mb: 0.5 }}>
                              {item?.overdue && (
                                <Chip
                                  label="Overdue"
                                  color="error"
                                  size="small"
                                  variant="filled"
                                  sx={{ height: 22, fontWeight: 600 }}
                                />
                              )}
                              {item?.resolved_late && (
                                <Chip
                                  label="Resolved late"
                                  color="warning"
                                  size="small"
                                  variant="outlined"
                                  sx={{ height: 22, fontWeight: 600 }}
                                />
                              )}
                            </Stack>

                            <Typography
                              variant="subtitle1"
                              sx={{
                                fontWeight: 600,
                                cursor: "pointer",
                                mb: 0.5,
                                lineHeight: 1.2,
                              }}
                            >
                              {item?.title}
                            </Typography>
                          </Box>
                          <Chip
                            label={`${item?.status || "Unknown"}`}
                            size="small"
                            color={
                              item?.status === "Open"
                                ? "primary"
                                : item?.status === "Pending"
                                ? "warning"
                                : "success"
                            }
                            variant="outlined"
                            sx={{ fontWeight: 700 }}
                          />
                        </Box>

                        <Typography variant="body2" color="text.secondary">
                          {item?.created
                            ? `Created: ${item?.created}`
                            : item?.closed
                            ? `Closed: ${item?.closed}`
                            : ""}
                        </Typography>
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Box sx={{ display: "flex", justifyContent: "center", py: 1 }}>
              <Pagination count={10} color="primary" size="small" />
            </Box>
          </Stack>
        </Box>

        <Box sx={{ width: "100%", height: "calc(100vh - 220px)" }}>
        
            <TicketFilterPanel
              onApplyFilters={(f: Record<string, any>) => setAppliedFilters(f)}
            />
      
        </Box>
      </Box>
    </Box>
  );
};

export default TicketsTab;
