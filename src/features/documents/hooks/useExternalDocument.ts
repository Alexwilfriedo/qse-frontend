import { useMutation, useQueryClient } from '@tanstack/react-query';
import { documentsApi } from '../documentsApi';

/**
 * Hook pour définir la référence externe d'un document.
 */
export function useSetReferenceExterne() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, referenceExterne }: { id: string; referenceExterne: string }) =>
      documentsApi.setReferenceExterne(id, referenceExterne),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['document', variables.id] });
    },
  });
}

/**
 * Hook pour lier un document à un processus et définir sa date de validité.
 */
export function useSetProcessusLink() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      processusId,
      dateValidite,
    }: {
      id: string;
      processusId: string | null;
      dateValidite: string | null;
    }) => documentsApi.setProcessusLink(id, processusId, dateValidite),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['document', variables.id] });
    },
  });
}
