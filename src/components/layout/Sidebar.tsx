import React, { useState } from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Collapse,
  Box,
  Typography,
  IconButton,
  Avatar,
  Divider,
  styled,
  alpha,
  useTheme,
} from "@mui/material";
import {
  Dashboard as DashboardIcon,
  ViewModule as LayoutsIcon,
  DesktopWindows as UIElementsIcon,
  TableChart as TablesIcon,
  Edit as FormsIcon,
  ViewQuilt as CardsIcon,
  CalendarToday as CalendarIcon,
  Image as GalleryIcon,
  LocalOffer as MorePagesIcon,
  ExpandLess,
  ExpandMore,
  Search as SearchIcon,
  SignalCellularAlt as SignalIcon,
  Edit as EditIcon,
  People as PeopleIcon,
  Settings as SettingsIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  ExitToApp as ExitToAppIcon,
  Menu as MenuIcon,
} from "@mui/icons-material";

const SIDEBAR_WIDTH = 80; // Reduced width to fit only icons
const SIDEBAR_COLLAPSED_WIDTH = 0; // No width when collapsed

const StyledDrawer = styled(Drawer, {
  shouldForwardProp: (prop) => prop !== "open",
})<{ open?: boolean }>(({ theme, open }) => ({
  "--sidebar-width": `${SIDEBAR_WIDTH}px`,
  "--sidebar-collapsed-width": `${SIDEBAR_COLLAPSED_WIDTH}px`,
  width: open ? "var(--sidebar-width)" : "var(--sidebar-collapsed-width)",
  transition: "width 150ms cubic-bezier(0.4,0,0.2,1) 0ms",
  boxShadow: "none",
  overflowX: "hidden",
  position: "relative",
  top: 0,
  left: 0,
  height: "100vh",
  zIndex: 1200,
  "& .MuiDrawer-paper": {
    width: open ? "var(--sidebar-width)" : "var(--sidebar-collapsed-width)",
    transition: "width 150ms cubic-bezier(0.4,0,0.2,1) 0ms",
    overflowX: "hidden",
    backgroundColor: theme.palette.background.paper,
    borderRight: "none",
  },
}));

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: theme.spacing(1, 2),
  ...theme.mixins.toolbar,
}));

const SearchBox = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  margin: theme.spacing(1),
  width: "auto",
}));

const iconColors = [
  "#4caf50", // green
  "#2196f3", // blue
  "#ff9800", // orange
  "#e74c3c", // red
];

const ColoredShortcutButton = styled(IconButton)<{ bgcolor: string }>(
  ({ theme, bgcolor }) => ({
    margin: theme.spacing(1),
    color: "#fff",
    backgroundColor: bgcolor,
    borderRadius: 8,
    width: 40,
    height: 40,
    "&:hover": {
      backgroundColor: bgcolor,
      opacity: 0.85,
    },
    boxShadow: theme.shadows[1],
    fontSize: 20,
  })
);

const ToggleButton = styled(IconButton)(({ theme }) => ({
  position: "fixed",
  left: 8,
  top: "50%",
  transform: "translateY(-50%)",
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[2],
  "&:hover": {
    backgroundColor: alpha(theme.palette.background.paper, 0.9),
  },
  zIndex: 1300,
}));

interface SidebarProps {
  open: boolean;
  handleDrawerToggle: () => void;
}

interface MenuItem {
  title: string;
  icon?: React.ReactNode;
  path?: string;
  children?: Omit<MenuItem, "children">[];
}

const Sidebar: React.FC<SidebarProps> = ({ open, handleDrawerToggle }) => {
  const theme = useTheme();
  const [expandedItems, setExpandedItems] = useState<{
    [key: string]: boolean;
  }>({});

  const menuItems: MenuItem[] = [
    {
      title: "Dashboard",
      icon: <DashboardIcon />,
      path: "/dashboard",
    },
    {
      title: "Layouts",
      icon: <LayoutsIcon />,
      children: [
        { title: "Dashboard 2", path: "/dashboard-2" },
        { title: "Dashboard 3", path: "/dashboard-3" },
        { title: "Dashboard 4", path: "/dashboard-4" },
        { title: "Horizontal Menu", path: "/horizontal" },
        { title: "Two Menus", path: "/two-menus" },
        { title: "Landing Page 1", path: "/landing-1" },
        { title: "Landing Page 2", path: "/landing-2" },
        { title: "Coming Soon", path: "/coming-soon" },
      ],
    },
    {
      title: "UI Elements",
      icon: <UIElementsIcon />,
      children: [
        { title: "Buttons", path: "/buttons" },
        { title: "Button Groups", path: "/button-groups" },
        { title: "Alerts", path: "/alerts" },
        { title: "Modals", path: "/modals" },
        { title: "Asides", path: "/asides" },
        { title: "Tabs", path: "/tabs" },
        { title: "Accordions", path: "/accordions" },
        { title: "Tooltips & Popovers", path: "/tooltips" },
        { title: "Badges", path: "/badges" },
        { title: "Pagination", path: "/pagination" },
        { title: "Dropdowns", path: "/dropdowns" },
        { title: "Icons", path: "/icons" },
        { title: "Typography", path: "/typography" },
        { title: "Charts", path: "/charts" },
        { title: "Treeview", path: "/treeview" },
      ],
    },
    {
      title: "Tables",
      icon: <TablesIcon />,
      children: [
        { title: "Basic Tables", path: "/basic-tables" },
        { title: "DataTables", path: "/datatables" },
        { title: "Bootstrap Table", path: "/bootstrap-table" },
        { title: "jqGrid", path: "/jqgrid" },
      ],
    },
    {
      title: "Forms",
      icon: <FormsIcon />,
      children: [
        { title: "Basic Elements", path: "/form-basic" },
        { title: "More Elements", path: "/form-more" },
        { title: "Wizard & Validation", path: "/form-wizard" },
        { title: "File Upload", path: "/form-upload" },
        { title: "Wysiwyg & Markdown", path: "/form-wysiwyg" },
      ],
    },
    {
      title: "Cards",
      icon: <CardsIcon />,
      path: "/cards",
    },
    {
      title: "Calendar",
      icon: <CalendarIcon />,
      path: "/calendar",
    },
    {
      title: "Gallery",
      icon: <GalleryIcon />,
      path: "/gallery",
    },
    {
      title: "More Pages",
      icon: <MorePagesIcon />,
      children: [
        { title: "Profile", path: "/profile" },
        { title: "Login", path: "/login" },
        { title: "Pricing", path: "/pricing" },
        { title: "Invoice", path: "/invoice" },
        { title: "Inbox", path: "/inbox" },
        { title: "Search Results", path: "/search" },
        { title: "Error", path: "/error" },
        { title: "Starter", path: "/starter" },
      ],
    },
  ];

  const handleItemClick = (title: string) => {
    setExpandedItems((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  const renderMenuItem = (item: MenuItem, index: number) => {
    const isExpanded = expandedItems[item.title] || false;

    return (
      <React.Fragment key={index}>
        <ListItem disablePadding>
          <ListItemButton
            onClick={() =>
              item.children ? handleItemClick(item.title) : undefined
            }
            sx={{
              minHeight: 48,
              justifyContent: open ? "initial" : "center",
              px: 2.5,
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 0,
                mr: open ? 3 : "auto",
                justifyContent: "center",
              }}
            >
              {item.icon}
            </ListItemIcon>
            <ListItemText
              primary={item.title}
              sx={{
                opacity: open ? 1 : 0,
                marginLeft: open ? 0 : -8,
                transition: open
                  ? "opacity 0.3s 0.15s, margin 0.3s 0.15s"
                  : "opacity 0.15s, margin 0.15s",
                whiteSpace: "nowrap",
              }}
            />
            {item.children && (
              <Box
                sx={{
                  opacity: open ? 1 : 0,
                  transition: "opacity 0.3s",
                }}
              >
                {isExpanded ? <ExpandLess /> : <ExpandMore />}
              </Box>
            )}
          </ListItemButton>
        </ListItem>
        {item.children && (
          <Collapse in={isExpanded && open} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {item.children.map((child, childIndex) => (
                <ListItemButton
                  key={childIndex}
                  sx={{
                    minHeight: 48,
                    pl: 4,
                    justifyContent: open ? "initial" : "center",
                  }}
                >
                  <ListItemText
                    primary={child.title}
                    sx={{
                      opacity: open ? 1 : 0,
                      marginLeft: open ? 0 : -8,
                      transition: open
                        ? "opacity 0.3s 0.15s, margin 0.3s 0.15s"
                        : "opacity 0.15s, margin 0.15s",
                      whiteSpace: "nowrap",
                    }}
                  />
                </ListItemButton>
              ))}
            </List>
          </Collapse>
        )}
      </React.Fragment>
    );
  };

  return (
    <>
      <ToggleButton onClick={handleDrawerToggle}>
        <MenuIcon />
      </ToggleButton>
      {open && (
        <StyledDrawer
          variant="permanent"
          open={open}
          sx={{
            "& .MuiDrawer-paper": {
              backgroundColor: theme.palette.background.paper,
            },
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              alignItems: "center",
              height: "100vh",
              py: 2,
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 2,
                mt: 2,
              }}
            >
              <ColoredShortcutButton bgcolor={iconColors[0]}>
                <SignalIcon fontSize="inherit" />
              </ColoredShortcutButton>
              <ColoredShortcutButton bgcolor={iconColors[1]}>
                <EditIcon fontSize="inherit" />
              </ColoredShortcutButton>
              <ColoredShortcutButton bgcolor={iconColors[2]}>
                <PeopleIcon fontSize="inherit" />
              </ColoredShortcutButton>
              <ColoredShortcutButton bgcolor={iconColors[3]}>
                <SettingsIcon fontSize="inherit" />
              </ColoredShortcutButton>
            </Box>

            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 1,
                mb: 2,
              }}
            >
              <Avatar
                src="/assets/image/avatar/avatar3.jpg"
                sx={{
                  width: 36,
                  height: 36,
                }}
              />
              <IconButton size="small">
                <ExitToAppIcon fontSize="small" />
              </IconButton>
            </Box>
          </Box>
        </StyledDrawer>
      )}
    </>
  );
};

export default Sidebar;
