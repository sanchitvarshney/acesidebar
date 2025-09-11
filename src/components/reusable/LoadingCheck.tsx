import Box from "@mui/material/Box";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { keyframes } from "@emotion/react";


// Animation (scale bounce)
const bounce = keyframes`
  0% { transform: scale(0.5); opacity: 0; }
  50% { transform: scale(1.2); opacity: 1; }
  100% { transform: scale(1); }
`;

const LoadingCheck  = () => {

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        bgcolor:  "transparent", 
       
      
        borderRadius: 1,
      }}
    >
      <CheckCircleIcon
        sx={{
         color: "green",
          fontSize: 24,
          animation: `${bounce} 0.6s ease`,
        }}
      />
    </Box>
  );
};

export default LoadingCheck;
