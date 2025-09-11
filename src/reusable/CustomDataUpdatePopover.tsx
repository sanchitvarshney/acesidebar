import { Popover } from "@mui/material";
import { FC } from "react";

interface CustomDataUpdatePopoverProps {
  //   open: boolean;
  anchorEl: any;
  placement?: any;
  children: any;
  close: any;
}
const CustomDataUpdatePopover: FC<CustomDataUpdatePopoverProps> = ({
  anchorEl,
  children,
  close,
}) => {
  return (
    <Popover
      disableScrollLock={true}
      open={Boolean(anchorEl)}
      anchorEl={anchorEl}
      onClose={() => close()}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "center",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "center",
      }}
    >
      {children}
    </Popover>
  );
};

export default CustomDataUpdatePopover;
