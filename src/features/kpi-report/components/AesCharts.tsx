import { useMemo } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { AES_AXES } from '../aesTypes';
import type { AesMeasurement } from '../aesTypes';

const STATUS_COLORS = {
  CONFORME: '#16a34a',
  A_SURVEILLER: '#d97706',
  NON_CONFORME: '#dc2626',
};

const AXIS_SHORT_LABELS: Record<string, string> = {
  CONFORMITE_REGLEMENTAIRE: 'Conformité',
  ASPECTS_SIGNIFICATIFS: 'Aspects Env.',
  PERFORMANCE_ENERGETIQUE: 'Énergie & Mix',
  GESTION_DECHETS: 'Déchets',
  LEADERSHIP_SENSIBILISATION: 'Leadership',
  RELATIONS_PARTIES_INTERESSEES: 'Parties Int.',
};

interface AesChartsProps {
  measurements: AesMeasurement[];
}

export function AesCharts({ measurements }: AesChartsProps) {
  // ── Pie: répartition par statut ──
  const pieData = useMemo(() => {
    const counts = { CONFORME: 0, A_SURVEILLER: 0, NON_CONFORME: 0 };
    measurements.forEach((m) => {
      if (m.status in counts) counts[m.status as keyof typeof counts]++;
    });
    return [
      { name: 'Conforme', value: counts.CONFORME, color: STATUS_COLORS.CONFORME },
      { name: 'À surveiller', value: counts.A_SURVEILLER, color: STATUS_COLORS.A_SURVEILLER },
      { name: 'Non conforme', value: counts.NON_CONFORME, color: STATUS_COLORS.NON_CONFORME },
    ].filter((d) => d.value > 0);
  }, [measurements]);

  // ── Bar: réalisé vs cible par axe ──
  const barData = useMemo(() => {
    return AES_AXES.map((axis) => {
      const axisMeasures = measurements.filter((m) => m.axisCode === axis.code);
      const avgRealized =
        axisMeasures.length > 0
          ? axisMeasures.reduce((s, m) => s + m.realizedValue, 0) / axisMeasures.length
          : 0;
      const avgTarget =
        axisMeasures.length > 0
          ? axisMeasures.reduce((s, m) => s + m.targetValue, 0) / axisMeasures.length
          : axis.defaultTarget;
      return {
        axe: AXIS_SHORT_LABELS[axis.code] ?? axis.label,
        realise: Math.round(avgRealized * 100) / 100,
        cible: Math.round(avgTarget * 100) / 100,
      };
    });
  }, [measurements]);

  // ── Line: évolution dans le temps ──
  const lineData = useMemo(() => {
    const byMonth = new Map<string, { total: number; conforme: number }>();
    measurements.forEach((m) => {
      const month = m.dateMesure.substring(0, 7); // YYYY-MM
      const entry = byMonth.get(month) ?? { total: 0, conforme: 0 };
      entry.total++;
      if (m.status === 'CONFORME') entry.conforme++;
      byMonth.set(month, entry);
    });
    return Array.from(byMonth.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, data]) => ({
        mois: month,
        tauxConformite: data.total > 0 ? Math.round((data.conforme / data.total) * 100) : 0,
      }));
  }, [measurements]);

  if (measurements.length === 0) return null;

  return (
    <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
      {/* Courbe d'évolution */}
      <div className='rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4'>
        <h4 className='text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3'>
          Évolution du taux de conformité
        </h4>
        <div className='h-[240px]'>
          <ResponsiveContainer width='100%' height='100%'>
            <LineChart data={lineData}>
              <CartesianGrid strokeDasharray='3 3' stroke='var(--color-gray-100)' />
              <XAxis
                dataKey='mois'
                tick={{ fontSize: 11, fill: 'var(--color-gray-500)' }}
                tickLine={false}
              />
              <YAxis
                domain={[0, 100]}
                tick={{ fontSize: 11, fill: 'var(--color-gray-400)' }}
                tickLine={false}
                unit='%'
              />
              <Tooltip
                formatter={(value) => [`${value}%`, 'Conformité']}
                contentStyle={{
                  borderRadius: '8px',
                  border: '1px solid var(--color-gray-200)',
                  fontSize: '13px',
                }}
              />
              <Line
                type='monotone'
                dataKey='tauxConformite'
                stroke='#16a34a'
                strokeWidth={2}
                dot={{ r: 4, fill: '#16a34a' }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Graphique à barres */}
      <div className='rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4'>
        <h4 className='text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3'>
          Réalisé vs Cible par axe
        </h4>
        <div className='h-[240px]'>
          <ResponsiveContainer width='100%' height='100%'>
            <BarChart data={barData} layout='vertical'>
              <CartesianGrid strokeDasharray='3 3' stroke='var(--color-gray-100)' />
              <XAxis type='number' tick={{ fontSize: 10, fill: 'var(--color-gray-400)' }} />
              <YAxis
                type='category'
                dataKey='axe'
                width={90}
                tick={{ fontSize: 10, fill: 'var(--color-gray-500)' }}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: '8px',
                  border: '1px solid var(--color-gray-200)',
                  fontSize: '13px',
                }}
              />
              <Legend />
              <Bar dataKey='realise' name='Réalisé' fill='#EE7849' radius={[0, 4, 4, 0]} />
              <Bar dataKey='cible' name='Cible' fill='#d1d5db' radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Camembert */}
      <div className='rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4'>
        <h4 className='text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3'>
          Répartition par statut
        </h4>
        <div className='h-[240px]'>
          <ResponsiveContainer width='100%' height='100%'>
            <PieChart>
              <Pie
                data={pieData}
                dataKey='value'
                nameKey='name'
                innerRadius={55}
                outerRadius={85}
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
      </div>
    </div>
  );
}
