import { useTranslation } from 'react-i18next';

import { getEducationData, getStatusColor, formatDate } from '@/helpers/educationHelpers';
import EditButton from '../EditButton';
import DeleteButton from '../DeleteButton';

interface EducationCardProps {
  education: Education;
  onDelete: (id: string) => void;
}

export default function EducationCard({ education, onDelete }: EducationCardProps) {
  const { t, i18n } = useTranslation();

  const institutionName = getEducationData(education, 'institution', i18n.language) || t('educations.card.not_defined');
  const courseName = getEducationData(education, 'name', i18n.language) || t('educations.card.not_defined');

  return (
    <div className="bg-white shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100 p-3 flex flex-col group rounded-lg">

      <div className="relative w-full bg-gray-100 overflow-hidden mb-4 flex items-center
        justify-center aspect-16/10
      ">
        {education.imageUrl ? (
          <img src={education.imageUrl} alt={t('educations.alt_image', { defaultValue: 'Imagem da formação' }) + ` - ${courseName}`}
            className="w-full h-full object-contain block group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="flex flex-col items-center justify-center w-full h-full text-gray-400">
            <span className="text-3xl mb-2">🏫</span>
            <span className="text-sm">{t('educations.card.no_image')}</span>
          </div>
        )}

        <div className="absolute top-2 left-2 flex flex-col gap-1">
          <span className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider rounded bg-white/90 shadow-sm text-gray-700">
            {t(`educations.type.${education.type}`, { defaultValue: education.type })}
          </span>
        </div>

        <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <EditButton
            to={{ pathname: `/educations/edit/${education.id}` }}
            title={t('buttons.edit', { defaultValue: 'Editar' })}
          />

          <DeleteButton
            onDelete={() => onDelete(education.id!)}
            title={t('buttons.delete', { defaultValue: 'Excluir' })}
          />
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        <span className="text-xs font-semibold text-blue-600 mb-1 tracking-wide uppercase truncate">
          {institutionName}
        </span>

        <h3 className="text-lg font-bold text-gray-900 mb-2 leading-tight truncate" title={courseName}>
          {courseName}
        </h3>

        <div className="flex items-center gap-2 text-xs text-gray-500 mb-4 mt-1">
          <span className={`px-2 py-0.5 rounded-full font-medium border ${getStatusColor(education.status)}`}>
            {t(`educations.status.${education.status}`, { defaultValue: education.status })}
          </span>
          {education.durationHours && (
            <span className="flex items-center gap-1">
              ⏱️ {education.durationHours}h
            </span>
          )}
        </div>

        <div className="mt-auto pt-4 border-t border-gray-50 flex justify-between items-center gap-2">

          <div className="flex flex-col text-[10px] text-gray-500 leading-tight">
            <span>{formatDate(education.startDate, i18n.language)}</span>
            {education.endDate && <span>{formatDate(education.endDate, i18n.language)}</span>}
          </div>

          {education.certificateUrl ? (
            <a
              href={education.certificateUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-medium text-blue-600 bg-white border border-blue-200 hover:bg-blue-50 hover:border-blue-300 transition-colors rounded shadow-sm shrink-0"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
              {t('educations.card.certificate')}
            </a>
          ) : (
            <span className="text-[10px] text-gray-400 italic shrink-0">{t('educations.card.no_link')}</span>
          )}
        </div>
      </div>
    </div>
  );
}