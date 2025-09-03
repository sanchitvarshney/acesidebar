import React from "react";
import { Box, Card, CardContent, Chip, Stack, Typography } from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import { TicketItem } from "./types";
import CustomToolTip from "../../../components/reusable/CustomToolTip";

type TicketsTabProps = {
  tickets: TicketItem[];
};

const TicketsTab: React.FC<TicketsTabProps> = ({ tickets }) => {
  return (
    <Box>
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
        My Tickets
      </Typography>
      <Stack spacing={2}>
        {tickets?.map((item, index) => (
          <Card
            key={index}
            elevation={0}
            sx={{
              borderRadius: 2,
              border: "1px solid #e5e7eb",
              bgcolor: "background.paper",
              transition: "all 0.2s ease",
              "&:hover": {
                borderColor: "primary.main",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              },
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: "flex", alignItems: "flex-start", gap: 3 }}>
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
                      mb: 2,
                    }}
                  >
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      {item?.overdue && (
                        <Chip
                          label="Overdue"
                          color="error"
                          variant="outlined"
                          size="small"
                          sx={{ mb: 1, fontWeight: 600 }}
                        />
                      )}
                      <CustomToolTip
                        title={
                          <Typography
                            variant="subtitle2"
                            sx={{
                              p: 1,
                              maxWidth: { sm: 300, xs: 200, md: 500 },
                            }}
                          >
                            {item?.description}
                          </Typography>
                        }
                      >
                        <Typography
                          variant="h6"
                          sx={{ fontWeight: 600, cursor: "pointer", mb: 1 }}
                        >
                          {item?.title}
                        </Typography>
                      </CustomToolTip>
                    </Box>
                  </Box>
                  <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
                    <Chip
                      label={`Status: ${item?.status}`}
                      size="small"
                      color={item?.status === "Open" ? "primary" : "success"}
                      variant="outlined"
                    />
                    {item?.group && (
                      <Chip
                        label={`Group: ${item?.group}`}
                        size="small"
                        color="secondary"
                        variant="outlined"
                      />
                    )}
                  </Stack>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 2,
                    }}
                  >
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ fontSize: "0.875rem" }}
                    >
                      {item?.created
                        ? `Created: ${item?.created}`
                        : item?.closed
                        ? `Closed: ${item?.closed}`
                        : null}
                    </Typography>
                    {item?.resolved_late ? (
                      <Chip
                        label="Resolved late"
                        color="warning"
                        variant="outlined"
                        size="small"
                        sx={{ fontWeight: 600 }}
                      />
                    ) : item?.overdue_by ? (
                      <Typography
                        variant="body2"
                        color="error.main"
                        sx={{ fontSize: "0.875rem", fontWeight: 600 }}
                      >
                        Overdue by: {item?.overdue_by}
                      </Typography>
                    ) : null}
                  </Box>
                </Box>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Stack>
    </Box>
  );
};

export default TicketsTab;
