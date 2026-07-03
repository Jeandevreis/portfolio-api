import { renderHook, act, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import { useSettings } from '@/hooks/useSettings';
import { SettingsService } from '@/services/settingsService';
import { UploadService } from '@/services/uploadService';
import { useImagePreview } from '@/hooks/useImagePreview';

let mockFormData: any = {};

vi.mock('react-i18next', () => {
  const stableT = (key: string) => key;
  return {
    useTranslation: () => ({
      t: stableT,
    }),
  };
});

vi.mock('react-hook-form', async () => {
  const actual = await vi.importActual('react-hook-form');
  const stableReset = vi.fn();

  return {
    ...actual,
    useForm: () => ({
      register: vi.fn(),
      handleSubmit: (cb: any) => async (e?: any) => {
        if (e && e.preventDefault) e.preventDefault();
        await cb(mockFormData);
      },
      reset: stableReset,
      formState: { errors: {}, isSubmitting: false },
    }),
  };
});

vi.mock('@/services/settingsService', () => ({
  SettingsService: {
    get: vi.fn(),
    update: vi.fn(),
  },
}));

vi.mock('@/services/uploadService', () => ({
  UploadService: {
    uploadImage: vi.fn(),
  },
}));

vi.mock('@/hooks/useImagePreview', () => ({
  useImagePreview: vi.fn(),
}));

describe('useSettings hook', () => {
  const baseImagePreviewState = {
    imagePreview: null,
    setImagePreview: vi.fn(),
    selectedFile: null,
    setSelectedFile: vi.fn(),
    handleFileChange: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useImagePreview).mockReturnValue({ ...baseImagePreviewState } as any);
    mockFormData = {
      theme: 'dark',
      panelLanguage: 'en',
      siteUrl: 'url',
      publicEmail: 'email',
      logoUrl: 'logo',
      customConfig: {}
    };
  });

  it('should load settings on mount with full data', async () => {
    vi.mocked(SettingsService.get).mockResolvedValue(mockFormData as any);
    const { result } = renderHook(() => useSettings({ fetchOnMount: true }));
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(SettingsService.get).toHaveBeenCalled();
  });

  it('should load settings on mount with minimal data', async () => {
    vi.mocked(SettingsService.get).mockResolvedValue({} as any);
    const { result } = renderHook(() => useSettings({ fetchOnMount: true }));
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(SettingsService.get).toHaveBeenCalled();
  });

  it('should handle load settings error with error property', async () => {
    vi.mocked(SettingsService.get).mockRejectedValueOnce({ error: 'err.1' });
    const { result } = renderHook(() => useSettings({ fetchOnMount: true }));
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.globalError).toBe('err.1');
  });

  it('should handle load settings error with no property', async () => {
    vi.mocked(SettingsService.get).mockRejectedValueOnce({});
    const { result } = renderHook(() => useSettings({ fetchOnMount: true }));
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.globalError).toBe('api.error.unknown');
  });

  it('should submit update with minimal payload and object customConfig', async () => {
    vi.mocked(useImagePreview).mockReturnValue({ ...baseImagePreviewState, imagePreview: 'img' } as any);
    vi.mocked(SettingsService.update).mockResolvedValue({} as any);

    const { result } = renderHook(() => useSettings());
    await act(async () => {
      await result.current.updateSettings()();
    });

    expect(SettingsService.update).toHaveBeenCalled();
  });

  it('should submit update with file upload and string customConfig', async () => {
    vi.mocked(useImagePreview).mockReturnValue({
      ...baseImagePreviewState,
      selectedFile: new File([''], 'file')
    } as any);
    mockFormData = { ...mockFormData, customConfig: '{"key":"value"}' };

    vi.mocked(UploadService.uploadImage).mockResolvedValue('uploaded_url');
    vi.mocked(SettingsService.update).mockResolvedValue({} as any);

    const { result } = renderHook(() => useSettings());
    const onSuccessMock = vi.fn();

    await act(async () => {
      await result.current.updateSettings(onSuccessMock)();
    });

    expect(UploadService.uploadImage).toHaveBeenCalled();
    expect(SettingsService.update).toHaveBeenCalled();
    expect(onSuccessMock).toHaveBeenCalled();
  });

  it('should submit update with empty string customConfig', async () => {
    vi.mocked(useImagePreview).mockReturnValue({ ...baseImagePreviewState } as any);
    mockFormData = { ...mockFormData, customConfig: '' };
    vi.mocked(SettingsService.update).mockResolvedValue({} as any);

    const { result } = renderHook(() => useSettings());
    await act(async () => {
      await result.current.updateSettings()();
    });

    expect(SettingsService.update).toHaveBeenCalled();
  });

  it('should update existing settings state correctly on submit', async () => {
    vi.mocked(SettingsService.get).mockResolvedValue({ theme: 'light' } as any);
    const { result } = renderHook(() => useSettings({ fetchOnMount: true }));
    await waitFor(() => expect(result.current.loading).toBe(false));

    vi.mocked(SettingsService.update).mockResolvedValue({ theme: 'dark' } as any);

    await act(async () => {
      await result.current.updateSettings()();
    });

    expect(result.current.settings?.theme).toBe('dark');
  });

  it('should handle submit error with message property', async () => {
    vi.mocked(SettingsService.update).mockRejectedValueOnce({ message: 'msg.1' });
    const { result } = renderHook(() => useSettings());

    await act(async () => {
      await result.current.updateSettings()();
    });

    expect(result.current.globalError).toBe('msg.1');
  });

  it('should handle submit error with no property', async () => {
    vi.mocked(SettingsService.update).mockRejectedValueOnce({});
    const { result } = renderHook(() => useSettings());

    await act(async () => {
      await result.current.updateSettings()();
    });

    expect(result.current.globalError).toBe('settings.error.update');
  });
});
