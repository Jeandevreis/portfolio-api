import React from 'react';
import { useTranslation } from 'react-i18next';
import type { UseFormRegister, FieldErrors, FieldArrayWithId } from 'react-hook-form';

import Input from '@/components/Input';
import Select from '@/components/Select';
import IconWrapper from '@/components/IconWrapper';
import ImageSelector from '@/components/ImageSelector';

import { z } from 'zod';
import { serviceSchema } from '../../../../src/schemas/services.schema';

type ServiceFormData = z.infer<typeof serviceSchema>;

interface ServiceFormProps {
  register: UseFormRegister<ServiceFormData>;
  errors: FieldErrors<ServiceFormData>;
  fields: FieldArrayWithId<ServiceFormData, "translations", "id">[];
  appendTranslation: () => void;
  removeTranslation: (index: number) => void;

  imagePreview: string | null;
  isSubmitting: boolean;
  globalError: string | null;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmitAction: (e: React.FormEvent<HTMLFormElement>) => void;
  submitButtonText: string;
}

export default function ServiceForm({
  register, errors, fields, appendTranslation, removeTranslation,
  imagePreview, isSubmitting, globalError,
  handleFileChange, onSubmitAction, submitButtonText
}: ServiceFormProps) {

  const { t } = useTranslation();

  const getTextAreaClass = (hasError: boolean) =>
    `w-full px-4 py-3 rounded-lg text-sm transition-all duration-300 bg-zinc-50 border text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 ${hasError ? 'border-red-500 bg-red-50' : 'border-zinc-200'}`;

  return (
    <form onSubmit={onSubmitAction} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-6 md:p-8 space-y-8">

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <ImageSelector imagePreview={imagePreview} onFileChange={handleFileChange} />

          <div className="space-y-4 flex flex-col justify-center">
            <Input
              id="link"
              label={t('services.form.labels.link', { defaultValue: 'Service Link' })}
              type="url"
              placeholder={t('services.form.placeholders.link', { defaultValue: 'https://exemplo.com/servico' })}
              {...register('link')}
            >
              <IconWrapper>🔗</IconWrapper>
            </Input>
            {errors.link?.message && (
              <span className="text-red-500 text-xs">{t(errors.link.message as string)}</span>
            )}

            <p className="text-xs text-zinc-400 mt-2 italic">
              {t('services.form.labels.info_link', { defaultValue: '* Optional: Insert a link to the service for more information.' })}
            </p>
          </div>
        </div>

        <hr className="border-gray-200" />

        <div>
          <div className="flex items-center justify-between mb-4">

            <h3 className="text-lg font-medium text-gray-900">
              {t('services.form.titles.translations', { defaultValue: 'Translations & Content' })}
            </h3>

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
                    <button type="button" onClick={() => removeTranslation(index)} className="absolute top-4 right-4 text-zinc-400 hover:text-red-500 transition-colors">✕</button>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="md:col-span-1">
                      <Select
                        id={`language-${index}`}
                        label={t('services.form.labels.language', { defaultValue: 'Language' })}
                        options={['pt', 'en', 'es']}
                        translationGroup="languages"
                        disabled={index === 0}
                        {...register(`translations.${index}.language` as const)}
                      />
                      {fieldErrors?.language?.message && (
                        <span className="text-red-500 text-xs">{t(fieldErrors.language.message as string)}</span>
                      )}
                    </div>

                    <div className="md:col-span-3">
                      <Input
                        id={`title-${index}`}
                        label={t('services.form.labels.title', { defaultValue: 'Service Title' })}
                        placeholder={t('services.form.placeholders.title', { defaultValue: 'Ex: Web Design' })}
                        {...register(`translations.${index}.title` as const)}
                      >
                        <IconWrapper>🛠️</IconWrapper>
                      </Input>
                      {fieldErrors?.title?.message && (
                        <span className="text-red-500 text-xs">{t(fieldErrors.title.message as string)}</span>
                      )}
                    </div>

                    <div className="md:col-span-4 mt-2 flex flex-col gap-2">
                      <label className="ml-1 text-sm font-semibold text-zinc-900 transition-colors duration-300">
                        {t('services.form.labels.description', { defaultValue: 'Service Description' })}
                      </label>
                      <textarea
                        rows={4}
                        placeholder={t('services.form.placeholders.description', { defaultValue: 'Describe the service...' })}
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
