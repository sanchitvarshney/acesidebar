import React from "react";
import { Card, CardActionArea, Box, Typography } from "@mui/material";
import { motion } from "framer-motion";

interface QuickActionCardProps {
  icon: React.ReactNode;
  title: string;
  description?: string;
  accentColor?: string;
  onClick?: () => void;
}

const MotionBox = motion(Box);

const QuickActionCard: React.FC<QuickActionCardProps> = ({ icon, title, description, accentColor = "#1976d2", onClick }) => {
  return (
    <MotionBox
      initial={{ opacity: 0, y: 12, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      whileHover={{ y: -6, scale: 1.01 }}
      whileTap={{ scale: 0.997 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
    >
      <Card
        elevation={0}
        sx={{
          borderRadius: 3,
          border: "1px solid",
          borderColor: "#d4e6ff",
          bgcolor: "#ffffff",
          overflow: "hidden",
          transition: "box-shadow 200ms ease, transform 200ms ease, border-color 200ms ease, background 200ms ease",
          '&:hover': {
            boxShadow: "0 10px 24px rgba(20, 77, 173, 0.15)",
            borderColor: "#a7c8ff",
            background: "linear-gradient(0deg, rgba(232,240,254,0.35), rgba(232,240,254,0.35))",
          },
        }}
      >
        <CardActionArea onClick={onClick} sx={{ p: 5, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 2 }}>
          <MotionBox
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 260, damping: 18 }}
            sx={{
              width: 68,
              height: 68,
              borderRadius: 3,
              display: "grid",
              placeItems: "center",
              color: accentColor,
              background: `linear-gradient(135deg, ${accentColor}14, #f9fbff)`,
              border: "1px solid",
              borderColor: `${accentColor}33`,
            }}
          >
            {icon}
          </MotionBox>

          <Typography variant="subtitle1" sx={{ mt: 1, color: "#374151", fontWeight: 700, textAlign: "center" }}>
            {title}
          </Typography>
          {description && (
            <Typography variant="body2" sx={{ color: "#6b7280", textAlign: "center" }}>
              {description}
            </Typography>
          )}
        </CardActionArea>
      </Card>
    </MotionBox>
  );
};

export default QuickActionCard;


