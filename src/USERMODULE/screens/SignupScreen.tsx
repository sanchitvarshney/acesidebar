import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Link,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import CheckIcon from "@mui/icons-material/Check";
import LightbulbIcon from "@mui/icons-material/Lightbulb";
import EastIcon from "@mui/icons-material/East";

import GoogleRecaptcha, {
  GoogleRecaptchaRef,
} from "../../components/reusable/GoogleRecaptcha";

const PRIMARY_COLOR = "#2567B3";
const PRIMARY_DARK = "#1E4D8A";
const SECONDARY_BG = "#F5F7FB";

const signUpSchema = z.object({
  email: z.string({ required_error: "Email is required" }).email("Invalid email"),
});

type SignUpFormValues = z.infer<typeof signUpSchema>;

const SignupScreen = () => {
  const navigate = useNavigate();
  const VISIBLE_RECAPTCHA_KEY =
    process.env.REACT_APP_GOOGLE_VISIBLE_SITE_KEY ?? "";

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitted, touchedFields },
  } = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
    },
  });

  const [hasAcceptedTerms, setHasAcceptedTerms] = useState<boolean>(false);
  const [captchaToken, setCaptchaToken] = useState<string>("");
  const [isCaptchaVerified, setIsCaptchaVerified] = useState<boolean>(false);
  const recaptchaRef = useRef<GoogleRecaptchaRef>(null);

  useEffect(() => {
    if (!hasAcceptedTerms) {
      setIsCaptchaVerified(false);
      setCaptchaToken("");
      recaptchaRef.current?.reset();
    }
  }, [hasAcceptedTerms]);

  const emailValue = watch("email");
  const isEmailInvalid =
    !!(isSubmitted || touchedFields.email) && !!errors.email;

  const isSubmitDisabled = useMemo(() => {
    if (!emailValue || isEmailInvalid) return true;
    if (!hasAcceptedTerms) return true;
    if (!isCaptchaVerified || !captchaToken) return true;
    return false;
  }, [emailValue, hasAcceptedTerms, isCaptchaVerified, captchaToken, isEmailInvalid]);

  const onSubmit = (data: SignUpFormValues) => {
    console.log("Signup submission", {
      ...data,
      captchaToken,
      hasAcceptedTerms,
    });
  };

  return (
    <Box sx={{ minHeight: "100vh", width: "100%", backgroundColor: SECONDARY_BG }}>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "35% 65%" },
          minHeight: "100vh",
        }}
      >
        <Box
          sx={{
            position: { xs: "relative", md: "sticky" },
            top: { md: 0 },
            gridColumn: { xs: "1 / -1", md: "1 / 2" },
            background: `linear-gradient(180deg, ${PRIMARY_COLOR} 0%, ${PRIMARY_DARK} 100%)`,
            color: "#ffffff",
            px: { xs: 4, sm: 6, md: 8 },
            py: { xs: 6, md: 10 },
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            gap: 6,
            minHeight: { xs: "100%", md: "100vh" },
            alignSelf: "stretch",
          }}
        >
          <Stack spacing={3}>
            <Box
              sx={{
                width: { xs: 72, md: 96 },
                height: { xs: 72, md: 96 },
                borderRadius: "50%",
                backgroundColor: "rgba(255,255,255,0.15)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "3px solid rgba(255,255,255,0.3)",
                fontSize: { xs: 38, md: 48 },
                fontWeight: 600,
              }}
            >
              <Typography component="span" sx={{ lineHeight: 1 }}>
                ☎️
              </Typography>
            </Box>
            <Box>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  letterSpacing: 0.5,
                  mb: 1,
                  fontSize: { xs: 28, md: 34 },
                }}
              >
                Built for modern support teams
              </Typography>
              <Typography
                sx={{ opacity: 0.9, lineHeight: 1.6, fontSize: { xs: 14, md: 16 } }}
              >
                Manage every interaction in one collaborative workspace tailored for Ajaxter
                customers.
              </Typography>
              <Stack spacing={2} sx={{ mt: 3 }}>
                {[
                  "Launch branded omni-channel portals in minutes.",
                  "Automate routing, SLAs, and approvals with intuitive workflows.",
                  "Give agents AI-assisted responses and shared context for every ticket.",
                ].map((item) => (
                  <Typography key={item} sx={{ fontSize: { xs: 13, md: 15 }, opacity: 0.9 }}>
                    • {item}
                  </Typography>
                ))}
              </Stack>
            </Box>
          </Stack>

          <Typography sx={{ opacity: 0.7, fontSize: { xs: 13, md: 14 } }}>
            © {new Date().getFullYear()} Ajaxter. All rights reserved.
          </Typography>
        </Box>

        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          sx={{
            gridColumn: { xs: "1 / -1", md: "2 / 3" },
            backgroundColor: "#ffffff",
            px: { xs: 4, sm: 6, md: 8 },
            py: { xs: 6, md: 10 },
            display: "flex",
            flexDirection: "column",
            gap: 4,
            justifyContent: "center",
            overflowY: { md: "auto" },
            maxHeight: { md: "100vh" },
          }}
        >
          <Box>
            <Typography
              sx={{
                mt: 2,
                color: "#1f2a37",
                fontWeight: 600,
                fontSize: { xs: 20, md: 24 },
              }}
            >
              Get started with Ajaxter Service Desk to provide your customers with responsive,
              always-on support.
            </Typography>
            <Typography sx={{ mt: 1.5, color: "#5f6c86", fontSize: { xs: 14, md: 16 } }}>
              Already have an account?{" "}
              <Link
                component="button"
                type="button"
                underline="none"
                sx={{ fontWeight: 600 }}
                onClick={() => navigate("/login")}
              >
                Login instead.
              </Link>
            </Typography>
          </Box>

          <TextField
            {...register("email")}
            variant="outlined"
            fullWidth
            label="Email"
            type="email"
            error={isEmailInvalid}
            helperText={
              isEmailInvalid ? (
                errors.email?.message
              ) : (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    color: "warning.main",
                  }}
                >
                  <LightbulbIcon sx={{ fontSize: 18 }} />
                  <Typography variant="caption" sx={{ color: "inherit" }}>
                    We’ll send OTP here.
                  </Typography>
                </Box>
              )
            }
            FormHelperTextProps={{
              sx: { marginLeft: 0, display: "flex", alignItems: "center" },
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 0,
                "& fieldset": {
                  borderColor: "#d7dce5",
                },
                "&:hover fieldset": {
                  borderColor: PRIMARY_COLOR,
                },
                "&.Mui-focused fieldset": {
                  borderColor: PRIMARY_COLOR,
                },
              },
            }}
          />

          <FormControlLabel
            control={
              <Checkbox
                checked={hasAcceptedTerms}
                onChange={(event) => setHasAcceptedTerms(event.target.checked)}
                sx={{
                  color: PRIMARY_COLOR,
                  "&.Mui-checked": {
                    color: PRIMARY_COLOR,
                  },
                }}
              />
            }
            label={
              <Typography sx={{ color: "#5f6c86", fontSize: { xs: 13, md: 15 } }}>
                The personal information that you have provided will help us to deliver,
                develop and promote our products and services. By signing up, you hereby
                declare that you have read and agree to our{" "}
                <Link href="#" underline="always">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="#" underline="always">
                  Privacy Policy
                </Link>
                .
              </Typography>
            }
            sx={{
              alignItems: "flex-start",
              m: 0,
              "& .MuiCheckbox-root": { mt: 0.5 },
            }}
          />
          <Box>
            <GoogleRecaptcha
              ref={recaptchaRef}
              siteKey={VISIBLE_RECAPTCHA_KEY}
              onVerify={(token) => {
                setCaptchaToken(token ?? "");
                setIsCaptchaVerified(!!token);
              }}
              onExpire={() => {
                setCaptchaToken("");
                setIsCaptchaVerified(false);
              }}
              theme="light"
              size="normal"
            />
          </Box>


          <Button
            type="submit"
            variant="contained"
            disabled={isSubmitDisabled}
            sx={{
              mt: 2,
              alignSelf: { xs: "stretch", md: "flex-start" },
              px: { xs: 4, md: 6 },
              background: "#7E40EF",
              borderRadius: 2,
              py: 1.25,
              fontWeight: 600,
              fontSize: 16,
              boxShadow: "0 18px 30px -18px rgba(126,64,239,0.65)",
              textTransform: "uppercase",
              letterSpacing: 1,
              "&:hover": {
                background: "#6931d8",
              },
              "&.Mui-disabled": {
                backgroundColor: "#d9dce7",
                color: "#fff",
              },
            }}
            endIcon={<EastIcon sx={{ fontSize: 20 }} />}
          >
            Get Started
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default SignupScreen;