import React from "react";
import {
  Box,
  Toolbar,
  Typography,
  TextField,
  InputAdornment,
} from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import SearchIcon from "@mui/icons-material/Search";

interface InboxHeaderProps {
  unreadCount: number;
}

const InboxHeader: React.FC<InboxHeaderProps> = ({ unreadCount }) => {
  return (
    <Box sx={{ borderBottom: "1px solid #e0e0e0", bgcolor: "#fff" }}>
      <Toolbar sx={{ display: "flex", alignItems: "center", px: 3, py: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", flex: 1 }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              mr: 1,
              display: "flex",
              alignItems: "center",
            }}
          >
            Inbox <ArrowDropDownIcon fontSize="medium" sx={{ ml: 0.5 }} />
          </Typography>
          <Typography
            variant="subtitle1"
            sx={{ color: "text.secondary", fontWeight: 500, ml: 1 }}
          >
            ({unreadCount} unread messages)
          </Typography>
        </Box>
        <TextField
          size="small"
          placeholder="Search messages ..."
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
            sx: { borderRadius: 2, bgcolor: "#fff" },
          }}
          sx={{ width: 280 }}
        />
      </Toolbar>
    </Box>
  );
};

export default InboxHeader;
