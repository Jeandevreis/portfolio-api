import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { useImagePreview } from '@/hooks/useImagePreview';

describe('useImagePreview hook', () => {
  it('should initialize with default null or provided image url', () => {
    const { result } = renderHook(() => useImagePreview());
    expect(result.current.imagePreview).toBeNull();
    expect(result.current.selectedFile).toBeNull();

    const { result: result2 } = renderHook(() => useImagePreview('http://example.com/img.jpg'));
    expect(result2.current.imagePreview).toBe('http://example.com/img.jpg');
  });

  it('should clear image state when clearImage is called', () => {
    const { result } = renderHook(() => useImagePreview('http://example.com/img.jpg'));

    act(() => {
      result.current.clearImage();
    });

    expect(result.current.imagePreview).toBeNull();
    expect(result.current.selectedFile).toBeNull();
  });

  it('should handle file change and set image preview', async () => {
    const { result } = renderHook(() => useImagePreview());

    const file = new File(['hello'], 'hello.png', { type: 'image/png' });
    const mockEvent = {
      target: {
        files: [file]
      }
    } as unknown as React.ChangeEvent<HTMLInputElement>;

    const readAsDataURLMock = vi.fn();
    let onloadRef: any = null;

    class MockFileReader {
      readAsDataURL = readAsDataURLMock;
      set onload(val: any) {
        onloadRef = val;
      }
      get onload() {
        return onloadRef;
      }
    }

    const originalFileReader = window.FileReader;
    window.FileReader = MockFileReader as any;

    act(() => {
      result.current.handleFileChange(mockEvent);
    });

    expect(result.current.selectedFile).toBe(file);
    expect(readAsDataURLMock).toHaveBeenCalledWith(file);

    act(() => {
      if (onloadRef) {
        onloadRef({
          target: { result: 'data:image/png;base64,hello' }
        } as any);
      }
    });

    expect(result.current.imagePreview).toBe('data:image/png;base64,hello');

    window.FileReader = originalFileReader;
  });
});
