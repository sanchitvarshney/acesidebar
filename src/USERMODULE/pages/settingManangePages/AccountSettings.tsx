import React from "react";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Stack,
  Typography,
} from "@mui/material";

const AccountSettings = () => {
  return (
    <Box width="100%">
      <Typography
        variant="h4"
        sx={{ fontWeight: 600, color: "rgb(30 41 59)", mb: 3 }}
      >
        Account settings - Support
      </Typography>

      <Box
        sx={{
          display: "grid",
          gap: 3,
          gridTemplateColumns: { xs: "1fr", md: "repeat(2, minmax(0, 1fr))" },
          alignItems: 'stretch',
          justifyItems: 'stretch',
        }}
      >
        {/* Developer Account */}
        <Box sx={{ height: '100%', width: '100%', display: 'flex' }}>
          <Card variant="outlined" sx={{ borderRadius: 2, height: '100%', width: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ flexGrow: 1 }}>
              <Stack direction="row" spacing={2} alignItems="flex-start">
                <Avatar
                  sx={{
                    width: 96,
                    height: 96,
                    bgcolor: "rgb(226 232 240)",
                    color: "rgb(100 116 139)",
                    fontSize: 40,
                  }}
                >
                  D
                </Avatar>
                <Box flex={1}>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 600, color: "rgb(30 41 59)" }}
                  >
                    Developer Account
                  </Typography>
                  <Stack
                    direction="row"
                    spacing={1}
                    alignItems="center"
                    sx={{ mt: 0.5 }}
                  >
                    <Box
                      sx={{
                        width: 20,
                        height: 20,
                        bgcolor: "rgba(16,185,129,0.1)",
                        color: "rgb(5 150 105)",
                        borderRadius: "9999px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 12,
                      }}
                    >
                      ✓
                    </Box>
                    <Typography sx={{ color: "rgb(71 85 105)" }}>
                      postmanreply@gmail.com
                    </Typography>
                  </Stack>
                  <CardActions sx={{ px: 0, mt: 'auto' }}>
                    <Button variant="outlined" size="small">
                      Edit
                    </Button>
                  </CardActions>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Box>

        {/* Account status */}
        <Box sx={{ height: '100%', width: '100%', display: 'flex' }}>
          <Card variant="outlined" sx={{ borderRadius: 2, height: '100%', width: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ flexGrow: 1 }}>
              <Typography
                variant="h6"
                sx={{ fontWeight: 600, color: "rgb(30 41 59)" }}
              >
                Account status
              </Typography>
              <Typography sx={{ color: "rgb(71 85 105)", mt: 1 }}>
                Account active since
              </Typography>
              <Typography sx={{ color: "rgb(30 41 59)", fontWeight: 600 }}>
                10 Jul, 2025{" "}
                <Box
                  component="span"
                  sx={{ color: "rgb(100 116 139)", fontWeight: 400 }}
                >
                  (1 month)
                </Box>
              </Typography>
              <CardActions sx={{ px: 0, mt: 'auto' }}>
                <Button variant="contained" color="error" size="small">
                  Cancel account
                </Button>
              </CardActions>
            </CardContent>
          </Card>
        </Box>

        {/* Export data */}
        <Box sx={{ height: '100%', width: '100%', display: 'flex' }}>
          <Card variant="outlined" sx={{ borderRadius: 2, height: '100%', width: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ flexGrow: 1 }}>
              <Typography
                variant="h6"
                sx={{ fontWeight: 600, color: "rgb(30 41 59)" }}
              >
                Export data
              </Typography>
              <Typography sx={{ color: "rgb(71 85 105)", mt: 1 }}>
                Create an XML/JSON file with all your data from this Freshdesk
                account.
              </Typography>
              <CardActions sx={{ px: 0, mt: 'auto' }}>
                <Button variant="outlined" size="small">
                  Export
                </Button>
              </CardActions>
            </CardContent>
          </Card>
        </Box>

        {/* Data policy */}
        <Box sx={{ height: '100%', width: '100%', display: 'flex' }}>
          <Card variant="outlined" sx={{ borderRadius: 2, height: '100%', width: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ flexGrow: 1 }}>
              <Typography
                variant="h6"
                sx={{ fontWeight: 600, color: "rgb(30 41 59)" }}
              >
                Data policy
              </Typography>
              <Typography sx={{ color: "rgb(71 85 105)", mt: 1 }}>
                We've securely placed your data in our Indian data center
              </Typography>
              <CardActions sx={{ px: 0, mt: 'auto' }}>
                <Button variant="outlined" size="small">
                  Learn more
                </Button>
              </CardActions>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Box>
  );
};

export default AccountSettings;
