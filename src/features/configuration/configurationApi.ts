import { api } from '@/lib/api';

// ========== Reference Items (générique) ==========

export type ReferenceCategory =
  | 'action-types'
  | 'action-priorities'
  | 'action-origins'
  | 'action-statuses'
  | 'audit-types'
  | 'audit-statuses'
  | 'campaign-statuses'
  | 'process-types'
  | 'entity-types'
  | 'process-link-types'
  | 'document-statuses'
  | 'incident-locations'
  | 'incident-immediate-consequences'
  | 'incident-trigger-factors'
  | 'opportunity-origins'
  | 'opportunity-types'
  | 'opportunity-feasibility-levels'
  | 'opportunity-benefit-levels'
  | 'opportunity-score-levels';

export const REFERENCE_CATEGORY_LABELS: Record<ReferenceCategory, string> = {
  'action-types': "Types d'action",
  'action-priorities': "Priorités d'action",
  'action-origins': "Origines d'action",
  'action-statuses': "Statuts d'action",
  'audit-types': "Types d'audit",
  'audit-statuses': "Statuts d'audit",
  'campaign-statuses': 'Statuts de campagne',
  'process-types': 'Types de processus',
  'entity-types': "Types d'entité",
  'process-link-types': 'Types de lien processus',
  'document-statuses': 'Statuts de document',
  'incident-locations': 'Localisations',
  'incident-immediate-consequences': 'Conséquences immédiates',
  'incident-trigger-factors': 'Facteurs déclencheurs',
  'opportunity-origins': 'Origines',
  'opportunity-types': "Types d'opportunité",
  'opportunity-feasibility-levels': 'Faisabilité',
  'opportunity-benefit-levels': 'Critères',
  'opportunity-score-levels': 'Score',
};

export interface ReferenceItem {
  id: string;
  category: string;
  code: string;
  label: string;
  description: string | null;
  color: string | null;
  icon: string | null;
  active: boolean;
  displayOrder: number;
}

export interface CreateReferenceItemRequest {
  code: string;
  label: string;
  description?: string;
  color?: string;
  icon?: string;
  displayOrder?: number;
}

export interface UpdateReferenceItemRequest {
  label: string;
  description?: string;
  color?: string;
  icon?: string;
  displayOrder?: number;
}

export const referenceApi = {
  getByCategory: async (
    category: ReferenceCategory,
    activeOnly = false,
  ): Promise<ReferenceItem[]> => {
    const response = await api.get<ReferenceItem[]>(
      `/api/v1/config/references/${category}?activeOnly=${activeOnly}`,
    );
    return response.data;
  },

  create: async (
    category: ReferenceCategory,
    data: CreateReferenceItemRequest,
  ): Promise<ReferenceItem> => {
    const response = await api.post<ReferenceItem>(
      `/api/v1/config/references/${category}`,
      data,
    );
    return response.data;
  },

  update: async (
    category: ReferenceCategory,
    id: string,
    data: UpdateReferenceItemRequest,
  ): Promise<ReferenceItem> => {
    const response = await api.put<ReferenceItem>(
      `/api/v1/config/references/${category}/${id}`,
      data,
    );
    return response.data;
  },

  activate: async (category: ReferenceCategory, id: string): Promise<void> => {
    await api.post(`/api/v1/config/references/${category}/${id}/activate`);
  },

  deactivate: async (
    category: ReferenceCategory,
    id: string,
  ): Promise<void> => {
    await api.post(`/api/v1/config/references/${category}/${id}/deactivate`);
  },

  delete: async (category: ReferenceCategory, id: string): Promise<void> => {
    await api.delete(`/api/v1/config/references/${category}/${id}`);
  },
};

// ========== Document Types & Domaines (legacy) ==========

// Types
export interface DocumentTypeConfig {
  id: string;
  code: string;
  label: string;
  description: string | null;
  active: boolean;
  displayOrder: number;
}

export interface DocumentDomaineConfig {
  id: string;
  code: string;
  label: string;
  description: string | null;
  color: string;
  active: boolean;
  displayOrder: number;
}

export interface CreateDocumentTypeRequest {
  code: string;
  label: string;
  description?: string;
  displayOrder?: number;
}

export interface UpdateDocumentTypeRequest {
  label: string;
  description?: string;
  displayOrder?: number;
}

export interface CreateDocumentDomaineRequest {
  code: string;
  label: string;
  description?: string;
  color?: string;
  displayOrder?: number;
}

export interface UpdateDocumentDomaineRequest {
  label: string;
  description?: string;
  color?: string;
  displayOrder?: number;
}

// API
export const configurationApi = {
  // Reference Items (raccourci)
  references: referenceApi,

  // Document Types
  getDocumentTypes: async (
    activeOnly = false,
  ): Promise<DocumentTypeConfig[]> => {
    const response = await api.get<DocumentTypeConfig[]>(
      `/api/v1/config/document-types?activeOnly=${activeOnly}`,
    );
    return response.data;
  },

  createDocumentType: async (
    data: CreateDocumentTypeRequest,
  ): Promise<DocumentTypeConfig> => {
    const response = await api.post<DocumentTypeConfig>(
      '/api/v1/config/document-types',
      data,
    );
    return response.data;
  },

  updateDocumentType: async (
    id: string,
    data: UpdateDocumentTypeRequest,
  ): Promise<DocumentTypeConfig> => {
    const response = await api.put<DocumentTypeConfig>(
      `/api/v1/config/document-types/${id}`,
      data,
    );
    return response.data;
  },

  activateDocumentType: async (id: string): Promise<void> => {
    await api.post(`/api/v1/config/document-types/${id}/activate`);
  },

  deactivateDocumentType: async (id: string): Promise<void> => {
    await api.post(`/api/v1/config/document-types/${id}/deactivate`);
  },

  deleteDocumentType: async (id: string): Promise<void> => {
    await api.delete(`/api/v1/config/document-types/${id}`);
  },

  // Document Domaines
  getDocumentDomaines: async (
    activeOnly = false,
  ): Promise<DocumentDomaineConfig[]> => {
    const response = await api.get<DocumentDomaineConfig[]>(
      `/api/v1/config/document-domaines?activeOnly=${activeOnly}`,
    );
    return response.data;
  },

  createDocumentDomaine: async (
    data: CreateDocumentDomaineRequest,
  ): Promise<DocumentDomaineConfig> => {
    const response = await api.post<DocumentDomaineConfig>(
      '/api/v1/config/document-domaines',
      data,
    );
    return response.data;
  },

  updateDocumentDomaine: async (
    id: string,
    data: UpdateDocumentDomaineRequest,
  ): Promise<DocumentDomaineConfig> => {
    const response = await api.put<DocumentDomaineConfig>(
      `/api/v1/config/document-domaines/${id}`,
      data,
    );
    return response.data;
  },

  activateDocumentDomaine: async (id: string): Promise<void> => {
    await api.post(`/api/v1/config/document-domaines/${id}/activate`);
  },

  deactivateDocumentDomaine: async (id: string): Promise<void> => {
    await api.post(`/api/v1/config/document-domaines/${id}/deactivate`);
  },

  deleteDocumentDomaine: async (id: string): Promise<void> => {
    await api.delete(`/api/v1/config/document-domaines/${id}`);
  },
};
