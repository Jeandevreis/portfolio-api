export const getEducationData = (edu: Education, field: 'name' | 'institution', currentLanguage: string) => {
  if (!edu.translations || edu.translations.length === 0) return null;

  const localeData = edu.translations.find(t => t.language === currentLanguage);
  const translation = localeData ? localeData : edu.translations[0];

  return translation[field] || null;
};

export const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    'completed': 'bg-green-50 text-green-700 border-green-200',
    'in_progress': 'bg-blue-50 text-blue-700 border-blue-200',
    'paused': 'bg-yellow-50 text-yellow-700 border-yellow-200'
  };
  return colors[status] || 'bg-gray-50 text-gray-700 border-gray-200';
};

export const formatDate = (dateString?: string, locale: string = 'pt-BR') => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const userTimezoneOffset = date.getTimezoneOffset() * 60000;
  const correctedDate = new Date(date.getTime() + userTimezoneOffset);

  return correctedDate.toLocaleDateString(locale, { month: 'short', year: 'numeric' });
};
