import { Button, Modal } from '@/components/ui';
import { useState } from 'react';

interface RejectDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (motif: string) => void;
  isPending: boolean;
}

/**
 * Modal de rejet d'un document avec saisie obligatoire du motif.
 */
export function RejectDocumentModal({
  isOpen,
  onClose,
  onConfirm,
  isPending,
}: RejectDocumentModalProps) {
  const [motif, setMotif] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!motif.trim()) return;
    onConfirm(motif.trim());
    setMotif('');
  };

  const handleClose = () => {
    setMotif('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title='Rejeter le document'>
      <form onSubmit={handleSubmit} className='space-y-4'>
        <p className='text-sm text-gray-600 dark:text-gray-400'>
          Veuillez indiquer le motif de rejet. Le pilote du document sera notifié.
        </p>

        <div>
          <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
            Motif de rejet *
          </label>
          <textarea
            value={motif}
            onChange={(e) => setMotif(e.target.value)}
            placeholder='Décrivez les raisons du rejet...'
            rows={4}
            required
            className='w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500'
          />
        </div>

        <div className='flex justify-end gap-3 pt-2'>
          <Button type='button' variant='secondary' onClick={handleClose}>
            Annuler
          </Button>
          <Button
            type='submit'
            variant='destructive'
            disabled={isPending || !motif.trim()}>
            {isPending ? 'Rejet en cours...' : 'Confirmer le rejet'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
