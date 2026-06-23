import React from 'react';
import { useTranslation } from 'react-i18next';

import Input from '@/components/Input';
import Select from '@/components/Select';
import ImageSelector from '@/components/ImageSelector';
import IconWrapper from '@/components/IconWrapper';

interface EducationFormProps {
  form: Education;
  setForm: React.Dispatch<React.SetStateAction<Education>>;
  imagePreview: string | null;
  submitting: boolean;
  error: string | null;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  updateTranslation: (index: number, field: keyof EducationTranslation, value: string) => void;
  addTranslation: () => void;
  removeTranslation: (index: number) => void;
  onSubmitAction: (e: React.FormEvent<HTMLFormElement>) => void;
}

export default function EducationForm({
  form, setForm, imagePreview, submitting, error,
  handleFileChange, updateTranslation, addTranslation, removeTranslation,
  onSubmitAction
}: EducationFormProps) {

  const { t } = useTranslation();
  const textAreaClass = "w-full px-4 py-3 rounded-lg text-sm transition-all duration-300 bg-zinc-50 border border-zinc-200 text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900";

  return (
    <form onSubmit={onSubmitAction} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-6 md:p-8 space-y-8">

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <ImageSelector imagePreview={imagePreview} onFileChange={handleFileChange} />

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Select
                label={t('educations.form.labels.type')}
                value={form.type}
                onChange={e => setForm({ ...form, type: e.target.value })}
                options={['college', 'course', 'certification', 'bootcamp']}
                translationGroup="educations.type"
                required
              />

              <Select
                label={t('educations.form.labels.status')}
                value={form.status}
                onChange={e => setForm({ ...form, status: e.target.value })}
                options={['completed', 'in_progress', 'paused']}
                translationGroup="educations.status"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input
                id="startDate"
                name="startDate"
                label={t('educations.form.labels.startDate')}
                type="date"
                value={form.startDate || ''}
                onChange={e => setForm({ ...form, startDate: e.target.value })}
                placeholder=""
                required
              >
                <IconWrapper>📅</IconWrapper>
              </Input>

              <Input
                id="endDate"
                name="endDate"
                label={t('educations.form.labels.endDate')}
                type="date"
                value={form.endDate || ''}
                onChange={e => setForm({ ...form, endDate: e.target.value })}
                placeholder=""
              >
                <IconWrapper>📅</IconWrapper>
              </Input>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input
                id="durationHours"
                name="durationHours"
                type="number"
                label={t('educations.form.labels.durationHours')}
                placeholder={t('educations.form.placeholders.durationHours')}
                value={form.durationHours?.toString() || ''}
                onChange={e => setForm({ ...form, durationHours: e.target.value })}
              >
                <IconWrapper>⏱️</IconWrapper>
              </Input>

              <Input
                id="certificateUrl"
                name="certificateUrl"
                label={t('educations.form.labels.certificateUrl')}
                type="url"
                placeholder={t('educations.form.placeholders.certificateUrl')}
                value={form.certificateUrl || ''}
                onChange={e => setForm({ ...form, certificateUrl: e.target.value })}
              >
                <IconWrapper>🔗</IconWrapper>
              </Input>
            </div>
          </div>
        </div>

        <hr className="border-gray-200" />

        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">{t('educations.form.titles.translations')}</h3>
            <button type="button" onClick={addTranslation} className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1">
              {t('educations.form.buttons.addLanguage')}
            </button>
          </div>

          <div className="space-y-6">
            {form.translations.map((tData, index) => (
              <div key={index} className="bg-zinc-50/50 p-5 rounded-lg border border-zinc-200 relative group">
                {index !== 0 && (
                  <button type="button" onClick={() => removeTranslation(index)} className="absolute top-4 right-4 text-zinc-400 hover:text-red-500 transition-colors">✕</button>
                )}

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="md:col-span-1">
                    <Select
                      label={t('educations.form.labels.language')}
                      value={tData.language}
                      onChange={(e) => updateTranslation(index, 'language', e.target.value)}
                      options={['pt', 'en', 'es']}
                      translationGroup="languages"
                      disabled={index === 0}
                    />
                  </div>

                  <div className="md:col-span-1">
                    <Input id={`institution-${index}`}
                      name="institution"
                      label={t('educations.form.labels.institution')}
                      value={tData.institution || ''}
                      onChange={(e) => updateTranslation(index, 'institution', e.target.value)}
                      placeholder={t('educations.form.placeholders.institution')}
                      required
                    >
                      <IconWrapper>🏛️</IconWrapper>
                    </Input>
                  </div>

                  <div className="md:col-span-2">
                    <Input
                      id={`name-${index}`}
                      name="name"
                      label={t('educations.form.labels.name')}
                      value={tData.name || ''}
                      onChange={(e) => updateTranslation(index, 'name', e.target.value)}
                      placeholder={t('educations.form.placeholders.name')}
                      required
                    >
                      <IconWrapper>🎓</IconWrapper>
                    </Input>
                  </div>

                  <div className="md:col-span-4 mt-2 flex flex-col gap-2">
                    <label className="ml-1 text-xs font-semibold text-zinc-500 uppercase tracking-wide">{t('educations.form.labels.description')}</label>
                    <textarea
                      value={tData.description || ''}
                      onChange={(e) => updateTranslation(index, 'description', e.target.value)}
                      rows={3}
                      placeholder={t('educations.form.placeholders.description')}
                      required
                      className={textAreaClass}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {error && <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded text-red-700 text-sm">{error}</div>}
      </div>

      <div className="bg-gray-50 px-6 py-4 flex items-center justify-end border-t border-gray-200">
        <button type="submit" disabled={submitting} className="cursor-pointer inline-flex items-center px-6 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-all">
          {submitting ? t('educations.form.buttons.saving') : t('educations.form.buttons.save')}
        </button>
      </div>
    </form>
  );
}