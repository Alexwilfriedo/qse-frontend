import { Button, Modal, SkeletonCard, SkeletonText } from '@/components/ui';
import { MaturityEvaluationModal } from '@/features/cartography/components';
import {
  ProcessDetailHeader,
  ProcessFipCard,
  ProcessInfoGrid,
  ProcessInteractionsCard,
} from '@/features/cartography/components/detail';
import { useDeleteProcess } from '@/features/cartography/hooks';
import ProcessRisksPanel from '@/features/cartography/components/ProcessRisksPanel';
import { useProcess } from '@/features/cartography/hooks';
import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

export default function ProcessDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: process, isLoading } = useProcess(id);
  const [isMaturityOpen, setIsMaturityOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const deleteProcess = useDeleteProcess();
  const navigate = useNavigate();

  const handleDelete = () => {
    if (!process) return;
    deleteProcess.mutate(process.id, {
      onSuccess: () => {
        setIsDeleteOpen(false);
        navigate('/cartographie/processus');
      },
    });
  };

  if (isLoading) {
    return (
      <div className='space-y-6'>
        <SkeletonText className='h-10 w-64' />
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>
    );
  }

  if (!process) {
    return (
      <div className='text-center py-12'>
        <p className='text-gray-500'>Processus introuvable</p>
        <Link
          to='/cartographie/processus'
          className='text-brand-600 hover:underline mt-2 inline-block'>
          Retour à la liste
        </Link>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      <ProcessDetailHeader
        process={process}
        onEvaluateMaturity={() => setIsMaturityOpen(true)}
        onDelete={() => setIsDeleteOpen(true)}
        isDeleting={deleteProcess.isPending}
      />
      <ProcessInfoGrid process={process} />
      <ProcessInteractionsCard process={process} />
      <ProcessFipCard process={process} />

      {/* Risques associés (PRD M1-31) */}
      <ProcessRisksPanel processId={process.id} />

      <MaturityEvaluationModal
        isOpen={isMaturityOpen}
        onClose={() => setIsMaturityOpen(false)}
        processId={process.id}
        processName={process.nom}
      />

      <Modal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        title='Supprimer le processus'>
        <div className='space-y-4'>
          <p className='text-sm text-gray-600 dark:text-gray-400'>
            Le processus <strong>{process.nom}</strong> sera supprimé de la
            cartographie. Cette action retire aussi sa fiche des listes actives.
          </p>
          <div className='flex justify-end gap-3'>
            <Button variant='ghost' onClick={() => setIsDeleteOpen(false)}>
              Annuler
            </Button>
            <Button
              variant='destructive'
              onClick={handleDelete}
              isLoading={deleteProcess.isPending}>
              Supprimer
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
