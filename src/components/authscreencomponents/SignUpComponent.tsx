import {
  Box,
  Button,
  Checkbox,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import PersonIcon from "@mui/icons-material/Person";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import PhoneIphoneIcon from "@mui/icons-material/PhoneIphone";
import SyncLockIcon from "@mui/icons-material/SyncLock";
import { signUpSchema } from "../../zodSchema/AuthSchema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { useNavigate } from "react-router-dom";

const criteria = [
  {
    label: "At least 8 characters",
    test: (pw: string) => /.{8,}/.test(pw),
  },
  {
    label: "One uppercase letter",
    test: (pw: string) => /[A-Z]/.test(pw),
  },
  {
    label: "One lowercase letter",
    test: (pw: string) => /[a-z]/.test(pw),
  },
  {
    label: "One number",
    test: (pw: string) => /[0-9]/.test(pw),
  },
  {
    label: "One special character",
    test: (pw: string) => /[^A-Za-z0-9]/.test(pw),
  },
];

type RegisterFormData = z.infer<typeof signUpSchema>;
const SignUpComponent = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitted, touchedFields },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(signUpSchema),
    mode: "onChange",
  });

  const [showPassword, setShowPassword] = useState<boolean>(false);

  const handleToggleVisibility = () => {
    setShowPassword((prev) => !prev);
  };
  const onSubmit = (data: RegisterFormData) => {
    console.log("✅ Submitted Data:", data);
  };

  const password = watch("password");
  console.log(password);
  const strength = criteria.reduce(
    (acc, curr) => acc + (curr.test(password) ? 1 : 0),
    0
  );

  const getPasswordStrengthMessage = () => {
    if (!password) return "";
    if (strength <= 2) return "Password is weak";
    if (strength <= 4) return "Password is moderate";
    if (strength === 5) return "Password is strong";
    return "";
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      sx={{
        flex: 0.5,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        p: { xs: 0, sm: 2, md: 4 },
        minWidth: { xs: "100%", md: 350 },
      }}
    >
      <PersonIcon sx={{ fontSize: 60, color: "#6366f1" }} />
      <Typography variant="h6" sx={{ mt: 1, mb: 1, fontWeight: 600 }}>
        Register Your Account
      </Typography>
      <Box sx={{ width: "100%" }}>
        <TextField
          {...register("name")}
          fullWidth
          id="standard-basic"
          variant="outlined"
          label="Full Name"
          sx={{ mt: 1, mb: 1, borderRadius: 2 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <AccountCircleIcon />
              </InputAdornment>
            ),
          }}
          autoComplete="fullName"
          autoFocus
          error={isSubmitted || touchedFields.name ? !!errors.name : false}
          helperText={
            isSubmitted || touchedFields.name ? errors.name?.message : ""
          }
        />
      </Box>
      <Box sx={{ width: "100%" }}>
        <TextField
          {...register("email")}
          fullWidth
          id="standard-basic"
          variant="outlined"
          label="Email"
          sx={{ mt: 1, mb: 1, borderRadius: 2 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <EmailIcon />
              </InputAdornment>
            ),
          }}
          autoComplete="email"
          autoFocus
          error={isSubmitted || touchedFields.email ? !!errors.email : false}
          helperText={
            isSubmitted || touchedFields.email ? errors.email?.message : ""
          }
        />
      </Box>
      <Box sx={{ width: "100%" }}>
        <TextField
          {...register("mobileNo")}
          fullWidth
          type="tel"
          id="standard-basic"
          variant="outlined"
          label="Mobile Number"
          sx={{ mt: 1, mb: 1, borderRadius: 2 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <PhoneIphoneIcon />
              </InputAdornment>
            ),
          }}
          onKeyPress={(e) => {
            if (!/[0-9]/.test(e.key)) {
              e.preventDefault(); // block non-numeric keys
            }
          }}
          autoComplete="number"
          autoFocus
          error={
            isSubmitted || touchedFields.mobileNo ? !!errors.mobileNo : false
          }
          helperText={
            isSubmitted || touchedFields.mobileNo
              ? errors.mobileNo?.message
              : ""
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
          sx={{ mt: 1, borderRadius: 2 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <LockIcon />
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
      <Box sx={{ width: "100%", display: "flex", flexDirection: "column" }}>
        <TextField
          {...register("confirmPassword")}
          fullWidth
          id="standard-password"
          label="Comfirm Password"
          variant="outlined"
          type={showPassword ? "text" : "password"}
          sx={{ mt: 2, borderRadius: 2 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SyncLockIcon />
              </InputAdornment>
            ),
          }}
          autoComplete="comfirm-password"
          error={
            isSubmitted || touchedFields.confirmPassword
              ? !!errors.confirmPassword
              : false
          }
          helperText={
            isSubmitted || touchedFields.confirmPassword
              ? errors.confirmPassword?.message
              : ""
          }
        />
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            mt: 1,
            justifyContent: "space-between",
            gap: 1,
            cursor: "pointer",
            userSelect: "none",
          }}
          onClick={handleToggleVisibility}
        >
          <Typography
            sx={{
              color: !password
                ? "inherit"
                : strength <= 2
                  ? "red"
                  : strength <= 4
                    ? "orange"
                    : "green",
              fontSize: 13,
              mt: 0.5,
              minHeight: "18px",
            }}
          >
            {getPasswordStrengthMessage()}
          </Typography>
          <Box sx={{
            display: "flex",
            alignItems: "center",
          }}>
            <Checkbox color="success" checked={showPassword} sx={{ p: 0.5 }} />
            <Typography
              sx={{ fontSize: 14, color: "#6366f1", fontWeight: 500 }}
            >
              {showPassword ? "Hide" : "Show"} Password
            </Typography>
          </Box>
        </Box>
      </Box>
      <Button
        variant="contained"
        color="primary"
        fullWidth
        sx={{
          mt: 3,
          py: 1.2,
          fontWeight: 600,
          fontSize: 17,
          borderRadius: 2,
          boxShadow: "0 2px 8px rgba(99,102,241,0.10)",
          transition: "background 0.2s",
          "&:hover": { background: "#6366f1" },
        }}
        size="large"
        type="submit"
      >
        SignUp
      </Button>
      <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
        <Typography> </Typography>
        <Typography>Already have an account? </Typography>
        <Typography
          //   variant="text"
          sx={{
            color: "#6366f1",
            fontWeight: 500,
            fontSize: 16,
            ml: 0.5,
            textTransform: "none",
            cursor: "pointer",
            "&:hover": {
              bgcolor: "transparent",
              textDecoration: "underline",
            },
          }}
          onClick={() => navigate("/login")}
        >
          Login
        </Typography>
      </Box>
    </Box>
  );
};

export default SignUpComponent;
