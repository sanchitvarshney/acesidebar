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
import { useState, useRef } from "react";
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
  const recaptchaRef = useRef<GoogleRecaptchaRef>(null);

  // Watch form values for validation
  const watchedValues = watch();
  const email = watchedValues.email || "";
  const password = watchedValues.password || "";

  // Check if form is valid and reCAPTCHA is verified
  const isFormValid = email.trim() !== "" && password.trim() !== "" && isCaptchaVerified;

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

      if (result.data?.data?.token && result.data?.data?.user) {
        localStorage.setItem("userToken", result.data.data.token);

        // Store user data
        // localStorage.setItem("userData", JSON.stringify(result.data.data.user));
        const decryptedData = JSON.stringify(decrypt(result.data.data.user));

        localStorage.setItem("userData", decryptedData);
        // Update auth context
        signIn();

        // Show success message
        showToast("Login successful!", "success");

        // Reset reCAPTCHA verification for next login
        setIsCaptchaVerified(false);
        setCaptchaToken("");

        // Navigate to home
        navigation("/");
      }
    } catch (error) {
      showToast("Login failed. Please try again.", "error");
      
      // Reset form fields and captcha on login failure
      setIsCaptchaVerified(false);
      setCaptchaToken("");
      
      // Reset reCAPTCHA
      if (recaptchaRef.current) {
        recaptchaRef.current.reset();
      }
      
      // Reset form to default values
      setValue("email", "admin123");
      setValue("password", "Shiv@123456");
      
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
    // TODO: wire with backend forgot-password endpoint
    showToast(`Password reset instructions sent to ${email}`, "success");
    setIsForgot(false);
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
          sx={{ textTransform: "none", px: 3 }}
        >
          Reset my password
        </Button>
      </Box>
    </Box>
  ) : (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
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
