import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import { ServiceService } from '@/services/serviceService';
import { UploadService } from '@/services/uploadService';

import { useImagePreview } from '@/hooks/useImagePreview';

const initialForm: Service = {
  link: '',
  imageUrl: null,
  translations: [{ language: 'pt', title: '', description: '' }]
};

export function useServices(options?: { fetchList?: boolean; editId?: string }) {
  const navigate = useNavigate();

  const [services, setServices] = useState<Service[]>([]);
  const [form, setForm] = useState<Service>(initialForm);

  const {
    imagePreview,
    setImagePreview,
    selectedFile,
    setSelectedFile,
    handleFileChange
  } = useImagePreview();

  const [loading, setLoading] = useState(!!options?.fetchList || !!options?.editId);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadServices = useCallback(async () => {
    setLoading(true);
    try {
      const data = await ServiceService.getAll();
      console.log("buscando serviços");
      setServices(data);
    } catch (err: any) {
      setError(err.message || "Não foi possível carregar os serviços.");
    } finally {
      setLoading(false);
    }
  }, []);

  const loadServiceForEdit = useCallback(async (id: string) => {
    setLoading(true);
    try {
      const data = await ServiceService.getById(id);
      setForm({
        link: data.link ?? '',
        imageUrl: data.imageUrl ?? null,
        translations: data.translations ?? initialForm.translations,
      });
      setImagePreview(data.imageUrl || null);
    } catch (err: any) {
      setError(err.message || "Erro ao carregar dados.");
    } finally {
      setLoading(false);
    }
  }, [setImagePreview]);

  useEffect(() => {
    if (options?.fetchList) loadServices();
    if (options?.editId) loadServiceForEdit(options.editId);
  }, [options?.fetchList, options?.editId, loadServices, loadServiceForEdit]);

  const deleteService = async (id: string) => {
    if (!window.confirm("Tem certeza que deseja apagar este serviço?")) return;
    try {
      await ServiceService.delete(id);
      setServices(prev => prev.filter(s => s.id !== id));
    } catch (err: any) {
      alert(err.message || "Erro ao excluir.");
    }
  };

  const getPayload = (finalImageUrl?: string) => {
    if (!form.translations[0]?.title?.trim()) throw new Error('O título em Português é obrigatório.');

    return {
      link: form.link,
      translations: form.translations,
      imageUrl: finalImageUrl ?? undefined,
    };
  };

  const createService = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      let finalImageUrl = imagePreview || undefined;

      if (selectedFile) {
        finalImageUrl = await UploadService.uploadImage(selectedFile, 'services', `srv-${Date.now()}`);
      }

      await ServiceService.create(getPayload(finalImageUrl));

      setSelectedFile(null);
      navigate('/services');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const updateService = async (e: React.FormEvent<HTMLFormElement>, id: string) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      let finalImageUrl = imagePreview || undefined;

      if (selectedFile) {
        finalImageUrl = await UploadService.uploadImage(selectedFile, 'services', `srv-${id}`);
      }

      await ServiceService.update(id, getPayload(finalImageUrl));

      setSelectedFile(null);
      navigate('/services');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const updateTranslation = (index: number, field: keyof ServiceTranslation, value: string) => {
    const newTranslations = [...form.translations];
    newTranslations[index] = { ...newTranslations[index], [field]: value };
    setForm({ ...form, translations: newTranslations });
  };

  const addTranslation = () => {
    setForm({ ...form, translations: [...form.translations, { language: 'en', title: '', description: '' }] });
  };

  const removeTranslation = (index: number) => {
    setForm({ ...form, translations: form.translations.filter((_, i) => i !== index) });
  };

  return {
    services, form, setForm, imagePreview, selectedFile, loading, submitting, error,
    deleteService, createService, updateService,
    updateTranslation, addTranslation, removeTranslation, handleFileChange
  };
}
