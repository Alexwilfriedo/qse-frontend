import { Button, Card, PageHeader, SkeletonTable } from '@/components/ui';
import { useReferenceItems } from '@/features/configuration/hooks';
import { showToast } from '@/lib/toast';
import { PieChart as PieChartIcon, Plus } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import OpportunityFormModal from './components/OpportunityFormModal';
import {
  useCreateOpportunity,
  useOpportunities,
} from './hooks/useRisks';
import type { CreateOpportunityRequest, Domaine, Opportunity, OpportunityStatus } from './types';

const DOMAINE_LABELS: Record<Domaine, string> = {
  QUALITE: 'Qualité',
  SECURITE: 'Sécurité',
  ENVIRONNEMENT: 'Environnement',
};

const STATUS_LABELS: Record<OpportunityStatus, string> = {
  IDENTIFIEE: 'Identifiée',
  EN_COURS: 'En cours',
  REALISEE: 'Réalisée',
  ABANDONNEE: 'Abandonnée',
};

const STATUS_STYLES: Record<OpportunityStatus, string> = {
  IDENTIFIEE: 'bg-sky-100 text-sky-800',
  EN_COURS: 'bg-amber-100 text-amber-800',
  REALISEE: 'bg-emerald-100 text-emerald-800',
  ABANDONNEE: 'bg-rose-100 text-rose-800',
};

function parseScoreRange(code: string): { min: number; max: number } | null {
  const [minRaw, maxRaw] = code.split('_');
  const min = Number(minRaw);
  const max = Number(maxRaw);

  if (!Number.isInteger(min) || !Number.isInteger(max) || min > max) {
    return null;
  }

  return { min, max };
}

function getPriorityTone(color: string | null) {
  if (!color) {
    return 'bg-gray-100 text-gray-700';
  }

  return 'text-white';
}

const PIE_COLORS: Record<Domaine, string> = {
  QUALITE: '#0f766e',
  SECURITE: '#d97706',
  ENVIRONNEMENT: '#65a30d',
};

function SummaryTile({
  label,
  value,
  accent,
}: {
  label: string;
  value: number;
  accent: string;
}) {
  return (
    <div className='rounded-2xl border border-white/60 bg-white/90 p-4 shadow-sm backdrop-blur'>
      <div className='text-xs font-semibold uppercase tracking-[0.2em] text-gray-500'>
        {label}
      </div>
      <div className='mt-3 flex items-end justify-between gap-3'>
        <span className='text-3xl font-bold text-gray-900'>{value}</span>
        <span
          className='h-2.5 w-14 rounded-full'
          style={{ backgroundColor: accent }}
        />
      </div>
    </div>
  );
}

export default function OpportunitiesPage() {
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const { data: opportunities, isLoading } = useOpportunities();
  const { data: scoreLevels } = useReferenceItems('opportunity-score-levels', true);
  const createMutation = useCreateOpportunity();

  const pieData = useMemo(() => {
    const counts: Record<Domaine, number> = {
      QUALITE: 0,
      SECURITE: 0,
      ENVIRONNEMENT: 0,
    };

    (opportunities ?? []).forEach((opportunity) => {
      counts[opportunity.domaine] += 1;
    });

    return (Object.keys(counts) as Domaine[]).map((domaine) => ({
      name: DOMAINE_LABELS[domaine],
      value: counts[domaine],
      color: PIE_COLORS[domaine],
    }));
  }, [opportunities]);

  const identifiedCount =
    opportunities?.filter((item) => item.status === 'IDENTIFIEE').length ?? 0;
  const inProgressCount =
    opportunities?.filter((item) => item.status === 'EN_COURS').length ?? 0;
  const completedCount =
    opportunities?.filter((item) => item.status === 'REALISEE').length ?? 0;

  const scoreRules = useMemo(
    () =>
      (scoreLevels ?? [])
        .map((item) => {
          const range = parseScoreRange(item.code);
          if (!range) {
            return null;
          }
          return {
            ...item,
            min: range.min,
            max: range.max,
          };
        })
        .filter((item): item is NonNullable<typeof item> => item !== null)
        .sort((a, b) => a.min - b.min),
    [scoreLevels],
  );

  const handleCreate = async (data: CreateOpportunityRequest) => {
    try {
      await createMutation.mutateAsync(data);
      showToast.success('Opportunité créée');
      setModalOpen(false);
    } catch {
      showToast.error("Erreur lors de la création de l'opportunité");
    }
  };

  return (
    <div className='space-y-6'>
      <PageHeader
        title='Opportunités'
        description="Pilotage des opportunités d'amélioration QSE"
      />

      <section className='rounded-[28px] border border-emerald-200 bg-[radial-gradient(circle_at_top_left,_rgba(52,211,153,0.18),_transparent_30%),linear-gradient(135deg,#f7fee7_0%,#ecfeff_45%,#ffffff_100%)] p-6 shadow-sm'>
        <div className='grid gap-6 xl:grid-cols-[1.1fr_0.9fr]'>
          <div className='space-y-5'>
            <div>
              <div className='text-xs font-semibold uppercase tracking-[0.3em] text-emerald-700'>
                Dashboard opportunités
              </div>
              <h2 className='mt-2 text-3xl font-semibold text-gray-900'>
                Vue globale par domaine
              </h2>
              <p className='mt-2 max-w-2xl text-sm text-gray-600'>
                Le camembert synthétise la répartition des opportunités entre la qualité, la sécurité et l’environnement.
              </p>
            </div>

            <div className='grid gap-4 md:grid-cols-3'>
              <SummaryTile
                label='Total'
                value={opportunities?.length ?? 0}
                accent='#0f766e'
              />
              <SummaryTile
                label='Identifiées'
                value={identifiedCount}
                accent='#0284c7'
              />
              <SummaryTile
                label='En cours / Réalisées'
                value={inProgressCount + completedCount}
                accent='#65a30d'
              />
            </div>
          </div>

          <Card className='h-[320px] border-white/70 bg-white/85' padding='sm'>
            <div className='mb-3 flex items-center gap-2 text-sm font-semibold text-gray-700'>
              <PieChartIcon className='h-4 w-4 text-emerald-700' />
              Répartition des opportunités
            </div>
            <div className='h-[260px]'>
              <ResponsiveContainer width='100%' height='100%'>
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey='value'
                    nameKey='name'
                    innerRadius={62}
                    outerRadius={94}
                    paddingAngle={3}>
                    {pieData.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend verticalAlign='bottom' height={36} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      </section>

      <Card className='border-gray-200/80 shadow-sm' padding='none'>
        <div className='flex items-center justify-between border-b border-gray-200 px-6 py-5'>
          <div>
            <h2 className='text-lg font-semibold text-gray-900'>
              Liste des opportunités
            </h2>
            <p className='mt-1 text-sm text-gray-500'>
              Suivi opérationnel des opportunités enregistrées.
            </p>
          </div>
          <Button onClick={() => setModalOpen(true)}>
            <Plus className='h-4 w-4' />
            Nouvelle opportunité
          </Button>
        </div>

        {isLoading ? (
          <div className='p-6'>
            <SkeletonTable rows={6} columns={8} />
          </div>
        ) : (
          <div className='overflow-x-auto'>
            <table className='w-full min-w-[1120px] text-left'>
              <thead className='bg-gray-50'>
                <tr className='border-b border-gray-200'>
                  <th className='px-6 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500'>
                    ID
                  </th>
                  <th className='px-6 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500'>
                    Libellé de l'opportunité
                  </th>
                  <th className='px-6 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500'>
                    Processus impacté
                  </th>
                  <th className='px-6 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500'>
                    Faisabilité (F)
                  </th>
                  <th className='px-6 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500'>
                    Bénéfice (B)
                  </th>
                  <th className='px-6 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500'>
                    Score (F×B)
                  </th>
                  <th className='px-6 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500'>
                    Priorité
                  </th>
                  <th className='px-6 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500'>
                    Statut
                  </th>
                </tr>
              </thead>
              <tbody>
                {(opportunities ?? []).map((opportunity: Opportunity) => (
                  (() => {
                    const scoreRule = scoreRules.find(
                      (rule) =>
                        opportunity.score >= rule.min && opportunity.score <= rule.max,
                    );

                    return (
                  <tr
                    key={opportunity.id}
                    className='cursor-pointer border-b border-gray-100 transition-colors hover:bg-emerald-50/50'
                    onClick={() => navigate(`/risks/opportunities/${opportunity.id}`)}>
                    <td className='px-6 py-4 align-top text-sm font-semibold text-gray-900'>
                      {opportunity.id.slice(0, 8).toUpperCase()}
                    </td>
                    <td className='px-6 py-4 align-top'>
                      <div className='font-medium text-gray-900'>
                        {opportunity.title}
                      </div>
                      <div className='mt-1 text-sm text-gray-500'>
                        {opportunity.description || 'Aucune description'}
                      </div>
                    </td>
                    <td className='px-6 py-4 align-top text-sm text-gray-700'>
                      {opportunity.processusName || '—'}
                    </td>
                    <td className='px-6 py-4 align-top text-sm font-semibold text-gray-700'>
                      {opportunity.feasibilityScore}
                    </td>
                    <td className='px-6 py-4 align-top text-sm font-semibold text-gray-700'>
                      {opportunity.benefitScore}
                    </td>
                    <td className='px-6 py-4 align-top text-sm font-semibold text-gray-900'>
                      {opportunity.score}
                    </td>
                    <td className='px-6 py-4 align-top'>
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getPriorityTone(scoreRule?.color ?? null)}`}
                        style={{
                          backgroundColor: scoreRule?.color ?? '#e5e7eb',
                        }}>
                        {scoreRule?.label ?? 'Non classé'}
                      </span>
                    </td>
                    <td className='px-6 py-4 align-top'>
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${STATUS_STYLES[opportunity.status]}`}>
                        {STATUS_LABELS[opportunity.status]}
                      </span>
                    </td>
                  </tr>
                    );
                  })()
                ))}
                {(opportunities ?? []).length === 0 && (
                  <tr>
                    <td
                      colSpan={8}
                      className='px-6 py-12 text-center text-sm text-gray-500'>
                      Aucune opportunité enregistrée.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <OpportunityFormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleCreate}
        isPending={createMutation.isPending}
      />
    </div>
  );
}
