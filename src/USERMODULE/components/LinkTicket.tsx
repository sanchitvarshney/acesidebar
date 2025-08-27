import React, { useState, useEffect } from "react";
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
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import RemoveIcon from "@mui/icons-material/Remove";
import LinkIcon from "@mui/icons-material/Link";
import CloseIcon from "@mui/icons-material/Close";
import { useCommanApiMutation } from "../../services/threadsApi";
import { useTicketSearchMutation } from "../../services/ticketAuth";

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
  const [commanApi] = useCommanApiMutation();
  const [inputValue, setInputValue] = useState("");
  const [options, setOptions] = useState<Ticket[]>([]);
  const [selectedTickets, setSelectedTickets] = useState<Ticket[]>([]);
  const [linkRelationships, setLinkRelationships] = useState<
    Record<string, LinkRelationship>
  >({});

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
        id: String(item?.ticketNumber ?? item?.id ?? item?.ticketId ?? ""),
        title: String(
          item?.subject ??
            item?.title ??
            `Ticket #${item?.ticketNumber ?? item?.id ?? ""}`
        ),
        group: String(item?.group ?? item?.department ?? "Unknown"),
        agent: String(item?.agent ?? item?.assignee ?? "Unassigned"),
        status: String(item?.status ?? "Unknown"),
        priority: String(item?.priority ?? "Unknown"),
        createdAt: String(item?.createdAt ?? item?.created_at ?? ""),
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
      url: "link-tickets",
      body: {
        sourceTicketId: currentTicket?.id,
        linkedTickets: Object.values(linkRelationships).map((rel) => ({
          ticketId: rel.id,
          relationshipType: rel.type,
          description: rel.description,
        })),
      },
    };

    commanApi(payload);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={(_, reason) => {
        if (reason === "backdropClick") {
          return;
        }
        if (reason === "escapeKeyDown") {
          onClose();
          return;
        }
      }}
      fullWidth
      maxWidth="md"
      PaperProps={{ sx: { borderRadius: 3 } }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <LinkIcon color="primary" />
          Link Tickets
        </Box>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ p: 2 }}>
        <Stack spacing={2}>
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
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
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
        </Stack>
      </DialogContent>

      <DialogActions sx={{ justifyContent: "flex-end", gap: 1 }}>
        <Button variant="text" onClick={onClose}>
          Cancel
        </Button>

        <Button
          variant="contained"
          color="primary"
          onClick={handleLink}
          disabled={selectedTickets.length === 0}
          startIcon={<LinkIcon />}
        >
          Create Links
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default LinkTickets;
