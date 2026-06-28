import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { useServices } from '@/hooks/useServices';

import Header from '@/components/Header';
import ServiceForm from '@/components/ServiceForm';

export default function CreateService() {
  const { t } = useTranslation();

  const {
    imagePreview, handleFileChange,
    isSubmitting, globalError,
    createService,
    register, errors, fields, appendTranslation, removeTranslation
  } = useServices();

  return (
    <div className="bg-gray-50 text-gray-800 min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 px-8 py-8 w-full">
        <div className="flex items-center justify-between mb-8">
          <div>

            <h1 className="text-2xl font-bold text-gray-900">
              {t('services.page.create.title', { defaultValue: 'Create new service' })}
            </h1>

            <h2 className="text-sm text-gray-500">
              {t('services.page.create.description', { defaultValue: 'Create a new service to be displayed on the website.' })}
            </h2>

          </div>
          <Link to="/services" className="text-sm text-gray-600 hover:text-blue-600 font-medium flex items-center gap-1 transition-colors">
            ← {t('services.buttons.back_to_services', { defaultValue: 'Back to services' })}
          </Link>
        </div>

        <ServiceForm
          register={register}
          errors={errors}
          fields={fields}
          appendTranslation={appendTranslation}
          removeTranslation={removeTranslation}
          imagePreview={imagePreview}
          isSubmitting={isSubmitting}
          globalError={globalError}
          handleFileChange={handleFileChange}
          onSubmitAction={createService}
          submitButtonText={t('services.buttons.save_service', { defaultValue: 'Save service' })}
        />
      </main>
    </div>
  );
}
