import React, { useEffect, useState, forwardRef } from "react";
import {
  Visibility,
  VisibilityOff,
  Lock as LockIcon,
} from "@mui/icons-material";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  IconButton,
  Slide,
  RadioGroup,
  FormControlLabel,
  Radio,
  TextField,
  InputAdornment,
  Checkbox,
  Alert,
  Link,
  Box,
  Paper,
} from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";
import { AnimatePresence, motion } from "framer-motion";
import { useToast } from "../../hooks/useToast";
import { useParams } from "react-router-dom";
import { useChangePasswordMutation } from "../../services/auth";
import generator from "generate-password-browser";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

// Slide Transition
const Transition = forwardRef(function Transition(
  props: TransitionProps & { children: React.ReactElement },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});



interface ChangePasswordProps {
  open: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  bgColor?: string;
  userId?: any;
}

const ChangePassword: React.FC<ChangePasswordProps> = ({
  open,
  onClose,
  userId,
}) => {


  const { showToast } = useToast();

  const [step, setStep] = useState<"confirm" | "success" | "email">("confirm");
  const [activeIndex, setActiveIndex] = useState("auto");
  const [showNew, setShowNew] = useState(false);
  const [show, setShow] = useState(false);
  const [createPassword, setCreatePassword] = useState("");
  const [isFocedToChange, setIsForcedToChange] = useState(false);
  const [isSendMyself, setIsSendMyself] = useState(false);
  const [isCopy, setIsCopy] = useState(false);
  const [changePassword, { isLoading: isSubmitting }] =
    useChangePasswordMutation();


  // Function to handle the final submission
  const handleSubmitPassword = () => {
    const payload = {
      password: createPassword,
      client: userId,
    };

    changePassword(payload).then((res) => {
      if (res?.data?.type === "error") {
        showToast(res?.data?.message, "error");
        return;
      }
      if (res?.data?.type === "success") {
        showToast(res?.data?.message, "success");

        onClose();
        return;
      }
    });
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(createPassword);
    setIsCopy(true);
  };

  useEffect(() => {
    if (open) {
      setStep("confirm"); // Reset to initial state when modal opens
    }
  }, [open]);

  const handleConfirm = () => {
    if (activeIndex === "auto") {
      const generatePass = generator.generate({
        length: 12,
        numbers: true,
        symbols: true,
        uppercase: true,
      });
      setCreatePassword(generatePass);
      setStep("email");
      return;
    }
    if (activeIndex === "manual" && createPassword) {

      const payload = {
        password: createPassword,
        client: userId,
        forceChangePassword: isFocedToChange,
      };
     

      changePassword(payload).then((res) => {
        if (res?.data?.type === "error") {
          showToast(res?.data?.message, "error");
          return;
        }
        if (res?.data?.type === "success") {
          showToast(res?.data?.message, "success");

          setStep("success");
          return;
        }
      });

      return;
    } else {
      showToast("Please enter a password to continue", "error");
      return;
    }
  };

  const handleSendEmail = () => {
    if (!createPassword) {
      showToast("Please enter an Password address", "error");
      return;
    }
    // For auto-generated password, send email and then submit
    handleSubmitPassword();
  };

  const handlecancel = () => {
    setIsForcedToChange(false);
    setActiveIndex("auto");
    setCreatePassword("");

    onClose();
  };

  return (
    <Dialog
      open={open}
      maxWidth="sm"
      fullWidth
      // onClose={onClose}
      TransitionComponent={Transition}
      keepMounted
      PaperProps={{
        sx: {
          // borderRadius: 4,
          boxShadow: 6,
          // px: 1,
          // py: 0.5,
          backgroundColor: step === "confirm" ? "#ffffff" : "#ffffff",
          position: "relative",
        },
      }}
      BackdropProps={{
        sx: {
          backdropFilter: "blur(3px)",
          backgroundColor: "rgba(0, 0, 0, 0.2)",
        },
      }}
    >
      <DialogTitle
        sx={{
          fontWeight: 600,
          fontSize: "1.1rem",
          // textAlign: "right",
          display: "flex",
          alignItems: "center",
          gap: 2,
          color: "#fff",
          backgroundColor:
            step === "confirm"
              ? "primary.main"
              : activeIndex === "manual" && step === "success"
              ? "success.main"
              : "primary.main",
          py: 2,
        }}
      >
        {step !== "confirm" && step !== "success" && (
          <IconButton size="small">
            <ArrowBackIcon
              fontSize="small"
              sx={{ color: "white" }}
              onClick={() => {
                setCreatePassword("");
                setStep("confirm");
                setActiveIndex("auto");
              }}
            />
          </IconButton>
        )}
        <Typography variant="h6" component="span">
          {" "}
          {step === "confirm" || step === "success"
            ? `Reset password`
            : "Email New Password"}
        </Typography>
      </DialogTitle>

      <DialogContent
        dividers
        sx={{
          display: "flex",
          flexDirection: "column",
          // alignItems: "center",
          // justifyContent: "center",
          px: 2,
        }}
      >
        {step === "confirm" && (
          <>
            <RadioGroup
              value={activeIndex}
              name="change-password"
              sx={{
                display: "flex",
                ml: 1,
                gap: 1,
              }}
            >
              {[
                {
                  value: "auto",
                  label: "Automatically generate password",
                  subtitle:
                    " you'll be able to view and copy the password in the next step",
                },
                { value: "manual", label: "Create password" },
              ].map((option) => {
                const isActive = option.value === activeIndex;
                return (
                  <FormControlLabel
                    key={option.value}
                    value={option.value}
                    control={<Radio size="small" />}
                    onChange={() => setActiveIndex(option.value)}
                    label={
                      <div>
                        <div>{option.label}</div>
                        <div style={{ fontSize: "0.8rem", color: "#666" }}>
                          {option.subtitle}
                        </div>
                      </div>
                    }
                    sx={{
                      borderRadius: 1,
                      p: 0.5,

                      "&:hover": {
                        backgroundColor: "action.hover", // hover highlight
                      },
                      "&.Mui-checked, &.Mui-checked:hover": {
                        backgroundColor: "action.selected", // selected highlight
                      },
                      ".MuiFormControlLabel-label": {
                        fontWeight: (theme) => (isActive ? 700 : 400), // example bold first one
                      },
                    }}
                  />
                );
              })}
            </RadioGroup>

            <AnimatePresence>
              {activeIndex === "manual" && (
                <motion.div
                  initial={{ height: 0, opacity: 0, y: -10 }}
                  animate={{ height: "auto", opacity: 1, y: 0 }}
                  exit={{ height: 0, opacity: 0, y: -10 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  <div className="flex flex-col ml-4">
                    <TextField
                      label="Password"
                      type={showNew ? "text" : "password"}
                      value={createPassword}
                      onChange={(e) => setCreatePassword(e.target.value)}
                      placeholder="Enter new password"
                      margin="normal"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <LockIcon color="action" />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => setShowNew(!showNew)}
                              edge="end"
                              disabled={!createPassword}
                            >
                              {showNew ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        width: {
                          xs: "100%",
                          sm: "80%",
                          md: "70%",
                          lg: "50%",
                        },
                      }}
                    />
                    <Typography variant="caption">
                      Password must be at least 8 characters
                    </Typography>

                    <FormControlLabel
                      control={
                        <Checkbox
                          size="small"
                          checked={isFocedToChange}
                          onChange={(e) =>
                            setIsForcedToChange(e.target.checked)
                          }
                        />
                      }
                      label="Ask user to change their password on next login"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}

        {step === "success" && (
          <div className="flex flex-col px-2 ">
            {createPassword && (
              <TextField
                // id="standard-read-only-input"
                variant="standard"
                label="Password"
                type={show ? "text" : "password"}
                value={createPassword}
                // placeholder="Enter new passwor
                margin="normal"
                InputProps={{
                  readOnly: true,
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShow(!show)}
                        edge="end"
                        size="small"
                      >
                        {show ? (
                          <VisibilityOff fontSize="small" />
                        ) : (
                          <Visibility fontSize="small" />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  width: {
                    xs: "100%",
                    sm: "80%",
                    md: "70%",
                    lg: "50%",
                  },
                }}
              />
            )}
            {isCopy ? (
              <>
                {" "}
                <motion.svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="30"
                  height="30"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="green"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial="hidden"
                  animate="visible"
                >
                  <motion.circle
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="green"
                    variants={{
                      hidden: { pathLength: 0 },
                      visible: {
                        pathLength: 1,
                        transition: { duration: 0.5 },
                      },
                    }}
                  />
                  <motion.path
                    d="M9 12l2 2l4-4"
                    stroke="green"
                    variants={{
                      hidden: { pathLength: 0 },
                      visible: {
                        pathLength: 1,
                        transition: { duration: 0.4, delay: 0.5 },
                      },
                    }}
                  />
                </motion.svg>
              </>
            ) : (
              <Typography
                variant="subtitle2"
                component={"span"}
                color="primary"
                sx={{
                  my: 1,
                  cursor: "pointer",
                  "&:hover": { textDecoration: "underline" },
                }}
                onClick={handleCopy}
              >
                Copy Password
              </Typography>
            )}
            <Alert severity="info">
              Save time by letting users recover their passwords by setting a{" "}
              <span className="font-semibold text-blue">
                self recover policy
              </span>
            </Alert>
          </div>
        )}

        {step === "email" && (
          <div className="w-full flex flex-col px-2 ">
            <TextField
              label="Password"
              type={showNew ? "text" : "password"}
              value={createPassword}
              onChange={(e) => setCreatePassword(e.target.value)}
              placeholder="Enter new password"
              margin="normal"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon color="action" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowNew(!showNew)}
                      edge="end"
                      disabled={!createPassword}
                    >
                      {showNew ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                width: {
                  xs: "100%",
                  sm: "80%",
                  md: "70%",
                  lg: "50%",
                },
              }}
            />

            <Paper
              elevation={1}
              sx={{
                p: 2,
                maxWidth: 500,
                mx: "auto",
                mt: 2,
                fontFamily: "Arial, sans-serif",
                height: "30vh",
                overflow: "auto",
              }}
            >
              <Typography variant="body1" sx={{ mb: 2 }}>
                <strong>Subject:</strong> Your Account password for{" "}
                <strong>userEmail</strong> has been reset by your administrator.
              </Typography>

              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                Your Account password has been reset
              </Typography>

              <Typography variant="body1" sx={{ mb: 2 }}>
                Hello,
              </Typography>

              <Typography variant="body1" sx={{ mb: 2 }}>
                Your administrator has reset your Google Account password for{" "}
                <strong>userEmail</strong>.
              </Typography>

              <Typography variant="body1" sx={{ mb: 2 }}>
                Click Reset password below to set a new password. To keep your
                account secure, follow{" "}
                <Link href="#" underline="hover">
                  these password guidelines
                </Link>
                .
              </Typography>

              <Typography variant="body2" color="text.secondary">
                For your security, the reset password link expires after 48
                hours. After that, please contact your{" "}
                <Link href="#" underline="hover">
                  administrator
                </Link>{" "}
                for your password.
              </Typography>
            </Paper>
          </div>
        )}
      </DialogContent>

      <DialogActions sx={{ justifyContent: "center", p: 2, gap: 2 }}>
        {step === "success" ? (
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
           
                handlecancel();
         
            }}
            sx={{ borderRadius: 5, textTransform: "none", px: 3 }}
          >
            Done
          </Button>
        ) : (
          <>
            <Button
              variant="outlined"
              color="inherit"
              onClick={handlecancel}
              sx={{ borderRadius: 5, textTransform: "none", px: 3 }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={step === "email" ? handleSendEmail : handleConfirm}
              sx={{ borderRadius: 5, textTransform: "none", px: 3 }}
            
            >
              {step === "email" ? "Send" : "Reset"}
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default ChangePassword;
