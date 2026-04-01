// ── Enums ──────────────────────────────────────────────

export type KpiReportDomain = 'SMQ' | 'SST' | 'AES';

export type CalculationFrequency =
  | 'MENSUEL'
  | 'TRIMESTRIEL'
  | 'SEMESTRIEL'
  | 'ANNUEL';

export type TargetStatus = 'ATTEINT' | 'NON_ATTEINT';

export type ActionType = 'CORRECTIVE' | 'PREVENTIVE';

export type ActionPlanStatus = 'PLANIFIE' | 'EN_COURS' | 'EFFECTUE';

export type EffectivenessStatus = 'EFFICACE' | 'NON_EFFICACE';

// ── Indicator (24-field form) ──────────────────────────

export interface KpiReportIndicator {
  id: string;
  domain: KpiReportDomain;

  // 1-9: Identification
  organizationalEntity: string;
  code: string;
  processId: string;
  processName: string;
  name: string;
  measureObjective: string;
  calculationFormula: string;
  unit: string;
  audience: string;
  dataOrigin: string;

  // 10-13: Calculation parameters
  target: number;
  calculationFrequency: CalculationFrequency;
  calculationResponsibleId: string;
  calculationResponsibleName: string;
  analysisResponsibleId: string;
  analysisResponsibleName: string;

  // 14-15: Results
  result: number | null;
  targetStatus: TargetStatus | null;

  // 16-17: Analysis
  rootCause: string | null;
  measureAnalysis: string | null;

  // Metadata
  period: string;
  createdAt: string;
  updatedAt: string | null;
}

// ── Create/Update requests ─────────────────────────────

export interface CreateKpiReportIndicatorRequest {
  domain: KpiReportDomain;
  organizationalEntity: string;
  code: string;
  processId: string;
  processName: string;
  name: string;
  measureObjective: string;
  calculationFormula: string;
  unit: string;
  audience: string;
  dataOrigin: string;
  target: number;
  calculationFrequency: CalculationFrequency;
  calculationResponsibleId: string;
  calculationResponsibleName: string;
  analysisResponsibleId: string;
  analysisResponsibleName: string;
  result?: number;
  rootCause?: string;
  measureAnalysis?: string;
  period: string;
}

export interface RecordResultRequest {
  result: number;
  rootCause?: string;
  measureAnalysis?: string;
}

// ── Action entry (champs 18-24, créée via module Actions) ──

export interface ActionEntry {
  type: string;          // CORRECTIVE | PREVENTIVE
  titre: string;         // Titre de l'action
  responsableId: string; // Responsable de l'action
  echeance: string;      // Échéance
  priorite: string;      // Priorité (BASSE, MOYENNE, HAUTE, CRITIQUE)
  statut: string;        // Statut (OUVERTE, EN_COURS, TERMINEE, VALIDEE, REFUSEE)
}

// ── Dashboard stats ────────────────────────────────────

export interface KpiReportDashboardStats {
  totalIndicators: number;
  targetReached: number;
  targetNotReached: number;
  effectivenessRate: number;
}
