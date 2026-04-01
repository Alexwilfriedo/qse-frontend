import { useQuery } from '@tanstack/react-query';
import { kpiApi } from '../kpiApi';

export function useDashboard(processId?: string) {
  return useQuery({
    queryKey: ['kpi', 'dashboard', processId],
    queryFn: () => kpiApi.getDashboard(processId),
  });
}

export function useIndicatorsByProcess(processId: string) {
  return useQuery({
    queryKey: ['kpi', 'indicators', processId],
    queryFn: () => kpiApi.getByProcess(processId),
    enabled: !!processId,
  });
}

export function useIndicator(id: string) {
  return useQuery({
    queryKey: ['kpi', 'indicator', id],
    queryFn: () => kpiApi.getById(id),
    enabled: !!id,
  });
}

export function useMeasurements(indicatorId: string) {
  return useQuery({
    queryKey: ['kpi', 'measurements', indicatorId],
    queryFn: () => kpiApi.getMeasurements(indicatorId),
    enabled: !!indicatorId,
  });
}
