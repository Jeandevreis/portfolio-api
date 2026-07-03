import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

interface PanelCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  bgIcon?: React.ReactNode;
  type: 'internal' | 'external' | 'disabled';
  url?: string;
  className?: string;
}

export default function PanelCard({
  title,
  description,
  icon,
  bgIcon,
  type,
  url = '#',
  className = ''
}: PanelCardProps) {
  const { t } = useTranslation();
  const isDisabled = type === 'disabled';

  // Transformado de função/componente para uma variável simples guardando JSX
  const cardContent = (
    <>
      {bgIcon && !isDisabled && (
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity text-blue-600 dark:text-blue-500">
          {bgIcon}
        </div>
      )}

      <div className="relative z-10">
        <div className={`h-12 w-12 rounded-lg flex items-center justify-center mb-4 transition-colors ${isDisabled
          ? 'bg-gray-200 dark:bg-zinc-700 text-gray-400 dark:text-zinc-500'
          : 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 group-hover:bg-blue-600 group-hover:text-white'
          }`}>
          {icon}
        </div>

        <h2 className={`text-lg font-bold mb-1 ${isDisabled ? 'text-gray-500 dark:text-zinc-500' : 'text-gray-900 dark:text-zinc-50'}`}>
          {title}
        </h2>
        <p className={`text-sm ${isDisabled ? 'text-gray-400 dark:text-zinc-600' : 'text-gray-500 dark:text-zinc-400'}`}>
          {description}
        </p>

        {isDisabled && (
          <span className="absolute top-4 right-4 bg-gray-200 dark:bg-zinc-700 text-gray-500 dark:text-zinc-400 text-xs px-2 py-1 rounded font-medium">
            {t('panel_card.soon')}
          </span>
        )}

        {type === 'internal' && (
          <div className="mt-4 text-sm font-medium flex items-center gap-1 group-hover:translate-x-1 transition-transform text-blue-600 dark:text-blue-400">
            {t('panel_card.access')} <span className="text-lg">→</span>
          </div>
        )}
      </div>
    </>
  );

  const baseClasses = `group p-6 rounded-xl border transition-all relative overflow-hidden ${isDisabled
    ? 'bg-gray-50 dark:bg-zinc-900/50 border-dashed border-gray-300 dark:border-zinc-800 opacity-75 cursor-not-allowed'
    : 'bg-white dark:bg-zinc-800 border-gray-200 dark:border-zinc-700 hover:shadow-md hover:border-blue-300 dark:hover:border-blue-700 cursor-pointer'
    } ${className}`;

  // Usando a variável entre chaves em vez de chamar como componente
  if (type === 'internal') {
    return <Link to={url} className={baseClasses}>{cardContent}</Link>;
  }

  if (type === 'external') {
    return <a href={url} target="_blank" rel="noreferrer" className={baseClasses}>{cardContent}</a>;
  }

  return <div className={baseClasses}>{cardContent}</div>;
}
