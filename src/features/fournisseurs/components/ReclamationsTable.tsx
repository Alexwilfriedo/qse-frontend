import { Badge, Button } from '@/components/ui';
import { useState } from 'react';
import { useUpdateReclamationStatut } from '../hooks';
import type { ReclamationFournisseur, StatutReclamation } from '../types';
import { CATEGORIE_RECLAMATION_OPTIONS } from '../types';

const STATUT_BADGE: Record<
  StatutReclamation,
  { variant: 'success' | 'warning' | 'info'; label: string }
> = {
  OUVERTE: { variant: 'warning', label: 'Ouverte' },
  EN_TRAITEMENT: { variant: 'info', label: 'En traitement' },
  CLOTUREE: { variant: 'success', label: 'Clôturée' },
};

const categorieLabel = (cat: string) =>
  CATEGORIE_RECLAMATION_OPTIONS.find((o) => o.value === cat)?.label ?? cat;

interface Props {
  fournisseurId: string;
  reclamations: ReclamationFournisseur[];
}

export default function ReclamationsTable({
  fournisseurId,
  reclamations,
}: Props) {
  const updateStatut = useUpdateReclamationStatut();
  const [commentaire, setCommentaire] = useState('');
  const [closingId, setClosingId] = useState<string | null>(null);

  const handleTransition = async (
    rec: ReclamationFournisseur,
    target: StatutReclamation,
    comment?: string,
  ) => {
    await updateStatut.mutateAsync({
      fournisseurId,
      reclamationId: rec.id,
      data: { statut: target, commentaireResolution: comment },
    });
    setClosingId(null);
    setCommentaire('');
  };

  if (reclamations.length === 0) {
    return (
      <p className='py-6 text-center text-sm text-gray-500 dark:text-gray-400'>
        Aucune réclamation enregistrée.
      </p>
    );
  }

  return (
    <div className='overflow-x-auto'>
      <table className='min-w-full text-sm'>
        <thead>
          <tr className='border-b border-gray-200 text-left text-xs font-medium uppercase text-gray-500 dark:border-gray-700 dark:text-gray-400'>
            <th className='px-4 py-3'>Date</th>
            <th className='px-4 py-3'>Objet</th>
            <th className='px-4 py-3'>Catégorie</th>
            <th className='px-4 py-3'>Statut</th>
            <th className='px-4 py-3'>Actions</th>
          </tr>
        </thead>
        <tbody>
          {reclamations.map((rec) => {
            const badge = STATUT_BADGE[rec.statut];
            return (
              <tr
                key={rec.id}
                className='border-b border-gray-100 hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-800/50'>
                <td className='whitespace-nowrap px-4 py-3'>
                  {rec.dateReclamation}
                </td>
                <td className='px-4 py-3 font-medium text-gray-900 dark:text-white'>
                  {rec.objet}
                </td>
                <td className='px-4 py-3'>{categorieLabel(rec.categorie)}</td>
                <td className='px-4 py-3'>
                  <Badge variant={badge.variant}>{badge.label}</Badge>
                </td>
                <td className='px-4 py-3'>
                  {rec.statut === 'OUVERTE' && (
                    <Button
                      size='sm'
                      variant='secondary'
                      onClick={() => handleTransition(rec, 'EN_TRAITEMENT')}
                      disabled={updateStatut.isPending}>
                      Traiter
                    </Button>
                  )}
                  {rec.statut === 'EN_TRAITEMENT' && closingId !== rec.id && (
                    <Button
                      size='sm'
                      variant='secondary'
                      onClick={() => setClosingId(rec.id)}>
                      Clôturer
                    </Button>
                  )}
                  {rec.statut === 'EN_TRAITEMENT' && closingId === rec.id && (
                    <div className='flex items-center gap-2'>
                      <input
                        type='text'
                        className='rounded border border-gray-300 px-2 py-1 text-xs dark:border-gray-600 dark:bg-gray-800 dark:text-white'
                        placeholder='Commentaire résolution'
                        value={commentaire}
                        onChange={(e) => setCommentaire(e.target.value)}
                      />
                      <Button
                        size='sm'
                        onClick={() =>
                          handleTransition(rec, 'CLOTUREE', commentaire)
                        }
                        disabled={updateStatut.isPending}>
                        OK
                      </Button>
                      <Button
                        size='sm'
                        variant='secondary'
                        onClick={() => {
                          setClosingId(null);
                          setCommentaire('');
                        }}>
                        ✕
                      </Button>
                    </div>
                  )}
                  {rec.statut === 'CLOTUREE' && rec.commentaireResolution && (
                    <span
                      className='text-xs text-gray-500'
                      title={rec.commentaireResolution}>
                      {rec.commentaireResolution.length > 40
                        ? `${rec.commentaireResolution.slice(0, 40)}…`
                        : rec.commentaireResolution}
                    </span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
