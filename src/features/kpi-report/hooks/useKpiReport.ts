import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { kpiReportApi } from '../kpiReportApi';
import type {
  CreateKpiReportIndicatorRequest,
  KpiReportDomain,
  RecordResultRequest,
} from '../kpiReportTypes';

const KEYS = {
  indicators: (domain: KpiReportDomain, period?: string) =>
    ['kpi-report', 'indicators', domain, period] as const,
  stats: (domain: KpiReportDomain, period?: string) =>
    ['kpi-report', 'stats', domain, period] as const,
  detail: (id: string) => ['kpi-report', 'indicator', id] as const,
};

export function useKpiReportIndicators(
  domain: KpiReportDomain,
  period?: string,
) {
  return useQuery({
    queryKey: KEYS.indicators(domain, period),
    queryFn: () => kpiReportApi.getByDomain(domain, period),
  });
}

export function useKpiReportStats(domain: KpiReportDomain, period?: string) {
  return useQuery({
    queryKey: KEYS.stats(domain, period),
    queryFn: () => kpiReportApi.getStats(domain, period),
  });
}

export function useCreateKpiReportIndicator(domain: KpiReportDomain) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateKpiReportIndicatorRequest) =>
      kpiReportApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['kpi-report', 'indicators', domain],
      });
      queryClient.invalidateQueries({
        queryKey: ['kpi-report', 'stats', domain],
      });
    },
  });
}

export function useRecordResult(domain: KpiReportDomain) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: RecordResultRequest }) =>
      kpiReportApi.recordResult(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['kpi-report', 'indicators', domain],
      });
      queryClient.invalidateQueries({
        queryKey: ['kpi-report', 'stats', domain],
      });
    },
  });
}

export function useDeleteKpiReportIndicator(domain: KpiReportDomain) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => kpiReportApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['kpi-report', 'indicators', domain],
      });
      queryClient.invalidateQueries({
        queryKey: ['kpi-report', 'stats', domain],
      });
    },
  });
}
