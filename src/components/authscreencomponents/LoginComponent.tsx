import {
  Box,
  Button,
  Checkbox,
  InputAdornment,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { useEffect, useState } from "react";
import PersonIcon from "@mui/icons-material/Person";
import CircularProgress from "@mui/material/CircularProgress";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "../../zodSchema/AuthSchema";
import z from "zod";
import { useLoginMutation } from "../../services/auth";
import { useToast } from "../../hooks/useToast";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contextApi/AuthContext";

type RegisterFormData = z.infer<typeof loginSchema>;

const LoginComponent = () => {
  const { signIn } = useAuth();
  const navigation = useNavigate();
  const {
    // setValue,
    register,
    handleSubmit,
    formState: { errors, isSubmitted, touchedFields },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
  });
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const { showToast } = useToast();
  const [login, { isLoading, error, data }] = useLoginMutation();

  const handleToggleVisibility = () => {
    setShowPassword((prev) => !prev);
  };
  console.log(data?.data?.token);
  // useEffect(() => {
  //   if (!error) return;

  //   if ("status" in error) {
  //     const errData = error.data as { message?: string };
  //     showToast(errData?.message || "Something went wrong", "error");
  //   } else if ("message" in error) {
  //     showToast(error.message || "An unexpected error occurred", "error");
  //   }
  // }, [error]);

  // useEffect(() => {
  //   if (!data) return;

  //   localStorage.setItem("userToken", JSON.stringify(data.data));

  //   showToast("Login successful!", "success");
  //   // signIn();

  //   navigation("/");
  // }, [data]);

  const onSubmit = async (data: RegisterFormData) => {
    try {
      const payload = {
        username: data.email,
        password: data.password,
      };
      console.log("payload", payload);
      const result = await login(payload);

      if (result.data?.data?.token) {
        // Store the token
        localStorage.setItem("userToken", result.data.data.token);

        // Update auth context
        signIn();

        // Show success message
        showToast("Login successful!", "success");

        // Navigate to home
        navigation("/");
      }
    } catch (error) {
      console.error("Error logging in:", error);
      showToast("Login failed. Please try again.", "error");
    }
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
      <PersonIcon sx={{ fontSize: 80, color: "#6366f1", mb: 1 }} />
      <Typography variant="h6" sx={{ mt: 1, mb: 2, fontWeight: 600 }}>
        Account Login
      </Typography>
      <Box sx={{ width: "100%" }}>
        <TextField
          {...register("email")}
          fullWidth
          id="standard-basic"
          variant="outlined"
          label="Email"
          sx={{ mt: 2, mb: 1, borderRadius: 2 }}
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
      <Box sx={{ width: "100%", display: "flex", flexDirection: "column" }}>
        <TextField
          {...register("password")}
          fullWidth
          id="standard-password"
          label="Password"
          variant="outlined"
          type={showPassword ? "text" : "password"}
          sx={{ mt: 2, borderRadius: 2 }}
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
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            mt: 1,
            alignSelf: "flex-end",
            gap: 1,
            cursor: "pointer",
            userSelect: "none",
          }}
          onClick={handleToggleVisibility}
        >
          <Checkbox color="success" checked={showPassword} sx={{ p: 0.5 }} />
          <Typography sx={{ fontSize: 14, color: "#6366f1", fontWeight: 500 }}>
            {showPassword ? "Hide" : "Show"} Password
          </Typography>
        </Box>
      </Box>
      {isLoading ? (
        <div className="flex items-center justify-center">
          <CircularProgress color="success" size={"40px"} />
        </div>
      ) : (
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
          Login
        </Button>
      )}

      <Button
        variant="text"
        sx={{
          mt: 1,
          color: "#6366f1",
          fontWeight: 500,
          fontSize: 15,
          textTransform: "none",
          "&:hover": {
            bgcolor: "transparent",
            textDecoration: "underline",
          },
        }}
      >
        Forgot Password?
      </Button>
    </Box>
  );
};

export default LoginComponent;
