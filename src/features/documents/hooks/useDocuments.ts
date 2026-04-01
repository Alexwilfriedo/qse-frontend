import { useQuery } from '@tanstack/react-query';
import { documentsApi } from '../documentsApi';
import type { DocumentFilters } from '../types';

export function useDocuments(filters: DocumentFilters = {}) {
  return useQuery({
    queryKey: ['documents', filters],
    queryFn: () => documentsApi.getDocuments(filters),
  });
}
