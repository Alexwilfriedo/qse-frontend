import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as risksApi from '../risksApi';
import type {
  AddDocumentLinkRequest,
  CreateOpportunityRequest,
  CreateMeasureRequest,
  CreateRiskRequest,
  EvaluateResidualRequest,
  RiskFilters,
  UpdateMeasureRequest,
  UpdateOpportunityRequest,
  UpdateRiskRequest,
} from '../types';

const KEYS = {
  risks: ['risks'] as const,
  risk: (id: string) => ['risks', id] as const,
  riskDocuments: (id: string) => ['risks', id, 'documents'] as const,
  riskMeasures: (id: string) => ['risks', id, 'measures'] as const,
  opportunities: ['risks', 'opportunities'] as const,
  opportunity: (id: string) => ['risks', 'opportunities', id] as const,
};

export function useRisks(filters: RiskFilters) {
  return useQuery({
    queryKey: [...KEYS.risks, filters],
    queryFn: () => risksApi.getRisks(filters),
    placeholderData: (prev) => prev,
  });
}

export function useRisk(id: string) {
  return useQuery({
    queryKey: KEYS.risk(id),
    queryFn: () => risksApi.getRiskById(id),
    enabled: !!id,
  });
}

export function useCreateRisk() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateRiskRequest) => risksApi.createRisk(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEYS.risks });
    },
  });
}

export function useUpdateRisk() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateRiskRequest }) =>
      risksApi.updateRisk(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEYS.risks });
    },
  });
}

export function useDeleteRisk() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => risksApi.deleteRisk(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEYS.risks });
    },
  });
}

// ========== M4.3: Matrix & Statistics ==========

export function useRiskMatrix() {
  return useQuery({
    queryKey: [...KEYS.risks, 'matrix'],
    queryFn: () => risksApi.getRiskMatrix(),
  });
}

export function useRiskComparisonMatrix() {
  return useQuery({
    queryKey: [...KEYS.risks, 'matrix', 'comparison'],
    queryFn: () => risksApi.getRiskComparisonMatrix(),
  });
}

export function useRiskStatistics() {
  return useQuery({
    queryKey: [...KEYS.risks, 'statistics'],
    queryFn: () => risksApi.getRiskStatistics(),
  });
}

// ========== Document Links ==========

export function useRiskDocumentLinks(riskId: string) {
  return useQuery({
    queryKey: KEYS.riskDocuments(riskId),
    queryFn: () => risksApi.getRiskDocumentLinks(riskId),
    enabled: !!riskId,
  });
}

export function useAddDocumentLink(riskId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: AddDocumentLinkRequest) =>
      risksApi.addRiskDocumentLink(riskId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEYS.riskDocuments(riskId) });
    },
  });
}

export function useRemoveDocumentLink(riskId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (linkId: string) =>
      risksApi.removeRiskDocumentLink(riskId, linkId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEYS.riskDocuments(riskId) });
    },
  });
}

// ========== M4.5: Residual Criticality ==========

export function useEvaluateResidual(riskId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: EvaluateResidualRequest) =>
      risksApi.evaluateResidual(riskId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEYS.risk(riskId) });
      qc.invalidateQueries({ queryKey: KEYS.risks });
    },
  });
}

// ========== M4.4: Mitigation Measures ==========

export function useRiskMeasures(riskId: string) {
  return useQuery({
    queryKey: KEYS.riskMeasures(riskId),
    queryFn: () => risksApi.getRiskMeasures(riskId),
    enabled: !!riskId,
  });
}

export function useCreateMeasure(riskId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateMeasureRequest) =>
      risksApi.createRiskMeasure(riskId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEYS.riskMeasures(riskId) });
    },
  });
}

export function useUpdateMeasure(riskId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      measureId,
      data,
    }: {
      measureId: string;
      data: UpdateMeasureRequest;
    }) => risksApi.updateRiskMeasure(riskId, measureId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEYS.riskMeasures(riskId) });
    },
  });
}

export function useDeleteMeasure(riskId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (measureId: string) =>
      risksApi.deleteRiskMeasure(riskId, measureId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEYS.riskMeasures(riskId) });
    },
  });
}

// ========== M4-22: Plan centralisé des mesures ==========

export function useAllMeasures() {
  return useQuery({
    queryKey: [...KEYS.risks, 'measures', 'all'],
    queryFn: () => risksApi.getAllMeasures(),
  });
}

// ========== Livrables automatisés ==========

export function useDuerpReport() {
  return useQuery({
    queryKey: [...KEYS.risks, 'reports', 'duerp'],
    queryFn: () => risksApi.getDuerpReport(),
  });
}

export function useEnvironmentalReport() {
  return useQuery({
    queryKey: [...KEYS.risks, 'reports', 'environmental'],
    queryFn: () => risksApi.getEnvironmentalReport(),
  });
}

export function useProcessRiskMapReport() {
  return useQuery({
    queryKey: [...KEYS.risks, 'reports', 'process-map'],
    queryFn: () => risksApi.getProcessRiskMapReport(),
  });
}

// ========== M4.6: Opportunités ==========

export function useOpportunities() {
  return useQuery({
    queryKey: KEYS.opportunities,
    queryFn: () => risksApi.getOpportunities(),
  });
}

export function useOpportunity(id: string) {
  return useQuery({
    queryKey: KEYS.opportunity(id),
    queryFn: () => risksApi.getOpportunityById(id),
    enabled: !!id,
  });
}

export function useCreateOpportunity() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateOpportunityRequest) => risksApi.createOpportunity(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEYS.opportunities });
    },
  });
}

export function useUpdateOpportunity() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateOpportunityRequest }) =>
      risksApi.updateOpportunity(id, data),
    onSuccess: (_result, variables) => {
      qc.invalidateQueries({ queryKey: KEYS.opportunities });
      qc.invalidateQueries({ queryKey: KEYS.opportunity(variables.id) });
    },
  });
}
