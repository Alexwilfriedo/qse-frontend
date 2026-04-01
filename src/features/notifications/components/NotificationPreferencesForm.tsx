import { useState, useEffect } from 'react';
import { Bell, Mail, Monitor } from 'lucide-react';
import { Button } from '@/components/ui';
import { showToast } from '@/lib/toast';
import { getApiErrorMessage } from '@/lib/api';
import { useNotificationPreferences, useUpdateNotificationPreferences } from '../hooks/useNotifications';
import type { NotificationPreferences } from '../notificationsApi';

const DIGEST_OPTIONS = [
  { value: 'IMMEDIATE', label: 'Immédiat', description: 'Recevoir les notifications dès qu\'elles arrivent' },
  { value: 'DAILY', label: 'Quotidien', description: 'Recevoir un résumé chaque jour' },
  { value: 'WEEKLY', label: 'Hebdomadaire', description: 'Recevoir un résumé chaque semaine' },
] as const;

export function NotificationPreferencesForm() {
  const { data: preferences, isLoading } = useNotificationPreferences();
  const updatePreferences = useUpdateNotificationPreferences();
  
  const [formData, setFormData] = useState<NotificationPreferences>({
    emailEnabled: true,
    inAppEnabled: true,
    digestFrequency: 'IMMEDIATE',
  });

  useEffect(() => {
    if (preferences) {
      setFormData(preferences);
    }
  }, [preferences]);

  const handleToggle = (field: 'emailEnabled' | 'inAppEnabled') => {
    setFormData(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const handleFrequencyChange = (frequency: NotificationPreferences['digestFrequency']) => {
    setFormData(prev => ({ ...prev, digestFrequency: frequency }));
  };

  const handleSubmit = async () => {
    try {
      await updatePreferences.mutateAsync(formData);
      showToast.success('Préférences mises à jour');
    } catch (error) {
      showToast.error(getApiErrorMessage(error));
    }
  };

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded-lg" />
        <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded-lg" />
        <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded-lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 flex items-center gap-2">
          <Bell className="h-5 w-5 text-brand-500" />
          Préférences de notification
        </h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Configurez comment vous souhaitez recevoir vos notifications.
        </p>
      </div>

      <div className="space-y-4">
        {/* Email toggle */}
        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div className="flex items-center gap-3">
            <Mail className="h-5 w-5 text-gray-500" />
            <div>
              <p className="font-medium text-gray-900 dark:text-gray-100">Notifications par email</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Recevoir les alertes par email</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => handleToggle('emailEnabled')}
            className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 ${
              formData.emailEnabled ? 'bg-brand-600' : 'bg-gray-200 dark:bg-gray-600'
            }`}
          >
            <span
              className={`inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                formData.emailEnabled ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* In-app toggle */}
        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div className="flex items-center gap-3">
            <Monitor className="h-5 w-5 text-gray-500" />
            <div>
              <p className="font-medium text-gray-900 dark:text-gray-100">Notifications in-app</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Afficher dans l'application</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => handleToggle('inAppEnabled')}
            className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 ${
              formData.inAppEnabled ? 'bg-brand-600' : 'bg-gray-200 dark:bg-gray-600'
            }`}
          >
            <span
              className={`inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                formData.inAppEnabled ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Digest frequency */}
        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <p className="font-medium text-gray-900 dark:text-gray-100 mb-3">Fréquence des résumés</p>
          <div className="space-y-2">
            {DIGEST_OPTIONS.map((option) => (
              <label
                key={option.value}
                className={`flex items-center p-3 rounded-lg cursor-pointer border-2 transition-colors ${
                  formData.digestFrequency === option.value
                    ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/20'
                    : 'border-transparent hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <input
                  type="radio"
                  name="digestFrequency"
                  value={option.value}
                  checked={formData.digestFrequency === option.value}
                  onChange={() => handleFrequencyChange(option.value)}
                  className="sr-only"
                />
                <div>
                  <p className="font-medium text-gray-900 dark:text-gray-100">{option.label}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{option.description}</p>
                </div>
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Button
          onClick={handleSubmit}
          disabled={updatePreferences.isPending}
        >
          {updatePreferences.isPending ? 'Enregistrement...' : 'Enregistrer les préférences'}
        </Button>
      </div>
    </div>
  );
}
