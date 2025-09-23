import React, { useState, useEffect, useMemo } from "react";
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Avatar,
  CircularProgress,
} from "@mui/material";
import {
  Security as SecurityIcon,
  Computer as ComputerIcon,
  Smartphone as SmartphoneIcon,
  Tablet as TabletIcon,
  LocationOn as LocationIcon,
  AccessTime as TimeIcon,
  Public as PublicIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../hooks/useToast";
import { useGetSessionQuery } from "../../services/ticketAuth";

interface Session {
  id: string;
  userId: string;
  ipAddress: string;
  loginTime: string;
  lastActivity: string;
  deviceInfo: "Desktop" | "Mobile" | "Tablet" | string;
  userAgent: string;
  isCurrent: boolean;
  location?: string;
  browser?: string;
  os?: string;
}

const generateMockSessions = (): Session[] => {
  const now = new Date();
  const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
  const twoHoursAgo = new Date(now.getTime() - 2 * 60 * 60 * 1000);
  const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

  return [
    {
      id: "1",
      userId: "user123",
      ipAddress: "192.168.1.100",
      loginTime: oneHourAgo.toISOString(),
      lastActivity: now.toISOString(),
      deviceInfo: "Desktop",
      userAgent:
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36",
      isCurrent: false,
      location: "New York, NY",
    },
    {
      id: "2",
      userId: "user123",
      ipAddress: "192.168.1.101",
      loginTime: twoHoursAgo.toISOString(),
      lastActivity: oneHourAgo.toISOString(),
      deviceInfo: "Mobile",
      userAgent:
        "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
      isCurrent: false,
      location: "San Francisco, CA",
    },
    // {
    //   id: "3",
    //   userId: "user123",
    //   ipAddress: "10.0.0.50",
    //   loginTime: oneDayAgo.toISOString(),
    //   lastActivity: twoHoursAgo.toISOString(),
    //   deviceInfo: "Tablet",
    //   userAgent:
    //     "Mozilla/5.0 (iPad; CPU OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
    //   isCurrent: false,
    //   location: "Los Angeles, CA",
    // },
    // {
    //   id: "4",
    //   userId: "user123",
    //   ipAddress: "203.0.113.1",
    //   loginTime: new Date(now.getTime() - 3 * 60 * 60 * 1000).toISOString(),
    //   lastActivity: new Date(now.getTime() - 30 * 60 * 1000).toISOString(),
    //   deviceInfo: "Desktop",
    //   userAgent:
    //     "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36",
    //   isCurrent: false,
    //   location: "London, UK",
    // },
  ];
};

const SessionManagementPage: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
const { data: sessionData } = useGetSessionQuery({});
console.log("sessionData:", sessionData);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [sessionToDelete, setSessionToDelete] = useState<string | null>(null);
  const [deleteAllDialogOpen, setDeleteAllDialogOpen] = useState(false);
  const [deletingSessionId, setDeletingSessionId] = useState<string | null>(
    null
  );
  const [sessions, setSessions] = useState<Session[]>([]);
  const [isDeletingSession, setIsDeletingSession] = useState(false);
  const [isDeletingAll, setIsDeletingAll] = useState(false);
  const [lastClosedWasDesktop, setLastClosedWasDesktop] = useState(false);

  // Dynamic limits (can be updated from API/localStorage). Defaults provided.
  const [maxDesktopSessions, setMaxDesktopSessions] = useState<number>(() => {
    const v = localStorage.getItem("maxDesktopSessions");
    return v ? Number(v) : 1;
  });
  const [maxMobileSessions, setMaxMobileSessions] = useState<number>(() => {
    const v = localStorage.getItem("maxMobileSessions");
    return v ? Number(v) : 1;
  });

  // Load mock sessions on component mount
  useEffect(() => {
    setSessions(generateMockSessions());
  }, []);

  const handleDeleteSession = (sessionId: string) => {
    setSessionToDelete(sessionId);
    handleConfirmDelete(sessionId);
  };

  const handleConfirmDelete = async (id?: string) => {
    const targetId = id ?? sessionToDelete;
    if (!targetId) return;

    try {
      setDeletingSessionId(targetId);
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      let closedWasDesktop = false;
      setSessions((prev) => {
        const toRemove = prev.find((s) => s.id === targetId);
        closedWasDesktop = toRemove?.deviceInfo === "Desktop";
        return prev.filter((session) => session.id !== targetId);
      });
      setLastClosedWasDesktop(closedWasDesktop);
      showToast("Session ended successfully", "success");
      setDeleteDialogOpen(false);
      setSessionToDelete(null);
    } catch (error: any) {
      showToast("Failed to end session. Please try again.", "error");
    } finally {
      setDeletingSessionId(null);
    }
  };

  const handleDeleteAllOther = () => {
    setDeleteAllDialogOpen(true);
  };

  const handleConfirmDeleteAll = async () => {
    try {
      setIsDeletingAll(true);
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setSessions([]);
      showToast("All sessions ended successfully", "success");
      setDeleteAllDialogOpen(false);
    } catch (error: any) {
      showToast("Failed to end sessions. Please try again.", "error");
    } finally {
      setIsDeletingAll(false);
    }
  };

  const handleContinueToDashboard = () => {
    // navigate("/");
  };

  const sessionBeingDeleted = sessions.find((s) => s.id === sessionToDelete);

  // Derived counts and button visibility rules
  const desktopCount = useMemo(
    () => sessions.filter((s) => s.deviceInfo === "Desktop").length,
    [sessions]
  );
  const mobileCount = useMemo(
    () => sessions.filter((s) => s.deviceInfo === "Mobile").length,
    [sessions]
  );
  const hasActiveDesktop = desktopCount > 0;
  const canContinueToDesktop = !hasActiveDesktop; // show only when no desktop session is active

  return (
    <Box className="w-full h-screen bg-gray-50 flex flex-col">
      {/* Fixed Header */}
      <div className="flex items-center justify-between h-16 px-6 sticky top-0 z-20 bg-white border-b">
        {/* Left side - empty for balance */}
        <div>
          <SecurityIcon />
        </div>

        {/* Right side - Back and Logout buttons */}
        <div className="flex gap-3 items-center">
          <Button
            variant="outlined"
            size="small"
            onClick={() => {
              localStorage.clear();
              navigate("/login");
            }}
            color="error"
          >
            Logout
          </Button>
          <Avatar alt="User" src="" sx={{ width: 26, height: 26 }} />
          <Typography variant="subtitle1" sx={{ fontSize: "14px" }}>
            test
          </Typography>
        </div>
      </div>

      {/* Main Content (scrolls between fixed header/footer) */}
      <Box className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-24">
          {/* Alert */}
          <Box className="mb-8">
            {desktopCount === 0 && mobileCount === 0 ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <SecurityIcon className="h-5 w-5 text-green-400" />
                  </div>
                  <div className="ml-3">
                    <Typography
                      variant="h6"
                      className="text-green-800 font-medium mb-1"
                    >
                      All Good!
                    </Typography>
                    <Typography variant="body2" className="text-green-700">
                      No active sessions. You can now continue to the dashboard.
                    </Typography>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <SecurityIcon className="h-5 w-5 text-blue-400" />
                  </div>
                  <div className="ml-3">
                    <Typography
                      variant="h6"
                      className="text-blue-800 font-medium mb-1"
                    >
                      Session Status
                    </Typography>
                    <Typography variant="body2" className="text-blue-700">
                      Desktop: {desktopCount}/{maxDesktopSessions} • Mobile:{" "}
                      {mobileCount}/{maxMobileSessions}
                    </Typography>
                    {(desktopCount >= maxDesktopSessions ||
                      mobileCount >= maxMobileSessions) && (
                      <Typography
                        variant="body2"
                        className="text-blue-700 mt-1"
                      >
                        You have reached the limit on one or more device types.
                        End a session to continue.
                      </Typography>
                    )}
                  </div>
                </div>
              </div>
            )}
          </Box>

          {/* Sessions Section - Only show if there are sessions */}
          {sessions.length > 0 && (
            <Box className="rounded-lg shadow-sm border bg-white">
              <div className="px-6 py-2 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <Typography
                      variant="h6"
                      className="text-gray-900 font-medium"
                    >
                      Active Sessions
                    </Typography>
                    <Typography variant="body2" className="text-gray-500">
                      {sessions.length} session
                      {sessions.length !== 1 ? "s" : ""} currently active
                    </Typography>
                  </div>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={handleDeleteAllOther}
                    disabled={isDeletingAll}
                    className="text-red-600 border-red-300 hover:bg-red-50"
                  >
                    {isDeletingAll ? (
                      <CircularProgress size={20} />
                    ) : (
                      "End All Sessions"
                    )}
                  </Button>
                </div>
              </div>

              {/* List */}
              <div className="p-6">
                <div className="space-y-4 pr-2">
                  {sessions.map((session) => (
                    <div
                      key={session.id}
                      className="bg-gray-50 border border-gray-200 rounded-lg p-4"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center">
                            {session.deviceInfo === "Mobile" ? (
                              <SmartphoneIcon className="text-gray-600 text-sm" />
                            ) : session.deviceInfo === "Tablet" ? (
                              <TabletIcon className="text-gray-600 text-sm" />
                            ) : (
                              <ComputerIcon className="text-gray-600 text-sm" />
                            )}
                          </div>
                          <div>
                            <Typography
                              variant="body2"
                              className="text-gray-500 text-sm"
                            >
                              Last activity
                            </Typography>
                            <Typography
                              variant="body2"
                              className="text-gray-900 font-medium"
                            >
                              {new Date(
                                session.lastActivity
                              ).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                                hour: "numeric",
                                minute: "2-digit",
                                hour12: true,
                              })}
                            </Typography>
                            <Typography
                              variant="caption"
                              className="text-gray-500"
                            >
                              {session.ipAddress} • {session.location}
                            </Typography>
                          </div>
                        </div>
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => handleDeleteSession(session.id)}
                          disabled={deletingSessionId === session.id}
                          className="text-red-600 border-red-300 hover:bg-red-50"
                        >
                          {deletingSessionId === session.id
                            ? <CircularProgress size={20} />
                            : "End session"}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Box>
          )}

          {/* Action Button - Show only when no desktop sessions are active */}
          {canContinueToDesktop && (
            <Box className="mt-8 text-center">
              <Button
                variant="contained"
                size="large"
                onClick={handleContinueToDashboard}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium"
              >
                Continue to Desktop
              </Button>
            </Box>
          )}

          {/* Spacer so list doesn't hide behind footer on short screens */}
          <div className="h-4" />
        </div>
      </Box>

      {/* Fixed Footer Help Text */}
      <Box className="sticky bottom-0 z-20 bg-gray-50 border-t">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-3 text-center">
          <Typography variant="body2" className="text-gray-500">
            Need help? Contact support at{" "}
            <a
              href="mailto:support@example.com"
              className="text-blue-600 hover:underline font-medium"
            >
              support@example.com
            </a>
          </Typography>
        </div>
      </Box>

      {/* Delete All Other Sessions Dialog */}
      <Dialog
        open={deleteAllDialogOpen}
        onClose={() => setDeleteAllDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: "12px",
            boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
          },
        }}
      >
        <DialogTitle className="text-center py-6">
          <Typography variant="h6" className="font-semibold text-gray-900">
            End All Other Sessions
          </Typography>
        </DialogTitle>
        <DialogContent className="text-center py-2">
          <Typography variant="body1" className="text-gray-600">
            Are you sure you want to end all other sessions? Users will be
            logged out from all other devices except this one.
          </Typography>
        </DialogContent>
        <DialogActions className="justify-center gap-3 p-6">
          <Button
            onClick={() => setDeleteAllDialogOpen(false)}
            className="px-6 py-2 text-gray-600 hover:bg-gray-50 rounded-lg"
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmDeleteAll}
            disabled={isDeletingAll}
            className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"
          >
            {isDeletingAll ? "Ending..." : "End All Sessions"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SessionManagementPage;
