import { useQuery } from '@tanstack/react-query';
import { validationApi } from '../validationApi';

export function usePendingValidations() {
  return useQuery({
    queryKey: ['validations', 'pending'],
    queryFn: () => validationApi.getPending(),
  });
}

export function useProcessValidations(processId: string) {
  return useQuery({
    queryKey: ['validations', 'process', processId],
    queryFn: () => validationApi.getByProcess(processId),
    enabled: !!processId,
  });
}

export function useHasPendingValidation(processId: string) {
  return useQuery({
    queryKey: ['validations', 'pending-check', processId],
    queryFn: () => validationApi.hasPending(processId),
    enabled: !!processId,
  });
}
