import { Can } from '@/components/auth/Can';
import {
  Button,
  Card,
  CardHeader,
  Input,
  PageHeader,
  Pagination,
  Select,
} from '@/components/ui';
import { getApiErrorMessage } from '@/lib/api';
import { queryKeys } from '@/lib/queryKeys';
import { showToast } from '@/lib/toast';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Plus, Search, UserPlus } from 'lucide-react';
import { useMemo, useState } from 'react';
import { adminApi, type User } from './adminApi';
import {
  CreateGuestModal,
  CreateUserModal,
  EditUserModal,
  ResetPasswordModal,
  RoleAssignmentModal,
  StatusToggleModal,
  UserTable,
} from './components';

const PAGE_SIZE = 20;

export default function UsersPage() {
  const queryClient = useQueryClient();
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isGuestModalOpen, setIsGuestModalOpen] = useState(false);
  const [userToToggle, setUserToToggle] = useState<User | null>(null);
  const [userToEdit, setUserToEdit] = useState<User | null>(null);
  const [userToReset, setUserToReset] = useState<User | null>(null);
  const [temporaryCode, setTemporaryCode] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');

  const { data: users, isLoading } = useQuery({
    queryKey: queryKeys.adminUsers,
    queryFn: adminApi.getUsers,
  });

  const { data: roles } = useQuery({
    queryKey: queryKeys.adminRoles,
    queryFn: adminApi.getRoles,
  });

  const createUserMutation = useMutation({
    mutationFn: adminApi.createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.adminUsers });
      showToast.success('Utilisateur créé avec succès');
      setIsCreateModalOpen(false);
    },
    onError: (error) => {
      showToast.error(getApiErrorMessage(error));
    },
  });

  const toggleActiveMutation = useMutation({
    mutationFn: ({ user, reason }: { user: User; reason: string }) =>
      user.active
        ? adminApi.deactivateUser(user.id, reason)
        : adminApi.activateUser(user.id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.adminUsers });
      showToast.success('Utilisateur mis à jour');
      setUserToToggle(null);
    },
    onError: (error) => {
      showToast.error(getApiErrorMessage(error));
    },
  });

  const assignRolesMutation = useMutation({
    mutationFn: ({ userId, roleIds }: { userId: string; roleIds: string[] }) =>
      adminApi.assignRoles(userId, { roleIds }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.adminUsers });
      showToast.success('Rôles mis à jour');
      setSelectedUser(null);
    },
    onError: (error) => {
      showToast.error(getApiErrorMessage(error));
    },
  });

  const updateUserMutation = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: { firstName: string; lastName: string; email: string };
    }) => adminApi.updateUser(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.adminUsers });
      showToast.success('Utilisateur mis à jour');
      setUserToEdit(null);
    },
    onError: (error) => {
      showToast.error(getApiErrorMessage(error));
    },
  });

  const resetPasswordMutation = useMutation({
    mutationFn: (userId: string) => adminApi.resetPassword(userId),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.adminUsers });
      setTemporaryCode(response.temporaryCode);
    },
    onError: (error) => {
      showToast.error(getApiErrorMessage(error));
    },
  });

  const createGuestMutation = useMutation({
    mutationFn: adminApi.createGuest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.adminUsers });
      showToast.success('Accès invité créé');
      setIsGuestModalOpen(false);
    },
    onError: (error) => {
      showToast.error(getApiErrorMessage(error));
    },
  });

  const filteredUsers = useMemo(() => {
    if (!users) return [];
    let result = users;
    if (statusFilter === 'active') result = result.filter((u) => u.active);
    if (statusFilter === 'inactive') result = result.filter((u) => !u.active);
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (u) =>
          u.firstName.toLowerCase().includes(q) ||
          u.lastName.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q),
      );
    }
    return result;
  }, [users, search, statusFilter]);

  const totalElements = filteredUsers.length;
  const totalPages = Math.ceil(totalElements / PAGE_SIZE);
  const paginatedUsers = useMemo(() => {
    const start = currentPage * PAGE_SIZE;
    return filteredUsers.slice(start, start + PAGE_SIZE);
  }, [filteredUsers, currentPage]);

  return (
    <div className='space-y-6'>
      <PageHeader
        title='Utilisateurs'
        description='Gestion des comptes utilisateurs'
        actions={
          <Can permission='admin:users'>
            <div className='flex gap-2'>
              <Button
                variant='secondary'
                onClick={() => setIsGuestModalOpen(true)}>
                <UserPlus className='w-4 h-4 mr-2' />
                Accès invité
              </Button>
              <Button onClick={() => setIsCreateModalOpen(true)}>
                <Plus className='w-4 h-4 mr-2' />
                Nouvel utilisateur
              </Button>
            </div>
          </Can>
        }
      />

      <Card>
        <CardHeader
          title='Liste des utilisateurs'
          action={
            <div className='flex items-center gap-3'>
              <Select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setCurrentPage(0);
                }}
                options={[
                  { value: '', label: 'Tous les statuts' },
                  { value: 'active', label: 'Actif' },
                  { value: 'inactive', label: 'Inactif' },
                ]}
                fullWidth={false}
              />
              <div className='relative'>
                <Search className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400' />
                <Input
                  type='text'
                  placeholder='Rechercher...'
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setCurrentPage(0);
                  }}
                  className='pl-9 min-w-[200px]'
                />
              </div>
            </div>
          }
        />

        <UserTable
          users={paginatedUsers}
          isLoading={isLoading}
          onRolesClick={setSelectedUser}
          onToggleActive={setUserToToggle}
          onEdit={setUserToEdit}
          onResetPassword={(u) => {
            setUserToReset(u);
            setTemporaryCode(null);
          }}
        />

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalElements={totalElements}
          onPageChange={setCurrentPage}
          pageSize={PAGE_SIZE}
        />
      </Card>

      {userToToggle && (
        <StatusToggleModal
          isOpen={!!userToToggle}
          userName={`${userToToggle.firstName} ${userToToggle.lastName}`}
          currentStatus={userToToggle.active ? 'active' : 'inactive'}
          onClose={() => setUserToToggle(null)}
          onConfirm={(reason) =>
            toggleActiveMutation.mutate({ user: userToToggle, reason })
          }
          isLoading={toggleActiveMutation.isPending}
        />
      )}

      {selectedUser && roles && (
        <RoleAssignmentModal
          user={selectedUser}
          roles={roles}
          isOpen={!!selectedUser}
          onClose={() => setSelectedUser(null)}
          onSave={(roleIds) =>
            assignRolesMutation.mutate({ userId: selectedUser.id, roleIds })
          }
          isLoading={assignRolesMutation.isPending}
        />
      )}

      <CreateUserModal
        roles={roles ?? []}
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSave={(data) => createUserMutation.mutate(data)}
        isLoading={createUserMutation.isPending}
      />

      {userToEdit && (
        <EditUserModal
          user={userToEdit}
          isOpen={!!userToEdit}
          onClose={() => setUserToEdit(null)}
          onSave={(data) =>
            updateUserMutation.mutate({ id: userToEdit.id, data })
          }
          isLoading={updateUserMutation.isPending}
        />
      )}

      <CreateGuestModal
        roles={roles ?? []}
        isOpen={isGuestModalOpen}
        onClose={() => setIsGuestModalOpen(false)}
        onSave={(data) => createGuestMutation.mutate(data)}
        isLoading={createGuestMutation.isPending}
      />

      {userToReset && (
        <ResetPasswordModal
          isOpen={!!userToReset}
          userName={`${userToReset.firstName} ${userToReset.lastName}`}
          temporaryCode={temporaryCode}
          isLoading={resetPasswordMutation.isPending}
          onClose={() => {
            setUserToReset(null);
            setTemporaryCode(null);
          }}
          onConfirm={() => resetPasswordMutation.mutate(userToReset.id)}
        />
      )}
    </div>
  );
}
