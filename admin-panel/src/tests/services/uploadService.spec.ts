import { describe, it, expect, vi, beforeEach } from 'vitest';
import { UploadService } from '@/services/uploadService';

describe('UploadService', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('should request Cloudinary signature and upload file successfully', async () => {
    const mockFile = new File(['foo'], 'foo.png', { type: 'image/png' });
    const mockSigData = {
      cloudName: 'testCloudName',
      apiKey: 'testApiKey',
      timestamp: 123456,
      signature: 'testSignature',
      publicId: 'testPublicId',
    };

    const mockUploadData = {
      secure_url: 'https://cloudinary.com/foo.png',
    };

    const fetchSpy = vi.spyOn(window, 'fetch');

    fetchSpy.mockResolvedValueOnce({
      ok: true,
      json: async () => mockSigData,
    } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockUploadData,
      } as Response);

    const result = await UploadService.uploadImage(mockFile, 'educations', 'edu-1');

    expect(result).toBe(mockUploadData.secure_url);
    expect(fetchSpy).toHaveBeenCalledTimes(2);

    expect(fetchSpy.mock.calls[0][0]).toBe('/api/uploads/cloudinary-signature');
    expect(fetchSpy.mock.calls[0][1]).toEqual({
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ folder: 'educations', identifier: 'edu-1' }),
    });

    expect(fetchSpy.mock.calls[1][0]).toBe('https://api.cloudinary.com/v1_1/testCloudName/image/upload');
    expect(fetchSpy.mock.calls[1][1]?.method).toBe('POST');
    expect(fetchSpy.mock.calls[1][1]?.body).toBeInstanceOf(FormData);
  });

  it('should throw error if signature endpoint fails', async () => {
    const mockFile = new File(['foo'], 'foo.png', { type: 'image/png' });

    vi.spyOn(window, 'fetch').mockResolvedValue({
      ok: false,
      json: async () => ({ error: 'Signature failure' }),
    } as Response);

    await expect(UploadService.uploadImage(mockFile, 'educations', 'edu-1')).rejects.toEqual({
      error: 'Signature failure',
    });
  });

  it('should throw error if upload to Cloudinary fails', async () => {
    const mockFile = new File(['foo'], 'foo.png', { type: 'image/png' });
    const mockSigData = {
      cloudName: 'testCloudName',
      apiKey: 'testApiKey',
      timestamp: 123456,
      signature: 'testSignature',
      publicId: 'testPublicId',
    };

    vi.spyOn(window, 'fetch')
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockSigData,
      } as Response)
      .mockResolvedValueOnce({
        ok: false,
      } as Response);

    await expect(UploadService.uploadImage(mockFile, 'educations', 'edu-1')).rejects.toEqual({
      error: 'services.error.upload_failed',
    });
  });
});
