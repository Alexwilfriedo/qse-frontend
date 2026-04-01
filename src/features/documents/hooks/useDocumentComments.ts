import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { documentsApi } from '../documentsApi';
import type { AddCommentRequest } from '../types';

export function useDocumentComments(documentId: string | undefined) {
  return useQuery({
    queryKey: ['documents', documentId, 'comments'],
    queryFn: () => documentsApi.getComments(documentId!),
    enabled: !!documentId,
  });
}

export function useAddComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: AddCommentRequest }) =>
      documentsApi.addComment(id, data),
    onSuccess: (_comment, variables) => {
      toast.success('Commentaire ajouté');
      queryClient.invalidateQueries({
        queryKey: ['documents', variables.id, 'comments'],
      });
    },
    onError: () => {
      toast.error("Erreur lors de l'ajout du commentaire");
    },
  });
}

export function useResolveComment(documentId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (commentId: string) => documentsApi.resolveComment(commentId),
    onSuccess: () => {
      toast.success('Commentaire résolu');
      if (documentId) {
        queryClient.invalidateQueries({
          queryKey: ['documents', documentId, 'comments'],
        });
      }
    },
    onError: () => {
      toast.error('Erreur lors de la résolution');
    },
  });
}
