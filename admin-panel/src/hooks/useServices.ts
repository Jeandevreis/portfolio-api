import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { ServiceService } from '@/services/serviceService';
import { UploadService } from '@/services/uploadService';

import { useImagePreview } from '@/hooks/useImagePreview';

import { z } from 'zod';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { serviceSchema } from '../../../src/schemas/services.schema';

type ServiceFormData = z.infer<typeof serviceSchema>;

const initialForm: ServiceFormData = {
  link: '',
  imageUrl: '',
  translations: [{ language: 'pt', title: '', description: '' }]
};

export function useServices(options?: { fetchList?: boolean; editId?: string }) {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(!!options?.fetchList || !!options?.editId);
  const [globalError, setGlobalError] = useState<string | null>(null);

  const {
    imagePreview,
    setImagePreview,
    selectedFile,
    setSelectedFile,
    handleFileChange
  } = useImagePreview();

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<ServiceFormData>({
    resolver: zodResolver(serviceSchema),
    defaultValues: initialForm
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'translations'
  });

  const loadServices = useCallback(async () => {
    setLoading(true);
    try {
      const data = await ServiceService.getAll();
      setServices(data);
    } catch (err: any) {
      setGlobalError(err.error ? t(err.error) : t('api.error.unknown'));
    } finally {
      setLoading(false);
    }
  }, [t]);

  const loadServiceForEdit = useCallback(async (id: string) => {
    setLoading(true);
    try {
      const data = await ServiceService.getById(id);

      const cleanTranslations = data.translations?.length
        ? data.translations.map((t: any) => ({
          language: t.language,
          title: t.title,
          description: t.description
        }))
        : initialForm.translations;

      reset({
        link: data.link ?? '',
        imageUrl: data.imageUrl ?? '',
        translations: cleanTranslations,
      });

      setImagePreview(data.imageUrl || null);
    } catch (err: any) {
      setGlobalError(err.error ? t(err.error) : t('api.error.unknown'));
    } finally {
      setLoading(false);
    }
  }, [reset, setImagePreview, t]);

  useEffect(() => {
    if (options?.fetchList) loadServices();
    if (options?.editId) loadServiceForEdit(options.editId);
  }, [options?.fetchList, options?.editId, loadServices, loadServiceForEdit]);

  const deleteService = async (id: string) => {
    if (!window.confirm(t('services.action.confirm_delete'))) return;
    try {
      await ServiceService.delete(id);
      setServices(prev => prev.filter(s => s.id !== id));
    } catch (err: any) {
      alert(err.error ? t(err.error) : t('api.error.unknown'));
    }
  };

  const processFormSubmit = async (data: ServiceFormData, id?: string) => {
    setGlobalError(null);
    console.log(data);
    try {
      let finalImageUrl = imagePreview || '';

      if (selectedFile) {
        const fileId = id || Date.now().toString();
        finalImageUrl = await UploadService.uploadImage(selectedFile, 'services', `srv-${fileId}`);
      }

      const payload = { ...data, imageUrl: finalImageUrl };

      if (id) {
        await ServiceService.update(id, payload);
      } else {
        await ServiceService.create(payload);
      }

      setSelectedFile(null);
      navigate('/services');
    } catch (err: any) {
      const errorKey = err.error;
      setGlobalError(errorKey ? t(errorKey) : t('api.error.unknown'));
    }
  };

  const createService = handleSubmit((data) => processFormSubmit(data));
  const updateService = (id: string) => handleSubmit((data) => processFormSubmit(data, id));

  return {
    services,
    loading,
    globalError,
    deleteService,
    createService,
    updateService,

    register,
    errors,
    isSubmitting,
    fields,
    appendTranslation: () => append({ language: 'en', title: '', description: '' }),
    removeTranslation: remove,

    imagePreview,
    handleFileChange
  };
}
