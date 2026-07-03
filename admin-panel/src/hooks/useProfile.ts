import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslation } from 'react-i18next';

import { useAuth } from '@/contexts/AuthContext';
import { UploadService } from '@/services/uploadService';
import { UserService } from '@/services/userService';
import { useImagePreview } from '@/hooks/useImagePreview';

import { updateProfileSchema, changePasswordSchema } from '../../../src/schemas/users.schema';


const passwordFormSchema = changePasswordSchema
  .extend({
    confirmPassword: z.string().min(6, { error: 'users.error.new_password' }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'profile.error.password_mismatch',
    path: ['confirmPassword'],
  });

type ProfileFormData = z.infer<typeof updateProfileSchema>;
type PasswordFormData = z.infer<typeof passwordFormSchema>;

export function useProfile() {
  const { user, setUser } = useAuth();
  const { t } = useTranslation();

  const {
    imagePreview, setImagePreview,
    selectedFile, setSelectedFile,
    handleFileChange
  } = useImagePreview();

  const [loading, setLoading] = useState<boolean>(true);

  const [globalErrorProfile, setGlobalErrorProfile] = useState<string | null>(null);
  const [globalErrorPassword, setGlobalErrorPassword] = useState<string | null>(null);
  const [successProfile, setSuccessProfile] = useState<boolean>(false);
  const [successPassword, setSuccessPassword] = useState<boolean>(false);

  const profileForm = useForm<ProfileFormData>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: { name: '', email: '' }
  });

  const passwordForm = useForm<PasswordFormData>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: { oldPassword: '', newPassword: '', confirmPassword: '' }
  });

  useEffect(() => {
    if (user) {
      profileForm.reset({
        name: user.name || '',
        email: user.email || '',
      });
      setImagePreview(user.avatarUrl || null);

      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLoading(false);
    }
  }, [user, profileForm, setImagePreview]);

  const processProfileSubmit = async (data: ProfileFormData) => {
    setGlobalErrorProfile(null);
    setSuccessProfile(false);

    try {
      let finalAvatarUrl = user?.avatarUrl;

      if (selectedFile) {
        finalAvatarUrl = await UploadService.uploadImage(selectedFile, 'users', `avatar-${user?.id}`);
      }

      const payload = {
        ...data,
        avatarUrl: finalAvatarUrl || undefined
      };

      const updatedUser = await UserService.updateProfile(payload);

      setUser(updatedUser);
      setSuccessProfile(true);
      setSelectedFile(null);
    } catch (error) {
      const err = error as ApiError;
      const errorKey = err.error || err.message;
      setGlobalErrorProfile(errorKey ? t(errorKey) : t('api.error.unknown'));
    }
  };

  const processPasswordSubmit = async (data: PasswordFormData) => {
    setGlobalErrorPassword(null);
    setSuccessPassword(false);

    try {
      await UserService.updatePassword({
        oldPassword: data.oldPassword,
        newPassword: data.newPassword,
      });

      setSuccessPassword(true);
      passwordForm.reset();
    } catch (error) {
      const err = error as ApiError;
      const errorKey = err.error || err.message;
      setGlobalErrorPassword(errorKey ? t(errorKey) : t('api.error.unknown'));
    }
  };

  return {
    profileRegister: profileForm.register,
    profileErrors: profileForm.formState.errors,
    isSubmittingProfile: profileForm.formState.isSubmitting,
    updateProfileSubmit: profileForm.handleSubmit(processProfileSubmit),
    globalErrorProfile,
    successProfile,

    passwordRegister: passwordForm.register,
    passwordErrors: passwordForm.formState.errors,
    isSubmittingPassword: passwordForm.formState.isSubmitting,
    updatePasswordSubmit: passwordForm.handleSubmit(processPasswordSubmit),
    globalErrorPassword,
    successPassword,

    imagePreview,
    handleFileChange,
    loading,
  };
}
