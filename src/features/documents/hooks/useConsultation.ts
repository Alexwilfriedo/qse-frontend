import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { documentsApi } from '../documentsApi';
import type { CastVoteRequest } from '../types';

export function useConsultationVotes(documentId: string | undefined) {
  return useQuery({
    queryKey: ['documents', documentId, 'consultation', 'votes'],
    queryFn: () => documentsApi.getConsultationVotes(documentId!),
    enabled: !!documentId,
  });
}

export function useConsultationStatus(documentId: string | undefined) {
  return useQuery({
    queryKey: ['documents', documentId, 'consultation', 'status'],
    queryFn: () => documentsApi.getConsultationStatus(documentId!),
    enabled: !!documentId,
  });
}

export function useCastVote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: CastVoteRequest }) =>
      documentsApi.castConsultationVote(id, data),
    onSuccess: (_vote, variables) => {
      toast.success('Vote enregistré');
      queryClient.invalidateQueries({
        queryKey: ['documents', variables.id, 'consultation'],
      });
    },
    onError: () => {
      toast.error("Erreur lors de l'enregistrement du vote");
    },
  });
}
