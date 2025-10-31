import React, { useState, useEffect } from "react";
import {
  Drawer,
  Dialog,
  Grow,
  Box,
  Typography,
  IconButton,
  Avatar,
  Divider,
  Button,
  FormControl,
  Select,
  MenuItem,
  Skeleton,
  Paper,
  Link,
} from "@mui/material";
import {
  Close as CloseIcon,
  Person as PersonIcon,
  Logout as LogoutIcon,
  StarOutline as StarIcon,
  FeedbackOutlined as FeedbackIcon,
  ForumOutlined as ForumIcon,
  HelpOutline as HelpIcon,
  SendOutlined as SendIcon,
  CreateOutlined as BlogIcon,
  ContentCopy as CopyIcon,
  HelpOutlineOutlined as QuestionIcon,
  ArrowForward as ArrowForwardIcon,
} from "@mui/icons-material";
import { useAuth } from "../../contextApi/AuthContext";
import { useStatus } from "../../contextApi/StatusContext";
import { useNavigate } from "react-router-dom";
import { useUpdateActiveStatusMutation } from "../../services/auth";
import { useToast } from "../../hooks/useToast";
import { useDispatch } from "react-redux";
import { setStartTime } from "../../reduxStore/Slices/setUpSlices";

const statusOptions = [
  { label: "Available", value: "available", color: "#4caf50" },
  { label: "Offline", value: "offline", color: "#9e9e9e" },
];

interface AccountPopupProps {
  open: boolean;
  onClose: () => void;
  anchorEl: HTMLElement | null;
  userData: any;
}

const AccountPopup: React.FC<AccountPopupProps> = ({
  open,
  onClose,
  anchorEl,
  userData,
}) => {
  const { signOut, user } = useAuth();
  const { currentStatus, setCurrentStatus } = useStatus();
  const navigate = useNavigate();
  const [updateActiveStatus, { isLoading: statusLoading }] =
    useUpdateActiveStatusMutation();
  const { showToast } = useToast();
  const dispatch = useDispatch();
  const [showSignOutConfirmation, setShowSignOutConfirmation] = useState(false);
  const [countdown, setCountdown] = useState(6);

  const handleCopyEmail = () => {
    if (userData?.email) {
      navigator.clipboard.writeText(userData.email);
      showToast("Email copied to clipboard", "success");
    }
  };

  const handleSignOut = () => {
    // Reset countdown
    setCountdown(6);
    // Open sign-out confirmation drawer
    setShowSignOutConfirmation(true);
    onClose(); // Close the account drawer
  };

  const performSignOut = () => {
    // Clear all local storage
    localStorage.clear();
    sessionStorage.clear();

    // Clear all cookies
    document.cookie.split(";").forEach((c) => {
      document.cookie = c
        .replace(/^ +/, "")
        .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });

    // Use the AuthContext signOut function
    signOut();

    // Navigate to login page
    navigate("/login");
  };

  const handleRedirectNow = () => {
    performSignOut();
  };

  // Countdown timer for auto-redirect
  useEffect(() => {
    if (showSignOutConfirmation && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (showSignOutConfirmation && countdown === 0) {
      performSignOut();
    }
  }, [showSignOutConfirmation, countdown]);

  const handleMyAccount = () => {
    navigate(`/staff-profile/${userData?.uID}`);
    onClose();
  };

  const handleChangeStatus = (value: string) => {
    const payload = {
      //@ts-ignore
      userId: user.uID,
      body: { status: value === "offline" ? "OFFLINE" : "ONLINE" },
    };
    updateActiveStatus(payload).then((res: any) => {
      if (res?.data?.type === "error") {
        showToast(res?.data?.message, "error");
        return;
      }
      if (res?.data?.type === "success") {
        setCurrentStatus(value);
        dispatch(setStartTime(res?.data?.data));
      }
    });
  };

  // Extract first name from username or full name
  const getFirstName = () => {
    const name = userData?.username || userData?.name || "";
    return name.split(" ")[0] || "User";
  };

  return (
    <>
      <Drawer
        anchor="right"
        open={open}
        onClose={onClose}
        sx={{
          "& .MuiDrawer-paper": {
            width: { xs: "100%", sm: "25%" },
            maxWidth: "100vw",
            overflowX: "hidden",
          },
        }}
      >
        <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>


          {/* User Profile Information Section */}
          <Box
            sx={{
              flex: 1,
              overflowY: "auto",
              overflowX: "hidden",
              p: 2,
            }}
          >
            <Box
              sx={{
                mt: 5,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                mb: 3,
              }}
            >
              <Avatar
                sx={{
                  width: 100,
                  height: 100,
                  backgroundColor: "#86efac",
                  color: "#000",
                  fontSize: "2.5rem",
                  fontWeight: 600,
                  mb: 2,
                }}
                src={userData?.image}
              >
                {userData?.username
                  ?.split(" ")
                  ?.map((n: any) => n[0])
                  ?.join("")
                  ?.toUpperCase() || "U"}
              </Avatar>

              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  color: "#000",
                  mb: 1,
                }}
              >
                {getFirstName()}
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  mb: 1,
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    color: "#666",
                  }}
                >
                  {userData?.email || "user@example.com"}
                </Typography>
                <IconButton
                  size="small"
                  onClick={handleCopyEmail}
                  sx={{
                    color: "#666",
                    p: 0.5,
                  }}
                >
                  <CopyIcon fontSize="small" />
                </IconButton>
              </Box>

              {/* Status Selector */}
              <FormControl size="small" sx={{ maxWidth: "75%", width: "100%" }}>
                {statusLoading ? (
                  <Skeleton
                    variant="rectangular"
                    width={150}
                    height={32}
                    sx={{ borderRadius: 1 }}
                  />
                ) : (
                  <Select
                    value={currentStatus}
                    onChange={(e) => handleChangeStatus(e.target.value)}
                    sx={{
                      fontSize: "0.875rem",
                      height: 36,
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#dadce0",
                      },
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#1976d2",
                      },
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#1976d2",
                      },
                      backgroundColor: "#fff",
                    }}
                    renderValue={(selected) => {
                      const option = statusOptions.find(
                        (opt) => opt.value === selected
                      );
                      return (
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <Box
                            sx={{
                              width: 8,
                              height: 8,
                              borderRadius: "50%",
                              backgroundColor: option?.color || "#4caf50",
                              flexShrink: 0,
                            }}
                          />
                          <Typography variant="body2" sx={{ fontSize: "0.875rem" }}>
                            {option?.label || "Available"}
                          </Typography>
                        </Box>
                      );
                    }}
                  >
                    {statusOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <Box
                            sx={{
                              width: 8,
                              height: 8,
                              borderRadius: "50%",
                              backgroundColor: option.color,
                              flexShrink: 0,
                            }}
                          />
                          {option.label}
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                )}
              </FormControl>
            </Box>

            <Divider sx={{ my: 2 }} />

            {/* Account Actions Section */}
            <Box
              sx={{
                mt: 5,
                mb: 5,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                }}
              >
                <Button
                  variant="outlined"
                  startIcon={<PersonIcon />}
                  onClick={handleMyAccount}
                  sx={{
                    flex: 1,
                    textTransform: "none",
                    borderColor: "#e0e0e0",
                    color: "#000",
                    "&:hover": {
                      borderColor: "#bdbdbd",
                      backgroundColor: "#f5f5f5",
                    },
                    py: 1.5,
                  }}
                >
                  My Account
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<LogoutIcon />}
                  onClick={handleSignOut}
                  sx={{
                    flex: 1,
                    textTransform: "none",
                    borderColor: "#d32f2f",
                    color: "#d32f2f",
                    "&:hover": {
                      borderColor: "#c62828",
                      backgroundColor: "#ffebee",
                    },
                    py: 1.5,
                  }}
                >
                  Sign Out
                </Button>
              </Box>
            </Box>

            <Divider sx={{ my: 2 }} />

            {/* Information and Help Links Section */}
            <Box
              sx={{
                mb: 3,
              }}
            >
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 2,
                }}
              >
                {/* Left Column */}
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      cursor: "pointer",
                      "&:hover": {
                        opacity: 0.7,
                      },
                    }}
                  >
                    <StarIcon sx={{ color: "#000", fontSize: 20 }} />
                    <Typography
                      variant="body2"
                      sx={{
                        color: "#000",
                        fontWeight: 400,
                      }}
                    >
                      What's new?
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      cursor: "pointer",
                      "&:hover": {
                        opacity: 0.7,
                      },
                    }}
                  >
                    <FeedbackIcon sx={{ color: "#000", fontSize: 20 }} />
                    <Typography
                      variant="body2"
                      sx={{
                        color: "#000",
                        fontWeight: 400,
                      }}
                    >
                      Feedback
                    </Typography>
                  </Box>
                </Box>

                {/* Right Column */}
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      cursor: "pointer",
                      "&:hover": {
                        opacity: 0.7,
                      },
                    }}
                  >
                    <HelpIcon sx={{ color: "#000", fontSize: 20 }} />
                    <Typography
                      variant="body2"
                      sx={{
                        color: "#000",
                        fontWeight: 400,
                      }}
                    >
                      Help
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      cursor: "pointer",
                      "&:hover": {
                        opacity: 0.7,
                      },
                    }}
                  >
                    <SendIcon sx={{ color: "#000", fontSize: 20 }} />
                    <Typography
                      variant="body2"
                      sx={{
                        color: "#000",
                        fontWeight: 400,
                      }}
                    >
                      Take a tour
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>

            <Divider sx={{ my: 2 }} />

            {/* Social Media Links Section */}
            <Box
              sx={{
                mb: 3,
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 600,
                  textAlign: "center",
                  color: "#000",
                  mb: 2,
                }}
              >
                Follow us for latest updates!
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  gap: 3,
                  justifyContent: "center",
                }}
              >
                {/* Twitter/X */}
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 0.5,
                    cursor: "pointer",
                    "&:hover": {
                      opacity: 0.7,
                    },
                  }}
                >
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: "50%",
                      border: "1px solid #000",
                    }}
                  >
                    <Typography
                      sx={{
                        color: "#000",
                        fontWeight: 600,
                        fontSize: "1rem",
                      }}
                    >
                      𝕏
                    </Typography>
                  </Box>
                  <Typography
                    variant="caption"
                    sx={{
                      color: "#000",
                      fontSize: "0.75rem",
                    }}
                  >
                    Twitter
                  </Typography>
                </Box>

                {/* LinkedIn */}
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 0.5,
                    cursor: "pointer",
                    "&:hover": {
                      opacity: 0.7,
                    },
                  }}
                >
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: "50%",
                      border: "1px solid #000",
                    }}
                  >
                    <Typography
                      sx={{
                        color: "#000",
                        fontWeight: 600,
                        fontSize: "0.875rem",
                      }}
                    >
                      in
                    </Typography>
                  </Box>
                  <Typography
                    variant="caption"
                    sx={{
                      color: "#000",
                      fontSize: "0.75rem",
                    }}
                  >
                    Linkedin
                  </Typography>
                </Box>

                {/* YouTube */}
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 0.5,
                    cursor: "pointer",
                    "&:hover": {
                      opacity: 0.7,
                    },
                  }}
                >
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: "50%",
                      border: "1px solid #000",
                    }}
                  >
                    <Box
                      sx={{
                        width: 0,
                        height: 0,
                        borderLeft: "10px solid #000",
                        borderTop: "7px solid transparent",
                        borderBottom: "7px solid transparent",
                        ml: 0.5,
                      }}
                    />
                  </Box>
                  <Typography
                    variant="caption"
                    sx={{
                      color: "#000",
                      fontSize: "0.75rem",
                    }}
                  >
                    Youtube
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </Drawer>

      {/* Sign Out Confirmation Dialog - Center with Zoom Effect */}
      <Dialog
        open={showSignOutConfirmation}
        onClose={() => { }} // Prevent closing by backdrop/ESC
        maxWidth="sm"
        fullWidth
        TransitionComponent={Grow}
        TransitionProps={{
          timeout: { enter: 300, exit: 200 },
          style: {
            transformOrigin: "center center",
          },
        }}
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
            overflow: "hidden",
            maxWidth: 500,
            m: 2,
          },
        }}
        BackdropProps={{
          sx: {
            backgroundColor: "rgba(245, 245, 245, 0.8)",
            backdropFilter: "blur(2px)",
          },
        }}
        sx={{
          "& .MuiDialog-container": {
            backgroundColor: "#f5f5f5",
          },
        }}
      >
        <Box
          sx={{
            position: "relative",
            backgroundColor: "transparent",
            minHeight: "400px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            p: 3,
          }}
        >
          {/* Decorative background circles */}
          <Box
            sx={{
              position: "absolute",
              top: 0,
              right: 0,
              width: "300px",
              height: "300px",
              borderRadius: "50%",
              background: "rgba(255, 255, 255, 0.3)",
              filter: "blur(40px)",
              zIndex: 0,
            }}
          />
          <Box
            sx={{
              position: "absolute",
              top: "10%",
              left: "10%",
              width: "200px",
              height: "200px",
              borderRadius: "50%",
              background: "rgba(255, 255, 255, 0.2)",
              filter: "blur(30px)",
              zIndex: 0,
            }}
          />

          {/* Main Content Card */}
          <Paper
            elevation={0}
            sx={{
              width: "100%",
              borderRadius: 3,
              overflow: "hidden",
              position: "relative",
              zIndex: 1,
              boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
            }}
          >
            {/* Top Decorative Section */}
            <Box
              sx={{
                height: 120,
                backgroundColor: "#fafafa",
                position: "relative",
                overflow: "hidden",
              }}
            >
              {/* Decorative circles in header */}
              <Box
                sx={{
                  position: "absolute",
                  top: -20,
                  right: 20,
                  width: "80px",
                  height: "80px",
                  borderRadius: "50%",
                  background: "rgba(0, 0, 0, 0.05)",
                  filter: "blur(20px)",
                }}
              />
              <Box
                sx={{
                  position: "absolute",
                  bottom: -30,
                  left: 30,
                  width: "100px",
                  height: "100px",
                  borderRadius: "50%",
                  background: "rgba(0, 0, 0, 0.03)",
                  filter: "blur(25px)",
                }}
              />
            </Box>

            {/* Content Section */}
            <Box
              sx={{
                p: 4,
                backgroundColor: "#fff",
              }}
            >
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 600,
                  color: "#000",
                  mb: 3,
                }}
              >
                Signed out
              </Typography>

              <Typography
                variant="body1"
                sx={{
                  color: "#666",
                  mb: 2,
                  lineHeight: 1.6,
                }}
              >
                You are being signed out from your account to ensure your security and prevent any unintended access from this browser.
              </Typography>

              <Typography
                variant="body1"
                sx={{
                  color: "#666",
                  mb: 4,
                }}
              >
                You will be redirected to the login page in{" "}
                <Typography
                  component="span"
                  sx={{
                    fontWeight: 600,
                    color: "#1976d2",
                  }}
                >
                  {countdown} sec
                </Typography>
                .
              </Typography>

              <Button
                variant="contained"
                endIcon={<ArrowForwardIcon />}
                onClick={handleRedirectNow}
                fullWidth
                sx={{
                  backgroundColor: "#e3f2fd",
                  color: "#1976d2",
                  textTransform: "none",
                  fontWeight: 500,
                  py: 1.5,
                  borderRadius: 2,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  "&:hover": {
                    backgroundColor: "#bbdefb",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                  },
                }}
              >
                Redirect Now
              </Button>
            </Box>
          </Paper>
        </Box>
      </Dialog>
    </>
  );
};

export default AccountPopup;
