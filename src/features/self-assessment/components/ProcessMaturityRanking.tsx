import { Badge } from '@/components/ui';
import type { ProcessRankingView } from '../types';

interface ProcessMaturityRankingProps {
  data: ProcessRankingView[];
  processNames: Record<string, string>;
}

function getScoreBadge(score: number) {
  if (score >= 75) return <Badge variant="success">{score}/100</Badge>;
  if (score >= 50) return <Badge variant="warning">{score}/100</Badge>;
  return <Badge variant="error">{score}/100</Badge>;
}

export function ProcessMaturityRanking({
  data,
  processNames,
}: ProcessMaturityRankingProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200 text-left text-gray-500">
            <th className="pb-2 font-medium">#</th>
            <th className="pb-2 font-medium">Processus</th>
            <th className="pb-2 text-right font-medium">Note</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr
              key={item.processId}
              className="border-b border-gray-100 last:border-0"
            >
              <td className="py-2 text-gray-400">{index + 1}</td>
              <td className="py-2 font-medium text-gray-900">
                {processNames[item.processId] ?? item.processId.slice(0, 8)}
              </td>
              <td className="py-2 text-right">
                {getScoreBadge(item.noteGlobale)}
              </td>
            </tr>
          ))}
          {data.length === 0 && (
            <tr>
              <td colSpan={3} className="py-4 text-center text-gray-400">
                Aucun score disponible
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
