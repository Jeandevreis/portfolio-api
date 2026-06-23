import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';

import EditButton from '@/components/EditButton';

describe('EditButton Component', () => {
  it('should render the link with the correct title', () => {
    const translatedTitle = 'Edit item';
    const targetPath = '/edit/1';

    render(
      <MemoryRouter>
        <EditButton to={{ pathname: targetPath }} title={translatedTitle} />
      </MemoryRouter>
    );

    const link = screen.getByRole('link');

    expect(link).toHaveAttribute('title', translatedTitle);
  });

  it('should have the correct href attribute based on the pathname prop', () => {
    const targetPath = '/projects/edit/123';

    render(
      <MemoryRouter>
        <EditButton to={{ pathname: targetPath }} title="Edit" />
      </MemoryRouter>
    );

    const link = screen.getByRole('link');

    expect(link).toHaveAttribute('href', targetPath);
  });
});