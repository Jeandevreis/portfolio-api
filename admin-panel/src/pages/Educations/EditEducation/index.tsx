import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { useEducations } from '@/hooks/useEducations';

import Header from '@/components/Header';
import EducationForm from '@/components/EducationForm';

export default function EditEducation() {
  const { t } = useTranslation();

  const { id } = useParams<{ id: string }>();
  const {
    form, setForm, imagePreview, submitting, error, loading,
    handleFileChange, updateTranslation, addTranslation, removeTranslation,
    updateEducation
  } = useEducations({ editId: id });

  return (
    <div className="bg-gray-50 text-gray-800 min-h-screen flex flex-col">
      <Header />

      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="flex-1 px-8 py-8 w-full">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{t('educations.edit.title')}</h1>
              <p className="text-sm text-gray-500">{t('educations.edit.description')}</p>
            </div>
            <Link to="/educations" className="text-sm text-gray-600 hover:text-blue-600 font-medium flex items-center gap-1 transition-colors">
              {t('educations.edit.back')}
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
            onSubmitAction={(e) => updateEducation(e, id as string)}
          />
        </div>
      )}
    </div>
  );
}
