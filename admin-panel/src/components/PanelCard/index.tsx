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

  const CardContent = () => (
    <>
      {bgIcon && !isDisabled && (
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity text-blue-600">
          {bgIcon}
        </div>
      )}

      <div className="relative z-10">
        <div className={`h-12 w-12 rounded-lg flex items-center justify-center mb-4 transition-colors ${isDisabled
          ? 'bg-gray-200 text-gray-400'
          : 'bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white'
          }`}>
          {icon}
        </div>

        <h2 className={`text-lg font-bold mb-1 ${isDisabled ? 'text-gray-500' : 'text-gray-900'}`}>
          {title}
        </h2>
        <p className={`text-sm ${isDisabled ? 'text-gray-400' : 'text-gray-500'}`}>
          {description}
        </p>

        {isDisabled && (
          <span className="absolute top-4 right-4 bg-gray-200 text-gray-500 text-xs px-2 py-1 rounded font-medium">
            {t('panel_card.soon')}
          </span>
        )}

        {type === 'internal' && (
          <div className="mt-4 text-sm font-medium flex items-center gap-1 group-hover:translate-x-1 transition-transform text-blue-600">
            {t('panel_card.access')} <span className="text-lg">→</span>
          </div>
        )}
      </div>
    </>
  );

  const baseClasses = `group p-6 rounded-xl border transition-all relative overflow-hidden ${isDisabled
    ? 'bg-gray-50 border-dashed border-gray-300 opacity-75 cursor-not-allowed'
    : 'bg-white border-gray-200 hover:shadow-md hover:border-blue-300 cursor-pointer'
    } ${className}`;

  if (type === 'internal') {
    return <Link to={url} className={baseClasses}><CardContent /></Link>;
  }

  if (type === 'external') {
    return <a href={url} target="_blank" rel="noreferrer" className={baseClasses}><CardContent /></a>;
  }

  return <div className={baseClasses}><CardContent /></div>;
}
