import React, { useState, useEffect, useRef } from "react";
import {
  Autocomplete,
  Avatar,
  Button,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  List,
  ListItem,
  ListItemText,
  TextField,
  Typography,
  Box,
  Stack,
  CircularProgress,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import RemoveIcon from "@mui/icons-material/Remove";
import LinkIcon from "@mui/icons-material/Link";
import CloseIcon from "@mui/icons-material/Close";
import { useCommanApiMutation } from "../../services/threadsApi";
import { useTicketSearchMutation } from "../../services/ticketAuth";
import { useToast } from "../../hooks/useToast";

interface Ticket {
  id: string;
  title: string;
  group: string;
  agent: string;
  status: string;
  priority: string;
  createdAt: string;
  isPrimary?: boolean;
}

interface LinkRelationship {
  id: string;
  type: "blocks" | "blocked_by" | "duplicate" | "related" | "parent" | "child";
  description: string;
}

interface LinkTicketsProps {
  open: boolean;
  currentTicket: any;
  onClose: () => void;
}

const LinkTickets: React.FC<LinkTicketsProps> = ({
  open,
  currentTicket,
  onClose,
}) => {
  const { showToast } = useToast();
  const [triggerLinkTicket, { isLoading: linkTicketLoading }] =
    useCommanApiMutation();
  const [inputValue, setInputValue] = useState("");
  const [options, setOptions] = useState<Ticket[]>([]);
  const [selectedTickets, setSelectedTickets] = useState<Ticket[]>([]);
  const [linkRelationships, setLinkRelationships] = useState<
    Record<string, LinkRelationship>
  >({});
  const [reason, setReason] = useState("");

  const [searchTickets, { isLoading }] = useTicketSearchMutation();

  // Fetch tickets using API by ID
  const fetchOptions = async (query: string) => {
    if (!query) {
      setOptions([]);
      return;
    }

    try {
      const apiResult: any = await searchTickets(query).unwrap();
      const normalize = (item: any): Ticket => ({
        id: item?.ticketID,
        title: String(
          item?.subject ??
            item?.title ??
            `Ticket #${item?.ticketId ?? item?.id ?? ""}`
        ),
        group: String(item?.group ?? item?.department?.name ?? "Unknown"),
        agent: String(item?.agent ?? item?.user ?? "Unassigned"),
        status: String(item?.status?.name ?? "Unknown"),
        priority: String(item?.priority?.name ?? "Unknown"),
        createdAt:
          item?.created?.dt && item?.createdAt?.tm
            ? item.createdAt.dt - item.createdAt.tm
            : item?.created_at ?? "",
      });

      const mapped: Ticket[] = Array.isArray(apiResult)
        ? apiResult.map(normalize)
        : apiResult
        ? [normalize(apiResult)]
        : [];

      // Filter out the current ticket from search results
      const filtered = mapped.filter(
        (ticket) => ticket.id !== currentTicket?.id
      );
      setOptions(filtered);
    } catch (e) {
      setOptions([]);
    }
  };

  useEffect(() => {
    if (open) {
      fetchOptions(inputValue);
      setSelectedTickets([]);
      setLinkRelationships({});
    }
  }, [open, currentTicket]);

  // Debounced search while typing
  useEffect(() => {
    if (!open) return;
    const timer = setTimeout(() => {
      fetchOptions(inputValue);
    }, 300);
    return () => clearTimeout(timer);
  }, [inputValue, open]);

  const handleSelectTicket = (_: any, value: Ticket | null) => {
    if (!value) return;

    // Check if ticket is already selected
    if (selectedTickets.some((t) => t.id === value.id)) return;

    const newTicket = { ...value };
    setSelectedTickets((prev) => [...prev, newTicket]);

    // Initialize link relationship for the new ticket
    setLinkRelationships((prev) => ({
      ...prev,
      [value.id]: {
        id: value.id,
        type: "related",
        description: "",
      },
    }));
  };

  const handleRemoveTicket = (ticketId: string) => {
    setSelectedTickets((prev) => prev.filter((t) => t.id !== ticketId));
    setLinkRelationships((prev) => {
      const newRelationships = { ...prev };
      delete newRelationships[ticketId];
      return newRelationships;
    });
  };

  const handleLink = () => {
    const payload = {
      url: `link-ticket/${currentTicket?.id}`,
      method: "PUT",
      body: {
        reason,
        linkedTicket: Object.values(linkRelationships).map((rel) => rel.id),
      },
    };

    triggerLinkTicket(payload).then((res: any) => {
      if (res?.data?.type === "error" || res?.type === "error") {
        showToast(
          res?.data?.message || res?.message || "An error occurred",
          "error"
        );
        return;
      } else {
        showToast(
          res?.data?.message || res?.message || "Tickets linked successfully",
          "success"
        );
        onClose();
      }
    });
  };

  return (
    <div className=" w-full h-full">
      <Stack
        spacing={2}
        sx={{ minHeight: "calc(100vh - 130px)", p: 4, overflowY: "auto" }}
      >
        <Alert severity="info">
          Link tickets to create relationships without merging them. Linked
          tickets remain separate but are connected for better tracking and
          reference.
        </Alert>

        <Box>
          <Typography variant="subtitle2" gutterBottom>
            Current Ticket: #{currentTicket?.id} -{" "}
            {currentTicket?.subject || currentTicket?.title}
          </Typography>
        </Box>

        <Autocomplete
          size="small"
          fullWidth
          value={null}
          disablePortal={false}
          options={options}
          loading={isLoading}
          getOptionLabel={(option) => `#${option.id} - ${option.title}`}
          renderOption={(props, option) => (
            <li
              {...props}
              className="flex items-center gap-2 p-2 cursor-pointer"
            >
              <Avatar sx={{ width: 30, height: 30, bgcolor: "primary.main" }}>
                {option.title?.charAt(0).toUpperCase()}
              </Avatar>
              <div>
                <Typography variant="subtitle2">#{option.id}</Typography>
                <Typography variant="caption" color="text.secondary">
                  {option.title}
                </Typography>
                <Typography
                  variant="caption"
                  display="block"
                  color="text.secondary"
                >
                  Status: {option.status} • Priority: {option.priority}
                </Typography>
              </div>
            </li>
          )}
          inputValue={inputValue}
          onInputChange={(_, value) => setInputValue(value)}
          onChange={handleSelectTicket}
          filterOptions={(x) => x}
          slotProps={{
            popper: {
              sx: {
                zIndex: 9999,
              },
            },
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              autoFocus
              // inputRef={inputRef}
              label="Search tickets to link"
              InputProps={{
                ...params.InputProps,
                startAdornment: (
                  <>
                    <SearchIcon
                      sx={{ color: "gray", mr: 1 }}
                      fontSize="small"
                    />
                    {params.InputProps.startAdornment}
                  </>
                ),
              }}
            />
          )}
        />

        {selectedTickets.length > 0 && (
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Selected Tickets to Link
            </Typography>
            <List>
              {selectedTickets.map((ticket) => (
                <ListItem
                  key={ticket.id}
                  sx={{
                    border: "1px solid #e4e4e4",
                    mb: 1,
                    borderRadius: 1,
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                  }}
                >
                  <IconButton
                    onClick={() => handleRemoveTicket(ticket.id)}
                    sx={{
                      border: "1px solid #d32f2f",
                      color: "#d32f2f",
                      width: 24,
                      height: 24,
                    }}
                  >
                    <RemoveIcon fontSize="small" />
                  </IconButton>

                  <ListItemText
                    primary={
                      <div className="flex items-center gap-3">
                        <Avatar
                          sx={{
                            bgcolor: "primary.main",
                            width: 30,
                            height: 30,
                          }}
                        >
                          {ticket.title.charAt(0).toUpperCase()}
                        </Avatar>
                        <div>
                          <Typography variant="subtitle2">
                            #{ticket.id} - {ticket.title}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Status: {ticket.status} • Priority:{" "}
                            {ticket.priority}
                          </Typography>
                        </div>
                      </div>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </Box>
        )}

        <TextField
          id="reason-field"
          label="Reason for linking tickets"
          variant="outlined"
          multiline
          rows={4}
          fullWidth
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          sx={{
            my: 2,
          }}
        />
      </Stack>

      <Box
        sx={{
          p: 2,
          borderTop: "1px solid #eee",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 1,
          backgroundColor: "#fafafa",
        }}
      >
        <Button
          onClick={onClose}
          variant="text"
          sx={{ minWidth: 80, fontWeight: 600 }}
        >
          Cancel
        </Button>

        <Button
          variant="contained"
          color="primary"
          onClick={handleLink}
          disabled={selectedTickets.length === 0}
          startIcon={!linkTicketLoading && <LinkIcon />}
          sx={{ minWidth: 120, fontWeight: 600 }}
        >
          {linkTicketLoading ? (
            <CircularProgress size={20} color="inherit" />
          ) : (
            "Create Links"
          )}
        </Button>
      </Box>
    </div>
  );
};

export default LinkTickets;
