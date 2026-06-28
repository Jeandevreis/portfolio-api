import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { useServices } from '@/hooks/useServices';

import Header from '@/components/Header';
import ServiceCard from '@/components/ServiceCard';

export default function Services() {
  const { t } = useTranslation();

  const {
    services,
    loading,
    globalError,
    deleteService,
  } = useServices({ fetchList: true });

  return (
    <div className="bg-gray-50 text-gray-800 min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 px-8 py-8 w-full">

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>

            <Link to="/panel" className="text-sm text-gray-500 hover:text-blue-600 mb-2 inline-flex items-center gap-1 transition-colors">
              ← {t('buttons.back_to_panel', { defaultValue: 'Back to panel' })}
            </Link>

            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <span className="text-2xl">🛠️</span> {t('services.page.list.title', { defaultValue: 'Services' })}
            </h1>

          </div>

          <Link
            to="/services/create"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 shadow-sm"
          >
            <span>➕ {t('services.buttons.new_service', { defaultValue: 'New service' })}</span>
          </Link>

        </div>

        {globalError && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 text-red-700 rounded-lg">
            <p className="font-bold">{t('services.list.error_title', { defaultValue: 'Error' })}</p>
            <p>{globalError}</p>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <>
            {services.length === 0 && !globalError ? (
              <div className="text-center py-20 bg-white shadow-sm border border-gray-100 rounded-lg">
                <div className="text-gray-400 text-5xl mb-4">📁</div>

                <h3 className="text-lg font-medium text-gray-900">
                  {t('services.page.list.empty_list_title', { defaultValue: 'No services found.' })}
                </h3>

                <p className="text-gray-500 mt-1">
                  {t('services.page.list.empty_list_description', { defaultValue: 'Register your first service to see it here.' })}
                </p>

              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                {services.map((service) => (
                  <ServiceCard
                    key={service.id}
                    service={service}
                    onDelete={deleteService}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
