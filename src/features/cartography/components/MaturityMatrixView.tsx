import { SkeletonCard } from '@/components/ui';
import { useMaturityMatrix } from '../hooks';
import type {
  MaturityCriterionKey,
  ProcessMaturityEntry,
} from '../processTypes';
import { MATURITY_CRITERIA, PROCESS_TYPES } from '../processTypes';

function scoreColor(score: number | null): string {
  if (score === null) return 'bg-gray-100 dark:bg-gray-800 text-gray-400';
  if (score <= 1)
    return 'bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300';
  if (score <= 2)
    return 'bg-red-50 dark:bg-red-950/50 text-red-600 dark:text-red-400';
  if (score <= 3)
    return 'bg-yellow-50 dark:bg-yellow-950/50 text-yellow-700 dark:text-yellow-300';
  if (score <= 4)
    return 'bg-green-50 dark:bg-green-950/50 text-green-600 dark:text-green-400';
  return 'bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-300';
}

function percentColor(pct: number): string {
  if (pct < 50) return 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/50';
  if (pct < 70)
    return 'text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-950/50';
  return 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/50';
}

function getCriterionScore(
  entry: ProcessMaturityEntry,
  key: MaturityCriterionKey,
): number | null {
  return entry.evaluation ? entry.evaluation[key] : null;
}

function computeRowAverage(
  entries: ProcessMaturityEntry[],
  key: MaturityCriterionKey,
): number | null {
  const scores = entries
    .map((e) => getCriterionScore(e, key))
    .filter((s): s is number => s !== null);
  if (scores.length === 0) return null;
  return scores.reduce((a, b) => a + b, 0) / scores.length;
}

function computeProcessAverage(entry: ProcessMaturityEntry): number | null {
  if (!entry.evaluation) return null;
  return entry.evaluation.noteMoyenne;
}

export function MaturityMatrixView() {
  const { data: matrix, isLoading } = useMaturityMatrix();

  if (isLoading) {
    return (
      <div className='p-6'>
        <SkeletonCard />
      </div>
    );
  }

  if (!matrix || matrix.entries.length === 0) {
    return (
      <div className='p-12 text-center text-gray-500'>
        <p>Aucun processus disponible pour afficher la matrice de maturité.</p>
      </div>
    );
  }

  const entries = matrix.entries;
  const evaluatedEntries = entries.filter((e) => e.evaluation !== null);

  const globalAverage =
    evaluatedEntries.length > 0
      ? evaluatedEntries.reduce(
          (sum, e) => sum + (e.evaluation?.noteMoyenne ?? 0),
          0,
        ) / evaluatedEntries.length
      : null;

  return (
    <div className='flex-1 min-h-0 overflow-auto'>
      <div className='p-6'>
        <div className='overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700'>
          <table className='w-full text-sm'>
            <thead>
              <tr className='bg-gray-50 dark:bg-gray-800/80'>
                <th className='sticky left-0 z-10 bg-gray-50 dark:bg-gray-800/80 text-left p-3 font-semibold text-gray-700 dark:text-gray-300 border-b border-r border-gray-200 dark:border-gray-700 min-w-[280px]'>
                  Critères
                </th>
                {entries.map((entry) => {
                  const typeInfo = PROCESS_TYPES.find(
                    (t) => t.value === entry.process.type,
                  );
                  return (
                    <th
                      key={entry.process.id}
                      className='p-3 font-medium text-gray-600 dark:text-gray-400 border-b border-r border-gray-200 dark:border-gray-700 min-w-[120px] text-center'>
                      <div className='flex flex-col items-center gap-1'>
                        <span className='text-xs font-semibold text-gray-800 dark:text-gray-200 leading-tight'>
                          {entry.process.nom}
                        </span>
                        <span
                          className={`text-[10px] px-1.5 py-0.5 rounded ${typeInfo?.color ?? ''}`}>
                          {typeInfo?.label ?? entry.process.type}
                        </span>
                      </div>
                    </th>
                  );
                })}
                <th className='p-3 font-semibold text-gray-700 dark:text-gray-300 border-b border-r border-gray-200 dark:border-gray-700 min-w-[100px] text-center'>
                  Moyenne
                </th>
                <th className='p-3 font-semibold text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700 min-w-[80px] text-center'>
                  %
                </th>
              </tr>
            </thead>
            <tbody>
              {MATURITY_CRITERIA.map((criterion, idx) => {
                const rowAvg = computeRowAverage(entries, criterion.key);
                const rowPct =
                  rowAvg !== null ? (rowAvg / 5) * 100 : null;

                return (
                  <tr
                    key={criterion.key}
                    className={
                      idx % 2 === 0
                        ? 'bg-white dark:bg-gray-900'
                        : 'bg-gray-50/50 dark:bg-gray-800/30'
                    }>
                    <td className='sticky left-0 z-10 p-3 text-gray-700 dark:text-gray-300 font-medium border-r border-b border-gray-200 dark:border-gray-700 bg-inherit'>
                      {criterion.label}
                    </td>
                    {entries.map((entry) => {
                      const score = getCriterionScore(entry, criterion.key);
                      return (
                        <td
                          key={entry.process.id}
                          className='p-3 text-center border-r border-b border-gray-200 dark:border-gray-700'>
                          <span
                            className={`inline-flex items-center justify-center w-8 h-8 rounded-lg font-bold text-sm ${scoreColor(score)}`}>
                            {score ?? '—'}
                          </span>
                        </td>
                      );
                    })}
                    <td className='p-3 text-center font-semibold border-r border-b border-gray-200 dark:border-gray-700'>
                      {rowAvg !== null ? rowAvg.toFixed(2) : '—'}
                    </td>
                    <td
                      className={`p-3 text-center font-semibold border-b border-gray-200 dark:border-gray-700 ${rowPct !== null ? percentColor(rowPct) : ''}`}>
                      {rowPct !== null ? `${rowPct.toFixed(0)}%` : '—'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr className='bg-gray-100 dark:bg-gray-800 font-semibold'>
                <td className='sticky left-0 z-10 bg-gray-100 dark:bg-gray-800 p-3 text-gray-700 dark:text-gray-300 border-r border-b border-gray-200 dark:border-gray-700'>
                  Maturité du processus
                </td>
                {entries.map((entry) => {
                  const avg = computeProcessAverage(entry);
                  return (
                    <td
                      key={entry.process.id}
                      className='p-3 text-center border-r border-b border-gray-200 dark:border-gray-700'>
                      {avg !== null ? avg.toFixed(2) : '—'}
                    </td>
                  );
                })}
                <td className='p-3 text-center border-r border-b border-gray-200 dark:border-gray-700 text-brand-600 dark:text-brand-400 text-lg'>
                  {globalAverage !== null ? globalAverage.toFixed(2) : '—'}
                </td>
                <td className='p-3 border-b border-gray-200 dark:border-gray-700' />
              </tr>
              <tr className='bg-gray-100 dark:bg-gray-800 font-semibold'>
                <td className='sticky left-0 z-10 bg-gray-100 dark:bg-gray-800 p-3 text-gray-700 dark:text-gray-300 border-r border-gray-200 dark:border-gray-700'>
                  Résultat de maturité
                </td>
                {entries.map((entry) => {
                  const avg = computeProcessAverage(entry);
                  const pct = avg !== null ? (avg / 5) * 100 : null;
                  return (
                    <td
                      key={entry.process.id}
                      className={`p-3 text-center border-r border-gray-200 dark:border-gray-700 ${pct !== null ? percentColor(pct) : ''}`}>
                      {pct !== null ? `${pct.toFixed(0)}%` : '—'}
                    </td>
                  );
                })}
                <td className='p-3 border-r border-gray-200 dark:border-gray-700' />
                <td
                  className={`p-3 text-center text-lg ${globalAverage !== null ? percentColor((globalAverage / 5) * 100) : ''}`}>
                  {globalAverage !== null
                    ? `${((globalAverage / 5) * 100).toFixed(0)}%`
                    : '—'}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        {globalAverage !== null && (
          <div className='mt-4 flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400'>
            <span className='font-medium'>Légende :</span>
            <span className='inline-flex items-center gap-1'>
              <span className='w-3 h-3 rounded bg-red-100 dark:bg-red-950 border border-red-300 dark:border-red-800' />
              1-2 (faible)
            </span>
            <span className='inline-flex items-center gap-1'>
              <span className='w-3 h-3 rounded bg-yellow-50 dark:bg-yellow-950/50 border border-yellow-300 dark:border-yellow-800' />
              3 (moyen)
            </span>
            <span className='inline-flex items-center gap-1'>
              <span className='w-3 h-3 rounded bg-green-100 dark:bg-green-950 border border-green-300 dark:border-green-800' />
              4-5 (bon)
            </span>
            <span className='ml-auto'>
              Cible : <span className='font-semibold'>60%</span> (3/5)
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
