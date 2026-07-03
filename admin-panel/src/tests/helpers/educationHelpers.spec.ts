import { describe, it, expect } from 'vitest';
import { getEducationData, getStatusColor, formatDate } from '../../helpers/educationHelpers';

describe('educationHelpers', () => {
  describe('getEducationData', () => {
    it('should return null if translations are undefined', () => {
      const edu = { translations: undefined } as any;
      expect(getEducationData(edu, 'name', 'en')).toBeNull();
    });

    it('should return null if translations are empty', () => {
      const edu = { translations: [] } as any;
      expect(getEducationData(edu, 'name', 'en')).toBeNull();
    });

    it('should return the translated field for matching language', () => {
      const edu = {
        translations: [
          { language: 'en', name: 'English Name', institution: 'English Inst' },
          { language: 'pt', name: 'Portuguese Name', institution: 'Portuguese Inst' }
        ]
      } as any;
      expect(getEducationData(edu, 'name', 'en')).toBe('English Name');
      expect(getEducationData(edu, 'institution', 'pt')).toBe('Portuguese Inst');
    });

    it('should fallback to first translation if no language matches', () => {
      const edu = {
        translations: [
          { language: 'en', name: 'English Name', institution: 'English Inst' },
          { language: 'pt', name: 'Portuguese Name', institution: 'Portuguese Inst' }
        ]
      } as any;
      expect(getEducationData(edu, 'name', 'es')).toBe('English Name');
    });

    it('should return null if the field is not present in the translation', () => {
      const edu = {
        translations: [
          { language: 'en' }
        ]
      } as any;
      expect(getEducationData(edu, 'name', 'en')).toBeNull();
    });
  });

  describe('getStatusColor', () => {
    it('should return correct color classes for completed', () => {
      expect(getStatusColor('completed')).toBe('bg-green-50 text-green-700 border-green-200');
    });

    it('should return correct color classes for in_progress', () => {
      expect(getStatusColor('in_progress')).toBe('bg-blue-50 text-blue-700 border-blue-200');
    });

    it('should return correct color classes for paused', () => {
      expect(getStatusColor('paused')).toBe('bg-yellow-50 text-yellow-700 border-yellow-200');
    });

    it('should return default color classes for unknown status', () => {
      expect(getStatusColor('unknown')).toBe('bg-gray-50 text-gray-700 border-gray-200');
    });
  });

  describe('formatDate', () => {
    it('should return empty string if dateString is not provided', () => {
      expect(formatDate(undefined)).toBe('');
      expect(formatDate('')).toBe('');
    });

    it('should format a valid date string with default pt-BR locale', () => {
      const dateStr = '2023-05-15';
      const expected = new Date(new Date(dateStr).getTime() + new Date(dateStr).getTimezoneOffset() * 60000)
        .toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' });
      expect(formatDate(dateStr)).toBe(expected);
    });

    it('should format a valid date string with custom locale', () => {
      const dateStr = '2023-05-15';
      const expected = new Date(new Date(dateStr).getTime() + new Date(dateStr).getTimezoneOffset() * 60000)
        .toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      expect(formatDate(dateStr, 'en-US')).toBe(expected);
    });
  });
});
