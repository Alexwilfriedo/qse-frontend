import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { EvolutionPointView } from '../types';

interface MaturityEvolutionChartProps {
  data: EvolutionPointView[];
}

export function MaturityEvolutionChart({ data }: MaturityEvolutionChartProps) {
  const chartData = data.map((d) => ({
    campagne: d.campagneTitre,
    note: d.noteGlobale,
  }));

  if (chartData.length === 0) {
    return (
      <div className='flex h-[240px] items-center justify-center text-sm text-gray-400'>
        Aucune donnée d'évolution disponible
      </div>
    );
  }

  return (
    <div className='h-[240px] w-full'>
      <ResponsiveContainer width='100%' height='100%'>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray='3 3' stroke='var(--color-gray-100)' />
          <XAxis
            dataKey='campagne'
            tick={{ fontSize: 11, fill: 'var(--color-gray-500)' }}
            tickLine={false}
          />
          <YAxis
            domain={[0, 100]}
            tick={{ fontSize: 11, fill: 'var(--color-gray-400)' }}
            tickLine={false}
          />
          <Tooltip
            formatter={(value) => [`${value}/100`, 'Note']}
            contentStyle={{
              borderRadius: '8px',
              border: '1px solid var(--color-gray-200)',
              fontSize: '13px',
            }}
          />
          <Line
            type='monotone'
            dataKey='note'
            stroke='#EE7849'
            strokeWidth={2}
            dot={{ r: 4, fill: '#EE7849' }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
