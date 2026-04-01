import { Card, CardHeader, SkeletonCard } from '@/components/ui';
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import type { MatrixData, MatrixCell } from '../types';

interface Props {
  data: MatrixData | undefined;
  isLoading: boolean;
}

export default function CriticalityMatrix({ data, isLoading }: Props) {
  const navigate = useNavigate();

  const grid = useMemo(() => {
    if (!data) return null;
    const map = new Map<string, MatrixCell>();
    for (const cell of data.cells) {
      map.set(`${cell.frequency},${cell.severity}`, cell);
    }
    return {
      map,
      frequencies: [...data.frequencyLevels].sort((a, b) => a.value - b.value),
      severities: [...data.severityLevels].sort((a, b) => a.value - b.value),
    };
  }, [data]);

  if (isLoading || !grid) {
    return <SkeletonCard />;
  }

  return (
    <Card>
      <CardHeader title="Matrice de Criticité F × G" />
      <div className="overflow-x-auto p-4 pt-0">
        <div className="mb-4 min-w-[720px]">
          <div className="flex items-center pl-32">
            <div className="mr-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
              Gravité
            </div>
            <div className="h-0.5 flex-1 rounded-full bg-gradient-to-r from-gray-300 via-gray-500 to-gray-900 dark:from-gray-700 dark:via-gray-400 dark:to-gray-100" />
          </div>
          <div className="mt-3 flex">
            <div className="mr-4 flex w-24 flex-col items-center justify-center gap-3">
              <div className="text-sm font-semibold text-gray-700 [writing-mode:vertical-rl] rotate-180 dark:text-gray-300">
                Fréquence
              </div>
              <div className="h-20 w-0.5 rounded-full bg-gradient-to-b from-gray-300 via-gray-500 to-gray-900 dark:from-gray-700 dark:via-gray-400 dark:to-gray-100" />
            </div>

            <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="w-28 border border-gray-200 bg-gray-50 px-2 py-2 text-xs font-medium text-gray-500 dark:border-gray-700 dark:bg-gray-800">
                Niveau
              </th>
              {grid.severities.map((severity) => (
                <th
                  key={severity.value}
                  className="border border-gray-200 bg-gray-50 px-2 py-3 text-center text-xs font-medium text-gray-500 dark:border-gray-700 dark:bg-gray-800">
                  <div
                    className="flex flex-col items-center rounded-md px-2 py-2"
                    style={{ backgroundColor: `${severity.color}20` }}>
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">
                      {severity.value}
                    </span>
                    <span className="mt-0.5 text-[10px] font-medium normal-case text-gray-500">
                      {severity.label}
                    </span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {grid.frequencies.map((frequency) => (
              <tr key={frequency.value}>
                <td className="border border-gray-200 bg-gray-50 px-2 py-3 text-center text-xs font-medium text-gray-500 dark:border-gray-700 dark:bg-gray-800">
                  <div
                    className="flex flex-col items-center rounded-md px-2 py-2"
                    style={{ backgroundColor: `${frequency.color}20` }}>
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">
                      {frequency.value}
                    </span>
                    <span className="mt-0.5 text-[10px] font-medium normal-case text-gray-500">
                      {frequency.label}
                    </span>
                  </div>
                </td>
                {grid.severities.map((severity) => {
                  const cell = grid.map.get(`${frequency.value},${severity.value}`);
                  return (
                    <MatrixCellView
                      key={`${frequency.value}-${severity.value}`}
                      cell={cell}
                      onClick={() => {
                        if (cell && cell.riskCount > 0) {
                          navigate(`/risks?frequency=${frequency.value}&severity=${severity.value}`);
                        }
                      }}
                    />
                  );
                })}
              </tr>
            ))}
          </tbody>
            </table>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-4 text-xs text-gray-500">
          <span>Cliquer sur une cellule pour voir les risques correspondants</span>
          <span className="flex items-center gap-1">
            <span className="inline-block h-3 w-3 rounded" style={{ backgroundColor: '#9CA3AF' }} />
            Non classifié
          </span>
        </div>
      </div>
    </Card>
  );
}

function MatrixCellView({
  cell,
  onClick,
}: {
  cell: MatrixCell | undefined;
  onClick: () => void;
}) {
  if (!cell) {
    return (
      <td className="border border-gray-200 px-2 py-3 text-center dark:border-gray-700">
        —
      </td>
    );
  }

  const hasRisks = cell.riskCount > 0;

  return (
    <td
      onClick={onClick}
      className={`border border-gray-200 px-2 py-3 text-center align-middle transition-transform dark:border-gray-700 ${
        hasRisks ? 'cursor-pointer hover:scale-[1.02]' : ''
      }`}
      style={{ backgroundColor: cell.color }}
      title={`${cell.label} — F=${cell.frequency} × G=${cell.severity} = ${cell.score} — ${cell.riskCount} risque(s)`}>
      <div className="flex min-h-[92px] flex-col items-center justify-center gap-1">
        <span className="text-sm font-semibold text-gray-900">
          {cell.label}
        </span>
        <span className="text-2xl font-bold tracking-tight text-gray-950">
          {cell.score}
        </span>
        {hasRisks && (
          <span className="rounded-full bg-white/70 px-2 py-0.5 text-[10px] font-semibold text-gray-700">
            {cell.riskCount} risque{cell.riskCount > 1 ? 's' : ''}
          </span>
        )}
      </div>
    </td>
  );
}
