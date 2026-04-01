import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { aesApi } from '../aesApi';
import type { AesAxisCode, CreateAesMeasurementRequest } from '../aesTypes';

export function useAesMeasurements(siteId?: string, axisCode?: AesAxisCode) {
  return useQuery({
    queryKey: ['kpi-report', 'aes', siteId, axisCode],
    queryFn: () => aesApi.getMeasurements(siteId, axisCode),
  });
}

export function useCreateAesMeasurement() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateAesMeasurementRequest) => aesApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['kpi-report', 'aes'] });
    },
  });
}

export function useUploadAesProof() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, file }: { id: string; file: File }) =>
      aesApi.uploadProof(id, file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['kpi-report', 'aes'] });
    },
  });
}
