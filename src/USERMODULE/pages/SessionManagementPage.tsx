import React, { useState, useEffect, useMemo } from "react";
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Link,
  Avatar,
} from "@mui/material";
import {
  Computer as ComputerIcon,
  Smartphone as SmartphoneIcon,
  Tablet as TabletIcon,
  People as PeopleIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import {
  useDeleteSessionMutation,
  useGetSessionQuery,
  useTriggerLogOutMutation,
  useTriggerRegenrateMutation,
} from "../../services/ticketAuth";
import { useAuth } from "../../contextApi/AuthContext";
import SessionManagementSkeleton from "../skeleton/SessionManagementSkeleton";
import check from "../../assets/icons/check.png";
import { decrypt } from "../../utils/encryption";
const SessionManagementPage: React.FC = () => {
  const { user, signIn } = useAuth();
  const userData: any = user;

  const navigate = useNavigate();
  const {
    data: sessionData,
    isLoading: isLoadingSession,
    error,
  } = useGetSessionQuery({});

  const [sessionToDelete, setSessionToDelete] = useState<string | null>(null);

  const [deletingSessionId, setDeletingSessionId] = useState<string | null>(
    null
  );
  const [sessions, setSessions] = useState<any[]>([]);
  const [endAllSessions, setEndAllSessions] = useState(false);
  const [endSessions, setEndSessions] = useState(false);
  const [triggerLogOut, { isLoading: isLoadingLogOut }] =
    useTriggerLogOutMutation();

  const [deleteSession] = useDeleteSessionMutation();

  // Dynamic limits (can be updated from API/localStorage). Defaults provided.
  const [maxDesktopSessions, setMaxDesktopSessions] = useState<number>(() => {
    const v = localStorage.getItem("maxDesktopSessions");
    return v ? Number(v) : 1;
  });
  const [maxMobileSessions, setMaxMobileSessions] = useState<number>(() => {
    const v = localStorage.getItem("maxMobileSessions");
    return v ? Number(v) : 1;
  });
  const [triggerRegenrate, { isLoading: isLoadingRegenrate }] =
    useTriggerRegenrateMutation();
  // Load mock sessions on component mount
  useEffect(() => {
    setSessions(sessionData?.data ?? []);
  }, [sessionData]);

  const handleDeleteSession = (sessionId: string) => {
    setEndSessions(true);
    setSessionToDelete(sessionId);
    handleConfirmDelete(sessionId);
  };

  const handleConfirmDelete = async (id?: string) => {
    const targetId = id ?? sessionToDelete;
    if (!targetId) return;

    setDeletingSessionId(targetId);

    deleteSession({ session: [targetId] })
      .unwrap()
      .then((res) => {
        if (res?.type === "error") {
          setEndSessions(false);
          return;
        }
        if (res?.type === "success" && res?.success) {
          setSessions((prev) =>
            prev.filter((session) => session.sessionId !== targetId)
          );
          setSessionToDelete(null);
          setEndSessions(false);
        }
      })
      .catch(() => {
        setEndSessions(false);
        handleLogOut();
      })
      .finally(() => {
        setEndSessions(false);
        setDeletingSessionId(null);
      });
  };

  const handleConfirmDeleteAll = async () => {
    setEndAllSessions(true);
    const ids = sessions.map((session) => session.sessionId);
    try {
      deleteSession({ session: [ids] })
        .unwrap()
        .then((res) => {
          if (res?.type === "error") {
            setEndAllSessions(false);
            return;
          }
          if (res?.type === "success" && res?.success) {
            setSessions([]);
            setEndAllSessions(false);
          }
        })
        .catch(() => {
          setEndAllSessions(false);
          handleLogOut();
        });
    } catch (error: any) {
      setEndAllSessions(false);
    }
  };

  const handleContinueToDashboard = () => {
    triggerRegenrate({})
      .then((res: any) => {
        if (res?.data?.success && res?.data?.type === "session_regenerated") {
          localStorage.setItem("userToken", res?.data?.data?.token);
          const decryptedData = JSON.stringify(decrypt(res?.data?.data?.user));
          localStorage.setItem("userData", decryptedData);
          signIn();
          navigate("/");
        }
      })
      .catch(() => {
        handleLogOut();
      });
  };

  // Derived counts and button visibility rules
  const desktopCount = useMemo(
    () => sessions?.filter((s: any) => s.device === "WEB").length,
    [sessions]
  );
  const mobileCount = useMemo(
    () => sessions?.filter((s: any) => s.device === "APP").length,
    [sessions]
  );
  const hasActiveDesktop = desktopCount > 0;
  const canContinueToDesktop = !hasActiveDesktop; // show only when no desktop session is active
  const totalSessionLimit = maxDesktopSessions + maxMobileSessions || 3;
  const handleLogOut = () => {
    triggerLogOut({})
      .unwrap()
      .then((res) => {
        if (res?.type === "error") {
          localStorage.clear();
          navigate("/login");
          return;
        }
        if (res?.type === "success" && res?.success) {
          localStorage.clear();
          navigate("/login");
        }
      })
      .catch(() => {
        localStorage.clear();
        navigate("/login");
      });
  };

  // Format date like "Aug 22, 2025 at 1:14pm IST"
  const formatLastActivity = (dateString: string) => {
    const date = new Date(dateString);
    const formatted = date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
    const time = date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
    return `${formatted} at ${time} IST`;
  };

  return (
    <Box className="w-full min-h-screen bg-white flex flex-col">
      {/* Top Right - Logout and User Name */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          px: 5,
          height: "50px",
          gap: 2,
        }}
      >
        <Button
          variant="outlined"
          size="small"
          onClick={handleLogOut}
          color="error"
          sx={{ mr: 1, fontWeight: 600 }}
        >
          {isLoadingLogOut ? (
            <CircularProgress size={16} color="error" />
          ) : (
            "Logout"
          )}
        </Button>
        <Avatar
          alt="User"
          sx={{ width: 26, height: 26, backgroundColor: "#2567B3" }}
        >
          {userData?.name?.charAt(0)}
        </Avatar>
        <Typography
          variant="subtitle1"
          sx={{ fontSize: "14px", userSelect: "none" }}
        >
          {userData?.name}
        </Typography>
      </Box>

      {/* Main Content - Centered */}
      <Box className="flex-1 flex flex-col items-center justify-center px-4 py-12 max-w-2xl mx-auto w-full">
        {isLoadingSession ? (
          <SessionManagementSkeleton />
        ) : (
          <>
            {/* Brand Logo/Name */}
            <Box className="flex items-center gap-2 mb-8">
              {/* Three ascending bars icon */}
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 0.5,
                }}
              >
                <Box
                  sx={{
                    width: "20px",
                    height: "3px",
                    backgroundColor: "#2567B3",
                    borderRadius: "2px",
                  }}
                />
                <Box
                  sx={{
                    width: "24px",
                    height: "3px",
                    backgroundColor: "#2567B3",
                    borderRadius: "2px",
                  }}
                />
                <Box
                  sx={{
                    width: "28px",
                    height: "3px",
                    backgroundColor: "#2567B3",
                    borderRadius: "2px",
                  }}
                />
              </Box>
              <Typography
                variant="h5"
                sx={{
                  fontSize: "20px",
                  fontWeight: 600,
                  color: "#111827",
                }}
              >
                Ajaxter Stack
              </Typography>
            </Box>

            {sessions?.length === 0 ? (
              // No active sessions state
              <Box className="flex flex-col items-center gap-6">
                <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                  <div className="flex flex-col gap-4 justify-center items-center">
                    <img
                      src={check}
                      alt="Success Icon"
                      className="w-20 h-20"
                    />
                    <Typography
                      variant="body1"
                      className="text-green-700 text-center"
                      sx={{ fontSize: "14px" }}
                    >
                      No active sessions. You can now continue to the dashboard.
                    </Typography>
                    <Button
                      variant="contained"
                      size="large"
                      onClick={handleContinueToDashboard}
                      sx={{
                        fontWeight: 600,
                        backgroundColor: "#2567B3",
                        color: "white",
                        px: 4,
                        py: 1.5,
                        borderRadius: "8px",
                        textTransform: "none",
                        "&:hover": {
                          backgroundColor: "#1e5499",
                        },
                      }}
                    >
                      {isLoadingRegenrate ? (
                        <CircularProgress size={20} color="inherit" />
                      ) : (
                        "Sign in"
                      )}
                    </Button>
                  </div>
                </div>
              </Box>
            ) : (
              // Active sessions limit reached state
              <Box className="w-full flex flex-col items-center gap-6">
                {/* Main Heading */}
                <Typography
                  variant="h4"
                  sx={{
                    fontSize: "28px",
                    fontWeight: 700,
                    color: "#111827",
                    textAlign: "center",
                    mb: 1,
                  }}
                >
                  Active session limit reached
                </Typography>

                {/* Description */}
                <Typography
                  variant="body1"
                  sx={{
                    fontSize: "16px",
                    color: "#6b7280",
                    textAlign: "center",
                    mb: 4,
                    maxWidth: "500px",
                  }}
                >
                  You have reached your limit of {totalSessionLimit} active
                  sessions on Ajaxter Stack. Please end another session before
                  signing in.
                </Typography>

                {/* Active Sessions List */}
                {sessions?.length > 0 && (
                  <Box className="w-full space-y-3 mb-6">
                    {sessions?.map((session: any) => (
                      <Box
                        key={session.sessionId}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          border: "1px solid #e5e7eb",
                          borderRadius: "8px",
                          p: 2.5,
                          backgroundColor: "white",
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 2,
                          }}
                        >
                          {/* Device Icon */}
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              color: "#6b7280",
                            }}
                          >
                            {session.device === "APP" ? (
                              <SmartphoneIcon sx={{ fontSize: 24 }} />
                            ) : session.device === "TAB" ? (
                              <TabletIcon sx={{ fontSize: 24 }} />
                            ) : (
                              <ComputerIcon sx={{ fontSize: 24 }} />
                            )}
                          </Box>

                          {/* Last Activity */}
                          <Box>
                            <Typography
                              variant="body2"
                              sx={{
                                fontSize: "14px",
                                color: "#6b7280",
                                mb: 0.5,
                              }}
                            >
                              Last activity
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{
                                fontSize: "14px",
                                color: "#111827",
                                fontWeight: 400,
                              }}
                            >
                              {formatLastActivity(session.lastActivity)}
                            </Typography>
                          </Box>
                        </Box>

                        {/* End Session Button */}
                        {!endAllSessions && (
                          <Button
                            variant="outlined"
                            size="small"
                            onClick={() =>
                              handleDeleteSession(session?.sessionId)
                            }
                            disabled={
                              deletingSessionId === session?.sessionId
                            }
                            sx={{
                              fontWeight: 500,
                              color: "#374151",
                              borderColor: "#d1d5db",
                              borderRadius: "6px",
                              textTransform: "none",
                              px: 2,
                              py: 0.75,
                              "&:hover": {
                                borderColor: "#9ca3af",
                                backgroundColor: "#f9fafb",
                              },
                            }}
                          >
                            {endSessions &&
                            deletingSessionId === session?.sessionId ? (
                              <CircularProgress size={16} />
                            ) : (
                              "End session"
                            )}
                          </Button>
                        )}
                      </Box>
                    ))}
                  </Box>
                )}

                {/* Sign In Button */}
                <Button
                  variant="contained"
                  size="large"
                  onClick={handleContinueToDashboard}
                  disabled={sessions?.length >= totalSessionLimit}
                  sx={{
                    fontWeight: 600,
                    backgroundColor: "#2567B3",
                    color: "white",
                    px: 6,
                    py: 1.5,
                    borderRadius: "8px",
                    textTransform: "none",
                    width: "100%",
                    maxWidth: "400px",
                    "&:hover": {
                      backgroundColor: "#1e5499",
                    },
                    "&:disabled": {
                      backgroundColor: "#2567B3",
                      opacity: 0.6,
                    },
                  }}
                >
                  {isLoadingRegenrate ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : (
                    "Sign in"
                  )}
                </Button>
              </Box>
            )}

            {/* Help Section */}
            <Box className="mt-12 text-center">
              <Typography
                variant="body2"
                sx={{
                  fontSize: "14px",
                  color: "#6b7280",
                }}
              >
                Need help? Let us know at{" "}
                <Link
                  href="mailto:hello@ajaxterstack.com"
                  sx={{
                    color: "#2563eb",
                    textDecoration: "none",
                    "&:hover": {
                      textDecoration: "underline",
                    },
                  }}
                >
                  hello@ajaxterstack.com
                </Link>
              </Typography>
            </Box>

            {/* Account Sharing Prompt */}
            <Box
              className="mt-8 flex items-center gap-2"
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <PeopleIcon sx={{ fontSize: 18, color: "#6b7280" }} />
              <Typography
                variant="body2"
                sx={{
                  fontSize: "14px",
                  color: "#6b7280",
                }}
              >
                Sharing account with a colleague?{" "}
                <Link
                  component="button"
                  onClick={() => navigate("/sign-up")}
                  sx={{
                    color: "#2563eb",
                    textDecoration: "none",
                    "&:hover": {
                      textDecoration: "underline",
                    },
                    cursor: "pointer",
                  }}
                >
                  Create your own account
                </Link>
              </Typography>
            </Box>
          </>
        )}
      </Box>
    </Box>
  );
};

export default SessionManagementPage;
