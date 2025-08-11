import React, { useState } from "react";
import {
  Box,
  Typography,
  Link,
  Paper,
  Button,
  Alert,
  AlertTitle
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

export default function ImportContact() {
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files.length > 0) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <Box sx={{ p: 3, maxWidth: 700 }}>
      {/* Instruction Text */}
      <Typography variant="body1" sx={{ mb: 2 }}>
        From here, you can import contacts into Freshdesk using a CSV. Take a look at{" "}
        <Link href="#" underline="hover">
          this article
        </Link>{" "}
        before you prepare the CSV file for importing. Make sure the CSV is encoded in UTF-8
        and the header row has the contact labels listed (name, email, etc.)
      </Typography>

      {/* File Upload Box */}
      <Paper
        variant="outlined"
        sx={{
          border: "2px dashed #ccc",
          p: 5,
          textAlign: "center",
          backgroundColor: "#f8f9fb",
          cursor: "pointer",
        }}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        onClick={() => document.getElementById("fileInput")?.click()}
      >
        <CloudUploadIcon sx={{ fontSize: 40, color: "#888" }} />
        <Typography variant="body1" color="primary" sx={{ mt: 1 }}>
          {file ? file.name : "Upload a file"}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          or drag and drop your CSV file here
        </Typography>
        <input
          id="fileInput"
          type="file"
          accept=".csv"
          style={{ display: "none" }}
          onChange={handleFileChange}
        />
      </Paper>

      {/* Important Note */}
      <Alert
        severity="warning"
        sx={{ mt: 3, backgroundColor: "#fff8f5", border: "1px solid #fdd" }}
      >
        <AlertTitle>Important note</AlertTitle>
        <ul style={{ margin: 0, paddingLeft: "1.2em" }}>
          <li>
            If an existing contact is found in the CSV file, their information will be
            updated in Freshdesk.
          </li>
        </ul>
      </Alert>

      {/* Action Buttons */}
      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3, gap: 2 }}>
      
        <Button variant="contained" disabled={!file}>
          Import
        </Button>
      </Box>
    </Box>
  );
}
