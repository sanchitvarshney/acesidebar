import React from "react";
import { Box, Paper, Typography, Stack, Divider } from "@mui/material";
import { UserProfileInfo } from "./types";
import MailIcon from "@mui/icons-material/Mail";
import PhoneIcon from "@mui/icons-material/Phone";
import LocationIcon from "@mui/icons-material/LocationOn";

type ContactDetailsProps = Pick<UserProfileInfo, "email" | "phone" | "address">;

const ContactDetails: React.FC<ContactDetailsProps> = ({
  email,
  phone,
  address,
}) => {
  return (
    <Box sx={{ flex: 1 }}>
      <Paper
        elevation={0}
        sx={{
          height: "100%",
          bgcolor: "background.paper",
          borderRadius: 2,
          border: "1px solid #e5e7eb",
          p: 3,
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
          Contact Details
        </Typography>

        <Divider sx={{ my: 1 }} />

        <Stack spacing={3} sx={{ mt: 2 }}>
          <Box>
            <Typography
              variant="subtitle2"
              sx={{ fontWeight: 600, color: "text.secondary", mb: 1.5 }}
            >
              Email Address
            </Typography>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                p: 2,
                borderRadius: 2,
                bgcolor: "primary.50",
                border: "1px solid",
                borderColor: "primary.200",
              }}
            >
              <MailIcon sx={{ color: "primary.main" }} />
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                {email}
              </Typography>
            </Box>
          </Box>

          <Box>
            <Typography
              variant="subtitle2"
              sx={{ fontWeight: 600, color: "text.secondary", mb: 1.5 }}
            >
              Work Phone
            </Typography>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                p: 2,
                borderRadius: 2,
                bgcolor: "success.50",
                border: "1px solid",
                borderColor: "success.200",
              }}
            >
              <PhoneIcon sx={{ color: "success.main" }} />
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                {phone}
              </Typography>
            </Box>
          </Box>

          <Box>
            <Typography
              variant="subtitle2"
              sx={{ fontWeight: 600, color: "text.secondary", mb: 1.5 }}
            >
              Address
            </Typography>
            <Box
              sx={{
                display: "flex",
                alignItems: "flex-start",
                gap: 2,
                p: 2,
                borderRadius: 2,
                bgcolor: "warning.50",
                border: "1px solid",
                borderColor: "warning.200",
              }}
            >
              <LocationIcon sx={{ color: "warning.main", mt: 0.5 }} />
              <Typography
                variant="body2"
                sx={{ fontWeight: 500, lineHeight: 1.5 }}
              >
                {address}
              </Typography>
            </Box>
          </Box>
        </Stack>
      </Paper>
    </Box>
  );
};

export default ContactDetails;
