import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";

import Typography from "@mui/material/Typography";


type TicketDetailCardProps = {
  icon: any;
  title: string;
  desc: string;
};
const TicketDetailCard: React.FC<TicketDetailCardProps> = ({
  icon,
  title,
  desc,
}) => {
  return (
   <Card
  sx={{
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
    borderRadius: "12px",
    boxShadow: 3,
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
