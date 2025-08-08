import {
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import logo from "../../../assets/buildings.png";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useState, useEffect } from "react";

const InstractionComponent = ({ data }: { data: any }) => {
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % data.length);
    }, 3000); // Change every 3 seconds

    return () => clearInterval(interval);
  }, [data.length]);

  return (
    <>
      <style>
        {`
          @keyframes gradient {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          
          @keyframes fadeInOut {
            0%, 100% { opacity: 0; transform: translateY(10px); }
            20%, 80% { opacity: 1; transform: translateY(0); }
          }
          
          .feature-text {
            animation: fadeInOut 3s ease-in-out infinite;
          }
        `}
      </style>
      <Box sx={{ width: { xs: 100, sm: 150, md: 180 }, mb: 2 }}>
        <img
          src={logo}
          alt="logo"
          style={{
            width: "100%",
            height: "100%",
          }}
        />
      </Box>
      <Typography
        variant="h5"
        fontWeight={700}   
      >
        Ticket Management
      </Typography>
      
      {/* Auto-changing feature display */}
      <Box sx={{ 
        minHeight: 120, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        mb: 2
      }}>
        <Box sx={{ 
          textAlign: 'center',
          color: { md: "white" },
          maxWidth: 400
        }}>
          <CheckCircleIcon 
            sx={{ 
              fontSize: 48, 
              mb: 2,
              opacity: 0.8
            }} 
          />
          <Typography 
            variant="body1" 
            sx={{ 
              fontSize: '1.1rem',
              fontWeight: 500,
              lineHeight: 1.6,
              animation: 'fadeInOut 3s ease-in-out infinite'
            }}
            className="feature-text"
          >
            {data[currentIndex]?.des}
          </Typography>
        </Box>
      </Box>

      {/* Progress indicators */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        gap: 1,
        mt: 2
      }}>
        {data.map((_: any, index: number) => (
          <Box
            key={index}
            sx={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              opacity: index === currentIndex ? 1 : 0.3,
              transition: 'opacity 0.3s ease',
              cursor: 'pointer'
            }}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </Box>
    </>
  );
};

export default InstractionComponent;