import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

import FullScreenLoader from '@/components/FullScreenLoader';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'loader.verifying_session': 'Verifying session...'
      };
      return translations[key] || key;
    }
  })
}));

describe('FullScreenLoader Component', () => {
  it('should render the translated loading text', () => {
    render(<FullScreenLoader />);

    expect(screen.getByText('Verifying session...')).toBeInTheDocument();
  });

  it('should render the spinner element', () => {
    const { container } = render(<FullScreenLoader />);

    const spinner = container.querySelector('.animate-spin');

    expect(spinner).toBeInTheDocument();
  });
});