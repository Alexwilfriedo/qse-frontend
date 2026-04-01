import { showToast } from '@/lib/toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { documentsApi } from '../documentsApi';
import type { CreateDocumentRequest, UpdateDocumentRequest } from '../types';

export function useCreateDocument() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateDocumentRequest) =>
      documentsApi.createDocument(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
      showToast.success('Document créé avec succès');
    },
    onError: () => {
      showToast.error('Erreur lors de la création du document');
    },
  });
}

export function useUpdateDocument() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateDocumentRequest }) =>
      documentsApi.updateDocument(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
      queryClient.invalidateQueries({ queryKey: ['document', variables.id] });
      showToast.success('Document modifié avec succès');
    },
    onError: () => {
      showToast.error('Erreur lors de la modification du document');
    },
  });
}

export function useDeleteDocument() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => documentsApi.deleteDocument(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
      showToast.success('Document supprimé avec succès');
    },
    onError: () => {
      showToast.error('Erreur lors de la suppression du document');
    },
  });
}

// ========== Workflow Mutations ==========

function useWorkflowMutation(
  mutationFn: (id: string) => Promise<unknown>,
  successMessage: string,
  errorMessage: string,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn,
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
      queryClient.invalidateQueries({ queryKey: ['document', id] });
      showToast.success(successMessage);
    },
    onError: () => {
      showToast.error(errorMessage);
    },
  });
}

export function useSubmitDocument() {
  return useWorkflowMutation(
    (id) => documentsApi.submitDocument(id),
    'Document soumis à vérification',
    'Erreur lors de la soumission',
  );
}

export function useVerifyDocument() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      requireConsultation,
    }: {
      id: string;
      requireConsultation: boolean;
    }) => documentsApi.verifyDocument(id, requireConsultation),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
      queryClient.invalidateQueries({ queryKey: ['document', variables.id] });
      showToast.success('Document vérifié');
    },
    onError: () => {
      showToast.error('Erreur lors de la vérification');
    },
  });
}

export function useValidateConsultation() {
  return useWorkflowMutation(
    (id) => documentsApi.validateConsultation(id),
    'Consultation validée',
    'Erreur lors de la validation de consultation',
  );
}

export function usePublishDocument() {
  return useWorkflowMutation(
    (id) => documentsApi.publishDocument(id),
    'Document publié',
    'Erreur lors de la publication',
  );
}

export function useRejectDocument() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, motif }: { id: string; motif: string }) =>
      documentsApi.rejectDocument(id, motif),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
      queryClient.invalidateQueries({ queryKey: ['document', variables.id] });
      showToast.success('Document rejeté');
    },
    onError: () => {
      showToast.error('Erreur lors du rejet');
    },
  });
}

export function useResumeEditing() {
  return useWorkflowMutation(
    (id) => documentsApi.resumeEditing(id),
    'Édition reprise',
    "Erreur lors de la reprise d'édition",
  );
}

export function useArchiveDocument() {
  return useWorkflowMutation(
    (id) => documentsApi.archiveDocument(id),
    'Document archivé',
    "Erreur lors de l'archivage",
  );
}

// ========== File Upload ==========

export function useUploadFile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, file }: { id: string; file: File }) =>
      documentsApi.uploadFile(id, file),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['document', variables.id] });
      showToast.success('Fichier uploadé avec succès');
    },
    onError: () => {
      showToast.error("Erreur lors de l'upload du fichier");
    },
  });
}
