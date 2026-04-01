import { useMutation, useQueryClient } from '@tanstack/react-query';
import { showToast } from '@/lib/toast';
import { entitiesApi } from '../entitiesApi';
import type { CreateEntityRequest, UpdateEntityRequest, AssignResponsablesRequest } from '../types';

export function useCreateEntity() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateEntityRequest) => entitiesApi.createEntity(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['entities'] });
      showToast.success('Entité créée avec succès');
    },
  });
}

export function useUpdateEntity() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateEntityRequest }) =>
      entitiesApi.updateEntity(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['entities'] });
      showToast.success('Entité modifiée avec succès');
    },
  });
}

export function useAssignResponsables() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: AssignResponsablesRequest }) =>
      entitiesApi.assignResponsables(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['entities'] });
      showToast.success('Responsables assignés avec succès');
    },
  });
}

export function useDeleteEntity() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => entitiesApi.deleteEntity(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['entities'] });
      showToast.success('Entité supprimée');
    },
  });
}
