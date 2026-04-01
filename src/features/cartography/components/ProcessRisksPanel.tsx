import { Badge, Card, CardHeader, SkeletonText } from '@/components/ui';
import { useRisks } from '@/features/risks/hooks/useRisks';
import type { Risk } from '@/features/risks/types';
import { AlertTriangle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const DOMAINE_BADGE: Record<string, string> = {
  QUALITE: 'badge-qualite',
  SECURITE: 'badge-securite',
  ENVIRONNEMENT: 'badge-environnement',
};

function criticalityBadge(score: number) {
  if (score >= 16)
    return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
  if (score >= 8)
    return 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200';
  return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
}

interface Props {
  processId: string;
}

/**
 * Panneau affichant les top 3 risques associés à un processus (PRD M1-31).
 * Triés par criticité brute décroissante.
 */
export default function ProcessRisksPanel({ processId }: Props) {
  const { data, isLoading } = useRisks({
    processusId: processId,
    page: 0,
    size: 3,
  });

  const risks: Risk[] = data?.content ?? [];

  return (
    <Card>
      <CardHeader
        title='Risques associés'
        action={
          risks.length > 0 ? (
            <Link
              to={`/risks?processusId=${processId}`}
              className='flex items-center gap-1 text-sm text-brand-600 hover:text-brand-700'>
              Voir tous
              <ArrowRight className='w-3.5 h-3.5' />
            </Link>
          ) : (
            <span className='flex items-center gap-1 text-sm text-gray-400 cursor-not-allowed'>
              Voir tous
              <ArrowRight className='w-3.5 h-3.5' />
            </span>
          )
        }
      />
      {isLoading ? (
        <div className='p-6 space-y-3'>
          <SkeletonText className='h-12 w-full' />
          <SkeletonText className='h-12 w-full' />
          <SkeletonText className='h-12 w-full' />
        </div>
      ) : risks.length > 0 ? (
        <div className='divide-y divide-gray-100 dark:divide-gray-800'>
          {risks.map((risk) => (
            <Link
              key={risk.id}
              to={`/risks/${risk.id}`}
              className='flex items-center justify-between gap-4 px-6 py-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors'>
              <div className='flex items-center gap-3 min-w-0'>
                <AlertTriangle className='w-4 h-4 text-gray-400 shrink-0' />
                <div className='min-w-0'>
                  <p className='text-sm font-medium text-gray-900 dark:text-white truncate'>
                    {risk.title}
                  </p>
                  <p className='text-xs text-gray-500 font-mono'>{risk.code}</p>
                </div>
              </div>
              <div className='flex items-center gap-2 shrink-0'>
                <Badge
                  variant='default'
                  className={`text-xs ${DOMAINE_BADGE[risk.domaine] ?? ''}`}>
                  {risk.domaine}
                </Badge>
                <Badge
                  variant='default'
                  className={`text-xs ${criticalityBadge(risk.criticityScore)}`}>
                  C={risk.criticityScore}
                </Badge>
                {risk.residualCriticityScore != null &&
                  risk.residualCriticityScore > 0 && (
                    <Badge
                      variant='default'
                      className={`text-xs ${criticalityBadge(risk.residualCriticityScore)}`}>
                      Rés={risk.residualCriticityScore}
                    </Badge>
                  )}
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className='p-8 text-center text-sm text-gray-500'>
          <AlertTriangle className='mx-auto h-8 w-8 text-gray-300 mb-2' />
          Aucun risque identifié pour ce processus.
        </div>
      )}
    </Card>
  );
}
