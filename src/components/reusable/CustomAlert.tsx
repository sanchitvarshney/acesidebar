import { Alert } from "@mui/material";

const CustomAlert = ({ title }: { title: string }) => {
  return (
    <Alert
      severity="warning"
      sx={{ backgroundColor: "#fffde7", border: "1px solid #fbc02d" }}
    >
      {title}
    </Alert>
  );
};

export default CustomAlert;
