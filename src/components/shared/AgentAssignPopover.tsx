import React, { useState } from "react";
import Popover from "@mui/material/Popover";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import PersonIcon from "@mui/icons-material/Person";

interface AgentAssignPopoverProps {
  value: string;
  onChange: (val: string) => void;
  agentList: string[];
  departmentList: string[];
  trigger: React.ReactNode;
}

const AgentAssignPopover: React.FC<AgentAssignPopoverProps> = ({
  value,
  onChange,
  agentList,
  departmentList,
  trigger,
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [tab, setTab] = useState<"department" | "agent">("agent");
  const [search, setSearch] = useState("");

  const handleOpen = (e: React.MouseEvent<HTMLElement>) =>
    setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);
  const handleTabChange = (_: any, newValue: "department" | "agent") =>
    setTab(newValue);

  const filteredAgents = agentList.filter((a) =>
    a.toLowerCase().includes(search.toLowerCase())
  );
  const filteredDepartments = departmentList.filter((d) =>
    d.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = (val: string) => {
    onChange(val);
    handleClose();
  };

  return (
    <>
      <span
        onClick={handleOpen}
        style={{
          cursor: "pointer",
          display: "inline-flex",
          alignItems: "center",
        }}
      >
        {trigger}
      </span>
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
        PaperProps={{ style: { minWidth: 320, borderRadius: 12, padding: 0 } }}
      >
        <Box
          sx={{ px: 2, pt: 2, pb: 0, borderBottom: 1, borderColor: "divider" }}
        >
          <Tabs value={tab} onChange={handleTabChange} variant="fullWidth">
            <Tab
              label={
                <span style={{ fontWeight: 600, fontSize: 13 }}>
                  Department
                </span>
              }
              value="department"
            />
            <Tab
              label={
                <span style={{ fontWeight: 600, fontSize: 13 }}>AGENT</span>
              }
              value="agent"
            />
          </Tabs>
        </Box>
        <Box sx={{ px: 2, pt: 2, pb: 1 }}>
          <TextField
            fullWidth
            size="small"
            placeholder={`Search ${tab}`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
            sx={{ mb: 1, background: "#fafbfc", borderRadius: 1 }}
          />
        </Box>
        <Box sx={{ px: 2, pb: 2, minHeight: 80 }}>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ fontWeight: 600, mb: 1, display: "block" }}
          >
            {tab === "department" ? "Department" : "Agent"}
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            <Box
              sx={{
                px: 1,
                py: 0.5,
                borderRadius: 1,
                cursor: "pointer",
                bgcolor: value === "Unassigned" ? "#f0f4ff" : "transparent",
                fontWeight: value === "Unassigned" ? 600 : 400,
                color: value === "Unassigned" ? "#1976d2" : "inherit",
                fontSize: 15,
                mb: 0.5,
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
              onClick={() => handleSelect("Unassigned")}
            >
              <PersonIcon fontSize="small" style={{ marginRight: 8 }} />
              Unassigned
            </Box>
            {(tab === "department" ? filteredDepartments : filteredAgents).map(
              (item) => (
                <Box
                  key={item}
                  sx={{
                    px: 1,
                    py: 0.5,
                    borderRadius: 1,
                    cursor: "pointer",
                    bgcolor: value === item ? "#f0f4ff" : "transparent",
                    fontWeight: value === item ? 600 : 400,
                    color: value === item ? "#1976d2" : "inherit",
                    fontSize: 15,
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                  onClick={() => handleSelect(item)}
                >
                  {tab === "agent" ? (
                    <Avatar
                      sx={{
                        width: 24,
                        height: 24,
                        fontSize: 14,
                        marginRight: 1,
                      }}
                    >
                      {item[0]}
                    </Avatar>
                  ) : null}
                  {item}
                </Box>
              )
            )}
          </Box>
        </Box>
      </Popover>
    </>
  );
};

export default AgentAssignPopover;
