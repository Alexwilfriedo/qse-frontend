import { usePermission } from '@/hooks/usePermission';
import type { ReactNode } from 'react';

interface CanProps {
  permission?: string;
  permissions?: string[];
  requireAll?: boolean;
  role?: string;
  fallback?: ReactNode;
  children: ReactNode;
}

/**
 * Composant de contrôle d'accès basé sur les permissions.
 * 
 * @example
 * <Can permission="admin:users">
 *   <button>Gérer utilisateurs</button>
 * </Can>
 * 
 * @example
 * <Can permissions={["admin:users", "admin:read"]} requireAll={false}>
 *   <AdminPanel />
 * </Can>
 */
export function Can({
  permission,
  permissions,
  requireAll = false,
  role,
  fallback = null,
  children,
}: CanProps) {
  const { hasPermission, hasAnyPermission, hasAllPermissions, hasRole } =
    usePermission();

  let allowed = false;

  if (role) {
    allowed = hasRole(role);
  } else if (permission) {
    allowed = hasPermission(permission);
  } else if (permissions) {
    allowed = requireAll
      ? hasAllPermissions(...permissions)
      : hasAnyPermission(...permissions);
  }

  return <>{allowed ? children : fallback}</>;
}
