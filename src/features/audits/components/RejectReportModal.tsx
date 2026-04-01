import { Button, Label, Modal, Textarea } from '@/components/ui';
import { useState } from 'react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onReject: (commentaire: string) => void;
  isPending: boolean;
}

export function RejectReportModal({ isOpen, onClose, onReject, isPending }: Props) {
  const [commentaire, setCommentaire] = useState('');

  const handleSubmit = () => {
    if (!commentaire.trim()) return;
    onReject(commentaire.trim());
  };

  const handleClose = () => {
    setCommentaire('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title='Demander une correction'>
      <div className='space-y-4'>
        <div>
          <Label>Commentaire de rejet *</Label>
          <Textarea
            value={commentaire}
            onChange={(e) => setCommentaire(e.target.value)}
            placeholder='Précisez les corrections attendues...'
            rows={4}
          />
        </div>

        <div className='flex justify-end gap-2 pt-2'>
          <Button variant='secondary' onClick={handleClose}>
            Annuler
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!commentaire.trim() || isPending}
          >
            {isPending ? 'Envoi...' : 'Demander une correction'}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
