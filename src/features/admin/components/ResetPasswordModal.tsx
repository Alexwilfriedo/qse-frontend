import { Button, Modal } from '@/components/ui';
import { Copy } from 'lucide-react';

interface ResetPasswordModalProps {
  isOpen: boolean;
  userName: string;
  temporaryCode: string | null;
  isLoading: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function ResetPasswordModal({
  isOpen,
  userName,
  temporaryCode,
  isLoading,
  onClose,
  onConfirm,
}: ResetPasswordModalProps) {
  const handleCopy = () => {
    if (temporaryCode) {
      navigator.clipboard.writeText(temporaryCode);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Réinitialiser le mot de passe">
      {temporaryCode ? (
        <div className='space-y-4'>
          <p className='text-sm text-gray-600 dark:text-gray-400'>
            Le mot de passe de <strong>{userName}</strong> a été réinitialisé.
            Communiquez ce code temporaire :
          </p>
          <div className='flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg'>
            <code className='flex-1 text-lg font-mono font-bold text-brand-600 dark:text-brand-400 tracking-widest text-center'>
              {temporaryCode}
            </code>
            <Button variant='ghost' size='sm' onClick={handleCopy} title='Copier'>
              <Copy className='w-4 h-4' />
            </Button>
          </div>
          <p className='text-xs text-gray-500 dark:text-gray-400'>
            L'utilisateur devra changer ce mot de passe à sa prochaine connexion.
          </p>
          <div className='flex justify-end pt-2'>
            <Button onClick={onClose}>Fermer</Button>
          </div>
        </div>
      ) : (
        <div className='space-y-4'>
          <p className='text-sm text-gray-600 dark:text-gray-400'>
            Voulez-vous réinitialiser le mot de passe de{' '}
            <strong>{userName}</strong> ? Un code temporaire sera généré.
          </p>
          <div className='flex justify-end gap-3 pt-2'>
            <Button variant='secondary' onClick={onClose}>
              Annuler
            </Button>
            <Button variant='destructive' onClick={onConfirm} disabled={isLoading}>
              {isLoading ? 'Réinitialisation...' : 'Réinitialiser'}
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
}
