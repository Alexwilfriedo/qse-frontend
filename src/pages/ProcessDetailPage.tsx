import { SkeletonCard, SkeletonText } from '@/components/ui';
import { MaturityEvaluationModal } from '@/features/cartography/components';
import {
  ProcessDetailHeader,
  ProcessFipCard,
  ProcessInfoGrid,
} from '@/features/cartography/components/detail';
import ProcessRisksPanel from '@/features/cartography/components/ProcessRisksPanel';
import { useProcess } from '@/features/cartography/hooks';
import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';

export default function ProcessDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: process, isLoading } = useProcess(id);
  const [isMaturityOpen, setIsMaturityOpen] = useState(false);

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
      />
      <ProcessInfoGrid process={process} />
      <ProcessFipCard process={process} />

      {/* Risques associés (PRD M1-31) */}
      <ProcessRisksPanel processId={process.id} />

      <MaturityEvaluationModal
        isOpen={isMaturityOpen}
        onClose={() => setIsMaturityOpen(false)}
        processId={process.id}
        processName={process.nom}
      />
    </div>
  );
}
