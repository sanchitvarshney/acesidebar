import React, { useState, forwardRef } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  IconButton,
  Slide,
  FormControlLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";

import CloseIcon from "@mui/icons-material/Close";

// Slide Transition
const Transition = forwardRef(function Transition(
  props: TransitionProps & { children: React.ReactElement },
  ref: React.Ref<unknown>
) {
  return <Slide direction="down" ref={ref} {...props} />;
});

interface ConvertProfileProps {
  open: boolean;
  onClose: any;
  onConfirm: () => void;
  bgColor?: string;
}

const ConvertProfile: React.FC<ConvertProfileProps> = ({
  open,
  onClose,
  onConfirm,
  bgColor = "white",
}) => {
  //
  const [activeIndex, setActiveIndex] = useState("full");

  const handleConfirm = () => {
    onConfirm?.();
  };

  return (
    <Dialog
      open={open}
      maxWidth="xs"
      fullWidth
      onClose={onClose}
      TransitionComponent={Transition}
      keepMounted
      PaperProps={{
        sx: {
          borderRadius: 4,
          boxShadow: 6,
          //   px: 1,
          py: 0.5,
          backgroundColor: "#ffffff",
          position: "relative",
        },
      }}
      BackdropProps={{
        sx: {
          backdropFilter: "blur(3px)",
          backgroundColor: "rgba(0, 0, 0, 0.2)",
        },
      }}
    >
      <DialogTitle
        sx={{
          fontWeight: 600,
          fontSize: "1.1rem",

          py: 1,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h6" component="span">
          Convert to agent
        </Typography>

        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent
        dividers
        sx={{
          display: "flex",
          flexDirection: "column",
          //   alignItems: "center",
          //   justifyContent: "center",
          px: 2,
        }}
      >
        <Typography variant="body2" color="text.secondary">
          Converting this Contact to an agent will remove their access to
          secondary emails. Are you sure you want to proceed?
        </Typography>
        <span>Conver to :</span>
        <RadioGroup
          defaultValue="full"
          name="agent-type"
          sx={{
            ml: 8,
            mb: 2,
          }}
        >
          {[
            { value: "full", label: "Support - Full time agent" },
            { value: "occasional", label: "Support - Occasional agent" },
          ].map((option) => {
            const isActive = option.value === activeIndex;
            return (
              <FormControlLabel
                key={option.value}
                value={option.value}
                control={<Radio size="small" />}
                onChange={() => setActiveIndex(option.value)}
                label={option.label}
                sx={{
                  borderRadius: 1,
                  p: 0.5,

                  "&:hover": {
                    backgroundColor: "action.hover", // hover highlight
                  },
                  "&.Mui-checked, &.Mui-checked:hover": {
                    backgroundColor: "action.selected", // selected highlight
                  },
                  ".MuiFormControlLabel-label": {
                    fontWeight: (theme) => (isActive ? 700 : 400), // example bold first one
                  },
                }}
              />
            );
          })}
        </RadioGroup>
      </DialogContent>

      <DialogActions sx={{ justifyContent: "center", p: 2, gap: 2 }}>
        <Button
          variant="outlined"
          color="inherit"
          onClick={onClose}
          sx={{ borderRadius: 5, textTransform: "none", px: 4 }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleConfirm}
          sx={{ borderRadius: 5, textTransform: "none", px: 3 }}
        >
          Convert
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConvertProfile;
