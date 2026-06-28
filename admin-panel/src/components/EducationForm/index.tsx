import React from 'react';
import { useTranslation } from 'react-i18next';
import type { UseFormRegister, FieldErrors, FieldArrayWithId } from 'react-hook-form';

import Input from '@/components/Input';
import Select from '@/components/Select';
import ImageSelector from '@/components/ImageSelector';
import IconWrapper from '@/components/IconWrapper';

import { z } from 'zod';
import { educationSchema } from '../../../../src/schemas/educations.schema'; // Ajuste o caminho se necessário

type EducationFormData = z.infer<typeof educationSchema>;

interface EducationFormProps {
  register: UseFormRegister<EducationFormData>;
  errors: FieldErrors<EducationFormData>;
  fields: FieldArrayWithId<EducationFormData, "translations", "id">[];
  appendTranslation: () => void;
  removeTranslation: (index: number) => void;

  imagePreview: string | null;
  isSubmitting: boolean;
  globalError: string | null;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmitAction: (e: React.FormEvent<HTMLFormElement>) => void;
  submitButtonText: string;
}

export default function EducationForm({
  register, errors, fields, appendTranslation, removeTranslation,
  imagePreview, isSubmitting, globalError,
  handleFileChange, onSubmitAction, submitButtonText
}: EducationFormProps) {

  const { t } = useTranslation();

  const getTextAreaClass = (hasError: boolean) =>
    `w-full px-4 py-3 rounded-lg text-sm transition-all duration-300 bg-zinc-50 border text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 ${hasError ? 'border-red-500 bg-red-50' : 'border-zinc-200'}`;

  return (
    <form onSubmit={onSubmitAction} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-6 md:p-8 space-y-8">

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <ImageSelector imagePreview={imagePreview} onFileChange={handleFileChange} />

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Select
                  id="type"
                  label={t('educations.form.labels.type', { defaultValue: 'Type' })}
                  options={['college', 'course', 'certification', 'bootcamp']}
                  translationGroup="educations.type"
                  {...register('type')}
                />
                {errors.type?.message && (
                  <span className="text-red-500 text-xs">{t(errors.type.message as string)}</span>
                )}
              </div>

              <div>
                <Select
                  id="status"
                  label={t('educations.form.labels.status', { defaultValue: 'Status' })}
                  options={['completed', 'in_progress', 'paused']}
                  translationGroup="educations.status"
                  {...register('status')}
                />
                {errors.status?.message && (
                  <span className="text-red-500 text-xs">{t(errors.status.message as string)}</span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Input
                  id="startDate"
                  label={t('educations.form.labels.startDate', { defaultValue: 'Start Date' })}
                  type="date"
                  placeholder=""
                  {...register('startDate')}
                >
                  <IconWrapper>📅</IconWrapper>
                </Input>
                {errors.startDate?.message && (
                  <span className="text-red-500 text-xs">{t(errors.startDate.message as string)}</span>
                )}
              </div>

              <div>
                <Input
                  id="endDate"
                  label={t('educations.form.labels.endDate', { defaultValue: 'End Date' })}
                  type="date"
                  placeholder=""
                  {...register('endDate')}
                >
                  <IconWrapper>📅</IconWrapper>
                </Input>
                {errors.endDate?.message && (
                  <span className="text-red-500 text-xs">{t(errors.endDate.message as string)}</span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Input
                  id="durationHours"
                  type="number"
                  label={t('educations.form.labels.duration', { defaultValue: 'Duration (Hours)' })}
                  placeholder={t('educations.form.placeholders.duration', { defaultValue: 'Ex: 120' })}
                  {...register('durationHours')}
                >
                  <IconWrapper>⏱️</IconWrapper>
                </Input>
                {errors.durationHours?.message && (
                  <span className="text-red-500 text-xs">{t(errors.durationHours.message as string)}</span>
                )}
              </div>

              <div>
                <Input
                  id="certificateUrl"
                  label={t('educations.form.labels.certificate_url', { defaultValue: 'Certificate URL' })}
                  type="url"
                  placeholder={t('educations.form.placeholders.certificate_url', { defaultValue: 'https://...' })}
                  {...register('certificateUrl')}
                >
                  <IconWrapper>🔗</IconWrapper>
                </Input>
                {errors.certificateUrl?.message && (
                  <span className="text-red-500 text-xs">{t(errors.certificateUrl.message as string)}</span>
                )}
              </div>
            </div>
          </div>
        </div>

        <hr className="border-gray-200" />

        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">{t('educations.form.titles.translations', { defaultValue: 'Content & Translations' })}</h3>
            <button type="button" onClick={appendTranslation} className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1">
              {t('buttons.add_language', { defaultValue: '+ Add Language' })}
            </button>
          </div>

          <div className="space-y-6">
            {fields.map((field, index) => {
              const fieldErrors = errors.translations?.[index];

              return (
                <div key={field.id} className="bg-zinc-50/50 p-5 rounded-lg border border-zinc-200 relative group">
                  {index !== 0 && (
                    <button
                      type="button"
                      onClick={() => removeTranslation(index)}
                      aria-label={t('buttons.delete', { defaultValue: 'Delete' })}
                      title={t('buttons.delete', { defaultValue: 'Delete' })}
                      className="absolute top-4 right-4 text-zinc-400 hover:text-red-500 transition-colors"
                    >
                      ✕
                    </button>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="md:col-span-1">
                      <Select
                        id={`language-${index}`}
                        label={t('educations.form.labels.language', { defaultValue: 'Language' })}
                        options={['pt', 'en', 'es']}
                        translationGroup="languages"
                        disabled={index === 0}
                        {...register(`translations.${index}.language` as const)}
                      />
                      {fieldErrors?.language?.message && (
                        <span className="text-red-500 text-xs">{t(fieldErrors.language.message as string)}</span>
                      )}
                    </div>

                    <div className="md:col-span-1">
                      <Input
                        id={`institution-${index}`}
                        label={t('educations.form.labels.institution', { defaultValue: 'Institution' })}
                        placeholder={t('educations.form.placeholders.institution', { defaultValue: 'Ex: Harvard' })}
                        {...register(`translations.${index}.institution` as const)}
                      >
                        <IconWrapper>🏛️</IconWrapper>
                      </Input>
                      {fieldErrors?.institution?.message && (
                        <span className="text-red-500 text-xs">{t(fieldErrors.institution.message as string)}</span>
                      )}
                    </div>

                    <div className="md:col-span-2">
                      <Input
                        id={`name-${index}`}
                        label={t('educations.form.labels.course_name', { defaultValue: 'Course Name' })}
                        placeholder={t('educations.form.placeholders.course_name', { defaultValue: 'Ex: Computer Science' })}
                        {...register(`translations.${index}.name` as const)}
                      >
                        <IconWrapper>🎓</IconWrapper>
                      </Input>
                      {fieldErrors?.name?.message && (
                        <span className="text-red-500 text-xs">{t(fieldErrors.name.message as string)}</span>
                      )}
                    </div>

                    <div className="md:col-span-4 mt-2 flex flex-col gap-2">
                      <label className="ml-1 text-sm font-semibold text-zinc-900 transition-colors duration-300">
                        {t('educations.form.labels.description', { defaultValue: 'Description' })}
                      </label>
                      <textarea
                        rows={3}
                        placeholder={t('educations.form.placeholders.description', { defaultValue: 'Describe what you learned, projects...' })}
                        className={getTextAreaClass(!!fieldErrors?.description)}
                        {...register(`translations.${index}.description` as const)}
                      />
                      {fieldErrors?.description?.message && (
                        <span className="text-red-500 text-xs">{t(fieldErrors.description.message as string)}</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {globalError && <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded text-red-700 text-sm">{globalError}</div>}
      </div>

      <div className="bg-gray-50 px-6 py-4 flex items-center justify-end border-t border-gray-200">
        <button
          type="submit"
          disabled={isSubmitting}
          className="cursor-pointer inline-flex items-center px-6 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-all"
        >
          {isSubmitting ? t('buttons.saving', { defaultValue: 'Saving...' }) : submitButtonText}
        </button>
      </div>
    </form>
  );
}