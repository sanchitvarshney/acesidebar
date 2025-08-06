import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";

import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router-dom";

type SupportCardProps = {
  icon: any;
  title: string;
  desc: string;
};
const SupportCard: React.FC<SupportCardProps> = ({ icon, title, desc }) => {
  const navigate = useNavigate();
  return (
    <Card
      onClick={() => navigate("/ticket/support/knowledge-base")}
      sx={{
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
        borderRadius: "8px",
        boxShadow: 2,
        userSelect: "none",
        cursor: "pointer",
        "&:hover": {
          transform: "scale(1.01)",
          boxShadow: 4,
        },
      }}
    >
      <CardContent className="flex flex-col items-center justify-center">
        <span>{icon}</span>
        <div className="flex flex-col items-center">
          <Typography gutterBottom variant="h5" component="div">
            {title}
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            {desc}
          </Typography>
        </div>
      </CardContent>
    </Card>
  );
};

export default SupportCard;
