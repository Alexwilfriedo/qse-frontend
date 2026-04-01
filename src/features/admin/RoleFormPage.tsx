import {
  Button,
  Card,
  CardHeader,
  Input,
  PageHeader,
  SkeletonCard,
} from '@/components/ui';
import { getApiErrorMessage } from '@/lib/api';
import { showToast } from '@/lib/toast';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Save, Shield } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { adminApi } from './adminApi';
import { PermissionSelector } from './components/PermissionSelector';

export default function RoleFormPage() {
  const { id } = useParams<{ id: string }>();
  const isEdit = !!id;
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Fetch role if editing
  const {
    data: role,
    isLoading: roleLoading,
    isError: roleError,
  } = useQuery({
    queryKey: ['admin', 'roles', id],
    queryFn: () => adminApi.getRole(id!),
    enabled: isEdit,
  });

  // Fetch all permissions
  const { data: permissions = [], isLoading: permsLoading } = useQuery({
    queryKey: ['admin', 'permissions'],
    queryFn: adminApi.getPermissions,
  });

  // Form state
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [initialized, setInitialized] = useState(false);

  // Hydrate form when role data arrives
  useEffect(() => {
    if (role && !initialized) {
      setName(role.name);
      setDescription(role.description ?? '');
      setSelectedIds(new Set(role.permissions.map((p) => p.id)));
      setInitialized(true);
    }
  }, [role, initialized]);

  // For creation mode, mark as initialized immediately
  useEffect(() => {
    if (!isEdit) setInitialized(true);
  }, [isEdit]);

  const isDirty = useMemo(() => {
    if (!isEdit) return name.length > 0 || selectedIds.size > 0;
    if (!role) return false;
    const origIds = new Set(role.permissions.map((p) => p.id));
    if (name !== role.name) return true;
    if (description !== (role.description ?? '')) return true;
    if (selectedIds.size !== origIds.size) return true;
    for (const pid of selectedIds) {
      if (!origIds.has(pid)) return true;
    }
    return false;
  }, [isEdit, role, name, description, selectedIds]);

  const createMutation = useMutation({
    mutationFn: adminApi.createRole,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'roles'] });
      showToast.success('Rôle créé');
      navigate('/admin/roles');
    },
    onError: (err) => showToast.error(getApiErrorMessage(err)),
  });

  const updateMutation = useMutation({
    mutationFn: (data: {
      name: string;
      description?: string;
      permissionIds?: string[];
    }) => adminApi.updateRole(id!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'roles'] });
      showToast.success('Rôle mis à jour');
      navigate('/admin/roles');
    },
    onError: (err) => showToast.error(getApiErrorMessage(err)),
  });

  const handleSubmit = () => {
    const data = {
      name,
      description: description || undefined,
      permissionIds: Array.from(selectedIds),
    };
    if (isEdit) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };

  const isSaving = createMutation.isPending || updateMutation.isPending;
  const isLoading = roleLoading || permsLoading;
  const isSystem = role?.isSystem ?? false;

  if (isEdit && roleError) {
    return (
      <div className='space-y-6'>
        <PageHeader
          title='Erreur'
          description='Le rôle demandé est introuvable.'
          actions={
            <Button variant='ghost' onClick={() => navigate('/admin/roles')}>
              <ArrowLeft className='w-4 h-4 mr-2' />
              Retour
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      <PageHeader
        title={isEdit ? `Modifier : ${role?.name ?? '...'}` : 'Nouveau rôle'}
        description={
          isEdit
            ? 'Modifier les informations et permissions du rôle'
            : 'Créer un nouveau rôle avec ses permissions'
        }
        actions={
          <div className='flex items-center gap-3'>
            <Button variant='ghost' onClick={() => navigate('/admin/roles')}>
              <ArrowLeft className='w-4 h-4 mr-2' />
              Retour
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!name || isSaving || !isDirty}
              isLoading={isSaving}>
              <Save className='w-4 h-4 mr-2' />
              Enregistrer
            </Button>
          </div>
        }
      />

      {isLoading ? (
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
          <SkeletonCard />
          <div className='lg:col-span-2'>
            <SkeletonCard />
          </div>
        </div>
      ) : (
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
          {/* Left: Role info */}
          <div className='space-y-4'>
            <Card>
              <CardHeader title='Informations' />
              <div className='p-4 space-y-4'>
                <Input
                  label='Nom du rôle'
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder='Ex: Manager QSE'
                  disabled={isSystem}
                />
                <Input
                  label='Description'
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder='Description optionnelle du rôle'
                />
              </div>
            </Card>

            {/* Summary card */}
            <Card>
              <div className='p-4'>
                <div className='flex items-center gap-3 mb-3'>
                  <div className='p-2 rounded-lg bg-brand-50 dark:bg-brand-950'>
                    <Shield className='w-5 h-5 text-brand-600 dark:text-brand-400' />
                  </div>
                  <div>
                    <p className='text-sm font-medium text-gray-900 dark:text-white'>
                      Résumé des permissions
                    </p>
                    <p className='text-xs text-gray-500 dark:text-gray-400'>
                      {selectedIds.size} permission
                      {selectedIds.size !== 1 ? 's' : ''} sélectionnée
                      {selectedIds.size !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>

                {isSystem && (
                  <div className='rounded-lg bg-warning-50 dark:bg-warning-950 border border-warning-200 dark:border-warning-800 p-3 text-xs text-warning-700 dark:text-warning-300'>
                    Ce rôle est un rôle système. Son nom ne peut pas être
                    modifié, mais vous pouvez ajuster ses permissions.
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Right: Permissions selector */}
          <div className='lg:col-span-2'>
            <Card>
              <CardHeader title='Permissions' />
              <div className='p-4'>
                <PermissionSelector
                  permissions={permissions}
                  selected={selectedIds}
                  onChange={setSelectedIds}
                  disabled={false}
                />
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
