import React, { useState, useEffect, useMemo } from "react";
import {
  Box,
  Typography,
  Button,
  Avatar,
  CircularProgress,
} from "@mui/material";
import {
  Security as SecurityIcon,
  Computer as ComputerIcon,
  Smartphone as SmartphoneIcon,
  Tablet as TabletIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../hooks/useToast";
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
  const { showToast } = useToast();
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
  const [triggerLogOut, { isLoading: isLoadingLogOut }] =
    useTriggerLogOutMutation();

  const [deleteSession, { isLoading: isLoadingDeleteSession }] =
    useDeleteSessionMutation();

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
        console.log("res", res);
        if (res?.type === "error") {
          return;
        }
        if (res?.type === "success" && res?.success) {
          setSessions((prev) =>
            prev.filter((session) => session.sessionId !== targetId)
          );
          setSessionToDelete(null);
        }
      })
      .catch(() => {
        handleLogOut();
      })
      .finally(() => {
        setDeletingSessionId(null);
      });
  };

  const handleConfirmDeleteAll = async () => {
    const ids = sessions.map((session) => session.sessionId);
    try {
      deleteSession({ session: [ids] })
        .unwrap()
        .then((res) => {
          console.log("res", res);
          if (res?.type === "error") {
          
            return;
          }
          if (res?.type === "success" && res?.success) {
           
            setSessions([]);
          }
        })
        .catch(() => {
          handleLogOut();
        });
    } catch (error: any) {
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



  return (
    <Box className="w-full h-screen bg-gray-50 flex flex-col">
      {/* Fixed Header */}
      <div className="flex items-center justify-between h-16 px-20 sticky top-0 z-20 bg-white border-b">
        {/* Left side - empty for balance */}
        <div>
          <SecurityIcon />
        </div>

        {/* Right side - Back and Logout buttons */}
        <div className="flex gap-2 items-center">
          <Button
            variant="outlined"
            size="small"
            onClick={handleLogOut}
            color="error"
            sx={{ mr: 3 }}
          >
            {isLoadingLogOut ? (
              <CircularProgress size={16} color="error" />
            ) : (
              "Logout"
            )}
          </Button>
          <Avatar
            alt="User"
            sx={{ width: 26, height: 26, backgroundColor: "primary.main" }}
          >
            {userData?.name?.charAt(0)}
          </Avatar>
          <Typography
            variant="subtitle1"
            sx={{ fontSize: "14px", userSelect: "none" }}
          >
            {userData?.name}
          </Typography>
        </div>
      </div>

      {/* Main Content (scrolls between fixed header/footer) */}
      <Box className="flex-1 overflow-y-auto">
        {isLoadingSession ? (
          <SessionManagementSkeleton />
        ) : (
          <>
            <Box className="mb-8">
              {desktopCount === 0 && mobileCount === 0 ? (
                <div className=" h-[calc(100vh-150px)] max-w-7xl mx-auto px-4 flex flex-col items-center justify-center sm:px-6 lg:px-8 pt-4 pb-24 ">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex flex-col gap-4 justify-center items-center">
                      <img
                        src={check}
                        alt="Success Icon"
                        className="w-25 h-20"
                      />
                      <Typography variant="body2" className="text-green-700">
                        No active sessions. You can now continue to the
                        dashboard.
                      </Typography>
                      <Button
                        variant="contained"
                        color="success"
                        size="large"
                        onClick={handleContinueToDashboard}
                        sx={{ fontWeight: 600 }}
                      >
                        {isLoadingRegenrate ? (
                          <CircularProgress size={16} color="inherit" />
                        ) : (
                          "Continue to Dashboard"
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="max-w-7xl mx-auto px-4  sm:px-6 lg:px-8 pt-4 pb-24  ">
                  <div className=" bg-[#fffde7] border border-[#fbc02d] rounded-lg p-4">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="52"
                          height="52"
                          viewBox="0 0 24 24"
                          fill="none"
                          color="#663c00"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="lucide lucide-history-icon lucide-history"
                        >
                          <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                          <path d="M3 3v5h5" />
                          <path d="M12 7v5l4 2" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <Typography
                          variant="h6"
                          className="text-[#663c00] font-medium mb-1"
                        >
                          Session Status
                        </Typography>

                        {(desktopCount >= maxDesktopSessions ||
                          mobileCount >= maxMobileSessions) && (
                          <Typography
                            variant="body2"
                            className="text-[#663c00] mt-1"
                          >
                            You have reached the limit on one or more devices.
                          </Typography>
                        )}
                      </div>
                    </div>
                  </div>
                  {/* Sessions Section - Only show if there are sessions */}
                  {sessions?.length > 0 && (
                    <Box className="rounded-lg shadow-sm border bg-white mt-6">
                      <div className="px-6 py-2 border-b border-gray-200">
                        <div className="flex items-center justify-between">
                          <div>
                            <Typography
                              variant="h6"
                              className="text-gray-900 font-medium"
                            >
                              Active Sessions
                            </Typography>
                            <Typography
                              variant="body2"
                              className="text-gray-500"
                            >
                              {sessions?.length} session
                              {sessions?.length !== 1 ? "s" : ""} currently
                              active
                            </Typography>
                          </div>
                         {
                          !isLoadingDeleteSession && (
                             <Button
                            variant="contained"
                            size="small"
                            onClick={handleConfirmDeleteAll}
                          >
                         
                            End All Sessions
                         
                          </Button>
                          )
                         }
                        </div>
                      </div>

                      {/* List */}
                      <div className="p-6">
                        <div className="space-y-4 pr-2">
                          {sessions?.map((session: any) => (
                            <div
                              key={session.sessionId}
                              className="bg-gray-50 border border-gray-200 rounded-lg p-4"
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center">
                                    {session.device === "APP" ? (
                                      <SmartphoneIcon className="text-gray-600 text-sm" />
                                    ) : session.device === "TAB" ? (
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
                                      {session.ipAddress} • {session.ipLocation}
                                    </Typography>
                                  </div>
                                </div>
                                <Button
                                  variant="text"
                                  size="small"
                                  onClick={() =>
                                    handleDeleteSession(session?.sessionId)
                                  }
                                  disabled={
                                    deletingSessionId === session?.sessionId
                                  }
                                  sx={{
                                    fontWeight: 600,
                                  }}
                                >
                                  {isLoadingDeleteSession &&
                                  deletingSessionId === session?.sessionId ? (
                                    <CircularProgress size={16} />
                                  ) : (
                                    "End session"
                                  )}
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </Box>
                  )}
                </div>
              )}
            </Box>

            {sessions?.length !== 0 && canContinueToDesktop && (
              <Box className="mt-8 text-center">
                <Button
                  variant="contained"
                  size="large"
                  onClick={handleContinueToDashboard}
                  sx={{ fontWeight: 600 }}
                >
                  Continue to Desktop
                </Button>
              </Box>
            )}
          </>
        )}
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
    </Box>
  );
};

export default SessionManagementPage;
