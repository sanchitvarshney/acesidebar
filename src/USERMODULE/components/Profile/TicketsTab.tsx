import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Chip,
  Stack,
  Typography,
  Pagination,
  CircularProgress,
} from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import { TicketItem } from "./types";
import TicketFilterPanel from "../../pages/TicketManagement/TicketSidebar";
import { useLazyGetUserTicketsQuery } from "../../../services/auth";
import { useNavigate } from "react-router-dom";

type TicketsTabProps = {
  userId: any;
};

const TicketsTab: React.FC<TicketsTabProps> = ({ userId }) => {
  const [appliedFilters, setAppliedFilters] = useState<Record<string, any>>({});
  const navigate = useNavigate();
  const [pagination, setPagination] = useState<{
    page: number;
    limit: number;
    totalPages: number;
  }>({
    page: 1,
    limit: 10,
    totalPages: 1,
  });

  const [tickets, setTickets] = useState<TicketItem[]>([]);
  const [getUserTickets, { isLoading: getUserTicketsLoading }] =
    useLazyGetUserTicketsQuery();

  useEffect(() => {
    if (!userId) return;
    getUserTickets({
      client: userId,
      page: pagination.page,
      limit: pagination.limit,
    }).then((res: any) => {
      setTickets(res?.data?.data);
      setPagination((prev) => ({
        ...prev,
        totalPages: res?.data?.pagination?.totalPages || 1,
      }));
    });
  }, [userId, pagination.page, pagination.limit]);

  const filteredTickets = useMemo(() => {
    if (!appliedFilters || Object.keys(appliedFilters).length === 0)
      return tickets;
    return tickets.filter((t: any) => {
      const searchText = appliedFilters.key.toString().toLowerCase();
      const matchesText =
        !searchText || t.subject?.toLowerCase().includes(searchText);

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

  const handlePageChange = (
    _event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setPagination((prev) => ({ ...prev, page: value }));
  };

  const items = (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr", md: "3fr 1fr" },
        gap: 2,
      }}
    >
      <Box>
        <Stack spacing={2}>
          <div className="w-full h-[calc(100vh-220px)] overflow-y-scroll gap-2 flex flex-col custom-scrollbar p-2">
            {filteredTickets.length > 0 ? (
              <>
                {filteredTickets?.map((item: any) => (
                  <Card
                    key={item?.key}
                    elevation={0}
                    sx={{
                      mr: 0.25,
                      minHeight: 60,
                      flexGrow: 0,
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
                    onClick={(e: any) => {
                      e.stopPropagation();
                      navigate(`/tickets/${item?.key}`);
                    }}
                  >
                    <CardContent sx={{ p: 2 }}>
                      <Stack
                        direction="row"
                        spacing={2}
                        alignItems="flex-start"
                      >
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
                              <Stack
                                direction="row"
                                spacing={1}
                                sx={{ mb: 0.5 }}
                              >
                                {item?.due?.isDue && (
                                  <Chip
                                    label="Overdue"
                                    color="error"
                                    size="small"
                                    variant="filled"
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
                                {item?.subject}
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
                            {item?.createdAt
                              ? `Created: ${item?.createdAt}`
                              : item?.closed
                              ? `Closed: ${item?.closed}`
                              : ""}
                          </Typography>
                        </Box>
                      </Stack>
                    </CardContent>
                  </Card>
                ))}
              </>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400">
                No tickets found
              </div>
            )}
          </div>

          <Box sx={{ display: "flex", justifyContent: "center", py: 1 }}>
            <Pagination
              count={pagination.totalPages}
              page={pagination.page}
              onChange={handlePageChange}
              color="primary"
              size="small"
            />
          </Box>
        </Stack>
      </Box>

      <Box sx={{ width: "100%", height: "calc(100vh - 220px)" }}>
        <TicketFilterPanel
          onApplyFilters={(f: Record<string, any>) => setAppliedFilters(f)}
        />
      </Box>
    </Box>
  );

  return (
    <Box sx={{ width: "100%", height: "100%" }}>
      {getUserTicketsLoading ||
      !filteredTickets ||
      filteredTickets.length === 0 ? (
        <div className="w-full h-full flex justify-center items-center">
          <CircularProgress />
        </div>
      ) : (
        items
      )}
    </Box>
  );
};

export default TicketsTab;
