export type ActionType =
  | 'CORRECTIVE'
  | 'PREVENTIVE'
  | 'CURATIVE'
  | 'AMELIORATION';
export type ActionStatut =
  | 'OUVERTE'
  | 'EN_COURS'
  | 'TERMINEE'
  | 'VALIDEE'
  | 'REFUSEE';
export type ActionPriorite = 'BASSE' | 'MOYENNE' | 'HAUTE' | 'CRITIQUE';
export type Domaine = 'QUALITE' | 'SECURITE' | 'ENVIRONNEMENT';
export type ActionOrigine =
  | 'AUDIT_NON_CONFORMITE'
  | 'REVUE_ANALYSE_INCIDENT'
  | 'MATRICE_RISQUES'
  | 'OPPORTUNITES'
  | 'DUERP'
  | 'ANALYSE_ENVIRONNEMENTALE'
  | 'RECLAMATION_CLIENT'
  | 'SUGGESTION_PARTIES_INTERESSEES'
  | 'SUGGESTION_COLLABORATIVE'
  | 'REVUE_DIRECTION'
  | 'AUDIT'
  | 'INCIDENT'
  | 'RISQUE'
  | 'NC'
  | 'RECLAMATION'
  | 'AUTRE';

export interface Action {
  id: string;
  titre: string;
  description: string | null;
  type: ActionType;
  priorite: ActionPriorite;
  domaine: Domaine;
  statut: ActionStatut;
  avancement: number;
  responsableId: string;
  responsableNom: string;
  verificateurId: string | null;
  verificateurNom: string | null;
  echeance: string;
  origine: ActionOrigine;
  origineId: string | null;
  enRetard: boolean;
  createdAt: string;
  createdBy: string;
  updatedAt: string | null;
}

export interface ActionDashboard {
  actionsTotal: number;
  actionsOuvertes: number;
  actionsEnCours: number;
  actionsEnRetard: number;
  actionsTerminees: number;
  tauxRealisation: number;
  parDomaine: Record<string, number>;
  parType: Record<string, number>;
}

export interface CreateActionRequest {
  titre: string;
  description?: string;
  type: ActionType;
  priorite?: ActionPriorite;
  domaine: Domaine;
  responsableId: string;
  verificateurId?: string;
  echeance: string;
  origine: ActionOrigine;
  origineId?: string;
}

export interface UpdateActionRequest {
  titre?: string;
  description?: string;
  type?: ActionType;
  priorite?: ActionPriorite;
  domaine?: Domaine;
  responsableId?: string;
  verificateurId?: string;
  echeance?: string;
}

export interface ActionsFilter {
  statut?: ActionStatut;
  domaine?: Domaine;
  type?: ActionType;
  priorite?: ActionPriorite;
  responsableId?: string;
  verificateurId?: string;
  enRetard?: boolean;
  echeanceDebut?: string;
  echeanceFin?: string;
  search?: string;
  sort?: string;
  origineId?: string;
  page?: number;
  size?: number;
}

// Action Plans
export interface ActionPlan {
  id: string;
  titre: string;
  description: string | null;
  actionCount: number;
  actions: ActionSummary[];
  createdAt: string;
  createdBy: string;
  createdByNom: string;
  updatedAt: string | null;
}

export interface ActionSummary {
  id: string;
  titre: string;
  statut: string;
  avancement: number;
  responsableId: string;
  responsableNom: string;
}

export interface ActionPlanStats {
  planId: string;
  planTitre: string;
  total: number;
  completed: number;
  inProgress: number;
  pending: number;
  completionRate: number;
}

export interface CreateActionPlanRequest {
  titre: string;
  description?: string;
  actionIds?: string[];
}

export interface AddActionsRequest {
  actionIds: string[];
}

export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

export interface ActionHistoryEntry {
  id: string;
  eventType: string;
  oldValue: string | null;
  newValue: string | null;
  comment: string | null;
  createdAt: string;
  createdBy: string;
  createdByNom: string;
}

export interface ActionHistoryView {
  actionId: string;
  actionTitre: string;
  entries: ActionHistoryEntry[];
}
