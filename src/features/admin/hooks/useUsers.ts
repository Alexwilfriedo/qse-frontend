import { useQuery } from '@tanstack/react-query';
import { adminApi } from '../adminApi';

export function useUsers() {
  return useQuery({
    queryKey: ['admin', 'users'],
    queryFn: () => adminApi.getUsers(),
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Résout un userId en "Prénom Nom". Retourne l'ID brut si non trouvé.
 */
export function useUserName(userId: string | null | undefined): string {
  const { data: users } = useUsers();
  if (!userId) return '—';
  const user = users?.find((u) => u.id === userId);
  return user ? `${user.firstName} ${user.lastName}` : userId;
}
