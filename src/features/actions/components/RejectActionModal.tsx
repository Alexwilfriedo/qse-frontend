import { useState } from 'react';

interface RejectActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReject: (motif: string) => void;
  actionTitre: string;
  isLoading?: boolean;
}

export function RejectActionModal({
  isOpen,
  onClose,
  onReject,
  actionTitre,
  isLoading,
}: RejectActionModalProps) {
  const [motif, setMotif] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleReject = () => {
    if (!motif.trim()) {
      setError('Le motif est obligatoire');
      return;
    }
    onReject(motif);
    setMotif('');
    setError('');
  };

  const handleClose = () => {
    setMotif('');
    setError('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="fixed inset-0 bg-black/50" onClick={handleClose} />
        
        <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md p-6">
          <h3 className="text-lg font-semibold text-red-600 mb-4">
            ❌ Refuser la validation
          </h3>

          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Vous êtes sur le point de refuser la validation de l'action :
          </p>

          <p className="text-sm font-medium text-gray-900 dark:text-white mb-4 p-3 bg-gray-100 dark:bg-gray-700 rounded">
            {actionTitre}
          </p>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Motif du refus <span className="text-red-500">*</span>
            </label>
            <textarea
              value={motif}
              onChange={(e) => {
                setMotif(e.target.value);
                setError('');
              }}
              placeholder="Expliquez pourquoi l'action n'est pas efficace..."
              className={`w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                error ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
              }`}
              rows={4}
            />
            {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
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
              onClick={handleReject}
              disabled={isLoading}
              className="px-4 py-2 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
            >
              {isLoading ? 'Refus...' : 'Refuser'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
