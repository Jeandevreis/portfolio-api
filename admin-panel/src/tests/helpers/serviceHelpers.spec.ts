import { describe, it, expect } from 'vitest';
import { getServiceData } from '../../helpers/serviceHelpers';

describe('serviceHelpers', () => {
  describe('getServiceData', () => {
    it('should return null if translations are undefined', () => {
      const service = { translations: undefined } as any;
      expect(getServiceData(service, 'title', 'en')).toBeNull();
    });

    it('should return null if translations are empty', () => {
      const service = { translations: [] } as any;
      expect(getServiceData(service, 'title', 'en')).toBeNull();
    });

    it('should return the translated field for matching language', () => {
      const service = {
        translations: [
          { language: 'en', title: 'English Title', description: 'English Desc' },
          { language: 'pt', title: 'Portuguese Title', description: 'Portuguese Desc' }
        ]
      } as any;
      expect(getServiceData(service, 'title', 'en')).toBe('English Title');
      expect(getServiceData(service, 'description', 'pt')).toBe('Portuguese Desc');
    });

    it('should fallback to first translation if no language matches', () => {
      const service = {
        translations: [
          { language: 'en', title: 'English Title', description: 'English Desc' },
          { language: 'pt', title: 'Portuguese Title', description: 'Portuguese Desc' }
        ]
      } as any;
      expect(getServiceData(service, 'title', 'es')).toBe('English Title');
    });

    it('should return null if the field is not present in the translation', () => {
      const service = {
        translations: [
          { language: 'en' }
        ]
      } as any;
      expect(getServiceData(service, 'title', 'en')).toBeNull();
    });
  });
});
