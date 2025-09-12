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
  Avatar,
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
  ArrowDropDown as ArrowDropDownIcon,
} from "@mui/icons-material";

import NotificationDropDown from "../notificationmodal/NotificationDropDown";
import CustomPopover from "../../reusable/CustomPopover";
import AccountPopup from "../popup/AccountPopup";
import NotificationPopup from "../popup/NotificationPopup";
import TasksPopup from "../popup/TasksPopup";
import AdvancedSearchPopup from "../popup/AdvancedSearchPopup";
import { useNavigate } from "react-router-dom";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import { usePopupContext } from "../../contextApi/PopupContext";
import { useAuth } from "../../contextApi/AuthContext";

const drawerWidth = 80;
const collapsedDrawerWidth = 0;

interface TopBarProps {
  open: boolean;
  handleDrawerToggle: () => void;
}

const TopBar: React.FC<TopBarProps> = ({ open, handleDrawerToggle }) => {
  const { user } = useAuth();
  const userData: any = user;
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const isMenuOpen = Boolean(anchorEl);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [accountPopupOpen, setAccountPopupOpen] = useState(false);
  const [tasksPopupOpen, setTasksPopupOpen] = useState(false);
  const [advancedSearchOpen, setAdvancedSearchOpen] = useState(false);
  const notificationRef = React.useRef(null);
  const accountButtonRef = React.useRef<HTMLButtonElement>(null);
  const tasksButtonRef = React.useRef<HTMLButtonElement>(null);
  const advancedSearchRef = React.useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { setIsAnyPopupOpen } = usePopupContext();

  // Update global popup state whenever any popup state changes
  useEffect(() => {
    const isAnyOpen =
      notificationOpen ||
      accountPopupOpen ||
      tasksPopupOpen ||
      advancedSearchOpen;
    setIsAnyPopupOpen(isAnyOpen);
  }, [
    notificationOpen,
    accountPopupOpen,
    tasksPopupOpen,
    advancedSearchOpen,
    setIsAnyPopupOpen,
  ]);

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
      setAdvancedSearchOpen(false);
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
      setAdvancedSearchOpen(false);
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
      setAdvancedSearchOpen(false);
    }
  };

  const handleTasksPopupClose = () => {
    setTasksPopupOpen(false);
  };

  const handleAdvancedSearchClick = () => {
    setAdvancedSearchOpen(!advancedSearchOpen);
    // Close other popups if advanced search popup is being opened
    if (!advancedSearchOpen) {
      setAccountPopupOpen(false);
      setNotificationOpen(false);
      setTasksPopupOpen(false);
    }
  };

  const handleAdvancedSearchClose = () => {
    setAdvancedSearchOpen(false);
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
          {/* <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ display: { xs: "block", sm: "block" }, color: "#3f4346" }}
          >
            Ticket Management System
          </Typography> */}
        </div>
        {/* Expanding Search Bar */}
        <div>
          <div className={` transition-all duration-200  w-[340px] relative`}>
            <div
              ref={advancedSearchRef}
              className="flex items-center w-full bg-white border border-gray-300 rounded-full px-4 py-2 shadow-sm transition-shadow focus-within:shadow-[0_1px_6px_rgba(32,33,36,0.28)] hover:shadow-[0_1px_6px_rgba(32,33,36,0.28)] "
            >
              <SearchIcon className="text-gray-500 mr-3" />
              <input
                type="text"
                placeholder="Search…"
                className="flex-1 bg-transparent outline-none text-gray-800 text-[15px] leading-tight placeholder-gray-500"
                onFocus={handleAdvancedSearchClick}
              />
            </div>
          </div>
        </div>

        <Box sx={{ display: "flex", alignItems: "center" }}>
          <IconButton size="large" sx={{ color: "#3f4346", mr: 2 }}>
            <DarkModeIcon />
          </IconButton>

          <IconButton
            ref={notificationRef}
            onClick={handleNotificationButtonClick}
            size="large"
            aria-label="show notifications"
            sx={{ color: "#3f4346", mr: 2 }}
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
            sx={{ color: "#3f4346", mr: 2 }}
          >
            <HourglassEmptyIcon />
          </IconButton>

          <IconButton
            ref={accountButtonRef}
            size="small"
            edge="end"
            aria-label="account of current user"
            aria-controls={menuId}
            aria-haspopup="true"
            onClick={handleAccountButtonClick}
            sx={{ color: "#3f4346", mr: 2 }}
          >
            {userData?.image ? (
              <Avatar
                sizes="small"
                alt={userData?.username}
                src={userData?.image}
              />
            ) : (
              <Avatar
                sizes="small"
                sx={{ backgroundColor: "primary.main", width: 30, height: 30 }}
              >
                {userData?.username
                  ? userData?.username.charAt(0).toUpperCase()
                  : "T"}
              </Avatar>
            )}
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
        userData={userData}
      />

      {/* Tasks Popup */}
      <TasksPopup
        open={tasksPopupOpen}
        onClose={handleTasksPopupClose}
        anchorEl={tasksButtonRef.current}
      />

      {/* Advanced Search Popup */}
      <AdvancedSearchPopup
        open={advancedSearchOpen}
        onClose={handleAdvancedSearchClose}
        anchorEl={advancedSearchRef.current}
      />
    </AppBar>
  );
};

export default TopBar;
