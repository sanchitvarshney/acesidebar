import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Link,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import {
  ChangeEvent,
  ClipboardEvent,
  KeyboardEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
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

const otpSchema = z.object({
  otp: z
    .string({ required_error: "OTP is required" })
    .regex(/^\d{6}$/, "OTP must be 6 digits"),
});

type SignUpFormValues = z.infer<typeof signUpSchema>;
type OtpFormValues = z.infer<typeof otpSchema>;

const AdminSignupScreen = () => {
  const navigate = useNavigate();
  const VISIBLE_RECAPTCHA_KEY =
    process.env.REACT_APP_GOOGLE_VISIBLE_SITE_KEY ?? "";

  const {
    register,
    handleSubmit,
    watch,
    setValue: setEmailValue,
    formState: { errors, isSubmitted, touchedFields },
  } = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
    },
  });

  const {
    register: registerOtp,
    handleSubmit: handleOtpSubmit,
    reset: resetOtpForm,
    setValue: setOtpValue,
    formState: {
      errors: otpErrors,
      isSubmitted: isOtpSubmitted,
      touchedFields: otpTouchedFields,
    },
  } = useForm<OtpFormValues>({
    resolver: zodResolver(otpSchema),
    mode: "onChange",
    defaultValues: {
      otp: "",
    },
  });

  const [hasAcceptedTerms, setHasAcceptedTerms] = useState<boolean>(false);
  const [captchaToken, setCaptchaToken] = useState<string>("");
  const [isCaptchaVerified, setIsCaptchaVerified] = useState<boolean>(false);
  const [step, setStep] = useState<1 | 2>(1);
  const [submittedEmail, setSubmittedEmail] = useState<string>("");
  const [otpDigits, setOtpDigits] = useState<string[]>(Array(6).fill(""));
  const otpInputRefs = useRef<Array<HTMLInputElement | null>>([]);

  const recaptchaRef = useRef<GoogleRecaptchaRef>(null);

  useEffect(() => {
    if (!hasAcceptedTerms && step === 1) {
      setIsCaptchaVerified(false);
      setCaptchaToken("");
      recaptchaRef.current?.reset();
    }
  }, [hasAcceptedTerms, step]);

  useEffect(() => {
    registerOtp("otp");
  }, [registerOtp]);

  const emailValue = watch("email");
  const isEmailInvalid =
    !!(isSubmitted || touchedFields.email) && !!errors.email;

  const isOtpValid = otpDigits.join("").length === 6 && !otpErrors.otp;

  const isSubmitDisabled = useMemo(() => {
    if (!emailValue || isEmailInvalid) return true;
    if (!hasAcceptedTerms) return true;
    if (!isCaptchaVerified || !captchaToken) return true;
    return false;
  }, [emailValue, isEmailInvalid, hasAcceptedTerms, isCaptchaVerified, captchaToken]);

  const progressStatuses =
    step === 1
      ? ["current", "upcoming", "upcoming", "upcoming"]
      : ["completed", "current", "upcoming", "upcoming"];

  const onEmailSubmit = (data: SignUpFormValues) => {
    setSubmittedEmail(data.email.trim());
    resetOtpForm();
    setOtpDigits(Array(6).fill(""));
    setOtpValue("otp", "", { shouldValidate: true, shouldTouch: false, shouldDirty: false });
    setStep(2);
  };

  const onOtpSubmit = (values: OtpFormValues) => {
    console.log("Verify OTP", {
      email: submittedEmail,
      otp: values.otp,
    });
  };

  const handleChangeEmail = () => {
    setStep(1);
    setHasAcceptedTerms(false);
    setIsCaptchaVerified(false);
    setCaptchaToken("");
    resetOtpForm();
    setOtpDigits(Array(6).fill(""));
    setOtpValue("otp", "", { shouldValidate: false, shouldTouch: false, shouldDirty: false });
    setEmailValue("email", submittedEmail);
    recaptchaRef.current?.reset();
  };

  const handleResendCode = () => {
    console.log("Resend OTP for", submittedEmail);
    setOtpDigits(Array(6).fill(""));
    setOtpValue("otp", "", {
      shouldValidate: true,
      shouldDirty: false,
      shouldTouch: false,
    });
    otpInputRefs.current[0]?.focus();
  };

  const updateOtpDigits = (updater: (prev: string[]) => string[]) => {
    setOtpDigits((prev) => {
      const next = updater(prev);
      setOtpValue("otp", next.join(""), {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: false,
      });
      return next;
    });
  };

  const handleOtpDigitChange =
    (index: number) => (event: ChangeEvent<HTMLInputElement>) => {
      const rawValue = event.target.value.replace(/\D/g, "").slice(-1);

      updateOtpDigits((prev) => {
        const next = [...prev];
        next[index] = rawValue;
        return next;
      });

      if (rawValue && index < otpInputRefs.current.length - 1) {
        otpInputRefs.current[index + 1]?.focus();
        otpInputRefs.current[index + 1]?.select?.();
      }
    };

  const handleOtpKeyDown =
    (index: number) => (event: KeyboardEvent<HTMLInputElement>) => {
      const isDigit = /^[0-9]$/.test(event.key);

      if (event.key === "Backspace") {
        event.preventDefault();
        if (otpDigits[index]) {
          updateOtpDigits((prev) => {
            const next = [...prev];
            next[index] = "";
            return next;
          });
        } else if (index > 0) {
          updateOtpDigits((prev) => {
            const next = [...prev];
            next[index - 1] = "";
            return next;
          });
          otpInputRefs.current[index - 1]?.focus();
        }
        return;
      }

      if (event.key === "ArrowLeft" && index > 0) {
        event.preventDefault();
        otpInputRefs.current[index - 1]?.focus();
        return;
      }

      if (event.key === "ArrowRight" && index < otpInputRefs.current.length - 1) {
        event.preventDefault();
        otpInputRefs.current[index + 1]?.focus();
        return;
      }

      if (!isDigit && event.key.length === 1 && !event.ctrlKey && !event.metaKey) {
        event.preventDefault();
      }
    };

  const handleOtpPaste =
    (index: number) => (event: ClipboardEvent<HTMLInputElement>) => {
      event.preventDefault();
      const pasted = event.clipboardData.getData("text").replace(/\D/g, "");
      if (!pasted) return;

      updateOtpDigits((prev) => {
        const next = [...prev];
        for (let i = 0; i < pasted.length && index + i < next.length; i += 1) {
          next[index + i] = pasted[i];
        }
        return next;
      });

      const focusIndex = Math.min(index + pasted.length, otpInputRefs.current.length - 1);
      otpInputRefs.current[focusIndex]?.focus();
      otpInputRefs.current[focusIndex]?.select?.();
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
          <Stack spacing={3} sx={{ alignItems: "flex-start" }}>
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

          <Stack
            spacing={0}
            sx={{
              position: "absolute",
              top: "50%",
              right: { md: -24 },
              transform: "translateY(-50%)",
              display: { xs: "none", md: "flex" },
              alignItems: "center",
              gap: 2,
            }}
          >
            {progressStatuses.map((status, index) => {
              const isCurrent = status === "current";
              const isCompleted = status === "completed";
              const ringColor = isCurrent ? "#7257ff" : "#d0d4df";
              const innerColor = isCurrent ? "#7257ff" : "#b6bcc9";
              const isConnectorActive = index < step - 1;

              return (
                <Box
                  key={`${status}-${index}`}
                  sx={{
                    position: "relative",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: "50%",
                      backgroundColor: "#ffffff",
                      boxShadow: isCurrent
                        ? "0 18px 30px rgba(34, 61, 120, 0.35)"
                        : "0 12px 24px rgba(34, 61, 120, 0.18)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      border: `4px solid ${ringColor}`,
                      transition: "all 0.3s ease",
                    }}
                  >
                    {isCompleted ? (
                      <CheckIcon sx={{ color: PRIMARY_DARK, fontSize: 22 }} />
                    ) : (
                      <Box
                        sx={{
                          width: isCurrent ? 12 : 8,
                          height: isCurrent ? 12 : 8,
                          borderRadius: "50%",
                          border: isCurrent ? "4px solid rgba(114,87,255,0.35)" : "none",
                          background: isCurrent ? "#fff" : innerColor,
                          boxShadow: isCurrent
                            ? "0 0 0 4px rgba(114,87,255,0.2)"
                            : "inset 0 0 4px rgba(0,0,0,0.12)",
                        }}
                      />
                    )}
                  </Box>
                  {index < progressStatuses.length - 1 && (
                    <Box
                      sx={{
                        width: 4,
                        height: 56,
                        borderRadius: 999,
                        background: isConnectorActive
                          ? "linear-gradient(180deg, rgba(114,87,255,0.4) 0%, rgba(114,87,255,0.1) 100%)"
                          : "rgba(25,48,87,0.15)",
                      }}
                    />
                  )}
                </Box>
              );
            })}
          </Stack>

          <Typography sx={{ opacity: 0.7, fontSize: { xs: 13, md: 14 } }}>
            © {new Date().getFullYear()} Ajaxter. All rights reserved.
          </Typography>
        </Box>

        {step === 1 ? (
          <Box
            component="form"
            onSubmit={handleSubmit(onEmailSubmit)}
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
              {VISIBLE_RECAPTCHA_KEY ? (
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
              ) : (
                <Typography sx={{ color: "error.main" }}>
                  reCAPTCHA site key not configured
                </Typography>
              )}
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
        ) : (
          <Box
            component="form"
            onSubmit={handleOtpSubmit(onOtpSubmit)}
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
                Check your inbox for the verification code.
              </Typography>
              <Typography sx={{ mt: 1.5, color: "#5f6c86", fontSize: { xs: 14, md: 16 } }}>
                We’ve emailed a one-time password to {submittedEmail}.
              </Typography>
            </Box>

            <Box
              sx={{
                display: "flex",
                gap: { xs: 1, sm: 1.5 },
                justifyContent: "flex-start",
                flexWrap: "wrap",
              }}
            >
              {Array.from({ length: 6 }).map((_, index) => (
                <TextField
                  key={index}
                  value={otpDigits[index]}
                  onChange={handleOtpDigitChange(index)}
                  onKeyDown={handleOtpKeyDown(index)}
                  onPaste={handleOtpPaste(index)}
                  onFocus={(event) => event.target.select()}
                  inputRef={(element) => {
                    otpInputRefs.current[index] = element;
                  }}
                  autoFocus={index === 0}
                  variant="outlined"
                  inputProps={{
                    maxLength: 1,
                    type: "tel",
                    inputMode: "numeric",
                    pattern: "[0-9]*",
                    sx: {
                      textAlign: "center",
                      fontSize: 20,
                      fontWeight: 600,
                    },
                  }}
                  sx={{
                    width: { xs: 42, sm: 48 },
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 1,
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
                  error={
                    isOtpSubmitted || otpTouchedFields.otp ? !!otpErrors.otp : false
                  }
                />
              ))}
            </Box>
            {(isOtpSubmitted || otpTouchedFields.otp) && otpErrors.otp && (
              <Typography sx={{ color: "error.main", textAlign: "center" }}>
                {otpErrors.otp.message}
              </Typography>
            )}

            <Box sx={{ display: "flex", justifyContent: "flex-start" }}>
              <Link
                component="button"
                type="button"
                underline="none"
                sx={{ fontWeight: 600, color: PRIMARY_COLOR }}
                onClick={handleResendCode}
              >
                Resend code
              </Link>
            </Box>

            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
              <Button
                type="submit"
                variant="contained"
                disabled={!isOtpValid}
                endIcon={<EastIcon sx={{ fontSize: 20 }} />}
                sx={{
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
                }}
              >
                Verify OTP
              </Button>
              <Button
                type="button"
                variant="outlined"
                onClick={handleChangeEmail}
                sx={{
                  px: { xs: 4, md: 6 },
                  borderRadius: 2,
                  py: 1.25,
                  fontWeight: 600,
                  fontSize: 16,
                  textTransform: "uppercase",
                  letterSpacing: 1,
                }}
              >
                Change Email Address
              </Button>
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default AdminSignupScreen;

