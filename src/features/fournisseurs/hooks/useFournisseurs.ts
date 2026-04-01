import { useQuery } from '@tanstack/react-query';
import { fournisseursApi } from '../fournisseursApi';
import type { FournisseurFilters } from '../types';

export function useFournisseurs(filters: FournisseurFilters = {}) {
  return useQuery({
    queryKey: ['fournisseurs', filters],
    queryFn: () => fournisseursApi.getFournisseurs(filters),
  });
}
