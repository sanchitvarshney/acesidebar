import React from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  IconButton,
  Link,
  Divider,
  InputAdornment,
  CircularProgress,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import { useState, useRef, useEffect } from "react";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { useForm } from "react-hook-form";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { loginSchema } from "../../zodSchema/AuthSchema";
import { useAuth } from "../../contextApi/AuthContext";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../hooks/useToast";
import { useLoginMutation } from "../../services/auth";
import { decrypt } from "../../utils/encryption";
import imageBackground from "../../assets/image/Banner-hepl-desk@2x.png";
import imagePadLock from "../../assets/image/padlock.webp";

import GoogleRecaptcha, {
  GoogleRecaptchaRef,
} from "../../components/reusable/GoogleRecaptcha";

type RegisterFormData = z.infer<typeof loginSchema>;

const LoginScreen = () => {
  const { signIn } = useAuth();
  const navigation = useNavigate();
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitted, touchedFields },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
    defaultValues: {
      email: "admin123",
      password: "Shiv@123456",
    },
  });
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const { showToast } = useToast();
  const [login, { isLoading }] = useLoginMutation();
  const [isForgot, setIsForgot] = useState<boolean>(false);
  const [captchaToken, setCaptchaToken] = useState<string>("");
  const [isCaptchaVerified, setIsCaptchaVerified] = useState<boolean>(false);
  const [forgotCaptchaToken, setForgotCaptchaToken] = useState<string>("");
  const [isForgotCaptchaVerified, setIsForgotCaptchaVerified] =
    useState<boolean>(false);
  const [rememberMe, setRememberMe] = useState<boolean>(false);
  const [termsAccepted, setTermsAccepted] = useState<boolean>(false);
  const recaptchaRef = useRef<GoogleRecaptchaRef>(null);
  const forgotRecaptchaRef = useRef<GoogleRecaptchaRef>(null);
  const [baseUrl, setBaseUrl] = useState<any>(null);

  const handleChange = (event: any) => {
    setBaseUrl(event.target.value as string);
  };

  useEffect(() => {
    if (!baseUrl || baseUrl === "" || baseUrl === null) {
      localStorage.removeItem("baseUrl");
      return;
    } else {
      localStorage.setItem("baseUrl", baseUrl);
    }
  }, [baseUrl]);

  // Watch form values for validation
  const watchedValues = watch();
  const email = watchedValues.email || "";
  const password = watchedValues.password || "";

  // Check if form is valid and reCAPTCHA is verified
  const isFormValid =
    email.trim() !== "" &&
    password.trim() !== "" &&
    isCaptchaVerified &&
    termsAccepted;

  // Check for remembered email on component mount
  useEffect(() => {
    const rememberedEmail = localStorage.getItem("rememberedEmail");
    const isRemembered = localStorage.getItem("rememberMe") === "true";

    if (rememberedEmail && isRemembered) {
      setValue("email", rememberedEmail);
      setRememberMe(true);
    }
  }, [setValue]);

  const forgotSchema = z.object({
    email: z.string().email("Invalid email"),
  });
  const {
    register: registerForgot,
    handleSubmit: handleForgotSubmit,
    formState: {
      errors: forgotErrors,
      isSubmitted: isForgotSubmitted,
      touchedFields: forgotTouched,
    },
  } = useForm<{ email: string }>({
    resolver: zodResolver(forgotSchema),
    mode: "onChange",
    defaultValues: { email: "" },
  });

  const handleToggleVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleRecaptchaVerify = (token: string) => {
    setCaptchaToken(token);
    setIsCaptchaVerified(true);
  };

  const handleRecaptchaError = (error: string) => {
    setIsCaptchaVerified(false);
    setCaptchaToken("");
    if (!error.includes("verification")) {
      showToast("Please complete the security verification", "error");
    }
  };

  const handleRecaptchaExpire = () => {
    setIsCaptchaVerified(false);
    setCaptchaToken("");
    showToast(
      "Security verification expired.\nPlease complete the verification again.",
      "error"
    );
  };

  // Forgot password captcha handlers
  const handleForgotRecaptchaVerify = (token: string) => {
    setForgotCaptchaToken(token);
    setIsForgotCaptchaVerified(true);
  };

  const handleForgotRecaptchaError = (error: string) => {
    setIsForgotCaptchaVerified(false);
    setForgotCaptchaToken("");
    if (!error.includes("verification")) {
      showToast("Please complete the security verification", "error");
    }
  };

  const handleForgotRecaptchaExpire = () => {
    setIsForgotCaptchaVerified(false);
    setForgotCaptchaToken("");
    showToast(
      "Security verification expired.\nPlease complete the verification again.",
      "error"
    );
  };

  const handleFormSubmit = (event: React.FormEvent) => {
    event.preventDefault();
  };

  const onSubmit = async (data: RegisterFormData) => {
    if (!isCaptchaVerified || !captchaToken) {
      showToast("Please complete the security verification", "error");
      return;
    }

    try {
      const payload = {
        username: data.email,
        password: data.password,
        captcha: captchaToken,
      };
      const result = await login(payload);

      if (
        result.data?.success === true &&
        result.data?.type === "login_success"
      ) {
        localStorage.setItem("userToken", result.data.data.token);
        const decryptedData = JSON.stringify(decrypt(result.data.data.user));
        localStorage.setItem("userData", decryptedData);

        if (rememberMe) {
          localStorage.setItem("rememberMe", "true");
          localStorage.setItem("rememberedEmail", data.email);
        } else {
          localStorage.removeItem("rememberMe");
          localStorage.removeItem("rememberedEmail");
        }

        signIn();
        setIsCaptchaVerified(false);
        setCaptchaToken("");
        navigation("/");
        return;
      } else if (
        result.data?.success === true &&
        result.data?.type === "session_limit_reached"
      ) {
        // Store user data and token for session management
        localStorage.setItem("userToken", result.data.data.token);
        const decryptedData: any = decrypt(result.data.data.user);

        const storeDate: any = {
          name: decryptedData?.name,
          userId: decryptedData?.uID,
        };

        localStorage.setItem("userData", JSON.stringify(storeDate));

        if (rememberMe) {
          localStorage.setItem("rememberMe", "true");
          localStorage.setItem("rememberedEmail", data.email);
        } else {
          localStorage.removeItem("rememberMe");
          localStorage.removeItem("rememberedEmail");
        }

        signIn();
        setIsCaptchaVerified(false);
        setCaptchaToken("");
        // Redirect to session management page
        navigation("/session-management");
        return;
      } else {
        const errorMessage =
          result.data?.message || "Login failed. Please try again.";
        showToast(errorMessage, "error");
        setIsCaptchaVerified(false);
        setCaptchaToken("");

        if (recaptchaRef.current) {
          recaptchaRef.current.reset();
        }

        setValue("email", "");
        setValue("password", "");
        localStorage.removeItem("baseUrl");
        setTimeout(() => {
          const emailField = document.querySelector(
            'input[name="email"]'
          ) as HTMLInputElement;
          if (emailField) {
            emailField.focus();
          }
        }, 100);
        return;
      }
    } catch (error) {
      showToast(
        "Network error. Please check your connection and try again.",
        "error"
      );

      setIsCaptchaVerified(false);
      setCaptchaToken("");

      if (recaptchaRef.current) {
        recaptchaRef.current.reset();
      }

      setValue("email", "");
      setValue("password", "");

      setTimeout(() => {
        const emailField = document.querySelector(
          'input[name="email"]'
        ) as HTMLInputElement;
        if (emailField) {
          emailField.focus();
        }
      }, 100);
    }
  };

  const onForgotSubmit = async ({ email }: { email: string }) => {
    if (!isForgotCaptchaVerified || !forgotCaptchaToken) {
      showToast("Please complete the security verification", "error");
      return;
    }

    try {
      const payload = {
        email: email,
        captcha: forgotCaptchaToken,
      };

      showToast(`Password reset instructions sent to ${email}`, "success");

      setIsForgotCaptchaVerified(false);
      setForgotCaptchaToken("");
      if (forgotRecaptchaRef.current) {
        forgotRecaptchaRef.current.reset();
      }

      setIsForgot(false);
    } catch (error) {
      showToast(
        "Failed to send reset instructions. Please try again.",
        "error"
      );

      setIsForgotCaptchaVerified(false);
      setForgotCaptchaToken("");
      if (forgotRecaptchaRef.current) {
        forgotRecaptchaRef.current.reset();
      }
    }
  };

  return (
    <Box
      sx={{
        height: "100vh",
        backgroundColor: "#ffffff",
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        overflow: "hidden",
      }}
    >
      {/* Main 2-Grid Layout */}
      <Box sx={{ display: "flex", height: "100vh" }}>
        {/* Left Visual Section - 2/3 width */}
        <Box
          sx={{
            flex: "0 0 66.666667%",
            height: "100vh",
            display: { xs: "none", lg: "flex" },
            flexDirection: "column",
            justifyContent: "space-between",
            padding: 4,
            position: "relative",
          }}
        >
          {/* Overlay for better text readability */}
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background:
                "linear-gradient(135deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.1) 100%)",
              zIndex: 1,
            }}
          />

          {/* Top Logo */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              zIndex: 2,
              position: "relative",
            }}
          >
            <Box
              sx={{
                width: 40,
                height: 40,
                backgroundColor: "#1877f2",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mr: 2,
              }}
            >
              <Typography
                sx={{
                  color: "white",
                  fontWeight: 700,
                  fontSize: "20px",
                }}
              >
                A
              </Typography>
            </Box>
            <Typography
              variant="h4"
              sx={{
                color: "white",
                fontWeight: 700,
                fontSize: "28px",
              }}
            >
              Ajaxter
            </Typography>
          </Box>

          {/* Main Content */}
          <Box
            sx={{
              flex: 1,
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              zIndex: 2,
              position: "relative",
              padding: 4,
            }}
          >
            {/* Left side - Text */}
            <Box sx={{ flex: "0 0 50%", pr: 4 }}>
              <Typography
                variant="h2"
                sx={{
                  color: "white",
                  fontWeight: 700,
                  fontSize: "48px",
                  lineHeight: 1.2,
                  mb: 4,
                  textShadow: "2px 2px 4px rgba(0,0,0,0.5)",
                }}
              >
                Explore the things{" "}
                <Box component="span" sx={{ color: "#FFD700" }}>
                  you love.
                </Box>
              </Typography>

              <Typography
                variant="h5"
                sx={{
                  color: "white",
                  fontWeight: 400,
                  fontSize: "24px",
                  opacity: 0.9,
                  textShadow: "1px 1px 2px rgba(0,0,0,0.5)",
                }}
              >
                Your trusted support partner for all your technical needs
              </Typography>
            </Box>
            <Box
              sx={{
                flex: "0 0 40%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                position: "relative",
              }}
            >
              <Box
                component="img"
                src={imageBackground}
                alt="Ajaxter"
                sx={{
                  width: "100%",
                  maxWidth: 500,
                  height: "auto",
                  objectFit: "contain",
                }}
              />
            </Box>
          </Box>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              zIndex: 2,
              position: "relative",
              backgroundColor: "white",
              padding: 2,
              borderRadius: "8px 8px 0 0",
              margin: "0 -16px -16px -16px",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Box
                component="img"
                src={imagePadLock}
                alt="Security Lock"
                sx={{
                  width: 32,
                  height: 32,
                  objectFit: "contain",
                }}
              />
              <Box>
                <Typography
                  variant="h6"
                  sx={{
                    color: "#1877f2",
                    fontWeight: 700,
                    fontSize: "16px",
                    mb: 0.5,
                  }}
                >
                  High security
                </Typography>
                <Divider sx={{ mb: 1, width: "80%" }} />
                <Typography
                  variant="body2"
                  sx={{ color: "#65676b", fontSize: "12px", lineHeight: 1.4 }}
                >
                  All content of the Ajaxter are TLS encrypted.
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: "#65676b", fontSize: "12px", lineHeight: 1.4 }}
                >
                  All protocols are available encrypted.
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Typography
                sx={{
                  color: "#65676b",
                  fontSize: "12px",
                  fontWeight: 400,
                }}
              >
                © 2025-{new Date().getFullYear()} | All rights reserved
              </Typography>
            </Box>
          </Box>
        </Box>

        <Box
          sx={{
            flex: "0 0 33.333333%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "100vh",
          }}
        >
          <Box
            sx={{
              width: "100%",
              maxWidth: 400,
              padding: 4,
            }}
          >
            {isForgot ? (
              <Box
                component="form"
                onSubmit={handleForgotSubmit(onForgotSubmit)}
                noValidate
              >
                <Typography
                  variant="h4"
                  sx={{ fontWeight: 700, mb: 1, color: "#1a1a1a" }}
                >
                  Forgot Password
                </Typography>
                <Typography variant="body1" sx={{ color: "#65676b", mb: 3 }}>
                  Give us your email address and instructions to reset your
                  password will be emailed to you.
                </Typography>

                <TextField
                  {...registerForgot("email")}
                  fullWidth
                  variant="outlined"
                  label="Email address"
                  sx={{
                    mb: 3,
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                      fontSize: "16px",
                      "& fieldset": {
                        borderColor: "#dadde1",
                      },
                      "&:hover fieldset": {
                        borderColor: "#1877f2",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#1877f2",
                      },
                    },
                  }}
                  error={
                    isForgotSubmitted || forgotTouched.email
                      ? !!forgotErrors.email
                      : false
                  }
                />

                <Box sx={{ mb: 3 }}>
                  {process.env.REACT_APP_GOOGLE_VISIBLE_SITE_KEY ? (
                    <GoogleRecaptcha
                      ref={forgotRecaptchaRef}
                      siteKey={process.env.REACT_APP_GOOGLE_VISIBLE_SITE_KEY}
                      onVerify={handleForgotRecaptchaVerify}
                      onError={handleForgotRecaptchaError}
                      onExpire={handleForgotRecaptchaExpire}
                      theme="light"
                      size="normal"
                    />
                  ) : (
                    <Typography
                      variant="body2"
                      sx={{ color: "error.main", p: 2 }}
                    >
                      reCAPTCHA site key not configured
                    </Typography>
                  )}
                </Box>

                <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
                  <Button
                    type="button"
                    variant="outlined"
                    onClick={() => setIsForgot(false)}
                    sx={{
                      flex: 1,
                      py: 1.5,
                      borderRadius: 2,
                      textTransform: "none",
                      fontSize: "16px",
                      fontWeight: 600,
                      borderColor: "#dadde1",
                      color: "#1a1a1a",
                      "&:hover": {
                        borderColor: "#1877f2",
                        backgroundColor: "rgba(24, 119, 242, 0.05)",
                      },
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={!isForgotCaptchaVerified}
                    sx={{
                      flex: 1,
                      py: 1.5,
                      borderRadius: 2,
                      textTransform: "none",
                      fontSize: "16px",
                      fontWeight: 600,
                      backgroundColor: "#1877f2",
                      "&:hover": {
                        backgroundColor: "#166fe5",
                      },
                      "&:disabled": {
                        backgroundColor: "rgba(0, 0, 0, 0.12)",
                        color: "rgba(0, 0, 0, 0.26)",
                      },
                    }}
                  >
                    Reset Password
                  </Button>
                </Box>
              </Box>
            ) : (
              <Box component="form" onSubmit={handleFormSubmit} noValidate>
                {/* URL Input - Hidden on mobile */}
                <TextField
                  label="Change Url"
                  variant="standard"
                  value={baseUrl}
                  onChange={handleChange}
                  size="small"
                  sx={{
                    width: 300,
                    mb: 2,
                    display: { xs: "none", sm: "block" },
                  }}
                />

                <Typography
                  variant="h5"
                  sx={{ fontWeight: 700, mb: 3, color: "#1a1a1a" }}
                >
                  Log in to Ajaxter
                </Typography>

                <TextField
                  {...register("email")}
                  fullWidth
                  variant="outlined"
                  label="Email address or mobile number"
                  sx={{
                    mb: 2,
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                      fontSize: "16px",
                      "& fieldset": {
                        borderColor: "#dadde1",
                      },
                      "&:hover fieldset": {
                        borderColor: "#1877f2",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#1877f2",
                      },
                    },
                  }}
                  autoComplete="email"
                  error={
                    isSubmitted || touchedFields.email ? !!errors.email : false
                  }
                />

                <TextField
                  {...register("password")}
                  fullWidth
                  variant="outlined"
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  sx={{
                    mb: 2,
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                      fontSize: "16px",
                      "& fieldset": {
                        borderColor: "#dadde1",
                      },
                      "&:hover fieldset": {
                        borderColor: "#1877f2",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#1877f2",
                      },
                    },
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleToggleVisibility}
                          edge="end"
                          sx={{ color: "#65676b" }}
                        >
                          {showPassword ? (
                            <VisibilityOffIcon />
                          ) : (
                            <VisibilityIcon />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  autoComplete="current-password"
                  error={
                    isSubmitted || touchedFields.password
                      ? !!errors.password
                      : false
                  }
                />

                {/* Google reCAPTCHA Security Verification */}
                <Box sx={{ mb: 2 }}>
                  {process.env.REACT_APP_GOOGLE_VISIBLE_SITE_KEY ? (
                    <GoogleRecaptcha
                      ref={recaptchaRef}
                      siteKey={process.env.REACT_APP_GOOGLE_VISIBLE_SITE_KEY}
                      onVerify={handleRecaptchaVerify}
                      onError={handleRecaptchaError}
                      onExpire={handleRecaptchaExpire}
                      theme="light"
                      size="normal"
                    />
                  ) : (
                    <Typography
                      variant="body2"
                      sx={{ color: "error.main", p: 2 }}
                    >
                      reCAPTCHA site key not configured
                    </Typography>
                  )}
                  {isCaptchaVerified &&
                    (email.trim() === "" || password.trim() === "") && (
                      <Typography
                        variant="caption"
                        sx={{ color: "#65676b", mt: 1, display: "block" }}
                      >
                        Please fill in all required fields
                      </Typography>
                    )}
                </Box>
                {/* Terms & Conditions Checkbox */}
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={termsAccepted}
                      onChange={(e) => setTermsAccepted(e.target.checked)}
                      sx={{
                        color: "#1877f2",
                        "&.Mui-checked": {
                          color: "#1877f2",
                        },
                      }}
                    />
                  }
                  label={
                    <Typography
                      variant="body2"
                      sx={{ fontSize: "14px", color: "#65676b" }}
                    >
                      I have read the{" "}
                      <Link
                        href="#"
                        sx={{
                          color: "#1877f2",
                          textDecoration: "none",
                          "&:hover": {
                            textDecoration: "underline",
                          },
                        }}
                      >
                        Terms & Conditions
                      </Link>{" "}
                      and{" "}
                      <Link
                        href="#"
                        sx={{
                          color: "#1877f2",
                          textDecoration: "none",
                          "&:hover": {
                            textDecoration: "underline",
                          },
                        }}
                      >
                        Privacy Policy
                      </Link>
                    </Typography>
                  }
                  sx={{ mb: 2, alignItems: "flex-start" }}
                />

                <Button
                  variant="contained"
                  disabled={!isFormValid || isLoading}
                  sx={{
                    width: "100%",
                    py: 1.5,
                    mb: 2,
                    borderRadius: 2,
                    textTransform: "none",
                    fontSize: "16px",
                    fontWeight: 600,
                    backgroundColor: "#1877f2",
                    "&:hover": {
                      backgroundColor: "#166fe5",
                    },
                    "&:disabled": {
                      backgroundColor: "rgba(0, 0, 0, 0.12)",
                      color: "rgba(0, 0, 0, 0.26)",
                    },
                  }}
                  type="submit"
                  onClick={handleSubmit(onSubmit)}
                >
                  {isLoading ? (
                    <CircularProgress size={20} sx={{ color: "white" }} />
                  ) : (
                    "Log in"
                  )}
                </Button>

                <Box sx={{ textAlign: "center", mb: 2 }}>
                  <Link
                    component="button"
                    underline="hover"
                    sx={{
                      color: "#1877f2",
                      fontSize: "14px",
                      fontWeight: 500,
                    }}
                    onClick={() => setIsForgot(true)}
                  >
                    Forgotten password?
                  </Link>
                </Box>

                <Divider sx={{ my: 3 }}>
                  <Typography variant="body2" sx={{ color: "#65676b", px: 2 }}>
                    or
                  </Typography>
                </Divider>

                <Button
                  variant="outlined"
                  sx={{
                    width: "100%",
                    py: 1.5,
                    mb: 3,
                    borderRadius: 2,
                    textTransform: "none",
                    fontSize: "16px",
                    fontWeight: 600,
                    borderColor: "#dadde1",
                    color: "#1a1a1a",
                    "&:hover": {
                      borderColor: "#1877f2",
                      backgroundColor: "rgba(24, 119, 242, 0.05)",
                    },
                  }}
                  onClick={() => {
                    const baseUrl =
                      process.env.REACT_APP_FRONTEND_URL ||
                      window.location.origin;
                    window.location.href = `${baseUrl}/ticket/support`;
                  }}
                >
                  <SupportAgentIcon sx={{ mr: 1, fontSize: 20 }} />
                  Login as Customer
                </Button>
              </Box>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default LoginScreen;
