import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useForm, type SubmitHandler } from 'react-hook-form';

import { useAuth } from '@/contexts/AuthContext';

import { z } from 'zod';
import { loginSchema } from '../../../../src/schemas/auth.schema';
import { zodResolver } from '@hookform/resolvers/zod';

import FullScreenLoader from '@/components/FullScreenLoader';
import WelcomePanel from '@/components/WelcomePanel';
import LoginForm from '@/components/LoginForm';

type LoginFormData = z.infer<typeof loginSchema>;

export default function Login() {
  const { checkingAuth, isAuthenticated, login } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [globalError, setGlobalError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' }
  });

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/panel', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const onSubmit: SubmitHandler<LoginFormData> = async (data: LoginFormData) => {
    setGlobalError(null);
    try {
      await login(data.email, data.password);

    } catch (err: any) {

      const errorKey = err.error || err.message;
      setGlobalError(errorKey ? t(errorKey) : t('api.error.unknown'));
    }
  };

  if (checkingAuth) return <FullScreenLoader />;

  return (
    <div className="flex h-screen w-full flex-col overflow-hidden bg-white md:flex-row">
      <WelcomePanel />

      <div className="flex h-full w-full flex-1 items-center justify-center p-6 md:w-1/2">
        <div className="w-full max-w-sm">
          <div className="mb-8 text-center md:hidden">
            <h2 className="text-2xl font-bold text-gray-900">{t('login.titles.admin_access', { defaultValue: 'Admin Access' })}</h2>
            <p className="text-sm text-gray-500">{t('login.titles.panel_subtitle', { defaultValue: 'Access to the admin panel' })}</p>
          </div>
          <div className="hidden md:block mb-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900">{t('login.titles.sign_in', { defaultValue: 'Sign In' })}</h2>
            <p className="text-sm text-gray-500">{t('login.titles.credentials_subtitle', { defaultValue: 'Enter your credentials to access the admin panel' })}</p>
          </div>

          <LoginForm
            register={register}
            handleSubmit={handleSubmit}
            errors={errors}
            onSubmit={onSubmit}
            globalError={globalError}
            isSubmitting={isSubmitting}
          />

        </div>
      </div>
    </div>
  );
}
