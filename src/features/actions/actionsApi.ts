import { api } from '@/lib/api';
import type {
  Action,
  ActionDashboard,
  ActionHistoryView,
  ActionsFilter,
  CreateActionRequest,
  PaginatedResponse,
  UpdateActionRequest,
} from './types';

export const actionsApi = {
  getAll: async (
    filters: ActionsFilter = {},
  ): Promise<PaginatedResponse<Action>> => {
    const params = new URLSearchParams();
    if (filters.statut) params.append('statut', filters.statut);
    if (filters.domaine) params.append('domaine', filters.domaine);
    if (filters.type) params.append('type', filters.type);
    if (filters.priorite) params.append('priorite', filters.priorite);
    if (filters.responsableId)
      params.append('responsableId', filters.responsableId);
    if (filters.verificateurId)
      params.append('verificateurId', filters.verificateurId);
    if (filters.enRetard !== undefined)
      params.append('enRetard', String(filters.enRetard));
    if (filters.echeanceDebut)
      params.append('echeanceDebut', filters.echeanceDebut);
    if (filters.echeanceFin) params.append('echeanceFin', filters.echeanceFin);
    if (filters.search) params.append('search', filters.search);
    if (filters.sort) params.append('sort', filters.sort);
    if (filters.origineId) params.append('origineId', filters.origineId);
    params.append('page', String(filters.page ?? 0));
    params.append('size', String(filters.size ?? 20));

    const response = await api.get<PaginatedResponse<Action>>(
      `/api/v1/actions?${params}`,
    );
    return response.data;
  },

  getById: async (id: string): Promise<Action> => {
    const response = await api.get<Action>(`/api/v1/actions/${id}`);
    return response.data;
  },

  create: async (data: CreateActionRequest): Promise<{ id: string }> => {
    const response = await api.post<{ id: string }>('/api/v1/actions', data);
    return response.data;
  },

  update: async (id: string, data: UpdateActionRequest): Promise<Action> => {
    const response = await api.put<Action>(`/api/v1/actions/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/api/v1/actions/${id}`);
  },

  getDashboard: async (): Promise<ActionDashboard> => {
    const response = await api.get<ActionDashboard>(
      '/api/v1/actions/dashboard',
    );
    return response.data;
  },

  // Lifecycle endpoints
  updateProgress: async (id: string, avancement: number): Promise<Action> => {
    const response = await api.put<Action>(`/api/v1/actions/${id}/progress`, {
      avancement,
    });
    return response.data;
  },

  validate: async (id: string, commentaire?: string): Promise<Action> => {
    const response = await api.post<Action>(`/api/v1/actions/${id}/validate`, {
      commentaire,
    });
    return response.data;
  },

  reject: async (id: string, motif: string): Promise<Action> => {
    const response = await api.post<Action>(`/api/v1/actions/${id}/reject`, {
      motif,
    });
    return response.data;
  },

  reopen: async (id: string): Promise<Action> => {
    const response = await api.post<Action>(`/api/v1/actions/${id}/reopen`);
    return response.data;
  },

  reopenValidated: async (
    id: string,
    justification: string,
  ): Promise<Action> => {
    const response = await api.post<Action>(
      `/api/v1/actions/${id}/reopen-validated`,
      { justification },
    );
    return response.data;
  },

  getHistory: async (id: string): Promise<ActionHistoryView> => {
    const response = await api.get<ActionHistoryView>(
      `/api/v1/actions/${id}/history`,
    );
    return response.data;
  },
};
