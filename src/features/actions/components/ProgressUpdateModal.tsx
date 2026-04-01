import { Button, Modal } from '@/components/ui';
import { useState } from 'react';

interface ProgressUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (avancement: number) => void;
  currentValue: number;
  actionTitre: string;
  isLoading?: boolean;
}

export function ProgressUpdateModal({
  isOpen,
  onClose,
  onSave,
  currentValue,
  actionTitre,
  isLoading = false,
}: ProgressUpdateModalProps) {
  const [avancement, setAvancement] = useState(currentValue);

  const handleSave = () => {
    onSave(avancement);
  };

  const handleClose = () => {
    setAvancement(currentValue);
    onClose();
  };

  const getProgressColor = (value: number) => {
    if (value >= 100) return 'bg-green-500';
    if (value >= 75) return 'bg-emerald-500';
    if (value >= 50) return 'bg-blue-500';
    if (value >= 25) return 'bg-yellow-500';
    return 'bg-gray-400';
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Modifier l'avancement">
      <div className='space-y-6'>
        <p className='text-sm text-gray-600 dark:text-gray-400'>
          Action :{' '}
          <span className='font-medium text-gray-900 dark:text-white'>
            {actionTitre}
          </span>
        </p>

        <div className='space-y-4'>
          <div className='flex items-center justify-between'>
            <span className='text-sm font-medium text-gray-700 dark:text-gray-300'>
              Avancement
            </span>
            <span className='text-lg font-semibold text-gray-900 dark:text-white'>
              {avancement}%
            </span>
          </div>

          <div className='relative'>
            <div className='h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden'>
              <div
                className={`h-full ${getProgressColor(avancement)} transition-all duration-300`}
                style={{ width: `${avancement}%` }}
              />
            </div>
            <input
              type='range'
              min='0'
              max='100'
              step='5'
              value={avancement}
              onChange={(e) => setAvancement(Number(e.target.value))}
              className='absolute inset-0 w-full h-full opacity-0 cursor-pointer'
            />
          </div>

          <div className='flex justify-between text-xs text-gray-500'>
            <span>0%</span>
            <span>25%</span>
            <span>50%</span>
            <span>75%</span>
            <span>100%</span>
          </div>

          <div className='flex gap-2 flex-wrap'>
            {[0, 25, 50, 75, 100].map((value) => (
              <button
                key={value}
                onClick={() => setAvancement(value)}
                className={`px-3 py-1.5 text-sm rounded-lg border transition-colors ${
                  avancement === value
                    ? 'bg-brand-100 border-brand-500 text-brand-700 dark:bg-brand-900/30 dark:border-brand-400 dark:text-brand-300'
                    : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-700'
                }`}>
                {value}%
              </button>
            ))}
          </div>
        </div>

        {avancement === 100 && (
          <div className='p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg'>
            <p className='text-sm text-green-700 dark:text-green-300'>
              L'action sera marquée comme <strong>Terminée</strong> et soumise à
              validation.
            </p>
          </div>
        )}

        <div className='flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700'>
          <Button
            variant='secondary'
            onClick={handleClose}
            disabled={isLoading}>
            Annuler
          </Button>
          <Button
            variant='primary'
            onClick={handleSave}
            disabled={isLoading || avancement === currentValue}>
            {isLoading ? 'Enregistrement...' : 'Enregistrer'}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
