import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { useProjects } from '@/hooks/useProjects';

import Header from '@/components/Header';
import ProjectForm from '@/components/ProjectForm';

export default function CreateProject() {
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
    createProject
  } = useProjects();

  return (
    <div className="bg-gray-50 text-gray-800 min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 px-8 py-8 w-full">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {t('projects.page.create.title', { defaultValue: 'New Project' })}
            </h1>
            <p className="text-sm text-gray-500">
              {t('projects.page.create.description', { defaultValue: 'Add a new project to your portfolio.' })}
            </p>
          </div>
          <Link to="/projects" className="text-sm text-gray-600 hover:text-blue-600 font-medium flex items-center gap-1 transition-colors">
            ← {t('projects.buttons.back_to_projects', { defaultValue: 'Back to list' })}
          </Link>
        </div>

        <ProjectForm
          register={register}
          errors={errors}
          fields={fields}
          appendTranslation={appendTranslation}
          removeTranslation={removeTranslation}
          imagePreview={imagePreview}
          isSubmitting={isSubmitting}
          globalError={globalError}
          handleFileChange={handleFileChange}
          onSubmitAction={createProject}
          submitButtonText={t('projects.buttons.save_project', { defaultValue: 'Save Project' })}
        />
      </main>
    </div>
  );
}
