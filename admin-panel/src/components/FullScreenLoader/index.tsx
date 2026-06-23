import { useTranslation } from 'react-i18next';

export default function FullScreenLoader() {
  const { t } = useTranslation();

  return (
    <div className="flex h-screen w-full items-center justify-center bg-gray-50">
      <div className="flex flex-col items-center gap-4">
        <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-blue-600"></div>
        <p className="text-sm text-gray-500">{t('loader.verifying_session')}</p>
      </div>
    </div>
  );
}