import { zodResolver } from "@hookform/resolvers/zod";
import {
  Alert,
  Box,
  Button,
  TextField,
  Typography,
  Container,
  InputAdornment,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import z from "zod";
import {
  Email,
  Phone,
  Work,
  Person,
  Badge,
  Business,
  LocationOn,
  Description,
} from "@mui/icons-material";

// Zod schema
const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  title: z.string().optional(),
  email: z.string().email("Invalid email"),

  priority: z.string().min(2, "Priority required"),
  about: z.string().min(2, "About required"),
  company: z.string().optional(),
  address: z.string().optional(),
  tags: z.string().optional(),

  mobileNo: z.string().regex(/^\d+$/, "Mobile number must contain only digits"),
  otherMobileNo: z.string().optional(),
  externalId: z.string().regex(/^\d+$/, "External ID must contain only digits"),
  workMobileNo: z
    .string()
    .regex(/^\d+$/, "Work Mobile number must contain only digits"),
});

type FormData = z.infer<typeof schema>;

const EditUser = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onChange", // Real-time validation
    defaultValues: {
      name: "",
      email: "",
    },
  });

  const onSubmit = (data: FormData) => {
    console.log("Form submitted", data);
  };

  return (
    <Container maxWidth="md" sx={{ py: 2 }}>
      {/* Form Content */}
      <Box sx={{ p: 0 }}>
        {/* Mandatory Fields Alert */}
        <Alert
          severity="info"
          sx={{
            mb: 2,
            display: "flex",
            alignItems: "center",
            borderRadius: 2,
            "& .MuiAlert-icon": { color: "#1976d2" },
          }}
        >
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            Fields marked with{" "}
            <span
              style={{ color: "#d32f2f", fontSize: 18, fontWeight: "bold" }}
            >
              *
            </span>{" "}
            are mandatory
          </Typography>
        </Alert>

        {/* Form Fields */}
        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            maxHeight: "calc(100vh - 180px)",
            overflowY: "auto",
            pr: 1,
          }}
        >
          {/* Personal Information Section */}
          <Box>
            <Typography
              variant="h6"
              sx={{
                mb: 2,
                color: "#1976d2",
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <Person sx={{ fontSize: 20 }} />
              Personal Information
            </Typography>

            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label={
                    <Typography>
                      Full Name{" "}
                      <span className="text-red-500 text-lg font-bold">*</span>
                    </Typography>
                  }
                  fullWidth
                  variant="outlined"
                  error={!!errors.name}
                  helperText={errors.name?.message}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person color="action" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#1976d2",
                      },
                    },
                  }}
                />
              )}
            />

            <Controller
              name="title"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label={<Typography>Title</Typography>}
                  fullWidth
                  variant="outlined"
                  sx={{
                    mt: 2,
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#1976d2",
                      },
                    },
                  }}
                />
              )}
            />
          </Box>

          {/* Contact Information Section */}
          <Box>
            <Typography
              variant="h6"
              sx={{
                mb: 2,
                color: "#1976d2",
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <Email sx={{ fontSize: 20 }} />
              Contact Information
            </Typography>

            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label={
                    <Typography>
                      Email Address{" "}
                      <span className="text-red-500 text-lg font-bold">*</span>
                    </Typography>
                  }
                  fullWidth
                  variant="outlined"
                  error={!!errors.email}
                  helperText={errors.email?.message}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email color="action" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#1976d2",
                      },
                    },
                  }}
                />
              )}
            />
          </Box>

          {/* Phone Numbers Section */}
          <Box>
            <Typography
              variant="h6"
              sx={{
                mb: 2,
                color: "#1976d2",
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <Phone sx={{ fontSize: 20 }} />
              Phone Numbers
            </Typography>

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                gap: 2,
              }}
            >
              <Controller
                name="workMobileNo"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label={
                      <Typography>
                        Work Phone{" "}
                        <span className="text-red-500 text-lg font-bold">
                          *
                        </span>
                      </Typography>
                    }
                    fullWidth
                    variant="outlined"
                    error={!!errors.workMobileNo}
                    helperText={errors.workMobileNo?.message}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Work color="action" />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                        "&:hover .MuiOutlinedInput-notchedOutline": {
                          borderColor: "#1976d2",
                        },
                      },
                    }}
                  />
                )}
              />

              <Controller
                name="mobileNo"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label={
                      <Typography>
                        Mobile Phone{" "}
                        <span className="text-red-500 text-lg font-bold">
                          *
                        </span>
                      </Typography>
                    }
                    fullWidth
                    variant="outlined"
                    error={!!errors.mobileNo}
                    helperText={errors.mobileNo?.message}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Phone color="action" />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                        "&:hover .MuiOutlinedInput-notchedOutline": {
                          borderColor: "#1976d2",
                        },
                      },
                    }}
                  />
                )}
              />
            </Box>

            <Controller
              name="otherMobileNo"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label={<Typography>Other Phone Number</Typography>}
                  fullWidth
                  variant="outlined"
                  sx={{
                    mt: 2,
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#1976d2",
                      },
                    },
                  }}
                />
              )}
            />
          </Box>

          {/* Identification Section */}
          <Box>
            <Typography
              variant="h6"
              sx={{
                mb: 2,
                color: "#1976d2",
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <Badge sx={{ fontSize: 20 }} />
              Identification
            </Typography>

            <Controller
              name="externalId"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label={
                    <Typography>
                      Unique External ID{" "}
                      <span className="text-red-500 text-lg font-bold">*</span>
                    </Typography>
                  }
                  fullWidth
                  variant="outlined"
                  error={!!errors.externalId}
                  helperText={errors.externalId?.message}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Badge color="action" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#1976d2",
                      },
                    },
                  }}
                />
              )}
            />
          </Box>

          {/* Company & Address Section */}
          <Box>
            <Typography
              variant="h6"
              sx={{
                mb: 2,
                color: "#1976d2",
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <Business sx={{ fontSize: 20 }} />
              Company & Address
            </Typography>

            <Controller
              name="company"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label={<Typography>Company</Typography>}
                  fullWidth
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Business color="action" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#1976d2",
                      },
                    },
                  }}
                />
              )}
            />

            <Controller
              name="address"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label={<Typography>Address</Typography>}
                  fullWidth
                  variant="outlined"
                  multiline
                  rows={3}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LocationOn color="action" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    mt: 2,
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#1976d2",
                      },
                    },
                  }}
                />
              )}
            />
          </Box>

          {/* Additional Information Section */}
          <Box>
            <Typography
              variant="h6"
              sx={{
                mb: 2,
                color: "#1976d2",
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <Description sx={{ fontSize: 20 }} />
              Additional Information
            </Typography>

            <Controller
              name="about"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label={<Typography>About</Typography>}
                  fullWidth
                  variant="outlined"
                  multiline
                  rows={4}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Description color="action" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#1976d2",
                      },
                    },
                  }}
                />
              )}
            />
          </Box>

          {/* Submit Button Section */}
          <Box sx={{ textAlign: "center", mt: 2 }}>
            <Button
              type="submit"
              variant="contained"
              sx={{
                textTransform: "none",
                "&:hover": { backgroundColor: "#0080ffff" },
                fontSize: 15,
              }}
            >
              Update User Profile
            </Button>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default EditUser;
