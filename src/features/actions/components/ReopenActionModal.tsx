import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Modal, Button } from '@/components/ui';
import { actionsApi } from '../actionsApi';
import { showToast } from '@/lib/toast';
import { getApiErrorMessage } from '@/lib/api';
import { RotateCcw } from 'lucide-react';

interface ReopenActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  actionId: string;
  actionTitre: string;
}

export function ReopenActionModal({ isOpen, onClose, actionId, actionTitre }: ReopenActionModalProps) {
  const [justification, setJustification] = useState('');
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: () => actionsApi.reopenValidated(actionId, justification),
    onSuccess: () => {
      showToast.success('Action rouverte avec succès');
      queryClient.invalidateQueries({ queryKey: ['actions'] });
      queryClient.invalidateQueries({ queryKey: ['action', actionId] });
      onClose();
      setJustification('');
    },
    onError: (error) => {
      showToast.error(getApiErrorMessage(error));
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!justification.trim()) {
      showToast.error('La justification est obligatoire');
      return;
    }
    mutation.mutate();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Rouvrir l'action">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-center gap-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
          <RotateCcw className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
          <div>
            <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
              Réouverture de l'action validée
            </p>
            <p className="text-sm text-yellow-700 dark:text-yellow-300">
              "{actionTitre}"
            </p>
          </div>
        </div>

        <div>
          <label htmlFor="justification" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Justification <span className="text-red-500">*</span>
          </label>
          <textarea
            id="justification"
            value={justification}
            onChange={(e) => setJustification(e.target.value)}
            placeholder="Expliquez pourquoi cette action doit être rouverte..."
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 dark:bg-gray-800 dark:text-white resize-none"
            rows={4}
            required
          />
          <p className="mt-1 text-xs text-gray-500">
            Cette justification sera enregistrée dans l'historique de l'action.
          </p>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={mutation.isPending}
          >
            Annuler
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={mutation.isPending || !justification.trim()}
          >
            {mutation.isPending ? 'Réouverture...' : 'Rouvrir l\'action'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
