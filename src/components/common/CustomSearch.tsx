import React, { forwardRef } from "react";
import SearchIcon from "@mui/icons-material/Search";
import { styled, alpha } from "@mui/material/styles";
import InputBase from "@mui/material/InputBase";

type CustomSearchPropsType = {
  width: string;
  placeholder: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  bgColor?: string;
  bgOpacity?: number;
  borderRadius?: number;
  textColor?:string
};

const CustomSearch = forwardRef<HTMLInputElement, CustomSearchPropsType>(
  ({ width, placeholder, onChange, bgColor, bgOpacity = 0.15, borderRadius = 10,textColor }, ref) => {
    return (
      <SearchContainer bgColor={bgColor} bgOpacity={bgOpacity} borderRadius={borderRadius}>
        <SearchIconWrapper>
          <SearchIcon />
        </SearchIconWrapper>
        <StyledInputBase
          placeholder={placeholder}
          inputProps={{ "aria-label": "search" }}
          sx={{ width:width }}
          onChange={onChange}
          inputRef={ref}
          textColor={textColor}
        />
      </SearchContainer>
    );
  }
);
CustomSearch.displayName = "CustomSearch"; // Required when using forwardRef

// Props for styled div
interface SearchStyleProps {
  bgColor?: string;
  bgOpacity?: number;
  borderRadius?: number;
  textColor?:string
}

const SearchContainer = styled("div", {
  shouldForwardProp: (prop:any) => !["bgColor", "bgOpacity", "borderRadius"].includes(prop),
})<SearchStyleProps>(({ theme, bgColor, bgOpacity, borderRadius }) => ({
  position: "relative",
  borderRadius: borderRadius ?? 10,
  backgroundColor: alpha(
    bgColor ?? theme.palette.common.white,
    bgOpacity ?? 0.15
  ),
  "&:hover": {
    backgroundColor: alpha(
      bgColor ?? theme.palette.common.white,
      Math.min((bgOpacity ?? 0.15) + 0.1, 1)
    ),
  },
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    // marginLeft: theme.spacing(2),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase, {
  shouldForwardProp: (prop:any) => !["bgColor", "bgOpacity", "borderRadius"].includes(prop),
})<SearchStyleProps>(({ theme, textColor}) => ({
  color: "inherit",
  width: "100%",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1.5, 1.5, 1.5, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    color: textColor ?? theme.palette.common.white,
    "::placeholder": {
      color: textColor ?? theme.palette.grey[300],
      opacity: 0.8,
      transition: "opacity 0.2s ease-in-out",
    },
    "&:focus::placeholder": {
      opacity: 0,
    },
  },
}));

export default CustomSearch;
