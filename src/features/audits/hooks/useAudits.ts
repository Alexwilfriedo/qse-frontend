import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { auditsApi } from '../auditsApi';
import type {
  ConvoquerAuditRequest,
  CreateCampaignRequest,
  CreateFindingRequest,
  PlanAuditRequest,
  RejectReportRequest,
  UpdateCampaignRequest,
  UpdateAuditorRequest,
  UpdateNotePerformanceRequest,
} from '../types';

const CAMPAIGNS_KEY = ['audit-campaigns'];
const AUDITS_KEY = ['audits'];
const FINDINGS_KEY = ['audit-findings'];
const AUDITORS_KEY = ['auditors'];
const OBJECTIVES_KEY = ['audit-program-objectives'];

// ========== Campaigns ==========

export function useCampaigns(annee?: number) {
  return useQuery({
    queryKey: [...CAMPAIGNS_KEY, annee],
    queryFn: () => auditsApi.getCampaigns(annee),
  });
}

export function useCampaign(id: string) {
  return useQuery({
    queryKey: [...CAMPAIGNS_KEY, id],
    queryFn: () => auditsApi.getCampaignById(id),
    enabled: !!id,
  });
}

export function useCreateCampaign() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateCampaignRequest) => auditsApi.createCampaign(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: CAMPAIGNS_KEY }),
  });
}

export function useUpdateCampaign() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCampaignRequest }) =>
      auditsApi.updateCampaign(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: CAMPAIGNS_KEY }),
  });
}

export function useTransitionCampaign() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, action }: { id: string; action: string }) =>
      auditsApi.transitionCampaign(id, action),
    onSuccess: () => qc.invalidateQueries({ queryKey: CAMPAIGNS_KEY }),
  });
}

export function useAuditDashboard(annee: number) {
  return useQuery({
    queryKey: [...CAMPAIGNS_KEY, 'dashboard', annee],
    queryFn: () => auditsApi.getDashboard(annee),
  });
}

export function useAuditProgramObjectives(annee: number) {
  return useQuery({
    queryKey: [...OBJECTIVES_KEY, annee],
    queryFn: () => auditsApi.getProgramObjectives(annee),
  });
}

export function useUpsertAuditProgramObjective() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: auditsApi.upsertProgramObjective,
    onSuccess: (_, variables) => {
      qc.invalidateQueries({ queryKey: [...OBJECTIVES_KEY, variables.annee] });
      qc.invalidateQueries({ queryKey: [...CAMPAIGNS_KEY, variables.annee] });
    },
  });
}

// ========== Audits ==========

export function useAudit(id: string) {
  return useQuery({
    queryKey: [...AUDITS_KEY, id],
    queryFn: () => auditsApi.getAuditById(id),
    enabled: !!id,
  });
}

export function usePlanAudit() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ campaignId, data }: { campaignId: string; data: PlanAuditRequest }) =>
      auditsApi.planAudit(campaignId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: CAMPAIGNS_KEY });
      qc.invalidateQueries({ queryKey: AUDITS_KEY });
    },
  });
}

export function useConvoquerAudit() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: ConvoquerAuditRequest }) =>
      auditsApi.convoquer(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: CAMPAIGNS_KEY });
      qc.invalidateQueries({ queryKey: AUDITS_KEY });
    },
  });
}

export function useTransitionAudit() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, action }: { id: string; action: string }) =>
      auditsApi.transitionAudit(id, action),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: CAMPAIGNS_KEY });
      qc.invalidateQueries({ queryKey: AUDITS_KEY });
    },
  });
}

export function useAuditCalendar(mois: number, annee: number) {
  return useQuery({
    queryKey: [...AUDITS_KEY, 'calendar', mois, annee],
    queryFn: () => auditsApi.getCalendar(mois, annee),
  });
}

export function useRejectReport() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: RejectReportRequest }) =>
      auditsApi.rejectReport(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: CAMPAIGNS_KEY });
      qc.invalidateQueries({ queryKey: AUDITS_KEY });
    },
  });
}

export function useUpdateNotePerformance() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateNotePerformanceRequest }) =>
      auditsApi.updateNotePerformance(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: AUDITS_KEY });
    },
  });
}

// ========== Findings ==========

export function useFindings(auditId: string, type?: string) {
  return useQuery({
    queryKey: [...FINDINGS_KEY, auditId, type],
    queryFn: () => auditsApi.getFindings(auditId, type),
    enabled: !!auditId,
  });
}

export function useCreateFinding() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ auditId, data }: { auditId: string; data: CreateFindingRequest }) =>
      auditsApi.createFinding(auditId, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: FINDINGS_KEY }),
  });
}

// ========== Auditors ==========

export function useAuditors(actif?: boolean, level?: string) {
  return useQuery({
    queryKey: [...AUDITORS_KEY, actif, level],
    queryFn: () => auditsApi.getAuditors(actif, level),
  });
}

export function useAuditor(id?: string) {
  return useQuery({
    queryKey: [...AUDITORS_KEY, 'detail', id],
    queryFn: () => auditsApi.getAuditorById(id!),
    enabled: !!id,
  });
}

export function useCreateAuditor() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: auditsApi.createAuditor,
    onSuccess: () => qc.invalidateQueries({ queryKey: AUDITORS_KEY }),
  });
}

export function useUpdateAuditor() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateAuditorRequest }) =>
      auditsApi.updateAuditor(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: AUDITORS_KEY }),
  });
}

export function useUploadAuditorPhoto() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, file }: { id: string; file: File }) =>
      auditsApi.uploadAuditorPhoto(id, file),
    onSuccess: (_, variables) => {
      qc.invalidateQueries({ queryKey: AUDITORS_KEY });
      qc.invalidateQueries({ queryKey: [...AUDITORS_KEY, 'detail', variables.id] });
    },
  });
}

export function useEvaluerCompetences() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: { deontologie: number; processus: number; communication: number; reglementation: number } }) =>
      auditsApi.evaluerCompetences(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: AUDITORS_KEY }),
  });
}

export function usePublicAuditFeedback(token?: string) {
  return useQuery({
    queryKey: ['public-audit-feedback', token],
    queryFn: () => auditsApi.getPublicAuditFeedback(token!),
    enabled: !!token,
    retry: false,
  });
}

export function useSubmitPublicAuditFeedback() {
  return useMutation({
    mutationFn: ({ token, data }: { token: string; data: import('../types').SubmitPublicAuditFeedbackRequest }) =>
      auditsApi.submitPublicAuditFeedback(token, data),
  });
}
