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
  CircularProgress,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import z from "zod";
import {
  Email,
  Phone,
  Work,
  Person,
  Close,
  Business,
  LocationOn,
  Tag,
  Description,
  Twitter,
} from "@mui/icons-material";
import { TransitionProps } from "@mui/material/transitions";
import { forwardRef, useEffect } from "react";
import { useState } from "react";
import { useCommanApiMutation } from "../../services/threadsApi";
import { Slide } from "@mui/material";
import { useGetTagListQuery } from "../../services/ticketAuth";
import { useToast } from "../../hooks/useToast";
import MailIcon from "@mui/icons-material/Mail";
import { updateCacheWithNewRows } from "@mui/x-data-grid/hooks/features/rows/gridRowsUtils";
import { useUpdateUserDataMutation } from "../../services/auth";

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
  email: z.string().min(1, "At least one email is required"),
  altEmail: z.string().optional(),
  work_number: z
    .string()
    .regex(/^\d+$/, "Work number must contain only digits"),
  mobile_number: z
    .string()
    .regex(/^\d+$/, "Mobile number must contain only digits"),
  company: z.string().optional(),
  address: z.string().optional(),

  twitter: z.string().optional(),
  tags: z.string().optional(),
  other_number: z.string().optional(),
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

const EditUser = ({
  isEdit,
  close,
  userData,
  userId,
}: {
  isEdit: boolean;
  close: any;
  userData?: any;
  userId?: any;
}) => {
  const { showToast } = useToast();
  const [updateUserData, { isLoading: updateLoading }] =
    useUpdateUserDataMutation();
  const { data: tagList } = useGetTagListQuery();
  const [tagValue, setTagValue] = useState<any[]>([]);
  const [changeTagValue, setChangeTabValue] = useState("");
  const [options, setOptions] = useState<any>([]);
  const displayOptions = changeTagValue.length >= 3 ? options : [];

  const fetchOptions = (value: string) => {
    if (!value || value.length < 3) return [];
    const filteredOptions = tagList?.filter((option: any) =>
      option.tagName?.toLowerCase().includes(value?.toLowerCase())
    );
    return filteredOptions || [];
  };

  useEffect(() => {
    if (changeTagValue.length >= 3) {
      const filterValue: any = fetchOptions(changeTagValue);
      setOptions(filterValue);
    } else {
      setOptions([]);
    }
  }, [changeTagValue, tagList]);

  const handleSelectedOption = (_: any, newValue: any, type: string) => {
    if (type === "tag") {
      if (!Array.isArray(newValue) || newValue.length === 0) {
        showToast("Tag already exists", "error");
        return;
      }

      setTagValue((prev) => {
        // Find newly added tags (those not already in prev)
        const addedTags = newValue.filter(
          (tag: any) => !prev.some((p) => p.tagID === tag.tagID)
        );

        if (addedTags.length === 0) {
          // No new tags (all duplicates)
          showToast("Tag already exists", "error");
          return prev;
        }

        return [...prev, ...addedTags];
      });
    }
  };

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onChange",
  });
  useEffect(() => {
    if (!userId || !userData) return;
    if (userData) {
      reset({
        name: userData.name || "",
        job_title: userData.jobTitle || "",
        email: userData.emailId || "",
        altEmail: userData.emailAlt || "",
        work_number: userData.workPhone || "",
        mobile_number: userData.phoneNo || "",
        company: userData.company || "",
        address: userData.address || "",
        other_number: userData.phoneAlt || "",

        twitter: userData.socialData?.x || "",
      });
    }
  }, [userData, userId]);

  const onSubmit = (data: FormData) => {
    if(!userId){
      showToast("User ID not available", "error");
      return
    }
    const payload = {
      key: userId,
      type: "profile",
      body: {
        name: data.name,
        jobTitle: data.job_title || "--",
        email: data.email,
        altEmail:data.altEmail || "--",
        workNumber: data.work_number || "--",
        mobileNumber: data.mobile_number || "--",
        company: data.company || "--",
        address: data.address || "--",
        twitter: data.twitter || "--",
        altPhone: data.other_number || "--",
      },
    };
    updateUserData(payload).then((res: any) => {
      if (res?.data?.type === "error") {
        showToast(res?.data?.message, "error");
        return;
      }
      if (res?.data?.type === "success") {
        showToast(res?.data?.message, "success");
        close();
        return;
      }
    });
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
            {
              updateLoading ? (
                <CircularProgress size={16} color="inherit" />
              ):(
                "Save"
              )
            }
          </Button>
        </Toolbar>
      </AppBar>
      {/* Form Content */}
      <DialogContent dividers sx={{ backgroundColor: "white" }}>
        <Box sx={{ px: 8, py: 1 }}>
          {/* Mandatory Fields Alert */}
          <Alert
            severity="info"
            sx={{
              mb: 2,
              display: "flex",
              alignItems: "center",
              borderRadius: 2,
              "& .MuiAlert-icon": { color: "#03363d" },
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
            {/* Personal Information */}
            <Box>
              <Typography
                variant="subtitle1"
                sx={{
                  mb: 1,
                  color: "#03363d",
                  fontWeight: 600,
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <Person sx={{ fontSize: 20 }} />
                Personal Information
              </Typography>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    Full Name{" "}
                    <span className="text-red-500 text-lg font-bold">*</span>
                  </Typography>
                  <Controller
                    name="name"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
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
                      />
                    )}
                  />
                </div>
                <div>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    Job Title{" "}
                    <span className="text-red-500 text-lg font-bold" />
                  </Typography>
                  <Controller
                    name="job_title"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        size="small"
                        variant="outlined"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Work color="action" fontSize="small" />
                            </InputAdornment>
                          ),
                        }}
                        error={!!errors.job_title}
                        helperText={errors.job_title?.message}
                      />
                    )}
                  />
                </div>
              </div>
            </Box>

            {/* Contact Information */}
            <Box>
              <Typography
                variant="subtitle1"
                sx={{
                  mb: 1,
                  color: "#03363d",
                  fontWeight: 600,
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <Email sx={{ fontSize: 20 }} />
                Contact Information
              </Typography>

              {/* Email Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <Box>
                  {/* {emails.map((email, index) => ( */}
                  {/* <Box
                    key={index}
                    sx={{
                      display: "flex",
                      gap: 2,
                      mb: 1,
                      alignItems: "flex-start",
                    }}
                  > */}
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    Email Address{" "}
                    <span className="text-red-500 text-lg font-bold">*</span>
                  </Typography>
                  <Controller
                    name="email"
                    control={control}
                    render={({ field, fieldState }) => (
                      <TextField
                        {...field}
                        size="small"
                        variant="outlined"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <MailIcon color="action" fontSize="small" />
                            </InputAdornment>
                          ),
                        }}
                        fullWidth
                        error={!!fieldState.error}
                        helperText={fieldState.error?.message}
                      />
                    )}
                  />

                  {/* <FormControl size="small" sx={{ flex: 1 }}>
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
                        fullWidth
                      >
                        <MenuItem value="secondary">--</MenuItem>
                        <MenuItem value="primary">Primary</MenuItem>
                      </Select>
                    </FormControl> */}
                  {/* {emails.length > 1 && (
                      <IconButton
                        onClick={() => removeEmail(index)}
                        size="small"
                        color="error"
                        sx={{ mt: 0.5 }}
                      >
                        <Delete fontSize="small" />
                      </IconButton>
                    )} */}
                  {/* </Box> */}
                  {/* ))} */}
                  {/* <Button
                  startIcon={<Add />}
                  onClick={addEmail}
                  variant="text"
                  size="small"
                  sx={{ mt: 1 }}
                >
                  Add email address
                </Button> */}
                </Box>
                <Box>
                  {/* {emails.map((email, index) => ( */}
                  {/* <Box
                    key={index}
                    sx={{
                      display: "flex",
                      gap: 2,
                      mb: 1,
                      alignItems: "flex-start",
                    }}
                  > */}
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    Alternate Email{" "}
                    <span className="text-red-500 text-lg font-bold" />
                  </Typography>
                  <Controller
                    name="altEmail"
                    control={control}
                    render={({ field, fieldState }) => (
                      <TextField
                        {...field}
                        size="small"
                        variant="outlined"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <MailIcon color="action" fontSize="small" />
                            </InputAdornment>
                          ),
                        }}
                        fullWidth
                        error={!!fieldState.error}
                        helperText={fieldState.error?.message}
                      />
                    )}
                  />

                  {/* <FormControl size="small" sx={{ flex: 1 }}>
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
                        fullWidth
                      >
                        <MenuItem value="secondary">--</MenuItem>
                        <MenuItem value="primary">Primary</MenuItem>
                      </Select>
                    </FormControl> */}
                  {/* {emails.length > 1 && (
                      <IconButton
                        onClick={() => removeEmail(index)}
                        size="small"
                        color="error"
                        sx={{ mt: 0.5 }}
                      >
                        <Delete fontSize="small" />
                      </IconButton>
                    )} */}
                  {/* </Box> */}
                  {/* ))} */}
                  {/* <Button
                  startIcon={<Add />}
                  onClick={addEmail}
                  variant="text"
                  size="small"
                  sx={{ mt: 1 }}
                >
                  Add email address
                </Button> */}
                </Box>

                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    Twitter <span className="text-red-500 text-lg font-bold" />
                  </Typography>
                  <Controller
                    name="twitter"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
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
                        error={!!errors.twitter}
                        helperText={errors.twitter?.message}
                      />
                    )}
                  />
                </Box>
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    Work Phone{" "}
                    <span className="text-red-500 text-lg font-bold" />
                  </Typography>
                  <Controller
                    name="work_number"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        size="small"
                        variant="outlined"
                        error={!!errors.work_number}
                        helperText={errors.work_number?.message}
                        type="tel"
                        inputProps={{
                          pattern: "[0-9]*",
                          inputMode: "numeric",
                        }}
                        onChange={(e) => {
                          const value = e.target.value.replace(/[^0-9]/g, "");
                          field.onChange(value);
                        }}
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
                </Box>
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    Mobile Phone{" "}
                    <span className="text-red-500 text-lg font-bold">*</span>
                  </Typography>
                  <Controller
                    name="mobile_number"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        size="small"
                        variant="outlined"
                        error={!!errors.mobile_number}
                        helperText={errors.mobile_number?.message}
                        type="tel"
                        inputProps={{
                          pattern: "[0-9]*",
                          inputMode: "numeric",
                        }}
                        onChange={(e) => {
                          const value = e.target.value.replace(/[^0-9]/g, "");
                          field.onChange(value);
                        }}
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
                </Box>
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    Other Phone{" "}
                    <span className="text-red-500 text-lg font-bold" />
                  </Typography>
                  <Controller
                    name="other_number"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        size="small"
                        variant="outlined"
                        error={!!errors.other_number}
                        helperText={errors.other_number?.message}
                        type="tel"
                        inputProps={{
                          pattern: "[0-9]*",
                          inputMode: "numeric",
                        }}
                        onChange={(e) => {
                          const value = e.target.value.replace(/[^0-9]/g, "");
                          field.onChange(value);
                        }}
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
                </Box>
              </div>
            </Box>

            {/* Phone Numbers Section */}
            {/* <Box>
              <Typography
                variant="subtitle1"
                sx={{
                  mb: 2,
                  color: "#03363d",
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
                            borderColor: "#03363d",
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
                            borderColor: "#03363d",
                          },
                        },
                      }}
                    />
                  )}
                />

      
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
            </Box> */}

            {/* Company Information */}
            <Box>
              <Typography
                variant="subtitle1"
                sx={{
                  mb: 1,
                  color: "#03363d",
                  fontWeight: 600,
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <Business sx={{ fontSize: 20 }} />
                Company Information
              </Typography>
              <div className="grid grid-cols-1 gap-8">
                <div>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    Company Name{" "}
                    <span className="text-red-500 text-lg font-bold">*</span>
                  </Typography>
                  <Controller
                    name="company"
                    control={control ?? ""}
                    render={({ field }) => (
                      <Autocomplete
                        {...field}
                        options={mockCompanies}
                        freeSolo
                        renderInput={(params) => (
                          <TextField
                            {...params}
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
                          width: "49%",
                          "& .MuiOutlinedInput-root": {
                            borderRadius: 1,
                            "&:hover .MuiOutlinedInput-notchedOutline": {
                              borderColor: "#03363d",
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

                <div>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    Address <span className="text-red-500 text-lg font-bold" />
                  </Typography>
                  <Controller
                    name="address"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
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
                              borderColor: "#03363d",
                            },
                          },
                        }}
                      />
                    )}
                  />
                </div>
              </div>
            </Box>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default EditUser;
