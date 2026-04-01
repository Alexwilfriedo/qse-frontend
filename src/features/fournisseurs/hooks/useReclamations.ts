import { useQuery } from '@tanstack/react-query';
import { fournisseursApi } from '../fournisseursApi';

export function useReclamations(fournisseurId: string) {
  return useQuery({
    queryKey: ['reclamations', fournisseurId],
    queryFn: () => fournisseursApi.getReclamations(fournisseurId),
    enabled: !!fournisseurId,
  });
}
