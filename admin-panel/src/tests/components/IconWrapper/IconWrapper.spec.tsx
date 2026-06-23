import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import IconWrapper from '@/components/IconWrapper';

describe('IconWrapper Component', () => {
  it('should render the provided children', () => {
    render(
      <IconWrapper>
        <span data-testid="test-icon">🔍</span>
      </IconWrapper>
    );

    expect(screen.getByTestId('test-icon')).toBeInTheDocument();
    expect(screen.getByText('🔍')).toBeInTheDocument();
  });

  it('should have the correct layout classes applied', () => {
    const { container } = render(
      <IconWrapper>
        <span>icon</span>
      </IconWrapper>
    );

    const wrapperElement = container.firstChild as HTMLElement;

    expect(wrapperElement).toHaveClass(
      'absolute',
      'inset-y-0',
      'left-0',
      'pl-4',
      'flex',
      'items-center',
      'pointer-events-none',
      'text-zinc-500',
      'text-base'
    );
  });
});
