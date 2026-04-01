import { api } from '@/lib/api';
import type {
  CreateWorkUnitRequest,
  UpdateWorkUnitRequest,
  WorkUnitView,
} from './workUnitTypes';

export const workUnitsApi = {
  list: async (): Promise<WorkUnitView[]> => {
    const response = await api.get<WorkUnitView[]>('/api/v1/work-units');
    return response.data;
  },

  get: async (id: string): Promise<WorkUnitView> => {
    const response = await api.get<WorkUnitView>(`/api/v1/work-units/${id}`);
    return response.data;
  },

  create: async (data: CreateWorkUnitRequest): Promise<{ id: string }> => {
    const response = await api.post<{ id: string }>('/api/v1/work-units', data);
    return response.data;
  },

  update: async (id: string, data: UpdateWorkUnitRequest): Promise<WorkUnitView> => {
    const response = await api.put<WorkUnitView>(`/api/v1/work-units/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/api/v1/work-units/${id}`);
  },
};
