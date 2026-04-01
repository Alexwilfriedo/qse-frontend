import { api } from '@/lib/api';
import type {
  CreateKpiReportIndicatorRequest,
  KpiReportDashboardStats,
  KpiReportDomain,
  KpiReportIndicator,
  RecordResultRequest,
} from './kpiReportTypes';

const BASE = '/api/v1/kpi-report/indicators';

export const kpiReportApi = {
  getByDomain: async (
    domain: KpiReportDomain,
    period?: string,
  ): Promise<KpiReportIndicator[]> => {
    const params: Record<string, string> = { domain };
    if (period) params.period = period;
    const response = await api.get<KpiReportIndicator[]>(BASE, { params });
    return response.data;
  },

  getStats: async (
    domain: KpiReportDomain,
    period?: string,
  ): Promise<KpiReportDashboardStats> => {
    const params: Record<string, string> = { domain };
    if (period) params.period = period;
    const response = await api.get<KpiReportDashboardStats>(`${BASE}/stats`, {
      params,
    });
    return response.data;
  },

  getById: async (id: string): Promise<KpiReportIndicator> => {
    const response = await api.get<KpiReportIndicator>(`${BASE}/${id}`);
    return response.data;
  },

  create: async (
    data: CreateKpiReportIndicatorRequest,
  ): Promise<KpiReportIndicator> => {
    const response = await api.post<KpiReportIndicator>(BASE, data);
    return response.data;
  },

  recordResult: async (
    id: string,
    data: RecordResultRequest,
  ): Promise<KpiReportIndicator> => {
    const response = await api.put<KpiReportIndicator>(
      `${BASE}/${id}/result`,
      data,
    );
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`${BASE}/${id}`);
  },
};
