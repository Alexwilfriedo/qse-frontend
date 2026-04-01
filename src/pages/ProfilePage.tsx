import {
  Avatar,
  Badge,
  Button,
  Card,
  CardHeader,
  Input,
  PageHeader,
  SkeletonCard,
} from '@/components/ui';
import { getInitials } from '@/lib/utils';
import { useAuthStore } from '@/features/auth/authStore';
import { getApiErrorMessage } from '@/lib/api';
import { showToast } from '@/lib/toast';
import { useState } from 'react';
import { NotificationPreferencesForm } from '@/features/notifications';

export default function ProfilePage() {
  const user = useAuthStore((state) => state.user);

  if (!user) {
    return (
      <div className='space-y-6'>
        <PageHeader title='Mon profil' />
        <div className='grid gap-6 lg:grid-cols-2'>
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      <PageHeader title='Mon profil' />

      <div className='grid gap-6 lg:grid-cols-2'>
        <ProfileInfoCard user={user} />
        <ChangePasswordCard />
      </div>

      <NotificationPreferencesForm />

      {user.permissions && user.permissions.length > 0 && (
        <PermissionsCard permissions={user.permissions} />
      )}
    </div>
  );
}

function ProfileInfoCard({
  user,
}: {
  user: { firstName: string; lastName: string; email: string; roles: string[] };
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user.firstName,
    lastName: user.lastName,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSave = async () => {
    const newErrors: Record<string, string> = {};
    if (!formData.firstName.trim()) newErrors.firstName = 'Prénom requis';
    if (!formData.lastName.trim()) newErrors.lastName = 'Nom requis';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      // TODO: Call API to update profile
      showToast.success('Profil mis à jour');
      setIsEditing(false);
    } catch (error) {
      showToast.error(getApiErrorMessage(error));
    }
  };

  return (
    <Card>
      <CardHeader
        title='Informations personnelles'
        action={
          !isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className='text-sm text-brand-600 hover:text-brand-700 dark:text-brand-400'>
              Modifier
            </button>
          )
        }
      />

      <div className='flex items-center gap-4 mb-6'>
        <Avatar
          initials={getInitials(user.firstName, user.lastName)}
          size='xl'
        />
        <div>
          <p className='text-lg font-medium text-gray-900 dark:text-white'>
            {user.firstName} {user.lastName}
          </p>
          <p className='text-sm text-gray-500 dark:text-gray-400'>
            {user.email}
          </p>
        </div>
      </div>

      {isEditing ? (
        <div className='space-y-4'>
          <div className='grid grid-cols-2 gap-4'>
            <Input
              label='Prénom'
              value={formData.firstName}
              onChange={(e) =>
                setFormData((p) => ({ ...p, firstName: e.target.value }))
              }
              error={errors.firstName}
            />
            <Input
              label='Nom'
              value={formData.lastName}
              onChange={(e) =>
                setFormData((p) => ({ ...p, lastName: e.target.value }))
              }
              error={errors.lastName}
            />
          </div>
          <div className='flex gap-3'>
            <Button onClick={handleSave}>Enregistrer</Button>
            <Button variant='ghost' onClick={() => setIsEditing(false)}>
              Annuler
            </Button>
          </div>
        </div>
      ) : (
        <div className='space-y-3'>
          <ProfileRow label='Email' value={user.email} />
          <ProfileRow
            label='Rôles'
            value={
              <div className='flex gap-1'>
                {user.roles.map((role) => (
                  <Badge key={role} variant='brand'>
                    {role}
                  </Badge>
                ))}
              </div>
            }
          />
        </div>
      )}
    </Card>
  );
}

function ProfileRow({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className='flex justify-between py-2 border-b border-gray-100 dark:border-gray-700'>
      <span className='text-sm text-gray-500 dark:text-gray-400'>{label}</span>
      <span className='text-sm text-gray-900 dark:text-white'>{value}</span>
    </div>
  );
}

function ChangePasswordCard() {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async () => {
    const newErrors: Record<string, string> = {};
    if (!formData.currentPassword)
      newErrors.currentPassword = 'Mot de passe actuel requis';
    if (!formData.newPassword) {
      newErrors.newPassword = 'Nouveau mot de passe requis';
    } else if (formData.newPassword.length < 8) {
      newErrors.newPassword = 'Minimum 8 caractères';
    }
    if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      // TODO: Call API to change password
      showToast.success('Mot de passe modifié');
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      setErrors({});
    } catch (error) {
      showToast.error(getApiErrorMessage(error));
    }
  };

  return (
    <Card>
      <CardHeader title='Changer le mot de passe' />
      <div className='space-y-4'>
        <Input
          label='Mot de passe actuel'
          type='password'
          value={formData.currentPassword}
          onChange={(e) =>
            setFormData((p) => ({ ...p, currentPassword: e.target.value }))
          }
          error={errors.currentPassword}
          placeholder='••••••••'
        />
        <Input
          label='Nouveau mot de passe'
          type='password'
          value={formData.newPassword}
          onChange={(e) =>
            setFormData((p) => ({ ...p, newPassword: e.target.value }))
          }
          error={errors.newPassword}
          placeholder='••••••••'
        />
        <Input
          label='Confirmer le nouveau mot de passe'
          type='password'
          value={formData.confirmPassword}
          onChange={(e) =>
            setFormData((p) => ({ ...p, confirmPassword: e.target.value }))
          }
          error={errors.confirmPassword}
          placeholder='••••••••'
        />
        <Button onClick={handleSubmit} className='w-full'>
          Changer le mot de passe
        </Button>
      </div>
    </Card>
  );
}

function PermissionsCard({ permissions }: { permissions: string[] }) {
  return (
    <Card>
      <CardHeader title='Permissions' />
      <div className='flex flex-wrap gap-2'>
        {permissions.map((permission) => (
          <Badge key={permission} variant='default'>
            {permission}
          </Badge>
        ))}
      </div>
    </Card>
  );
}
