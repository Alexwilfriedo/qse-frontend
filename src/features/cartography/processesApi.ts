import { api } from '@/lib/api';
import type {
  ChangeStatutRequest,
  CreateLinkRequest,
  CreateMaturityEvaluationRequest,
  CreateProcessRequest,
  MaturityMatrixView,
  ProcessLinkView,
  ProcessMapView,
  ProcessView,
  UpdateFipRequest,
  UpdateProcessRequest,
} from './processTypes';

export const processesApi = {
  getMap: async (): Promise<ProcessMapView> => {
    const response = await api.get<ProcessMapView>('/api/v1/processes/map');
    return response.data;
  },

  getProcess: async (id: string): Promise<ProcessView> => {
    const response = await api.get<ProcessView>(`/api/v1/processes/${id}`);
    return response.data;
  },

  getLinks: async (id: string): Promise<ProcessLinkView[]> => {
    const response = await api.get<ProcessLinkView[]>(
      `/api/v1/processes/${id}/links`,
    );
    return response.data;
  },

  createProcess: async (
    data: CreateProcessRequest,
  ): Promise<{ id: string }> => {
    const response = await api.post<{ id: string }>('/api/v1/processes', data);
    return response.data;
  },

  updateProcess: async (
    id: string,
    data: UpdateProcessRequest,
  ): Promise<ProcessView> => {
    const response = await api.put<ProcessView>(
      `/api/v1/processes/${id}`,
      data,
    );
    return response.data;
  },

  createLink: async (
    sourceId: string,
    data: CreateLinkRequest,
  ): Promise<{ id: string }> => {
    const response = await api.post<{ id: string }>(
      `/api/v1/processes/${sourceId}/links`,
      data,
    );
    return response.data;
  },

  deleteLink: async (linkId: string): Promise<void> => {
    await api.delete(`/api/v1/processes/links/${linkId}`);
  },

  updateFip: async (
    id: string,
    data: UpdateFipRequest,
  ): Promise<ProcessView> => {
    const response = await api.put<ProcessView>(
      `/api/v1/processes/${id}/fip`,
      data,
    );
    return response.data;
  },

  changeStatut: async (
    id: string,
    data: ChangeStatutRequest,
  ): Promise<ProcessView> => {
    const response = await api.put<ProcessView>(
      `/api/v1/processes/${id}/statut`,
      data,
    );
    return response.data;
  },

  deleteProcess: async (id: string): Promise<void> => {
    await api.delete(`/api/v1/processes/${id}`);
  },

  // ========== Maturité ==========

  createMaturityEvaluation: async (
    processId: string,
    data: CreateMaturityEvaluationRequest,
  ): Promise<{ id: string }> => {
    const response = await api.post<{ id: string }>(
      `/api/v1/processes/${processId}/maturity-evaluations`,
      data,
    );
    return response.data;
  },

  getMaturityMatrix: async (): Promise<MaturityMatrixView> => {
    const response = await api.get<MaturityMatrixView>(
      '/api/v1/processes/maturity-matrix',
    );
    return response.data;
  },
};
