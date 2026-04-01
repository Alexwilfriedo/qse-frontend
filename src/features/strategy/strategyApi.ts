import { api } from '../../lib/api';
import type {
  CreateRegulatoryWatchRequest,
  CreateStakeholderRequest,
  CreateStrategicDocumentRequest,
  CreateStrategicObjectiveRequest,
  ObjectiveStatut,
  RecordKpiMeasureRequest,
  RegulatoryCategory,
  RegulatoryWatch,
  RevisionDocumentRequest,
  Stakeholder,
  StrategicDocument,
  StrategicDocumentType,
  StrategicObjective,
  StrategyDashboard,
  UpdateRegulatoryWatchRequest,
  UpdateStakeholderRequest,
  UpdateStrategicDocumentRequest,
  UpdateStrategicObjectiveRequest,
} from './types';

const DOCS_BASE = '/api/v1/strategic-documents';
const STAKEHOLDERS_BASE = '/api/v1/stakeholders';
const OBJECTIVES_BASE = '/api/v1/strategic-objectives';
const WATCHES_BASE = '/api/v1/regulatory-watches';

// ========== Dashboard ==========

export const strategyApi = {
  getDashboard: () => api.get<StrategyDashboard>(`${DOCS_BASE}/dashboard`),

  // ========== Documents Stratégiques ==========

  getDocuments: (type?: StrategicDocumentType) =>
    api.get<StrategicDocument[]>(DOCS_BASE, { params: type ? { type } : {} }),

  getDocumentById: (id: string) =>
    api.get<StrategicDocument>(`${DOCS_BASE}/${id}`),

  getDocumentsAlerts: () => api.get<StrategicDocument[]>(`${DOCS_BASE}/alerts`),

  createDocument: (data: CreateStrategicDocumentRequest) =>
    api.post<{ id: string }>(DOCS_BASE, data),

  updateDocument: (id: string, data: UpdateStrategicDocumentRequest) =>
    api.put<void>(`${DOCS_BASE}/${id}`, data),

  revisionDocument: (id: string, data: RevisionDocumentRequest) =>
    api.post<void>(`${DOCS_BASE}/${id}/revision`, data),

  deleteDocument: (id: string) => api.delete<void>(`${DOCS_BASE}/${id}`),

  // ========== Parties Intéressées ==========

  getStakeholders: () => api.get<Stakeholder[]>(STAKEHOLDERS_BASE),

  getStakeholderById: (id: string) =>
    api.get<Stakeholder>(`${STAKEHOLDERS_BASE}/${id}`),

  createStakeholder: (data: CreateStakeholderRequest) =>
    api.post<{ id: string }>(STAKEHOLDERS_BASE, data),

  updateStakeholder: (id: string, data: UpdateStakeholderRequest) =>
    api.put<void>(`${STAKEHOLDERS_BASE}/${id}`, data),

  deleteStakeholder: (id: string) =>
    api.delete<void>(`${STAKEHOLDERS_BASE}/${id}`),

  // ========== Objectifs Stratégiques ==========

  getObjectives: (statut?: ObjectiveStatut) =>
    api.get<StrategicObjective[]>(OBJECTIVES_BASE, {
      params: statut ? { statut } : {},
    }),

  getObjectiveById: (id: string) =>
    api.get<StrategicObjective>(`${OBJECTIVES_BASE}/${id}`),

  getObjectivesAlerts: () =>
    api.get<StrategicObjective[]>(`${OBJECTIVES_BASE}/alerts`),

  createObjective: (data: CreateStrategicObjectiveRequest) =>
    api.post<{ id: string }>(OBJECTIVES_BASE, data),

  updateObjective: (id: string, data: UpdateStrategicObjectiveRequest) =>
    api.put<void>(`${OBJECTIVES_BASE}/${id}`, data),

  recordMeasure: (id: string, data: RecordKpiMeasureRequest) =>
    api.post<void>(`${OBJECTIVES_BASE}/${id}/measures`, data),

  deleteObjective: (id: string) => api.delete<void>(`${OBJECTIVES_BASE}/${id}`),

  // ========== Veille Réglementaire ==========

  getWatches: (categorie?: RegulatoryCategory) =>
    api.get<RegulatoryWatch[]>(WATCHES_BASE, {
      params: categorie ? { categorie } : {},
    }),

  getWatchById: (id: string) =>
    api.get<RegulatoryWatch>(`${WATCHES_BASE}/${id}`),

  getWatchesAlerts: () => api.get<RegulatoryWatch[]>(`${WATCHES_BASE}/alerts`),

  createWatch: (data: CreateRegulatoryWatchRequest) =>
    api.post<{ id: string }>(WATCHES_BASE, data),

  updateWatch: (id: string, data: UpdateRegulatoryWatchRequest) =>
    api.put<void>(`${WATCHES_BASE}/${id}`, data),

  deleteWatch: (id: string) => api.delete<void>(`${WATCHES_BASE}/${id}`),
};
