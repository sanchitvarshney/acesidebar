import { zodResolver } from "@hookform/resolvers/zod";
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  IconButton,
  List,
  ListItem,
  MenuItem,
  Paper,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import z from "zod";
import DeleteIcon from "@mui/icons-material/Delete";
import CustomToolTip from "../../../reusable/CustomToolTip";
import PriorityHighIcon from "@mui/icons-material/PriorityHigh";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import { useParams } from "react-router-dom";

const priorityOptions = [
  { label: "Low", value: "low", color: "#4caf50" }, // green
  { label: "Medium", value: "medium", color: "#ff9800" }, // orange
  { label: "High", value: "high", color: "#f44336" }, // red
];
const locationOptions = [
  { label: "Primary", value: "primary" }, // green
  { label: "Secondary", value: "secondary" }, // orange
  { label: "Tertiary", value: "tertiary" }, // red
];
const options = ["Product A", "Product B", "Service C", "Service D"];

// Zod schema
const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email"),
  subject: z.string().min(2, "Subject must be at least 2 characters"),
  priority: z.string().min(2, "Priority required"),
  message: z.string().min(2, "Message required"),
  preferredTime: z.string().optional(),
  location: z.string().optional(),
  interests: z.array(z.string()).optional(),
  mobileNo: z.string().regex(/^\d+$/, "Mobile number must contain only digits"),
  files: z
    .any()
    .refine((files) => files?.length <= 4, "Maximum of 4 files allowed"),
});

type FormData = z.infer<typeof schema>;

const GenralForm = ({ pageId }: { pageId: string | number }) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isDragOver, setIsDragOver] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    trigger,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onChange", // Real-time validation
    defaultValues: {
      name: "",
      email: "",
      priority: "low",
      preferredTime: "AM",
      files: [],
      interests: [],
      location: "primary",
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + selectedFiles.length > 1) return;

    const newFiles = [...selectedFiles, ...files].slice(0, 4);
    setSelectedFiles(newFiles);
    setValue("files", newFiles);
    trigger("files"); // Revalidate files
  };

  const handleFileRemove = (index: number) => {
    const updated = [...selectedFiles];
    updated.splice(index, 1);
    setSelectedFiles(updated);
    setValue("files", updated);
    trigger("files");
  };

  const onSubmit = (data: FormData) => {
    console.log("Form submitted", data);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent | any) => {
    e.preventDefault();
    setIsDragOver(false);
    handleFileChange(e.dataTransfer.files);
  };

  const renderLimitList = (
    <List sx={{ p: 2 }}>
      <ListItem disableGutters>
        <Typography variant="body2">
          • Maximum number of attachments: <strong>1</strong>
        </Typography>
      </ListItem>
      <ListItem disableGutters>
        <Typography variant="body2">
          • Maximum size per attachment: <strong>100 kB</strong>
        </Typography>
      </ListItem>
      <ListItem disableGutters>
        <Typography variant="body2">
          • Allowed file types: <strong>.gif, .jpg, .png</strong>
        </Typography>
      </ListItem>
    </List>
  );
  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      sx={{ maxWidth: 500, mx: "auto",  }}
    >
      <Controller
        name="name"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label={
              <Typography>
                Name <span className="text-red-500 text-md">*</span>
              </Typography>
            }
            fullWidth
            margin="normal"
            error={!!errors.name}
            helperText={errors.name?.message}
          />
        )}
      />
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
        name="priority"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            select
            size="small"
            label={
              <Typography>
                Priority <span className="text-red-500 text-md">*</span>
              </Typography>
            }
            margin="normal"
            error={!!errors.priority}
            helperText={errors.priority?.message}
          >
            {priorityOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                <Box display="flex" alignItems="center" gap={1}>
                  <PriorityHighIcon
                    style={{ color: option.color }}
                    fontSize="small"
                  />
                  <Typography>{option.label}</Typography>
                </Box>
              </MenuItem>
            ))}
          </TextField>
        )}
      />
      {pageId == 5 && ( 
        <>
          <Controller
            name="mobileNo"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label={"Mobile No."}
                fullWidth
                margin="normal"
                error={!!errors.mobileNo}
                helperText={errors.mobileNo?.message}
              />
            )}
          />

          <Controller
            name="location"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                select
                size="small"
                label={
                  <Typography>
                    Priority <span className="text-red-500 text-md">*</span>
                  </Typography>
                }
                margin="normal"
                error={!!errors.location}
                helperText={errors.location?.message}
              >
                {locationOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Typography>{option.label}</Typography>
                    </Box>
                  </MenuItem>
                ))}
              </TextField>
            )}
          />

          {/* Preferred Time */}
          <FormControl component="fieldset" fullWidth sx={{ mt: 1 }}>
            <FormLabel component="legend">
              <Typography variant="subtitle2">Preferred time:</Typography>
            </FormLabel>

            <Controller
              name="preferredTime"
              control={control}
              render={({ field }) => (
                <RadioGroup {...field}>
                  <FormControlLabel
                    value="AM"
                    control={<Radio color="primary" />}
                    label="AM"
                  />
                  <FormControlLabel
                    value="PM"
                    control={<Radio color="primary" />}
                    label="PM"
                  />
                  <FormControlLabel
                    value="Doesn't matter"
                    control={<Radio color="primary" />}
                    label="Doesn't matter"
                  />
                </RadioGroup>
              )}
            />
          </FormControl>

          {/* Interested In */}
          <FormControl component="fieldset" fullWidth sx={{ mt: 2 }}>
            <FormLabel component="legend">
              <Typography variant="subtitle2">Interested in:</Typography>
            </FormLabel>

            <Controller
              name="interests"
              control={control}
              render={({ field }: { field: any }) => {
                const { value, onChange } = field;

                const handleCheck = (checkedValue: any) => {
                  if (value?.includes(checkedValue)) {
                    onChange(
                      value?.filter((item: any) => item !== checkedValue)
                    );
                  } else {
                    onChange([...value, checkedValue]);
                  }
                };

                return (
                  <FormGroup>
                    {options.map((option) => (
                      <FormControlLabel
                        key={option}
                        control={
                          <Checkbox
                            color="primary"
                            checked={value.includes(option)}
                            onChange={() => handleCheck(option)}
                          />
                        }
                        label={
                          <Typography variant="subtitle1">{option}</Typography>
                        }
                      />
                    ))}
                  </FormGroup>
                );
              }}
            />
          </FormControl>
        </>
      )}
      <Controller
        name="subject"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label={
              <Typography>
                Subject <span className="text-red-500 text-md">*</span>
              </Typography>
            }
            fullWidth
            margin="normal"
            error={!!errors.subject}
            helperText={errors.subject?.message}
          />
        )}
      />

      <Controller
        name="message"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label={
              <Typography>
                Message <span className="text-red-500 text-md">*</span>
              </Typography>
            }
            fullWidth
            margin="normal"
            error={!!errors.message}
            helperText={errors.message?.message}
            multiline
            rows={6}
          />
        )}
      />

      {/* File Attachment Section */}

      <Box mt={2}>
        <Paper
          elevation={0}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          sx={{
            p: 1,
            border: isDragOver ? "2px dashed #1976d2" : "2px dashed #1976d2",
            borderRadius: 2,
            backgroundColor: isDragOver ? "#f3f8ff" : "#fafafa",
            textAlign: "center",
            cursor: "pointer",
            transition: "all 0.2s ease",
          }}
          onClick={() => fileInputRef.current?.click()}
        >
          <AttachFileIcon
            sx={{
              fontSize: 25,
              color: "#666",
              mb: 1,
            }}
          />
          <Typography variant="body2" sx={{ color: "#666", mb: 1 }}>
            {isDragOver
              ? "Drop files here"
              : "Drag & drop files here or click to browse"}
          </Typography>
        </Paper>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          style={{ display: "none" }}
          onChange={handleFileChange}
        />

        {errors.files && (
          <Typography color="error" variant="body2" mt={1}>
            {errors.files.message?.toString()}
          </Typography>
        )}
      </Box>

      <Stack spacing={1} mt={2}>
        {selectedFiles.map((file, index) => (
          <Paper
            key={index}
            variant="outlined"
            sx={{ p: 1, display: "flex", justifyContent: "space-between" }}
          >
            <Typography variant="body2">{file.name}</Typography>
            <IconButton size="small" onClick={() => handleFileRemove(index)}>
              <DeleteIcon fontSize="small" color="error" />
            </IconButton>
          </Paper>
        ))}
      </Stack>

      <CustomToolTip title={renderLimitList} placement={"bottom"}>
        <Typography
          variant="subtitle2"
          sx={{
            display: "inline-block",
            color: "primary.main",
            cursor: "pointer",
            textDecoration: "underline ",
            "&:hover": { textDecoration: "none" },
          }}
        >
          File Upload Limits
        </Typography>
      </CustomToolTip>

      <div className="flex justify-center">
        <Button
          type="submit"
          variant="contained"
          sx={{
            mt: 2,
            "&:hover": { backgroundColor: "#0080ffff" },
            p: 1,
            px: 3,
            fontSize: 15,
          }}
        >
          Submit
        </Button>
      </div>
    </Box>
  );
};

export default GenralForm;
