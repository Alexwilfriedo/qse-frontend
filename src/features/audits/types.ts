// ========== Enums ==========

export type CampaignStatut =
  | 'PLANIFIEE'
  | 'SOUMISE'
  | 'CONFIRMEE'
  | 'EN_COURS'
  | 'TERMINEE'
  | 'ANNULEE';

export type AuditProgramPriority = 'HAUTE' | 'MOYENNE' | 'FAIBLE';

export type AuditProgramExecutionStatus =
  | 'PLANIFIE'
  | 'EN_EXECUTION'
  | 'EN_COURS_SUIVI'
  | 'FINALISE'
  | 'REPORTE';

export type AuditProgramScopeType = 'PROCESSUS' | 'SITE' | 'UNITE_TRAVAIL';

export type AuditStatut =
  | 'PLANIFIE'
  | 'CONVOQUE'
  | 'EN_COURS'
  | 'RAPPORT_SOUMIS'
  | 'RAPPORT_VALIDE'
  | 'SIGNE'
  | 'CLOTURE'
  | 'ANNULE';

export type AuditType =
  | 'INTERNE'
  | 'EXTERNE'
  | 'CERTIFICATION'
  | 'SURVEILLANCE';

export type AuditScopeType = 'PROCESSUS' | 'UNITE_TRAVAIL';

export interface AuditTeamView {
  auditeurPrincipalId: string;
  auditeursIds: string[];
  observateursIds: string[];
}

export type FindingType = 'PF' | 'PP' | 'PS' | 'NCM' | 'NCm';

export type AuditorLevel = 'JUNIOR' | 'CONFIRME' | 'LEAD';

export type Domaine = 'QUALITE' | 'SECURITE' | 'ENVIRONNEMENT';

// ========== Campaign ==========

export interface AuditCampaign {
  id: string;
  annee: number;
  titre: string;
  referentielNormatif: string | null;
  scopeType: AuditProgramScopeType | null;
  scopeLabel: string | null;
  priorite: AuditProgramPriority | null;
  executionStatus: AuditProgramExecutionStatus | null;
  description: string | null;
  dateDebut: string;
  dateFin: string;
  statut: CampaignStatut;
  perimetre: Domaine[];
  auditCount: number;
  createdAt: string;
}

export interface AuditCampaignDetail extends AuditCampaign {
  objectifsAudit: string | null;
  scopeId: string | null;
  managerPilotUserId: string | null;
  cycleEvaluation: string | null;
  dateExecutionPrevisionnelle: string | null;
  responsableAuditId: string | null;
  auditeursInternesIds: string[];
  surveillanceControle: string | null;
  audits: AuditSummary[];
}

export interface CreateCampaignRequest {
  annee: number;
  titre: string;
  description?: string;
  dateDebut: string;
  dateFin: string;
  perimetre: Domaine[];
  objectifsAudit?: string;
  referentielNormatif?: string;
  scopeType?: AuditProgramScopeType;
  scopeId?: string;
  scopeLabel?: string;
  managerPilotUserId?: string;
  cycleEvaluation?: string;
  dateExecutionPrevisionnelle?: string;
  responsableAuditId?: string;
  auditeursInternesIds?: string[];
  priorite?: AuditProgramPriority;
  executionStatus?: AuditProgramExecutionStatus;
  surveillanceControle?: string;
}

export interface AuditProgramObjective {
  id: string;
  annee: number;
  domaine: Domaine;
  referentielNormatif: string;
  objectifGlobal: string;
}

export interface UpsertAuditProgramObjectiveRequest {
  annee: number;
  domaine: Domaine;
  referentielNormatif: string;
  objectifGlobal: string;
}

export interface UpdateCampaignRequest {
  titre?: string;
  description?: string;
  dateDebut?: string;
  dateFin?: string;
  perimetre?: Domaine[];
  objectifsAudit?: string;
  referentielNormatif?: string;
  scopeType?: AuditProgramScopeType;
  scopeId?: string;
  scopeLabel?: string;
  managerPilotUserId?: string;
  cycleEvaluation?: string;
  dateExecutionPrevisionnelle?: string;
  responsableAuditId?: string;
  auditeursInternesIds?: string[];
  priorite?: AuditProgramPriority;
  executionStatus?: AuditProgramExecutionStatus;
  surveillanceControle?: string;
}

// ========== Audit ==========

export interface AuditSummary {
  id: string;
  titre: string;
  type: AuditType;
  specificite: Domaine | null;
  scopeType: AuditScopeType | null;
  scopeId: string | null;
  statut: AuditStatut;
  datePrevisionnelle: string;
  heureOuverture: string | null;
  heureFermeture: string | null;
  referentielNormatif: string | null;
  procedureDocumentId: string | null;
  perimetre: string;
  interviewsJson: string | null;
  objectifSpecifique: string | null;
  auditSchedulesJson: string | null;
  documentsAExaminerJson: string | null;
  documentsAExaminerIds: string[];
  planRealiseLe: string | null;
  notePerformanceProcessus: number | null;
  commentaireRejet: string | null;
  equipe: AuditTeamView;
}

export interface Audit extends AuditSummary {
  campaignId: string;
  dateReelle: string | null;
  dureeJours: number;
  auditeurPrincipalId: string;
  auditeursIds: string[];
  observateursIds: string[];
  convocation: Convocation | null;
  createdAt: string;
}

export interface Convocation {
  date: string;
  heureDebut: string;
  heureFin: string | null;
  lieu: string;
  ordreDuJour: string | null;
  envoyeeLe: string;
}

export interface PlanAuditRequest {
  titre: string;
  type: AuditType;
  perimetre: string;
  specificite: Domaine;
  scopeType?: AuditScopeType;
  scopeId?: string;
  referentielNormatif?: string;
  procedureDocumentId?: string;
  datePrevisionnelle: string;
  heureOuverture?: string;
  heureFermeture?: string;
  interviewsJson?: string;
  objectifSpecifique?: string;
  auditSchedulesJson?: string;
  documentsAExaminerJson?: string;
  documentsAExaminerIds?: string[];
  dureeJours: number;
  auditeurPrincipalId: string;
  auditeursIds?: string[];
  observateursIds?: string[];
}

export interface ConvoquerAuditRequest {
  date: string;
  heureDebut: string;
  heureFin?: string;
  lieu: string;
  ordreDuJour?: string;
  envoyerEmail: boolean;
}

// ========== Findings ==========

export interface AuditFinding {
  id: string;
  auditId: string;
  type: FindingType;
  referenceNormative: string | null;
  description: string;
  ecartDescription: string | null;
  recommandation: string | null;
  miseEnOeuvreItemsJson: string | null;
  preuves: string | null;
  actionId: string | null;
  responsableActionId: string | null;
  delaiMiseEnOeuvre: string | null;
  createdAt: string;
  createdBy: string;
}

export interface FindingMiseEnOeuvreItem {
  id?: string;
  recommandation?: string;
  preuves?: string;
  preuveFile?: File | null;
  preuveObjectKey?: string;
  preuveMimeType?: string;
  responsableActionId?: string;
  delaiMiseEnOeuvre?: string;
}

export interface CreateFindingRequest {
  type: FindingType;
  referenceNormative?: string;
  description: string;
  ecartDescription?: string;
  recommandation?: string;
  miseEnOeuvreItems?: FindingMiseEnOeuvreItem[];
}

// ========== Auditors ==========

export interface Auditor {
  id: string;
  userId: string;
  auditorCode: string;
  matricule: string | null;
  nomComplet: string | null;
  directionService: string | null;
  professionalPhone: string | null;
  photoFileName: string | null;
  photoMimeType: string | null;
  hasPhoto: boolean;
  level: AuditorLevel;
  perimetreNormes: string[];
  perimetreDomaines: Domaine[];
  competenceDeontologie: number;
  competenceProcessus: number;
  competenceCommunication: number;
  competenceReglementation: number;
  scoreMoyen: number;
  dateDerniereRevue: string | null;
  dateProchaineRevue: string | null;
  dateRecyclage: string | null;
  dateDerniereFormationAuditInterne: string | null;
  certificationsExternes: string | null;
  actif: boolean;
  needsReview: boolean;
  needsRecycling: boolean;
}

export interface CreateAuditorRequest {
  userId: string;
  auditorCode: string;
  matricule?: string;
  directionService?: string;
  professionalPhone?: string;
  level: AuditorLevel;
  perimetreNormes?: string[];
  perimetreDomaines?: Domaine[];
  dateDerniereFormationAuditInterne?: string;
  certificationsExternes?: string;
}

export interface UpdateAuditorRequest {
  auditorCode: string;
  matricule?: string;
  directionService?: string;
  professionalPhone?: string;
  level: AuditorLevel;
  perimetreNormes?: string[];
  perimetreDomaines?: Domaine[];
  dateDerniereFormationAuditInterne?: string;
  certificationsExternes?: string;
}

export interface EvaluerCompetencesRequest {
  deontologie: number;
  processus: number;
  communication: number;
  reglementation: number;
}

export interface PublicAuditFeedbackTarget {
  auditorId: string;
  auditorName: string;
  auditorEmail: string | null;
  alreadySubmitted: boolean;
}

export interface PublicAuditFeedbackView {
  token: string;
  auditId: string;
  auditTitle: string;
  auditeeName: string | null;
  auditeeEmail: string;
  completed: boolean;
  auditors: PublicAuditFeedbackTarget[];
}

export interface SubmitPublicAuditFeedbackRequest {
  feedbacks: {
    auditorId: string;
    deontologie: number;
    processus: number;
    communication: number;
    reglementation: number;
    commentaire?: string;
  }[];
}

// ========== Dashboard ==========

export interface AuditDashboard {
  annee: number;
  total: number;
  planifies: number;
  realises: number;
  enRetard: number;
  tauxRealisation: number;
  prochainAudit: {
    id: string;
    titre: string;
    datePrevisionnelle: string;
    perimetre: string;
  } | null;
}

export interface AuditCalendarView {
  id: string;
  titre: string;
  type: AuditType;
  statut: AuditStatut;
  datePrevisionnelle: string;
  perimetre: string;
}

// ========== Transitions ==========

export type CampaignAction =
  | 'SOUMETTRE'
  | 'CONFIRMER'
  | 'REJETER'
  | 'DEMARRER'
  | 'TERMINER'
  | 'ANNULER';

export type AuditAction =
  | 'DEMARRER'
  | 'SOUMETTRE_RAPPORT'
  | 'VALIDER_RAPPORT'
  | 'REJETER_RAPPORT'
  | 'SIGNER_RAPPORT'
  | 'CLOTURER'
  | 'ANNULER';

export interface RejectReportRequest {
  commentaire: string;
}

export interface UpdateNotePerformanceRequest {
  note: number;
}
