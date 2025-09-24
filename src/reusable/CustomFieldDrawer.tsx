import { Box, Drawer, IconButton, Typography } from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";

interface CustomFieldDrawerProps {
    open: boolean;
    close: () => void;
    title?: any;
    children: React.ReactNode;
    isHeader?: boolean;
    position?: any;
}
const CustomFieldDrawer: React.FC<CustomFieldDrawerProps> = ({
    open,
    close,
    title,
    children,
    isHeader = true,

    position = "right",
}) => {
    return (
        <Drawer
            elevation={0}
            anchor={position}
            open={open}
            onClose={(event, reason) => {
                if (reason === "escapeKeyDown") {
                    close();
                    return;
                }
                if (reason === "backdropClick") {
                    return;
                }
            }}
            transitionDuration={{ enter: 800, exit: 600 }}
            ModalProps={{
                disableEscapeKeyDown: false,
                keepMounted: true,
                BackdropProps: {
                    style: {
                        backgroundColor: "rgb(0 0 0 / 40%)",
                        cursor: "default",
                        pointerEvents: "none",
                    },
                },
            }}
            // hideBackdrop
            sx={{
                "& .MuiDrawer-paper": {
                    width: "85%",
                    position: "absolute",
                    top: 0,
                    backgroundColor: "#c7c7c7ff",
                    zIndex: 0,
                    pointerEvents: "auto",
                },
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-end",
                    p: 1.7,

                    pointerEvents: "auto",
                }}
            >
                <IconButton
                    onClick={close}
                    sx={{
                        "&:hover": { backgroundColor: "#ddddddff" },
                    }}
                >
                    <CloseIcon fontSize="small" sx={{ color: "#000" }} />
                </IconButton>
            </Box>

            <div
                className="w-full  h-[calc(100vh-64px)] overflow-y-auto px-6 pb-6"
                style={{
                    pointerEvents: "auto", // 👈 Re-enable interactions inside Drawer content
                }}
            >
                {children}
            </div>
        </Drawer>
    );
};

export default CustomFieldDrawer;
