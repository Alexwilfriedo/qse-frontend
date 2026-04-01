import { showToast } from '@/lib/toast';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { workUnitsApi } from '../workUnitsApi';
import type {
  CreateWorkUnitRequest,
  UpdateWorkUnitRequest,
} from '../workUnitTypes';

const KEYS = {
  list: ['workUnits'] as const,
  detail: (id: string) => ['workUnits', id] as const,
};

export function useWorkUnits() {
  return useQuery({
    queryKey: KEYS.list,
    queryFn: () => workUnitsApi.list(),
  });
}

export function useWorkUnit(id: string | undefined) {
  return useQuery({
    queryKey: id ? KEYS.detail(id) : KEYS.detail(''),
    queryFn: () => workUnitsApi.get(id!),
    enabled: !!id,
  });
}

export function useCreateWorkUnit() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateWorkUnitRequest) => workUnitsApi.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEYS.list });
      showToast.success('Unité de travail créée');
    },
    onError: () => {
      showToast.error("Erreur lors de la création de l'unité de travail");
    },
  });
}

export function useUpdateWorkUnit() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateWorkUnitRequest }) =>
      workUnitsApi.update(id, data),
    onSuccess: (_, variables) => {
      qc.invalidateQueries({ queryKey: KEYS.list });
      qc.invalidateQueries({ queryKey: KEYS.detail(variables.id) });
      showToast.success('Unité de travail modifiée');
    },
    onError: () => {
      showToast.error("Erreur lors de la modification de l'unité de travail");
    },
  });
}

export function useDeleteWorkUnit() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => workUnitsApi.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEYS.list });
      showToast.success('Unité de travail supprimée');
    },
    onError: () => {
      showToast.error("Erreur lors de la suppression de l'unité de travail");
    },
  });
}
