import { Button, Modal } from '@/components/ui';
import { useDeleteFournisseur } from '../hooks';
import type { Fournisseur } from '../types';

interface DeleteFournisseurModalProps {
  isOpen: boolean;
  onClose: () => void;
  fournisseur: Fournisseur | null;
}

export function DeleteFournisseurModal({ isOpen, onClose, fournisseur }: DeleteFournisseurModalProps) {
  const deleteFournisseur = useDeleteFournisseur();

  const handleDelete = async () => {
    if (!fournisseur) return;
    try {
      await deleteFournisseur.mutateAsync(fournisseur.id);
      onClose();
    } catch {
      // Error handled by mutation
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title='Supprimer le fournisseur'>
      <div className='space-y-4'>
        <p className='text-gray-600 dark:text-gray-400'>
          Êtes-vous sûr de vouloir supprimer le fournisseur{' '}
          <span className='font-medium text-gray-900 dark:text-white'>
            {fournisseur?.raisonSociale}
          </span>{' '}
          ?
        </p>
        <p className='text-sm text-gray-500 dark:text-gray-400'>
          Cette action peut être annulée par un administrateur.
        </p>

        <div className='flex justify-end gap-3 pt-4'>
          <Button type='button' variant='secondary' onClick={onClose}>
            Annuler
          </Button>
          <Button
            type='button'
            variant='destructive'
            onClick={handleDelete}
            disabled={deleteFournisseur.isPending}>
            {deleteFournisseur.isPending ? 'Suppression...' : 'Supprimer'}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
