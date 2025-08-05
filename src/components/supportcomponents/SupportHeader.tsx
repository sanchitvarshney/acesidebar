import { AppBar, Box, Button, Toolbar, Typography } from "@mui/material";

const SupportHeader = () => {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={{ width: "100%" }}>
        <Toolbar
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "1rem",
          }}
        >
          <Typography
            variant="subtitle1"
            fontSize={"1.2rem"}
            fontWeight={600}
            component="span"
          >
            Help Desk
          </Typography>
          <Button
            color="inherit"
            disableRipple
            disableFocusRipple
            sx={{
              position: "relative",
              "&:hover": {
                backgroundColor: "transparent",
                transform: "scale(1.05)",
                "&::after": {
                  width: "100%",
                },
                  color: "rgba(255, 255, 255, 0.9)",
              },
              "&::after": {
                content: '""',
                position: "absolute",
                bottom: "0",
                left: "0",
                width: "0%",
                height: "2px",
                backgroundColor: "currentColor",
                transition: "width 0.3s ease-in-out",
              },
              transition: "transform 0.2s ease, color 0.2s ease",
           
            }}
          >
            Login
          </Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default SupportHeader;
