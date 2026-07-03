import { useState } from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import userEvent from '@testing-library/user-event';

import Input from '@/components/Input';

describe('Input Component', () => {
  const mockOnChange = vi.fn();

  const defaultProps = {
    label: 'Username',
    placeholder: 'Enter your username',
    id: 'username',
    name: 'username',
    value: '',
    onChange: mockOnChange,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render the label and input correctly', () => {
    render(<Input {...defaultProps} />);

    expect(screen.getByText('Username')).toBeInTheDocument();

    const input = screen.getByPlaceholderText('Enter your username');
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('id', 'username');
    expect(input).toHaveAttribute('name', 'username');
  });

  it('should render children elements (like an IconWrapper)', () => {
    render(
      <Input {...defaultProps}>
        <span data-testid="input-icon">👤</span>
      </Input>
    );

    expect(screen.getByTestId('input-icon')).toBeInTheDocument();
    expect(screen.getByText('👤')).toBeInTheDocument();
  });

  it('should call onChange when the user types', async () => {
    const user = userEvent.setup();
    render(<Input {...defaultProps} />);

    const input = screen.getByPlaceholderText('Enter your username');
    await user.type(input, 'A');

    expect(mockOnChange).toHaveBeenCalledTimes(1);
  });

  it('should apply the mask function and update the input value', async () => {
    const user = userEvent.setup();
    const mockMask = vi.fn((val: string) => val.toUpperCase());

    // Criamos um Wrapper para agir como o formulário real que vai usar esse Input
    const TestWrapper = () => {
      const [val, setVal] = useState('');
      return (
        <Input
          {...defaultProps}
          value={val}
          onChange={(e) => {
            setVal(e.target.value);
            mockOnChange(e);
          }}
          mask={mockMask}
        />
      );
    };

    render(<TestWrapper />);

    const input = screen.getByPlaceholderText('Enter your username');

    // Voltamos para o user.type simulando o usuário perfeitamente
    await user.type(input, 'a');

    expect(mockMask).toHaveBeenCalled();
    expect(mockOnChange).toHaveBeenCalledTimes(1);

    // Verificamos o mais importante: o que aparece para o usuário na tela mudou de 'a' para 'A'?
    expect(input).toHaveValue('A');
  });

  it('should apply custom HTML attributes like type, required, and maxLength', () => {
    render(
      <Input
        {...defaultProps}
        type="email"
        required={true}
        maxLength={50}
      />
    );

    const input = screen.getByPlaceholderText('Enter your username');

    expect(input).toHaveAttribute('type', 'email');
    expect(input).toBeRequired();
    expect(input).toHaveAttribute('maxlength', '50');
  });

  it('should not throw an error if the user types and onChange is not provided', async () => {
    const user = userEvent.setup();
    render(<Input id="no-onChange" label="No OnChange" placeholder="Type here" />);

    const input = screen.getByPlaceholderText('Type here');

    await user.type(input, 'test');

    expect(input).toHaveValue('test');
  });
});
