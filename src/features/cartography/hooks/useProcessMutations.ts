import { showToast } from '@/lib/toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { processesApi } from '../processesApi';
import type {
  ChangeStatutRequest,
  CreateLinkRequest,
  CreateMaturityEvaluationRequest,
  CreateProcessRequest,
  UpdateFipRequest,
  UpdateProcessRequest,
} from '../processTypes';

export function useCreateProcess() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateProcessRequest) =>
      processesApi.createProcess(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['processes'] });
      showToast.success('Processus créé avec succès');
    },
  });
}

export function useUpdateProcess() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateProcessRequest }) =>
      processesApi.updateProcess(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['processes'] });
      showToast.success('Processus modifié avec succès');
    },
  });
}

export function useCreateLink() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      sourceId,
      data,
    }: {
      sourceId: string;
      data: CreateLinkRequest;
    }) => processesApi.createLink(sourceId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['processes'] });
      showToast.success('Lien créé avec succès');
    },
  });
}

export function useDeleteLink() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (linkId: string) => processesApi.deleteLink(linkId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['processes'] });
      showToast.success('Lien supprimé');
    },
  });
}

export function useUpdateFip() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateFipRequest }) =>
      processesApi.updateFip(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['processes'] });
      showToast.success("Fiche d'identité mise à jour");
    },
  });
}

export function useChangeStatut() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: ChangeStatutRequest }) =>
      processesApi.changeStatut(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['processes'] });
      showToast.success('Statut modifié');
    },
  });
}

export function useDeleteProcess() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => processesApi.deleteProcess(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['processes'] });
      showToast.success('Processus supprimé');
    },
  });
}

export function useCreateMaturityEvaluation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      processId,
      data,
    }: {
      processId: string;
      data: CreateMaturityEvaluationRequest;
    }) => processesApi.createMaturityEvaluation(processId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['processes'] });
      showToast.success('Évaluation de maturité enregistrée');
    },
  });
}
