# CustomTextInput Component

A comprehensive, reusable text input component that supports multiple input types including text, select, and combined input-select functionality with built-in validation and error handling.

## Features

- **Multiple Input Types**: Text, Select, and Combined input-select
- **Real-time Validation**: Built-in validation with custom rules
- **Error Handling**: Tooltip and inline error display with red background
- **Accessibility**: Full keyboard navigation and screen reader support
- **Customizable Styling**: Tailwind CSS classes for easy customization
- **TypeScript Support**: Full TypeScript definitions
- **Responsive Design**: Works on all screen sizes

## Installation

The component uses Lucide React for icons. Make sure you have it installed:

```bash
npm install lucide-react
```

## Basic Usage

```tsx
import CustomTextInput from './components/common/CustomTextInput';

// Basic text input
<CustomTextInput
  type="text"
  label="Full Name"
  placeholder="Enter your name"
  value={name}
  onChange={setName}
  required
/>
```

## Props

### Basic Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `type` | `'text' \| 'select' \| 'combined'` | `'text'` | Type of input field |
| `value` | `string \| number` | `''` | Current value of the input |
| `onChange` | `(value: string \| number) => void` | - | Callback when value changes |
| `placeholder` | `string` | `''` | Placeholder text |
| `label` | `string` | `''` | Label text |
| `required` | `boolean` | `false` | Whether the field is required |
| `disabled` | `boolean` | `false` | Whether the field is disabled |
| `readOnly` | `boolean` | `false` | Whether the field is read-only |

### Select Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `options` | `Option[]` | `[]` | Array of options for select/combined inputs |
| `isOpen` | `boolean` | `false` | Whether dropdown is open (controlled) |
| `onOpenChange` | `(isOpen: boolean) => void` | - | Callback when dropdown opens/closes |

### Combined Input Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `inputValue` | `string` | `''` | Current input value for combined type |
| `onInputChange` | `(value: string) => void` | - | Callback for input changes in combined type |
| `selectedOption` | `Option \| null` | `null` | Currently selected option for combined type |
| `onOptionSelect` | `(option: Option) => void` | - | Callback when option is selected in combined type |

### Validation Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `error` | `string` | `''` | External error message |
| `showError` | `boolean` | `false` | Whether to show error message |
| `validateOnChange` | `boolean` | `true` | Whether to validate on value change |
| `validationRules` | `ValidationRules` | `{}` | Validation rules object |

### Styling Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | `''` | Additional CSS classes for container |
| `inputClassName` | `string` | `''` | Additional CSS classes for input |
| `labelClassName` | `string` | `''` | Additional CSS classes for label |
| `errorClassName` | `string` | `''` | Additional CSS classes for error message |

### Additional Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `name` | `string` | `''` | Input name attribute |
| `id` | `string` | `''` | Input id attribute |
| `autoComplete` | `string` | `'off'` | Autocomplete attribute |
| `maxLength` | `number` | - | Maximum length for text input |
| `minLength` | `number` | - | Minimum length for text input |

## Types

### Option Interface

```typescript
interface Option {
  value: string | number;
  label: string;
  disabled?: boolean;
}
```

### ValidationRules Interface

```typescript
interface ValidationRules {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: string | number) => string | null;
}
```

## Examples

### Basic Text Input

```tsx
<CustomTextInput
  type="text"
  label="Full Name"
  placeholder="Enter your full name"
  value={name}
  onChange={setName}
  required
  validationRules={{
    required: true,
    minLength: 2,
    maxLength: 50,
  }}
/>
```

### Email Input with Validation

```tsx
<CustomTextInput
  type="text"
  label="Email Address"
  placeholder="Enter your email"
  value={email}
  onChange={setEmail}
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
```

### Select Input

```tsx
const countryOptions = [
  { value: 'us', label: 'United States' },
  { value: 'ca', label: 'Canada' },
  { value: 'uk', label: 'United Kingdom' },
];

<CustomTextInput
  type="select"
  label="Country"
  placeholder="Select your country"
  value={country}
  onChange={setCountry}
  options={countryOptions}
  required
  validationRules={{
    required: true,
  }}
/>
```

### Combined Input (Text + Select)

```tsx
const categoryOptions = [
  { value: 'electronics', label: 'Electronics' },
  { value: 'clothing', label: 'Clothing' },
  { value: 'books', label: 'Books' },
];

<CustomTextInput
  type="combined"
  label="Product Category"
  placeholder="Type or select a category"
  inputValue={categoryInput}
  onInputChange={setCategoryInput}
  selectedOption={selectedCategory}
  onOptionSelect={setSelectedCategory}
  options={categoryOptions}
  validationRules={{
    required: true,
  }}
/>
```

### Password Input with Complex Validation

```tsx
<CustomTextInput
  type="text"
  label="Password"
  placeholder="Enter your password"
  value={password}
  onChange={setPassword}
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
```

### Disabled and Read-Only Inputs

```tsx
// Disabled input
<CustomTextInput
  type="text"
  label="Disabled Field"
  value="Disabled value"
  disabled
/>

// Read-only input
<CustomTextInput
  type="text"
  label="Read Only Field"
  value="Read only value"
  readOnly
/>
```

### Custom Styled Input

```tsx
<CustomTextInput
  type="text"
  label="Custom Styled"
  placeholder="This has custom styling"
  value={value}
  onChange={setValue}
  className="bg-blue-50 p-4 rounded-lg"
  inputClassName="border-2 border-blue-300 focus:border-blue-600"
  labelClassName="text-blue-800 font-bold"
/>
```

### Input with External Error

```tsx
<CustomTextInput
  type="text"
  label="External Error"
  placeholder="This shows external error"
  value={value}
  onChange={setValue}
  error="This is an external error message"
  showError={true}
/>
```

## Error Handling

The component provides two ways to display errors:

1. **Tooltip Error**: Hover over the error icon to see the error message in a red tooltip with arrow
2. **Inline Error**: Error message displayed below the input field

### Error Display Logic

- If `showError` is `true` and there's an error, the tooltip will be shown on hover
- If `validateOnChange` is `true`, validation runs on every value change
- External errors (via `error` prop) take precedence over internal validation errors

## Styling

The component uses Tailwind CSS classes and provides multiple customization points:

- `className`: Container styling
- `inputClassName`: Input field styling
- `labelClassName`: Label styling
- `errorClassName`: Error message styling

### Default Styling

The component includes responsive design and proper focus states:

- Focus ring with blue color
- Error states with red border and focus ring
- Disabled states with gray background
- Read-only states with light gray background
- Hover effects on interactive elements

## Accessibility

The component is fully accessible with:

- Proper ARIA labels and descriptions
- Keyboard navigation support
- Screen reader compatibility
- Focus management
- Semantic HTML structure

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- IE11+ (with polyfills for newer JavaScript features)

## Dependencies

- React 16.8+
- TypeScript (for type definitions)
- Tailwind CSS (for styling)
- lucide-react (for icons)

## Performance

- Optimized re-renders with proper state management
- Efficient validation with debounced updates
- Minimal DOM manipulation
- Lightweight bundle size 