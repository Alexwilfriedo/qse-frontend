import { Badge } from '@/components/ui';
import { useMemo } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { SstMonthlyReport } from '../sstTypes';

interface SstAccidentChartsProps {
  reports: SstMonthlyReport[];
}

interface ProactiveIndicator {
  label: string;
  target: string;
  value: number | null;
  unit: string;
  thresholds: { good: number; warning: number };
  higherIsBetter: boolean;
}

function getProactiveBadgeVariant(
  indicator: ProactiveIndicator,
): 'success' | 'warning' | 'error' {
  const val = indicator.value;
  if (val === null) return 'error';
  const { good, warning } = indicator.thresholds;

  if (indicator.higherIsBetter) {
    if (val >= good) return 'success';
    if (val >= warning) return 'warning';
    return 'error';
  }
  // Lower is better (not used currently, but safe fallback)
  if (val <= good) return 'success';
  if (val <= warning) return 'warning';
  return 'error';
}

export function SstAccidentCharts({ reports }: SstAccidentChartsProps) {
  // ── Line chart data: TF / TG over time ──
  const tfTgData = useMemo(
    () =>
      [...reports]
        .sort((a, b) => a.period.localeCompare(b.period))
        .map((r) => ({
          period: r.period,
          TF: r.tauxFrequence ?? 0,
          TG: r.tauxGravite ?? 0,
        })),
    [reports],
  );

  // ── Bar chart data: monthly accidents ──
  const accidentData = useMemo(
    () =>
      [...reports]
        .sort((a, b) => a.period.localeCompare(b.period))
        .map((r) => ({
          period: r.period,
          'Avec arrêt': r.accidentsAvecArret,
          'Sans arrêt': r.accidentsSansArret,
          "Presqu'accidents": r.presquaccidents,
        })),
    [reports],
  );

  // ── Horizontal bar chart: events per service (latest report) ──
  const latestReport = useMemo(() => {
    if (reports.length === 0) return null;
    return [...reports].sort((a, b) => b.period.localeCompare(a.period))[0];
  }, [reports]);

  const serviceData = useMemo(() => {
    if (!latestReport) return [];
    return latestReport.serviceEvents.map((se) => ({
      service: se.entityName,
      events: se.eventCount,
    }));
  }, [latestReport]);

  // ── Proactive indicators from latest report ──
  const proactiveIndicators = useMemo((): ProactiveIndicator[] => {
    if (!latestReport) return [];
    return [
      {
        label: '% Actions réalisées',
        target: '>= 90%',
        value: latestReport.pctActionsRealisees,
        unit: '%',
        thresholds: { good: 90, warning: 70 },
        higherIsBetter: true,
      },
      {
        label: '% Conformité EPI',
        target: '>= 95%',
        value: latestReport.pctConformiteEpi,
        unit: '%',
        thresholds: { good: 95, warning: 80 },
        higherIsBetter: true,
      },
      {
        label: 'Nb inspections terrain',
        target: '>= 4',
        value: latestReport.nbInspectionsTerrain,
        unit: '',
        thresholds: { good: 4, warning: 2 },
        higherIsBetter: true,
      },
      {
        label: 'Taux participation causeries',
        target: '>= 80%',
        value: latestReport.tauxParticipationCauseries,
        unit: '%',
        thresholds: { good: 80, warning: 60 },
        higherIsBetter: true,
      },
    ];
  }, [latestReport]);

  if (reports.length === 0) return null;

  const tooltipStyle = {
    borderRadius: '8px',
    border: '1px solid var(--color-gray-200)',
    fontSize: '13px',
  };

  return (
    <div className='space-y-6'>
      {/* Charts grid */}
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        {/* Line chart: TF & TG */}
        <div className='rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4'>
          <h4 className='text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3'>
            Évolution TF et TG mensuelle
          </h4>
          <div className='h-[240px]'>
            <ResponsiveContainer width='100%' height='100%'>
              <LineChart data={tfTgData}>
                <CartesianGrid strokeDasharray='3 3' stroke='var(--color-gray-100)' />
                <XAxis
                  dataKey='period'
                  tick={{ fontSize: 11, fill: 'var(--color-gray-500)' }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: 'var(--color-gray-400)' }}
                  tickLine={false}
                />
                <Tooltip contentStyle={tooltipStyle} />
                <Legend />
                <Line
                  type='monotone'
                  dataKey='TF'
                  name='Taux Fréquence'
                  stroke='#16a34a'
                  strokeWidth={2}
                  dot={{ r: 4, fill: '#16a34a' }}
                  activeDot={{ r: 6 }}
                />
                <Line
                  type='monotone'
                  dataKey='TG'
                  name='Taux Gravité'
                  stroke='#EE7849'
                  strokeWidth={2}
                  dot={{ r: 4, fill: '#EE7849' }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Stacked bar chart: monthly accidents */}
        <div className='rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4'>
          <h4 className='text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3'>
            Accidents mensuels
          </h4>
          <div className='h-[240px]'>
            <ResponsiveContainer width='100%' height='100%'>
              <BarChart data={accidentData}>
                <CartesianGrid strokeDasharray='3 3' stroke='var(--color-gray-100)' />
                <XAxis
                  dataKey='period'
                  tick={{ fontSize: 11, fill: 'var(--color-gray-500)' }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: 'var(--color-gray-400)' }}
                  tickLine={false}
                  allowDecimals={false}
                />
                <Tooltip contentStyle={tooltipStyle} />
                <Legend />
                <Bar
                  dataKey='Avec arrêt'
                  stackId='accidents'
                  fill='#dc2626'
                  radius={[0, 0, 0, 0]}
                />
                <Bar
                  dataKey='Sans arrêt'
                  stackId='accidents'
                  fill='#EE7849'
                  radius={[0, 0, 0, 0]}
                />
                <Bar
                  dataKey="Presqu'accidents"
                  stackId='accidents'
                  fill='#16a34a'
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Horizontal bar chart: events per service */}
        <div className='rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4'>
          <h4 className='text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3'>
            Événements par service
          </h4>
          <div className='h-[240px]'>
            {serviceData.length > 0 ? (
              <ResponsiveContainer width='100%' height='100%'>
                <BarChart data={serviceData} layout='vertical'>
                  <CartesianGrid strokeDasharray='3 3' stroke='var(--color-gray-100)' />
                  <XAxis
                    type='number'
                    tick={{ fontSize: 10, fill: 'var(--color-gray-400)' }}
                    allowDecimals={false}
                  />
                  <YAxis
                    type='category'
                    dataKey='service'
                    width={100}
                    tick={{ fontSize: 10, fill: 'var(--color-gray-500)' }}
                  />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Bar dataKey='events' name='Événements' fill='#EE7849' radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className='flex items-center justify-center h-full text-sm text-gray-400 dark:text-gray-500'>
                Aucune donnée par service
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Proactive indicators table */}
      {proactiveIndicators.length > 0 && (
        <div className='rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4'>
          <h4 className='text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3'>
            Indicateurs proactifs
          </h4>
          <div className='overflow-x-auto'>
            <table className='w-full text-sm'>
              <thead>
                <tr className='border-b border-gray-200 dark:border-gray-700'>
                  <th className='text-left py-2 px-3 font-medium text-gray-500 dark:text-gray-400'>
                    Indicateur
                  </th>
                  <th className='text-center py-2 px-3 font-medium text-gray-500 dark:text-gray-400'>
                    Cible
                  </th>
                  <th className='text-center py-2 px-3 font-medium text-gray-500 dark:text-gray-400'>
                    Actuel
                  </th>
                  <th className='text-center py-2 px-3 font-medium text-gray-500 dark:text-gray-400'>
                    Statut
                  </th>
                </tr>
              </thead>
              <tbody>
                {proactiveIndicators.map((ind) => {
                  const variant = getProactiveBadgeVariant(ind);
                  const variantLabels: Record<'success' | 'warning' | 'error', string> = {
                    success: 'Conforme',
                    warning: 'À surveiller',
                    error: 'Non conforme',
                  };

                  return (
                    <tr
                      key={ind.label}
                      className='border-b border-gray-100 dark:border-gray-700/50 last:border-0'>
                      <td className='py-2.5 px-3 text-gray-700 dark:text-gray-300'>
                        {ind.label}
                      </td>
                      <td className='py-2.5 px-3 text-center text-gray-500 dark:text-gray-400'>
                        {ind.target}
                      </td>
                      <td className='py-2.5 px-3 text-center font-medium text-gray-900 dark:text-white'>
                        {ind.value !== null ? `${ind.value}${ind.unit}` : '—'}
                      </td>
                      <td className='py-2.5 px-3 text-center'>
                        <Badge variant={variant}>{variantLabels[variant]}</Badge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
