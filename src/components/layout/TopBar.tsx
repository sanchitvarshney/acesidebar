import React, { useState, useRef, useEffect, use } from "react";
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
  HourglassEmpty as HourglassEmptyIcon,
  ExitToApp as ExitToAppIcon,
} from "@mui/icons-material";
import AddIcon from "@mui/icons-material/Add";
import AccountPopup from "../popup/AccountPopup";
import NotificationPopup from "../popup/NotificationPopup";
import TasksPopup from "../popup/TasksPopup";
import AdvancedSearchPopup from "../popup/AdvancedSearchPopup";
import { useNavigate } from "react-router-dom";
import SwitcherIcon from "../../assets/image/switcher.svg";
import { usePopupContext } from "../../contextApi/PopupContext";
import { useAuth } from "../../contextApi/AuthContext";
import { useStatus } from "../../contextApi/StatusContext";
import { useDispatch } from "react-redux";

const drawerWidth = 80;
const collapsedDrawerWidth = 0;

interface TopBarProps {
  open: boolean;
  handleDrawerToggle: () => void;
}
const statusOptions = [
  { label: "Available", value: "available", color: "#4caf50" },
  { label: "Offline", value: "offline", color: "#9e9e9e" },
];

const TopBar: React.FC<TopBarProps> = ({ open, handleDrawerToggle }) => {
  const { user, signOut } = useAuth();
  const { currentStatus } = useStatus();
  const userData: any = user;
  const theme = useTheme();
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
  const menuId = "primary-search-account-menu";
  return (
    <AppBar
      position="fixed"
      sx={{
        height: "60px",
        backgroundColor: "#fff",
        boxShadow: "1px 3px 6px rgb(227, 224, 224)",
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
      <Toolbar
        className="flex justify-between items-center"
        sx={{
          minHeight: "60px !important",
          height: "60px",
          alignItems: "center",
          display: "flex"
        }}
      >
        <div className="flex items-center ">
          {!open && (
            <Box sx={{ mr: 2, display: "flex", alignItems: "center" }}>
              <img
                src="https://ims.mscorpres.co.in/assets/images/mscorpres_auto_logo.png"
                alt="MS Corp"
                style={{
                  width: 48,
                  height: "auto", objectFit: "contain"
                }}
              />
            </Box>
          )}

          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, color: "#3f4346" }}
          >
            <MenuIcon
              sx={{
                transform: !open ? "rotate(0deg)" : "rotate(-90deg)",
                transition: "transform 0.3s ease-in-out",
              }}
            />
          </IconButton>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={() => navigate("/quick-action")}
            sx={{ mr: 2, color: "#3f4346" }}
          >
            <AddIcon />
          </IconButton>
        </div>
        {/* Expanding Search Bar */}
        <div className="flex items-center">
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
            <img
              src={SwitcherIcon}
              alt="Switcher"
              style={{ width: 15, height: 15 }}
            />
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
                sx={{
                  width: 30,
                  height: 30,
                  border: `3px solid ${statusOptions.find((opt) => opt.value === currentStatus)
                      ?.color || "#4caf50"
                    }`,
                  boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
                }}
              />
            ) : (
              <Avatar
                sizes="small"
                sx={{
                  backgroundColor: "primary.main",
                  width: 30,
                  height: 30,
                  border: `3px solid ${statusOptions.find((opt) => opt.value === currentStatus)
                      ?.color || "#4caf50"
                    }`,
                  boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
                }}
              >
                {userData?.username
                  ? userData?.username.charAt(0).toUpperCase()
                  : "T"}
              </Avatar>
            )}
          </IconButton>
        </Box>
      </Toolbar>

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
