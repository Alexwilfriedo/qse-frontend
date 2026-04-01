import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { documentsApi } from '../documentsApi';

export function useAcknowledgements(documentId: string | undefined) {
  return useQuery({
    queryKey: ['documents', documentId, 'acknowledgements'],
    queryFn: () => documentsApi.getAcknowledgements(documentId!),
    enabled: !!documentId,
  });
}

export function useAcknowledgementStats(documentId: string | undefined) {
  return useQuery({
    queryKey: ['documents', documentId, 'acknowledgements', 'stats'],
    queryFn: () => documentsApi.getAcknowledgementStats(documentId!),
    enabled: !!documentId,
  });
}

export function useMyPendingAcknowledgements() {
  return useQuery({
    queryKey: ['documents', 'my-pending-acknowledgements'],
    queryFn: () => documentsApi.getMyPendingAcknowledgements(),
  });
}

export function useRequestAcknowledgements() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, userIds }: { id: string; userIds: string[] }) =>
      documentsApi.requestAcknowledgements(id, { userIds }),
    onSuccess: (result, variables) => {
      toast.success(`${result.created} accusé(s) de lecture demandé(s)`);
      queryClient.invalidateQueries({
        queryKey: ['documents', variables.id, 'acknowledgements'],
      });
    },
    onError: () => {
      toast.error('Erreur lors de la demande');
    },
  });
}

export function useAcknowledgeDocument() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => documentsApi.acknowledgeDocument(id),
    onSuccess: (_data, id) => {
      toast.success('Lecture confirmée');
      queryClient.invalidateQueries({
        queryKey: ['documents', id, 'acknowledgements'],
      });
      queryClient.invalidateQueries({
        queryKey: ['documents', 'my-pending-acknowledgements'],
      });
    },
    onError: () => {
      toast.error('Erreur lors de la confirmation');
    },
  });
}
