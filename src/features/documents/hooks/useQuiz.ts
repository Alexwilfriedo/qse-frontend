import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { documentsApi } from '../documentsApi';
import type { CreateQuizRequest, SubmitQuizAttemptRequest } from '../types';

/**
 * Hook pour récupérer le quiz d'un document.
 */
export function useDocumentQuiz(documentId: string) {
  return useQuery({
    queryKey: ['document-quiz', documentId],
    queryFn: async () => {
      try {
        return await documentsApi.getQuiz(documentId);
      } catch (error) {
        if (error instanceof AxiosError && error.response?.status === 404) {
          return null;
        }
        throw error;
      }
    },
    enabled: !!documentId,
  });
}

/**
 * Hook pour récupérer les tentatives de l'utilisateur courant.
 */
export function useMyQuizAttempts(documentId: string) {
  return useQuery({
    queryKey: ['quiz-attempts', documentId],
    queryFn: async () => {
      try {
        return await documentsApi.getMyQuizAttempts(documentId);
      } catch (error) {
        if (error instanceof AxiosError && error.response?.status === 404) {
          return [];
        }
        throw error;
      }
    },
    enabled: !!documentId,
  });
}

/**
 * Hook pour créer un quiz pour un document.
 */
export function useCreateQuiz() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ documentId, request }: { documentId: string; request: CreateQuizRequest }) =>
      documentsApi.createQuiz(documentId, request),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['document-quiz', variables.documentId] });
    },
  });
}

/**
 * Hook pour soumettre une tentative de quiz.
 */
export function useSubmitQuizAttempt() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ documentId, request }: { documentId: string; request: SubmitQuizAttemptRequest }) =>
      documentsApi.submitQuizAttempt(documentId, request),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['quiz-attempts', variables.documentId] });
    },
  });
}
