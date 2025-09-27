import { Fade } from "@mui/material";
import { styled } from "@mui/material/styles";

import Tooltip, { TooltipProps, tooltipClasses } from "@mui/material/Tooltip";
import { FC } from "react";

interface CustomizedTooltipProps {
  title: any;
  children: React.ReactElement;
  placement?: any;
  open?: boolean;
  close?: any;
  disableHoverListener?: boolean;
  width?: string | number
}

const BootstrapTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip
    {...props}
    arrow
    TransitionComponent={Fade}
    TransitionProps={{ timeout: 200 }}
    classes={{ popper: className, }}
  />
))(({ theme }) => ({
  [`& .${tooltipClasses.arrow}`]: {
    color: "#fff",
    filter: "drop-shadow(0px 2px 4px rgba(0,0,0,0.08))",
  },
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "#fff",
    transition: "opacity 0.2s ease-in-out",
    filter: "drop-shadow(0px 2px 2px rgba(214, 214, 214, 0.8))",
    padding: 0,
  },
  [`& .${tooltipClasses.popper}`]: {
    zIndex: 110000, // ensure highest stacking for nested menus
    position: "relative",
  },
}));

const CustomToolTip: FC<CustomizedTooltipProps> = ({
  children,
  title,
  placement = "top-start",
  open,
  close,
  disableHoverListener = false,
  width
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
          zIndex: 200000,
          [`& .${tooltipClasses.tooltip}`]: {
            width: width || "auto",
            maxWidth: "none",
          },
        },
      }}

    >
      {children}
    </BootstrapTooltip>
  );
};

export default CustomToolTip;
