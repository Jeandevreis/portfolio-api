import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { useServices } from '@/hooks/useServices';

import Header from '@/components/Header';
import ServiceForm from '@/components/ServiceForm';

export default function EditService() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();

  const {
    loading,
    globalError,
    updateService,
    register,
    errors,
    isSubmitting,
    fields,
    appendTranslation,
    removeTranslation,
    imagePreview,
    handleFileChange
  } = useServices({ editId: id });

  return (
    <div className="bg-gray-50 text-gray-800 min-h-screen flex flex-col">
      <Header />

      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <main className="flex-1 px-8 py-8 w-full">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {t('services.page.edit.title', { defaultValue: 'Edit Service' })}
              </h1>
              <p className="text-sm text-gray-500">
                {t('services.page.edit.description', { defaultValue: 'Update the information for the selected service.' })}
              </p>
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
            onSubmitAction={updateService(id as string)}
            submitButtonText={t('services.buttons.save_service', { defaultValue: 'Save Service' })}
          />
        </main>
      )}
    </div>
  );
}
