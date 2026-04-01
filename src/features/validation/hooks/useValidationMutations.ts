import { useMutation, useQueryClient } from '@tanstack/react-query';
import { showToast } from '@/lib/toast';
import { validationApi } from '../validationApi';
import type { DecisionRequest } from '../validationTypes';

export function useSubmitForValidation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (processId: string) => validationApi.submit(processId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['validations'] });
      queryClient.invalidateQueries({ queryKey: ['processes'] });
      showToast.success('Processus soumis à validation');
    },
  });
}

export function useApproveValidation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data?: DecisionRequest }) =>
      validationApi.approve(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['validations'] });
      queryClient.invalidateQueries({ queryKey: ['processes'] });
      showToast.success('Demande approuvée');
    },
  });
}

export function useRejectValidation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: DecisionRequest }) =>
      validationApi.reject(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['validations'] });
      queryClient.invalidateQueries({ queryKey: ['processes'] });
      showToast.success('Demande rejetée');
    },
  });
}
