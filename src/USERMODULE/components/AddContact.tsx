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
  Chip,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import z from "zod";
import {
  Email,
  Phone,
  Work,
  Person,
  Close,
  Add,
  Delete,
  Business,
  LocationOn,
  Tag,
  Description,
  Twitter,
} from "@mui/icons-material";
import { Transition } from "../pages/EditUser";
import { useEffect, useState } from "react";
import { useCommanApiMutation } from "../../services/threadsApi";
import { useToast } from "../../hooks/useToast";
import { useGetTagListQuery } from "../../services/ticketAuth";
import MailIcon from "@mui/icons-material/Mail";
import { useAddUserMutation } from "../../services/auth";
// Zod schema
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
  description: z.string().optional(),
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

const AddContact = ({ isAdd, close }: { isAdd: any; close: any }) => {
  const { showToast } = useToast();
  const { data: tagList } = useGetTagListQuery();
  const [tagValue, setTagValue] = useState<any[]>([]);
  const [changeTagValue, setChangeTabValue] = useState("");
  const [options, setOptions] = useState<any>([]);
  const [addUser, { isLoading }] = useAddUserMutation();
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

  // const addEmail = () => {
  //   const newEmail = { value: "", primary: false, label: undefined };
  //   setEmails([...emails, newEmail]);
  //   setValue("emails", [...emails, newEmail]);
  // };

  // const updateEmail = (index: number, field: string, value: any) => {
  //   const updatedEmails = emails;
  //   updatedEmails[index] = { ...updatedEmails[index], [field]: value };
  //   setEmails(updatedEmails);
  //   // setValue("email", updatedEmails);
  // };

  // const removeEmail = (index: number) => {
  //   if (emails.length > 1) {
  //     const updatedEmails = emails.filter((_, i) => i !== index);
  //     setEmails(updatedEmails);
  //     setValue("email", updatedEmails);
  //   }
  // };

  // const addOtherPhone = () => {
  //   const newPhone = { value: "", primary: false, original_value: "" };
  //   setOtherPhones([...otherPhones, newPhone]);
  //   setValue("other_phone_numbers", [...otherPhones, newPhone]);
  // };

  // const updateOtherPhone = (index: number, field: string, value: any) => {
  //   const updatedPhones = [...otherPhones];
  //   updatedPhones[index] = { ...updatedPhones[index], [field]: value };
  //   setOtherPhones(updatedPhones);
  //   setValue("other_phone_numbers", updatedPhones);
  // };

  // const removeOtherPhone = (index: number) => {
  //   const updatedPhones = otherPhones.filter((_, i) => i !== index);
  //   setOtherPhones(updatedPhones);
  //   setValue("other_phone_numbers", updatedPhones);
  // };

  const onSubmit = (data: FormData) => {
    // Transform data to match the expected payload structure
    const payload: any = {
      name: data.name,
      email: data.email,
      altEmail: data.altEmail,
      workNumber: data.work_number,
      mobileNumber: data.mobile_number,
      altMobileNumber: data.other_number,
      address: data.address,
      jobTitle: data.job_title,
      company: data.company,
      twitter: data.twitter,
    };

    addUser(payload).then((res: any) => {
      console.log("res", res);
      if (res?.data?.type === "error") {
        showToast(res?.data?.message || "An error occurred", "error");
        return;
      }
      if (res?.data?.type === "success") {
        showToast(
          res?.data?.message || "Contact added successfully",
          "success"
        );
        reset();
        close();
        return;
      }
    });
  };

  return (
    <Dialog
      open={isAdd}
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
      component="form"
      onSubmit={handleSubmit(onSubmit)}
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
            Add Contact
          </Typography>
          <Button autoFocus color="inherit" type="submit">
            Save
          </Button>
        </Toolbar>
      </AppBar>
      {/* Form Content */}
      <DialogContent
        dividers
        sx={{ backgroundColor: "white" }}
        className="custom-scrollbar"
      >
        <Box sx={{ px: 8, py: 1 }}>
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
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 3,
              pr: 1,
            }}
          >
            {/* Personal Information */}
            <Box>
              <Typography
                variant="subtitle1"
                sx={{
                  mb: 1,
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

            {/* Phone Numbers */}
            {/* <Box>
              <Typography
                variant="subtitle1"
                sx={{
                  mb: 1,
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

            
            </Box> */}

            {/* Company Information */}
            <Box>
              <Typography
                variant="subtitle1"
                sx={{
                  mb: 1,
                  color: "#1976d2",
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
                              borderColor: "#1976d2",
                            },
                          },
                        }}
                      />
                    )}
                  />
                </div>
              </div>
            </Box>

            {/* Tags */}
            {/* <Box>
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
                <Tag sx={{ fontSize: 20 }} />
                Tags
              </Typography>
              <div className="grid grid-cols-1 gap-4">
                <Autocomplete
                  multiple
                  disableClearable
                  popupIcon={null}
                  getOptionLabel={(option) => {
                    if (typeof option === "string") return option;
                    return option.tagName || option.name || "";
                  }}
                  options={displayOptions}
                  value={tagValue}
                  onChange={(event, newValue) => {
                    handleSelectedOption(event, newValue, "tag");
                  }}
                  onInputChange={(_, value) => setChangeTabValue(value)}
                  filterOptions={(x) => x}
                  getOptionDisabled={(option) => option === "Type to search"}
                  noOptionsText={
                    changeTagValue.length < 3
                      ? "Type at least 3 characters to search"
                      : "No tags found"
                  }
                  ListboxProps={{ className: "custom-scrollbar" }}
                  renderOption={(props, option) => {
                    return (
                      <li {...props}>
                        {typeof option === "string" ? (
                          option
                        ) : (
                          <div
                            className="flex items-center gap-3 p-1 rounded-md w-full custom-scrollbar"
                            style={{ cursor: "pointer" }}
                          >
                            <div className="flex flex-col">
                              <Typography
                                variant="subtitle2"
                                sx={{ fontWeight: 600 }}
                              >
                                {option.tagName}
                              </Typography>
                            </div>
                          </div>
                        )}
                      </li>
                    );
                  }}
                  renderTags={(editTags, getTagProps) =>
                    editTags?.map((option, index) => (
                      <Chip
                        key={index}
                        label={
                          typeof option === "string"
                            ? option
                            : option.name ?? option.tagName
                        }
                        onDelete={() => {
                          const newTags = editTags.filter(
                            (_, i) => i !== index
                          );
                          setTagValue(newTags);
                        }}
                        sx={{
                          "& .MuiChip-deleteIcon": {
                            color: "error.main",
                          },
                          "& .MuiChip-deleteIcon:hover": {
                            color: "#e87f8c",
                          },
                        }}
                      />
                    ))
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="outlined"
                      size="medium"
                      fullWidth
                      placeholder="Type to search tags..."
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "4px",
                          backgroundColor: "#f9fafb",
                          "&:hover fieldset": { borderColor: "#9ca3af" },
                          "&.Mui-focused fieldset": { borderColor: "#1a73e8" },
                        },
                        "& label.Mui-focused": { color: "#1a73e8" },
                        "& label": { fontWeight: "bold" },
                      }}
                    />
                  )}
                />
              </div>
            </Box>

 
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
                <Description sx={{ fontSize: 20 }} />
                About
              </Typography>
              <div className="grid grid-cols-1 gap-4">
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
            </Box> */}
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default AddContact;
