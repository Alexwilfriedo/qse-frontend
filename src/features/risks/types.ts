// ========== Enums ==========

export type ScaleType = 'FREQUENCY' | 'SEVERITY' | 'MASTERY';

export type CriticalityLevel = 'FAIBLE' | 'MOYEN' | 'ELEVE';

export type CatalogType =
  | 'WORK_UNIT'
  | 'DANGER_TYPE'
  | 'ENVIRONMENTAL_ASPECT'
  | 'RISK_FAMILY';

// ========== Config: Scales ==========

export interface ScaleLevel {
  id: string;
  value: number;
  label: string;
  color: string;
}

export interface RiskScale {
  id: string;
  type: ScaleType;
  label: string;
  maxValue: number;
  levels: ScaleLevel[];
}

export interface SaveScaleRequest {
  type: ScaleType;
  label: string;
  maxValue: number;
  levels: { value: number; label: string; color: string }[];
}

// ========== Config: Criticality Matrix ==========

export interface CriticalityThreshold {
  id: string;
  level: CriticalityLevel;
  minValue: number;
  maxValue: number;
  label: string;
  color: string;
}

export interface SaveThresholdRequest {
  level: CriticalityLevel;
  minValue: number;
  maxValue: number;
  label: string;
  color: string;
}

// ========== Config: Catalogs ==========

export interface RiskCatalogItem {
  id: string;
  catalogType: CatalogType;
  code: string;
  label: string;
  description: string | null;
  parentId: string | null;
  active: boolean;
  sortOrder: number;
}

export interface CreateCatalogItemRequest {
  catalogType: CatalogType;
  code: string;
  label: string;
  description?: string;
  parentId?: string;
  sortOrder: number;
}

export interface UpdateCatalogItemRequest {
  label: string;
  description?: string;
  sortOrder: number;
}

// ========== M4.2: Risks ==========

export type RiskType =
  | 'DANGER'
  | 'ASPECT_ENVIRONNEMENTAL'
  | 'VULNERABILITE_PROCESSUS';

export type Domaine = 'QUALITE' | 'SECURITE' | 'ENVIRONNEMENT';

export type RiskCategory =
  | 'STRATEGIQUE'
  | 'OPERATIONNEL'
  | 'FINANCIER'
  | 'JURIDIQUE'
  | 'TECHNOLOGIQUE'
  | 'PHYSIQUE'
  | 'PSYCHOSOCIAUX'
  | 'CATASTROPHES_NATURELLES'
  | 'CHIMIQUES'
  | 'BIOLOGIQUE';

export type EnvironmentalSituation = 'NORMALE' | 'ACCIDENTELLE';

export interface Risk {
  id: string;
  code: string;
  title: string;
  description: string | null;
  domaine: Domaine;
  riskType: RiskType;
  riskCategory: RiskCategory | null;
  processusId: string | null;
  workUnitId: string | null;
  catalogItemId: string | null;
  causes: string | null;
  consequences: string | null;
  affectedEmployees: string | null;
  masteryLevel: number | null;
  environmentalSituation: EnvironmentalSituation | null;
  reviewDate: string | null;
  frequency: number;
  severity: number;
  criticityScore: number;
  criticalityLevel: CriticalityLevel | null;
  criticalityColor: string;
  residualFrequency: number | null;
  residualSeverity: number | null;
  residualCriticityScore: number;
  residualCriticalityLevel: CriticalityLevel | null;
  residualCriticalityColor: string | null;
  createdAt: string;
  createdBy: string;
  updatedAt: string | null;
  updatedBy: string | null;
}

export interface CreateRiskRequest {
  code: string;
  title: string;
  description?: string;
  domaine: Domaine;
  riskType: RiskType;
  riskCategory: RiskCategory;
  processusId?: string;
  workUnitId?: string;
  catalogItemId?: string;
  causes?: string;
  consequences?: string;
  frequency: number;
  severity: number;
  affectedEmployees?: string;
  masteryLevel?: number;
  environmentalSituation?: EnvironmentalSituation;
  reviewDate?: string;
}

export interface UpdateRiskRequest {
  title: string;
  description?: string;
  riskCategory: RiskCategory;
  processusId?: string;
  workUnitId?: string;
  catalogItemId?: string;
  causes?: string;
  consequences?: string;
  frequency: number;
  severity: number;
  affectedEmployees?: string;
  masteryLevel?: number;
  environmentalSituation?: EnvironmentalSituation;
  reviewDate?: string;
}

export interface RiskFilters {
  domaine?: Domaine;
  riskType?: RiskType;
  processusId?: string;
  workUnitId?: string;
  frequency?: number;
  severity?: number;
  search?: string;
  page: number;
  size: number;
  sortBy?: string;
  sortDir?: 'asc' | 'desc';
}

// ========== M4.2: Document Links ==========

export interface RiskDocumentLink {
  id: string;
  riskId: string;
  documentId: string;
  description: string | null;
  createdAt: string;
  createdBy: string;
}

export interface AddDocumentLinkRequest {
  documentId: string;
  description?: string;
}

// ========== M4.3: Matrix & Statistics ==========

export interface MatrixCell {
  frequency: number;
  severity: number;
  score: number;
  riskCount: number;
  level: CriticalityLevel | null;
  label: string;
  color: string;
}

export interface MatrixScaleLevel {
  value: number;
  label: string;
  color: string;
}

export interface MatrixData {
  maxFrequency: number;
  maxSeverity: number;
  frequencyLevels: MatrixScaleLevel[];
  severityLevels: MatrixScaleLevel[];
  cells: MatrixCell[];
}

export interface StatLevel {
  level: CriticalityLevel;
  label: string;
  color: string;
  count: number;
}

export interface RiskStatistics {
  totalRisks: number;
  levels: StatLevel[];
  unclassified: number;
}

// ========== M4.5: Comparison Matrix & KPI ==========

export interface ComparisonMatrix {
  bruteMatrix: MatrixData;
  residualMatrix: MatrixData;
  risksWithResidual: number;
  totalRisks: number;
}

export interface RiskKpi {
  totalRisks: number;
  risksWithResidual: number;
  residualEvalRate: number;
  totalMeasures: number;
  evaluatedMeasures: number;
  measureEvalRate: number;
  overdueMeasures: number;
  avgMeasuresPerRisk: number;
  bruteByLevel: Record<CriticalityLevel, number>;
  residualByLevel: Record<CriticalityLevel, number>;
}

// ========== M4.4: Mitigation Measures ==========

export type MitigationStrategy =
  | 'ELIMINATION'
  | 'REDUCTION'
  | 'TRANSFERT'
  | 'ACCEPTATION';

export type MeasureEffectiveness =
  | 'NON_EVALUEE'
  | 'INSUFFISANTE'
  | 'PARTIELLE'
  | 'EFFICACE';

export interface RiskMitigationMeasure {
  id: string;
  riskId: string;
  title: string;
  description: string | null;
  strategy: MitigationStrategy;
  effectiveness: MeasureEffectiveness;
  responsibleUserId: string | null;
  documentId: string | null;
  dueDate: string | null;
  resources: string | null;
  overdue: boolean;
  createdAt: string;
  createdBy: string;
  updatedAt: string | null;
  updatedBy: string | null;
}

// ========== M4-22: Vue centralisée des mesures ==========

export interface MeasureWithRiskView {
  id: string;
  riskId: string;
  riskCode: string;
  riskTitle: string;
  riskDomaine: Domaine;
  title: string;
  description: string | null;
  strategy: MitigationStrategy;
  effectiveness: MeasureEffectiveness;
  responsibleUserId: string | null;
  documentId: string | null;
  dueDate: string | null;
  resources: string | null;
  overdue: boolean;
  createdAt: string;
  createdBy: string;
  updatedAt: string | null;
  updatedBy: string | null;
}

export interface EvaluateResidualRequest {
  residualFrequency: number;
  residualSeverity: number;
}

export interface CreateMeasureRequest {
  title: string;
  description?: string;
  strategy: MitigationStrategy;
  responsibleUserId?: string;
  documentId?: string;
  dueDate?: string;
  resources?: string;
}

export interface UpdateMeasureRequest {
  title: string;
  description?: string;
  strategy: MitigationStrategy;
  effectiveness?: MeasureEffectiveness;
  responsibleUserId?: string;
  documentId?: string;
  dueDate?: string;
  resources?: string;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

// ========== Livrables automatisés ==========

export interface MeasureSummary {
  title: string;
  strategy: MitigationStrategy;
  effectiveness: MeasureEffectiveness;
  responsibleName: string | null;
  dueDate: string | null;
}

export interface ActionSummary {
  title: string;
  responsibleName: string | null;
  dueDate: string | null;
}

// --- DUERP (ISO 45001) ---

export interface DuerpRiskRow {
  riskId: string;
  code: string;
  title: string;
  causes: string | null;
  consequences: string | null;
  frequency: number;
  severity: number;
  criticalityScore: number;
  measures: MeasureSummary[];
  actionPlans: ActionSummary[];
  residualFrequency: number | null;
  residualSeverity: number | null;
  residualScore: number;
  linkedActionsCount: number;
}

export interface DuerpWorkUnitSection {
  workUnitId: string;
  workUnitName: string;
  risks: DuerpRiskRow[];
}

export interface DuerpReport {
  generatedAt: string;
  totalRisks: number;
  sections: DuerpWorkUnitSection[];
}

// --- Analyse Environnementale (ISO 14001) ---

export interface EnvironmentalRow {
  riskId: string;
  code: string;
  title: string;
  description: string | null;
  causes: string | null;
  consequences: string | null;
  frequency: number;
  severity: number;
  criticalityScore: number;
  measures: MeasureSummary[];
  residualFrequency: number | null;
  residualSeverity: number | null;
  residualScore: number;
  significantAspect: boolean;
}

export interface EnvironmentalSection {
  workUnitId: string;
  workUnitName: string;
  aspects: EnvironmentalRow[];
}

export interface EnvironmentalReport {
  generatedAt: string;
  totalAspects: number;
  significantAspectsCount: number;
  sections: EnvironmentalSection[];
}

// --- Cartographie Risques Processus (ISO 9001) ---

export interface ProcessRiskRow {
  riskId: string;
  code: string;
  title: string;
  causes: string | null;
  consequences: string | null;
  frequency: number;
  severity: number;
  criticalityScore: number;
  controls: MeasureSummary[];
  residualFrequency: number | null;
  residualSeverity: number | null;
  residualScore: number;
  linkedActionsCount: number;
}

export interface ProcessRiskSection {
  processusId: string;
  processusName: string;
  risks: ProcessRiskRow[];
}

export interface ProcessRiskReport {
  generatedAt: string;
  totalRisks: number;
  sections: ProcessRiskSection[];
}

// ========== M4.6: Opportunités ==========

export type OpportunityStatus =
  | 'IDENTIFIEE'
  | 'EN_COURS'
  | 'REALISEE'
  | 'ABANDONNEE';

export type OpportunityPriority = 'FAIBLE' | 'MOYENNE' | 'ELEVEE';
export type OpportunityDecision = 'RETENUE' | 'EN_ATTENTE' | 'REJETEE';

export interface Opportunity {
  id: string;
  title: string;
  description: string | null;
  domaine: Domaine;
  opportunityTypeCode: string | null;
  originCode: string | null;
  processusId: string | null;
  processusName: string | null;
  associatedRiskIds: string[];
  feasibilityScore: number;
  benefitScore: number;
  score: number;
  priority: OpportunityPriority;
  kpiTransformation: string | null;
  roiEstime: string | null;
  decision: OpportunityDecision | null;
  necessaryActions: string | null;
  estimatedBudget: string | null;
  responsibleUserId: string | null;
  responsibleUserName: string | null;
  dueDate: string | null;
  obtainedResults: string | null;
  successIndicator: string | null;
  status: OpportunityStatus;
  createdAt: string;
  createdBy: string;
  updatedAt: string | null;
  updatedBy: string | null;
}

export interface CreateOpportunityRequest {
  title: string;
  domaine: Domaine;
  opportunityTypeCode: string;
  originCode: string;
  processusId?: string;
  feasibilityScore: number;
  benefitScore: number;
}

export interface UpdateOpportunityRequest {
  title: string;
  opportunityTypeCode: string;
  originCode: string;
  processusId?: string;
  feasibilityScore: number;
  benefitScore: number;
  decision?: OpportunityDecision;
  necessaryActions?: string;
  estimatedBudget?: string;
  responsibleUserId?: string;
  dueDate?: string;
  obtainedResults?: string;
  successIndicator?: string;
  associatedRiskIds?: string[];
  status: OpportunityStatus;
}
