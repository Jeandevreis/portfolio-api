import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import Panel from '@/pages/Panel';

import { useSettingsContext } from '@/contexts/SettingsContext';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, options?: { defaultValue: string }) => options?.defaultValue || key,
  }),
}));

vi.mock('@/contexts/SettingsContext', () => ({
  useSettingsContext: vi.fn(),
}));

vi.mock('@/components/Background', () => ({
  default: () => <div data-testid="mock-background" />
}));

vi.mock('@/components/PanelCard', () => ({
  default: ({ title, description, url, type }: any) => (
    <div data-testid="mock-panel-card">
      <h3 data-testid="card-title">{title}</h3>
      <p data-testid="card-description">{description}</p>
      <span data-testid="card-url">{url}</span>
      <span data-testid="card-type">{type}</span>
    </div>
  )
}));

describe('Panel Component', () => {
  beforeEach(() => vi.clearAllMocks());

  it('should render the panel title, description, and background', () => {
    vi.mocked(useSettingsContext).mockReturnValue({
      globalSettings: { siteUrl: '' },
    } as any);

    render(<Panel />);

    expect(screen.getByText('Welcome back!')).toBeInTheDocument();
    expect(screen.getByText('What would you like to manage today?')).toBeInTheDocument();
    expect(screen.getByTestId('mock-background')).toBeInTheDocument();
  });

  it('should render exactly 5 PanelCards with correct data', () => {
    const mockSiteUrl = 'https://meu-portfolio.com';

    vi.mocked(useSettingsContext).mockReturnValue({
      globalSettings: { siteUrl: mockSiteUrl },
    } as any);

    render(<Panel />);

    const cards = screen.getAllByTestId('mock-panel-card');
    expect(cards).toHaveLength(5);

    const expectedCards = [
      { title: 'My Projects', url: '/projects', type: 'internal' },
      { title: 'My Educations', url: '/educations', type: 'internal' },
      { title: 'My Services', url: '/services', type: 'internal' },
      { title: 'Settings', url: '/settings', type: 'internal' },
      { title: 'Visit Website', url: mockSiteUrl, type: 'external' },
    ];

    const renderedTitles = screen.getAllByTestId('card-title').map(el => el.textContent);
    const renderedUrls = screen.getAllByTestId('card-url').map(el => el.textContent);
    const renderedTypes = screen.getAllByTestId('card-type').map(el => el.textContent);

    expectedCards.forEach((expected, index) => {
      expect(renderedTitles[index]).toBe(expected.title);
      expect(renderedUrls[index]).toBe(expected.url);
      expect(renderedTypes[index]).toBe(expected.type);
    });
  });

  it('should handle missing siteUrl in globalSettings gracefully', () => {
    vi.mocked(useSettingsContext).mockReturnValue({
      globalSettings: null,
    } as any);

    render(<Panel />);

    const renderedUrls = screen.getAllByTestId('card-url');
    const visitWebsiteUrl = renderedUrls[renderedUrls.length - 1].textContent;

    expect(visitWebsiteUrl).toBe('');
  });
});
