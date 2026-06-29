import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useProfile } from '@/hooks/useProfile';

import Header from '@/components/Header';
import Input from '@/components/Input';
import IconWrapper from '@/components/IconWrapper';
import ImageSelector from '@/components/ImageSelector';

export default function Profile() {
  const { t } = useTranslation();

  const {
    // Profile Form Hooks
    profileRegister, profileErrors, isSubmittingProfile, updateProfileSubmit, globalErrorProfile, successProfile,

    // Password Form Hooks
    passwordRegister, passwordErrors, isSubmittingPassword, updatePasswordSubmit, globalErrorPassword, successPassword,

    imagePreview, handleFileChange, loading
  } = useProfile();

  return (
    <div className="bg-gray-50 text-gray-800 min-h-screen flex flex-col">
      <Header />

      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <main className="flex-1 px-8 py-8 w-full space-y-8">

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{t('profile.title', { defaultValue: 'Meu Perfil' })}</h1>
              <p className="text-sm text-gray-500">{t('profile.description', { defaultValue: 'Gerencie suas informações cadastrais e segurança da conta.' })}</p>
            </div>
            <Link to="/panel" className="text-sm text-gray-600 hover:text-blue-600 font-medium flex items-center gap-1 transition-colors">
              ← {t('profile.back', { defaultValue: 'Voltar ao painel' })}
            </Link>
          </div>

          <form onSubmit={updateProfileSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 md:p-8 space-y-6">
              <h2 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-3">
                👤 {t('profile.sections.personal_info', { defaultValue: 'Informações Pessoais' })}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
                <div className="md:col-span-1 flex justify-center">
                  <ImageSelector imagePreview={imagePreview} onFileChange={handleFileChange} />
                </div>

                <div className="md:col-span-2 space-y-4">
                  <div>
                    <Input
                      id="name"
                      label={t('profile.labels.name', { defaultValue: 'Nome Completo' })}
                      type="text"
                      placeholder={t('profile.placeholders.name', { defaultValue: 'Seu nome completo' })}
                      {...profileRegister('name')}
                    >
                      <IconWrapper>📝</IconWrapper>
                    </Input>
                    {profileErrors.name?.message && (
                      <span className="text-red-500 text-xs">{t(profileErrors.name.message as string)}</span>
                    )}
                  </div>

                  <div>
                    <Input
                      id="email"
                      label={t('profile.labels.email', { defaultValue: 'E-mail de Acesso' })}
                      type="email"
                      placeholder={t('profile.placeholders.email', { defaultValue: 'seu.email@exemplo.com' })}
                      {...profileRegister('email')}
                    >
                      <IconWrapper>📧</IconWrapper>
                    </Input>
                    {profileErrors.email?.message && (
                      <span className="text-red-500 text-xs">{t(profileErrors.email.message as string)}</span>
                    )}
                  </div>
                </div>
              </div>

              {globalErrorProfile && <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded text-red-700 text-sm">{globalErrorProfile}</div>}
              {successProfile && <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded text-green-700 text-sm">{t('profile.messages.profile_success', { defaultValue: 'Perfil atualizado com sucesso!' })}</div>}
            </div>

            <div className="bg-gray-50 px-6 py-4 flex items-center justify-end border-t border-gray-200">
              <button
                type="submit"
                disabled={isSubmittingProfile}
                className="cursor-pointer inline-flex items-center px-6 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-all"
              >
                {isSubmittingProfile ? t('profile.buttons.saving', { defaultValue: 'Salvando...' }) : t('profile.buttons.save_profile', { defaultValue: 'Salvar Perfil' })}
              </button>
            </div>
          </form>

          <form onSubmit={updatePasswordSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 md:p-8 space-y-6">
              <h2 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-3">
                🔒 {t('profile.sections.security', { defaultValue: 'Segurança e Senha' })}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <Input
                    id="oldPassword"
                    label={t('profile.labels.old_password', { defaultValue: 'Senha Atual' })}
                    type="password"
                    placeholder="••••••••"
                    {...passwordRegister('oldPassword')}
                  >
                    <IconWrapper>🔑</IconWrapper>
                  </Input>
                  {passwordErrors.oldPassword?.message && (
                    <span className="text-red-500 text-xs">{t(passwordErrors.oldPassword.message as string)}</span>
                  )}
                </div>

                <div>
                  <Input
                    id="newPassword"
                    label={t('profile.labels.new_password', { defaultValue: 'Nova Senha' })}
                    type="password"
                    placeholder="••••••••"
                    {...passwordRegister('newPassword')}
                  >
                    <IconWrapper>✨</IconWrapper>
                  </Input>
                  {passwordErrors.newPassword?.message && (
                    <span className="text-red-500 text-xs">{t(passwordErrors.newPassword.message as string)}</span>
                  )}
                </div>

                <div>
                  <Input
                    id="confirmPassword"
                    label={t('profile.labels.confirm_password', { defaultValue: 'Confirmar Nova Senha' })}
                    type="password"
                    placeholder="••••••••"
                    {...passwordRegister('confirmPassword')}
                  >
                    <IconWrapper>✅</IconWrapper>
                  </Input>
                  {passwordErrors.confirmPassword?.message && (
                    <span className="text-red-500 text-xs">{t(passwordErrors.confirmPassword.message as string)}</span>
                  )}
                </div>
              </div>

              {globalErrorPassword && <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded text-red-700 text-sm">{globalErrorPassword}</div>}
              {successPassword && <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded text-green-700 text-sm">{t('profile.messages.password_success', { defaultValue: 'Senha alterada com sucesso!' })}</div>}
            </div>

            <div className="bg-gray-50 px-6 py-4 flex items-center justify-end border-t border-gray-200">
              <button
                type="submit"
                disabled={isSubmittingPassword}
                className="cursor-pointer inline-flex items-center px-6 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-all"
              >
                {isSubmittingPassword ? t('profile.buttons.updating', { defaultValue: 'Alterando...' }) : t('profile.buttons.update_password', { defaultValue: 'Atualizar Senha' })}
              </button>
            </div>
          </form>

        </main>
      )}
    </div>
  );
}
