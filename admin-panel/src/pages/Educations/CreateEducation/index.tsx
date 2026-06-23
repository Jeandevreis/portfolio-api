import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { useEducations } from '@/hooks/useEducations';

import Header from '@/components/Header';
import EducationForm from '@/components/EducationForm';

export default function CreateEducation() {
  const { t } = useTranslation();

  const {
    form, setForm, imagePreview, submitting, error,
    handleFileChange, updateTranslation, addTranslation, removeTranslation,
    createEducation
  } = useEducations();

  return (
    <>
      <Header />
      <div className="bg-gray-50 text-gray-800 min-h-screen flex flex-col">
        <div className="flex-1 px-16 py-8 w-full">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{t('educations.create.title')}</h1>
              <p className="text-sm text-gray-500">{t('educations.create.description')}</p>
            </div>
            <Link to="/educations" className="text-sm text-gray-600 hover:text-blue-600 font-medium flex items-center gap-1 transition-colors">
              {t('educations.create.back')}
            </Link>
          </div>

          <EducationForm
            form={form}
            setForm={setForm}
            imagePreview={imagePreview}
            submitting={submitting}
            error={error}
            handleFileChange={handleFileChange}
            updateTranslation={updateTranslation}
            addTranslation={addTranslation}
            removeTranslation={removeTranslation}
            onSubmitAction={createEducation}
          />
        </div>
      </div>
    </>
  );
}
