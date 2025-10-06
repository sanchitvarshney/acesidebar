import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Box,
  Button,
  Step,
  StepLabel,
  Stepper,
  TextField,
  Typography,
} from "@mui/material";

const steps = [
  {
    id: "v2",
    label: "reCAPTCHA v2",
    subLabel: "Classic I'm not a robot",
  },
  {
    id: "v3",
    label: "reCAPTCHA v3",
    subLabel: "Invisible background verification",
  },
];

const RecaptchaConfig = ({ onNext, onBack, isFirstStep, isLastStep }: any) => {
  const [formData, setFormData] = useState({
    siteKey: "",
    secretKey: "",
    version: "v2",
  });

  const [errors, setErrors] = useState<any>({});

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev: any) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors: any = {};

    if (!formData.siteKey.trim()) {
      newErrors.siteKey = "Site Key is required";
    }

    if (!formData.secretKey.trim()) {
      newErrors.secretKey = "Secret Key is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    if (validateForm()) {
      onNext({ recaptcha: formData });
    }
  };

  

 

  const [activeStep, setActiveStep] = React.useState(0);
  const [skipped, setSkipped] = React.useState(new Set<number>());

  const isStepOptional = (step: number) => {
    return step === 1;
  };

  const isStepSkipped = (step: number) => {
    return skipped.has(step);
  };

  const handleNext = () => {
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped(newSkipped);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSkip = () => {
    if (!isStepOptional(activeStep)) {

      throw new Error("You can't skip a step that isn't optional.");
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped((prevSkipped) => {
      const newSkipped = new Set(prevSkipped.values());
      newSkipped.add(activeStep);
      return newSkipped;
    });
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  return (
    <div className="w-full">
      {/* Header */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-4"
      >
        <div className="w-[60px] h-[60px] bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
          <svg
            className="w-10 h-10 text-blue-600"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Google reCAPTCHA Configuration
        </h1>
        <p className="text-md text-gray-600">
          Configure Google reCAPTCHA to protect your ticket system from spam and
          abuse.
        </p>
      </motion.div>

      {/* Info Card */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="bg-yellow-50 w-full max-w-xl mx-auto border border-yellow-200 rounded-lg p-4 mb-2"
      >
        <div className="flex items-start">
          <svg
            className="w-6 h-6 text-yellow-600 mt-0.5 mr-3 flex-shrink-0"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          <div>
            <h3 className="text-lg font-semibold text-yellow-800 mb-2">
              reCAPTCHA Setup Required
            </h3>
            <p className="text-yellow-700 mb-3">To get your reCAPTCHA keys:</p>
            <ol className="text-yellow-700 text-sm space-y-1 list-decimal list-inside">
              <li>
                Visit{" "}
                <a
                  href="https://www.google.com/recaptcha/admin"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline"
                >
                  Google reCAPTCHA Admin Console
                </a>
              </li>
              <li>Create a new site or select an existing one</li>
              <li>Copy the Site Key and Secret Key</li>
            </ol>
          </div>
        </div>
      </motion.div>

      {/* Form */}
      <motion.form
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        onSubmit={handleSubmit}
        className=" w-full max-w-2xl mx-auto p-4"
      >
        <Box sx={{ width: "100%" }}>
          <Stepper activeStep={activeStep}>
            {steps.map((label, index) => {
              const stepProps: { completed?: boolean } = {};
              const labelProps: {
                optional?: React.ReactNode;
              } = {};
              if (isStepOptional(index)) {
                labelProps.optional = (
                  <Typography variant="caption">Optional</Typography>
                );
              }
              if (isStepSkipped(index)) {
                stepProps.completed = false;
              }
              return (
                <Step key={label.id} {...stepProps}>
                  <StepLabel {...labelProps}>
                    <Typography variant="subtitle2">{label.label}</Typography>
                    <Typography variant="caption">{label.subLabel}</Typography>
                  </StepLabel>
                </Step>
              );
            })}
          </Stepper>
          {activeStep === steps.length ? (
            <React.Fragment>
              <Typography sx={{ mt: 2, mb: 1 }}>
                All steps completed - you&apos;re finished
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
                <Box sx={{ flex: "1 1 auto" }} />
                <Button onClick={handleReset}>Reset</Button>
              </Box>
            </React.Fragment>
          ) : (
            <React.Fragment>
              {activeStep === 0 && (
                <>
                  <div>
                    <TextField
                      label="Site Key"
                      name="siteKey"
                      value={formData.siteKey}
                      onChange={handleInputChange}
                      placeholder="6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"
                      fullWidth
                      variant="standard"
                    />
                    {errors.siteKey && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.siteKey}
                      </p>
                    )}
                    <p className="mt-1 text-xs text-gray-500">
                      This key is safe to use in client-side code
                    </p>
                  </div>

                  <div>
                    <TextField
                      fullWidth
                      label="Secret Key"
                      variant="standard"
                      placeholder="6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe"
                      name="secretKey"
                      value={formData.secretKey}
                      onChange={handleInputChange}
                    />
                    {errors.secretKey && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.secretKey}
                      </p>
                    )}
                    <p className="mt-1 text-xs text-gray-500">
                      Keep this key secret and secure
                    </p>
                  </div>
                </>
              )}
              {activeStep === 1 && (
                <>
                  <div>
                    <TextField
                      label="Site Key"
                      name="siteKey"
                      value={formData.siteKey}
                      onChange={handleInputChange}
                      placeholder="6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"
                      fullWidth
                      variant="standard"
                    />
                    {errors.siteKey && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.siteKey}
                      </p>
                    )}
                    <p className="mt-1 text-xs text-gray-500">
                      This key is safe to use in client-side code
                    </p>
                  </div>

                  <div>
                    <TextField
                      fullWidth
                      label="Secret Key"
                      variant="standard"
                      placeholder="6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe"
                      name="secretKey"
                      value={formData.secretKey}
                      onChange={handleInputChange}
                    />
                    {errors.secretKey && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.secretKey}
                      </p>
                    )}
                    <p className="mt-1 text-xs text-gray-500">
                      Keep this key secret and secure
                    </p>
                  </div>
                </>
              )}
              <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
                <Button
                  color="inherit"
                  disabled={activeStep === 0}
                  onClick={handleBack}
                  sx={{ mr: 1 }}
                >
                  Back
                </Button>
                <Box sx={{ flex: "1 1 auto" }} />
                {isStepOptional(activeStep) && (
                  <Button color="inherit" onClick={handleSkip} sx={{ mr: 1 }}>
                    Skip
                  </Button>
                )}
                <Button onClick={handleNext}>
                  {activeStep === steps.length - 1 ? "Finish" : "Next"}
                </Button>
              </Box>
            </React.Fragment>
          )}
        </Box>

    
      </motion.form>
    </div>
  );
};

export default RecaptchaConfig;
