import { Badge, PageHeader, Select, SkeletonTable } from '@/components/ui';
import { useWorkUnits } from '@/features/cartography/hooks';
import { useMemo, useState } from 'react';
import ExportButtons from './components/ExportButtons';
import ReportSection from './components/ReportSection';
import { useDuerpReport } from './hooks/useRisks';
import { exportDuerpExcel, exportDuerpPdf } from './risksApi';
import type {
  ActionSummary,
  DuerpRiskRow,
  DuerpWorkUnitSection,
  MeasureSummary,
} from './types';

function CriticityBadge({ score }: { score: number }) {
  const variant = score >= 12 ? 'error' : score >= 6 ? 'warning' : 'success';
  return <Badge variant={variant}>{score}</Badge>;
}

function MeasuresList({ measures }: { measures: MeasureSummary[] }) {
  if (measures.length === 0) {
    return <span className='text-sm text-gray-400'>Aucune</span>;
  }

  return (
    <ul className='space-y-1 text-sm text-gray-700 dark:text-gray-300'>
      {measures.map((m, i) => (
        <li key={i} className='rounded-md bg-white/70 px-2 py-1 dark:bg-gray-800/70'>
          {m.title}
        </li>
      ))}
    </ul>
  );
}

function ActionPlansList({ actionPlans }: { actionPlans: ActionSummary[] }) {
  if (actionPlans.length === 0) {
    return <span className='text-sm text-gray-400'>Aucun</span>;
  }

  return (
    <ul className='space-y-1 text-sm text-gray-700 dark:text-gray-300'>
      {actionPlans.map((actionPlan, index) => (
        <li
          key={`${actionPlan.title}-${index}`}
          className='rounded-md bg-white/70 px-2 py-1 dark:bg-gray-800/70'>
          {actionPlan.title}
        </li>
      ))}
    </ul>
  );
}

function StackedValues({
  values,
  emptyLabel = '—',
}: {
  values: string[];
  emptyLabel?: string;
}) {
  if (values.length === 0) {
    return <span className='text-sm text-gray-400'>{emptyLabel}</span>;
  }

  return (
    <ul className='space-y-1 text-sm text-gray-700 dark:text-gray-300'>
      {values.map((value, index) => (
        <li key={`${value}-${index}`} className='rounded-md bg-white/70 px-2 py-1 dark:bg-gray-800/70'>
          {value}
        </li>
      ))}
    </ul>
  );
}

function formatDate(value: string | null) {
  if (!value) {
    return null;
  }

  return new Date(value).toLocaleDateString('fr-FR');
}

function formatEffectiveness(effectiveness: MeasureSummary['effectiveness']) {
  switch (effectiveness) {
    case 'EFFICACE':
      return 'Efficace';
    case 'PARTIELLE':
      return 'Partielle';
    case 'INSUFFISANTE':
      return 'Insuffisante';
    case 'NON_EVALUEE':
    default:
      return 'A mesurer';
  }
}

function RiskRow({ row }: { row: DuerpRiskRow }) {
  const actionResponsibleNames = row.actionPlans
    .map((actionPlan) => actionPlan.responsibleName)
    .filter((value): value is string => Boolean(value));
  const actionDueDates = row.actionPlans
    .map((actionPlan) => formatDate(actionPlan.dueDate))
    .filter((value): value is string => Boolean(value));
  const measureEffectiveness = row.measures.map((measure) =>
    formatEffectiveness(measure.effectiveness),
  );

  return (
    <tr className='border-b border-amber-100 last:border-b-0 dark:border-gray-700'>
      <td className='px-3 py-3 align-top text-sm font-semibold text-gray-900 dark:text-white'>
        {row.code}
      </td>
      <td className='px-3 py-3 align-top text-sm font-medium text-gray-900 dark:text-white'>
        {row.title}
      </td>
      <td className='px-3 py-3 align-top text-sm text-gray-600 dark:text-gray-300'>
        {row.causes || '—'}
      </td>
      <td className='px-3 py-3 align-top text-sm text-gray-600 dark:text-gray-300'>
        {row.consequences || '—'}
      </td>
      <td className='px-3 py-3 align-top text-center text-sm'>{row.frequency}</td>
      <td className='px-3 py-3 align-top text-center text-sm'>{row.severity}</td>
      <td className='px-3 py-3 align-top text-center'>
        <CriticityBadge score={row.criticalityScore} />
      </td>
      <td className='px-3 py-3 align-top'>
        <MeasuresList measures={row.measures} />
      </td>
      <td className='px-3 py-3 align-top'>
        <ActionPlansList actionPlans={row.actionPlans} />
      </td>
      <td className='px-3 py-3 align-top'>
        <StackedValues values={actionResponsibleNames} />
      </td>
      <td className='px-3 py-3 align-top'>
        <StackedValues values={actionDueDates} />
      </td>
      <td className='px-3 py-3 align-top'>
        <StackedValues values={measureEffectiveness} emptyLabel='A mesurer' />
      </td>
      <td className='px-3 py-3 align-top text-center'>
        {row.residualScore > 0 ? (
          <CriticityBadge score={row.residualScore} />
        ) : (
          <span className='text-sm text-gray-400'>—</span>
        )}
      </td>
    </tr>
  );
}

function SummaryCard({
  label,
  value,
  tone,
}: {
  label: string;
  value: string | number;
  tone: 'neutral' | 'success' | 'warning' | 'danger';
}) {
  const tones = {
    neutral: 'border-gray-200 bg-white text-gray-900',
    success: 'border-emerald-200 bg-emerald-50 text-emerald-900',
    warning: 'border-amber-200 bg-amber-50 text-amber-900',
    danger: 'border-red-200 bg-red-50 text-red-900',
  } as const;

  return (
    <div className={`rounded-xl border p-4 shadow-sm ${tones[tone]}`}>
      <div className='text-xs font-semibold uppercase tracking-wide opacity-70'>
        {label}
      </div>
      <div className='mt-2 text-2xl font-bold'>{value}</div>
    </div>
  );
}

export default function DuerpPage() {
  const { data: report, isLoading } = useDuerpReport();
  const { data: workUnits } = useWorkUnits();
  const [selectedSite, setSelectedSite] = useState('');

  const siteOptions = useMemo(() => {
    const sites = Array.from(
      new Set((workUnits ?? []).map((workUnit) => workUnit.location).filter(Boolean)),
    ).sort((a, b) => a.localeCompare(b, 'fr'));

    return [
      { value: '', label: 'Tous les sites' },
      ...sites.map((site) => ({ value: site, label: site })),
    ];
  }, [workUnits]);

  const siteByWorkUnitId = useMemo(
    () =>
      new Map((workUnits ?? []).map((workUnit) => [workUnit.id, workUnit.location])),
    [workUnits],
  );

  const filteredSections = useMemo(() => {
    if (!report) {
      return [];
    }

    return report.sections.filter((section) => {
      if (!selectedSite) {
        return true;
      }
      return siteByWorkUnitId.get(section.workUnitId) === selectedSite;
    });
  }, [report, selectedSite, siteByWorkUnitId]);

  const filteredRiskCount = filteredSections.reduce(
    (total, section) => total + section.risks.length,
    0,
  );

  const highCriticalityCount = filteredSections.reduce(
    (total, section) =>
      total + section.risks.filter((risk) => risk.criticalityScore >= 12).length,
    0,
  );

  const residualCount = filteredSections.reduce(
    (total, section) =>
      total + section.risks.filter((risk) => risk.residualScore > 0).length,
    0,
  );

  return (
    <div className='space-y-6'>
      <div className='flex items-start justify-between gap-4'>
        <PageHeader
          title='DUERP'
          description="Document Unique d'Évaluation des Risques Professionnels"
        />
        {report && (
          <ExportButtons
            onExportPdf={exportDuerpPdf}
            onExportExcel={exportDuerpExcel}
            pdfFilename='DUERP.pdf'
            excelFilename='DUERP.xlsx'
          />
        )}
      </div>

      <div className='rounded-2xl border border-amber-200 bg-gradient-to-r from-amber-50 via-orange-50 to-white p-5 shadow-sm dark:border-amber-900/40 dark:from-gray-900 dark:via-gray-900 dark:to-gray-950'>
        <div className='grid gap-4 lg:grid-cols-[1.3fr_0.7fr]'>
          <div className='space-y-4'>
            <div>
              <div className='text-xs font-semibold uppercase tracking-[0.2em] text-amber-700 dark:text-amber-400'>
                Filtre DUERP
              </div>
              <h2 className='mt-2 text-2xl font-semibold text-gray-900 dark:text-white'>
                Site de travail
              </h2>
              <p className='mt-1 text-sm text-gray-600 dark:text-gray-300'>
                Sélectionne un site pour mettre à jour automatiquement les unités de travail et les risques affichés.
              </p>
            </div>
            <div className='max-w-md'>
              <Select
                label='Site de travail'
                options={siteOptions}
                value={selectedSite}
                onChange={(e) => setSelectedSite(e.target.value)}
              />
            </div>
          </div>

          <div className='grid gap-3 sm:grid-cols-3 lg:grid-cols-1'>
            <SummaryCard
              label='Unités visibles'
              value={filteredSections.length}
              tone='neutral'
            />
            <SummaryCard
              label='Risques critiques'
              value={highCriticalityCount}
              tone='danger'
            />
            <SummaryCard
              label='Évaluations résiduelles'
              value={residualCount}
              tone='warning'
            />
          </div>
        </div>
      </div>

      {isLoading && <SkeletonTable rows={8} columns={13} />}

      {report && (
        <>
          <div className='flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-300'>
            <span>
              Généré le{' '}
              {new Date(report.generatedAt).toLocaleDateString('fr-FR', {
                day: '2-digit',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
            <span className='font-medium'>
              {filteredRiskCount} risque{filteredRiskCount > 1 ? 's' : ''}
            </span>
            {selectedSite && (
              <span className='rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800 dark:bg-amber-900/30 dark:text-amber-300'>
                Site : {selectedSite}
              </span>
            )}
          </div>

          {filteredSections.map((section: DuerpWorkUnitSection) => {
            const siteName = siteByWorkUnitId.get(section.workUnitId) ?? 'Site non renseigné';
            return (
              <ReportSection
                key={section.workUnitId}
                title={section.workUnitName}
                subtitle={`Site: ${siteName}`}
                count={section.risks.length}>
                <div className='overflow-x-auto rounded-xl border border-amber-200 bg-white dark:border-gray-700 dark:bg-gray-900'>
                  <table className='w-full min-w-[1680px] text-left'>
                    <thead className='bg-amber-100/70 dark:bg-gray-800'>
                      <tr className='border-b border-amber-200 dark:border-gray-700'>
                        <th className='px-3 py-3 text-xs font-semibold uppercase tracking-wide text-gray-600'>
                          Code
                        </th>
                        <th className='px-3 py-3 text-xs font-semibold uppercase tracking-wide text-gray-600'>
                          Risque identifié
                        </th>
                        <th className='px-3 py-3 text-xs font-semibold uppercase tracking-wide text-gray-600'>
                          Danger / Source
                        </th>
                        <th className='px-3 py-3 text-xs font-semibold uppercase tracking-wide text-gray-600'>
                          Conséquences
                        </th>
                        <th className='px-3 py-3 text-center text-xs font-semibold uppercase tracking-wide text-gray-600'>
                          F
                        </th>
                        <th className='px-3 py-3 text-center text-xs font-semibold uppercase tracking-wide text-gray-600'>
                          G
                        </th>
                        <th className='px-3 py-3 text-center text-xs font-semibold uppercase tracking-wide text-gray-600'>
                          Criticité brute
                        </th>
                        <th className='px-3 py-3 text-xs font-semibold uppercase tracking-wide text-gray-600'>
                          Mesures de prévention en place (maîtrise)
                        </th>
                        <th className='px-3 py-3 text-xs font-semibold uppercase tracking-wide text-gray-600'>
                          Plan d'action complémentaire
                        </th>
                        <th className='px-3 py-3 text-xs font-semibold uppercase tracking-wide text-gray-600'>
                          Responsable de l'action
                        </th>
                        <th className='px-3 py-3 text-xs font-semibold uppercase tracking-wide text-gray-600'>
                          Échéance
                        </th>
                        <th className='px-3 py-3 text-xs font-semibold uppercase tracking-wide text-gray-600'>
                          Efficacité de l'action
                        </th>
                        <th className='px-3 py-3 text-center text-xs font-semibold uppercase tracking-wide text-gray-600'>
                          Criticité résiduelle
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {section.risks.map((row: DuerpRiskRow) => (
                        <RiskRow key={row.riskId} row={row} />
                      ))}
                    </tbody>
                  </table>
                </div>
              </ReportSection>
            );
          })}

          {filteredSections.length === 0 && (
            <p className='rounded-xl border border-dashed border-gray-300 py-12 text-center text-gray-500 dark:border-gray-700'>
              Aucun risque SST enregistré pour ce site.
            </p>
          )}
        </>
      )}
    </div>
  );
}
