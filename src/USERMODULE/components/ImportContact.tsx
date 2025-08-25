import React, { useState } from "react";
import {
  Box,
  Typography,
  Link,
  Paper,
  Button,
  Alert,
  AlertTitle,
  Container,
  Divider,
} from "@mui/material";
import { 
  CloudUpload, 
  FileUpload, 
  Description, 
  Warning,
  UploadFile 
} from "@mui/icons-material";
import { useCommanApiMutation } from "../../services/threadsApi";

// Define the contact fields structure
interface ContactField {
  name: string;
  job_title: string;
  email: string;
  phone: string;
  mobile: string;
  other_phone_numbers: string;
  twitter_id: string;
  company_name: string;
  address: string;
  tag_names: string;
  description: string;
  client_manager: string;
  unique_external_id: string;
}

export default function ImportContact() {
  const [file, setFile] = useState<File | null>(null);
 
  const [commanApi] = useCommanApiMutation();

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

  const parseCSV = (csvText: string): ContactField[] => {
    const lines = csvText.split('\n');
    const headers = lines[0].split(',').map(header => header.trim().toLowerCase().replace(/"/g, ''));
    
    // Map CSV headers to our field structure
    const fieldMapping: { [key: string]: keyof ContactField } = {
      'name': 'name',
      'job_title': 'job_title',
      'email': 'email',
      'phone': 'phone',
      'mobile': 'mobile',
      'other_phone_numbers': 'other_phone_numbers',
      'twitter_id': 'twitter_id',
      'company_name': 'company_name',
      'address': 'address',
      'tag_names': 'tag_names',
      'description': 'description',
      'client_manager': 'client_manager',
      'unique_external_id': 'unique_external_id'
    };

    const contacts: ContactField[] = [];
    
    for (let i = 1; i < lines.length; i++) {
      if (lines[i].trim()) {
        const values = lines[i].split(',').map(value => value.trim().replace(/"/g, ''));
        const contact: Partial<ContactField> = {};
        
        headers.forEach((header, index) => {
          const fieldKey = fieldMapping[header];
          if (fieldKey && values[index]) {
            contact[fieldKey] = values[index];
          }
        });
        
        // Only add if we have at least a name or email
        if (contact.name || contact.email) {
          contacts.push(contact as ContactField);
        }
      }
    }
    
    return contacts;
  };

  const handleImport = async () => {
    if (!file) return;
    
  
    

      const fileText = await file.text();
      const contacts = parseCSV(fileText);
  

      // Prepare payload for API
      const payload = {
        url: "import-contacts",
        method: "POST",
        body: {
          contacts: contacts,
          total_contacts: contacts.length,
          import_fields: [
            "name", "job_title", "email", "phone", "mobile", 
            "other_phone_numbers", "twitter_id", "company_name", 
            "address", "tag_names", "description", "client_manager", 
            "unique_external_id"
          ]
        }
      };

     commanApi(payload)
      
 
  };

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
            Import contacts into your system using a CSV file
          </Typography>
        </Alert>

        {/* Instructions Section */}
        <Box sx={{ mb: 4 }}>
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
            <Description sx={{ fontSize: 20 }} />
            Instructions
          </Typography>
          <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.6 }}>
            From here, you can import contacts using a CSV file. Take a look at{" "}
            <Link 
              href="#" 
              underline="hover" 
              sx={{ color: "#1976d2", fontWeight: 600 }}
            >
              this article
            </Link>{" "}
            before you prepare the CSV file for importing.
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary", lineHeight: 1.5 }}>
            Make sure the CSV is encoded in UTF-8 and the header row has the contact labels listed (name, email, etc.)
          </Typography>
        </Box>

        <Divider sx={{ mb: 4 }} />

        {/* File Upload Section */}
        <Box sx={{ mb: 4 }}>
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
            <FileUpload sx={{ fontSize: 20 }} />
            Upload CSV File
          </Typography>
          
          {/* File Upload Box */}
          <Paper
            variant="outlined"
            sx={{
              border: "2px dashed #1976d2",
              borderRadius: 3,
              p: 2,
              textAlign: "center",
              backgroundColor: "#f8f9fb",
              cursor: "pointer",
              transition: "all 0.3s ease",
              "&:hover": {
                backgroundColor: "#e3f2fd",
                borderColor: "#1565c0",
                transform: "translateY(-2px)",
                boxShadow: "0 4px 12px rgba(25, 118, 210, 0.15)",
              },
            }}
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            onClick={() => document.getElementById("fileInput")?.click()}
          >
            {file ? (
              <>
                <UploadFile sx={{ fontSize: 48, color: "#1976d2", mb: 2 }} />
                <Typography variant="h6" color="primary" sx={{ mb: 1, fontWeight: 600 }}>
                  {file.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  File selected successfully
                </Typography>
              </>
            ) : (
              <>
                <CloudUpload sx={{ fontSize: 48, color: "#1976d2", mb: 2 }} />
                <Typography variant="h6" color="primary" sx={{ mb: 1, fontWeight: 600 }}>
                  Upload a CSV file
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  or drag and drop your CSV file here
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Supports .csv files only
                </Typography>
              </>
            )}
            <input
              id="fileInput"
              type="file"
              accept=".csv"
              style={{ display: "none" }}
              onChange={handleFileChange}
            />
          </Paper>
        </Box>

        {/* Important Note Section */}
        <Box sx={{ mb: 2 }}>
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
            <Warning sx={{ fontSize: 20 }} />
            Important Notes
          </Typography>
          <Alert
            severity="warning"
            sx={{ 
              backgroundColor: "#fff8f5", 
              border: "1px solid #fdd",
              borderRadius: 2,
              "& .MuiAlert-icon": { color: "#ed6c02" },
            }}
          >
            <AlertTitle sx={{ fontWeight: 600 }}>Update Behavior</AlertTitle>
            <Typography variant="body2" sx={{ lineHeight: 1.5 }}>
              If an existing contact is found in the CSV file, their information will be updated in the system.
            </Typography>
          </Alert>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Action Buttons */}
        <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
       
          <Button
            variant="contained"
            disabled={!file}
            onClick={handleImport}
            startIcon={<UploadFile />}
            sx={{
              borderRadius: 2,
              textTransform: "none",
              px: 3,
              "&:hover": { backgroundColor: "#0080ffff" },
              fontSize: 15,
            }}
          >
            Import Contacts
          </Button>
        </Box>
      </Box>
    </Container>
  );
}
