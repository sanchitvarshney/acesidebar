import { zodResolver } from "@hookform/resolvers/zod";
import {
  Alert,
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Container,
  Divider,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import z from "zod";
import { Email, Phone, Work, Person, Badge } from "@mui/icons-material";

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

const AddContact = () => {
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
    <Container maxWidth="md" sx={{}}>
      {/* <Paper 
        elevation={0} 
        sx={{ 
          // borderRadius: 3,
          overflow: 'hidden',
          background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
        }}
      > */}
      {/* Header Section */}
      {/* <Box
          sx={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            py: 3,
            px: 4,
            textAlign: 'center'
          }}
        >
    
          <Typography variant="body1" sx={{ opacity: 0.9 }}>
            Add a new contact to your address book
          </Typography>
        </Box> */}

      {/* Form Content */}
      <Box sx={{ p: 2 }}>
        {/* Mandatory Fields Alert */}
        <Alert
          severity="info"
          sx={{
            mb: 2,
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
            {/* Submit Button Section */}
        <Box sx={{ textAlign: "center" }}>
          {/* Submit button */}

          <Button
            type="submit"
            variant="contained"
            sx={{
              textTransform: "none",

              "&:hover": { backgroundColor: "#0080ffff" },
              fontSize: 15,
            }}
          >
            Create Contact
          </Button>
        </Box>
        </Box>

        {/* <Divider sx={{ my: 3 }} /> */}

      
      </Box>
      {/* </Paper> */}
    </Container>
  );
};

export default AddContact;
