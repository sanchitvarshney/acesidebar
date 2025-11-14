import React from "react";
import { Box, Paper, Typography, Stack, Divider, Button } from "@mui/material";
import { UserProfileInfo } from "./types";
import MailIcon from "@mui/icons-material/Mail";
import PhoneIcon from "@mui/icons-material/Phone";
import LocationIcon from "@mui/icons-material/LocationOn";
import AddIcon from "@mui/icons-material/Add";

type ContactDetailsProps = Pick<UserProfileInfo, "email" | "phone" | "address">;

const ContactDetails: React.FC<ContactDetailsProps> = ({
  email,
  phone,
  address,
}) => {
  return (
    <Box>
      <Paper
        elevation={0}
        sx={{
          bgcolor: "white",
          borderRadius: 3,
          border: "1px solid #e8eaed",
          boxShadow:
            "0 1px 2px 0 rgba(60,64,67,0.3), 0 1px 3px 1px rgba(60,64,67,0.15)",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{ p: 3, borderBottom: "1px solid #e8eaed", bgcolor: "#f8f9fa" }}
        >
          <Typography variant="h6" sx={{ fontWeight: 600, color: "#202124" }}>
            Contact Information
          </Typography>
        </Box>

        <Box sx={{ p: 3 }}>
          <Stack spacing={3}>
            <Box>
              <Typography
                variant="subtitle2"
                sx={{ fontWeight: 600, color: "#5f6368", mb: 1.5 }}
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
                  bgcolor: "#e0e0e0",
                  border: "1px solid #dadce0",
                }}
              >
                <MailIcon sx={{ color: "#2566b0" }} />
                <Typography
                  variant="body2"
                  sx={{ fontWeight: 500, color: "#202124" }}
                >
                  {email}
                </Typography>
              </Box>
            </Box>

            <Box>
              <Typography
                variant="subtitle2"
                sx={{ fontWeight: 600, color: "#5f6368", mb: 1.5 }}
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
                  bgcolor: "#e6f4ea",
                  border: "1px solid #dadce0",
                }}
              >
                <PhoneIcon sx={{ color: "#137333" }} />
                <Typography
                  variant="body2"
                  sx={{ fontWeight: 500, color: "#202124" }}
                >
                  {phone}
                </Typography>
              </Box>
            </Box>

            <Box>
              <Typography
                variant="subtitle2"
                sx={{ fontWeight: 600, color: "#5f6368", mb: 1.5 }}
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
                  bgcolor: "#fef7e0",
                  border: "1px solid #dadce0",
                }}
              >
                <LocationIcon sx={{ color: "#b06000", mt: 0.5 }} />
                <Typography
                  variant="body2"
                  sx={{ fontWeight: 500, color: "#202124", lineHeight: 1.5 }}
                >
                  {address}
                </Typography>
              </Box>
            </Box>
          </Stack>

          <Divider sx={{ my: 3 }} />

          <Box>
            <Typography
              variant="subtitle2"
              sx={{ fontWeight: 600, color: "#5f6368", mb: 1.5 }}
            >
              Tags
            </Typography>
            <Button
              size="small"
              variant="outlined"
              startIcon={<AddIcon />}
              sx={{
                borderColor: "#dadce0",
                color: "#2566b0",
                fontWeight: 500,
                borderRadius: 2,
                textTransform: "none",
                "&:hover": {
                  borderColor: "#2566b0",
                  bgcolor: "#e0e0e0",
                },
              }}
            >
              Add tags
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default ContactDetails;
