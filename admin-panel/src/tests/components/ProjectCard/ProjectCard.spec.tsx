import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';

import ProjectCard from '@/components/ProjectCard';
import * as projectHelpers from '@/helpers/projectHelpers';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, options?: { defaultValue: string }) => options?.defaultValue || key,
    i18n: { language: 'en' }
  })
}));

vi.mock('@/helpers/projectHelpers', () => ({
  getProjectData: vi.fn()
}));

vi.mock('@/components/EditButton', () => ({
  default: ({ title }: any) => <button title={title}>Edit</button>
}));

vi.mock('@/components/DeleteButton', () => ({
  default: ({ title, onDelete }: any) => <button title={title} onClick={onDelete}>Delete</button>
}));

const mockProject: any = {
  id: 'uuid-123',
  imageUrl: 'https://via.placeholder.com/150',
  liveUrl: 'https://live.com',
  repoUrl: 'https://github.com'
};

describe('ProjectCard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(projectHelpers.getProjectData).mockReturnValue('Test Project');
  });

  it('should render project data correctly', () => {
    render(
      <MemoryRouter>
        <ProjectCard project={mockProject} onDelete={vi.fn()} />
      </MemoryRouter>
    );

    expect(screen.getByText('Test Project')).toBeInTheDocument();
    expect(screen.getByRole('img')).toHaveAttribute('src', mockProject.imageUrl);
    expect(screen.getByRole('link', { name: /projects.cards.live_url/i })).toHaveAttribute('href', mockProject.liveUrl);
    expect(screen.getByRole('link', { name: /projects.cards.repo_url/i })).toHaveAttribute('href', mockProject.repoUrl);
  });

  it('should render fallbacks when image and links are missing', () => {
    const projectWithoutMedia = {
      ...mockProject,
      imageUrl: null,
      liveUrl: null,
      repoUrl: null
    };

    render(
      <MemoryRouter>
        <ProjectCard project={projectWithoutMedia} onDelete={vi.fn()} />
      </MemoryRouter>
    );

    expect(screen.getByText('projects.cards.no_image')).toBeInTheDocument();
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });

  it('should call onDelete with the correct id when delete button is clicked', async () => {
    const user = userEvent.setup();
    const mockOnDelete = vi.fn();

    render(
      <MemoryRouter>
        <ProjectCard project={mockProject} onDelete={mockOnDelete} />
      </MemoryRouter>
    );

    const deleteButton = screen.getByTitle('Delete');
    await user.click(deleteButton);

    expect(mockOnDelete).toHaveBeenCalledTimes(1);
    expect(mockOnDelete).toHaveBeenCalledWith(mockProject.id);
  });

  it('should render fallback title when getProjectData returns falsy', () => {
    vi.mocked(projectHelpers.getProjectData).mockReturnValue('');

    render(
      <MemoryRouter>
        <ProjectCard project={mockProject} onDelete={vi.fn()} />
      </MemoryRouter>
    );

    expect(screen.getByText('projects.card.not_defined')).toBeInTheDocument();
  });
});
