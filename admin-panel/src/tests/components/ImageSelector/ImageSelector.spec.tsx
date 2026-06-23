import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import userEvent from '@testing-library/user-event';

import ImageSelector from '@/components/ImageSelector';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'image_selector.label': 'Image (Logo or Cover)',
        'image_selector.preview_alt': 'Preview',
        'image_selector.click_to_change': 'Click to change',
        'image_selector.click_to_upload': 'Click to upload',
        'image_selector.file_limits': 'PNG, JPG up to 5MB'
      };
      return translations[key] || key;
    }
  })
}));

describe('ImageSelector Component', () => {
  const mockOnFileChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render the default upload state when there is no preview', () => {
    render(<ImageSelector imagePreview={null} onFileChange={mockOnFileChange} />);

    expect(screen.getByText('Image (Logo or Cover)')).toBeInTheDocument();
    expect(screen.getByText('Click to upload')).toBeInTheDocument();
    expect(screen.getByText('PNG, JPG up to 5MB')).toBeInTheDocument();
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });

  it('should render the image preview state correctly', () => {
    const previewUrl = 'https://example.com/image.png';
    render(<ImageSelector imagePreview={previewUrl} onFileChange={mockOnFileChange} />);

    expect(screen.getByText('Image (Logo or Cover)')).toBeInTheDocument();
    expect(screen.getByText('Click to change')).toBeInTheDocument();

    const image = screen.getByRole('img');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', previewUrl);
    expect(image).toHaveAttribute('alt', 'Preview');
  });

  it('should trigger the hidden file input click when the container is clicked', async () => {
    const user = userEvent.setup();
    render(<ImageSelector imagePreview={null} onFileChange={mockOnFileChange} />);

    const fileInput = screen.getByTestId('file-input');
    const clickSpy = vi.spyOn(fileInput, 'click');

    const dropzoneText = screen.getByText('Click to upload');
    await user.click(dropzoneText);

    expect(clickSpy).toHaveBeenCalled();
  });

  it('should call onFileChange when a file is selected', async () => {
    const user = userEvent.setup();
    render(<ImageSelector imagePreview={null} onFileChange={mockOnFileChange} />);

    const file = new File(['mock-image'], 'test.png', { type: 'image/png' });
    const fileInput = screen.getByTestId('file-input');

    await user.upload(fileInput, file);

    expect(mockOnFileChange).toHaveBeenCalledTimes(1);
  });
});
