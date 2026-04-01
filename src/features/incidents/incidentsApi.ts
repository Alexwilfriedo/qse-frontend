import { api } from '@/lib/api';
import type {
  CreateCorrectiveActionRequest,
  CreateIncidentRequest,
  FiveWhyRequest,
  Incident,
  IncidentFilters,
  PageResponse,
  UpdateIncidentRequest,
} from './types';

const BASE = '/api/v1/incidents';

export const getIncidents = (filters: IncidentFilters) =>
  api
    .get<PageResponse<Incident>>(BASE, { params: filters })
    .then((r) => r.data);

export const getIncidentById = (id: string) =>
  api.get<Incident>(`${BASE}/${id}`).then((r) => r.data);

export const createIncident = (data: CreateIncidentRequest) =>
  api.post<{ id: string }>(BASE, data).then((r) => r.data);

export const updateIncident = (id: string, data: UpdateIncidentRequest) =>
  api.put<{ id: string }>(`${BASE}/${id}`, data).then((r) => r.data);

export const analyzeFiveWhy = (id: string, data: FiveWhyRequest) =>
  api.put<{ id: string }>(`${BASE}/${id}/five-why`, data).then((r) => r.data);

export const startTreatment = (id: string) =>
  api.put<{ id: string }>(`${BASE}/${id}/start-treatment`).then((r) => r.data);

export const closeIncident = (id: string) =>
  api.put<{ id: string }>(`${BASE}/${id}/close`).then((r) => r.data);

export const linkRisk = (id: string, riskId: string) =>
  api
    .put<{ id: string }>(`${BASE}/${id}/link-risk/${riskId}`)
    .then((r) => r.data);

// ========== Actions correctives → M3 ==========

export const createCorrectiveAction = (
  incidentId: string,
  data: CreateCorrectiveActionRequest,
) =>
  api
    .post<{ id: string }>(`${BASE}/${incidentId}/corrective-actions`, data)
    .then((r) => r.data);
