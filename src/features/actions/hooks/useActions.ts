import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { actionsApi } from '../actionsApi';
import type { ActionsFilter, CreateActionRequest, UpdateActionRequest } from '../types';

const ACTIONS_KEY = ['actions'];

export function useActions(filters: ActionsFilter = {}) {
  return useQuery({
    queryKey: [...ACTIONS_KEY, filters],
    queryFn: () => actionsApi.getAll(filters),
  });
}

export function useAction(id: string) {
  return useQuery({
    queryKey: [...ACTIONS_KEY, id],
    queryFn: () => actionsApi.getById(id),
    enabled: !!id,
  });
}

export function useCreateAction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateActionRequest) => actionsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ACTIONS_KEY });
    },
  });
}

export function useUpdateAction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateActionRequest }) =>
      actionsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ACTIONS_KEY });
    },
  });
}

export function useDeleteAction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => actionsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ACTIONS_KEY });
    },
  });
}

// Lifecycle mutations

export function useUpdateProgress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, avancement }: { id: string; avancement: number }) =>
      actionsApi.updateProgress(id, avancement),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ACTIONS_KEY });
    },
  });
}

export function useValidateAction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, commentaire }: { id: string; commentaire?: string }) =>
      actionsApi.validate(id, commentaire),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ACTIONS_KEY });
    },
  });
}

export function useRejectAction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, motif }: { id: string; motif: string }) =>
      actionsApi.reject(id, motif),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ACTIONS_KEY });
    },
  });
}

export function useReopenAction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => actionsApi.reopen(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ACTIONS_KEY });
    },
  });
}

export function useReopenValidatedAction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, justification }: { id: string; justification: string }) =>
      actionsApi.reopenValidated(id, justification),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ACTIONS_KEY });
    },
  });
}

export function useActionHistory(id: string) {
  return useQuery({
    queryKey: [...ACTIONS_KEY, id, 'history'],
    queryFn: () => actionsApi.getHistory(id),
    enabled: !!id,
  });
}
