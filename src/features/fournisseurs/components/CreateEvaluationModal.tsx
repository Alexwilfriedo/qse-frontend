import { Badge, Button, DatePicker, Modal, Textarea } from '@/components/ui';
import { api } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';
import { AlertCircle, CheckCircle2, Star } from 'lucide-react';
import { useState } from 'react';
import { useCreateEvaluation } from '../hooks';
import type { CreateEvaluationRequest, CritereRequest } from '../types';
import {
  computeSupplierWeightedScore,
  getSupplierPerformance,
  SUPPLIER_EVALUATION_TEMPLATE,
  SUPPLIER_NOTE_OPTIONS,
} from '../evaluationTemplate';

interface ReferenceItem {
  id: string;
  code: string;
  label: string;
  description: string | null;
}

interface CreateEvaluationModalProps {
  isOpen: boolean;
  onClose: () => void;
  fournisseurId: string;
}

export function CreateEvaluationModal({
  isOpen,
  onClose,
  fournisseurId,
}: CreateEvaluationModalProps) {
  const [commentaireGeneral, setCommentaireGeneral] = useState('');
  const [dateEvaluation, setDateEvaluation] = useState(
    new Date().toISOString().split('T')[0],
  );
  const [critereNotes, setCritereNotes] = useState<Record<string, CritereRequest>>(
    {},
  );

  const createEvaluation = useCreateEvaluation();

  const { data: criteresRef } = useQuery({
    queryKey: ['reference-items', 'CRITERE_EVAL_FOURNISSEUR'],
    queryFn: async () => {
      const response = await api.get<ReferenceItem[]>(
        '/api/v1/config/references/supplier-evaluation-criteria?activeOnly=true',
      );
      return response.data;
    },
  });

  const updateCritereNote = (critereId: string, note: number) => {
    setCritereNotes((prev) => ({
      ...prev,
      [critereId]: { ...prev[critereId], critereId, note },
    }));
  };

  const updateCritereCommentaire = (critereId: string, commentaire: string) => {
    setCritereNotes((prev) => ({
      ...prev,
      [critereId]: {
        ...prev[critereId],
        critereId,
        note: prev[critereId]?.note || 3,
        commentaire,
      },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const criteres: CritereRequest[] = Object.values(critereNotes).filter(
      (c) => c.note > 0,
    );

    if (criteres.length === 0) {
      return;
    }

    const data: CreateEvaluationRequest = {
      dateEvaluation,
      criteres,
      commentaireGeneral: commentaireGeneral || undefined,
    };

    try {
      await createEvaluation.mutateAsync({ fournisseurId, data });
      setCritereNotes({});
      setCommentaireGeneral('');
      onClose();
    } catch {
      // Error handled by mutation
    }
  };

  const criteriaByCode = new Map(criteresRef?.map((item) => [item.code, item]) ?? []);
  const weightedScore = computeSupplierWeightedScore(
    Object.fromEntries(
      Object.entries(critereNotes)
        .map(([critereId, value]) => {
          const ref = criteresRef?.find((item) => item.id === critereId);
          return ref ? [ref.code, value.note] : null;
        })
        .filter((entry): entry is [string, number] => !!entry),
    ),
  );
  const performance = getSupplierPerformance(weightedScore);
  const missingCodes = SUPPLIER_EVALUATION_TEMPLATE.flatMap((section) =>
    section.criteria
      .map((criterion) => criterion.code)
      .filter((code) => !criteriaByCode.has(code)),
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title='Nouvelle évaluation fournisseur'
      size='xl'>
      <form onSubmit={handleSubmit} className='space-y-6'>
        <div className='grid gap-6 xl:grid-cols-[1.6fr_0.8fr]'>
          <div className='space-y-5'>
            <div className='rounded-2xl border border-gray-200 bg-gray-50 p-4'>
              <div className='grid gap-4 md:grid-cols-2'>
                <DatePicker
                  label="Date d'évaluation"
                  value={dateEvaluation}
                  onChange={setDateEvaluation}
                  required
                />
                <div className='rounded-xl border border-white bg-white p-4'>
                  <p className='text-sm font-medium text-gray-700'>
                    Critères de pondération
                  </p>
                  <div className='mt-3 grid grid-cols-2 gap-2 text-sm text-gray-600'>
                    {SUPPLIER_NOTE_OPTIONS.map((option) => (
                      <div key={option.value} className='rounded-lg bg-gray-50 px-3 py-2'>
                        <span className='font-semibold text-gray-900'>{option.label}</span>{' '}
                        <span>({option.description})</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {missingCodes.length > 0 ? (
              <div className='flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800'>
                <AlertCircle className='mt-0.5 h-4 w-4 shrink-0' />
                <div>
                  Certains critères de la nouvelle grille ne sont pas encore disponibles en base.
                  Lance les migrations backend avant de créer une évaluation.
                </div>
              </div>
            ) : null}

            {SUPPLIER_EVALUATION_TEMPLATE.map((section) => (
              <section
                key={section.id}
                className={`rounded-2xl border p-4 ${section.colorClass}`}>
                <div className='mb-4 flex items-center justify-between gap-3'>
                  <div>
                    <h3 className='text-base font-semibold text-gray-900'>
                      {section.title}
                    </h3>
                    <p className='text-sm text-gray-600'>Poids {section.weight}%</p>
                  </div>
                  <Badge variant='brand'>{section.weight}% du score global</Badge>
                </div>

                <div className='space-y-4'>
                  {section.criteria.map((criterion) => {
                    const ref = criteriaByCode.get(criterion.code);
                    const current = ref ? critereNotes[ref.id] : undefined;

                    return (
                      <div
                        key={criterion.code}
                        className='rounded-xl border border-white bg-white/90 p-4 shadow-sm'>
                        <div className='flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between'>
                          <div className='max-w-2xl'>
                            <p className='text-sm font-semibold text-gray-900'>
                              {criterion.label}
                            </p>
                            <p className='mt-1 text-sm text-gray-600'>
                              {criterion.prompt}
                            </p>
                          </div>

                          <div className='flex flex-wrap gap-2'>
                            {SUPPLIER_NOTE_OPTIONS.map((option) => (
                              <button
                                key={option.value}
                                type='button'
                                disabled={!ref}
                                onClick={() =>
                                  ref && updateCritereNote(ref.id, option.value)
                                }
                                className={`rounded-xl border px-3 py-2 text-sm font-semibold transition-colors ${
                                  current?.note === option.value
                                    ? 'border-brand-500 bg-brand-500 text-white'
                                    : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                                } ${!ref ? 'cursor-not-allowed opacity-40' : ''}`}>
                                {option.value}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className='mt-4'>
                          <Textarea
                            label='Observations / Justifications'
                            value={current?.commentaire || ''}
                            onChange={(e) =>
                              ref && updateCritereCommentaire(ref.id, e.target.value)
                            }
                            placeholder='Ajoute les éléments factuels, réserves ou points forts observés...'
                            rows={3}
                            disabled={!ref}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            ))}

            <div className='rounded-2xl border border-gray-200 bg-white p-4'>
              <Textarea
                label='Commentaire général'
                value={commentaireGeneral}
                onChange={(e) => setCommentaireGeneral(e.target.value)}
                placeholder='Appréciation globale du fournisseur, forces, réserves, actions attendues...'
                rows={4}
              />
            </div>
          </div>

          <aside className='space-y-4 xl:sticky xl:top-0 xl:self-start'>
            <div className='rounded-3xl border border-gray-200 bg-white p-5 shadow-sm'>
              <div className='flex items-center gap-2 text-sm font-medium text-gray-600'>
                <Star className='h-4 w-4 text-amber-500' />
                Synthèse des résultats
              </div>
              <div className='mt-4 rounded-2xl bg-gray-950 px-5 py-6 text-white'>
                <p className='text-xs uppercase tracking-[0.2em] text-white/70'>
                  Note globale pondérée
                </p>
                <div className='mt-3 flex items-end gap-2'>
                  <span className='text-5xl font-semibold'>
                    {weightedScore.toFixed(2)}
                  </span>
                  <span className='pb-1 text-white/70'>/ 5</span>
                </div>
              </div>

              <div className='mt-4 space-y-3'>
                <div className='rounded-2xl border border-gray-100 bg-gray-50 p-4'>
                  <p className='text-xs uppercase tracking-[0.2em] text-gray-500'>
                    Classement de la performance
                  </p>
                  <div className='mt-2 flex items-center gap-3'>
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${performance.badgeClass}`}>
                      {performance.grade} · {performance.label}
                    </span>
                  </div>
                  <p className='mt-2 text-sm text-gray-600'>
                    {performance.description}
                  </p>
                </div>

                <div className='rounded-2xl border border-emerald-100 bg-emerald-50 p-4'>
                  <div className='flex items-center gap-2 text-sm font-medium text-emerald-800'>
                    <CheckCircle2 className='h-4 w-4' />
                    Recommandation proposée
                  </div>
                  <p className='mt-2 text-sm font-semibold text-emerald-900'>
                    {performance.recommendation}
                  </p>
                </div>

                <div className='rounded-2xl border border-gray-100 bg-gray-50 p-4 text-sm text-gray-600'>
                  <p className='font-medium text-gray-800'>Règle de classement</p>
                  <ul className='mt-2 space-y-1'>
                    <li>A : 4.5 à 5.0</li>
                    <li>B : 3.5 à 4.4</li>
                    <li>C : 2.5 à 3.4</li>
                    <li>D : inférieur à 2.5</li>
                  </ul>
                </div>
              </div>
            </div>
          </aside>
        </div>

        <div className='flex justify-end gap-3 pt-2'>
          <Button type='button' variant='secondary' onClick={onClose}>
            Annuler
          </Button>
          <Button
            type='submit'
            disabled={
              createEvaluation.isPending ||
              missingCodes.length > 0 ||
              Object.values(critereNotes).filter((item) => item.note > 0).length === 0
            }>
            {createEvaluation.isPending ? 'Création...' : "Créer l'évaluation"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
