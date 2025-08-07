import { Box, Drawer, IconButton, Typography } from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";

interface CustomSideBarPanelProps {
  open: boolean;
  close: () => void;
  title?: any;
  children: React.ReactNode;
  isHeader?: boolean;
  width?: number;
}
const CustomSideBarPanel: React.FC<CustomSideBarPanelProps> = ({
  open,
  close,
  title,
  children,
  isHeader = true,
  width = 380,
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
          style: { backgroundColor: "rgba(0, 0, 0, 0.5), ", cursor: "none" }, // visually transparent
        },
      }}
      // hideBackdrop
      sx={{
        pointerEvents: "none",
        "& .MuiDrawer-paper": {
          width: width,
          position: "absolute",
          top: 0,
          backgroundColor: "#f9fafb",
          zIndex: 0,
          pointerEvents: "none",
        },
      }}
    >
      {isHeader && title && (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            p: 2,
            borderBottom: "1px solid #ccc",
            pointerEvents: "auto",
            backgroundColor: "#e8f0fe",
          }}
        >
          <Typography sx={{ flex: 1, fontSize: "16px" }}>{title}</Typography>

          <IconButton onClick={close}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
      )}
      <div
        className="w-full  h-[calc(100vh-0px)] overflow-y-auto"
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
