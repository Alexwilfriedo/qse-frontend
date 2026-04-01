import type { ActionOrigine, ActionType } from './types';

export const ACTION_TYPE_OPTIONS: { value: ActionType; label: string }[] = [
  { value: 'CORRECTIVE', label: 'Corrective' },
  { value: 'PREVENTIVE', label: 'Préventive' },
  { value: 'CURATIVE', label: 'Curative' },
  { value: 'AMELIORATION', label: "Amélioration" },
];

export const ACTION_TYPE_LABELS: Record<ActionType, string> = {
  CORRECTIVE: 'Corrective',
  PREVENTIVE: 'Préventive',
  CURATIVE: 'Curative',
  AMELIORATION: 'Amélioration',
};

export const ACTION_ORIGIN_OPTIONS: { value: ActionOrigine; label: string }[] = [
  {
    value: 'AUDIT_NON_CONFORMITE',
    label: "Audit (non-conformités issues des rapports d'audits internes QSE, sécurité, environnement)",
  },
  {
    value: 'REVUE_ANALYSE_INCIDENT',
    label: "Revue et analyse de l'incident",
  },
  { value: 'MATRICE_RISQUES', label: 'Matrice des risques' },
  { value: 'OPPORTUNITES', label: 'Opportunités' },
  { value: 'DUERP', label: 'DUERP' },
  {
    value: 'ANALYSE_ENVIRONNEMENTALE',
    label: 'Analyse environnementale',
  },
  { value: 'RECLAMATION_CLIENT', label: 'Réclamation client' },
  {
    value: 'SUGGESTION_PARTIES_INTERESSEES',
    label: 'Suggestion des parties intéressées',
  },
  {
    value: 'SUGGESTION_COLLABORATIVE',
    label: 'Suggestion collaborative',
  },
  { value: 'REVUE_DIRECTION', label: 'Revue de direction' },
  { value: 'AUDIT', label: 'Audit' },
  { value: 'INCIDENT', label: 'Incident' },
  { value: 'RISQUE', label: 'Risque' },
  { value: 'NC', label: 'Non-conformité' },
  { value: 'RECLAMATION', label: 'Réclamation' },
  { value: 'AUTRE', label: 'Autre' },
];

export const ACTION_ORIGIN_LABELS: Record<ActionOrigine, string> =
  ACTION_ORIGIN_OPTIONS.reduce(
    (acc, option) => {
      acc[option.value] = option.label;
      return acc;
    },
    {} as Record<ActionOrigine, string>,
  );

export const ACTION_ORIGIN_ALLOWED_TYPES: Record<ActionOrigine, ActionType[]> = {
  AUDIT_NON_CONFORMITE: ['CORRECTIVE'],
  REVUE_ANALYSE_INCIDENT: ['CORRECTIVE'],
  MATRICE_RISQUES: ['PREVENTIVE', 'CORRECTIVE'],
  OPPORTUNITES: ['AMELIORATION'],
  DUERP: ['CORRECTIVE'],
  ANALYSE_ENVIRONNEMENTALE: ['CORRECTIVE'],
  RECLAMATION_CLIENT: ['CORRECTIVE'],
  SUGGESTION_PARTIES_INTERESSEES: ['AMELIORATION'],
  SUGGESTION_COLLABORATIVE: ['AMELIORATION'],
  REVUE_DIRECTION: ['AMELIORATION'],
  AUDIT: ['CORRECTIVE'],
  INCIDENT: ['CORRECTIVE'],
  RISQUE: ['PREVENTIVE', 'CORRECTIVE'],
  NC: ['CORRECTIVE'],
  RECLAMATION: ['CORRECTIVE'],
  AUTRE: ['CORRECTIVE', 'PREVENTIVE', 'CURATIVE', 'AMELIORATION'],
};

export function getAllowedActionTypes(
  origine: ActionOrigine | '',
): ActionType[] {
  if (!origine) {
    return ACTION_TYPE_OPTIONS.map((option) => option.value);
  }
  return ACTION_ORIGIN_ALLOWED_TYPES[origine];
}
