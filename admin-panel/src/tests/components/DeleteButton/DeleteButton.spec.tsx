import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import userEvent from '@testing-library/user-event';

import DeleteButton from '@/components/DeleteButton';

describe('DeleteButton Component', () => {
  it('should render the button with the correct title', () => {
    const mockOnDelete = vi.fn();
    const translatedTitle = 'Delete item';

    render(<DeleteButton onDelete={mockOnDelete} title={translatedTitle} />);

    const button = screen.getByRole('button');

    expect(button).toHaveAttribute('title', translatedTitle);
  });

  it('should call onDelete exactly once when clicked', async () => {
    const mockOnDelete = vi.fn();
    const user = userEvent.setup();

    render(<DeleteButton onDelete={mockOnDelete} title="Delete" />);

    const button = screen.getByRole('button');

    await user.click(button);

    expect(mockOnDelete).toHaveBeenCalledTimes(1);
  });
});