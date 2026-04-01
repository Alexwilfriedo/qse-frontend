import { Badge, Button } from '@/components/ui';
import { Edit2, Trash2 } from 'lucide-react';
import type { Role } from '../adminApi';

interface RoleCardProps {
  role: Role;
  onEdit: () => void;
  onDelete: () => void;
}

export function RoleCard({ role, onEdit, onDelete }: RoleCardProps) {
  return (
    <div className='rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800'>
      <div className='flex items-start justify-between'>
        <div>
          <h3 className='flex items-center gap-2 text-lg font-medium text-gray-900 dark:text-white'>
            {role.name}
            {role.isSystem && <Badge variant='default'>Système</Badge>}
          </h3>
          {role.description && (
            <p className='mt-1 text-sm text-gray-500 dark:text-gray-400'>
              {role.description}
            </p>
          )}
        </div>
        <div className='flex gap-1'>
          <Button variant='ghost' size='sm' onClick={onEdit} title='Modifier'>
            <Edit2 className='w-4 h-4' />
          </Button>
          {!role.isSystem && (
            <Button
              variant='ghost'
              size='sm'
              onClick={onDelete}
              title='Supprimer'>
              <Trash2 className='w-4 h-4 text-error-500' />
            </Button>
          )}
        </div>
      </div>

      <div className='mt-4'>
        <div className='mb-2 text-xs font-medium uppercase text-gray-500 dark:text-gray-400'>
          Permissions ({role.permissions.length})
        </div>
        <div className='flex flex-wrap gap-1'>
          {role.permissions.map((perm) => (
            <span
              key={perm.id}
              className='inline-flex items-center rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-700 dark:bg-gray-700 dark:text-gray-300'
              title={perm.description || undefined}>
              {perm.code}
            </span>
          ))}
          {role.permissions.length === 0 && (
            <span className='text-xs text-gray-400'>Aucune permission</span>
          )}
        </div>
      </div>
    </div>
  );
}
