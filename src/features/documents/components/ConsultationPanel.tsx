import { Badge, Button, Card, CardHeader, SkeletonText } from '@/components/ui';
import { useUserName } from '@/features/admin/hooks/useUsers';
import { CheckCircle, MessageSquare, ThumbsDown, ThumbsUp, XCircle } from 'lucide-react';
import { useState } from 'react';
import {
  useCastVote,
  useConsultationStatus,
  useConsultationVotes,
} from '../hooks';
import type { ConsultationVote } from '../types';

interface ConsultationPanelProps {
  documentId: string;
}

export function ConsultationPanel({ documentId }: ConsultationPanelProps) {
  const { data: status, isLoading: statusLoading } =
    useConsultationStatus(documentId);
  const { data: votes, isLoading: votesLoading } =
    useConsultationVotes(documentId);

  return (
    <Card>
      <CardHeader title='Consultation ISO' />
      <div className='p-6 space-y-6'>
        {/* Barre de quorum */}
        {statusLoading ? (
          <SkeletonText className='h-16 w-full' />
        ) : status ? (
          <QuorumBar status={status} />
        ) : null}

        {/* Formulaire de vote */}
        <VoteForm documentId={documentId} />

        {/* Liste des votes */}
        {votesLoading ? (
          <div className='space-y-2'>
            <SkeletonText className='h-12 w-full' />
            <SkeletonText className='h-12 w-full' />
          </div>
        ) : votes && votes.length > 0 ? (
          <div className='space-y-2'>
            <h4 className='text-sm font-medium text-gray-700 dark:text-gray-300'>
              Votes ({votes.length})
            </h4>
            {votes.map((vote) => (
              <VoteRow key={vote.id} vote={vote} />
            ))}
          </div>
        ) : (
          <p className='text-sm text-gray-500 text-center py-4'>
            Aucun vote pour le moment.
          </p>
        )}
      </div>
    </Card>
  );
}

function QuorumBar({
  status,
}: {
  status: {
    quorumRequired: number;
    totalVotes: number;
    approvedVotes: number;
    unresolvedComments: number;
    quorumReached: boolean;
    allCommentsResolved: boolean;
    canProgress: boolean;
  };
}) {
  const progressPct =
    status.quorumRequired > 0
      ? Math.min(100, (status.approvedVotes / status.quorumRequired) * 100)
      : 0;

  return (
    <div className='space-y-3'>
      <div className='flex items-center justify-between text-sm'>
        <span className='font-medium text-gray-700 dark:text-gray-300'>
          Quorum : {status.approvedVotes} / {status.quorumRequired} approbations
        </span>
        <div className='flex gap-2'>
          <Badge variant={status.quorumReached ? 'success' : 'warning'}>
            {status.quorumReached ? 'Quorum atteint' : 'Quorum non atteint'}
          </Badge>
          {status.unresolvedComments > 0 && (
            <Badge variant='error'>
              {status.unresolvedComments} commentaire
              {status.unresolvedComments > 1 ? 's' : ''} non résolu
              {status.unresolvedComments > 1 ? 's' : ''}
            </Badge>
          )}
        </div>
      </div>

      <div className='w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5'>
        <div
          className={`h-2.5 rounded-full transition-all ${
            status.quorumReached ? 'bg-green-500' : 'bg-amber-500'
          }`}
          style={{ width: `${progressPct}%` }}
        />
      </div>

      <div className='flex gap-4 text-xs text-gray-500 dark:text-gray-400'>
        <span>{status.totalVotes} vote{status.totalVotes !== 1 ? 's' : ''} total</span>
        <span>{status.approvedVotes} approuvé{status.approvedVotes !== 1 ? 's' : ''}</span>
        <span>
          {status.totalVotes - status.approvedVotes} rejeté
          {status.totalVotes - status.approvedVotes !== 1 ? 's' : ''}
        </span>
      </div>

      {status.canProgress && (
        <div className='flex items-center gap-2 text-sm text-green-600 dark:text-green-400 font-medium'>
          <CheckCircle className='w-4 h-4' />
          La consultation peut progresser vers l'approbation.
        </div>
      )}
    </div>
  );
}

function VoteForm({ documentId }: { documentId: string }) {
  const [comment, setComment] = useState('');
  const castVote = useCastVote();

  const handleVote = (approved: boolean) => {
    castVote.mutate(
      {
        id: documentId,
        data: { approved, comment: comment.trim() || undefined },
      },
      { onSuccess: () => setComment('') },
    );
  };

  return (
    <div className='rounded-lg border border-gray-200 dark:border-gray-700 p-4 space-y-3'>
      <h4 className='text-sm font-medium text-gray-700 dark:text-gray-300'>
        Donner votre avis
      </h4>
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder='Commentaire (optionnel)'
        rows={2}
        className='w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 focus:border-brand-500 focus:ring-1 focus:ring-brand-500'
      />
      <div className='flex gap-2'>
        <Button
          size='sm'
          onClick={() => handleVote(true)}
          disabled={castVote.isPending}>
          <ThumbsUp className='w-4 h-4 mr-1' />
          Approuver
        </Button>
        <Button
          size='sm'
          variant='secondary'
          onClick={() => handleVote(false)}
          disabled={castVote.isPending}>
          <ThumbsDown className='w-4 h-4 mr-1' />
          Rejeter
        </Button>
      </div>
    </div>
  );
}

function VoteRow({ vote }: { vote: ConsultationVote }) {
  const userName = useUserName(vote.userId);
  const date = new Date(vote.votedAt).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className='flex items-start gap-3 p-3 rounded-lg border border-gray-100 dark:border-gray-700'>
      <div className='mt-0.5'>
        {vote.approved ? (
          <CheckCircle className='w-5 h-5 text-green-500' />
        ) : (
          <XCircle className='w-5 h-5 text-red-500' />
        )}
      </div>
      <div className='flex-1 min-w-0'>
        <div className='flex items-center gap-2'>
          <span className='text-sm font-medium text-gray-900 dark:text-white'>
            {userName}
          </span>
          <Badge variant={vote.approved ? 'success' : 'error'} className='text-xs'>
            {vote.approved ? 'Approuvé' : 'Rejeté'}
          </Badge>
          <span className='text-xs text-gray-400'>{date}</span>
        </div>
        {vote.comment && (
          <div className='flex items-start gap-1 mt-1'>
            <MessageSquare className='w-3 h-3 text-gray-400 mt-0.5 flex-shrink-0' />
            <p className='text-sm text-gray-600 dark:text-gray-400'>
              {vote.comment}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
