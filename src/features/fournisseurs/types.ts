export type StatutFournisseur =
  | 'HOMOLOGUE'
  | 'SOUS_SURVEILLANCE'
  | 'DISQUALIFIE';

export type CategorieFournisseur = 'TRAVAUX_HT' | 'FOURNITURES' | 'PRESTATIONS';

export type CriticiteFournisseur = 'STRATEGIQUE' | 'IMPORTANT' | 'STANDARD';

export interface ContactFournisseur {
  nom: string;
  fonction: string | null;
  email: string | null;
  telephone: string | null;
}

export interface Fournisseur {
  id: string;
  raisonSociale: string;
  domaineActivite: string | null;
  adresse: string | null;
  telephone: string | null;
  email: string | null;
  ifu: string | null;
  certifications: string | null;
  categorie: CategorieFournisseur | null;
  criticite: CriticiteFournisseur | null;
  statut: StatutFournisseur;
  noteGlobale: number | null;
  contacts: ContactFournisseur[];
  createdAt: string;
  createdBy: string;
  updatedAt: string | null;
  updatedBy: string | null;
}

export interface FournisseursPage {
  content: Fournisseur[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

export interface FournisseurFilters {
  search?: string;
  statut?: StatutFournisseur;
  categorie?: CategorieFournisseur;
  criticite?: CriticiteFournisseur;
  page?: number;
  size?: number;
}

export interface CritereEvaluation {
  critereId: string;
  note: number;
  commentaire: string | null;
}

export interface EvaluationFournisseur {
  id: string;
  fournisseurId: string;
  evaluateurId: string;
  dateEvaluation: string;
  criteres: CritereEvaluation[];
  noteGlobale: number;
  commentaireGeneral: string | null;
  createdAt: string;
  createdBy: string;
  updatedAt: string | null;
}

export interface CreateFournisseurRequest {
  raisonSociale: string;
  domaineActivite?: string;
  adresse?: string;
  telephone?: string;
  email?: string;
  ifu?: string;
  certifications?: string;
  categorie?: CategorieFournisseur;
  criticite?: CriticiteFournisseur;
  contacts?: ContactFournisseur[];
}

export interface UpdateFournisseurRequest extends CreateFournisseurRequest {}

export interface CritereRequest {
  critereId: string;
  note: number;
  commentaire?: string;
}

export interface CreateEvaluationRequest {
  evaluateurId?: string;
  dateEvaluation?: string;
  criteres: CritereRequest[];
  commentaireGeneral?: string;
}

export interface UpdateEvaluationRequest extends CreateEvaluationRequest {}

export const STATUT_FOURNISSEUR_OPTIONS: {
  value: StatutFournisseur;
  label: string;
}[] = [
  { value: 'HOMOLOGUE', label: 'Homologué' },
  { value: 'SOUS_SURVEILLANCE', label: 'Sous surveillance' },
  { value: 'DISQUALIFIE', label: 'Disqualifié' },
];

export const CATEGORIE_FOURNISSEUR_OPTIONS: {
  value: CategorieFournisseur;
  label: string;
}[] = [
  { value: 'TRAVAUX_HT', label: 'Travaux HT' },
  { value: 'FOURNITURES', label: 'Fournitures' },
  { value: 'PRESTATIONS', label: 'Prestations' },
];

export const CRITICITE_FOURNISSEUR_OPTIONS: {
  value: CriticiteFournisseur;
  label: string;
}[] = [
  { value: 'STRATEGIQUE', label: 'Stratégique' },
  { value: 'IMPORTANT', label: 'Important' },
  { value: 'STANDARD', label: 'Standard' },
];

// ========== Réclamations ==========

export type StatutReclamation = 'OUVERTE' | 'EN_TRAITEMENT' | 'CLOTUREE';

export type CategorieReclamation =
  | 'QUALITE'
  | 'DELAIS'
  | 'SST_ENVIRONNEMENT'
  | 'ADMINISTRATIF';

export interface ReclamationFournisseur {
  id: string;
  fournisseurId: string;
  objet: string;
  description: string | null;
  categorie: CategorieReclamation;
  statut: StatutReclamation;
  dateReclamation: string;
  dateCloture: string | null;
  commentaireResolution: string | null;
  createdAt: string;
  createdBy: string;
  updatedAt: string | null;
}

export interface CreateReclamationRequest {
  objet: string;
  description?: string;
  categorie: CategorieReclamation;
  dateReclamation?: string;
}

export interface UpdateReclamationStatutRequest {
  statut: StatutReclamation;
  commentaireResolution?: string;
}

export const STATUT_RECLAMATION_OPTIONS: {
  value: StatutReclamation;
  label: string;
}[] = [
  { value: 'OUVERTE', label: 'Ouverte' },
  { value: 'EN_TRAITEMENT', label: 'En traitement' },
  { value: 'CLOTUREE', label: 'Clôturée' },
];

export const CATEGORIE_RECLAMATION_OPTIONS: {
  value: CategorieReclamation;
  label: string;
}[] = [
  { value: 'QUALITE', label: 'Qualité' },
  { value: 'DELAIS', label: 'Délais' },
  { value: 'SST_ENVIRONNEMENT', label: 'SST / Environnement' },
  { value: 'ADMINISTRATIF', label: 'Administratif' },
];
