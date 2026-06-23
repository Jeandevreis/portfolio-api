import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import { ProjectService } from '@/services/projectService';

const initialForm: Project = {
  liveUrl: '',
  repoUrl: '',
  translations: [{ language: 'pt', title: '', description: '' }]
};

export function useProjects(options?: { fetchList?: boolean; editId?: string }) {
  const navigate = useNavigate();

  const [projects, setProjects] = useState<Project[]>([]);
  const [form, setForm] = useState<Project>(initialForm);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [loading, setLoading] = useState(!!options?.fetchList || !!options?.editId);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadProjects = useCallback(async () => {
    setLoading(true);
    try {
      const data = await ProjectService.getAll();
      console.log("buscando projetos");
      setProjects(data);
    } catch (err: any) {
      setError(err.message || "Não foi possível carregar os projetos.");
    } finally {
      setLoading(false);
    }
  }, []);

  const loadProjectForEdit = useCallback(async (id: string) => {
    setLoading(true);
    try {
      const data = await ProjectService.getById(id);
      setForm({
        ...initialForm,
        ...data,
      });
      setImagePreview(data.imageUrl || null);
    } catch (err: any) {
      setError(err.message || "Erro ao carregar dados.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (options?.fetchList) loadProjects();
    if (options?.editId) loadProjectForEdit(options.editId);
  }, [options?.fetchList, options?.editId, loadProjects, loadProjectForEdit]);

  const deleteProject = async (id: string) => {
    if (!window.confirm("Tem certeza que deseja apagar este projeto?")) return;
    try {
      await ProjectService.delete(id);
      setProjects(prev => prev.filter(p => p.id !== id));
    } catch (err: any) {
      alert(err.message || "Erro ao excluir.");
    }
  };

  const getPayload = () => {
    if (!form.translations[0]?.title?.trim()) throw new Error('O título em Português é obrigatório.');

    return {
      liveUrl: form.liveUrl,
      repoUrl: form.repoUrl,
      translations: form.translations,
      imageUrl: imagePreview ?? undefined,
    };
  };

  const createProject = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await ProjectService.create(getPayload());
      navigate('/projects');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const updateProject = async (e: React.FormEvent<HTMLFormElement>, id: string) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await ProjectService.update(id, getPayload());
      navigate('/projects');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const updateTranslation = (index: number, field: keyof ProjectTranslation, value: string) => {
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setImagePreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  return {
    projects, form, setForm, imagePreview, selectedFile, loading, submitting, error,
    deleteProject, createProject, updateProject,
    updateTranslation, addTranslation, removeTranslation, handleFileChange
  };
}