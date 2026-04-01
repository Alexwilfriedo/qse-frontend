import { api } from '@/lib/api';
import type {
  CreateSstEpiReportRequest,
  CreateSstMonthlyReportRequest,
  SstEpiReport,
  SstMonthlyReport,
} from './sstTypes';

const BASE = '/api/v1/kpi-report/sst';

export const sstApi = {
  getMonthlyReports: async (): Promise<SstMonthlyReport[]> => {
    const response = await api.get<SstMonthlyReport[]>(`${BASE}/monthly`);
    return response.data;
  },

  createMonthlyReport: async (data: CreateSstMonthlyReportRequest): Promise<SstMonthlyReport> => {
    const response = await api.post<SstMonthlyReport>(`${BASE}/monthly`, data);
    return response.data;
  },

  getEpiReports: async (): Promise<SstEpiReport[]> => {
    const response = await api.get<SstEpiReport[]>(`${BASE}/epi`);
    return response.data;
  },

  createEpiReport: async (data: CreateSstEpiReportRequest): Promise<SstEpiReport> => {
    const response = await api.post<SstEpiReport>(`${BASE}/epi`, data);
    return response.data;
  },
};
