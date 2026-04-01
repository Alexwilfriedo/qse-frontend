export interface SupplierEvaluationCriterionTemplate {
  code: string;
  label: string;
  prompt: string;
}

export interface SupplierEvaluationSectionTemplate {
  id: string;
  title: string;
  weight: number;
  colorClass: string;
  criteria: SupplierEvaluationCriterionTemplate[];
}

export const SUPPLIER_EVALUATION_TEMPLATE: SupplierEvaluationSectionTemplate[] = [
  {
    id: 'PERFORMANCE_TECHNIQUE_QUALITE',
    title: 'Performance technique & Qualité',
    weight: 40,
    colorClass: 'bg-sky-50 border-sky-200',
    criteria: [
      {
        code: 'CONFORMITE_TECHNIQUE',
        label: 'Conformité technique',
        prompt:
          'Le matériel respecte-t-il les spécifications de CI-ENERGIES et les normes CEI ?',
      },
      {
        code: 'TAUX_DEFECTUOSITE',
        label: 'Taux de défectuosité',
        prompt:
          'Fiabilité des équipements lors des tests de mise en service (FAT/SAT).',
      },
      {
        code: 'COMPETENCE_EQUIPES',
        label: 'Compétence des équipes',
        prompt:
          'Qualification technique du personnel déployé sur le terrain (Ingénieurs/Monteurs).',
      },
      {
        code: 'DOCUMENTATION_TECHNIQUE',
        label: 'Documentation technique',
        prompt:
          "Qualité des plans d'exécution et des dossiers d'ouvrages exécutés (DOE).",
      },
    ],
  },
  {
    id: 'RESPECT_DELAIS_LOGISTIQUE',
    title: 'Respect des délais & Logistique',
    weight: 25,
    colorClass: 'bg-amber-50 border-amber-200',
    criteria: [
      {
        code: 'DELAIS_LIVRAISON',
        label: 'Délais de livraison',
        prompt:
          'Respect des dates contractuelles pour la fourniture des équipements.',
      },
      {
        code: 'AVANCEMENT_TRAVAUX',
        label: 'Avancement des travaux',
        prompt: 'Respect du planning de déploiement (Génie civil / Montage).',
      },
      {
        code: 'REACTIVITE_PROJET',
        label: 'Réactivité',
        prompt:
          'Capacité à traiter les urgences ou les modifications de périmètre en cours de projet.',
      },
    ],
  },
  {
    id: 'SECURITE_ENVIRONNEMENT_ETHIQUE',
    title: 'Sécurité, Environnement & Éthique (HSE/RSE)',
    weight: 20,
    colorClass: 'bg-emerald-50 border-emerald-200',
    criteria: [
      {
        code: 'SECURITE_HSE',
        label: 'Sécurité (HSE)',
        prompt:
          'Port des EPI, balisage des chantiers et respect des consignes de sécurité électrique.',
      },
      {
        code: 'GESTION_ENVIRONNEMENTALE',
        label: 'Gestion environnementale',
        prompt:
          'Évacuation des huiles de transfo, gestion des déchets et remise en état des sites.',
      },
      {
        code: 'INTEGRITE_ETHIQUE',
        label: 'Intégrité',
        prompt:
          "Absence de pratiques non éthiques ou de conflits d'intérêts signalés.",
      },
    ],
  },
  {
    id: 'RELATION_COMMERCIALE_COUTS',
    title: 'Relation commerciale & Coûts',
    weight: 15,
    colorClass: 'bg-fuchsia-50 border-fuchsia-200',
    criteria: [
      {
        code: 'TENUE_BUDGETS',
        label: 'Tenue des budgets',
        prompt:
          'Absence de réclamations injustifiées pour travaux supplémentaires (Avenants).',
      },
      {
        code: 'QUALITE_FACTURATION',
        label: 'Qualité de la facturation',
        prompt: 'Conformité des décomptes et rapidité de transmission des pièces.',
      },
    ],
  },
];

export const SUPPLIER_NOTE_OPTIONS = [
  { value: 1, label: '1', description: 'Critique' },
  { value: 2, label: '2', description: 'Insuffisant' },
  { value: 3, label: '3', description: 'Satisfaisant' },
  { value: 4, label: '4', description: 'Très bon' },
  { value: 5, label: '5', description: 'Excellent' },
];

export function computeSupplierWeightedScore(
  notesByCode: Record<string, number>,
): number {
  const total = SUPPLIER_EVALUATION_TEMPLATE.reduce((sum, section) => {
    const sectionNotes = section.criteria
      .map((criterion) => notesByCode[criterion.code])
      .filter((note): note is number => typeof note === 'number' && note > 0);

    if (sectionNotes.length === 0) {
      return sum;
    }

    const average =
      sectionNotes.reduce((acc, note) => acc + note, 0) / sectionNotes.length;

    return sum + average * (section.weight / 100);
  }, 0);

  return Math.round(total * 100) / 100;
}

export function getSupplierPerformance(score: number) {
  if (score >= 4.5) {
    return {
      grade: 'A',
      label: 'Excellent',
      recommendation: 'Reconduction du contrat',
      description: 'Partenaire stratégique à privilégier',
      badgeClass: 'bg-emerald-100 text-emerald-800',
    };
  }
  if (score >= 3.5) {
    return {
      grade: 'B',
      label: 'Bon',
      recommendation: 'Reconduction du contrat',
      description: "Satisfaisant, avec quelques axes d'amélioration",
      badgeClass: 'bg-sky-100 text-sky-800',
    };
  }
  if (score >= 2.5) {
    return {
      grade: 'C',
      label: 'Moyen',
      recommendation: 'Mise sous surveillance',
      description: "Nécessite un plan d'actions correctives",
      badgeClass: 'bg-amber-100 text-amber-800',
    };
  }
  return {
    grade: 'D',
    label: 'Critique',
    recommendation: 'Suspension / Résiliation de la relation',
    description: "Risque d'exclusion du panel",
    badgeClass: 'bg-red-100 text-red-800',
  };
}
