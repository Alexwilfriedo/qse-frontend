import { api } from '@/lib/api';
import type {
  AddDocumentLinkRequest,
  CatalogType,
  ComparisonMatrix,
  CreateCatalogItemRequest,
  CreateMeasureRequest,
  CreateOpportunityRequest,
  CreateRiskRequest,
  CriticalityThreshold,
  DuerpReport,
  EnvironmentalReport,
  EvaluateResidualRequest,
  MatrixData,
  MeasureWithRiskView,
  Opportunity,
  PageResponse,
  ProcessRiskReport,
  Risk,
  RiskCatalogItem,
  RiskDocumentLink,
  RiskFilters,
  RiskKpi,
  RiskMitigationMeasure,
  RiskScale,
  RiskStatistics,
  SaveScaleRequest,
  SaveThresholdRequest,
  ScaleType,
  UpdateCatalogItemRequest,
  UpdateMeasureRequest,
  UpdateOpportunityRequest,
  UpdateRiskRequest,
} from './types';

const BASE = '/api/v1/risk-config';

// ========== Scales ==========

export const getScales = () =>
  api.get<RiskScale[]>(`${BASE}/scales`).then((r) => r.data);

export const getScaleByType = (type: ScaleType) =>
  api.get<RiskScale>(`${BASE}/scales/${type}`).then((r) => r.data);

export const saveScale = (data: SaveScaleRequest) =>
  api.post<RiskScale>(`${BASE}/scales`, data).then((r) => r.data);

// ========== Criticality Matrix ==========

export const getCriticalityMatrix = () =>
  api
    .get<CriticalityThreshold[]>(`${BASE}/criticality-matrix`)
    .then((r) => r.data);

export const saveCriticalityMatrix = (data: SaveThresholdRequest[]) =>
  api
    .put<CriticalityThreshold[]>(`${BASE}/criticality-matrix`, data)
    .then((r) => r.data);

// ========== Catalogs ==========

export const getCatalogItems = (catalogType: CatalogType, activeOnly = false) =>
  api
    .get<
      RiskCatalogItem[]
    >(`${BASE}/catalogs/${catalogType}`, { params: { activeOnly } })
    .then((r) => r.data);

export const createCatalogItem = (data: CreateCatalogItemRequest) =>
  api.post<RiskCatalogItem>(`${BASE}/catalogs`, data).then((r) => r.data);

export const updateCatalogItem = (id: string, data: UpdateCatalogItemRequest) =>
  api.put<RiskCatalogItem>(`${BASE}/catalogs/${id}`, data).then((r) => r.data);

export const toggleCatalogItem = (id: string) =>
  api
    .patch<RiskCatalogItem>(`${BASE}/catalogs/${id}/toggle`)
    .then((r) => r.data);

// ========== Risks (M4.2) ==========

const RISKS = '/api/v1/risks';

export const getRisks = (filters: RiskFilters) =>
  api.get<PageResponse<Risk>>(RISKS, { params: filters }).then((r) => r.data);

export const getRiskById = (id: string) =>
  api.get<Risk>(`${RISKS}/${id}`).then((r) => r.data);

export const createRisk = (data: CreateRiskRequest) =>
  api.post<{ id: string }>(RISKS, data).then((r) => r.data);

export const updateRisk = (id: string, data: UpdateRiskRequest) =>
  api.put<{ id: string }>(`${RISKS}/${id}`, data).then((r) => r.data);

export const deleteRisk = (id: string) => api.delete(`${RISKS}/${id}`);

// ========== Document Links (M4.2) ==========

export const getRiskDocumentLinks = (riskId: string) =>
  api
    .get<RiskDocumentLink[]>(`${RISKS}/${riskId}/documents`)
    .then((r) => r.data);

export const addRiskDocumentLink = (
  riskId: string,
  data: AddDocumentLinkRequest,
) =>
  api
    .post<{ id: string }>(`${RISKS}/${riskId}/documents`, data)
    .then((r) => r.data);

export const removeRiskDocumentLink = (riskId: string, linkId: string) =>
  api.delete(`${RISKS}/${riskId}/documents/${linkId}`);

// ========== M4.3: Matrix & Statistics ==========

export const getRiskMatrix = () =>
  api.get<MatrixData>(`${RISKS}/matrix`).then((r) => r.data);

export const getRiskStatistics = () =>
  api.get<RiskStatistics>(`${RISKS}/statistics`).then((r) => r.data);

// ========== M4.5: Comparison Matrix & KPI ==========

export const getRiskComparisonMatrix = () =>
  api.get<ComparisonMatrix>(`${RISKS}/matrix/comparison`).then((r) => r.data);

export const getRiskKpi = () =>
  api.get<RiskKpi>(`${RISKS}/kpi`).then((r) => r.data);

// ========== M4.5: Residual Criticality ==========

export const evaluateResidual = (
  riskId: string,
  data: EvaluateResidualRequest,
) =>
  api
    .put<{ id: string }>(`${RISKS}/${riskId}/residual`, data)
    .then((r) => r.data);

// ========== M4.4: Mitigation Measures ==========

export const getRiskMeasures = (riskId: string) =>
  api
    .get<RiskMitigationMeasure[]>(`${RISKS}/${riskId}/measures`)
    .then((r) => r.data);

export const createRiskMeasure = (riskId: string, data: CreateMeasureRequest) =>
  api
    .post<{ id: string }>(`${RISKS}/${riskId}/measures`, data)
    .then((r) => r.data);

export const updateRiskMeasure = (
  riskId: string,
  measureId: string,
  data: UpdateMeasureRequest,
) =>
  api
    .put<{ id: string }>(`${RISKS}/${riskId}/measures/${measureId}`, data)
    .then((r) => r.data);

export const deleteRiskMeasure = (riskId: string, measureId: string) =>
  api.delete(`${RISKS}/${riskId}/measures/${measureId}`);

// ========== Livrables automatisés ==========

export const getDuerpReport = () =>
  api.get<DuerpReport>(`${RISKS}/reports/duerp`).then((r) => r.data);

export const getEnvironmentalReport = () =>
  api
    .get<EnvironmentalReport>(`${RISKS}/reports/environmental`)
    .then((r) => r.data);

export const getProcessRiskMapReport = () =>
  api
    .get<ProcessRiskReport>(`${RISKS}/reports/process-map`)
    .then((r) => r.data);

// ========== M4-22: Plan centralisé des mesures ==========

export const getAllMeasures = () =>
  api.get<MeasureWithRiskView[]>(`${RISKS}/measures`).then((r) => r.data);

// ========== M4.7: Exports PDF / Excel ==========

export const exportDuerpPdf = () =>
  api
    .get(`${RISKS}/reports/duerp/pdf`, { responseType: 'blob' })
    .then((r) => r.data);

export const exportDuerpExcel = () =>
  api
    .get(`${RISKS}/reports/duerp/excel`, { responseType: 'blob' })
    .then((r) => r.data);

export const exportEnvironmentalPdf = () =>
  api
    .get(`${RISKS}/reports/environmental/pdf`, { responseType: 'blob' })
    .then((r) => r.data);

export const exportEnvironmentalExcel = () =>
  api
    .get(`${RISKS}/reports/environmental/excel`, { responseType: 'blob' })
    .then((r) => r.data);

export const exportProcessMapPdf = () =>
  api
    .get(`${RISKS}/reports/process-map/pdf`, { responseType: 'blob' })
    .then((r) => r.data);

export const exportProcessMapExcel = () =>
  api
    .get(`${RISKS}/reports/process-map/excel`, { responseType: 'blob' })
    .then((r) => r.data);

// ========== M4.6: Opportunités ==========

const OPPORTUNITIES = '/api/v1/opportunities';

export const getOpportunities = () =>
  api.get<Opportunity[]>(OPPORTUNITIES).then((r) => r.data);

export const getOpportunityById = (id: string) =>
  api.get<Opportunity>(`${OPPORTUNITIES}/${id}`).then((r) => r.data);

export const createOpportunity = (data: CreateOpportunityRequest) =>
  api.post<{ id: string }>(OPPORTUNITIES, data).then((r) => r.data);

export const updateOpportunity = (id: string, data: UpdateOpportunityRequest) =>
  api.put<{ id: string }>(`${OPPORTUNITIES}/${id}`, data).then((r) => r.data);
