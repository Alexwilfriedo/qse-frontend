import { api } from '@/lib/api';
import type {
  CreateIndicatorRequest,
  IndicatorDashboardView,
  IndicatorView,
  MeasurementView,
  RecordMeasurementRequest,
  UpdateIndicatorRequest,
} from './kpiTypes';

export const kpiApi = {
  getDashboard: async (processId?: string): Promise<IndicatorDashboardView[]> => {
    const params = processId ? { processId } : {};
    const response = await api.get<IndicatorDashboardView[]>('/api/v1/indicators/dashboard', { params });
    return response.data;
  },

  getByProcess: async (processId: string): Promise<IndicatorView[]> => {
    const response = await api.get<IndicatorView[]>(`/api/v1/indicators/by-process/${processId}`);
    return response.data;
  },

  getById: async (id: string): Promise<IndicatorView> => {
    const response = await api.get<IndicatorView>(`/api/v1/indicators/${id}`);
    return response.data;
  },

  create: async (data: CreateIndicatorRequest): Promise<IndicatorView> => {
    const response = await api.post<IndicatorView>('/api/v1/indicators', data);
    return response.data;
  },

  update: async (id: string, data: UpdateIndicatorRequest): Promise<IndicatorView> => {
    const response = await api.put<IndicatorView>(`/api/v1/indicators/${id}`, data);
    return response.data;
  },

  getMeasurements: async (indicatorId: string): Promise<MeasurementView[]> => {
    const response = await api.get<MeasurementView[]>(`/api/v1/indicators/${indicatorId}/measurements`);
    return response.data;
  },

  recordMeasurement: async (indicatorId: string, data: RecordMeasurementRequest): Promise<MeasurementView> => {
    const response = await api.post<MeasurementView>(`/api/v1/indicators/${indicatorId}/measurements`, data);
    return response.data;
  },
};
