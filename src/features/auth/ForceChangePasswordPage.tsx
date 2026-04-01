import { getApiErrorMessage } from '@/lib/api';
import { showToast } from '@/lib/toast';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from './authApi';
import { useAuthStore } from './authStore';

export default function ForceChangePasswordPage() {
  const navigate = useNavigate();
  const { clearForcePasswordChange, user } = useAuthStore();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [violations, setViolations] = useState<string[]>([]);

  const mutation = useMutation({
    mutationFn: () => authApi.changePassword({ currentPassword, newPassword }),
    onSuccess: () => {
      clearForcePasswordChange();
      showToast.success('Mot de passe modifié avec succès');
      navigate('/');
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { violations?: string[]; error?: string } } };
      if (err.response?.data?.violations) {
        setViolations(err.response.data.violations);
      } else {
        showToast.error(getApiErrorMessage(error));
      }
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setViolations([]);
    if (newPassword !== confirmPassword) {
      setViolations(['Les mots de passe ne correspondent pas']);
      return;
    }
    mutation.mutate();
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4'>
      <div className='w-full max-w-md'>
        <div className='flex justify-center mb-8'>
          <img src='/logo.svg' alt='QSE' className='h-16 w-auto' />
        </div>

        <div className='card'>
          <div className='mb-6'>
            <h1 className='text-title-sm font-semibold text-gray-900 dark:text-white text-center'>
              Changement de mot de passe requis
            </h1>
            <p className='mt-2 text-sm text-gray-500 dark:text-gray-400 text-center'>
              {user?.firstName}, votre mot de passe a été réinitialisé.
              Veuillez en choisir un nouveau.
            </p>
          </div>

          {violations.length > 0 && (
            <div className='mb-4 p-3 rounded-lg bg-error-50 text-error-700 dark:bg-error-500/15 dark:text-error-400 text-sm'>
              <ul className='list-disc list-inside space-y-1'>
                {violations.map((v, i) => (
                  <li key={i}>{v}</li>
                ))}
              </ul>
            </div>
          )}

          <form onSubmit={handleSubmit} className='space-y-5'>
            <div>
              <label
                htmlFor='current'
                className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5'
              >
                Code temporaire
              </label>
              <input
                id='current'
                type='password'
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
                autoComplete='current-password'
                placeholder='Code reçu'
                className='input'
              />
            </div>

            <div>
              <label
                htmlFor='new'
                className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5'
              >
                Nouveau mot de passe
              </label>
              <input
                id='new'
                type='password'
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                autoComplete='new-password'
                placeholder='••••••••'
                className='input'
              />
            </div>

            <div>
              <label
                htmlFor='confirm'
                className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5'
              >
                Confirmer le mot de passe
              </label>
              <input
                id='confirm'
                type='password'
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                autoComplete='new-password'
                placeholder='••••••••'
                className='input'
              />
            </div>

            <button
              type='submit'
              disabled={mutation.isPending}
              className='btn btn-primary w-full'
            >
              {mutation.isPending ? 'Modification...' : 'Changer le mot de passe'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
