import { Button, Modal } from '@/components/ui';
import { useState } from 'react';

interface StatusToggleModalProps {
  isOpen: boolean;
  userName: string;
  currentStatus: 'active' | 'inactive';
  onClose: () => void;
  onConfirm: (reason: string) => void;
  isLoading?: boolean;
}

export function StatusToggleModal({
  isOpen,
  userName,
  currentStatus,
  onClose,
  onConfirm,
  isLoading = false,
}: StatusToggleModalProps) {
  const [reason, setReason] = useState('');

  const isDeactivating = currentStatus === 'active';
  const action = isDeactivating ? 'Désactiver' : 'Activer';
  const title = `${action} l'utilisateur`;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm(reason);
    setReason('');
  };

  const handleClose = () => {
    setReason('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={title}>
      <form onSubmit={handleSubmit} className='space-y-4'>
        <p className='text-sm text-gray-600 dark:text-gray-400'>
          Vous êtes sur le point de{' '}
          <span className='font-medium'>
            {isDeactivating ? 'désactiver' : 'activer'}
          </span>{' '}
          l'utilisateur <span className='font-medium'>{userName}</span>.
        </p>

        <div>
          <label
            htmlFor='reason'
            className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
            Motif {isDeactivating && <span className='text-error-500'>*</span>}
          </label>
          <textarea
            id='reason'
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            required={isDeactivating}
            rows={3}
            placeholder={
              isDeactivating
                ? 'Indiquez la raison de la désactivation...'
                : 'Motif de réactivation (optionnel)...'
            }
            className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-brand-500 focus:border-transparent'
          />
        </div>

        <div className='flex justify-end gap-3 pt-2'>
          <Button type='button' variant='ghost' onClick={handleClose}>
            Annuler
          </Button>
          <Button
            type='submit'
            variant={isDeactivating ? 'destructive' : 'primary'}
            isLoading={isLoading}
            disabled={isDeactivating && !reason.trim()}>
            {action}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
