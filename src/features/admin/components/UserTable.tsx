import { Avatar, Badge, Button, DataTable } from '@/components/ui';
import { getInitials } from '@/lib/utils';
import {
  KeyRound,
  Pencil,
  Shield,
  ToggleLeft,
  ToggleRight,
} from 'lucide-react';
import type { User } from '../adminApi';

interface UserTableProps {
  users: User[] | undefined;
  isLoading: boolean;
  onRolesClick: (user: User) => void;
  onToggleActive: (user: User) => void;
  onEdit: (user: User) => void;
  onResetPassword: (user: User) => void;
}

export function UserTable({
  users,
  isLoading,
  onRolesClick,
  onToggleActive,
  onEdit,
  onResetPassword,
}: UserTableProps) {
  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleString('fr-FR');
  };

  const columns = [
    {
      key: 'user',
      header: 'Utilisateur',
      render: (user: User) => (
        <div className='flex items-center'>
          <Avatar
            initials={getInitials(user.firstName, user.lastName)}
            size='md'
          />
          <div className='ml-4'>
            <div className='text-sm font-medium text-gray-900 dark:text-white'>
              {user.firstName} {user.lastName}
            </div>
            <div className='text-sm text-gray-500 dark:text-gray-400'>
              {user.email}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: 'roles',
      header: 'Rôles',
      render: (user: User) => (
        <div className='flex flex-wrap gap-1'>
          {user.roles.map((role) => (
            <Badge key={role} variant='brand'>
              {role}
            </Badge>
          ))}
        </div>
      ),
    },
    {
      key: 'lastLogin',
      header: 'Dernière connexion',
      render: (user: User) => (
        <div>
          <div className='text-sm text-gray-500 dark:text-gray-400'>
            {formatDate(user.lastLoginAt)}
          </div>
          {user.lastLoginIp && (
            <div className='text-xs text-gray-400'>{user.lastLoginIp}</div>
          )}
        </div>
      ),
    },
    {
      key: 'statut',
      header: 'Statut',
      render: (user: User) => (
        <Badge variant={user.active ? 'success' : 'error'}>
          {user.active ? 'Actif' : 'Inactif'}
        </Badge>
      ),
    },
    {
      key: 'actions',
      header: '',
      render: (user: User) => (
        <div className='flex justify-end gap-1'>
          <Button
            variant='ghost'
            size='sm'
            onClick={() => onEdit(user)}
            title='Modifier'>
            <Pencil className='w-4 h-4' />
          </Button>
          <Button
            variant='ghost'
            size='sm'
            onClick={() => onRolesClick(user)}
            title='Gérer les rôles'>
            <Shield className='w-4 h-4' />
          </Button>
          <Button
            variant='ghost'
            size='sm'
            onClick={() => onResetPassword(user)}
            title='Réinitialiser le mot de passe'>
            <KeyRound className='w-4 h-4' />
          </Button>
          <Button
            variant='ghost'
            size='sm'
            onClick={() => onToggleActive(user)}
            title={user.active ? 'Désactiver' : 'Activer'}>
            {user.active ? (
              <ToggleRight className='w-4 h-4 text-success-500' />
            ) : (
              <ToggleLeft className='w-4 h-4 text-gray-400' />
            )}
          </Button>
        </div>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={users}
      isLoading={isLoading}
      keyExtractor={(u) => u.id}
      emptyMessage='Aucun utilisateur'
      skeletonRows={3}
    />
  );
}
