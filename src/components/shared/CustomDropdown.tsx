import React from "react";
import Popover from "@mui/material/Popover";
import MenuItem from "@mui/material/MenuItem";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

// Custom dropdown option type
export interface DropdownOption {
  label: string;
  value: string;
  color?: string;
  key?: string;
}

// CustomDropdown props type
export interface CustomDropdownProps {
  value: string;
  options: DropdownOption[];
  onChange: (value: string) => void;
  colorDot?: boolean;
  width?: number;
  icon?: React.ReactNode;
}

const CustomDropdown: React.FC<CustomDropdownProps> = ({
  value,
  options,
  onChange,
  colorDot,
  width = 120,
  icon,
}) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) =>
    setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);
  const handleSelect = (option: DropdownOption) => {
    onChange(option.value);
    handleClose();
  };
  const selected =
    options.find((o: DropdownOption) => o.value === value) || options[0];
  return (
    <>
      <button
        className="flex items-center w-full px-2 py-1 min-h-[25px]"
        onClick={handleClick}
      >
        {icon && <span className="mr-2 flex-shrink-0">{icon}</span>}
        {colorDot && (
          <span
            className="inline-block w-4 h-4 rounded-full mr-2 flex-shrink-0"
            style={{ background: selected?.color }}
          ></span>
        )}
        <span className="truncate flex-1 text-sm font-medium leading-5 text-left max-w-[80px]" style={{fontSize : "13px"}}>
          {selected.label}
        </span>
        <ArrowDropDownIcon fontSize="small" className="ml-2 flex-shrink-0" />
      </button>
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
        PaperProps={{ style: { minWidth: width } }}
      >
        {options.map((option: DropdownOption) => (
          <MenuItem
            key={option.value}
            selected={option.value === value}
            onClick={() => handleSelect(option)}
          >
            {colorDot && (
              <span
                className="w-3 h-3 rounded-sm inline-block mr-2"
                style={{ background: option.color }}
              ></span>
            )}
            {option.label}
          </MenuItem>
        ))}
      </Popover>
    </>
  );
};

export default CustomDropdown;
