import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import { useProfile } from '@/hooks/useProfile';
import { useAuth } from '@/contexts/AuthContext';
import { UserService } from '@/services/userService';
import { UploadService } from '@/services/uploadService';
import { useImagePreview } from '@/hooks/useImagePreview';

let mockProfileData: any = {};
let mockPasswordData: any = {};

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

vi.mock('react-hook-form', async () => {
  const actual = await vi.importActual('react-hook-form');
  return {
    ...actual,
    useForm: (options: any) => {
      if (options.resolver) {
        try {
          options.resolver({ newPassword: '123', confirmPassword: '123' }, undefined, { fields: {} });
          options.resolver({ newPassword: '123', confirmPassword: '456' }, undefined, { fields: {} });
        } catch (e) { }
      }
      return {
        register: vi.fn(),
        control: {},
        reset: vi.fn(),
        formState: { errors: {}, isSubmitting: false },
        handleSubmit: (cb: any) => async (e?: any) => {
          if (e?.preventDefault) e.preventDefault();
          if (options.defaultValues && 'oldPassword' in options.defaultValues) {
            await cb(mockPasswordData);
          } else {
            await cb(mockProfileData);
          }
        },
      };
    },
  };
});

vi.mock('@/contexts/AuthContext', () => ({
  useAuth: vi.fn(),
}));

vi.mock('@/services/uploadService', () => ({
  UploadService: { uploadImage: vi.fn() },
}));

vi.mock('@/services/userService', () => ({
  UserService: { updateProfile: vi.fn(), updatePassword: vi.fn() },
}));

vi.mock('@/hooks/useImagePreview', () => ({
  useImagePreview: vi.fn(),
}));

describe('useProfile hook', () => {
  const mockSetUser = vi.fn();
  const baseImagePreviewState = {
    imagePreview: null,
    setImagePreview: vi.fn(),
    selectedFile: null,
    setSelectedFile: vi.fn(),
    handleFileChange: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockProfileData = { name: 'John', email: 'j@j.com' };
    mockPasswordData = { oldPassword: 'old', newPassword: 'new' };

    vi.mocked(useAuth).mockReturnValue({
      user: { id: '1', name: 'John', email: 'j@j.com', avatarUrl: 'url' },
      setUser: mockSetUser,
    } as any);

    vi.mocked(useImagePreview).mockReturnValue({ ...baseImagePreviewState } as any);
  });

  it('should handle null user on mount', () => {
    vi.mocked(useAuth).mockReturnValue({ user: null, setUser: mockSetUser } as any);
    const { result } = renderHook(() => useProfile());
    expect(result.current.loading).toBe(true);
  });

  it('should initialize with minimal user values', () => {
    vi.mocked(useAuth).mockReturnValue({
      user: { id: '1' },
      setUser: mockSetUser,
    } as any);
    const { result } = renderHook(() => useProfile());
    expect(result.current.loading).toBe(false);
  });

  it('should submit profile successfully without new image', async () => {
    vi.mocked(useAuth).mockReturnValue({
      user: { id: '1', name: 'John', email: 'j@j.com', avatarUrl: '' },
      setUser: mockSetUser,
    } as any);
    vi.mocked(UserService.updateProfile).mockResolvedValue({ id: '1' } as any);

    const { result } = renderHook(() => useProfile());
    await act(async () => {
      await result.current.updateProfileSubmit();
    });

    expect(UserService.updateProfile).toHaveBeenCalledWith(
      expect.objectContaining({ avatarUrl: undefined })
    );
    expect(result.current.successProfile).toBe(true);
  });

  it('should submit profile successfully with new image', async () => {
    vi.mocked(useImagePreview).mockReturnValue({
      ...baseImagePreviewState,
      selectedFile: new File([''], 'avatar.png'),
    } as any);
    vi.mocked(UploadService.uploadImage).mockResolvedValue('new_url');
    vi.mocked(UserService.updateProfile).mockResolvedValue({ id: '1' } as any);

    const { result } = renderHook(() => useProfile());
    await act(async () => {
      await result.current.updateProfileSubmit();
    });

    expect(UploadService.uploadImage).toHaveBeenCalled();
    expect(UserService.updateProfile).toHaveBeenCalled();
  });

  it('should handle profile submit error with error property', async () => {
    vi.mocked(UserService.updateProfile).mockRejectedValueOnce({ error: 'err.profile' });
    const { result } = renderHook(() => useProfile());
    await act(async () => {
      await result.current.updateProfileSubmit();
    });
    expect(result.current.globalErrorProfile).toBe('err.profile');
  });

  it('should handle profile submit error with message property', async () => {
    vi.mocked(UserService.updateProfile).mockRejectedValueOnce({ message: 'msg.profile' });
    const { result } = renderHook(() => useProfile());
    await act(async () => {
      await result.current.updateProfileSubmit();
    });
    expect(result.current.globalErrorProfile).toBe('msg.profile');
  });

  it('should handle profile submit error with no property', async () => {
    vi.mocked(UserService.updateProfile).mockRejectedValueOnce({});
    const { result } = renderHook(() => useProfile());
    await act(async () => {
      await result.current.updateProfileSubmit();
    });
    expect(result.current.globalErrorProfile).toBe('api.error.unknown');
  });

  it('should submit password successfully', async () => {
    vi.mocked(UserService.updatePassword).mockResolvedValue({} as any);
    const { result } = renderHook(() => useProfile());
    await act(async () => {
      await result.current.updatePasswordSubmit();
    });
    expect(UserService.updatePassword).toHaveBeenCalled();
    expect(result.current.successPassword).toBe(true);
  });

  it('should handle password submit error with error property', async () => {
    vi.mocked(UserService.updatePassword).mockRejectedValueOnce({ error: 'err.password' });
    const { result } = renderHook(() => useProfile());
    await act(async () => {
      await result.current.updatePasswordSubmit();
    });
    expect(result.current.globalErrorPassword).toBe('err.password');
  });

  it('should handle password submit error with message property', async () => {
    vi.mocked(UserService.updatePassword).mockRejectedValueOnce({ message: 'msg.password' });
    const { result } = renderHook(() => useProfile());
    await act(async () => {
      await result.current.updatePasswordSubmit();
    });
    expect(result.current.globalErrorPassword).toBe('msg.password');
  });

  it('should handle password submit error with no property', async () => {
    vi.mocked(UserService.updatePassword).mockRejectedValueOnce({});
    const { result } = renderHook(() => useProfile());
    await act(async () => {
      await result.current.updatePasswordSubmit();
    });
    expect(result.current.globalErrorPassword).toBe('api.error.unknown');
  });
});
