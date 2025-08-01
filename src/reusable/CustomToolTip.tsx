import { Fade, Slide } from "@mui/material";
import { styled } from "@mui/material/styles";

import Tooltip, { TooltipProps, tooltipClasses } from "@mui/material/Tooltip";
import { FC } from "react";

interface CustomizedTooltipProps {
  title: any;
  children: React.ReactElement;
  placement?: any;
  open?: boolean;
  close?: () => void;
  disableHoverListener?: boolean;
}

const BootstrapTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip   {...props} arrow  TransitionComponent={Fade}  TransitionProps={{ timeout: 200 }}  classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.arrow}`]: {
    color: "#fff",
    filter: "drop-shadow(0px 2px 4px rgba(0,0,0,0.08))",
    
  },
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "#fff",
      transition: "opacity 0.2s ease-in-out",
       boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.4)", // subtle shadow
    // borderRadius: "6px", // optional rounding
    // padding: "8px 12px", // optional padding
    color:"#000"
      
  },
  [`& .${tooltipClasses.popper}`]: {
    zIndex: 10001,
    position: "relative",
  },
}));

const CustomToolTip: FC<CustomizedTooltipProps> = ({
  children,
  title,
  placement="top-start",
  open,
  close,
  disableHoverListener = false,
}) => {
  return (
    <BootstrapTooltip  
      title={title} 
      placement={placement} 
      disableHoverListener={disableHoverListener} 
      open={open} 
      onClose={close}
      PopperProps={{
        sx: {
          zIndex: 10002,
        }
      }}
    >
      {children }
    </BootstrapTooltip>
  );
};

export default CustomToolTip;
