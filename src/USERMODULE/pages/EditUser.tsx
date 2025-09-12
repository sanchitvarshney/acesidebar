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
  AppBar,
  Toolbar,
  Autocomplete,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
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
  Add,
  Delete,
  Business,
  LocationOn,
  Tag,
  Description,
  Twitter,
} from "@mui/icons-material";
import { TransitionProps } from "@mui/material/transitions";
import { forwardRef } from "react";
import { useState } from "react";
import { useCommanApiMutation } from "../../services/threadsApi";
import { Slide } from "@mui/material";

export const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<unknown>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

// Zod schema - matching AddContact structure
const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  job_title: z.string().optional(),
  emails: z
    .array(
      z.object({
        value: z.string().email("Invalid email"),
        primary: z.boolean(),
        label: z.string().optional(),
      })
    )
    .min(1, "At least one email is required"),
  work_number: z
    .string()
    .regex(/^\d+$/, "Work number must contain only digits"),
  mobile_number: z
    .string()
    .regex(/^\d+$/, "Mobile number must contain only digits"),
  external_id: z
    .string()
    .regex(/^\d+$/, "External ID must contain only digits"),
  company: z.string().optional(),
  address: z.string().optional(),
  description: z.string().optional(),
  twitter: z.string().optional(),
  tags: z.string().optional(),
  other_phone_numbers: z
    .array(
      z.object({
        value: z.string(),
        primary: z.boolean(),
        original_value: z.string(),
      })
    )
    .optional(),
});

type FormData = z.infer<typeof schema>;

// Mock company data for autocomplete
const mockCompanies = [
  "Acme Corporation",
  "Tech Solutions Inc",
  "Global Industries",
  "Innovation Labs",
  "Digital Dynamics",
  "Future Systems",
  "Creative Solutions",
  "Enterprise Corp",
  "Startup Ventures",
  "Mega Industries",
];

// Mock tags data for autocomplete
const mockTags = [
  "VIP",
  "Customer",
  "Partner",
  "Lead",
  "Prospect",
  "Active",
  "Inactive",
  "Priority",
  "Follow-up",
  "Important",
];

const EditUser = ({ isEdit, close, userData }: { isEdit: boolean; close: any; userData?: any }) => {
  const [commanApi] = useCommanApiMutation();
  
  // Initialize emails and other phones from userData or default
  const [emails, setEmails] = useState<
    Array<{ value: string; primary: boolean; label: string | undefined }>
  >(userData?.emails || [{ value: "", primary: true, label: undefined }]);
  
  const [otherPhones, setOtherPhones] = useState<
    Array<{ value: string; primary: boolean; original_value: string }>
  >(userData?.other_phone_numbers || []);

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: {
      name: userData?.name || "",
      job_title: userData?.job_title || "",
      emails: userData?.emails || [{ value: "", primary: true, label: undefined }],
      work_number: userData?.work_number || "",
      mobile_number: userData?.mobile_number || "",
      external_id: userData?.external_id || "",
      company: userData?.company || "",
      address: userData?.address || "",
      description: userData?.description || "",
      twitter: userData?.twitter || "",
      tags: userData?.tags || "",
      other_phone_numbers: userData?.other_phone_numbers || [],
    },
  });

  const addEmail = () => {
    const newEmail = { value: "", primary: false, label: undefined };
    setEmails([...emails, newEmail]);
    setValue("emails", [...emails, newEmail]);
  };

  const updateEmail = (index: number, field: string, value: any) => {
    const updatedEmails = [...emails];
    updatedEmails[index] = { ...updatedEmails[index], [field]: value };
    setEmails(updatedEmails);
    setValue("emails", updatedEmails);
  };

  const removeEmail = (index: number) => {
    if (emails.length > 1) {
      const updatedEmails = emails.filter((_, i) => i !== index);
      setEmails(updatedEmails);
      setValue("emails", updatedEmails);
    }
  };

  const addOtherPhone = () => {
    const newPhone = { value: "", primary: false, original_value: "" };
    setOtherPhones([...otherPhones, newPhone]);
    setValue("other_phone_numbers", [...otherPhones, newPhone]);
  };

  const updateOtherPhone = (index: number, field: string, value: any) => {
    const updatedPhones = [...otherPhones];
    updatedPhones[index] = { ...updatedPhones[index], [field]: value };
    setOtherPhones(updatedPhones);
    setValue("other_phone_numbers", updatedPhones);
  };

  const removeOtherPhone = (index: number) => {
    const updatedPhones = otherPhones.filter((_, i) => i !== index);
    setOtherPhones(updatedPhones);
    setValue("other_phone_numbers", updatedPhones);
  };

  const onSubmit = (data: FormData) => {
    const payload = {
      url: "update-user-profile",
      body: {
        name: data.name,
        job_title: data.job_title,
        emails: data.emails.map((email) => ({
          value: email.value,
          primary: email.primary,
          label: email.label,
        })),
        work_number: data.work_number,
        mobile_number: data.mobile_number,
        external_id: data.external_id,
        company: data.company,
        address: data.address,
        description: data.description,
        twitter: data.twitter,
        tags: data.tags,
        other_phone_numbers: data.other_phone_numbers || [],
      },
    };
    commanApi(payload);
    close();
    console.log("Form submitted", payload);
  };

  return (
    <Dialog
      open={isEdit}
      onClose={close}
      fullScreen
      slots={{
        transition: Transition,
      }}
      PaperProps={{
        sx: {
          borderRadius: 0,
          overflow: "hidden",
        },
      }}
    >
      <AppBar sx={{ position: "relative" }}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={close}
            aria-label="close"
          >
            <Close fontSize="small" />
          </IconButton>
          <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
            Edit User
          </Typography>
          <Button autoFocus color="inherit" onClick={handleSubmit(onSubmit)}>
            Save
          </Button>
        </Toolbar>
      </AppBar>
      {/* Form Content */}
      <DialogContent dividers sx={{ backgroundColor: "white" }}>
        <Box
          sx={{
            p: 1,
          }}
        >
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
              // maxHeight: "calc(100vh - 180px)",
              // overflowY: "auto",
              // pr: 1,
            }}
          >
            {/* Personal Information Section */}
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
                <Person sx={{ fontSize: 18 }} />
                Personal Information
              </Typography>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
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

                <Controller
                  name="job_title"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label={"Title"}
                      fullWidth
                      size="small"
                      variant="outlined"
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

                            {/* Tags */}
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
                <Tag sx={{ fontSize: 18 }} />
                Tags
              </Typography>
              <div className="grid grid-cols-1 gap-6">
                <Controller
                  name="tags"
                  control={control}
                  render={({ field }) => (
                    <Autocomplete
                      {...field}
                      options={mockTags}
                      freeSolo
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Tags"
                          placeholder="Your choice"
                          size="small"
                          variant="outlined"
                          InputProps={{
                            ...params.InputProps,
                            startAdornment: (
                              <InputAdornment position="start">
                                <Tag color="action" fontSize="small" />
                              </InputAdornment>
                            ),
                          }}
                        />
                      )}
                      onChange={(_, newValue) => field.onChange(newValue)}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 1,
                          "&:hover .MuiOutlinedInput-notchedOutline": {
                            borderColor: "#1976d2",
                          },
                        },
                        "& .MuiAutocomplete-popper": {
                          zIndex: 9999,
                        },
                        "& .MuiAutocomplete-listbox": {
                          zIndex: 9999,
                        },
                      }}
                      slotProps={{
                        popper: {
                          sx: {
                            zIndex: 9999,
                          },
                        },
                      }}
                    />
                  )}
                />
              </div>
            </Box>
              </div>
            </Box>

            {/* Contact Information Section */}
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
                <Email sx={{ fontSize: 18 }} />
                Contact Information
              </Typography>

              {/* Email Fields */}
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" sx={{ mb: 1, color: "#666" }}>
                  Email Addresses
                </Typography>
                {emails.map((email, index) => (
                  <Box
                    key={index}
                    sx={{
                      display: "flex",
                      gap: 1,
                      mb: 1,
                      alignItems: "center",
                    }}
                  >
                    <TextField
                      value={email.value}
                      onChange={(e) =>
                        updateEmail(index, "value", e.target.value)
                      }
                      placeholder="Enter email address"
                      size="small"
                      variant="outlined"
                      sx={{ flex: 1 }}
                      error={!!errors.emails?.[index]?.value}
                      helperText={errors.emails?.[index]?.value?.message}
                    />
                    <FormControl size="small" sx={{ minWidth: 120 }}>
                      <InputLabel>Type</InputLabel>
                      <Select
                        value={email.primary ? "primary" : "secondary"}
                        onChange={(e) =>
                          updateEmail(
                            index,
                            "primary",
                            e.target.value === "primary"
                          )
                        }
                        label="Type"
                        size="small"
                      >
                        <MenuItem value="secondary">--</MenuItem>
                        <MenuItem value="primary">Primary</MenuItem>
                      </Select>
                    </FormControl>
                    {emails.length > 1 && (
                      <IconButton
                        onClick={() => removeEmail(index)}
                        size="small"
                        color="error"
                      >
                        <Delete fontSize="small" />
                      </IconButton>
                    )}
                  </Box>
                ))}
                <Button
                  startIcon={<Add />}
                  onClick={addEmail}
                  variant="text"
                  size="small"
                  sx={{ mt: 1 }}
                >
                  Add email address
                </Button>
              </Box>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <Controller
                  name="twitter"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Twitter"
                      placeholder="Enter Twitter handle"
                      fullWidth
                      size="small"
                      variant="outlined"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Twitter color="action" fontSize="small" />
                          </InputAdornment>
                        ),
                      }}
                    />
                  )}
                />
              </div>
            </Box>

            {/* Phone Numbers Section */}
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
                <Phone sx={{ fontSize: 18 }} />
                Phone Numbers
              </Typography>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <Controller
                  name="work_number"
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
                      size="small"
                      variant="outlined"
                      error={!!errors.work_number}
                      helperText={errors.work_number?.message}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Work color="action" fontSize="small" />
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

                <Controller
                  name="mobile_number"
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
                      size="small"
                      variant="outlined"
                      error={!!errors.mobile_number}
                      helperText={errors.mobile_number?.message}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Phone color="action" fontSize="small" />
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

              {/* Other Phone Numbers */}
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2" sx={{ mb: 1, color: "#666" }}>
                  Other Phone Numbers
                </Typography>
                {otherPhones.map((phone, index) => (
                  <Box
                    key={index}
                    sx={{
                      display: "flex",
                      gap: 1,
                      mb: 1,
                      alignItems: "center",
                    }}
                  >
                    <TextField
                      value={phone.value}
                      onChange={(e) =>
                        updateOtherPhone(index, "value", e.target.value)
                      }
                      placeholder="Enter a phone number"
                      size="small"
                      variant="outlined"
                      sx={{ flex: 1 }}
                    />
                    <FormControl size="small" sx={{ minWidth: 120 }}>
                      <InputLabel>Type</InputLabel>
                      <Select
                        value={phone.primary ? "primary" : "secondary"}
                        onChange={(e) =>
                          updateOtherPhone(
                            index,
                            "primary",
                            e.target.value === "primary"
                          )
                        }
                        label="Type"
                        size="small"
                      >
                        <MenuItem value="secondary">--</MenuItem>
                        <MenuItem value="primary">Primary</MenuItem>
                      </Select>
                    </FormControl>
                    <IconButton
                      onClick={() => removeOtherPhone(index)}
                      size="small"
                      color="error"
                    >
                      <Delete fontSize="small" />
                    </IconButton>
                  </Box>
                ))}
                <Button
                  startIcon={<Add />}
                  onClick={addOtherPhone}
                  variant="text"
                  size="small"
                  sx={{ mt: 1 }}
                >
                  Add phone number
                </Button>
              </Box>
              </div>
            </Box>
            {/* Identification Section */}
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
                <Badge sx={{ fontSize: 18 }} />
                Identification
              </Typography>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <Controller
                  name="external_id"
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
                      error={!!errors.external_id}
                      helperText={errors.external_id?.message}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Badge color="action" fontSize="small" />
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

            {/* Company Information */}
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
                <Business sx={{ fontSize: 18 }} />
                Company Information
              </Typography>
              <div className="grid grid-cols-1 gap-6">
                <Controller
                  name="company"
                  control={control}
                  render={({ field }) => (
                    <Autocomplete
                      {...field}
                      options={mockCompanies}
                      freeSolo
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Company"
                          placeholder="Enter company name"
                          size="small"
                          variant="outlined"
                          InputProps={{
                            ...params.InputProps,
                            startAdornment: (
                              <InputAdornment position="start">
                                <Business color="action" fontSize="small" />
                              </InputAdornment>
                            ),
                          }}
                        />
                      )}
                      onChange={(_, newValue) => field.onChange(newValue)}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 1,
                          "&:hover .MuiOutlinedInput-notchedOutline": {
                            borderColor: "#1976d2",
                          },
                        },
                        "& .MuiAutocomplete-popper": {
                          zIndex: 9999,
                        },
                        "& .MuiAutocomplete-listbox": {
                          zIndex: 9999,
                        },
                      }}
                      slotProps={{
                        popper: {
                          sx: {
                            zIndex: 9999,
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
                      label="Address"
                      placeholder="Enter some text"
                      fullWidth
                      multiline
                      rows={3}
                      variant="outlined"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <LocationOn color="action" fontSize="small" />
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

            {/* About */}
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
                <Description sx={{ fontSize: 18 }} />
                About
              </Typography>
              <div className="grid grid-cols-1 gap-6">
                <Controller
                  name="description"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Description"
                      placeholder="Enter some text"
                      fullWidth
                      multiline
                      rows={3}
                      variant="outlined"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Description color="action" fontSize="small" />
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
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default EditUser;
