import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogActions,
  DialogTitle,
  TextField,
  Button,
  Typography,
  IconButton,
  Box,
  useMediaQuery,
  useTheme,
  Link,
  InputAdornment,
  CircularProgress,
  Slide
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import LoginIcon from "@mui/icons-material/Login";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import VisibilityIcon from "@mui/icons-material/Visibility";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";

interface LoginDialogProps {
  open: boolean;
  onClose: () => void;
  onLogin: (email: string, password: string) => void;
}

const LoginDialog: React.FC<LoginDialogProps> = ({ open, onClose, onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [showForgot, setShowForgot] = useState(false);

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const validateEmail = (value: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(value);
  };

  const handleLogin = () => {
    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address.");
      return;
    }
    setEmailError("");
    onLogin(email, password);
  };

  const handleForgot = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setShowForgot(true);
    }, 2000);
  };

  const handleBackToLogin = () => {
    setShowForgot(false);
  };

  return (
    <Dialog
      open={open}
      onClose={(e, reason) => {
        if (reason !== "backdropClick") onClose();
      }}
      disableEscapeKeyDown
      fullWidth
      maxWidth="sm"
      fullScreen={fullScreen}
      PaperProps={{
        sx: {
          p: 3,
          borderRadius: 2,
          boxShadow: 10,
          height: 500,
          position: "relative",
          overflow: "hidden",
        },
      }}
      BackdropProps={{
        sx: {
          backgroundColor: "rgba(0, 0, 0, 0.3)",
          backdropFilter: "blur(6px)",
        },
      }}
    >
      {/* ⭕ Centered CircularProgress */}
      {isLoading && (
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            backgroundColor: "rgba(255, 255, 255, 0.7)",
            zIndex: 20,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CircularProgress size={48} thickness={4} />
        </Box>
      )}

      <IconButton
        onClick={onClose}
        sx={{ position: "absolute", top: 12, right: 12, zIndex: 10 }}
      >
        <CloseIcon />
      </IconButton>

      <Slide in={!showForgot} direction="right" mountOnEnter unmountOnExit>
        <Box>
          <DialogTitle sx={{ textAlign: "center", fontWeight: 700, fontSize: 24 }}>
            Welcome back 👋
          </DialogTitle>

          <Typography variant="body1" textAlign="center" sx={{ mt: -1, mb: 2 }}>
            Log in to your account
          </Typography>

          <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
              label="Email"
              variant="outlined"
              fullWidth
              autoFocus
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (emailError) setEmailError("");
              }}
              error={!!emailError}
              helperText={emailError}
              sx={{ "& .MuiInputBase-input": { fontSize: "15px" } }}
            />

            <TextField
              label="Password"
              type={showPassword ? "text" : "password"}
              variant="outlined"
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={{ "& .MuiInputBase-input": { fontSize: "15px" } }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                      {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Link
              underline="hover"
              sx={{
                alignSelf: "flex-end",
                fontSize: 14,
                fontWeight: 500,
                color: "#1a73e8",
                cursor: "pointer",
                mt: 1,
              }}
              onClick={handleForgot}
            >
              <HelpOutlineIcon color="primary" sx={{ mr: 1 }} />
              I forgot my password
            </Link>
          </DialogContent>

          <DialogActions>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              sx={{ height: 50 }}
              startIcon={<LoginIcon />}
              onClick={handleLogin}
              disabled={!email || !password}
            >
              Log in
            </Button>
          </DialogActions>
        </Box>
      </Slide>

      <Slide in={showForgot} direction="left" mountOnEnter unmountOnExit>
        <Box>
          <DialogTitle sx={{ textAlign: "center", fontWeight: 700, fontSize: 24 }}>
            Forgot Password 🔐
          </DialogTitle>

          <Typography variant="body2" textAlign="center" sx={{ mt: -1, mb: 2 }}>
            Enter your email to reset your password
          </Typography>

          <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
              label="Email"
              variant="outlined"
              fullWidth
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </DialogContent>

          <DialogActions sx={{ flexDirection: "column", gap: 1, mt: 2 }}>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              sx={{ height: 50 }}
              onClick={() => alert("Reset link sent!")}
            >
              Send Reset Link
            </Button>

            <Button
              variant="text"
              fullWidth
              onClick={handleBackToLogin}
              sx={{ color: "#1a73e8", fontWeight: 500 }}
            >
              ← Back to Login
            </Button>
          </DialogActions>
        </Box>
      </Slide>
    </Dialog>
  );
};

export default LoginDialog;
