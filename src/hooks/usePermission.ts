import { useAuthStore } from '@/features/auth/authStore';
import { useCallback, useMemo } from 'react';

/**
 * Hook pour vérifier les permissions de l'utilisateur courant.
 */
export function usePermission() {
  const user = useAuthStore((state) => state.user);
  const permissions = useMemo(() => new Set(user?.permissions ?? []), [user]);

  const hasPermission = useCallback(
    (permission: string): boolean => {
      return permissions.has(permission);
    },
    [permissions],
  );

  const hasAnyPermission = useCallback(
    (...perms: string[]): boolean => {
      return perms.some((p) => permissions.has(p));
    },
    [permissions],
  );

  const hasAllPermissions = useCallback(
    (...perms: string[]): boolean => {
      return perms.every((p) => permissions.has(p));
    },
    [permissions],
  );

  const hasRole = useCallback(
    (role: string): boolean => {
      return user?.roles?.includes(role) ?? false;
    },
    [user],
  );

  return {
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    hasRole,
    permissions: Array.from(permissions),
    roles: user?.roles ?? [],
  };
}
