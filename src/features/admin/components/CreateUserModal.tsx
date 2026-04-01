import { Button, Input, Modal } from '@/components/ui';
import { useState } from 'react';
import type { CreateUserRequest, Role } from '../adminApi';

interface CreateUserModalProps {
  roles: Role[];
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: CreateUserRequest) => void;
  isLoading: boolean;
}

export function CreateUserModal({
  roles,
  isOpen,
  onClose,
  onSave,
  isLoading,
}: CreateUserModalProps) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    roleIds: [] as string[],
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) {
      newErrors.email = 'Email requis';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email invalide';
    }

    if (!formData.password) {
      newErrors.password = 'Mot de passe requis';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Minimum 8 caractères';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
    }

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'Prénom requis';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Nom requis';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSave({
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        roleIds: formData.roleIds.length > 0 ? formData.roleIds : undefined,
      });
    }
  };

  const toggleRole = (roleId: string) => {
    setFormData((prev) => ({
      ...prev,
      roleIds: prev.roleIds.includes(roleId)
        ? prev.roleIds.filter((id) => id !== roleId)
        : [...prev.roleIds, roleId],
    }));
  };

  const handleClose = () => {
    setFormData({
      email: '',
      password: '',
      confirmPassword: '',
      firstName: '',
      lastName: '',
      roleIds: [],
    });
    setErrors({});
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title='Nouvel utilisateur'>
      <form onSubmit={handleSubmit}>
        <div className='space-y-4'>
          <div className='grid grid-cols-2 gap-4'>
            <Input
              label='Prénom'
              required
              value={formData.firstName}
              onChange={(e) =>
                setFormData((p) => ({ ...p, firstName: e.target.value }))
              }
              error={errors.firstName}
              placeholder='Jean'
            />
            <Input
              label='Nom'
              required
              value={formData.lastName}
              onChange={(e) =>
                setFormData((p) => ({ ...p, lastName: e.target.value }))
              }
              error={errors.lastName}
              placeholder='Dupont'
            />
          </div>

          <Input
            label='Email'
            type='email'
            required
            value={formData.email}
            onChange={(e) =>
              setFormData((p) => ({ ...p, email: e.target.value }))
            }
            error={errors.email}
            placeholder='jean.dupont@example.com'
          />

          <div className='grid grid-cols-2 gap-4'>
            <Input
              label='Mot de passe'
              type='password'
              required
              value={formData.password}
              onChange={(e) =>
                setFormData((p) => ({ ...p, password: e.target.value }))
              }
              error={errors.password}
              placeholder='••••••••'
            />
            <Input
              label='Confirmer'
              type='password'
              required
              value={formData.confirmPassword}
              onChange={(e) =>
                setFormData((p) => ({ ...p, confirmPassword: e.target.value }))
              }
              error={errors.confirmPassword}
              placeholder='••••••••'
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
              Rôles (optionnel)
            </label>
            <div className='space-y-2 max-h-32 overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-lg p-2'>
              {roles.map((role) => (
                <label
                  key={role.id}
                  className='flex items-center gap-2 p-2 rounded hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer'>
                  <input
                    type='checkbox'
                    checked={formData.roleIds.includes(role.id)}
                    onChange={() => toggleRole(role.id)}
                    className='h-4 w-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500'
                  />
                  <span className='text-sm text-gray-700 dark:text-gray-300'>
                    {role.name}
                  </span>
                </label>
              ))}
            </div>
            <p className='mt-1 text-xs text-gray-500'>
              Si aucun rôle n'est sélectionné, le rôle USER sera attribué par
              défaut.
            </p>
          </div>
        </div>

        <div className='mt-6 flex justify-end gap-3'>
          <Button type='button' variant='ghost' onClick={handleClose}>
            Annuler
          </Button>
          <Button type='submit' isLoading={isLoading}>
            Créer
          </Button>
        </div>
      </form>
    </Modal>
  );
}
