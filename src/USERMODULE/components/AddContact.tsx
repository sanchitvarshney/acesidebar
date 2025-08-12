import { zodResolver } from "@hookform/resolvers/zod";
import {
  Alert,
  Autocomplete,
  Box,
  Button,
  Chip,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";

import { Controller, useForm } from "react-hook-form";
import z from "zod";

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
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      sx={{ paddingX: 3, paddingY: 0 }}
    >
        
      {/* Mandatory Fields Alert */}
      <Alert severity="info" sx={{ mt: 2 }}>
        <Typography variant="body2" sx={{ fontWeight: 600 }}>
          Fields marked with{" "}
          <span style={{ color: "#d32f2f", fontSize: 16 }}>*</span> are
          mandatory
        </Typography>
      </Alert>
      <Controller
        name="email"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label={
              <Typography>
                Email <span className="text-red-500 text-md">*</span>
              </Typography>
            }
            fullWidth
            margin="normal"
            error={!!errors.email}
            helperText={errors.email?.message}
          />
        )}
      />

      <Controller
        name="workMobileNo"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label={
              <Typography>
                Work Phone <span className="text-red-500 text-md">*</span>
              </Typography>
            }
            fullWidth
            margin="normal"
            error={!!errors.workMobileNo}
            helperText={errors.workMobileNo?.message}
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
                Mobile Phone <span className="text-red-500 text-md">*</span>
              </Typography>
            }
            fullWidth
            margin="normal"
            error={!!errors.mobileNo}
            helperText={errors.mobileNo?.message}
          />
        )}
      />
      <Controller
        name="externalId"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label={
              <Typography>
                Unique External ID
                <span className="text-red-500 text-md">*</span>
              </Typography>
            }
            fullWidth
            margin="normal"
            error={!!errors.externalId}
            helperText={errors.externalId?.message}
          />
        )}
      />
      {/* <div>
    <h6>Profile Detactor</h6>
</div> */}

      <div className=" flex items-center justify-center ">
        <Button
   
          type="submit"
          variant="contained"
          sx={{
            textTransform: "none",
            my: 2,
            "&:hover": { backgroundColor: "#0080ffff" },
       
            fontSize: 15,
          }}
        >
          Create Contact
        </Button>
      </div>
    </Box>
  );
};

export default AddContact;
