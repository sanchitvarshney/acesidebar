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
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { loginSchema } from "../../zodSchema/AuthSchema";
import { useAuth } from "../../contextApi/AuthContext";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../hooks/useToast";
import { useLoginMutation, useLazyLoginPrecheckQuery } from "../../services/auth";
import { decrypt } from "../../utils/encryption";
import GoogleIcon from "@mui/icons-material/Google";
import VpnLockIcon from "@mui/icons-material/VpnLock";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ErrorIcon from '@mui/icons-material/Error';

import GoogleRecaptcha, {
  GoogleRecaptchaRef,
} from "../../components/reusable/GoogleRecaptcha";
import { sessionManager } from "../../utils/SessionManager";

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
  const [showLoginForm, setShowLoginForm] = useState<boolean>(false);
  const [companyName, setCompanyName] = useState<string>("COM0001");
  const [companyNameTouched, setCompanyNameTouched] = useState<boolean>(false);
  const [companyNameSubmitted, setCompanyNameSubmitted] = useState<boolean>(false);
  const [triggerLoginPrecheck, { isFetching: isPrecheckLoading }] = useLazyLoginPrecheckQuery();
  const [precheckError, setPrecheckError] = useState<string>("");
  const [brandName, setBrandName] = useState<string>("Ajaxter");
  const [isStep2Loading, setIsStep2Loading] = useState<boolean>(false);

  // Decide which step to show based on current host
  useEffect(() => {
    const host = window.location.hostname.split(":")[0];
    const isTmsHost = host.startsWith("tms.");
    if (isTmsHost) {
      setShowLoginForm(false); // show step 1 (domain entry)
    } else {
      setShowLoginForm(true); // show step 2 (login) for non-tms hosts (incl. localhost)
      setIsStep2Loading(true);
    }
  }, []);

  // On step 2 (non tms hosts), fetch and set brand name from tenant subdomain; on error redirect to tms host
  useEffect(() => {
    const { hostname } = window.location;
    const host = hostname.split(":")[0];
    const isTmsHost = host.startsWith("tms.");
    if (isTmsHost) return;

    // Determine tenant from subdomain
    const parts = host.split(".");
    let tenantSub = "";
    if (host === "localhost") {
      tenantSub = ""; // no tenant for plain localhost
    } else if (host.endsWith(".localhost")) {
      // e.g., tenant.localhost
      tenantSub = parts.length >= 2 ? parts[0] : "";
    } else {
      // e.g., tenant.example.com or a.b.c.example.com
      tenantSub = parts[0];
    }

    if (!tenantSub) {
      // Plain localhost: no tenant precheck, show form immediately
      setIsStep2Loading(false);
      return;
    }

    if (tenantSub) {
      (async () => {
        try {
          const res: any = await triggerLoginPrecheck({ tenant: tenantSub });
          if (res?.data?.success && res?.data?.data?.name) {
            setBrandName(res.data.data.name);
            setIsStep2Loading(false);
          } else {
            // Redirect back to tms host on failure
            const { protocol, port } = window.location;
            const parts = host.split('.');
            const isLocalLike = host === "localhost" || host.endsWith(".localhost");
            const apexDomain = isLocalLike
              ? "localhost"
              : (parts.length > 2 ? parts.slice(-2).join('.') : host);
            const targetHost = isLocalLike
              ? `tms.${apexDomain}${port ? `:${port}` : ""}`
              : `tms.${apexDomain}`;
            window.location.href = `${protocol}//${targetHost}`;
          }
        } catch {
          const { protocol, port } = window.location;
          const parts = host.split('.');
          const isLocalLike = host === "localhost" || host.endsWith(".localhost");
          const apexDomain = isLocalLike
            ? "localhost"
            : (parts.length > 2 ? parts.slice(-2).join('.') : host);
          const targetHost = isLocalLike
            ? `tms.${apexDomain}${port ? `:${port}` : ""}`
            : `tms.${apexDomain}`;
          window.location.href = `${protocol}//${targetHost}`;
        }
      })();
    }
  }, [triggerLoginPrecheck]);

  // Get dynamic domain suffix from current window host
  const getDynamicDomain = () => {
    const { hostname, port } = window.location;
    const domain = hostname.split(':')[0];
    const endsWithLocalhost = domain === 'localhost' || domain.endsWith('.localhost');
    if (endsWithLocalhost) {
      // Always show localhost with port (if any) and no leading dot
      return port ? `localhost:${port}` : 'localhost';
    }
    // Extract apex domain (e.g., app.example.com -> .example.com)
    const parts = domain.split('.');
    if (parts.length > 2) {
      return `.${parts.slice(-2).join('.')}`;
    }
    return `.${domain}`;
  };

  const handleChange = (event: any) => {
    setBaseUrl(event.target.value as string);
  };

  const handleDomainNext = async () => {
    setCompanyNameSubmitted(true);
    const trimmedName = companyName.trim();
    setPrecheckError("");

    if (!trimmedName) {
      setPrecheckError("Please enter a company name");
      return;
    }

    // Validate minimum length
    if (trimmedName.length < 3) {
      setPrecheckError("Company name must be at least 3 characters");
      return;
    }

    // Validate maximum length
    if (trimmedName.length > 15) {
      setPrecheckError("Company name must be at most 15 characters");
      return;
    }

    // Validate company name format: alphanumeric and hyphens only
    const companyPattern = /^[a-zA-Z0-9-]+$/;
    if (!companyPattern.test(trimmedName)) {
      setPrecheckError("Company name can only contain letters, numbers, and hyphens");
      return;
    }

    // Redirect to tenant.HOSTNAME[:PORT] immediately
    const tenant = trimmedName;
    const { protocol, hostname, port } = window.location;
    const hostWithoutPort = hostname.split(":")[0];
    const isLocalLike = hostWithoutPort === "localhost" || hostWithoutPort.endsWith(".localhost");
    const apexDomain = (() => {
      if (isLocalLike) return "localhost";
      const parts = hostWithoutPort.split('.')
      return parts.length > 2 ? parts.slice(-2).join('.') : hostWithoutPort;
    })();
    const targetHost = isLocalLike
      ? `${tenant}.${apexDomain}${port ? `:${port}` : ""}`
      : `${tenant}.${apexDomain}`;
    window.location.href = `${protocol}//${targetHost}`;
  };

  const handleGoBack = () => {
    // Redirect to tms.HOSTNAME (or tms.localhost:PORT on localhost)
    const { protocol, hostname, port } = window.location;
    const hostWithoutPort = hostname.split(":")[0];
    const isLocalLike = hostWithoutPort === "localhost" || hostWithoutPort.endsWith(".localhost");
    const apexDomain = (() => {
      if (isLocalLike) return "localhost";
      const parts = hostWithoutPort.split('.')
      return parts.length > 2 ? parts.slice(-2).join('.') : hostWithoutPort;
    })();
    const targetHost = isLocalLike
      ? `tms.${apexDomain}${port ? `:${port}` : ""}`
      : `tms.${apexDomain}`;

    window.location.href = `${protocol}//${targetHost}`;
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

  // Generate session ID when component mounts (when someone visits login page)
  useEffect(() => {
    // Create a new session when someone visits the login page
    const session = sessionManager.createSession();
    console.log("Login page visited - Session created:", session.sessionId);

    // Cleanup function to stop session checking when component unmounts
    return () => {
      // Don't clear session here as user might navigate away temporarily
      // Session will be managed by SessionManager
    };
  }, []);

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

    // Check if session is expired before proceeding with login
    const isSessionValid = sessionManager.checkSessionExpiration();
    if (!isSessionValid) {
      // Session expired, user will be redirected to session expired page
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
        width: "100vw",
        backgroundColor: "#1877f2",
        display: "flex",
        padding: { xs: 2, md: 4 },
        overflow: "hidden",
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
      }}
    >
      {/* Main Layout - Split Screen */}
      <Box
        id="main-login-screen"
        sx={{
          display: "flex",
          width: "100%",
          height: "100%",
          backgroundColor: "#ffffff",
          borderRadius: { xs: 2, md: 3 },
          overflow: "hidden",
          boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
          position: "relative",
        }}
      >
        {showLoginForm && isStep2Loading && (
          <Box sx={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#ffffff', zIndex: 10 }}>
            <CircularProgress />
          </Box>
        )}
        {/* Left Section - Login Form */}
        <Box
          sx={{
            flex: { xs: "1", md: "0 0 45%" },
            backgroundColor: "#ffffff",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: { xs: 3, md: 6 },
            position: "relative",
            overflow: "auto",
            maxHeight: "100%",
          }}
        >
          {/* Logo - Top Left */}
          <Box
            sx={{
              position: "absolute",
              top: { xs: 24, md: 40 },
              left: { xs: 24, md: 40 },
              display: "flex",
              alignItems: "center",
              gap: 1,
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
              id="ajaxter-brand"
              variant="h4"
              sx={{
                color: "#1a1a1a",
                fontWeight: 700,
                fontSize: "28px",
              }}
            >
              {brandName}
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
            <Box sx={{ flex: "0 0 100%", pr: 4 }}>
              <Typography
                variant="h4"
                sx={{
                  color: "#ccc",
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
                variant="h6"
                sx={{
                  color: "#ddd",
                  fontWeight: 400,
                  fontSize: "24px",
                  opacity: 0.9,
                  textShadow: "1px 1px 2px rgba(0,0,0,0.5)",
                }}
              >
                Your trusted support partner for all your technical needs
              </Typography>
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
          </Box>
        </Box>

        <Box
          sx={{
            flex: "0 0 65%",
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-start",
            minHeight: "100vh",
            paddingLeft: { xs: 2, md: 6 },
          }}
        >
          {showLoginForm && isStep2Loading ? (
            <Box sx={{ flex: 1, width: "100%", display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CircularProgress />
            </Box>
          ) : (
            <Box
              sx={{
                width: "60%",
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
                    <IconButton
                      onClick={() => setIsForgot(false)}
                      sx={{
                        color: "#1877f2",
                        padding: "8px",
                        border: "1px solid #e0e0e0",
                        backgroundColor: "#ffffff",
                        borderRadius: "8px",
                        "&:hover": {
                          backgroundColor: "rgba(24, 119, 242, 0.08)",
                          borderColor: "#1877f2",
                        },
                      }}
                    >
                      <ArrowBackIcon sx={{ fontSize: 24 }} />
                    </IconButton>
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
              ) : !showLoginForm ? (
                // Domain Entry Step
                <Box>
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
                    Secure Login to Your Account
                    <Typography variant="body2" sx={{ color: "#65676b", mb: 3 }}>Please enter your Ajaxter domain name and we’ll help you out!

                    </Typography>
                  </Typography>


                  <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="company name"
                    value={companyName}
                    onChange={(e) => {
                      const value = e.target.value;
                      let filteredValue = value.replace(/[^a-zA-Z0-9]/g, '');
                      filteredValue = filteredValue.replace(/-+$/, '');
                      if (filteredValue.length <= 15) {
                        setCompanyName(filteredValue);
                      }
                    }}
                    onBlur={() => setCompanyNameTouched(true)}
                    error={
                      (companyNameSubmitted || companyNameTouched) && !companyName.trim()
                        ? true
                        : false
                    }
                    inputProps={{
                      maxLength: 15,
                    }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <VpnLockIcon
                            sx={{
                              color: (companyNameSubmitted || companyNameTouched) && !companyName.trim()
                                ? "#d32f2f"
                                : "#1877f2"
                            }}
                          />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end" sx={{ margin: 0, height: "100%" }}>
                          <Box
                            sx={{
                              backgroundColor: "#f5f5f5",
                              padding: "0 14px",
                              minHeight: "56px",
                              marginLeft: "12px",
                              marginRight: "-1px",
                              borderLeft: "1px solid #e0e0e0",
                              height: "100%",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              boxSizing: "border-box",
                            }}
                          >
                            <Typography
                              sx={{
                                color: "#666",
                                fontWeight: 500,
                                fontSize: "16px",
                                whiteSpace: "nowrap",
                                lineHeight: 1.5,
                              }}
                            >
                              {getDynamicDomain()}
                            </Typography>
                          </Box>
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      mb: 3,
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                        fontSize: "16px",
                        paddingRight: "0 !important",
                        overflow: "hidden",
                        "& fieldset": {
                          borderColor: "#dadde1",
                        },
                        "&:hover fieldset": {
                          borderColor: "#1877f2",
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: "#1877f2",
                        },
                        "&.Mui-error fieldset": {
                          borderColor: "#d32f2f",
                        },
                        "&.Mui-error:hover fieldset": {
                          borderColor: "#d32f2f",
                        },
                        "&.Mui-error.Mui-focused fieldset": {
                          borderColor: "#d32f2f",
                        },
                      },
                      "& .MuiOutlinedInput-input": {
                        paddingRight: "12px !important",
                      },
                      "& .MuiInputAdornment-root": {
                        height: "100%",
                        maxHeight: "none",
                      },
                    }}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        handleDomainNext();
                      }
                    }}
                  />

                  {precheckError && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                      <ErrorIcon sx={{ color: '#d32f2f', fontSize: 16 }} />
                      <Typography variant="caption" sx={{ color: '#d32f2f' }}>
                        {precheckError}
                      </Typography>
                    </Box>
                  )}

                  <Button
                    variant="contained"
                    fullWidth
                    onClick={handleDomainNext}
                    disabled={
                      isPrecheckLoading ||
                      !companyName.trim() ||
                      companyName.trim().length < 3 ||
                      companyName.trim().length > 15
                    }
                    endIcon={<ArrowForwardIcon />}
                    sx={{
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
                    {isPrecheckLoading ? (
                      <CircularProgress size={20} sx={{ color: "white" }} />
                    ) : (
                      "Next"
                    )}
                  </Button>
                </Box>
              ) : (
                // Step 2: Show loader until tenant precheck completes
                <Box sx={{ width: "100%" }}>
                  {isStep2Loading ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', py: 10 }}>
                      <CircularProgress />
                    </Box>
                  ) : (
                    <Box component="form" onSubmit={handleFormSubmit} noValidate sx={{ width: "100%" }}>
                      <Typography
                        variant="h5"
                        sx={{ fontWeight: 700, mb: 3, color: "#1a1a1a" }}
                      >
                        Login to Access Your Account
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
                        sx={{ mb: 2, display: "flex", justifyContent: "flex-start", alignItems: "center" }}
                      />

                      {/* Back Button and Login Button in Same Line */}
                      <Box sx={{ mb: 2, display: "flex", gap: 2, alignItems: "center" }}>
                        <IconButton
                          onClick={handleGoBack}
                          sx={{
                            color: "#1877f2",
                            padding: "8px",
                            border: "1px solid #e0e0e0",
                            backgroundColor: "#ffffff",
                            borderRadius: "8px",
                            flexShrink: 0,
                            "&:hover": {
                              backgroundColor: "rgba(24, 119, 242, 0.08)",
                              borderColor: "#1877f2",
                            },
                          }}
                        >
                          <ArrowBackIcon sx={{ fontSize: 24 }} />
                        </IconButton>

                        <Button
                          variant="contained"
                          disabled={!isFormValid || isLoading}
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
                          type="submit"
                          onClick={handleSubmit(onSubmit)}
                        >
                          {isLoading ? (
                            <CircularProgress size={20} sx={{ color: "white" }} />
                          ) : (
                            "Log in"
                          )}
                        </Button>
                      </Box>

                      <Box sx={{ textAlign: "left", mb: 2, display: "flex", gap: 2, justifyContent: "flex-start", alignItems: "center", flexWrap: "wrap" }}>
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
                          Forgot Username?
                        </Link>
                        <Divider orientation="vertical" flexItem sx={{ height: 20, borderColor: "#dadde1", borderRightWidth: 2 }} />
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
                          Forgot/Reset Password?
                        </Link>
                      </Box>
                    </Box>
                  )}
                </Box>
              )}
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default LoginScreen;
