import React from "react";
import Popover from "@mui/material/Popover";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import Divider from "@mui/material/Divider";
import CheckIcon from "@mui/icons-material/Check";

interface SortField {
  text: string;
  key: string;
  position?: number;
}

interface SortMode {
  text: string;
  key: string;
}

interface TicketSortingPopoverProps {
  anchorEl: HTMLElement | null;
  open: boolean;
  onClose: () => void;
  fields: SortField[];
  modes: SortMode[];
  selectedField: string;
  selectedMode: string;
  onFieldChange: (field: string) => void;
  onModeChange: (mode: string) => void;
}

const TicketSortingPopover: React.FC<TicketSortingPopoverProps> = ({
  anchorEl,
  open,
  onClose,
  fields,
  modes,
  selectedField,
  selectedMode,
  onFieldChange,
  onModeChange,
}) => {
  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      transformOrigin={{ vertical: "top", horizontal: "left" }}
      PaperProps={{
        sx: {
          fontSize: 14,
          minWidth: 240,
          maxWidth: 250,
          boxShadow: 3,
          marginTop: 1,
          borderRadius: 2,
          p: 0,
        },
      }}
    >
      <List sx={{ py: 1, px: 0 }}>
        {fields.map((field) => (
          <ListItem key={field.key} disablePadding>
            <ListItemButton
              selected={selectedField === field.key}
              onClick={(e) => {
                e.stopPropagation();
                onFieldChange(field.key);
              }}
              sx={{
                borderRadius: 0,
                justifyContent: "space-between",
                color: selectedField === field.key ? "#03363d" : "1f2937",
                fontWeight: selectedField === field.key ? 600 : 400,
              }}
            >
              <span>{field.text}</span>
              {selectedField === field.key && <CheckIcon fontSize="small" />}
            </ListItemButton>
          </ListItem>
        ))}
        <Divider sx={{ my: 1 }} />
        {modes.map((mode) => (
          <ListItem key={mode.key} disablePadding>
            <ListItemButton
              selected={selectedMode === mode.key}
              onClick={(e) => {
                e.stopPropagation();
                onModeChange(mode.key);
              }}
              sx={{
                borderRadius: 0,
                justifyContent: "space-between",
                color: selectedMode === mode.key ? "#03363d" : undefined,
                fontWeight: selectedMode === mode.key ? 600 : 400,
              }}
            >
              <span>{mode.text}</span>
              {selectedMode === mode.key && <CheckIcon fontSize="small" />}
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Popover>
  );
};

export default React.memo(TicketSortingPopover);
