import { Badge, Button, Card } from '@/components/ui';
import { Check, Clock, MessageSquare, X } from 'lucide-react';
import { useState } from 'react';
import {
  useApproveValidation,
  useRejectValidation,
} from '../hooks/useValidationMutations';
import type { ValidationRequestView } from '../validationTypes';

interface ValidationCardProps {
  validation: ValidationRequestView;
}

const statusConfig: Record<string, { label: string; className: string }> = {
  PENDING: { label: 'En attente', className: 'badge-warning' },
  APPROVED: { label: 'Approuvé', className: 'badge-success' },
  REJECTED: { label: 'Rejeté', className: 'badge-error' },
};

export default function ValidationCard({ validation }: ValidationCardProps) {
  const [rejectComment, setRejectComment] = useState('');
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [approveComment, setApproveComment] = useState('');
  const [showApproveForm, setShowApproveForm] = useState(false);

  const approveMutation = useApproveValidation();
  const rejectMutation = useRejectValidation();

  const config = statusConfig[validation.status] ?? statusConfig.PENDING;
  const isPending = validation.status === 'PENDING';

  const handleApprove = () => {
    approveMutation.mutate({
      id: validation.id,
      data: approveComment ? { comment: approveComment } : undefined,
    });
  };

  const handleReject = () => {
    if (!rejectComment.trim()) return;
    rejectMutation.mutate({
      id: validation.id,
      data: { comment: rejectComment },
    });
  };

  return (
    <Card className='p-4'>
      <div className='flex items-start justify-between gap-4'>
        <div className='min-w-0 flex-1'>
          <div className='flex items-center gap-2 mb-1'>
            <Clock className='h-4 w-4 text-gray-400' />
            <span className='text-sm font-medium text-gray-900 dark:text-white'>
              Processus {validation.processId.slice(0, 8)}...
            </span>
            <Badge className={config.className}>{config.label}</Badge>
          </div>
          <p className='text-xs text-gray-500 dark:text-gray-400'>
            Soumis le{' '}
            {new Date(validation.submittedAt).toLocaleDateString('fr-FR', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
          {validation.comment && (
            <div className='mt-2 flex items-start gap-1.5 text-sm text-gray-600 dark:text-gray-300'>
              <MessageSquare className='h-3.5 w-3.5 mt-0.5 flex-shrink-0' />
              <span>{validation.comment}</span>
            </div>
          )}
        </div>

        {isPending && (
          <div className='flex items-center gap-2 flex-shrink-0'>
            <Button
              size='sm'
              variant='secondary'
              onClick={() => {
                setShowApproveForm(!showApproveForm);
                setShowRejectForm(false);
              }}
              className='text-success-600 border-success-300 hover:bg-success-50'>
              <Check className='h-4 w-4 mr-1' />
              Approuver
            </Button>
            <Button
              size='sm'
              variant='secondary'
              onClick={() => {
                setShowRejectForm(!showRejectForm);
                setShowApproveForm(false);
              }}
              className='text-error-600 border-error-300 hover:bg-error-50'>
              <X className='h-4 w-4 mr-1' />
              Rejeter
            </Button>
          </div>
        )}
      </div>

      {showApproveForm && isPending && (
        <div className='mt-3 pt-3 border-t border-gray-200 dark:border-gray-700'>
          <textarea
            value={approveComment}
            onChange={(e) => setApproveComment(e.target.value)}
            placeholder='Commentaire (optionnel)'
            className='w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm resize-none'
            rows={2}
          />
          <div className='flex justify-end gap-2 mt-2'>
            <Button
              size='sm'
              variant='secondary'
              onClick={() => setShowApproveForm(false)}>
              Annuler
            </Button>
            <Button
              size='sm'
              onClick={handleApprove}
              disabled={approveMutation.isPending}>
              Confirmer l'approbation
            </Button>
          </div>
        </div>
      )}

      {showRejectForm && isPending && (
        <div className='mt-3 pt-3 border-t border-gray-200 dark:border-gray-700'>
          <textarea
            value={rejectComment}
            onChange={(e) => setRejectComment(e.target.value)}
            placeholder='Motif du rejet (obligatoire)'
            className='w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm resize-none'
            rows={2}
            required
          />
          <div className='flex justify-end gap-2 mt-2'>
            <Button
              size='sm'
              variant='secondary'
              onClick={() => setShowRejectForm(false)}>
              Annuler
            </Button>
            <Button
              size='sm'
              variant='destructive'
              onClick={handleReject}
              disabled={!rejectComment.trim() || rejectMutation.isPending}>
              Confirmer le rejet
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
}
