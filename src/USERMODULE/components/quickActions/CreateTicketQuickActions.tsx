import React from "react";
import { Box, Typography } from "@mui/material";
import { motion } from "framer-motion";
import QuickActionCard from "./QuickActionCard";
import AlternateEmailIcon from "@mui/icons-material/AlternateEmail";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import PhoneEnabledOutlinedIcon from "@mui/icons-material/PhoneEnabledOutlined";
const MotionGrid = motion(Box);

interface CreateTicketQuickActionsProps {
  onSendEmail?: () => void;
  onWriteNote?: () => void;
  onCall?: () => void;
}

const CreateTicketQuickActions: React.FC<CreateTicketQuickActionsProps> = ({
  onSendEmail,
  onWriteNote,
  onCall,
}) => {
  return (
    <Box sx={{ py: 8 }}>
      <Typography
        variant="h6"
        sx={{ textAlign: "center", mb: 5, color: "#374151", fontWeight: 700 }}
      >
        Create a new ticket
      </Typography>
      <MotionGrid
        initial="hidden"
        animate="show"
        variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.08 } } }}
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
          gap: 3,
          maxWidth: 1000,
          mx: "auto",
        }}
      >
        <motion.div variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}>
          <QuickActionCard
            icon={<AlternateEmailIcon sx={{ fontSize: 40 }} />}
            title="Send an email"
            description="Compose and send an email to create a ticket."
            accentColor="#1976d2"
            onClick={onSendEmail}
          />
        </motion.div>
        <motion.div variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}>
          <QuickActionCard
            icon={<DescriptionOutlinedIcon sx={{ fontSize: 40 }} />}
            title="Write a note"
            description="Add an internal note and assign details."
            accentColor="#10b981"
            onClick={onWriteNote}
          />
        </motion.div>
        <motion.div variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}>
          <QuickActionCard
            icon={<PhoneEnabledOutlinedIcon sx={{ fontSize: 40 }} />}
            title="Call an agent or a department"
            description="Log a call and route it to the right team."
            accentColor="#f59e0b"
            onClick={onCall}
          />
        </motion.div>
      </MotionGrid>
    </Box>
  );
};

export default CreateTicketQuickActions;


