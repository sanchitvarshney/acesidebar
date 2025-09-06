import {
  Box,
  Button,
  Checkbox,
  InputAdornment,
  TextField,
  Typography,
  IconButton,
  FormControlLabel,
  Link,
  Divider,
} from "@mui/material";
import { useState, useRef, useEffect } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { useForm } from "react-hook-form";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";

import { zodResolver } from "@hookform/resolvers/zod";

import z from "zod";
import { loginSchema } from "../../../zodSchema/AuthSchema";
import { useAuth } from "../../../contextApi/AuthContext";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../../hooks/useToast";
import { useLoginMutation } from "../../../services/auth";
import { decrypt } from "../../../utils/encryption";
import GoogleRecaptcha, { GoogleRecaptchaRef } from "../../../components/reusable/GoogleRecaptcha";

type RegisterFormData = z.infer<typeof loginSchema>;

const LoginComponent = () => {
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
  const [isForgotCaptchaVerified, setIsForgotCaptchaVerified] = useState<boolean>(false);
  const [rememberMe, setRememberMe] = useState<boolean>(false);
  const recaptchaRef = useRef<GoogleRecaptchaRef>(null);
  const forgotRecaptchaRef = useRef<GoogleRecaptchaRef>(null);

  // Watch form values for validation
  const watchedValues = watch();
  const email = watchedValues.email || "";
  const password = watchedValues.password || "";

  // Check if form is valid and reCAPTCHA is verified
  const isFormValid = email.trim() !== "" && password.trim() !== "" && isCaptchaVerified;

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
    // Only show error toast if it's not a temporary verification issue
    if (!error.includes('verification')) {
      showToast("Please complete the security verification", "error");
    }
  };

  const handleRecaptchaExpire = () => {
    setIsCaptchaVerified(false);
    setCaptchaToken("");
    showToast("Security verification expired.\nPlease complete the verification again.", "error");
  };

  // Forgot password captcha handlers
  const handleForgotRecaptchaVerify = (token: string) => {
    setForgotCaptchaToken(token);
    setIsForgotCaptchaVerified(true);
  };

  const handleForgotRecaptchaError = (error: string) => {
    setIsForgotCaptchaVerified(false);
    setForgotCaptchaToken("");
    if (!error.includes('verification')) {
      showToast("Please complete the security verification", "error");
    }
  };

  const handleForgotRecaptchaExpire = () => {
    setIsForgotCaptchaVerified(false);
    setForgotCaptchaToken("");
    showToast("Security verification expired.\nPlease complete the verification again.", "error");
  };


  const handleFormSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // Let react-hook-form handle the submission
  };

  const onSubmit = async (data: RegisterFormData) => {
    // Additional verification check
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

      // Check if the response indicates success
      if (result.data?.success === true) {
        // Store token and user data
        localStorage.setItem("userToken", result.data.data.token);
        const decryptedData = JSON.stringify(decrypt(result.data.data.user));
        localStorage.setItem("userData", decryptedData);
        
        // Handle "Remember me" functionality
        if (rememberMe) {
          // Store remember me preference
          localStorage.setItem("rememberMe", "true");
          localStorage.setItem("rememberedEmail", data.email);
        } else {
          // Clear remember me data if not checked
          localStorage.removeItem("rememberMe");
          localStorage.removeItem("rememberedEmail");
        }
        
        signIn();

        setIsCaptchaVerified(false);
        setCaptchaToken("");

        navigation("/");
        return;
        } else {
          const errorMessage = result.data?.message || "Login failed. Please try again.";
          showToast(errorMessage, "error");
          
          // Reset form fields and captcha on login failure
          setIsCaptchaVerified(false);
          setCaptchaToken("");
          
          // Reset reCAPTCHA
          if (recaptchaRef.current) {
            recaptchaRef.current.reset();
          }
          
          // Reset form to empty values
          setValue("email", "");
          setValue("password", "");
          
          // Focus on username field
          setTimeout(() => {
            const emailField = document.querySelector('input[name="email"]') as HTMLInputElement;
            if (emailField) {
              emailField.focus();
            }
          }, 100);
          return;
        }
    } catch (error) {
      showToast("Network error. Please check your connection and try again.", "error");
      
      // Reset form fields and captcha on login failure
      setIsCaptchaVerified(false);
      setCaptchaToken("");
      
      // Reset reCAPTCHA
      if (recaptchaRef.current) {
        recaptchaRef.current.reset();
      }
      
      // Reset form to empty values
      setValue("email", "");
      setValue("password", "");
      
      // Focus on username field
      setTimeout(() => {
        const emailField = document.querySelector('input[name="email"]') as HTMLInputElement;
        if (emailField) {
          emailField.focus();
        }
      }, 100);
    }
  };

  const onForgotSubmit = async ({ email }: { email: string }) => {
    // Check captcha verification
    if (!isForgotCaptchaVerified || !forgotCaptchaToken) {
      showToast("Please complete the security verification", "error");
      return;
    }

    try {
      // TODO: wire with backend forgot-password endpoint
      // Include captcha token in the request
      const payload = {
        email: email,
        captcha: forgotCaptchaToken,
      };
      
      // For now, just show success message
      showToast(`Password reset instructions sent to ${email}`, "success");
      
      // Reset captcha and form
      setIsForgotCaptchaVerified(false);
      setForgotCaptchaToken("");
      if (forgotRecaptchaRef.current) {
        forgotRecaptchaRef.current.reset();
      }
      
      setIsForgot(false);
    } catch (error) {
      showToast("Failed to send reset instructions. Please try again.", "error");
      
      // Reset captcha on error
      setIsForgotCaptchaVerified(false);
      setForgotCaptchaToken("");
      if (forgotRecaptchaRef.current) {
        forgotRecaptchaRef.current.reset();
      }
    }
  };

  return isForgot ? (
    <Box
      component="form"
      onSubmit={handleForgotSubmit(onForgotSubmit)}
      noValidate
      sx={{ p: 0 }}
    >
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
        Forgot Password
      </Typography>
      <Typography variant="body2" sx={{ color: "text.secondary", mb: 2 }}>
        Give us your email address and instructions to reset your password will
        be emailed to you.
      </Typography>
      <TextField
        {...registerForgot("email")}
        fullWidth
        variant="outlined"
        label="Your e-mail address"
        sx={{ mb: 2, borderRadius: 1 }}
        error={
          isForgotSubmitted || forgotTouched.email
            ? !!forgotErrors.email
            : false
        }
        helperText={
          isForgotSubmitted || forgotTouched.email
            ? forgotErrors.email?.message
            : ""
        }
      />
      
      {/* reCAPTCHA for forgot password */}
      <Box
        sx={{
          minHeight: '70px',
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'flex-start',
          mb: 1,
        }}
      >
        <Box
          sx={{
            minHeight: '65px',
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'flex-start',
            minWidth: '304px',
          }}
        >
          {process.env.REACT_APP_GOOGLE_SITE_KEY ? (
            <GoogleRecaptcha
              ref={forgotRecaptchaRef}
              siteKey={process.env.REACT_APP_GOOGLE_SITE_KEY}
              onVerify={handleForgotRecaptchaVerify}
              onError={handleForgotRecaptchaError}
              onExpire={handleForgotRecaptchaExpire}
              theme="light"
              size="normal"
            />
          ) : (
            <Typography variant="body2" sx={{ color: "error.main", p: 2 }}>
              reCAPTCHA site key not configured
            </Typography>
          )}
        </Box>
      </Box>
      
      <Box sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}>
        <Button
          type="button"
          variant="contained"
          onClick={() => setIsForgot(false)}
          sx={{
            bgcolor: "#000",
            color: "#fff",
            textTransform: "none",
            px: 3,
            "&:hover": { bgcolor: "#111" },
          }}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="contained"
          disabled={!isForgotCaptchaVerified}
          sx={{ 
            textTransform: "none", 
            px: 3,
            "&:disabled": {
              backgroundColor: "rgba(0, 0, 0, 0.12)",
              color: "rgba(0, 0, 0, 0.26)",
            },
          }}
        >
          Reset my password
        </Button>
      </Box>
    </Box>
  ) : (
    <Box
      component="form"
      onSubmit={handleFormSubmit}
      noValidate
      sx={{ p: 0 }}
    >
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
        Login to the support portal
      </Typography>
      <Typography variant="body2" sx={{ color: "text.secondary", mb: 2 }}>
        Enter the details below
      </Typography>
      <Box>
        <TextField
          {...register("email")}
          fullWidth
          id="standard-basic"
          variant="outlined"
          label="Your e-mail address"
          sx={{ mb: 2, borderRadius: 1 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <EmailIcon />
              </InputAdornment>
            ),
          }}
          autoComplete="email"
          error={isSubmitted || touchedFields.email ? !!errors.email : false}
          helperText={
            isSubmitted || touchedFields.email ? errors.email?.message : ""
          }
        />
      </Box>
      <Box sx={{ width: "100%", display: "flex", flexDirection: "column" }}>
        <TextField
          {...register("password")}
          fullWidth
          id="standard-password"
          label="Password"
          variant="outlined"
          type={showPassword ? "text" : "password"}
          sx={{ mb: 1, borderRadius: 1 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <LockIcon />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleToggleVisibility}
                  edge="end"
                  sx={{ color: "#1a73e8" }}
                >
                  {showPassword ? (
                    <VisibilityOffIcon sx={{ color: "#1a73e8" }} />
                  ) : (
                    <VisibilityIcon sx={{ color: "#1a73e8" }} />
                  )}
                </IconButton>
              </InputAdornment>
            ),
          }}
          autoComplete="current-password"
          error={
            isSubmitted || touchedFields.password ? !!errors.password : false
          }
          helperText={
            isSubmitted || touchedFields.password
              ? errors.password?.message
              : ""
          }
        />
      </Box>
      
      {/* Google reCAPTCHA Security Verification */}
      <Box 
        sx={{ 
          mb: 2, 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'flex-start',
          }}
        >
          <Box
            sx={{
              minWidth: '304px',
              display: 'flex',
              justifyContent: 'flex-start',
            }}
          >
            {process.env.REACT_APP_GOOGLE_SITE_KEY ? (
              <GoogleRecaptcha
                ref={recaptchaRef}
                siteKey={process.env.REACT_APP_GOOGLE_SITE_KEY}
                onVerify={handleRecaptchaVerify}
                onError={handleRecaptchaError}
                onExpire={handleRecaptchaExpire}
                theme="light"
                size="normal"
              />
            ) : (
              <Typography variant="body2" sx={{ color: "error.main", p: 2 }}>
                reCAPTCHA site key not configured
              </Typography>
            )}
          </Box>
          {isCaptchaVerified && (email.trim() === "" || password.trim() === "") && (
            <Typography variant="caption" sx={{ color: "text.secondary", mt: 1, textAlign: "center" }}>
              Please fill in all required fields
            </Typography>
          )}
        </Box>
      
      <FormControlLabel
        control={<Checkbox size="small" defaultChecked />}
        label={
          <Typography variant="body2">Remember me on this computer</Typography>
        }
        sx={{ my: 1 }}
      />
      
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mt: 1,
        }}
      >
        <Link
          component="button"
          underline="hover"
          sx={{ color: "#1a73e8" }}
          onClick={() => setIsForgot(true)}
        >
          Forgot your password?
        </Link>
        {isLoading ? (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CircularProgress color="success" size={"28px"} />
          </Box>
        ) : (
          <Button
            variant="contained"
            color="primary"
            disabled={!isFormValid || isLoading}
            sx={{
              px: 3,
              py: 1,
              fontWeight: 600,
              fontSize: 15,
              borderRadius: 1.5,
              boxShadow: "0 2px 8px rgba(99,102,241,0.10)",
              "&:hover": { background: "#1c5fba" },
              "&:disabled": {
                backgroundColor: "rgba(0, 0, 0, 0.12)",
                color: "rgba(0, 0, 0, 0.26)",
              },
            }}
            type="submit"
            onClick={handleSubmit(onSubmit)}
          >
            Login
          </Button>
        )}
      </Box>
      <Divider sx={{ my: 2 }} />
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <SupportAgentIcon fontSize="small" sx={{ color: "text.secondary" }} />
        <Typography variant="body2">
          Are you not an agent?{" "}
          <Link
            component="button"
            underline="hover"
            onClick={() => {
              const baseUrl =
                process.env.REACT_APP_FRONTEND_URL || window.location.origin;
              window.location.href = `${baseUrl}/ticket/support`;
            }}
          >
            Login here
          </Link>
        </Typography>
      </Box>
    </Box>
  );
};

export default LoginComponent;
