export const getProjectData = (project: Project, field: 'title' | 'description', currentLanguage: string) => {
  if (!project.translations || project.translations.length === 0) return null;

  const localeData = project.translations.find(t => t.language === currentLanguage);
  const translation = localeData ? localeData : project.translations[0];

  return translation[field] || null;
};