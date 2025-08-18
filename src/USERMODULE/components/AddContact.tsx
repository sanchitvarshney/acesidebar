import { zodResolver } from "@hookform/resolvers/zod";
import {
  Alert,
  Box,
  Button,
  TextField,
  Typography,
  IconButton,
  InputAdornment,
  Dialog,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import z from "zod";
import {
  Email,
  Phone,
  Work,
  Person,
  Badge,
  Close,
  Save,
} from "@mui/icons-material";
import { Transition } from "../pages/EditUser";

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

const AddContact = ({ isAdd, close }: { isAdd: any; close: any }) => {
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
    <Dialog
      open={isAdd}
      onClose={close}
      fullWidth
      TransitionComponent={Transition}
      keepMounted
      transitionDuration={{ enter: 500, exit: 500 }}
      maxWidth="md"
      PaperProps={{
        sx: {
          borderRadius: 3,
          overflow: "hidden",
        },
      }}
    >
      {/* Header with Close & Save buttons */}
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          bgcolor: "#f5f7fa",
          borderBottom: "1px solid #ddd",
          py: 2,
          px: 3,
          backgroundColor: "#e8f0fe",
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 600, color: "#1976d2" }}>
          Create New Contact
        </Typography>

        <Box sx={{ display: "flex", gap: 1 }}>
          <Button
            onClick={handleSubmit(onSubmit)}
            variant="contained"
            startIcon={<Save fontSize="small" />}
            sx={{ textTransform: "none" }}
          >
            Save
          </Button>
          <IconButton onClick={close} color="error" size="small">
            <Close fontSize="small" />
          </IconButton>
        </Box>
      </DialogTitle>
      {/* Form Content */}
      <DialogContent dividers sx={{ backgroundColor: "white" }}>
        <Box sx={{ p: 1 }}>
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
              gap: 3,
              // maxHeight: "calc(100vh - 250px)",
              // overflowY: "auto",
              pr: 1,
            }}
          >
            {/* Personal Information */}
            <Box>
              <Typography
                variant="subtitle1"
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Controller
                  name="name"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label={
                        <Typography>
                          Full Name{" "}
                          <span className="text-red-500 text-lg font-bold">
                            *
                          </span>
                        </Typography>
                      }
                      fullWidth
                      size="small"
                      variant="outlined"
                      error={!!errors.name}
                      helperText={errors.name?.message}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Person color="action" fontSize="small" />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 1,
                          "&:hover .MuiOutlinedInput-notchedOutline": {
                            borderColor: "#1976d2",
                          },
                        },
                      }}
                    />
                  )}
                />
              </div>
            </Box>

            {/* Contact Information */}
            <Box>
              <Typography
                variant="subtitle1"
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Controller
                  name="email"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label={
                        <Typography>
                          Email Address{" "}
                          <span className="text-red-500 text-lg font-bold">
                            *
                          </span>
                        </Typography>
                      }
                      fullWidth
                      size="small"
                      variant="outlined"
                      error={!!errors.email}
                      helperText={errors.email?.message}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Email color="action" fontSize="small" />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 1,
                          "&:hover .MuiOutlinedInput-notchedOutline": {
                            borderColor: "#1976d2",
                          },
                        },
                      }}
                    />
                  )}
                />
              </div>
            </Box>

            {/* Phone Numbers */}
            <Box>
              <Typography
                variant="subtitle1"
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                      size="small"
                      variant="outlined"
                      error={!!errors.workMobileNo}
                      helperText={errors.workMobileNo?.message}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Work color="action" fontSize="small" />
                          </InputAdornment>
                        ),
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
                      size="small"
                      variant="outlined"
                      error={!!errors.mobileNo}
                      helperText={errors.mobileNo?.message}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Phone color="action" fontSize="small" />
                          </InputAdornment>
                        ),
                      }}
                    />
                  )}
                />
              </div>
            </Box>

            {/* Identification */}
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Controller
                  name="externalId"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label={
                        <Typography>
                          Unique External ID{" "}
                          <span className="text-red-500 text-lg font-bold">
                            *
                          </span>
                        </Typography>
                      }
                      fullWidth
                      size="small"
                      variant="outlined"
                      error={!!errors.externalId}
                      helperText={errors.externalId?.message}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Badge color="action" fontSize="small" />
                          </InputAdornment>
                        ),
                      }}
                    />
                  )}
                />
              </div>
            </Box>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default AddContact;
