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
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import RemoveIcon from "@mui/icons-material/Remove";
import StarIcon from "@mui/icons-material/Star";
import CloseIcon from "@mui/icons-material/Close";
import { useCommanApiMutation } from "../../services/threadsApi";
import MergeConfirmation from "./MergeConfirmation";
import {
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  Stack,
  Checkbox,
} from "@mui/material";
import { useTicketSearchMutation } from "../../services/ticketAuth";

interface Ticket {
  id: string;
  title: string;
  group: string;
  agent: string;
  closedAgo?: string;
  resolvedOnTime?: boolean;
  isPrimary?: boolean;
}

interface MergeTicketsProps {
  open: boolean;
  initialPrimary: any; // Your current ticket
  onClose: () => void;
}

const MergeTickets: React.FC<MergeTicketsProps> = ({
  open,
  initialPrimary,
  onClose,
}) => {
  const [commanApi] = useCommanApiMutation();
  const [inputValue, setInputValue] = useState("");
  const [options, setOptions] = useState<Ticket[]>([]);
  const [selectedTickets, setSelectedTickets] = useState<Ticket[]>([
    { ...initialPrimary, isPrimary: true },
  ]);
  const [step, setStep] = useState(1);

  // Extra controls based on requested UI
  const [ticketIdToAdd, setTicketIdToAdd] = useState("");
  const [participants, setParticipants] = useState("User + Collaborators");
  const [childStatus, setChildStatus] = useState("Closed");
  const [parentStatus, setParentStatus] = useState("Open");
  const [mergeType, setMergeType] = useState("combine");
  const [deleteChild, setDeleteChild] = useState(false);
  const [moveChildTasks, setMoveChildTasks] = useState(false);

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
      });

      const mapped: Ticket[] = Array.isArray(apiResult)
        ? apiResult.map(normalize)
        : apiResult
        ? [normalize(apiResult)]
        : [];

      setOptions(mapped);
    } catch (e) {
      // ignore and fallback to local filter
      setOptions([]);
    }
  };

  useEffect(() => {
    if (open) {
      fetchOptions(inputValue);
      setStep(1);
      setSelectedTickets([{ ...initialPrimary, isPrimary: true }]);
    }
  }, [open, initialPrimary]);

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
    setSelectedTickets((prev) =>
      prev.some((t) => t.id === value.id)
        ? prev
        : [...prev, { ...value, isPrimary: false }]
    );
  };

  const handleRemoveTicket = (ticketId: string, isPrimary: boolean) => {
    if (isPrimary) return;
    setSelectedTickets((prev) => prev.filter((t) => t.id !== ticketId));
  };

  const handleSetPrimary = (ticketId: string) => {
    setSelectedTickets((prev) =>
      prev.map((t) => ({
        ...t,
        isPrimary: t.id === ticketId,
      }))
    );
  };

  const hasPrimary = selectedTickets.some((t) => t.isPrimary);

  const handleMerge = () => {
    if (step === 1) {
      setStep(2);
      return;
    }

    if (step === 2) {
      const payload = {
        url: "merge-tickets",
        body: {
          tickets: selectedTickets,
          primary: selectedTickets.find((t) => t.isPrimary),
          participants,
          childStatus,
          parentStatus,
          mergeType,
          deleteChild,
          moveChildTasks,
        },
      };
      commanApi(payload);
      onClose();
      setStep(1);
    }
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
        Merge Tickets
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ p: 2 }}>
        {step === 1 && (
          <Stack spacing={1.5}>
            <Alert severity="info">
              Choose the Tickets to merge. Mark one as the Parent Ticket before
              merging.
            </Alert>

            <Autocomplete
              size="small"
              fullWidth
              disablePortal
              options={options}
              loading={isLoading}
              getOptionLabel={(option) => `#${option.id}`}
              renderOption={(props, option) => {
                console.log(option);
                return (
                  <li
                    {...props}
                    className="flex items-center gap-2 p-2 cursor-pointer"
                  >
                    <Avatar
                      sx={{ width: 30, height: 30, bgcolor: "primary.main" }}
                    >
                      {option.title?.charAt(0).toUpperCase()}
                    </Avatar>
                    <div>
                      <Typography variant="subtitle2">#{option.id}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        Group: {option.group} • Agent: {option.agent}
                      </Typography>
                    </div>
                  </li>
                );
              }}
              inputValue={inputValue}
              onInputChange={(_, value) => setInputValue(value)}
              onChange={handleSelectTicket}
              filterOptions={(x) => x}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Search tickets to merge"
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
                  //   helperText={isLoading ? "Searching..." : inputValue && !isLoading && options.length === 0 ? "No matching tickets" : ""}
                />
              )}
            />

            <Stack
              direction={{ xs: "column", md: "row" }}
              spacing={2}
              alignItems={{ md: "center" }}
            >
              <FormControl size="small" sx={{ minWidth: 220 }}>
                <InputLabel id="participants-label">Participants</InputLabel>
                <Select
                  labelId="participants-label"
                  id="participants"
                  label="Participants"
                  value={participants}
                  onChange={(e) => setParticipants(e.target.value)}
                >
                  <MenuItem value="User">User</MenuItem>
                  <MenuItem value="User + Collaborators">
                    User + Collaborators
                  </MenuItem>
                  <MenuItem value="All Participants">All Participants</MenuItem>
                </Select>
              </FormControl>

              <FormControl size="small" sx={{ minWidth: 160 }}>
                <InputLabel id="child-status-label">Child Status</InputLabel>
                <Select
                  labelId="child-status-label"
                  id="child-status"
                  label="Child Status"
                  value={childStatus}
                  onChange={(e) => setChildStatus(e.target.value)}
                >
                  <MenuItem value="Open">Open</MenuItem>
                  <MenuItem value="Closed">Closed</MenuItem>
                  <MenuItem value="Pending">Pending</MenuItem>
                </Select>
              </FormControl>

              <FormControl size="small" sx={{ minWidth: 160 }}>
                <InputLabel id="parent-status-label">Parent Status</InputLabel>
                <Select
                  labelId="parent-status-label"
                  id="parent-status"
                  label="Parent Status"
                  value={parentStatus}
                  onChange={(e) => setParentStatus(e.target.value)}
                  displayEmpty
                >
                  <MenuItem value="Open">Open</MenuItem>
                  <MenuItem value="Closed">Closed</MenuItem>
                  <MenuItem value="Resolved">Resolved</MenuItem>
                </Select>
              </FormControl>
            </Stack>

            <FormControl>
              <RadioGroup
                row
                value={mergeType}
                onChange={(e) => setMergeType(e.target.value)}
              >
                <FormControlLabel
                  value="combine"
                  control={<Radio />}
                  label="Combine Threads"
                />
                <FormControlLabel
                  value="separate"
                  control={<Radio />}
                  label="Separate Threads"
                />
              </RadioGroup>
            </FormControl>

            <Stack>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={deleteChild}
                    onChange={(e) => setDeleteChild(e.target.checked)}
                  />
                }
                label="Delete Child Ticket"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={moveChildTasks}
                    onChange={(e) => setMoveChildTasks(e.target.checked)}
                  />
                }
                label="Move Child Tasks to Parent"
              />
            </Stack>
          </Stack>
        )}

        <div
          className={`w-full overflow-y-auto mt-3 ${
            step === 1 ? "max-h-[50vh]" : "max-h-[50vh]"
          }`}
        >
          {step === 1 && (
            <List>
              {selectedTickets.map((ticket) => (
                <ListItem
                  key={ticket.id}
                  sx={{
                    border: "1px solid #e4e4e4",
                    mb: 1,
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                  }}
                >
                  <IconButton
                    disabled={ticket.isPrimary}
                    onClick={() =>
                      handleRemoveTicket(ticket.id, ticket.isPrimary || false)
                    }
                    sx={{
                      border: "1px solid",
                      borderColor: ticket.isPrimary ? "#f28b82" : "#d32f2f",
                      color: ticket.isPrimary ? "#f28b82" : "#d32f2f",
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
                            {ticket.title}
                          </Typography>
                          <Typography variant="caption">
                            Group: {ticket.group} • Agent: {ticket.agent}
                          </Typography>
                        </div>
                      </div>
                    }
                  />

                  <IconButton
                    onClick={() => handleSetPrimary(ticket.id)}
                    color={ticket.isPrimary ? "primary" : "default"}
                    sx={{
                      border: "1px solid",
                      width: 24,
                      height: 24,
                    }}
                  >
                    {ticket.isPrimary && <StarIcon fontSize="small" />}
                  </IconButton>
                  <Typography variant="caption">Primary</Typography>
                </ListItem>
              ))}
            </List>
          )}

          {step === 2 && <MergeConfirmation />}
        </div>
      </DialogContent>

      <DialogActions sx={{ justifyContent: "flex-end", gap: 1 }}>
        {step === 2 && (
          <Button variant="outlined" onClick={() => setStep(1)}>
            Back
          </Button>
        )}
        <Button variant="outlined" onClick={onClose}>
          Cancel
        </Button>

        <Button
          variant="contained"
          color="primary"
          onClick={handleMerge}
          disabled={
            step === 1 ? selectedTickets.length < 2 || !hasPrimary : false
          }
        >
          {step === 1 ? "Proceed to Merge" : "Confirm Merge"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MergeTickets;
