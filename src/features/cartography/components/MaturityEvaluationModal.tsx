import { Button, Modal } from '@/components/ui';
import { useState } from 'react';
import { useCreateMaturityEvaluation } from '../hooks';
import type {
  CreateMaturityEvaluationRequest,
  MaturityCriterionKey,
} from '../processTypes';
import { MATURITY_CRITERIA } from '../processTypes';

interface MaturityEvaluationModalProps {
  isOpen: boolean;
  onClose: () => void;
  processId: string;
  processName: string;
}

const SCORE_COLORS: Record<number, string> = {
  1: 'bg-red-500 text-white',
  2: 'bg-red-300 text-white',
  3: 'bg-yellow-400 text-gray-900',
  4: 'bg-green-400 text-white',
  5: 'bg-green-600 text-white',
};

const EMPTY_SCORES: CreateMaturityEvaluationRequest = {
  scoreDefinition: 0,
  scoreResponsabilities: 0,
  scoreProcedures: 0,
  scoreEffectiveness: 0,
  scoreAdaptability: 0,
};

export function MaturityEvaluationModal({
  isOpen,
  onClose,
  processId,
  processName,
}: MaturityEvaluationModalProps) {
  const [scores, setScores] =
    useState<CreateMaturityEvaluationRequest>(EMPTY_SCORES);
  const createEvaluation = useCreateMaturityEvaluation();

  const setScore = (key: MaturityCriterionKey, value: number) => {
    setScores((prev) => ({ ...prev, [key]: value }));
  };

  const allScoresSet = MATURITY_CRITERIA.every(
    (c) => scores[c.key] >= 1 && scores[c.key] <= 5,
  );

  const average = allScoresSet
    ? MATURITY_CRITERIA.reduce((sum, c) => sum + scores[c.key], 0) / 5
    : null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!allScoresSet) return;

    createEvaluation.mutate(
      { processId, data: scores },
      {
        onSuccess: () => {
          setScores(EMPTY_SCORES);
          onClose();
        },
      },
    );
  };

  const handleClose = () => {
    setScores(EMPTY_SCORES);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={`Évaluation de maturité — ${processName}`}
      size='lg'>
      <form onSubmit={handleSubmit} className='space-y-5'>
        <p className='text-sm text-gray-500 dark:text-gray-400'>
          Évaluez chaque critère de 1 (très faible) à 5 (excellent).
        </p>

        <div className='space-y-4'>
          {MATURITY_CRITERIA.map((criterion) => (
            <div
              key={criterion.key}
              className='flex flex-col sm:flex-row sm:items-center gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50'>
              <p className='flex-1 text-sm font-medium text-gray-700 dark:text-gray-300'>
                {criterion.label}
              </p>
              <div className='flex items-center gap-1.5 shrink-0'>
                {[1, 2, 3, 4, 5].map((val) => (
                  <button
                    key={val}
                    type='button'
                    onClick={() => setScore(criterion.key, val)}
                    className={`w-9 h-9 rounded-lg text-sm font-bold transition-all ${
                      scores[criterion.key] === val
                        ? `${SCORE_COLORS[val]} ring-2 ring-offset-1 ring-gray-400 dark:ring-offset-gray-900 scale-110`
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-600'
                    }`}>
                    {val}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {average !== null && (
          <div className='flex items-center justify-between p-3 rounded-lg bg-brand-50 dark:bg-brand-950/30 border border-brand-200 dark:border-brand-800'>
            <span className='text-sm font-medium text-brand-700 dark:text-brand-300'>
              Note moyenne
            </span>
            <div className='flex items-center gap-2'>
              <span className='text-xl font-bold text-brand-700 dark:text-brand-300'>
                {average.toFixed(2)}
              </span>
              <span className='text-sm text-brand-500'>/5</span>
              <span className='text-sm font-medium text-brand-600 dark:text-brand-400 ml-2'>
                ({((average / 5) * 100).toFixed(0)}%)
              </span>
            </div>
          </div>
        )}

        <div className='flex justify-end gap-3 pt-2'>
          <Button variant='secondary' type='button' onClick={handleClose}>
            Annuler
          </Button>
          <Button
            type='submit'
            disabled={createEvaluation.isPending || !allScoresSet}>
            {createEvaluation.isPending ? 'Enregistrement...' : 'Enregistrer'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
