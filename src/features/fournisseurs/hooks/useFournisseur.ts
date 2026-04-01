import { useQuery } from '@tanstack/react-query';
import { fournisseursApi } from '../fournisseursApi';

export function useFournisseur(id: string | undefined) {
  return useQuery({
    queryKey: ['fournisseur', id],
    queryFn: () => fournisseursApi.getFournisseur(id!),
    enabled: !!id,
  });
}
