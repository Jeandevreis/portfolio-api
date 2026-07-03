import { describe, it, expect, vi } from 'vitest';
import { handleResponse } from '../../helpers/fetchHelpers';

describe('fetchHelpers', () => {
  describe('handleResponse', () => {
    it('should return parsed json if response is ok', async () => {
      const mockData = { data: 'success' };
      const response = {
        ok: true,
        json: vi.fn().mockResolvedValue(mockData)
      } as unknown as Response;

      const result = await handleResponse(response);
      expect(result).toEqual(mockData);
      expect(response.json).toHaveBeenCalledTimes(1);
    });

    it('should throw default error if response is not ok and json parsing fails', async () => {
      const response = {
        ok: false,
        json: vi.fn().mockRejectedValue(new Error('Failed to parse json'))
      } as unknown as Response;

      await expect(handleResponse(response)).rejects.toEqual({
        error: 'api.error.unknown',
        message: 'An unexpected error occurred'
      });
    });

    it('should throw original error if response is not ok and is not a Zod error', async () => {
      const apiError = { error: 'api.error.not_found', message: 'Not Found' };
      const response = {
        ok: false,
        json: vi.fn().mockResolvedValue(apiError)
      } as unknown as Response;

      await expect(handleResponse(response)).rejects.toEqual(apiError);
    });

    it('should throw original error even if validation error is triggered because of the catch block', async () => {
      const zodError = {
        success: false,
        error: {
          message: JSON.stringify([{ message: 'Required field' }])
        }
      };
      const response = {
        ok: false,
        json: vi.fn().mockResolvedValue(zodError)
      } as unknown as Response;

      await expect(handleResponse(response)).rejects.toEqual(zodError);
    });

    it('should throw original error if response is a Zod error but parsing issues fails', async () => {
      const zodError = {
        success: false,
        error: {
          message: 'invalid-json-string'
        }
      };
      const response = {
        ok: false,
        json: vi.fn().mockResolvedValue(zodError)
      } as unknown as Response;

      await expect(handleResponse(response)).rejects.toEqual(zodError);
    });

    it('should throw original error if response is a Zod error but issues is not an array', async () => {
      const zodError = {
        success: false,
        error: {
          message: JSON.stringify({ notAnArray: true })
        }
      };
      const response = {
        ok: false,
        json: vi.fn().mockResolvedValue(zodError)
      } as unknown as Response;

      await expect(handleResponse(response)).rejects.toEqual(zodError);
    });

    it('should throw original error if response is a Zod error but first issue has no message', async () => {
      const zodError = {
        success: false,
        error: {
          message: JSON.stringify([{}])
        }
      };
      const response = {
        ok: false,
        json: vi.fn().mockResolvedValue(zodError)
      } as unknown as Response;

      await expect(handleResponse(response)).rejects.toEqual(zodError);
    });
  });
});
