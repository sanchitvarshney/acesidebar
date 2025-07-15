import React, { useState, useRef, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Badge,
  Menu,
  MenuItem,
  Box,
  useTheme,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Search as SearchIcon,
  Notifications as NotificationsIcon,
  AccountCircle,
  Settings,
  Help,
  ExitToApp,
} from "@mui/icons-material";

import NotificationDropDown from "../notificationmodal/NotificationDropDown";
import CustomPopover from "../../reusable/CustomPopover";
import { useNavigate } from "react-router-dom";
import SearchDropdownPanel from "../common/SearchDropdownPanel";

const drawerWidth = 80;
const collapsedDrawerWidth = 0;

interface TopBarProps {
  open: boolean;
  handleDrawerToggle: () => void;
}

const TopBar: React.FC<TopBarProps> = ({ open, handleDrawerToggle }) => {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const isMenuOpen = Boolean(anchorEl);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const notificationRef = React.useRef(null);
  const navigate = useNavigate();
  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const menuId = "primary-search-account-menu";
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleMenuClose}>
        <AccountCircle fontSize="small" sx={{ mr: 1 }} />
        <Typography variant="body2" onClick={() => navigate("/profile")}>
          My Profile
        </Typography>
      </MenuItem>
      <MenuItem onClick={handleMenuClose}>
        <Settings fontSize="small" sx={{ mr: 1 }} />
        <Typography variant="body2">Settings</Typography>
      </MenuItem>
      <MenuItem onClick={handleMenuClose}>
        <Help fontSize="small" sx={{ mr: 1 }} />
        <Typography variant="body2">Help</Typography>
      </MenuItem>
      <MenuItem onClick={handleMenuClose}>
        <ExitToApp fontSize="small" sx={{ mr: 1 }} />
        <Typography variant="body2" onClick={() => handleLogout()}>
          Logout
        </Typography>
      </MenuItem>
    </Menu>
  );

  const [searchExpanded, setSearchExpanded] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [recentSearched, setRecentSearched] = useState<string[]>([
    "12",
    "test",
  ]);
  const [recentViewed, setRecentViewed] = useState([
    { title: "Testing 2", id: 6 },
    { title: "Testing Email", id: 5 },
    { title: "TEST MAIL", id: 4 },
    { title: "Issues with reports", id: 3 },
    { title: "Authentication failure", id: 2 },
  ]);

  // Collapse search bar when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        searchInputRef.current &&
        !searchInputRef.current.contains(event.target as Node) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setSearchExpanded(false);
      }
    }
    if (searchExpanded) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [searchExpanded]);

  return (
    <AppBar
      position="fixed"
      sx={{
        width: {
          sm: `calc(100% - ${open ? drawerWidth : collapsedDrawerWidth}px)`,
        },
        ml: { sm: `${open ? drawerWidth : collapsedDrawerWidth}px` },
        transition: theme.transitions.create(["margin", "width"], {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
      }}
    >
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={handleDrawerToggle}
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButton>
        <Typography
          variant="h6"
          noWrap
          component="div"
          sx={{ display: { xs: "block", sm: "block" } }}
        >
          Application
        </Typography>
        {/* Expanding Search Bar */}
        <div
          ref={dropdownRef}
          className={`transition-all duration-200 ml-4 ${
            searchExpanded ? "w-[480px]" : "w-[240px]"
          } relative`}
        >
          <div className="flex items-center w-full bg-white border border-gray-300 rounded px-2 py-1 shadow-sm">
            <SearchIcon className="text-gray-400 mr-2" />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search…"
              className="flex-1 bg-transparent outline-none text-gray-800 text-base"
              onFocus={() => setSearchExpanded(true)}
              onClick={() => setSearchExpanded(true)}
            />
          </div>
          {/* Dropdown panel */}
          {searchExpanded && (
            <SearchDropdownPanel
              recentSearched={recentSearched}
              setRecentSearched={setRecentSearched}
              recentViewed={recentViewed}
              setRecentViewed={setRecentViewed}
            />
          )}
        </div>
        <Box sx={{ flexGrow: 1 }} />
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <IconButton
            onClick={() => setNotificationOpen(true)}
            size="large"
            aria-label="show 17 new notifications"
            color="inherit"
          >
            <Badge badgeContent={17} color="error">
              <NotificationsIcon ref={notificationRef} />
            </Badge>
          </IconButton>

          <IconButton
            size="large"
            edge="end"
            aria-label="account of current user"
            aria-controls={menuId}
            aria-haspopup="true"
            onClick={handleProfileMenuOpen}
            color="inherit"
          >
            <AccountCircle />
          </IconButton>
        </Box>
      </Toolbar>
      {renderMenu}
      {notificationOpen && (
        <CustomPopover
          open={notificationOpen}
          close={() => setNotificationOpen(false)}
          //@ts-ignore
          anchorEl={notificationRef}
          width={400}
          height={360}
          isCone={true}
        >
          <NotificationDropDown />
        </CustomPopover>
      )}
    </AppBar>
  );
};

export default TopBar;
