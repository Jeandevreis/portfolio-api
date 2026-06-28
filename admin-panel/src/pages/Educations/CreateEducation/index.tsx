import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { useEducations } from '@/hooks/useEducations';

import Header from '@/components/Header';
import EducationForm from '@/components/EducationForm';

export default function CreateEducation() {
  const { t } = useTranslation();

  const {
    imagePreview,
    isSubmitting,
    globalError,
    handleFileChange,
    register,
    errors,
    fields,
    appendTranslation,
    removeTranslation,
    createEducation
  } = useEducations();

  return (
    <>
      <Header />
      <div className="bg-gray-50 text-gray-800 min-h-screen flex flex-col">
        <div className="flex-1 px-16 py-8 w-full">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {t('educations.page.create.title', { defaultValue: 'New Education' })}
              </h1>
              <p className="text-sm text-gray-500">
                {t('educations.page.create.description', { defaultValue: 'Add a new course or degree to your resume' })}
              </p>
            </div>
            <Link to="/educations" className="text-sm text-gray-600 hover:text-blue-600 font-medium flex items-center gap-1 transition-colors">
              ← {t('educations.buttons.back_to_educations', { defaultValue: 'Back to educations' })}
            </Link>
          </div>

          <EducationForm
            register={register}
            errors={errors}
            fields={fields}
            appendTranslation={appendTranslation}
            removeTranslation={removeTranslation}
            imagePreview={imagePreview}
            isSubmitting={isSubmitting}
            globalError={globalError}
            handleFileChange={handleFileChange}
            onSubmitAction={createEducation}
            submitButtonText={t('educations.buttons.save_education', { defaultValue: 'Save Education' })}
          />
        </div>
      </div>
    </>
  );
}
