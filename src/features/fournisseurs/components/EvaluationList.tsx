import { Badge, Button, Card, CardHeader } from '@/components/ui';
import { Plus, Star, Trash2 } from 'lucide-react';
import type { EvaluationFournisseur } from '../types';
import { getSupplierPerformance } from '../evaluationTemplate';

interface EvaluationListProps {
  evaluations: EvaluationFournisseur[] | undefined;
  isLoading: boolean;
  onAdd: () => void;
  onDelete: (evaluation: EvaluationFournisseur) => void;
}

function noteColor(note: number): 'success' | 'warning' | 'error' {
  if (note >= 4) return 'success';
  if (note >= 2.5) return 'warning';
  return 'error';
}

export function EvaluationList({ evaluations, isLoading, onAdd, onDelete }: EvaluationListProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader title='Évaluations' />
        <div className='p-6 space-y-3'>
          {[1, 2, 3].map((i) => (
            <div key={i} className='h-16 bg-gray-100 dark:bg-gray-700 rounded-lg animate-pulse' />
          ))}
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader
        title='Évaluations HSQSE'
        action={
          <Button size='sm' onClick={onAdd}>
            <Plus className='w-4 h-4 mr-1' />
            Nouvelle évaluation
          </Button>
        }
      />
      {!evaluations || evaluations.length === 0 ? (
        <div className='p-6 text-center text-gray-500 dark:text-gray-400'>
          Aucune évaluation pour ce fournisseur.
        </div>
      ) : (
        <div className='divide-y divide-gray-200 dark:divide-gray-700'>
          {evaluations.map((evaluation) => (
            <div key={evaluation.id} className='p-4'>
              <div className='flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between'>
                <div className='flex items-start gap-4'>
                  <div className='flex items-center gap-1 rounded-2xl bg-amber-50 px-3 py-2'>
                    <Star className='w-5 h-5 text-yellow-500 fill-yellow-500' />
                    <span className='text-sm font-semibold text-gray-900'>
                      {evaluation.noteGlobale.toFixed(2)} / 5
                    </span>
                  </div>
                  <div>
                    <div className='flex flex-wrap items-center gap-2'>
                      <p className='text-sm font-medium text-gray-900 dark:text-white'>
                        Évaluation du{' '}
                        {new Date(evaluation.dateEvaluation).toLocaleDateString('fr-FR')}
                      </p>
                      <Badge
                        className={getSupplierPerformance(evaluation.noteGlobale).badgeClass}>
                        {getSupplierPerformance(evaluation.noteGlobale).grade} ·{' '}
                        {getSupplierPerformance(evaluation.noteGlobale).label}
                      </Badge>
                    </div>
                    <p className='mt-1 text-xs text-gray-500 dark:text-gray-400'>
                      {evaluation.criteres.length} critères évalués
                    </p>
                    {evaluation.commentaireGeneral ? (
                      <p className='mt-2 text-sm text-gray-600 dark:text-gray-300'>
                        {evaluation.commentaireGeneral}
                      </p>
                    ) : null}
                  </div>
                </div>
                <div className='flex items-center gap-2'>
                  <Badge variant={noteColor(evaluation.noteGlobale)}>
                    {getSupplierPerformance(evaluation.noteGlobale).recommendation}
                  </Badge>
                  <Button variant='ghost' size='sm' onClick={() => onDelete(evaluation)}>
                  <Trash2 className='w-4 h-4 text-error-500' />
                </Button>
              </div>
            </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
