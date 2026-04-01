import { api } from '@/lib/api';
import type {
  CreateEvaluationRequest,
  CreateFournisseurRequest,
  CreateReclamationRequest,
  EvaluationFournisseur,
  Fournisseur,
  FournisseurFilters,
  FournisseursPage,
  ReclamationFournisseur,
  UpdateEvaluationRequest,
  UpdateFournisseurRequest,
  UpdateReclamationStatutRequest,
} from './types';

export const fournisseursApi = {
  getFournisseurs: async (
    filters: FournisseurFilters = {},
  ): Promise<FournisseursPage> => {
    const params = new URLSearchParams();
    if (filters.search) params.append('search', filters.search);
    if (filters.statut) params.append('statut', filters.statut);
    if (filters.categorie) params.append('categorie', filters.categorie);
    if (filters.criticite) params.append('criticite', filters.criticite);
    if (filters.page !== undefined) params.append('page', String(filters.page));
    if (filters.size !== undefined) params.append('size', String(filters.size));

    const response = await api.get<FournisseursPage>(
      `/api/v1/fournisseurs?${params.toString()}`,
    );
    return response.data;
  },

  getFournisseur: async (id: string): Promise<Fournisseur> => {
    const response = await api.get<Fournisseur>(`/api/v1/fournisseurs/${id}`);
    return response.data;
  },

  createFournisseur: async (
    data: CreateFournisseurRequest,
  ): Promise<{ id: string }> => {
    const response = await api.post<{ id: string }>(
      '/api/v1/fournisseurs',
      data,
    );
    return response.data;
  },

  updateFournisseur: async (
    id: string,
    data: UpdateFournisseurRequest,
  ): Promise<void> => {
    await api.put(`/api/v1/fournisseurs/${id}`, data);
  },

  deleteFournisseur: async (id: string): Promise<void> => {
    await api.delete(`/api/v1/fournisseurs/${id}`);
  },

  // ========== Évaluations ==========

  getEvaluations: async (
    fournisseurId: string,
  ): Promise<EvaluationFournisseur[]> => {
    const response = await api.get<EvaluationFournisseur[]>(
      `/api/v1/fournisseurs/${fournisseurId}/evaluations`,
    );
    return response.data;
  },

  getEvaluation: async (
    fournisseurId: string,
    evalId: string,
  ): Promise<EvaluationFournisseur> => {
    const response = await api.get<EvaluationFournisseur>(
      `/api/v1/fournisseurs/${fournisseurId}/evaluations/${evalId}`,
    );
    return response.data;
  },

  createEvaluation: async (
    fournisseurId: string,
    data: CreateEvaluationRequest,
  ): Promise<{ id: string }> => {
    const response = await api.post<{ id: string }>(
      `/api/v1/fournisseurs/${fournisseurId}/evaluations`,
      data,
    );
    return response.data;
  },

  updateEvaluation: async (
    fournisseurId: string,
    evalId: string,
    data: UpdateEvaluationRequest,
  ): Promise<void> => {
    await api.put(
      `/api/v1/fournisseurs/${fournisseurId}/evaluations/${evalId}`,
      data,
    );
  },

  deleteEvaluation: async (
    fournisseurId: string,
    evalId: string,
  ): Promise<void> => {
    await api.delete(
      `/api/v1/fournisseurs/${fournisseurId}/evaluations/${evalId}`,
    );
  },

  // ========== Réclamations ==========

  getReclamations: async (
    fournisseurId: string,
  ): Promise<ReclamationFournisseur[]> => {
    const response = await api.get<ReclamationFournisseur[]>(
      `/api/v1/fournisseurs/${fournisseurId}/reclamations`,
    );
    return response.data;
  },

  createReclamation: async (
    fournisseurId: string,
    data: CreateReclamationRequest,
  ): Promise<{ id: string }> => {
    const response = await api.post<{ id: string }>(
      `/api/v1/fournisseurs/${fournisseurId}/reclamations`,
      data,
    );
    return response.data;
  },

  updateReclamationStatut: async (
    fournisseurId: string,
    reclamationId: string,
    data: UpdateReclamationStatutRequest,
  ): Promise<void> => {
    await api.put(
      `/api/v1/fournisseurs/${fournisseurId}/reclamations/${reclamationId}/statut`,
      data,
    );
  },
};
