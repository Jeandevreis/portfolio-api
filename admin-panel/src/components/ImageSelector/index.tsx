import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';

interface ImageSelectorProps {
  imagePreview: string | null;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function ImageSelector({ imagePreview, onFileChange }: ImageSelectorProps) {
  const { t } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-zinc-900 ml-1">
        {t('image_selector.label')}
      </label>
      <div
        onClick={() => fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-lg transition-colors p-4 flex flex-col items-center justify-center text-center cursor-pointer min-h-[200px] ${imagePreview ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:bg-gray-50'
          }`}
      >
        <input
          type="file"
          accept="image/*"
          onChange={onFileChange}
          ref={fileInputRef}
          className="hidden"
          data-testid="file-input"
        />

        {imagePreview ? (
          <div className="w-full h-full flex flex-col items-center">
            <img
              src={imagePreview}
              alt={t('image_selector.preview_alt')}
              className="max-h-40 rounded shadow-sm object-contain"
            />
            <p className="text-xs text-blue-600 mt-3 font-medium">
              {t('image_selector.click_to_change')}
            </p>
          </div>
        ) : (
          <div className="text-gray-500">
            <span className="text-4xl block mb-2">🖼️</span>
            <p className="mt-1 text-sm">{t('image_selector.click_to_upload')}</p>
            <p className="text-xs text-gray-400">{t('image_selector.file_limits')}</p>
          </div>
        )}
      </div>
    </div>
  );
}
