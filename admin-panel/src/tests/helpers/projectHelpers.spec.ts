import { describe, it, expect } from 'vitest';
import { getProjectData } from '../../helpers/projectHelpers';

describe('projectHelpers', () => {
  describe('getProjectData', () => {
    it('should return null if translations are undefined', () => {
      const project = { translations: undefined } as any;
      expect(getProjectData(project, 'title', 'en')).toBeNull();
    });

    it('should return null if translations are empty', () => {
      const project = { translations: [] } as any;
      expect(getProjectData(project, 'title', 'en')).toBeNull();
    });

    it('should return the translated field for matching language', () => {
      const project = {
        translations: [
          { language: 'en', title: 'English Title', description: 'English Desc' },
          { language: 'pt', title: 'Portuguese Title', description: 'Portuguese Desc' }
        ]
      } as any;
      expect(getProjectData(project, 'title', 'en')).toBe('English Title');
      expect(getProjectData(project, 'description', 'pt')).toBe('Portuguese Desc');
    });

    it('should fallback to first translation if no language matches', () => {
      const project = {
        translations: [
          { language: 'en', title: 'English Title', description: 'English Desc' },
          { language: 'pt', title: 'Portuguese Title', description: 'Portuguese Desc' }
        ]
      } as any;
      expect(getProjectData(project, 'title', 'es')).toBe('English Title');
    });

    it('should return null if the field is not present in the translation', () => {
      const project = {
        translations: [
          { language: 'en' }
        ]
      } as any;
      expect(getProjectData(project, 'title', 'en')).toBeNull();
    });
  });
});
