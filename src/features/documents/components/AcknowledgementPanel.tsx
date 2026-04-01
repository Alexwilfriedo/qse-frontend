import { Badge, Button, Card, CardHeader, Modal, SkeletonText } from '@/components/ui';
import { useUsers, useUserName } from '@/features/admin/hooks/useUsers';
import { useAuthStore } from '@/features/auth/authStore';
import { BookOpen, CheckCircle, Clock, Send, UserPlus } from 'lucide-react';
import { useState } from 'react';
import {
  useAcknowledgeDocument,
  useAcknowledgementStats,
  useAcknowledgements,
  useRequestAcknowledgements,
} from '../hooks';
import type { Acknowledgement } from '../types';

interface AcknowledgementPanelProps {
  documentId: string;
  canManage: boolean;
}

export function AcknowledgementPanel({
  documentId,
  canManage,
}: AcknowledgementPanelProps) {
  const { data: stats, isLoading: statsLoading } =
    useAcknowledgementStats(documentId);
  const { data: acks, isLoading: acksLoading } =
    useAcknowledgements(documentId);
  const acknowledgeDoc = useAcknowledgeDocument();
  const [isRequestOpen, setIsRequestOpen] = useState(false);
  const currentUserId = useAuthStore((state) => state.user?.id);
  const pendingAckForCurrentUser = (acks ?? []).find(
    (ack) => ack.userId === currentUserId && !ack.acknowledgedAt,
  );

  return (
    <Card>
      <CardHeader
        title='Accusés de lecture'
        action={
          canManage ? (
            <Button
              variant='secondary'
              size='sm'
              onClick={() => setIsRequestOpen(true)}>
              <UserPlus className='w-4 h-4 mr-1' />
              Demander
            </Button>
          ) : undefined
        }
      />
      <div className='p-6 space-y-6'>
        {/* Stats */}
        {statsLoading ? (
          <SkeletonText className='h-16 w-full' />
        ) : stats ? (
          <StatsBar stats={stats} />
        ) : null}

        {/* Bouton "J'ai lu" pour l'utilisateur courant */}
        {pendingAckForCurrentUser ? (
          <div className='flex justify-center'>
            <Button
              size='sm'
              onClick={() => acknowledgeDoc.mutate(documentId)}
              disabled={acknowledgeDoc.isPending}>
              <BookOpen className='w-4 h-4 mr-1' />
              {acknowledgeDoc.isPending
                ? 'Confirmation...'
                : "J'ai lu ce document"}
            </Button>
          </div>
        ) : null}

        {/* Liste des accusés */}
        {acksLoading ? (
          <div className='space-y-2'>
            <SkeletonText className='h-10 w-full' />
            <SkeletonText className='h-10 w-full' />
          </div>
        ) : acks && acks.length > 0 ? (
          <div className='space-y-2'>
            <h4 className='text-sm font-medium text-gray-700 dark:text-gray-300'>
              Suivi ({acks.length})
            </h4>
            {acks.map((ack) => (
              <AckRow key={ack.id} ack={ack} />
            ))}
          </div>
        ) : (
          <p className='text-sm text-gray-500 text-center py-4'>
            Aucun accusé de lecture demandé.
          </p>
        )}
      </div>

      {canManage && (
        <RequestAcknowledgementsModal
          isOpen={isRequestOpen}
          onClose={() => setIsRequestOpen(false)}
          documentId={documentId}
          existingUserIds={(acks ?? []).map((a) => a.userId)}
        />
      )}
    </Card>
  );
}

function StatsBar({
  stats,
}: {
  stats: {
    total: number;
    acknowledged: number;
    pending: number;
    acknowledgedRate: number;
  };
}) {
  const pct = stats.total > 0 ? (stats.acknowledged / stats.total) * 100 : 0;

  return (
    <div className='space-y-3'>
      <div className='flex items-center justify-between text-sm'>
        <span className='font-medium text-gray-700 dark:text-gray-300'>
          {stats.acknowledged} / {stats.total} lectures confirmées
        </span>
        <Badge variant={stats.pending === 0 ? 'success' : 'warning'}>
          {stats.pending === 0
            ? 'Tous lus'
            : `${stats.pending} en attente`}
        </Badge>
      </div>
      <div className='w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5'>
        <div
          className={`h-2.5 rounded-full transition-all ${
            stats.pending === 0 ? 'bg-green-500' : 'bg-blue-500'
          }`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className='text-xs text-gray-500 dark:text-gray-400'>
        Taux de lecture : {stats.acknowledgedRate}%
      </p>
    </div>
  );
}

function AckRow({ ack }: { ack: Acknowledgement }) {
  const userName = useUserName(ack.userId);
  const isPending = !ack.acknowledgedAt;

  const date = isPending
    ? new Date(ack.createdAt).toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'short',
      })
    : new Date(ack.acknowledgedAt!).toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
      });

  return (
    <div className='flex items-center gap-3 p-3 rounded-lg border border-gray-100 dark:border-gray-700'>
      {isPending ? (
        <Clock className='w-4 h-4 text-amber-500' />
      ) : (
        <CheckCircle className='w-4 h-4 text-green-500' />
      )}
      <span className='flex-1 text-sm font-medium text-gray-900 dark:text-white'>
        {userName}
      </span>
      <Badge variant={isPending ? 'warning' : 'success'} className='text-xs'>
        {isPending ? 'En attente' : 'Lu'}
      </Badge>
      <span className='text-xs text-gray-400'>
        {isPending ? `Demandé le ${date}` : date}
      </span>
    </div>
  );
}

function RequestAcknowledgementsModal({
  isOpen,
  onClose,
  documentId,
  existingUserIds,
}: {
  isOpen: boolean;
  onClose: () => void;
  documentId: string;
  existingUserIds: string[];
}) {
  const { data: users } = useUsers();
  const requestAcks = useRequestAcknowledgements();
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const availableUsers = (users ?? []).filter(
    (u) => !existingUserIds.includes(u.id),
  );

  const handleToggle = (userId: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(userId)) next.delete(userId);
      else next.add(userId);
      return next;
    });
  };

  const handleSubmit = () => {
    if (selected.size === 0) return;
    requestAcks.mutate(
      { id: documentId, userIds: Array.from(selected) },
      {
        onSuccess: () => {
          setSelected(new Set());
          onClose();
        },
      },
    );
  };

  const handleClose = () => {
    setSelected(new Set());
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title='Demander un accusé de lecture'>
      <div className='space-y-4'>
        {availableUsers.length === 0 ? (
          <p className='text-sm text-gray-500 text-center py-4'>
            Tous les utilisateurs ont déjà un accusé de lecture demandé.
          </p>
        ) : (
          <div className='max-h-64 overflow-y-auto space-y-1'>
            {availableUsers.map((user) => (
              <label
                key={user.id}
                className='flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer'>
                <input
                  type='checkbox'
                  checked={selected.has(user.id)}
                  onChange={() => handleToggle(user.id)}
                  className='h-4 w-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500'
                />
                <span className='text-sm text-gray-900 dark:text-white'>
                  {user.firstName} {user.lastName}
                </span>
                <span className='text-xs text-gray-400'>{user.email}</span>
              </label>
            ))}
          </div>
        )}

        <div className='flex justify-end gap-3 pt-2'>
          <Button variant='secondary' type='button' onClick={handleClose}>
            Annuler
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={selected.size === 0 || requestAcks.isPending}>
            <Send className='w-4 h-4 mr-1' />
            {requestAcks.isPending
              ? 'Envoi...'
              : `Envoyer (${selected.size})`}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
