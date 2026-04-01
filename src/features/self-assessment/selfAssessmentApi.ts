import { api } from '@/lib/api';
import type {
  AssessmentAxis,
  AssessmentQuestion,
  CampaignResponseView,
  CampaignSummaryView,
  CampaignView,
  CreateAxisRequest,
  CreateCampaignRequest,
  CreateGridRequest,
  CreateQuestionRequest,
  DashboardView,
  EvolutionPointView,
  GridSummary,
  SaveResponseRequest,
  SelfAssessmentGrid,
  UpdateAxisRequest,
  UpdateGridRequest,
  UpdateQuestionRequest,
} from './types';

const BASE = '/api/v1/self-assessments';

// ========== Grids ==========

export const getGrids = () =>
  api.get<GridSummary[]>(`${BASE}/grids`).then((r) => r.data);

export const getGrid = (id: string) =>
  api.get<SelfAssessmentGrid>(`${BASE}/grids/${id}`).then((r) => r.data);

export const getActiveGrid = () =>
  api.get<SelfAssessmentGrid>(`${BASE}/grids/active`).then((r) => r.data);

export const createGrid = (data: CreateGridRequest) =>
  api.post<SelfAssessmentGrid>(`${BASE}/grids`, data).then((r) => r.data);

export const updateGrid = (id: string, data: UpdateGridRequest) =>
  api.put<SelfAssessmentGrid>(`${BASE}/grids/${id}`, data).then((r) => r.data);

export const publishGrid = (id: string) =>
  api
    .post<SelfAssessmentGrid>(`${BASE}/grids/${id}/publish`)
    .then((r) => r.data);

// ========== Axes ==========

export const addAxis = (gridId: string, data: CreateAxisRequest) =>
  api
    .post<AssessmentAxis>(`${BASE}/grids/${gridId}/axes`, data)
    .then((r) => r.data);

export const updateAxis = (
  gridId: string,
  axisId: string,
  data: UpdateAxisRequest,
) =>
  api
    .put<AssessmentAxis>(`${BASE}/grids/${gridId}/axes/${axisId}`, data)
    .then((r) => r.data);

export const removeAxis = (gridId: string, axisId: string) =>
  api.delete(`${BASE}/grids/${gridId}/axes/${axisId}`);

// ========== Questions ==========

export const addQuestion = (
  gridId: string,
  axisId: string,
  data: CreateQuestionRequest,
) =>
  api
    .post<AssessmentQuestion>(
      `${BASE}/grids/${gridId}/axes/${axisId}/questions`,
      data,
    )
    .then((r) => r.data);

export const updateQuestion = (
  gridId: string,
  axisId: string,
  questionId: string,
  data: UpdateQuestionRequest,
) =>
  api
    .put<AssessmentQuestion>(
      `${BASE}/grids/${gridId}/axes/${axisId}/questions/${questionId}`,
      data,
    )
    .then((r) => r.data);

export const removeQuestion = (
  gridId: string,
  axisId: string,
  questionId: string,
) =>
  api.delete(`${BASE}/grids/${gridId}/axes/${axisId}/questions/${questionId}`);

// ========== Campaigns ==========

export const getCampaigns = () =>
  api.get<CampaignSummaryView[]>(`${BASE}/campaigns`).then((r) => r.data);

export const getCampaign = (id: string) =>
  api.get<CampaignView>(`${BASE}/campaigns/${id}`).then((r) => r.data);

export const createCampaign = (data: CreateCampaignRequest) =>
  api.post<CampaignView>(`${BASE}/campaigns`, data).then((r) => r.data);

export const closeCampaign = (id: string) =>
  api.post<CampaignView>(`${BASE}/campaigns/${id}/close`).then((r) => r.data);

// ========== Responses ==========

export const getResponse = (campaignId: string, processId: string) =>
  api
    .get<CampaignResponseView>(
      `${BASE}/campaigns/${campaignId}/responses/${processId}`,
    )
    .then((r) => r.data);

export const saveResponse = (
  campaignId: string,
  processId: string,
  data: SaveResponseRequest,
) =>
  api
    .put<CampaignResponseView>(
      `${BASE}/campaigns/${campaignId}/responses/${processId}`,
      data,
    )
    .then((r) => r.data);

export const validateResponse = (campaignId: string, processId: string) =>
  api
    .post<CampaignResponseView>(
      `${BASE}/campaigns/${campaignId}/responses/${processId}/validate`,
    )
    .then((r) => r.data);

export const requestRevision = (campaignId: string, processId: string) =>
  api
    .post<CampaignResponseView>(
      `${BASE}/campaigns/${campaignId}/responses/${processId}/request-revision`,
    )
    .then((r) => r.data);

// ========== History ==========

export const getHistory = (processId: string) =>
  api
    .get<CampaignResponseView[]>(`${BASE}/history`, {
      params: { processId },
    })
    .then((r) => r.data);

// ========== Dashboard / Maturité (M7.3) ==========

export const getDashboard = (campaignId: string) =>
  api
    .get<DashboardView>(`${BASE}/dashboard`, {
      params: { campaignId },
    })
    .then((r) => r.data);

export const getEvolution = (processId: string) =>
  api
    .get<EvolutionPointView[]>(`${BASE}/dashboard/evolution`, {
      params: { processId },
    })
    .then((r) => r.data);
