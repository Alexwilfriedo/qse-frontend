import { useQuery } from '@tanstack/react-query';
import { fournisseursApi } from '../fournisseursApi';

export function useEvaluations(fournisseurId: string | undefined) {
  return useQuery({
    queryKey: ['evaluations', fournisseurId],
    queryFn: () => fournisseursApi.getEvaluations(fournisseurId!),
    enabled: !!fournisseurId,
  });
}
