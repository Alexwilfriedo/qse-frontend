import { useMemo } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { SstEpiReport } from '../sstTypes';

interface SstEpiChartsProps {
  reports: SstEpiReport[];
}

const PARC_COLORS = {
  enService: '#16a34a',
  stockage: '#2563eb',
  reparation: '#ea580c',
  sansControle: '#dc2626',
};

const STOCK_COLORS = {
  entrees: '#16a34a',
  sorties: '#2563eb',
  rebut: '#dc2626',
};

const CONTROLE_COLORS = {
  conformes: '#16a34a',
  a30j: '#d97706',
  retard: '#dc2626',
  ptiDefectueux: '#7f1d1d',
};

export function SstEpiCharts({ reports }: SstEpiChartsProps) {
  const latestReport = reports.length > 0 ? reports[reports.length - 1] : null;

  // ── Pie (donut): Répartition du parc EPI ──
  const pieData = useMemo(() => {
    if (!latestReport) return [];
    return [
      { name: 'En service', value: latestReport.epiEnService, color: PARC_COLORS.enService },
      { name: 'Stockage', value: latestReport.epiEnStockage, color: PARC_COLORS.stockage },
      { name: 'Réparation', value: latestReport.epiEnReparation, color: PARC_COLORS.reparation },
      { name: 'Sans contrôle', value: latestReport.epiSansControle, color: PARC_COLORS.sansControle },
    ].filter((d) => d.value > 0);
  }, [latestReport]);

  // ── Bar: Mouvements de stock par type ──
  const stockData = useMemo(() => {
    if (!latestReport) return [];
    return [
      {
        type: 'Tête',
        entrees: latestReport.entreesTete,
        sorties: latestReport.sortiesTete,
        rebut: latestReport.rebutTete,
      },
      {
        type: 'Mains',
        entrees: latestReport.entreesMains,
        sorties: latestReport.sortiesMains,
        rebut: latestReport.rebutMains,
      },
      {
        type: 'Pieds',
        entrees: latestReport.entreesPieds,
        sorties: latestReport.sortiesPieds,
        rebut: latestReport.rebutPieds,
      },
    ];
  }, [latestReport]);

  // ── Bar: Registre des contrôles ──
  const controleData = useMemo(() => {
    if (!latestReport) return [];
    return [
      { name: 'Conformes', value: latestReport.controlesConformes, color: CONTROLE_COLORS.conformes },
      { name: 'À contrôler 30j', value: latestReport.controlesA30j, color: CONTROLE_COLORS.a30j },
      { name: 'Retard', value: latestReport.controlesRetard, color: CONTROLE_COLORS.retard },
      { name: 'PTI défectueux', value: latestReport.ptiDefectueux, color: CONTROLE_COLORS.ptiDefectueux },
    ];
  }, [latestReport]);

  if (!latestReport) return null;

  return (
    <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
      {/* Donut: Répartition du parc */}
      <div className='rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4'>
        <h4 className='text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3'>
          Répartition du parc EPI
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
              <Tooltip
                contentStyle={{
                  borderRadius: '8px',
                  border: '1px solid var(--color-gray-200)',
                  fontSize: '13px',
                }}
              />
              <Legend verticalAlign='bottom' height={36} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bar: Mouvements de stock */}
      <div className='rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4'>
        <h4 className='text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3'>
          Mouvements de stock
        </h4>
        <div className='h-[240px]'>
          <ResponsiveContainer width='100%' height='100%'>
            <BarChart data={stockData}>
              <CartesianGrid strokeDasharray='3 3' stroke='var(--color-gray-100)' />
              <XAxis
                dataKey='type'
                tick={{ fontSize: 11, fill: 'var(--color-gray-500)' }}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: 'var(--color-gray-400)' }}
                tickLine={false}
                allowDecimals={false}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: '8px',
                  border: '1px solid var(--color-gray-200)',
                  fontSize: '13px',
                }}
              />
              <Legend />
              <Bar dataKey='entrees' name='Entrées' fill={STOCK_COLORS.entrees} radius={[4, 4, 0, 0]} />
              <Bar dataKey='sorties' name='Sorties' fill={STOCK_COLORS.sorties} radius={[4, 4, 0, 0]} />
              <Bar dataKey='rebut' name='Rebut' fill={STOCK_COLORS.rebut} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bar: Registre des contrôles */}
      <div className='rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4'>
        <h4 className='text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3'>
          Registre des contrôles
        </h4>
        <div className='h-[240px]'>
          <ResponsiveContainer width='100%' height='100%'>
            <BarChart data={controleData}>
              <CartesianGrid strokeDasharray='3 3' stroke='var(--color-gray-100)' />
              <XAxis
                dataKey='name'
                tick={{ fontSize: 10, fill: 'var(--color-gray-500)' }}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: 'var(--color-gray-400)' }}
                tickLine={false}
                allowDecimals={false}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: '8px',
                  border: '1px solid var(--color-gray-200)',
                  fontSize: '13px',
                }}
              />
              <Bar dataKey='value' name='Quantité' radius={[4, 4, 0, 0]}>
                {controleData.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
