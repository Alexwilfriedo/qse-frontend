import type { Domaine } from './types';

export const AUDIT_PROGRAM_DOMAINS: Array<{
  domaine: Domaine;
  label: string;
  normes: string[];
  accentClass: string;
  accentSoftClass: string;
}> = [
  {
    domaine: 'QUALITE',
    label: 'Qualité',
    normes: ['ISO 9001:2015'],
    accentClass: 'border-sky-300 bg-sky-50',
    accentSoftClass: 'bg-sky-100 text-sky-800',
  },
  {
    domaine: 'SECURITE',
    label: 'Sécurité',
    normes: ['ISO 45001:2018'],
    accentClass: 'border-emerald-300 bg-emerald-50',
    accentSoftClass: 'bg-emerald-100 text-emerald-800',
  },
  {
    domaine: 'ENVIRONNEMENT',
    label: 'Environnement',
    normes: ['ISO 14001:2015'],
    accentClass: 'border-amber-300 bg-amber-50',
    accentSoftClass: 'bg-amber-100 text-amber-800',
  },
];
