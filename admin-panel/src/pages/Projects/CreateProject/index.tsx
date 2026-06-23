import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { useProjects } from '@/hooks/useProjects';

import Header from '@/components/Header';
import ProjectForm from '@/components/ProjectForm';

export default function CreateProject() {
  const { t } = useTranslation();

  const {
    form, setForm, imagePreview, submitting, error,
    handleFileChange, updateTranslation, addTranslation, removeTranslation,
    createProject
  } = useProjects();

  return (
    <div className="bg-gray-50 text-gray-800 min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 px-8 py-8 w-full">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{t('projects.create.title')}</h1>
            <p className="text-sm text-gray-500">{t('projects.create.description')}</p>
          </div>
          <Link to="/projects" className="text-sm text-gray-600 hover:text-blue-600 font-medium flex items-center gap-1 transition-colors">
            ← {t('projects.create.back')}
          </Link>
        </div>

        <ProjectForm
          form={form}
          setForm={setForm}
          imagePreview={imagePreview}
          submitting={submitting}
          error={error}
          handleFileChange={handleFileChange}
          updateTranslation={updateTranslation}
          addTranslation={addTranslation}
          removeTranslation={removeTranslation}
          onSubmitAction={createProject}
          submitButtonText={t('projects.form.buttons.save')}
        />
      </main>
    </div>
  );
}