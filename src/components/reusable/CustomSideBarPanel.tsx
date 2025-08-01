import { Box, Drawer, IconButton, Typography } from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";

interface CustomSideBarPanelProps {
  open: boolean;
  close: () => void;
  title: any;
  children: React.ReactNode;
}
const CustomSideBarPanel: React.FC<CustomSideBarPanelProps> = ({
  open,
  close,
  title,
  children,
}) => {
  return (
    <Drawer
      elevation={1}
      anchor="right"
      open={open}
      // onClose={close}
      ModalProps={{
        keepMounted: true,
        BackdropProps: {
          style: { backgroundColor: "transparent" }, // visually transparent
        },
      }}
      hideBackdrop
      sx={{
        pointerEvents: "none",
        "& .MuiDrawer-paper": {
          width: 380,

          position: "absolute",
          top: 64,
          padding: 1,
          backgroundColor: "#f9fafb",
          zIndex: 0,
          pointerEvents: "none",
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          p: 1,
          borderBottom: "1px solid #ccc",
          pointerEvents: "auto",
        }}
      >
        <Typography sx={{ flex: 1, fontSize: "16px" }}>{title}</Typography>

        <IconButton onClick={close}>
          <CloseIcon  fontSize="small"/>
        </IconButton>
      </Box>
      <div
        className="w-full h-full overflow-y-auto my-2 "
        style={{
          pointerEvents: "auto", // 👈 Re-enable interactions inside Drawer content
        }}
      >
        {children}
      </div>
    </Drawer>
  );
};

export default CustomSideBarPanel;
