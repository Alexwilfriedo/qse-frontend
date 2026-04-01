import { Button, Input, Modal } from '@/components/ui';
import { useUsers } from '@/features/admin/hooks/useUsers';
import { useEffect, useState } from 'react';
import type { Auditor, EvaluerCompetencesRequest } from '../types';

interface Props {
  auditor: Auditor | null;
  isOpen: boolean;
  onClose: () => void;
  onEvaluate: (data: EvaluerCompetencesRequest) => Promise<void>;
  isPending: boolean;
}

export function AuditorDetailModal({
  auditor,
  isOpen,
  onClose,
  onEvaluate,
  isPending,
}: Props) {
  const { data: users } = useUsers();
  const [evaluation, setEvaluation] = useState<EvaluerCompetencesRequest>({
    deontologie: 0,
    processus: 0,
    communication: 0,
    reglementation: 0,
  });

  useEffect(() => {
    if (!auditor) {
      return;
    }

    setEvaluation({
      deontologie: auditor.competenceDeontologie,
      processus: auditor.competenceProcessus,
      communication: auditor.competenceCommunication,
      reglementation: auditor.competenceReglementation,
    });
  }, [auditor]);

  if (!auditor) {
    return null;
  }

  const user = users?.find((item) => item.id === auditor.userId);
  const fullName = user
    ? `${user.firstName} ${user.lastName}`
    : (auditor.nomComplet ?? '-');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    await onEvaluate(evaluation);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title='Fiche auditeur' size='lg'>
      <div className='space-y-6'>
        <div className='grid grid-cols-2 gap-4'>
          <Input
            label='Nom et prénoms'
            value={fullName}
            readOnly
          />
          <Input label='Email' value={user?.email ?? '-'} readOnly />
          <Input label='Niveau' value={auditor.level} readOnly />
          <Input
            label='Score moyen'
            value={`${auditor.scoreMoyen.toFixed(1)} / 4`}
            readOnly
          />
          <Input
            label='Normes maîtrisées'
            value={auditor.perimetreNormes.join(', ') || '-'}
            readOnly
          />
          <Input
            label='Prochaine revue'
            value={auditor.dateProchaineRevue ?? '-'}
            readOnly
          />
        </div>

        <form onSubmit={handleSubmit} className='space-y-4 rounded-xl border border-gray-200 p-4'>
          <h3 className='text-base font-semibold text-gray-900'>
            Évaluer les compétences
          </h3>
          <div className='grid grid-cols-2 gap-4'>
            <Input
              label='Déontologie'
              type='number'
              min={0}
              max={4}
              value={String(evaluation.deontologie)}
              onChange={(e) =>
                setEvaluation((prev) => ({
                  ...prev,
                  deontologie: Number(e.target.value),
                }))
              }
            />
            <Input
              label="Processus d'audit"
              type='number'
              min={0}
              max={4}
              value={String(evaluation.processus)}
              onChange={(e) =>
                setEvaluation((prev) => ({
                  ...prev,
                  processus: Number(e.target.value),
                }))
              }
            />
            <Input
              label='Communication'
              type='number'
              min={0}
              max={4}
              value={String(evaluation.communication)}
              onChange={(e) =>
                setEvaluation((prev) => ({
                  ...prev,
                  communication: Number(e.target.value),
                }))
              }
            />
            <Input
              label='Réglementation'
              type='number'
              min={0}
              max={4}
              value={String(evaluation.reglementation)}
              onChange={(e) =>
                setEvaluation((prev) => ({
                  ...prev,
                  reglementation: Number(e.target.value),
                }))
              }
            />
          </div>

          <div className='flex justify-end gap-3'>
            <Button variant='secondary' type='button' onClick={onClose}>
              Fermer
            </Button>
            <Button type='submit' isLoading={isPending}>
              Enregistrer l&apos;évaluation
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
