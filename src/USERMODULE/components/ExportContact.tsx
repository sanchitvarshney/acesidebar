import React, { useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
  Typography,
  Divider,
} from "@mui/material";

const exportOptions = [
  "Full name",
  "Email",
  "Mobile phone",
  "Twitter",
  "Address",
  "About",
  "Unique external ID",
  "Title",
  "Work phone",
  "Other phone numbers",
  "Company",
  "Tags",
  "Can see all tickets from this company",
];

export default function ExportContact() {
  const [selected, setSelected] = useState<string[]>([]);

  const handleToggle = (label: string) => {
    setSelected((prev) =>
      prev.includes(label) ? prev.filter((item) => item !== label) : [...prev, label]
    );
  };

  const handleSelectAll = () => {
    if (selected.length === exportOptions.length) {
      setSelected([]);
    } else {
      setSelected([...exportOptions]);
    }
  };

  return (
    <Box sx={{ p: 3, width: 500, backgroundColor: "white" }}>
      <FormControlLabel
        control={
          <Checkbox
            checked={selected.length === exportOptions.length}
            onChange={handleSelectAll}
          />
        }
        label="Select all"
      />

      <Grid container spacing={0}>
        <Grid  size={{ xs: 12, md: 6 }}>
          {exportOptions
            .slice(0, Math.ceil(exportOptions.length / 2))
            .map((label) => (
              <FormControlLabel
                key={label}
                control={
                  <Checkbox
                    checked={selected.includes(label)}
                    onChange={() => handleToggle(label)}
                  />
                }
                label={label}
              />
            ))}
        </Grid>
        <Grid  size={{ xs: 12, md: 6 }}>
          {exportOptions
            .slice(Math.ceil(exportOptions.length / 2))
            .map((label) => (
              <FormControlLabel
                key={label}
                control={
                  <Checkbox
                    checked={selected.includes(label)}
                    onChange={() => handleToggle(label)}
                  />
                }
                label={label}
              />
            ))}
        </Grid>
      </Grid>

      <Divider sx={{ my: 3 }} />

      <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
        {/* <Button variant="outlined" color="inherit">
          Cancel
        </Button> */}
        <Button
          variant="contained"
          disabled={selected.length === 0}
          onClick={() => console.log("Exporting:", selected)}
        >
          Export
        </Button>
      </Box>
    </Box>
  );
}
