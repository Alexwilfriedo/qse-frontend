import { Modal, Button } from '@/components/ui';
import { useDeleteDocument } from '../hooks';
import type { Document } from '../types';

interface DeleteDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  document: Document | null;
}

export function DeleteDocumentModal({ isOpen, onClose, document }: DeleteDocumentModalProps) {
  const deleteDocument = useDeleteDocument();

  const handleDelete = async () => {
    if (!document) return;

    try {
      await deleteDocument.mutateAsync(document.id);
      onClose();
    } catch {
      // Error handled by mutation
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Supprimer le document">
      <div className="space-y-4">
        <p className="text-gray-600 dark:text-gray-400">
          Êtes-vous sûr de vouloir supprimer le document{' '}
          <span className="font-medium text-gray-900 dark:text-white">
            {document?.titre}
          </span>{' '}
          ?
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Cette action peut être annulée par un administrateur.
        </p>

        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="secondary" onClick={onClose}>
            Annuler
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={deleteDocument.isPending}
          >
            {deleteDocument.isPending ? 'Suppression...' : 'Supprimer'}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
