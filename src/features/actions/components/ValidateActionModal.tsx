import { useState } from 'react';

interface ValidateActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onValidate: (commentaire?: string) => void;
  actionTitre: string;
  isLoading?: boolean;
}

export function ValidateActionModal({
  isOpen,
  onClose,
  onValidate,
  actionTitre,
  isLoading,
}: ValidateActionModalProps) {
  const [commentaire, setCommentaire] = useState('');

  if (!isOpen) return null;

  const handleValidate = () => {
    onValidate(commentaire || undefined);
    setCommentaire('');
  };

  const handleClose = () => {
    setCommentaire('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="fixed inset-0 bg-black/50" onClick={handleClose} />
        
        <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            ✅ Valider l'efficacité
          </h3>

          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Vous êtes sur le point de valider l'efficacité de l'action :
          </p>

          <p className="text-sm font-medium text-gray-900 dark:text-white mb-4 p-3 bg-gray-100 dark:bg-gray-700 rounded">
            {actionTitre}
          </p>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Commentaire (optionnel)
            </label>
            <textarea
              value={commentaire}
              onChange={(e) => setCommentaire(e.target.value)}
              placeholder="Ajoutez un commentaire sur la validation..."
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-3">
            <button
              onClick={handleClose}
              disabled={isLoading}
              className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
            >
              Annuler
            </button>
            <button
              onClick={handleValidate}
              disabled={isLoading}
              className="px-4 py-2 text-sm bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
            >
              {isLoading ? 'Validation...' : 'Valider'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
