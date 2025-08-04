import React, { useState } from 'react';
import CustomTextInput, { Option } from './CustomTextInput';

const CustomTextInputDemo: React.FC = () => {
  const [textValue, setTextValue] = useState<any>('');
  const [selectValue, setSelectValue] = useState< any | number>('');
  const [combinedInputValue, setCombinedInputValue] = useState('');
  const [combinedSelectedOption, setCombinedSelectedOption] = useState<Option | null>(null);
  const [emailValue, setEmailValue] = useState<any>('');
  const [passwordValue, setPasswordValue] = useState<any>('');
  const [phoneValue, setPhoneValue] = useState<any>('');

  // Sample options for select and combined inputs
  const countryOptions: Option[] = [
    { value: 'us', label: 'United States' },
    { value: 'ca', label: 'Canada' },
    { value: 'uk', label: 'United Kingdom' },
    { value: 'au', label: 'Australia' },
    { value: 'de', label: 'Germany' },
    { value: 'fr', label: 'France' },
    { value: 'jp', label: 'Japan' },
    { value: 'in', label: 'India' },
  ];

  const categoryOptions: Option[] = [
    { value: 'electronics', label: 'Electronics' },
    { value: 'clothing', label: 'Clothing' },
    { value: 'books', label: 'Books' },
    { value: 'home', label: 'Home & Garden' },
    { value: 'sports', label: 'Sports & Outdoors' },
    { value: 'automotive', label: 'Automotive' },
    { value: 'health', label: 'Health & Beauty' },
    { value: 'toys', label: 'Toys & Games' },
  ];

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Custom Text Input Component Demo</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Basic Text Input */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-800">Basic Text Input</h2>
          <CustomTextInput
            type="text"
            label="Full Name"
            placeholder="Enter your full name"
            value={textValue}
            onChange={setTextValue}
            required
            validationRules={{
              required: true,
              minLength: 2,
              maxLength: 50,
            }}
          />
        </div>

        {/* Email Input with Validation */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-800">Email Input with Validation</h2>
          <CustomTextInput
            type="text"
            label="Email Address"
            placeholder="Enter your email"
            value={emailValue}
            onChange={setEmailValue}
            required
            validationRules={{
              required: true,
              pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              custom: (value) => {
                const email = String(value);
                if (!email.includes('@')) return 'Email must contain @';
                if (!email.includes('.')) return 'Email must contain a domain';
                return null;
              }
            }}
          />
        </div>

        {/* Password Input */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-800">Password Input</h2>
          <CustomTextInput
            type="text"
            label="Password"
            placeholder="Enter your password"
            value={passwordValue}
            onChange={setPasswordValue}
            required
            validationRules={{
              required: true,
              minLength: 8,
              custom: (value) => {
                const password = String(value);
                if (password.length < 8) return 'Password must be at least 8 characters';
                if (!/[A-Z]/.test(password)) return 'Password must contain at least one uppercase letter';
                if (!/[a-z]/.test(password)) return 'Password must contain at least one lowercase letter';
                if (!/\d/.test(password)) return 'Password must contain at least one number';
                return null;
              }
            }}
          />
        </div>

        {/* Phone Input */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-800">Phone Number Input</h2>
          <CustomTextInput
            type="text"
            label="Phone Number"
            placeholder="Enter your phone number"
            value={phoneValue}
            onChange={setPhoneValue}
            validationRules={{
              pattern: /^[\+]?[1-9][\d]{0,15}$/,
              custom: (value) => {
                const phone = String(value);
                if (phone && !/^[\+]?[1-9][\d]{0,15}$/.test(phone)) {
                  return 'Please enter a valid phone number';
                }
                return null;
              }
            }}
          />
        </div>

        {/* Select Input */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-800">Select Input</h2>
          <CustomTextInput
            type="select"
            label="Country"
            placeholder="Select your country"
            value={selectValue}
            onChange={setSelectValue}
            options={countryOptions}
            required
            validationRules={{
              required: true,
            }}
          />
        </div>

     

      </div>

    
    </div>
  );
};

export default CustomTextInputDemo; 