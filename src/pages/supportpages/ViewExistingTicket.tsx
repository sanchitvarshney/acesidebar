import React, { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
} from "@mui/material";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import ForgetTrackingId from "../../components/supportcomponents/ForgetTrackingId";

const ViewExistingTicket = () => {
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleForgetSubmit = (email: string, ticketType: "all" | "open") => {
    console.log("Submitted Email:", email);
    console.log("Ticket Type:", ticketType);
    setDialogOpen(false);
  };

  return (
    <Box sx={{ width: "100%", minHeight: "calc(100vh - 210px)", padding: 3 }}>
      <Typography
        variant="h5"
        component="h1"
        sx={{ mb: 3, fontWeight: 600, color: "#2c3e50", textAlign: "center" }}
      >
        <ConfirmationNumberIcon
          fontSize="large"
          color="primary"
          sx={{ mr: 1 }}
        />
        View Existing Ticket
      </Typography>

      <Card
        sx={{
          height: "auto",
          width: { sm: "100%", md: "50%", lg: "60%" },
          borderRadius: 3,
          boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
          mx: "auto",
          py: 2,
        }}
      >
        <CardContent
          sx={{
            p: 3,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 3,
          }}
        >
          <TextField
            label="Enter Ticket ID"
            variant="outlined"
            size="medium"
            sx={{
              width: { sm: 250, md: 350, lg: 400 },
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

          <Button variant="contained" color="primary" size="large">
            <Typography variant="body2" sx={{ fontWeight: "bold" }}>
              View Ticket
            </Typography>
          </Button>

          <Typography
            variant="body2"
            onClick={() => setDialogOpen(true)}
            sx={{
              fontWeight: "bold",
              color: "#1a73e8",
              cursor: "pointer",
              textDecoration: "underline",
              "&:hover": { textDecoration: "none" },
            }}
          >
            Forget Tracking ID?
          </Typography>
        </CardContent>
      </Card>

    
     
        <ForgetTrackingId
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          onSubmit={handleForgetSubmit}
        />

    </Box>
  );
};

export default ViewExistingTicket;
