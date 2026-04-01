import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import type { RadarAxisView } from '../types';

interface MaturityRadarChartProps {
  data: RadarAxisView[];
}

export function MaturityRadarChart({ data }: MaturityRadarChartProps) {
  const chartData = data.map((d) => ({
    axe: d.axisNom,
    score: d.score,
  }));

  return (
    <div className='h-[320px] w-full'>
      <ResponsiveContainer width='100%' height='100%'>
        <RadarChart data={chartData} cx='50%' cy='50%' outerRadius='75%'>
          <PolarGrid stroke='var(--color-gray-200)' />
          <PolarAngleAxis
            dataKey='axe'
            tick={{ fontSize: 12, fill: 'var(--color-gray-600)' }}
          />
          <PolarRadiusAxis
            angle={90}
            domain={[0, 100]}
            tick={{ fontSize: 10, fill: 'var(--color-gray-400)' }}
          />
          <Tooltip
            formatter={(value) => [`${value}/100`, 'Score']}
            contentStyle={{
              borderRadius: '8px',
              border: '1px solid var(--color-gray-200)',
              fontSize: '13px',
            }}
          />
          <Radar
            name='Maturité'
            dataKey='score'
            stroke='#EE7849'
            fill='#EE7849'
            fillOpacity={0.25}
            strokeWidth={2}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
