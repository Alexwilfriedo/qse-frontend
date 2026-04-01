export type IndicatorType = 'PERFORMANCE' | 'CONFORMITE' | 'SATISFACTION' | 'CUSTOM';
export type DataSource = 'MANUAL' | 'AUTOMATIC';
export type FrequenceMesure = 'MENSUELLE' | 'TRIMESTRIELLE' | 'SEMESTRIELLE' | 'ANNUELLE';
export type SensIndicateur = 'HIGHER_IS_BETTER' | 'LOWER_IS_BETTER';
export type CouleurSeuil = 'VERT' | 'ORANGE' | 'ROUGE';
export type Tendance = 'HAUSSE' | 'BAISSE' | 'STABLE';

export interface IndicatorView {
  id: string;
  processId: string;
  nom: string;
  code: string;
  description?: string;
  unite: string;
  typeIndicateur: IndicatorType;
  sourceDonnees: DataSource;
  frequenceMesure: FrequenceMesure;
  objectif?: number;
  seuilVert?: number;
  seuilOrange?: number;
  seuilRouge?: number;
  sens: SensIndicateur;
  actif: boolean;
  createdAt: string;
  entityVersion: number;
}

export interface MeasurementView {
  id: string;
  indicatorId: string;
  valeur: number;
  dateMesure: string;
  periodeLabel?: string;
  commentaire?: string;
  createdAt: string;
  createdBy: string;
}

export interface IndicatorDashboardView {
  indicatorId: string;
  processId: string;
  nom: string;
  code: string;
  unite: string;
  typeIndicateur: string;
  frequenceMesure: string;
  objectif?: number;
  derniereValeur?: number;
  periodeLabel?: string;
  couleurSeuil?: CouleurSeuil;
  tendance?: Tendance;
  actif: boolean;
}

export interface CreateIndicatorRequest {
  processId: string;
  nom: string;
  code: string;
  description?: string;
  unite: string;
  typeIndicateur: IndicatorType;
  sourceDonnees: DataSource;
  frequenceMesure: FrequenceMesure;
  objectif?: number;
  seuilVert?: number;
  seuilOrange?: number;
  seuilRouge?: number;
  sens: SensIndicateur;
}

export interface UpdateIndicatorRequest {
  nom: string;
  description?: string;
  unite: string;
  typeIndicateur: IndicatorType;
  sourceDonnees: DataSource;
  frequenceMesure: FrequenceMesure;
  objectif?: number;
  seuilVert?: number;
  seuilOrange?: number;
  seuilRouge?: number;
  sens: SensIndicateur;
}

export interface RecordMeasurementRequest {
  valeur: number;
  dateMesure: string;
  periodeLabel?: string;
  commentaire?: string;
}
