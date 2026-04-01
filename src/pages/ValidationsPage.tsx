import { PageHeader, SkeletonCard } from '@/components/ui';
import ValidationCard from '@/features/validation/components/ValidationCard';
import { usePendingValidations } from '@/features/validation/hooks/useValidationQueries';
import { ClipboardCheck } from 'lucide-react';

export default function ValidationsPage() {
  const { data: validations, isLoading } = usePendingValidations();

  return (
    <div className='space-y-6'>
      <PageHeader
        title='Validations en attente'
        description='Demandes de validation des processus soumises par les pilotes'
      />

      {isLoading && (
        <div className='space-y-4'>
          {[1, 2, 3].map((i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      )}

      {!isLoading && validations && validations.length === 0 && (
        <div className='text-center py-12'>
          <ClipboardCheck className='h-12 w-12 text-gray-300 mx-auto mb-3' />
          <p className='text-gray-500 dark:text-gray-400'>
            Aucune demande en attente
          </p>
        </div>
      )}

      {!isLoading && validations && validations.length > 0 && (
        <div className='space-y-4'>
          {validations.map((v) => (
            <ValidationCard key={v.id} validation={v} />
          ))}
        </div>
      )}
    </div>
  );
}
