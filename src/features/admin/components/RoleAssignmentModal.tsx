import { Button, Modal } from '@/components/ui';
import { useState } from 'react';
import type { Role, User } from '../adminApi';

interface RoleAssignmentModalProps {
  user: User;
  roles: Role[];
  isOpen: boolean;
  onClose: () => void;
  onSave: (roleIds: string[]) => void;
  isLoading: boolean;
}

export function RoleAssignmentModal({
  user,
  roles,
  isOpen,
  onClose,
  onSave,
  isLoading,
}: RoleAssignmentModalProps) {
  const [selectedRoleIds, setSelectedRoleIds] = useState<string[]>(
    roles.filter((r) => user.roles.includes(r.name)).map((r) => r.id),
  );

  const toggleRole = (roleId: string) => {
    setSelectedRoleIds((prev) =>
      prev.includes(roleId)
        ? prev.filter((id) => id !== roleId)
        : [...prev, roleId],
    );
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Assigner des rôles à ${user.firstName} ${user.lastName}`}>
      <div className='space-y-2 max-h-64 overflow-y-auto'>
        {roles.map((role) => (
          <label
            key={role.id}
            className='flex items-center gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700'>
            <input
              type='checkbox'
              checked={selectedRoleIds.includes(role.id)}
              onChange={() => toggleRole(role.id)}
              className='h-4 w-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500'
            />
            <div>
              <div className='text-sm font-medium text-gray-900 dark:text-white'>
                {role.name}
                {role.isSystem && (
                  <span className='ml-2 text-xs text-gray-500'>(système)</span>
                )}
              </div>
              {role.description && (
                <div className='text-xs text-gray-500'>{role.description}</div>
              )}
            </div>
          </label>
        ))}
      </div>

      <div className='mt-6 flex justify-end gap-3'>
        <Button variant='ghost' onClick={onClose}>
          Annuler
        </Button>
        <Button
          onClick={() => onSave(selectedRoleIds)}
          isLoading={isLoading}>
          Enregistrer
        </Button>
      </div>
    </Modal>
  );
}
