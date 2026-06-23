import { useTranslation } from 'react-i18next';

import { getProjectData } from '@/helpers/projectHelpers';

import DeleteButton from '@/components/DeleteButton';
import EditButton from '@/components/EditButton';

interface ProjectCardProps {
  project: Project;
  onDelete: (id: string) => void;
}

export default function ProjectCard({ project, onDelete }: ProjectCardProps) {
  const { t, i18n } = useTranslation();

  const title = getProjectData(project, 'title', i18n.language) || t('projects.card.not_defined');

  return (
    <div className="bg-white shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100 p-3 flex flex-col group rounded-lg">

      <div className="relative w-full bg-gray-100 overflow-hidden mb-4 flex items-center justify-center aspect-[16/10]">
        {project.imageUrl ? (
          <img
            src={project.imageUrl}
            alt={t('projects.card.image_alt')}
            className="w-full h-full object-contain block group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="flex flex-col items-center justify-center w-full h-full text-gray-400">
            <span className="text-3xl mb-2">🖼️</span>
            <span className="text-sm">{t('projects.card.no_image')}</span>
          </div>
        )}

        <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <EditButton
            to={{ pathname: `/projects/edit/${project.id}` }}
            title={t('buttons.edit', { defaultValue: 'Editar' })}
          />

          <DeleteButton
            onDelete={() => onDelete(project.id!)}
            title={t('buttons.delete', { defaultValue: 'Excluir' })}
          />
        </div>
      </div>

      <h3 className="text-lg font-bold text-gray-900 mb-4 truncate" title={title}>
        {title}
      </h3>

      <div className="grid grid-cols-2 gap-3 mt-auto">
        {project.liveUrl ? (
          <a href={project.liveUrl} target="_blank" rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 transition-colors rounded-lg">
            🌐 {t('projects.card.live')}
          </a>
        ) : (
          <span className="flex items-center justify-center px-3 py-2 text-xs font-medium text-gray-400 bg-gray-100 cursor-not-allowed rounded-lg">
            {t('projects.card.offline')}
          </span>
        )}

        {project.repoUrl && (
          <a href={project.repoUrl} target="_blank" rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors rounded-lg">
            📦 {t('projects.card.repo')}
          </a>
        )}
      </div>

    </div>
  );
}
