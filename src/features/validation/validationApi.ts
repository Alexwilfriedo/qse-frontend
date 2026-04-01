import { api } from '@/lib/api';
import type {
  DecisionRequest,
  PendingCheckResponse,
  SubmitResponse,
  ValidationRequestView,
} from './validationTypes';

export const validationApi = {
  submit: async (processId: string): Promise<SubmitResponse> => {
    const response = await api.post<SubmitResponse>(`/api/v1/processes/${processId}/submit`);
    return response.data;
  },

  approve: async (id: string, data?: DecisionRequest): Promise<void> => {
    await api.put(`/api/v1/validations/${id}/approve`, data ?? {});
  },

  reject: async (id: string, data: DecisionRequest): Promise<void> => {
    await api.put(`/api/v1/validations/${id}/reject`, data);
  },

  getPending: async (): Promise<ValidationRequestView[]> => {
    const response = await api.get<ValidationRequestView[]>('/api/v1/validations/pending');
    return response.data;
  },

  getByProcess: async (processId: string): Promise<ValidationRequestView[]> => {
    const response = await api.get<ValidationRequestView[]>(`/api/v1/processes/${processId}/validations`);
    return response.data;
  },

  hasPending: async (processId: string): Promise<PendingCheckResponse> => {
    const response = await api.get<PendingCheckResponse>(`/api/v1/processes/${processId}/validations/pending`);
    return response.data;
  },
};
