import { useQuery } from '@tanstack/react-query';
import { documentsApi } from '../documentsApi';

export function useDocument(id: string | undefined) {
  return useQuery({
    queryKey: ['document', id],
    queryFn: () => documentsApi.getDocument(id!),
    enabled: !!id,
  });
}
