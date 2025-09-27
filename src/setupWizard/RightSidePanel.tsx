import React from "react";
import {
  Step,
  StepIconProps,
  StepLabel,
  Stepper,
  styled,
  Box,
} from "@mui/material";
import StepConnector, {
  stepConnectorClasses,
} from "@mui/material/StepConnector";
import { Check } from "@mui/icons-material";

// --- Custom Connector ---
const ColorConnector = styled(StepConnector)(({ theme }) => ({
  [`& .${stepConnectorClasses.line}`]: {
    marginLeft: 8,
    borderLeftWidth: 3,
    minHeight: 40,
    borderColor: theme.palette.grey[400],
    textAlign: "center",
  },
  [`&.${stepConnectorClasses.active} .${stepConnectorClasses.line}`]: {
    borderColor: theme.palette.primary.main,
  },
  [`&.${stepConnectorClasses.completed} .${stepConnectorClasses.line}`]: {
    borderColor: theme.palette.success.main,
  },
}));

// --- Custom Step Icon ---
const CustomStepIconRoot = styled("div")<{
  ownerState: { active?: boolean; completed?: boolean };
}>(() => ({
  width: 40,
  height: 40,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: "bold",
  fontSize: 14,
  transition: "all 0.3s ease",
  position: "relative",
}));

function CustomStepIcon(props: StepIconProps & { iconNode?: string }) {
  const { active, completed, className, icon, iconNode } = props;

  return (
    <CustomStepIconRoot
      ownerState={{ completed, active }}
      className={className}
    >
      {/* Center content */}
      {completed ? (
        <Check sx={{ fontSize: 20 }} />
      ) : (
        <img
          src={iconNode}
          alt="step-icon"
          style={{ width: "100%", height: "100%" }}
        />
      )}
    </CustomStepIconRoot>
  );
}

// --- RightSidePanel ---
const RightSidePanel = ({ steps, currentStep }: any) => {
  return (
    <div className="p-6 h-[calc(100vh-0px)] flex flex-col w-full  overflow-auto">
      <h2 className="text-lg font-semibold mb-6">Setup Progress</h2>

      <Stepper
        activeStep={currentStep}
        orientation="vertical"
        connector={<ColorConnector />}
        sx={{
          "& .MuiStepIcon-root": {
            width: 40,
            height: 40,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: "bold",
            fontSize: 14,
            transition: "all 0.3s ease",
            position: "relative",
          },
        }}
      >
        {steps.map((step: any, index: number) => (
          <Step key={step.id}>
            <StepLabel
              StepIconComponent={(props) => (
                <CustomStepIcon {...props} iconNode={step.icon} />
              )}
            >
              <Box
                sx={{
                  fontSize: "12px",
                  fontWeight: 600,
                  mb: 0.5,
                  color:
                    index === currentStep
                      ? "primary.main"
                      : index < currentStep
                      ? "success.main"
                      : "#e0e0e0ff",
                }}
              >
                {step.title}
              </Box>
              <Box
                sx={{
                  fontSize: "11px",
                  color:
                    index === currentStep
                      ? "primary.light"
                      : index < currentStep
                      ? "success.light"
                      : "#e0e0e0ff",
                }}
              >
                {index === currentStep
                  ? "In Progress"
                  : index < currentStep
                  ? "Completed"
                  : "Pending"}
              </Box>
            </StepLabel>
          </Step>
        ))}
      </Stepper>
    </div>
  );
};

export default RightSidePanel;
