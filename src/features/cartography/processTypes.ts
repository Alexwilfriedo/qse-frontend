export type ProcessType = 'MANAGEMENT' | 'REALISATION' | 'SUPPORT';

export type ProcessStatut = 'EN_VIGUEUR' | 'EN_REVISION' | 'OBSOLETE';

export type ProcessLinkType = 'FOURNISSEUR' | 'CLIENT';

export interface ProcessView {
  id: string;
  nom: string;
  codification: string;
  type: ProcessType;
  description: string | null;
  piloteId: string;
  managerId: string | null;
  entityId: string | null;
  processusCle: boolean;
  statut: ProcessStatut;
  versionNumber: number;
  axesStrategiques: string | null;
  finalites: string | null;
  fournisseurs: string | null;
  elementsEntree: string | null;
  activites: string | null;
  elementsSortie: string | null;
  clients: string | null;
  exigencesLegales: string | null;
  dateValidite: string | null;
  createdAt: string;
  createdBy: string;
  updatedAt: string | null;
  entityVersion: number;
}

export interface ProcessLinkView {
  id: string;
  sourceProcessId: string;
  targetProcessId: string;
  linkType: ProcessLinkType;
  description: string | null;
  createdAt: string;
}

export interface ProcessMapView {
  management: ProcessView[];
  realisation: ProcessView[];
  support: ProcessView[];
  links: ProcessLinkView[];
}

export interface CreateProcessRequest {
  nom: string;
  type: ProcessType;
  description?: string;
  piloteId: string;
  managerId: string;
  entityId?: string;
  processusCle?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface UpdateProcessRequest {
  nom: string;
  type: ProcessType;
  description?: string;
  piloteId: string;
  managerId: string;
  entityId?: string;
  processusCle?: boolean;
}

export interface UpdateFipRequest {
  axesStrategiques?: string;
  finalites?: string;
  fournisseurs?: string;
  elementsEntree?: string;
  activites?: string;
  elementsSortie?: string;
  clients?: string;
  exigencesLegales?: string;
  dateValidite?: string;
}

export interface ChangeStatutRequest {
  statut: ProcessStatut;
}

export interface CreateLinkRequest {
  targetId: string;
  type: ProcessLinkType;
  description?: string;
}

export const PROCESS_STATUTS: {
  value: ProcessStatut;
  label: string;
  color: string;
}[] = [
  {
    value: 'EN_VIGUEUR',
    label: 'En vigueur',
    color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  },
  {
    value: 'EN_REVISION',
    label: 'En révision',
    color: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200',
  },
  {
    value: 'OBSOLETE',
    label: 'Obsolète',
    color: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
  },
];

export const PROCESS_TYPES: {
  value: ProcessType;
  label: string;
  color: string;
}[] = [
  {
    value: 'MANAGEMENT',
    label: 'Management',
    color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  },
  {
    value: 'REALISATION',
    label: 'Réalisation',
    color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  },
  {
    value: 'SUPPORT',
    label: 'Support',
    color:
      'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
  },
];

export const LINK_TYPES: { value: ProcessLinkType; label: string }[] = [
  { value: 'FOURNISSEUR', label: 'Fournisseur' },
  { value: 'CLIENT', label: 'Client' },
];

// ========== Maturité ==========

export interface MaturityEvaluationView {
  id: string;
  processId: string;
  scoreDefinition: number;
  scoreResponsabilities: number;
  scoreProcedures: number;
  scoreEffectiveness: number;
  scoreAdaptability: number;
  noteMoyenne: number;
  createdAt: string;
  createdBy: string;
}

export interface CreateMaturityEvaluationRequest {
  scoreDefinition: number;
  scoreResponsabilities: number;
  scoreProcedures: number;
  scoreEffectiveness: number;
  scoreAdaptability: number;
}

export interface ProcessMaturityEntry {
  process: ProcessView;
  evaluation: MaturityEvaluationView | null;
}

export interface MaturityMatrixView {
  entries: ProcessMaturityEntry[];
}

export type MaturityCriterionKey =
  | 'scoreDefinition'
  | 'scoreResponsabilities'
  | 'scoreProcedures'
  | 'scoreEffectiveness'
  | 'scoreAdaptability';

export const MATURITY_CRITERIA: {
  key: MaturityCriterionKey;
  label: string;
}[] = [
  {
    key: 'scoreDefinition',
    label: 'Le processus est-il défini de manière appropriée ?',
  },
  {
    key: 'scoreResponsabilities',
    label: 'Les responsabilités sont-elles attribuées ?',
  },
  {
    key: 'scoreProcedures',
    label: 'Les procédures sont-elles mises en œuvre et tenues à jour ?',
  },
  {
    key: 'scoreEffectiveness',
    label:
      'Le processus est-il efficace pour obtenir les résultats attendus ?',
  },
  {
    key: 'scoreAdaptability',
    label: "Capacité du processus à évoluer et s'adapter au changement",
  },
];
