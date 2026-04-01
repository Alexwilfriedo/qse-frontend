import { showToast } from '@/lib/toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { kpiApi } from '../kpiApi';
import type {
  CreateIndicatorRequest,
  RecordMeasurementRequest,
  UpdateIndicatorRequest,
} from '../kpiTypes';

export function useCreateIndicator() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateIndicatorRequest) => kpiApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['kpi'] });
      showToast.success('Indicateur créé');
    },
  });
}

export function useUpdateIndicator() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateIndicatorRequest }) =>
      kpiApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['kpi'] });
      showToast.success('Indicateur mis à jour');
    },
  });
}

export function useRecordMeasurement() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      indicatorId,
      data,
    }: {
      indicatorId: string;
      data: RecordMeasurementRequest;
    }) => kpiApi.recordMeasurement(indicatorId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['kpi'] });
      showToast.success('Mesure enregistrée');
    },
  });
}
