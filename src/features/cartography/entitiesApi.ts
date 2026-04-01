import { api } from '@/lib/api';
import type {
  AssignResponsablesRequest,
  CreateEntityRequest,
  EntityTreeNode,
  OrganizationalEntity,
  UpdateEntityRequest,
} from './types';

export const entitiesApi = {
  getTree: async (): Promise<EntityTreeNode[]> => {
    const response = await api.get<EntityTreeNode[]>('/api/v1/entities/tree');
    return response.data;
  },

  getEntity: async (id: string): Promise<OrganizationalEntity> => {
    const response = await api.get<OrganizationalEntity>(`/api/v1/entities/${id}`);
    return response.data;
  },

  createEntity: async (data: CreateEntityRequest): Promise<{ id: string }> => {
    const response = await api.post<{ id: string }>('/api/v1/entities', data);
    return response.data;
  },

  updateEntity: async (id: string, data: UpdateEntityRequest): Promise<OrganizationalEntity> => {
    const response = await api.put<OrganizationalEntity>(`/api/v1/entities/${id}`, data);
    return response.data;
  },

  assignResponsables: async (id: string, data: AssignResponsablesRequest): Promise<OrganizationalEntity> => {
    const response = await api.put<OrganizationalEntity>(`/api/v1/entities/${id}/responsables`, data);
    return response.data;
  },

  deleteEntity: async (id: string): Promise<void> => {
    await api.delete(`/api/v1/entities/${id}`);
  },
};
