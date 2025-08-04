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
  HourglassEmpty as HourglassEmptyIcon,
} from "@mui/icons-material";

import NotificationDropDown from "../notificationmodal/NotificationDropDown";
import CustomPopover from "../../reusable/CustomPopover";
import AccountPopup from "../popup/AccountPopup";
import NotificationPopup from "../popup/NotificationPopup";
import TasksPopup from "../popup/TasksPopup";
import { useNavigate } from "react-router-dom";
import SearchDropdownPanel from "../common/SearchDropdownPanel";
import { useTicketSearchMutation } from "../../services/ticketAuth";
import DarkModeIcon from '@mui/icons-material/DarkMode';
import Brightness7Icon from '@mui/icons-material/Brightness7';

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
  const [accountPopupOpen, setAccountPopupOpen] = useState(false);
  const [tasksPopupOpen, setTasksPopupOpen] = useState(false);
  const notificationRef = React.useRef(null);
  const accountButtonRef = React.useRef<HTMLButtonElement>(null);
  const tasksButtonRef = React.useRef<HTMLButtonElement>(null);
  const navigate = useNavigate();

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleAccountButtonClick = () => {
    setAccountPopupOpen(!accountPopupOpen);
    // Close other popups if account popup is being opened
    if (!accountPopupOpen) {
      setNotificationOpen(false);
      setTasksPopupOpen(false);
    }
  };

  const handleAccountPopupClose = () => {
    setAccountPopupOpen(false);
  };

  const handleNotificationButtonClick = () => {
    setNotificationOpen(!notificationOpen);
    // Close other popups if notification popup is being opened
    if (!notificationOpen) {
      setAccountPopupOpen(false);
      setTasksPopupOpen(false);
    }
  };

  const handleNotificationPopupClose = () => {
    setNotificationOpen(false);
  };

  const handleTasksButtonClick = () => {
    setTasksPopupOpen(!tasksPopupOpen);
    // Close other popups if tasks popup is being opened
    if (!tasksPopupOpen) {
      setAccountPopupOpen(false);
      setNotificationOpen(false);
    }
  };

  const handleTasksPopupClose = () => {
    setTasksPopupOpen(false);
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
  const [searchQuery, setSearchQuery] = useState("");
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

  // Ticket search mutation
  const [
    ticketSearch,
    { data: searchResult, isLoading: isSearching, reset: resetSearch },
  ] = useTicketSearchMutation();

  // Debounced search effect
  useEffect(() => {
    if (searchQuery.trim().length >= 3) {
      const handler = setTimeout(() => {
        ticketSearch(searchQuery.trim());
        if (!recentSearched.includes(searchQuery.trim())) {
          setRecentSearched(
            [searchQuery.trim(), ...recentSearched].slice(0, 5)
          );
        }
      }, 400);
      return () => clearTimeout(handler);
    } else {
      resetSearch && resetSearch();
    }
    // eslint-disable-next-line
  }, [searchQuery]);

  // Clear search result if input is cleared (keep this for safety)
  useEffect(() => {
    if (!searchQuery) {
      resetSearch && resetSearch();
    }
  }, [searchQuery, resetSearch]);

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
          backgroundColor: "#fff",
          sm: `calc(100% - ${open ? drawerWidth : collapsedDrawerWidth}px)`,
        },
        ml: { sm: `${open ? drawerWidth : collapsedDrawerWidth}px` },
        transition: theme.transitions.create(["margin", "width"], {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
      }}
    >
      <Toolbar className="flex justify-between">
        <div className="flex items-center">
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, color: "#3f4346" }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ display: { xs: "block", sm: "block" }, color: "#3f4346" }}
          >
            Ticket Management System
          </Typography>
        </div>
        {/* Expanding Search Bar */}
        <div>
          <div
            ref={dropdownRef}
            className={` transition-all duration-200 ml-30 ${
              searchExpanded ? "w-[500px]" : "w-[380px]"
            } relative`}
          >
            <div className="flex items-center w-full bg-[#f5f5f5] border border-gray-300 rounded-full px-4 py-2 shadow-sm transition-shadow focus-within:shadow-[0_1px_6px_rgba(32,33,36,0.28)] hover:shadow-[0_1px_6px_rgba(32,33,36,0.28)] ">
              <SearchIcon className="text-gray-500 mr-3" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search…"
                className="flex-1 bg-transparent outline-none text-gray-800 text-[15px] leading-tight placeholder-gray-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
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
                isSearching={isSearching}
                searchResult={searchResult}
                searchQuery={searchQuery}
              />
            )}
          </div>
        </div>

        <Box sx={{ flexGrow: 0 }} />

        <Box sx={{ display: "flex", alignItems: "center" }}>
          <IconButton
            size="large"
            sx={{color: "#3f4346"  , mr: 2}}
          >
            <DarkModeIcon />
          </IconButton>
          
          <IconButton
            ref={notificationRef}
            onClick={handleNotificationButtonClick}
            size="large"
            aria-label="show notifications"
            sx={{color: "#3f4346" , mr: 2}}
          >
            <Badge badgeContent={17} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>

          <IconButton
            ref={tasksButtonRef}
            onClick={handleTasksButtonClick}
            size="large"
            aria-label="show tasks"
            sx={{color: "#3f4346" , mr: 2}}
          >
            <HourglassEmptyIcon />
          </IconButton>

          <IconButton
            ref={accountButtonRef}
            size="large"
            edge="end"
            aria-label="account of current user"
            aria-controls={menuId}
            aria-haspopup="true"
            onClick={handleAccountButtonClick}
            sx={{color: "#3f4346" , mr: 2}}
          >
            <AccountCircle />
          </IconButton>
        </Box>
      </Toolbar>
      {renderMenu}
      
      {/* Notification Popup */}
      <NotificationPopup
        open={notificationOpen}
        onClose={handleNotificationPopupClose}
        anchorEl={notificationRef.current}
      />
      
      {/* Account Popup */}
      <AccountPopup
        open={accountPopupOpen}
        onClose={handleAccountPopupClose}
        anchorEl={accountButtonRef.current}
      />
      
      {/* Tasks Popup */}
      <TasksPopup
        open={tasksPopupOpen}
        onClose={handleTasksPopupClose}
        anchorEl={tasksButtonRef.current}
      />
    </AppBar>
  );
};

export default TopBar;
