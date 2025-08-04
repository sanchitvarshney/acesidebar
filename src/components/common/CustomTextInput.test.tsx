import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import CustomTextInput from './CustomTextInput';

describe('CustomTextInput', () => {
  test('renders text input with label', () => {
    render(
      <CustomTextInput
        type="text"
        label="Test Label"
        placeholder="Test placeholder"
        value=""
        onChange={() => {}}
      />
    );

    expect(screen.getByText('Test Label')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Test placeholder')).toBeInTheDocument();
  });

  test('renders select input with options', () => {
    const options = [
      { value: 'option1', label: 'Option 1' },
      { value: 'option2', label: 'Option 2' },
    ];

    render(
      <CustomTextInput
        type="select"
        label="Test Select"
        placeholder="Select an option"
        value=""
        onChange={() => {}}
        options={options}
      />
    );

    expect(screen.getByText('Test Select')).toBeInTheDocument();
    expect(screen.getByText('Select an option')).toBeInTheDocument();
  });

  test('renders combined input', () => {
    const options = [
      { value: 'option1', label: 'Option 1' },
      { value: 'option2', label: 'Option 2' },
    ];

    render(
      <CustomTextInput
        type="combined"
        label="Test Combined"
        placeholder="Type or select"
        inputValue=""
        onInputChange={() => {}}
        selectedOption={null}
        onOptionSelect={() => {}}
        options={options}
      />
    );

    expect(screen.getByText('Test Combined')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Type or select')).toBeInTheDocument();
  });

  test('shows required indicator when required', () => {
    render(
      <CustomTextInput
        type="text"
        label="Required Field"
        value=""
        onChange={() => {}}
        required
      />
    );

    expect(screen.getByText('*')).toBeInTheDocument();
  });

  test('shows error message when error is provided', () => {
    render(
      <CustomTextInput
        type="text"
        label="Error Field"
        value=""
        onChange={() => {}}
        error="This is an error message"
        showError={true}
      />
    );

    expect(screen.getByText('This is an error message')).toBeInTheDocument();
  });

  test('calls onChange when text input value changes', () => {
    const mockOnChange = jest.fn();

    render(
      <CustomTextInput
        type="text"
        label="Test Input"
        value=""
        onChange={mockOnChange}
      />
    );

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'new value' } });

    expect(mockOnChange).toHaveBeenCalledWith('new value');
  });

  test('applies disabled styling when disabled', () => {
    render(
      <CustomTextInput
        type="text"
        label="Disabled Field"
        value="disabled value"
        onChange={() => {}}
        disabled
      />
    );

    const input = screen.getByRole('textbox');
    expect(input).toBeDisabled();
  });

  test('applies read-only styling when readOnly', () => {
    render(
      <CustomTextInput
        type="text"
        label="Read Only Field"
        value="read only value"
        onChange={() => {}}
        readOnly
      />
    );

    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('readonly');
  });
}); 