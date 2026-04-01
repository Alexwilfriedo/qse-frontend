import { Button, Modal } from '@/components/ui';
import { useDeleteEntity } from '../hooks';
import type { EntityTreeNode } from '../types';

interface DeleteEntityModalProps {
  isOpen: boolean;
  onClose: () => void;
  entity: EntityTreeNode | null;
}

export function DeleteEntityModal({ isOpen, onClose, entity }: DeleteEntityModalProps) {
  const deleteEntity = useDeleteEntity();

  const handleDelete = () => {
    if (!entity) return;
    deleteEntity.mutate(entity.id, {
      onSuccess: () => onClose(),
    });
  };

  const hasChildren = (entity?.children.length ?? 0) > 0;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Supprimer l'entité">
      <div className="space-y-4">
        <p className="text-gray-600 dark:text-gray-400">
          Voulez-vous vraiment supprimer <strong>{entity?.nom}</strong> ?
        </p>
        {hasChildren && (
          <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-sm text-red-700 dark:text-red-400">
              Cette entité contient {entity?.children.length} sous-entité(s) qui seront aussi supprimées.
            </p>
          </div>
        )}
        <div className="flex justify-end gap-3 pt-2">
          <Button variant="secondary" onClick={onClose}>
            Annuler
          </Button>
          <Button variant="destructive" onClick={handleDelete} disabled={deleteEntity.isPending}>
            {deleteEntity.isPending ? 'Suppression...' : 'Supprimer'}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
