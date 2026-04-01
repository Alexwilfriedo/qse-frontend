import { showToast } from '@/lib/toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { fournisseursApi } from '../fournisseursApi';
import type {
  CreateEvaluationRequest,
  CreateFournisseurRequest,
  CreateReclamationRequest,
  UpdateEvaluationRequest,
  UpdateFournisseurRequest,
  UpdateReclamationStatutRequest,
} from '../types';

export function useCreateFournisseur() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateFournisseurRequest) =>
      fournisseursApi.createFournisseur(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fournisseurs'] });
      showToast.success('Fournisseur créé avec succès');
    },
    onError: () => {
      showToast.error('Erreur lors de la création du fournisseur');
    },
  });
}

export function useUpdateFournisseur() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: UpdateFournisseurRequest;
    }) => fournisseursApi.updateFournisseur(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['fournisseurs'] });
      queryClient.invalidateQueries({
        queryKey: ['fournisseur', variables.id],
      });
      showToast.success('Fournisseur modifié avec succès');
    },
    onError: () => {
      showToast.error('Erreur lors de la modification du fournisseur');
    },
  });
}

export function useDeleteFournisseur() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => fournisseursApi.deleteFournisseur(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fournisseurs'] });
      showToast.success('Fournisseur supprimé avec succès');
    },
    onError: () => {
      showToast.error('Erreur lors de la suppression du fournisseur');
    },
  });
}

export function useCreateEvaluation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      fournisseurId,
      data,
    }: {
      fournisseurId: string;
      data: CreateEvaluationRequest;
    }) => fournisseursApi.createEvaluation(fournisseurId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['evaluations', variables.fournisseurId],
      });
      queryClient.invalidateQueries({
        queryKey: ['fournisseur', variables.fournisseurId],
      });
      showToast.success('Évaluation créée avec succès');
    },
    onError: () => {
      showToast.error("Erreur lors de la création de l'évaluation");
    },
  });
}

export function useUpdateEvaluation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      fournisseurId,
      evalId,
      data,
    }: {
      fournisseurId: string;
      evalId: string;
      data: UpdateEvaluationRequest;
    }) => fournisseursApi.updateEvaluation(fournisseurId, evalId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['evaluations', variables.fournisseurId],
      });
      showToast.success('Évaluation modifiée avec succès');
    },
    onError: () => {
      showToast.error("Erreur lors de la modification de l'évaluation");
    },
  });
}

export function useDeleteEvaluation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      fournisseurId,
      evalId,
    }: {
      fournisseurId: string;
      evalId: string;
    }) => fournisseursApi.deleteEvaluation(fournisseurId, evalId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['evaluations', variables.fournisseurId],
      });
      showToast.success('Évaluation supprimée avec succès');
    },
    onError: () => {
      showToast.error("Erreur lors de la suppression de l'évaluation");
    },
  });
}

export function useCreateReclamation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      fournisseurId,
      data,
    }: {
      fournisseurId: string;
      data: CreateReclamationRequest;
    }) => fournisseursApi.createReclamation(fournisseurId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['reclamations', variables.fournisseurId],
      });
      showToast.success('Réclamation créée avec succès');
    },
    onError: () => {
      showToast.error('Erreur lors de la création de la réclamation');
    },
  });
}

export function useUpdateReclamationStatut() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      fournisseurId,
      reclamationId,
      data,
    }: {
      fournisseurId: string;
      reclamationId: string;
      data: UpdateReclamationStatutRequest;
    }) =>
      fournisseursApi.updateReclamationStatut(
        fournisseurId,
        reclamationId,
        data,
      ),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['reclamations', variables.fournisseurId],
      });
      showToast.success('Statut de la réclamation mis à jour');
    },
    onError: () => {
      showToast.error('Erreur lors de la mise à jour du statut');
    },
  });
}
