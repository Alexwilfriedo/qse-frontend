// ── Axes de la norme (fixes) ──

export const AES_AXES = [
  {
    code: 'CONFORMITE_REGLEMENTAIRE',
    label: 'Conformité Réglementaire',
    defaultIndicator: 'Taux de conformité aux arrêtés (ICPE / Code Environnement CI)',
    defaultTarget: 1,
    defaultUnit: 'Unité',
    justification: 'Respect de la loi ivoirienne de 2014 sur le développement durable.',
  },
  {
    code: 'ASPECTS_SIGNIFICATIFS',
    label: 'Maîtrise des Aspects Significatifs',
    defaultIndicator: "Nombre d'incidents de pollution",
    defaultTarget: 0,
    defaultUnit: 'Unité',
    justification: 'Protection des sols et des nappes phréatiques près des postes HT.',
  },
  {
    code: 'PERFORMANCE_ENERGETIQUE',
    label: 'Performance Énergétique & Mix',
    defaultIndicator: 'Part des énergies renouvelables injectées dans le réseau national',
    defaultTarget: 45,
    defaultUnit: '%',
    justification: "Contribution aux ODD et réduction de l'empreinte carbone globale.",
  },
  {
    code: 'GESTION_DECHETS',
    label: 'Gestion des Déchets',
    defaultIndicator: 'Taux de valorisation des déchets industriels (cuivre, isolateurs, huiles)',
    defaultTarget: 80,
    defaultUnit: '%',
    justification: 'Réduction des coûts et économie circulaire des matériaux stratégiques.',
  },
  {
    code: 'LEADERSHIP_SENSIBILISATION',
    label: 'Leadership & Sensibilisation',
    defaultIndicator: 'Pourcentage du personnel formé aux procédures environnementales',
    defaultTarget: 100,
    defaultUnit: '%',
    justification: 'Engagement des employés pour limiter les erreurs opérationnelles.',
  },
  {
    code: 'RELATIONS_PARTIES_INTERESSEES',
    label: 'Relations Parties Intéressées',
    defaultIndicator: 'Nombre de plaintes riveraines liées aux impacts des chantiers',
    defaultTarget: 0,
    defaultUnit: 'Unité',
    justification: 'Acceptabilité sociale des grands projets (barrages).',
  },
] as const;

export type AesAxisCode = (typeof AES_AXES)[number]['code'];

export type AesMeasurementStatus = 'CONFORME' | 'A_SURVEILLER' | 'NON_CONFORME';

export interface AesMeasurement {
  id: string;
  dateMesure: string;
  siteId: string;
  siteName: string;
  axisCode: AesAxisCode;
  indicatorName: string;
  realizedValue: number;
  targetValue: number;
  unit: string;
  status: AesMeasurementStatus;
  proofFileName: string | null;
  createdAt: string;
}

export interface CreateAesMeasurementRequest {
  dateMesure: string;
  siteId: string;
  siteName: string;
  axisCode: AesAxisCode;
  indicatorName: string;
  realizedValue: number;
  targetValue: number;
  unit: string;
}
