import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import ErrorAlert from '@/components/ErrorAlert';

describe('ErrorAlert Component', () => {
  it('should render the provided error message', () => {
    const errorMessage = 'An unexpected error occurred';

    render(<ErrorAlert message={errorMessage} />);

    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  it('should render correctly when message is null', () => {
    const { container } = render(<ErrorAlert message={null} />);

    expect(container.firstChild).toBeInTheDocument();
    expect(screen.queryByText(/[a-zA-Z]/)).not.toBeInTheDocument();
  });
});
