import { Avatar, Card, CardContent, Typography } from "@mui/material";
import React, { FC } from "react";

interface SettingCardProps {
  titleIcon: any;
  title: string;
  subTitle: string;
  subIcon?: any;
}

const SettingCard: FC<SettingCardProps> = ({
  subIcon,
  titleIcon,
  title,
  subTitle,
}) => {
  return (
    <Card sx={{}} className="hover:shadow-md transition" >
      <CardContent sx={{ display: "flex" }}>
        <span className="mr-2">{titleIcon}</span>
        <div>
          <Typography variant="subtitle1">
            {title} {subIcon && <span className="ml-1">{subIcon} </span>}
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            {subTitle}
          </Typography>
        </div>
      </CardContent>
    </Card>
  );
};

export default SettingCard;
