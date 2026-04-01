import {
  Badge,
  Button,
  Card,
  CardHeader,
  Select,
  Skeleton,
} from '@/components/ui';
import { useUserName, useUsers } from '@/features/admin/hooks/useUsers';
import { FileText, Plus, RotateCcw, Trash2 } from 'lucide-react';
import { useState } from 'react';
import {
  useCreatePaperDistribution,
  usePaperDistributions,
  useUpdatePaperDistributionStatus,
} from '../hooks/usePaperDistribution';
import type { PaperDistribution, PaperDistributionStatus } from '../types';
import { PAPER_STATUS_LABELS } from '../types';

interface PaperDistributionPanelProps {
  documentId: string;
  canManage: boolean;
}

const STATUS_BADGE_VARIANT: Record<
  PaperDistributionStatus,
  'success' | 'warning' | 'info' | 'error'
> = {
  DISTRIBUTED: 'info',
  RETURNED: 'success',
  REPLACED: 'warning',
  DESTROYED: 'error',
};

function RecipientName({ userId }: { userId: string }) {
  const name = useUserName(userId);
  return <span>{name}</span>;
}

/**
 * Panel de gestion des distributions papier d'un document (M2.6).
 * Affiche la liste des copies, permet d'en créer et de gérer les statuts.
 */
export function PaperDistributionPanel({
  documentId,
  canManage,
}: PaperDistributionPanelProps) {
  const { data: distributions = [], isLoading } =
    usePaperDistributions(documentId);
  const createMutation = useCreatePaperDistribution();
  const updateMutation = useUpdatePaperDistributionStatus(documentId);

  const [recipientId, setRecipientId] = useState('');
  const [showForm, setShowForm] = useState(false);

  const activeCount = distributions.filter(
    (d: PaperDistribution) => d.status === 'DISTRIBUTED',
  ).length;

  const handleCreate = () => {
    if (!recipientId.trim()) return;
    createMutation.mutate(
      { documentId, recipientId: recipientId.trim() },
      {
        onSuccess: () => {
          setRecipientId('');
          setShowForm(false);
        },
      },
    );
  };

  if (isLoading) {
    return (
      <Card>
        <div className='p-6 space-y-3'>
          <Skeleton className='h-5 w-48' />
          <Skeleton className='h-4 w-64' />
          <Skeleton className='h-16 w-full' />
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader
        title='Copies papier contrôlées'
        description={`${activeCount} copie(s) active(s) sur ${distributions.length} total`}
      />
      <div className='p-6 pt-0 space-y-4'>
        {/* Liste des distributions */}
        {distributions.length > 0 && (
          <div className='space-y-2'>
            {distributions.map((d: PaperDistribution) => (
              <div
                key={d.id}
                className='flex items-center justify-between border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-3'>
                <div className='space-y-1'>
                  <div className='flex items-center gap-2 text-sm'>
                    <FileText className='w-3.5 h-3.5 text-gray-400' />
                    <span className='font-medium text-gray-900 dark:text-white'>
                      Copie #{d.copyNumber}
                    </span>
                    <Badge variant={STATUS_BADGE_VARIANT[d.status]}>
                      {PAPER_STATUS_LABELS[d.status]}
                    </Badge>
                  </div>
                  <p className='text-xs text-gray-500'>
                    <RecipientName userId={d.recipientId} /> — v
                    {d.documentVersion}
                  </p>
                  <p className='text-xs text-gray-400 font-mono'>
                    {d.watermarkText}
                  </p>
                </div>

                {canManage && d.status === 'DISTRIBUTED' && (
                  <div className='flex gap-1'>
                    <Button
                      variant='secondary'
                      size='sm'
                      onClick={() =>
                        updateMutation.mutate({
                          distributionId: d.id,
                          action: 'RETURN',
                        })
                      }
                      disabled={updateMutation.isPending}
                      title='Retourner'>
                      <RotateCcw className='w-3.5 h-3.5' />
                    </Button>
                    <Button
                      variant='secondary'
                      size='sm'
                      onClick={() =>
                        updateMutation.mutate({
                          distributionId: d.id,
                          action: 'DESTROY',
                        })
                      }
                      disabled={updateMutation.isPending}
                      title='Détruire'>
                      <Trash2 className='w-3.5 h-3.5' />
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {distributions.length === 0 && (
          <p className='text-sm text-gray-500 text-center py-4'>
            Aucune distribution papier enregistrée
          </p>
        )}

        {/* Formulaire d'ajout */}
        {canManage && !showForm && (
          <Button variant='secondary' onClick={() => setShowForm(true)}>
            <Plus className='w-4 h-4 mr-2' />
            Nouvelle distribution
          </Button>
        )}

        {showForm && (
          <AddDistributionForm
            recipientId={recipientId}
            onRecipientChange={setRecipientId}
            onSubmit={handleCreate}
            onCancel={() => {
              setShowForm(false);
              setRecipientId('');
            }}
            isPending={createMutation.isPending}
          />
        )}
      </div>
    </Card>
  );
}

function AddDistributionForm({
  recipientId,
  onRecipientChange,
  onSubmit,
  onCancel,
  isPending,
}: {
  recipientId: string;
  onRecipientChange: (id: string) => void;
  onSubmit: () => void;
  onCancel: () => void;
  isPending: boolean;
}) {
  const { data: users } = useUsers();

  const userOptions =
    users?.map((u) => ({
      value: u.id,
      label: `${u.firstName} ${u.lastName}`,
      description: u.email,
    })) ?? [];

  return (
    <div className='space-y-3 border-t border-gray-200 dark:border-gray-700 pt-4'>
      <Select
        label='Destinataire'
        searchable
        placeholder='Rechercher un utilisateur...'
        options={userOptions}
        value={recipientId}
        onChange={(e) => onRecipientChange(e.target.value)}
      />
      <div className='flex gap-2'>
        <Button onClick={onSubmit} disabled={!recipientId || isPending}>
          {isPending ? 'Distribution...' : 'Distribuer'}
        </Button>
        <Button variant='secondary' onClick={onCancel}>
          Annuler
        </Button>
      </div>
    </div>
  );
}
