import { api } from '@/lib/api';
import type {
  Audit,
  AuditCalendarView,
  AuditCampaign,
  AuditCampaignDetail,
  AuditDashboard,
  AuditFinding,
  AuditProgramObjective,
  AuditSummary,
  Auditor,
  ConvoquerAuditRequest,
  CreateAuditorRequest,
  CreateCampaignRequest,
  CreateFindingRequest,
  EvaluerCompetencesRequest,
  PlanAuditRequest,
  PublicAuditFeedbackView,
  RejectReportRequest,
  SubmitPublicAuditFeedbackRequest,
  UpsertAuditProgramObjectiveRequest,
  UpdateCampaignRequest,
  UpdateAuditorRequest,
  UpdateNotePerformanceRequest,
} from './types';

const CAMPAIGNS_URL = '/api/v1/audit-campaigns';
const AUDITS_URL = '/api/v1/audits';
const AUDITORS_URL = '/api/v1/auditors';
const AUDIT_PROGRAM_OBJECTIVES_URL = '/api/v1/audit-program-objectives';

export const auditsApi = {
  // ========== Campaigns ==========

  getCampaigns: async (annee?: number): Promise<AuditCampaign[]> => {
    const params = annee ? `?annee=${annee}` : '';
    const { data } = await api.get<AuditCampaign[]>(`${CAMPAIGNS_URL}${params}`);
    return data;
  },

  getCampaignById: async (id: string): Promise<AuditCampaignDetail> => {
    const { data } = await api.get<AuditCampaignDetail>(`${CAMPAIGNS_URL}/${id}`);
    return data;
  },

  createCampaign: async (req: CreateCampaignRequest): Promise<{ id: string }> => {
    const { data } = await api.post<{ id: string }>(CAMPAIGNS_URL, req);
    return data;
  },

  updateCampaign: async (id: string, req: UpdateCampaignRequest): Promise<void> => {
    await api.put(`${CAMPAIGNS_URL}/${id}`, req);
  },

  transitionCampaign: async (id: string, action: string): Promise<void> => {
    await api.post(`${CAMPAIGNS_URL}/${id}/${action.toLowerCase()}`);
  },

  getDashboard: async (annee: number): Promise<AuditDashboard> => {
    const { data } = await api.get<AuditDashboard>(`${CAMPAIGNS_URL}/dashboard?annee=${annee}`);
    return data;
  },

  getProgramObjectives: async (annee: number): Promise<AuditProgramObjective[]> => {
    const { data } = await api.get<AuditProgramObjective[]>(
      `${AUDIT_PROGRAM_OBJECTIVES_URL}?annee=${annee}`,
    );
    return data;
  },

  upsertProgramObjective: async (
    req: UpsertAuditProgramObjectiveRequest,
  ): Promise<void> => {
    await api.post(AUDIT_PROGRAM_OBJECTIVES_URL, req);
  },

  // ========== Audits ==========

  getAuditById: async (id: string): Promise<AuditSummary> => {
    const { data } = await api.get<AuditSummary>(`${AUDITS_URL}/${id}`);
    return data;
  },

  exportAuditReportPdf: async (id: string): Promise<Blob> => {
    const { data } = await api.get(`${AUDITS_URL}/${id}/report/pdf`, {
      responseType: 'blob',
    });
    return data;
  },

  planAudit: async (campaignId: string, req: PlanAuditRequest): Promise<{ id: string }> => {
    const { data } = await api.post<{ id: string }>(`${CAMPAIGNS_URL}/${campaignId}/audits`, req);
    return data;
  },

  getAudits: async (campaignId: string): Promise<Audit[]> => {
    const { data } = await api.get<Audit[]>(`${CAMPAIGNS_URL}/${campaignId}/audits`);
    return data;
  },

  convoquer: async (id: string, req: ConvoquerAuditRequest): Promise<void> => {
    await api.post(`${AUDITS_URL}/${id}/convoquer`, req);
  },

  transitionAudit: async (id: string, action: string): Promise<void> => {
    const actionMap: Record<string, string> = {
      DEMARRER: 'demarrer',
      SOUMETTRE_RAPPORT: 'soumettre-rapport',
      VALIDER_RAPPORT: 'valider-rapport',
      SIGNER_RAPPORT: 'signer',
      CLOTURER: 'cloturer',
      ANNULER: 'annuler',
    };
    await api.post(`${AUDITS_URL}/${id}/${actionMap[action] ?? action.toLowerCase()}`);
  },

  rejectReport: async (id: string, req: RejectReportRequest): Promise<void> => {
    await api.post(`${AUDITS_URL}/${id}/rejeter-rapport`, req);
  },

  updateNotePerformance: async (id: string, req: UpdateNotePerformanceRequest): Promise<void> => {
    await api.patch(`${AUDITS_URL}/${id}/note-performance`, req);
  },

  getCalendar: async (mois: number, annee: number): Promise<AuditCalendarView[]> => {
    const { data } = await api.get<AuditCalendarView[]>(
      `${AUDITS_URL}/calendar?mois=${mois}&annee=${annee}`,
    );
    return data;
  },

  // ========== Findings ==========

  getFindings: async (auditId: string, type?: string): Promise<AuditFinding[]> => {
    const params = type ? `?type=${type}` : '';
    const { data } = await api.get<AuditFinding[]>(`${AUDITS_URL}/${auditId}/findings${params}`);
    return data;
  },

  createFinding: async (auditId: string, req: CreateFindingRequest): Promise<{ id: string }> => {
    const formData = new FormData();
    const payload = {
      ...req,
      miseEnOeuvreItems: req.miseEnOeuvreItems?.map((item) => ({
        ...item,
        preuveFile: undefined,
      })),
    };

    formData.append(
      'payload',
      new Blob([JSON.stringify(payload)], { type: 'application/json' }),
    );

    req.miseEnOeuvreItems?.forEach((item) => {
      if (item.id && item.preuveFile) {
        formData.append(`proof_${item.id}`, item.preuveFile);
      }
    });

    const { data } = await api.post<{ id: string }>(
      `${AUDITS_URL}/${auditId}/findings`,
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      },
    );
    return data;
  },

  // ========== Auditors ==========

  getAuditors: async (actif?: boolean, level?: string): Promise<Auditor[]> => {
    const params = new URLSearchParams();
    if (actif !== undefined) params.append('actif', String(actif));
    if (level) params.append('level', level);
    const query = params.toString() ? `?${params}` : '';
    const { data } = await api.get<Auditor[]>(`${AUDITORS_URL}${query}`);
    return data;
  },

  getAuditorById: async (id: string): Promise<Auditor> => {
    const { data } = await api.get<Auditor>(`${AUDITORS_URL}/${id}`);
    return data;
  },

  createAuditor: async (req: CreateAuditorRequest): Promise<{ id: string }> => {
    const { data } = await api.post<{ id: string }>(AUDITORS_URL, req);
    return data;
  },

  updateAuditor: async (id: string, req: UpdateAuditorRequest): Promise<void> => {
    await api.put(`${AUDITORS_URL}/${id}`, req);
  },

  uploadAuditorPhoto: async (id: string, file: File): Promise<void> => {
    const formData = new FormData();
    formData.append('file', file);
    await api.post(`${AUDITORS_URL}/${id}/photo`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  getAuditorPhoto: async (id: string): Promise<Blob | null> => {
    const response = await api.get(`${AUDITORS_URL}/${id}/photo`, {
      responseType: 'blob',
      validateStatus: (status) => status === 200 || status === 404,
    });

    if (response.status === 404) {
      return null;
    }

    return response.data;
  },

  evaluerCompetences: async (id: string, req: EvaluerCompetencesRequest): Promise<void> => {
    await api.put(`${AUDITORS_URL}/${id}/competences`, req);
  },

  getPublicAuditFeedback: async (token: string): Promise<PublicAuditFeedbackView> => {
    const { data } = await api.get<PublicAuditFeedbackView>(`/api/public/audit-feedback/${token}`);
    return data;
  },

  submitPublicAuditFeedback: async (
    token: string,
    req: SubmitPublicAuditFeedbackRequest,
  ): Promise<void> => {
    await api.post(`/api/public/audit-feedback/${token}`, req);
  },
};
