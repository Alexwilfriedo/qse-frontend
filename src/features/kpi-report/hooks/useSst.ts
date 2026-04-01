import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { sstApi } from '../sstApi';
import type { CreateSstEpiReportRequest, CreateSstMonthlyReportRequest } from '../sstTypes';

export function useSstMonthlyReports() {
  return useQuery({
    queryKey: ['kpi-report', 'sst', 'monthly'],
    queryFn: () => sstApi.getMonthlyReports(),
  });
}

export function useCreateSstMonthlyReport() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateSstMonthlyReportRequest) => sstApi.createMonthlyReport(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['kpi-report', 'sst'] });
    },
  });
}

export function useSstEpiReports() {
  return useQuery({
    queryKey: ['kpi-report', 'sst', 'epi'],
    queryFn: () => sstApi.getEpiReports(),
  });
}

export function useCreateSstEpiReport() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateSstEpiReportRequest) => sstApi.createEpiReport(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['kpi-report', 'sst'] });
    },
  });
}
