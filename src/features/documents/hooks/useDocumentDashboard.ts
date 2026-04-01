import { useQuery } from '@tanstack/react-query';
import { documentsApi } from '../documentsApi';

/**
 * Hook pour récupérer les statistiques du dashboard documentaire.
 */
export function useDocumentDashboard() {
  return useQuery({
    queryKey: ['document-dashboard'],
    queryFn: () => documentsApi.getDashboard(),
  });
}
