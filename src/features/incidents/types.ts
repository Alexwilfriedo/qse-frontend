// ========== Enums ==========

export type Domaine = 'QUALITE' | 'SECURITE' | 'ENVIRONNEMENT';

export type IncidentType =
  | 'ACCIDENT_AVEC_ARRET'
  | 'ACCIDENT_SANS_ARRET'
  | 'PRESQU_ACCIDENT'
  | 'INCIDENT'
  | 'NON_CONFORMITE'
  | 'OPPORTUNITE';

export type IncidentStatus =
  | 'DECLARE'
  | 'EN_ANALYSE'
  | 'EN_TRAITEMENT'
  | 'CLOS';

// ========== Models ==========

export interface Incident {
  id: string;
  code: string;
  title: string;
  description: string | null;
  domaine: Domaine;
  incidentType: IncidentType;
  status: IncidentStatus;
  incidentDate: string;
  processusId: string | null;
  workUnitId: string | null;
  location: string | null;
  locationDetails: string | null;
  immediateConsequence: string | null;
  triggerFactor: string | null;
  conservativeMeasures: string | null;
  severity: number;
  riskId: string | null;
  why1Question: string | null;
  why1: string | null;
  why2Question: string | null;
  why2: string | null;
  why3Question: string | null;
  why3: string | null;
  why4Question: string | null;
  why4: string | null;
  why5Question: string | null;
  why5: string | null;
  rootCause: string | null;
  hasAnalysis: boolean;
  createdAt: string;
  createdBy: string;
  updatedAt: string | null;
  updatedBy: string | null;
  closedAt: string | null;
  closedBy: string | null;
}

// ========== Filters ==========

export interface IncidentFilters {
  domaine?: Domaine;
  incidentType?: IncidentType;
  status?: IncidentStatus;
  riskId?: string;
  search?: string;
  sortBy?: string;
  sortDir?: string;
  page?: number;
  size?: number;
}

// ========== Requests ==========

export interface CreateIncidentRequest {
  code: string;
  title: string;
  description?: string;
  domaine: Domaine;
  incidentType: IncidentType;
  processusId?: string;
  workUnitId?: string;
  incidentDate: string;
  location?: string;
  locationDetails?: string;
  immediateConsequence?: string;
  triggerFactor?: string;
  conservativeMeasures?: string;
  severity: number;
  riskId?: string;
}

export interface UpdateIncidentRequest {
  title: string;
  description?: string;
  incidentType: IncidentType;
  incidentDate: string;
  location?: string;
  locationDetails?: string;
  immediateConsequence?: string;
  triggerFactor?: string;
  conservativeMeasures?: string;
  severity: number;
  riskId?: string;
}

export interface FiveWhyRequest {
  why1Question: string;
  why1Answer: string;
  why2Question?: string;
  why2Answer?: string;
  why3Question?: string;
  why3Answer?: string;
  why4Question?: string;
  why4Answer?: string;
  why5Question?: string;
  why5Answer?: string;
  rootCause: string;
}

// ========== Actions correctives ==========

export interface CreateCorrectiveActionRequest {
  titre: string;
  responsableId: string;
  echeance: string;
}

// ========== Pagination ==========

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}
