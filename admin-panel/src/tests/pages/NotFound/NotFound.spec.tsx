import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import NotFound from '@/pages/NotFound';
import { useAuth } from '@/contexts/AuthContext';

vi.mock('react-router-dom', () => ({
  Link: ({ children, to }: any) => <a href={to} data-testid="mock-link">{children}</a>,
}));

vi.mock('@/contexts/AuthContext', () => ({
  useAuth: vi.fn(),
}));

describe('NotFound Page Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return null when checkingAuth is true', () => {
    vi.mocked(useAuth).mockReturnValue({
      checkingAuth: true,
      isAuthenticated: false,
    } as any);

    const { container } = render(<NotFound />);

    expect(container.firstChild).toBeNull();
  });

  it('should render detailed 404 page and back to panel link when authenticated', () => {
    vi.mocked(useAuth).mockReturnValue({
      checkingAuth: false,
      isAuthenticated: true,
    } as any);

    render(<NotFound />);

    expect(screen.getByText('404')).toBeInTheDocument();
    expect(screen.getByText('Página não encontrada')).toBeInTheDocument();
    expect(screen.getByText(/A página que você tentou acessar não existe/)).toBeInTheDocument();

    const link = screen.getByTestId('mock-link');
    expect(link).toHaveAttribute('href', '/panel');
    expect(link).toHaveTextContent('Voltar para o Painel');
  });

  it('should render generic 404 page when not authenticated', () => {
    vi.mocked(useAuth).mockReturnValue({
      checkingAuth: false,
      isAuthenticated: false,
    } as any);

    render(<NotFound />);

    expect(screen.getByText('404 | Recurso Indisponível')).toBeInTheDocument();
    expect(screen.queryByText('Página não encontrada')).not.toBeInTheDocument();
    expect(screen.queryByTestId('mock-link')).not.toBeInTheDocument();
  });
});
