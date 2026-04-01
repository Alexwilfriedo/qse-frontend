import { Badge, Button, Card, CardHeader, SkeletonCard } from '@/components/ui';
import { getApiErrorMessage } from '@/lib/api';
import { showToast } from '@/lib/toast';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Check, Minus, Save } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { adminApi, type Permission, type Role } from '../adminApi';

/**
 * Grille matricielle Rôles × Permissions.
 * Permet de visualiser et modifier les permissions de chaque rôle
 * dans une vue synthétique groupée par catégorie.
 */
export function PermissionMatrixPanel() {
  const queryClient = useQueryClient();

  const { data: roles, isLoading: rolesLoading } = useQuery({
    queryKey: ['admin', 'roles'],
    queryFn: adminApi.getRoles,
  });

  const { data: permissions, isLoading: permsLoading } = useQuery({
    queryKey: ['admin', 'permissions'],
    queryFn: adminApi.getPermissions,
  });

  // Map role ID -> set of permission IDs (local editable state)
  const [matrix, setMatrix] = useState<Record<string, Set<string>>>({});
  const [dirty, setDirty] = useState<Set<string>>(new Set());

  // Initialize matrix from fetched data
  useEffect(() => {
    if (roles) {
      const m: Record<string, Set<string>> = {};
      for (const role of roles) {
        m[role.id] = new Set(role.permissions.map((p) => p.id));
      }
      setMatrix(m);
      setDirty(new Set());
    }
  }, [roles]);

  const groupedPermissions = useMemo(() => {
    if (!permissions) return {};
    return permissions.reduce(
      (acc, perm) => {
        if (!acc[perm.category]) acc[perm.category] = [];
        acc[perm.category].push(perm);
        return acc;
      },
      {} as Record<string, Permission[]>,
    );
  }, [permissions]);

  const togglePermission = (roleId: string, permId: string) => {
    setMatrix((prev) => {
      const next = { ...prev };
      const perms = new Set(next[roleId]);
      if (perms.has(permId)) {
        perms.delete(permId);
      } else {
        perms.add(permId);
      }
      next[roleId] = perms;
      return next;
    });
    setDirty((prev) => new Set(prev).add(roleId));
  };

  const toggleCategoryForRole = (
    roleId: string,
    categoryPerms: Permission[],
  ) => {
    const current = matrix[roleId] ?? new Set();
    const allSelected = categoryPerms.every((p) => current.has(p.id));

    setMatrix((prev) => {
      const next = { ...prev };
      const perms = new Set(next[roleId]);
      for (const p of categoryPerms) {
        if (allSelected) {
          perms.delete(p.id);
        } else {
          perms.add(p.id);
        }
      }
      next[roleId] = perms;
      return next;
    });
    setDirty((prev) => new Set(prev).add(roleId));
  };

  const saveMutation = useMutation({
    mutationFn: async (roleId: string) => {
      const permIds = Array.from(matrix[roleId] ?? []);
      const role = roles?.find((r) => r.id === roleId);
      if (!role) return;
      await adminApi.updateRole(roleId, {
        name: role.name,
        description: role.description ?? undefined,
        permissionIds: permIds,
      });
    },
    onSuccess: (_data, roleId) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'roles'] });
      setDirty((prev) => {
        const next = new Set(prev);
        next.delete(roleId);
        return next;
      });
      showToast.success('Permissions sauvegardées');
    },
    onError: (error) => {
      showToast.error(getApiErrorMessage(error));
    },
  });

  const saveAll = async () => {
    for (const roleId of dirty) {
      await saveMutation.mutateAsync(roleId);
    }
  };

  const isLoading = rolesLoading || permsLoading;
  const sortedRoles = useMemo(
    () => (roles ?? []).slice().sort((a, b) => a.name.localeCompare(b.name)),
    [roles],
  );

  if (isLoading) {
    return (
      <Card>
        <CardHeader title='Matrice des permissions' />
        <div className='p-4 space-y-3'>
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </Card>
    );
  }

  const categories = Object.keys(groupedPermissions).sort();

  return (
    <Card>
      <CardHeader
        title='Matrice des permissions'
        action={
          dirty.size > 0 ? (
            <Button
              size='sm'
              onClick={saveAll}
              disabled={saveMutation.isPending}>
              <Save className='w-4 h-4 mr-1' />
              Sauvegarder ({dirty.size})
            </Button>
          ) : undefined
        }
      />

      <div className='overflow-x-auto'>
        <table className='w-full text-sm'>
          <thead>
            <tr className='border-b border-gray-200 dark:border-gray-700'>
              <th className='sticky left-0 z-10 bg-white dark:bg-gray-900 px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase'>
                Permission
              </th>
              {sortedRoles.map((role) => (
                <th
                  key={role.id}
                  className='px-3 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 min-w-[100px]'>
                  <div className='flex flex-col items-center gap-1'>
                    <span>{role.name}</span>
                    {role.isSystem && <Badge variant='default'>Sys</Badge>}
                    {dirty.has(role.id) && (
                      <Badge variant='warning'>Modifié</Badge>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => {
              const perms = groupedPermissions[category];
              return (
                <CategoryRows
                  key={category}
                  category={category}
                  permissions={perms}
                  roles={sortedRoles}
                  matrix={matrix}
                  onToggle={togglePermission}
                  onToggleCategory={toggleCategoryForRole}
                />
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

function CategoryRows({
  category,
  permissions,
  roles,
  matrix,
  onToggle,
  onToggleCategory,
}: {
  category: string;
  permissions: Permission[];
  roles: Role[];
  matrix: Record<string, Set<string>>;
  onToggle: (roleId: string, permId: string) => void;
  onToggleCategory: (roleId: string, perms: Permission[]) => void;
}) {
  return (
    <>
      {/* Category header row */}
      <tr className='bg-gray-50 dark:bg-gray-800/50'>
        <td className='sticky left-0 z-10 bg-gray-50 dark:bg-gray-800/50 px-4 py-2 text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider'>
          {category}
        </td>
        {roles.map((role) => {
          const rolePerms = matrix[role.id] ?? new Set<string>();
          const allSelected = permissions.every((p) => rolePerms.has(p.id));
          const someSelected = permissions.some((p) => rolePerms.has(p.id));
          return (
            <td key={role.id} className='px-3 py-2 text-center'>
              <button
                type='button'
                onClick={() => onToggleCategory(role.id, permissions)}
                className='inline-flex items-center justify-center w-6 h-6 rounded border transition-colors hover:bg-gray-200 dark:hover:bg-gray-600'
                style={{
                  borderColor: allSelected
                    ? 'var(--color-brand-500)'
                    : 'var(--color-gray-300)',
                  backgroundColor: allSelected
                    ? 'var(--color-brand-50)'
                    : 'transparent',
                }}
                title={`Tout ${allSelected ? 'décocher' : 'cocher'} — ${category}`}>
                {allSelected ? (
                  <Check className='w-3.5 h-3.5 text-brand-600' />
                ) : someSelected ? (
                  <Minus className='w-3.5 h-3.5 text-gray-400' />
                ) : null}
              </button>
            </td>
          );
        })}
      </tr>

      {/* Permission rows */}
      {permissions.map((perm) => (
        <tr
          key={perm.id}
          className='border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50/50 dark:hover:bg-gray-800/30'>
          <td
            className='sticky left-0 z-10 bg-white dark:bg-gray-900 px-4 py-2 text-gray-600 dark:text-gray-400'
            title={perm.description || undefined}>
            <span className='font-mono text-xs'>{perm.code}</span>
            {perm.name && (
              <span className='ml-2 text-gray-400 dark:text-gray-500'>
                {perm.name}
              </span>
            )}
          </td>
          {roles.map((role) => {
            const has = matrix[role.id]?.has(perm.id) ?? false;
            return (
              <td key={role.id} className='px-3 py-2 text-center'>
                <button
                  type='button'
                  onClick={() => onToggle(role.id, perm.id)}
                  className={`inline-flex items-center justify-center w-6 h-6 rounded border transition-colors ${
                    has
                      ? 'border-brand-500 bg-brand-50 dark:bg-brand-500/20'
                      : 'border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                  title={`${perm.code} — ${role.name}`}>
                  {has && (
                    <Check className='w-3.5 h-3.5 text-brand-600 dark:text-brand-400' />
                  )}
                </button>
              </td>
            );
          })}
        </tr>
      ))}
    </>
  );
}
