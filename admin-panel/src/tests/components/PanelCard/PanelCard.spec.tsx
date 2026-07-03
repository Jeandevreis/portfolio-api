import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import PanelCard from '@/components/PanelCard';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, options?: { defaultValue: string }) => options?.defaultValue || key
  })
}));

const mockProps = {
  title: 'Test Title',
  description: 'Test Description',
  icon: <span data-testid="icon" />,
  type: 'internal' as const,
  url: '/test-url'
};

describe('PanelCard', () => {
  it('should render title and description correctly', () => {
    render(
      <MemoryRouter>
        <PanelCard {...mockProps} />
      </MemoryRouter>
    );

    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
    expect(screen.getByTestId('icon')).toBeInTheDocument();
  });

  it('should render as a Link when type is internal', () => {
    render(
      <MemoryRouter>
        <PanelCard {...mockProps} type="internal" />
      </MemoryRouter>
    );

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/test-url');
  });

  it('should render as an anchor tag when type is external', () => {
    render(
      <PanelCard {...mockProps} type="external" url="https://example.com" />
    );

    const anchor = screen.getByRole('link');
    expect(anchor).toHaveAttribute('href', 'https://example.com');
    expect(anchor).toHaveAttribute('target', '_blank');
  });

  it('should render as a div and show soon label when type is disabled', () => {
    render(
      <PanelCard {...mockProps} type="disabled" />
    );

    expect(screen.queryByRole('link')).not.toBeInTheDocument();
    expect(screen.getByText('panel_card.soon')).toBeInTheDocument();
  });

  it('should show access text when type is internal', () => {
    render(
      <MemoryRouter>
        <PanelCard {...mockProps} type="internal" />
      </MemoryRouter>
    );

    expect(screen.getByText('panel_card.access')).toBeInTheDocument();
  });

  it('should render bgIcon when provided and not disabled', () => {
    render(
      <MemoryRouter>
        <PanelCard
          {...mockProps}
          type="internal"
          bgIcon={<span data-testid="bg-icon" />}
        />
      </MemoryRouter>
    );

    expect(screen.getByTestId('bg-icon')).toBeInTheDocument();
  });
});
