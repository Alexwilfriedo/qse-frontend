// ========== Enums ==========

export enum StrategicDocumentType {
  PESTEL = 'PESTEL',
  SWOT = 'SWOT',
  REGISTRE_ENJEUX = 'REGISTRE_ENJEUX',
  POLITIQUE_QSE = 'POLITIQUE_QSE',
  LETTRE_ENGAGEMENT = 'LETTRE_ENGAGEMENT',
  VISION_VALEURS = 'VISION_VALEURS',
  ORGANIGRAMME = 'ORGANIGRAMME',
  DOMAINE_APPLICATION = 'DOMAINE_APPLICATION',
  RISQUES_OPPORTUNITES = 'RISQUES_OPPORTUNITES',
  PLAN_ACTIONS_STRATEGIQUES = 'PLAN_ACTIONS_STRATEGIQUES',
}

export const DOCUMENT_TYPE_LABELS: Record<StrategicDocumentType, string> = {
  [StrategicDocumentType.PESTEL]: 'Analyse PESTEL',
  [StrategicDocumentType.SWOT]: 'Analyse SWOT',
  [StrategicDocumentType.REGISTRE_ENJEUX]: 'Registre des enjeux',
  [StrategicDocumentType.POLITIQUE_QSE]: 'Politique QSE',
  [StrategicDocumentType.LETTRE_ENGAGEMENT]: "Lettre d'engagement",
  [StrategicDocumentType.VISION_VALEURS]: 'Vision & Valeurs',
  [StrategicDocumentType.ORGANIGRAMME]: 'Organigramme',
  [StrategicDocumentType.DOMAINE_APPLICATION]: "Domaine d'application",
  [StrategicDocumentType.RISQUES_OPPORTUNITES]: 'Risques & Opportunités',
  [StrategicDocumentType.PLAN_ACTIONS_STRATEGIQUES]:
    "Plan d'actions stratégiques",
};

export enum DocumentRevisionStatut {
  ACTIF = 'ACTIF',
  EN_REVISION = 'EN_REVISION',
  ARCHIVE = 'ARCHIVE',
}

export const REVISION_STATUT_LABELS: Record<DocumentRevisionStatut, string> = {
  [DocumentRevisionStatut.ACTIF]: 'Actif',
  [DocumentRevisionStatut.EN_REVISION]: 'En révision',
  [DocumentRevisionStatut.ARCHIVE]: 'Archivé',
};

export const REVISION_STATUT_COLORS: Record<DocumentRevisionStatut, string> = {
  [DocumentRevisionStatut.ACTIF]: 'success',
  [DocumentRevisionStatut.EN_REVISION]: 'warning',
  [DocumentRevisionStatut.ARCHIVE]: 'default',
};

export enum StakeholderCategory {
  CLIENT = 'CLIENT',
  SALARIE = 'SALARIE',
  ACTIONNAIRE = 'ACTIONNAIRE',
  RIVERAIN = 'RIVERAIN',
  AUTORITE = 'AUTORITE',
  FOURNISSEUR = 'FOURNISSEUR',
  PARTENAIRE = 'PARTENAIRE',
  AUTRE = 'AUTRE',
}

export const STAKEHOLDER_CATEGORY_LABELS: Record<StakeholderCategory, string> =
  {
    [StakeholderCategory.CLIENT]: 'Client',
    [StakeholderCategory.SALARIE]: 'Salarié',
    [StakeholderCategory.ACTIONNAIRE]: 'Actionnaire',
    [StakeholderCategory.RIVERAIN]: 'Riverain',
    [StakeholderCategory.AUTORITE]: 'Autorité',
    [StakeholderCategory.FOURNISSEUR]: 'Fournisseur',
    [StakeholderCategory.PARTENAIRE]: 'Partenaire',
    [StakeholderCategory.AUTRE]: 'Autre',
  };

export enum StakeholderClassification {
  INTERNE = 'INTERNE',
  EXTERNE = 'EXTERNE',
}

export const STAKEHOLDER_CLASSIFICATION_LABELS: Record<
  StakeholderClassification,
  string
> = {
  [StakeholderClassification.INTERNE]: 'Interne',
  [StakeholderClassification.EXTERNE]: 'Externe',
};

export enum StakeholderType {
  CLIENT = 'CLIENT',
  FOURNISSEUR = 'FOURNISSEUR',
  REGULATEUR = 'REGULATEUR',
  SOCIETE_CIVILE = 'SOCIETE_CIVILE',
}

export const STAKEHOLDER_TYPE_LABELS: Record<StakeholderType, string> = {
  [StakeholderType.CLIENT]: 'Client',
  [StakeholderType.FOURNISSEUR]: 'Fournisseur',
  [StakeholderType.REGULATEUR]: 'Régulateur',
  [StakeholderType.SOCIETE_CIVILE]: 'Société civile',
};

export enum CaractereExigence {
  LEGALE = 'LEGALE',
  CONTRACTUELLE = 'CONTRACTUELLE',
  REGLEMENTAIRE = 'REGLEMENTAIRE',
  VOLONTAIRE = 'VOLONTAIRE',
}

export const CARACTERE_EXIGENCE_LABELS: Record<CaractereExigence, string> = {
  [CaractereExigence.LEGALE]: 'Légale',
  [CaractereExigence.CONTRACTUELLE]: 'Contractuelle',
  [CaractereExigence.REGLEMENTAIRE]: 'Réglementaire',
  [CaractereExigence.VOLONTAIRE]: 'Volontaire',
};

export enum ObjectiveStatut {
  EN_COURS = 'EN_COURS',
  ATTEINT = 'ATTEINT',
  EN_RETARD = 'EN_RETARD',
  ABANDONNE = 'ABANDONNE',
}

export const OBJECTIVE_STATUT_LABELS: Record<ObjectiveStatut, string> = {
  [ObjectiveStatut.EN_COURS]: 'En cours',
  [ObjectiveStatut.ATTEINT]: 'Atteint',
  [ObjectiveStatut.EN_RETARD]: 'En retard',
  [ObjectiveStatut.ABANDONNE]: 'Abandonné',
};

export const OBJECTIVE_STATUT_COLORS: Record<ObjectiveStatut, string> = {
  [ObjectiveStatut.EN_COURS]: 'info',
  [ObjectiveStatut.ATTEINT]: 'success',
  [ObjectiveStatut.EN_RETARD]: 'error',
  [ObjectiveStatut.ABANDONNE]: 'default',
};

export enum ComplianceStatut {
  CONFORME = 'CONFORME',
  A_EVALUER = 'A_EVALUER',
  NON_CONFORME = 'NON_CONFORME',
}

export const COMPLIANCE_STATUT_LABELS: Record<ComplianceStatut, string> = {
  [ComplianceStatut.CONFORME]: 'Conforme',
  [ComplianceStatut.A_EVALUER]: 'À évaluer',
  [ComplianceStatut.NON_CONFORME]: 'Non conforme',
};

export const COMPLIANCE_STATUT_COLORS: Record<ComplianceStatut, string> = {
  [ComplianceStatut.CONFORME]: 'success',
  [ComplianceStatut.A_EVALUER]: 'warning',
  [ComplianceStatut.NON_CONFORME]: 'error',
};

export enum RegulatoryCategory {
  LOI_CLIMAT = 'LOI_CLIMAT',
  RGPD = 'RGPD',
  CODE_TRAVAIL = 'CODE_TRAVAIL',
  REGLEMENTATION_SECTORIELLE = 'REGLEMENTATION_SECTORIELLE',
  NORME_ISO = 'NORME_ISO',
  AUTRE = 'AUTRE',
}

export const REGULATORY_CATEGORY_LABELS: Record<RegulatoryCategory, string> = {
  [RegulatoryCategory.LOI_CLIMAT]: 'Loi Climat',
  [RegulatoryCategory.RGPD]: 'RGPD',
  [RegulatoryCategory.CODE_TRAVAIL]: 'Code du travail',
  [RegulatoryCategory.REGLEMENTATION_SECTORIELLE]: 'Réglementation sectorielle',
  [RegulatoryCategory.NORME_ISO]: 'Norme ISO',
  [RegulatoryCategory.AUTRE]: 'Autre',
};

export enum RevisionAction {
  DEMARRER_REVISION = 'DEMARRER_REVISION',
  VALIDER_REVISION = 'VALIDER_REVISION',
  ARCHIVER = 'ARCHIVER',
}

// ========== Interfaces ==========

export interface EnjeuEntry {
  description: string;
  impact: number;
  probabilite: number;
  criticite: number;
  responsableId: string;
}

export interface StrategicDocument {
  id: string;
  type: StrategicDocumentType;
  titre: string;
  description?: string;
  contenu?: string;
  fichierUrl?: string;
  fichierNom?: string;
  version: number;
  statut: DocumentRevisionStatut;
  dateRevision: string;
  alerteJoursAvant: number;
  responsableId: string;
  processusIds: string[];
  enjeux: EnjeuEntry[];
  revisionProche: boolean;
  revisionEnRetard: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface Stakeholder {
  id: string;
  nom: string;
  classification: StakeholderClassification;
  stakeholderType: StakeholderType;
  besoinAttente: string;
  caractereExigence: CaractereExigence;
  processusId?: string;
  dateCreation?: string;
  dateRevision: string;
  alerteJoursAvant: number;
  responsableId: string;
  actif: boolean;
  revisionProche: boolean;
  revisionEnRetard: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface KpiHistoryEntry {
  dateMesure: string;
  valeur: number;
  commentaire?: string;
}

export interface StrategicObjective {
  id: string;
  titre: string;
  description?: string;
  kpiNom: string;
  kpiUnite?: string;
  cible: number;
  valeurActuelle: number;
  tauxAvancement: number;
  echeance: string;
  domaine: string;
  statut: ObjectiveStatut;
  responsableId: string;
  enEcart: boolean;
  historiqueValeurs: KpiHistoryEntry[];
  createdAt: string;
  updatedAt?: string;
}

export interface RegulatoryWatch {
  id: string;
  titre: string;
  referenceTexte?: string;
  description?: string;
  categorie: RegulatoryCategory;
  dateEntreeVigueur?: string;
  dateRevue: string;
  alerteJoursAvant: number;
  statut: ComplianceStatut;
  responsableId: string;
  processusIds: string[];
  revueProche: boolean;
  revueEnRetard: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface StrategyDashboard {
  totalDocuments: number;
  totalStakeholders: number;
  totalObjectives: number;
  totalRegulatoryWatches: number;
  documentsNeedingRevision: number;
  stakeholdersNeedingRevision: number;
  objectivesEnEcart: number;
  watchesNeedingReview: number;
}

// ========== Request types ==========

export interface EnjeuRequest {
  description: string;
  impact: number;
  probabilite: number;
  responsableId: string;
}

export interface CreateStrategicDocumentRequest {
  type: StrategicDocumentType;
  titre: string;
  description?: string;
  contenu?: string;
  dateRevision: string;
  alerteJoursAvant: number;
  responsableId: string;
  processusIds?: string[];
  enjeux?: EnjeuRequest[];
}

export interface UpdateStrategicDocumentRequest {
  titre?: string;
  description?: string;
  contenu?: string;
  dateRevision?: string;
  alerteJoursAvant?: number;
  responsableId?: string;
  processusIds?: string[];
  enjeux?: EnjeuRequest[];
}

export interface RevisionDocumentRequest {
  action: RevisionAction;
  prochaineRevision?: string;
}

export interface CreateStakeholderRequest {
  nom: string;
  classification: StakeholderClassification;
  stakeholderType: StakeholderType;
  besoinAttente: string;
  caractereExigence: CaractereExigence;
  processusId?: string;
  dateCreation?: string;
  dateRevision: string;
  alerteJoursAvant: number;
  responsableId: string;
}

export interface UpdateStakeholderRequest {
  nom?: string;
  classification?: StakeholderClassification;
  stakeholderType?: StakeholderType;
  besoinAttente?: string;
  caractereExigence?: CaractereExigence;
  processusId?: string;
  dateRevision?: string;
  alerteJoursAvant?: number;
  responsableId?: string;
}

export interface CreateStrategicObjectiveRequest {
  titre: string;
  description?: string;
  kpiNom: string;
  kpiUnite?: string;
  cible: number;
  echeance: string;
  domaine: string;
  responsableId: string;
}

export interface UpdateStrategicObjectiveRequest {
  titre?: string;
  description?: string;
  kpiNom?: string;
  kpiUnite?: string;
  cible?: number;
  echeance?: string;
  responsableId?: string;
}

export interface RecordKpiMeasureRequest {
  valeur: number;
  commentaire?: string;
}

export interface CreateRegulatoryWatchRequest {
  titre: string;
  referenceTexte?: string;
  description?: string;
  categorie: RegulatoryCategory;
  dateEntreeVigueur?: string;
  dateRevue: string;
  alerteJoursAvant: number;
  responsableId: string;
  processusIds?: string[];
}

export interface UpdateRegulatoryWatchRequest {
  titre?: string;
  referenceTexte?: string;
  description?: string;
  categorie?: RegulatoryCategory;
  dateEntreeVigueur?: string;
  dateRevue?: string;
  alerteJoursAvant?: number;
  statut?: ComplianceStatut;
  responsableId?: string;
  processusIds?: string[];
}
