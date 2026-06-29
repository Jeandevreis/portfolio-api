import { useTranslation } from 'react-i18next';
import type { UseFormRegister, UseFormHandleSubmit, SubmitHandler, FieldErrors } from 'react-hook-form';

import Input from '../Input';
import ErrorAlert from '../ErrorAlert';

export interface LoginFormInputs {
  email: string;
  password: string;
}

interface LoginFormProps {
  register: UseFormRegister<LoginFormInputs>;
  handleSubmit: UseFormHandleSubmit<LoginFormInputs>;
  errors: FieldErrors<LoginFormInputs>;
  onSubmit: SubmitHandler<LoginFormInputs>;
  globalError: string | null;
  isSubmitting: boolean;
}

export default function LoginForm({
  register,
  handleSubmit,
  errors,
  onSubmit,
  globalError, isSubmitting
}: LoginFormProps) {

  const { t } = useTranslation();

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {globalError && <ErrorAlert message={globalError} />}

      <div>
        <Input
          id="email"
          label={t('login.labels.email', { defaultValue: 'Email' })}
          type="email"
          placeholder={t('login.placeholders.email', { defaultValue: 'admin@example.com' })}
          {...register('email')}
        >
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-zinc-400 dark:text-zinc-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
            </svg>
          </div>
        </Input>
        {errors.email?.message && (
          <span className="text-red-500 text-xs mt-1 block">{t(errors.email.message as string)}</span>
        )}
      </div>

      <div>
        <Input
          id="password"
          label={t('login.labels.password', { defaultValue: 'Password' })}
          type="password"
          placeholder={t('login.placeholders.password', { defaultValue: '••••••••' })}
          {...register('password')}
        >
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-zinc-400 dark:text-zinc-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
        </Input>
        {errors.password?.message && (
          <span className="text-red-500 text-xs mt-1 block">{t(errors.password.message as string)}</span>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-4 flex w-full justify-center rounded-lg border border-transparent bg-blue-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-wait disabled:opacity-70"
      >
        {isSubmitting && (
          <svg className="-ml-1 mr-2 h-4 w-4 animate-spin text-white" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        )}
        {isSubmitting
          ?
          `${t('login.buttons.signign_in', { defaultValue: 'Signing in' })}`
          :
          `${t('login.buttons.access_panel', { defaultValue: 'Access Panel' })}`}
      </button>
    </form>
  );
}
