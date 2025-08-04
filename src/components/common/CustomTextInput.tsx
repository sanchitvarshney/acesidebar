import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, AlertCircle } from "lucide-react";

export interface Option {
  value: string | number;
  label: string;
  disabled?: boolean;
}

export interface CustomTextInputProps {
  // Basic props
  type?: "text" | "select" | "combined";
  value?: string | number;
  onChange?: (value: string | number) => void;
  placeholder?: string;
  label?: string;
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;

  // Select specific props
  options?: Option[];
  isOpen?: boolean;
  onOpenChange?: (isOpen: boolean) => void;

  // Combined input props
  inputValue?: string;
  onInputChange?: (value: string) => void;
  selectedOption?: Option | null;
  onOptionSelect?: (option: Option) => void;

  // Validation and error
  error?: string;
  showError?: boolean;
  validateOnChange?: boolean;
  validationRules?: {
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    pattern?: RegExp;
    custom?: (value: string | number) => string | null;
  };

  // Styling
  className?: string;
  inputClassName?: string;
  labelClassName?: string;
  errorClassName?: string;

  // Additional props
  name?: string;
  id?: string;
  autoComplete?: string;
  maxLength?: number;
  minLength?: number;
}

const CustomTextInput: React.FC<CustomTextInputProps> = ({
  type = "text",
  value = "",
  onChange,
  placeholder = "",
  label = "",
  required = false,
  disabled = false,
  readOnly = false,

  // Select props
  options = [],
  isOpen = false,
  onOpenChange,

  // Combined props
  inputValue = "",
  onInputChange,
  selectedOption = null,
  onOptionSelect,

  // Error props
  error = "",
  showError = false,
  validateOnChange = true,
  validationRules = {},

  // Styling
  className = "",
  inputClassName = "",
  labelClassName = "",
  errorClassName = "",

  // Additional props
  name = "",
  id = "",
  autoComplete = "off",
  maxLength,
  minLength,
}) => {
  const [internalValue, setInternalValue] = useState<string | number>(value);
  const [internalError, setInternalError] = useState<string>("");
  const [showTooltip, setShowTooltip] = useState(false);
  const [internalIsOpen, setInternalIsOpen] = useState(isOpen);
  const [internalInputValue, setInternalInputValue] = useState(inputValue);
  const [internalSelectedOption, setInternalSelectedOption] =
    useState<Option | null>(selectedOption);

  const inputRef = useRef<HTMLInputElement>(null);
  const selectRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  // Handle external value changes
  useEffect(() => {
    setInternalValue(value);
  }, [value]);

  useEffect(() => {
    setInternalIsOpen(isOpen);
  }, [isOpen]);

  useEffect(() => {
    setInternalInputValue(inputValue);
  }, [inputValue]);

  useEffect(() => {
    setInternalSelectedOption(selectedOption);
  }, [selectedOption]);

  // Validation function
  const validateField = (val: string | number): string => {
    const stringValue = String(val);

    if (validationRules.required && !stringValue.trim()) {
      return "This field is required";
    }

    if (
      validationRules.minLength &&
      stringValue.length < validationRules.minLength
    ) {
      return `Minimum length is ${validationRules.minLength} characters`;
    }

    if (
      validationRules.maxLength &&
      stringValue.length > validationRules.maxLength
    ) {
      return `Maximum length is ${validationRules.maxLength} characters`;
    }

    if (validationRules.pattern && !validationRules.pattern.test(stringValue)) {
      return "Invalid format";
    }

    if (validationRules.custom) {
      const customError = validationRules.custom(val);
      if (customError) return customError;
    }

    return "";
  };

  // Handle text input change
  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInternalValue(newValue);

    if (validateOnChange) {
      const validationError = validateField(newValue);
      setInternalError(validationError);
    }

    onChange?.(newValue);
  };

  // Handle select change
  const handleSelectChange = (option: Option) => {
    if (option.disabled) return;

    setInternalSelectedOption(option);
    setInternalIsOpen(false);
    setInternalValue(option.value);

    if (validateOnChange) {
      const validationError = validateField(option.value);
      setInternalError(validationError);
    }

    onChange?.(option.value);
    onOptionSelect?.(option);
    onOpenChange?.(false);
  };

  // Handle combined input change
  const handleCombinedInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newValue = e.target.value;
    setInternalInputValue(newValue);

    if (validateOnChange) {
      const validationError = validateField(newValue);
      setInternalError(validationError);
    }

    onInputChange?.(newValue);
  };

  // Handle combined option select
  const handleCombinedOptionSelect = (option: Option) => {
    if (option.disabled) return;

    setInternalSelectedOption(option);
    setInternalIsOpen(false);

    if (validateOnChange) {
      const validationError = validateField(option.value);
      setInternalError(validationError);
    }

    onOptionSelect?.(option);
    onOpenChange?.(false);
  };

  // Toggle select dropdown
  const toggleSelect = () => {
    if (disabled || readOnly) return;

    const newIsOpen = !internalIsOpen;
    setInternalIsOpen(newIsOpen);
    onOpenChange?.(newIsOpen);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        selectRef.current &&
        !selectRef.current.contains(event.target as Node)
      ) {
        setInternalIsOpen(false);
        onOpenChange?.(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onOpenChange]);

  // Show tooltip on error
  useEffect(() => {
    const hasError = Boolean(
      (error || internalError) && (showError || validateOnChange)
    );
    setShowTooltip(hasError);
  }, [error, internalError, showError, validateOnChange]);

  const currentError = error || internalError;
  const hasError = currentError && (showError || validateOnChange);

  const baseInputClasses = `
    w-full px-3 py-2 border rounded-md text-sm transition-colors duration-200
    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
    disabled:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50
    read-only:bg-gray-50 read-only:cursor-default
  `;

  const errorInputClasses = `
    border-red-300 focus:ring-red-500 focus:border-red-500
  `;

  const normalInputClasses = `
    border-gray-300
  `;

  const inputClasses = `
    ${baseInputClasses}
    ${hasError ? errorInputClasses : normalInputClasses}
    ${inputClassName}
  `;

  const selectClasses = `
    ${baseInputClasses}
    ${hasError ? errorInputClasses : normalInputClasses}
    cursor-pointer
    ${inputClassName}
  `;

  return (
    <div className={`relative ${className}`}>
      {/* Label */}
      {label && (
        <label
          className={`block text-sm font-medium text-gray-700 mb-1 ${labelClassName}`}
          htmlFor={id || name}
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {/* Text Input */}
      {type === "text" && (
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            id={id || name}
            name={name}
            value={internalValue}
            onChange={handleTextChange}
            placeholder={placeholder}
            disabled={disabled}
            readOnly={readOnly}
            autoComplete={autoComplete}
            maxLength={maxLength}
            minLength={minLength}
            className={inputClasses}
          />
          {hasError && (
            <AlertCircle
              className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-red-500 cursor-pointer"
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
            />
          )}
        </div>
      )}

      {/* Select Input */}
      {type === "select" && (
        <div className="relative" ref={selectRef}>
          <div
            className={selectClasses}
            onClick={toggleSelect}
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                toggleSelect();
              }
            }}
          >
            <div className="flex items-center justify-between">
              <span
                className={internalValue ? "text-gray-900" : "text-gray-500"}
              >
                {internalValue
                  ? options.find((opt) => opt.value === internalValue)?.label ||
                    String(internalValue)
                  : placeholder || "Select an option"}
              </span>
              <ChevronDown
                className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${
                  internalIsOpen ? "rotate-180" : ""
                }`}
              />
            </div>
          </div>

          {/* Dropdown */}
          {internalIsOpen && (
            <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
              {options.map((option) => (
                <div
                  key={option.value}
                  className={`
                    px-3 py-2 cursor-pointer text-sm hover:bg-gray-100
                    ${
                      option.value === internalValue
                        ? "bg-blue-50 text-blue-900"
                        : "text-gray-900"
                    }
                    ${
                      option.disabled
                        ? "opacity-50 cursor-not-allowed hover:bg-transparent"
                        : ""
                    }
                  `}
                  onClick={() => handleSelectChange(option)}
                >
                  {option.label}
                </div>
              ))}
              {options.length === 0 && (
                <div className="px-3 py-2 text-sm text-gray-500">
                  No options available
                </div>
              )}
            </div>
          )}

          {hasError && (
            <AlertCircle
              className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-red-500 cursor-pointer"
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
            />
          )}
        </div>
      )}

      {/* Combined Input */}
      {type === "combined" && (
        <div className="relative" ref={selectRef}>
          <div className="flex">
            <input
              type="text"
              value={internalInputValue}
              onChange={handleCombinedInputChange}
              placeholder={placeholder}
              disabled={disabled}
              readOnly={readOnly}
              autoComplete={autoComplete}
              maxLength={maxLength}
              minLength={minLength}
              className={`${inputClasses} rounded-r-none border-r-0`}
            />
            <button
              type="button"
              onClick={toggleSelect}
              disabled={disabled}
              className={`
                px-3 py-2 border border-l-0 rounded-r-md text-sm transition-colors duration-200
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                disabled:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50
                ${hasError ? "border-red-300" : "border-gray-300"}
                ${inputClassName}
              `}
            >
              <ChevronDown
                className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${
                  internalIsOpen ? "rotate-180" : ""
                }`}
              />
            </button>
          </div>

          {/* Dropdown for combined input */}
          {internalIsOpen && (
            <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
              {options.map((option) => (
                <div
                  key={option.value}
                  className={`
                    px-3 py-2 cursor-pointer text-sm hover:bg-gray-100
                    ${
                      option.value === internalSelectedOption?.value
                        ? "bg-blue-50 text-blue-900"
                        : "text-gray-900"
                    }
                    ${
                      option.disabled
                        ? "opacity-50 cursor-not-allowed hover:bg-transparent"
                        : ""
                    }
                  `}
                  onClick={() => handleCombinedOptionSelect(option)}
                >
                  {option.label}
                </div>
              ))}
              {options.length === 0 && (
                <div className="px-3 py-2 text-sm text-gray-500">
                  No options available
                </div>
              )}
            </div>
          )}

          {hasError && (
            <AlertCircle
              className="absolute right-12 top-1/2 transform -translate-y-1/2 h-5 w-5 text-red-500 cursor-pointer"
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
            />
          )}
        </div>
      )}

      {/* Error Tooltip */}
      {showTooltip && hasError && (
        <div
          ref={tooltipRef}
          className="absolute  z-50 px-3 py-2 bg-red-500 text-white text-sm rounded-xs shadow-lg max-w-xs"
          style={{
            top: "100%",
            right: "0",
            marginTop: "4px",
          }}
        >
          <div className="relative">
            {/* Arrow */}
            <div className="absolute -top-1 left-4 w-2 h-2 bg-red-500 transform rotate-45"></div>
            {currentError}
          </div>
        </div>
      )}

      {/* Error message below input */}
      {hasError && !showTooltip && (
        <p className={`mt-1 text-sm text-red-600 ${errorClassName}`}>
          {currentError}
        </p>
      )}
    </div>
  );
};

export default CustomTextInput;
