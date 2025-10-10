import React, { useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
  Typography,
  Divider,
  Container,
  Paper,
  Alert,
} from "@mui/material";
import {
  Download,
  Settings,
  ContactMail,
  Business,
  Phone,
  LocationOn,
} from "@mui/icons-material";
import { useCommanApiMutation } from "../../services/threadsApi";

const exportOptions = [
  "Full name",
  "Email",
  "Mobile phone",
  "Twitter",
  "Address",
  "About",
  "Title",
  "Work phone",
  "Other phone numbers",
  "Company",
  "Tags",
];

export default function ExportContact() {
  const [selected, setSelected] = useState<string[]>([]);
  const [commanApi] = useCommanApiMutation();

  const handleToggle = (label: string) => {
    setSelected((prev) =>
      prev.includes(label)
        ? prev.filter((item) => item !== label)
        : [...prev, label]
    );
  };

  const handleSelectAll = () => {
    if (selected.length === exportOptions.length) {
      setSelected([]);
    } else {
      setSelected([...exportOptions]);
    }
  };

  const handleExport = () => {
    const payload = { url: "export-contacts", body: { fields: selected } };
    commanApi(payload);
  };

  // Group options by category for better organization
  const personalInfo = ["Full name", "Email", "About", "Title"];
  const contactInfo = [
    "Mobile phone",
    "Work phone",
    "Other phone numbers",
    "Twitter",
  ];
  const businessInfo = [
    "Company",
    "Address",
    "Tags",
    "Can see all tickets from this company",
  ];
  const identification = ["Unique external ID"];

  return (
    <Container maxWidth="md" sx={{ py: 2 }}>
      <Box sx={{ p: 0 }}>
        {/* Header Alert */}
        <Alert
          severity="info"
          sx={{
            mb: 3,
            borderRadius: 2,
            "& .MuiAlert-icon": { color: "#1976d2" },
          }}
        >
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            Select the fields you want to export from your contacts
          </Typography>
        </Alert>

        {/* Select All Section */}
        <Box sx={{ mb: 2 }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={selected.length === exportOptions.length}
                onChange={handleSelectAll}
                sx={{
                  color: "#1976d2",
                  "&.Mui-checked": {
                    color: "#1976d2",
                  },
                }}
              />
            }
            label={
              <Typography
                variant="h6"
                sx={{ fontWeight: 600, color: "#1976d2" }}
              >
                Select all fields
              </Typography>
            }
          />
        </Box>

        <Divider sx={{ mb: 3 }} />

        {/* Export Options Grid */}
        <Grid container spacing={3}>
          {/* Personal Information */}
          <Grid size={6}>
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
                <ContactMail sx={{ fontSize: 20 }} />
                Personal Information
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                {personalInfo.map((label) => (
                  <FormControlLabel
                    key={label}
                    control={
                      <Checkbox
                        checked={selected.includes(label)}
                        onChange={() => handleToggle(label)}
                        sx={{
                          color: "#1976d2",
                          "&.Mui-checked": {
                            color: "#1976d2",
                          },
                        }}
                      />
                    }
                    label={
                      <Typography variant="body2" sx={{ fontSize: "0.9rem" }}>
                        {label}
                      </Typography>
                    }
                  />
                ))}
              </Box>
            </Box>
          </Grid>

          {/* Contact Information */}
          <Grid size={6}>
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
                Contact Information
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                {contactInfo.map((label) => (
                  <FormControlLabel
                    key={label}
                    control={
                      <Checkbox
                        checked={selected.includes(label)}
                        onChange={() => handleToggle(label)}
                        sx={{
                          color: "#1976d2",
                          "&.Mui-checked": {
                            color: "#1976d2",
                          },
                        }}
                      />
                    }
                    label={
                      <Typography variant="body2" sx={{ fontSize: "0.9rem" }}>
                        {label}
                      </Typography>
                    }
                  />
                ))}
              </Box>
            </Box>
          </Grid>

          {/* Business Information */}
          <Grid size={6}>
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
                Business Information
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                {businessInfo.map((label) => (
                  <FormControlLabel
                    key={label}
                    control={
                      <Checkbox
                        checked={selected.includes(label)}
                        onChange={() => handleToggle(label)}
                        sx={{
                          color: "#1976d2",
                          "&.Mui-checked": {
                            color: "#1976d2",
                          },
                        }}
                      />
                    }
                    label={
                      <Typography variant="body2" sx={{ fontSize: "0.9rem" }}>
                        {label}
                      </Typography>
                    }
                  />
                ))}
              </Box>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4 }} />

        {/* Action Buttons */}
        <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
          {/* <Button
            variant="outlined"
            color="inherit"
            sx={{
              borderRadius: 2,
              textTransform: "none",
              px: 3,
            }}
          >
            Cancel
          </Button> */}
          <Button
            variant="contained"
            disabled={selected.length === 0}
            onClick={handleExport}
            startIcon={<Download />}
            sx={{
              borderRadius: 2,
              textTransform: "none",
              px: 3,
              "&:hover": { backgroundColor: "#0080ffff" },
              fontSize: 15,
            }}
          >
            Export ({selected.length} fields)
          </Button>
        </Box>
      </Box>
    </Container>
  );
}
