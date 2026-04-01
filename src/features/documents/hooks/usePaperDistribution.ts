import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { documentsApi } from '../documentsApi';

/**
 * Hook pour récupérer les distributions papier d'un document.
 */
export function usePaperDistributions(documentId: string) {
  return useQuery({
    queryKey: ['paper-distributions', documentId],
    queryFn: () => documentsApi.getPaperDistributions(documentId),
    enabled: !!documentId,
  });
}

/**
 * Hook pour créer une distribution papier.
 */
export function useCreatePaperDistribution() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ documentId, recipientId }: { documentId: string; recipientId: string }) =>
      documentsApi.createPaperDistribution(documentId, recipientId),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['paper-distributions', variables.documentId] });
    },
  });
}

/**
 * Hook pour mettre à jour le statut d'une distribution papier.
 */
export function useUpdatePaperDistributionStatus(documentId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      distributionId,
      action,
      newVersion,
    }: {
      distributionId: string;
      action: string;
      newVersion?: string;
    }) => documentsApi.updatePaperDistributionStatus(distributionId, action, newVersion),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['paper-distributions', documentId] });
    },
  });
}
