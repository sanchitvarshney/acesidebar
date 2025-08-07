import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";

import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router-dom";

type TicketDetailCardProps = {
  icon: any;
  title: string;
  desc: string;
  id: number;
};
const TicketDetailCard: React.FC<TicketDetailCardProps> = ({
  icon,
  title,
  desc,
  id,
}) => {
  const navigate = useNavigate();

  const handleNavigation = (id: number) => {
    if (id === 1) {
    } else if (id === 2) {
      navigate(`/ticket/support/submit-ticket`);
    } else if (id === 3) {
      navigate(`/ticket/support/view-existing-ticket`);
    }
  };

  return (
    <Card
    
      onClick={() => handleNavigation(id)}
      sx={{
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
        borderRadius: "12px",
        boxShadow: 3,
        userSelect: "none",
        cursor: "pointer",
        "&:hover": {
          transform: "scale(1.03)",
          boxShadow: 6,
        },
      }}
    >
      <CardContent className="flex gap-6 items-center">
        <img src={icon} alt={"no img"} width={40} height={40} />
        <div>
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

export default TicketDetailCard;
