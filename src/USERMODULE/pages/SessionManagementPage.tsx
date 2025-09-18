import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Security as SecurityIcon,
  Computer as ComputerIcon,
  Smartphone as SmartphoneIcon,
  Tablet as TabletIcon,
  LocationOn as LocationIcon,
  AccessTime as TimeIcon,
  Public as PublicIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../hooks/useToast';

interface Session {
  id: string;
  userId: string;
  ipAddress: string;
  loginTime: string;
  lastActivity: string;
  deviceInfo: string;
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
      id: '1',
      userId: 'user123',
      ipAddress: '192.168.1.100',
      loginTime: oneHourAgo.toISOString(),
      lastActivity: now.toISOString(),
      deviceInfo: 'Desktop',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36',
      isCurrent: false,
      location: 'New York, NY',
    },
    {
      id: '2',
      userId: 'user123',
      ipAddress: '192.168.1.101',
      loginTime: twoHoursAgo.toISOString(),
      lastActivity: oneHourAgo.toISOString(),
      deviceInfo: 'Mobile',
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
      isCurrent: false,
      location: 'San Francisco, CA',
    },
    {
      id: '3',
      userId: 'user123',
      ipAddress: '10.0.0.50',
      loginTime: oneDayAgo.toISOString(),
      lastActivity: twoHoursAgo.toISOString(),
      deviceInfo: 'Tablet',
      userAgent: 'Mozilla/5.0 (iPad; CPU OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
      isCurrent: false,
      location: 'Los Angeles, CA',
    },
    {
      id: '4',
      userId: 'user123',
      ipAddress: '203.0.113.1',
      loginTime: new Date(now.getTime() - 3 * 60 * 60 * 1000).toISOString(),
      lastActivity: new Date(now.getTime() - 30 * 60 * 1000).toISOString(),
      deviceInfo: 'Desktop',
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36',
      isCurrent: false,
      location: 'London, UK',
    },
  ];
};

const SessionManagementPage: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [sessionToDelete, setSessionToDelete] = useState<string | null>(null);
  const [deleteAllDialogOpen, setDeleteAllDialogOpen] = useState(false);
  const [deletingSessionId, setDeletingSessionId] = useState<string | null>(null);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [isDeletingSession, setIsDeletingSession] = useState(false);
  const [isDeletingAll, setIsDeletingAll] = useState(false);

  // Load mock sessions on component mount
  useEffect(() => {
    setSessions(generateMockSessions());
  }, []);

  const handleDeleteSession = (sessionId: string) => {
    setSessionToDelete(sessionId);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!sessionToDelete) return;

    try {
      setDeletingSessionId(sessionToDelete);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSessions(prev => prev.filter(session => session.id !== sessionToDelete));
      showToast('Session ended successfully', 'success');
      setDeleteDialogOpen(false);
      setSessionToDelete(null);
    } catch (error: any) {
      showToast('Failed to end session. Please try again.', 'error');
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
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setSessions([]);
      showToast('All sessions ended successfully', 'success');
      setDeleteAllDialogOpen(false);
    } catch (error: any) {
      showToast('Failed to end sessions. Please try again.', 'error');
    } finally {
      setIsDeletingAll(false);
    }
  };

  const handleContinueToDashboard = () => {
    navigate('/');
  };




  return (
    <Box className="min-h-screen bg-gray-50">
      {/* Header */}
      <Box className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left side - empty for balance */}
            <div></div>
            
            {/* Center - Session Management with icon */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <SecurityIcon className="text-white text-lg" />
              </div>
              <Typography variant="h5" className="font-semibold text-gray-900">
                Session Management
              </Typography>
            </div>
            
            {/* Right side - Back and Logout buttons */}
            <div className="flex gap-2">
              <Button
                variant="outlined"
                size="small"
                onClick={() => navigate('/login')}
                className="text-gray-600 border-gray-300 hover:bg-gray-50"
              >
                Back to Login
              </Button>
              <Button
                variant="outlined"
                size="small"
                onClick={() => {
                  localStorage.clear();
                  navigate('/login');
                }}
                className="text-red-600 border-red-300 hover:bg-red-50"
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      </Box>

      {/* Main Content */}
      <Box className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Alert */}
          <Box className="mb-8">
            {sessions.length === 0 ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <SecurityIcon className="h-5 w-5 text-green-400" />
                  </div>
                  <div className="ml-3">
                    <Typography variant="h6" className="text-green-800 font-medium mb-1">
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
                    <Typography variant="h6" className="text-blue-800 font-medium mb-1">
                      Session Limit Reached
                    </Typography>
                    <Typography variant="body2" className="text-blue-700">
                      You have reached your limit of {sessions.length} active sessions. Please end another session before continuing.
                    </Typography>
                  </div>
                </div>
              </div>
            )}
          </Box>

          {/* Sessions Section - Only show if there are sessions */}
          {sessions.length > 0 && (
            <Box className="bg-white rounded-lg shadow-sm border">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <Typography variant="h6" className="text-gray-900 font-medium">
                      Active Sessions
                    </Typography>
                    <Typography variant="body2" className="text-gray-500">
                      {sessions.length} session{sessions.length !== 1 ? 's' : ''} currently active
                    </Typography>
                  </div>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={handleDeleteAllOther}
                    disabled={isDeletingAll}
                    className="text-red-600 border-red-300 hover:bg-red-50"
                  >
                    {isDeletingAll ? 'Ending...' : 'End All Sessions'}
                  </Button>
                </div>
              </div>
              
              <div className="p-6">
                <div className="space-y-4">
                  {sessions.map((session) => (
                    <div key={session.id} className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center">
                            {session.deviceInfo === 'Mobile' ? (
                              <SmartphoneIcon className="text-gray-600 text-sm" />
                            ) : session.deviceInfo === 'Tablet' ? (
                              <TabletIcon className="text-gray-600 text-sm" />
                            ) : (
                              <ComputerIcon className="text-gray-600 text-sm" />
                            )}
                          </div>
                          <div>
                            <Typography variant="body2" className="text-gray-500 text-sm">
                              Last activity
                            </Typography>
                            <Typography variant="body2" className="text-gray-900 font-medium">
                              {new Date(session.lastActivity).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                                hour: 'numeric',
                                minute: '2-digit',
                                hour12: true
                              })}
                            </Typography>
                            <Typography variant="caption" className="text-gray-500">
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
                          {deletingSessionId === session.id ? 'Ending...' : 'End session'}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Box>
          )}

          {/* Action Button - Only show when sessions <= 2 */}
          {sessions.length <= 2 && (
            <Box className="mt-8 text-center">
              <Button
                variant="contained"
                size="large"
                onClick={handleContinueToDashboard}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium"
              >
                Continue to Dashboard
              </Button>
            </Box>
          )}

          {/* Help Text */}
          <Box className="mt-6 text-center">
            <Typography variant="body2" className="text-gray-500">
              Need help? Contact support at{' '}
              <a href="mailto:support@example.com" className="text-blue-600 hover:underline font-medium">
                support@example.com
              </a>
            </Typography>
          </Box>
        </div>
      </Box>

      {/* Delete Session Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '12px',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
          }
        }}
      >
        <DialogTitle className="text-center py-6">
          <Typography variant="h6" className="font-semibold text-gray-900">
            End Session
          </Typography>
        </DialogTitle>
        <DialogContent className="text-center py-2">
          <Typography variant="body1" className="text-gray-600">
            Are you sure you want to end this session? The user will be logged out from this device.
          </Typography>
        </DialogContent>
        <DialogActions className="justify-center gap-3 p-6">
          <Button 
            onClick={() => setDeleteDialogOpen(false)}
            className="px-6 py-2 text-gray-600 hover:bg-gray-50 rounded-lg"
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmDelete}
            disabled={isDeletingSession}
            className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"
          >
            {isDeletingSession ? 'Ending...' : 'End Session'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete All Other Sessions Dialog */}
      <Dialog
        open={deleteAllDialogOpen}
        onClose={() => setDeleteAllDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '12px',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
          }
        }}
      >
        <DialogTitle className="text-center py-6">
          <Typography variant="h6" className="font-semibold text-gray-900">
            End All Other Sessions
          </Typography>
        </DialogTitle>
        <DialogContent className="text-center py-2">
          <Typography variant="body1" className="text-gray-600">
            Are you sure you want to end all other sessions? Users will be logged out from all other devices except this one.
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
            {isDeletingAll ? 'Ending...' : 'End All Sessions'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SessionManagementPage;
