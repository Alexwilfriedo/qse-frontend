import { Button, Input, Modal } from '@/components/ui';
import { useState } from 'react';
import type { User } from '../adminApi';

interface EditUserModalProps {
  user: User;
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: {
    firstName: string;
    lastName: string;
    email: string;
  }) => void;
  isLoading: boolean;
}

export function EditUserModal({
  user,
  isOpen,
  onClose,
  onSave,
  isLoading,
}: EditUserModalProps) {
  const [firstName, setFirstName] = useState(user.firstName);
  const [lastName, setLastName] = useState(user.lastName);
  const [email, setEmail] = useState(user.email);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ firstName, lastName, email });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Modifier l'utilisateur">
      <form onSubmit={handleSubmit} className='space-y-4'>
        <Input
          label='Prénom'
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
        />
        <Input
          label='Nom'
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          required
        />
        <Input
          label='Email'
          type='email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <div className='flex justify-end gap-3 pt-2'>
          <Button variant='secondary' onClick={onClose} type='button'>
            Annuler
          </Button>
          <Button type='submit' disabled={isLoading}>
            {isLoading ? 'Enregistrement...' : 'Enregistrer'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
