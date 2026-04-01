import {
  Button,
  Card,
  CardHeader,
  PageHeader,
  Pagination,
  SkeletonCard,
} from '@/components/ui';
import { showToast } from '@/lib/toast';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminApi, type Role } from './adminApi';
import {
  DeleteConfirmModal,
  PermissionMatrixPanel,
  RoleCard,
  RoleTemplatesPanel,
} from './components';

const PAGE_SIZE = 10;

type TabKey = 'roles' | 'matrix' | 'templates';

export default function RolesPage() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [roleToDelete, setRoleToDelete] = useState<Role | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [activeTab, setActiveTab] = useState<TabKey>('roles');

  const { data: roles, isLoading } = useQuery({
    queryKey: ['admin', 'roles'],
    queryFn: adminApi.getRoles,
  });

  const deleteMutation = useMutation({
    mutationFn: adminApi.deleteRole,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'roles'] });
      showToast.success('Rôle supprimé');
      setRoleToDelete(null);
    },
  });

  // Pagination côté client
  const totalElements = roles?.length ?? 0;
  const totalPages = Math.ceil(totalElements / PAGE_SIZE);
  const paginatedRoles = useMemo(() => {
    if (!roles) return [];
    const start = currentPage * PAGE_SIZE;
    return roles.slice(start, start + PAGE_SIZE);
  }, [roles, currentPage]);

  return (
    <div className='space-y-6'>
      <PageHeader
        title='Rôles & Permissions'
        description='Gestion des rôles et permissions utilisateurs'
        actions={
          <Button onClick={() => navigate('/admin/roles/new')}>
            <Plus className='w-4 h-4 mr-2' />
            Nouveau rôle
          </Button>
        }
      />

      {/* Tabs */}
      <div className='flex gap-1 border-b border-gray-200 dark:border-gray-700'>
        {[
          { key: 'roles' as TabKey, label: 'Rôles' },
          { key: 'matrix' as TabKey, label: 'Matrice des permissions' },
          { key: 'templates' as TabKey, label: 'Templates QSE' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab.key
                ? 'border-brand-500 text-brand-600 dark:text-brand-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}>
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'roles' && (
        <Card>
          <CardHeader title={`Liste des rôles (${totalElements})`} />

          {isLoading ? (
            <div className='p-4 space-y-4'>
              <SkeletonCard />
              <SkeletonCard />
            </div>
          ) : (
            <div className='p-4 space-y-4'>
              {paginatedRoles.map((role) => (
                <RoleCard
                  key={role.id}
                  role={role}
                  onEdit={() => navigate(`/admin/roles/${role.id}/edit`)}
                  onDelete={() => setRoleToDelete(role)}
                />
              ))}
            </div>
          )}

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalElements={totalElements}
            onPageChange={setCurrentPage}
            pageSize={PAGE_SIZE}
          />
        </Card>
      )}

      {activeTab === 'matrix' && <PermissionMatrixPanel />}

      {activeTab === 'templates' && <RoleTemplatesPanel />}

      {roleToDelete && (
        <DeleteConfirmModal
          isOpen={!!roleToDelete}
          title='Supprimer le rôle'
          message={`Êtes-vous sûr de vouloir supprimer le rôle "${roleToDelete.name}" ?`}
          onClose={() => setRoleToDelete(null)}
          onConfirm={() => deleteMutation.mutate(roleToDelete.id)}
          isLoading={deleteMutation.isPending}
        />
      )}
    </div>
  );
}
