import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
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
  ConfirmationNumber as TicketIcon
} from "@mui/icons-material";
import { useAuth } from "../../contextApi/AuthContext";
import AllInboxIcon from '@mui/icons-material/AllInbox';

const SIDEBAR_WIDTH = 80;
const SIDEBAR_COLLAPSED_WIDTH = 0;

const StyledDrawer = styled(Drawer, {
  shouldForwardProp: (prop) => prop !== "open",
})<{ open?: boolean }>(({ theme, open }) => ({
  width: open ? SIDEBAR_WIDTH : SIDEBAR_COLLAPSED_WIDTH,
  transition: "width 150ms cubic-bezier(0.4,0,0.2,1) 0ms",
  overflowX: "hidden",
  position: "relative",
  top: 0,
  left: 0,
  height: "100vh",
  zIndex: 1200,
  "& .MuiDrawer-paper": {
    width: open ? SIDEBAR_WIDTH : SIDEBAR_COLLAPSED_WIDTH,
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
  "#2563eb", // blue
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
  const { signOut } = useAuth();
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
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
      title: "Ticket Management",
      icon: <TicketIcon />,
      path: "/tickets",
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

  const handleNavigation = (path: string) => {

    navigate(path);
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const renderMenuItem = (item: MenuItem, index: number) => {
    const isExpanded = expandedItems[item.title] || false;
    const active = item.path ? isActive(item.path) : false;

    return (
      <React.Fragment key={index}>
        <ListItem disablePadding>
          <ListItemButton
            onClick={() =>
              item.children
                ? handleItemClick(item.title)
                : item.path
                  ? handleNavigation(item.path)
                  : undefined
            }
            selected={active}
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
                color: active ? theme.palette.primary.main : "inherit",
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
                color: active ? theme.palette.primary.main : "inherit",
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
          alignItems: "center",
          height: "100vh",
          borderRight: "1px solid #e0e0e0",
          py: 2,
        }}
      >
        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 2,
          }}
        >
          {/* icon group */}
          <ColoredShortcutButton bgcolor={iconColors[0]}>
            <SignalIcon fontSize="inherit" />
          </ColoredShortcutButton>
          <ColoredShortcutButton
            bgcolor={iconColors[1]}
            onClick={() => handleNavigation("/tickets")}
          >
            <AllInboxIcon fontSize="inherit" />
          </ColoredShortcutButton>
          <ColoredShortcutButton
            bgcolor={iconColors[2]}
            onClick={() => handleNavigation("/create-user")}
          >
            <PeopleIcon fontSize="inherit" />
          </ColoredShortcutButton>
          <ColoredShortcutButton
            bgcolor={iconColors[3]}
            onClick={() => handleNavigation("/settings")}
          >
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
          <IconButton size="medium" onClick={signOut}>
            <ExitToAppIcon fontSize="medium" />
          </IconButton>
        </Box>
      </Box>
    </StyledDrawer>
  );
};

export default Sidebar;
