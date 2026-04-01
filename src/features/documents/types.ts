export type DocumentType =
  | 'PROCEDURE'
  | 'INSTRUCTION'
  | 'FORMULAIRE'
  | 'ENREGISTREMENT'
  | 'POLITIQUE'
  | 'MANUEL'
  | 'CONSIGNE'
  | 'MATRICE'
  | 'DOCUMENT_EXTERNE';

export type DocumentDomaine = 'QUALITE' | 'SECURITE' | 'ENVIRONNEMENT';

export type DocumentStatut =
  | 'BROUILLON'
  | 'EN_VERIFICATION'
  | 'EN_CONSULTATION'
  | 'APPROUVE'
  | 'PUBLIE'
  | 'REJETE'
  | 'ARCHIVE';

export interface Document {
  id: string;
  code: string;
  titre: string;
  contenu: string | null;
  type: DocumentType;
  domaine: DocumentDomaine;
  statut: DocumentStatut;
  version: string;
  // Fichier
  fichierNom: string | null;
  fichierTaille: number | null;
  fichierMimeType: string | null;
  hasFile: boolean;
  // Métadonnées
  processusId: string | null;
  dateValidite: string | null;
  externe: boolean;
  referenceExterne: string | null;
  motifRejet: string | null;
  // Workflow tracking
  submittedAt: string | null;
  submittedBy: string | null;
  verifiedAt: string | null;
  verifiedBy: string | null;
  approvedAt: string | null;
  approvedBy: string | null;
  publishedAt: string | null;
  publishedBy: string | null;
  // Audit
  createdAt: string;
  createdBy: string;
  updatedAt: string | null;
  updatedBy: string | null;
  entityVersion: number;
}

export interface DocumentsPage {
  content: Document[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

export interface CreateDocumentRequest {
  code: string;
  titre: string;
  contenu?: string;
  type: DocumentType;
  domaine: DocumentDomaine;
}

export interface UpdateDocumentRequest {
  titre: string;
  contenu?: string;
  type: DocumentType;
  domaine: DocumentDomaine;
  version?: number;
}

export interface DocumentFilters {
  domaine?: DocumentDomaine;
  statut?: DocumentStatut;
  type?: DocumentType;
  search?: string;
  page?: number;
  size?: number;
}

export const DOCUMENT_TYPES: { value: DocumentType; label: string }[] = [
  { value: 'PROCEDURE', label: 'Procédure' },
  { value: 'INSTRUCTION', label: 'Instruction' },
  { value: 'FORMULAIRE', label: 'Formulaire' },
  { value: 'ENREGISTREMENT', label: 'Enregistrement' },
  { value: 'POLITIQUE', label: 'Politique' },
  { value: 'MANUEL', label: 'Manuel' },
  { value: 'CONSIGNE', label: 'Consigne' },
  { value: 'MATRICE', label: 'Matrice' },
  { value: 'DOCUMENT_EXTERNE', label: 'Document externe' },
];

export const DOCUMENT_DOMAINES: { value: DocumentDomaine; label: string }[] = [
  { value: 'QUALITE', label: 'Qualité' },
  { value: 'SECURITE', label: 'Sécurité' },
  { value: 'ENVIRONNEMENT', label: 'Environnement' },
];

export interface DocumentDashboard {
  documentsTotal: number;
  brouillons: number;
  enVerification: number;
  enConsultation: number;
  approuves: number;
  publies: number;
  rejetes: number;
  archives: number;
  parDomaine: Record<string, number>;
  parType: Record<string, number>;
}

export const DOCUMENT_STATUTS: { value: DocumentStatut; label: string }[] = [
  { value: 'BROUILLON', label: 'Brouillon' },
  { value: 'EN_VERIFICATION', label: 'En vérification' },
  { value: 'EN_CONSULTATION', label: 'En consultation' },
  { value: 'APPROUVE', label: 'Approuvé' },
  { value: 'PUBLIE', label: 'Publié' },
  { value: 'REJETE', label: 'Rejeté' },
  { value: 'ARCHIVE', label: 'Archivé' },
];

// ========== Consultation ISO 45001 (M2.3) ==========

export interface ConsultationVote {
  id: string;
  documentId: string;
  userId: string;
  approved: boolean;
  comment: string | null;
  votedAt: string;
}

export interface ConsultationStatus {
  quorumRequired: number;
  totalVotes: number;
  approvedVotes: number;
  unresolvedComments: number;
  quorumReached: boolean;
  allCommentsResolved: boolean;
  canProgress: boolean;
}

export interface CastVoteRequest {
  approved: boolean;
  comment?: string;
}

// ========== Accusé de lecture (M2.4) ==========

export interface Acknowledgement {
  id: string;
  documentId: string;
  userId: string;
  acknowledgedAt: string | null;
  createdAt: string;
}

export interface AcknowledgementStats {
  total: number;
  acknowledged: number;
  pending: number;
  acknowledgedRate: number;
}

export interface RequestAcknowledgementsRequest {
  userIds: string[];
}

// ========== Commentaires document (M2.2) ==========

export type CommentType = 'COMMENT' | 'ANNOTATION' | 'CONSULTATION';

export interface DocumentComment {
  id: string;
  documentId: string;
  userId: string;
  contenu: string;
  type: CommentType;
  resolved: boolean;
  resolvedBy: string | null;
  resolvedAt: string | null;
  createdAt: string;
  updatedAt: string | null;
}

export interface AddCommentRequest {
  contenu: string;
  type: CommentType;
}

export const COMMENT_TYPE_LABELS: Record<CommentType, string> = {
  COMMENT: 'Commentaire',
  ANNOTATION: 'Annotation',
  CONSULTATION: 'Observation ISO 45001',
};

// M2.4 Quiz
export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  orderIndex: number;
}

export interface DocumentQuiz {
  id: string;
  documentId: string;
  active: boolean;
  passingScore: number;
  maxAttempts: number;
  questions: QuizQuestion[];
}

export interface QuizAttempt {
  id: string;
  score: number;
  passed: boolean;
  attemptNumber: number;
  createdAt: string;
}

export interface CreateQuizRequest {
  passingScore: number;
  maxAttempts: number;
  questions: {
    question: string;
    options: string[];
    correctOptionIndex: number;
  }[];
}

export interface SubmitQuizAttemptRequest {
  answers: number[];
}

// M2.6 Paper Distribution
export type PaperDistributionStatus =
  | 'DISTRIBUTED'
  | 'RETURNED'
  | 'REPLACED'
  | 'DESTROYED';

export interface PaperDistribution {
  id: string;
  documentId: string;
  documentVersion: string;
  recipientId: string;
  copyNumber: number;
  watermarkText: string;
  status: PaperDistributionStatus;
  distributedAt: string;
  distributedBy: string;
  returnedAt: string | null;
  replacedAt: string | null;
  replacementVersion: string | null;
}

export const PAPER_STATUS_LABELS: Record<PaperDistributionStatus, string> = {
  DISTRIBUTED: 'Distribué',
  RETURNED: 'Retourné',
  REPLACED: 'Remplacé',
  DESTROYED: 'Détruit',
};
