import React from "react";
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
  Chip,
  Button,
  IconButton,
  Badge,
  styled,
  useTheme,
} from "@mui/material";
import {
  Inbox as InboxIcon,
  Star as StarIcon,
  Send as SendIcon,
  Drafts as DraftsIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
} from "@mui/icons-material";

const tagColors = {
  HR: "#ff4081",
  IT : "#2979ff",
  Finance: "#00c853",
  Other: "#ff9100",
};

const SidebarButton = styled(Button)(({ theme }) => ({
  borderRadius: 12,
  fontWeight: 600,
  fontSize: "1rem",
  marginBottom: theme.spacing(2),
  padding: theme.spacing(1.5, 0),
  boxShadow: theme.shadows[1],
}));

const TagCircle = styled("span")<{ color: string }>(({ color }) => ({
  display: "inline-block",
  width: 16,
  height: 16,
  borderRadius: "50%",
  background: color,
  marginRight: 8,
  border: "2px solid #fff",
}));

const Sidebar: React.FC = () => {
  const theme = useTheme();
  const mainFolders = [
    {
      key: "inbox",
      label: "Inbox",
      icon: <InboxIcon />,
      badge: 4,
      color: "error",
    },
    { key: "starred", label: "Starred", icon: <StarIcon />, badge: null },
    { key: "sent", label: "Sent", icon: <SendIcon />, badge: null },
    {
      key: "draft",
      label: "Draft",
      icon: <DraftsIcon />,
      badge: 2,
      color: "info",
    },
    { key: "trash", label: "Trash", icon: <DeleteIcon />, badge: null },
  ];
  const tags = [
    { label: "HR", color: tagColors.HR },
    { label: "IT", color: tagColors.IT },
    { label: "Finance", color: tagColors.Finance },
    { label: "Other", color: tagColors.Other },
  ];
  return (
    <Box
      sx={{
        width: 270,
        p: 3,
        bgcolor: "#fff",
        height: "100vh",
        borderRight: `1px solid ${theme.palette.divider}`,
      }}
    >
      <SidebarButton
        variant="contained"
        color="primary"
        fullWidth
        startIcon={<AddIcon />}
        sx={{ mb: 3, fontSize: "1.1rem", py: 1.5 }}
      >
        Compose
      </SidebarButton>
      <List>
        {mainFolders?.map((folder) => (
          <ListItem key={folder.key} disablePadding sx={{ mb: 1 }}>
            <ListItemButton
              selected={folder.key === "inbox"}
              sx={{ borderRadius: 2 }}
            >
              <ListItemIcon>{folder.icon}</ListItemIcon>
              <ListItemText
                primary={folder.label}
                primaryTypographyProps={{ fontWeight: 600 }}
              />
              {folder.badge ? (
                <Badge
                  badgeContent={folder.badge}
                  color={folder.color as any}
                  sx={{ ml: 1 }}
                />
              ) : null}
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider sx={{ my: 2 }} />
      <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
        <Typography
          variant="subtitle2"
          sx={{ fontWeight: 700, color: "text.secondary", flex: 1 }}
        >
          Tags
        </Typography>
        <IconButton size="small" color="info" sx={{ ml: 1 } }>
          <AddIcon fontSize="small" />
        </IconButton>
      </Box>
      <Box>
        {tags?.map((tag) => (
          <Box
            key={tag.label}
            sx={{
              display: "flex",
              alignItems: "center",
              mb: 1,
              pl: 1,
              cursor: "pointer",
            }}
          >
            <TagCircle color={tag.color} />
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              {tag.label}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default Sidebar;
