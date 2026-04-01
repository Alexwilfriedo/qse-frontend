import { Badge, Card, PageHeader } from '@/components/ui';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    useCampaign,
    useResponse,
    useSaveResponse,
} from './hooks/useSelfAssessmentCampaigns';
import { useGrid } from './hooks/useSelfAssessmentConfig';
import type { AssessmentAxis, QuestionResponseDto } from './types';

export function SelfAssessmentFillPage() {
  const { campaignId, processId } = useParams<{
    campaignId: string;
    processId: string;
  }>();
  const navigate = useNavigate();

  const { data: campaign } = useCampaign(campaignId);
  const { data: response, isLoading: loadingResponse } = useResponse(
    campaignId,
    processId,
  );
  const { data: grid } = useGrid(campaign?.gridId ?? '');
  const saveMutation = useSaveResponse(campaignId!, processId!);

  const [answers, setAnswers] = useState<Record<string, QuestionResponseDto>>(
    {},
  );

  useEffect(() => {
    if (response?.responses) {
      const map: Record<string, QuestionResponseDto> = {};
      for (const r of response.responses) {
        map[r.questionId] = {
          questionId: r.questionId,
          valeur: r.valeur,
          commentaire: r.commentaire ?? undefined,
          actionCorrectiveId: r.actionCorrectiveId ?? undefined,
        };
      }
      setAnswers(map);
    }
  }, [response]);

  const updateAnswer = useCallback(
    (questionId: string, field: keyof QuestionResponseDto, value: string) => {
      setAnswers((prev) => ({
        ...prev,
        [questionId]: {
          ...prev[questionId],
          questionId,
          [field]: value,
        },
      }));
    },
    [],
  );

  const handleSave = (submit: boolean) => {
    const responsesList = Object.values(answers).filter((a) => a.valeur);
    saveMutation.mutate(
      { responses: responsesList, submit },
      {
        onSuccess: () => {
          if (submit) navigate(`/self-assessment/campaigns/${campaignId}`);
        },
      },
    );
  };

  const readOnly =
    response?.statut === 'SOUMIS' || response?.statut === 'VALIDE';

  if (loadingResponse) {
    return (
      <div className='space-y-6'>
        <PageHeader title='Chargement...' />
        <div className='animate-pulse space-y-4'>
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className='h-32 rounded-lg bg-gray-200 dark:bg-gray-700'
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      <PageHeader
        title={campaign?.titre ?? 'Auto-évaluation'}
        description={
          readOnly
            ? 'Réponse soumise (lecture seule)'
            : 'Remplissez la grille question par question'
        }
        actions={
          !readOnly ? (
            <div className='flex gap-2'>
              <button
                type='button'
                className='rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800'
                onClick={() => handleSave(false)}
                disabled={saveMutation.isPending}>
                Enregistrer brouillon
              </button>
              <button
                type='button'
                className='rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600 disabled:opacity-50'
                onClick={() => handleSave(true)}
                disabled={saveMutation.isPending}>
                Soumettre
              </button>
            </div>
          ) : undefined
        }
      />

      {grid?.axes.map((axis: AssessmentAxis) => (
        <Card key={axis.id}>
          <div className='border-b border-gray-200 px-4 py-3 dark:border-gray-700'>
            <h3 className='text-base font-semibold text-gray-900 dark:text-white'>
              {axis.nom}
            </h3>
            {axis.description && (
              <p className='mt-1 text-sm text-gray-500'>{axis.description}</p>
            )}
          </div>
          <div className='divide-y divide-gray-100 dark:divide-gray-800'>
            {axis.questions.map((q) => {
              const answer = answers[q.id];
              const isNon = answer?.valeur === 'NON';
              return (
                <div key={q.id} className='px-4 py-4'>
                  <div className='mb-2 flex items-start justify-between'>
                    <label className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                      {q.libelle}
                      {q.obligatoire && (
                        <span className='ml-1 text-red-500'>*</span>
                      )}
                    </label>
                    {isNon && <Badge variant='error'>Écart détecté</Badge>}
                  </div>

                  {q.type === 'OUI_NON' && (
                    <div className='flex gap-3'>
                      {['OUI', 'NON'].map((val) => (
                        <button
                          key={val}
                          type='button'
                          disabled={readOnly}
                          className={`rounded-lg border px-4 py-2 text-sm font-medium transition ${
                            answer?.valeur === val
                              ? val === 'OUI'
                                ? 'border-green-500 bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                                : 'border-red-500 bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400'
                              : 'border-gray-300 text-gray-600 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-800'
                          } disabled:cursor-not-allowed`}
                          onClick={() => updateAnswer(q.id, 'valeur', val)}>
                          {val}
                        </button>
                      ))}
                    </div>
                  )}

                  {q.type === 'ECHELLE_1_5' && (
                    <div className='flex gap-2'>
                      {[1, 2, 3, 4, 5].map((val) => (
                        <button
                          key={val}
                          type='button'
                          disabled={readOnly}
                          className={`h-10 w-10 rounded-lg border text-sm font-medium transition ${
                            answer?.valeur === String(val)
                              ? 'border-brand-500 bg-brand-50 text-brand-700 dark:bg-brand-900/20 dark:text-brand-400'
                              : 'border-gray-300 text-gray-600 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-800'
                          } disabled:cursor-not-allowed`}
                          onClick={() =>
                            updateAnswer(q.id, 'valeur', String(val))
                          }>
                          {val}
                        </button>
                      ))}
                    </div>
                  )}

                  {q.type === 'TEXTE_LIBRE' && (
                    <textarea
                      className='w-full rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white'
                      rows={2}
                      disabled={readOnly}
                      value={answer?.valeur ?? ''}
                      onChange={(e) =>
                        updateAnswer(q.id, 'valeur', e.target.value)
                      }
                      placeholder='Votre réponse...'
                    />
                  )}

                  <textarea
                    className='mt-2 w-full rounded-lg border border-gray-200 px-3 py-2 text-xs text-gray-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400'
                    rows={1}
                    disabled={readOnly}
                    value={answer?.commentaire ?? ''}
                    onChange={(e) =>
                      updateAnswer(q.id, 'commentaire', e.target.value)
                    }
                    placeholder='Commentaire optionnel...'
                  />
                </div>
              );
            })}
          </div>
        </Card>
      ))}
    </div>
  );
}
