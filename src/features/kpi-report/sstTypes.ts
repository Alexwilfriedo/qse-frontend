// ── Accidentologie ──

export interface SstServiceEvent {
  id: string;
  entityId: string;
  entityName: string;
  eventCount: number;
}

export interface SstMonthlyReport {
  id: string;
  period: string;
  entryDate: string;
  accidentsTrajet: number;
  accidentsTrajetComment: string | null;
  fatalites: number;
  fatalitesComment: string | null;
  accidentsAvecArret: number;
  accidentsAvecArretComment: string | null;
  accidentsSansArret: number;
  accidentsSansArretComment: string | null;
  presquaccidents: number;
  presquaccidentsComment: string | null;
  joursArrets: number;
  joursArretsComment: string | null;
  heuresTravaillees: number;
  tauxFrequence: number | null;
  tauxGravite: number | null;
  pctActionsRealisees: number | null;
  pctConformiteEpi: number | null;
  nbInspectionsTerrain: number;
  tauxParticipationCauseries: number | null;
  serviceEvents: SstServiceEvent[];
  createdAt: string;
}

export interface CreateSstMonthlyReportRequest {
  period: string;
  entryDate: string;
  accidentsTrajet: number;
  accidentsTrajetComment?: string;
  fatalites: number;
  fatalitesComment?: string;
  accidentsAvecArret: number;
  accidentsAvecArretComment?: string;
  accidentsSansArret: number;
  accidentsSansArretComment?: string;
  presquaccidents: number;
  presquaccidentsComment?: string;
  joursArrets: number;
  joursArretsComment?: string;
  heuresTravaillees: number;
  pctActionsRealisees?: number;
  pctConformiteEpi?: number;
  nbInspectionsTerrain?: number;
  tauxParticipationCauseries?: number;
  serviceEvents?: { entityId: string; entityName: string; eventCount: number }[];
}

// ── EPI ──

export interface SstEpiReport {
  id: string;
  period: string;
  responsibleName: string;
  entreesTete: number;
  sortiesTete: number;
  rebutTete: number;
  entreesMains: number;
  sortiesMains: number;
  rebutMains: number;
  entreesPieds: number;
  sortiesPieds: number;
  rebutPieds: number;
  epiEnService: number;
  epiEnStockage: number;
  epiEnReparation: number;
  epiSansControle: number;
  controlesConformes: number;
  controlesA30j: number;
  controlesRetard: number;
  ptiDefectueux: number;
  totalStock: number;
  createdAt: string;
}

export interface CreateSstEpiReportRequest {
  period: string;
  responsibleName: string;
  entreesTete: number;
  sortiesTete: number;
  rebutTete: number;
  entreesMains: number;
  sortiesMains: number;
  rebutMains: number;
  entreesPieds: number;
  sortiesPieds: number;
  rebutPieds: number;
  epiEnService: number;
  epiEnStockage: number;
  epiEnReparation: number;
  epiSansControle: number;
  controlesConformes: number;
  controlesA30j: number;
  controlesRetard: number;
  ptiDefectueux: number;
}

// ── Event types (pour le formulaire) ──

export const SST_EVENT_TYPES = [
  { key: 'accidentsTrajet', label: 'Accident de Trajet', target: 0, targetLabel: '0 accident' },
  { key: 'fatalites', label: 'Fatalité (Décès)', target: 0, targetLabel: '0 accident' },
  { key: 'accidentsAvecArret', label: 'Accident avec arrêt', target: 0, targetLabel: '0 accident' },
  { key: 'accidentsSansArret', label: 'Accident sans arrêt', target: 0, targetLabel: '0 accident' },
  { key: 'presquaccidents', label: 'Presqu\'accident / Incident', target: 0, targetLabel: '0 incident' },
  { key: 'joursArrets', label: 'Nombre de jours d\'arrêts', target: 120, targetLabel: '120 jours' },
] as const;
