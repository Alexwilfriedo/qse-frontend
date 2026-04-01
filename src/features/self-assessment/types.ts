// ========== Enums ==========

export type GridStatus = 'BROUILLON' | 'PUBLIEE' | 'ARCHIVEE';

export type QuestionType = 'OUI_NON' | 'ECHELLE_1_5' | 'TEXTE_LIBRE';

// ========== Grid ==========

export interface AssessmentQuestion {
  id: string;
  libelle: string;
  type: QuestionType;
  obligatoire: boolean;
  sortOrder: number;
}

export interface AssessmentAxis {
  id: string;
  nom: string;
  description: string | null;
  sortOrder: number;
  questions: AssessmentQuestion[];
}

export interface SelfAssessmentGrid {
  id: string;
  titre: string;
  description: string | null;
  version: number;
  statut: GridStatus;
  axes: AssessmentAxis[];
  createdAt: string;
  createdBy: string;
  updatedAt: string | null;
  updatedBy: string | null;
}

export interface GridSummary {
  id: string;
  titre: string;
  version: number;
  statut: GridStatus;
  axesCount: number;
  updatedAt: string | null;
}

// ========== Requests ==========

export interface CreateGridRequest {
  titre: string;
  description?: string;
}

export interface UpdateGridRequest {
  titre: string;
  description?: string;
}

export interface CreateAxisRequest {
  nom: string;
  description?: string;
  sortOrder: number;
}

export interface UpdateAxisRequest {
  nom: string;
  description?: string;
  sortOrder: number;
}

export interface CreateQuestionRequest {
  libelle: string;
  type: QuestionType;
  obligatoire: boolean;
  sortOrder: number;
}

export interface UpdateQuestionRequest {
  libelle: string;
  type: QuestionType;
  obligatoire: boolean;
  sortOrder: number;
}

// ========== Campaign Enums ==========

export type CampaignStatus = 'EN_COURS' | 'CLOTUREE' | 'ARCHIVEE';

export type ResponseStatus =
  | 'EN_ATTENTE'
  | 'BROUILLON'
  | 'SOUMIS'
  | 'VALIDE'
  | 'REVISION_DEMANDEE';

// ========== Campaign ==========

export interface QuestionResponseView {
  questionId: string;
  valeur: string;
  commentaire: string | null;
  actionCorrectiveId: string | null;
}

export interface CampaignResponseView {
  id: string;
  processId: string;
  piloteId: string;
  statut: ResponseStatus;
  responses: QuestionResponseView[];
  dateReponse: string | null;
}

export interface CampaignView {
  id: string;
  titre: string;
  gridId: string;
  dateEcheance: string;
  statut: CampaignStatus;
  responses: CampaignResponseView[];
  createdAt: string;
  createdBy: string;
}

export interface CampaignSummaryView {
  id: string;
  titre: string;
  gridId: string;
  dateEcheance: string;
  statut: CampaignStatus;
  totalResponses: number;
  submittedResponses: number;
  createdAt: string;
}

// ========== Campaign Requests ==========

export interface CreateCampaignRequest {
  titre: string;
  gridId: string;
  dateEcheance: string;
  processIds: string[];
}

export interface QuestionResponseDto {
  questionId: string;
  valeur: string;
  commentaire?: string;
  actionCorrectiveId?: string;
}

export interface SaveResponseRequest {
  responses: QuestionResponseDto[];
  submit: boolean;
}

// ========== Dashboard / Maturité (M7.3) ==========

export interface RadarAxisView {
  axisId: string;
  axisNom: string;
  score: number;
}

export interface ProcessRankingView {
  processId: string;
  noteGlobale: number;
}

export interface DashboardView {
  campaignId: string;
  campagneTitre: string;
  noteGlobale: number;
  radar: RadarAxisView[];
  classement: ProcessRankingView[];
  tauxParticipation: number;
  reponsesRecues: number;
  totalReponses: number;
}

export interface EvolutionPointView {
  campaignId: string;
  campagneTitre: string;
  date: string;
  noteGlobale: number;
}
