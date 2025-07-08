import React from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  Grid,
} from "@mui/material";

const getUserData = () => {
  try {
    const userDataStr = localStorage.getItem("userData");
    if (!userDataStr) return null;
    return JSON.parse(userDataStr);
  } catch {
    return null;
  }
};

const ProfilePage = () => {
  const userData = getUserData();

  // Fallbacks if userData is missing
  const email = userData?.email || userData?.user?.email || "-";
  const phone = userData?.phone || userData?.user?.phone || "-";
  const role = userData?.role || userData?.user?.role || "-";
  const uiD = userData?.uiD || userData?.user?.uiD || "-";
  const username = userData?.username || userData?.user?.username || "-";

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "80vh",
        bgcolor: "#f5f6fa",
      }}
    >
      <Card
        sx={{
          minWidth: 350,
          maxWidth: 400,
          borderRadius: 4,
          boxShadow: 6,
          p: 3,
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Avatar
            sx={{
              width: 80,
              height: 80,
              mb: 2,
              bgcolor: "primary.main",
              fontSize: 36,
            }}
          >
            {username && username[0]}
          </Avatar>
          <Typography variant="h5" fontWeight={700} gutterBottom>
            {username}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            {role}
          </Typography>
        </Box>
        <CardContent>
          <Grid container spacing={2}>
            <Grid size={4}>
              <Typography variant="subtitle2" color="text.secondary">
                Email:
              </Typography>
            </Grid>
            <Grid size={8}>
              <Typography variant="body1">{email}</Typography>
            </Grid>
            <Grid size={4}>
              <Typography variant="subtitle2" color="text.secondary">
                Phone:
              </Typography>
            </Grid>
            <Grid size={8}>
              <Typography variant="body1">{phone}</Typography>
            </Grid>
            <Grid size={4}>
              <Typography variant="subtitle2" color="text.secondary">
                Role:
              </Typography>
            </Grid>
            <Grid size={8}>
              <Typography variant="body1">{role}</Typography>
            </Grid>
            <Grid size={4}>
              <Typography variant="subtitle2" color="text.secondary">
                User ID:
              </Typography>
            </Grid>
            <Grid size={8}>
              <Typography variant="body1">{uiD}</Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ProfilePage;
