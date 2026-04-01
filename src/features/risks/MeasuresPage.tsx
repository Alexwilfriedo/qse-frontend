import { useState, useMemo } from 'react';
import { Badge, PageHeader, SkeletonTable } from '@/components/ui';
import { useAllMeasures } from './hooks/useRisks';
import type { MeasureWithRiskView, Domaine, MitigationStrategy, MeasureEffectiveness } from './types';

const DOMAINE_LABELS: Record<Domaine, string> = {
  QUALITE: 'Qualité',
  SECURITE: 'Sécurité',
  ENVIRONNEMENT: 'Environnement',
};

const STRATEGY_LABELS: Record<MitigationStrategy, string> = {
  ELIMINATION: 'Élimination',
  REDUCTION: 'Réduction',
  TRANSFERT: 'Transfert',
  ACCEPTATION: 'Acceptation',
};

const EFFECTIVENESS_LABELS: Record<MeasureEffectiveness, string> = {
  NON_EVALUEE: 'Non évaluée',
  INSUFFISANTE: 'Insuffisante',
  PARTIELLE: 'Partielle',
  EFFICACE: 'Efficace',
};

function EffectivenessBadge({ value }: { value: MeasureEffectiveness }) {
  const variant =
    value === 'EFFICACE'
      ? 'success'
      : value === 'PARTIELLE'
        ? 'warning'
        : value === 'INSUFFISANTE'
          ? 'error'
          : 'info';
  return <Badge variant={variant}>{EFFECTIVENESS_LABELS[value]}</Badge>;
}

function DomaineBadge({ domaine }: { domaine: Domaine }) {
  const cls =
    domaine === 'QUALITE'
      ? 'badge-qualite'
      : domaine === 'SECURITE'
        ? 'badge-securite'
        : 'badge-environnement';
  return <span className={`badge ${cls}`}>{DOMAINE_LABELS[domaine]}</span>;
}

function MeasureRow({ m }: { m: MeasureWithRiskView }) {
  return (
    <tr className={m.overdue ? 'bg-red-50 dark:bg-red-950/20' : ''}>
      <td className="px-3 py-2 text-sm">
        <DomaineBadge domaine={m.riskDomaine} />
      </td>
      <td className="px-3 py-2 text-sm font-medium">{m.riskCode}</td>
      <td className="px-3 py-2 text-sm">{m.riskTitle}</td>
      <td className="px-3 py-2 text-sm font-medium">{m.title}</td>
      <td className="px-3 py-2 text-sm">{STRATEGY_LABELS[m.strategy]}</td>
      <td className="px-3 py-2 text-sm">
        <EffectivenessBadge value={m.effectiveness} />
      </td>
      <td className="px-3 py-2 text-sm">
        {m.dueDate
          ? new Date(m.dueDate).toLocaleDateString('fr-FR')
          : '—'}
        {m.overdue && (
          <span className="ml-1 text-xs font-semibold text-red-600">En retard</span>
        )}
      </td>
    </tr>
  );
}

export default function MeasuresPage() {
  const { data: measures, isLoading } = useAllMeasures();
  const [filterDomaine, setFilterDomaine] = useState<Domaine | ''>('');
  const [filterEffectiveness, setFilterEffectiveness] = useState<MeasureEffectiveness | ''>('');
  const [filterOverdue, setFilterOverdue] = useState(false);

  const filtered = useMemo(() => {
    if (!measures) return [];
    return measures.filter((m) => {
      if (filterDomaine && m.riskDomaine !== filterDomaine) return false;
      if (filterEffectiveness && m.effectiveness !== filterEffectiveness) return false;
      if (filterOverdue && !m.overdue) return false;
      return true;
    });
  }, [measures, filterDomaine, filterEffectiveness, filterOverdue]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Plan de Maîtrise"
        description="Vue centralisée de toutes les mesures de maîtrise (SST + Environnement + Qualité)"
      />

      {/* Filtres */}
      <div className="flex flex-wrap items-center gap-3">
        <select
          className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm dark:border-gray-600 dark:bg-gray-800"
          value={filterDomaine}
          onChange={(e) => setFilterDomaine(e.target.value as Domaine | '')}
        >
          <option value="">Tous les domaines</option>
          <option value="QUALITE">Qualité</option>
          <option value="SECURITE">Sécurité</option>
          <option value="ENVIRONNEMENT">Environnement</option>
        </select>

        <select
          className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm dark:border-gray-600 dark:bg-gray-800"
          value={filterEffectiveness}
          onChange={(e) => setFilterEffectiveness(e.target.value as MeasureEffectiveness | '')}
        >
          <option value="">Toutes les efficacités</option>
          <option value="NON_EVALUEE">Non évaluée</option>
          <option value="INSUFFISANTE">Insuffisante</option>
          <option value="PARTIELLE">Partielle</option>
          <option value="EFFICACE">Efficace</option>
        </select>

        <label className="flex items-center gap-1.5 text-sm">
          <input
            type="checkbox"
            checked={filterOverdue}
            onChange={(e) => setFilterOverdue(e.target.checked)}
            className="rounded border-gray-300"
          />
          En retard uniquement
        </label>

        <span className="ml-auto text-sm text-gray-500">
          {filtered.length} mesure{filtered.length > 1 ? 's' : ''}
        </span>
      </div>

      {isLoading && <SkeletonTable rows={10} columns={7} />}

      {!isLoading && filtered.length === 0 && (
        <p className="py-8 text-center text-sm text-gray-500">
          Aucune mesure de maîtrise trouvée.
        </p>
      )}

      {filtered.length > 0 && (
        <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-3 py-2 text-left text-xs font-medium uppercase text-gray-500">Domaine</th>
                <th className="px-3 py-2 text-left text-xs font-medium uppercase text-gray-500">Risque</th>
                <th className="px-3 py-2 text-left text-xs font-medium uppercase text-gray-500">Titre risque</th>
                <th className="px-3 py-2 text-left text-xs font-medium uppercase text-gray-500">Mesure</th>
                <th className="px-3 py-2 text-left text-xs font-medium uppercase text-gray-500">Stratégie</th>
                <th className="px-3 py-2 text-left text-xs font-medium uppercase text-gray-500">Efficacité</th>
                <th className="px-3 py-2 text-left text-xs font-medium uppercase text-gray-500">Échéance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-900">
              {filtered.map((m) => (
                <MeasureRow key={m.id} m={m} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
